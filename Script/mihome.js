$done({ 
  body: $response.body.replace(/"banners":{[^}]*},/,'')
});
