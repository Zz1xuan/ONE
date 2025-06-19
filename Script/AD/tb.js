// author:kokoryh

$done({body: $request.body.split(' ').filter(item => item !== 'heic.alicdn.com').join(' ')});