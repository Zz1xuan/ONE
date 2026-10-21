/* 晓晓优选：指定开屏候选广告位的聚合响应过滤（实验版）。
 * 仅识别请求体 p 中的公共广告位，不推断其他广告位，不清空广告列表。
 * 请求体不可读取或格式变更时原样放行，避免并发请求串位。
 */
(function () {
  try {
    if (!/^https:\/\/apiv4\.anythinktech\.com\/v2\/open\/placement(?:\?|$)/.test($request.url)) return $done({});
    const req = JSON.parse($request.body || '{}');
    if (typeof req.p !== 'string') return $done({});
    // Pure-JS base64 decoding avoids dependence on browser-only atob.
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const encoded = req.p.replace(/\s/g, '');
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(encoded)) return $done({});
    let bits = 0, count = 0, decoded = '';
    for (const ch of encoded) {
      if (ch === '=') break;
      bits = (bits << 6) | chars.indexOf(ch); count += 6;
      if (count >= 8) { count -= 8; decoded += String.fromCharCode((bits >> count) & 255); }
    }
    const p = JSON.parse(decoded);
    if (p.pl_id !== 'b6aa11f3431abc') return $done({});
    const obj = JSON.parse($response.body);
    if (obj.code !== 0 || !obj.data || obj.data.ad_delivery_sw !== 1) return $done({});
    obj.data.ad_delivery_sw = 0;
    console.log('[XXYX] target placement ad_delivery_sw -> 0');
    return $done({body: JSON.stringify(obj)});
  } catch (_) { return $done({}); }
})();
