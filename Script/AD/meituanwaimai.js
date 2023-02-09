;kokoryh
let url=$request.url,body=null;if(url.includes("wmapi.meituan.com")){let e=JSON.parse($response.body);e.data?.startpicture&&(e.data.startpicture=[],body=JSON.stringify(e))}body?$done({body:body}):$done({});
