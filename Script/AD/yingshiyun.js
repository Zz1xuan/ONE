let body = $response.body;

if (body) {
  try {
    const data = JSON.parse(body);

    // 删除"showAllBtn"和"valueAddedInfoList"字段
    delete data.showAllBtn;
    delete data.valueAddedInfoList;

    body = JSON.stringify(data);
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
}

$done({ 'body': '{}' });
