#取自https://raw.githubusercontent.com/RuCu6/QuanX/main/Scripts/myBlockAds.js

var body = $response.body;
var method = $request.method;
var url = $request.url;

if (!body) $done({});  

function adAppName(adUrls) {
  if (/^https:\/\/m5\.amap\.com\/ws\/faas\/amap-navigation\/main-page(-location)?\?/.test(adUrls)) return "高德地图-首页卡片";
  if (/^https:\/\/m5\.amap\.com\/ws\/faas\/amap-navigation\/main-page-assets\?/.test(adUrls)) return "高德地图-首页消息";
  if (/^https:\/\/sns\.amap\.com\/ws\/msgbox\/pull(3|_mp)\?/.test(adUrls)) return "高德地图-首页消息";
  if (/^https:\/\/m5\.amap\.com\/ws\/shield\/dsp\/profile\/index\/nodefaasv3\?/.test(adUrls)) return "高德地图-我的";
return "";
}

switch (adAppName(url)) {
case "高德地图-首页卡片":
    try {
      let obj = JSON.parse(body);
      if (obj.data && obj.data.cardList) {
        obj.data.cardList = obj.data.cardList.filter((item) => {
          return item.dataKey === "LoginCard";
        });
      }
      body = JSON.stringify(obj);
    } catch (error) {
      console.log(`高德地图-首页卡片, 出现异常`);
    }
    break;
  case "高德地图-首页消息":
    try {
      let obj = JSON.parse(body);
      if (obj.msgs) {
        obj.msgs = [];
      } else if (obj.data.pull3 && obj.data.pull3.msgs) {
        obj.data.pull3.msgs = [];
      }
      body = JSON.stringify(obj);
    } catch (error) {
      console.log(`高德地图-首页消息, 出现异常`);
    }
    break;
  case "高德地图-我的":
    try {
      let obj = JSON.parse(body);
      if (obj.data && obj.data.cardList) {
        for (let i = 0; i < obj.data.cardList.length; i++) {
          obj.data.cardList.localCache = false;
        }
        obj.data.cardList = obj.data.cardList.filter((item) => {
          return (
            // item.dataKey === "AnnualBillCardV2" || // 年度报告
            item.dataKey === "MyOrderCard" || // 我的订单
            // item.dataKey === "GdRecommendCard" || // 高德推荐
            item.dataKey === "SceneVehicleCard_recommend" || // 我的车辆
            item.dataKey === "SceneVehicleCard_function" // 我的车辆
            // item.dataKey === "PopularActivitiesCard" // 热门活动
            // item.dataKey === "GameExcitation" || // 小德爱消除
            // item.dataKey === "GoodsShelvesCard" || // 精选服务
            // item.dataKey === "DiyMap_function" || // DIY 地图
          );
        });
      }
      body = JSON.stringify(obj);
    } catch (error) {
      console.log(`高德地图-我的, 出现异常`);
    }
    break;
}

$done({ body });
