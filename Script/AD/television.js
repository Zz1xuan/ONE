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
        let obj = JSON.parse(body);
        if (obj.cards) {
          delete obj.cards;
          //const firstCardsIndex = body.indexOf('"cards"');
          //const afterFirstCards = body.slice(firstCardsIndex);
          //const closingBraceIndex = afterFirstCards.indexOf('}');
          //const cardsLength = firstCardsIndex + closingBraceIndex + 1;
          //body = body.slice(0, firstCardsIndex) + body.slice(cardsLength);
        }
        if (obj.strategy_com_id) {
          const valuesToRemove = ["focus", "change_normalnew", "qy_home_vip_opr_banner", "R:306115012"];
          obj.strategy_com_id = obj.strategy_com_id.filter(item => !valuesToRemove.includes(item));
        }
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
