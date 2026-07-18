/*
叮咚买菜任务脚本（Quantumult X / Node.js）

==================== Quantumult X 配置 ====================

[rewrite_local]

# 1. 自动获取/更新积分任务 CK、uid、公共参数及 User-Agent
^https:\/\/maicai\.api\.ddxq\.mobi\/point\/home(?:\?|$) url script-request-header https://raw.githubusercontent.com/Zz1xuan/ONE/refs/heads/main/Rewrite/AdBlock/DingDong/DingDong.js

# 2. 自动获取/更新鱼塘 Cookie、设备头和游戏公共参数
^https:\/\/farm\.api\.ddxq\.mobi\/api\/v2\/userguide\/detail(?:\?|$) url script-request-header https://raw.githubusercontent.com/Zz1xuan/ONE/refs/heads/main/Rewrite/AdBlock/DingDong/DingDong.js

[mitm]
hostname = maicai.api.ddxq.mobi, farm.api.ddxq.mobi

[task_local]
19 0,9 * * * https://raw.githubusercontent.com/Zz1xuan/ONE/refs/heads/main/Rewrite/AdBlock/DingDong/DingDong.js, tag=叮咚买菜, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/ddmc.png, enabled=true

使用方法：
1. 打开一次叮咚买菜“积分”页，自动抓取积分任务账号信息。
2. 再进入一次“叮咚鱼塘”，自动补充鱼塘参数。
3. QX 持久化键名：DINGDONG。

可选配置：
DINGDONG_RAFFLE=close       可选关闭积分活动抽奖；默认 open
DINGDONG_FISH_MAX_FEEDS=200 喂鱼异常保护上限；默认 200，正常会在饲料不足或服务端上限时提前停止

Node.js：
DINGDONG='[{"uid":"...","name":"...","cookie":"...","signBody":"...","userAgent":"...","fishQuery":"..."}]'

注意：请勿把含真实 Cookie 的 DINGDONG 数据上传到公开仓库。
==========================================================
*/

const NAME = "叮咚买菜";
const STORE_KEY = "DINGDONG";
const isQX = typeof $task !== "undefined";
const isNode = typeof process !== "undefined" && process.release?.name === "node";
const request = typeof $request !== "undefined" ? $request : null;
const read = key => isQX ? $prefs.valueForKey(key) : process.env[key];
const write = (value, key) => isQX ? $prefs.setValueForKey(value, key) : false;
const notify = (sub, body) => isQX ? $notify(NAME, sub, body) : console.log(`[${sub}] ${body}`);
const done = value => isQX ? $done(value || {}) : undefined;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

let accounts = parseAccounts(read(STORE_KEY));
let current = null;
let summary = [];

(async () => {
  if (request) await captureAccount(request);
  else await runTasks();
})().catch(error => {
  console.log(`[fatal] ${error.stack || error}`);
  notify("运行失败", String(error.message || error));
}).finally(() => done({}));

function parseAccounts(raw) {
  if (!raw) return [];
  try {
    const value = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(value) ? value : [];
  } catch (error) {
    console.log(`[config] DINGDONG JSON 无效: ${error}`);
    return [];
  }
}

function header(headers, name) {
  const key = Object.keys(headers || {}).find(k => k.toLowerCase() === name.toLowerCase());
  return key ? headers[key] : "";
}

async function captureAccount(req) {
  if (/^https:\/\/farm\.api\.ddxq\.mobi\/api\/v2\/userguide\/detail(?:\?|$)/.test(req.url)) {
    await captureFishpond(req);
    return;
  }
  if (!/^https:\/\/maicai\.api\.ddxq\.mobi\/point\/home(?:\?|$)/.test(req.url)) return;
  const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?") + 1) : "";
  const params = new URLSearchParams(query);
  const cookie = header(req.headers, "cookie");
  const uid = params.get("uid") || "";
  if (!cookie || !uid) {
    notify("抓取失败", `缺少 ${!cookie ? "Cookie" : "uid"}`);
    return;
  }
  const captured = {
    uid,
    name: `用户${uid.slice(-4)}`,
    cookie,
    signBody: query,
    userAgent: header(req.headers, "user-agent"),
    capturedAt: Date.now()
  };
  const index = accounts.findIndex(x => String(x.uid) === String(uid));
  const changed = index < 0 || accounts[index].cookie !== cookie || accounts[index].signBody !== query;
  if (index < 0) accounts.push(captured);
  else accounts[index] = {...accounts[index], ...captured};
  if (!write(JSON.stringify(accounts), STORE_KEY)) throw new Error("写入 QX 持久化存储失败");
  notify("CK 获取成功", `${captured.name}\n${index < 0 ? "新增账号" : changed ? "Cookie/参数已更新" : "Cookie 有效，无需更新"}`);
}

async function captureFishpond(req) {
  const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?") + 1) : "";
  const params = new URLSearchParams(query);
  const uid = params.get("uid") || "";
  const cookie = header(req.headers, "cookie");
  if (!uid || !cookie) {
    notify("鱼塘抓取失败", `缺少 ${!cookie ? "Cookie" : "uid"}`);
    return;
  }
  const index = accounts.findIndex(x => String(x.uid) === String(uid));
  const patch = {
    uid,
    name: index >= 0 ? accounts[index].name : `用户${uid.slice(-4)}`,
    cookie,
    fishQuery: query,
    fishUserAgent: header(req.headers, "user-agent"),
    fishHeaders: {
      "ddmc-device-id": header(req.headers, "ddmc-device-id"),
      "ddmc-device-token": header(req.headers, "ddmc-device-token"),
      "ddmc-app-client-id": header(req.headers, "ddmc-app-client-id") || "1",
      "Origin": header(req.headers, "origin") || "https://game.m.ddxq.mobi",
      "Referer": header(req.headers, "referer") || "https://game.m.ddxq.mobi/"
    },
    fishCapturedAt: Date.now()
  };
  if (index < 0) accounts.push(patch);
  else accounts[index] = {...accounts[index], ...patch};
  if (!write(JSON.stringify(accounts), STORE_KEY)) throw new Error("写入鱼塘参数失败");
  notify("鱼塘 CK 获取成功", `${patch.name}\n${index < 0 ? "新增账号并保存鱼塘参数" : "Cookie、设备头及鱼塘参数已更新"}`);
}

async function runTasks() {
  if (!accounts.length) {
    notify("未找到账号", "请启用重写和 MITM 后打开叮咚买菜积分页完成抓取。");
    return;
  }
  for (const account of accounts) {
    current = account;
    try { await runAccount(account); }
    catch (error) {
      console.log(`[${account.name || account.uid}] ${error.message || error}\n${error.stack || ""}`);
      summary.push(`${account.name || account.uid}: 运行失败 ${error.message || error}`);
    }
  }
  if (summary.length) notify("任务结果", summary.join("\n"));
}

async function runAccount(account) {
  const age = Date.now() - Number(account.capturedAt || 0);
  if (age > 36 * 3600 * 1000) console.log(`[warn] ${account.name} 的抓取参数已超过 36 小时，sign 可能过期`);
  const common = {};
  new URLSearchParams(account.signBody || "").forEach((value, key) => {
    common[key] = value;
  });
  if (!account.cookie || !common.uid) throw new Error("账号缺少 cookie 或 signBody.uid，请重新抓取");

  const userResult = await api("GET", `https://maicai.api.ddxq.mobi/user/info?${account.signBody}`);
  if (!ok(userResult)) {
    summary.push(`${account.name || account.uid}: 登录态失效/签名过期（${messageOf(userResult)}），请打开积分页刷新抓取`);
    return;
  }
  account.name = userResult.data?.name || account.name;
  console.log(`\n===== ${account.name} =====`);

  const signin = await api("POST", "https://sunquan.api.ddxq.mobi/api/v2/user/signin/", common);
  if (ok(signin)) {
    const point = signin.data?.point ?? 0;
    summary.push(`${account.name}: 签到 +${point} 积分`);
    console.log(`签到成功，连续 ${signin.data?.sign_series ?? "?"} 天，+${point} 积分`);
  } else console.log(`签到: ${messageOf(signin)}`);

  await runPointMissions(common);
  await runFlop(common);
  if ((read("DINGDONG_RAFFLE") || "open").toLowerCase() !== "close") await runRaffle(common);
  else console.log("积分抽奖: 已通过 DINGDONG_RAFFLE=close 关闭");
  await runFishpond(account);

  const flow = await api("GET", `https://maicai.api.ddxq.mobi/point/flow?${account.signBody}&type=0&count=50&page=1`);
  if (ok(flow)) {
    const list = Array.isArray(flow.data?.point_list) ? flow.data.point_list : [];
    const today = list.filter(x => sameLocalDay(x.create_time)).reduce((sum, x) => sum + Number(x.point || 0), 0);
    summary.push(`${account.name}: 总积分 ${flow.data?.point_total ?? "?"}，今日 ${today >= 0 ? "+" : ""}${today}`);
  }
}

async function runFishpond(account) {
  if (!account.fishQuery) {
    console.log("鱼塘: 未抓取参数，请进入一次叮咚鱼塘");
    return;
  }
  const fishAge = Date.now() - Number(account.fishCapturedAt || 0);
  if (fishAge > 30 * 24 * 3600 * 1000) console.log("[warn] 鱼塘参数已超过 30 天，建议重新抓取");

  console.log("开始鱼塘任务---------");
  const base = new URLSearchParams(account.fishQuery);
  for (const key of ["guideCode", "taskCode", "userTaskLogId", "propsId", "seedId", "feedPro", "triggerMultiFeed", "cityCode", "inviteActivityType", "friendId", "gameId"]) base.delete(key);
  const gameId = "1";
  const cityCode = base.get("city_number") || base.get("CityId") || "";

  // HAR 证实该接口直接完成连续签到并领取 10g 饲料。重复调用由服务端幂等/状态校验。
  const sign = await fishGet("/api/v2/task/achieve", base, {gameId, taskCode: "CONTINUOUS_SIGN"});
  if (ok(sign)) {
    const amount = sumReward(sign.data?.rewards, "FEED");
    console.log(`鱼塘连续签到成功${amount ? `，饲料 +${amount}g` : ""}`);
  } else console.log(`鱼塘连续签到: ${messageOf(sign)}`);

  // 领取所有已完成且待领取的任务奖励，不主动完成下单、邀请等任务。
  const tasks = await fishGet("/api/v2/task/list", base, {gameId, cityCode, inviteActivityType: "INVITE_ASSIST"});
  const list = Array.isArray(tasks?.data?.userTasks) ? tasks.data.userTasks : [];
  for (const task of list) {
    if (task.buttonStatus !== "TO_REWARD" || !task.userTaskLogId) continue;
    const reward = await fishGet("/api/v2/task/reward", base, {gameId, userTaskLogId: task.userTaskLogId});
    console.log(`${task.taskName || task.taskCode}: ${ok(reward) ? `领取成功，饲料 +${sumReward(reward.data?.rewards, "FEED")}g` : messageOf(reward)}`);
    await wait(500);
  }

  const detail = await fishGet("/api/v2/userguide/detail", base, {gameId, guideCode: "FISHPOND_NEW"});
  if (!ok(detail)) {
    console.log(`鱼塘状态读取失败: ${messageOf(detail)}`);
    return;
  }
  const feed = detail.data?.feed;
  const seed = detail.data?.baseSeed;
  console.log(`鱼塘状态: ${seed?.msg || "正常"}，剩余饲料 ${feed?.amount ?? "?"}g`);

  // 持续喂到饲料不足或服务端返回当日/阶段上限；hardLimit 只用于防止异常死循环。
  if (!feed?.propsId || !seed?.seedId) {
    console.log("喂鱼停止: 响应缺少 propsId 或 seedId");
    return;
  }
  let remaining = Number(feed.amount || 0);
  const hardLimit = Math.max(1, Math.min(Number(read("DINGDONG_FISH_MAX_FEEDS") || 200), 500));
  let fed = 0;
  while (remaining >= 10 && fed < hardLimit) {
    const result = await fishGet("/api/v2/props/feed", base, {
      gameId, propsId: feed.propsId, seedId: seed.seedId, cityCode,
      feedPro: 0, triggerMultiFeed: 1
    });
    if (!ok(result)) {
      console.log(`喂鱼停止: ${messageOf(result)}`);
      break;
    }
    fed++;
    const next = Number(result.data?.feed?.amount ?? result.data?.props?.amount);
    if (Number.isFinite(next)) remaining = next;
    else remaining -= 10;
    console.log(`喂鱼 ${fed}: ${result.data?.msg || "成功"}，余 ${remaining}g`);
    await wait(800);
  }
  if (remaining < 10) console.log(`喂鱼完成: 饲料不足 10g，当前 ${remaining}g`);
  else if (fed >= hardLimit) console.log(`喂鱼停止: 达到异常保护上限 ${hardLimit} 次`);
  summary.push(`${account.name}: 鱼塘喂食 ${fed} 次，剩余 ${remaining}g`);
}

async function fishGet(path, base, extra) {
  const params = new URLSearchParams(base.toString());
  for (const [key, value] of Object.entries(extra || {})) {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
  }
  const oldUA = current.userAgent;
  if (current.fishUserAgent) current.userAgent = current.fishUserAgent;
  const result = await api("GET", `https://farm.api.ddxq.mobi${path}?${params.toString()}`, undefined, current.fishHeaders || {
    "Origin": "https://game.m.ddxq.mobi",
    "Referer": "https://game.m.ddxq.mobi/"
  });
  current.userAgent = oldUA;
  return result;
}

function sumReward(rewards, code) {
  return (Array.isArray(rewards) ? rewards : []).filter(x => x.rewardCode === code).reduce((n, x) => n + Number(x.amount || 0), 0);
}

async function runPointMissions(common) {
  const consult = await api("POST", "https://gw.api.ddxq.mobi/promocore-service/client/welfare/center/v1/consult", {...common, app_client_id: "0"});
  const missions = Array.isArray(consult?.data?.pointMissionModule) ? consult.data.pointMissionModule : [];
  for (const mission of missions) {
    if (!(Number(mission.rewardPoint) > 0 && Number(mission.status) < 1 && mission.missionId)) continue;
    const bizId = extractParam(mission.link, "welfareActivityId");
    console.log(`任务: ${mission.missionTitle || mission.missionId} (+${mission.rewardPoint})`);
    const found = await api("POST", "https://gw.api.ddxq.mobi/promomission-service/mission/search/new/searchMissionById", {...common, missionInstanceId: mission.missionId, bizId});
    const detail = found?.data?.missionList?.[0] || {};
    await api("POST", "https://gw.api.ddxq.mobi/promomission-service/mission/search/new/createUserMission", {...common, missionId: mission.missionId});
    await wait(300);
    await api("POST", "https://gw.api.ddxq.mobi/promomission-service/mission/search/new/searchMissionForWelfareCenter", {...common, missionInstanceId: mission.missionId});
    await wait(800);
    const result = await api("POST", "https://gw.api.ddxq.mobi/promomission-service/mission/notice/v1/notice", {
      ...common, missionType: detail.missionType, pageId: detail.pageId, missionId: mission.missionId,
      seconds: detail.seconds, time: Math.floor(Date.now() / 1000), serialNo: Date.now()
    });
    console.log(`任务结果: ${messageOf(result)}`);
    await wait(800);
  }
}

async function runFlop(common) {
  console.log("开始限时翻牌---------");
  let consult = await api("POST", "https://gw.api.ddxq.mobi/promocore-service/client/flop/v3/consult", {...common, h5_source: "", pageId: "PAGE_NEW_FlASHSALE_V3"});
  if (!ok(consult) || !consult.data) {
    console.log(`翻牌查询失败: ${messageOf(consult)}`);
    return;
  }
  const flopSign = await api("POST", "https://gw.api.ddxq.mobi/promocore-service/client/signIn/v1/signIn", {
    ...common, relatedActivityId: consult.data.activityId, activityId: consult.data.signInActivityId,
    pageId: "PAGE_NEW_FlASHSALE_V3", h5_source: ""
  });
  console.log(`翻牌签到: ${messageOf(flopSign)}`);

  // 参考原脚本：查询翻牌关联任务，完成所有非下单任务，任务可能增加翻牌次数。
  const missionResult = await api("POST", "https://gw.api.ddxq.mobi/promomission-service/mission/search/v1/searchMissionById", {
    time: Date.now(),
    ...common,
    bizId: consult.data.activityId,
    h5_source: ""
  });
  const missions = Array.isArray(missionResult?.data?.missionList) ? missionResult.data.missionList : [];
  if (!ok(missionResult)) console.log(`翻牌任务查询失败: ${messageOf(missionResult)}`);
  for (const mission of missions) {
    if (Number(mission.status) !== 0 || mission.missionType === "order") continue;
    const notice = await api("POST", "https://gw.api.ddxq.mobi/promomission-service/mission/notice/v1/notice", {
      ...common,
      missionType: mission.missionType,
      seconds: mission.seconds,
      pageId: mission.pageId,
      time: Date.now(),
      cityCode: common.city_number,
      s_id: common.station_id,
      app_client_name: "wechat",
      serialNo: Date.now() + Math.random()
    });
    console.log(`翻牌任务 ${mission.missionType}-${mission.title || ""}: ${messageOf(notice)}`);
    await wait(1000);
  }

  // 完成关联任务后必须重新查询，否则仍会使用旧的 curRemainCount/equityFactorDTO。
  consult = await api("POST", "https://gw.api.ddxq.mobi/promocore-service/client/flop/v3/consult", {
    time: Date.now(),
    ...common,
    h5_source: "",
    pageId: "PAGE_NEW_FlASHSALE_V3"
  });
  if (!ok(consult) || !consult.data) {
    console.log(`翻牌刷新失败: ${messageOf(consult)}`);
    return;
  }
  const count = Math.min(Math.max(Number(consult.data?.flopBaseInfo?.curRemainCount || 0), 0), 20);
  if (!count) {
    console.log("翻牌: 当前无可用次数");
    return;
  }
  for (let i = 0; i < count; i++) {
    const result = await api("POST", "https://gw.api.ddxq.mobi/promocore-service/client/flop/v3/trigger", {...common, equityFactorDTO: consult.data.equityFactorDTO, isBridge: false});
    if (!ok(result)) {
      console.log(`翻牌 ${i + 1} 失败: ${messageOf(result)}`);
      break;
    }
    const prize = result.data?.triggerPrize;
    console.log(`翻牌 ${i + 1}/${count}: ${prize ? JSON.stringify(prize) : messageOf(result)}`);
    await wait(1000);
  }
}

async function runRaffle(common) {
  console.log("开始积分抽奖---------");
  const activityId = "AC201000000001990313316";
  const consult = await api("POST", "https://gw.api.ddxq.mobi/promocore-api/client/wheel/lottery/v1/consult", {...common, env: "PE", activityId});
  if (!ok(consult)) {
    console.log(`抽奖查询失败: ${messageOf(consult)}`);
    return;
  }
  for (let i = 0; i < 20; i++) {
    const result = await api("POST", "https://gw.api.ddxq.mobi/promocore-api/client/wheel/lottery/v1/trigger", {...common, env: "PE", activityId});
    if (!ok(result)) {
      console.log(`抽奖停止: ${messageOf(result)}`);
      if (i === 0) console.log("可能原因：没有抽奖次数、活动 ID 已过期，或抓取的 signBody 已失效");
      break;
    }
    const amount = result.data?.userEquityPrize?.prizeEquityTemplateDTO?.pointPrizeDTO?.amount;
    console.log(`抽奖 ${i + 1}: ${amount != null ? `积分 +${amount}` : JSON.stringify(result.data || {})}`);
    await wait(1500);
  }
}

async function api(method, url, body, extraHeaders) {
  const options = {
    url,
    method,
    headers: {
      "Accept": "*/*",
      "Content-Type": "application/json",
      "Cookie": current?.cookie || "",
      "User-Agent": current?.userAgent || "Mozilla/5.0 Mobile xzone/13.7.1",
      "Origin": "https://activity.m.ddxq.mobi",
      "Referer": "https://activity.m.ddxq.mobi/"
    },
    timeout: 20000
  };
  Object.assign(options.headers, extraHeaders || {});
  if (method !== "GET") options.body = JSON.stringify(body || {});
  try {
    const response = isQX ? await $task.fetch(options) : await nodeFetch(options);
    const text = response.body || "";
    let data;
    try { data = JSON.parse(text); }
    catch { return {code: -2, msg: `非 JSON 响应 HTTP ${response.statusCode}: ${text.slice(0, 120)}`}; }
    if (Number(response.statusCode) >= 400) data._httpStatus = response.statusCode;
    return data;
  } catch (error) {
    return {code: -1, msg: error.message || String(error)};
  }
}

function nodeFetch(options) {
  return new Promise((resolve, reject) => {
    const {URL} = require("url");
    const client = options.url.startsWith("https:") ? require("https") : require("http");
    const target = new URL(options.url);
    const req = client.request({method: options.method, hostname: target.hostname, port: target.port, path: target.pathname + target.search, headers: options.headers, timeout: options.timeout}, res => {
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => resolve({statusCode: res.statusCode, body: Buffer.concat(chunks).toString("utf8")}));
    });
    req.on("error", reject);
    req.on("timeout", () => req.destroy(new Error("请求超时")));
    if (options.body) req.write(options.body);
    req.end();
  });
}

function ok(data) { return data && (data.code === 0 || data.success === true); }
function messageOf(data) { return data?.msg || data?.message || `code=${data?.code ?? "unknown"}`; }
function extractParam(url, key) { try { return new URL(url).searchParams.get(key) || ""; } catch { return ""; } }
function sameLocalDay(value) {
  const date = new Date(value);
  const now = new Date();
  return !Number.isNaN(date.getTime()) && date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
}
