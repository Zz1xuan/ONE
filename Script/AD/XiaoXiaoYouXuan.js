/* 晓晓优选全广告过滤：可确认的业务广告开关与程序化资源。
 * 不改余额、任务完成、奖励、订单、支付或登录数据。
 */
(function () {
  try {
    const u = $request.url;
    if (!/^https:\/\/xxyx-client-api\.xiaoxiaoyouxuan\.com\//.test(u)) return $done({});
    const path = u.split('?')[0].replace(/^https:\/\/[^/]+/, '');
    const obj = JSON.parse($response.body);
    if (obj.code !== 200 || !obj.data || typeof obj.data !== 'object') return $done({});
    let changed = false;
    function off(o, k) {
      if (!o || !Object.prototype.hasOwnProperty.call(o, k)) return;
      const v = o[k];
      if (v === 1 || v === '1' || v === true) {
        o[k] = typeof v === 'string' ? '0' : typeof v === 'boolean' ? false : 0; changed = true;
      }
    }
    if (path === '/public_config' || path === '/get_ad_config') {
      if (path === '/public_config')
        for (const k of ['order_list_ad','order_detail_ad','activity_detail_ad','energy_site_ad','my_page_ad','withdraw_ad']) off(obj.data.feed_ad, k);
      for (const k of ['score_ad','gold_ad']) off(obj.data.interstitials_ad, k);
    } else if (path === '/place_ad' && Array.isArray(obj.data.list)) {
      for (const resource of obj.data.list) {
        if (!resource || !Array.isArray(resource.value)) continue;
        resource.value = resource.value.filter(function (item) {
          if (!item || typeof item.content !== 'string') return true;
          let c; try { c = JSON.parse(item.content); } catch (_) { return true; }
          if (!c || typeof c !== 'object') return true;
          if (resource.resource_slug === 'PROGRAM_RESOURCE' && resource.resource_id === 37 && item.placement_id === 351 && c.AD_TYPE === 1 && c.AD_SOURCE === 12 && c.ios_ad_id === 'b6aa11f3431abc') {
            off(c, 'AD_OPEN'); item.content = JSON.stringify(c);
          }
          // Proven SDK ad item. Keep direct shopping/navigation entries in the same resource.
          if (resource.resource_slug === 'SEARCH_RIGHT' && resource.resource_id === 22 && item.placement_id === 148 && c.ad_type === 2 && c.ios_ad_id === '111112848') {
            changed = true; return false;
          }
          return true;
        });
      }
    }
    return $done(changed ? {body: JSON.stringify(obj)} : {});
  } catch (_) { return $done({}); }
})();
