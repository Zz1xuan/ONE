
var ua = $request.headers["User-Agent"] || $request.headers["user-agent"];
if (
    -1 !== ua.indexOf("AMap") ||
    -1 !== ua.indexOf("Cainiao") ||
    -1 !== ua.indexOf("%E9%A3%9E%E7%8C%AA%E6%97%85%E8%A1%8C") ||
    -1 !== ua.indexOf("Alibaba") ||
    -1 !== ua.indexOf("DMPortal")
) {
    $done({ body: "thanks" });
} else {
    $done({});
}
