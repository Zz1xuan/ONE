const headers = $request.headers || {};

for (const key of Object.keys(headers)) {
  if (key.toLowerCase() === "accept-encoding") {
    delete headers[key];
  }
}

headers["Accept-Encoding"] = "gzip";

$done({ headers });
