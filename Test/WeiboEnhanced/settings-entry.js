/* Native cardEditor row; click opens the verified browser scheme, not a JS Bridge. */
const SETTINGS_ITEM_ID='minis_weibo_enhanced_settings_v2';
function injectSettingsEntry(result){
  if(!result||typeof result.body!=='string')return result;
  const d=JSON.parse(result.body);
  if(!d||!Array.isArray(d.items))return result;
  // Main-page identity is independent of the optional shortcuts module.
  const profiles=d.items.filter(x=>x&&x.itemId==='profileme_mine');
  if(profiles.length!==1||profiles[0].type!=='grid'||profiles[0].category!=='group'||!Array.isArray(profiles[0].items))return result;
  const grids=d.items.filter(x=>x&&x.itemId==='100505_-_top8');
  const templates=d.items.filter(x=>x&&x.itemId==='100505_-_manage');
  if(templates.length!==1)return result;
  const g=grids.length===1&&grids[0].type==='grid'&&Array.isArray(grids[0].items)?grids[0]:null;
  const m=templates[0],a=m.rightIcon;
  // Only known native shapes and public, query-free image paths are accepted.
  if(m.type!=='cardEditor'||m.category!=='mine'||!m.title||m.title.type!=='text'||!a||a.type!=='icon'||typeof a.iconUrl!=='string'||!/^https:\/\/(?:h5|d)\.sinaimg\.cn\/[A-Za-z0-9_./%+-]+$/.test(a.iconUrl))return result;
  const title={type:'text',content:'增强设置'},rightIcon={type:'icon',iconUrl:a.iconUrl};
  // Reconstruct presentation from bounded scalar fields; never copy a style object.
  const s=m.title.style;
  if(s&&typeof s==='object'){
    const style={};
    if(s.ellipsize==='end')style.ellipsize='end';
    if(Number.isInteger(s.maxLines)&&s.maxLines===1)style.maxLines=1;
    if(Number.isFinite(s.textSize)&&s.textSize>=10&&s.textSize<=24)style.textSize=s.textSize;
    if(typeof s.textColor==='string'&&/^#[0-9a-fA-F]{6}$/.test(s.textColor))style.textColor=s.textColor;
    if(s.textColorKey==='CommonGray93')style.textColorKey=s.textColorKey;
    if(Array.isArray(s.margin)&&s.margin.length===4&&s.margin.every(n=>Number.isFinite(n)&&n>=0&&n<=32))style.margin=s.margin.slice();
    if(Object.keys(style).length)title.style=style;
  }
  if(a.imgUrl==='')rightIcon.imgUrl='';
  if(a.style&&typeof a.style==='object'){
    const style={};
    for(const k of ['width','height'])if(Number.isFinite(a.style[k])&&a.style[k]>0&&a.style[k]<=32)style[k]=a.style[k];
    if(a.style.darkMode==='urlAppend')style.darkMode='urlAppend';
    if(Object.keys(style).length)rightIcon.style=style;
  }
  const row={itemId:SETTINGS_ITEM_ID,type:m.type,category:m.category,title,rightIcon,click:{type:'scheme',scheme:'sinaweibo://browser?url='+encodeURIComponent('https://api.weibo.cn/minis-enhanced-v2/settings')}};
  // Migrate only our own old fifth grid item / duplicate top-level rows.
  if(g)g.items=g.items.filter(x=>!x||x.itemId!==SETTINGS_ITEM_ID);
  d.items=d.items.filter(x=>!x||x.itemId!==SETTINGS_ITEM_ID);
  d.items.splice(g&&g.items.length?d.items.indexOf(g)+1:d.items.indexOf(m),0,row);
  return {...result,body:JSON.stringify(d)};
}
