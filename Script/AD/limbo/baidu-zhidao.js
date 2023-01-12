let rHead = '<head>'
let newStyle = '<head><style>  .ec_ad_results{display:none!important} .ad-icon{display:none!important} .wpbyuwfarr-ecom-ads{display:none!important} div[class*=fc-][tplid]{display:none!important} .w-question-list[data-sign]{display:none!important} .ec-ad{display:none!important} </style>'
let body = $response.body.replace(rHead, newStyle);
$done({ body });
