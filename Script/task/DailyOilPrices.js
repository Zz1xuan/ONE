//  作者deezertidal
/*
[task_local]
0 0 8 ? * * https://raw.githubusercontent.com/OocMe/ONE/main/Script/task/DailyOilPrices.js, tag=每日油价, enabled=true
*/
const apiurl = "?key=7de401b696e9905ca60899d9945a1996&prov=浙江";

$task.fetch({ url: apiurl }).then(response => {
    var obj = JSON.parse(response.body);
    var prov = obj.result.prov;
    var p0 = "0号柴油:" + "¥" + obj.result.p0 + "\xa0\xa0\xa0";
    var p92 = "92号汽油:" + "¥" + obj.result.p92 + "\xa0\xa0\xa0";
    var p95 = "95号汽油:" + "¥" + obj.result.p95 + "\xa0\xa0\xa0";
    var p98 = "98号汽油:" + "¥" + obj.result.p98 + "\xa0\xa0\xa0";
    var time = obj.result.time;
    $notify(prov + "油价提醒", time, p92 + p95 + p98 + p0);
    $done();
}, reason => {
    console.log(reason.error);
    $done();
});
