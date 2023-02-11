let obj = JSON.parse($response.body);

obj = {
  data: {
    total: 0,
    datas: [{}]
  },
  {
    code: 0,
    datas: [{}]
  },
  regeocode:{
    roadinters: [{}]
  }
};

$done({ body: JSON.stringify(obj) });
