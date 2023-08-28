const url = $request.url;
if (!$response.body) $done({});
const isIQY = url.includes("iqiyi.com/");
const isMG = url.includes("mgtv.com/");
const isYK = url.includes("youku.com/");
let obj = JSON.parse($response.body);

if (isIQY) {
  if (url.includes("/control/3.0/init_proxy?")) {
    if (obj?.content?.weather) {
      delete obj.content.weather;
    }
  } else if (url.includes("/mixer?")) {
    if (obj) {
      const item = ["adSlots", "splashLottieFile", "splashUiConfig"];
      for (let i of item) {
        if (obj?.[i])
          delete obj[i];
      }
    }
  } else if (url.includes("/search.video.iqiyi.com/")) {
    if (obj?.cache_expired_sec) {
      obj.cache_expired_sec = 1;
    }
    if (obj?.data) {
      obj.data = [{ "query": "搜索内容" }]
    }
    if (obj?.show_style?.roll_period) {
      obj.show_style.roll_period = 1000;
    }
  } else if (url.includes("/views_home/")) {
    if (obj?.cards?.length > 0) {
      obj.cards = obj.cards.filter((i) =>
        ![
          "ad_mobile_flow", // 信息流广告
          "ad_trueview", //信息流广告
          "focus", // 顶部横版广告
          "qy_home_vip_opr_banner" // 会员营销banner
        ].includes(i?.alias_name)
      );
    }
  } else if (url.includes("/waterfall/")) {
    if (obj?.cards?.length > 0) {
      let card = obj.cards[0];
      if (card?.blocks?.length > 0) {
        card.blocks = card.blocks.filter(
          (i) => !i.hasOwnProperty("block_class")
        );
      }
    }
  }
} else if (isMG) {
  if (url.includes("/dynamic/v1/channel/index/")) {
    if (obj?.data?.items) {
      delete obj.data.items;
    }
  }
} else if (isYK) {
  if (url.includes("/mtop.youku.play.ups.appinfo.get/")) {
    if (obj.data?.data) {
      const item = ["ad", "ykad", "watermark"];
      for (let i of item) {
        if (obj.data.data?.[i]) {
          delete obj.data.data[i];
        }
      }
    }
  }
}

$done({ body: JSON.stringify(obj) });