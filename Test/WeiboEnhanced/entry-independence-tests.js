'use strict';
// Synthetic fixtures only. Optional HAR stays in memory; failures never print payloads.
const fs=require('fs'),vm=require('vm'),a=require('assert/strict');
const code=fs.readFileSync(__dirname+'/wb-enhanced-v3.js','utf8');
const inject=vm.runInNewContext(fs.readFileSync(__dirname+'/settings-entry.js','utf8')+';injectSettingsEntry');
const S=JSON.parse(vm.runInNewContext(fs.readFileSync(__dirname+'/common.js','utf8')+';JSON.stringify({MODULE_IDS,GRID_IDS})'));
const ID='minis_weibo_enhanced_settings_v2',G='100505_-_top8',M='100505_-_manage',P='profileme_mine';
const clone=x=>JSON.parse(JSON.stringify(x)),strip=x=>({...x,items:x.items.filter(v=>v.itemId!==ID)});
let pass=0;function test(label,f){try{f();pass++}catch(_){console.error('FAIL '+label+' (payload suppressed)');process.exit(1)}}
function run(body,cfg={}){let out,calls=0,writes=0;vm.runInNewContext(code,{$request:{url:'https://api.weibo.cn/2/profile/me?replay=1'},$response:{body:JSON.stringify(body)},$prefs:{valueForKey:k=>k==='minis.weibo.enhanced.config.v3'?JSON.stringify(cfg):null,setValueForKey:()=>{writes++;return true}},$done:x=>{calls++;out=x}});a.equal(calls,1);a.equal(writes,0);return JSON.parse(out.body||JSON.stringify(body))}
function suite(raw,label){
 function check(body,cfg={},position=true){const out=run(body,cfg),off=run(body,{...cfg,injectSettingsEntry:false});a.equal(out.items.filter(v=>v.itemId===ID).length,1);a.deepEqual(strip(out),off);if(position){const grids=out.items.filter(v=>v.itemId===G);const grid=grids.length===1&&grids[0].type==='grid'&&Array.isArray(grids[0].items)&&grids[0].items.length?grids[0]:null;a.equal(out.items.findIndex(v=>v.itemId===ID),grid?out.items.indexOf(grid)+1:out.items.findIndex(v=>v.itemId===M)-1)}return out}
 const fine={custom:{fineProfile:true}};
 test(label+' top8 hidden',()=>{const out=check(raw,{custom:{fineProfile:true,moduleVisible:{[G]:false}}});a.ok(!out.items.some(v=>v.itemId===G))});
 test(label+' empty grid',()=>{const b=clone(raw);b.items.find(v=>v.itemId===G).items=[];check(b,{profileMe:false})});
 test(label+' all eight off',()=>{const out=check(raw,{custom:{fineProfile:true,gridVisible:Object.fromEntries(S.GRID_IDS.map(k=>[k,false]))}});a.equal(out.items.find(v=>v.itemId===G).items.length,0)});
 test(label+' all removable modules off',()=>{const out=check(raw,{custom:{fineProfile:true,moduleVisible:Object.fromEntries(S.MODULE_IDS.filter(k=>![P,M].includes(k)).map(k=>[k,false]))}});for(const k of S.MODULE_IDS.filter(k=>![P,M].includes(k)))a.ok(!out.items.some(v=>v.itemId===k))});
 test(label+' only profile and manage',()=>{const b=clone(raw);b.items=b.items.filter(v=>[P,M].includes(v.itemId));check(b,fine)});
 test(label+' missing grid route false',()=>{const b=clone(raw);b.items=b.items.filter(v=>v.itemId!==G);check(b,{profileMe:false})});
 test(label+' route false retains entry',()=>check(raw,{profileMe:false}));
 test(label+' no manage refused',()=>{const b=clone(raw);b.items=b.items.filter(v=>v.itemId!==M);a.deepEqual(run(b,{profileMe:false}),b)});
 test(label+' ambiguous manage refused',()=>{const b=clone(raw);b.items.push(clone(b.items.find(v=>v.itemId===M)));a.deepEqual(run(b,{profileMe:false}),b)});
 test(label+' pagination refused even with manage',()=>{const b=clone(raw);b.items=b.items.filter(v=>v.itemId!==P);a.deepEqual(run(b,{profileMe:false}),b)});
 test(label+' malformed profile refused',()=>{const b=clone(raw);b.items.find(v=>v.itemId===P).type='unknown';a.deepEqual(run(b,{profileMe:false}),b)});
 test(label+' ambiguous grid untouched fallback',()=>{const b=clone(raw);b.items.push(clone(b.items.find(v=>v.itemId===G)));check(b,{profileMe:false})});
 test(label+' unknown grid untouched fallback',()=>{const b=clone(raw);b.items.find(v=>v.itemId===G).type='unknown';check(b,{profileMe:false})});
 test(label+' duplicates migrate once',()=>{const b=clone(raw),g=b.items.find(v=>v.itemId===G);g.items.push({itemId:ID});b.items.push({itemId:ID},{itemId:ID});const out=run(b,{profileMe:false});a.equal(out.items.filter(v=>v.itemId===ID).length,1);a.deepEqual(strip(out),raw);a.deepEqual(run(out,{profileMe:false}),out)});
 test(label+' direct no grid safe and idempotent',()=>{const b=clone(raw);b.items=b.items.filter(v=>v.itemId!==G);const out=inject({body:JSON.stringify(b)});a.deepEqual(strip(JSON.parse(out.body)),b);a.equal(inject(out).body,out.body)});
 for(const cfg of [{enabled:false},{injectSettingsEntry:false},{profileMe:false,injectSettingsEntry:false}])test(label+' explicit false '+Object.keys(cfg).join('/'),()=>{const b=clone(raw);b.items=b.items.filter(v=>v.itemId!==G);a.ok(!run(b,cfg).items.some(v=>v.itemId===ID))});
}
const fixture={account:{synthetic:true},items:[{itemId:P,type:'grid',category:'group',items:[],business:{keep:1}},{itemId:G,type:'grid',items:S.GRID_IDS.map(itemId=>({itemId,click:{scheme:'business://unchanged'},content:{content:'synthetic'}}))},{itemId:M,type:'cardEditor',category:'mine',title:{type:'text',content:'管理'},rightIcon:{type:'icon',iconUrl:'https://h5.sinaimg.cn/public/arrow.png'},click:{scheme:'business://manage'},keep:{nested:true}}]};
suite(fixture,'runtime');
if(process.env.WEIBO_HAR){const har=JSON.parse(fs.readFileSync(process.env.WEIBO_HAR,'utf8'));let found=false;for(const e of har.log.entries){if(new URL(e.request.url).pathname!=='/2/profile/me')continue;let raw;try{const c=e.response.content;raw=JSON.parse(c.encoding==='base64'?Buffer.from(c.text,'base64').toString():c.text)}catch(_){continue}if(!raw.items?.some(v=>v.itemId===P))continue;suite(raw,'HAR');found=true;break}if(!found)throw Error('Missing main-page capture')}
console.log('ENTRY INDEPENDENCE',pass,'passed; payloads memory-only');
