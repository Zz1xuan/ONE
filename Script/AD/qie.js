
^https?:\/\/userapi\.qiekj\.com\/slot\/get url reject-200
^https?:\/\/userapi\.qiekj\.com\/appTitle\/get url script-response-body https://raw.githubusercontent.com/OocMe/ONE/main/Script/AD/qie.js
^https?:\/\/qemyapi\.qiekj\.com\/api\/item_list url script-response-body https://raw.githubusercontent.com/OocMe/ONE/main/Script/AD/qie.js

hostname = userapi.qiekj.com, qemyapi.qiekj.com,

let obj = JSON.parse($response.body);

obj = {
  data: {
    total: 0,
    datas: [{}]
  },
  {
    code: 0,
    datas: [{}]
  }
};

$done({ body: JSON.stringify(obj) });
