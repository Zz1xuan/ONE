if (!$response.body) $done({});
const url = $request.url;
let body = $response.body;

if (body) {
  switch (true) {
    // 米家
    case /home\.mi\.com\/cgi-op\/api\/v1\/recommendation\/myTab/.test(url):
      try {
        let parsedData = JSON.parse(body);
        delete parsedData.data.banners;
        body = JSON.stringify(parsedData);
      } catch (error) {
        console.log("Error:", error);
      }
      break;
    // 萤石云
    case /api\.ys7\.com\/v3\/config\/valueAddedInfo/.test(url):
      try {
        const data = JSON.parse(body);
        // 删除"showAllBtn"和"valueAddedInfoList"字段
        delete data.showAllBtn;
        delete data.valueAddedInfoList;
        body = JSON.stringify(data);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
      break;
    // 薄荷健康
    case /api\.boohee\.com\/meta-interface\/v1\/index\/record_index/.test(url):
      if (body) {
        try {
          const data = JSON.parse(body);
          // 删除"data"对象中的"articles"属性
          if (data.data) {
            delete data.data.articles;
          }
          body = JSON.stringify(data);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }
      break;
    default:
      break;
  }
  $done({ body });
}
