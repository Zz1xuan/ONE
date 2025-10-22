/****
[rewrite_local]
^https:\/\/m\.flight\.qunar\.com\/gw\/f\/pallas\/sc\/sign\/show url script-request-header qunar_sign.js

[MITM]
hostname = m.flight.qunar.com
****/
const $ = new Env("去哪儿旅行签到");
const CK_KEY = "qunar_cookie";

// 获取 Cookie 模式
if ($request && $request.headers) {
  const ck = $request.headers["Cookie"] || $request.headers["cookie"];
  if (ck) {
    $.setdata(ck, CK_KEY);
    $.msg("去哪儿签到", "✅ Cookie 获取成功", ck);
  } else {
    $.msg("去哪儿签到", "❌ 未能捕获 Cookie", "请检查请求来源");
  }
  $.done();
} else {
  main();
}

async function main() {
  const ck = $.getdata(CK_KEY);
  if (!ck) {
    $.msg("去哪儿签到", "❗ 请先获取 Cookie", "打开去哪儿App签到页以自动获取");
    return $.done();
  }

  const url = "https://m.flight.qunar.com/gw/f/pallas/sc/sign/show";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Origin": "https://m.flight.qunar.com",
    "Referer": "https://m.flight.qunar.com/",
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 QunariPhone/80011352 m/14.5",
    "Cookie": ck,
  };
  const body = "userIp=&clientGps=29.3,121.43&platform=ios";

  const request = {
    url,
    method: "POST",
    headers,
    body,
  };

  $.post(request, (err, resp, data) => {
    if (err) {
      $.msg("去哪儿签到", "❌ 请求出错", String(err));
      return $.done();
    }

    try {
      const obj = JSON.parse(data);
      if (obj?.status === 0 && obj?.data?.data) {
        const d = obj.data.data.data;
        const hasSignToday = d.hasSignToday;
        const continuousDays = d.continuousDays;
        const todayReward = d.itemList.find((i) => i.todayFlag)?.amount || 0;

        $.msg(
          "去哪儿签到",
          hasSignToday ? "✅ 今日已签到" : "❌ 今日未签到",
          `连续签到：${continuousDays} 天\n今日奖励：${todayReward} 积分`
        );
      } else {
        $.msg("去哪儿签到", "⚠️ 返回异常", data);
      }
    } catch (e) {
      $.msg("去哪儿签到", "❌ 解析失败", e.message);
    }
    $.done();
  });
}

/* Env 模板（参考 uicbox.js） */
function Env(t, e) {
  class s {
    constructor(t) {
      this.env = t;
    }
    send(t, e = "GET") {
      t = "string" == typeof t ? { url: t } : t;
      let s = this.get;
      return "POST" === e && (s = this.post), new Promise((e, i) => {
        s.call(this, t, (t, s, r) => {
          t ? i(t) : e(s);
        });
      });
    }
    get(t) {
      this.env === "Node"
        ? this.got(t)
        : this.env === "QuanX"
        ? $task.fetch(t)
        : this.env === "Surge"
        ? $httpClient.get(t)
        : null;
    }
    post(t) {
      this.env === "Node"
        ? this.got(t)
        : this.env === "QuanX"
        ? $task.fetch({ ...t, method: "POST" })
        : this.env === "Surge"
        ? $httpClient.post(t)
        : null;
    }
  }
  return new (class {
    constructor(t, e) {
      this.name = t;
      this.data = null;
      this.logs = [];
      this.isMute = !1;
      this.isNeedRewrite = !1;
      this.logSeparator = "\n";
      this.startTime = new Date().getTime();
      Object.assign(this, e);
      this.log("", `🔔${this.name}, 开始!`);
    }
    getdata(t) {
      return $prefs ? $prefs.valueForKey(t) : null;
    }
    setdata(t, e) {
      return $prefs ? $prefs.setValueForKey(t, e) : null;
    }
    msg(t = this.name, e = "", s = "", i) {
      const r = s ? `${s}` : "";
      console.log(`${t}\n${e}\n${r}`);
      $notify(t, e, r);
    }
    log(...t) {
      t.length > 0 && console.log(t.join(this.logSeparator));
    }
    done(t = {}) {
      const e = (new Date().getTime() - this.startTime) / 1000;
      this.log("", `🔔${this.name}, 结束! 🕛 ${e} 秒`);
      $done(t);
    }
  })(t, e);
}