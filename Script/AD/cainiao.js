//在墨鱼和rucu6两位大佬的文件下进行融合改进
var obj = JSON.parse($response.body);
var url = $request.url;

if (/mtop\.cainiao\.nbpresentation\.protocol\.homepage\.get\.cn/.test(url)) {
    if (obj.data?.result?.dataList?.length > 0) {
        obj.data.result.dataList = obj.data.result.dataList.map((i) => {
            if (i.type.includes("kingkong")) {
                if (i.bizData.items) {
                    for (let ii of i.bizData.items) {
                        ii.rightIcon = null;
                        ii.bubbleText = null;
                    }
                }
            } else if (i.type.includes("icons_scroll")) {
                // 顶部图标
                if (i.bizData.items) {
                    const item = [
                        //"gjjf", // 裹酱积分
                        //"618cjhb", // 超级红包
                        "bgxq", // 包裹星球
                        "cngreen", // 绿色家园
                        //"cncy", // 填字赚现金
                        //"cngy", // 免费领水果
                        //"jkymd", // 集卡赢免单
                        //"ljjq", // 领寄件券
                        //"ttlhb", // 天天领红包
                        //"xybg", // 幸运包裹
                        "appCentreMore" //更多
                    ];
                    i.bizData.items = i.bizData.items
                        .filter((ii) => item.includes(ii.key))
                        .map((ii) => {
                            ii.rightIcon = null;
                            ii.bubbleText = null;
                            return ii;
                        });
                }
            } else if (i.type.includes("banner_area") || i.type.includes("promotion")) {
                // 新人福利、幸运抽奖、促销活动
                return null;
            }
            return i;
        }).filter(Boolean); // 去除为 null 的项
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
