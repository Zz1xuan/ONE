let body = $response.body;
if (body) {
  switch (true) {
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
        "coreFeatures", // 顶部图标
        "activities", // 精选活动
        "myBackup", // 我的备份
        "recentSaved", // 最近转存
        "signIn" // 顶部签到
      ];
      removeKeys.forEach(key => delete home[key]);
      body = JSON.stringify(home);
      break;
    default:
      $done({})
      break;
  }$done({ 'body': body })
} else $done({});
