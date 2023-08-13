
const url = $request.url;
const header = $request.headers;
let ua = header["User-Agent"] || header["user-agent"];

if (url.includes("/amdc/mobileDispatch")) {
  if (ua.includes("AMapiPhone") || ua.includes("Cainiao") || ua.includes("%E9%A3%9E%E7%8C%AA%E6%97%85%E8%A1%8C") || ua.includes("Alibaba" ) || ua.includes("DMPortal" )) {
    $done({ status: "HTTP/1.1 404 Not Found" });
    return;
  }
}

$done({});
