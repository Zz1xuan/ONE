/****
[rewrite_local]
^https:\/\/m\.flight\.qunar\.com\/gw\/f\/pallas\/sc\/sign\/show url script-request-header https://raw.githubusercontent.com/Zz1xuan/ONE/refs/heads/main/Script/own/qunar.js

[MITM]
hostname = m.flight.qunar.com
****/
const $ = new Env('去哪儿')
const CK_KEY = 'qunar_cookie'

// =============== 获取 Cookie ===============
if ($request && $request.headers) {
  const ck = JSON.stringify($request.headers)
  if (ck) {
    $.setdata(ck, CK_KEY)
    $.msg($.name, '✅ 获取Cookie成功', ck)
  }
  $.done()
}

// =============== 签到逻辑 ===============
!(async () => {
  const cookieVal = $.getdata(CK_KEY)
  if (!cookieVal) {
    $.msg($.name, '❌ 未获取Cookie', '请先运行获取CK的重写脚本')
    return
  }

  const headers = JSON.parse(cookieVal)
  const url = `https://user.qunar.com/webapi/member/signNewIndex.htm`
  const body = `channel=app&platform=ios`

  const resp = await $.http.post({ url, headers, body })
  const result = JSON.parse(resp.body)

  let subTitle = ''
  let detail = ''

  if (result.status === 0 && result.data?.data?.hasSignToday) {
    const day = result.data.data.continuousDays || 0
    const today = result.data.data.itemList?.find(i => i.todayFlag)
    subTitle = `签到成功 ✅`
    detail = `已连续签到 ${day} 天，今日奖励 ${today?.amount || 0} 积分`
  } else if (result.status === 0 && result.data?.data?.todayCanSign === false) {
    subTitle = `重复签到 ✅`
    detail = `今日已签到，无需重复`
  } else {
    subTitle = `签到失败 ❌`
    detail = JSON.stringify(result)
  }

  $.msg($.name, subTitle, detail)
})().catch((e) => $.logErr(e)).finally(() => $.done())

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