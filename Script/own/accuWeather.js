//http-response ^https:\/\/app-subscription-proxy\.accuweather\.com\/subscriptions\/v1\/apple\/validate requires-body=1,script-path=https://raw.githubusercontent.com/Zz1xuan/ONE/main/Script/own/accuweather.js, tag=AccuWeather
//^https:\/\/app-subscription-proxy\.accuweather\.com\/subscriptions\/v1\/apple\/validate url script-response-body https://raw.githubusercontent.com/OocMe/ONE/main/Script/own/accuWeather.js

let obj = JSON.parse($response.body);

obj = {
  "isValid": true,
  "autoRenewalStatus": null,
  "productId": "com.accuweather.annual.subscription",
  "expiryDateEpoch": 1871734859,
  "expirationDate": "2029-05-01T14:18:35+00:00",
  "expirationIntent": null,
  "expirationRetry": null,
  "purchaseDateEpoch": 1650809915000,
  "isTrial": false,
  "isIntro": true,
  "status": 0,
  "usedTrial": ["com.accuweather.annual.subscription"],
  "usedIntro": null,
  "isRetryable": null
};
  
$done({body: JSON.stringify(obj)});
