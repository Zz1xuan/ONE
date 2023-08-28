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
        delete data.showAllBtn;
        delete data.valueAddedInfoList;
        body = JSON.stringify(data);
      } catch (error) {
        console.error("Error:", error);
      }
      break;
    // 薄荷健康
    case /api\.boohee\.com\/meta-interface\/v1\/index\/record_index/.test(url):
      if (body) {
        try {
          const data = JSON.parse(body);
          if (data.data) {
            delete data.data.articles;
          }
          body = JSON.stringify(data);
        } catch (error) {
          console.error("Error:", error);
        }
      }
      break;
    case /^https:\/\/un-acs\.youku\.com\/gw\/mtop\.youku\.play\.ups\.appinfo\.get/.test(url): //cnVjdQ==
      try {
        let obj = JSON.parse(body);
        if (obj.data?.data) {
          const item = ["ad", "ykad", "watermark"];
          for (let i of item) {
            if (obj.data.data?.[i]) {
              delete obj.data.data[i];
            }
          }
        }
        body = JSON.stringify(obj);
      } catch (error) {
        console.log(`Error:` + error);
      }
      break;
    case /^http:\/\/dc\.bz\.mgtv\.com\/dynamic\/v1\/channel\/index\/.+/.test(url): //em9v
      try {
        let obj = JSON.parse(body);
        if (obj.data) {
          delete obj.data.items;
        }
        body = JSON.stringify(obj);
      } catch (error) {
        console.log(`Error:` + error);
      }
      break;
    default:
      break;
  }
  $done({ body });
}
