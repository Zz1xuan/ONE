const url = $request.url;
const body = $response?.body;

if (!body) $done({});

// 配置化的过滤规则
const FILTER_CONFIG = {
  blockedEntityIds: [945, 6390, 8639, 29349, 33006, 32557],
  blockedTemplates: ["sponsorCard", "iconButtonGridCard", "iconLargeScrollCard"],
  blockedKeywords: ["值得买", "红包"],
  blockedTitlePatterns: /流量|精选配件/
};

const processJSON = (processor) => {
  try {
    const obj = JSON.parse(body);
    processor(obj);
    $done({ body: JSON.stringify(obj) });
  } catch (err) {
    console.log(`处理异常: ${err}`);
    $done({});
  }
};

// 通用过滤函数
const filterValidItems = (items) => items?.filter(item => item.id) || [];

const filterContent = (items) => {
  if (!items) return items;
  
  return items.filter(item => {
    // 过滤广告模板
    if (FILTER_CONFIG.blockedTemplates.includes(item.entityTemplate)) return false;
    
    // 过滤特定ID
    if (FILTER_CONFIG.blockedEntityIds.includes(item.entityId)) return false;
    
    // 过滤关键词
    if (item.title && FILTER_CONFIG.blockedKeywords.some(keyword => 
      item.title.includes(keyword))) return false;
    
    return true;
  });
};

// 路由处理
const urlHandlers = {
  'replyList': (obj) => {
    if (obj.data?.length) {
      obj.data = filterValidItems(obj.data);
    }
  },
  
  'main/init': (obj) => {
    if (obj.data?.length) {
      obj.data = obj.data.filter(item => 
        ![945, 6390].includes(item.entityId)
      );
    }
  },
  
  'indexV8': (obj) => {
    if (obj.data) {
      obj.data = filterContent(obj.data);
    }
  },
  
  'dataList': (obj) => {
    if (obj.data) {
      obj.data = obj.data.filter(item => {
        if (FILTER_CONFIG.blockedTemplates.includes(item.entityTemplate)) return false;
        if (FILTER_CONFIG.blockedTitlePatterns.test(item.title)) return false;
        return true;
      });
    }
  },
  
  'detail': (obj) => {
    const data = obj.data;
    if (data) {
      // 过滤回复列表
      data.hotReplyRows = filterValidItems(data.hotReplyRows);
      data.topReplyRows = filterValidItems(data.topReplyRows);
      
      // 清空广告相关字段
      ['include_goods_ids', 'include_goods', 'detailSponsorCard'].forEach(field => {
        if (data[field]) data[field] = [];
      });
    }
  }
};

// 执行处理
const handler = Object.keys(urlHandlers).find(key => url.includes(key));
if (handler) {
  processJSON(urlHandlers[handler]);
} else {
  $done({});
}