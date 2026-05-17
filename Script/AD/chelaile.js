let body = $response.body;

try {
  const obj = JSON.parse(body);
  const data = obj && obj.data;

  if (data && typeof data === 'object') {
    const zeroKeys = [
      'needFetchInterstitialAd',
      'searchAdPos',
      'showTopSearchAd',
      'splashGray',
      'adNeedAnimate',
      'nativeAdFetchType',
      'preloadAds',
      'adConfigTriggerDelayTime',
      'expressAdDelayRefreshTime',
      'adPopExhibitTime',
      'splashAdType',
      'splashCloseTime',
      'splashSkipShowType',
      'adStrategy',
      'searchPageAdAnimation',
      'dynamicSplashTime',
      'showKSVideoHeader',
      'hideCLLSkip',
      'enableSplashGray',
      'enableSplashLineInfo',
      'bdShowSplashDialog',
      'bdCloseDownloadDisplay',
      'sadt'
    ];

    for (const key of zeroKeys) {
      if (key in data) data[key] = 0;
    }

    if ('blacklistDomains' in data) data.blacklistDomains = [];
    if ('kuaishouFeedId' in data) data.kuaishouFeedId = '';
    if ('newKuaishouPicUrl' in data) data.newKuaishouPicUrl = '';
  }

  body = JSON.stringify(obj);
} catch (e) {}

$done({ body });
