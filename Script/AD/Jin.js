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
      // 淘宝-开屏视频广告
    case /^https:\/\/guide-acs\.m\.taobao\.com\/gw\/mtop\.taobao\.cloudvideo\.video\.query/.test(url):
      try {
        let obj = JSON.parse(body);
        if (obj?.data?.duration) {
          obj.data.duration = "0";
        }
        if (obj?.data?.resources?.length > 0) {
          obj.data.resources = [];
        }
        if (obj?.data?.caches?.length > 0) {
          obj.data.caches = [];
        }
        if (obj?.data?.respTimeInMs) {
          obj.data.respTimeInMs = "5364633600000";
        }
        body = JSON.stringify(obj);
      } catch (error) {
        console.log(`淘宝-开屏视频广告, 出现异常: ` + error);
      }
      break;
    // 淘宝-开屏图片广告
    case /^https:\/\/guide-acs\.m\.taobao\.com\/gw\/mtop\.taobao\.wireless\.home\.splash\.awesome\.get/.test(url):
      try {
        let obj = JSON.parse(body);
        if (obj?.data?.containers?.splash_home_base) {
          let splash = obj.data.containers.splash_home_base;
          if (splash?.base?.sections?.length > 0) {
            for (let items of splash.base.sections) {
              if ("taobao-splash" in items.bizData) {
                if (items["taobao-splash"]?.data?.length > 0) {
                  for (let item of items.bizData["taobao-splash"].data) {
                    item.times = "0";
                    item.hotStart = "false";
                    item.haveVoice = "false";
                    item.hideTBLogo = "false";
                    item.enable4G = "false";
                    item.coldStart = "false";
                    item.waitTime = "0";
                    item.imgUrl = "";
                    item.startTime = "5364633600000";
                    item.endTime = "5364719999000";
                    item.gmtStart = "2140-01-01 00:00:00";
                    item.gmtEnd = "2140-01-01 23:59:59";
                    item.gmtStartMs = "5364633600000";
                    item.gmtEndMs = "5364719999000";
                  }
                }
              }
            }
          }
        }
        body = JSON.stringify(obj);
      } catch (error) {
        console.log(`淘宝-开屏图片广告, 出现异常: ` + error);
      }
      break;
    // 淘宝-开屏活动
    case /^https:\/\/poplayer\.template\.alibaba\.com\/\w+\.json/.test(url):
      try {
        let obj = JSON.parse(body);
        if (obj?.res?.images?.length > 0) {
          obj.res.images = [];
        }
        if (obj?.res?.videos?.length > 0) {
          obj.res.videos = [];
        }
        if (obj?.enable) {
          obj.enable = false;
        }
        if (obj?.mainRes?.images?.length > 0) {
          obj.mainRes.images = [];
        }
        body = JSON.stringify(obj);
      } catch (error) {
        console.log(`淘宝-开屏活动, 出现异常: ` + error);
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

