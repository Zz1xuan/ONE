var response = $response.body;
var jsonData = JSON.parse(response);
delete jsonData.admin;
delete jsonData.home;
var modifiedData = JSON.stringify(jsonData);
$done(modifiedData);
