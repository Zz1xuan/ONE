/*

https://raw.githubusercontent.com/ddgksf2013/Scripts/master/12306.js
脚本作者：@ddgksf2013

12306 去除倒计时 made by ddgksf2013 on 2022-11-30

请检查你的分流是否有ad.12306.cn，如果有，需要去除（可使用解析器排出#out=12306），不然重写是无法生效的，同时检查是否有与其冲突的重写

[rewrite_local]
^https?:\/\/ad\.12306\.cn\/ad\/ser\/getAdList url script-response-body https://github.com/ddgksf2013/Scripts/raw/master/12306.js

[mitm]
hostname = ad.12306.cn

*/












const version = 'V1.0.20';

var obj=JSON.parse($request.body),ddgksf2013={};"0007"==obj.placementNo?(ddgksf2013.materialsList=[{billMaterialsId:"6491",filePath:"ddgksf2013",creativeType:1}],ddgksf2013.advertParam={skipTime:1},ddgksf2013.code="00"):ddgksf2013={code:"00",message:"无广告返回"},$done({body:JSON.stringify(ddgksf2013)});
