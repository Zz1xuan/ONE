
// ==UserScript==
// @name         修改账户余额为9999元脚本
// @version      1.0
// @description  将账户余额改为9999元，只适用于某网站的充值页面，需要配合圈x使用
// @match        某网站的充值页面URL
// ==/UserScript==

(function() {
  'use strict';

  // 获取显示余额的p标签并将其内容改为9999.00
  document.querySelector(".AccountPrice").textContent = "9999.00";

})();
