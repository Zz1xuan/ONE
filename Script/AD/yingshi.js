// 将JSON字符串解析为JavaScript对象
const jsonObj = JSON.parse(jsonStr);

// 找到要删除的元素，并从数组中删除它们
jsonObj.grayConfigInfos["155"].switchStatus = JSON.parse(jsonObj.grayConfigInfos["155"].switchStatus);
jsonObj.grayConfigInfos["155"].switchStatus.tabitems = jsonObj.grayConfigInfos["155"].switchStatus.tabitems.filter((item) => item.title !== "智能" && item.title !== "商城" && item.title !== "发现");
jsonObj.grayConfigInfos["155"].switchStatus = JSON.stringify(jsonObj.grayConfigInfos["155"].switchStatus);

// 将修改后的JavaScript对象转换回JSON字符串
const updatedJsonStr = JSON.stringify(jsonObj);
