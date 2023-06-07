let obj = JSON.parse($response.body);
   
    obj = {
    "vip" : true,
    "svip" : true,
    "expire" : 253402196161000,
    "permissions" : [
      "ONE_MONTH",
      "AUTO_SUBSCRIPTION"
    ],
    "tag" : "TAG_RENEW_EXPECTED",
    "auto" : true,
    "open" : true,
    "planIds" : [
      "22"
    ],
    "svipExpire" : 253402196161000,
    "purchasedPlanIds" : [
      "22"
    ],
    "firstAuto" : false,
    "copyWritings" : [
      " ",
      " "
    ]
}

$done({body : JSON.stringify(obj)});
