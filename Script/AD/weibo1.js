const url = $request.url;
if (!$response.body) {
  $done({});
}

let body = $response.body;
let obj = JSON.parse(body);

if (url.includes("/2/statuses/container_detail")) {
  if (obj?.pageHeader?.items) {
    obj.pageHeader.items = obj.pageHeader.items.filter(item => {
      // 1. 删除“大家都在搜”的卡片，通过其显示的提示文本来识别
      const isTopSearchingCard = 
        item?.category === "card" && 
        item?.data?.card_type === 248 && 
        item?.data?.hint === "大家都在搜";

      // 2. 删除 wboxcard 广告，通过其广告标志 is_ad_card 来识别
      const isWboxCardAd = item?.data?.is_ad_card === 1;

      // 3. 删除“博主好物种草”模块，通过其 category 和标题来识别
      const isBloggerModule = 
        item?.category === "group" && 
        item?.header?.title?.content === "博主好物种草";

      // 4. 删除“关注推荐”模块，通过其 category 和唯一ID来识别
      const isFollowRecommendations = 
        item?.category === "group" && 
        item?.itemExt?.anchorId === "2302831003_";

      // 5. 删除 trend 类型的广告
      const isTrendAd = item?.data?.is_ad === 1;

      return !(isTopSearchingCard || isWboxCardAd || isBloggerModule || isFollowRecommendations || isTrendAd);
    });
  }

  // 删除“点赞是美意”的赞赏信息
  if (obj?.detailInfo?.status) {
    if (obj.detailInfo.status.reward_exhibition_type) {
      delete obj.detailInfo.status.reward_exhibition_type;
    }
    if (obj.detailInfo.status.reward_scheme) {
      delete obj.detailInfo.status.reward_scheme;
    }
  }
  if (obj?.detailInfo?.extend) {
    if (obj.detailInfo.extend.reward_exhibition_type) {
      delete obj.detailInfo.extend.reward_exhibition_type;
    }
    if (obj.detailInfo.extend.reward_scheme) {
      delete obj.detailInfo.extend.reward_scheme;
    }
  }
} else if (url.includes("/2/statuses/container_detail_comment")) {
  if (obj?.items?.length > 0) {
    obj.items = obj.items.filter(item => {
      // 1. 删除罗伯特总结的广告卡片
      const isAIAdCard = item?.category === "card" &&  
                         item?.data?.card_type === 236 &&  
                         item?.data?.wboxParam?.title === "罗伯特总结";
      
      // 2. 删除评论区中的趋势广告，通过is_ad字段来识别
      const isTrendAd = item?.category === "trend" && item?.data?.blog?.is_ad === 1;

      return !(isAIAdCard || isTrendAd);
    });
  }
}

body = JSON.stringify(obj);
$done({body});