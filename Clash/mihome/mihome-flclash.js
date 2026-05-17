// 基于 Clash/mihome/mihome.js 派生
// 用途：FlClash / Mihomo 配置覆写脚本
// 变更：加入 AllReject，地区组改为 fallback，不覆盖原文件

const ruleProviderCommon = {
  "type": "http",
  "format": "text",
  "interval": 86400
};

const groupBaseOption = {
  "interval": 300,
  "url": "https://cp.cloudflare.com/generate_204",
  "max-failed-times": 3,
};

function main(config) {
  const proxyCount = config?.proxies?.length ?? 0;
  const proxyProviderCount =
    typeof config?.["proxy-providers"] === "object" ? Object.keys(config["proxy-providers"]).length : 0;
  if (proxyCount === 0 && proxyProviderCount === 0) {
    throw new Error("配置文件中未找到任何代理");
  }

  config["mixed-port"] = 7890;
  config["tcp-concurrent"] = true;
  config["allow-lan"] = false;
  config["ipv6"] = false;
  config["log-level"] = "info";
  config["unified-delay"] = true;
  config["find-process-mode"] = "off";
  config["global-client-fingerprint"] = "chrome";

  config["dns"] = {
    "enable": true,
    "listen": "127.0.0.1:1053",
    "ipv6": false,
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "fake-ip-filter": [
      "+.lan",
      "+.local",
      "*.local",
      "+.msftconnecttest.com",
      "+.msftncsi.com",
      "localhost.ptlogin2.qq.com",
      "localhost.sec.qq.com",
      "+.srv.nintendo.net",
      "+.stun.playstation.net",
      "+.xboxlive.com",
      "stun.*.*",
      "stun.*.*.*",
      "+.stun.*.*",
      "+.stun.*.*.*",
      "+.market.xiaomi.com",
      "WORKGROUP"
    ],
    "default-nameserver": ["223.5.5.5", "119.29.29.29"],
    "nameserver": [
      "https://dns.alidns.com/dns-query",
      "https://doh.pub/dns-query",
      "https://dns.volcengineapi.com/dns-query"
    ],
    "proxy-server-nameserver": ["223.5.5.5", "119.29.29.29"]
  };

  config["geodata-mode"] = true;
  config["geox-url"] = {
    "geoip": "https://git.repcz.link/raw.githubusercontent.com/Loyalsoldier/geoip/release/geoip.dat",
    "geosite": "https://git.repcz.link/github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat",
    "mmdb": "https://git.repcz.link/raw.githubusercontent.com/Loyalsoldier/geoip/release/Country.mmdb",
    "asn": "https://git.repcz.link/raw.githubusercontent.com/Loyalsoldier/geoip/release/GeoLite2-ASN.mmdb"
  };

  config["sniffer"] = {
    "enable": true,
    "parse-pure-ip": true,
    "force-dns-mapping": true,
    "sniffing-timeout": 300,
    "skip-domain": [
      "+.apple.com",
      "+.icloud.com",
      "+.push.apple.com",
      "+.oray.com",
      "+.sunlogin.net",
      "Mijia Cloud",
      "dlg.io.mi.com"
    ],
    "sniff": {
      "TLS": { "ports": ["443", "8443"] },
      "HTTP": { "ports": ["80", "8080-8880"], "override-destination": true },
      "QUIC": { "ports": ["443", "8443"] }
    }
  };

  config["tun"] = {
    "enable": true,
    "stack": "mixed",
    "dns-hijack": ["any:53"],
    "auto-route": true,
    "auto-detect-interface": true,
    "strict-route": false
  };

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
      "proxies": ["手动切换", "香港节点", "美国节点", "狮城节点", "DIRECT"],
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Emby.png"
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
      "name": "兜底分流",
      "type": "select",
      "proxies": ["手动切换", "DIRECT"],
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Final.png"
    },
    {
      ...groupBaseOption,
      "name": "香港节点",
      "type": "fallback",
      "include-all": true,
      "filter": "(?i)🇭🇰|香港|(\\b(HK|Hong)\\b)",
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Hong_Kong.png"
    },
    {
      ...groupBaseOption,
      "name": "美国节点",
      "type": "fallback",
      "include-all": true,
      "filter": "(?i)🇺🇸|美国|洛杉矶|圣何塞|(\\b(US|United States)\\b)",
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/United_States.png"
    },
    {
      ...groupBaseOption,
      "name": "狮城节点",
      "type": "fallback",
      "include-all": true,
      "filter": "(?i)🇸🇬|新加坡|狮|(\\b(SG|Singapore)\\b)",
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Singapore.png"
    },
    {
      ...groupBaseOption,
      "name": "日本节点",
      "type": "fallback",
      "include-all": true,
      "filter": "(?i)🇯🇵|日本|东京|(\\b(JP|Japan)\\b)",
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Japan.png"
    },
    {
      ...groupBaseOption,
      "name": "台湾节点",
      "type": "fallback",
      "include-all": true,
      "filter": "(?i)🇹🇼|台湾|台北|(\\b(TW|Tai|Taiwan)\\b)",
      "icon": "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Taiwan.png"
    }
  ];

  config["rule-providers"] = {
    "Direct+": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://raw.githubusercontent.com/ConnersHua/RuleGo/master/Surge/Ruleset/Direct+.list",
      "path": "./rules/Direct+.list"
    },
    "AI": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://raw.githubusercontent.com/ConnersHua/RuleGo/master/Surge/Ruleset/Extra/AI.list",
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
    "Proxy": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://raw.githubusercontent.com/ConnersHua/RuleGo/master/Surge/Ruleset/Proxy.list",
      "path": "./rules/Proxy.list"
    },
    "Direct": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://raw.githubusercontent.com/ConnersHua/RuleGo/master/Surge/Ruleset/Direct.list",
      "path": "./rules/Direct.list"
    },
    "Lan": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://github.com/Repcz/Tool/raw/X/mihomo/Rules/Lan.list",
      "path": "./rules/Lan.list"
    },
    "Proxy+": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://raw.githubusercontent.com/ConnersHua/RuleGo/master/Surge/Ruleset/Proxy+.list",
      "path": "./rules/Proxy+.list"
    },
    "AllReject": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://raw.githubusercontent.com/Zz1xuan/ONE/main/AllReject.list",
      "path": "./rules/AllReject.list"
    }
  };

  config["rules"] = [
    "RULE-SET,Direct+,DIRECT",
    "RULE-SET,AI,AI",
    "RULE-SET,Emby,Emby",
    "RULE-SET,Spotify,香港节点",
    "RULE-SET,Github,手动切换",
    "RULE-SET,Microsoft,DIRECT",
    "RULE-SET,AllReject,REJECT",
    "RULE-SET,Proxy,手动切换",
    "RULE-SET,Direct,DIRECT",
    "RULE-SET,Lan,DIRECT",
    "GEOIP,CN,DIRECT",
    "RULE-SET,Proxy+,手动切换",
    "MATCH,兜底分流"
  ];

  return config;
}
