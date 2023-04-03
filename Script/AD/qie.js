[rewrite_local]

^https?:\/\/userapi\.qiekj\.com\/slot\/get url reject
^https?:\/\/userapi\.qiekj\.com\/appTitle\/get url script-response-body https://raw.githubusercontent.com/OocMe/ONE/main/Script/AD/qie.js
^https?:\/\/qemyapi\.qiekj\.com\/api\/item_list url script-response-body https://raw.githubusercontent.com/OocMe/ONE/main/Script/AD/qie.js

[mitm]
hostname = userapi.qiekj.com, qemyapi.qiekj.com,


let obj = JSON.parse($response.body);

obj = {
  data: {
    total: 0,
    datas: [{}]
  },
  code: 0,
  datas: [{}]
};

$done({ body: JSON.stringify(obj) });
