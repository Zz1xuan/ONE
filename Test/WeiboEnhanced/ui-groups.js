// Each editor has exactly one purpose owner; technical keys remain searchable metadata.
const PURPOSE_SECTIONS=['总览','我的','首页与关注','发现与搜索','详情与菜单','评论','消息私信','视频','发布与启动','开屏广告','共享清理','高级兼容'];
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
for(const name of PURPOSE_SECTIONS){const d=section(name);d.dataset.purpose=name;d.open=name==='总览';purposeSections.set(name,d);const a=document.createElement('details'),s=document.createElement('summary');a.className='source-advanced';s.textContent='高级选项';a.append(s);a.open=false;d.append(a);purposeAdvanced.set(name,a);}
function editorBox(scope,key,advanced=false){return (advanced?purposeAdvanced:purposeSections).get(purposeFor(scope,key));}
function updateDependencies(){for(const row of document.querySelectorAll('.row[data-dependency]')){const names=row.dataset.dependency.split(',').filter(Boolean),off=names.filter(k=>k.startsWith('custom.')?!cfg.custom[k.slice(7)]:!cfg[k]);row.dataset.inactive=String(off.length>0);const hint=row.querySelector('.dependency');if(hint)hint.textContent=off.length?'当前依赖未开启：'+off.map(k=>legacyLabel(k.replace('custom.',''))).join('、')+'（可先编辑，保存后按依赖生效）':'';}}

function routeDependency(scope){const m={'/2/profile/me':'profileMe','/2/groups/allgroups/v2':'tabs','/2/flowpage':'flowpage','/2/search/finder':'search','/2/search/hot_word':'search','/2/statuses/container_detail':'detail','/2/statuses/container_timeline_hot':'hotTimeline','/2/push/active':'pushActive','/2/client/publisher_list':'publisher','/2/messageflow/notice':'notice','/2/direct_messages/user_list':'directMessages'};return m[scope]||''}
