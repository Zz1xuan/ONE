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
      case /^https:\/\/api\.iqiyi\.com\/3f4\/cards\.iqiyi\.com\/views_home\/3\.0\/qy_home/.test(url):
        try {
          const obj = JSON.parse(body);
          const removeAdItems = (data) => {
            if (Array.isArray(data)) {
              data.forEach((item, index) => {
                if (item?.id?.includes("ad")) {
                  data.splice(index, 1);
                } else if (typeof item === 'object') {
                  removeAdItems(item);
                }
              });
            } else if (typeof data === 'object') {
              for (const key in data) {
                if (data[key]?.id?.includes("ad")) {
                  delete data[key];
                } else if (typeof data[key] === 'object') {
                  removeAdItems(data[key]);
                }
              }
            }
          };
          removeAdItems(obj);
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
