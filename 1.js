

let url = "http://api.btstu.cn/sjbz/api.php?method=pc&lx=meizi";

$httpClient.get(url, (error, response, data) => {
  if (error) {
    console.log(error);
    $notification.post("推送美女图片出错啦", error);
    $done();
  } else {
    let image = $image.fromData(data);
    $notification.post("美女来啦", "", "", {"attachment": image});
    $done();
  }
});
