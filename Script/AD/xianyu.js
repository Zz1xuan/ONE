// 作者：树先生
// 2025-07-09 优化版 by ChatGPT
// 当前脚本仅供学习研究使用，风险自负

const url = $request.url;
let body = $response.body;
let obj = JSON.parse(body);

// ✅ 工具函数封装
const del = (target, keys) => keys.forEach(k => delete target[k]);

const matchUrl = patterns => patterns.some(p => url.includes(p));

const removeAdsFromSections = sections =>
  sections.filter(section => !(section.data && section.data.bizType === "AD"));

const removeSectionsByName = (sections, names) =>
  sections.filter(section => !names.includes(section.template?.name));

// 定义处理逻辑模块
const handlers = [
  {
    match: url.includes("/gw/mtop.taobao.idlehome.home.nextfresh"),
    action: obj => {
      del(obj.data, ["widgetReturnDO", "bannerReturnDO"]);
      if (Array.isArray(obj.data.sections)) {
        obj.data.sections = removeAdsFromSections(obj.data.sections);
        obj.data.sections = removeSectionsByName(obj.data.sections, [
          "fish_home_yunying_card_d3",
          "idlefish_seafood_market",
          "fish_home_chat_room"
        ]);
      }
      obj.data.homeTopList = [];
    }
  },
  {
    match: url.includes("/gw/mtop.taobao.idle.local.home"),
    action: obj => {
      obj.data.sections = removeAdsFromSections(obj.data.sections ?? []);
    }
  },
  {
    match: url.includes("/gw/mtop.taobao.idle.home.whale.modulet"),
    action: obj => {
      del(obj.data, ["container"]);
    }
  },
  {
    match: matchUrl([
      "/gw/mtop.taobao.idlemtopsearch.search.shade",
      "/gw/mtop.taobao.idle.user.strategy.list"
    ]),
    action: obj => {
      delete obj.data;
    }
  },
  {
    match: url.includes("/mtop.idle.user.page.my.adapter"),
    action: obj => {
      const indexArr = ["3", "6", "4"];
      obj.data.container.sections = obj.data.container.sections.filter(item => !indexArr.includes(item.index));
      obj.data.ability = [];
      obj.data.container.sections.forEach(section => {
        if (section.index === "1") delete section.item.level;
        // if (section.index === "5") {
        //   const tools = section.item.tool.exContent.tools;
        //   const targetToolIds = [20, 1, 13, 26];
        //   const filteredTools = [
        //     tools.flatMap(sub => sub.filter(tool => targetToolIds.includes(tool.exContent.toolId)))
        //   ];
        //   section.item.tool.exContent.tools = filteredTools;
        // }
      });
    }
  },
  {
    match: url.includes("/mtop.taobao.idlehome.home.circle.list"),
    action: obj => {
      obj.data.circleList?.forEach(circle => {
        if (circle.showType) circle.showType = "text";
        if (circle.showInfo?.titleImage) delete circle.showInfo.titleImage;
        if (circle.circleId === "2") circle.showInfo.atmosphereImageUrl = "";
      });
    }
  },
  {
    match: url.includes("/gw/mtop.taobao.idlemtopsearch.search"),
    action: obj => {
      const resultList = obj.data.resultList ?? [];
      obj.data.resultList = resultList.filter(e => {
        const ad = e.data?.item?.main?.exContent?.isAliMaMaAD;
        return !(ad === true || ad === "true");
      }).filter(e => e.data?.template?.name !== "idlefish_search_card_category_select");
    }
  },
  {
    match: url.includes("/mtop.taobao.idle.group.myself.banner"),
    action: obj => {
      obj.data.bannerList = [];
    }
  },
  {
    match: url.includes("/mtop.taobao.idle.playboy.recommend"),
    action: obj => {
      obj.data.recommends = [];
      obj.data.items = [];
      obj.data.next = false;
    }
  },
  {
    match: url.includes("/mtop.taobao.idle.item.recommend.list"),
    action: obj => {
      obj.data.cardList = [];
    }
  },
  {
    match: url.includes("/mtop.taobao.idle.local.nearby.itemdetail.enter/1.0"),
    action: obj => {
      obj.data.targetUrl = "";
      obj.data.trackParams.itemIds = "";
      obj.data.nearbyItemInfoList = [];
      obj.data.name = "";
      obj.data.desc = "";
      obj.data.poiName = "";
    }
  },
  {
    match: url.includes("/gw/mtop.taobao.idlemessage.session.sync/3.0"),
    action: obj => {
      obj.data.sessions = obj.data.sessions.filter(s => s.session.sessionType !== "25");
    }
  },
  {
    match: url.includes("idle.fun.follow.feed.list"),
    action: obj => {
      obj.data.sections = obj.data.sections.filter(s => s.cardType === 9999);
      obj.data.sections.forEach(s => s.cardData?.subText && (s.cardData.subText = ""));
    }
  },
  {
    match: url.includes("idle.fun.follow.often.visit"),
    action: obj => {
      obj.data.sections = [];
    }
  },
  {
    match: url.includes("idle.circle.myself.banner/1.0"),
    action: obj => {
      obj.data.bannerList = [];
    }
  },
  {
    match: url.includes("idle.circle.visited/1.0"),
    action: obj => {
      obj.data.visitedCircleList = [];
    }
  },
  {
    match: url.includes("follow.recommend.feed.list"),
    action: obj => {
      obj.data.needDecryptKeys = [];
      obj.data.nextPage = false;
      obj.data.fitRecommendAB = true;
    }
  },
  {
    match: url.includes("/mtop.taobao.idle.local.flow.plat.section"),
    action: obj => {
      const keyArr = ["fish_home_activity_enter_cardV1"];
      obj.data.data.components = obj.data.data.components.filter(item => !keyArr.includes(item.key));
    }
  }
];

// ✅ 执行匹配处理逻辑
for (const h of handlers) {
  try {
    if (h.match) h.action(obj);
  } catch (err) {
    console.log("脚本处理失败：", err);
  }
}

// ✅ 输出结果
body = JSON.stringify(obj);
$done({ body });
