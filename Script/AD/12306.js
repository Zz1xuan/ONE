/*

作者:kokoryh

请检查你的分流是否有ad.12306.cn，如果有，需要去除（可使用解析器排出#out=12306），不然重写是无法生效的，同时检查是否有与其冲突的重写

[rewrite_local]
^https?:\/\/ad\.12306\.cn\/ad\/ser\/getAdList url script-response-body https://github.com/ddgksf2013/Scripts/raw/master/12306.js

[mitm]
hostname = ad.12306.cn

*/












!function(){let e;e="0007"===JSON.parse($request.body).placementNo?'{"materialsList":[{"billMaterialsId":"255","filePath":"h","creativeType":1}],"advertParam":{"skipTime":1}}':'{"code":"00","message":"无广告返回"}';$done({body:e})}();
