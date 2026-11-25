# V3 功能清单

旧67bool保持：总控1、入口1、共享3、路由36、菜单26。新增固定custom：251bool（236源写入/条件+15显式功能）与18typed字段；318个顶层/细分bool总计，不包含typed映射内每个可选开关。

- custom-fields.json：每个bool的准确scope/target/source line/operation/default/evidence。
- control-map.json / control-map.md：控制点映射、共享辅助函数涉及的endpoint、真实HAR可观测改变次数；所有deviceVerified=false。
- candidate-coverage.json / coverage.md：HAR47候选逐项状态，19implemented/19partial/9deferred。implemented指本地功能已接入且有测试，不代表客户端真机验证。
- typed-schema.js：我的11固定模块、8网格；首页2导航；source-only默认分组4标题；详情28父type（旧26+audio/remark）；8状态type文字；25全局反馈父type；10发布器标准app_name分组。order/label只接受各自固定枚举。
- known-source-bugs.md：原字段bug、重复删除、旧helper依赖、规则边界。

“保留”bool=false继承原清理，true保留该处字段/内容；hide bool=false不新增处理，true只隐藏明确展示项。fineProfile/fineTabs/fineMenus均默认false。旧路由、总控、共享helper开关优先；外层父项过滤可能使字段保留看不见效果。UI中文文案逐点说明，不把源代码接线数量伪称为用户可见独立功能数。

36路由内的现有明确delete、业务字段赋值及单条件continue/break已由AST位置/文本白名单控制；重建输出数组语句不作为独立总控，注释代码不执行。多字段循环的searchAll头图3字段、推荐流头部4字段、extend13字段已拆成各自固定键。未拆到单独枚举值的card_type数组谓词仍作为一个模板类别组；双路径同目的控制在UI各显准确target，不自动声称跨路径全控制。

真实HAR证据：122个api JSON默认输出对照旧版相同；11个接口19个定制响应通过；236源bool中38个在每endpoint首个可解析代表响应中改变输出，198个未命中/无变化。源bool均有隔离操作两态测试，但完整路由目标+相邻业务不变只覆盖8组，显式功能另有V3端到端测试。未完成所有源bool的独立endpoint合成测试，这是明确验证缺口。

不支持：底部导航编辑、缺样本个人主页原生布局、任意图标URL/跳转/regex/存储键、用户身份/权限/余额/未读/分页篡改、视频频道按标题猜测删除、服务端动作执行。
