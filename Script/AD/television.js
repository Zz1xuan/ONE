// from 匿名人士
// fuck 南山必胜客，不敢放上来，怕连累作者 
const url = $request.url;
let body = $response.body;

if (body) {
  switch (true) {
    case /^http:\/\/t7z\.cupid\.iqiyi\.com\/mixer\?/.test(url):
      try {
        let obj = JSON.parse(body);
        if (obj?.adSlots) {
          delete obj.adSlots;
        }
        body = JSON.stringify(obj);
      } catch (error) {
        console.log(`Error parsing JSON:` + error);
      }
      break;
    case /^https:\/\/un-acs\.youku\.com\/gw\/mtop\.youku\.play\.ups\.appinfo\.get/.test(url):
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
        console.log(`Error parsing JSON:` + error);
      }
      break;
    case /^http:\/\/dc\.bz\.mgtv\.com\/dynamic\/v1\/channel\/index\/.+/.test(url):
      try {
        let obj = JSON.parse(body);
        if (obj.data) {
          delete obj.data.items;
        }
        body = JSON.stringify(obj);
      } catch (error) {
        console.log(`Error parsing JSON:` + error);
      }
      break;
    default:
      break;
  }
}
$done({ body });
