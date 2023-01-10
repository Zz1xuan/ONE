// 2023-01-06 20:20

if (!$response.body) $done({});
const url = $request.url;
let obj = JSON.parse($response.body);

// IT之家-appList
if (url.includes("/json/listpage/news") || url.includes("/json/newslist/news")) {
  if (obj.newslist) {
    obj.newslist = obj.newslist.filter((n) => !n.aid);
  }
} else if (url.includes("/json/slide/index")) {
  // IT之家-appSlide
  const newList = obj.filter((i) => !i.isad);
  obj.splice(0, obj.length);
  obj.push(...newList);
} else if (url.includes("/api/news/newslistpageget")) {
  // IT之家-mobileWeb
  if (obj.Result) {
    obj.Result = obj.Result.filter((r) =>
      r.NewsTips.every((t) => t.TipName !== "广告")
    );
  }
} else if (url.includes("/api/news/index") || url.includes("/api/topmenu/getfeeds")) {
  // IT之家-newAppFeed
  let list = obj.data.list;
  const newList = [];
  for (const item of list) {
    if (
      item.feedContent.smallTags &&
      item.feedContent.smallTags.some((s) => s.text === "广告")
    ) {
      continue;
    }
    if (item.feedContent.focusNewsData) {
      const newNewsData = item.feedContent.focusNewsData.filter((n) => !n.isAd);
      item.feedContent.focusNewsData = newNewsData;
    }
    newList.push(item);
  }
  obj.data.list = newList;
}

body = JSON.stringify(obj);
$done({ body });
