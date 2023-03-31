const url = $request.url;
const header = $request.headers;

if ("undefined" !== typeof $task) {
  let ua = header["User-Agent"];
  if (ua.includes("AMap") || ua.includes("Cainiao") || ua.includes("%E9%A3%9E%E7%8C%AA%E6%97%85%E8%A1%8C")) {
    $done({ status: "HTTP/1.1 404 Not Found" });
  } else {
    $done({});
  }
} else {
  let ua = header["user-agent"];
  if (ua.includes("AMap") || ua.includes("Cainiao")) {
    $done();
  } else {
    $done({});
  }
}
