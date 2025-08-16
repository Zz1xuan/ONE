const mainConfig = {
    isDebug: false, // 是否开启调试模式，true会打印日志
    author: "ddgksf2013",
    removeHomeVip: true, // 移除个人主页的VIP模块
    removeHomeCreatorTask: true, // 移除个人主页的创作中心/任务模块
    removeRelate: true, // 移除视频/博文下的“相关推荐”
    removeGood: true, // 移除视频/博文下的“博主好物种草”
    removeFollow: true, // 移除视频/博文下的“关注”模块
    modifyMenus: true, // 是否修改帖子菜单
    removeRelateItem: false,
    removeRecommendItem: true, // 移除推荐的帖子
    removeRewardItem: true, // 移除打赏模块
    removeLiveMedia: true, // 移除首页直播入口
    removeNextVideo: false,
    removePinedTrending: true, // 移除热搜榜单中的推广内容
    removeInterestFriendInTopic: false, // 移除超话中的“超话里的好友”
    removeInterestTopic: false, // 移除“可能感兴趣的超话”
    removeInterestUser: true, // 移除“可能感兴趣的人”
    removeLvZhou: true, // 移除“绿洲”相关内容
    removeSearchWindow: true, // 移除搜索框中的推广内容和窗口
    profileSkin1: null, // 个人主页自定义皮肤1
    profileSkin2: null, // 个人主页自定义皮肤2
    tabIconVersion: 0,
    tabIconPath: ""
};

const itemMenusConfig = {
    creator_task: false, // 帖子菜单：创作中心任务
    mblog_menus_custom: false, // 帖子菜单：自定义
    mblog_menus_video_later: true, // 帖子菜单：稍后观看
    mblog_menus_comment_manager: true, // 帖子菜单：评论管理
    mblog_menus_avatar_widget: false, // 帖子菜单：头像挂件
    mblog_menus_card_bg: false, // 帖子菜单：卡片背景
    mblog_menus_long_picture: true, // 帖子菜单：长微博
    mblog_menus_delete: true, // 帖子菜单：删除
    mblog_menus_edit: true, // 帖子菜单：编辑
    mblog_menus_edit_history: true, // 帖子菜单：编辑记录
    mblog_menus_edit_video: true, // 帖子菜单：编辑视频
    mblog_menus_sticking: true, // 帖子菜单：置顶
    mblog_menus_open_reward: true, // 帖子菜单：开启打赏
    mblog_menus_novelty: false, // 帖子菜单：新奇特
    mblog_menus_favorite: true, // 帖子菜单：收藏
    mblog_menus_promote: true, // 帖子菜单：推广
    mblog_menus_modify_visible: true, // 帖子菜单：修改可见范围
    mblog_menus_copy_url: true, // 帖子菜单：复制链接
    mblog_menus_follow: true, // 帖子菜单：关注
    mblog_menus_video_feedback: true, // 帖子菜单：视频反馈
    mblog_menus_shield: true, // 帖子菜单：屏蔽
    mblog_menus_report: true, // 帖子菜单：举报
    mblog_menus_apeal: true, // 帖子菜单：申诉
    mblog_menus_home: true, // 帖子菜单：首页
};

// 根据URL映射到不同的处理函数
const modifyCardsUrls = ["/cardlist", "video/community_tab", "searchall"];
const modifyStatusesUrls = ["statuses/friends/timeline", "statuses_unread_hot_timeline", "statuses/unread_friends_timeline", "statuses/unread_hot_timeline", "groups/timeline", "statuses/friends_timeline"];
const otherUrls = {
    "/profile/me": "removeHome",
    "/statuses/extend": "itemExtendHandler",
    "/video/remind_info": "removeVideoRemind",
    "/checkin/show": "removeCheckin",
    "/live/media_homelist": "removeMediaHomelist",
    "/comments/build_comments": "removeComments",
    "/container/get_item": "containerHandler",
    "/profile/container_timeline": "userHandler",
    "/video/tiny_stream_video_list": "nextVideoHandler",
    "/2/statuses/video_mixtimeline": "nextVideoHandler",
    "video/tiny_stream_mid_detail": "nextVideoHandler",
    "/!/client/light_skin": "tabSkinHandler",
    "/littleskin/preview": "skinPreviewHandler",
    "/search/finder": "removeSearchMain",
    "/search/container_timeline": "removeSearch",
    "/search/container_discover": "removeSearch",
    "/2/flowpage": "removeMsgAd",
    "/2/page?": "removePage",
    "/statuses/unread_topic_timeline": "topicHandler",
    "/square&pageDataType/": "squareHandler",
    "/statuses/container_timeline_topic": "removeMain",
    "/statuses/container_timeline": "removeMainTab",
    "ad/realtime": "removeRealtimeAd", // 实时广告
    "ad/preload": "removeAdPreload", // 预加载广告
    "php?a=open_app": "removeAdBanner", // 开屏广告
    "a=trends": "removeTopics", // 热门话题
    "user_center": "modifiedUserCenter", // 用户中心
    "a=get_coopen_ads": "removeIntlOpenAds", // 国际版开屏广告
    "php?a=search_topic": "removeSearchTopic", // 搜索话题
};

function getModifyMethod(url) {
    // 检查是否为卡片列表URL
    for (const item of modifyCardsUrls) {
        if (url.includes(item)) return "removeCards";
    }
    // 检查是否为时间线URL
    for (const item of modifyStatusesUrls) {
        if (url.includes(item)) return "removeTimeLine";
    }
    // 检查是否为其他特殊URL
    for (var [key, value] of Object.entries(otherUrls)) {
        if (url.includes(key)) return value;
    }
    return null;
}

function removeRealtimeAd(e) {
    return delete e.ads, e.code = 4016, e
}

function removeAdPreload(e) {
    if (e.ads) {
        e.last_ad_show_interval = 86400;
        for (var t of e.ads) t.start_time = 2681574400, t.end_time = 2681660799, t.display_duration = 0, t.daily_display_cnt = 0, t.total_display_cnt = 0
    }
    return e
}

function isAd(item) {
    if (!item) return false;
    // 根据多个字段判断是否为广告
    return (
        item.mblogtypename === "广告" ||
        item.mblogtypename === "热推" ||
        item.promotion?.type === "ad" ||
        item.page_info?.actionlog?.source?.includes("ad") ||
        item.content_auth_info?.content_auth_title === "广告"
    );
}

function squareHandler(e) {
    return e.items, e
}

function removeMainTab(e) {
    if (e.loadedInfo && e.loadedInfo.headers && delete e.loadedInfo.headers, e.items) {
        var t, a = [];
        for (t of e.items) isAd(t.data) || (t.data?.page_info?.video_limit && delete t.data.page_info.video_limit, t.data?.common_struct && delete t.data.common_struct, t.category && "group" == t.category && -1 == JSON.stringify(t.items).indexOf("profile_top")) || a.push(t);
        e.items = a, log("removeMainTab success")
    }
    return e
}

function removeMain(e) {
    if (e.loadedInfo && e.loadedInfo.headers && delete e.loadedInfo.headers, e.items) {
        var t, a = [];
        for (t of e.items) "feed" == t.category ? isAd(t.data) || a.push(t) : "group" == t.category ? 0 < t.items.length && t.items[0].data?.itemid?.includes("search_input") ? (t.items = t.items.filter(e => e?.data?.itemid?.includes("mine_topics") || e?.data?.itemid?.includes("search_input") || 202 == e?.data?.card_type), t.items[0].data.hotwords = [{
            word: "搜索超话",
            tip: ""
        }], a.push(t)) : 0 < t.items.length && t.items[0].data?.itemid?.includes("top_title") || (0 < t.items.length && (t.items = Object.values(t.items).filter(e => "feed" === e.category || "card" === e.category)), a.push(t)) : t.data?.card_type && -1 < [202, 200].indexOf(t.data.card_type) || a.push(t);
        e.items = a, log("removeMain success")
    }
    return e
}

function topicHandler(e) {
    var t = e.cards;
    if (t && (mainConfig.removeUnfollowTopic || mainConfig.removeUnusedPart)) {
        var a, o = [];
        for (a of t) {
            let e = !0;
            if (a.mblog) {
                var i = a.mblog.buttons;
                mainConfig.removeUnfollowTopic && i && "follow" == i[0].type && (e = !1)
            } else {
                if (!mainConfig.removeUnusedPart) continue;
                if ("bottom_mix_activity" == a.itemid) e = !1;
                else if ("正在活跃" == a?.top?.title) e = !1;
                else if (200 == a.card_type && a.group) e = !1;
                else {
                    i = a.card_group;
                    if (!i) continue;
                    var r = i[0];
                    if (-1 < ["guess_like_title", "cats_top_title", "chaohua_home_readpost_samecity_title"].indexOf(r.itemid)) e = !1;
                    else if (1 < i.length) {
                        var n, d = [];
                        for (n of i) - 1 == ["chaohua_discovery_banner_1", "bottom_mix_activity"].indexOf(n.itemid) && d.push(n);
                        a.card_group = d
                    }
                }
            }
            e && o.push(a)
        }
        e.cards = o, log("topicHandler success")
    }
    return e
}

function removeSearchMain(e) {
    var t = e.channelInfo.channels;
    if (t) {
        var a, o = [];
        for (a of t) a.payload && (a.payload?.items && (a.payload.items = []), a.payload?.loadedInfo?.searchBarContent && (a.payload.loadedInfo.searchBarContent = [{}]), a.payload?.loadedInfo?.headerBack && (a.payload.loadedInfo.headerBack.channelStyleMap = {}), delete a.titleInfoAbsorb, delete a.titleInfo, delete a.title, o.push(a));
        e.channelInfo.channels = o, e.header?.data && removeHeader(e.header.data), e.channelInfo?.moreChannels && (delete e.channelInfo.moreChannels, delete e.channelInfo.channelConfig), log("remove_search main success")
    }
    return e
}

function removeHeader(e) {
    if (e.items) {
        var t, a = [];
        for (t of e.items) "group" == t.category && (t.items = t.items.filter(e => void 0 === e.data?.card_type || 101 === e.data?.card_type || 17 === e.data?.card_type).map(e => (17 === e.data?.card_type && (e.data.col = 1), e)), 0 < t.items.length) && a.push(t);
        log("remove Header success"), e.items = a
    }
    return e
}

function checkSearchWindow(e) {
    return !!mainConfig.removeSearchWindow && "card" == e.category && ("finder_window" == e.data?.itemid || "discover_gallery" == e.data?.itemid || "more_frame" == e.data?.itemid || 208 == e.data?.card_type || 236 == e.data?.card_type || 247 == e.data?.card_type || 217 == e.data?.card_type || 101 == e.data?.card_type || 19 == e.data?.card_type || e.data?.mblog?.page_info?.actionlog?.source?.includes("ad") || e.data?.pic?.includes("ads"))
}

function removeSearch(e) {
    if (e.items) {
        var t, a = [];
        for (t of e.items) "feed" == t.category ? isAd(t.data) || (t.data?.page_info?.video_limit && delete t.data.page_info.video_limit, a.push(t)) : "group" == t.category ? "guess" === t.header?.type && "search" != t.itemExt?.filterType || (t.items = t.items.filter(e => (void 0 === e.data?.card_type || 17 === e.data?.card_type || 10 === e.data?.card_type) && "广告" !== e.data?.content_auth_info?.content_auth_title).map(e => (17 === e.data?.card_type && (e.data.col = 1), e)), 0 < t.items.length && a.push(t)) : checkSearchWindow(t) || a.push(t);
        e.items = a, e.loadedInfo && (e.loadedInfo.searchBarContent = [], e.loadedInfo.headerBack) && (e.loadedInfo.headerBack.channelStyleMap = {}), log("remove_search success")
    }
    return e
}

function removeMsgAd(e) {
    if (e.items) {
        var t, a = [];
        for (t of e.items) "hotword" == t.itemId ? (t.items = t.items.filter(e => e?.data?.pic?.includes("com/wb_search")), a.push(t)) : "text" == t.type && t?.text?.content?.includes("实时热点") && a.push(t);
        e.items = a, e.channelInfo && delete e.channelInfo, log("remove_search success")
    }
    return e
}

function removePage(e) {
    return removeCards(e), mainConfig.removePinedTrending && e.cards && 0 < e.cards.length && e.cards[0].card_group && (e.cards[0].card_group = e.cards[0].card_group.filter(e => !(e?.actionlog?.ext?.includes("ads_word") || e?.itemid?.includes("t:51") || e?.itemid?.includes("ads_word")))), e
}

function removeCards(e) {
    if (e.hotwords && (e.hotwords = []), e.cards) {
        var t, a = [];
        for (t of e.cards) {
            "232082type=1" != e.cardlistInfo?.containerid || 17 != t.card_type && 58 != t.card_type && 11 != t.card_type || (o = t.card_type + 1, t = {
                card_type: o
            });
            var o = t.card_group;
            if (o && 0 < o.length) {
                var i = [];
                for (const n of o) 118 == n.card_type || isAd(n.mblog) || -1 == JSON.stringify(n).indexOf("res_from:ads") && i.push(n);
                t.card_group = i, a.push(t)
            } else {
                var r = t.card_type; - 1 < [9, 165].indexOf(r) ? isAd(t.mblog) || a.push(t) : -1 < [1007, 180].indexOf(r) || a.push(t)
            }
        }
        e.cards = a
    }
    e.items && (log("data.items"), removeSearch(e))
}

function lvZhouHandler(e) {
    if (mainConfig.removeLvZhou && e) {
        var t = e.common_struct;
        if (t) {
            var a = [];
            for (const o of t) "绿洲" != o.name && a.push(o);
            e.common_struct = a
        }
    }
}

function isBlock(e) {
    var t = mainConfig.blockIds || [];
    if (0 !== t.length) {
        var a = e.user.id;
        for (const o of t)
            if (o == a) return !0
    }
    return !1
}

function removeTimeLine(e) {
    for (const a of ["ad", "advertises", "trends", "headers"]) e[a] && delete e[a];
    if (e.statuses) {
        var t = [];
        for (const o of e.statuses) isAd(o) || (lvZhouHandler(o), o.common_struct && delete o.common_struct, o.category && "group" == o.category) || t.push(o);
        e.statuses = t
    }
}

function removeHomeVip(e) {
    return e.header && e.header.vipView && (e.header.vipView = null), e
}

function removeVideoRemind(e) {
    e.bubble_dismiss_time = 0, e.exist_remind = !1, e.image_dismiss_time = 0, e.image = "", e.tag_image_english = "", e.tag_image_english_dark = "", e.tag_image_normal = "", e.tag_image_normal_dark = ""
}

function itemExtendHandler(e) {
    var t;
    (mainConfig.removeRelate || mainConfig.removeGood) && e.trend && e.trend.titles && (t = e.trend.titles.title, mainConfig.removeRelate && "相关推荐" === t || mainConfig.removeGood && "博主好物种草" === t) && delete e.trend, mainConfig.removeFollow && e.follow_data && (e.follow_data = null), mainConfig.removeRewardItem && e.reward_info && (e.reward_info = null), e.head_cards && delete e.head_cards, e.page_alerts && (e.page_alerts = null);
    try {
        -1 < e.trend.extra_struct.extBtnInfo.btn_picurl.indexOf("timeline_icon_ad_delete") && delete e.trend
    } catch (e) {}
    if (mainConfig.modifyMenus && e.custom_action_list) {
        var a = [];
        for (const r of e.custom_action_list) {
            var o = r.type,
                i = itemMenusConfig[o];
            void 0 === i ? a.push(r) : "mblog_menus_copy_url" === o ? a.unshift(r) : i && a.push(r)
        }
        e.custom_action_list = a
    }
}

function updateFollowOrder(e) {
    try {
        for (var t of e.items) {
            var a;
            if ("mainnums_friends" === t.itemId) return a = t.click.modules[0].scheme, t.click.modules[0].scheme = a.replace("231093_-_selfrecomm", "231093_-_selffollowed"), void log("updateFollowOrder success")
        }
    } catch (e) {
        console.log("updateFollowOrder fail")
    }
}

function updateProfileSkin(t, e) {
    try {
        var a = mainConfig[e];
        if (a) {
            let e = 0;
            for (var o of t.items)
                if (o.image) try {
                    "alpha" != (dm = o.image.style.darkMode) && (o.image.style.darkMode = "alpha"), o.image.iconUrl = a[e++], o.dot && (o.dot = [])
                } catch (e) {}
            log("updateProfileSkin success")
        }
    } catch (e) {
        console.log("updateProfileSkin fail")
    }
}

function removeHome(e) {
    if (e.items) {
        var t, a = [];
        for (t of e.items) {
            var o = t.itemId;
            "profileme_mine" == o ? ((t = mainConfig.removeHomeVip ? removeHomeVip(t) : t).header?.vipIcon && delete t.header.vipIcon, updateFollowOrder(t), a.push(t)) : "100505_-_top8" == o ? (updateProfileSkin(t, "profileSkin1"), a.push(t)) : "100505_-_newcreator" == o ? "grid" == t.type ? (updateProfileSkin(t, "profileSkin2"), a.push(t)) : mainConfig.removeHomeCreatorTask || a.push(t) : "100505_-_chaohua" != o && "100505_-_manage" != o && "100505_-_recentlyuser" != o || (0 < t.images?.length && (t.images = t.images.filter(e => "100505_-_chaohua" == e.itemId || "100505_-_recentlyuser" == e.itemId)), a.push(t))
        }
        e.items = a
    }
    return e
}

function removeCheckin(e) {
    log("remove tab1签到"), e.show = 0
}

function removeMediaHomelist(e) {
    mainConfig.removeLiveMedia && (log("remove 首页直播"), e.data = {})
}

function removeComments(e) {
    var t = ["广告", "廣告", "相关内容", "推荐", "热推", "推薦"],
        a = e.datas || [];
    if (0 !== a.length) {
        var o = [];
        for (const r of a) {
            var i = r.adType || ""; - 1 == t.indexOf(i) && 6 != r.type && o.push(r)
        }
        log("remove 评论区相关和推荐内容"), e.datas = o, e.tip_msg && delete e.tip_msg
    }
}

function containerHandler(e) {
    mainConfig.removeInterestFriendInTopic && "超话里的好友" === e.card_type_name && (log("remove 超话里的好友"), e.card_group = []), mainConfig.removeInterestTopic && e.itemid && (-1 < e.itemid.indexOf("infeed_may_interest_in") ? (log("remove 感兴趣的超话"), e.card_group = []) : -1 < e.itemid.indexOf("infeed_friends_recommend") && (log("remove 超话好友关注"), e.card_group = []))
}

function userHandler(e) {
    if (e = removeMainTab(e), mainConfig.removeInterestUser && e.items) {
        var t, a = [];
        for (t of e.items) {
            let e = !0;
            if ("group" == t.category) try {
                "可能感兴趣的人" == t.items[0].data.desc && (e = !1)
            } catch (e) {}
            e && (t.data?.common_struct && delete t.data.common_struct, a.push(t))
        }
        e.items = a, log("removeMain sub success")
    }
    return e
}

function nextVideoHandler(e) {
    if (e.statuses) {
        var t, a = [];
        for (t of e.statuses)
            if (!isAd(t)) {
                for (const o of ["forward_redpacket_info", "shopping", "float_info", "tags"]) t.video_info?.[o] && delete t.video_info[o];
                a.push(t)
            } e.statuses = a, log("removeMainTab Success")
    }
    return e
}

function tabSkinHandler(e) {
    try {
        var t, a = mainConfig.tabIconVersion;
        if (e.data.canUse = 1, a && mainConfig.tabIconPath && !(a < 100)) {
            for (t of e.data.list) t.version = a, t.downloadlink = mainConfig.tabIconPath;
            log("tabSkinHandler success")
        }
    } catch (e) {
        log("tabSkinHandler fail")
    }
}

function skinPreviewHandler(e) {
    e.data.skin_info.status = 1
}

function removeLuaScreenAds(e) {
    if (e.cached_ad)
        for (var t of e.cached_ad.ads) t.start_date = 1893254400, t.show_count = 0, t.duration = 0, t.end_date = 1893340799;
    return e
}
function log(e) {
    mainConfig.isDebug && console.log(e)
}
var body = $response.body,
    url = $request.url;
let method = getModifyMethod(url);
if (method) {
    log(method);
    var func = eval(method);
    let data = JSON.parse(body.match(/\{.*\}/)[0]);
    new func(data), body = JSON.stringify(data), "removePhpScreenAds" == method && (body = JSON.stringify(data) + "OK")
}
$done({
    body: body
});