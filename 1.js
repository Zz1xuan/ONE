if ($response.status === 200) {
  const body = JSON.parse($response.body);
  if (body && typeof body === "object") {
    if (body.home) {
      delete body.home;
      $done({ body: JSON.stringify(body) });
    } else {
      $done({});
    }
  } else {
    $done({});
  }
} else {
  $done({});
}
