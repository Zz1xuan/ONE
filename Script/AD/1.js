let obj = JSON.parse($response.body);

obj = {
  data: {
    total: 0,
    datas: [{}]
  }
};

$done({ body: JSON.stringify(obj) });
