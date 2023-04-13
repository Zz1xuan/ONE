
// 假设服务端返回的 JSON 数据保存在变量 data 中
// 解析 JSON 数据
var jsonData = JSON.parse(data);
// 删除 data 属性
delete jsonData.data;
// 将修改后的 JSON 数据转换回字符串
var modifiedData = JSON.stringify(jsonData);
// 返回修改后的 JSON 数据
return modifiedData;
