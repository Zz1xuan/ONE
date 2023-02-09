// 2023-02-09 15:35
/***********************************
> 应用名称：酷安净化
> 脚本作者：ddgksf2013,RuCu6
 
    
[rewrite_local]

# > 酷安_推广广告@ddgksf2013
^https?:\/\/api.coolapk.com\/v6\/dataList url script-response-body https://raw.githubusercontent.com/RuCu6/QuanX/main/Scripts/coolapk.js
# > 酷安_首页广告@ddgksf2013
^https?:\/\/api.coolapk.com\/v6\/main\/indexV8 url script-response-body https://raw.githubusercontent.com/RuCu6/QuanX/main/Scripts/coolapk.js
# > 酷安_评论广告@ddgksf2013
^https?:\/\/api.coolapk.com\/v6\/feed\/replyList url script-response-body https://raw.githubusercontent.com/RuCu6/QuanX/main/Scripts/coolapk.js
# > 酷安_商品推广@ddgksf2013
^https?:\/\/api.coolapk.com\/v6\/feed\/detail url script-response-body https://raw.githubusercontent.com/RuCu6/QuanX/main/Scripts/coolapk.js
# > 酷安_热搜@RuCu6
^https:\/\/api\.coolapk\.com\/v6\/page\/dataList\? url script-response-body https://raw.githubusercontent.com/RuCu6/QuanX/main/Scripts/coolapk.js
# > 酷安_屏蔽热词@ddgksf2013
^https?:\/\/api\.coolapk\.com\/v6\/search\?.*type=hotSearch url reject-dict
[mitm] 

hostname=api.coolapk.com


***********************************/

if (!$response.body) $done({});
const url = $request.url;
let obj = JSON.parse($response.body);

if (obj.data) {
  // detail
  if (url.includes("/feed/detail")) {
    if (obj.data.hotReplyRows && obj.data.hotReplyRows.length > 0) {
      obj.data.hotReplyRows = obj.data.hotReplyRows.filter((item) => item.id);
    }
    if (obj.data.topReplyRows && obj.data.topReplyRows.length > 0) {
      obj.data.topReplyRows = obj.data.topReplyRows.filter((item) => item.id);
    }
    if (obj.data.include_goods_ids) {
      obj.data.include_goods_ids = [];
    }
    if (obj.data.include_goods) {
      obj.data.include_goods = [];
    }
    if (obj.data.detailSponsorCard) {
      obj.data.detailSponsorCard = [];
    }
  } else if (url.includes("/feed/replyList")) {
    // replyList
    if (obj.data.length > 0) {
      obj.data = obj.data.filter((item) => item.id);
    }
  } else if (url.includes("/main/dataList")) {
    // dataList
    obj.data = obj.data.filter(
      (item) =>
        !(item.entityTemplate === "sponsorCard" || item.title === "精选配件")
    );
  } else if (url.includes("/main/indexV8")) {
    // index
    obj.data = obj.data.filter(
      (item) =>
        !(
          item.entityTemplate === "sponsorCard" ||
          item.entityId === 8639 ||
          item.entityId === 29349 ||
          item.entityId === 33006 ||
          item.entityId === 32557 ||
          item.title.includes("值得买") ||
          item.title.includes("红包")
        )
    );
  } else if (url.includes("/page/dataList")) {
    // 酷安热搜
    obj.data = obj.data.filter(
      (item) =>
        !(item.title === "酷安热搜")
    );
  }
}

body = JSON.stringify(obj);
$done({ body });
