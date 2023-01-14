if (!$response.body) $done({});
const url = $request.url;
let obj = JSON.parse($response.body);

if (obj.data) {
  if (url.includes("/course3/api/sortable")) {
    if (obj.data.popup) delete obj.data.popup;
  }
}

body = JSON.stringify(obj);
$done({ body });
