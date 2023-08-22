let body = $response.body;

if (body) {
  try {
    const data = JSON.parse(body);

    // 将"valueAddedInfoList"设置为空数组
    data.valueAddedInfoList = [];

    body = JSON.stringify(data);
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
}

$done({ 'body': body });