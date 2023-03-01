var data = JSON.parse($response.body);
delete data.right_ad;
$done({body: JSON.stringify(data)});
