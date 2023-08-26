//在墨鱼和rucu6两位大佬的文件下进行融合改进
var obj = JSON.parse($response.body);
var url = $request.url;

if (/mtop\.cainiao\.nbpresentation\.protocol\.homepage\.get\.cn/.test(url)) {
    if (obj.data?.result?.dataList?.length > 0) {
        const allowedKeys = new Set([
            //"gjjf", // 裹酱积分
            "bgxq", // 包裹星球
            "cngreen", // 绿色家园
            "ttlhb", // 天天领红包
            //"ljjq", // 领寄件券
            //"618cjhb", // 超级红包
            //"cncy", // 填字赚现金
            //"cngy", // 免费领水果
            //"xybg", // 幸运包裹
            //"jkymd", // 集卡赢免单
            //"qydq", // 亲友代取
            //"jkymd", // 集卡赢免单
            //"dzjj", // 到站寄件
            "appCentreMore" // 更多
            
        ]);
        obj.data.result.dataList = obj.data.result.dataList
            .filter(d => d.type !== "big_banner_area_v870" && d.type !== "new_big_banner_area")
            .map(d => {
                if (d.bizData?.items) {
                    d.bizData.items = d.bizData.items.filter(item => allowedKeys.has(item.key));
                }
                return d;
            });
    }
} else if (/mtop\.cainiao\.guoguo\.nbnetflow\.ads\.mshow/.test(url)) {
    if (obj.data["1308"]) delete obj.data["1308"];
    if (obj.data["1275"]) delete obj.data["1275"];
} else if (/mtop\.cainiao\.guoguo\.nbnetflow\.ads\.index\.cn/.test(url)) {
    if (obj.data?.result) obj.data.result = [{}];
} else if (/mtop\.cainiao\.adkeyword/.test(url)) {
    if (obj.data?.result?.adHotKeywords) obj.data.result.adHotKeywords = [];
} else if (/mtop\.cainiao\.guoguo\.nbnetflow\.ads\.show/.test(url)) {
    if (obj.data?.result) {
        obj.data.result = obj.data.result.filter(
            i =>
            !(
                i?.materialContentMapper?.adItemDetail ||
                (i?.materialContentMapper?.bgImg &&
                    i?.materialContentMapper?.advRecGmtModifiedTime) ||
                ["common_header_banner", "entertainment", "kuaishou_banner"].includes(
                    i?.materialContentMapper?.group_id
                ) 
            )
        );
    }
}

var body = JSON.stringify(obj);
$done({ body });
