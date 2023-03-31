
const url = $request.url;
const header = $request.headers;
let ua = header["User-Agent"];

if (url.includes("/amdc/mobileDispatch")) {
  if (ua.includes("AMap") || ua.includes("Cainiao") || ua.includes("%E9%A3%9E%E7%8C%AA%E6%97%85%E8%A1%8C")) {
    $done({ status: "HTTP/1.1 404 Not Found", body: "" });
  } else {
    $done({});
  }
}
