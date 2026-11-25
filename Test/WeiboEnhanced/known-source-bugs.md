# 源脚本问题与V3处理边界

基线8b1d7d3。以下与新增功能分开记录；不把原缺陷静默修成另一种默认行为。

## 已修复

- build.js followingTimeline门控遗漏 `/2/statuses/container_timeline_unread`，导致旧false仍删除loadedInfo.headers。V3已补别名并有端点回归。此项是关闭开关的bug修复，不改变默认开启行为。
- config POST body已知风险：基线已用analyze，V3保持并新增精确release断言，不宣称本次首次修复。普通echo不保证等待正文，缺body返回400零写。

## 有意保留的旧默认与限制

- source:421顶层card_group正向只保留“你可能感兴趣的超话”，疑似相反谓词。提供保留原数组开关，默认不翻转。
- source:1443–1460检查obj.ads.length后却访问obj.ads.creatives，真实HAR为ads[].creatives。V3只给现有写入加逐点保留，不修此结构bug；未执行内层控制点标source-only。修复需另变更默认行为测试。
- source removeFeedAd调用removeAvatar，feedCleanup=false会抑制该调用。V3保留旧组合语义并在UI说明；新增逐字段保留点不能绕过旧helper总控或外层过滤。
- source publisher_list实际过滤在注释中；V3新增受控标准app_name分组visible，不把68个elements视为68个唯一可展示入口；重复名称按组隐藏。
- source finder两阶段过滤。preserveFinderHeader从原始response恢复整段header.data.items；其它字段级保留仍不能恢复被外层删除的父项。moreChannels在两个位置删除，用户必须同时保留两点；控件明确显示准确字段/条件与依赖。
- source isAd将广告与热推混为一个谓词。V3提供一个保留分类内容bool，没有任意regex或更宽广告判据。内容被其它结构过滤时此项不保证恢复。
- 源路由继续多为includes/不严格边界。V3未全面重写路由识别，conf host约束仍为第一道边界；query伪路径误匹配尚未彻底消除。不得以本实现宣称任意host直接调用安全。
- 原native设置入口结构守卫、模板复制、公共箭头白名单、一次完成保持；精细模式排序后仍在唯一top8后注入独立cardEditor，不新增第五格。

## 默认结果和证据

122个api JSON真实响应默认输出逐字对照旧包装通过。新bool全部有隔离正反测试；仅8组源操作有合成实际endpoint目标+相邻字段断言，显式功能另有V3端到端测试。236个源bool中38个在真实代表响应中改变结果，其余未命中/无效果，不能称全部真机覆盖。

底部导航仅空var_icons，无编辑证据；个人主页未捕获；视频频道没有安全固定枚举且含selectInfo；自定义icon/target无开放；状态菜单仅已确认8种state.type文字，不改动作或权限。上述均明确暂缓/部分，不伪造功能。
