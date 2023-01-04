// 2023-01-04 17:42

var body = $response.body;
var method = $request.method;
var url = $request.url;

if (!body) $done({});
  //首页卡片
  if (/^https:\/\/m5\.amap\.com\/ws\/faas\/amap-navigation\/main-page(-location)?\?/.test(url)) {
    let obj = JSON.parse(body);
      if (obj.data && obj.data.cardList) {
        obj.data.cardList = obj.data.cardList.filter((item) => {
          return item.dataKey === "LoginCard";
        });
      }
      body = JSON.stringify(obj);
  }
  //首页消息
  if (/^https:\/\/m5\.amap\.com\/ws\/faas\/amap-navigation\/main-page-assets\?/.test(url)) {
    let obj = JSON.parse(body);
      if (obj.msgs) {
        obj.msgs = [];
      } else if (obj.data.pull3 && obj.data.pull3.msgs) {
        obj.data.pull3.msgs = [];
      }
      body = JSON.stringify(obj);
  }
  //首页消息
  if (/^https:\/\/sns\.amap\.com\/ws\/msgbox\/pull(3|_mp)\?/.test(adUrls)) {
    try {
      let obj = JSON.parse(body);
      if (obj.msgs) {
        obj.msgs = [];
      } else if (obj.data.pull3 && obj.data.pull3.msgs) {
        obj.data.pull3.msgs = [];
      }
      body = JSON.stringify(obj);
  }
  //我的
  if (/^https:\/\/m5\.amap\.com\/ws\/shield\/dsp\/profile\/index\/nodefaasv3\?/.test(adUrls)) {
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
  }
    
$done({ body });
