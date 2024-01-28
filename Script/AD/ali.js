//https://github.com/RuCu6/QuanX/blob/main/Scripts/adrive.js

const url = $request.url;
if (!$response.body) $done({});
let obj = JSON.parse($response.body);

if (url.includes("/v2/users/home/news")) {
    if (obj.result.length) {
        obj.result = obj.result.filter(
        (i) => !i?.code?.includes("productUpdate")
    );
    }
} else if (url.includes("/v2/users/home/widgets")) {
    const item = [
        "banners", // 顶部奖励
        //"coreFeatures", // 横版图标
        "mainBackup", // 手机备份
        //"minorBackup", // 备份设备列表
        //"signIn" // 签到
    ];
    item.forEach((i) => {
    delete obj[i];
    });
}

$done({ body: JSON.stringify(obj) });