let obj = JSON.parse($response.body);

/* 京喜APP delivery_show */
if (/^https?:\/\/api\.m\.jd\.com\/api\?functionId=delivery_show/.test($request.url)) { 
    obj.data.materialList.startTime = 3667476800000;
    obj.data.materialList.endTime = 3667908800000;
}

/* 京喜特价APP lite_advertising */
if (/^https?:\/\/api\.m\.jd\.com\/client\.action\?functionId=lite_advertising/.test($request.url)) {
    delete obj.data.jdLiteAdvertisingVO;
}

$done({ body: JSON.stringify(obj) });
