/***********************************

> 应用名称：阿里云盘
> 脚本作者：Cuttlefish
> 微信账号：墨鱼手记
> 更新时间：2022-10-16
> 通知频道：https://t.me/ddgksf2021
> 投稿助手：https://t.me/ddgksf2013_bot
> 脚本功能：优化首页display
> 问题反馈：📮 ddgksf2013@163.com 📮
> 特别说明：⛔⛔⛔
            本脚本仅供学习交流使用，禁止转载售卖
            ⛔⛔⛔



[rewrite_local]

# ～ 阿里云盘（2022-10-16）@ddgksf2013
^https?:\/\/api\.aliyundrive\.com\/apps\/v\d\/users\/apps\/widgets$ url script-response-body https://ocd0522.tk/ddgksf2013/Cuttlefish/raw/branch/master/Script/alidrive.js

[mitm]

hostname=api.aliyundrive.com

***********************************/

let obj = JSON.parse($response.body);

if (obj.result) {
  obj.result = obj.result.filter((item) => item.appCode === "file" || item.appCode === "video");
}
if (obj.activities) delete obj.activities;
if (obj.myBackup) delete obj.myBackup;

$done({ body: JSON.stringify(obj) });
