let rHead = '<head>'
let newStyle = '<head><style>  #foot, .recordcode, .index-copyright, div[style*=overflow], article, .rn-container, .s-loading-frame .bottom{display:none!important} </style>'
let body = $response.body.replace(rHead, newStyle);
$done({ body });
