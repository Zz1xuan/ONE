/*
用途：
1. 抓取用户自己的 Cookie / 必要请求头 / body 模板
2. 自动执行：查询签到状态 -> 签到 -> 获取任务列表 -> 完成待完成任务

需要抓到的请求：
- /restapi/soa2/18903/getAttendanceConData
- /restapi/soa2/18903/attendanceDay
- /restapi/soa2/20707/getCreditTask
- /restapi/soa2/14593/FinishVipCredit

[rewrite_local]
^https:\/\/m\.suanya\.com\/restapi\/soa2\/.* url script-request-body https://raw.githubusercontent.com/Zz1xuan/ONE/refs/heads/main/Task/ZhiXing/ZhiXing.js

[task_local]
5 9 * * * https://raw.githubusercontent.com/Zz1xuan/ONE/refs/heads/main/Task/ZhiXing/ZhiXing.js, tag=智行签到任务

[mitm]
hostname = m.suanya.com
*/

const APP_NAME = '智行签到任务';
const STORE_KEY = 'ZX_TASK_SIGN_STATE_V2';
const HOST = 'https://m.suanya.com';

const STATUS_PATH = '/restapi/soa2/18903/getAttendanceConData';
const SIGN_PATH = '/restapi/soa2/18903/attendanceDay';
const TASK_LIST_PATH = '/restapi/soa2/20707/getCreditTask';
const FINISH_TASK_PATH = '/restapi/soa2/14593/FinishVipCredit';
const ACTIVITY_INFO_PATH = '/restapi/soa2/17679/get2020ZtripIntergrationDailyAttendanceInfo';
const ACTIVITY_RECORD_PATH = '/restapi/soa2/17679/get2020ZtripIntergrationDailyAttendanceRecord';
const ACTIVITY_ENROLL_PATH = '/restapi/soa2/17679/attend2020ZtripIntergrationDailyAttendance';
const ACTIVITY_PUNCH_PATH = '/restapi/soa2/17679/join2020ZtripIntergrationDailyAttendance';
const ACTIVITY_SHARE_PATH = '/restapi/soa2/17679/share2020ZtripIntergrationDailyAttendance';

const REQUEST_GAP_MS = 3000;
const BUSY_RETRY_TIMES = 1;
const CAPTURE_POST_PATHS = [
  STATUS_PATH,
  SIGN_PATH,
  TASK_LIST_PATH,
  FINISH_TASK_PATH,
  ACTIVITY_INFO_PATH,
  ACTIVITY_RECORD_PATH,
  ACTIVITY_ENROLL_PATH,
  ACTIVITY_PUNCH_PATH,
  ACTIVITY_SHARE_PATH
];
const COMMON_HEADER_KEYS = [
  'user-agent',
  'content-type',
  'origin',
  'referer',
  'x-ctx-rmstoken',
  'x-ctx-ubt-pageid',
  'x-ctx-ubt-pvid',
  'x-ctx-ubt-sid',
  'x-ctx-ubt-vid'
];
const OPTIONAL_CTX_HEADER_KEYS = [
  'x-ctx-rmstoken',
  'x-ctx-ubt-pageid',
  'x-ctx-ubt-pvid',
  'x-ctx-ubt-sid',
  'x-ctx-ubt-vid'
];

/*
 * 以下默认模板来自 HAR 中状态正常、字段较完整的一组请求。
 * 如果你后续在 Quantumult X 中抓到同接口真实请求，脚本会自动用新模板覆盖。
 */
const DEFAULT_STATUS_BODY = {
  needError: false,
  head: {
    cid: '52081165491263938705',
    ctok: '',
    cver: '710.208',
    lang: '01',
    sid: '4505',
    syscode: '12',
    auth: '',
    xsid: '',
    extension: [
      { name: 'reqTime', value: '1776210775' },
      { name: 'partner', value: 'zhixing' },
      { name: 'platform', value: 'ios' },
      { name: 'clientInfo', value: 'h5| CPU iPhone OS 18_7 like Mac OS X' },
      { name: 'appid', value: '5208' },
      { name: 'appVersion', value: '10.20.8' },
      { name: 'correctVersion', value: '710208' },
      { name: 'channel', value: 'ZXLI' }
    ]
  }
};

const DEFAULT_SIGN_BODY = {
  sourceType: 0,
  type: 1,
  needError: false,
  head: {
    cid: '52081165491263938705',
    ctok: '',
    cver: '710.208',
    lang: '01',
    sid: '4505',
    syscode: '12',
    auth: '',
    xsid: '',
    extension: [
      { name: 'reqTime', value: '1776210778' },
      { name: 'partner', value: 'zhixing' },
      { name: 'platform', value: 'ios' },
      { name: 'clientInfo', value: 'h5| CPU iPhone OS 18_7 like Mac OS X' },
      { name: 'appid', value: '5208' },
      { name: 'appVersion', value: '10.20.8' },
      { name: 'correctVersion', value: '710208' },
      { name: 'channel', value: 'ZXLI' }
    ]
  }
};

const DEFAULT_TASK_LIST_BODY = {
  sourceType: 0,
  needError: false,
  head: {
    cid: '52081165491263938705',
    ctok: '',
    cver: '710.208',
    lang: '01',
    sid: '4505',
    syscode: '12',
    auth: '',
    xsid: '',
    extension: [
      { name: 'reqTime', value: '1776210775' },
      { name: 'partner', value: 'zhixing' },
      { name: 'platform', value: 'ios' },
      { name: 'clientInfo', value: 'h5| CPU iPhone OS 18_7 like Mac OS X' },
      { name: 'appid', value: '5208' },
      { name: 'appVersion', value: '10.20.8' },
      { name: 'correctVersion', value: '710208' },
      { name: 'channel', value: 'ZXLI' }
    ]
  }
};

const DEFAULT_FINISH_TASK_BODY = {
  pageCode: 'anmuxi',
  code: 'vipWelfare',
  abVersion: '32',
  needError: false,
  head: {
    cid: '52081165491263938705',
    ctok: '',
    cver: '710.208',
    lang: '01',
    sid: '4505',
    syscode: '12',
    auth: '',
    xsid: '',
    extension: [
      { name: 'reqTime', value: '1776210783' },
      { name: 'partner', value: 'zhixing' },
      { name: 'platform', value: 'ios' },
      { name: 'clientInfo', value: 'h5| CPU iPhone OS 18_7 like Mac OS X' },
      { name: 'appid', value: '5208' },
      { name: 'appVersion', value: '10.20.8' },
      { name: 'correctVersion', value: '710208' },
      { name: 'channel', value: 'ZXLI' }
    ]
  }
};

const DEFAULT_SIGN_PAYLOAD_SOURCE =
  '1.0.9@102!hBONwFyDN2kbGrt/OS4nGP9PGrOHGPAZK2Fa9ltR9E9lGrGn+ENaKSAbOrK2+ET5+rApbbbpOST2KlA5OSTROlG/bEkbKtb/KlbRKrA2OrtIKr42KSVS+ET5OtbpOS4SOrAnOS4LOSqLQlqIOldvt6qLNLh1rbb=';

const DEFAULT_FINISH_PAYLOAD_SOURCE =
  '1.0.9@102!O2CSGaOtOXAbGSjaOSyVOX42+6qn9lNPO6NV+rK2+6FaOl4Z9P4I9EbbOrK2+ET5+rApbbbpOST2KlA5OSkS+EqIbEkbKtb/KlbRKrA2OrtIKr42KSVS+ET5OtbpOS4SOrAnOS4LOSqLQlqIOldvt6qLNLh1rbb=';

const DEFAULT_COMMON_HEADERS = {
  'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148_Tieyou_TieyouWireless_10.21.2_partner_zhixing_aid_5208_cDevice=iPhone 13_isPhoneX=1__cSize=w390*h844_&cw=1isiPhoneX_correctVersion=710212_ Version/26.4.2 (like Safari/605.1.15)',
  'content-type': 'application/json',
  origin: 'https://m.suanya.com',
  referer: 'https://m.suanya.com/yun/common/travelXiaozhi/home?isHideNavBar=YES&isImmersiveMode=YES&disablePredownload=true&zt_needlogin=1&from_native_page=1',
  'x-ctx-rmstoken': '',
  'x-ctx-ubt-pageid': '',
  'x-ctx-ubt-pvid': '',
  'x-ctx-ubt-sid': '',
  'x-ctx-ubt-vid': ''
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

Env.prototype.msg = function (title, subTitle, desc) {
  if (this.isQX) {
    $notify(title, subTitle, desc);
    return;
  }
  $notification.post(title, subTitle, desc);
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
    await capture();
  } else {
    await run();
  }
})()
  .catch((err) => {
    const message = formatError(err);
    logStep('执行异常', message);
    $.msg(APP_NAME, '执行异常', message);
  })
  .finally(() => $.done({}));

async function capture() {
  const url = $request.url || '';
  const method = String($request.method || 'GET').toUpperCase();
  const path = getPath(url);

  if (method !== 'POST') {
    logStep('忽略请求', method + ' ' + path);
    return;
  }

  if (!CAPTURE_POST_PATHS.includes(path)) {
    return;
  }

  const state = withDefaults(getState());
  const headers = lowerCaseHeaders($request.headers || {});
  const body = parseJsonSafe($request.body || '{}');
  const query = parseQuery(url);

  if (headers.cookie) state.cookie = headers.cookie;
  state.commonHeaders = mergeCommonHeaders(state.commonHeaders, headers);

  if (query._fxpcqlniredt) state.query._fxpcqlniredt = query._fxpcqlniredt;
  if (query['x-traceID']) state.query['x-traceID'] = query['x-traceID'];

  if (path === STATUS_PATH && hasObjectKeys(body)) {
    state.statusBody = body;
  }
  if (path === SIGN_PATH && hasObjectKeys(body)) {
    state.signBody = body;
    state.signHeaders['w-payload-source'] =
      headers['w-payload-source'] || state.signHeaders['w-payload-source'];
  }
  if (path === TASK_LIST_PATH && hasObjectKeys(body)) {
    state.taskListBody = body;
  }
  if (path === FINISH_TASK_PATH && hasObjectKeys(body)) {
    state.finishTaskBody = body;
    state.finishTaskHeaders['w-payload-source'] =
      headers['w-payload-source'] || state.finishTaskHeaders['w-payload-source'];
  }
  if (path === ACTIVITY_INFO_PATH && hasObjectKeys(body)) {
    state.activityInfoBody = body;
    state.activityInfoHeaders['w-payload-source'] =
      headers['w-payload-source'] || state.activityInfoHeaders['w-payload-source'];
  }
  if (path === ACTIVITY_RECORD_PATH && hasObjectKeys(body)) {
    state.activityRecordBody = body;
    state.activityRecordHeaders['w-payload-source'] =
      headers['w-payload-source'] || state.activityRecordHeaders['w-payload-source'];
  }
  if (path === ACTIVITY_ENROLL_PATH && hasObjectKeys(body)) {
    state.activityEnrollBody = body;
    state.activityEnrollHeaders['w-payload-source'] =
      headers['w-payload-source'] || state.activityEnrollHeaders['w-payload-source'];
  }
  if (path === ACTIVITY_PUNCH_PATH && hasObjectKeys(body)) {
    state.activityPunchBody = body;
    state.activityPunchHeaders['w-payload-source'] =
      headers['w-payload-source'] || state.activityPunchHeaders['w-payload-source'];
  }
  if (path === ACTIVITY_SHARE_PATH && hasObjectKeys(body)) {
    state.activityShareBody = body;
    state.activityShareHeaders['w-payload-source'] =
      headers['w-payload-source'] || state.activityShareHeaders['w-payload-source'];
  }

  state.updatedAt = isoNow();
  saveState(state);

  const tip =
    '路径=' +
    path +
    '\n已保存 cookie=' +
    (state.cookie ? '是' : '否') +
    '\n模板来源=' +
    (hasObjectKeys(body) ? '实时请求' : '沿用默认');

  logStep('抓包成功', tip.replace(/\n/g, ' | '));
  $.msg(APP_NAME, '抓包成功', tip);
}

async function run() {
  const state = withDefaults(getState());
  const logs = [];

  logStep('开始执行', '主流程=签到 + 任务完成');

  if (!state.cookie) {
    const tip = '请先打开智行相关页面，让上述 4 个接口中的任意一个经过脚本以保存 ck。';
    logStep('缺少 ck', tip);
    $.msg(APP_NAME, '缺少 ck', tip);
    return;
  }

  const signMessage = await doSign(state);
  logs.push(signMessage);

  await sleep(REQUEST_GAP_MS);

  const activityMessage = await doDailyAttendanceActivityV2(state);
  logs.push(activityMessage);

  await sleep(REQUEST_GAP_MS);

  const taskMessage = await doTasks(state);
  logs.push(taskMessage);

  const summary = logs.filter(Boolean).join('\n');
  logStep('执行完成', summary.replace(/\n/g, ' | '));
  $.msg(APP_NAME, '执行完成', summary);
}

async function doSign(state) {
  const statusBody = buildBody(state.statusBody, state);
  const statusResult = await callApiWithRetry('签到状态', STATUS_PATH, statusBody, state, 'status');
  if (!statusResult.ok) {
    return '签到状态失败: ' + statusResult.message;
  }

  const statusJson = statusResult.json || {};
  if (Number(statusJson.resultCode) !== 1) {
    return '签到状态失败: ' + (statusJson.resultMessage || briefJson(statusJson));
  }

  if (statusJson.attendanceTodayFlag === true) {
    return '今日已签到';
  }

  await sleep(REQUEST_GAP_MS);

  const signBody = buildBody(state.signBody, state);
  const signResult = await callApiWithRetry('执行签到', SIGN_PATH, signBody, state, 'sign');
  if (!signResult.ok) {
    return '签到失败: ' + signResult.message;
  }

  const signJson = signResult.json || {};
  if (Number(signJson.resultCode) !== 1) {
    return '签到失败: ' + (signJson.resultMessage || briefJson(signJson));
  }

  return '签到成功, 奖励=' + (signJson.expandCredit || signJson.credit || 0);
}

async function doTasks(state) {
  const taskListBody = buildBody(state.taskListBody, state);
  const taskListResult = await callApiWithRetry('任务列表', TASK_LIST_PATH, taskListBody, state, 'taskList');
  if (!taskListResult.ok) {
    return '任务列表失败: ' + taskListResult.message;
  }

  const taskJson = taskListResult.json || {};
  const taskList = extractTaskList(taskJson);

  if (Number(taskJson.resultCode) !== 1 && !taskList.length) {
    return '任务列表失败: ' + (taskJson.resultMessage || briefJson(taskJson));
  }

  if (!taskList.length) {
    return '任务列表为空';
  }

  const todoList = taskList.filter((item) => Number(item.state) === 0);
  const doneList = [];

  logStep('任务统计', '总数=' + taskList.length + ' | 待完成=' + todoList.length);

  if (!todoList.length) {
    return '没有待完成任务';
  }

  for (let i = 0; i < todoList.length; i += 1) {
    const task = todoList[i] || {};
    const name = getTaskName(task);
    const finishBody = buildFinishTaskBody(state, task);
    const finishResult = await callApiWithRetry(
      '完成任务[' + (i + 1) + '/' + todoList.length + ']',
      FINISH_TASK_PATH,
      finishBody,
      state,
      'finishTask',
      { taskName: name, taskCode: task.code || '', pageCode: finishBody.pageCode || '' }
    );

    if (!finishResult.ok) {
      doneList.push(name + ': 失败(' + finishResult.message + ')');
    } else {
      const finishJson = finishResult.json || {};
      if (Number(finishJson.resultCode) === 1) {
        doneList.push(name + ': 成功(+' + (finishJson.sendCredit || finishJson.expandCredit || 0) + ')');
      } else {
        doneList.push(name + ': 失败(' + (finishJson.resultMessage || briefJson(finishJson)) + ')');
      }
    }

    if (i !== todoList.length - 1) {
      await sleep(REQUEST_GAP_MS);
    }
  }

  return '任务结果\n' + doneList.join('\n');
}

async function doDailyAttendanceActivity(state) {
  const infoResult = await callApiWithRetry(
    '瓜分活动状态',
    ACTIVITY_INFO_PATH,
    buildBody(state.activityInfoBody, state),
    state,
    'activityInfo'
  );
  if (!infoResult.ok) {
    return '瓜分活动失败: ' + infoResult.message;
  }

  let infoJson = infoResult.json || {};
  if (Number(infoJson.resultCode) !== 1) {
    return '瓜分活动失败: ' + (infoJson.resultMessage || briefJson(infoJson));
  }
  if (infoJson.isLogin === false) {
    return '瓜分活动: 当前未登录';
  }

  logStep('瓜分活动状态', formatActivityInfo(infoJson));
  const actionLogs = [];

  if (infoJson.attendFlag === false) {
    await sleep(REQUEST_GAP_MS);
    const enrollResult = await callApiWithRetry(
      '瓜分活动报名',
      ACTIVITY_ENROLL_PATH,
      buildBody(state.activityEnrollBody, state),
      state,
      'activityEnroll'
    );
    if (!enrollResult.ok) {
      return '瓜分活动报名失败: ' + enrollResult.message;
    }

    const enrollJson = enrollResult.json || {};
    if (Number(enrollJson.resultCode) !== 1) {
      return '瓜分活动报名失败: ' + (enrollJson.resultMessage || briefJson(enrollJson));
    }
    actionLogs.push(extractMessage(enrollJson) || '报名成功');

    await sleep(REQUEST_GAP_MS);
    const refreshAfterEnroll = await callApiWithRetry(
      '报名后刷新状态',
      ACTIVITY_INFO_PATH,
      buildBody(state.activityInfoBody, state),
      state,
      'activityInfo'
    );
    if (
      refreshAfterEnroll.ok &&
      refreshAfterEnroll.json &&
      Number(refreshAfterEnroll.json.resultCode) === 1
    ) {
      infoJson = refreshAfterEnroll.json;
      logStep('报名后状态', formatActivityInfo(infoJson));
    }
  }

  if (infoJson.todayAttendanceFlag !== true) {
    await sleep(REQUEST_GAP_MS);
    const punchResult = await callApiWithRetry(
      '瓜分活动打卡',
      ACTIVITY_PUNCH_PATH,
      buildBody(state.activityPunchBody, state),
      state,
      'activityPunch'
    );
    if (!punchResult.ok) {
      return '瓜分活动打卡失败: ' + punchResult.message;
    }

    const punchJson = punchResult.json || {};
    if (Number(punchJson.resultCode) !== 1) {
      return '瓜分活动打卡失败: ' + (punchJson.resultMessage || briefJson(punchJson));
    }
    actionLogs.push(extractMessage(punchJson) || '打卡成功');

    await sleep(REQUEST_GAP_MS);
    const refreshAfterPunch = await callApiWithRetry(
      '打卡后刷新状态',
      ACTIVITY_INFO_PATH,
      buildBody(state.activityInfoBody, state),
      state,
      'activityInfo'
    );
    if (
      refreshAfterPunch.ok &&
      refreshAfterPunch.json &&
      Number(refreshAfterPunch.json.resultCode) === 1
    ) {
      infoJson = refreshAfterPunch.json;
      logStep('打卡后状态', formatActivityInfo(infoJson));
    }
  } else {
    actionLogs.push('今日已打卡');
  }

  const lines = [];
  lines.push('瓜分活动: ' + actionLogs.join(' / '));
  lines.push(formatActivityInfo(infoJson));

  const recordResult = await callApiWithRetry(
    '瓜分活动记录',
    ACTIVITY_RECORD_PATH,
    buildBody(state.activityRecordBody, state),
    state,
    'activityRecord'
  );
  if (recordResult.ok && recordResult.json && Number(recordResult.json.resultCode) === 1) {
    lines.push(formatActivityRecord(recordResult.json));
  }

  return lines.filter(Boolean).join('\\n');
}

async function doDailyAttendanceActivityV2(state) {
  const infoResult = await callApiWithRetry(
    '瓜分活动状态',
    ACTIVITY_INFO_PATH,
    buildBody(state.activityInfoBody, state),
    state,
    'activityInfo'
  );
  if (!infoResult.ok) {
    return '瓜分活动失败: ' + infoResult.message;
  }

  let infoJson = infoResult.json || {};
  if (Number(infoJson.resultCode) !== 1) {
    return '瓜分活动失败: ' + (infoJson.resultMessage || briefJson(infoJson));
  }
  if (infoJson.isLogin === false) {
    return '瓜分活动: 当前未登录';
  }

  logStep('瓜分活动状态', formatActivityInfoV2(infoJson));
  const actionLogs = [];

  if (infoJson.attendFlag === true) {
    actionLogs.push('已报名');
  } else {
    actionLogs.push('attendFlag=否');
  }

  if (infoJson.todayAttendanceFlag !== true) {
    await sleep(REQUEST_GAP_MS);
    const beforeCredit = toNumberOrNull(infoJson.credit);
    let punchDone = false;
    let lastPunchMessage = '';

    const tryPunch = async (name, path, bodyKey, headerType) => {
      const result = await callApiWithRetry(
        name,
        path,
        buildBody(state[bodyKey], state),
        state,
        headerType
      );
      if (!result.ok) {
        lastPunchMessage = result.message;
        return false;
      }

      const json = result.json || {};
      if (Number(json.resultCode) !== 1) {
        lastPunchMessage = json.resultMessage || briefJson(json);
        return false;
      }

      actionLogs.push(extractMessage(json) || (name + '成功'));
      const refreshedInfo = await refreshActivityInfo(
        state,
        name + '后刷新状态'
      );
      if (refreshedInfo) {
        infoJson = refreshedInfo;
        logStep(name + '后状态', formatActivityInfoV2(infoJson));
      }

      if (infoJson.todayAttendanceFlag === true) {
        const afterCredit = toNumberOrNull(infoJson.credit);
        if (beforeCredit !== null && afterCredit !== null) {
          const diff = beforeCredit - afterCredit;
          if (diff > 0) {
            actionLogs.push('扣了' + diff + '积分');
          }
        }
        return true;
      }

      lastPunchMessage = '返回成功但 todayAttendanceFlag 未变更';
      return false;
    };

    if (state.activityEnrollHeaders['w-payload-source']) {
      punchDone = await tryPunch(
        '瓜分活动报名打卡',
        ACTIVITY_ENROLL_PATH,
        'activityEnrollBody',
        'activityEnroll'
      );
    }

    if (!punchDone) {
      if (state.activityPunchHeaders['w-payload-source']) {
        await sleep(REQUEST_GAP_MS);
        punchDone = await tryPunch(
          '瓜分活动直接打卡',
          ACTIVITY_PUNCH_PATH,
          'activityPunchBody',
          'activityPunch'
        );
      } else if (!state.activityEnrollHeaders['w-payload-source']) {
        actionLogs.push('未抓到打卡模板');
      }
    }

    if (!punchDone) {
      if (Number(infoJson.todayAttendanceFlag) === true || infoJson.todayAttendanceFlag === true) {
        actionLogs.push('已打卡');
      } else {
        return '瓜分活动打卡失败: ' + (lastPunchMessage || '未知原因');
      }
    }
  } else {
    actionLogs.push('已打卡');
  }

  if (state.activityShareHeaders['w-payload-source']) {
    await sleep(REQUEST_GAP_MS);
    const beforeShareCredit = toNumberOrNull(infoJson.credit);
    const shareResult = await callApiWithRetry(
      '瓜分活动分享',
      ACTIVITY_SHARE_PATH,
      buildBody(state.activityShareBody, state),
      state,
      'activityShare'
    );
    if (!shareResult.ok) {
      actionLogs.push('分享失败: ' + shareResult.message);
    } else {
      const shareJson = shareResult.json || {};
      if (Number(shareJson.resultCode) === 1) {
        actionLogs.push('已分享');
        const refreshedInfo = await refreshActivityInfo(
          state,
          '分享后刷新状态'
        );
        if (refreshedInfo) {
          infoJson = refreshedInfo;
          logStep('分享后状态', formatActivityInfoV2(infoJson));

          const afterShareCredit = toNumberOrNull(infoJson.credit);
          if (beforeShareCredit !== null && afterShareCredit !== null) {
            const gain = afterShareCredit - beforeShareCredit;
            if (gain > 0) {
              actionLogs.push('分享奖励+' + gain);
            }
          }
        }
      } else {
        actionLogs.push('分享返回: ' + (shareJson.resultMessage || briefJson(shareJson)));
      }
    }
  } else {
    actionLogs.push('未抓到分享模板');
  }

  const lines = [];
  lines.push('瓜分活动: ' + actionLogs.join(' / '));
  lines.push(formatActivityInfoV2(infoJson));

  const recordResult = await callApiWithRetry(
    '瓜分活动记录',
    ACTIVITY_RECORD_PATH,
    buildBody(state.activityRecordBody, state),
    state,
    'activityRecord'
  );
  if (recordResult.ok && recordResult.json && Number(recordResult.json.resultCode) === 1) {
    lines.push(formatActivityRecordV2(recordResult.json));
  }

  return lines.filter(Boolean).join('\n');
}

async function callApiWithRetry(name, path, body, state, headerType, extraInfo) {
  const maxTry = 1 + BUSY_RETRY_TIMES;
  let lastResult = null;

  for (let attempt = 1; attempt <= maxTry; attempt += 1) {
    const url = buildUrl(path, state, body);
    const headers = buildHeaders(state, headerType);
    logRequest(name, url, body, attempt, extraInfo);

    const result = await post(url, body, headers);
    logResponse(name, result, attempt);
    lastResult = result;

    if (!shouldRetryBusy(result, attempt, maxTry)) {
      return result;
    }

    logStep(name + '重试', '检测到系统繁忙，' + REQUEST_GAP_MS + 'ms 后重试');
    await sleep(REQUEST_GAP_MS);
  }

  return lastResult || {
    ok: false,
    status: 0,
    json: null,
    message: 'unknown'
  };
}

async function post(url, body, headers) {
  try {
    const resp = await $.request({
      url: url,
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    });
    const json = parseJsonSafe(resp.body || '{}');
    const ok = resp.status >= 200 && resp.status < 300;
    return {
      ok: ok,
      status: resp.status,
      json: json,
      body: resp.body || '',
      message: extractMessage(json) || ('HTTP ' + resp.status)
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      json: null,
      body: '',
      message: formatError(err)
    };
  }
}

function buildHeaders(state, type) {
  const h = state.commonHeaders || DEFAULT_COMMON_HEADERS;
  const headers = {
    Cookie: state.cookie || '',
    'User-Agent': h['user-agent'] || DEFAULT_COMMON_HEADERS['user-agent'],
    'Content-Type': h['content-type'] || 'application/json',
    Accept: 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
    Origin: h.origin || DEFAULT_COMMON_HEADERS.origin,
    Referer: h.referer || DEFAULT_COMMON_HEADERS.referer,
    'x-ctx-wclient-req': randomHex(32)
  };

  OPTIONAL_CTX_HEADER_KEYS.forEach((key) => {
    if (h[key]) {
      headers[key] = h[key];
    }
  });

  if (type === 'sign') {
    headers['w-payload-source'] =
      state.signHeaders['w-payload-source'] || DEFAULT_SIGN_PAYLOAD_SOURCE;
  }

  if (type === 'activityInfo') {
    headers['w-payload-source'] = state.activityInfoHeaders['w-payload-source'] || headers['w-payload-source'];
  }

  if (type === 'activityRecord') {
    headers['w-payload-source'] = state.activityRecordHeaders['w-payload-source'] || headers['w-payload-source'];
  }

  if (type === 'activityEnroll') {
    headers['w-payload-source'] = state.activityEnrollHeaders['w-payload-source'] || headers['w-payload-source'];
  }

  if (type === 'activityPunch') {
    headers['w-payload-source'] = state.activityPunchHeaders['w-payload-source'] || headers['w-payload-source'];
  }

  if (type === 'activityShare') {
    headers['w-payload-source'] = state.activityShareHeaders['w-payload-source'] || headers['w-payload-source'];
  }

  return headers;
}

function buildBody(template, state) {
  const body = clone(template || {});
  const cid = resolveCid(body, state);
  const reqTime = String(Math.floor(Date.now() / 1000));

  if (body.head && body.head.cid != null) {
    body.head.cid = cid;
  }

  if (body.head && Array.isArray(body.head.extension)) {
    body.head.extension = body.head.extension.map((item) => {
      const next = clone(item);
      if (next.name === 'reqTime') {
        next.value = reqTime;
      }
      return next;
    });
  }

  return body;
}

function buildFinishTaskBody(state, task) {
  const body = buildBody(state.finishTaskBody, state);
  if (task.pageCode) body.pageCode = task.pageCode;
  if (task.code) body.code = task.code;
  if (!body.pageCode) body.pageCode = 'anmuxi';
  if (!body.code) body.code = 'vipWelfare';
  if (!body.abVersion) body.abVersion = '32';
  return body;
}

function buildUrl(path, state, body) {
  const cid = resolveCid(body, state);
  const query = clone(state.query || {});

  if (!query._fxpcqlniredt) {
    query._fxpcqlniredt = cid;
  }
  query['x-traceID'] = (query._fxpcqlniredt || cid || 'trace') + '-' + Date.now() + '-' + randomNum(7);

  const url = new URL(HOST + path);
  Object.keys(query).forEach((key) => {
    if (query[key]) {
      url.searchParams.set(key, query[key]);
    }
  });
  return url.toString();
}

function resolveCid(body, state) {
  const fromBody = body && body.head && body.head.cid;
  if (fromBody) return fromBody;

  const fromQuery = state.query && state.query._fxpcqlniredt;
  if (fromQuery) return fromQuery;

  const cookieMap = parseCookieMap(state.cookie || '');
  return cookieMap.GUID || cookieMap._n_cid || DEFAULT_STATUS_BODY.head.cid;
}

function extractTaskList(json) {
  if (!json || typeof json !== 'object') return [];
  if (Array.isArray(json.creditTaskList)) return json.creditTaskList;
  if (json.data && Array.isArray(json.data.creditTaskList)) return json.data.creditTaskList;
  if (json.data && Array.isArray(json.data.list)) return json.data.list;
  return [];
}

function formatActivityInfo(json) {
  if (!json || typeof json !== 'object') return '';
  const parts = [];
  parts.push('已报名=' + formatBoolFlag(json.attendFlag));
  parts.push('已打卡=' + formatBoolFlag(json.todayAttendanceFlag));
  if (json.paymentIntegration !== undefined) parts.push('需投入=' + json.paymentIntegration);
  if (json.credit !== undefined) parts.push('当前积分=' + json.credit);
  if (json.attendanceCount !== undefined) parts.push('当前人数=' + json.attendanceCount);
  if (json.totalIntergration !== undefined) parts.push('奖池积分=' + json.totalIntergration);
  if (json.expectedMaxAlloactionOnTomorrow !== undefined) {
    parts.push('明日预估=' + json.expectedMaxAlloactionOnTomorrow);
  }
  return parts.join(' | ');
}

function formatActivityRecord(json) {
  if (!json || typeof json !== 'object') return '';
  const parts = [];
  if (json.totalPayment !== undefined) parts.push('累计投入=' + json.totalPayment);
  if (json.totalAcquire !== undefined) parts.push('累计获得=' + json.totalAcquire);
  if (json.successDays !== undefined) parts.push('成功天数=' + json.successDays);
  const first = Array.isArray(json.recordList) && json.recordList.length ? json.recordList[0] : null;
  if (first) {
    parts.push(
      '记录详情=' +
        (first.day || '-') +
        '/' +
        'result=' +
        formatBoolFlag(first.result) +
        '/' +
        'pay=' +
        (first.paymentNumber || 0) +
        '/' +
        'get=' +
        (first.acquireNumber || 0)
    );
  }
  return parts.join(' | ');
}

function formatBoolFlag(value) {
  if (value === true) return '是';
  if (value === false) return '否';
  return String(value);
}

function formatBoolFlagV2(value) {
  if (value === true) return '是';
  if (value === false) return '否';
  return String(value);
}

function formatActivityInfoV2(json) {
  if (!json || typeof json !== 'object') return '';
  const parts = [];
  parts.push('已报名=' + formatBoolFlagV2(json.attendFlag));
  parts.push('已打卡=' + formatBoolFlagV2(json.todayAttendanceFlag));
  if (json.paymentIntegration !== undefined) parts.push('需投入=' + json.paymentIntegration);
  if (json.credit !== undefined) parts.push('当前积分=' + json.credit);
  if (json.attendanceCount !== undefined) parts.push('当前人数=' + json.attendanceCount);
  if (json.totalIntergration !== undefined) parts.push('奖池积分=' + json.totalIntergration);
  if (json.expectedMaxAlloactionOnTomorrow !== undefined) {
    parts.push('明日预估=' + json.expectedMaxAlloactionOnTomorrow);
  }
  return parts.join(' | ');
}

function formatActivityRecordV2(json) {
  if (!json || typeof json !== 'object') return '';
  const parts = [];
  if (json.totalPayment !== undefined) parts.push('累计投入=' + json.totalPayment);
  if (json.totalAcquire !== undefined) parts.push('累计获得=' + json.totalAcquire);
  if (json.successDays !== undefined) parts.push('成功天数=' + json.successDays);
  const first = Array.isArray(json.recordList) && json.recordList.length ? json.recordList[0] : null;
  if (first) {
    parts.push(
      '记录详情=' +
        (first.day || '-') +
        ' / ' +
        '结果=' +
        formatBoolFlagV2(first.result) +
        ' / ' +
        '投入=' +
        (first.paymentNumber || 0) +
        ' / ' +
        '获得=' +
        (first.acquireNumber || 0)
    );
  }
  return parts.join(' | ');
}

function getTaskName(task) {
  return (
    task.taskName ||
    task.title ||
    task.code ||
    task.pageCode ||
    '未命名任务'
  );
}

function shouldRetryBusy(result, attempt, maxTry) {
  if (attempt >= maxTry) return false;
  const text = String(
    (result && result.message) ||
      (result && result.json && (result.json.resultMessage || result.json.msg)) ||
      ''
  );
  return text.indexOf('系统繁忙') >= 0;
}

function extractMessage(json) {
  if (!json || typeof json !== 'object') return '';
  return json.resultMessage || json.msg || json.message || '';
}

function withDefaults(state) {
  const next = clone(state || {});
  next.commonHeaders = Object.assign({}, DEFAULT_COMMON_HEADERS, next.commonHeaders || {});
  next.query = Object.assign({ _fxpcqlniredt: '', 'x-traceID': '' }, next.query || {});
  next.statusBody = hasObjectKeys(next.statusBody) ? next.statusBody : clone(DEFAULT_STATUS_BODY);
  next.signBody = hasObjectKeys(next.signBody) ? next.signBody : clone(DEFAULT_SIGN_BODY);
  next.taskListBody = hasObjectKeys(next.taskListBody) ? next.taskListBody : clone(DEFAULT_TASK_LIST_BODY);
  next.finishTaskBody = hasObjectKeys(next.finishTaskBody) ? next.finishTaskBody : clone(DEFAULT_FINISH_TASK_BODY);
  next.activityInfoBody = hasObjectKeys(next.activityInfoBody)
    ? next.activityInfoBody
    : clone(DEFAULT_STATUS_BODY);
  next.activityRecordBody = hasObjectKeys(next.activityRecordBody)
    ? next.activityRecordBody
    : clone(DEFAULT_STATUS_BODY);
  next.activityEnrollBody = hasObjectKeys(next.activityEnrollBody)
    ? next.activityEnrollBody
    : clone(DEFAULT_STATUS_BODY);
  next.activityPunchBody = hasObjectKeys(next.activityPunchBody)
    ? next.activityPunchBody
    : clone(DEFAULT_STATUS_BODY);
  next.activityShareBody = hasObjectKeys(next.activityShareBody)
    ? next.activityShareBody
    : clone(DEFAULT_STATUS_BODY);
  next.signHeaders = Object.assign(
    { 'w-payload-source': DEFAULT_SIGN_PAYLOAD_SOURCE },
    next.signHeaders || {}
  );
  next.finishTaskHeaders = Object.assign(
    { 'w-payload-source': DEFAULT_FINISH_PAYLOAD_SOURCE },
    next.finishTaskHeaders || {}
  );
  next.activityInfoHeaders = Object.assign({}, next.activityInfoHeaders || {});
  next.activityRecordHeaders = Object.assign({}, next.activityRecordHeaders || {});
  next.activityEnrollHeaders = Object.assign({}, next.activityEnrollHeaders || {});
  next.activityPunchHeaders = Object.assign({}, next.activityPunchHeaders || {});
  next.activityShareHeaders = Object.assign({}, next.activityShareHeaders || {});
  return next;
}

function getState() {
  const raw = $.read(STORE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (err) {
    logStep('本地状态损坏', '已忽略旧数据');
    return {};
  }
}

function saveState(state) {
  $.write(JSON.stringify(state), STORE_KEY);
}

function getPath(url) {
  try {
    return new URL(url).pathname;
  } catch (err) {
    return '';
  }
}

function parseQuery(url) {
  try {
    const out = {};
    const u = new URL(url);
    u.searchParams.forEach((value, key) => {
      out[key] = value;
    });
    return out;
  } catch (err) {
    return {};
  }
}

function parseJsonSafe(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
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

function mergeCommonHeaders(baseHeaders, incomingHeaders) {
  const current = Object.assign({}, DEFAULT_COMMON_HEADERS, baseHeaders || {});
  COMMON_HEADER_KEYS.forEach((key) => {
    if (incomingHeaders[key]) {
      current[key] = incomingHeaders[key];
    }
  });
  return current;
}

function parseCookieMap(cookie) {
  const out = {};
  String(cookie || '')
    .split(/;\s*/)
    .filter(Boolean)
    .forEach((item) => {
      const idx = item.indexOf('=');
      if (idx > 0) {
        out[item.slice(0, idx)] = item.slice(idx + 1);
      }
    });
  return out;
}

function hasObjectKeys(obj) {
  return !!obj && typeof obj === 'object' && Object.keys(obj).length > 0;
}

function isSuccessResult(result) {
  return !!(result && result.ok && result.json && Number(result.json.resultCode) === 1);
}

function toNumberOrNull(value) {
  if (value === undefined) return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
}

async function refreshActivityInfo(state, actionName) {
  await sleep(REQUEST_GAP_MS);
  const result = await callApiWithRetry(
    actionName,
    ACTIVITY_INFO_PATH,
    buildBody(state.activityInfoBody, state),
    state,
    'activityInfo'
  );
  return isSuccessResult(result) ? result.json : null;
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
  if (err.stack) return err.stack;
  if (err.message) return err.message;
  try {
    return JSON.stringify(err);
  } catch (jsonErr) {
    return String(err);
  }
}

function briefJson(json) {
  try {
    return JSON.stringify(json).slice(0, 160);
  } catch (err) {
    return String(json);
  }
}

function logStep(title, detail) {
  $.log(APP_NAME + ' | ' + title + (detail ? ' | ' + detail : ''));
}

function logRequest(name, url, body, attempt, extraInfo) {
  const parts = [];
  parts.push('第' + attempt + '次');
  parts.push(url);
  if (extraInfo && typeof extraInfo === 'object') {
    Object.keys(extraInfo).forEach((key) => {
      if (extraInfo[key]) {
        parts.push(key + '=' + extraInfo[key]);
      }
    });
  }
  parts.push('body=' + briefJson(body));
  logStep('请求 ' + name, parts.join(' | '));
}

function logResponse(name, result, attempt) {
  const json = (result && result.json) || {};
  const summary =
    '第' +
    attempt +
    '次' +
    ' | HTTP=' +
    (result ? result.status : 0) +
    ' | resultCode=' +
    (json.resultCode !== undefined ? json.resultCode : 'n/a') +
    ' | message=' +
    (extractMessage(json) || (result && result.message) || '') +
    ' | body=' +
    briefJson(json);
  logStep('响应 ' + name, summary);
}

function randomHex(len) {
  const chars = 'abcdef0123456789';
  let out = '';
  for (let i = 0; i < len; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function randomNum(len) {
  const chars = '0123456789';
  let out = '';
  for (let i = 0; i < len; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
