/*

原型作者：Minis
参考思路：Spotify 歌词增强类脚本写法
用途：识别 YouTube Music 歌词面板（get_panel），提取可读歌词片段，当前版本仅输出日志，不改响应。

------------ Quantumult X 配置 ------------

[mitm]
hostname = youtubei.googleapis.com

[rewrite_local]
^https:\/\/youtubei\.googleapis\.com\/youtubei\/v1\/get_panel url script-response-body https://raw.githubusercontent.com/Zz1xuan/ONE/main/scripts/ytm-lyrics-prototype.qx.js

说明：
1. 这是一版原型脚本，先验证 YTM 歌词面板链路。
2. 当前仅识别 lyrics panel / timed lyrics controller，并输出歌词预览日志。
3. 后续版本再接入外部歌词源，做替换、翻译或双语增强。

*/

const $ = new Env('YTM Lyrics Prototype');
const isQX = typeof $task !== 'undefined';

(async () => {
  try {
    if (!$response || !$response.bodyBytes) return $.done({});

    const url = $request.url || '';
    if (!/youtubei\.googleapis\.com\/youtubei\/v1\/get_panel/.test(url)) {
      return $.done({ bodyBytes: $response.bodyBytes });
    }

    const raw = new Uint8Array($response.bodyBytes);
    const text = safeDecode(raw);

    const isLyricsPanel = text.includes('music_watch_lyrics_panel') || text.includes('timed_lyrics_controller') || text.includes('来源：LyricFind');

    if (!isLyricsPanel) {
      $.log('get_panel hit, but not lyrics panel');
      return $.done({ bodyBytes: $response.bodyBytes });
    }

    const snippets = extractLyricsSnippets(text);
    const meta = extractMeta(text);

    $.log('=== YTM lyrics panel detected ===');
    $.log(`URL: ${url}`);
    if (meta.source) $.log(`Source: ${meta.source}`);
    if (meta.hasTimedLyrics) $.log('Timed lyrics controller: true');
    if (snippets.length) {
      $.log('Lyrics preview:');
      snippets.slice(0, 12).forEach((line, i) => $.log(`${i + 1}. ${line}`));
    } else {
      $.log('No readable lyric lines extracted in this pass');
    }

    // Prototype stage: pass through unchanged.
    return $.done({ bodyBytes: $response.bodyBytes });
  } catch (e) {
    $.log('Error: ' + String(e && e.stack || e));
    return $.done({ bodyBytes: $response.bodyBytes });
  }
})();

function safeDecode(u8) {
  try {
    return new TextDecoder('utf-8', { fatal: false }).decode(u8);
  } catch (e) {
    let s = '';
    for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
    try { return decodeURIComponent(escape(s)); } catch (_) { return s; }
  }
}

function extractMeta(text) {
  const sourceMatch = text.match(/来源：([^\x00-\x1F]{1,40})/);
  return {
    source: sourceMatch ? sourceMatch[1] : '',
    hasTimedLyrics: text.includes('timed_lyrics_controller') || text.includes('timed_lyrics.eml-js-fe')
  };
}

function extractLyricsSnippets(text) {
  const lines = [];
  const seen = new Set();

  // Heuristic 1: extract around LyricFind source block
  const srcIdx = text.indexOf('来源：LyricFind');
  if (srcIdx > 0) {
    const block = text.slice(Math.max(0, srcIdx - 1200), srcIdx);
    pickReadableLines(block, lines, seen);
  }

  // Heuristic 2: extract around timed lyrics controller block
  const timedIdx = text.indexOf('timed_lyrics_controller');
  if (timedIdx > 0) {
    const block = text.slice(Math.max(0, timedIdx - 2200), timedIdx);
    pickReadableLines(block, lines, seen);
  }

  // Heuristic 3: whole-text fallback for CJK lyric-looking lines
  if (lines.length < 4) pickReadableLines(text.slice(0, 50000), lines, seen);

  return lines;
}

function pickReadableLines(block, lines, seen) {
  const parts = block
    .split(/[\n\r\x00]/)
    .map(s => s.trim())
    .filter(Boolean);

  for (const part of parts) {
    const s = cleanup(part);
    if (!isLyricLine(s)) continue;
    if (seen.has(s)) continue;
    seen.add(s);
    lines.push(s);
    if (lines.length >= 20) break;
  }
}

function cleanup(s) {
  return s
    .replace(/[\u0001-\u001F]/g, '')
    .replace(/^[^\p{L}\p{N}\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]+/gu, '')
    .replace(/[^\p{L}\p{N}\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF：:，,。.!?！？'"（）()\-\s]+$/gu, '')
    .trim();
}

function isLyricLine(s) {
  if (!s) return false;
  if (s.length < 2 || s.length > 40) return false;
  if (/music_watch_lyrics_panel|timed_lyrics|LyricFind|controller|button|panel|youtube|eml-fe|eml-js-fe/i.test(s)) return false;
  if (/^[A-Za-z0-9_\-|]{8,}$/.test(s)) return false;
  const cjk = /[\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/.test(s);
  const letter = /[A-Za-z]/.test(s);
  if (!cjk && !letter) return false;
  return true;
}

function Env(name) {
  return {
    log: (msg) => console.log(`[${name}] ${msg}`),
    done: (val) => $done(val)
  };
}
