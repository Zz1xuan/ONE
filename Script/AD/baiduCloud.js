// // 修改URL参数

let obj;
if ($request.url.includes('api/getsyscfg')) { // 系统配置去广告
    obj = JSON.parse($response.body);
    ['bdnc_commerce_video_ad_area_pad','splash_advertise_type_area','business_ad_config_area','bottom_area','my_settings'].forEach(k => delete obj[k]);
    if (obj.bottom_area?.cfg_list) obj.bottom_area.cfg_list = obj.bottom_area.cfg_list.filter(i => i.node_key !== 'advertisement');
    if (obj.my_settings?.cfg_list) obj.my_settings.cfg_list = obj.my_settings.cfg_list.filter(i => ['setting_service_area','setting_theme_area'].includes(i.node_key));
    $done({body: JSON.stringify(obj)});
} 
else if ($request.url.includes('afd/entry')) { // 清广告feed
    obj = JSON.parse($response.body);
    obj.data.ad = []; obj.data.splash = {};
    $done({body: JSON.stringify(obj)});
} 
else if ($request.url.includes('feed/cardinfos')) { // 过滤广告卡片
    obj = JSON.parse($response.body);
    if (obj.data?.cards) obj.data.cards = obj.data.cards.filter(c => ['normal_card','content_card'].includes(c.type));
    $done({body: JSON.stringify(obj)});
} 
else $done({});

// ;eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('y r(3,j,s){z u=A B(3),p=u.t.C(j);4(/^D.*\\d$/.E(p))u.t.F(j,s);G u.H()}I 1;4($8.3.5(\'v/J\')){1=6.l($m.7);[\'K\',\'L\',\'M\',\'f\',\'g\'].N(k=>O 1[k]);4(1.f?.9)1.f.9=1.f.9.n(i=>i.w!==\'P\');4(1.g?.9)1.g.9=1.g.9.n(i=>[\'Q\',\'R\'].5(i.w));$a({7:6.h(1)})}b 4($8.3.5(\'S/T\')){1=6.l($m.7);1.e.U=[];1.e.V={};$a({7:6.h(1)})}b 4($8.3.5(\'W/X\')){1=6.l($m.7);4(1.e?.o)1.e.o=1.e.o.n(c=>[\'Y\',\'Z\'].5(c.10));$a({7:6.h(1)})}b 4($8.3.5(\'v/11\')){$a({3:r($8.3,\'12\',\'13\')})}b 4($8.3.5(\'x/14\')){1={15:[{16:\'17\',18:19,1a:\'1b\',1c:\'1d\',1e:\'0\',1f:1g,1h:2,1i:\'1j q x\',1k:\'1l q 1m\',1n:\'1o\',1p:\'1q q\'}],1r:1s,1t:1u};$a({7:6.h(1)})}b $a({});',62,93,'|obj||url|if|includes|JSON|body|request|cfg_list|done|else|||data|bottom_area|my_settings|stringify||param||parse|response|filter|cards||VIP|modifyURLParam|value|searchParams||api|node_key|membership|function|const|new|URL|get|M3U8|test|set|return|toString|let|getsyscfg|bdnc_commerce_video_ad_area_pad|splash_advertise_type_area|business_ad_config_area|forEach|delete|advertisement|setting_service_area|setting_theme_area|afd|entry|ad|splash|feed|cardinfos|normal_card|content_card|type|streaming|quality|M3U8_AUTO_1080|user|product_infos|product_id|vip2_1y_auto|end_time|4102329599|buy_time|1234567890|cluster|vip|status|start_time|1389014499|function_num|buy_description|Annual|product_description|Premium|service|detail_cluster|contentvip|product_name|Super|request_id|16909465823961024|currenttime|1687654043'.split('|'),0,{}));