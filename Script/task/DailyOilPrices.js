const apiurl = "https://apis.tianapi.com/oilprice/index?key=7de401b696e9905ca60899d9945a1996&prov=%E6%B5%99%E6%B1%9F";

const $tool = {
    notify: (title, subtitle, message) => {
        if ($task) {
            $notify(title, subtitle, message);
        }
        if ($notification) {
            $notification.post(title, subtitle, message);
        }
    }
};

$task.fetch({ url: apiurl }).then(response => {
    var obj = JSON.parse(response.body);
    var prov = obj.result.prov;
    var p0 = "0号柴油:" + "¥" + obj.result.p0 + "\xa0\xa0\xa0";
    var p92 = "92号汽油:" + "¥" + obj.result.p92 + "\xa0\xa0\xa0";
    var p95 = "95号汽油:" + "¥" + obj.result.p95 + "\xa0\xa0\xa0";
    var p98 = "98号汽油:" + "¥" + obj.result.p98 + "\xa0\xa0\xa0";
    var time = obj.result.time;
    $tool.notify(prov + "油价提醒", time, p92 + p95 + p98 + p0);
    $done();
}, reason => {
    console.log(reason.error);
    $done();
});
