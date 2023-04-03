let body = $response.body;
if (body) {
  switch (true) {
    case /adrive\/v1\/user\/driveCapacityDetails/.test($request.url):
      let keyr = JSON.parse($response.body);
      keyr.drive_total_size = 55834574848000; //详情
      body = JSON.stringify(keyr);
      break;
    case /v2\/databox\/get_personal_info/.test($request.url):
      let keyss = JSON.parse($response.body); keyss.personal_space_info.total_size = 57174604644352;
      body = JSON.stringify(keyss); //我的,单位字节(B)
      break;
    case /business\/v1\.0\/users\/feature\/list/.test($request.url):
      body = body.replace(/intercept":true/g, 'intercept": false').replace(/name":"(.*?)"/g, 'name": "vip"');
      break;
    case /apps\/v1\/users\/home\/widgets/.test($request.url):
      let home = JSON.parse(body);
      const coreFeatures = home.coreFeatures;
      coreFeatures.items = coreFeatures.items.filter(item => item.code !== "document").map(item => {
        if (item.name === "图书") {
          item.name = "笔记";
        }
        if (item.code === "book") {
          item.code = "node";
        }
        if (item.action === "smartdrive:\/\/app\/book?mode=push") {
          item.action = "smartdrive:\/\/app\/note";
        }
        return item;
      });
      const removeKeys = [
        "recentUsed", // 最近在看
        // "coreFeatures", // 顶部图标
        "activities", // 精选活动
        "myBackup", // 我的备份
        // "recentSaved", // 最近转存
        //"signIn" // 顶部签到
      ];
      removeKeys.forEach(key => delete home[key]);
      body = JSON.stringify(home);
      break;
    case /apps\/v1\/users\/apps\/welcome/.test($request.url):
      let tip = {
        "title": "key",
        "description": "摆烂云盘",
        "emojis": ["🍉"]
      };
      body = JSON.stringify(tip);
      break;
    default:
      $done({})
      break;
  }$done({ 'body': body })
} else $done({});
