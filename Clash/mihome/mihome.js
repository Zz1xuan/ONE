// 参考 Verge Rev 示例 Script 配置
//
// Clash Verge Rev (Version ≥ 17.2) & Mihomo-Party (Version ≥ 1.5.10)
//
// 最后更新时间: 2025-02-27 23:00
// 原作者 Repcz (https://github.com/Repcz)

// 规则集通用配置
const ruleProviderCommon = {
  "type": "http",
  "format": "text",
  "interval": 86400
};

// 策略组通用配置
const groupBaseOption = {
  "interval": 300,
  "url": "http://www.apple.com/library/test/success.html",
  "max-failed-times": 3,
};

// 程序入口
function main(config) {
  const proxyCount = config?.proxies?.length ?? 0;
  const proxyProviderCount =
    typeof config?.["proxy-providers"] === "object" ? Object.keys(config["proxy-providers"]).length : 0;
  if (proxyCount === 0 && proxyProviderCount === 0) {
    throw new Error("配置文件中未找到任何代理");
  }

  // 覆盖通用配置
  config["mixed-port"] = "7890";
  config["tcp-concurrent"] = true;
  config["allow-lan"] = true;
  config["ipv6"] = false;
  config["log-level"] = "info";
  config["unified-delay"] = "true";
  config["find-process-mode"] = "strict";
  config["global-client-fingerprint"] = "chrome";

  // 覆盖 dns 配置
  // config["dns"] = {
  //   "enable": true,
  //   "listen": "0.0.0.0:1053",
  //   "ipv6": false,
  //   "enhanced-mode": "fake-ip",
  //   "fake-ip-range": "198.18.0.1/16",
  //   "fake-ip-filter": ["*", "+.lan", "+.local", "+.direct", "+.msftconnecttest.com", "+.msftncsi.com"],
  //   "nameserver": ["114.114.115.115", "223.6.6.6", "119.29.29.29"]
  // };
  // 参考https://linux.do/t/topic/425740 + prprcloud
  config["dns"] = {
    "enable": true,
    "listen": "0.0.0.0:1053",
    "ipv6": false,
    "prefer-h3": true,
    "respect-rules": true,
    "use-hosts": true,
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "fake-ip-filter": [
      "*.lan", "stun.*.*.*", "stun.*.*",
      "time.windows.com", "time.nist.gov", "time.apple.com", "time.asia.apple.com",
      "*.ntp.org.cn", "*.openwrt.pool.ntp.org", "time1.cloud.tencent.com", "time.ustc.edu.cn",
      "pool.ntp.org", "ntp.ubuntu.com", "ntp.aliyun.com", "ntp1.aliyun.com", "ntp2.aliyun.com",
      "ntp3.aliyun.com", "ntp4.aliyun.com", "ntp5.aliyun.com", "ntp6.aliyun.com", "ntp7.aliyun.com",
      "time1.aliyun.com", "time2.aliyun.com", "time3.aliyun.com", "time4.aliyun.com",
      "time5.aliyun.com", "time6.aliyun.com", "time7.aliyun.com", "*.time.edu.cn",
      "time1.apple.com", "time2.apple.com", "time3.apple.com", "time4.apple.com",
      "time5.apple.com", "time6.apple.com", "time7.apple.com", "time1.google.com",
      "time2.google.com", "time3.google.com", "time4.google.com", "alt1-mtalk.google.com",
      "alt2-mtalk.google.com", "alt3-mtalk.google.com", "alt4-mtalk.google.com",
      "alt5-mtalk.google.com", "alt6-mtalk.google.com", "alt7-mtalk.google.com",
      "alt8-mtalk.google.com", "mtalk.google.com", "music.163.com", "*.music.163.com",
      "*.126.net", "musicapi.taihe.com", "music.taihe.com", "songsearch.kugou.com",
      "trackercdn.kugou.com", "*.kuwo.cn", "api-jooxtt.sanook.com", "api.joox.com",
      "joox.com", "y.qq.com", "*.y.qq.com", "streamoc.music.tc.qq.com",
      "mobileoc.music.tc.qq.com", "isure.stream.qqmusic.qq.com", "dl.stream.qqmusic.qq.com",
      "aqqmusic.tc.qq.com", "amobile.music.tc.qq.com", "*.xiami.com", "*.music.migu.cn",
      "weatherapi.market.xiaomi.com", "wtradv.market.xiaomi.com", "music.migu.cn",
      "*.msftconnecttest.com", "*.msftncsi.com", "localhost.ptlogin2.qq.com",
      "*.*.*.srv.nintendo.net", "*.*.stun.playstation.net", "xbox.*.*.microsoft.com",
      "*.ipv6.microsoft.com", "*.*.xboxlive.com", "speedtest.cros.wr.pvp.net"
    ],
    "default-nameserver": [
      "223.5.5.5",
      "119.29.29.29",
      "180.184.1.1",
      "114.114.114.114"
    ],
    "nameserver": [
      "https://dns.alidns.com/dns-query",
      "tls://dns.alidns.com",
      "https://doh.pub/dns-query",
      "tls://dot.pub"
    ],
    "proxy-server-nameserver": [
      "https://223.5.5.5/dns-query",
      "https://1.12.12.12/dns-query"
    ],
    "nameserver-policy": {
      "geosite:cn,private,steam@cn,apple@cn,microsoft@cn,apple-cn,category-games@cn": "119.29.29.29"
    }
  };

  // 覆盖 geodata 配置
  config["geodata-mode"] = true;
  config["geox-url"] = {
    "geoip": "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Loyalsoldier/geoip/release/geoip.dat",
    "geosite": "https://mirror.ghproxy.com/https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat",
    "mmdb": "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Loyalsoldier/geoip/release/Country.mmdb",
    "asn": "https://mirror.ghproxy.com/https://raw.githubusercontent.com/Loyalsoldier/geoip/release/GeoLite2-ASN.mmdb"
  };

  // 覆盖 sniffer 配置
  config["sniffer"] = {
    "enable": true,
    "parse-pure-ip": true,
    "sniff": {
      "TLS": {
        "ports": ["443", "8443"]
      },
      "HTTP": {
        "ports": ["80", "8080-8880"],
        "override-destination": true
      },
      "QUIC": {
        "ports": ["443", "8443"]
      }
    }
  };

  // 覆盖 tun 配置
  config["tun"] = {
    "enable": true,
    "stack": "mixed",
    "dns-hijack": ["any:53"]
  };

  // 覆盖策略组
  config["proxy-groups"] = [
    {
      ...groupBaseOption,
      "name": "手动切换",
      "type": "select",
      "proxies": ["香港节点", "美国节点", "狮城节点", "日本节点", "台湾节点", "DIRECT"],
      "include-all": true,
      "icon": "https://github.com/shindgewongxj/WHATSINStash/raw/main/icon/applesafari.png"
    },
    {
      ...groupBaseOption,
      "name": "Emby",
      "type": "select",
      "proxies": ["手动切换","香港节点", "美国节点", "狮城节点", "DIRECT"],
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Emby.png"
    },
    // {
    //   ...groupBaseOption,
    //   "name": "国外网站",
    //   "type": "select",
    //   "proxies": ["手动切换", "香港节点", "美国节点", "狮城节点", "日本节点", "台湾节点", "DIRECT"],
    //   "icon": "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Global.png"
    // },
    {
      ...groupBaseOption,
      "name": "苹果服务",
      "type": "select",
      "proxies": ["手动切换", "香港节点", "美国节点", "狮城节点", "日本节点", "台湾节点", "DIRECT"],
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Apple_1.png"
    },
    {
      ...groupBaseOption,
      "name": "微软服务",
      "type": "select",
      "proxies": ["手动切换", "DIRECT"],
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Microsoft.png"
    },
    {
      ...groupBaseOption,
      "name": "AI",
      "type": "select",
      "proxies": ["手动切换", "香港节点", "美国节点", "狮城节点", "日本节点", "台湾节点", "DIRECT"],
      "icon": "https://raw.githubusercontent.com/Orz-3/mini/master/Color/OpenAI.png"
    },
    {
      ...groupBaseOption,
      "name": "游戏平台",
      "type": "select",
      "proxies": ["手动切换", "香港节点", "美国节点", "狮城节点", "日本节点", "台湾节点", "DIRECT"],
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Game.png"
    },
    {
      ...groupBaseOption,
      "name": "兜底分流",
      "type": "select",
      "proxies": ["手动切换","DIRECT"],
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Final.png"
    },
    // 地区分组
    {
      ...groupBaseOption,
      "name": "香港节点",
      "type": "url-test",
      "tolerance": 0,
      "include-all": true,
      "filter": "(?i)🇭🇰|香港|(\b(HK|Hong)\b)",
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Hong_Kong.png"
    },
    {
      ...groupBaseOption,
      "name": "美国节点",
      "type": "url-test",
      "tolerance": 0,
      "include-all": true,
      "filter": "(?i)🇺🇸|美国|洛杉矶|圣何塞|(\b(US|United States)\b)",
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/United_States.png"
    },
    {
      ...groupBaseOption,
      "name": "狮城节点",
      "type": "url-test",
      "tolerance": 0,
      "include-all": true,
      "filter": "(?i)🇸🇬|新加坡|狮|(\b(SG|Singapore)\b)",
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Singapore.png"
    },
    {
      ...groupBaseOption,
      "name": "日本节点",
      "type": "url-test",
      "tolerance": 0,
      "include-all": true,
      "filter": "(?i)🇯🇵|日本|东京|(\b(JP|Japan)\b)",
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Japan.png"
    },
    {
      ...groupBaseOption,
      "name": "台湾节点",
      "type": "url-test",
      "tolerance": 0,
      "include-all": true,
      "filter": "(?i)🇨🇳|🇹🇼|台湾|(\b(TW|Tai|Taiwan)\b)",
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/China.png"
    }
  ];

  // 覆盖规则集
  config["rule-providers"] = {
    "Unbreak-d": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://raw.githubusercontent.com/Zz1xuan/ONE/main/Rule/Unbreak-d.list",
      "path": "./rules/Unbreak-d.list"
    },
    "Apple": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/Apple.list",
      "path": "./rules/Apple.list"
    },
    "Telegram": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://raw.githubusercontent.com/Zz1xuan/ONE/main/Rule/Telegram.list",
      "path": "./rules/Telegram.list"
    },
    "Steam": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/Steam.list",
      "path": "./rules/Steam.list"
    },
    "Epic": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/Epic.list",
      "path": "./rules/Epic.list"
    },
    "AI": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/AI.list",
      "path": "./rules/AI.list"
    },
    "Emby": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://raw.githubusercontent.com/Zz1xuan/ONE/main/Rule/Emby.list",
      "path": "./rules/Emby.list"
    },
    "Spotify": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://raw.githubusercontent.com/Zz1xuan/ONE/main/Rule/Spotify.list",
      "path": "./rules/Spotify.list"
    },
    "OneDrive": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/OneDrive.list",
      "path": "./rules/OneDrive.list"
    },
    "Github": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/Github.list",
      "path": "./rules/Github.list"
    },
    "Microsoft": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/Microsoft.list",
      "path": "./rules/Microsoft.list"
    },
    "Lan": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/Lan.list",
      "path": "./rules/Lan.list"
    },
    "ProxyGFW": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/ProxyGFW.list",
      "path": "./rules/ProxyGFW.list"
    }
  };

  // 覆盖规则
  config["rules"] = [
    "RULE-SET,Unbreak-d,DIRECT",
    "RULE-SET,AI,AI",
    "RULE-SET,Apple,苹果服务",
    "RULE-SET,Telegram,手动切换",
    "RULE-SET,Steam,游戏平台",
    "RULE-SET,Epic,游戏平台",
    "RULE-SET,Emby,Emby",
    "RULE-SET,Spotify,香港节点",
    "GEOSITE,github,手动切换",
    "GEOSITE,onedrive,微软服务",
    "GEOSITE,microsoft,微软服务",
    "GEOSITE,gfw,手动切换",
    "GEOIP,private,DIRECT",
    "GEOIP,cn,DIRECT",
    "MATCH,兜底分流"
  ];

  // 返回修改后的配置
  return config;
}