const apiurl = "https://apis.tianapi.com/oilprice/index??key=7de401b696e9905ca60899d9945a1996&prov=%E6%B5%99%E6%B1%9F";

$http.get(apiurl).then(response => {
    const obj = response.data;
    const prov = obj.result.prov;
    const p0 = `0号柴油: ¥${obj.result.p0}\xa0\xa0\xa0`;
    const p92 = `92号汽油: ¥${obj.result.p92}\xa0\xa0\xa0`;
    const p95 = `95号汽油: ¥${obj.result.p95}\xa0\xa0\xa0`;
    const p98 = `98号汽油: ¥${obj.result.p98}\xa0\xa0\xa0`;
    const time = obj.result.time;
    $notify(`${prov}油价提醒`, time, `${p92}${p95}${p98}${p0}`);
    $done();
}, reason => {
    console.log(reason.error);
    $done();
});
