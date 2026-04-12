/*
唯品会签到
1. 请求阶段：监听 signIn/info 与 signIn/exec，抓取 Cookie、模板参数与必要请求头
2. 定时阶段：先调用 info 查询状态，再按真实 actId 调用 exec 完成签到

持久化键：
- WPH_SIGN_STATE
- WPH_SIGN_LAST_CAPTURE

[rewrite_local]
^https:\/\/act-ug\.vip\.com\/signIn\/(info|exec|getDressRecord)\? url script-request-body https://raw.githubusercontent.com/Zz1xuan/ONE/refs/heads/main/Script/task/SignIn.js
^https:\/\/act-ug\.vip\.com\/commonTask\/(getTaskList|getTaskDetail|finishTask|getAward)\? url script-request-body https://raw.githubusercontent.com/Zz1xuan/ONE/refs/heads/main/Script/task/SignIn.js

[mitm]
hostname = act-ug.vip.com

*/


const APP_NAME = 'WPH签到';
const STORE_KEY = 'WPH_SIGN_STATE';
const STORE_CAPTURE_KEY = 'WPH_SIGN_LAST_CAPTURE';
const API_HOST = 'https://act-ug.vip.com';
const INFO_PATH = '/signIn/info';
const EXEC_PATH = '/signIn/exec';
const TASK_LIST_PATH = '/commonTask/getTaskList';
const TASK_DETAIL_PATH = '/commonTask/getTaskDetail';
const TASK_FINISH_PATH = '/commonTask/finishTask';
const TASK_AWARD_PATH = '/commonTask/getAward';
const DRESS_RECORD_PATH = '/signIn/getDressRecord';
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
    await captureRequest();
  } else {
    await runSignIn();
    await runCommonTasks();
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
  const path = getPath(url);
  const trackedPaths = [
    INFO_PATH,
    EXEC_PATH,
    TASK_LIST_PATH,
    TASK_DETAIL_PATH,
    TASK_FINISH_PATH,
    TASK_AWARD_PATH,
    DRESS_RECORD_PATH
  ];
  if (!trackedPaths.includes(path)) return;

  const state = getState();
  const headers = lowerCaseHeaders($request.headers || {});
  const body = parseForm(($request.body || '').trim());
  const query = parseQuery(url);

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

  if (path === INFO_PATH) {
    state.infoBody = body;
  } else if (path === EXEC_PATH) {
    state.execBody = body;
    if (body.actId) state.actId = body.actId;
  } else if (path === TASK_LIST_PATH) {
    state.taskListBody = body;
    if (body.actId) state.taskActId = body.actId;
  } else if (path === TASK_DETAIL_PATH) {
    state.taskDetailBody = body;
    if (body.actId) state.taskActId = body.actId;
    if (body.taskId) state.lastTaskId = body.taskId;
  } else if (path === TASK_FINISH_PATH) {
    state.taskFinishBody = body;
    if (body.actId) state.taskActId = body.actId;
    if (body.taskId) state.lastTaskId = body.taskId;
  } else if (path === TASK_AWARD_PATH) {
    state.taskAwardBody = body;
    if (body.actId) state.taskActId = body.actId;
    if (body.taskId) state.lastTaskId = body.taskId;
  } else if (path === DRESS_RECORD_PATH) {
    state.dressRecordBody = body;
  }

  state.updatedAt = isoNow();
  saveState(state);
  $.write(state.updatedAt, STORE_CAPTURE_KEY);

  const templateName =
    path === INFO_PATH
      ? 'info 模板'
      : path === EXEC_PATH
        ? 'exec 模板'
        : path === TASK_LIST_PATH
          ? 'getTaskList 模板'
          : path === TASK_DETAIL_PATH
            ? 'getTaskDetail 模板'
            : path === TASK_FINISH_PATH
              ? 'finishTask 模板'
              : path === TASK_AWARD_PATH
                ? 'getAward 模板'
                : path === DRESS_RECORD_PATH
                  ? 'getDressRecord 模板'
                  : '模板';
  logResult('已抓取' + templateName, '');
  $.msg(APP_NAME, '抓包成功', '已更新 ' + templateName);
}

async function runSignIn() {
  const state = getState();
  logResult('开始执行', '');

  if (!state.cookie) {
    logResult('缺少 Cookie', '请先打开签到页抓包');
    $.msg(APP_NAME, '缺少 Cookie', '请先打开签到页抓包');
    return;
  }

  const infoBody = buildInfoBody(state);
  if (!infoBody) {
    logResult('缺少 info 模板', '请先打开签到页，让 signIn/info 请求经过脚本');
    $.msg(APP_NAME, '缺少 info 模板', '请先打开签到页，让 signIn/info 请求经过脚本');
    return;
  }

  logResult('先检查今日签到状态', '');
  const infoUrl = buildApiUrl(INFO_PATH, state.query, infoBody);
  const infoResp = await postSigned(infoUrl, infoBody, state);
  if (!infoResp.ok) {
    logResult('签到前检查失败', infoResp.message);
    $.msg(APP_NAME, '签到前检查失败', infoResp.message);
    return;
  }

  const infoJson = infoResp.json || {};
  if (Number(infoJson.code) !== 1) {
    const detail = infoJson.msg || ('code=' + (infoJson.code || 'unknown'));
    logResult('签到前检查失败', detail);
    $.msg(APP_NAME, '签到前检查失败', detail);
    return;
  }

  const infoData = infoJson.data || {};
  const signInInfo = infoData.signInInfo || {};
  const basicInfo = infoData.basicInfo || {};

  if (basicInfo.actId && basicInfo.actId !== state.actId) {
    state.actId = basicInfo.actId;
    saveState(state);
  }

  if (Number(signInInfo.todaySinged) === 1) {
    const signedDay = extractSignedDay(infoData);
    const detail = signedDay
      ? '已连续签到 ' + (signInInfo.cycleDays || 0) + ' 天，签到日期 ' + signedDay
      : '已连续签到 ' + (signInInfo.cycleDays || 0) + ' 天';
    logResult('今日已签到', detail);
    $.msg(APP_NAME, '今日已签到', detail);
    return;
  }

  const actId = basicInfo.actId || state.actId;
  if (!actId) {
    logResult('缺少 actId', '请重新打开签到页抓包');
    $.msg(APP_NAME, '缺少 actId', '请重新打开签到页抓包');
    return;
  }

  logResult('提交签到请求', '');
  const execBody = buildExecBody(state, infoBody, actId);
  const execUrl = buildApiUrl(EXEC_PATH, state.query, execBody);
  const execResp = await postSigned(execUrl, execBody, state);
  if (!execResp.ok) {
    logResult('签到请求失败', execResp.message);
    $.msg(APP_NAME, '签到请求失败', execResp.message);
    return;
  }

  const execJson = execResp.json || {};
  if (Number(execJson.code) !== 1) {
    const detail = execJson.msg || stringify(execJson);
    logResult('签到失败', detail);
    $.msg(APP_NAME, '签到失败', detail);
    return;
  }

  logResult('签到成功，正在校验结果', '');
  const verifyResp = await postSigned(infoUrl, infoBody, state);
  if (!verifyResp.ok) {
    logResult('签到后校验失败', verifyResp.message);
    $.msg(APP_NAME, '签到后校验失败', verifyResp.message);
    return;
  }

  const verifyJson = verifyResp.json || {};
  const verifyInfo = (((verifyJson || {}).data || {}).signInInfo) || {};
  if (Number(verifyInfo.todaySinged) === 1) {
    const rewardText = formatReward(execJson.data || {});
    const detail = rewardText
      ? rewardText + '，已连续签到 ' + (verifyInfo.cycleDays || 0) + ' 天'
      : '已连续签到 ' + (verifyInfo.cycleDays || 0) + ' 天';
    logResult('签到成功', detail);
    $.msg(APP_NAME, rewardText ? '签到成功，' + rewardText : '签到成功', '已连续签到 ' + (verifyInfo.cycleDays || 0) + ' 天');
    return;
  }

  logResult('签到结果待确认', stringify(execJson));
  $.msg(APP_NAME, '签到结果待确认', stringify(execJson));
}

async function runCommonTasks() {
  const state = getState();
  logResult('开始执行任务', '');

  if (!state.cookie) {
    logResult('缺少 Cookie', '请先打开签到页抓包');
    $.msg(APP_NAME, '缺少 Cookie', '请先打开签到页抓包');
    return;
  }

  const taskBase = buildTaskBase(state);
  if (!taskBase) {
    logResult('缺少任务模板', '请先打开签到页，让 commonTask 请求经过脚本');
    $.msg(APP_NAME, '缺少任务模板', '请先打开签到页，让 commonTask 请求经过脚本');
    return;
  }

  const actId = taskBase.actId || state.taskActId || state.actId;
  if (!actId) {
    logResult('缺少 actId', '请重新打开签到页抓包');
    $.msg(APP_NAME, '缺少 actId', '请重新打开签到页抓包');
    return;
  }
  taskBase.actId = actId;

  const listUrl = buildApiUrl(TASK_LIST_PATH, state.query, taskBase);
  const listResp = await postSigned(listUrl, taskBase, state);
  if (!listResp.ok) {
    logResult('任务列表请求失败', listResp.message);
    $.msg(APP_NAME, '任务列表请求失败', listResp.message);
    return;
  }

  const listJson = listResp.json || {};
  if (Number(listJson.code) !== 1) {
    const detail = listJson.msg || ('code=' + (listJson.code || 'unknown'));
    logResult('任务列表获取失败', detail);
    $.msg(APP_NAME, '任务列表获取失败', detail);
    return;
  }

  const taskList = ((listJson.data || {}).taskList) || [];
  if (!taskList.length) {
    logResult('任务列表为空', '');
    $.msg(APP_NAME, '任务列表为空', '');
    return;
  }

  let finished = 0;
  let awarded = 0;
  let skipped = 0;
  let failed = 0;
  const detailLines = [];

  for (let i = 0; i < taskList.length; i += 1) {
    const task = taskList[i] || {};
    const taskId = task.taskId || '';
    const baseTaskName = task.taskName || taskId;
    if (!taskId) {
      skipped += 1;
      detailLines.push('未知任务 | 跳过');
      continue;
    }

    const detailBody = buildTaskBody(taskBase, { actId: actId, taskId: taskId });
    const detailUrl = buildApiUrl(TASK_DETAIL_PATH, state.query, detailBody);
    const detailResp = await postSigned(detailUrl, detailBody, state);
    if (!detailResp.ok || !detailResp.json || Number(detailResp.json.code) !== 1) {
      failed += 1;
      detailLines.push(baseTaskName + ' | 详情失败');
      continue;
    }

    const detailData = detailResp.json.data || {};
    const userTaskId = detailData.userTaskId || task.userTaskId || '';
    const taskStatus = Number(
      detailData.taskStatus != null ? detailData.taskStatus : task.taskStatus || 0
    );
    const taskName = detailData.taskName || baseTaskName;
    const awardNum = detailData.awardNum || task.awardNum || '';
    const awardType = detailData.awardType || task.awardType || '';
    const awardText = formatTaskAward(awardType, awardNum);

    if (!userTaskId) {
      skipped += 1;
      detailLines.push(taskName + ' | 跳过' + (awardText ? ' | ' + awardText : ''));
      continue;
    }

    if (taskStatus === 2) {
      skipped += 1;
      detailLines.push(taskName + ' | 已领奖' + (awardText ? ' | ' + awardText : ''));
      continue;
    }

    if (taskStatus === 0) {
      const finishBody = buildTaskBody(taskBase, { actId: actId, taskId: taskId, userTaskId: userTaskId });
      const finishUrl = buildApiUrl(TASK_FINISH_PATH, state.query, finishBody);
      const finishResp = await postSigned(finishUrl, finishBody, state);
      if (!finishResp.ok || !finishResp.json || Number(finishResp.json.code) !== 1) {
        failed += 1;
        detailLines.push(taskName + ' | 完成失败' + (awardText ? ' | ' + awardText : ''));
        continue;
      }
      finished += 1;
    }

    const awardBody = buildTaskBody(taskBase, { actId: actId, taskId: taskId, userTaskId: userTaskId });
    const awardUrl = buildApiUrl(TASK_AWARD_PATH, state.query, awardBody);
    const awardResp = await postSigned(awardUrl, awardBody, state);
    if (awardResp.ok && awardResp.json && Number(awardResp.json.code) === 1) {
      awarded += 1;
      detailLines.push(taskName + ' | 已领奖' + (awardText ? ' | ' + awardText : ''));
    } else {
      failed += 1;
      detailLines.push(taskName + ' | 领奖失败' + (awardText ? ' | ' + awardText : ''));
    }
  }

  const summary = 'finish ' + finished + ', award ' + awarded + ', skip ' + skipped + ', fail ' + failed;
  const detailText = trimText(detailLines.join('\n'), 360);
  logResult('任务执行完成', summary);
  logResult('任务详情', detailText);
  $.msg(APP_NAME, '任务执行完成', summary + '\n' + detailText);
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

function buildExecBody(state, infoBody, actId) {
  const body = Object.assign({}, state.execBody || {}, infoBody || {});
  delete body.sceneCode;
  body.actId = actId;
  return body;
}

function buildTaskBase(state) {
  const source =
    state.taskListBody ||
    state.taskDetailBody ||
    state.taskFinishBody ||
    state.taskAwardBody ||
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
    if (overrides[key] !== undefined && overrides[key] !== null) {
      body[key] = overrides[key];
    }
  });
  return body;
}

function formatTaskAward(awardType, awardNum) {
  if (!awardNum && !awardType) return '';
  const typeText = awardType ? 'type ' + awardType : '';
  const numText = awardNum ? String(awardNum) : '';
  if (numText && typeText) return '奖励 ' + numText + ' (' + typeText + ')';
  if (numText) return '奖励 ' + numText;
  return '奖励 ' + typeText;
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

  const mergedCookie = mergeCookie(state.cookie || '', response.headers || {});
  if (mergedCookie && mergedCookie !== state.cookie) {
    state.cookie = mergedCookie;
    state.updatedAt = isoNow();
    saveState(state);
  }

  const json = safeJsonParse(response.body || '');
  if (!json) {
    return {
      ok: false,
      message: '响应不是 JSON: ' + trimText(response.body || '', 120)
    };
  }

  return {
    ok: Number(response.status) === 200,
    status: response.status,
    headers: response.headers || {},
    body: response.body || '',
    json: json,
    message: Number(response.status) === 200 ? '' : 'HTTP ' + response.status
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

function getCookieValue(cookie, name) {
  const matched = String(cookie || '').match(new RegExp('(?:^|;\\s*)' + escapeRegExp(name) + '=([^;]*)'));
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
    .map((key) => key + '=' + jar[key])
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

function extractSignedDay(infoData) {
  const list = infoData.signInList || [];
  for (let i = list.length - 1; i >= 0; i -= 1) {
    if (Number(list[i].status) === 1 && list[i].signedDate) {
      return formatDateText(list[i].signedDate);
    }
  }
  return '';
}

function formatReward(data) {
  if (!data) return '';
  const subsidy = data.subsidy || {};
  if (subsidy.handOutNum) {
    const until = formatTimestamp(subsidy.effectTimeTo || data.awardEndTime);
    return until ? '获得 ' + subsidy.handOutNum + ' 补贴，截止 ' + until : '获得 ' + subsidy.handOutNum + ' 补贴';
  }
  if (data.awardType) {
    return '获得签到奖励（类型 ' + data.awardType + '）';
  }
  return '';
}

function formatTimestamp(value) {
  const num = Number(value);
  if (!num) return '';
  const date = new Date(num);
  return (
    date.getFullYear() +
    '-' +
    pad2(date.getMonth() + 1) +
    '-' +
    pad2(date.getDate()) +
    ' ' +
    pad2(date.getHours()) +
    ':' +
    pad2(date.getMinutes())
  );
}

function formatDateText(value) {
  const text = String(value || '');
  if (!/^\d{8}$/.test(text)) return text;
  return text.slice(0, 4) + '-' + text.slice(4, 6) + '-' + text.slice(6, 8);
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
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

function pad2(value) {
  return String(value).padStart(2, '0');
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

function logResult(title, detail) {
  $.log('唯品会签到：' + title + (detail ? ' | ' + detail : ''));
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

  while (words.length % 16 !== 14) words.push(0);
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
