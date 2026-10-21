/* XiaoXiaoYouXuan 30645: experimental startup config switch.
 * Evidence: PROGRAM_RESOURCE, resource_id=37, placement_id=351.
 * Only changes nested AD_OPEN; never removes resource/business/reward entries.
 * Splash association is circumstantial; validate on device before deployment.
 */
(function () {
  const original = $response.body;
  try {
    const u = $request.url;
    if (!/^https:\/\/xxyx-client-api\.xiaoxiaoyouxuan\.com\/place_ad(?:\?|$)/.test(u)) return $done({});
    const obj = JSON.parse(original);
    if (obj.code !== 200 || !Array.isArray(obj.data && obj.data.list)) return $done({});
    let changed = false;
    for (const resource of obj.data.list) {
      if (resource.resource_slug !== 'PROGRAM_RESOURCE' || resource.resource_id !== 37 || !Array.isArray(resource.value)) continue;
      for (const item of resource.value) {
        if (item.resource_slug !== 'PROGRAM_RESOURCE' || item.placement_id !== 351 || typeof item.content !== 'string') continue;
        let c;
        try { c = JSON.parse(item.content); } catch (_) { continue; }
        if (c.AD_OPEN === 1 && c.AD_TYPE === 1 && c.AD_SOURCE === 12 && c.ios_ad_id === 'b6aa11f3431abc') {
          c.AD_OPEN = 0;
          item.content = JSON.stringify(c);
          changed = true;
        }
      }
    }
    return $done(changed ? {body: JSON.stringify(obj)} : {});
  } catch (_) { return $done({}); }
})();
