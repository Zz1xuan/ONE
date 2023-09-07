const VIP = $response.body
  .replace(/"vip":\w+/g, '"vip":true')
  .replace(/"vipLevel":\w+/g, '"vipLevel":1')
$done({ body: VIP });