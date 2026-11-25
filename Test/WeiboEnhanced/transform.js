'use strict';
const acorn=require('./tools/acorn');
// Source positions are pinned by baseline SHA and exact operation text, not global replace.
function transform(source){
 const ast=acorn.parse(source,{ecmaVersion:2022,locations:true}),edits=[],fields=[],seen=new Set();
 const text=n=>source.slice(n.start,n.end);
 function register(n,kind,target,scope){
  const key=kind+'_'+scope.replace(/[^a-zA-Z0-9]+/g,'_')+'_'+n.loc.start.line;
  if(seen.has(key)&&![893,1101,1335].includes(n.loc.start.line))throw Error('duplicate customization '+key);seen.add(key);
  const op=text(n);fields.push({key,type:'boolean',default:false,kind,target,scope,line:n.loc.start.line,operation:op,evidence:'source-only',description:(kind==='preserve'?'保留字段/原值：':'保留被筛选内容：')+target});return key;
 }
 function edit(n,key,expression){edits.push({start:n.start,end:n.end,value:expression});}
 function walk(n,scope='shared',parent=null){
  if(!n||typeof n.type!=='string')return;
  if(n.type==='FunctionDeclaration')scope=n.id.name;
  if(n.type==='IfStatement'&&/url\.includes\(/.test(text(n.test))){const match=text(n.test).match(/url\.includes\("([^"]+)"\)/)[1];scope=match.startsWith('/')?match:'/2/search/'+match;}
  if(n.type==='ExpressionStatement'){
   const e=n.expression;
   if((e.type==='UnaryExpression'&&e.operator==='delete')||(e.type==='AssignmentExpression'&&e.left.type==='MemberExpression'&&!(e.right.type==='Identifier'&&/^(?:new[A-Z]|items$)/.test(e.right.name)))){
    const target=text(e.type==='UnaryExpression'?e.argument:e.left);
    const loopFields={893:['bg_img','background_scheme','background_url'],1101:['ad','advertises','trends','headers'],1335:['bubble_guide_data','button_extra_info','display_info','extend_info','floating_button','follow_data','head_cards','highlight','interaction_extra_info','page_alerts','reward_info','source_tag_struct','top_cards']}[n.loc.start.line];
    if(loopFields){const variable=n.loc.start.line===1101?'s':'i';const guards=[];for(const name of loopFields){const key=register(n,'preserve',target.replace('['+variable+']','.'+name),scope);const field=fields[fields.length-1];field.key=key+'_'+name;field.operation=text(n);field.dynamic={variable,value:name};guards.push(variable+'==='+JSON.stringify(name)+'&&keepCustom('+JSON.stringify(field.key)+')');}edits.push({start:n.start,end:n.end,value:'if(!('+guards.join('||')+')){'+text(n)+'}'});return;}
    // Only business-object writes; array construction and local bookkeeping stay intact.
    const key=register(n,'preserve',target,scope);
    edit(n,key,'if(!keepCustom('+JSON.stringify(key)+')){'+text(n)+'}');return;
   }
  }
  if(n.type==='IfStatement'){
   const b=n.consequent.type==='BlockStatement'?n.consequent.body:[n.consequent];
   if(b.length===1&&['ContinueStatement','BreakStatement'].includes(b[0].type)){
    const key=register(n.test,'retain',text(n.test),scope);
    edit(n.test,key,'(!keepCustom('+JSON.stringify(key)+')&&('+text(n.test)+'))');
   }
  }
  if(n.type==='ContinueStatement'&&parent&&parent.type==='BlockStatement'&&parent.body.length===1){
   // Else fallback branches need their own retention; the enclosing loop object is explicit.
   const fallback={370:['newII','ii'],595:['newItems','item'],1114:['newItems','item'],1211:['newItems','item'],1301:['newItems','item']}[n.loc.start.line];
   if(fallback){const key=register(n,'retain','fallback '+fallback[1],scope);edits.push({start:n.start,end:n.end,value:'if(keepCustom('+JSON.stringify(key)+'))'+fallback[0]+'.push('+fallback[1]+');'+text(n)});}
  }
  for(const [k,v]of Object.entries(n)){if(k==='loc')continue;if(Array.isArray(v))for(const c of v)walk(c,scope,n);else if(v&&typeof v.type==='string')walk(v,scope,n);}
 }
 walk(ast);
 // One shared predicate switch preserves source ad classification when absent/false.
 fields.push({key:'retain_classified_ads',type:'boolean',default:false,kind:'retain',target:'isAd(data)',scope:'isAd',line:1476,operation:'isAd predicate',evidence:'source-only',description:'保留由原 isAd 判据识别的广告/热推'});
 const fn=ast.body.find(n=>n.type==='FunctionDeclaration'&&n.id.name==='isAd');if(!fn)throw Error('isAd anchor');edits.push({start:fn.body.start+1,end:fn.body.start+1,value:'\nif(keepCustom("retain_classified_ads"))return false;\n'});
 edits.sort((a,b)=>b.start-a.start);let last=source.length;
 for(const e of edits){if(e.end>last)throw Error('overlapping transform');source=source.slice(0,e.start)+e.value+source.slice(e.end);last=e.start;}
 return {source,fields,edits:edits.length};
}
module.exports={transform};
