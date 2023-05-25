let jsonData = $response.body; // 获取的响应体

try {
  const obj = JSON.parse(jsonData); // 解析为 JSON 对象
  if (obj && obj.data && typeof obj.data.eventStatus !== "undefined") {
    obj.data.eventStatus = 0; // 修改 eventStatus 字段的值为 1
    $done({ body: JSON.stringify(obj) }); // 返回修改后的 JSON 对象作为响应
  } else {
    console.log("无效的 JSON 格式或缺少必要的字段");
    $done(); // 结束请求
  }
} catch (error) {
  console.log("解析或修改响应体失败:", error);
  $done(); // 处理失败时结束请求
}
