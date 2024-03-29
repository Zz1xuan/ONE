
if (!$response.body) $done({});
const url = $request.url;
let obj = JSON.parse($response.body);

if (obj.data) {
  if (url.includes("/faas/amap-navigation/main-page")) {
    // 高德地图-首页卡片
    if (obj.data.cardList) {
      obj.data.cardList = obj.data.cardList.filter(
        (item) => item.dataKey === "LoginCard" || item.dataKey === "FrequentLocation"
      );
    }
    if (obj.data.mapBizList) {
      obj.data.mapBizList = [];
    }
  } else if (url.includes("/promotion-web/resource")) {
    // 高德地图-打车
    if (obj.data.banner) {
      obj.data.banner = [];
    }
    if (obj.data.bubble) {
      obj.data.bubble = [];
    }
    if (obj.data.icon) {
      obj.data.icon = [];
    }
    if (obj.data.popup) {
      obj.data.popup = [];
    }
    if (obj.data.tips) {
      obj.data.tips = [];
    }
  } else if (url.includes("/shield/dsp/profile/index/nodefaasv3")) {
    // 高德地图-我的
    if (obj.data.cardList) {
      obj.data.cardList = obj.data.cardList.filter((item) => 
          item.dataKey === "MyOrderCard" || // 我的订单
          item.dataKey === "GdRecommendCard" // 高德推荐
          // item.dataKey === "SceneVehicleCard_recommend" || // 我的车辆
          // item.dataKey === "SceneVehicleCard_function" || // 我的车辆
          // item.dataKey === "PopularActivitiesCard" || // 热门活动
          // item.dataKey === "GameExcitation" || // 小德爱消除
          // item.dataKey === "GoodsShelvesCard" || // 精选服务
          // item.dataKey === "DiyMap_function" || // DIY 地图
      );
    }
  } else if (url.includes("/shield/frogserver/aocs")) {
    if (obj.data.operation_layer) {
      obj.data.operation_layer = {
        status: 1,
        version: "",
        value: ""
      };
    }
    // 高德地图-首页右上角动图
    if (obj.data.home_business_position_config) {
      obj.data.home_business_position_config = {
        status: 1,
        version: "",
        value: ""
      };
    }
  } else if (url.includes("/shield/search/nearbyrec_smart")) {
    // 高德地图-附近
    if (obj.data.modules) {
      obj.data.modules = obj.data.modules.filter(
        (item) =>
          item === "head" || item === "search_hot_words" || item === "feed_rec"
      );
    }
  } else if (url.includes("/valueadded/alimama/splash_screen")) {
    // 高德地图-开屏广告
    if (obj.data.ad) {
      for (let item of obj.data.ad) {
        item.set.setting.display_time = 0;
        item.creative[0].start_time = 2208960000; // Unix 时间戳 2040-01-01 00:00:00
        item.creative[0].end_time = 2209046399; // Unix 时间戳 2040-01-01 23:59:59
      }
    }
  }
}

body = JSON.stringify(obj);
$done({ body });
