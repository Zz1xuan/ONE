let jsonData = $response.body;
try {
    let parsedData = JSON.parse(jsonData);
    delete context;
    jsonData = JSON.stringify(parsedData);
} catch (error) {
    console.log("Error:", error);
}
$done({body: jsonData});