let body = $response.body;

if (body) {
  try {
    const data = JSON.parse(body);

    // 删除"data"对象中的"articles"属性
    if (data.data) {
      delete data.data.articles;
    }

    body = JSON.stringify(data);
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
}

$done({ 'body': body });
