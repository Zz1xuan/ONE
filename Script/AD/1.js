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
  {
    code: 0,
    data: [{}]
  },
  regeocode:{
    roadinters: [{}]
  }
};

$done({ body: JSON.stringify(obj) });
