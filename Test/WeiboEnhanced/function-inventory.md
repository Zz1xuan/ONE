# wb.js 功能清单（V2）

**基线**：`source/wb.original.js` 随目录提供的原文件副本，构建器只做 5 个字面锚点替换；未改下载原件。接口匹配沿用原脚本 `url.includes(...)`，不是新增严格主机校验。默认设置对应原逻辑默认菜单布尔值。

## 设置键概览

键空间 `minis.weibo.enhanced.config.v2`，与 V1 明确隔离，不迁移旧值。全部 67 个键均为必填可选布尔配置（缺失键取默认值）：总控 1、设置入口 1、共享清理辅助 3、接口分组 36、菜单项 26。路由开关关闭会在解析/调用原脚本前放行；共享辅助关闭只保留其对应字段；菜单关闭只删除那一个菜单操作。未知键、非布尔值和损坏配置让包装脚本放行。

| 配置键 | 匹配路径/范围 | 默认 | 关闭后的含义 |
|---|---|---:|---|
| enabled | 全部请求 | true | 所有请求放行 |
| injectSettingsEntry | 合格的 `/2/profile/me` 主页面网格 | false | 不注入实验网页格；与 `profileMe` 独立 |
| avatarCleanup | 原脚本所有 `removeAvatar` 调用点 | true | 保留头像扩展/挂件、用户 icons/mbtype、按钮/cardid 等整组字段 |
| feedCleanup | 原脚本 `removeFeedAd` 调用点 | true | 保留商品橱窗/关注按钮等辅助字段；不影响外层 item 筛选 |
| voteCleanup | `removeVoteInfo` 调用点 | true | 保留常规 page_info.media_info.vote_info；其它直接写入的特殊投票字段仍由所在接口分组控制 |
| sdkAd | `/interface/sdk/sdkad.php` | true | 放行 SDK 开屏广告 JSON+OK 响应 |
| cardlist | `/2/cardlist` | true | 放行发现卡片列表处理 |
| checkin | `/2/checkin/show` | true | 放行签到提示字段处理 |
| publisher | `/2/client/publisher_list` | true | 放行发布器列表分支（原分支当前实际无改写） |
| pushActive | `/2/push/active` | true | 放行活动/悬浮窗字段分支 |
| comments | `/2/comments/build_comments` | true | 放行旧版评论列表、评论标记及投票辅助处理 |
| container | `/2/container/asyn` | true | 放行容器卡片处理 |
| directMessages | `/2/direct_messages/user_list` | true | 放行私信用户列表过滤 |
| flowlist | `/2/flowlist` | true | 放行关注流、tab 过滤和辅助清理 |
| flowpage | `/2/flowpage` | true | 放行热搜流筛选 |
| tabs | `/2/groups/allgroups/v2` | true | 放行顶部 tab/默认分组处理 |
| notice | `/2/messageflow/notice` | true | 放行消息动态广告卡筛选 |
| page | `/2/page` | true | 放行搜索页/超话卡片筛选 |
| profileTimeline | `/2/profile/container_timeline` | true | 放行个人主页微博时间线处理 |
| profileActions | `/2/profile/dealatt`、`/2/friendships/` | true | 放行关注操作菜单处理 |
| profileMe | `/2/profile/me` 主页面结构 | true | 不精简我的页；若入口开关开着，可仍只注入入口 |
| profileStatuses | `/2/profile/statuses/tab` | true | 放行个人页微博/热搜卡片处理 |
| userinfo | `/2/profile/userinfo` | true | 放行个人资料、皮肤、底栏处理 |
| search | `/2/search/` | true | 放行搜索时间线和 finder 分支 |
| searchAll | `/2/searchall` | true | 放行综合搜索头部/卡片/悬浮内容筛选 |
| chaohuaSearch | `/2/shproxy/chaohua/discovery/searchactive` | true | 放行超话搜索卡片过滤 |
| detail | `/2/statuses/container_detail?` | true | 放行新版详情头部及赞赏字段处理 |
| detailComment | `/2/statuses/container_detail_comment` | true | 放行新版详情评论过滤 |
| hotTimeline | `/2/statuses/container_timeline_hot`、`/2/statuses/unread_hot_timeline` | true | 放行推荐热流处理 |
| followingTimeline | `/2/statuses/container_timeline?`、`/2/statuses/container_timeline_unread` | true | 放行关注时间线处理 |
| topicTimeline | `/2/statuses/container_timeline_topic` | true | 放行超话时间线处理 |
| extend | `/2/statuses/extend` | true | 放行详情扩展数据及菜单处理 |
| repost | `/2/statuses/repost_timeline` | true | 放行转发列表筛选 |
| statusShow | `/2/statuses/show` | true | 放行单条微博信息流字段处理 |
| videoFull | `/2/video/full_screen_stream` | true | 放行全屏视频列表筛选 |
| videoDetail | `/2/video/tiny_stream_mid_detail` | true | 放行视频详情带货/横幅/浮窗处理 |
| videoList | `/2/video/tiny_stream_video_list` | true | 放行自动连播列表及 tab 清空处理 |
| topicChannels | `/2/!/huati/discovery_home_bottom_channels` | true | 放行超话广场渠道处理 |
| appicon | `/aj/appicon/list` | true | 放行应用图标 cardType 改写 |
| preload | `/v1/ad/preload`、`/v2/ad/preload` | true | 放行预加载广告时间字段改写 |
| cachedAds | `/wbapplua/wbpullad.lua`、`/preload/get_ad` | true | 放行缓存广告时间字段改写 |

## 菜单开关（全部默认值逐项复制原 `itemMenusConfig`）

每键分别控制 `/2/statuses/extend` 的 `custom_action_list` 对应 type；false 时该项不输出。菜单白名单以外的未知菜单仍不输出，保留原逻辑。菜单处理路径先检查 `itemMenusConfig` 对应默认，再按新 V2 boolean 实际控制；原默认 false 的项可以由 UI 开启。

| 配置键 | 原 type | 默认 | 注释 |
|---|---|---:|---|
| menu_creatortypeask | creatortypeask | false | 转发任务 |
| menu_mblog_menus_apeal | mblog_menus_apeal | true | 申诉 |
| menu_mblog_menus_avatar_widget | mblog_menus_avatar_widget | false | 用此头像挂件 |
| menu_mblog_menus_bullet_shield | mblog_menus_bullet_shield | true | 屏蔽弹幕 |
| menu_mblog_menus_card_bg | mblog_menus_card_bg | false | 用此卡片背景 |
| menu_mblog_menus_comment_manager | mblog_menus_comment_manager | true | 评论管理 |
| menu_mblog_menus_copy_url | mblog_menus_copy_url | true | 复制链接（已单独接入关闭条件） |
| menu_mblog_menus_custom | mblog_menus_custom | false | 寄微博 |
| menu_mblog_menus_delete | mblog_menus_delete | true | 删除 |
| menu_mblog_menus_edit | mblog_menus_edit | true | 编辑 |
| menu_mblog_menus_edit_history | mblog_menus_edit_history | true | 编辑记录 |
| menu_mblog_menus_edit_video | mblog_menus_edit_video | true | 编辑视频 |
| menu_mblog_menus_favorite | mblog_menus_favorite | true | 收藏 |
| menu_mblog_menus_follow | mblog_menus_follow | true | 关注 |
| menu_mblog_menus_home | mblog_menus_home | false | 返回首页 |
| menu_mblog_menus_long_picture | mblog_menus_long_picture | true | 生成长图 |
| menu_mblog_menus_modify_visible | mblog_menus_modify_visible | true | 设置分享范围 |
| menu_mblog_menus_novelty | mblog_menus_novelty | false | 新鲜事投稿 |
| menu_mblog_menus_open_reward | mblog_menus_open_reward | false | 赞赏 |
| menu_mblog_menus_popularize | mblog_menus_popularize | false | 原脚本未标注说明 |
| menu_mblog_menus_promote | mblog_menus_promote | false | 推广 |
| menu_mblog_menus_report | mblog_menus_report | true | 投诉 |
| menu_mblog_menus_shield | mblog_menus_shield | true | 屏蔽 |
| menu_mblog_menus_sticking | mblog_menus_sticking | true | 置顶 |
| menu_mblog_menus_video_feedback | mblog_menus_video_feedback | false | 播放反馈 |
| menu_mblog_menus_video_later | mblog_menus_video_later | false | 可能是稍后再看 |

## 未细分及边界

接口开关按原脚本的顶层 URL 分支成组，不是将每个 `delete`、每个字段或过滤谓词各做一个开关。例如 `/2/push/active` 内各弹窗字段同属一组，`/2/statuses/extend` 中扩展字段和菜单分别由接口组及 26 个菜单键控制。接口关闭是整条对应 URL 分支原样放行。`removeAvatar`/`removeFeedAd`/`removeVoteInfo` 是跨分支共享字段组；vote 的特殊直接写入代码仍归对应 endpoint 组。若要做到每个内联删除目的独立控制，尚需更多配置键、逐点锚点与每项样本测试；本版本不宣称已对所有内联删改实现单项开关。

HAR 验证已针对已知 profile/me 关注分页修正：只有 `items` 存在且命中 `profileme_mine`、`100505_-_top8`、`100505_-_manage`、`100505_-_manage2` 任一结构标记才运行主页面原处理；分页/未知结构原样放行。该判断是安全启发式，不保证未来字段变更。入口开关仍可独立于精简开关，在有 `100505_-_top8` 网格和公共无 query 图标时追加。
