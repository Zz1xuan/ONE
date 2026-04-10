/*
WPH.RefreshCookie.js

用途：
1. 抓包阶段：监听 get_session/v1，请求时保存续期模板
2. 响应阶段：若返回 webToken.tokenId，立即更新本地 VIP_TANK
3. 定时阶段：重放已保存的 get_session/v1 请求，刷新本地 VIP_TANK

统一持久化键：
- WPH_SIGN_STATE
- WPH_SIGN_LAST_CAPTURE
- WPH_SIGN_LAST_REFRESH


[rewrite_local]
^https:\/\/mapi\.appvipshop\.com\/vips-mobile\/rest\/user\/get_session\/v1$ url script-request-body https://your.example.com/RefreshCookie.js
^https:\/\/mapi\.appvipshop\.com\/vips-mobile\/rest\/user\/get_session\/v1$ url script-response-body https://your.example.com/RefreshCookie.js

[mitm]
hostname = mapi.appvipshop.com

*/

const APP_NAME = 'WPH刷新Cookie';
const STORE_KEY = 'WPH_SIGN_STATE';
const STORE_CAPTURE_KEY = 'WPH_SIGN_LAST_CAPTURE';
const STORE_REFRESH_KEY = 'WPH_SIGN_LAST_REFRESH';
const REFRESH_URL_RE = /^https:\/\/mapi\.appvipshop\.com\/vips-mobile\/rest\/user\/get_session\/v1(?:\?|$)/i;

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
  if (typeof $response !== 'undefined' && typeof $request !== 'undefined') {
    await captureResponse();
  } else if (typeof $request !== 'undefined') {
    await captureRequest();
  } else {
    await runRefresh();
  }
})()
  .catch((err) => {
    const message = formatError(err);
    logResult('执行异常', message);
    $.msg(APP_NAME, '执行异常', message);
  })
  .finally(() => $.done({}));

async function captureRequest() {
  const url = ($request && $request.url) || '';
  if (!REFRESH_URL_RE.test(url)) return;

  const state = getState();
  const headers = lowerCaseHeaders($request.headers || {});

  state.refresh = {
    method: 'POST',
    url,
    body: ($request.body || '').trim(),
    headers: sanitizeRefreshHeaders(headers),
    updatedAt: isoNow()
  };

  saveState(state);
  $.write(state.refresh.updatedAt, STORE_CAPTURE_KEY);

  logResult('已抓取续期请求', getPath(url));
  $.msg(APP_NAME, '抓包成功', '已保存 get_session 续期请求');
}

async function captureResponse() {
  const url = ($request && $request.url) || '';
  if (!REFRESH_URL_RE.test(url)) return;

  const body = (($response && $response.body) || '').trim();
  const json = safeJsonParse(body);
  if (!json) return;

  const tokenId = extractTokenId(json);
  if (!tokenId) {
    logResult('响应未提取到 token', getPath(url));
    return;
  }

  const state = getState();
  const changed = updateVipTank(state, tokenId);
  state.lastRefreshAt = isoNow();
  saveState(state);
  $.write(state.lastRefreshAt, STORE_REFRESH_KEY);

  logResult(changed ? '响应已更新 VIP_TANK' : '响应 token 未变化', maskMiddle(tokenId, 6, 4));
}

async function runRefresh() {
  const state = getState();
  logResult('开始续期', '');

  if (!state.refresh || !state.refresh.url || !state.refresh.body) {
    logResult('缺少续期模板', '请先打开唯品会触发 get_session 请求');
    $.msg(APP_NAME, '缺少续期模板', '请先打开唯品会触发 get_session 请求');
    return;
  }

  const request = {
    url: state.refresh.url,
    method: state.refresh.method || 'POST',
    headers: clone(state.refresh.headers || {}),
    body: state.refresh.body
  };

  const response = await $.request(request);
  if (Number(response.status) !== 200) {
    const detail = `HTTP ${response.status || 0}`;
    logResult('续期失败', detail);
    $.msg(APP_NAME, '续期失败', detail);
    return;
  }

  const json = safeJsonParse(response.body || '');
  if (!json) {
    const detail = trimText(response.body || '', 120);
    logResult('续期失败', '返回不是 JSON');
    $.msg(APP_NAME, '续期失败', detail || '返回不是 JSON');
    return;
  }

  const tokenId = extractTokenId(json);
  if (!tokenId) {
    const detail = json.msg || '未找到 webToken.tokenId';
    logResult('续期失败', detail);
    $.msg(APP_NAME, '续期失败', detail);
    return;
  }

  const changed = updateVipTank(state, tokenId);
  state.lastRefreshAt = isoNow();
  saveState(state);
  $.write(state.lastRefreshAt, STORE_REFRESH_KEY);

  const detail = changed
    ? `VIP_TANK 已更新为 ${maskMiddle(tokenId, 6, 4)}`
    : `VIP_TANK 未变化 ${maskMiddle(tokenId, 6, 4)}`;
  logResult('续期成功', detail);
  $.msg(APP_NAME, '续期成功', detail);
}

function updateVipTank(state, tokenId) {
  const oldCookie = state.cookie || '';
  const oldToken = getCookieValue(oldCookie, 'VIP_TANK');
  state.cookie = replaceCookieValue(oldCookie, 'VIP_TANK', tokenId);
  return oldToken !== tokenId;
}

function extractTokenId(json) {
  const data = (json || {}).data || {};
  if (data.webToken && data.webToken.tokenId) {
    return String(data.webToken.tokenId);
  }

  const domainCookies = data.domainCookies || [];
  for (let i = 0; i < domainCookies.length; i += 1) {
    const cookies = domainCookies[i].cookies || [];
    for (let j = 0; j < cookies.length; j += 1) {
      if (cookies[j].name === 'VIP_TANK' && cookies[j].value) {
        return String(cookies[j].value);
      }
    }
  }

  return '';
}

function sanitizeRefreshHeaders(headers) {
  const output = {};
  const keepKeys = [
    'content-type',
    'accept',
    'accept-language',
    'accept-encoding',
    'authorization',
    'user-agent'
  ];

  keepKeys.forEach((key) => {
    if (headers[key]) {
      output[normalizeHeaderName(key)] = headers[key];
    }
  });

  if (!output['Content-Type']) {
    output['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  return output;
}

function normalizeHeaderName(name) {
  const map = {
    'content-type': 'Content-Type',
    accept: 'Accept',
    'accept-language': 'Accept-Language',
    'accept-encoding': 'Accept-Encoding',
    authorization: 'Authorization',
    'user-agent': 'User-Agent'
  };
  return map[name] || name;
}

function getState() {
  const raw = $.read(STORE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (e) {
    logResult('本地状态损坏', '已忽略旧数据');
    return {};
  }
}

function saveState(state) {
  $.write(JSON.stringify(state), STORE_KEY);
}

function replaceCookieValue(cookie, name, value) {
  const text = String(cookie || '').trim();
  const pair = `${name}=${value}`;
  if (!text) return pair;
  const reg = new RegExp(`(?:^|;\\s*)${escapeRegExp(name)}=[^;]*`);
  if (reg.test(text)) {
    return text.replace(reg, (matched) => (matched.startsWith(';') ? `; ${pair}` : pair));
  }
  return `${text}; ${pair}`;
}

function getCookieValue(cookie, name) {
  const matched = String(cookie || '').match(new RegExp(`(?:^|;\\s*)${escapeRegExp(name)}=([^;]*)`));
  return matched ? decodeURIComponent(matched[1]) : '';
}

function getPath(url) {
  return String(url || '').replace(/^https?:\/\/[^/]+/i, '').split('?')[0];
}

function lowerCaseHeaders(headers) {
  const result = {};
  Object.keys(headers || {}).forEach((key) => {
    result[String(key).toLowerCase()] = headers[key];
  });
  return result;
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
}

function trimText(text, length) {
  const value = String(text || '');
  return value.length > length ? `${value.slice(0, length)}...` : value;
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj || {}));
}

function isoNow() {
  return new Date().toISOString();
}

function formatError(err) {
  if (!err) return 'unknown error';
  if (typeof err === 'string') return err;
  if (err.message) return err.message;
  try {
    return JSON.stringify(err);
  } catch (e) {
    return String(err);
  }
}

function maskMiddle(value, left, right) {
  const text = String(value || '');
  if (!text) return '-';
  if (text.length <= left + right) return text;
  return `${text.slice(0, left)}***${text.slice(-right)}`;
}

function logResult(title, detail) {
  $.log('唯品会刷新Cookie：' + title + (detail ? ' | ' + detail : ''));
}

function escapeRegExp(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
