let jsonData = $response.body;
try {
    let parsedData = JSON.parse(jsonData);
    delete parsedData.data.banners;
    delete parsedData.data.space;
    delete parsedData.data.entrance_xpoint;
    jsonData = JSON.stringify(parsedData);
} catch (error) {
    console.log("Error:", error);
}
$done({body: jsonData});
