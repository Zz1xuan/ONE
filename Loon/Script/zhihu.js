// 2023-03-26 17:25

if (!$response.body) $done({});
const url = $request.url;
let body = $response.body;

if (url.includes("/appview/v3/zhmore")) {
  // 我的页面
  body = body.replace(/<\/style><main.*<\/div><\/main>/g, "");
  $done({ body });
} else {
  let obj = JSON.parse(body);
  if (url.includes("/api/cloud/config/all")) {
    if (obj.data?.configs) {
      obj.data.configs.forEach((i) => {
        if (i.configKey === "feed_gray_theme") {
          if (i.configValue) {
            i.configValue.start_time = "2208960000";
            i.configValue.end_time = "2209046399";
            i.status = false;
          }
        } else if (i.configKey === "feed_top_res") {
          if (i.configValue) {
            i.configValue.start_time = "2208960000";
            i.configValue.end_time = "2209046399";
            i.status = false;
          }
        }
      });
    }
  } else if (url.includes("/appcloud2.zhihu.com/v3/config")) {
    if (obj.config) {
      if (obj.config.homepage_feed_tab) {
        obj.config.homepage_feed_tab.tab_infos =
          obj.config.homepage_feed_tab.tab_infos.filter((i) => {
            if (i.tab_type === "activity_tab") {
              i.start_time = "2208960000";
              i.end_time = "2209046399";
              return true;
            } else {
              return false;
            }
          });
      }
      if (obj.config.hp_channel_tab) {
        delete obj.config.hp_channel_tab;
      }
      if (obj.config.zombie_conf) {
        obj.config.zombie_conf.zombieEnable = false;
      }
      if (obj.config.gray_mode) {
        obj.config.gray_modeenable = false;
        obj.config.gray_mode.start_time = "2208960000";
        obj.config.gray_mode.end_time = "2209046399";
      }
      if (obj.config.zhcnh_thread_sync) {
        obj.config.zhcnh_thread_sync.LocalDNSSetHostWhiteList = [];
        obj.config.zhcnh_thread_sync.isOpenLocalDNS = "0";
        obj.config.zhcnh_thread_sync.ZHBackUpIP_Switch_Open = "0";
        obj.config.zhcnh_thread_sync.dns_ip_detector_operation_lock = "1";
        obj.config.zhcnh_thread_sync.ZHHTTPSessionManager_setupZHHTTPHeaderField =
          "1";
      }
      obj.config.zvideo_max_number = 1;
      obj.config.is_show_followguide_alert = false;
    }
  } else if (url.includes("/api/v4/answers")) {
    if (obj.paging) {
      obj.paging = {};
    }
    if (obj.data) {
      obj.data = {};
    }
  } else if (url.includes("/api/v4/articles")) {
    if (obj.ad_info) {
      obj.ad_info = {};
    }
  } else if (url.includes("/commercial_api/app_float_layer")) {
    // 悬浮图标
    if ("feed_egg" in obj) {
      obj = {};
    }
  } else if (url.includes("/moments_v3")) {
    if (obj.data) {
      obj.data = obj.data.filter((i) => !i?.title?.includes("为您推荐"));
    }
  } else if (url.includes("/next-data")) {
    if (obj.data.data) {
      obj.data.data = obj.data.data.filter(
        (i) => !(i?.type?.includes("ad") || i.data.answer_type === "PAID")
      );
    }
  } else if (url.includes("/people/homepage_entry")) {
    const item = [
      // "钱包",
      // "付费咨询",
      // "传视频",
      // "开直播",
      // "芝士商单",
      "书架",
      "已购",
      // "创作训练营",
      // "活动广场",
      // "圆桌",
      "专题",
      // "圈子",
      "社区共建",
      "帮助与客服"
      // "盐值分"
    ];
    if (obj.list) {
      obj.list = obj.list.filter((i) => {
        if (item.indexOf(i.name) !== -1) {
          return true;
        } else {
          return false;
        }
      });
    }
  } else if (url.includes("/root/window")) {
    if (obj.guide) {
      obj.guide = {};
    }
  } else if (url.includes("/topstory/recommend")) {
    // 推荐信息流
    if (obj.data) {
      obj.data = obj.data.filter((i) => {
        if (
          i.type === "market_card" &&
          i.fields?.header?.url &&
          i.fields.body?.video?.id
        ) {
          let videoID = getUrlParamValue(item.fields.header.url, "videoID");
          if (videoID) {
            i.fields.body.video.id = videoID;
          }
        } else if (i.type === "common_card") {
          // 推广视频
          if (i.extra?.type === "zvideo") {
            let videoUrl = i.common_card.feed_content.video.customized_page_url;
            let videoID = getUrlParamValue(videoUrl, "videoID");
            if (videoID) {
              i.common_card.feed_content.video.id = videoID;
            }
          } else if (i.common_card?.feed_content?.video?.id) {
            let search = '"feed_content":{"video":{"id":';
            let str = $response.body.substring(
              $response.body.indexOf(search) + search.length
            );
            let videoID = str.substring(0, str.indexOf(","));
            i.common_card.feed_content.video.id = videoID;
          } else if (
            i.common_card?.footline?.elements?.[0]?.text?.panel_text?.includes(
              "广告"
            )
          ) {
            return false;
          } else if (i?.promotion_extra) {
            // 营销信息
            return false;
          }
          return true;
        } else if (i.type === "pin_aggregation_card") {
          // 横排卡片
          return false;
        } else if (i.type === "feed_advert") {
          // 伪装成正常内容的卡片
          return false;
        }
        return true;
      });
    }
  } else if (url.includes("/v2/topstory/hot-lists/everyone-seeing")) {
    // 热榜信息流
    if (obj.data.data) {
      // 合作推广
      obj.data.data = obj.data.data.filter(
        (i) => !i.target?.metrics_area?.text?.includes("合作推广")
      );
    }
  } else if (url.includes("/v4/questions") || url.includes("/questions")) {
    // 问题回答列表广告
    if (obj.data.ad_info) {
      obj.data.ad_info = {};
    }
    if (obj.ad_info) {
      obj.ad_info = {};
    }
  }
  $done({ body: JSON.stringify(obj) });
}

function getUrlParamValue(url, queryName) {
  return Object.fromEntries(
    url
      .substring(url.indexOf("?") + 1)
      .split("&")
      .map((pair) => pair.split("="))
  )[queryName];
}
