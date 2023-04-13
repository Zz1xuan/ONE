let body = JSON.parse($response.body);

delete body.admin;
delete body.home;

$done({ body: JSON.stringify(body) });
