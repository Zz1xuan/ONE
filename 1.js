var response = $response.body;
var jsonData = JSON.parse(response);
delete jsonData.data;
var modifiedData = JSON.stringify(jsonData);
$done(modifiedData);
