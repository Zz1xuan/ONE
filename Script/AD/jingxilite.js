let obj = JSON.parse($response.body);
delete obj.data.jdLiteAdvertisingVO;
$done({ body: JSON.stringify(obj) });
