/*

https://raw.githubusercontent.com/kokoryh/Script/master/js/12306.js

12306 去除倒计时 made by ddgksf2013 on 2022-11-30

请检查你的分流是否有ad.12306.cn，如果有，需要去除（可使用解析器排出#out=12306），不然重写是无法生效的，同时检查是否有与其冲突的重写

[rewrite_local]
^https?:\/\/ad\.12306\.cn\/ad\/ser\/getAdList url script-response-body https://github.com/ddgksf2013/Scripts/raw/master/12306.js

[mitm]
hostname = ad.12306.cn

*/









let $=function(){const e="undefined"!=typeof $task,t="undefined"!=typeof $httpClient;return{isQuanX:e,isSurge:t,notify:(i,n,a)=>{e&&$notify(i,n,a),t&&$notification.post(i,n,a)},getValue:i=>e?$prefs.valueForKey(i):t?$persistentStore.read(i):void 0,setValue:(i,n)=>e?$prefs.setValueForKey(i,n):t?$persistentStore.write(i,n):void 0}}();function uuid(){return"xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g,(function(e){var t=16*Math.random()|0;return("x"==e?t:3&t|8).toString(16)}))}"undefined"!=typeof $response?function(){let e=JSON.parse($response.body);e.materialsList?1===e.materialsList.length?function(e){e.materialsList[0].filePath="h",e.advertParam.skipTime=0}(e):e.materialsList.length>1&&(e.materialsList=[{}]):e={code:"00",materialsList:[{billId:"250",billMaterialsId:"114514",filePath:"null",title:"12306的傻逼程序员",linkUri:"https://mp.weixin.qq.com/s/GuIM1ix0lw_3stdZg0S0bg",linkType:2,viewUrlList:["https://ad.12306.cn/ad/mon/mzc?bid=4611&appId=2&mid=6304&pn=0061&n=1&ct=0&cn=CH&reqDate=1670762668338&rid=e2f930654b784e9dad0b804692a2d222&did=E5D2D21C-AEB7-4402-A9D4-391A8FE0C07F&t=1"],clickUrlList:["https://ad.12306.cn/ad/mon/mzc?bid=4611&appId=2&mid=6304&pn=0061&n=1&ct=0&cn=CH&reqDate=1670762668338&rid=e2f930654b784e9dad0b804692a2d222&did=E5D2D21C-AEB7-4402-A9D4-391A8FE0C07F&t=2"],textDesc:"",dplUrl:"",advNature:1,pn:"0061",creativeType:1}],rid:uuid(),advertParam:{skipTime:0,showSkipBtn:1,skipTimeAgain:1,chacheTime:6e5,fixedscreen:3,isDefault:0,displayNumDi:1,index:2}};$done({body:JSON.stringify(e)})}():function(){$.setValue("","train_12306")&&console.log("12306去广告 - 脚本已更新，无需手动运行");$done()}();
