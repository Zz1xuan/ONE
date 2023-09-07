const VIP = $response.body
  .replace(/"current_offering_id":\w+/g, '"current_offering_id":$rc_lifetime')
  //.replace(/"vipLevel":\w+/g, '"vipLevel":1')
$done({ body: VIP });