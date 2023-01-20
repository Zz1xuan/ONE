if (!$response.body) $done({});
const url = $request.url;
let obj = JSON.parse($response.body);

if (url.includes("/ad.12306.cn/ad/ser/getAdList")) {
  if (obj.materialsList) {
    if (obj.advertParam && obj.materialsList.length === 1) {
      obj.materialsList[0].billId = "1000005";
      obj.materialsList[0].billMaterialsId = "2000005";
      obj.materialsList[0].filePath = "";
      obj.advertParam.skipTime = 1;
    } else if (obj.materialsList.length > 1) {
      obj.materialsList = [];
    }
  }
}

body = JSON.stringify(obj);
$done({ body });
