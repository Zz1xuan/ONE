//在墨鱼和rucu6两位大佬的文件下进行融合改进
var obj = JSON.parse($response.body);
var url = $request.url;

if (/mtop\.cainiao\.nbpresentation\.protocol\.homepage\.get\.cn/.test(url)) {
    if (obj.data?.result?.dataList?.length > 0) {
        obj.data.result.dataList = obj.data.result.dataList.filter(d => 
            d.type !== "big_banner_area_v870" && d.type !== "new_big_banner_area"
        );
    }
} else if(/mtop\.cainiao\.nbpresentation\.homepage\.merge\.get\.cn/.test(url)) {
    if (obj.data?.result?.dataList?.length > 0) {
        obj.data.result.dataList = obj.data.result.dataList.filter(d => 
            d.materialContentMapper?.advRecGmtModifiedTime !== "1680745292000"
        );
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
