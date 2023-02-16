if (!$response.body) $done({});
let obj = JSON.parse($response.body);

const item = [
  "萤石",||
  "我的"
];


$done({ body: JSON.stringify(obj) });
