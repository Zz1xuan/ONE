// 引用地址 https://github.com/limbopro/Adblock4limbo/blob/main/Adguard/Adblock4limbo.js

let ele = '<head>';
let eleReplace = '<head><link rel="stylesheet" href="https://limbopro.com/CSS/Adblock4limbo.user.css" type="text/css" /><script type="text/javascript" async="async" src="https://limbopro.com/Adguard/Adblock4limbo.user.js"></script>'
let body = $response.body
    .replace(ele, eleReplace)
$done({body});
