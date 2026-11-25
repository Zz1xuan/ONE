/* Exact hosts and paths; never route using query contents. No URL dependency in QX. */
function matchWeiboRoute(raw){
 const m=/^https:\/\/([^/?#]+)(\/[^?#]*)?(?:\?[^#]*)?(?:#.*)?$/.exec(raw);if(!m)return null;
 const host=m[1].toLowerCase(),path=m[2]||'/';let key;
 if(host==='sdkapp.uve.weibo.com'&&path==='/interface/sdk/sdkad.php')key='sdkAd';
 else if(host==='bootpreload.uve.weibo.com'&&/^\/v[12]\/ad\/preload$/.test(path))key='preload';
 else if(host==='wbapp.uve.weibo.com'&&['/preload/get_ad','/wbapplua/wbpullad.lua'].includes(path))key='cachedAds';
 else if(host==='api.weibo.cn'){
 const paths={cardlist:'/2/cardlist',checkin:'/2/checkin/show',publisher:'/2/client/publisher_list',pushActive:'/2/push/active',comments:'/2/comments/build_comments',container:'/2/container/asyn',directMessages:'/2/direct_messages/user_list',flowlist:'/2/flowlist',flowpage:'/2/flowpage',tabs:'/2/groups/allgroups/v2',notice:'/2/messageflow/notice',page:'/2/page',profileTimeline:'/2/profile/container_timeline',profileMe:'/2/profile/me',profileStatuses:'/2/profile/statuses/tab',userinfo:'/2/profile/userinfo',searchAll:'/2/searchall',chaohuaSearch:'/2/shproxy/chaohua/discovery/searchactive',detail:'/2/statuses/container_detail',detailComment:'/2/statuses/container_detail_comment',topicTimeline:'/2/statuses/container_timeline_topic',extend:'/2/statuses/extend',repost:'/2/statuses/repost_timeline',statusShow:'/2/statuses/show',videoFull:'/2/video/full_screen_stream',videoDetail:'/2/video/tiny_stream_mid_detail',videoList:'/2/video/tiny_stream_video_list',topicChannels:'/2/!/huati/discovery_home_bottom_channels',appicon:'/aj/appicon/list'};
 key=Object.keys(paths).find(k=>paths[k]===path);
 if(['/2/statuses/container_timeline','/2/statuses/container_timeline_unread'].includes(path))key='followingTimeline';
 if(['/2/statuses/container_timeline_hot','/2/statuses/unread_hot_timeline'].includes(path))key='hotTimeline';
 if(['/2/profile/dealatt','/2/friendships/create','/2/friendships/destroy'].includes(path))key='profileActions';
 if(['/2/search/container_timeline','/2/search/finder','/2/search/hot_word'].includes(path))key='search';
 }
 return key?{key,url:'https://'+host+path+'?',path}:null;
}
