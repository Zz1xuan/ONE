var jsonData = JSON.parse($response.body);
var tabItems = jsonData.grayConfigInfos["155"].switchStatus;
tabItems = JSON.parse(tabItems);
tabItems.tabitems = tabItems.tabitems.filter(function(item) {
  return item.title !== "萤石" && item.title !== "商城" && item.title !== "发现";
});
jsonData.grayConfigInfos["155"].switchStatus = JSON.stringify(tabItems);
$done({body: JSON.stringify(jsonData)});
