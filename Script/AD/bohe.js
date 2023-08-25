/* let body = $response.body;
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
$done({ 'body': body }); */

var obj = JSON.parse($response.body);
var url = $request.url;

if (/meta-interface\/v1\/index\/record_index/.test(url)) {
  if (obj.data) {
    delete obj.data.articles;
  }
} else if (/api\/v1\/shop_homepage/.test(url) && obj.data && obj.data.length > 0) {
  const idsToRemove = [105, 110, 111, 13, 126, 62, 151, 128, 163, 132, 10, 164];
  obj.data = obj.data.filter(item => !idsToRemove.includes(item.id));
}

var body = JSON.stringify(obj);
$done({ body });
