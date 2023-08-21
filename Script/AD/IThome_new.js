//keywos  rucu6
const url = $request.url;
if (!$response.body) $done({});
let obj = JSON.parse($response.body);

if (
  url.includes("/api/news/index") ||
  url.includes("/api/topmenu/getfeeds")
) {
  if (obj?.data?.list?.length > 0) {
    let list = obj.data.list;
    const newList = [];
    for (let item of list) {
      if (item?.feedContent?.smallTags?.some((i) =>
        i?.text?.includes("广告"))
      ) {
        continue;
      }
      if ([10002, 10003].includes(item?.feedType)) {
        continue;
      }
      newList.push(item);
    }
    obj.data.list = newList;
  }
}

$done({ body: JSON.stringify(obj) });