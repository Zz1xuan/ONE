var jsonData = JSON.parse($response.body);
if (jsonData.banner_ad && jsonData.banner_ad.right_ad) {
    delete jsonData.banner_ad.right_ad;
}
$done({ body: JSON.stringify(jsonData) });
