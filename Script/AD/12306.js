/*

作者:ddgksf2013

请检查你的分流是否有ad.12306.cn，如果有，需要去除（可使用解析器排出#out=12306），不然重写是无法生效的，同时检查是否有与其冲突的重写

[rewrite_local]
^https?:\/\/ad\.12306\.cn\/ad\/ser\/getAdList url script-analyze-echo-response https://github.com/ddgksf2013/Scripts/raw/master/12306.js

[mitm]
hostname = ad.12306.cn

*/



!function(){let e,i=JSON.parse($request.body);e="0007"===i.placementNo?'{"materialsList":[{"billMaterialsId":"255","filePath":"https://api.isoyu.com/bing_images.php","creativeType":1}],"advertParam":{"skipTime":1}}':"G0054"===i.placementNo?'{"code":"00","materialsList":[{}],"advertParam":{"skipTime":3000,"showSkipBtn":0,"skipTimeAgain":0,"chacheTime":600000,"fixedscreen":3,"isDefault":0,"displayNumDi":1,"index":2}}':'{"code":"00","message":"无广告返回"}';"undefined"!=typeof $task?$done({body:e}):$done({response:{body:e}})}();
