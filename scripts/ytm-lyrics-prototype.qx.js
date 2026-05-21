/*

YouTube Music rewrite hit probe for Quantumult X
只验证 get_watch / get_panel 是否真的命中 script-response-body。

[mitm]
hostname = youtubei.googleapis.com

[rewrite_local]
^https:\/\/youtubei\.googleapis\.com\/youtubei\/v1\/get_watch\?id= url script-response-body https://raw.githubusercontent.com/Zz1xuan/ONE/main/scripts/ytm-lyrics-prototype.qx.js
^https:\/\/youtubei\.googleapis\.com\/youtubei\/v1\/get_panel url script-response-body https://raw.githubusercontent.com/Zz1xuan/ONE/main/scripts/ytm-lyrics-prototype.qx.js

*/

const $ = { log: s => console.log('[YTM HIT PROBE] ' + s), done: v => $done(v) };

try {
  const url = $request.url || '';
  const hasBody = !!($response && $response.bodyBytes);
  $.log('SCRIPT LOADED');
  $.log('URL=' + url);
  $.log('HAS_BODY=' + hasBody);

  if (/youtubei\.googleapis\.com\/youtubei\/v1\/get_watch\?id=/.test(url)) {
    $.log('WATCH HIT');
  } else if (/youtubei\.googleapis\.com\/youtubei\/v1\/get_panel/.test(url)) {
    $.log('PANEL HIT');
  } else {
    $.log('OTHER URL');
  }

  if ($response && $response.bodyBytes) {
    $.done({ bodyBytes: $response.bodyBytes });
  } else {
    $.done({});
  }
} catch (e) {
  $.log('ERROR=' + String(e && e.stack || e));
  if ($response && $response.bodyBytes) {
    $.done({ bodyBytes: $response.bodyBytes });
  } else {
    $.done({});
  }
}
