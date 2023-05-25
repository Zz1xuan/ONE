[rewrite_local]

^https?:\/\/userapi\.qiekj\.com\/slot\/get url reject
^https?:\/\/userapi\.qiekj\.com\/appTitle\/get url script-response-body https://raw.githubusercontent.com/OocMe/ONE/main/Script/AD/qie.js
^https?:\/\/qemyapi\.qiekj\.com\/api\/item_list url script-response-body https://raw.githubusercontent.com/OocMe/ONE/main/Script/AD/qie.js
^https?:\/\/qemyapi\.qiekj\.com\/item_category\/list url script-response-body https://raw.githubusercontent.com/OocMe/ONE/main/Script/AD/qie.js

[mitm]
hostname = userapi.qiekj.com, qemyapi.qiekj.com,


let obj = JSON.parse($response.body);
delete obj.data;
$done({ body: JSON.stringify(obj) });
