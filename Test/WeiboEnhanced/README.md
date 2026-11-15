# 微博增强 V2（实验版）

独立测试目录：`Test/WeiboEnhanced/`。本配置使用真实发布地址，可作为 Quantumult X 重写资源添加；**尚未完成 QX / 微博真机验证，不是稳定版。** 原作者 rucu6 的署名和原脚本注释保留，增强包装与原始副本分开存放。

## 安装和首次打开设置

1. **先停用正式微博重写资源**，再在 QX 的重写资源中添加下面订阅，启用重写并刷新资源。不要与正式微博重写同时启用，也要排查其它微博规则的冲突。
   `https://raw.githubusercontent.com/Zz1xuan/ONE/main/Test/WeiboEnhanced/WeiBo.conf`
2. 按 QX 的要求启用 HTTPS 解密/MITM、安装并信任证书，确认配置列出的微博 hostname 生效。此处不修改你的 QX 现有设置。
3. QX 规则生效且设备流量经 QX 后，用 **Safari 输入完整虚拟地址**打开：
   `https://api.weibo.cn/minis-enhanced-v2/settings`
   也可从 QX 提供的网页打开能力打开该完整地址；不同版本入口不一致，不假设存在特定按钮。这不是 GitHub 网页，而是由本机 QX `script-echo-response` 回显的设置页。若出现真实站点错误/空白，应先检查规则命中、解密、脚本下载，不要把真实服务响应当成本设置页。
4. **我的页入口默认关闭**（`injectSettingsEntry=false`）。首次在虚拟网页中开启“设置入口”并点“保存”，再刷新微博“我的”页；同时保持总开关开启。仅在返回结构有已知网格及公共图标时追加“增强设置·实验”，不保证所有微博版本都有该结构。
5. 设置入口使用 `sinaweibo://browser?url=` 网页跳转，不依赖或猜测原生 JS Bridge。`profileMe=false` 时仍可独立注入入口；`enabled=false` 则整个包装脚本放行，也不注入入口。无入口时仍可回到 Safari 的上述虚拟地址设置。

虚拟配置 API：`https://api.weibo.cn/minis-enhanced-v2/config`，GET/POST；存储键：`minis.weibo.enhanced.config.v2`，与 V1 隔离，不自动迁移。不要给虚拟地址追加查询参数，路由严格比较完整 URL。

直接打开 raw `settings.html`、GitHub 页面或下载到本地的 HTML **不能代替虚拟设置页**，因为 API 依赖同设备 QX 回显和本机 `$prefs`。API 没有对外身份认证，只适用于受控本地规则实验，不可作为公网配置服务部署；不上传账号、Cookie 或配置值。

## 67 个开关与边界

共 67 个白名单布尔键：总控 1、入口 1、共享清理辅助 3、接口分组 36、详情菜单 26。默认入口关闭，其它功能/菜单按原逻辑默认；完整键名、默认值和范围见 `function-inventory.md`。页面提供读取、保存及确认后恢复默认；只有保存成功才表示持久化成功。

**不是每个字段删除点各有一个开关。** 接口开关以顶层分支成组，菜单和三个共享辅助可单独控制；某些特殊投票、计数字段仍归接口组。原脚本 URL 匹配和既有规则覆盖边界保留，部分开关/变体可能未被订阅捕获，不宣称所有接口和响应结构全覆盖。

**独立 DOMAIN / DOMAIN-SUFFIX / reject-dict 拦截不受任何网页开关控制，包括总开关。** 关闭脚本功能不能恢复这些被直接拒绝的请求。需要完全停用实验规则时，在 QX 中停用整个测试资源。

我的页仅对已知主页面结构调用原精简；关注分页及未知结构安全放行。该结构判断为启发式，不保证未来客户端兼容。

## 文件与可复现构建

- `WeiBo.conf`：实验版订阅；19 处原脚本引用（含原有 1 条注释规则）全部指向本目录增强脚本；额外两条精确虚拟网页/API 回显规则。
- `wb-enhanced-v2.js`、`settings-api-v2.js`：运行产物。
- `settings.html`、`common.js`、`settings-entry.js`、`settings-api.template.js`：页面、67 键契约、入口、API 源码。
- `source/wb.original.js`、`source/WeiBo.original.conf`：原始基线副本，仅用于复现；**不要单独启用基线配置**。
- `build.js`、`build-manifest.json`：构建器和基线哈希/字节数，构建不访问网络，不依赖目录外文件。
- `tests.js`、`release-tests.js`：仅合成样本的 Node VM 测试及发布路径/可复现检查。
- `function-inventory.md`：功能清单及未细分边界。

在本目录执行（需要现代 Node.js，无第三方包）：

```sh
node build.js
node --check wb-enhanced-v2.js
node --check settings-api-v2.js
node tests.js
node release-tests.js
```

构建检查 5 个唯一字面锚点。VM 测试覆盖 36 接口关闭路径、26 菜单默认对照与开关、67 键契约、精确 API 网页/配置、损坏配置、入口与精简解耦、分页安全和 single-done。发布测试另检查链接、路由匹配、页面键、恢复默认、构建可复现性。测试成功不等同于真机验证或所有 endpoint 字段正反样本全覆盖。

发布前还运行了私有 HAR 内存测试：4 个相关响应，2 个主页面默认结果与原脚本一致，2 个分页保留，2 个主页面成功追加入口。目录**不包含 HAR、真实响应 fixtures、个人路径、带私有 URL/query 的报告或 ZIP**；HAR 测试脚本本身不作为发布文件提供。

## 已知限制与退出实验

QX 的实际回显格式、MITM、规则优先级、`$prefs` 持久化、Safari/微博网页容器访问、网格布局点击以及各接口实际效果仍待真机验证。同步 `$done` 假设沿用原脚本，若上游变异步需重新评审。

出现问题可停用整个测试资源，再单独恢复正式微博重写。配置键仍留在本机；本次发布不删除任何现有文件，不覆盖正式规则，不自动清理测试目录。稳定后转正式/删除测试属于未来另行操作。
