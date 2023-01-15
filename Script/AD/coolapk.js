/*
author      RuCu6
function    酷安去首页广告、信息流广告、评论广告
author      kk pp


[rewrite_local]
^https?:\/\/api.coolapk.com\/v6\/(feed\/(replyList|detail)|main\/indexV8|dataList) url script-response-body https://ocd0522.tk/ddgksf2013/Cuttlefish/raw/branch/master/Script/coolapk.js

[mitm]
hostname = api.coolapk.com

*/

if (!$response.body) $done({});
const url = $request.url;
let obj = JSON.parse($response.body);

if (obj.data) {
  // 酷安-detail
  if (url.includes("/feed/detail")) {
    if (obj.data.hotReplyRows) {
      obj.data.hotReplyRows = obj.data.hotReplyRows.filter((item) => item.id);
    }
    obj.data.include_goods_ids = [];
    obj.data.include_goods = [];
  } else if (url.includes("/feed/replyList")) {
    // 酷安-replyList
    obj.data = obj.data.filter((item) => item.id);
  } else if (url.includes("/main/dataList")) {
    // 酷安-dataList
    obj.data = obj.data.filter(
      (item) => !(item.entityTemplate === "sponsorCard" || item.title === "精选配件")
    );
  } else if (url.includes("/main/indexV8")) {
    // 酷安-index
    obj.data = obj.data.filter(
      (item) =>
        !(
          item.entityTemplate === "sponsorCard" ||
          item.entityId === 8639 ||
          item.entityId === 33006 ||
          item.entityId === 32557 ||
          item.title.includes("值得买") ||
          item.title.includes("红包")
        )
    );
  }
}

body = JSON.stringify(obj);
$done({ body });
