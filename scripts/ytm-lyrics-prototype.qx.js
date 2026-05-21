/*

原型作者：Minis
用途：YouTube Music 无歌词入口注入实验版。
目标：仅针对 get_watch 层“原本没有歌词入口”的歌曲，尝试做最小字符串级入口伪造实验；已有歌词的歌曲保持原样。

------------ Quantumult X 配置 ------------

[mitm]
hostname = youtubei.googleapis.com

[rewrite_local]
^https:\/\/youtubei\.googleapis\.com\/youtubei\/v1\/get_watch\?id= url script-response-body https://raw.githubusercontent.com/Zz1xuan/ONE/main/scripts/ytm-lyrics-prototype.qx.js
^https:\/\/youtubei\.googleapis\.com\/youtubei\/v1\/get_panel url script-response-body https://raw.githubusercontent.com/Zz1xuan/ONE/main/scripts/ytm-lyrics-prototype.qx.js

说明：
1. 已有歌词入口的歌：原样放行，只打日志。
2. 没有歌词入口的歌：尝试把 comment-panel / text_bubble 等邻近标记替换成 lyrics 标记，验证客户端是否出现歌词入口。
3. 这是入口实验，不保证成功；请把日志回传用于下一步修正。

*/

const $ = new Env('YTM Lyrics Entry Inject');

(async () => {
  try {
    const url = $request.url || '';
    if (!$response || !$response.bodyBytes) return $.done({});
    const raw = new Uint8Array($response.bodyBytes);
    const text = safeDecode(raw);

    if (/youtubei\.googleapis\.com\/youtubei\/v1\/get_watch\?id=/.test(url)) {
      return handleGetWatch(url, raw, text);
    }
    if (/youtubei\.googleapis\.com\/youtubei\/v1\/get_panel/.test(url)) {
      return handleGetPanel(url, raw, text);
    }
    return $.done({ bodyBytes: sliceBytes(raw) });
  } catch (e) {
    $.log('FATAL: ' + String((e && e.stack) || e));
    return $.done({ bodyBytes: $response.bodyBytes });
  }
})();

function handleGetWatch(url, raw, text) {
  const videoId = (url.match(/[?&]id=([^&]+)/) || [,''])[1] || '';
  const hasLyricsPanel = text.includes('music_watch_lyrics_panel');
  const hasLyricsButton = text.includes('music-lyrics-button');
  const hasLyricsWord = text.includes('歌词');

  $.log('===== GET_WATCH INJECT =====');
  $.log(`videoId=${videoId || 'unknown'}`);
  $.log(`rawBytes=${raw.byteLength}`);
  $.log(`hasLyricsPanel=${hasLyricsPanel}`);
  $.log(`hasLyricsButton=${hasLyricsButton}`);
  $.log(`hasLyricsWord=${hasLyricsWord}`);

  if (hasLyricsPanel || hasLyricsButton || hasLyricsWord) {
    $.log('WATCH RESULT: lyrics entry already exists, keep unchanged');
    return $.done({ bodyBytes: sliceBytes(raw) });
  }

  const candidates = [
    ['music-comment-panel', 'music_watch_lyrics_panel'],
    ['text_bubble_24pt', 'quote_24pt'],
    ['评论', '歌词'],
    ['查看 1 条评论', '查看歌词'],
    ['comment-panel', 'lyrics_panel']
  ];

  let replaced = 0;
  for (const [from, to] of candidates) {
    const fromBytes = utf8Bytes(from);
    const toBytes = fitToByteLength(to, fromBytes.length);
    const hit = replaceFirstBytes(raw, fromBytes, toBytes);
    $.log(`tryReplace ${from} -> ${safeDecode(toBytes)} : ${hit.replaced ? 'hit@'+hit.index : 'miss'}`);
    if (hit.replaced) replaced++;
  }

  // log nearby contexts for review
  const hints = extractContexts(text, ['music-comment-panel','comment-panel','评论','text_bubble_24pt']);
  hints.forEach((x, i) => {
    $.log(`context${i+1}.key=${x.key}`);
    $.log(`context${i+1}.text=${x.context}`);
  });

  $.log(`injectReplaceCount=${replaced}`);
  return $.done({ bodyBytes: sliceBytes(raw) });
}

function handleGetPanel(url, raw, text) {
  $.log('===== GET_PANEL TRACE =====');
  $.log(`rawBytes=${raw.byteLength}`);
  $.log(`hasLyricsPanel=${text.includes('music_watch_lyrics_panel')}`);
  $.log(`hasTimedLyricsController=${text.includes('timed_lyrics_controller')}`);
  $.log(`hasLyricFind=${text.includes('LyricFind') || text.includes('来源：')}`);
  return $.done({ bodyBytes: sliceBytes(raw) });
}

function extractContexts(text, keys) {
  const out = [];
  for (const key of keys) {
    const idx = text.indexOf(key);
    if (idx < 0) continue;
    const s = Math.max(0, idx - 160);
    const e = Math.min(text.length, idx + 260);
    out.push({ key, context: compact(text.slice(s, e)) });
  }
  return out;
}

function utf8Bytes(str) { return new TextEncoder().encode(str); }
function fitToByteLength(str, byteLen) {
  let out = str;
  while (utf8Bytes(out).length > byteLen && out.length > 0) out = out.slice(0, -1);
  while (utf8Bytes(out).length < byteLen) out += ' ';
  let bytes = utf8Bytes(out);
  if (bytes.length > byteLen) bytes = bytes.slice(0, byteLen);
  if (bytes.length < byteLen) {
    const pad = new Uint8Array(byteLen);
    pad.set(bytes, 0);
    for (let i = bytes.length; i < byteLen; i++) pad[i] = 32;
    bytes = pad;
  }
  return bytes;
}
function replaceFirstBytes(haystack, needle, repl) {
  const idx = indexOfBytes(haystack, needle);
  if (idx < 0 || needle.length !== repl.length) return { replaced:false, index:-1 };
  haystack.set(repl, idx);
  return { replaced:true, index:idx };
}
function indexOfBytes(haystack, needle) {
  outer: for (let i = 0; i <= haystack.length - needle.length; i++) {
    for (let j = 0; j < needle.length; j++) if (haystack[i+j] !== needle[j]) continue outer;
    return i;
  }
  return -1;
}
function compact(s) { return String(s||'').replace(/[\u0000-\u001F]/g,' ').replace(/\s{2,}/g,' ').trim().slice(0,240); }
function safeDecode(u8) {
  try { return new TextDecoder('utf-8', { fatal:false }).decode(u8); }
  catch (e) {
    let s='';
    for (let i=0;i<u8.length;i++) s += String.fromCharCode(u8[i]);
    try { return decodeURIComponent(escape(s)); } catch (_) { return s; }
  }
}
function sliceBytes(u8) { return u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength); }
function Env(name) { return { log: msg => console.log(`[${name}] ${msg}`), done: val => $done(val) }; }
