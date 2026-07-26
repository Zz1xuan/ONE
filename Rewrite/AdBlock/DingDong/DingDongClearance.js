/*

[rewrite_local]
^https:\/\/gw\.api\.ddxq\.mobi\/cms-service\/client\/product\/final\/v1\/(?:listProductBySceneId|listProductByUnsold)$ url script-request-body https://raw.githubusercontent.com/Zz1xuan/ONE/refs/heads/main/Rewrite/AdBlock/DingDong/DingDongClearance.js

[mitm]
hostname = gw.api.ddxq.mobi

[task_local]
5,35 18-21 * * * https://raw.githubusercontent.com/Zz1xuan/ONE/refs/heads/main/Rewrite/AdBlock/DingDong/DingDongClearance.js, tag=叮咚晚间清仓, enabled=true
5 22 * * * https://raw.githubusercontent.com/Zz1xuan/ONE/refs/heads/main/Rewrite/AdBlock/DingDong/DingDongClearance.js, tag=叮咚晚间清仓收尾, enabled=true
*/

const NAME = "叮咚晚间清仓";
const KEY = "DINGDONG_CLEARANCE_REQUESTS";

(async () => {
  if (typeof $request !== "undefined") capture();
  else await query();
})().catch(error => $notify(NAME, "运行失败", String(error)))
  .finally(() => $done({}));

function capture() {
  const body = JSON.parse($request.body || "{}");
  const clearance = body.pageUuid === "0550e812a40c448e" && (
    body.sceneId === 107 && body.sortType === "CMS_DISCOUNT_MODULE" ||
    body.filterSceneId === 107
  );
  if (!clearance) return;

  const headers = {...$request.headers};
  for (const key of Object.keys(headers)) {
    if (["host", "content-length", "accept-encoding"].includes(key.toLowerCase())) delete headers[key];
  }

  let saved = JSON.parse($prefs.valueForKey(KEY) || "{}");
  const station = body.station_id;
  const type = body.filterSceneId === 107 ? "unsold" : "clearance";
  const replaced = Object.keys(saved).length > 0 && !saved[station];
  if (replaced) saved = {};
  saved[station] ||= {};
  saved[station][type] = {
    url: $request.url,
    headers,
    body: $request.body,
    capturedAt: Date.now()
  };
  $prefs.setValueForKey(JSON.stringify(saved), KEY);
  $notify(NAME, replaced ? "门店已自动替换" : "请求已保存", `点位：${station}\n类型：${type}`);
}

async function query() {
  const saved = JSON.parse($prefs.valueForKey(KEY) || "{}");
  const stations = Object.entries(saved);
  if (!stations.length) {
    $notify(NAME, "没有请求模板", "请分别切换点位并打开一次“清仓折扣”页面");
    return;
  }

  for (const [station, requests] of stations) {
    const products = [];
    for (const request of Object.values(requests)) {
      const response = await $task.fetch({
        method: "POST",
        url: request.url,
        headers: request.headers,
        body: request.body
      });
      const result = JSON.parse(response.body);
      if (!result.success) {
        $notify(NAME, `点位 ${station} 查询失败`, `${result.msg || `code=${result.code}`}\n请打开清仓页面刷新请求`);
        continue;
      }
      products.push(...(result.data?.productList || []));
    }

    const unique = [...new Map(products.map(product => [product.id, product])).values()];
    unique.sort((a, b) =>
      Number(a.off || 10) - Number(b.off || 10) ||
      Number(a.station_stock || 0) - Number(b.station_stock || 0)
    );

    if (!unique.length) {
      console.log(`[${NAME}] 点位 ${station}：暂无清仓商品`);
      $notify(NAME, `点位 ${station}`, "暂无清仓商品");
      continue;
    }

    const body = unique.map(product => [
      product.productName || product.name,
      `原价¥${product.originPrice}`,
      `折后¥${product.price}`,
      `${product.off}折`,
      `临期${product.extMap?.expiring_stock === "1" ? "是" : "否"}`,
      `库存${product.station_stock}`
    ].join("｜")).join("\n");
    console.log(`[${NAME}] 点位 ${station}：${unique.length} 件\n${body}`);
    $notify(NAME, `点位 ${station}：${unique.length} 件`, body);
  }
}
