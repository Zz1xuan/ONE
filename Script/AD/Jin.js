if (!$response.body) {
  $done({});
}

const url = $request.url;
let body = $response.body;

if (body) {
  try {
    let obj;

    switch (true) {
      // 米家
      case /home\.mi\.com\/cgi-op\/api\/v1\/recommendation\/myTab/.test(url):
        obj = JSON.parse(body);
        delete obj.data.banners;
        break;
      // 萤石云
      case /api\.ys7\.com\/v3\/config\/valueAddedInfo/.test(url):
        obj = JSON.parse(body);
        delete obj.showAllBtn;
        delete obj.valueAddedInfoList;
        break;
      // 薄荷健康
      case /api\.boohee\.com\/meta-interface\/v1\/index\/record_index/.test(url):
        obj = JSON.parse(body);
        if (obj.data) {
          delete obj.data.articles;
        }
        break;
      // 到梦空间
      case /appdmkj\.5idream\.net\/v2\/index\/promotionlist/.test(url):
        obj = JSON.parse(body);
        delete obj.data.bannerList;
        break;
      case /^https:\/\/un-acs\.youku\.com\/gw\/mtop\.youku\.play\.ups\.appinfo\.get/.test(url): //cnVjdQ==
        obj = JSON.parse(body);
        if (obj.data?.data) {
          const item = ["ad", "ykad", "watermark"];
          for (let i of item) {
            if (obj.data.data?.[i]) {
              delete obj.data.data[i];
            }
          }
        }
        break;
      case /^http:\/\/dc\.bz\.mgtv\.com\/dynamic\/v1\/channel\/index\/.+/.test(url): //em9v
        obj = JSON.parse(body);
        if (obj.data) {
          delete obj.data.items;
        }
        break;
      case /cupid\.iqiyi\.com\/mixer/.test(url):
        obj = JSON.parse(body);
        if (obj) {
          const item = ["adSlots", "splashLottieFile", "splashUiConfig"];
          for (let i of item) {
            if (obj?.[i]) {
              delete obj[i];
            }
          }
        }
        break;
      case /^https:\/\/cards\.iqiyi\.com\/views_home\/3\.0\/qy_home/.test(url):
        obj = JSON.parse(body);
        if (obj?.cards?.length > 0) {
          obj.cards = obj.cards.filter(
            (i) =>
              ![
                "ad_mobile_flow", // 信息流广告
                "ad_trueview", // 信息流广告
                "focus", // 顶部横版广告
                "qy_home_vip_opr_banner" // 会员营销banner
              ]?.includes(i?.alias_name)
          );
        }
        break;
      case /^https:\/\/cards\.iqiyi\.com\/waterfall\/3\.0\/feed/.test(url):
        obj = JSON.parse(body);
        if (obj?.cards?.length > 0) {
          let card = obj.cards[0];
          if (card?.blocks?.length > 0) {
            card.blocks = card.blocks.filter(
              (i) => !i.hasOwnProperty("block_class")
            );
          }
        }
        break;
      case /^https:\/\/iface2\.iqiyi\.com\/aggregate\/3\.0\/getMyMenus/.test(url):
        obj = JSON.parse(body);
        if (obj?.data?.length > 0) {
          obj.data = obj.data.filter(
            (i) =>
              !["wd_liebiao_2", "wd_liebiao_3", "wd_liebiao_4"]?.includes(
                i?.statistic?.block
              )
          );
        }
        break;
      case /^https:\/\/iface2\.iqiyi\.com\/views\/3\.0\/bottom_theme/.test(url):
        obj = JSON.parse(body);
        if (obj?.cards?.length > 0) {
          let card = obj.cards[0];
          if (card?.items?.length > 0) {
            card.items = card.items.filter((i) => !["184","35"]?.includes(i?._id));
          }
        }
        break;
      default:
        break;
    }

    $done({ body: JSON.stringify(obj) });
  } catch (error) {
    console.log("Error:", error);
    $done({});
  }
} else {
  $done({});
}

