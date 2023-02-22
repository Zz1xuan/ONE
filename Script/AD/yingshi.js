let data = {
  "meta" : {
    "message" : "操作成功",
    "moreInfo" : null,
    "code" : 200
  },
  "grayConfigInfos" : {
    "155" : {
      "desc" : "ios-tab-扫地机来了",
      "switchStatus" : "{\"bgColor\":\"#FFFFFF\",\"titleSelectedColor\":\"#648FFC\",\"titleUnselectedColor\":\"#999999\",\"titleSelectedColorAlpha\":1,\"bgColorAlpha\":1,\"titleUnselectedColorAlpha\":1,\"enable\":true,\"startTime\":1662307200000,\"stopTime\":1662566400000,\"tabitems\":[{\"iconUrl\":\"http://statics.ys7.com/device/image/TESTTAB/11.json\",\"title\":\"萤石\"},{\"iconUrl\":\"http://statics.ys7.com/device/image/TESTTAB/12.json\",\"title\":\"智能\"},{\"iconUrl\":\"http://statics.ys7.com/device/image/TESTTAB/13.json\",\"title\":\"商城\"},{\"iconUrl\":\"http://statics.ys7.com/device/image/TESTTAB/14.json\",\"title\":\"发现\"},{\"iconUrl\":\"http://statics.ys7.com/device/image/TESTTAB/15.json\",\"title\":\"我的\"}]}"
    }
  }
};

// 将 switchStatus 字段解析为对象
let switchStatus = JSON.parse(data.grayConfigInfos["155"].switchStatus);

// 过滤掉不需要的字段
switchStatus.tabitems = switchStatus.tabitems.filter(item => item.iconUrl !== "http://statics.ys7.com/device/image/TESTTAB/12.json" && item.iconUrl !== "http://statics.ys7.com/device/image/TESTTAB/13.json" && item.iconUrl !== "http://statics.ys7.com/device/image/TESTTAB/14.json");

// 将过滤后的对象转化为字符串
data.grayConfigInfos["155"].switchStatus = JSON.stringify(switchStatus);

// 发送修改后的数据到服务器
// your code here
