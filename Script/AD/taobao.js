// https://raw.githubusercontent.com/RuCu6/QuanX/main/Scripts/myBlockAds.js

const url = $request.url;
const body = $response?.body;

if (!body) $done({});

const processJSON = (processor) => {
  try {
    const obj = JSON.parse(body);
    processor(obj);
    $done({ body: JSON.stringify(obj) });
  } catch (err) {
    console.log(`处理异常: ${err}`);
    $done({});
  }
};

// 开屏视频广告
if (url.includes('mtop.taobao.cloudvideo.video.query')) {
  processJSON(obj => {
    const data = obj.data;
    if (data) {
      if (data.duration) data.duration = "0";
      if (data.resources?.length) data.resources = [];
      if (data.caches?.length) data.caches = [];
      if (data.respTimeInMs) data.respTimeInMs = "3818332800000";
    }
  });
}

// 开屏图片广告  
else if (url.includes('mtop.taobao.wireless.home.splash.awesome.get')) {
  processJSON(obj => {
    const sections = obj.data?.containers?.splash_home_base?.base?.sections;
    if (sections) {
      sections.forEach(section => {
        const splashData = section.bizData?.["taobao-splash"]?.data;
        if (splashData) {
          splashData.forEach(item => {
            Object.assign(item, {
              waitTime: "0", times: "0", hotStart: "false", haveVoice: "false",
              hideTBLogo: "false", enable4G: "false", coldStart: "false",
              startTime: "3818332800000", endTime: "3818419199000",
              gmtStart: "2090-12-31 00:00:00", gmtEnd: "2090-12-31 23:59:59",
              gmtStartMs: "3818332800000", gmtEndMs: "3818419199000",
              imgUrl: "", videoUrl: ""
            });
          });
        }
      });
    }
  });
}

// 开屏活动
else if (url.includes('poplayer.template.alibaba.com')) {
  processJSON(obj => {
    if (obj.res?.images?.length) obj.res.images = [];
    if (obj.res?.videos?.length) obj.res.videos = [];
    if (obj.enable) obj.enable = false;
    if (obj.mainRes?.images?.length) obj.mainRes.images = [];
  });
}

else {
  $done({});
}