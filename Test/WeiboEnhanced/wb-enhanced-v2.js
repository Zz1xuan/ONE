/* generated v3; TEST RELEASE */
(function(){
/* V3: fixed schema, no arbitrary paths or storage. */
const STORE_KEY='minis.weibo.enhanced.config.v3', LEGACY_STORE_KEY='minis.weibo.enhanced.config.v2';
const LEGACY_DEFAULTS=Object.freeze({enabled:true,injectSettingsEntry:true,avatarCleanup:true,feedCleanup:true,voteCleanup:true,sdkAd:true,cardlist:true,checkin:true,publisher:true,pushActive:true,comments:true,container:true,directMessages:true,flowlist:true,flowpage:true,tabs:true,notice:true,page:true,profileTimeline:true,profileActions:true,profileMe:true,profileStatuses:true,userinfo:true,search:true,searchAll:true,chaohuaSearch:true,detail:true,detailComment:true,hotTimeline:true,followingTimeline:true,topicTimeline:true,extend:true,repost:true,statusShow:true,videoFull:true,videoDetail:true,videoList:true,topicChannels:true,appicon:true,preload:true,cachedAds:true,
menu_creatortypeask:false,menu_mblog_menus_apeal:true,menu_mblog_menus_avatar_widget:false,menu_mblog_menus_bullet_shield:true,menu_mblog_menus_card_bg:false,menu_mblog_menus_comment_manager:true,menu_mblog_menus_copy_url:true,menu_mblog_menus_custom:false,menu_mblog_menus_delete:true,menu_mblog_menus_edit:true,menu_mblog_menus_edit_history:true,menu_mblog_menus_edit_video:true,menu_mblog_menus_favorite:true,menu_mblog_menus_follow:true,menu_mblog_menus_home:false,menu_mblog_menus_long_picture:true,menu_mblog_menus_modify_visible:true,menu_mblog_menus_novelty:false,menu_mblog_menus_open_reward:false,menu_mblog_menus_popularize:false,menu_mblog_menus_promote:false,menu_mblog_menus_report:true,menu_mblog_menus_shield:true,menu_mblog_menus_sticking:true,menu_mblog_menus_video_feedback:false,menu_mblog_menus_video_later:false});

const CUSTOM_FIELDS=[{"key":"preserve__interface_sdk_sdkad_php_42","type":"boolean","default":false,"kind":"preserve","target":"obj.needlocation","scope":"/interface/sdk/sdkad.php","line":42,"operation":"obj.needlocation = false;","evidence":"source-only","description":"保留字段/原值：obj.needlocation"},{"key":"preserve__interface_sdk_sdkad_php_45","type":"boolean","default":false,"kind":"preserve","target":"obj.show_push_splash_ad","scope":"/interface/sdk/sdkad.php","line":45,"operation":"obj.show_push_splash_ad = false;","evidence":"source-only","description":"保留字段/原值：obj.show_push_splash_ad"},{"key":"preserve__interface_sdk_sdkad_php_48","type":"boolean","default":false,"kind":"preserve","target":"obj.background_delay_display_time","scope":"/interface/sdk/sdkad.php","line":48,"operation":"obj.background_delay_display_time = 31536000;","evidence":"source-only","description":"保留字段/原值：obj.background_delay_display_time"},{"key":"preserve__interface_sdk_sdkad_php_51","type":"boolean","default":false,"kind":"preserve","target":"obj.lastAdShow_delay_display_time","scope":"/interface/sdk/sdkad.php","line":51,"operation":"obj.lastAdShow_delay_display_time = 31536000;","evidence":"source-only","description":"保留字段/原值：obj.lastAdShow_delay_display_time"},{"key":"preserve__interface_sdk_sdkad_php_54","type":"boolean","default":false,"kind":"preserve","target":"obj.realtime_ad_video_stall_time","scope":"/interface/sdk/sdkad.php","line":54,"operation":"obj.realtime_ad_video_stall_time = 0;","evidence":"source-only","description":"保留字段/原值：obj.realtime_ad_video_stall_time"},{"key":"preserve__interface_sdk_sdkad_php_57","type":"boolean","default":false,"kind":"preserve","target":"obj.realtime_ad_timeout_duration","scope":"/interface/sdk/sdkad.php","line":57,"operation":"obj.realtime_ad_timeout_duration = 0;","evidence":"source-only","description":"保留字段/原值：obj.realtime_ad_timeout_duration"},{"key":"preserve__interface_sdk_sdkad_php_61","type":"boolean","default":false,"kind":"preserve","target":"item.displaytime","scope":"/interface/sdk/sdkad.php","line":61,"operation":"item.displaytime = 0;","evidence":"source-only","description":"保留字段/原值：item.displaytime"},{"key":"preserve__interface_sdk_sdkad_php_62","type":"boolean","default":false,"kind":"preserve","target":"item.displayintervel","scope":"/interface/sdk/sdkad.php","line":62,"operation":"item.displayintervel = 31536000;","evidence":"source-only","description":"保留字段/原值：item.displayintervel"},{"key":"preserve__interface_sdk_sdkad_php_63","type":"boolean","default":false,"kind":"preserve","target":"item.allowdaydisplaynum","scope":"/interface/sdk/sdkad.php","line":63,"operation":"item.allowdaydisplaynum = 0;","evidence":"source-only","description":"保留字段/原值：item.allowdaydisplaynum"},{"key":"preserve__interface_sdk_sdkad_php_64","type":"boolean","default":false,"kind":"preserve","target":"item.begintime","scope":"/interface/sdk/sdkad.php","line":64,"operation":"item.begintime = \"2040-01-01 00:00:00\";","evidence":"source-only","description":"保留字段/原值：item.begintime"},{"key":"preserve__interface_sdk_sdkad_php_65","type":"boolean","default":false,"kind":"preserve","target":"item.endtime","scope":"/interface/sdk/sdkad.php","line":65,"operation":"item.endtime = \"2040-01-01 23:59:59\";","evidence":"source-only","description":"保留字段/原值：item.endtime"},{"key":"preserve__2_cardlist_73","type":"boolean","default":false,"kind":"preserve","target":"obj.top","scope":"/2/cardlist","line":73,"operation":"delete obj.top;","evidence":"source-only","description":"保留字段/原值：obj.top"},{"key":"retain__2_cardlist_83","type":"boolean","default":false,"kind":"retain","target":"[120, 145, 192]?.includes(cardType)","scope":"/2/cardlist","line":83,"operation":"[120, 145, 192]?.includes(cardType)","evidence":"source-only","description":"保留被筛选内容：[120, 145, 192]?.includes(cardType)"},{"key":"retain__2_cardlist_87","type":"boolean","default":false,"kind":"retain","target":"cardType === 6","scope":"/2/cardlist","line":87,"operation":"cardType === 6","evidence":"source-only","description":"保留被筛选内容：cardType === 6"},{"key":"retain__2_cardlist_100","type":"boolean","default":false,"kind":"retain","target":"[17, 58]?.includes(cardType)","scope":"/2/cardlist","line":100,"operation":"[17, 58]?.includes(cardType)","evidence":"source-only","description":"保留被筛选内容：[17, 58]?.includes(cardType)"},{"key":"preserve__2_checkin_show_114","type":"boolean","default":false,"kind":"preserve","target":"obj.show","scope":"/2/checkin/show","line":114,"operation":"obj.show = 0;","evidence":"source-only","description":"保留字段/原值：obj.show"},{"key":"preserve__2_checkin_show_117","type":"boolean","default":false,"kind":"preserve","target":"obj.show_time","scope":"/2/checkin/show","line":117,"operation":"obj.show_time = 0;","evidence":"source-only","description":"保留字段/原值：obj.show_time"},{"key":"preserve__2_push_active_126","type":"boolean","default":false,"kind":"preserve","target":"obj.compose_add_guide","scope":"/2/push/active","line":126,"operation":"delete obj.compose_add_guide;","evidence":"HAR-replayed-change","description":"保留字段/原值：obj.compose_add_guide"},{"key":"preserve__2_push_active_130","type":"boolean","default":false,"kind":"preserve","target":"obj.floating_windows_force_show","scope":"/2/push/active","line":130,"operation":"delete obj.floating_windows_force_show;","evidence":"HAR-replayed-change","description":"保留字段/原值：obj.floating_windows_force_show"},{"key":"preserve__2_push_active_133","type":"boolean","default":false,"kind":"preserve","target":"obj.interceptad","scope":"/2/push/active","line":133,"operation":"delete obj.interceptad;","evidence":"source-only","description":"保留字段/原值：obj.interceptad"},{"key":"preserve__2_push_active_136","type":"boolean","default":false,"kind":"preserve","target":"obj.interceptad_cardlist","scope":"/2/push/active","line":136,"operation":"delete obj.interceptad_cardlist;","evidence":"source-only","description":"保留字段/原值：obj.interceptad_cardlist"},{"key":"preserve__2_push_active_139","type":"boolean","default":false,"kind":"preserve","target":"obj.loginconfig","scope":"/2/push/active","line":139,"operation":"delete obj.loginconfig;","evidence":"HAR-replayed-change","description":"保留字段/原值：obj.loginconfig"},{"key":"preserve__2_push_active_142","type":"boolean","default":false,"kind":"preserve","target":"obj.profile_lotties","scope":"/2/push/active","line":142,"operation":"delete obj.profile_lotties;","evidence":"HAR-replayed-change","description":"保留字段/原值：obj.profile_lotties"},{"key":"preserve__2_push_active_145","type":"boolean","default":false,"kind":"preserve","target":"obj.ug_red_paper","scope":"/2/push/active","line":145,"operation":"delete obj.ug_red_paper;","evidence":"source-only","description":"保留字段/原值：obj.ug_red_paper"},{"key":"preserve__2_push_active_149","type":"boolean","default":false,"kind":"preserve","target":"obj.disable_floating_window","scope":"/2/push/active","line":149,"operation":"obj.disable_floating_window = \"1\";","evidence":"HAR-replayed-change","description":"保留字段/原值：obj.disable_floating_window"},{"key":"preserve__2_push_active_170","type":"boolean","default":false,"kind":"preserve","target":"obj.floating_window_for_live_streaming","scope":"/2/push/active","line":170,"operation":"obj.floating_window_for_live_streaming = false;","evidence":"source-only","description":"保留字段/原值：obj.floating_window_for_live_streaming"},{"key":"preserve__2_push_active_173","type":"boolean","default":false,"kind":"preserve","target":"obj.floating_window_show_interval","scope":"/2/push/active","line":173,"operation":"obj.floating_window_show_interval = 31536000;","evidence":"HAR-replayed-change","description":"保留字段/原值：obj.floating_window_show_interval"},{"key":"preserve__2_push_active_176","type":"boolean","default":false,"kind":"preserve","target":"obj.floating_windows","scope":"/2/push/active","line":176,"operation":"obj.floating_windows = obj.floating_windows.filter((i) => !/(?:^ad_?|red_pocket|ug_high_priority)/.test(i?.subtype));","evidence":"HAR-replayed-change","description":"保留字段/原值：obj.floating_windows"},{"key":"preserve__2_comments_build_comments_186","type":"boolean","default":false,"kind":"preserve","target":"item.data.comment_bubble","scope":"/2/comments/build_comments","line":186,"operation":"delete item.data.comment_bubble;","evidence":"source-only","description":"保留字段/原值：item.data.comment_bubble"},{"key":"preserve__2_comments_build_comments_189","type":"boolean","default":false,"kind":"preserve","target":"item.data.comment_bullet_screens_message","scope":"/2/comments/build_comments","line":189,"operation":"delete item.data.comment_bullet_screens_message;","evidence":"source-only","description":"保留字段/原值：item.data.comment_bullet_screens_message"},{"key":"preserve__2_comments_build_comments_192","type":"boolean","default":false,"kind":"preserve","target":"item.data.hot_icon","scope":"/2/comments/build_comments","line":192,"operation":"delete item.data.hot_icon;","evidence":"source-only","description":"保留字段/原值：item.data.hot_icon"},{"key":"preserve__2_comments_build_comments_195","type":"boolean","default":false,"kind":"preserve","target":"item.data.vip_button","scope":"/2/comments/build_comments","line":195,"operation":"delete item.data.vip_button;","evidence":"source-only","description":"保留字段/原值：item.data.vip_button"},{"key":"retain__2_comments_build_comments_200","type":"boolean","default":false,"kind":"retain","target":"/(超话社区|微博)/.test(item?.data?.user?.name)","scope":"/2/comments/build_comments","line":200,"operation":"/(超话社区|微博)/.test(item?.data?.user?.name)","evidence":"source-only","description":"保留被筛选内容：/(超话社区|微博)/.test(item?.data?.user?.name)"},{"key":"retain__2_comments_build_comments_205","type":"boolean","default":false,"kind":"retain","target":"[6, 15, 41]?.includes(item?.type)","scope":"/2/comments/build_comments","line":205,"operation":"[6, 15, 41]?.includes(item?.type)","evidence":"source-only","description":"保留被筛选内容：[6, 15, 41]?.includes(item?.type)"},{"key":"retain__2_comments_build_comments_208","type":"boolean","default":false,"kind":"retain","target":"[\"广告\", \"荐读\", \"评论总结\", \"推荐\", \"相关内容\", \"相关评论\"]?.includes(item?.adType)","scope":"/2/comments/build_comments","line":208,"operation":"[\"广告\", \"荐读\", \"评论总结\", \"推荐\", \"相关内容\", \"相关评论\"]?.includes(item?.adType)","evidence":"source-only","description":"保留被筛选内容：[\"广告\", \"荐读\", \"评论总结\", \"推荐\", \"相关内容\", \"相关评论\"]?.includes(item?.adType)"},{"key":"preserve__2_comments_build_comments_221","type":"boolean","default":false,"kind":"preserve","target":"item.comment_bubble","scope":"/2/comments/build_comments","line":221,"operation":"delete item.comment_bubble;","evidence":"source-only","description":"保留字段/原值：item.comment_bubble"},{"key":"preserve__2_comments_build_comments_224","type":"boolean","default":false,"kind":"preserve","target":"item.data.comment_bubble","scope":"/2/comments/build_comments","line":224,"operation":"delete item.data.comment_bubble;","evidence":"source-only","description":"保留字段/原值：item.data.comment_bubble"},{"key":"preserve__2_comments_build_comments_227","type":"boolean","default":false,"kind":"preserve","target":"item.data.comment_bullet_screens_message","scope":"/2/comments/build_comments","line":227,"operation":"delete item.data.comment_bullet_screens_message;","evidence":"source-only","description":"保留字段/原值：item.data.comment_bullet_screens_message"},{"key":"preserve__2_comments_build_comments_230","type":"boolean","default":false,"kind":"preserve","target":"item.data.hot_icon","scope":"/2/comments/build_comments","line":230,"operation":"delete item.data.hot_icon;","evidence":"source-only","description":"保留字段/原值：item.data.hot_icon"},{"key":"preserve__2_comments_build_comments_233","type":"boolean","default":false,"kind":"preserve","target":"item.data.vip_button","scope":"/2/comments/build_comments","line":233,"operation":"delete item.data.vip_button;","evidence":"source-only","description":"保留字段/原值：item.data.vip_button"},{"key":"retain__2_comments_build_comments_238","type":"boolean","default":false,"kind":"retain","target":"[\"超话社区\", \"微博视频\"]?.includes(item?.user?.name)","scope":"/2/comments/build_comments","line":238,"operation":"[\"超话社区\", \"微博视频\"]?.includes(item?.user?.name)","evidence":"source-only","description":"保留被筛选内容：[\"超话社区\", \"微博视频\"]?.includes(item?.user?.name)"},{"key":"preserve__2_comments_build_comments_250","type":"boolean","default":false,"kind":"preserve","target":"item.reply_comment.comment_badge","scope":"/2/comments/build_comments","line":250,"operation":"delete item.reply_comment.comment_badge;","evidence":"source-only","description":"保留字段/原值：item.reply_comment.comment_badge"},{"key":"preserve__2_comments_build_comments_253","type":"boolean","default":false,"kind":"preserve","target":"item.user.icons","scope":"/2/comments/build_comments","line":253,"operation":"delete item.user.icons;","evidence":"source-only","description":"保留字段/原值：item.user.icons"},{"key":"preserve__2_comments_build_comments_261","type":"boolean","default":false,"kind":"preserve","target":"obj.rootComment.comment_bubble","scope":"/2/comments/build_comments","line":261,"operation":"delete obj.rootComment.comment_bubble;","evidence":"source-only","description":"保留字段/原值：obj.rootComment.comment_bubble"},{"key":"retain__2_container_asyn_272","type":"boolean","default":false,"kind":"retain","target":"/infeed_may_interest_in/.test(item?.itemId)","scope":"/2/container/asyn","line":272,"operation":"/infeed_may_interest_in/.test(item?.itemId)","evidence":"source-only","description":"保留被筛选内容：/infeed_may_interest_in/.test(item?.itemId)"},{"key":"retain__2_container_asyn_276","type":"boolean","default":false,"kind":"retain","target":"item?.itemId === null","scope":"/2/container/asyn","line":276,"operation":"item?.itemId === null","evidence":"source-only","description":"保留被筛选内容：item?.itemId === null"},{"key":"preserve__2_direct_messages_user_list_292","type":"boolean","default":false,"kind":"preserve","target":"obj.user_list","scope":"/2/direct_messages/user_list","line":292,"operation":"obj.user_list = obj.user_list.filter((i) => ![\"活动通知\", \"闪聊\"]?.includes(i?.user?.name));","evidence":"HAR-replayed-change","description":"保留字段/原值：obj.user_list"},{"key":"retain__2_flowlist_309","type":"boolean","default":false,"kind":"retain","target":"/_selfrecomm/.test(tab?.flowId)","scope":"/2/flowlist","line":309,"operation":"/_selfrecomm/.test(tab?.flowId)","evidence":"source-only","description":"保留被筛选内容：/_selfrecomm/.test(tab?.flowId)"},{"key":"retain__2_flowlist_312","type":"boolean","default":false,"kind":"retain","target":"/_chaohua/.test(tab?.flowId)","scope":"/2/flowlist","line":312,"operation":"/_chaohua/.test(tab?.flowId)","evidence":"source-only","description":"保留被筛选内容：/_chaohua/.test(tab?.flowId)"},{"key":"retain__2_flowpage_326","type":"boolean","default":false,"kind":"retain","target":"item?.data?.itemid === \"hot-search-push-notice\"","scope":"/2/flowpage","line":326,"operation":"item?.data?.itemid === \"hot-search-push-notice\"","evidence":"source-only","description":"保留被筛选内容：item?.data?.itemid === \"hot-search-push-notice\""},{"key":"retain__2_flowpage_333","type":"boolean","default":false,"kind":"retain","target":"i?.data?.hasOwnProperty(\"promotion\")","scope":"/2/flowpage","line":333,"operation":"i?.data?.hasOwnProperty(\"promotion\")","evidence":"HAR-replayed-change","description":"保留被筛选内容：i?.data?.hasOwnProperty(\"promotion\")"},{"key":"retain__2_flowpage_336","type":"boolean","default":false,"kind":"retain","target":"/_img_search_stick/.test(i?.data?.pic)","scope":"/2/flowpage","line":336,"operation":"/_img_search_stick/.test(i?.data?.pic)","evidence":"source-only","description":"保留被筛选内容：/_img_search_stick/.test(i?.data?.pic)"},{"key":"retain__2_groups_allgroups_v2_355","type":"boolean","default":false,"kind":"retain","target":"item?.pageDataType === \"homeExtend\"","scope":"/2/groups/allgroups/v2","line":355,"operation":"item?.pageDataType === \"homeExtend\"","evidence":"source-only","description":"保留被筛选内容：item?.pageDataType === \"homeExtend\""},{"key":"retain__2_groups_allgroups_v2_370","type":"boolean","default":false,"kind":"retain","target":"fallback ii","scope":"/2/groups/allgroups/v2","line":370,"operation":"continue;","evidence":"HAR-replayed-change","description":"保留被筛选内容：fallback ii"},{"key":"preserve__2_groups_allgroups_v2_373","type":"boolean","default":false,"kind":"preserve","target":"ii.title","scope":"/2/groups/allgroups/v2","line":373,"operation":"ii.title = \"微博\";","evidence":"HAR-replayed-change","description":"保留字段/原值：ii.title"},{"key":"retain__2_messageflow_notice_393","type":"boolean","default":false,"kind":"retain","target":"msg?.msg_card?.ad_tag","scope":"/2/messageflow/notice","line":393,"operation":"msg?.msg_card?.ad_tag","evidence":"HAR-replayed-change","description":"保留被筛选内容：msg?.msg_card?.ad_tag"},{"key":"preserve__2_page_405","type":"boolean","default":false,"kind":"preserve","target":"obj.cards[0].card_group","scope":"/2/page","line":405,"operation":"obj.cards[0].card_group = obj.cards[0].card_group.filter(\n          (c) => !(c?.actionlog?.ext?.includes(\"ads_word\") || c?.itemid?.includes(\"t:51\") || c?.itemid?.includes(\"ads_word\"))\n        );","evidence":"source-only","description":"保留字段/原值：obj.cards[0].card_group"},{"key":"preserve__2_page_409","type":"boolean","default":false,"kind":"preserve","target":"obj.cards","scope":"/2/page","line":409,"operation":"obj.cards = obj.cards.filter(\n        (i) =>\n          !(\n            i?.itemid?.includes(\"feed_-_invite\") || // 超话里的好友\n            i?.itemid?.includes(\"infeed_friends_recommend\") || // 好友关注\n            i?.itemid?.includes(\"infeed_may_interest_in\") || // 你可能感兴趣的超话\n            i?.itemid?.includes(\"infeed_pagemanual3\") || // 手动区域3\n            i?.itemid?.includes(\"infeed_weibo_mall\") || // 微博小店\n            i?.mblog?.mblogtypename?.includes(\"广告\")\n          )\n      );","evidence":"source-only","description":"保留字段/原值：obj.cards"},{"key":"preserve__2_page_421","type":"boolean","default":false,"kind":"preserve","target":"obj.card_group","scope":"/2/page","line":421,"operation":"obj.card_group = obj.card_group.filter((i) => i?.desc?.includes(\"你可能感兴趣的超话\"));","evidence":"source-only","description":"保留字段/原值：obj.card_group"},{"key":"preserve__2_profile_container_timeline_425","type":"boolean","default":false,"kind":"preserve","target":"obj.loadedInfo.follow_guide_info","scope":"/2/profile/container_timeline","line":425,"operation":"delete obj.loadedInfo.follow_guide_info;","evidence":"source-only","description":"保留字段/原值：obj.loadedInfo.follow_guide_info"},{"key":"retain__2_profile_container_timeline_431","type":"boolean","default":false,"kind":"retain","target":"item?.data?.left_hint?.[0]?.content === \"全部微博(0)\" && item?.data?.card_type === 216","scope":"/2/profile/container_timeline","line":431,"operation":"item?.data?.left_hint?.[0]?.content === \"全部微博(0)\" && item?.data?.card_type === 216","evidence":"source-only","description":"保留被筛选内容：item?.data?.left_hint?.[0]?.content === \"全部微博(0)\" && item?.data?.card_type === 216"},{"key":"retain__2_profile_container_timeline_434","type":"boolean","default":false,"kind":"retain","target":"/内容/.test(item?.data?.name) && item?.data?.card_type === 58","scope":"/2/profile/container_timeline","line":434,"operation":"/内容/.test(item?.data?.name) && item?.data?.card_type === 58","evidence":"source-only","description":"保留被筛选内容：/内容/.test(item?.data?.name) && item?.data?.card_type === 58"},{"key":"retain__2_profile_container_timeline_441","type":"boolean","default":false,"kind":"retain","target":"/没有公开博文，为你推荐以下精彩内容/.test(item?.data?.name)","scope":"/2/profile/container_timeline","line":441,"operation":"/没有公开博文，为你推荐以下精彩内容/.test(item?.data?.name)","evidence":"source-only","description":"保留被筛选内容：/没有公开博文，为你推荐以下精彩内容/.test(item?.data?.name)"},{"key":"preserve__2_profile_container_timeline_450","type":"boolean","default":false,"kind":"preserve","target":"item.header.data.icon","scope":"/2/profile/container_timeline","line":450,"operation":"delete item.header.data.icon;","evidence":"source-only","description":"保留字段/原值：item.header.data.icon"},{"key":"retain__2_profile_container_timeline_452","type":"boolean","default":false,"kind":"retain","target":"item?.itemId?.includes(\"INTEREST_PEOPLE\")","scope":"/2/profile/container_timeline","line":452,"operation":"item?.itemId?.includes(\"INTEREST_PEOPLE\")","evidence":"source-only","description":"保留被筛选内容：item?.itemId?.includes(\"INTEREST_PEOPLE\")"},{"key":"retain__2_profile_container_timeline_456","type":"boolean","default":false,"kind":"retain","target":"item?.profile_type_id === \"weibo_cardpics\"","scope":"/2/profile/container_timeline","line":456,"operation":"item?.profile_type_id === \"weibo_cardpics\"","evidence":"source-only","description":"保留被筛选内容：item?.profile_type_id === \"weibo_cardpics\""},{"key":"preserve__2_profile_container_timeline_469","type":"boolean","default":false,"kind":"preserve","target":"ii.data.enable_comment_guide","scope":"/2/profile/container_timeline","line":469,"operation":"ii.data.enable_comment_guide = false;","evidence":"source-only","description":"保留字段/原值：ii.data.enable_comment_guide"},{"key":"retain__2_profile_container_timeline_473","type":"boolean","default":false,"kind":"retain","target":"[10, 48, 176]?.includes(ii?.data?.card_type)","scope":"/2/profile/container_timeline","line":473,"operation":"[10, 48, 176]?.includes(ii?.data?.card_type)","evidence":"source-only","description":"保留被筛选内容：[10, 48, 176]?.includes(ii?.data?.card_type)"},{"key":"preserve__2_profile_container_timeline_478","type":"boolean","default":false,"kind":"preserve","target":"ii.data.rightImage","scope":"/2/profile/container_timeline","line":478,"operation":"delete ii.data.rightImage;","evidence":"source-only","description":"保留字段/原值：ii.data.rightImage"},{"key":"preserve__2_profile_container_timeline_481","type":"boolean","default":false,"kind":"preserve","target":"ii.data.backgroundImage","scope":"/2/profile/container_timeline","line":481,"operation":"delete ii.data.backgroundImage;","evidence":"source-only","description":"保留字段/原值：ii.data.backgroundImage"},{"key":"retain__2_profile_container_timeline_493","type":"boolean","default":false,"kind":"retain","target":"item?.data?.source?.includes(\"生日动态\")","scope":"/2/profile/container_timeline","line":493,"operation":"item?.data?.source?.includes(\"生日动态\")","evidence":"source-only","description":"保留被筛选内容：item?.data?.source?.includes(\"生日动态\")"},{"key":"retain__2_profile_container_timeline_497","type":"boolean","default":false,"kind":"retain","target":"item?.data?.title?.text !== \"热门\" && item?.data?.title?.structs?.length > 0","scope":"/2/profile/container_timeline","line":497,"operation":"item?.data?.title?.text !== \"热门\" && item?.data?.title?.structs?.length > 0","evidence":"source-only","description":"保留被筛选内容：item?.data?.title?.text !== \"热门\" && item?.data?.title?.structs?.length > 0"},{"key":"preserve__2_profile_dealatt_511","type":"boolean","default":false,"kind":"preserve","target":"obj.cards","scope":"/2/profile/dealatt","line":511,"operation":"obj.cards = [];","evidence":"source-only","description":"保留字段/原值：obj.cards"},{"key":"retain__2_profile_dealatt_518","type":"boolean","default":false,"kind":"retain","target":"item?.identifier === \"recommend\"","scope":"/2/profile/dealatt","line":518,"operation":"item?.identifier === \"recommend\"","evidence":"source-only","description":"保留被筛选内容：item?.identifier === \"recommend\""},{"key":"retain__2_profile_dealatt_521","type":"boolean","default":false,"kind":"retain","target":"/reward_/.test(item?.identifier)","scope":"/2/profile/dealatt","line":521,"operation":"/reward_/.test(item?.identifier)","evidence":"source-only","description":"保留被筛选内容：/reward_/.test(item?.identifier)"},{"key":"preserve__2_profile_me_533","type":"boolean","default":false,"kind":"preserve","target":"obj.vipHeaderBgImage","scope":"/2/profile/me","line":533,"operation":"delete obj.vipHeaderBgImage;","evidence":"HAR-replayed-change","description":"保留字段/原值：obj.vipHeaderBgImage"},{"key":"preserve__2_profile_me_542","type":"boolean","default":false,"kind":"preserve","target":"item.header.vipView","scope":"/2/profile/me","line":542,"operation":"delete item.header.vipView;","evidence":"HAR-replayed-change","description":"保留字段/原值：item.header.vipView"},{"key":"preserve__2_profile_me_545","type":"boolean","default":false,"kind":"preserve","target":"item.header.vipCenter","scope":"/2/profile/me","line":545,"operation":"delete item.header.vipCenter;","evidence":"source-only","description":"保留字段/原值：item.header.vipCenter"},{"key":"preserve__2_profile_me_548","type":"boolean","default":false,"kind":"preserve","target":"item.header.vipIcon","scope":"/2/profile/me","line":548,"operation":"delete item.header.vipIcon;","evidence":"source-only","description":"保留字段/原值：item.header.vipIcon"},{"key":"preserve__2_profile_me_555","type":"boolean","default":false,"kind":"preserve","target":"d.click.modules[0].scheme","scope":"/2/profile/me","line":555,"operation":"d.click.modules[0].scheme = s.replace(\"231093_-_selfrecomm\", \"231093_-_selffollowed\");","evidence":"source-only","description":"保留字段/原值：d.click.modules[0].scheme"},{"key":"preserve__2_profile_me_562","type":"boolean","default":false,"kind":"preserve","target":"item.items","scope":"/2/profile/me","line":562,"operation":"item.items = item.items.filter(\n              (i) =>\n                // i?.itemId === \"100505_-_album\" || // 我的相册\n                i?.itemId === \"100505_-_like\" || // 赞/收藏\n                i?.itemId === \"100505_-_watchhistory\" || // 浏览记录\n                i?.itemId === \"100505_-_draft\"|| // 草稿箱\n                i?.itemId === \"100505_-_pay\" // 我的钱包\n                // i?.itemId === \"100505_-_ordercenter\" || // 我的订单\n                // i?.itemId === \"100505_-_productcenter\" || // 创作中心\n                // i?.itemId === \"100505_-_promote\"  // 广告中心\n            );","evidence":"HAR-replayed-change","description":"保留字段/原值：item.items"},{"key":"preserve__2_profile_me_577","type":"boolean","default":false,"kind":"preserve","target":"item.style","scope":"/2/profile/me","line":577,"operation":"delete item.style;","evidence":"HAR-replayed-change","description":"保留字段/原值：item.style"},{"key":"preserve__2_profile_me_580","type":"boolean","default":false,"kind":"preserve","target":"item.images","scope":"/2/profile/me","line":580,"operation":"delete item.images;","evidence":"HAR-replayed-change","description":"保留字段/原值：item.images"},{"key":"preserve__2_profile_me_585","type":"boolean","default":false,"kind":"preserve","target":"item.footer","scope":"/2/profile/me","line":585,"operation":"delete item.footer;","evidence":"source-only","description":"保留字段/原值：item.footer"},{"key":"preserve__2_profile_me_588","type":"boolean","default":false,"kind":"preserve","target":"item.body","scope":"/2/profile/me","line":588,"operation":"delete item.body;","evidence":"source-only","description":"保留字段/原值：item.body"},{"key":"retain__2_profile_me_595","type":"boolean","default":false,"kind":"retain","target":"fallback item","scope":"/2/profile/me","line":595,"operation":"continue;","evidence":"HAR-replayed-change","description":"保留被筛选内容：fallback item"},{"key":"retain__2_profile_statuses_tab_609","type":"boolean","default":false,"kind":"retain","target":"cardType === 22","scope":"/2/profile/statuses/tab","line":609,"operation":"cardType === 22","evidence":"source-only","description":"保留被筛选内容：cardType === 22"},{"key":"preserve__2_profile_statuses_tab_631","type":"boolean","default":false,"kind":"preserve","target":"obj.cardlistInfo","scope":"/2/profile/statuses/tab","line":631,"operation":"delete obj.cardlistInfo;","evidence":"source-only","description":"保留字段/原值：obj.cardlistInfo"},{"key":"preserve__2_profile_userinfo_636","type":"boolean","default":false,"kind":"preserve","target":"obj.header.data.userInfo.avatar_extend_info","scope":"/2/profile/userinfo","line":636,"operation":"delete obj.header.data.userInfo.avatar_extend_info;","evidence":"source-only","description":"保留字段/原值：obj.header.data.userInfo.avatar_extend_info"},{"key":"preserve__2_profile_userinfo_639","type":"boolean","default":false,"kind":"preserve","target":"obj.profileSkin.data","scope":"/2/profile/userinfo","line":639,"operation":"delete obj.profileSkin.data;","evidence":"source-only","description":"保留字段/原值：obj.profileSkin.data"},{"key":"preserve__2_profile_userinfo_645","type":"boolean","default":false,"kind":"preserve","target":"toolbar.lottie_guide","scope":"/2/profile/userinfo","line":645,"operation":"delete toolbar.lottie_guide;","evidence":"source-only","description":"保留字段/原值：toolbar.lottie_guide"},{"key":"preserve__2_profile_userinfo_648","type":"boolean","default":false,"kind":"preserve","target":"toolbar.servicePopup.subData","scope":"/2/profile/userinfo","line":648,"operation":"delete toolbar.servicePopup.subData;","evidence":"source-only","description":"保留字段/原值：toolbar.servicePopup.subData"},{"key":"retain__2_profile_userinfo_653","type":"boolean","default":false,"kind":"retain","target":"item?.identifier === \"recommend\"","scope":"/2/profile/userinfo","line":653,"operation":"item?.identifier === \"recommend\"","evidence":"source-only","description":"保留被筛选内容：item?.identifier === \"recommend\""},{"key":"retain__2_profile_userinfo_656","type":"boolean","default":false,"kind":"retain","target":"item?.identifier === \"urge\"","scope":"/2/profile/userinfo","line":656,"operation":"item?.identifier === \"urge\"","evidence":"source-only","description":"保留被筛选内容：item?.identifier === \"urge\""},{"key":"retain__2_profile_userinfo_659","type":"boolean","default":false,"kind":"retain","target":"/reward_/.test(item?.identifier)","scope":"/2/profile/userinfo","line":659,"operation":"/reward_/.test(item?.identifier)","evidence":"source-only","description":"保留被筛选内容：/reward_/.test(item?.identifier)"},{"key":"preserve__2_search_container_timeline_673","type":"boolean","default":false,"kind":"preserve","target":"obj.loadedInfo","scope":"/2/search/container_timeline","line":673,"operation":"delete obj.loadedInfo;","evidence":"HAR-replayed-change","description":"保留字段/原值：obj.loadedInfo"},{"key":"retain__2_search_container_timeline_685","type":"boolean","default":false,"kind":"retain","target":"[19, 22, 118, 206, 208, 217, 236, 249, 261]?.includes(item?.data?.card_type)","scope":"/2/search/container_timeline","line":685,"operation":"[19, 22, 118, 206, 208, 217, 236, 249, 261]?.includes(item?.data?.card_type)","evidence":"source-only","description":"保留被筛选内容：[19, 22, 118, 206, 208, 217, 236, 249, 261]?.includes(item?.data?.card_type)"},{"key":"retain__2_search_container_timeline_687","type":"boolean","default":false,"kind":"retain","target":"item?.data?.itemid === \"ads_slide\"","scope":"/2/search/container_timeline","line":687,"operation":"item?.data?.itemid === \"ads_slide\"","evidence":"source-only","description":"保留被筛选内容：item?.data?.itemid === \"ads_slide\""},{"key":"retain__2_search_container_timeline_690","type":"boolean","default":false,"kind":"retain","target":"item?.data?.cate_id === \"1114\"","scope":"/2/search/container_timeline","line":690,"operation":"item?.data?.cate_id === \"1114\"","evidence":"source-only","description":"保留被筛选内容：item?.data?.cate_id === \"1114\""},{"key":"retain__2_search_container_timeline_693","type":"boolean","default":false,"kind":"retain","target":"item?.data?.hasOwnProperty(\"rank\")","scope":"/2/search/container_timeline","line":693,"operation":"item?.data?.hasOwnProperty(\"rank\")","evidence":"source-only","description":"保留被筛选内容：item?.data?.hasOwnProperty(\"rank\")"},{"key":"retain__2_search_container_timeline_703","type":"boolean","default":false,"kind":"retain","target":"item?.item_category === \"insert_item\"","scope":"/2/search/container_timeline","line":703,"operation":"item?.item_category === \"insert_item\"","evidence":"source-only","description":"保留被筛选内容：item?.item_category === \"insert_item\""},{"key":"retain__2_search_container_timeline_711","type":"boolean","default":false,"kind":"retain","target":"[118, 182, 192, 217, 247, 264]?.includes(ii?.data?.card_type)","scope":"/2/search/container_timeline","line":711,"operation":"[118, 182, 192, 217, 247, 264]?.includes(ii?.data?.card_type)","evidence":"source-only","description":"保留被筛选内容：[118, 182, 192, 217, 247, 264]?.includes(ii?.data?.card_type)"},{"key":"retain__2_search_container_timeline_713","type":"boolean","default":false,"kind":"retain","target":"ii?.data?.cate_id === \"1114\"","scope":"/2/search/container_timeline","line":713,"operation":"ii?.data?.cate_id === \"1114\"","evidence":"source-only","description":"保留被筛选内容：ii?.data?.cate_id === \"1114\""},{"key":"preserve__2_search_finder_735","type":"boolean","default":false,"kind":"preserve","target":"ch.payload.loadedInfo.searchBarContent","scope":"/2/search/finder","line":735,"operation":"ch.payload.loadedInfo.searchBarContent = [{}];","evidence":"HAR-replayed-change","description":"保留字段/原值：ch.payload.loadedInfo.searchBarContent"},{"key":"preserve__2_search_finder_738","type":"boolean","default":false,"kind":"preserve","target":"ch.payload.loadedInfo.headerBack.channelStyleMap","scope":"/2/search/finder","line":738,"operation":"ch.payload.loadedInfo.headerBack.channelStyleMap = {};","evidence":"HAR-replayed-change","description":"保留字段/原值：ch.payload.loadedInfo.headerBack.channelStyleMap"},{"key":"preserve__2_search_finder_741","type":"boolean","default":false,"kind":"preserve","target":"ch.titleInfoAbsorb","scope":"/2/search/finder","line":741,"operation":"delete ch.titleInfoAbsorb;","evidence":"HAR-replayed-change","description":"保留字段/原值：ch.titleInfoAbsorb"},{"key":"preserve__2_search_finder_742","type":"boolean","default":false,"kind":"preserve","target":"ch.titleInfo","scope":"/2/search/finder","line":742,"operation":"delete ch.titleInfo;","evidence":"HAR-replayed-change","description":"保留字段/原值：ch.titleInfo"},{"key":"preserve__2_search_finder_743","type":"boolean","default":false,"kind":"preserve","target":"ch.title","scope":"/2/search/finder","line":743,"operation":"delete ch.title;","evidence":"HAR-replayed-change","description":"保留字段/原值：ch.title"},{"key":"preserve__2_search_finder_750","type":"boolean","default":false,"kind":"preserve","target":"obj.channelInfo.moreChannels","scope":"/2/search/finder","line":750,"operation":"delete obj.channelInfo.moreChannels;","evidence":"HAR-replayed-change","description":"保留字段/原值：obj.channelInfo.moreChannels"},{"key":"preserve__2_search_finder_751","type":"boolean","default":false,"kind":"preserve","target":"obj.channelInfo.channelConfig","scope":"/2/search/finder","line":751,"operation":"delete obj.channelInfo.channelConfig;","evidence":"HAR-replayed-change","description":"保留字段/原值：obj.channelInfo.channelConfig"},{"key":"preserve__2_search_finder_757","type":"boolean","default":false,"kind":"preserve","target":"item.items","scope":"/2/search/finder","line":757,"operation":"item.items = item.items\n                .filter(e => {\n                  let type = e.data?.card_type;\n                  return type === 101 || type === 17;\n                })\n                .map(e => {\n                  if (e.data?.card_type === 17) {\n                    e.data.col = 1; // 强制单列\n                  }\n                  return e;\n                });","evidence":"HAR-replayed-change","description":"保留字段/原值：item.items"},{"key":"preserve__2_search_finder_856","type":"boolean","default":false,"kind":"preserve","target":"obj.channelInfo.moreChannels","scope":"/2/search/finder","line":856,"operation":"delete obj.channelInfo.moreChannels;","evidence":"HAR-replayed-change","description":"保留字段/原值：obj.channelInfo.moreChannels"},{"key":"retain__2_search_finder_863","type":"boolean","default":false,"kind":"retain","target":"[19, 22, 118, 206, 208, 217, 236, 249, 261]?.includes(item?.data?.card_type)","scope":"/2/search/finder","line":863,"operation":"[19, 22, 118, 206, 208, 217, 236, 249, 261]?.includes(item?.data?.card_type)","evidence":"source-only","description":"保留被筛选内容：[19, 22, 118, 206, 208, 217, 236, 249, 261]?.includes(item?.data?.card_type)"},{"key":"retain__2_search_finder_866","type":"boolean","default":false,"kind":"retain","target":"item?.data?.hasOwnProperty(\"rank\")","scope":"/2/search/finder","line":866,"operation":"item?.data?.hasOwnProperty(\"rank\")","evidence":"source-only","description":"保留被筛选内容：item?.data?.hasOwnProperty(\"rank\")"},{"key":"retain__2_search_finder_874","type":"boolean","default":false,"kind":"retain","target":"[118, 182, 192, 217, 247, 264]?.includes(i?.data?.card_type)","scope":"/2/search/finder","line":874,"operation":"[118, 182, 192, 217, 247, 264]?.includes(i?.data?.card_type)","evidence":"source-only","description":"保留被筛选内容：[118, 182, 192, 217, 247, 264]?.includes(i?.data?.card_type)"},{"key":"preserve__2_searchall_893_bg_img","type":"boolean","default":false,"kind":"preserve","target":"obj.header.data.bg_img","scope":"/2/searchall","line":893,"operation":"delete obj.header.data[i];","evidence":"source-only","description":"保留字段/原值：obj.header.data.bg_img","dynamic":{"variable":"i","value":"bg_img"}},{"key":"preserve__2_searchall_893_background_scheme","type":"boolean","default":false,"kind":"preserve","target":"obj.header.data.background_scheme","scope":"/2/searchall","line":893,"operation":"delete obj.header.data[i];","evidence":"source-only","description":"保留字段/原值：obj.header.data.background_scheme","dynamic":{"variable":"i","value":"background_scheme"}},{"key":"preserve__2_searchall_893_background_url","type":"boolean","default":false,"kind":"preserve","target":"obj.header.data.background_url","scope":"/2/searchall","line":893,"operation":"delete obj.header.data[i];","evidence":"source-only","description":"保留字段/原值：obj.header.data.background_url","dynamic":{"variable":"i","value":"background_url"}},{"key":"preserve__2_searchall_897","type":"boolean","default":false,"kind":"preserve","target":"obj.loadedInfo.serviceMap.layer","scope":"/2/searchall","line":897,"operation":"delete obj.loadedInfo.serviceMap.layer;","evidence":"source-only","description":"保留字段/原值：obj.loadedInfo.serviceMap.layer"},{"key":"preserve__2_searchall_902","type":"boolean","default":false,"kind":"preserve","target":"obj.footer.data.bg_lottie","scope":"/2/searchall","line":902,"operation":"delete obj.footer.data.bg_lottie;","evidence":"source-only","description":"保留字段/原值：obj.footer.data.bg_lottie"},{"key":"preserve__2_searchall_905","type":"boolean","default":false,"kind":"preserve","target":"obj.footer.data.bg_lottie_dark","scope":"/2/searchall","line":905,"operation":"delete obj.footer.data.bg_lottie_dark;","evidence":"source-only","description":"保留字段/原值：obj.footer.data.bg_lottie_dark"},{"key":"preserve__2_searchall_908","type":"boolean","default":false,"kind":"preserve","target":"obj.footer.data.discuss_avatars","scope":"/2/searchall","line":908,"operation":"delete obj.footer.data.discuss_avatars;","evidence":"source-only","description":"保留字段/原值：obj.footer.data.discuss_avatars"},{"key":"preserve__2_searchall_912","type":"boolean","default":false,"kind":"preserve","target":"obj.footer.data.menus","scope":"/2/searchall","line":912,"operation":"obj.footer.data.menus = obj.footer.data.menus.filter((i) => !/\\d+_ai\\./.test(i?.pic));","evidence":"source-only","description":"保留字段/原值：obj.footer.data.menus"},{"key":"retain__2_searchall_921","type":"boolean","default":false,"kind":"retain","target":"group?.card_type === 22","scope":"/2/searchall","line":921,"operation":"group?.card_type === 22","evidence":"source-only","description":"保留被筛选内容：group?.card_type === 22"},{"key":"retain__2_searchall_925","type":"boolean","default":false,"kind":"retain","target":"group?.card_type === 42 && group?.title_extra_text === \"广告\"","scope":"/2/searchall","line":925,"operation":"group?.card_type === 42 && group?.title_extra_text === \"广告\"","evidence":"source-only","description":"保留被筛选内容：group?.card_type === 42 && group?.title_extra_text === \"广告\""},{"key":"retain__2_searchall_928","type":"boolean","default":false,"kind":"retain","target":"group?.card_type === 3 && group?.pics?.length > 0","scope":"/2/searchall","line":928,"operation":"group?.card_type === 3 && group?.pics?.length > 0","evidence":"source-only","description":"保留被筛选内容：group?.card_type === 3 && group?.pics?.length > 0"},{"key":"preserve__2_searchall_936","type":"boolean","default":false,"kind":"preserve","target":"group.mblog.title_source","scope":"/2/searchall","line":936,"operation":"delete group.mblog.title_source;","evidence":"source-only","description":"保留字段/原值：group.mblog.title_source"},{"key":"preserve__2_searchall_939","type":"boolean","default":false,"kind":"preserve","target":"group.mblog.source_tag_struct","scope":"/2/searchall","line":939,"operation":"delete group.mblog.source_tag_struct;","evidence":"source-only","description":"保留字段/原值：group.mblog.source_tag_struct"},{"key":"preserve__2_searchall_942","type":"boolean","default":false,"kind":"preserve","target":"group.mblog.extend_info","scope":"/2/searchall","line":942,"operation":"delete group.mblog.extend_info;","evidence":"source-only","description":"保留字段/原值：group.mblog.extend_info"},{"key":"preserve__2_searchall_945","type":"boolean","default":false,"kind":"preserve","target":"group.mblog.common_struct","scope":"/2/searchall","line":945,"operation":"delete group.mblog.common_struct;","evidence":"source-only","description":"保留字段/原值：group.mblog.common_struct"},{"key":"retain__2_searchall_950","type":"boolean","default":false,"kind":"retain","target":"group?.mblog?.is_ad === 1","scope":"/2/searchall","line":950,"operation":"group?.mblog?.is_ad === 1","evidence":"source-only","description":"保留被筛选内容：group?.mblog?.is_ad === 1"},{"key":"preserve__2_searchall_967","type":"boolean","default":false,"kind":"preserve","target":"card.mblog.title_source","scope":"/2/searchall","line":967,"operation":"delete card.mblog.title_source;","evidence":"source-only","description":"保留字段/原值：card.mblog.title_source"},{"key":"preserve__2_searchall_970","type":"boolean","default":false,"kind":"preserve","target":"card.mblog.source_tag_struct","scope":"/2/searchall","line":970,"operation":"delete card.mblog.source_tag_struct;","evidence":"source-only","description":"保留字段/原值：card.mblog.source_tag_struct"},{"key":"preserve__2_searchall_973","type":"boolean","default":false,"kind":"preserve","target":"card.mblog.extend_info","scope":"/2/searchall","line":973,"operation":"delete card.mblog.extend_info;","evidence":"source-only","description":"保留字段/原值：card.mblog.extend_info"},{"key":"preserve__2_searchall_976","type":"boolean","default":false,"kind":"preserve","target":"card.mblog.common_struct","scope":"/2/searchall","line":976,"operation":"delete card.mblog.common_struct;","evidence":"source-only","description":"保留字段/原值：card.mblog.common_struct"},{"key":"preserve__2_searchall_984","type":"boolean","default":false,"kind":"preserve","target":"i.media_info.vote_info","scope":"/2/searchall","line":984,"operation":"delete i.media_info.vote_info;","evidence":"source-only","description":"保留字段/原值：i.media_info.vote_info"},{"key":"retain__2_searchall_1007","type":"boolean","default":false,"kind":"retain","target":"ii?.cate_id === \"638\" && ii?.readtimetype === \"card\"","scope":"/2/searchall","line":1007,"operation":"ii?.cate_id === \"638\" && ii?.readtimetype === \"card\"","evidence":"source-only","description":"保留被筛选内容：ii?.cate_id === \"638\" && ii?.readtimetype === \"card\""},{"key":"retain__2_searchall_1015","type":"boolean","default":false,"kind":"retain","target":"[3, 17, 22, 30, 42, 89, 101, 206]?.includes(ii?.data?.card_type)","scope":"/2/searchall","line":1015,"operation":"[3, 17, 22, 30, 42, 89, 101, 206]?.includes(ii?.data?.card_type)","evidence":"source-only","description":"保留被筛选内容：[3, 17, 22, 30, 42, 89, 101, 206]?.includes(ii?.data?.card_type)"},{"key":"retain__2_searchall_1017","type":"boolean","default":false,"kind":"retain","target":"ii?.data?.card_type === 4 && ii?.data?.cate_id === \"640\"","scope":"/2/searchall","line":1017,"operation":"ii?.data?.card_type === 4 && ii?.data?.cate_id === \"640\"","evidence":"source-only","description":"保留被筛选内容：ii?.data?.card_type === 4 && ii?.data?.cate_id === \"640\""},{"key":"retain__2_searchall_1020","type":"boolean","default":false,"kind":"retain","target":"ii?.data?.card_type === 42 && ii?.data?.is_ads === true","scope":"/2/searchall","line":1020,"operation":"ii?.data?.card_type === 42 && ii?.data?.is_ads === true","evidence":"source-only","description":"保留被筛选内容：ii?.data?.card_type === 42 && ii?.data?.is_ads === true"},{"key":"preserve__2_shproxy_chaohua_discovery_searchactive_1042","type":"boolean","default":false,"kind":"preserve","target":"obj.items","scope":"/2/shproxy/chaohua/discovery/searchactive","line":1042,"operation":"obj.items = obj.items.filter((i) => i?.data?.card_type !== 1007);","evidence":"source-only","description":"保留字段/原值：obj.items"},{"key":"retain__2_statuses_container_detail__1049","type":"boolean","default":false,"kind":"retain","target":"item?.data?.card_type === 236 && item?.category === \"wboxcard\"","scope":"/2/statuses/container_detail?","line":1049,"operation":"item?.data?.card_type === 236 && item?.category === \"wboxcard\"","evidence":"source-only","description":"保留被筛选内容：item?.data?.card_type === 236 && item?.category === \"wboxcard\""},{"key":"preserve__2_statuses_container_detail__1060","type":"boolean","default":false,"kind":"preserve","target":"obj.detailInfo.status.reward_info","scope":"/2/statuses/container_detail?","line":1060,"operation":"delete obj.detailInfo.status.reward_info;","evidence":"source-only","description":"保留字段/原值：obj.detailInfo.status.reward_info"},{"key":"preserve__2_statuses_container_detail_comment_1070","type":"boolean","default":false,"kind":"preserve","target":"item.data.comment_bubble","scope":"/2/statuses/container_detail_comment","line":1070,"operation":"delete item.data.comment_bubble;","evidence":"source-only","description":"保留字段/原值：item.data.comment_bubble"},{"key":"preserve__2_statuses_container_detail_comment_1073","type":"boolean","default":false,"kind":"preserve","target":"item.data.comment_bullet_screens_message","scope":"/2/statuses/container_detail_comment","line":1073,"operation":"delete item.data.comment_bullet_screens_message;","evidence":"source-only","description":"保留字段/原值：item.data.comment_bullet_screens_message"},{"key":"preserve__2_statuses_container_detail_comment_1076","type":"boolean","default":false,"kind":"preserve","target":"item.data.hot_icon","scope":"/2/statuses/container_detail_comment","line":1076,"operation":"delete item.data.hot_icon;","evidence":"source-only","description":"保留字段/原值：item.data.hot_icon"},{"key":"preserve__2_statuses_container_detail_comment_1079","type":"boolean","default":false,"kind":"preserve","target":"item.data.vip_button","scope":"/2/statuses/container_detail_comment","line":1079,"operation":"delete item.data.vip_button;","evidence":"source-only","description":"保留字段/原值：item.data.vip_button"},{"key":"retain__2_statuses_container_detail_comment_1084","type":"boolean","default":false,"kind":"retain","target":"/(超话社区|微博)/.test(item?.data?.user?.name)","scope":"/2/statuses/container_detail_comment","line":1084,"operation":"/(超话社区|微博)/.test(item?.data?.user?.name)","evidence":"source-only","description":"保留被筛选内容：/(超话社区|微博)/.test(item?.data?.user?.name)"},{"key":"retain__2_statuses_container_detail_comment_1088","type":"boolean","default":false,"kind":"retain","target":"[\"广告\", \"荐读\", \"评论总结\", \"推荐\", \"相关内容\", \"相关评论\"]?.includes(item?.data?.adType)","scope":"/2/statuses/container_detail_comment","line":1088,"operation":"[\"广告\", \"荐读\", \"评论总结\", \"推荐\", \"相关内容\", \"相关评论\"]?.includes(item?.data?.adType)","evidence":"source-only","description":"保留被筛选内容：[\"广告\", \"荐读\", \"评论总结\", \"推荐\", \"相关内容\", \"相关评论\"]?.includes(item?.data?.adType)"},{"key":"preserve__2_statuses_container_timeline_hot_1101_ad","type":"boolean","default":false,"kind":"preserve","target":"obj.ad","scope":"/2/statuses/container_timeline_hot","line":1101,"operation":"delete obj[s];","evidence":"source-only","description":"保留字段/原值：obj.ad","dynamic":{"variable":"s","value":"ad"}},{"key":"preserve__2_statuses_container_timeline_hot_1101_advertises","type":"boolean","default":false,"kind":"preserve","target":"obj.advertises","scope":"/2/statuses/container_timeline_hot","line":1101,"operation":"delete obj[s];","evidence":"source-only","description":"保留字段/原值：obj.advertises","dynamic":{"variable":"s","value":"advertises"}},{"key":"preserve__2_statuses_container_timeline_hot_1101_trends","type":"boolean","default":false,"kind":"preserve","target":"obj.trends","scope":"/2/statuses/container_timeline_hot","line":1101,"operation":"delete obj[s];","evidence":"source-only","description":"保留字段/原值：obj.trends","dynamic":{"variable":"s","value":"trends"}},{"key":"preserve__2_statuses_container_timeline_hot_1101_headers","type":"boolean","default":false,"kind":"preserve","target":"obj.headers","scope":"/2/statuses/container_timeline_hot","line":1101,"operation":"delete obj[s];","evidence":"source-only","description":"保留字段/原值：obj.headers","dynamic":{"variable":"s","value":"headers"}},{"key":"retain__2_statuses_container_timeline_hot_1114","type":"boolean","default":false,"kind":"retain","target":"fallback item","scope":"/2/statuses/container_timeline_hot","line":1114,"operation":"continue;","evidence":"source-only","description":"保留被筛选内容：fallback item"},{"key":"preserve__2_statuses_container_timeline__1132","type":"boolean","default":false,"kind":"preserve","target":"obj.loadedInfo.headers","scope":"/2/statuses/container_timeline?","line":1132,"operation":"delete obj.loadedInfo.headers;","evidence":"source-only","description":"保留字段/原值：obj.loadedInfo.headers"},{"key":"preserve__2_statuses_container_timeline__1135","type":"boolean","default":false,"kind":"preserve","target":"obj.common_struct","scope":"/2/statuses/container_timeline?","line":1135,"operation":"delete obj.common_struct;","evidence":"source-only","description":"保留字段/原值：obj.common_struct"},{"key":"preserve__2_statuses_container_timeline__1143","type":"boolean","default":false,"kind":"preserve","target":"item.status.action_button_icon_dic","scope":"/2/statuses/container_timeline?","line":1143,"operation":"delete item.status.action_button_icon_dic;","evidence":"source-only","description":"保留字段/原值：item.status.action_button_icon_dic"},{"key":"retain__2_statuses_container_timeline__1147","type":"boolean","default":false,"kind":"retain","target":"item.status?.title?.structs","scope":"/2/statuses/container_timeline?","line":1147,"operation":"item.status?.title?.structs","evidence":"source-only","description":"保留被筛选内容：item.status?.title?.structs"},{"key":"retain__2_statuses_container_timeline__1153","type":"boolean","default":false,"kind":"retain","target":"item?.status?.screen_name_suffix_new?.[3]?.content === \"快转了\"","scope":"/2/statuses/container_timeline?","line":1153,"operation":"item?.status?.screen_name_suffix_new?.[3]?.content === \"快转了\"","evidence":"source-only","description":"保留被筛选内容：item?.status?.screen_name_suffix_new?.[3]?.content === \"快转了\""},{"key":"retain__2_statuses_container_timeline__1158","type":"boolean","default":false,"kind":"retain","target":"item?.status?.title?.text?.includes(\"精选\")","scope":"/2/statuses/container_timeline?","line":1158,"operation":"item?.status?.title?.text?.includes(\"精选\")","evidence":"source-only","description":"保留被筛选内容：item?.status?.title?.text?.includes(\"精选\")"},{"key":"retain__2_statuses_container_timeline__1162","type":"boolean","default":false,"kind":"retain","target":"item?.status?.user?.following === false","scope":"/2/statuses/container_timeline?","line":1162,"operation":"item?.status?.user?.following === false","evidence":"source-only","description":"保留被筛选内容：item?.status?.user?.following === false"},{"key":"preserve__2_statuses_container_timeline__1167","type":"boolean","default":false,"kind":"preserve","target":"item.status.user.unfollowing_recom_switch","scope":"/2/statuses/container_timeline?","line":1167,"operation":"item.status.user.unfollowing_recom_switch = 0;","evidence":"source-only","description":"保留字段/原值：item.status.user.unfollowing_recom_switch"},{"key":"preserve__2_statuses_container_timeline__1171","type":"boolean","default":false,"kind":"preserve","target":"item.status.tag_struct","scope":"/2/statuses/container_timeline?","line":1171,"operation":"item.status.tag_struct = [];","evidence":"source-only","description":"保留字段/原值：item.status.tag_struct"},{"key":"preserve__2_statuses_container_timeline__1176","type":"boolean","default":false,"kind":"preserve","target":"item.data.action_button_icon_dic","scope":"/2/statuses/container_timeline?","line":1176,"operation":"delete item.data.action_button_icon_dic;","evidence":"source-only","description":"保留字段/原值：item.data.action_button_icon_dic"},{"key":"retain__2_statuses_container_timeline__1180","type":"boolean","default":false,"kind":"retain","target":"item.data?.title?.structs","scope":"/2/statuses/container_timeline?","line":1180,"operation":"item.data?.title?.structs","evidence":"source-only","description":"保留被筛选内容：item.data?.title?.structs"},{"key":"retain__2_statuses_container_timeline__1186","type":"boolean","default":false,"kind":"retain","target":"item?.data?.screen_name_suffix_new?.[3]?.content === \"快转了\"","scope":"/2/statuses/container_timeline?","line":1186,"operation":"item?.data?.screen_name_suffix_new?.[3]?.content === \"快转了\"","evidence":"source-only","description":"保留被筛选内容：item?.data?.screen_name_suffix_new?.[3]?.content === \"快转了\""},{"key":"retain__2_statuses_container_timeline__1191","type":"boolean","default":false,"kind":"retain","target":"item?.data?.title?.text?.includes(\"精选\")","scope":"/2/statuses/container_timeline?","line":1191,"operation":"item?.data?.title?.text?.includes(\"精选\")","evidence":"source-only","description":"保留被筛选内容：item?.data?.title?.text?.includes(\"精选\")"},{"key":"retain__2_statuses_container_timeline__1195","type":"boolean","default":false,"kind":"retain","target":"item?.data?.user?.following === false","scope":"/2/statuses/container_timeline?","line":1195,"operation":"item?.data?.user?.following === false","evidence":"source-only","description":"保留被筛选内容：item?.data?.user?.following === false"},{"key":"preserve__2_statuses_container_timeline__1200","type":"boolean","default":false,"kind":"preserve","target":"item.data.user.unfollowing_recom_switch","scope":"/2/statuses/container_timeline?","line":1200,"operation":"item.data.user.unfollowing_recom_switch = 0;","evidence":"HAR-replayed-change","description":"保留字段/原值：item.data.user.unfollowing_recom_switch"},{"key":"preserve__2_statuses_container_timeline__1204","type":"boolean","default":false,"kind":"preserve","target":"item.data.tag_struct","scope":"/2/statuses/container_timeline?","line":1204,"operation":"item.data.tag_struct = [];","evidence":"HAR-replayed-change","description":"保留字段/原值：item.data.tag_struct"},{"key":"retain__2_statuses_container_timeline__1211","type":"boolean","default":false,"kind":"retain","target":"fallback item","scope":"/2/statuses/container_timeline?","line":1211,"operation":"continue;","evidence":"source-only","description":"保留被筛选内容：fallback item"},{"key":"preserve__2_statuses_container_timeline_topic_1220","type":"boolean","default":false,"kind":"preserve","target":"obj.header.data.follow_guide_info","scope":"/2/statuses/container_timeline_topic","line":1220,"operation":"delete obj.header.data.follow_guide_info;","evidence":"source-only","description":"保留字段/原值：obj.header.data.follow_guide_info"},{"key":"preserve__2_statuses_container_timeline_topic_1230","type":"boolean","default":false,"kind":"preserve","target":"item.data.title","scope":"/2/statuses/container_timeline_topic","line":1230,"operation":"delete item.data.title;","evidence":"source-only","description":"保留字段/原值：item.data.title"},{"key":"retain__2_statuses_container_timeline_topic_1235","type":"boolean","default":false,"kind":"retain","target":"[4, 197, 1012]?.includes(item?.data?.card_type)","scope":"/2/statuses/container_timeline_topic","line":1235,"operation":"[4, 197, 1012]?.includes(item?.data?.card_type)","evidence":"source-only","description":"保留被筛选内容：[4, 197, 1012]?.includes(item?.data?.card_type)"},{"key":"preserve__2_statuses_container_timeline_topic_1241","type":"boolean","default":false,"kind":"preserve","target":"item.data.hotwords","scope":"/2/statuses/container_timeline_topic","line":1241,"operation":"item.data.hotwords = [];","evidence":"source-only","description":"保留字段/原值：item.data.hotwords"},{"key":"retain__2_statuses_container_timeline_topic_1243","type":"boolean","default":false,"kind":"retain","target":"item?.data?.card_type === 22 && item?.data?.hasOwnProperty(\"card_ad_style\")","scope":"/2/statuses/container_timeline_topic","line":1243,"operation":"item?.data?.card_type === 22 && item?.data?.hasOwnProperty(\"card_ad_style\")","evidence":"source-only","description":"保留被筛选内容：item?.data?.card_type === 22 && item?.data?.hasOwnProperty(\"card_ad_style\")"},{"key":"preserve__2_statuses_container_timeline_topic_1250","type":"boolean","default":false,"kind":"preserve","target":"item.style.topHover","scope":"/2/statuses/container_timeline_topic","line":1250,"operation":"delete item.style.topHover;","evidence":"source-only","description":"保留字段/原值：item.style.topHover"},{"key":"preserve__2_statuses_container_timeline_topic_1264","type":"boolean","default":false,"kind":"preserve","target":"ii.data.hotwords","scope":"/2/statuses/container_timeline_topic","line":1264,"operation":"ii.data.hotwords = [{ word: \"搜索超话\" }];","evidence":"source-only","description":"保留字段/原值：ii.data.hotwords"},{"key":"preserve__2_statuses_container_timeline_topic_1281","type":"boolean","default":false,"kind":"preserve","target":"ii.data.common_struct","scope":"/2/statuses/container_timeline_topic","line":1281,"operation":"delete ii.data.common_struct;","evidence":"source-only","description":"保留字段/原值：ii.data.common_struct"},{"key":"retain__2_statuses_container_timeline_topic_1284","type":"boolean","default":false,"kind":"retain","target":"[1008, 1024]?.includes(ii?.data?.card_type)","scope":"/2/statuses/container_timeline_topic","line":1284,"operation":"[1008, 1024]?.includes(ii?.data?.card_type)","evidence":"source-only","description":"保留被筛选内容：[1008, 1024]?.includes(ii?.data?.card_type)"},{"key":"retain__2_statuses_container_timeline_topic_1295","type":"boolean","default":false,"kind":"retain","target":"item?.header?.arrayText?.contents?.length > 0","scope":"/2/statuses/container_timeline_topic","line":1295,"operation":"item?.header?.arrayText?.contents?.length > 0","evidence":"source-only","description":"保留被筛选内容：item?.header?.arrayText?.contents?.length > 0"},{"key":"preserve__2_statuses_extend_1310","type":"boolean","default":false,"kind":"preserve","target":"obj.trend","scope":"/2/statuses/extend","line":1310,"operation":"delete obj.trend;","evidence":"source-only","description":"保留字段/原值：obj.trend"},{"key":"preserve__2_statuses_extend_1315","type":"boolean","default":false,"kind":"preserve","target":"obj.trend","scope":"/2/statuses/extend","line":1315,"operation":"delete obj.trend;","evidence":"source-only","description":"保留字段/原值：obj.trend"},{"key":"preserve__2_statuses_extend_1335_bubble_guide_data","type":"boolean","default":false,"kind":"preserve","target":"obj.bubble_guide_data","scope":"/2/statuses/extend","line":1335,"operation":"delete obj[i];","evidence":"source-only","description":"保留字段/原值：obj.bubble_guide_data","dynamic":{"variable":"i","value":"bubble_guide_data"}},{"key":"preserve__2_statuses_extend_1335_button_extra_info","type":"boolean","default":false,"kind":"preserve","target":"obj.button_extra_info","scope":"/2/statuses/extend","line":1335,"operation":"delete obj[i];","evidence":"source-only","description":"保留字段/原值：obj.button_extra_info","dynamic":{"variable":"i","value":"button_extra_info"}},{"key":"preserve__2_statuses_extend_1335_display_info","type":"boolean","default":false,"kind":"preserve","target":"obj.display_info","scope":"/2/statuses/extend","line":1335,"operation":"delete obj[i];","evidence":"source-only","description":"保留字段/原值：obj.display_info","dynamic":{"variable":"i","value":"display_info"}},{"key":"preserve__2_statuses_extend_1335_extend_info","type":"boolean","default":false,"kind":"preserve","target":"obj.extend_info","scope":"/2/statuses/extend","line":1335,"operation":"delete obj[i];","evidence":"source-only","description":"保留字段/原值：obj.extend_info","dynamic":{"variable":"i","value":"extend_info"}},{"key":"preserve__2_statuses_extend_1335_floating_button","type":"boolean","default":false,"kind":"preserve","target":"obj.floating_button","scope":"/2/statuses/extend","line":1335,"operation":"delete obj[i];","evidence":"source-only","description":"保留字段/原值：obj.floating_button","dynamic":{"variable":"i","value":"floating_button"}},{"key":"preserve__2_statuses_extend_1335_follow_data","type":"boolean","default":false,"kind":"preserve","target":"obj.follow_data","scope":"/2/statuses/extend","line":1335,"operation":"delete obj[i];","evidence":"source-only","description":"保留字段/原值：obj.follow_data","dynamic":{"variable":"i","value":"follow_data"}},{"key":"preserve__2_statuses_extend_1335_head_cards","type":"boolean","default":false,"kind":"preserve","target":"obj.head_cards","scope":"/2/statuses/extend","line":1335,"operation":"delete obj[i];","evidence":"source-only","description":"保留字段/原值：obj.head_cards","dynamic":{"variable":"i","value":"head_cards"}},{"key":"preserve__2_statuses_extend_1335_highlight","type":"boolean","default":false,"kind":"preserve","target":"obj.highlight","scope":"/2/statuses/extend","line":1335,"operation":"delete obj[i];","evidence":"source-only","description":"保留字段/原值：obj.highlight","dynamic":{"variable":"i","value":"highlight"}},{"key":"preserve__2_statuses_extend_1335_interaction_extra_info","type":"boolean","default":false,"kind":"preserve","target":"obj.interaction_extra_info","scope":"/2/statuses/extend","line":1335,"operation":"delete obj[i];","evidence":"source-only","description":"保留字段/原值：obj.interaction_extra_info","dynamic":{"variable":"i","value":"interaction_extra_info"}},{"key":"preserve__2_statuses_extend_1335_page_alerts","type":"boolean","default":false,"kind":"preserve","target":"obj.page_alerts","scope":"/2/statuses/extend","line":1335,"operation":"delete obj[i];","evidence":"source-only","description":"保留字段/原值：obj.page_alerts","dynamic":{"variable":"i","value":"page_alerts"}},{"key":"preserve__2_statuses_extend_1335_reward_info","type":"boolean","default":false,"kind":"preserve","target":"obj.reward_info","scope":"/2/statuses/extend","line":1335,"operation":"delete obj[i];","evidence":"source-only","description":"保留字段/原值：obj.reward_info","dynamic":{"variable":"i","value":"reward_info"}},{"key":"preserve__2_statuses_extend_1335_source_tag_struct","type":"boolean","default":false,"kind":"preserve","target":"obj.source_tag_struct","scope":"/2/statuses/extend","line":1335,"operation":"delete obj[i];","evidence":"source-only","description":"保留字段/原值：obj.source_tag_struct","dynamic":{"variable":"i","value":"source_tag_struct"}},{"key":"preserve__2_statuses_extend_1335_top_cards","type":"boolean","default":false,"kind":"preserve","target":"obj.top_cards","scope":"/2/statuses/extend","line":1335,"operation":"delete obj[i];","evidence":"source-only","description":"保留字段/原值：obj.top_cards","dynamic":{"variable":"i","value":"top_cards"}},{"key":"preserve__2_statuses_extend_1352","type":"boolean","default":false,"kind":"preserve","target":"obj.has_common_struct","scope":"/2/statuses/extend","line":1352,"operation":"obj.has_common_struct = false;","evidence":"source-only","description":"保留字段/原值：obj.has_common_struct"},{"key":"preserve__2_statuses_extend_1355","type":"boolean","default":false,"kind":"preserve","target":"obj.enable_comment_guide","scope":"/2/statuses/extend","line":1355,"operation":"obj.enable_comment_guide = false;","evidence":"source-only","description":"保留字段/原值：obj.enable_comment_guide"},{"key":"preserve__2_statuses_show_1386","type":"boolean","default":false,"kind":"preserve","target":"obj.reward_info","scope":"/2/statuses/show","line":1386,"operation":"delete obj.reward_info;","evidence":"source-only","description":"保留字段/原值：obj.reward_info"},{"key":"preserve__2_video_full_screen_stream_1399","type":"boolean","default":false,"kind":"preserve","target":"item.video_info.tags","scope":"/2/video/full_screen_stream","line":1399,"operation":"item.video_info.tags = [];","evidence":"source-only","description":"保留字段/原值：item.video_info.tags"},{"key":"preserve__2_video_tiny_stream_mid_detail_1409","type":"boolean","default":false,"kind":"preserve","target":"obj.status.video_info.shopping","scope":"/2/video/tiny_stream_mid_detail","line":1409,"operation":"obj.status.video_info.shopping = [];","evidence":"source-only","description":"保留字段/原值：obj.status.video_info.shopping"},{"key":"preserve__2_video_tiny_stream_mid_detail_1413","type":"boolean","default":false,"kind":"preserve","target":"obj.status.video_info.bottom_banner","scope":"/2/video/tiny_stream_mid_detail","line":1413,"operation":"obj.status.video_info.bottom_banner = {};","evidence":"source-only","description":"保留字段/原值：obj.status.video_info.bottom_banner"},{"key":"preserve__2_video_tiny_stream_mid_detail_1417","type":"boolean","default":false,"kind":"preserve","target":"obj.status.video_info.float_info","scope":"/2/video/tiny_stream_mid_detail","line":1417,"operation":"obj.status.video_info.float_info = {};","evidence":"source-only","description":"保留字段/原值：obj.status.video_info.float_info"},{"key":"preserve__2_video_tiny_stream_video_list_1421","type":"boolean","default":false,"kind":"preserve","target":"obj.statuses","scope":"/2/video/tiny_stream_video_list","line":1421,"operation":"obj.statuses = [];","evidence":"source-only","description":"保留字段/原值：obj.statuses"},{"key":"preserve__2_video_tiny_stream_video_list_1425","type":"boolean","default":false,"kind":"preserve","target":"obj.tab_list","scope":"/2/video/tiny_stream_video_list","line":1425,"operation":"obj.tab_list = [];","evidence":"source-only","description":"保留字段/原值：obj.tab_list"},{"key":"preserve__2_huati_discovery_home_bottom_channels_1429","type":"boolean","default":false,"kind":"preserve","target":"obj.button_configs","scope":"/2/!/huati/discovery_home_bottom_channels","line":1429,"operation":"delete obj.button_configs;","evidence":"source-only","description":"保留字段/原值：obj.button_configs"},{"key":"preserve__2_huati_discovery_home_bottom_channels_1433","type":"boolean","default":false,"kind":"preserve","target":"obj.channelInfo.channel_list","scope":"/2/!/huati/discovery_home_bottom_channels","line":1433,"operation":"obj.channelInfo.channel_list = obj.channelInfo.channel_list.filter((t) => t?.title !== \"广场\");","evidence":"source-only","description":"保留字段/原值：obj.channelInfo.channel_list"},{"key":"preserve__aj_appicon_list_1439","type":"boolean","default":false,"kind":"preserve","target":"item.cardType","scope":"/aj/appicon/list","line":1439,"operation":"item.cardType = 2;","evidence":"source-only","description":"保留字段/原值：item.cardType"},{"key":"preserve__v1_ad_preload_1447","type":"boolean","default":false,"kind":"preserve","target":"item.start_time","scope":"/v1/ad/preload","line":1447,"operation":"item.start_time = 3818332800;","evidence":"source-only","description":"保留字段/原值：item.start_time"},{"key":"preserve__v1_ad_preload_1448","type":"boolean","default":false,"kind":"preserve","target":"item.end_time","scope":"/v1/ad/preload","line":1448,"operation":"item.end_time = 3818419199;","evidence":"source-only","description":"保留字段/原值：item.end_time"},{"key":"preserve__v1_ad_preload_1449","type":"boolean","default":false,"kind":"preserve","target":"item.daily_display_cnt","scope":"/v1/ad/preload","line":1449,"operation":"item.daily_display_cnt = 50;","evidence":"source-only","description":"保留字段/原值：item.daily_display_cnt"},{"key":"preserve__v1_ad_preload_1450","type":"boolean","default":false,"kind":"preserve","target":"item.display_duration","scope":"/v1/ad/preload","line":1450,"operation":"item.display_duration = 0;","evidence":"source-only","description":"保留字段/原值：item.display_duration"},{"key":"preserve__v1_ad_preload_1454","type":"boolean","default":false,"kind":"preserve","target":"item.start_time","scope":"/v1/ad/preload","line":1454,"operation":"item.start_time = 3818332800;","evidence":"source-only","description":"保留字段/原值：item.start_time"},{"key":"preserve__v1_ad_preload_1455","type":"boolean","default":false,"kind":"preserve","target":"item.end_time","scope":"/v1/ad/preload","line":1455,"operation":"item.end_time = 3818419199;","evidence":"source-only","description":"保留字段/原值：item.end_time"},{"key":"preserve__v1_ad_preload_1456","type":"boolean","default":false,"kind":"preserve","target":"item.daily_display_cnt","scope":"/v1/ad/preload","line":1456,"operation":"item.daily_display_cnt = 50;","evidence":"source-only","description":"保留字段/原值：item.daily_display_cnt"},{"key":"preserve__v1_ad_preload_1457","type":"boolean","default":false,"kind":"preserve","target":"item.display_duration","scope":"/v1/ad/preload","line":1457,"operation":"item.display_duration = 0;","evidence":"source-only","description":"保留字段/原值：item.display_duration"},{"key":"preserve__wbapplua_wbpullad_lua_1465","type":"boolean","default":false,"kind":"preserve","target":"item.show_count","scope":"/wbapplua/wbpullad.lua","line":1465,"operation":"item.show_count = 50;","evidence":"source-only","description":"保留字段/原值：item.show_count"},{"key":"preserve__wbapplua_wbpullad_lua_1466","type":"boolean","default":false,"kind":"preserve","target":"item.duration","scope":"/wbapplua/wbpullad.lua","line":1466,"operation":"item.duration = 0;","evidence":"source-only","description":"保留字段/原值：item.duration"},{"key":"preserve__wbapplua_wbpullad_lua_1467","type":"boolean","default":false,"kind":"preserve","target":"item.start_date","scope":"/wbapplua/wbpullad.lua","line":1467,"operation":"item.start_date = 3818332800;","evidence":"source-only","description":"保留字段/原值：item.start_date"},{"key":"preserve__wbapplua_wbpullad_lua_1468","type":"boolean","default":false,"kind":"preserve","target":"item.end_date","scope":"/wbapplua/wbpullad.lua","line":1468,"operation":"item.end_date = 3818419199;","evidence":"source-only","description":"保留字段/原值：item.end_date"},{"key":"preserve_removeAvatar_1510","type":"boolean","default":false,"kind":"preserve","target":"data.block_card_bg","scope":"removeAvatar","line":1510,"operation":"delete data.block_card_bg;","evidence":"source-only","description":"保留字段/原值：data.block_card_bg"},{"key":"preserve_removeAvatar_1513","type":"boolean","default":false,"kind":"preserve","target":"data.buttons","scope":"removeAvatar","line":1513,"operation":"delete data.buttons;","evidence":"HAR-replayed-change","description":"保留字段/原值：data.buttons"},{"key":"preserve_removeAvatar_1516","type":"boolean","default":false,"kind":"preserve","target":"data.cardid","scope":"removeAvatar","line":1516,"operation":"delete data.cardid;","evidence":"source-only","description":"保留字段/原值：data.cardid"},{"key":"preserve_removeAvatar_1519","type":"boolean","default":false,"kind":"preserve","target":"data.icons","scope":"removeAvatar","line":1519,"operation":"delete data.icons;","evidence":"source-only","description":"保留字段/原值：data.icons"},{"key":"preserve_removeAvatar_1522","type":"boolean","default":false,"kind":"preserve","target":"data.mblog_buttons","scope":"removeAvatar","line":1522,"operation":"delete data.mblog_buttons;","evidence":"HAR-replayed-change","description":"保留字段/原值：data.mblog_buttons"},{"key":"preserve_removeAvatar_1525","type":"boolean","default":false,"kind":"preserve","target":"data.pic_bg_new","scope":"removeAvatar","line":1525,"operation":"delete data.pic_bg_new;","evidence":"HAR-replayed-change","description":"保留字段/原值：data.pic_bg_new"},{"key":"preserve_removeAvatar_1528","type":"boolean","default":false,"kind":"preserve","target":"data.user.avatargj_id","scope":"removeAvatar","line":1528,"operation":"delete data.user.avatargj_id;","evidence":"HAR-replayed-change","description":"保留字段/原值：data.user.avatargj_id"},{"key":"preserve_removeAvatar_1531","type":"boolean","default":false,"kind":"preserve","target":"data.user.avatar_extend_info","scope":"removeAvatar","line":1531,"operation":"delete data.user.avatar_extend_info;","evidence":"HAR-replayed-change","description":"保留字段/原值：data.user.avatar_extend_info"},{"key":"preserve_removeAvatar_1534","type":"boolean","default":false,"kind":"preserve","target":"data.user.cardid","scope":"removeAvatar","line":1534,"operation":"delete data.user.cardid;","evidence":"HAR-replayed-change","description":"保留字段/原值：data.user.cardid"},{"key":"preserve_removeAvatar_1537","type":"boolean","default":false,"kind":"preserve","target":"data.user.icons","scope":"removeAvatar","line":1537,"operation":"delete data.user.icons;","evidence":"HAR-replayed-change","description":"保留字段/原值：data.user.icons"},{"key":"preserve_removeAvatar_1540","type":"boolean","default":false,"kind":"preserve","target":"data.user.mbtype","scope":"removeAvatar","line":1540,"operation":"delete data.user.mbtype;","evidence":"HAR-replayed-change","description":"保留字段/原值：data.user.mbtype"},{"key":"preserve_removeFeedAd_1551","type":"boolean","default":false,"kind":"preserve","target":"item.common_struct","scope":"removeFeedAd","line":1551,"operation":"delete item.common_struct;","evidence":"HAR-replayed-change","description":"保留字段/原值：item.common_struct"},{"key":"preserve_removeFeedAd_1554","type":"boolean","default":false,"kind":"preserve","target":"item.comment_summary","scope":"removeFeedAd","line":1554,"operation":"delete item.comment_summary;","evidence":"source-only","description":"保留字段/原值：item.comment_summary"},{"key":"preserve_removeFeedAd_1557","type":"boolean","default":false,"kind":"preserve","target":"item.semantic_brand_params","scope":"removeFeedAd","line":1557,"operation":"delete item.semantic_brand_params;","evidence":"source-only","description":"保留字段/原值：item.semantic_brand_params"},{"key":"preserve_removeVoteInfo_1564","type":"boolean","default":false,"kind":"preserve","target":"item.page_info.media_info.vote_info","scope":"removeVoteInfo","line":1564,"operation":"delete item.page_info.media_info.vote_info;","evidence":"source-only","description":"保留字段/原值：item.page_info.media_info.vote_info"},{"key":"retain_classified_ads","type":"boolean","default":false,"kind":"retain","target":"isAd(data)","scope":"isAd","line":1476,"operation":"isAd predicate","evidence":"HAR-replayed-change","description":"保留由原 isAd 判据识别的广告/热推"},{"key":"preferFollowingPage","type":"boolean","default":false,"kind":"explicit","target":"优先关注为默认页（实验；仅改安全引用，未验证feed_default）","scope":"/2/groups/allgroups/v2","line":0,"operation":"applyFineCustom","evidence":"HAR-structure","candidate":"T04","description":"优先关注为默认页（实验；仅改安全引用，未验证feed_default）"},{"key":"hideRecommendedChannels","type":"boolean","default":false,"kind":"explicit","target":"隐藏推荐频道管理整块（保留我的频道）","scope":"/2/groups/allgroups/v2","line":0,"operation":"applyFineCustom","evidence":"HAR-structure","candidate":"T03","description":"隐藏推荐频道管理整块（保留我的频道）"},{"key":"hideFlowNavIcons","type":"boolean","default":false,"kind":"explicit","target":"隐藏热搜导航图标（不改变频道与排名）","scope":"/2/flowpage","line":0,"operation":"applyFineCustom","evidence":"HAR-structure","candidate":"H01","description":"隐藏热搜导航图标（不改变频道与排名）"},{"key":"hideDetailNavIcons","type":"boolean","default":false,"kind":"explicit","target":"隐藏详情频道装饰图标（不改变转评赞）","scope":"/2/statuses/container_detail","line":0,"operation":"applyFineCustom","evidence":"HAR-structure","candidate":"D03","description":"隐藏详情频道装饰图标（不改变转评赞）"},{"key":"hideFlowCardIcons","type":"boolean","default":false,"kind":"explicit","target":"隐藏热搜卡片图标与箭头（不改变榜单）","scope":"/2/flowpage","line":0,"operation":"applyFineCustom","evidence":"HAR-structure","candidate":"H03","description":"隐藏热搜卡片图标与箭头（不改变榜单）"},{"key":"hideProfileGridIcons","type":"boolean","default":false,"kind":"explicit","target":"隐藏我的网格图标（实验外观）","scope":"/2/profile/me","line":0,"operation":"applyFineCustom","evidence":"HAR-structure","candidate":"M04","description":"隐藏我的网格图标（实验外观）"},{"key":"preserveFinderMoreChannels","type":"boolean","default":false,"kind":"explicit","target":"保留发现更多频道入口（所有删除阶段）","scope":"/2/search/finder","line":0,"operation":"applyFineCustom","evidence":"HAR-structure","candidate":"F03","description":"保留发现更多频道入口（所有删除阶段）"},{"key":"hideIconShortcuts","type":"boolean","default":false,"kind":"explicit","target":"隐藏全部启动快捷操作（不修改跳转）","scope":"/2/push/active","line":0,"operation":"applyFineCustom","evidence":"HAR-structure","candidate":"S04","description":"隐藏全部启动快捷操作（不修改跳转）"},{"key":"fineProfile","type":"boolean","default":false,"kind":"explicit","target":"从原始响应定制我的模块/网格","scope":"/2/profile/me","line":0,"operation":"applyFineCustom","evidence":"HAR-structure","candidate":"M01 M02 M03","description":"从原始响应定制我的模块/网格"},{"key":"fineTabs","type":"boolean","default":false,"kind":"explicit","target":"从原始响应定制顶部导航及默认子分组","scope":"/2/groups/allgroups/v2","line":0,"operation":"applyFineCustom","evidence":"HAR-structure","candidate":"T01 T02","description":"从原始响应定制顶部导航及默认子分组"},{"key":"fineMenus","type":"boolean","default":false,"kind":"explicit","target":"新版详情菜单使用旧26键与新增定制","scope":"/2/statuses/container_detail","line":0,"operation":"applyFineCustom","evidence":"HAR-structure","candidate":"D01","description":"新版详情菜单使用旧26键与新增定制"},{"key":"hideProfileBadges","type":"boolean","default":false,"kind":"explicit","target":"隐藏已知网格红点/角标","scope":"/2/profile/me","line":0,"operation":"applyFineCustom","evidence":"HAR-structure","candidate":"M06","description":"隐藏已知网格红点/角标"},{"key":"preserveFinderHeader","type":"boolean","default":false,"kind":"explicit","target":"保留原始发现头部卡片","scope":"/2/search/finder","line":0,"operation":"applyFineCustom","evidence":"HAR-structure","candidate":"F02","description":"保留原始发现头部卡片"},{"key":"hideFlowBanners","type":"boolean","default":false,"kind":"explicit","target":"隐藏热搜多尺寸背景横幅","scope":"/2/flowpage","line":0,"operation":"applyFineCustom","evidence":"HAR-structure","candidate":"H02","description":"隐藏热搜多尺寸背景横幅"},{"key":"hideFeedRedpacket","type":"boolean","default":false,"kind":"explicit","target":"隐藏首页红包入口","scope":"/2/push/active","line":0,"operation":"applyFineCustom","evidence":"HAR-structure","candidate":"S02","description":"隐藏首页红包入口"},{"key":"hideNoticeMaterials","type":"boolean","default":false,"kind":"explicit","target":"隐藏消息提醒装饰素材","scope":"/2/messageflow/notice","line":0,"operation":"applyFineCustom","evidence":"HAR-structure","candidate":"N01","description":"隐藏消息提醒装饰素材"},{"key":"hideClearTrashButton","type":"boolean","default":false,"kind":"explicit","target":"隐藏私信清理按钮（不执行清理）","scope":"/2/direct_messages/user_list","line":0,"operation":"applyFineCustom","evidence":"HAR-structure","candidate":"N03","description":"隐藏私信清理按钮（不执行清理）"},{"key":"hidePublicReminderTab","type":"boolean","default":false,"kind":"explicit","target":"隐藏私信提醒标签（不改未读）","scope":"/2/direct_messages/user_list","line":0,"operation":"applyFineCustom","evidence":"HAR-structure","candidate":"N04","description":"隐藏私信提醒标签（不改未读）"},{"key":"hideFlowTools","type":"boolean","default":false,"kind":"explicit","target":"隐藏热搜页工具菜单","scope":"/2/flowpage","line":0,"operation":"applyFineCustom","evidence":"HAR-structure","candidate":"H04","description":"隐藏热搜页工具菜单"},{"key":"hideHotWords","type":"boolean","default":false,"kind":"explicit","target":"隐藏整块热词数据（不修改排名）","scope":"/2/search/hot_word","line":0,"operation":"applyFineCustom","evidence":"HAR-structure","candidate":"H06","description":"隐藏整块热词数据（不修改排名）"},{"key":"hideComposerEntry","type":"boolean","default":false,"kind":"explicit","target":"隐藏首页发布入口","scope":"/2/push/active","line":0,"operation":"applyFineCustom","evidence":"HAR-structure","candidate":"S03","description":"隐藏首页发布入口"},{"key":"hideHotExtraButton","type":"boolean","default":false,"kind":"explicit","target":"隐藏推荐流附加按钮","scope":"/2/statuses/container_timeline_hot","line":0,"operation":"applyFineCustom","evidence":"HAR-structure","candidate":"B02","description":"隐藏推荐流附加按钮"},{"key":"hideHotContinueTag","type":"boolean","default":false,"kind":"explicit","target":"隐藏推荐流连续标签","scope":"/2/statuses/container_timeline_hot","line":0,"operation":"applyFineCustom","evidence":"HAR-structure","candidate":"B02","description":"隐藏推荐流连续标签"}];
/* Only fixed non-user template identifiers observed in HAR. */
const MODULE_IDS=['profileme_mine','100505_-_top8','100505_-_mypay_new','100505_-_chaohua','100505_-_diamond','100505_-_renwu','100505_-_aibanliao','100505_-_chds','100505_-_worldcup','100505_-_chaoyouqu','100505_-_manage'];
const GRID_IDS=['100505_-_album','100505_-_like','100505_-_watchhistory','100505_-_draft','100505_-_pay','100505_-_ordercenter','100505_-_productcenter','100505_-_dress'];
const TAB_IDS=['homeHot','homeFeed'];
const SUBTAB_IDS=['最新微博','特别关注','好友圈','视频']; // Source-only title templates, not user groups.
const MENU_IDS=['creatortypeask','mblog_menus_apeal','mblog_menus_avatar_widget','mblog_menus_bullet_shield','mblog_menus_card_bg','mblog_menus_comment_manager','mblog_menus_copy_url','mblog_menus_custom','mblog_menus_delete','mblog_menus_edit','mblog_menus_edit_history','mblog_menus_edit_video','mblog_menus_favorite','mblog_menus_follow','mblog_menus_home','mblog_menus_long_picture','mblog_menus_modify_visible','mblog_menus_novelty','mblog_menus_open_reward','mblog_menus_popularize','mblog_menus_promote','mblog_menus_report','mblog_menus_shield','mblog_menus_sticking','mblog_menus_video_feedback','mblog_menus_video_later','mblog_menus_edit_audio','mblog_menus_remark'];
const NEGATIVE_IDS=['mblog_menus_favorite','mblog_menus_edit','mblog_menus_edit_history','mblog_menus_edit_video','mblog_menus_edit_audio','mblog_menus_avatar_widget','mblog_menus_card_bg','mblog_menus_sticking','mblog_menus_toplist','mblog_menus_popularize','mblog_menus_promote','mblog_menus_no_interst','mblog_menus_hide_status','mblog_menus_friend_circle','mblog_menus_follow','mblog_menus_cancel_follow_attention','mblog_menus_special_follow','mblog_menus_group_remove_user','mblog_menus_modify_visible','mblog_menus_remark','mblog_menus_shield','mblog_menus_video_feedback','mblog_menus_report','mblog_menus_album_delete','mblog_menus_delete'];
const PUBLISHER_NAMES=['写微博','图片','视频','直播','头条文章','文章','音乐','问答','投票','签到']; // Observed standard names; duplicate variants stay together.
const TYPED_SCHEMA={noticeMenuOrder:{type:'order',ids:['mblog_menus_no_interst','mblog_menus_report','mblog_menus_custom']},noticeMenuLabels:{type:'labels',ids:['mblog_menus_no_interst','mblog_menus_report','mblog_menus_custom']},noticeMenuVisible:{type:'boolMap',ids:['mblog_menus_no_interst','mblog_menus_report','mblog_menus_custom']},publisherVisible:{type:'boolMap',ids:PUBLISHER_NAMES,required:['写微博']},moduleVisible:{type:'boolMap',ids:MODULE_IDS,required:['profileme_mine','100505_-_manage']},moduleOrder:{type:'order',ids:MODULE_IDS},moduleLabels:{type:'labels',ids:MODULE_IDS.filter(x=>x!=='profileme_mine')},gridVisible:{type:'boolMap',ids:GRID_IDS},gridOrder:{type:'order',ids:GRID_IDS},gridLabels:{type:'labels',ids:GRID_IDS},tabVisible:{type:'boolMap',ids:TAB_IDS},tabOrder:{type:'order',ids:TAB_IDS},tabLabels:{type:'labels',ids:TAB_IDS},subtabVisible:{type:'boolMap',ids:SUBTAB_IDS},subtabOrder:{type:'order',ids:SUBTAB_IDS},subtabLabels:{type:'labels',ids:SUBTAB_IDS},menuVisible:{type:'boolMap',ids:MENU_IDS},menuOrder:{type:'order',ids:MENU_IDS},menuLabels:{type:'labels',ids:['mblog_menus_sticking','mblog_menus_not_sticking','mblog_menus_open_reward','mblog_menus_close_reward','mblog_menus_favorite','mblog_menus_cancel_favorite','mblog_menus_bullet_shield','mblog_menus_bullet_open']},negativeVisible:{type:'boolMap',ids:NEGATIVE_IDS},negativeOrder:{type:'order',ids:NEGATIVE_IDS}};
const EXTRA_BOOLEANS=[['preferFollowingPage','优先关注为默认页（实验；仅改安全引用，未验证feed_default）','/2/groups/allgroups/v2','T04'],['hideRecommendedChannels','隐藏推荐频道管理整块（保留我的频道）','/2/groups/allgroups/v2','T03'],['hideFlowNavIcons','隐藏热搜导航图标（不改变频道与排名）','/2/flowpage','H01'],['hideDetailNavIcons','隐藏详情频道装饰图标（不改变转评赞）','/2/statuses/container_detail','D03'],['hideFlowCardIcons','隐藏热搜卡片图标与箭头（不改变榜单）','/2/flowpage','H03'],['hideProfileGridIcons','隐藏我的网格图标（实验外观）','/2/profile/me','M04'],['preserveFinderMoreChannels','保留发现更多频道入口（所有删除阶段）','/2/search/finder','F03'],['hideIconShortcuts','隐藏全部启动快捷操作（不修改跳转）','/2/push/active','S04'],['fineProfile','从原始响应定制我的模块/网格','/2/profile/me','M01 M02 M03'],['fineTabs','从原始响应定制顶部导航及默认子分组','/2/groups/allgroups/v2','T01 T02'],['fineMenus','新版详情菜单使用旧26键与新增定制','/2/statuses/container_detail','D01'],['hideProfileBadges','隐藏已知网格红点/角标','/2/profile/me','M06'],['preserveFinderHeader','保留原始发现头部卡片','/2/search/finder','F02'],['hideFlowBanners','隐藏热搜多尺寸背景横幅','/2/flowpage','H02'],['hideFeedRedpacket','隐藏首页红包入口','/2/push/active','S02'],['hideNoticeMaterials','隐藏消息提醒装饰素材','/2/messageflow/notice','N01'],['hideClearTrashButton','隐藏私信清理按钮（不执行清理）','/2/direct_messages/user_list','N03'],['hidePublicReminderTab','隐藏私信提醒标签（不改未读）','/2/direct_messages/user_list','N04'],['hideFlowTools','隐藏热搜页工具菜单','/2/flowpage','H04'],['hideHotWords','隐藏整块热词数据（不修改排名）','/2/search/hot_word','H06'],['hideComposerEntry','隐藏首页发布入口','/2/push/active','S03'],['hideHotExtraButton','隐藏推荐流附加按钮','/2/statuses/container_timeline_hot','B02'],['hideHotContinueTag','隐藏推荐流连续标签','/2/statuses/container_timeline_hot','B02']];
function typedDefaults(){return Object.fromEntries(Object.entries(TYPED_SCHEMA).map(([k,v])=>[k,v.type==='order'?[]:{}]))}
function validateTyped(k,v){const s=TYPED_SCHEMA[k];if(s.type==='order'){if(!Array.isArray(v)||v.length>s.ids.length||new Set(v).size!==v.length||v.some(x=>typeof x!=='string'||!s.ids.includes(x)))throw Error('order');return}if(!plain(v)||Object.keys(v).some(x=>!s.ids.includes(x)))throw Error('map');for(const [id,value]of Object.entries(v)){if(s.type==='boolMap'){if(typeof value!=='boolean'||(value===false&&(s.required||[]).includes(id)))throw Error('visibility')}else if(typeof value!=='string'||[...value].length<1||[...value].length>24||byteLength(value)>96||/[\x00-\x1f\x7f<>]|[a-z][a-z0-9+.-]*:/i.test(value))throw Error('label')}}

const CUSTOM_DEFAULTS=Object.freeze({...Object.fromEntries(CUSTOM_FIELDS.map(x=>[x.key,x.default])),...typedDefaults()});
const DEFAULTS=Object.freeze({...LEGACY_DEFAULTS,custom:CUSTOM_DEFAULTS});
const MAX_BYTES=32768;
function byteLength(s){let n=0;for(let i=0;i<s.length;i++){let c=s.charCodeAt(i);if(c<128)n++;else if(c<2048)n+=2;else if(c>=55296&&c<=56319&&i+1<s.length&&s.charCodeAt(i+1)>=56320&&s.charCodeAt(i+1)<=57343){n+=4;i++}else n+=3}return n}

function plain(v){return v!==null&&typeof v==='object'&&!Array.isArray(v)&&Object.prototype.toString.call(v)==='[object Object]'}
function validateConfig(v,legacy=false){if(!plain(v))throw Error('object');for(const k of Object.keys(v)){if(k==='custom'&&!legacy){if(!plain(v.custom))throw Error('custom object');for(const n of Object.keys(v.custom)){if(Object.prototype.hasOwnProperty.call(TYPED_SCHEMA,n))validateTyped(n,v.custom[n]);else if(!Object.prototype.hasOwnProperty.call(CUSTOM_DEFAULTS,n)||typeof v.custom[n]!=='boolean')throw Error('custom bool');}}else if(!Object.prototype.hasOwnProperty.call(LEGACY_DEFAULTS,k)||typeof v[k]!=='boolean')throw Error('legacy bool');}return v}
function parseConfig(t,legacy=false){if(typeof t!=='string'||byteLength(t)>MAX_BYTES)throw Error('invalid size');return validateConfig(JSON.parse(t),legacy)}
function normalize(v){return {...LEGACY_DEFAULTS,...v,custom:{...CUSTOM_DEFAULTS,...v.custom}}}
function missing(v){return v===null||v===undefined||v===''}
function readConfig(){const v=$prefs.valueForKey(STORE_KEY);if(!missing(v))return normalize(parseConfig(v));const old=$prefs.valueForKey(LEGACY_STORE_KEY);return normalize(missing(old)?{}:parseConfig(old,true))}
function mergeConfig(base,patch){validateConfig(patch);const out=normalize({...base,...patch,custom:{...base.custom,...patch.custom}});if(byteLength(JSON.stringify(out))>MAX_BYTES)throw Error('merged size');return out}

/* Native cardEditor row; click opens the verified browser scheme, not a JS Bridge. */
const SETTINGS_ITEM_ID='minis_weibo_enhanced_settings_v2';
function injectSettingsEntry(result){
  if(!result||typeof result.body!=='string')return result;
  const d=JSON.parse(result.body);
  if(!d||!Array.isArray(d.items))return result;
  const grids=d.items.filter(x=>x&&x.itemId==='100505_-_top8');
  const templates=d.items.filter(x=>x&&x.itemId==='100505_-_manage');
  if(grids.length!==1||templates.length!==1)return result;
  const g=grids[0],m=templates[0],a=m.rightIcon;
  // Only known native shapes and public, query-free image paths are accepted.
  if(g.type!=='grid'||!Array.isArray(g.items)||!g.items.length||m.type!=='cardEditor'||m.category!=='mine'||!m.title||m.title.type!=='text'||!a||a.type!=='icon'||typeof a.iconUrl!=='string'||!/^https:\/\/(?:h5|d)\.sinaimg\.cn\/[A-Za-z0-9_./%+-]+$/.test(a.iconUrl))return result;
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
  g.items=g.items.filter(x=>!x||x.itemId!==SETTINGS_ITEM_ID);
  d.items=d.items.filter(x=>!x||x.itemId!==SETTINGS_ITEM_ID);
  d.items.splice(d.items.indexOf(g)+1,0,row);
  return {...result,body:JSON.stringify(d)};
}

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

/* Explicit fine mode reads original arrays; never reconstructs deleted business actions. */
function applyFineCustom(input,original,url,c){
 const x=c.custom||{};let out;try{out=JSON.parse(input.body);original=JSON.parse(original)}catch(_){return input}
 const clone=v=>JSON.parse(JSON.stringify(v)),has=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k);
 function ordered(list,ids,key){if(!Array.isArray(list))return list;const ranks=new Map((ids||[]).map((id,i)=>[id,i]));return list.map((v,i)=>({v,i})).sort((a,b)=>(ranks.has(key(a.v))?ranks.get(key(a.v)):1e6)-(ranks.has(key(b.v))?ranks.get(key(b.v)):1e6)||a.i-b.i).map(x=>x.v)}
 function visible(list,map,key){return Array.isArray(list)?list.filter(v=>!(v&&has(map,key(v))&&map[key(v)]===false)):list}
 function textSlot(item,label,grid=false){if(typeof label!=='string')return;if(grid&&item.content&&typeof item.content.content==='string')item.content.content=label;else if(item.title&&typeof item.title.content==='string')item.title.content=label;else if(item.header&&item.header.title&&typeof item.header.title.content==='string')item.header.title.content=label;}
 function mergeItems(raw,processed,known,key){const by=new Map((processed||[]).map(v=>[key(v),v]));return raw.map(v=>known.includes(key(v))&&by.has(key(v))?clone(by.get(key(v))):clone(v))}
 if(/\/2\/profile\/me(?:\?|$)/.test(url)&&c.profileMe&&Array.isArray(original.items)){
  if(x.fineProfile&&original.items.filter(v=>v&&v.itemId==='100505_-_top8').length<=1){
   let list=mergeItems(original.items,out.items,MODULE_IDS,v=>v&&v.itemId);const grid=list.find(v=>v.itemId==='100505_-_top8'),rawGrid=original.items.find(v=>v&&v.itemId==='100505_-_top8');
   if(grid&&Array.isArray(rawGrid.items)){grid.items=visible(clone(rawGrid.items),x.gridVisible,v=>v&&v.itemId);grid.items=ordered(grid.items,x.gridOrder,v=>v&&v.itemId);for(const cell of grid.items)if(GRID_IDS.includes(cell.itemId))textSlot(cell,(x.gridLabels||{})[cell.itemId],true)}
   list=visible(list,x.moduleVisible,v=>v&&v.itemId);list=ordered(list,x.moduleOrder,v=>v&&v.itemId);for(const item of list)if(MODULE_IDS.includes(item.itemId)&&item.itemId!=='profileme_mine')textSlot(item,(x.moduleLabels||{})[item.itemId]);if(list.length)out.items=list;
  }
  if(x.hideProfileBadges&&Array.isArray(out.items))for(const module of out.items)if(module&&module.itemId==='100505_-_top8'&&Array.isArray(module.items))for(const item of module.items)if(item&&GRID_IDS.includes(item.itemId)){if(item.dot&&typeof item.dot.active==='boolean')item.dot.active=false;if(item.titleDot&&typeof item.titleDot.active==='boolean')item.titleDot.active=false;delete item.bottomRightBadge;}
 }
 if(/\/2\/groups\/allgroups\/v2(?:\?|$)/.test(url)&&c.tabs&&x.fineTabs&&Array.isArray(original.pageDatas)){
  let tabs=clone(original.pageDatas).filter(v=>!(v&&v.pageDataType==='homeExtend'&&!x.retain__2_groups_allgroups_v2_355));tabs=visible(tabs,x.tabVisible,v=>v&&v.pageDataType);if(!tabs.length)tabs=clone(original.pageDatas);tabs=ordered(tabs,x.tabOrder,v=>v&&v.pageDataType);
  for(const tab of tabs){if(TAB_IDS.includes(tab.pageDataType)&&typeof (x.tabLabels||{})[tab.pageDataType]==='string'&&typeof tab.pageDataTitle==='string')tab.pageDataTitle=x.tabLabels[tab.pageDataType];if(Array.isArray(tab.categories))for(const cat of tab.categories)if(cat&&cat.title==='默认分组'&&Array.isArray(cat.pageDatas)){
   let list=visible(cat.pageDatas,x.subtabVisible,v=>v&&v.title);if(!list.length)list=cat.pageDatas;list=ordered(list,x.subtabOrder,v=>v&&v.title);for(const v of list)if(SUBTAB_IDS.includes(v.title)&&typeof (x.subtabLabels||{})[v.title]==='string')v.title=x.subtabLabels[v.title];cat.pageDatas=list;
  }}out.pageDatas=tabs;
 }
 function menuList(raw,modern=false){if(!Array.isArray(raw))return raw;let list=clone(raw).filter(v=>{if(!v)return true;if(has(x.menuVisible,v.type))return x.menuVisible[v.type];if(modern&&has(LEGACY_DEFAULTS,'menu_'+v.type))return c['menu_'+v.type];return true});list=ordered(list,x.menuOrder,v=>v&&v.type);for(const v of list)if(v&&Array.isArray(v.state_config))for(const state of v.state_config){const label=(x.menuLabels||{})[state&&state.type];if(typeof label==='string'&&typeof state.name==='string')state.name=label;}return list}
 if(/\/2\/statuses\/container_detail(?:\?|$)/.test(url)&&c.detail&&x.fineMenus&&out.detailInfo&&out.detailInfo.extend&&original.detailInfo&&original.detailInfo.extend)out.detailInfo.extend.custom_action_list=menuList(original.detailInfo.extend.custom_action_list,true);
 if(/\/2\/statuses\/extend(?:\?|$)/.test(url)&&c.extend&&(Object.keys(x.menuVisible||{}).length||(x.menuOrder||[]).length||Object.keys(x.menuLabels||{}).length))out.custom_action_list=menuList(original.custom_action_list,true);
 if(/\/2\/search\/finder(?:\?|$)/.test(url)&&c.search&&x.preserveFinderHeader&&original.header&&original.header.data&&Array.isArray(original.header.data.items)){if(!out.header)out.header={};if(!out.header.data)out.header.data={};out.header.data.items=clone(original.header.data.items)}
 if(/\/2\/flowpage(?:\?|$)/.test(url)&&c.flowpage&&x.hideFlowBanners&&out.pageHeader&&out.pageHeader.data)for(const k of ['banners','banners_fold','banners_large'])if(Array.isArray(out.pageHeader.data[k]))out.pageHeader.data[k]=[];
 if(/\/2\/push\/active(?:\?|$)/.test(url)&&c.pushActive){if(x.hideFeedRedpacket)delete out.feed_redpacket;if(Array.isArray(original.feed_common_negative)){let list=visible(clone(original.feed_common_negative),x.negativeVisible,v=>v&&v.type);out.feed_common_negative=ordered(list,x.negativeOrder,v=>v&&v.type)}}
 if(/\/2\/client\/publisher_list(?:\?|$)/.test(url)&&c.publisher&&Array.isArray(original.elements)&&Object.keys(x.publisherVisible||{}).length){const list=visible(clone(original.elements),x.publisherVisible,v=>v&&v.app_name);if(list.length)out.elements=list;}
 if(/\/2\/messageflow\/notice(?:\?|$)/.test(url)&&c.notice&&x.hideNoticeMaterials&&out.notice_settings&&Array.isArray(out.notice_settings.remind_materiels))out.notice_settings.remind_materiels=[];
 if(/\/2\/direct_messages\/user_list(?:\?|$)/.test(url)&&c.directMessages){if(x.hideClearTrashButton&&typeof out.show_clear_trash_button==='number')out.show_clear_trash_button=0;if(x.hidePublicReminderTab&&typeof out.public_messge_remind_tab==='number')out.public_messge_remind_tab=0;}
 if(/\/2\/flowpage(?:\?|$)/.test(url)&&c.flowpage&&x.hideFlowTools){if(out.pageTabBar&&out.pageTabBar.data&&typeof out.pageTabBar.data.show_menu==='number')out.pageTabBar.data.show_menu=0;if(out.pageTitle&&out.pageTitle.data&&Array.isArray(out.pageTitle.data.custom_buttons))out.pageTitle.data.custom_buttons=[];}
 if(/\/2\/search\/hot_word(?:\?|$)/.test(url)&&c.search&&x.hideHotWords&&Array.isArray(out.data))out.data=[];
 if(/\/2\/push\/active(?:\?|$)/.test(url)&&c.pushActive&&x.hideComposerEntry&&out.publisher_button_conf&&typeof out.publisher_button_conf.show_composer_enter_in_feed==='number')out.publisher_button_conf.show_composer_enter_in_feed=0;
 if(/\/2\/statuses\/(?:container_timeline_hot|unread_hot_timeline)(?:\?|$)/.test(url)&&c.hotTimeline&&Array.isArray(out.items))for(const item of out.items)if(item&&item.category==='feed'&&item.data){if(x.hideHotExtraButton)delete item.data.extra_button_info;if(x.hideHotContinueTag)delete item.data.continue_tag;}
 if(/\/2\/search\/finder(?:\?|$)/.test(url)&&c.search&&(x.preserveFinderMoreChannels||x.preserve__2_search_finder_750||x.preserve__2_search_finder_856)&&original.channelInfo&&has(original.channelInfo,'moreChannels')){if(!out.channelInfo)out.channelInfo={};out.channelInfo.moreChannels=clone(original.channelInfo.moreChannels);if(has(original.channelInfo,'channelConfig'))out.channelInfo.channelConfig=clone(original.channelInfo.channelConfig)}
 if(/\/2\/push\/active(?:\?|$)/.test(url)&&c.pushActive&&x.hideIconShortcuts&&Array.isArray(out.icon_shortcuts))out.icon_shortcuts=[];
 if(/\/2\/messageflow\/notice(?:\?|$)/.test(url)&&c.notice&&Array.isArray(out.messages)&&Object.keys(x.noticeMenuVisible||{}).length)for(const message of out.messages){const button=message&&message.msg_card&&message.msg_card.button;if(button&&Array.isArray(button.mblog_menus_new))button.mblog_menus_new=visible(button.mblog_menus_new,x.noticeMenuVisible,v=>v&&v.type)}

 if(/\/2\/groups\/allgroups\/v2(?:\?|$)/.test(url)&&c.tabs&&x.preferFollowingPage&&typeof out.defaultPageId==='string'&&Array.isArray(out.pageDatas)&&out.pageDatas.some(t=>t&&t.pageDataType==='homeFeed'&&t.pageId==='homeFeed'))out.defaultPageId='homeFeed';
 // V4 additions are post-source and target display-only fields. No arbitrary targets or content edits.
 if(/\/2\/groups\/allgroups\/v2(?:\?|$)/.test(url)&&c.tabs&&x.hideRecommendedChannels&&Array.isArray(out.pageDatas))for(const tab of out.pageDatas)if(tab&&tab.pageDataType==='homeHot'&&tab.recommendCategory&&Array.isArray(tab.recommendCategory.pageDatas))tab.recommendCategory.pageDatas=[];
 function hideNavIcons(){if(out.channelInfo&&Array.isArray(out.channelInfo.channels))for(const ch of out.channelInfo.channels)if(ch&&ch.titleInfo)for(const k of ['icon','iconDark'])delete ch.titleInfo[k];}
 if(/\/2\/flowpage(?:\?|$)/.test(url)&&c.flowpage){if(x.hideFlowNavIcons)hideNavIcons();if(x.hideFlowCardIcons&&Array.isArray(out.items))for(const group of out.items)if(group&&Array.isArray(group.items))for(const item of group.items)if(item&&item.data&&[4,6].includes(item.data.card_type)){delete item.data.icon;if(typeof item.data.display_arrow==='number')item.data.display_arrow=0;}}
 if(/\/2\/statuses\/container_detail(?:\?|$)/.test(url)&&c.detail&&x.hideDetailNavIcons)hideNavIcons();
 if(/\/2\/profile\/me(?:\?|$)/.test(url)&&c.profileMe&&x.hideProfileGridIcons&&Array.isArray(out.items))for(const m of out.items)if(m&&m.itemId==='100505_-_top8'&&Array.isArray(m.items))for(const v of m.items)if(v&&GRID_IDS.includes(v.itemId)&&v.image)delete v.image.iconUrl;
 if(/\/2\/messageflow\/notice(?:\?|$)/.test(url)&&c.notice&&Array.isArray(out.messages)&&((x.noticeMenuOrder||[]).length||Object.keys(x.noticeMenuLabels||{}).length))for(const m of out.messages){const b=m&&m.msg_card&&m.msg_card.button;if(b&&Array.isArray(b.mblog_menus_new)){b.mblog_menus_new=ordered(b.mblog_menus_new,x.noticeMenuOrder,v=>v&&v.type);for(const v of b.mblog_menus_new)if(v&&typeof v.name==='string'&&typeof (x.noticeMenuLabels||{})[v.type]==='string')v.name=x.noticeMenuLabels[v.type];}}
 return {...input,body:JSON.stringify(out)};
}

let onceDone=false;let WB_CONFIG={};function keepCustom(k){return !!(WB_CONFIG.custom&&WB_CONFIG.custom[k])}function end(v){if(!onceDone){onceDone=true;$done(v)}}
try{const c=readConfig();if(!c.enabled)return end({});if(!$request||typeof $request.url!=="string"||!$response||typeof $response.body!=="string"||!$response.body)return end({});const route=matchWeiboRoute($request.url);if(!route)return end({});const u=route.url;if(!c[route.key]&&!(route.key==='profileMe'&&c.injectSettingsEntry))return end({});
if(/\/2\/profile\/me(?:\?|$)/.test(u)){let p;try{p=JSON.parse($response.body)}catch(_){return end({})}if(!Array.isArray(p.items)||!p.items.some(x=>x&&["profileme_mine","100505_-_top8","100505_-_manage","100505_-_manage2"].includes(x.itemId))){if(c.injectSettingsEntry){try{return end(injectSettingsEntry({body:$response.body}))}catch(_){}}return end({})}if(!c.profileMe){if(c.injectSettingsEntry){try{return end(injectSettingsEntry({body:$response.body}))}catch(_){}}return end({})}}
let got=false,out={};WB_CONFIG=c;function cap(x){if(!got){got=true;out=x}}runOriginal({...$request,url:u},$response,cap);if(got)out=applyFineCustom(out,$response.body,u,c);if(got&&c.injectSettingsEntry&&/\/2\/profile\/me(?:\?|$)/.test(u)){try{out=injectSettingsEntry(out)}catch(_){}}return end(got?out:{})}catch(_){return end({})}
function runOriginal($request,$response,$done){
// rucu6

const url = $request.url;
if (!$response) $done({});
if (!$response.body) $done({});
let body = $response.body;

// 微博详情页菜单配置
const itemMenusConfig = {
  creatortypeask: false, // 转发任务
  mblog_menus_apeal: true, // 申诉
  mblog_menus_avatar_widget: false, // 用此头像挂件
  mblog_menus_bullet_shield: true, // 屏蔽弹幕
  mblog_menus_card_bg: false, // 用此卡片背景
  mblog_menus_comment_manager: true, // 评论管理
  mblog_menus_copy_url: true, // 复制链接
  mblog_menus_custom: false, // 寄微博
  mblog_menus_delete: true, // 删除
  mblog_menus_edit: true, // 编辑
  mblog_menus_edit_history: true, // 编辑记录
  mblog_menus_edit_video: true, // 编辑视频
  mblog_menus_favorite: true, // 收藏
  mblog_menus_follow: true, // 关注
  mblog_menus_home: false, // 返回首页
  mblog_menus_long_picture: true, // 生成长图
  mblog_menus_modify_visible: true, // 设置分享范围
  mblog_menus_novelty: false, // 新鲜事投稿
  mblog_menus_open_reward: false, // 赞赏
  mblog_menus_popularize: false,
  mblog_menus_promote: false, // 推广
  mblog_menus_report: true, // 投诉
  mblog_menus_shield: true, // 屏蔽
  mblog_menus_sticking: true, // 置顶
  mblog_menus_video_feedback: false, // 播放反馈
  mblog_menus_video_later: false // 可能是稍后再看
};

if (url.includes("/interface/sdk/sdkad.php")) {
  // 开屏广告
  let obj = JSON.parse(body.substring(0, body.length - 2));
  if (obj?.needlocation) {
    if(!keepCustom("preserve__interface_sdk_sdkad_php_42")){obj.needlocation = false;}
  }
  if (obj?.show_push_splash_ad) {
    if(!keepCustom("preserve__interface_sdk_sdkad_php_45")){obj.show_push_splash_ad = false;}
  }
  if (obj?.background_delay_display_time) {
    if(!keepCustom("preserve__interface_sdk_sdkad_php_48")){obj.background_delay_display_time = 31536000;} // 60 * 60 * 24 * 365 = 31536000
  }
  if (obj?.lastAdShow_delay_display_time) {
    if(!keepCustom("preserve__interface_sdk_sdkad_php_51")){obj.lastAdShow_delay_display_time = 31536000;}
  }
  if (obj?.realtime_ad_video_stall_time) {
    if(!keepCustom("preserve__interface_sdk_sdkad_php_54")){obj.realtime_ad_video_stall_time = 0;}
  }
  if (obj?.realtime_ad_timeout_duration) {
    if(!keepCustom("preserve__interface_sdk_sdkad_php_57")){obj.realtime_ad_timeout_duration = 0;}
  }
  if (obj?.ads?.length > 0) {
    for (let item of obj.ads) {
      if(!keepCustom("preserve__interface_sdk_sdkad_php_61")){item.displaytime = 0;}
      if(!keepCustom("preserve__interface_sdk_sdkad_php_62")){item.displayintervel = 31536000;}
      if(!keepCustom("preserve__interface_sdk_sdkad_php_63")){item.allowdaydisplaynum = 0;}
      if(!keepCustom("preserve__interface_sdk_sdkad_php_64")){item.begintime = "2040-01-01 00:00:00";}
      if(!keepCustom("preserve__interface_sdk_sdkad_php_65")){item.endtime = "2040-01-01 23:59:59";}
    }
  }
  $done({ body: JSON.stringify(obj) + "OK" });
} else {
  let obj = JSON.parse(body);
  if (url.includes("/2/cardlist")) {
    if (obj?.top) {
      if(!keepCustom("preserve__2_cardlist_73")){delete obj.top;} // 发现页 趋势 顶部头像
    }
    if (obj?.cards?.length > 0) {
      let newCards = [];
      for (let card of obj.cards) {
        if (card?.card_group?.length > 0) {
          let newGroup = [];
          for (let group of card.card_group) {
            let cardType = group.card_type;
            // 120,145 视频版块轮播图 192横版热门视频 电影 颜值 电视剧等
            if ((!keepCustom("retain__2_cardlist_83")&&([120, 145, 192]?.includes(cardType)))) {
              continue;
            }
            // 我的热搜 查看更多热搜
            if ((!keepCustom("retain__2_cardlist_87")&&(cardType === 6))) {
              continue;
            }
            if (group?.mblog) {
              removeAvatar(group?.mblog); // 卡片挂件,关注按钮
            }
            newGroup.push(group);
          }
          card.card_group = newGroup;
          newCards.push(card);
        } else {
          let cardType = card.card_type;
          // 17猜你想搜 58搜索偏好设置
          if ((!keepCustom("retain__2_cardlist_100")&&([17, 58]?.includes(cardType)))) {
            continue;
          }
          if (card?.mblog) {
            removeAvatar(card?.mblog); // 卡片挂件,关注按钮
          }
          newCards.push(card);
        }
      }
      obj.cards = newCards;
    }
  } else if (url.includes("/2/checkin/show")) {
    // 首页签到
    if (obj?.show) {
      if(!keepCustom("preserve__2_checkin_show_114")){obj.show = 0;}
    }
    if (obj?.show_time) {
      if(!keepCustom("preserve__2_checkin_show_117")){obj.show_time = 0;}
    }
  } else if (url.includes("/2/client/publisher_list")) {
    // 首页右上角按钮
    if (obj?.elements?.length > 0) {
      // obj.elements = obj.elements.filter((i) => ["写微博", "图片", "视频"]?.includes(i?.app_name));
    }
  }else if (url.includes("/2/push/active")) {
    if (obj?.compose_add_guide) {
      if(!keepCustom("preserve__2_push_active_126")){delete obj.compose_add_guide;} // 过期情人节红包
    }
    // delete obj.feed_redpacket; // 首页右上角红包图标
    if (obj?.floating_windows_force_show) {
      if(!keepCustom("preserve__2_push_active_130")){delete obj.floating_windows_force_show;} // 强制展示的悬浮窗
    }
    if (obj?.interceptad) {
      if(!keepCustom("preserve__2_push_active_133")){delete obj.interceptad;} // 可能是首页签到弹窗
    }
    if (obj?.interceptad_cardlist) {
      if(!keepCustom("preserve__2_push_active_136")){delete obj.interceptad_cardlist;} // 可能是首页签到弹窗
    }
    if (obj?.loginconfig) {
      if(!keepCustom("preserve__2_push_active_139")){delete obj.loginconfig;} // 登录领红包
    }
    if (obj?.profile_lotties) {
      if(!keepCustom("preserve__2_push_active_142")){delete obj.profile_lotties;} // 个人主页头像挂件素材
    }
    if (obj?.ug_red_paper) {
      if(!keepCustom("preserve__2_push_active_145")){delete obj.ug_red_paper;} // 可能是首页签到弹窗
    }
    // 禁用所有的悬浮窗
    if (obj?.disable_floating_window) {
      if(!keepCustom("preserve__2_push_active_149")){obj.disable_floating_window = "1";}
    }
    // 首页右上角红包图标
    // if (obj?.feed_redpacket) {
    //   obj.feed_redpacket.starttime = "2208960000";
    //   obj.feed_redpacket.interval = "31536000";
    //   obj.feed_redpacket.endtime = "2209046399";
    //   if (obj?.feed_redpacket?.finish_icon) {
    //     delete obj.feed_redpacket.finish_icon;
    //   }
    //   if (obj?.feed_redpacket?.guide) {
    //     delete obj.feed_redpacket.guide;
    //   }
    //   if (obj?.feed_redpacket?.icon) {
    //     delete obj.feed_redpacket.icon;
    //   }
    //   if (obj?.feed_redpacket?.pre_icon) {
    //     delete obj.feed_redpacket.pre_icon;
    //   }
    // }
    if (obj?.floating_window_for_live_streaming) {
      if(!keepCustom("preserve__2_push_active_170")){obj.floating_window_for_live_streaming = false;}
    }
    if (obj?.floating_window_show_interval) {
      if(!keepCustom("preserve__2_push_active_173")){obj.floating_window_show_interval = 31536000;}
    }
    if (obj?.floating_windows?.length > 0) {
      if(!keepCustom("preserve__2_push_active_176")){obj.floating_windows = obj.floating_windows.filter((i) => !/(?:^ad_?|red_pocket|ug_high_priority)/.test(i?.subtype));}
    }
  } else if (url.includes("/2/comments/build_comments")) {
    // 评论区
    if (obj?.datas?.length > 0) {
      let newItems = [];
      for (let item of obj.datas) {
        if (item?.data) {
          if (!isAd(item?.data)) {
            if (item?.data?.comment_bubble) {
              if(!keepCustom("preserve__2_comments_build_comments_186")){delete item.data.comment_bubble;} // 评论气泡
            }
            if (item?.data?.comment_bullet_screens_message) {
              if(!keepCustom("preserve__2_comments_build_comments_189")){delete item.data.comment_bullet_screens_message;} // 评论弹幕
            }
            if (item?.data?.hot_icon) {
              if(!keepCustom("preserve__2_comments_build_comments_192")){delete item.data.hot_icon;} // 热评小图标 弹幕 首评
            }
            if (item?.data?.vip_button) {
              if(!keepCustom("preserve__2_comments_build_comments_195")){delete item.data.vip_button;} // 会员气泡按钮
            }
            // 微博伪装评论
            if (item?.data?.user) {
              removeAvatar(item?.data); // 头像挂件,关注按钮
              if ((!keepCustom("retain__2_comments_build_comments_200")&&(/(超话社区|微博)/.test(item?.data?.user?.name)))) {
                continue;
              }
            }
            // 6为你推荐更多精彩内容 15过滤提示 41评论区氛围调查
            if ((!keepCustom("retain__2_comments_build_comments_205")&&([6, 15, 41]?.includes(item?.type)))) {
              continue;
            }
            if ((!keepCustom("retain__2_comments_build_comments_208")&&(["广告", "荐读", "评论总结", "推荐", "相关内容", "相关评论"]?.includes(item?.adType)))) {
              continue;
            }
            newItems.push(item);
          }
        }
      }
      obj.datas = newItems;
    } else if (obj?.root_comments?.length > 0) {
      let newItems = [];
      for (let item of obj.root_comments) {
        if (!isAd(item)) {
          if (item?.comment_bubble) {
            if(!keepCustom("preserve__2_comments_build_comments_221")){delete item.comment_bubble;} // 评论气泡 新版本
          }
          if (item?.data?.comment_bubble) {
            if(!keepCustom("preserve__2_comments_build_comments_224")){delete item.data.comment_bubble;} // 评论气泡
          }
          if (item?.data?.comment_bullet_screens_message) {
            if(!keepCustom("preserve__2_comments_build_comments_227")){delete item.data.comment_bullet_screens_message;} // 评论弹幕
          }
          if (item?.data?.hot_icon) {
            if(!keepCustom("preserve__2_comments_build_comments_230")){delete item.data.hot_icon;} // 热评小图标 弹幕 首评
          }
          if (item?.data?.vip_button) {
            if(!keepCustom("preserve__2_comments_build_comments_233")){delete item.data.vip_button;} // 会员气泡按钮
          }
          // 微博伪装评论
          if (item.user) {
            removeAvatar(item); // 头像挂件,关注按钮
            if ((!keepCustom("retain__2_comments_build_comments_238")&&(["超话社区", "微博视频"]?.includes(item?.user?.name)))) {
              continue;
            }
          }
          newItems.push(item);
        }
      }
      obj.root_comments = newItems;
    } else if (obj?.comments?.length > 0) {
      let newItems = [];
      for (let item of obj.comments) {
        if (item?.reply_comment?.comment_badge) {
          if(!keepCustom("preserve__2_comments_build_comments_250")){delete item.reply_comment.comment_badge;}
        }
        if (item?.user?.icons) {
          if(!keepCustom("preserve__2_comments_build_comments_253")){delete item.user.icons;}
        }
        newItems.push(item);
      }
      obj.comments = newItems;
    }
    if (obj?.rootComment) {
      if (obj?.rootComment?.comment_bubble) {
        if(!keepCustom("preserve__2_comments_build_comments_261")){delete obj.rootComment.comment_bubble;}
      }
    }
    if (obj?.status?.page_info) {
      removeVoteInfo(obj?.status); // 投票窗口
    }
  }else if (url.includes("/2/container/asyn")) {
    if (obj?.items?.length > 0) {
      let newItems = [];
      for (let item of obj.items) {
        removeAvatar(item?.data); // 关注按钮
        if ((!keepCustom("retain__2_container_asyn_272")&&(/infeed_may_interest_in/.test(item?.itemId)))) {
          // 你可能感兴趣的超话
          continue;
        }
        if ((!keepCustom("retain__2_container_asyn_276")&&(item?.itemId === null))) {
          // 横版博主卡片
          continue;
        }
        if (item?.items?.length > 0) {
          for (let i of item.items) {
            removeAvatar(i?.data); // 背景卡片
            removeVoteInfo(i?.data); // 投票窗口
          }
        }
        newItems.push(item);
      }
      obj.items = newItems;
    }
  } else if (url.includes("/2/direct_messages/user_list")) {
    if (obj?.user_list?.length > 0) {
      if(!keepCustom("preserve__2_direct_messages_user_list_292")){obj.user_list = obj.user_list.filter((i) => !["活动通知", "闪聊"]?.includes(i?.user?.name));}
    }
  } else if (url.includes("/2/flowlist")) {
    // 关注列表
    if (obj?.items?.length > 0) {
      for (let item of obj.items) {
        if (item?.items?.length > 0) {
          for (let i of item.items) {
            removeAvatar(i?.data); // 背景卡片
            removeVoteInfo(i?.data); // 投票窗口
          }
        }
      }
    }
    if (obj?.channelInfo?.channels?.length > 0) {
      let newTabs = [];
      for (let tab of obj.channelInfo.channels) {
        if ((!keepCustom("retain__2_flowlist_309")&&(/_selfrecomm/.test(tab?.flowId)))) {
          // 关注页推荐tab
          continue;
        } else if ((!keepCustom("retain__2_flowlist_312")&&(/_chaohua/.test(tab?.flowId)))) {
          // 关注页超话tab
          continue;
        } else {
          newTabs.push(tab);
        }
      }
      obj.channelInfo.channels = newTabs;
    }
  } else if (url.includes("/2/flowpage")) {
    // 热搜列表
    if (obj?.items?.length > 0) {
      let newItems = [];
      for (let item of obj.items) {
        if ((!keepCustom("retain__2_flowpage_326")&&(item?.data?.itemid === "hot-search-push-notice"))) {
          // 开启推送通知的提示
          continue;
        }
        if (item?.items?.length > 0) {
          let newII = [];
          for (let i of item.items) {
            if ((!keepCustom("retain__2_flowpage_333")&&(i?.data?.hasOwnProperty("promotion")))) {
              // 热搜列表中的推广项目
              continue;
            } else if ((!keepCustom("retain__2_flowpage_336")&&(/_img_search_stick/.test(i?.data?.pic)))) {
              // 手动置顶的微博热搜
              continue;
            } else {
              newII.push(i);
            }
          }
          item.items = newII;
        }
        newItems.push(item);
      }
      obj.items = newItems;
    }
  } else if (url.includes("/2/groups/allgroups/v2")) {
    // 顶部tab
    if (obj?.pageDatas?.length > 0) {
      // homeFeed关注 homeHot推荐
      let newTabs = [];
      for (let item of obj.pageDatas) {
        if ((!keepCustom("retain__2_groups_allgroups_v2_355")&&(item?.pageDataType === "homeExtend"))) {
          // 多余的推广tab 比如华为Mate60
          continue;
        } else {
          if (item?.categories?.length > 0) {
            let newCates = [];
            for (let i of item.categories) {
              if (i?.title === "默认分组") {
                if (i?.pageDatas?.length > 0) {
                  let newII = [];
                  for (let ii of i.pageDatas) {
                    if (["最新微博", "特别关注", "好友圈", "视频"]?.includes(ii?.title)) {
                      // 白名单列表
                      newII.push(ii);
                    } else {
                      if(keepCustom("retain__2_groups_allgroups_v2_370"))newII.push(ii);continue;
                    }
                    if (ii?.title === "最新微博") {
                      if(!keepCustom("preserve__2_groups_allgroups_v2_373")){ii.title = "微博";}
                    }
                  }
                  i.pageDatas = newII;
                }
              }
              newCates.push(i);
            }
            item.categories = newCates;
          }
          newTabs.push(item);
        }
      }
      obj.pageDatas = newTabs;
    }
  }else if (url.includes("/2/messageflow/notice")) {
    // 消息动态页
    if (obj?.messages?.length > 0) {
      let newMsgs = [];
      for (let msg of obj.messages) {
        if ((!keepCustom("retain__2_messageflow_notice_393")&&(msg?.msg_card?.ad_tag))) {
          continue;
        } else {
          newMsgs.push(msg);
        }
      }
      obj.messages = newMsgs;
    }
  } else if (url.includes("/2/page")) {
    // 搜索页列表,超话
    if (obj?.cards?.length > 0) {
      if (obj?.cards?.[0]?.card_group?.length > 0) {
        if(!keepCustom("preserve__2_page_405")){obj.cards[0].card_group = obj.cards[0].card_group.filter(
          (c) => !(c?.actionlog?.ext?.includes("ads_word") || c?.itemid?.includes("t:51") || c?.itemid?.includes("ads_word"))
        );}
      }
      if(!keepCustom("preserve__2_page_409")){obj.cards = obj.cards.filter(
        (i) =>
          !(
            i?.itemid?.includes("feed_-_invite") || // 超话里的好友
            i?.itemid?.includes("infeed_friends_recommend") || // 好友关注
            i?.itemid?.includes("infeed_may_interest_in") || // 你可能感兴趣的超话
            i?.itemid?.includes("infeed_pagemanual3") || // 手动区域3
            i?.itemid?.includes("infeed_weibo_mall") || // 微博小店
            i?.mblog?.mblogtypename?.includes("广告")
          )
      );}
    } else if (obj?.card_group?.length > 0) {
      if(!keepCustom("preserve__2_page_421")){obj.card_group = obj.card_group.filter((i) => i?.desc?.includes("你可能感兴趣的超话"));}
    }
  } else if (url.includes("/2/profile/container_timeline")) {
    if (obj?.loadedInfo?.follow_guide_info) {
      if(!keepCustom("preserve__2_profile_container_timeline_425")){delete obj.loadedInfo.follow_guide_info;} // 个人主页关注弹窗
    }
    // 个人主页信息流
    if (obj?.items?.length > 0) {
      let newItems = [];
      for (let item of obj.items) {
        if ((!keepCustom("retain__2_profile_container_timeline_431")&&(item?.data?.left_hint?.[0]?.content === "全部微博(0)" && item?.data?.card_type === 216))) {
          // 全部微博为0的博主
          break;
        } else if ((!keepCustom("retain__2_profile_container_timeline_434")&&(/内容/.test(item?.data?.name) && item?.data?.card_type === 58))) {
          // 个人微博页刷完后的推荐微博
          break;
        } else {
          if (item?.category === "card") {
            // 58微博展示时间段提示 216筛选按钮
            if ([58, 216]?.includes(item?.data?.card_type)) {
              if ((!keepCustom("retain__2_profile_container_timeline_441")&&(/没有公开博文，为你推荐以下精彩内容/.test(item?.data?.name)))) {
                // 个人微博页刷完后的推荐信息流
                continue;
              }
            }
            newItems.push(item);
          } else if (item?.category === "group") {
            // 遍历group,保留置顶微博
            if (item?.header?.data?.icon) {
              if(!keepCustom("preserve__2_profile_container_timeline_450")){delete item.header.data.icon;} // 置顶微博背景图
            }
            if ((!keepCustom("retain__2_profile_container_timeline_452")&&(item?.itemId?.includes("INTEREST_PEOPLE")))) {
              // 可能感兴趣的人
              continue;
            }
            if ((!keepCustom("retain__2_profile_container_timeline_456")&&(item?.profile_type_id === "weibo_cardpics"))) {
              // 近期热门 精选微博 那年今日等横版内容
              continue;
            }
            if (item?.items?.length > 0) {
              let newII = [];
              for (let ii of item.items) {
                if (ii?.category === "feed") {
                  removeAvatar(ii?.data); // 头像挂件,关注按钮
                  removeFeedAd(ii?.data); // 信息流推广
                  removeVoteInfo(ii?.data); // 投票窗口
                  // 评论指引
                  if (ii?.data?.enable_comment_guide) {
                    if(!keepCustom("preserve__2_profile_container_timeline_469")){ii.data.enable_comment_guide = false;}
                  }
                  newII.push(ii);
                } else if (ii?.category === "card") {
                  if ((!keepCustom("retain__2_profile_container_timeline_473")&&([10, 48, 176]?.includes(ii?.data?.card_type)))) {
                    // 最近关注与互动过的博主
                    continue;
                  }
                  if (ii?.data?.rightImage) {
                    if(!keepCustom("preserve__2_profile_container_timeline_478")){delete ii.data.rightImage;} // 新版置顶微博皇冠
                  }
                  if (ii?.data?.backgroundImage) {
                    if(!keepCustom("preserve__2_profile_container_timeline_481")){delete ii.data.backgroundImage;} // 新版置顶微博背景图
                  }
                  newII.push(ii);
                }
              }
              item.items = newII;
            }
            newItems.push(item);
          } else if (item?.category === "feed") {
            if (!isAd(item?.data)) {
              removeFeedAd(item?.data); // 信息流推广
              removeVoteInfo(item?.data); // 投票窗口
              if ((!keepCustom("retain__2_profile_container_timeline_493")&&(item?.data?.source?.includes("生日动态")))) {
                // 移除生日祝福微博
                continue;
              }
              if ((!keepCustom("retain__2_profile_container_timeline_497")&&(item?.data?.title?.text !== "热门" && item?.data?.title?.structs?.length > 0))) {
                // 移除赞过的微博 保留热门内容
                continue;
              }
              newItems.push(item);
            }
          }
        }
      }
      obj.items = newItems;
    }
  }else if (url.includes("/2/profile/dealatt") || url.includes("/2/friendships/")) {
    // 个人主页点击关注后展示菜单
    if (obj?.cards?.length > 0) {
      if(!keepCustom("preserve__2_profile_dealatt_511")){obj.cards = [];} // 相关推荐卡片
    }
    if (obj?.toolbar_menus_new?.items?.length > 0) {
      let toolbar = obj.toolbar_menus_new;
      // 底部菜单
      let newTools = [];
      for (let item of toolbar.items) {
        if ((!keepCustom("retain__2_profile_dealatt_518")&&(item?.identifier === "recommend"))) {
          // 相关推荐
          continue;
        } else if ((!keepCustom("retain__2_profile_dealatt_521")&&(/reward_/.test(item?.identifier)))) {
          // 赞赏
          continue;
        } else {
          newTools.push(item);
        }
      }
      toolbar.items = newTools;
    }
  } else if (url.includes("/2/profile/me")) {
    // 我的页面
    if (obj?.vipHeaderBgImage) {
      if(!keepCustom("preserve__2_profile_me_533")){delete obj.vipHeaderBgImage;}
    }
    if (obj?.items?.length > 0) {
      let newItems = [];
      for (let item of obj.items) {
        let itemId = item.itemId;
        if (itemId === "profileme_mine") {
          if (item?.header) {
            if (item?.header?.vipView) {
              if(!keepCustom("preserve__2_profile_me_542")){delete item.header.vipView;}
            }
            if (item?.header?.vipCenter) {
              if(!keepCustom("preserve__2_profile_me_545")){delete item.header.vipCenter;}
            }
            if (item?.header?.vipIcon) {
              if(!keepCustom("preserve__2_profile_me_548")){delete item.header.vipIcon;}
            }
          }
          if (item?.items?.length > 0) {
            for (let d of item.items) {
              if (d.itemId === "mainnums_friends") {
                let s = d.click.modules[0].scheme;
                if(!keepCustom("preserve__2_profile_me_555")){d.click.modules[0].scheme = s.replace("231093_-_selfrecomm", "231093_-_selffollowed");}
              }
            }
          }
          newItems.push(item);
        } else if (itemId === "100505_-_top8") {
          if (item?.items?.length > 0) {
            if(!keepCustom("preserve__2_profile_me_562")){item.items = item.items.filter(
              (i) =>
                // i?.itemId === "100505_-_album" || // 我的相册
                i?.itemId === "100505_-_like" || // 赞/收藏
                i?.itemId === "100505_-_watchhistory" || // 浏览记录
                i?.itemId === "100505_-_draft"|| // 草稿箱
                i?.itemId === "100505_-_pay" // 我的钱包
                // i?.itemId === "100505_-_ordercenter" || // 我的订单
                // i?.itemId === "100505_-_productcenter" || // 创作中心
                // i?.itemId === "100505_-_promote"  // 广告中心
            );}
          }
          newItems.push(item);
        } else if (itemId === "100505_-_manage") {
          if (item?.style) {
            if(!keepCustom("preserve__2_profile_me_577")){delete item.style;}
          }
          if (item?.images) {
            if(!keepCustom("preserve__2_profile_me_580")){delete item.images;} // 移除分隔符的点点点
          }
          newItems.push(item);
        } else if (itemId === "100505_-_manage2") {
          if (item?.footer) {
            if(!keepCustom("preserve__2_profile_me_585")){delete item.footer;} // 移除模板样式
          }
          if (item?.body) {
            if(!keepCustom("preserve__2_profile_me_588")){delete item.body;} // 移除框内推广
          }
          newItems.push(item);
        } else if (itemId === "100505_-_chaohua" || itemId === "100505_-_recentlyuser") {
          newItems.push(item);
        } else {
          // 移除其他推广
          if(keepCustom("retain__2_profile_me_595"))newItems.push(item);continue;
        }
      }
      obj.items = newItems;
    }
  } else if (url.includes("/2/profile/statuses/tab")) {
    if (obj?.cards?.length > 0) {
      let newCards = [];
      for (let card of obj.cards) {
        if (card?.card_group?.length > 0) {
          let newGroup = [];
          for (let group of card.card_group) {
            let cardType = group.card_type;
            // 22那年今天
            if ((!keepCustom("retain__2_profile_statuses_tab_609")&&(cardType === 22))) {
              continue;
            }
            if (group?.mblog) {
              removeAvatar(group?.mblog); // 卡片挂件,关注按钮
              removeVoteInfo(group?.mblog); // 投票窗口
            }
            newGroup.push(group);
          }
          card.card_group = newGroup;
          newCards.push(card);
        } else {
          if (card?.mblog) {
            removeAvatar(card?.mblog); // 卡片挂件,关注按钮
            removeVoteInfo(card?.mblog); // 投票窗口
          }
          newCards.push(card);
        }
      }
      obj.cards = newCards;
    }
    if (obj?.cardlistInfo?.page_type === "08") {
      if(!keepCustom("preserve__2_profile_statuses_tab_631")){delete obj.cardlistInfo;} // 我的热搜
    }
  } else if (url.includes("/2/profile/userinfo")) {
    // 个人详情页
    if (obj?.header?.data?.userInfo?.avatar_extend_info) {
      if(!keepCustom("preserve__2_profile_userinfo_636")){delete obj.header.data.userInfo.avatar_extend_info;} // 头像挂件
    }
    if (obj?.profileSkin?.data) {
      if(!keepCustom("preserve__2_profile_userinfo_639")){delete obj.profileSkin.data;} // 全套个性皮肤
    }
    if (obj?.footer?.data) {
      let toolbar = obj.footer.data.toolbar_menus_new;
      // 底部菜单项目
      if (toolbar?.lottie_guide) {
        if(!keepCustom("preserve__2_profile_userinfo_645")){delete toolbar.lottie_guide;} // 弹窗
      }
      if (toolbar?.servicePopup?.subData) {
        if(!keepCustom("preserve__2_profile_userinfo_648")){delete toolbar.servicePopup.subData;} // 服务悬浮窗口
      }
      if (toolbar?.items?.length > 0) {
        let newTools = [];
        for (let item of toolbar.items) {
          if ((!keepCustom("retain__2_profile_userinfo_653")&&(item?.identifier === "recommend"))) {
            // 相关推荐
            continue;
          } else if ((!keepCustom("retain__2_profile_userinfo_656")&&(item?.identifier === "urge"))) {
            // 催更
            continue;
          } else if ((!keepCustom("retain__2_profile_userinfo_659")&&(/reward_/.test(item?.identifier)))) {
            // 赞赏
            continue;
          } else {
            newTools.push(item);
          }
        }
        toolbar.items = newTools;
      }
    }
  }else if (url.includes("/2/search/")) {
    // 搜索页信息流
    if (url.includes("container_timeline")) {
      if (obj?.loadedInfo) {
        if(!keepCustom("preserve__2_search_container_timeline_673")){delete obj.loadedInfo;}
      }
      if (obj?.items?.length > 0) {
        let newItems = [];
        for (let item of obj.items) {
          if (item?.category === "feed") {
            if (!isAd(item?.data)) {
              removeFeedAd(item?.data); // 信息流推广
              newItems.push(item);
            }
          } else if (item?.category === "card") {
            // 19热议等tab 22商业推广 118横版广告图片 206,249横版视频广告 208实况热聊 217错过了热议 236微博趋势 261奥运滚动横幅
            if ((!keepCustom("retain__2_search_container_timeline_685")&&([19, 22, 118, 206, 208, 217, 236, 249, 261]?.includes(item?.data?.card_type)))) {
              continue;
            } else if ((!keepCustom("retain__2_search_container_timeline_687")&&(item?.data?.itemid === "ads_slide"))) {
              // 商业推广 主图 附图
              continue;
            } else if ((!keepCustom("retain__2_search_container_timeline_690")&&(item?.data?.cate_id === "1114"))) {
              // 微博趋势标题
              continue;
            } else if ((!keepCustom("retain__2_search_container_timeline_693")&&(item?.data?.hasOwnProperty("rank")))) {
              // 奥运等排行榜
              continue;
            } else {
              newItems.push(item);
            }
          } else if (item?.category === "cell") {
            // 保留信息流分割线
            newItems.push(item);
          } else if (item?.category === "group") {
            if ((!keepCustom("retain__2_search_container_timeline_703")&&(item?.item_category === "insert_item"))) {
              // 信息流内部嵌入的“微博热搜”
              continue;
            } else {
              if (item?.items?.length > 0) {
                let newII = [];
                for (let ii of item.items) {
                  // 118横版广告图片 182热议话题 217错过了热议 247横版视频广告 264微博趋势
                  if ((!keepCustom("retain__2_search_container_timeline_711")&&([118, 182, 192, 217, 247, 264]?.includes(ii?.data?.card_type)))) {
                    continue;
                  } else if ((!keepCustom("retain__2_search_container_timeline_713")&&(ii?.data?.cate_id === "1114"))) {
                    // 微博趋势
                    continue;
                  } else {
                    newII.push(ii);
                  }
                }
                item.items = newII;
              }
            }
            newItems.push(item);
          }
        }
        obj.items = newItems;
      }
    } else if (url.includes("finder")) {
      if (obj?.channelInfo?.channels?.length > 0) {
        let newChannels = [];
        for (let ch of obj.channelInfo.channels) {
          if (ch.payload) {
            // 清理不必要的内容
            if (ch.payload?.loadedInfo?.searchBarContent) {
              if(!keepCustom("preserve__2_search_finder_735")){ch.payload.loadedInfo.searchBarContent = [{}];}
            }
            if (ch.payload?.loadedInfo?.headerBack) {
              if(!keepCustom("preserve__2_search_finder_738")){ch.payload.loadedInfo.headerBack.channelStyleMap = {};}
            }
          }
          if(!keepCustom("preserve__2_search_finder_741")){delete ch.titleInfoAbsorb;}
          if(!keepCustom("preserve__2_search_finder_742")){delete ch.titleInfo;}
          if(!keepCustom("preserve__2_search_finder_743")){delete ch.title;}
          newChannels.push(ch);
        }
        obj.channelInfo.channels = newChannels;

        // 删除其他频道入口
        if (obj.channelInfo?.moreChannels) {
          if(!keepCustom("preserve__2_search_finder_750")){delete obj.channelInfo.moreChannels;}
          if(!keepCustom("preserve__2_search_finder_751")){delete obj.channelInfo.channelConfig;}
        }
        if (obj?.header?.data?.items) {
          let items = [];
          for (let item of obj.header.data.items) {
            if (item.category === "group") {
              if(!keepCustom("preserve__2_search_finder_757")){item.items = item.items
                .filter(e => {
                  let type = e.data?.card_type;
                  return type === 101 || type === 17;
                })
                .map(e => {
                  if (e.data?.card_type === 17) {
                    e.data.col = 1; // 强制单列
                  }
                  return e;
                });}
              if (item.items.length > 0) {
                items.push(item);
              }
            }
          }
          obj.header.data.items = items;
        }

        // let newChannels = [];
        // for (let channel of obj.channelInfo.channels) {
        //   // 顶部标签栏 白名单
        //   if (["band_channel", "discover_channel", "trends_channel"]?.includes(channel?.key)) {
        //     let payload = channel.payload;
        //     if (payload) {
        //       if (payload?.loadedInfo) {
        //         // 去除搜索框填充词
        //         if (payload?.loadedInfo?.searchBarContent?.length > 0) {
        //           payload.loadedInfo.searchBarContent = [];
        //         }
        //         if (payload?.loadedInfo?.headerBack?.channelStyleMap) {
        //           delete payload.loadedInfo.headerBack.channelStyleMap; // 去除搜索背景图片
        //         }
        //         if (payload?.loadedInfo?.searchBarStyleInfo) {
        //           delete payload.loadedInfo.searchBarStyleInfo; // 搜索框样式
        //         }
        //       }
        //       if (payload?.items?.length > 0) {
        //         let newItems = [];
        //         for (let item of payload.items) {
        //           if (item?.category === "feed") {
        //             if (!isAd(item?.data)) {
        //               removeFeedAd(item.data); // 信息流推广
        //               newItems.push(item);
        //             }
        //           } else if (item?.category === "card") {
        //             // 19热议等tab 22商业推广 118横版广告图片 206,249横版视频广告 208实况热聊 217错过了热议 236微博趋势 261奥运滚动横幅
        //             if ([19, 22, 118, 206, 208, 217, 236, 249, 261]?.includes(item?.data?.card_type)) {
        //               continue;
        //             } else if (item?.data?.itemid === "ads_slide") {
        //               // 商业推广 主图 附图
        //               continue;
        //             } else if (item?.data?.cate_id === "1114") {
        //               // 微博趋势标题
        //               continue;
        //             } else if (item?.data?.hasOwnProperty("rank")) {
        //               // 奥运等排行榜
        //               continue;
        //             } else {
        //               newItems.push(item);
        //             }
        //           } else if (item?.category === "cell") {
        //             // 保留信息流分割线
        //             newItems.push(item);
        //           } else if (item?.category === "group") {
        //             if (item?.items?.length > 0) {
        //               let newII = [];
        //               for (let ii of item.items) {
        //                 // 118横版广告图片 182热议话题 192横版好看视频 217错过了热议 247横版视频广告 264微博趋势
        //                 if ([118, 182, 192, 217, 247, 264]?.includes(ii?.data?.card_type)) {
        //                   continue;
        //                 } else if (ii?.data?.cate_id === "1114") {
        //                   // 微博趋势
        //                   continue;
        //                 } else {
        //                   newII.push(ii);
        //                 }
        //               }
        //               item.items = newII;
        //             }
        //             newItems.push(item);
        //           }
        //         }
        //         payload.items = newItems;
        //       }
        //     }
        //     newChannels.push(channel);
        //   } else {
        //     continue;
        //   }
        // }
        // obj.channelInfo.channels = newChannels;
      }
      


      
      if (obj?.channelInfo?.moreChannels) {
        // 更多版块
        if(!keepCustom("preserve__2_search_finder_856")){delete obj.channelInfo.moreChannels;}
      }
      if (obj?.header?.data?.items?.length > 0) {
        // 2025-01-24更新 新版本finder_window
        let newItems = [];
        for (let item of obj.header.data.items) {
          if (item?.category === "card") {
            if ((!keepCustom("retain__2_search_finder_863")&&([19, 22, 118, 206, 208, 217, 236, 249, 261]?.includes(item?.data?.card_type)))) {
              continue;
            }
            if ((!keepCustom("retain__2_search_finder_866")&&(item?.data?.hasOwnProperty("rank")))) {
              // 各种赛事排行榜
              continue;
            }
          } else if (item?.category === "group") {
            if (item?.items?.length > 0) {
              let newII = [];
              for (let i of item.items) {
                if ((!keepCustom("retain__2_search_finder_874")&&([118, 182, 192, 217, 247, 264]?.includes(i?.data?.card_type)))) {
                  continue;
                } else {
                  newII.push(i);
                }
              }
              item.items = newII;
            }
          }
          newItems.push(item);
        }
        obj.header.data.items = newItems;
      }
    }
  } else if (url.includes("/2/searchall")) {
    if (obj?.header?.data) {
      // 商品推广头部淘宝跳转
      const items = ["bg_img", "background_scheme", "background_url"];
      for (let i of items) {
        if(!(i==="bg_img"&&keepCustom("preserve__2_searchall_893_bg_img")||i==="background_scheme"&&keepCustom("preserve__2_searchall_893_background_scheme")||i==="background_url"&&keepCustom("preserve__2_searchall_893_background_url"))){delete obj.header.data[i];}
      }
    }
    if (obj?.loadedInfo?.serviceMap?.layer) {
      if(!keepCustom("preserve__2_searchall_897")){delete obj.loadedInfo.serviceMap.layer;} // 搜索结果 悬浮窗
    }
    if (obj?.footer) {
      // 讨论区动效
      if (obj?.footer?.data?.bg_lottie) {
        if(!keepCustom("preserve__2_searchall_902")){delete obj.footer.data.bg_lottie;}
      }
      if (obj?.footer?.data?.bg_lottie_dark) {
        if(!keepCustom("preserve__2_searchall_905")){delete obj.footer.data.bg_lottie_dark;}
      }
      if (obj?.footer?.data?.discuss_avatars) {
        if(!keepCustom("preserve__2_searchall_908")){delete obj.footer.data.discuss_avatars;} // 进入讨论区气泡动画头像
      }
      if (obj?.footer?.data?.menus?.length > 0) {
        // 底部菜单
        if(!keepCustom("preserve__2_searchall_912")){obj.footer.data.menus = obj.footer.data.menus.filter((i) => !/\d+_ai\./.test(i?.pic));}
      }
    }
    if (obj?.cards?.length > 0) {
      let newCards = [];
      for (let card of obj.cards) {
        if (card?.card_group?.length > 0) {
          let newGroup = [];
          for (let group of card.card_group) {
            if ((!keepCustom("retain__2_searchall_921")&&(group?.card_type === 22))) {
              // 先筛选card_group里面的card_type
              // 横版广告图
              continue;
            } else if ((!keepCustom("retain__2_searchall_925")&&(group?.card_type === 42 && group?.title_extra_text === "广告"))) {
              // 推荐品牌广告
              continue;
            } else if ((!keepCustom("retain__2_searchall_928")&&(group?.card_type === 3 && group?.pics?.length > 0))) {
              // 推荐品牌广告图
              continue;
            } else {
              if (group?.mblog) {
                // 有mblog字段的过滤广告
                if (!isAd(group?.mblog)) {
                  if (group?.mblog?.title_source) {
                    if(!keepCustom("preserve__2_searchall_936")){delete group.mblog.title_source;}
                  }
                  if (group?.mblog?.source_tag_struct) {
                    if(!keepCustom("preserve__2_searchall_939")){delete group.mblog.source_tag_struct;}
                  }
                  if (group?.mblog?.extend_info) {
                    if(!keepCustom("preserve__2_searchall_942")){delete group.mblog.extend_info;}
                  }
                  if (group?.mblog?.common_struct) {
                    if(!keepCustom("preserve__2_searchall_945")){delete group.mblog.common_struct;} // 商品橱窗
                  }
                  removeAvatar(group?.mblog); // 头像挂件,关注按钮
                  removeVoteInfo(group?.mblog); // 投票窗口
                  // 新版热推
                  if ((!keepCustom("retain__2_searchall_950")&&(group?.mblog?.is_ad === 1))) {
                    continue;
                  }
                  newGroup.push(group);
                }
              } else {
                newGroup.push(group); // 没有mblog字段的全部推送
              }
            }
          }
          card.card_group = newGroup;
          newCards.push(card);
        } else {
          if (card?.mblog) {
            if (!isAd(card?.mblog)) {
              removeAvatar(card?.mblog); // 头像挂件,关注按钮
              if (card?.mblog?.title_source) {
                if(!keepCustom("preserve__2_searchall_967")){delete card.mblog.title_source;}
              }
              if (card?.mblog?.source_tag_struct) {
                if(!keepCustom("preserve__2_searchall_970")){delete card.mblog.source_tag_struct;}
              }
              if (card?.mblog?.extend_info) {
                if(!keepCustom("preserve__2_searchall_973")){delete card.mblog.extend_info;}
              }
              if (card?.mblog?.common_struct) {
                if(!keepCustom("preserve__2_searchall_976")){delete card.mblog.common_struct;} // 商品橱窗
              }
              removeVoteInfo(card?.mblog); // 投票窗口
              // 隐藏在 cards 里面的投票窗口
              if (card?.mblog?.page_info?.cards?.length > 0) {
                let page = card.mblog.page_info;
                for (let i of page.cards) {
                  if (i?.media_info?.vote_info) {
                    if(!keepCustom("preserve__2_searchall_984")){delete i.media_info.vote_info;}
                  }
                }
              }
              newCards.push(card);
            }
          }
        }
      }
      obj.cards = newCards;
    }// 13.11.1版本obj下的cards变为items 2023-11-26
    if (obj?.items?.length > 0) {
      let newItems = [];
      for (let item of obj.items) {
        if (!isAd(item?.data)) {
          if (item?.category === "feed") {
            removeFeedAd(item?.data); // 信息流推广
            removeVoteInfo(item?.data); // 投票窗口
            newItems.push(item);
          } else if (item?.category === "group") {
            if (item?.items?.length > 0) {
              let newII = [];
              for (let ii of item.items) {
                if ((!keepCustom("retain__2_searchall_1007")&&(ii?.cate_id === "638" && ii?.readtimetype === "card"))) {
                  // 都在问
                  continue;
                } else {
                  if (!isAd(ii?.data)) {
                    removeAvatar(ii?.data);
                    removeFeedAd(ii?.data); // 商品橱窗
                    // 3推广卡片 17相关搜索 22广告图 25智搜总结 30推荐博主 42,236智搜问答 89商品推广视频 101都在问 206推广视频
                    if ((!keepCustom("retain__2_searchall_1015")&&([3, 17, 22, 30, 42, 89, 101, 206]?.includes(ii?.data?.card_type)))) {
                      continue;
                    } else if ((!keepCustom("retain__2_searchall_1017")&&(ii?.data?.card_type === 4 && ii?.data?.cate_id === "640"))) {
                      // 都在问
                      continue;
                    } else if ((!keepCustom("retain__2_searchall_1020")&&(ii?.data?.card_type === 42 && ii?.data?.is_ads === true))) {
                      // 商品推广desc
                      continue;
                    }
                    newII.push(ii);
                  }
                }
              }
              item.items = newII;
            }
            newItems.push(item);
          } else {
            newItems.push(item);
          }
        }
      }
      obj.items = newItems;
    }
  } else if (url.includes("/2/shproxy/chaohua/discovery/searchactive")) {
    // 超话搜索页
    if (obj?.items?.length > 0) {
      // 1007 可能感兴趣的话题
      if(!keepCustom("preserve__2_shproxy_chaohua_discovery_searchactive_1042")){obj.items = obj.items.filter((i) => i?.data?.card_type !== 1007);}
    }
  } else if (url.includes("/2/statuses/container_detail?")) {
    // 新版 微博详情页
    if (obj?.pageHeader?.data?.items?.length > 0) {
      let newItems = [];
      for (let item of obj.pageHeader.data.items) {
        if ((!keepCustom("retain__2_statuses_container_detail__1049")&&(item?.data?.card_type === 236 && item?.category === "wboxcard"))) {
          // 底部横版广告
          continue;
        } else {
          newItems.push(item);
        }
      }
      obj.pageHeader.data.items = newItems;
    }
    if (obj?.detailInfo?.status?.reward_info) {
      // 赞赏信息
      if(!keepCustom("preserve__2_statuses_container_detail__1060")){delete obj.detailInfo.status.reward_info;}
    }
  } else if (url.includes("/2/statuses/container_detail_comment")) {
    // 新版 微博评论区
    if (obj?.items?.length > 0) {
      let newItems = [];
      for (let item of obj.items) {
        if (item?.data) {
          if (!isAd(item?.data)) {
            if (item?.data?.comment_bubble) {
              if(!keepCustom("preserve__2_statuses_container_detail_comment_1070")){delete item.data.comment_bubble;} // 评论气泡
            }
            if (item?.data?.comment_bullet_screens_message) {
              if(!keepCustom("preserve__2_statuses_container_detail_comment_1073")){delete item.data.comment_bullet_screens_message;} // 评论弹幕
            }
            if (item?.data?.hot_icon) {
              if(!keepCustom("preserve__2_statuses_container_detail_comment_1076")){delete item.data.hot_icon;} // 热评小图标 弹幕 首评
            }
            if (item?.data?.vip_button) {
              if(!keepCustom("preserve__2_statuses_container_detail_comment_1079")){delete item.data.vip_button;} // 会员气泡按钮
            }
            // 微博伪装评论
            if (item?.data?.user) {
              removeAvatar(item?.data); // 头像挂件,关注按钮
              if ((!keepCustom("retain__2_statuses_container_detail_comment_1084")&&(/(超话社区|微博)/.test(item?.data?.user?.name)))) {
                continue;
              }
            }
            if ((!keepCustom("retain__2_statuses_container_detail_comment_1088")&&(["广告", "荐读", "评论总结", "推荐", "相关内容", "相关评论"]?.includes(item?.data?.adType)))) {
              continue;
            }
            newItems.push(item);
          }
        }
      }
      obj.items = newItems;
    }
  } else if (url.includes("/2/statuses/container_timeline_hot") || url.includes("/2/statuses/unread_hot_timeline")) {
    // 首页推荐tab信息流
    for (let s of ["ad", "advertises", "trends", "headers"]) {
      if (obj?.[s]) {
        if(!(s==="ad"&&keepCustom("preserve__2_statuses_container_timeline_hot_1101_ad")||s==="advertises"&&keepCustom("preserve__2_statuses_container_timeline_hot_1101_advertises")||s==="trends"&&keepCustom("preserve__2_statuses_container_timeline_hot_1101_trends")||s==="headers"&&keepCustom("preserve__2_statuses_container_timeline_hot_1101_headers"))){delete obj[s];}
      }
    }
    if (obj?.items?.length > 0) {
      let newItems = [];
      for (let item of obj.items) {
        if (!isAd(item?.data)) {
          if (item?.category === "feed") {
            removeFeedAd(item?.data); // 信息流推广
            removeVoteInfo(item?.data); // 投票窗口
            newItems.push(item);
          } else {
            // 移除其他推广
            if(keepCustom("retain__2_statuses_container_timeline_hot_1114"))newItems.push(item);continue;
          }
        }
      }
      obj.items = newItems;
    }
    if (obj?.statuses?.length > 0) {
      let newStatuses = [];
      for (let item of obj.statuses) {
        if (!isAd(item)) {
          removeFeedAd(item); // 信息流推广
          newStatuses.push(item);
        }
      }
      obj.statuses = newStatuses;
    }
  } else if (url.includes("/2/statuses/container_timeline?") || url.includes("/2/statuses/container_timeline_unread")) {
    if (obj?.loadedInfo?.headers) {
      if(!keepCustom("preserve__2_statuses_container_timeline__1132")){delete obj.loadedInfo.headers;} // 首页关注tab信息流
    }
    if (obj?.common_struct) {
      if(!keepCustom("preserve__2_statuses_container_timeline__1135")){delete obj.common_struct;} // 商品橱窗
    }
    if (obj?.items?.length > 0) {
      let newItems = [];
      for (let item of obj.items) {
        if (!isAd(item?.data) && !isAd(item?.status)) {
          if (item?.category === "dynamic") {
            if (item?.status?.action_button_icon_dic) {
              if(!keepCustom("preserve__2_statuses_container_timeline__1143")){delete item.status.action_button_icon_dic;}
            }
            removeFeedAd(item?.status); // 信息流推广
            removeVoteInfo(item?.status); // 投票窗口
            if ((!keepCustom("retain__2_statuses_container_timeline__1147")&&(item.status?.title?.structs))) {
              // 移除 未关注人消息 (你关注的博主，他自己关注的别的博主的微博消息)
              continue;
            }
            // 快转内容
            if (item?.status?.screen_name_suffix_new?.length > 0) {
              if ((!keepCustom("retain__2_statuses_container_timeline__1153")&&(item?.status?.screen_name_suffix_new?.[3]?.content === "快转了"))) {
                continue;
              }
            }
            // 美妆精选季
            if ((!keepCustom("retain__2_statuses_container_timeline__1158")&&(item?.status?.title?.text?.includes("精选")))) {
              continue;
            }
            // 未关注博主
            if ((!keepCustom("retain__2_statuses_container_timeline__1162")&&(item?.status?.user?.following === false))) {
              continue;
            }
            // 关闭关注推荐
            if (item?.status?.user?.unfollowing_recom_switch === 1) {
              if(!keepCustom("preserve__2_statuses_container_timeline__1167")){item.status.user.unfollowing_recom_switch = 0;}
            }
            // 博主top100
            if (item?.status?.tag_struct?.length > 0) {
              if(!keepCustom("preserve__2_statuses_container_timeline__1171")){item.status.tag_struct = [];}
            }
            newItems.push(item);
          } else if (item?.category === "feed") {
            if (item?.data?.action_button_icon_dic) {
              if(!keepCustom("preserve__2_statuses_container_timeline__1176")){delete item.data.action_button_icon_dic;}
            }
            removeFeedAd(item?.data); // 信息流推广
            removeVoteInfo(item?.data); // 投票窗口
            if ((!keepCustom("retain__2_statuses_container_timeline__1180")&&(item.data?.title?.structs))) {
              // 移除 未关注人消息 (你关注的博主，他自己关注的别的博主的微博消息)
              continue;
            }
            // 快转内容
            if (item?.data?.screen_name_suffix_new?.length > 0) {
              if ((!keepCustom("retain__2_statuses_container_timeline__1186")&&(item?.data?.screen_name_suffix_new?.[3]?.content === "快转了"))) {
                continue;
              }
            }
            // 美妆精选季
            if ((!keepCustom("retain__2_statuses_container_timeline__1191")&&(item?.data?.title?.text?.includes("精选")))) {
              continue;
            }
            // 未关注博主
            if ((!keepCustom("retain__2_statuses_container_timeline__1195")&&(item?.data?.user?.following === false))) {
              continue;
            }
            // 关闭关注推荐
            if (item?.data?.user?.unfollowing_recom_switch === 1) {
              if(!keepCustom("preserve__2_statuses_container_timeline__1200")){item.data.user.unfollowing_recom_switch = 0;}
            }
            // 博主top100
            if (item?.data?.tag_struct?.length > 0) {
              if(!keepCustom("preserve__2_statuses_container_timeline__1204")){item.data.tag_struct = [];}
            }
            newItems.push(item);
          } else if (item?.category === "feedBiz") {
            newItems.push(item); // 管理特别关注按钮
          } else {
            // 移除其他推广
            if(keepCustom("retain__2_statuses_container_timeline__1211"))newItems.push(item);continue;
          }
        }
      }
      obj.items = newItems;
    }
  }else if (url.includes("/2/statuses/container_timeline_topic")) {
    // 超话信息流
    if (obj?.header?.data?.follow_guide_info) {
      if(!keepCustom("preserve__2_statuses_container_timeline_topic_1220")){delete obj.header.data.follow_guide_info;} // 底部弹出的关注按钮
    }
    if (obj?.items?.length > 0) {
      let newItems = [];
      for (let item of obj.items) {
        if (item?.category === "feed") {
          removeAvatar(item?.data); // 头像挂件,关注按钮
          if (!isAd(item?.data)) {
            if (item?.data?.title?.text?.includes("新人导师")) {
              // 萌新辅导 互动赢新人导师
              if(!keepCustom("preserve__2_statuses_container_timeline_topic_1230")){delete item.data.title;}
            }
            newItems.push(item);
          }
        } else if (item?.category === "card") {
          if ((!keepCustom("retain__2_statuses_container_timeline_topic_1235")&&([4, 197, 1012]?.includes(item?.data?.card_type)))) {
            // 4你可能感兴趣的超话 197你可能感兴趣的超话 1012热门超话
            continue;
          } else {
            if (item?.data?.card_type === 31 && item?.data?.hotwords?.length > 0) {
              // 31 搜索框滚动热词
              if(!keepCustom("preserve__2_statuses_container_timeline_topic_1241")){item.data.hotwords = [];}
            }
            if ((!keepCustom("retain__2_statuses_container_timeline_topic_1243")&&(item?.data?.card_type === 22 && item?.data?.hasOwnProperty("card_ad_style")))) {
              continue;
            }
            newItems.push(item);
          }
        } else if (item?.category === "group") {
          if (item?.style?.topHover) {
            if(!keepCustom("preserve__2_statuses_container_timeline_topic_1250")){delete item.style.topHover;} // 空降发帖背景图
          }
          if (item?.items?.length > 0) {
            if (item?.itemId === null) {
              // 超话页顶部乱七八糟
              let newII = [];
              for (let ii of item.items) {
                if (ii?.data?.hasOwnProperty("itemid")) {
                  if (ii?.data?.itemid?.includes("mine_topics")) {
                    // 保留我的超话
                    newII.push(ii);
                  } else if (ii?.data?.itemid?.includes("tab_search_input")) {
                    // 保留搜索框
                    if (ii?.data?.hotwords) {
                      if(!keepCustom("preserve__2_statuses_container_timeline_topic_1264")){ii.data.hotwords = [{ word: "搜索超话" }];} // 删除热搜词
                    }
                    newII.push(ii);
                  } else if (ii?.data?.itemid?.includes("poiRankList")) {
                    newII.push(ii); // 保留地点超话 地标人气榜
                  }
                } else {
                  newII.push(ii); // 放行无itemid字段的内容
                }
                removeAvatar(ii?.data); // 头像挂件,关注按钮
              }
              item.items = newII;
            } else {
              let newII = [];
              for (let ii of item.items) {
                if (ii?.data) {
                  if (ii?.data?.common_struct) {
                    if(!keepCustom("preserve__2_statuses_container_timeline_topic_1281")){delete ii.data.common_struct;}
                  }
                  removeAvatar(ii?.data);
                  if ((!keepCustom("retain__2_statuses_container_timeline_topic_1284")&&([1008, 1024]?.includes(ii?.data?.card_type)))) {
                    // 1008关注你感兴趣的超话 1024超话顶部发现
                    continue;
                  } else {
                    newII.push(ii);
                  }
                }
              }
              item.items = newII;
            }
          }
          if ((!keepCustom("retain__2_statuses_container_timeline_topic_1295")&&(item?.header?.arrayText?.contents?.length > 0))) {
            // 你的好友也关注了
            continue;
          }
          newItems.push(item);
        } else {
          // 移除其他推广
          continue;
        }
      }
      obj.items = newItems;
    }
  } else if (url.includes("/2/statuses/extend")) {
    // 微博详情页
    if (obj?.trend?.extra_struct?.extBtnInfo?.btn_picurl?.includes("ad")) {
      if(!keepCustom("preserve__2_statuses_extend_1310")){delete obj.trend;}
    }
    if (obj.trend?.titles) {
      let title = obj.trend.titles.title;
      if (/(博主好物种草|相关推荐|专区)/.test(title)) {
        if(!keepCustom("preserve__2_statuses_extend_1315")){delete obj.trend;}
      }
    }
    const item = [
      "bubble_guide_data", // 评论区弹窗
      "button_extra_info", // 推荐评论
      "display_info", // 二楼
      "extend_info", // 拓展卡片
      "floating_button", // 悬浮购物车按钮
      "follow_data", // 关注提醒
      "head_cards", // 超话投票
      "highlight", // 二楼
      "interaction_extra_info", // ai评论
      "page_alerts", // 超话新帖 新用户通知
      "reward_info", // 公益赞赏
      "source_tag_struct", // 二楼
      "top_cards" // 都在搜
    ];
    if (obj) {
      item.forEach((i) => {
        if(!(i==="bubble_guide_data"&&keepCustom("preserve__2_statuses_extend_1335_bubble_guide_data")||i==="button_extra_info"&&keepCustom("preserve__2_statuses_extend_1335_button_extra_info")||i==="display_info"&&keepCustom("preserve__2_statuses_extend_1335_display_info")||i==="extend_info"&&keepCustom("preserve__2_statuses_extend_1335_extend_info")||i==="floating_button"&&keepCustom("preserve__2_statuses_extend_1335_floating_button")||i==="follow_data"&&keepCustom("preserve__2_statuses_extend_1335_follow_data")||i==="head_cards"&&keepCustom("preserve__2_statuses_extend_1335_head_cards")||i==="highlight"&&keepCustom("preserve__2_statuses_extend_1335_highlight")||i==="interaction_extra_info"&&keepCustom("preserve__2_statuses_extend_1335_interaction_extra_info")||i==="page_alerts"&&keepCustom("preserve__2_statuses_extend_1335_page_alerts")||i==="reward_info"&&keepCustom("preserve__2_statuses_extend_1335_reward_info")||i==="source_tag_struct"&&keepCustom("preserve__2_statuses_extend_1335_source_tag_struct")||i==="top_cards"&&keepCustom("preserve__2_statuses_extend_1335_top_cards"))){delete obj[i];}
      });
    }
    if (obj?.custom_action_list?.length > 0) {
      let newActions = [];
      for (let item of obj.custom_action_list) {
        let type = item.type;
        let add = WB_CONFIG["menu_"+type];
        if (type === "mblog_menus_copy_url" && WB_CONFIG["menu_"+type]) {
          newActions.unshift(item);
        } else if (add) {
          newActions.push(item);
        }
      }
      obj.custom_action_list = newActions;
    }
    if (obj?.has_common_struct) {
      if(!keepCustom("preserve__2_statuses_extend_1352")){obj.has_common_struct = false;} // 商品橱窗
    }
    if (obj?.enable_comment_guide) {
      if(!keepCustom("preserve__2_statuses_extend_1355")){obj.enable_comment_guide = false;} // 评论指引
    }
  } else if (url.includes("/2/statuses/repost_timeline")) {
    // 评论详情页 转发区
    if (obj?.hot_reposts?.length > 0) {
      // 样式1
      let newReposts = [];
      for (let item of obj.hot_reposts) {
        if (!isAd(item)) {
          newReposts.push(item);
        }
      }
      obj.hot_reposts = newReposts;
    }
    if (obj?.reposts?.length > 0) {
      // 样式2
      let newReposts = [];
      for (let item of obj.reposts) {
        if (!isAd(item)) {
          newReposts.push(item);
        }
      }
      obj.reposts = newReposts;
    }
  }else if (url.includes("/2/statuses/show")) {
    removeFeedAd(obj); // 信息流推广
    // 循环引用中的商品橱窗
    if (obj?.text) {
      removeFeedAd(obj.text); // 信息流推广
    }
    if (obj?.reward_info) {
      if(!keepCustom("preserve__2_statuses_show_1386")){delete obj.reward_info;} // 赞赏信息
    }
    // 投票窗口
    removeVoteInfo(obj);
  } else if (url.includes("/2/video/full_screen_stream")) {
    // 视频页
    if (obj?.statuses?.length > 0) {
      let newStatuses = [];
      for (let item of obj.statuses) {
        if (!isAd(item)) {
          removeAvatar(item);
          if (item?.video_info?.tags?.length > 0) {
            // 投票
            if(!keepCustom("preserve__2_video_full_screen_stream_1399")){item.video_info.tags = [];}
          }
          newStatuses.push(item);
        }
      }
      obj.statuses = newStatuses;
    }
  } else if (url.includes("/2/video/tiny_stream_mid_detail")) {
    if (obj?.status?.video_info?.shopping?.length > 0) {
      // 带货
      if(!keepCustom("preserve__2_video_tiny_stream_mid_detail_1409")){obj.status.video_info.shopping = [];}
    }
    if (obj?.status?.video_info?.bottom_banner) {
      // 都在搜
      if(!keepCustom("preserve__2_video_tiny_stream_mid_detail_1413")){obj.status.video_info.bottom_banner = {};}
    }
    if (obj?.status?.video_info?.float_info) {
      // 悬浮窗
      if(!keepCustom("preserve__2_video_tiny_stream_mid_detail_1417")){obj.status.video_info.float_info = {};}
    }
  } else if (url.includes("/2/video/tiny_stream_video_list")) {
    if (obj?.statuses?.length > 0) {
      if(!keepCustom("preserve__2_video_tiny_stream_video_list_1421")){obj.statuses = [];} // 移除视频自动连播
      // obj.statuses = obj.statuses.filter((m) => !(m?.mblogtypename === "广告"));
    }
    if (obj?.tab_list?.length > 0) {
      if(!keepCustom("preserve__2_video_tiny_stream_video_list_1425")){obj.tab_list = [];}
    }
  } else if (url.includes("/2/!/huati/discovery_home_bottom_channels")) {
    if (obj?.button_configs) {
      if(!keepCustom("preserve__2_huati_discovery_home_bottom_channels_1429")){delete obj.button_configs;} // 超话左上角,右上角图标
    }
    // 广场页
    if (obj?.channelInfo?.channel_list?.length > 0) {
      if(!keepCustom("preserve__2_huati_discovery_home_bottom_channels_1433")){obj.channelInfo.channel_list = obj.channelInfo.channel_list.filter((t) => t?.title !== "广场");}
    }
  } else if (url.includes("/aj/appicon/list")) {
    if (obj?.data?.list?.length > 0) {
      for (let item of obj.data.list) {
        if (item?.cardType) {
          if(!keepCustom("preserve__aj_appicon_list_1439")){item.cardType = 2;}
        }
      }
    }
  } else if (url.includes("/v1/ad/preload") || url.includes("/v2/ad/preload")) {
    // 开屏广告
    if (obj?.ads?.length > 0) {
      for (let item of obj.ads) {
        if(!keepCustom("preserve__v1_ad_preload_1447")){item.start_time = 3818332800;} // Unix 时间戳 2090-12-31 00:00:00
        if(!keepCustom("preserve__v1_ad_preload_1448")){item.end_time = 3818419199;} // Unix 时间戳 2090-12-31 23:59:59
        if(!keepCustom("preserve__v1_ad_preload_1449")){item.daily_display_cnt = 50;} // total_display_cnt: 50
        if(!keepCustom("preserve__v1_ad_preload_1450")){item.display_duration = 0;}
      }
      if (obj?.ads?.creatives?.length > 0) {
        for (let item of obj.ads.creatives) {
          if(!keepCustom("preserve__v1_ad_preload_1454")){item.start_time = 3818332800;} // Unix 时间戳 2090-12-31 00:00:00
          if(!keepCustom("preserve__v1_ad_preload_1455")){item.end_time = 3818419199;} // Unix 时间戳 2090-12-31 23:59:59
          if(!keepCustom("preserve__v1_ad_preload_1456")){item.daily_display_cnt = 50;} // total_display_cnt: 50
          if(!keepCustom("preserve__v1_ad_preload_1457")){item.display_duration = 0;}
        }
      }
    }
  } else if (url.includes("/wbapplua/wbpullad.lua") || url.includes("/preload/get_ad")) {
    // 开屏广告
    if (obj?.cached_ad?.ads?.length > 0) {
      for (let item of obj.cached_ad.ads) {
        if(!keepCustom("preserve__wbapplua_wbpullad_lua_1465")){item.show_count = 50;}
        if(!keepCustom("preserve__wbapplua_wbpullad_lua_1466")){item.duration = 0;} // 60 * 60 * 24 * 365 = 31536000
        if(!keepCustom("preserve__wbapplua_wbpullad_lua_1467")){item.start_date = 3818332800;} // Unix 时间戳 2090-12-31 00:00:00
        if(!keepCustom("preserve__wbapplua_wbpullad_lua_1468")){item.end_date = 3818419199;} // Unix 时间戳 2090-12-31 23:59:59
      }
    }
  }
  $done({ body: JSON.stringify(obj) });
}

// 判断信息流
function isAd(data) {
if(keepCustom("retain_classified_ads"))return false;

  if (data?.mblogtypename === "广告") {
    return true;
  }
  if (data?.mblogtypename === "热推") {
    return true;
  }
  if (data?.readtimetype === "adMblog") {
    return true;
  }
  if (data?.promotion?.recommend === "广告") {
    return true;
  }
  if (data?.promotion?.recommend === "热推") {
    return true;
  }
  if (data?.promotion?.type?.includes("ad")) {
    return true;
  }
  if (data?.content_auth_info?.content_auth_title === "广告") {
    return true;
  }
  if (data?.content_auth_info?.content_auth_title === "热推") {
    return true;
  }
  if (data?.ads_material_info?.is_ads === true) {
    return true;
  }
  return false;
}

// 移除头像挂件,关注按钮
function removeAvatar(data) {
 if(!WB_CONFIG.avatarCleanup)return;
  if (data?.block_card_bg) {
    if(!keepCustom("preserve_removeAvatar_1510")){delete data.block_card_bg;}
  }
  if (data?.buttons) {
    if(!keepCustom("preserve_removeAvatar_1513")){delete data.buttons;}
  }
  if (data?.cardid) {
    if(!keepCustom("preserve_removeAvatar_1516")){delete data.cardid;}
  }
  if (data?.icons) {
    if(!keepCustom("preserve_removeAvatar_1519")){delete data.icons;}
  }
  if (data?.mblog_buttons) {
    if(!keepCustom("preserve_removeAvatar_1522")){delete data.mblog_buttons;} // 转发按钮图标
  }
  if (data?.pic_bg_new) {
    if(!keepCustom("preserve_removeAvatar_1525")){delete data.pic_bg_new;}
  }
  if (data?.user?.avatargj_id) {
    if(!keepCustom("preserve_removeAvatar_1528")){delete data.user.avatargj_id;}
  }
  if (data?.user?.avatar_extend_info) {
    if(!keepCustom("preserve_removeAvatar_1531")){delete data.user.avatar_extend_info;}
  }
  if (data?.user?.cardid) {
    if(!keepCustom("preserve_removeAvatar_1534")){delete data.user.cardid;}
  }
  if (data?.user?.icons) {
    if(!keepCustom("preserve_removeAvatar_1537")){delete data.user.icons;}
  }
  if (data?.user?.mbtype) {
    if(!keepCustom("preserve_removeAvatar_1540")){delete data.user.mbtype;} // 会员等级图标
  }
}

// 移除信息流关注按钮,推广,热评
function removeFeedAd(item) {
 if(!WB_CONFIG.feedCleanup)return;
  removeAvatar(item); // 头像挂件,关注按钮
  if (item?.retweeted_status) {
    removeAvatar(item?.retweeted_status);
  }
  if (item?.common_struct) {
    if(!keepCustom("preserve_removeFeedAd_1551")){delete item.common_struct;} // 商品橱窗
  }
  if (item?.comment_summary) {
    if(!keepCustom("preserve_removeFeedAd_1554")){delete item.comment_summary;} // 移除信息流中的热评
  }
  if (item?.semantic_brand_params) {
    if(!keepCustom("preserve_removeFeedAd_1557")){delete item.semantic_brand_params;} // 商品橱窗
  }
}

// 移除投票窗口
function removeVoteInfo(item) {
 if(!WB_CONFIG.voteCleanup)return;
  if (item?.page_info?.media_info?.vote_info) {
    if(!keepCustom("preserve_removeVoteInfo_1564")){delete item.page_info.media_info.vote_info;}
  }
}
}
})();
