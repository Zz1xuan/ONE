//https://raw.githubusercontent.com/ddgksf2013/Rewrite/master/AdBlock/Amap.conf

const version = 'V1.0.29';

var obj = JSON.parse($response.body);

if (-1 !== $request.url.indexOf("valueadded/alimama/splash_screen")) {
  if (obj.data && obj.data.ad) {
    for (let a of obj.data.ad) {
      a.set.setting.display_time = 0;
      a.creative[0].start_time = 2240150400;
      a.creative[0].end_time = 2240150400;
    }
  }
  $done({ body: JSON.stringify(obj) });
} else if (-1 !== $request.url.indexOf("faas/amap-navigation/main-page")) {
  if (obj.data?.cardList) {
    obj.data.cardList = Object.values(obj.data.cardList).filter(a => "LoginCard" == a.dataType || "FrequentLocation" == a.dataType);
  }
  if (obj.data?.pull3?.msgs) {
    obj.data.pull3.msgs = [];
  }
  if (obj.data?.business_position) {
    obj.data.business_position = [];
  }
  if (obj.data?.mapBizList) {
    obj.data.mapBizList = [];
  }
  $done({ body: JSON.stringify(obj) });
} else if (-1 !== $request.url.indexOf("profile/index/node")) {
  delete obj.data.tipData;
  if (obj.data?.cardList) {
    obj.data.cardList = Object.values(obj.data.cardList).filter(a => "MyOrderCard" == a.dataType || "GdRecommendCard" == a.dataType);
  }
  $done({ body: JSON.stringify(obj) });
} else if (-1 !== $request.url.indexOf("new_hotword")) {
  if (obj.data?.header_hotword) {
    obj.data.header_hotword = [];
  }
  $done({ body: JSON.stringify(obj) });
} else if (-1 !== $request.url.indexOf("ws/promotion-web/resource")) {
  let e = ["icon", "banner", "tips", "popup", "bubble"];
  for (let o of e) {
    if (obj.data?.[o]) {
      obj.data[o] = [];
    }
  }
  $done({ body: JSON.stringify(obj) });
} else if (-1 !== $request.url.indexOf("ws/msgbox/pull")) {
  if (obj.msgs) {
    obj.msgs = [];
  }
  if (obj.pull3?.msgs) {
    obj.pull3.msgs = [];
  }
  $done({ body: JSON.stringify(obj) });
} else if (-1 !== $request.url.indexOf("ws/message/notice/list")) {
  if (obj.data?.noticeList) {
    obj.data.noticeList = [];
  }
  $done({ body: JSON.stringify(obj) });
} else if (-1 !== $request.url.indexOf("ws/shield/frogserver/aocs")) {
  let tArr = ["gd_notch_logo", "home_business_position_config", "his_input_tip", "operation_layer"];
  for (let t of tArr) {
    if (obj.data?.[t]) {
      obj.data[t] = { status: 1, version: "", value: "" };
    }
  }
  $done({ body: JSON.stringify(obj) });
} else if (-1 !== $request.url.indexOf("search/nearbyrec_smart")) {
  let i = ["coupon", "scene", "activity", "commodity_rec"];
  if (obj.data) {
    i.forEach(a => {
      delete obj.data[a];
    });
    if (obj.data.modules) {
      obj.data.modules = obj.data.modules.filter(a => !i.includes(a));
    }
  }
  $done({ body: JSON.stringify(obj) });
} else {
  $done({});
}
