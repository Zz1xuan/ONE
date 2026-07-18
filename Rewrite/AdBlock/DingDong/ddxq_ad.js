/** Quantumult X: 叮咚买菜响应去广告（基于 2026-07-18 HAR） */
const url = $request.url;
let body = $response.body;

try {
  const obj = JSON.parse(body);

  // 纯广告接口：保持服务端通用响应外壳，清空 data，避免 reject-dict 导致客户端空指针。
  if (/\/advert\/(?:startUpScreen|getAd|getPreloadAd|getAtmosphere)(?:\?|$)/.test(url)) {
    obj.data = /\/advert\/getAd(?:\?|$)/.test(url) ? {} : null;
  }

  // 首页弹窗接口：HAR 证实 data 仅承载新人/商品营销弹窗或 vega_pop_info。
  if (/\/homeApi\/getHomeAdPop(?:\?|$)/.test(url)) obj.data = null;

  // 混合业务接口只删除明确广告字段，不清空积分/签到等正常数据。
  deepDeleteAdFields(obj);
  body = JSON.stringify(obj);
} catch (error) {
  console.log(`ddxq_ad: JSON 解析失败，保持原响应: ${error}`);
}

$done({body});

function deepDeleteAdFields(node) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const item of node) deepDeleteAdFields(item);
    return;
  }
  // HAR 中 point/home 确认存在 data.ad_info_pop；这些字段只含广告素材和跳转。
  for (const key of ["ad_info_pop", "adInfoPop", "popupInfo"]) {
    if (Object.prototype.hasOwnProperty.call(node, key)) delete node[key];
  }
  for (const value of Object.values(node)) deepDeleteAdFields(value);
}
