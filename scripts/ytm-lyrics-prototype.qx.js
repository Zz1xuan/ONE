/*

YouTube Music no-lyrics panel replacement probe
目标：识别 get_panel 中“没有歌词”面板，并尝试用固定测试歌词替换文本内容。

[mitm]
hostname = youtubei.googleapis.com

[rewrite_local]
^https:\/\/youtubei\.googleapis\.com\/youtubei\/v1\/get_watch\?id= url script-response-body https://raw.githubusercontent.com/Zz1xuan/ONE/main/scripts/ytm-lyrics-prototype.qx.js
^https:\/\/youtubei\.googleapis\.com\/youtubei\/v1\/get_panel url script-response-body https://raw.githubusercontent.com/Zz1xuan/ONE/main/scripts/ytm-lyrics-prototype.qx.js

*/

const $ = new Env('YTM NoLyrics Replace');

(async () => {
  try {
    const url = $request.url || '';
    if (!$response || !$response.bodyBytes) return $.done({});
    const raw = new Uint8Array($response.bodyBytes);
    const text = safeDecode(raw);

    if (/youtubei\.googleapis\.com\/youtubei\/v1\/get_watch\?id=/.test(url)) {
      $.log('WATCH HIT');
      $.done({ bodyBytes: sliceBytes(raw) });
      return;
    }

    if (/youtubei\.googleapis\.com\/youtubei\/v1\/get_panel/.test(url)) {
      $.log('PANEL HIT');
      const noLyricsIdx = text.indexOf('没有歌词');
      $.log('noLyricsIdx=' + noLyricsIdx);
      if (noLyricsIdx < 0) {
        $.done({ bodyBytes: sliceBytes(raw) });
        return;
      }

      const tests = [
        ['没有歌词', '测试歌词'],
        ['歌词', '歌词'],
        ['查看歌词', '查看歌词']
      ];

      let replaced = 0;
      for (const [from, to] of tests) {
        const fromBytes = utf8Bytes(from);
        const toBytes = fitToByteLength(to, fromBytes.length);
        const hit = replaceFirstBytes(raw, fromBytes, toBytes);
        $.log(`tryReplace ${from} -> ${safeDecode(toBytes)} : ${hit.replaced ? 'hit@'+hit.index : 'miss'}`);
        if (hit.replaced) replaced++;
      }

      // also attempt to overwrite nearby text line with a visible marker
      const marker = '这首歌也要有词';
      const near = text.slice(Math.max(0, noLyricsIdx - 220), Math.min(text.length, noLyricsIdx + 220));
      const cands = near.split(/[\n\r\x00]/).map(s => s.trim()).filter(Boolean).filter(s => /[\u4E00-\u9FFF]/.test(s));
      $.log('nearCandidates=' + cands.length);
      cands.slice(0, 8).forEach((s, i) => $.log(`cand${i+1}=${s}`));
      for (const cand of cands) {
        if (cand.length < 2 || cand.length > 30) continue;
        const fromBytes = utf8Bytes(cand);
        const toBytes = fitToByteLength(marker, fromBytes.length);
        const hit = replaceFirstBytes(raw, fromBytes, toBytes);
        $.log(`tryCand ${cand} -> ${safeDecode(toBytes)} : ${hit.replaced ? 'hit@'+hit.index : 'miss'}`);
        if (hit.replaced) { replaced++; break; }
      }

      $.log('replaceCount=' + replaced);
      $.done({ bodyBytes: sliceBytes(raw) });
      return;
    }

    $.done({ bodyBytes: sliceBytes(raw) });
  } catch (e) {
    $.log('ERROR=' + String((e && e.stack) || e));
    $.done({ bodyBytes: $response.bodyBytes });
  }
})();

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
function safeDecode(u8) {
  try { return new TextDecoder('utf-8', { fatal:false }).decode(u8); }
  catch (e) {
    let s=''; for (let i=0;i<u8.length;i++) s += String.fromCharCode(u8[i]);
    try { return decodeURIComponent(escape(s)); } catch (_) { return s; }
  }
}
function sliceBytes(u8) { return u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength); }
function Env(name) { return { log: msg => console.log(`[${name}] ${msg}`), done: val => $done(val) }; }
