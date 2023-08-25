// from rucu6

if (!$response.body) $done({});
const url = $request.url;
let body = $response.body;

if (body) {
  switch (true) {
    // 爱奇艺-播放广告
    case /^http:\/\/t7z\.cupid\.iqiyi\.com\/mixer\?/.test(url):
      try {
        let obj = JSON.parse(body);
        const item = ["adSlots"];
        for (let i of item) {
          if (obj?.[i]) {
            delete obj[i];
          }
        }
        body = JSON.stringify(obj);
      } catch (error) {
        console.log(`爱奇艺-播放广告, 出现异常: ` + error);
      }
      break;
     // 优酷-播放广告
     case /^https:\/\/un-acs\.youku\.com\/gw\/mtop\.youku\.play\.ups\.appinfo\.get/.test(url):
        try {
          let obj = JSON.parse(body);
          const item = ["ad", "ykad", "watermark"];
          for (let i of item) {
            if (obj.data.data?.[i]) {
              delete obj.data.data[i];
            }
          }
          body = JSON.stringify(obj);
        } catch (error) {
          console.log(`优酷-播放广告, 出现异常: ` + error);
        }
        break;
    default:
      break;
  }
  $done({ body });
}