const url = $request.url;
if (!$response.body) {
  $done({});
}

let body = $response.body;
let obj = JSON.parse(body);

if (url.includes("/2/statuses/container_detail_comment")) {
    // 确保响应对象和其中的items数组存在且不为空
    if (obj?.items?.length > 0) {
        // 使用filter方法移除广告项
        obj.items = obj.items.filter(item => {
            // 规则1：识别并删除罗伯特总结的广告卡片
            const isAIAdCard = item?.category === "card" && 
                               item?.data?.card_type === 236 && 
                               item?.data?.wboxParam?.title === "罗伯特总结";

            // 规则2：识别并删除评论区中的趋势广告
            const isTrendAd = item?.category === "trend" && item?.data?.blog?.is_ad === 1;

            // 如果项目是广告（isAIAdCard或isTrendAd为true），则返回false，将其从数组中移除。
            return !(isAIAdCard || isTrendAd);
        });
    }
}

body = JSON.stringify(obj);
$done({body});