'use strict';const fs=require('fs'),vm=require('vm'),a=require('assert/strict');const har=JSON.parse(fs.readFileSync(process.env.WEIBO_HAR,'utf8'));const code=fs.readFileSync('wb-enhanced-v3.js','utf8');let pass=0,changes=0;const clone=v=>JSON.parse(JSON.stringify(v));function run(path,body,custom={}){let result;vm.runInNewContext(code,{$request:{url:'https://api.weibo.cn'+path+'?replay=1'},$response:{body},$prefs:{valueForKey:k=>k==='minis.weibo.enhanced.config.v3'?JSON.stringify({injectSettingsEntry:false,custom}):null},$done:v=>result=v},{timeout:5000});return JSON.parse(result.body||body)}
function check(path,body,custom,patch,baseCustom={}){const baseline=run(path,body,baseCustom),expected=clone(baseline);const n=patch(expected,JSON.parse(body));a.ok(n>0,'target absent '+Object.keys(custom).join(','));const out=run(path,body,{...baseCustom,...custom});a.deepEqual(out,expected,'target+all neighbors '+Object.keys(custom));a.notDeepEqual(out,baseline);changes+=n;pass++}
const seen=new Set();for(const e of har.log.entries){const u=new URL(e.request.url);if(u.hostname!=='api.weibo.cn'||seen.has(u.pathname))continue;const c=e.response.content;let body=c.text;if(c.encoding==='base64')body=Buffer.from(body||'','base64').toString('utf8');let j;try{j=JSON.parse(body)}catch{continue}const p=u.pathname;seen.add(p);
if(p==='/2/profile/me'){
 check(p,body,{hideProfileGridIcons:true},x=>{let n=0;for(const m of x.items)if(m.itemId==='100505_-_top8')for(const v of m.items||[])if(v.image&&'iconUrl'in v.image){delete v.image.iconUrl;n++}return n},{fineProfile:true});
 check(p,body,{moduleLabels:{'100505_-_diamond':'自定义模块'}},x=>{const m=x.items.find(v=>v.itemId==='100505_-_diamond');a.equal(typeof m.header.title.content,'string');m.header.title.content='自定义模块';return 1},{fineProfile:true});
}
if(p==='/2/groups/allgroups/v2'){
 check(p,body,{hideRecommendedChannels:true},x=>{let n=0;for(const t of x.pageDatas)if(t.pageDataType==='homeHot'&&Array.isArray(t.recommendCategory?.pageDatas)){n+=t.recommendCategory.pageDatas.length;t.recommendCategory.pageDatas=[]}return n});
 check(p,body,{preferFollowingPage:true},x=>{a.ok(x.pageDatas.some(t=>t.pageId==='homeFeed'));x.defaultPageId='homeFeed';return 1});
 const hidden=run(p,body,{fineTabs:true,tabVisible:{homeFeed:false},preferFollowingPage:true});a.notEqual(hidden.defaultPageId,'homeFeed');pass++;
}
if(p==='/2/flowpage'||p==='/2/statuses/container_detail'){
 check(p,body,{[p==='/2/flowpage'?'hideFlowNavIcons':'hideDetailNavIcons']:true},x=>{let n=0;for(const ch of x.channelInfo.channels)for(const k of ['icon','iconDark'])if(ch.titleInfo&&k in ch.titleInfo){delete ch.titleInfo[k];n++}return n});
 if(p==='/2/flowpage')check(p,body,{hideFlowCardIcons:true},x=>{let n=0;for(const g of x.items||[])for(const v of g.items||[])if(v.data&&[4,6].includes(v.data.card_type)){if('icon'in v.data){delete v.data.icon;n++}if(typeof v.data.display_arrow==='number'){if(v.data.display_arrow)n++;v.data.display_arrow=0}}return n});
}
if(p==='/2/messageflow/notice'){
 check(p,body,{noticeMenuLabels:{mblog_menus_report:'反馈入口'}},x=>{let n=0;for(const m of x.messages||[])for(const v of m.msg_card?.button?.mblog_menus_new||[])if(v.type==='mblog_menus_report'&&typeof v.name==='string'){v.name='反馈入口';n++}return n},{retain__2_messageflow_notice_393:true});
 check(p,body,{noticeMenuOrder:['mblog_menus_report','mblog_menus_custom','mblog_menus_no_interst']},x=>{let n=0;const ranks=['mblog_menus_report','mblog_menus_custom','mblog_menus_no_interst'];for(const m of x.messages||[]){const b=m.msg_card?.button;if(b&&Array.isArray(b.mblog_menus_new)){b.mblog_menus_new=b.mblog_menus_new.map((v,i)=>({v,i})).sort((a,b)=>(ranks.includes(a.v.type)?ranks.indexOf(a.v.type):999)-(ranks.includes(b.v.type)?ranks.indexOf(b.v.type):999)||a.i-b.i).map(t=>t.v);n++}}return n},{retain__2_messageflow_notice_393:true});
}
}console.log('V4 HAR',pass,'passed; changed display slots',changes,'; full response neighbor equality; no fixtures written');
