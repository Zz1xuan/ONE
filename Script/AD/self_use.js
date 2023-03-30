let url = $request.url;
let body = null;

if (/manga\.bilibili\.com/.test(url)) {
  let e = JSON.parse($response.body);
  if (e.data?.operate) {
    e.data.operate = null;
    body = JSON.stringify(e);
  }
} else if (/wmapi\.meituan\.com/.test(url)) {
  let e = JSON.parse($response.body);
  if (/loadInfo/.test(url) && e.data?.startpicture) {
    e.data.startpicture = [];
    body = JSON.stringify(e);
  } else if (/startpicture/.test(url)) {
    e.data = {start_picture:'{"ad":[],"mk":[]}'};
    body = JSON.stringify(e);
  } else if (/openscreen/.test(url)) {
    body = '{"data":{"start_picture":"","setStart_picture":true},"code":0,"msg":null,"setMsg":false,"setCode":true,"setData":true}';
  }
} else if (/mp\.weixin\.qq\.com\/mp\/getappmsgad/.test(url)) {
  let e = JSON.parse($response.body);
  e.advertisement_num = 0;
  e.advertisement_info = [];
  body = JSON.stringify(e);
} else if (/amdc\/mobileDispatch/.test(url)) {
  let e = $request.headers;
  let t = e["User-Agent"] || e["user-agent"];
  if (t.includes("AMap") || t.includes("Cainiao") || t.includes("%E9%A3%9E%E7%8C%AA%E6%97%85%E8%A1%8C")) {
    if (typeof $task !== "undefined") {
      $done({status:"HTTP/1.1 404 Not Found"});
    } else {
      $done();
    }
  } else {
    $done({});
  }
} else if (/intsig\.net\/purchase/.test(url)) {
  body = '{"data":{"psnl_vip_property":{"expiry":"3287462400"}}}';
} else {
  console.log("匹配到其他url：\n" + url);
}

if (body) {
  $done({body: body});
} else {
  $done({});
}
