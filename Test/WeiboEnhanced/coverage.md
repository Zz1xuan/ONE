# 47 HAR candidates: implementation coverage

All evidence is HAR response shape or source-only, NOT native-device validation. No HAR body/query/account fixtures stored.

| ID | Candidate | State | Actual control / boundary |
|---|---|---|---|
| M01 | 我的：顶层模块 | implemented | fineProfile + moduleVisible/moduleOrder; protected mine/manage; unknown retained |
| M02 | 我的：网格入口 | implemented | fineProfile + gridVisible/gridOrder; raw unique top8 |
| M03 | 我的：入口文字 | partial | moduleLabels title.content and gridLabels content.content; username/header user text excluded |
| M04 | 我的：入口图标 | deferred | arbitrary icon URLs not allowed |
| M05 | 我的：入口跳转 | partial | source fixed friends rewrite can be independently preserved; no target editor |
| M06 | 我的：红点 | implemented | hideProfileBadges fixed grid dot/titleDot/bottomRightBadge |
| M07 | 我的：会员装饰 | implemented | per-field source preserve toggles VIP header/vipView/vipCenter/vipIcon |
| M08 | 我的：布局样式 | partial | manage style may be preserved; no arbitrary layout values |
| M09 | 我的：管理行装饰 | implemented | independent preserve manage style/images |
| T01 | 首页：顶部导航 | implemented | fineTabs + tabVisible/tabOrder/tabLabels fixed homeHot/homeFeed; empty fallback |
| T02 | 首页：关注子分组 | partial | fineTabs + fixed source-title subtab maps/order/labels, unknown user groups retained; stable subtype IDs not confirmed |
| T03 | 首页：推荐频道管理 | deferred | myCategory/recommendCategory untouched; user channel IDs not accepted |
| T04 | 首页：默认落地页 | deferred | default page ID not modified |
| F01 | 发现：频道导航 | partial | source title/titleInfo/search background per-field preserve only; no channel editor |
| F02 | 发现：头部卡片 | implemented | preserveFinderHeader restores original header items before destructive source stages |
| F03 | 发现：更多频道入口 | implemented | preserveFinderMoreChannels restores original moreChannels + channelConfig after both source deletion stages; either old preserve alias also restores both |
| H01 | 热搜：导航频道 | deferred | no heat-search navigation editor |
| H02 | 热搜：背景横幅 | implemented | hideFlowBanners atomic three-size arrays |
| H03 | 热搜：卡片装饰/入口 | partial | source promotion/stick filtering toggles; icon/arrow editing absent |
| H04 | 热搜：页级工具菜单 | implemented | hideFlowTools sets only show_menu=0 and custom_buttons=[]; schemes retained |
| H05 | 热搜：搜索建议 | deferred | suggestions untouched and static reject may intercept |
| H06 | 热搜：热词数据 | implemented | hideHotWords clears whole data block; never edits rank/content |
| N01 | 消息：提醒素材展示 | implemented | hideNoticeMaterials empties only decoration array |
| N02 | 消息：消息卡反馈菜单 | partial | noticeMenuVisible controls three observed parent types in messages.msg_card.button.mblog_menus_new; duplicate types grouped; unknown/actions/states retained; no label/icon/order editor |
| N03 | 私信：清理按钮显示 | implemented | hideClearTrashButton only sets display number0; no cleanup request |
| N04 | 私信：提醒 tab 展示 | partial | hidePublicReminderTab sets numeric display flag0; semantics need native verification, unread untouched |
| D01 | 详情：新版操作菜单 | implemented | fineMenus nested list; old26 bool + audio/remark visibility and whitelist order; unknown retained |
| D02 | 详情：状态化菜单文字图标 | partial | 8 confirmed state type names individually editable; other states/icons/schemes untouched |
| D03 | 详情：转评赞频道 | deferred | not implemented; source-only related fields do not establish this candidate |
| D04 | 详情：头部卡片 | partial | source card236 predicate preservation only; observed248/143/10 intentionally untouched |
| D05 | 详情：赞赏展示 | partial | source reward_info preservation implemented; exact HAR path missing so source-only |
| C01 | 评论：会员气泡 | implemented | preserve__2_statuses_container_detail_comment_1079; per-field vip_button |
| C02 | 评论：头像装饰 | implemented | removeAvatar user.icons has independent preserve switch; identity data never overwritten |
| C03 | 评论：气泡/弹幕/热评标记 | partial | three independent source preservation fields; bullet screen field not observed in HAR |
| B01 | 首页：关注流展示字段 | partial | buttons/user.icons independent preservation; feedback menu editor absent |
| B02 | 首页：推荐流展示字段 | partial | hideHotExtraButton and hideHotContinueTag implemented; feedback menu editor absent |
| S01 | 启动：悬浮窗 | partial | source each floating field/filter independent; no per-scene interval numeric editor |
| S02 | 启动：首页红包入口 | implemented | hideFeedRedpacket no action execution |
| S03 | 启动：发布入口显示 | implemented | hideComposerEntry sets show_composer_enter_in_feed display flag0; other shortcuts untouched |
| S04 | 启动：快捷操作 | partial | hideIconShortcuts hides whole icon_shortcuts array; no stable per-item ID observed, no title guessing or jump edits |
| S05 | 启动：全局反馈菜单 | implemented | negativeVisible/negativeOrder 25 observed parent types; state_config untouched |
| S06 | 发布器：入口项目 | partial | publisherVisible standard name groups only; duplicate variants grouped; writing entry protected; no order/label/icon/target |
| S07 | 视频：频道导航 | deferred | video home channels untouched; source videoList independent fields only |
| S08 | 启动：开屏预加载展示 | partial | independent outer ads timing/count/duration source writes; creatives original bug unchanged; static reject remains |
| S09 | 启动：缓存广告展示 | partial | independent cached-ad duration/count/time source writes; close-rectangle untouched; static reject remains |
| H07 | 热搜：推广标记与置顶装饰 | implemented | promotion and manual sticky-row predicates have separate retain bools |
| B03 | 首页：赞赏与关注辅助展示 | partial | buttons/icons preservation and quick-repost filter independent; no arbitrary name edits |
