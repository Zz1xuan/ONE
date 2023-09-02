const modifiedBody = $response.body
  .replace(/"user_is_pro":\w+/g, '"user_is_pro":true')
  .replace(/"group_is_pro":\w+/g, '"group_is_pro":true')
  .replace(/"membership_type":\w+/g, '"membership_type":2');

$done({ body: modifiedBody });