/*
唯品会 Cookie/参数更新脚本
1. 请求阶段：监听 signIn/info 与 signIn/exec，更新已保存的 Cookie、模板参数和请求头
2. 定时阶段：不伪造独立刷新接口，只做有效性校验，并在服务端返回 Set-Cookie 时顺带合并保存

持久化键：
- WPH_SIGN_STATE
- WPH_SIGN_LAST_CAPTURE
- WPH_SIGN_LAST_VALIDATE
*/

const APP_NAME = 'WPH刷新Cookie';
const STORE_KEY = 'WPH_SIGN_STATE';
const STORE_CAPTURE_KEY = 'WPH_SIGN_LAST_CAPTURE';
const STORE_VALIDATE_KEY = 'WPH_SIGN_LAST_VALIDATE';
const API_HOST = 'https://act-ug.vip.com';
const INFO_PATH = '/signIn/info';
const EXEC_PATH = '/signIn/exec';
const API_SECRET_MAP = {
  '8cec5243ade04ed3a02c5972bcda0d3f': 'd97f3d38280d4c64a55c48a8f589907a'
};

function Env(name) {
  this.name = name;
  this.isQX = typeof $task !== 'undefined';
  this.isLoon = typeof $loon !== 'undefined';
  this.isSurge = typeof $httpClient !== 'undefined' && !this.isLoon;
}

Env.prototype.read = function (key) {
  if (this.isQX) return $prefs.valueForKey(key);
  return $persistentStore.read(key);
};

Env.prototype.write = function (value, key) {
  if (this.isQX) return $prefs.setValueForKey(String(value), key);
  return $persistentStore.write(String(value), key);
};

Env.prototype.msg = function (title, subtitle, body) {
  if (this.isQX) {
    $notify(title, subtitle, body);
    return;
  }
  $notification.post(title, subtitle, body);
};

Env.prototype.log = function (text) {
  console.log(String(text));
};

Env.prototype.done = function (value) {
  $done(value);
};

Env.prototype.request = function (options) {
  if (this.isQX) {
    return $task.fetch(options).then((resp) => ({
      status: resp.statusCode || resp.status,
      headers: resp.headers || {},
      body: resp.body || ''
    }));
  }

  return new Promise((resolve, reject) => {
    const method = String((options.method || 'GET')).toLowerCase();
    $httpClient[method](options, (error, response, body) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({
        status: response.status || response.statusCode || 0,
        headers: response.headers || {},
        body: body || ''
      });
    });
  });
};

const $ = new Env(APP_NAME);

!(async () => {
  if (typeof $request !== 'undefined') {
    await refreshByCapture();
  } else {
    await validateCookie();
  }
})()
  .catch((err) => {
    $.log(`异常: ${formatError(err)}`);
    $.msg(APP_NAME, '执行异常', formatError(err));
  })
  .finally(() => $.done({}));

async function refreshByCapture() {
  const url = ($request && $request.url) || '';
  const path = getPath(url);
  if (!/\/signIn\/(info|exec)$/.test(path)) return;

  const requestHeaders = lowerCaseHeaders(($request.headers || {}));
  const state = getState();
  const body = parseForm(($request.body || '').trim());
  const query = parseQuery(url);
  const now = isoNow();

  state.cookie = requestHeaders.cookie || state.cookie || '';
  state.headers = {
    'User-Agent': requestHeaders['user-agent'] || getStoredHeader(state, 'User-Agent'),
    'Content-Type':
      requestHeaders['content-type'] ||
      getStoredHeader(state, 'Content-Type') ||
      'application/x-www-form-urlencoded; charset=UTF-8',
    Origin: requestHeaders.origin || getStoredHeader(state, 'Origin') || 'https://mst.vip.com',
    Referer: requestHeaders.referer || getStoredHeader(state, 'Referer') || 'https://mst.vip.com/'
  };
  state.query = Object.assign({}, state.query || {}, query);

  if (path === INFO_PATH) {
    state.infoBody = body;
  }

  if (path === EXEC_PATH) {
    state.execBody = body;
    if (body.actId) state.actId = body.actId;
  }

  state.updatedAt = now;
  saveState(state);
  $.write(now, STORE_CAPTURE_KEY);

  $.log(`已更新 Cookie 与模板: ${path}`);
  $.msg(APP_NAME, '刷新成功', `已更新 ${path === INFO_PATH ? 'info' : 'exec'} 请求参数`);
}

async function validateCookie() {
  const state = getState();
  if (!state.cookie) {
    $.msg(APP_NAME, '缺少 Cookie', '请先打开签到页，让刷新脚本拦截一次请求');
    return;
  }

  const infoBody = buildInfoBody(state);
  if (!infoBody) {
    $.msg(APP_NAME, '缺少 info 模板', '请先打开签到页，让 signIn/info 请求经过脚本');
    return;
  }

  const url = buildApiUrl(INFO_PATH, state.query, infoBody);
  const response = await postSigned(url, infoBody, state);
  $.write(isoNow(), STORE_VALIDATE_KEY);

  if (!response.ok) {
    $.msg(APP_NAME, '校验失败', response.message);
    return;
  }

  const json = response.json || {};
  if (Number(json.code) !== 1) {
    $.msg(APP_NAME, 'Cookie 可能失效', json.msg || `code=${json.code || 'unknown'}`);
    return;
  }

  const basicInfo = ((json || {}).data || {}).basicInfo || {};
  if (basicInfo.actId && basicInfo.actId !== state.actId) {
    state.actId = basicInfo.actId;
    saveState(state);
  }

  $.msg(APP_NAME, 'Cookie 仍有效');
}

function buildInfoBody(state) {
  if (state.infoBody && Object.keys(state.infoBody).length) {
    return clone(state.infoBody);
  }
  if (state.execBody && Object.keys(state.execBody).length) {
    const body = clone(state.execBody);
    delete body.actId;
    if (!body.sceneCode) body.sceneCode = '0';
    return body;
  }
  return null;
}

async function postSigned(url, bodyObj, state) {
  const apiKey = bodyObj.api_key || (state.query || {}).api_key;
  const secret = API_SECRET_MAP[apiKey];
  if (!secret) {
    return { ok: false, message: `未知 api_key: ${apiKey || 'empty'}` };
  }

  const authorization = getApiSign(url.split('?')[0], bodyObj, state.cookie || '', secret);
  const response = await $.request({
    url,
    method: 'POST',
    headers: {
      'Content-Type': getStoredHeader(state, 'Content-Type') || 'application/x-www-form-urlencoded; charset=UTF-8',
      Origin: getStoredHeader(state, 'Origin') || 'https://mst.vip.com',
      Referer: getStoredHeader(state, 'Referer') || 'https://mst.vip.com/',
      'User-Agent': getStoredHeader(state, 'User-Agent') || '',
      Cookie: state.cookie || '',
      Authorization: authorization
    },
    body: toForm(bodyObj)
  });

  const mergedCookie = mergeCookie(state.cookie, response.headers || {});
  if (mergedCookie && mergedCookie !== state.cookie) {
    state.cookie = mergedCookie;
    state.updatedAt = isoNow();
    saveState(state);
    $.log('检测到响应 Set-Cookie，已更新本地 Cookie');
  }

  const text = response.body || '';
  let json = null;
  try {
    json = JSON.parse(text);
  } catch (e) {
    return {
      ok: false,
      message: `响应不是 JSON: ${trimText(text, 160)}`
    };
  }

  return {
    ok: response.status === 200,
    status: response.status,
    json,
    headers: response.headers || {},
    message: response.status === 200 ? '' : `HTTP ${response.status}: ${trimText(text, 160)}`
  };
}

function buildApiUrl(path, storedQuery, body) {
  const query = Object.assign(
    {
      api_key: body.api_key || '',
      time: body.time || '0',
      is_front: body.is_front || '1',
      fdc_area_id: body.fdc_area_id || ''
    },
    storedQuery || {}
  );
  return `${API_HOST}${path}?${toQuery(query)}`;
}

function getApiSign(url, params, cookie, secret) {
  const apiPath = url
    .replace(/^http:\/\/[^/]+/, '')
    .replace(/^https:\/\/[^/]+/, '')
    .replace(/^\/\/[^/]+/, '');
  const hashedParams = sha1(
    Object.keys(params)
      .sort()
      .filter((key) => key !== 'api_key')
      .map((key) => `${key}=${params[key] == null ? '' : String(params[key])}`)
      .join('&')
  );
  const cid = getCookieValue(cookie, 'mars_cid');
  const sid = getCookieValue(cookie, 'mars_sid');
  return `OAuth api_sign=${sha1(apiPath + hashedParams + cid + sid + secret)}`;
}

function getState() {
  const raw = $.read(STORE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (e) {
    $.log(`状态解析失败，已忽略: ${formatError(e)}`);
    return {};
  }
}

function saveState(state) {
  $.write(JSON.stringify(state), STORE_KEY);
}

function getStoredHeader(state, key) {
  return (state.headers || {})[key] || '';
}

function parseQuery(url) {
  const result = {};
  const queryString = (url.split('?')[1] || '').split('#')[0];
  if (!queryString) return result;
  queryString.split('&').forEach((pair) => {
    if (!pair) return;
    const index = pair.indexOf('=');
    const key = index >= 0 ? pair.slice(0, index) : pair;
    const value = index >= 0 ? pair.slice(index + 1) : '';
    result[decode(key)] = decode(value);
  });
  return result;
}

function parseForm(body) {
  const result = {};
  if (!body) return result;
  body.split('&').forEach((pair) => {
    if (!pair) return;
    const index = pair.indexOf('=');
    const key = index >= 0 ? pair.slice(0, index) : pair;
    const value = index >= 0 ? pair.slice(index + 1) : '';
    result[decode(key)] = decode(value);
  });
  return result;
}

function toQuery(obj) {
  return Object.keys(obj || {})
    .filter((key) => obj[key] !== undefined && obj[key] !== null)
    .map((key) => `${encode(key)}=${encode(String(obj[key]))}`)
    .join('&');
}

function toForm(obj) {
  return Object.keys(obj || {})
    .filter((key) => obj[key] !== undefined && obj[key] !== null)
    .map((key) => `${encode(key)}=${encode(String(obj[key]))}`)
    .join('&');
}

function getCookieValue(cookie, name) {
  const matched = String(cookie || '').match(new RegExp(`(?:^|;\\s*)${escapeRegExp(name)}=([^;]*)`));
  return matched ? decodeURIComponent(matched[1]) : '';
}

function mergeCookie(originCookie, headers) {
  const setCookie = getSetCookieList(headers);
  if (!setCookie.length) return originCookie || '';

  const jar = {};
  String(originCookie || '')
    .split(/;\s*/)
    .filter(Boolean)
    .forEach((pair) => {
      const index = pair.indexOf('=');
      if (index < 0) return;
      jar[pair.slice(0, index)] = pair.slice(index + 1);
    });

  setCookie.forEach((item) => {
    const firstPart = String(item || '').split(';')[0];
    const index = firstPart.indexOf('=');
    if (index < 0) return;
    jar[firstPart.slice(0, index)] = firstPart.slice(index + 1);
  });

  return Object.keys(jar)
    .map((key) => `${key}=${jar[key]}`)
    .join('; ');
}

function getSetCookieList(headers) {
  const normalized = lowerCaseHeaders(headers || {});
  const raw = normalized['set-cookie'];
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  return String(raw)
    .split(/,(?=[^;,=\s]+=[^;,]+)/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getPath(url) {
  return url.replace(/^https?:\/\/[^/]+/i, '').split('?')[0];
}

function lowerCaseHeaders(headers) {
  const result = {};
  Object.keys(headers || {}).forEach((key) => {
    result[String(key).toLowerCase()] = headers[key];
  });
  return result;
}

function encode(text) {
  return encodeURIComponent(String(text));
}

function decode(text) {
  return decodeURIComponent(String(text || '').replace(/\+/g, '%20'));
}

function trimText(text, length) {
  const value = String(text || '');
  return value.length > length ? `${value.slice(0, length)}...` : value;
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj || {}));
}

function stringify(obj) {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    return String(obj);
  }
}

function isoNow() {
  return new Date().toISOString();
}

function formatError(err) {
  if (!err) return 'unknown error';
  if (typeof err === 'string') return err;
  if (err.message) return err.message;
  return stringify(err);
}

function escapeRegExp(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sha1(message) {
  const words = [];
  const msg = unescape(encodeURIComponent(String(message)));
  const msgLength = msg.length;
  for (let i = 0; i < msgLength - 3; i += 4) {
    words.push(
      (msg.charCodeAt(i) << 24) |
        (msg.charCodeAt(i + 1) << 16) |
        (msg.charCodeAt(i + 2) << 8) |
        msg.charCodeAt(i + 3)
    );
  }

  let tail = 0;
  switch (msgLength % 4) {
    case 0:
      tail = 0x080000000;
      break;
    case 1:
      tail = (msg.charCodeAt(msgLength - 1) << 24) | 0x0800000;
      break;
    case 2:
      tail = (msg.charCodeAt(msgLength - 2) << 24) | (msg.charCodeAt(msgLength - 1) << 16) | 0x08000;
      break;
    case 3:
      tail =
        (msg.charCodeAt(msgLength - 3) << 24) |
        (msg.charCodeAt(msgLength - 2) << 16) |
        (msg.charCodeAt(msgLength - 1) << 8) |
        0x80;
      break;
    default:
      break;
  }
  words.push(tail);

  while ((words.length % 16) !== 14) words.push(0);
  words.push(Math.floor((msgLength * 8) / 0x100000000));
  words.push((msgLength * 8) & 0xffffffff);

  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;

  for (let i = 0; i < words.length; i += 16) {
    const w = new Array(80);
    for (let j = 0; j < 16; j += 1) w[j] = words[i + j];
    for (let j = 16; j < 80; j += 1) {
      w[j] = leftRotate(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;

    for (let j = 0; j < 80; j += 1) {
      let f;
      let k;
      if (j < 20) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (j < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (j < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }

      const temp = (leftRotate(a, 5) + f + e + k + w[j]) | 0;
      e = d;
      d = c;
      c = leftRotate(b, 30);
      b = a;
      a = temp;
    }

    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0;
  }

  return [h0, h1, h2, h3, h4].map(toHex).join('');
}

function leftRotate(value, bits) {
  return (value << bits) | (value >>> (32 - bits));
}

function toHex(value) {
  let str = '';
  for (let i = 7; i >= 0; i -= 1) {
    str += ((value >>> (i * 4)) & 0x0f).toString(16);
  }
  return str;
}
