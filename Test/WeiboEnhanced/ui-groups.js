// Each editor has exactly one purpose owner; technical keys remain searchable metadata.
const PURPOSE_SECTIONS=['运行与入口','我的','首页与关注','发现与搜索','详情与菜单','评论','消息私信','视频','发布与启动','开屏广告','共享清理','高级兼容'];
function purposeFor(scope,key=''){
 if(['enabled','injectSettingsEntry'].includes(key))return PURPOSE_SECTIONS[0];
 if(key.startsWith('menu_')||/^(menuVisible|menuOrder|menuLabels|fineMenus|hideDetail)/.test(key))return PURPOSE_SECTIONS[4];
 if(/^(module|grid|fineProfile|hideProfile)/.test(key)||['profileMe'].includes(key))return PURPOSE_SECTIONS[1];
 if(/^(tab|subtab|fineTabs|hideRecommended|preferFollowing)/.test(key))return PURPOSE_SECTIONS[2];
 if(/^(noticeMenu|hideNotice|hideClearTrash|hidePublicReminder)/.test(key))return PURPOSE_SECTIONS[6];
 if(/^(negative|publisherVisible|hideFeedRedpacket|hideComposer|hideIconShortcuts)/.test(key))return PURPOSE_SECTIONS[8];
 if(/^(hideFlow|hideHotWords|preserveFinder)/.test(key))return PURPOSE_SECTIONS[3];
 if(/^(hideHotExtra|hideHotContinue)/.test(key))return PURPOSE_SECTIONS[2];
 if(/^(avatarCleanup|feedCleanup|voteCleanup)$/.test(key)||/^(removeAvatar|removeFeedAd|removeVoteInfo|isAd)$/.test(scope))return PURPOSE_SECTIONS[10];
 const map={sdkAd:9,preload:9,cachedAds:9,cardlist:3,checkin:8,publisher:8,pushActive:8,comments:5,container:11,directMessages:6,flowlist:2,flowpage:3,tabs:2,notice:6,page:11,profileTimeline:11,profileActions:11,profileMe:1,profileStatuses:11,userinfo:11,search:3,searchAll:3,chaohuaSearch:3,detail:4,detailComment:5,hotTimeline:2,followingTimeline:2,topicTimeline:2,extend:4,repost:4,statusShow:4,videoFull:7,videoDetail:7,videoList:7,topicChannels:11,appicon:8};
 if(Object.prototype.hasOwnProperty.call(map,key))return PURPOSE_SECTIONS[map[key]];
 if(/profile\/me/.test(scope))return PURPOSE_SECTIONS[1];if(/\/profile\//.test(scope))return PURPOSE_SECTIONS[11];if(/allgroups|container_timeline|flowlist/.test(scope))return PURPOSE_SECTIONS[2];
 if(/search|flowpage|cardlist/.test(scope))return PURPOSE_SECTIONS[3];if(/comment/.test(scope))return PURPOSE_SECTIONS[5];
 if(/message|notice/.test(scope))return PURPOSE_SECTIONS[6];if(/video/.test(scope))return PURPOSE_SECTIONS[7];
 if(/push\/active|publisher|checkin|appicon/.test(scope))return PURPOSE_SECTIONS[8];if(/sdkad|uve|preload|pullad|get_ad/.test(scope))return PURPOSE_SECTIONS[9];
 if(/container_detail|statuses\/(extend|show|repost)/.test(scope))return PURPOSE_SECTIONS[4];return PURPOSE_SECTIONS[11];
}
const purposeSections=new Map(),purposeAdvanced=new Map();
for(const name of PURPOSE_SECTIONS){const d=section(name);if(name!=='运行与入口'){const p=document.createElement('p');p.textContent=name==='高级兼容'?'内容清理：开启=屏蔽/清理；父级处理控制整页响应。兼容行为另行标注，不代表屏蔽单个模块。':'开启=屏蔽/隐藏；关闭=保留。';d.append(p);}d.dataset.purpose=name;d.open=['运行与入口','我的'].includes(name);purposeSections.set(name,d);purposeAdvanced.set(name,purposeSections.get('高级兼容')||d);}
const advancedRoot=purposeSections.get('高级兼容');advancedRoot.className='source-advanced';
for(const name of PURPOSE_SECTIONS)purposeAdvanced.set(name,advancedRoot);
const compatibilityBox=document.createElement('details'),compatibilityTitle=document.createElement('summary');compatibilityTitle.textContent='非屏蔽兼容行为 · 开启=执行所述改写';compatibilityBox.append(compatibilityTitle);advancedRoot.append(compatibilityBox);function editorBox(scope,key,advanced=false){if(NON_BLOCK_SOURCE.has(key))return compatibilityBox;return advanced?advancedRoot:purposeSections.get(purposeFor(scope,key));}
function inactiveRoutes(c){return Object.keys(LEGACY_NAMES).filter(k=>!['enabled','injectSettingsEntry','avatarCleanup','feedCleanup','voteCleanup'].includes(k)&&c[k]===false)}
function dependencySummary(c){const off=[];if(!c.enabled)off.push('增强总开关关闭');for(const k of inactiveRoutes(c))off.push(legacyLabel(k)+'关闭');if(!c.custom.retain__2_messageflow_notice_393)off.push('消息反馈菜单需在高级兼容保留推广父卡片');return off.length?'生效提示：'+off.join('；'):'';}
function draftConfig(){const c={...cfg,custom:{...cfg.custom}};for(const x of widgets())if(x.dataset.custom==='true')c.custom[x.dataset.k]=fromChecked(x.dataset.k,x.checked,true);else c[x.dataset.k]=fromChecked(x.dataset.k,x.checked);return c;}
function updateDependencies(){if(!loaded)return;const c=draftConfig(),note=$('#dependency-help');note.replaceChildren();const text=dependencySummary(c);note.hidden=!text;if(text){const span=document.createElement('span');span.textContent=text+'。';const b=document.createElement('button');b.textContent='启用所需处理';b.onclick=()=>{for(const k of ['enabled',...inactiveRoutes(c)]){const x=document.querySelector('[data-k="'+k+'"]');if(x)x.checked=true;}changed()};note.append(span,b);}}

function routeDependency(scope){const m={'/2/profile/me':'profileMe','/2/groups/allgroups/v2':'tabs','/2/flowpage':'flowpage','/2/search/finder':'search','/2/search/hot_word':'search','/2/statuses/container_detail':'detail','/2/statuses/container_timeline_hot':'hotTimeline','/2/push/active':'pushActive','/2/client/publisher_list':'publisher','/2/messageflow/notice':'notice','/2/direct_messages/user_list':'directMessages'};return m[scope]||''}
