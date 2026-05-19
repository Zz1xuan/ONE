/*

原型作者：Minis
用途：YouTube Music 歌词入口实验版（get_watch / get_panel）。
目标：先验证是否能在 get_watch 层识别/注入歌词入口；当前以日志探针为主，不强改结构。

------------ Quantumult X 配置 ------------

[mitm]
hostname = youtubei.googleapis.com

[rewrite_local]
^https:\/\/youtubei\.googleapis\.com\/youtubei\/v1\/get_watch\?id= url script-response-body https://raw.githubusercontent.com/Zz1xuan/ONE/main/scripts/ytm-lyrics-prototype.qx.js
^https:\/\/youtubei\.googleapis\.com\/youtubei\/v1\/get_panel url script-response-body https://raw.githubusercontent.com/Zz1xuan/ONE/main/scripts/ytm-lyrics-prototype.qx.js

说明：
1. 这是一版入口实验脚本，优先定位 get_watch 里的歌词入口字段。
2. 当前不尝试强注入复杂 protobuf 结构，只做探针和最小安全实验。
3. 后续确认入口结构后，再决定是否伪造 lyrics button / panel token。

*/

const $ = new Env('YTM Lyrics Entry Probe');

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
    $.log('Error: ' + String((e && e.stack) || e));
    return $.done({ bodyBytes: $response.bodyBytes });
  }
})();

function handleGetWatch(url, raw, text) {
  const videoId = (url.match(/[?&]id=([^&]+)/) || [,''])[1] || '';
  const hasLyricsPanel = text.includes('music_watch_lyrics_panel');
  const hasLyricsButton = text.includes('music-lyrics-button');
  const hasLyricsWord = text.includes('歌词');
  const hasTimedLyricsController = text.includes('timed_lyrics_controller');
  const lyricPanelPositions = collectPositions(text, ['music_watch_lyrics_panel','music-lyrics-button','歌词']);

  $.log('=== GET_WATCH ENTRY PROBE ===');
  $.log(`videoId: ${videoId || 'unknown'}`);
  $.log(`hasLyricsPanel: ${hasLyricsPanel}`);
  $.log(`hasLyricsButton: ${hasLyricsButton}`);
  $.log(`hasLyricsWord: ${hasLyricsWord}`);
  $.log(`hasTimedLyricsController: ${hasTimedLyricsController}`);
  lyricPanelPositions.forEach(x => $.log(`${x.key} @ ${x.index}`));

  if (!hasLyricsPanel && !hasLyricsButton && !hasLyricsWord) {
    $.log('WATCH RESULT: no visible lyrics entry markers in get_watch response');
    const hints = extractWatchHints(text);
    hints.forEach((h, i) => $.log(`hint ${i + 1}: ${h}`));
  } else {
    $.log('WATCH RESULT: lyrics entry markers already exist');
  }

  return $.done({ bodyBytes: sliceBytes(raw) });
}

function handleGetPanel(url, raw, text) {
  const hasLyricsPanel = text.includes('music_watch_lyrics_panel');
  const hasTimedLyricsController = text.includes('timed_lyrics_controller');
  const hasLyricFind = text.includes('LyricFind') || text.includes('来源：');

  $.log('=== GET_PANEL ENTRY PROBE ===');
  $.log(`hasLyricsPanel: ${hasLyricsPanel}`);
  $.log(`hasTimedLyricsController: ${hasTimedLyricsController}`);
  $.log(`hasLyricSourceMarker: ${hasLyricFind}`);

  return $.done({ bodyBytes: sliceBytes(raw) });
}

function collectPositions(text, keys) {
  const out = [];
  for (const key of keys) {
    const idx = text.indexOf(key);
    if (idx >= 0) out.push({ key, index: idx });
  }
  return out;
}

function extractWatchHints(text) {
  const out = [];
  const markers = [
    'engagement',
    'music_detail_header',
    'lyrics',
    'comment-panel',
    'music_watch',
    'related-panel'
  ];
  for (const key of markers) {
    const idx = text.indexOf(key);
    if (idx < 0) continue;
    const s = Math.max(0, idx - 120);
    const e = Math.min(text.length, idx + 220);
    const seg = text.slice(s, e).replace(/[\u0000-\u001F]/g, ' ').replace(/\s{2,}/g, ' ').trim();
    out.push(seg.slice(0, 220));
    if (out.length >= 6) break;
  }
  return out;
}

function safeDecode(u8) {
  try { return new TextDecoder('utf-8', { fatal: false }).decode(u8); }
  catch (e) {
    let s = '';
    for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
    try { return decodeURIComponent(escape(s)); } catch (_) { return s; }
  }
}
function sliceBytes(u8) { return u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength); }
function Env(name) { return { log: msg => console.log(`[${name}] ${msg}`), done: val => $done(val) }; }
