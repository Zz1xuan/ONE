// YouTube Music lyrics panel prototype for Quantumult X
// Purpose: intercept get_panel, detect lyrics panel, extract readable lyrics snippets, pass through unchanged.

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
