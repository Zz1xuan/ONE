const version = 'V1.0.16';


var ddgksf2013=JSON.parse($response.body);
-1!=$request.url.indexOf("mtop.cainiao.nbpresentation.protocol.homepage.get.cn")?
    ddgksf2013.data?.result?.dataList?.length>0&&
    (ddgksf2013.data.result.dataList=ddgksf2013.data.result.dataList.filter(d=>"big_banner_area_v870"!=d.type))
    :
-1!=$request.url.indexOf("mtop.cainiao.guoguo.nbnetflow.ads.mshow")?
    (ddgksf2013.data["1308"]&&delete ddgksf2013.data["1308"],
    ddgksf2013.data["1275"]&&delete ddgksf2013.data["1275"])
    :
-1!=$request.url.indexOf("mtop.cainiao.guoguo.nbnetflow.ads.index.cn")?
    ddgksf2013.data?.result&&(ddgksf2013.data.result=[{}])
    :
-1!=$request.url.indexOf("mtop.cainiao.adkeyword")&&
    ddgksf2013.data?.result?.adHotKeywords&&
    (ddgksf2013.data.result.adHotKeywords=[]);
var body=JSON.stringify(ddgksf2013);
$done({body});
