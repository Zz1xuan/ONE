/*
用途：
1. 抓取用户自己的 Cookie / 必要请求头 / body 模板
2. 自动执行：查询签到状态 -> 签到 -> 获取任务列表 -> 完成待完成任务

需要抓到的请求：
- /restapi/soa2/18903/getAttendanceConData
- /restapi/soa2/18903/attendanceDay
- /restapi/soa2/20707/getCreditTask
- /restapi/soa2/14593/FinishVipCredit

注意：
- 只会复用“你手动打开页面时抓到的模板”
- 不绕过登录，不伪造 cookie
- FinishVipCredit 的写请求头里有动态字段，建议你至少手动完成过一次任务，让脚本抓到对应请求模板
- 当前 HAR 未发现稳定的独立领奖接口，因此本脚本默认以 FinishVipCredit 直接到账为准

[rewrite_local]
^https:\/\/m\.suanya\.com\/restapi\/soa2\/18903\/(getAttendanceConData|attendanceDay)\?.* url script-request-body https://raw.githubusercontent.com/Zz1xuan/ONE/refs/heads/main/Task/ZhiXing/ZhiXing.js
^https:\/\/m\.suanya\.com\/restapi\/soa2\/20707\/getCreditTask\?.* url script-request-body https://raw.githubusercontent.com/Zz1xuan/ONE/refs/heads/main/Task/ZhiXing/ZhiXing.js
^https:\/\/m\.suanya\.com\/restapi\/soa2\/14593\/FinishVipCredit\?.* url script-request-body https://raw.githubusercontent.com/Zz1xuan/ONE/refs/heads/main/Task/ZhiXing/ZhiXing.js

[task_local]
5 9 * * * https://example.com/QX_Zhixing_Task.js, tag=智行签到任务

[mitm]
hostname = m.suanya.com
*/

const APP_NAME = '智行签到任务';
const STORE_KEY = 'ZX_TASK_SIGN_STATE_V1';
const HOST = 'https://m.suanya.com';

const STATUS_PATH = '/restapi/soa2/18903/getAttendanceConData';
const SIGN_PATH = '/restapi/soa2/18903/attendanceDay';
const TASK_LIST_PATH = '/restapi/soa2/20707/getCreditTask';
const FINISH_TASK_PATH = '/restapi/soa2/14593/FinishVipCredit';

function Env(name) {
  this.name = name;
  this.isQX = typeof $task !== 'undefined';
}

Env.prototype.read = function (key) {
  return $prefs.valueForKey(key);
};

Env.prototype.write = function (value, key) {
  return $prefs.setValueForKey(String(value), key);
};

Env.prototype.msg = function (title, subTitle, desc) {
  $notify(title, subTitle, desc);
};

Env.prototype.log = function (text) {
  console.log(String(text));
};

Env.prototype.done = function (value) {
  $done(value);
};

Env.prototype.request = function (options) {
  return $task.fetch(options).then((resp) => ({
    status: resp.statusCode || resp.status,
    headers: resp.headers || {},
    body: resp.body || ''
  }));
};

const $ = new Env(APP_NAME);

!(async () => {
  if (typeof $request !== 'undefined') {
    await capture();
  } else {
    await run();
  }
})()
  .catch((err) => {
    const message = String(err && (err.stack || err.message) || err);
    $.log(message);
    $.msg(APP_NAME, '执行异常', message);
  })
  .finally(() => $.done({}));

async function capture() {
  const url = $request.url || '';
  const method = String($request.method || 'GET').toUpperCase();
  const path = getPath(url);
  if (method !== 'POST') return;
  if (![STATUS_PATH, SIGN_PATH, TASK_LIST_PATH, FINISH_TASK_PATH].includes(path)) return;

  const state = getState();
  const headers = lowerCaseHeaders($request.headers || {});
  const body = parseJsonSafe($request.body || '{}');
  const query = parseQuery(url);

  if (headers.cookie) state.cookie = headers.cookie;
  state.commonHeaders = {
    'user-agent': headers['user-agent'] || state.commonHeaders?.['user-agent'] || '',
    'content-type': headers['content-type'] || state.commonHeaders?.['content-type'] || 'application/json',
    origin: headers.origin || state.commonHeaders?.origin || 'https://m.suanya.com',
    referer: headers.referer || state.commonHeaders?.referer || 'https://m.suanya.com/',
    'x-ctx-rmstoken': headers['x-ctx-rmstoken'] || state.commonHeaders?.['x-ctx-rmstoken'] || '',
    'x-ctx-ubt-pageid': headers['x-ctx-ubt-pageid'] || state.commonHeaders?.['x-ctx-ubt-pageid'] || '',
    'x-ctx-ubt-pvid': headers['x-ctx-ubt-pvid'] || state.commonHeaders?.['x-ctx-ubt-pvid'] || '',
    'x-ctx-ubt-sid': headers['x-ctx-ubt-sid'] || state.commonHeaders?.['x-ctx-ubt-sid'] || '',
    'x-ctx-ubt-vid': headers['x-ctx-ubt-vid'] || state.commonHeaders?.['x-ctx-ubt-vid'] || ''
  };

  state.query = {
    _fxpcqlniredt: query._fxpcqlniredt || state.query?._fxpcqlniredt || '',
    'x-traceID': query['x-traceID'] || state.query?.['x-traceID'] || ''
  };

  if (path === STATUS_PATH) {
    state.statusBody = body;
    notifyCapture('已更新签到状态模板');
  }

  if (path === SIGN_PATH) {
    state.signBody = body;
    state.signHeaders = {
      'w-payload-source': headers['w-payload-source'] || ''
    };
    notifyCapture('已更新签到执行模板');
  }

  if (path === TASK_LIST_PATH) {
    state.taskListBody = body;
    notifyCapture('已更新任务列表模板');
  }

  if (path === FINISH_TASK_PATH) {
    state.finishTaskBody = body;
    state.finishTaskHeaders = {
      'w-payload-source': headers['w-payload-source'] || ''
    };
    notifyCapture(`已更新任务完成模板: ${body.pageCode || 'unknown'}`);
  }

  state.updatedAt = new Date().toISOString();
  saveState(state);
}

async function run() {
  const state = getState();
  if (!state.cookie || !state.statusBody || !state.taskListBody) {
    $.msg(APP_NAME, '缺少抓包模板', '请至少抓到 getAttendanceConData 和 getCreditTask');
    return;
  }

  const logs = [];

  logs.push(await doSign(state));
  const taskResult = await doTasks(state);
  logs.push(taskResult.message);

  $.msg(APP_NAME, '执行完成', logs.filter(Boolean).join('\n'));
}

async function doSign(state) {
  const statusBody = buildBody(state.statusBody, state);
  const statusUrl = buildUrl(STATUS_PATH, state, statusBody);
  const statusResp = await post(statusUrl, statusBody, buildHeaders(state, 'status'));
  if (!statusResp.ok) return `签到状态查询失败: ${statusResp.message}`;

  const statusJson = statusResp.json || {};
  if (Number(statusJson.resultCode) !== 1) {
    return `签到状态查询失败: ${statusJson.resultMessage || JSON.stringify(statusJson)}`;
  }

  if (statusJson.attendanceTodayFlag === true) {
    return '今日已签到';
  }

  if (!state.signBody || !state.signHeaders || !state.signHeaders['w-payload-source']) {
    return '缺少签到执行模板，请手动点一次签到抓 attendanceDay';
  }

  const signBody = buildBody(state.signBody, state);
  const signUrl = buildUrl(SIGN_PATH, state, signBody);
  const signResp = await post(signUrl, signBody, buildHeaders(state, 'sign'));
  if (!signResp.ok) return `签到失败: ${signResp.message}`;

  const signJson = signResp.json || {};
  if (Number(signJson.resultCode) !== 1) {
    return `签到失败: ${signJson.resultMessage || JSON.stringify(signJson)}`;
  }

  return `签到成功 expandCredit=${signJson.expandCredit || 0}`;
}

async function doTasks(state) {
  if (!state.finishTaskBody || !state.finishTaskHeaders || !state.finishTaskHeaders['w-payload-source']) {
    return {
      ok: false,
      message: '缺少任务完成模板，请先手动完成过一次任务抓 FinishVipCredit'
    };
  }

  const taskListBody = buildBody(state.taskListBody, state);
  const taskListUrl = buildUrl(TASK_LIST_PATH, state, taskListBody);
  const taskResp = await post(taskListUrl, taskListBody, buildHeaders(state, 'taskList'));
  if (!taskResp.ok) {
    return { ok: false, message: `任务列表失败: ${taskResp.message}` };
  }

  const taskJson = taskResp.json || {};
  if (Number(taskJson.resultCode) !== 1 || !Array.isArray(taskJson.creditTaskList)) {
    return { ok: false, message: `任务列表失败: ${taskJson.resultMessage || JSON.stringify(taskJson)}` };
  }

  const todoList = taskJson.creditTaskList.filter((item) => Number(item.state) === 0);
  if (!todoList.length) {
    return { ok: true, message: '没有待完成任务' };
  }

  const doneLogs = [];
  for (const task of todoList) {
    const finishBody = buildFinishTaskBody(state, task);
    const finishUrl = buildUrl(FINISH_TASK_PATH, state, finishBody);
    const finishResp = await post(finishUrl, finishBody, buildHeaders(state, 'finishTask'));
    if (!finishResp.ok) {
      doneLogs.push(`${task.pageCode || task.title}: 失败(${finishResp.message})`);
      continue;
    }

    const finishJson = finishResp.json || {};
    if (Number(finishJson.resultCode) === 1) {
      doneLogs.push(`${task.pageCode || task.title}: +${finishJson.sendCredit || 0}`);
    } else {
      doneLogs.push(`${task.pageCode || task.title}: 失败(${finishJson.resultMessage || 'unknown'})`);
    }
  }

  return {
    ok: true,
    message: `任务完成 ${doneLogs.length} 个\n${doneLogs.join('\n')}`
  };
}

async function post(url, body, headers) {
  try {
    const resp = await $.request({
      url,
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    const json = parseJsonSafe(resp.body || '{}');
    return {
      ok: resp.status >= 200 && resp.status < 300,
      status: resp.status,
      json,
      message: json.resultMessage || json.msg || `HTTP ${resp.status}`
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      json: null,
      message: String(err.message || err)
    };
  }
}

function buildHeaders(state, type) {
  const h = state.commonHeaders || {};
  const headers = {
    Cookie: state.cookie,
    'User-Agent': h['user-agent'] || '',
    'Content-Type': h['content-type'] || 'application/json',
    Origin: h.origin || 'https://m.suanya.com',
    Referer: h.referer || 'https://m.suanya.com/',
    Accept: 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
    'x-ctx-wclient-req': randomHex(32)
  };

  if (h['x-ctx-rmstoken']) headers['x-ctx-rmstoken'] = h['x-ctx-rmstoken'];
  if (h['x-ctx-ubt-pageid']) headers['x-ctx-ubt-pageid'] = h['x-ctx-ubt-pageid'];
  if (h['x-ctx-ubt-pvid']) headers['x-ctx-ubt-pvid'] = h['x-ctx-ubt-pvid'];
  if (h['x-ctx-ubt-sid']) headers['x-ctx-ubt-sid'] = h['x-ctx-ubt-sid'];
  if (h['x-ctx-ubt-vid']) headers['x-ctx-ubt-vid'] = h['x-ctx-ubt-vid'];

  if (type === 'sign' && state.signHeaders?.['w-payload-source']) {
    headers['w-payload-source'] = state.signHeaders['w-payload-source'];
  }

  if (type === 'finishTask' && state.finishTaskHeaders?.['w-payload-source']) {
    headers['w-payload-source'] = state.finishTaskHeaders['w-payload-source'];
  }

  return headers;
}

function buildBody(template, state) {
  const body = clone(template || {});
  const cid = resolveCid(body, state);

  if (body.head && body.head.cid != null) body.head.cid = cid;

  if (body.head && Array.isArray(body.head.extension)) {
    body.head.extension = body.head.extension.map((item) => {
      const x = clone(item);
      if (x && x.name === 'reqTime') x.value = String(Math.floor(Date.now() / 1000));
      return x;
    });
  }

  return body;
}

function buildFinishTaskBody(state, task) {
  const body = buildBody(state.finishTaskBody, state);
  body.pageCode = task.pageCode || body.pageCode;
  if (!body.code) body.code = 'vipWelfare';
  if (!body.abVersion) body.abVersion = '32';
  return body;
}

function buildUrl(path, state, body) {
  const cid = resolveCid(body, state);
  const query = clone(state.query || {});
  query._fxpcqlniredt = query._fxpcqlniredt || cid;
  query['x-traceID'] = `${query._fxpcqlniredt}-${Date.now()}-${randomNum(7)}`;

  const url = new URL(HOST + path);
  Object.keys(query).forEach((key) => {
    if (query[key]) url.searchParams.set(key, query[key]);
  });
  return url.toString();
}

function resolveCid(body, state) {
  const fromBody = body && body.head && body.head.cid;
  if (fromBody) return fromBody;
  const fromQuery = state.query && state.query._fxpcqlniredt;
  if (fromQuery) return fromQuery;
  const cookies = parseCookieMap(state.cookie || '');
  return cookies.GUID || cookies._n_cid || '';
}

function notifyCapture(text) {
  $.log(text);
  $.msg(APP_NAME, '抓取成功', text);
}

function getState() {
  const raw = $.read(STORE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveState(state) {
  $.write(JSON.stringify(state), STORE_KEY);
}

function getPath(url) {
  try {
    return new URL(url).pathname;
  } catch {
    return '';
  }
}

function parseQuery(url) {
  try {
    const u = new URL(url);
    const out = {};
    u.searchParams.forEach((value, key) => {
      out[key] = value;
    });
    return out;
  } catch {
    return {};
  }
}

function parseJsonSafe(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function lowerCaseHeaders(headers) {
  const out = {};
  Object.keys(headers || {}).forEach((key) => {
    out[String(key).toLowerCase()] = headers[key];
  });
  return out;
}

function parseCookieMap(cookie) {
  const out = {};
  String(cookie || '')
    .split(/;\s*/)
    .filter(Boolean)
    .forEach((item) => {
      const idx = item.indexOf('=');
      if (idx > 0) out[item.slice(0, idx)] = item.slice(idx + 1);
    });
  return out;
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj || {}));
}

function randomHex(len) {
  const chars = 'abcdef0123456789';
  let out = '';
  for (let i = 0; i < len; i += 1) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function randomNum(len) {
  const chars = '0123456789';
  let out = '';
  for (let i = 0; i < len; i += 1) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}
