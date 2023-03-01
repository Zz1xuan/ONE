let jsonData = $response.body;
try {
    let parsedData = JSON.parse(jsonData);
    delete parsedData.data.right_ad;
    jsonData = JSON.stringify(parsedData);
} catch (error) {
    console.log("Error:", error);
}
$done({body: jsonData});
