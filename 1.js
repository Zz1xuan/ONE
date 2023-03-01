// 获取数据
var data = $response.body;

// 如果数据存在right_ad属性，就删除它
if (data.hasOwnProperty('right_ad')) {
  delete data.right_ad;
}

// 返回修改后的数据
$done({body: JSON.stringify(data)});
