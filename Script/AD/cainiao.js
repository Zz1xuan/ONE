const version = 'V1.0.16';

var ddgksf2013=JSON.parse($response.body);

if (-1!=$request.url.indexOf("mtop.cainiao.nbpresentation.protocol.homepage.get.cn")) {
  if (ddgksf2013.data?.result?.dataList?.length>0) {
    ddgksf2013.data.result.dataList=ddgksf2013.data.result.dataList.filter(d=>"big_banner_area_v870"!=d.type)
  }
} else if (-1!=$request.url.indexOf("mtop.cainiao.guoguo.nbnetflow.ads.index.cn")) {
  if (ddgksf2013.data?.result) {
    ddgksf2013.data.result=[]
  }
} else if (-1!=$request.url.indexOf("mtop.cainiao.adkeyword")) {
  if (ddgksf2013.data?.result?.adHotKeywords) {
    ddgksf2013.data.result.adHotKeywords=[]
  }
}

var body=JSON.stringify(ddgksf2013);

$done({body});
