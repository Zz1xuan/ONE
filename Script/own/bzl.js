/***********************************
  > update 2025-06-28
[rewrite_local]
^https:\/\/yxc\.bzlsp\.cn\/api\/front\/product\/category\/index url script-request-header https://raw.githubusercontent.com/Zz1xuan/ONE/refs/heads/main/Script/own/bzl.js

[mitm] 

hostname=yxc.bzlsp.cn
***********************************/

const $ = new Env("宾之郎");

// -------- 抓 token 和 appId 的 Rewrite 规则 --------
function handleAccountCapture() {
  if ($request &&$request.url.includes("/api/front/product/category/index")) {
    const url = $request.url;
    const tokenMatch = url.match(/token=([^&]+)/);
    const appIdMatch = url.match(/appId=([^&]+)/);
    if (tokenMatch && appIdMatch) {
      const token = tokenMatch[1];
      const appId = appIdMatch[1];
      const key = "bzl_token";
      const newCK = `${token}@${appId}`;
      let old = $.getdata(key) || "";
      let list = old ? old.split("&") : [];

      if (list.includes(newCK)) {
        $.msg("宾之郎", "⚠️ 账号已存在", "该账号 token@appId 已存在，无需重复添加");
      } else {
        list.push(newCK);
        $.setdata(list.join("&"), key);
        $.msg("宾之郎", "✅ 获取账号成功", `已添加账号，共 ${list.length} 个`);
      }
    } else {
      $.msg("宾之郎", "❌ 获取失败", "未检测到 token 或 appId 参数");
    }
    $.done();
    return true; // 表示已处理账号获取
  }
  return false; // 表示未处理账号获取
}

// 只有当没有处理账号获取时，才执行任务
if (!handleAccountCapture()) {
  (async () => {
    let allAccounts = $.getdata("bzl_token");
    if (!allAccounts) {
      $.msg("宾之郎", "⚠️ 尚未获取账号", "请先打开相关页面抓取 token 和 appId");
      $.done();
      return;
    }
    let accounts = allAccounts.split("&");
    let notifyMsg = [];

    for (let i = 0; i < accounts.length; i++) {
      let [token, appId] = accounts[i].split("@");
      if (!token || !appId) {
        $.log(`❌ 第${i + 1}个账号格式错误，跳过`);
        continue;
      }
      $.log(`\n🔔 开始执行第${i + 1}个账号任务`);
      notifyMsg.push(`\n🔐【账号${i + 1}】`);

      let taskList = await getTaskList(token, appId);
      if (!taskList) {
        $.log("❌ 获取任务列表失败");
        notifyMsg.push("❌ 获取任务列表失败");
        continue;
      }

      $.log(`📋 总任务数：${taskList.length}`);
      let pendingTasks = taskList.filter(t => t.isOpen === 1 && t.status === 0);
      $.log(`📌 可执行任务数：${pendingTasks.length}`);
      if (pendingTasks.length === 0) {
        notifyMsg.push("✅ 今日任务已全部完成，无需操作");
      }

      for (const task of pendingTasks) {
        if (!["sign", "day_read"].includes(task.taskType)) {
          $.log(`⏭️ 跳过任务类型：${task.taskType} [${task.name}]`);
          continue;
        }

        $.log(`➡️ 开始任务：${task.name} [${task.taskType}]`);
        notifyMsg.push(`开始任务：${task.name} [${task.taskType}]`);

        if (task.taskType === "sign") {
          let signResult = await doSign(token, appId);
          notifyMsg.push(signResult);
        } else if (task.taskType === "day_read") {
          let skipUrl = await getSkipUrl(token, appId);
          if (skipUrl) {
            let readResult = await doRead(skipUrl, token, appId);
            notifyMsg.push(readResult);
          } else {
            $.log("⚠️ 未获取到阅读任务的 skipUrl，跳过阅读任务");
            notifyMsg.push("⚠️ 未获取到阅读任务的 skipUrl，跳过阅读任务");
          }
        }
        await $.wait(1500);
      }
    }

    if (notifyMsg.length === 1) notifyMsg.push("ℹ️ 今日无可执行任务");
    $.msg("宾之郎", "", notifyMsg.join("\n"));
    $.done();
  })();
}

async function getTaskList(token, appId) {
  const url = `https://yxc.bzlsp.cn/api/front/plus/task/task/index?token=${token}&appId=${appId}`;
  let resp = await $.http.get({ url });
  let data = $.toObj(resp.body);
  if (data && data.code === 1 && data.data?.task?.dayTask) {
    return data.data.task.dayTask;
  }
  $.log(`任务接口返回异常：${JSON.stringify(data)}`);
  return null;
}

async function doSign(token, appId) {
  const url = `https://yxc.bzlsp.cn/api/front/plus/sign/sign/add?token=${token}&appId=${appId}`;
  let resp = await $.http.get({ url });
  let data = $.toObj(resp.body);
  if (data && data.code === 1) {
    $.log("✅ 签到成功");
    return "✅ 签到成功";
  } else {
    $.log(`❌ 签到失败或已签到：${data?.msg || "未知原因"}`);
    return `❌ 签到失败或已签到：${data?.msg || "未知原因"}`;
  }
}

async function getSkipUrl(token, appId) {
  const url = `https://yxc.bzlsp.cn/api/front/index/index?url=&source=wx&token=${token}&appId=${appId}`;
  let resp = await $.http.get({ url });
  let data = $.toObj(resp.body);
  if (data && data.code === 1) {
    let newsList = data?.data?.setting?.skip?.newsList;
    if (Array.isArray(newsList) && newsList.length > 0) {
      const randomIndex = Math.floor(Math.random() * newsList.length);
      return newsList[randomIndex].skipUrl;
    }
  }
  $.log("⚠️ 获取 skipUrl 失败，接口无效或无内容");
  return null;
}

async function doRead(skipUrl, token, appId) {
  const url = `https://yxc.bzlsp.cn/api/front/plus/task/task/dayRead`;
  const body = `taskType=day_read&url=${encodeURIComponent(skipUrl)}&token=${token}&appId=${appId}`;
  let resp = await $.http.post({
    url,
    body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "appId": appId // 可选：增强兼容性
    }
  });
  let data = $.toObj(resp.body);
  if (data && data.code === 1) {
    $.log("✅ 阅读任务完成");
    return "✅ 阅读任务完成";
  } else {
    $.log(`❌ 阅读任务失败：${data?.msg || "未知原因"}`);
    return `❌ 阅读任务失败：${data?.msg || "未知原因"}`;
  }
}



function Env(t, e) { class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, a) => { s.call(this, t, (t, s, r) => { t ? a(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.encoding = "utf-8", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } getEnv() { return "undefined" != typeof $environment && $environment["surge-version"] ? "Surge" : "undefined" != typeof $environment && $environment["stash-version"] ? "Stash" : "undefined" != typeof module && module.exports ? "Node.js" : "undefined" != typeof $task ? "Quantumult X" : "undefined" != typeof $loon ? "Loon" : "undefined" != typeof $rocket ? "Shadowrocket" : void 0 } isNode() { return "Node.js" === this.getEnv() } isQuanX() { return "Quantumult X" === this.getEnv() } isSurge() { return "Surge" === this.getEnv() } isLoon() { return "Loon" === this.getEnv() } isShadowrocket() { return "Shadowrocket" === this.getEnv() } isStash() { return "Stash" === this.getEnv() } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const a = this.getdata(t); if (a) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, a) => e(a)) }) } runScript(t, e) { return new Promise(s => { let a = this.getdata("@chavy_boxjs_userCfgs.httpapi"); a = a ? a.replace(/\n/g, "").trim() : a; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [i, o] = a.split("@"), n = { url: `http://${o}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": i, Accept: "*/*" }, timeout: r }; this.post(n, (t, e, a) => s(a)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), a = !s && this.fs.existsSync(e); if (!s && !a) return {}; { const a = s ? t : e; try { return JSON.parse(this.fs.readFileSync(a)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), a = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : a ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const a = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of a) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, a) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[a + 1]) >> 0 == +e[a + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, a] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, a, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, a, r] = /^@(.*?)\.(.*?)$/.exec(e), i = this.getval(a), o = a ? "null" === i ? null : i || "{}" : "{}"; try { const e = JSON.parse(o); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), a) } catch (e) { const i = {}; this.lodash_set(i, r, t), s = this.setval(JSON.stringify(i), a) } } else s = this.setval(t, e); return s } getval(t) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": return $persistentStore.read(t); case "Quantumult X": return $prefs.valueForKey(t); case "Node.js": return this.data = this.loaddata(), this.data[t]; default: return this.data && this.data[t] || null } } setval(t, e) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": return $persistentStore.write(t, e); case "Quantumult X": return $prefs.setValueForKey(t, e); case "Node.js": return this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0; default: return this.data && this.data[e] || null } } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { switch (t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"], delete t.headers["content-type"], delete t.headers["content-length"]), t.params && (t.url += "?" + this.queryStr(t.params)), this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, a) => { !t && s && (s.body = a, s.statusCode = s.status ? s.status : s.statusCode, s.status = s.statusCode), e(t, s, a) }); break; case "Quantumult X": this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: a, headers: r, body: i, bodyBytes: o } = t; e(null, { status: s, statusCode: a, headers: r, body: i, bodyBytes: o }, i, o) }, t => e(t && t.error || "UndefinedError")); break; case "Node.js": let s = require("iconv-lite"); this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: a, statusCode: r, headers: i, rawBody: o } = t, n = s.decode(o, this.encoding); e(null, { status: a, statusCode: r, headers: i, rawBody: o, body: n }, n) }, t => { const { message: a, response: r } = t; e(a, r, r && s.decode(r.rawBody, this.encoding)) }) } } post(t, e = (() => { })) { const s = t.method ? t.method.toLocaleLowerCase() : "post"; switch (t.body && t.headers && !t.headers["Content-Type"] && !t.headers["content-type"] && (t.headers["content-type"] = "application/x-www-form-urlencoded"), t.headers && (delete t.headers["Content-Length"], delete t.headers["content-length"]), this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient[s](t, (t, s, a) => { !t && s && (s.body = a, s.statusCode = s.status ? s.status : s.statusCode, s.status = s.statusCode), e(t, s, a) }); break; case "Quantumult X": t.method = s, this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: a, headers: r, body: i, bodyBytes: o } = t; e(null, { status: s, statusCode: a, headers: r, body: i, bodyBytes: o }, i, o) }, t => e(t && t.error || "UndefinedError")); break; case "Node.js": let a = require("iconv-lite"); this.initGotEnv(t); const { url: r, ...i } = t; this.got[s](r, i).then(t => { const { statusCode: s, statusCode: r, headers: i, rawBody: o } = t, n = a.decode(o, this.encoding); e(null, { status: s, statusCode: r, headers: i, rawBody: o, body: n }, n) }, t => { const { message: s, response: r } = t; e(s, r, r && a.decode(r.rawBody, this.encoding)) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let a = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in a) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? a[e] : ("00" + a[e]).substr(("" + a[e]).length))); return t } queryStr(t) { let e = ""; for (const s in t) { let a = t[s]; null != a && "" !== a && ("object" == typeof a && (a = JSON.stringify(a)), e += `${s}=${a}&`) } return e = e.substring(0, e.length - 1), e } msg(e = t, s = "", a = "", r) { const i = t => { switch (typeof t) { case void 0: return t; case "string": switch (this.getEnv()) { case "Surge": case "Stash": default: return { url: t }; case "Loon": case "Shadowrocket": return t; case "Quantumult X": return { "open-url": t }; case "Node.js": return }case "object": switch (this.getEnv()) { case "Surge": case "Stash": case "Shadowrocket": default: { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } case "Loon": { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } case "Quantumult X": { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl, a = t["update-pasteboard"] || t.updatePasteboard; return { "open-url": e, "media-url": s, "update-pasteboard": a } } case "Node.js": return }default: return } }; if (!this.isMute) switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: $notification.post(e, s, a, i(r)); break; case "Quantumult X": $notify(e, s, a, i(r)); break; case "Node.js": }if (!this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), a && t.push(a), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": case "Quantumult X": default: this.log("", `❗️${this.name}, 错误!`, t); break; case "Node.js": this.log("", `❗️${this.name}, 错误!`, t.stack) } } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; switch (this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": case "Quantumult X": default: $done(t); break; case "Node.js": process.exit(1) } } }(t, e) }