var jsonData = $response.body;
var data = JSON.parse(jsonData);

delete data.HPBANNER_AD_INFO_SECOND;

$done({body: JSON.stringify(data)});
