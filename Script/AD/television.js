// from 匿名人士
// fuck 南山必胜客，不敢放上来，怕连累作者 
const url = $request.url;
let body = $response.body;

if (body) {
  switch (true) {
    case /iqiyi\.com\/control\/3\.0\/init_proxy/.test(url):  //.test匹配正则
        if (obj?.content?.weather) {  //是否包含content.weather
            delete obj.content.weather;  //删除content.weather
        }
        break;
    case /iqiyi\.com\/mixer/.test(url):
        if (obj) {
            const item = ["adSlots", "splashLottieFile", "splashUiConfig"];  //将要删除的赋值给item
            for (let i of item) {  //for...of循环，表示数组item中的每个元素
                if (obj?.[i]) {  //判断是否存在i
                    delete obj[i];  //删除i的值
                }
            }
        }
        break;
    case /iqiyi\.com\/views_home\//.test(url):
        if (obj?.cards?.length > 0) {  //判断cards的长度>0
            obj.cards = obj.cards.filter((i) =>  //筛选 cards 数组，去除特定 alias_name 的项
                ![
                    "ad_mobile_flow",
                    "ad_trueview",
                    "focus",
                    "qy_home_vip_opr_banner"
                ].includes(i?.alias_name)
            );
        }
        break;
    case /iqiyi\.com\/waterfall\//.test(url):
        if (obj?.cards?.length > 0) {  //判断cards的长度>0
            let card = obj.cards[0];  //取第一个cards
            if (card?.blocks?.length > 0) {
                card.blocks = card.blocks.filter(
                    (i) => !i.hasOwnProperty("block_class")  //过滤block_class
                );
            }
        }
        break;
    case /search\.video\.iqiyi\.com\//.test(url):
        if (obj?.cache_expired_sec) {
            obj.cache_expired_sec = 1;  //赋值为1
        }
        if (obj?.data) {
            obj.data = [{ "query": "搜索电影、电视剧" }];
        }
        if (obj?.show_style?.roll_period) {
            obj.show_style.roll_period = 1000;
        }
        break;
        //下一个
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
