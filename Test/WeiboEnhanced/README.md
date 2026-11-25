# 微博增强 V3 自定义测试版

此目录为 Quantumult X 测试订阅，源基线为 `8b1d7d32ded37d19fd73904ec9c9b09af32cd4db`。原作者 rucu6 署名和 source 原文件保留。仅测试目录持续开发，正式订阅不变。**这是已发布的本地模拟通过候选，尚未完成 QX / 微博实机验收，不代表全部功能覆盖。**

## 安装与首次配置

1. 在 QX 添加或更新测试重写订阅：
   `https://raw.githubusercontent.com/Zz1xuan/ONE/main/Test/WeiboEnhanced/WeiBo.conf`
2. 停用其它微博重写，确认 QX 重写与本订阅要求的 MITM 主机生效，再重新进入微博。不要同时启用正式微博订阅和测试订阅。
3. 从微博“我”页面的原生管理入口进入“微博增强设置”；该 cardEditor 注入入口未改。也可在 QX 接管网络的浏览器打开 `https://api.weibo.cn/minis-enhanced-v2/settings`。该地址是本地重写虚拟页，不是公网网站。
4. 默认沿用旧清理策略，精细模式默认关闭。先开启需要的“我的 / 首页 / 菜单”精细模式，再逐项修改显示、排序或文字，点击保存并重新进入对应页面。一次只调整少量项目，便于确认效果。
5. 原始源字段控制与兼容开关大多在默认折叠的高级区，可搜索展开。保留项开启表示恢复原字段，hide 项开启表示隐藏；字段仍可能受父级过滤影响。

虚拟入口仍为 `minis-enhanced-v2/settings` 与 `minis-enhanced-v2/config`，未改旧入口。settings 允许 ua/from 参数；config 无 query，使用 `script-analyze-echo-response` 等待 POST 正文。脚本引用为同一测试目录的 `wb-enhanced-v3.js` 和 `settings-api-v3.js`；旧 V2 文件名保留为内容相同的兼容别名，已有测试订阅 URL 不变。

## 能力与限制

共 320 个 bool（旧 67 + custom 253）及 19 个 typed 白名单字段；页面按分组提供 129 个 typed 控件。253 个新增 bool 包含 236 个源操作/谓词保留点和 17 个显式功能。控制点数量不等于客户端可见覆盖率。

47 个候选状态为 **20 implemented / 20 partial / 7 deferred**，详见 coverage.md 与 candidate-coverage.json。implemented 表示本地实现状态，不表示已在真机验收。

- “我的”：固定 11 模块、8 网格的显示/排序/文字，保护主资料和管理入口，保留未知模块；红点、会员样式字段等逐项控制。
- 首页：homeHot/homeFeed 顶部导航与固定子分组模板；自建分组保留，至少一页回退。
- 详情：fineMenus 开启后兼容嵌套菜单，保留未知操作；固定菜单排序、8 个已观测状态文字可改，不改变状态动作和 scheme。
- 搜索/热搜：发现头部恢复、横幅/工具菜单/整块热词隐藏；不编辑真实热词或排名。更多频道恢复同时恢复 moreChannels/channelConfig，旧两保留键按此目的兼容。
- 消息：素材和清理按钮隐藏，不发清理请求；提醒 tab 数字展示标志归零，未读不改，显示语义待真机。
- 启动：已捕获悬浮窗字段、红包/发布入口隐藏；全局反馈父菜单按固定类型显示/排序，保留动作。
- 发布器：按 10 个已观测标准 app_name 分组显示，同名变体一起变化，保护写微博入口；并非 68 个元素的逐项编辑器。快捷操作只支持整块隐藏。
- 推荐流：附加按钮、continue_tag 分别隐藏；头像、商品、热评、投票等逐字段保留。

暂缓的 7 项：M04 任意图标、T03 个性频道管理、T04 默认落地页、H01 热搜导航、H05 搜索建议、D03 转评赞频道、S07 视频频道。没有可靠键的不按标题猜 ID；任意跳转、底部导航空数组、未捕获个人主页、发布器逐元素排序/图标/跳转均未开放。其余 20 项 partial 的边界逐项见 coverage.md。

**静态 DOMAIN / reject 规则不受网页开关或总控控制。** 路由关闭整条放行，profileMe 与独立设置入口保持原例外。未知 HTTPS host/path 放行，query 不参与分支判定。源 page 正向 filter、preload creatives 层级等已知问题见 known-source-bugs.md，未借本次发布静默改变。

## 保存、兼容与降级

固定存储键 `minis.weibo.enhanced.config.v3`；V3 缺失时只读 V2 键，显式 false 保留。GET 与脚本运行不写偏好，保存只写 V3。请求/合并/存储/UI 统一 UTF-8 32KB 上限；该上限有本地边界测试，不能作为 QX 实际可持久化容量保证。损坏配置不会静默覆盖，需人工恢复有效备份。

降级到旧 V2 时读取原 V2 配置，**不会携带 V3 新配置**。先保留自己的有效备份，再切回旧版订阅并停用 V3；不要同时启用。测试版内 V2 文件名是 V3 内容别名，不是降级包。

## 可复现构建与测试

需 Node.js 与本目录全部构建输入。先进入本目录运行：

```sh
node refresh-schema.js
node build.js --release
node tests.js
node custom-tests.js
node endpoint-tests.js
node route-tests.js
node observable-endpoint-tests.js
node v3-tests.js
node config-boundary-tests.js
node release-tests.js
```

不加 `--release` 的 `node build.js` 输出本地脚本名，供手动复制 QX Scripts 使用；`--release` 明确输出上述真实远程地址。release-tests 同时校验两模式、V3 真实地址、config analyze、settings query、固定基线与重复构建。source/入口 SHA 固定于 release-baseline.json，构建原脚本 SHA 固定于 baseline-manifest.json。

构建依赖 tools/acorn.js 为 Acorn 8.14.1，已与 npm 官方包逐字一致并校验包完整性；MIT 许可全文见 tools/acorn-LICENSE，原源码中的授权注释保留。来源：https://www.npmjs.com/package/acorn/v/8.14.1 。无需联网安装构建依赖。

本地测试：115 基本回归、236 隔离源操作、8 端点组、311 路由断言、67 可观测端点断言、41 V3、6 配置边界、11 发布检查全部通过。236 隔离测试不等于 236 项完整端点覆盖。

发布前额外本地验证：122 个 HAR API JSON 响应回放 0 失败，24 个准确支持路由默认输出与旧版逐字一致，98 个未支持路径语义不变；11 接口 19 响应有定制断言。40/236 源 bool 在现有捕获中改变输出，196 项未命中或无可观测变化。首次逐键探测曾超时，原样重试通过。HAR、账户内容、真实 fixture、本地回放工具及报告不发布；observable-required.json 仅包含 40 个脱敏控制键。

本地 UI DOM mock 6 项通过（320 bool / 129 typed、保存回绘、搜索高级项、恢复默认、最大合法保存、错误零更改）；该工具依赖本机 mock，未收入发布包。本轮浏览器视觉预览超时，未确认渲染。真实 QX POST 持久化、32KB 容量、原生入口点击/布局、缓存与状态联动、微博实际展示仍待实机验收。
