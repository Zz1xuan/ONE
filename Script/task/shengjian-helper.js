/**
 * 声荐小助手 — 小红花 + 每日抽奖
 * Quantumult X / Surge / Loon / Shadowrocket
 *
 * [rewrite_local]
 * ^https:\/\/xcx\.myinyun\.com:4438\/napi\/ url script-response-body shengjian-helper.js
 * [task_local]
 * 0 8,18 * * * shengjian-helper.js, tag=声荐小助手, enabled=true
 * [MITM]
 * hostname = xcx.myinyun.com
 */

const sj_env = (() => {
  if (typeof $task !== "undefined") return "qx"
  if (typeof $loon !== "undefined") return "loon"
  if (typeof $rocket !== "undefined") return "sr"
  if (typeof Egern !== "undefined") return "egern"
  if (typeof $environment !== "undefined") {
    if ($environment["surge-version"]) return "surge"
    if ($environment["stash-version"]) return "stash"
  }
  if (typeof module !== "undefined" && module.exports) return "node"
  return "?"
})()

const sj_read = (key) => {
  if (sj_env === "qx") return $prefs.valueForKey(key)
  if (sj_env === "surge" || sj_env === "loon" || sj_env === "stash" || sj_env === "egern" || sj_env === "sr") return $persistentStore.read(key)
  return null
}

const sj_write = (key, val) => {
  if (sj_env === "qx") return $prefs.setValueForKey(val, key)
  if (sj_env === "surge" || sj_env === "loon" || sj_env === "stash" || sj_env === "egern" || sj_env === "sr") return $persistentStore.write(val, key)
  return false
}

const sj_notify = (title, sub, msg) => {
  if (typeof $notify !== "undefined") $notify(title, sub, msg)
}

;(async () => {
  // ===== Cookie 捕获 =====
  if (typeof $request !== "undefined") {
    var h = $request.headers || {}
    var t = h["Authorization"] || h["authorization"] || ""
    if (!t) { for (var k in h) { if (k.toLowerCase() === "authorization") { t = h[k]; break } } }
    if (t && t.indexOf("Bearer ") === 0) {
      sj_write("shengjian_ck", JSON.stringify({ cookie: t }))
      console.log("[Cookie] ✅ 保存成功")
      sj_notify("声荐小助手", "Cookie 捕获成功 ✅", "")
    }
    if (typeof $done !== "undefined") $done({})
    return
  }

  // ===== 定时任务 =====
  var raw = sj_read("shengjian_ck")
  if (!raw) { console.log("❌ 无 Cookie"); if (typeof $done !== "undefined") $done(); return }
  var ck = JSON.parse(raw)
  if (!ck || !ck.cookie) { console.log("❌ Cookie 无效"); if (typeof $done !== "undefined") $done(); return }

  var BASE_URL = "https://xcx.myinyun.com:4438"
  var UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 26_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.75(0x18004b2d) NetType/4G Language/zh_CN"
  var H = { "Content-Type": "application/json", "User-Agent": UA, "Referer": "https://servicewechat.com/wxa25139b08fe6e2b6/23/page-frame.html", "Authorization": ck.cookie }

  var req = (method, url, body) => new Promise(r => {
    var opts = { url: url, headers: H }
    if (body) opts.body = body
    var done = (err, resp, b) => { try { r(JSON.parse(b || resp?.body)) } catch(e) { r(b || resp?.body || null) } }
    if (sj_env === "qx") $task.fetch({ ...opts, method: method }).then(x => done(null, null, x.body), () => r(null))
    else if (method === "GET") $httpClient.get(opts, done)
    else if (method === "POST") $httpClient.post(opts, done)
    else if (method === "PUT") $httpClient.put(opts, done)
    else r(null)
  })

  var get = (u) => req("GET", u)
  var post = (u, b) => req("POST", u, b)
  var put = (u, b) => req("PUT", u, b)

  console.log("=".repeat(40))
  console.log("🔊 声荐小助手")
  console.log("=".repeat(40))

  // 用户信息
  var u = await get(BASE_URL + "/napi/wx/getUserDetail")
  if (u && u.username) console.log("[用户] " + u.username + " 花:" + (u.flowerCount || 0))

  // 小红花
  console.log("\n🌸 小红花")
  var ft = await get(BASE_URL + "/napi/flower/time")
  if (ft === true) {
    var fg = await post(BASE_URL + "/napi/flower/get", "{}")
    console.log(fg === true ? "✅ 领取成功" : "❌ 失败")
  } else {
    console.log("⏳ 冷却中")
  }

  await new Promise(f => setTimeout(f, 3000))

  // 每日抽奖
  console.log("\n🎁 每日抽奖")
  var rr = await get(BASE_URL + "/napi/gift/remainGiftNum")
  var n = (rr && rr.data !== undefined) ? rr.data : 0
  console.log("剩余 " + n + " 次")
  var ok = 0
  for (var i = 0; i < n; i++) {
    var r = await put(BASE_URL + "/napi/gift", "{}")
    if (r && r.msg === "ok" && r.data) { console.log("✅ " + (r.data.prizeName || "?")); ok++ }
    else console.log("❌ " + JSON.stringify(r))
    if (i < n - 1) await new Promise(f => setTimeout(f, 3000))
  }
  if (n > 0) console.log("成功 " + ok + "/" + n)

  console.log("\n✅ 完成")
  if (typeof $done !== "undefined") $done()
})()
