/*
WPH.Task.js

Purpose:
1. Capture commonTask request templates from the sign-in activity page.
2. Run task initialization, task completion, and award claiming on a schedule.

Capture endpoints:
- /commonTask/getTaskList
- /commonTask/getTask
- /commonTask/getTaskDetail
- /commonTask/finishTask
- /commonTask/getAward

Quantumult X example:
[rewrite_local]
^https:\/\/act-ug\.vip\.com\/commonTask\/(getTaskList|getTask|getTaskDetail|finishTask|getAward)\? url script-request-body https://raw.githubusercontent.com/Zz1xuan/ONE/refs/heads/main/Task/Vipshop/Vipshop_Task.js

[task_local]
15 9 * * * https://raw.githubusercontent.com/Zz1xuan/ONE/refs/heads/main/Task/Vipshop/Vipshop_Task.js, tag=Vipshop任务

[mitm]
hostname = act-ug.vip.com
*/

const APP_NAME = 'WPH任务';
const STORE_KEY = 'WPH_TASK_STATE';
const STORE_CAPTURE_KEY = 'WPH_TASK_LAST_CAPTURE';

const API_HOST = 'https://act-ug.vip.com';
const TASK_LIST_PATH = '/commonTask/getTaskList';
const TASK_GET_PATH = '/commonTask/getTask';
const TASK_DETAIL_PATH = '/commonTask/getTaskDetail';
const TASK_FINISH_PATH = '/commonTask/finishTask';
const TASK_AWARD_PATH = '/commonTask/getAward';

const DEFAULT_STANDBY_ID = 'native';
const NOTIFY_CAPTURE = true;
const NOTIFY_MAX_LINES = 8;

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
    const method = String(options.method || 'GET').toLowerCase();
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
    await captureRequest();
  } else {
    await runTasks();
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
  const method = String(($request && $request.method) || 'GET').toUpperCase();
  const path = getPath(url);
  const trackedPaths = [
    TASK_LIST_PATH,
    TASK_GET_PATH,
    TASK_DETAIL_PATH,
    TASK_FINISH_PATH,
    TASK_AWARD_PATH
  ];
  if (!trackedPaths.includes(path)) return;

  if (method !== 'POST') {
    logResult('忽略请求', method + ' ' + path);
    return;
  }

  const state = getState();
  const headers = lowerCaseHeaders($request.headers || {});
  const body = parseForm(($request.body || '').trim());
  const query = parseQuery(url);

  if (!Object.keys(body).length) {
    logResult('忽略空模板', path + ' | body 为空');
    return;
  }

  if (headers.cookie) state.cookie = headers.cookie;
  state.headers = {
    'User-Agent': headers['user-agent'] || getStoredHeader(state, 'User-Agent'),
    'Content-Type':
      headers['content-type'] ||
      getStoredHeader(state, 'Content-Type') ||
      'application/x-www-form-urlencoded; charset=UTF-8',
    Origin: headers.origin || getStoredHeader(state, 'Origin') || 'https://mst.vip.com',
    Referer: headers.referer || getStoredHeader(state, 'Referer') || 'https://mst.vip.com/'
  };
  state.query = Object.assign({}, state.query || {}, query);

  if (path === TASK_LIST_PATH) {
    state.taskListBody = body;
    if (body.actId) state.actId = body.actId;
  } else if (path === TASK_GET_PATH) {
    state.taskGetBody = body;
    if (body.actId) state.actId = body.actId;
    if (body.taskId) state.lastTaskId = body.taskId;
  } else if (path === TASK_DETAIL_PATH) {
    state.taskDetailBody = body;
    if (body.actId) state.actId = body.actId;
    if (body.taskId) state.lastTaskId = body.taskId;
  } else if (path === TASK_FINISH_PATH) {
    state.taskFinishBody = body;
    if (body.actId) state.actId = body.actId;
    if (body.taskId) state.lastTaskId = body.taskId;
    if (body.standby_id) state.standbyId = body.standby_id;
  } else if (path === TASK_AWARD_PATH) {
    state.taskAwardBody = body;
    if (body.actId) state.actId = body.actId;
    if (body.taskId) state.lastTaskId = body.taskId;
  }

  state.updatedAt = isoNow();
  saveState(state);
  $.write(state.updatedAt, STORE_CAPTURE_KEY);

  const name = getCaptureName(path);
  const fields = [
    body.actId ? 'actId=' + body.actId : '',
    body.taskId ? 'taskId=' + body.taskId : '',
    body.userTaskId ? 'userTaskId=' + body.userTaskId : ''
  ]
    .filter(Boolean)
    .join(' | ');
  logResult('已抓取模板', name + (fields ? ' | ' + fields : ''));
  if (NOTIFY_CAPTURE) {
    $.msg(APP_NAME, '抓包成功', '已更新 ' + name + (fields ? '\n' + fields : ''));
  }
}

async function runTasks() {
  const state = getState();
  logResult('开始执行', '任务完成 + 领奖');

  if (!state.cookie) {
    const tip = '请先打开签到页或任务页，让 commonTask 请求经过脚本';
    logResult('缺少 Cookie', tip);
    $.msg(APP_NAME, '缺少 Cookie', tip);
    return;
  }

  const taskListBody = buildTaskListBody(state);
  if (!taskListBody) {
    const tip = '缺少 getTaskList 模板，请先抓包';
    logResult('缺少模板', tip);
    $.msg(APP_NAME, '缺少模板', tip);
    return;
  }

  const baseTaskBody = buildTaskBase(state);
  if (!baseTaskBody) {
    const tip = '缺少任务基础参数，请至少抓一次 getTaskList 或 getTask';
    logResult('缺少模板', tip);
    $.msg(APP_NAME, '缺少模板', tip);
    return;
  }

  const actId = taskListBody.actId || baseTaskBody.actId || state.actId || '';
  if (!actId) {
    const tip = '缺少任务 actId，请重新抓包';
    logResult('缺少 actId', tip);
    $.msg(APP_NAME, '缺少 actId', tip);
    return;
  }

  taskListBody.actId = actId;
  baseTaskBody.actId = actId;

  const listResp = await sendTaskRequest(TASK_LIST_PATH, taskListBody, state);
  if (!listResp.ok) {
    logResult('任务列表失败', listResp.message);
    $.msg(APP_NAME, '任务列表失败', listResp.message);
    return;
  }

  const listJson = listResp.json || {};
  if (Number(listJson.code) !== 1) {
    const message = listJson.msg || ('code=' + (listJson.code || 'unknown'));
    logResult('任务列表失败', message);
    $.msg(APP_NAME, '任务列表失败', message);
    return;
  }

  const taskList = (((listJson || {}).data || {}).taskList) || [];
  if (!taskList.length) {
    logResult('任务列表为空', '');
    $.msg(APP_NAME, '任务列表为空', '');
    return;
  }

  let claimCount = 0;
  let finishCount = 0;
  let awardCount = 0;
  let manualCount = 0;
  let skipCount = 0;
  let failCount = 0;
  const detailLines = [];

  for (let i = 0; i < taskList.length; i += 1) {
    const task = taskList[i] || {};
    const taskId = task.taskId || '';
    const taskName = task.taskName || taskId || '未知任务';
    const awardText = formatAward(task.awardType, task.awardNum);

    if (!taskId) {
      skipCount += 1;
      detailLines.push(taskName + ' | 跳过，缺少 taskId');
      continue;
    }

    let currentStatus = toNumber(task.taskStatus, 0);
    let userTaskId = task.userTaskId || '';
    let taskLine = taskName;

    if (currentStatus === 2) {
      skipCount += 1;
      detailLines.push(taskLine + ' | 已领奖' + (awardText ? ' | ' + awardText : ''));
      continue;
    }

    if (!userTaskId) {
      const getBody = buildTaskBody(baseTaskBody, { actId: actId, taskId: taskId });
      delete getBody.userTaskId;
      delete getBody.standby_id;

      const getResp = await sendTaskRequest(TASK_GET_PATH, getBody, state);
      if (!getResp.ok) {
        failCount += 1;
        detailLines.push(taskLine + ' | 领任务失败 | ' + trimText(getResp.message, 80));
        continue;
      }

      const getJson = getResp.json || {};
      if (Number(getJson.code) !== 1) {
        failCount += 1;
        detailLines.push(taskLine + ' | 领任务失败 | ' + trimText(getJson.msg || 'unknown', 80));
        continue;
      }

      const getData = getJson.data || {};
      userTaskId = getData.userTaskId || userTaskId;
      currentStatus = toNumber(getData.taskStatus, currentStatus);
      claimCount += 1;
      logResult('领任务成功', taskLine + ' | userTaskId=' + (userTaskId || '-'));
    }

    if (!userTaskId) {
      manualCount += 1;
      detailLines.push(taskLine + ' | 需手动完成，未生成 userTaskId' + (awardText ? ' | ' + awardText : ''));
      continue;
    }

    if (currentStatus === 0) {
      const finishBody = buildTaskBody(baseTaskBody, {
        actId: actId,
        taskId: taskId,
        userTaskId: userTaskId,
        standby_id: state.standbyId || DEFAULT_STANDBY_ID
      });

      const finishResp = await sendTaskRequest(TASK_FINISH_PATH, finishBody, state);
      if (!finishResp.ok) {
        manualCount += 1;
        detailLines.push(taskLine + ' | 完成失败，需手动处理 | ' + trimText(finishResp.message, 80));
        continue;
      }

      const finishJson = finishResp.json || {};
      if (Number(finishJson.code) !== 1) {
        manualCount += 1;
        detailLines.push(taskLine + ' | 完成失败，需手动处理 | ' + trimText(finishJson.msg || 'unknown', 80));
        continue;
      }

      const finishData = finishJson.data || {};
      currentStatus = toNumber(finishData.taskStatus, currentStatus);
      userTaskId = finishData.userTaskId || userTaskId;
      finishCount += 1;
      logResult('任务完成成功', taskLine + ' | status=' + currentStatus);
    }

    if (currentStatus !== 1) {
      if (currentStatus === 2) {
        skipCount += 1;
        detailLines.push(taskLine + ' | 已领奖' + (awardText ? ' | ' + awardText : ''));
      } else {
        manualCount += 1;
        detailLines.push(taskLine + ' | 仍未到领奖状态，当前 status=' + currentStatus + (awardText ? ' | ' + awardText : ''));
      }
      continue;
    }

    const awardBody = buildTaskBody(baseTaskBody, {
      actId: actId,
      taskId: taskId,
      userTaskId: userTaskId
    });
    delete awardBody.standby_id;

    const awardResp = await sendTaskRequest(TASK_AWARD_PATH, awardBody, state);
    if (!awardResp.ok) {
      failCount += 1;
      detailLines.push(taskLine + ' | 领奖失败 | ' + trimText(awardResp.message, 80));
      continue;
    }

    const awardJson = awardResp.json || {};
    if (Number(awardJson.code) !== 1) {
      failCount += 1;
      detailLines.push(taskLine + ' | 领奖失败 | ' + trimText(awardJson.msg || 'unknown', 80));
      continue;
    }

    const awardData = awardJson.data || {};
    const awardNumText = awardData.awardNum || task.awardNum || '';
    const finalAwardText = formatAward(task.awardType, awardNumText) || awardText;
    awardCount += 1;
    detailLines.push(taskLine + ' | 奖励领取成功' + (finalAwardText ? ' | ' + finalAwardText : ''));
    logResult('领奖成功', taskLine + (finalAwardText ? ' | ' + finalAwardText : ''));
  }

  const summary =
    '领任务 ' +
    claimCount +
    ' 个, 完成 ' +
    finishCount +
    ' 个, 领奖 ' +
    awardCount +
    ' 个, 需手动 ' +
    manualCount +
    ' 个, 跳过 ' +
    skipCount +
    ' 个, 失败 ' +
    failCount +
    ' 个';
  const detailText = buildNotifyText(detailLines);

  logResult('执行完成', summary);
  if (detailText) logResult('执行详情', detailText);
  $.msg(APP_NAME, '任务执行完成', detailText ? summary + '\n' + detailText : summary);
}

async function sendTaskRequest(path, body, state) {
  const url = buildApiUrl(path, state.query, body);
  return postSigned(url, body, state);
}

function buildTaskListBody(state) {
  const source =
    state.taskListBody ||
    state.taskGetBody ||
    state.taskDetailBody ||
    state.taskFinishBody ||
    state.taskAwardBody ||
    null;
  if (!source || !Object.keys(source).length) return null;

  const body = clone(source);
  delete body.taskId;
  delete body.userTaskId;
  delete body.standby_id;
  return body;
}

function buildTaskBase(state) {
  const source =
    state.taskFinishBody ||
    state.taskGetBody ||
    state.taskDetailBody ||
    state.taskAwardBody ||
    state.taskListBody ||
    null;
  if (!source || !Object.keys(source).length) return null;

  const body = clone(source);
  delete body.taskId;
  delete body.userTaskId;
  return body;
}

function buildTaskBody(base, overrides) {
  const body = Object.assign({}, base || {});
  Object.keys(overrides || {}).forEach((key) => {
    if (overrides[key] !== undefined && overrides[key] !== null && overrides[key] !== '') {
      body[key] = overrides[key];
    }
  });
  return body;
}

function getCaptureName(path) {
  if (path === TASK_LIST_PATH) return 'getTaskList 模板';
  if (path === TASK_GET_PATH) return 'getTask 模板';
  if (path === TASK_DETAIL_PATH) return 'getTaskDetail 模板';
  if (path === TASK_FINISH_PATH) return 'finishTask 模板';
  if (path === TASK_AWARD_PATH) return 'getAward 模板';
  return '模板';
}

function buildNotifyText(lines) {
  if (!lines || !lines.length) return '';
  const maxLines = Math.max(1, Number(NOTIFY_MAX_LINES) || 8);
  const slice = lines.slice(0, maxLines);
  const more = lines.length > maxLines ? '\n...' : '';
  return trimText(slice.join('\n') + more, 500);
}

async function postSigned(url, bodyObj, state) {
  const apiKey = bodyObj.api_key || ((state.query || {}).api_key || '');
  const secret = API_SECRET_MAP[apiKey];
  if (!secret) {
    return { ok: false, message: '未知 api_key: ' + (apiKey || 'empty') };
  }

  const cookie = state.cookie || '';
  const authorization = getApiSign(url.split('?')[0], bodyObj, cookie, secret);
  const response = await $.request({
    url: url,
    method: 'POST',
    headers: {
      'Content-Type': getStoredHeader(state, 'Content-Type') || 'application/x-www-form-urlencoded; charset=UTF-8',
      Origin: getStoredHeader(state, 'Origin') || 'https://mst.vip.com',
      Referer: getStoredHeader(state, 'Referer') || 'https://mst.vip.com/',
      'User-Agent': getStoredHeader(state, 'User-Agent') || '',
      Cookie: cookie,
      Authorization: authorization
    },
    body: toForm(bodyObj)
  });

  const bodyText = response.body || '';
  let json = null;
  if (bodyText) {
    try {
      json = JSON.parse(bodyText);
    } catch (e) {
      json = null;
    }
  }

  if (response.status < 200 || response.status >= 300) {
    return {
      ok: false,
      status: response.status,
      headers: response.headers,
      body: bodyText,
      json: json,
      message: 'HTTP ' + response.status
    };
  }

  return {
    ok: true,
    status: response.status,
    headers: response.headers,
    body: bodyText,
    json: json,
    message: ''
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
  return API_HOST + path + '?' + toQuery(query);
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
      .map((key) => key + '=' + (params[key] == null ? '' : String(params[key])))
      .join('&')
  );
  const cid = getCookieValue(cookie, 'mars_cid');
  const sid = getCookieValue(cookie, 'mars_sid');
  return 'OAuth api_sign=' + sha1(apiPath + hashedParams + cid + sid + secret);
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

function getStoredHeader(state, key) {
  return (state.headers || {})[key] || '';
}

function parseQuery(url) {
  const result = {};
  const queryString = (String(url || '').split('?')[1] || '').split('#')[0];
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
  String(body).split('&').forEach((pair) => {
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
    .map((key) => encode(key) + '=' + encode(String(obj[key])))
    .join('&');
}

function toForm(obj) {
  return Object.keys(obj || {})
    .filter((key) => obj[key] !== undefined && obj[key] !== null)
    .map((key) => encode(key) + '=' + encode(String(obj[key])))
    .join('&');
}

function formatAward(type, num) {
  const amount = String(num || '').trim();
  if (!amount) return '';
  const labelMap = {
    '2': '唯品币'
  };
  const label = labelMap[String(type || '')] || '奖励';
  return amount + label;
}

function getCookieValue(cookie, name) {
  const pattern = new RegExp('(?:^|; )' + escapeRegExp(name) + '=([^;]*)');
  const match = String(cookie || '').match(pattern);
  return match ? decode(match[1]) : '';
}

function getPath(url) {
  const clean = String(url || '').replace(/^https?:\/\/[^/]+/i, '');
  const queryIndex = clean.indexOf('?');
  return queryIndex >= 0 ? clean.slice(0, queryIndex) : clean;
}

function lowerCaseHeaders(headers) {
  const result = {};
  Object.keys(headers || {}).forEach((key) => {
    result[String(key).toLowerCase()] = headers[key];
  });
  return result;
}

function trimText(text, length) {
  const value = String(text || '');
  return value.length > length ? value.slice(0, length) + '...' : value;
}

function encode(text) {
  return encodeURIComponent(String(text));
}

function decode(text) {
  return decodeURIComponent(String(text || '').replace(/\+/g, '%20'));
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

function toNumber(value, fallback) {
  if (value === null || value === undefined || value === '') return fallback;
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
}

function formatError(err) {
  if (!err) return 'unknown error';
  if (typeof err === 'string') return err;
  if (err.message) return err.message;
  return stringify(err);
}

function logResult(title, detail) {
  $.log(APP_NAME + ' | ' + title + (detail ? ' | ' + detail : ''));
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

  let i = 0;
  switch (msgLength % 4) {
    case 0:
      i = 0x080000000;
      break;
    case 1:
      i = (msg.charCodeAt(msgLength - 1) << 24) | 0x0800000;
      break;
    case 2:
      i = (msg.charCodeAt(msgLength - 2) << 24) | (msg.charCodeAt(msgLength - 1) << 16) | 0x08000;
      break;
    default:
      i =
        (msg.charCodeAt(msgLength - 3) << 24) |
        (msg.charCodeAt(msgLength - 2) << 16) |
        (msg.charCodeAt(msgLength - 1) << 8) |
        0x80;
      break;
  }
  words.push(i);

  while ((words.length % 16) !== 14) {
    words.push(0);
  }

  words.push(msgLength >>> 29);
  words.push((msgLength << 3) & 0x0ffffffff);

  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;

  const w = new Array(80);

  for (let blockStart = 0; blockStart < words.length; blockStart += 16) {
    for (let j = 0; j < 16; j += 1) {
      w[j] = words[blockStart + j];
    }
    for (let j = 16; j <= 79; j += 1) {
      w[j] = rotateLeft(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;

    for (let j = 0; j <= 79; j += 1) {
      let f = 0;
      let k = 0;
      if (j <= 19) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (j <= 39) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (j <= 59) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }

      const temp = (rotateLeft(a, 5) + f + e + k + w[j]) & 0x0ffffffff;
      e = d;
      d = c;
      c = rotateLeft(b, 30);
      b = a;
      a = temp;
    }

    h0 = (h0 + a) & 0x0ffffffff;
    h1 = (h1 + b) & 0x0ffffffff;
    h2 = (h2 + c) & 0x0ffffffff;
    h3 = (h3 + d) & 0x0ffffffff;
    h4 = (h4 + e) & 0x0ffffffff;
  }

  return [h0, h1, h2, h3, h4].map(toHex).join('');
}

function rotateLeft(value, bits) {
  return (value << bits) | (value >>> (32 - bits));
}

function toHex(value) {
  let hex = '';
  for (let i = 7; i >= 0; i -= 1) {
    hex += ((value >>> (i * 4)) & 0x0f).toString(16);
  }
  return hex;
}
