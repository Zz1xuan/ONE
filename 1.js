if (data && data.content) {
  if (data.content.includes("广告")) {
    data.content = data.content.replace(/广告/g, '');
    // 或者使用简单的字符串替换
    // data.content = data.content.split("广告").join("");
    $notify("删除广告", "已删除广告", "已删除内容中的广告");
  }
}
