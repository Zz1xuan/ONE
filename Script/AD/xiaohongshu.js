/***********************************************
> 应用名称：墨鱼自用小红书去广告脚本
> 脚本作者：@ddgksf2013
> 微信账号：墨鱼手记
> 更新时间：2023-03-07
> 通知频道：https://t.me/ddgksf2021
> 贡献投稿：https://t.me/ddgksf2013_bot
> 问题反馈：ddgksf2013@163.com
> 特别提醒：如需转载请注明出处，谢谢合作！
***********************************************/

const version = 'V1.0.5';

let body = $response.body;

if (body) {
  switch (true) {
    case /api\/sns\/v\d\/homefeed\/categories\?/.test($request.url):
      try {
        let e = JSON.parse(body);
        e.data.categories = e.data.categories.filter(e => "homefeed.shop" != e.oid);
        body = JSON.stringify(e);
      } catch (t) {
        console.log("categories: " + t);
      }
      break;
    case /api\/sns\/v\d\/search\/hint/.test($request.url):
      try {
        let s = JSON.parse(body);
        s.data?.hint_words && (s.data.hint_words = [{
          title: "搜索笔记",
          type: "firstEnterOther#itemCfRecWord#搜索笔记#1",
          search_word: "搜索笔记"
        }]);
        body = JSON.stringify(s);
      } catch (a) {
        console.log("hint: " + a);
      }
      break;
    case /api\/sns\/v\d\/search\/hot_list/.test($request.url):
      try {
        let r = JSON.parse(body);
        r.data = {
          scene: "",
          title: "",
          items: [],
          host: "",
          background_color: {},
          word_request_id: ""
        };
        body = JSON.stringify(r);
      } catch (d) {
        console.log("hot_list: " + d);
      }
      break;
    case /api\/sns\/v\d\/search\/trending/.test($request.url):
      try {
        let i = JSON.parse(body);
        i.data = {
          title: "",
          queries: [],
          type: "",
          word_request_id: ""
        };
        body = JSON.stringify(i);
      } catch (o) {
        console.log("trending: " + o);
      }
      break;
    case /api\/sns\/v\d\/system_service\/splash_config/.test($request.url):
      try {
        let c = JSON.parse(body);
        c.data.ads_groups.forEach(e => {
          e.start_time = "2208963661", e.end_time = "2209050061", e.ads && e.ads.forEach(e => {
            e.start_time = "2208963661", e.end_time = "2209050061"
          });
        });
        body = JSON.stringify(c);
      } catch (l) {
        console.log("splash_config: " + l);
      }
      break;
    case /api\/sns\/v\d\/homefeed\?/.test($request.url):
      try {
        let y = JSON.parse(body);
        y.data = y.data.filter(e => !e.is_ads);
        body = JSON.stringify(y);
      } catch (h) {
        console.log("homefeed: " + h);
      }
      break;
    case /api\/sns\/v\d\/system_service\/config\?/.test($request.url):
      try {
        let n = JSON.parse(body),
          g = ["store", "splash", "loading_img", "app_theme", "cmt_words"];
        for (let b of g) n.data?.[b] && delete n.data[b];
        body = JSON.stringify(n);
      } catch (f) {
        console.log("system_service: " + f);
      }
      break;
    default:
      $done({});
  }
  $done({
    body
  });
} else {
  $done({});
}
