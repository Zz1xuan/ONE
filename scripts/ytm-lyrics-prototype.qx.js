/*

原型作者：Minis
参考思路：Spotify 歌词增强类脚本写法
用途：识别 YouTube Music 歌词面板（get_panel），并进行第一阶段安全替换实验。

------------ Quantumult X 配置 ------------

[mitm]
hostname = youtubei.googleapis.com

[rewrite_local]
^https:\/\/youtubei\.googleapis\.com\/youtubei\/v1\/get_panel url script-response-body https://raw.githubusercontent.com/Zz1xuan/ONE/main/scripts/ytm-lyrics-prototype.qx.js

说明：
1. 这是一版 v5 实验脚本，会尝试替换命中的第一条歌词文本。
2. 采用“等字节长度替换”，不改 protobuf 结构长度，只做局部文本替换。
3. 当前目标不是成品增强，而是验证：改动歌词文本后，YTM 客户端是否仍能正常显示。
4. 若替换失败或未命中可安全替换的歌词行，脚本会原样放行。

*/

const $ = new Env('YTM Lyrics Prototype v5');

(async () => {
  try {
    if (!$response || !$response.bodyBytes) return $.done({});

    const url = $request.url || '';
    if (!/youtubei\.googleapis\.com\/youtubei\/v1\/get_panel/.test(url)) {
      return $.done({ bodyBytes: $response.bodyBytes });
    }

    let raw = new Uint8Array($response.bodyBytes);
    const text = safeDecode(raw);
    const probe = buildProbe(text);

    if (!probe.isLyricsPanel) {
      $.log('get_panel hit, but not lyrics panel');
      return $.done({ bodyBytes: $response.bodyBytes });
    }

    $.log('=== YTM lyrics panel detected (v5) ===');
    $.log(`rawBytes: ${raw.byteLength}`);
    $.log(`bestAnchor: ${probe.bestAnchor ? probe.bestAnchor.name : 'none'}`);
    $.log(`candidateLines: ${probe.linePairs.length}`);

    const target = pickReplacementTarget(probe.linePairs);
    if (!target) {
      $.log('No safe replacement target found, pass through unchanged');
      return $.done({ bodyBytes: raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength) });
    }

    $.log(`Target RAW: ${target.raw}`);
    $.log(`Target CLN: ${target.cleaned}`);

    const fromBytes = utf8Bytes(target.cleaned);
    const marker = buildMarker(fromBytes.length);
    const toBytes = utf8Bytes(marker);
    const hit = replaceFirstBytes(raw, fromBytes, toBytes);

    if (!hit.replaced) {
      $.log('Target text bytes not found in raw payload, pass through unchanged');
      return $.done({ bodyBytes: raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength) });
    }

    $.log(`Replaced bytes at offset ${hit.index}`);
    $.log(`Marker: ${marker}`);

    return $.done({ bodyBytes: raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength) });
  } catch (e) {
    $.log('Error: ' + String((e && e.stack) || e));
    return $.done({ bodyBytes: $response.bodyBytes });
  }
})();

function buildProbe(text) {
  const anchors = [
    ['来源：LyricFind', 1800, 200],
    ['来源：', 1600, 200],
    ['LyricFind', 1800, 200],
    ['timed_lyrics_controller', 3000, 600],
    ['lyric_line.eml-fe', 3200, 700],
    ['music_watch_lyrics_panel', 3600, 800]
  ];

  const isLyricsPanel = hasAny(text, [
    'music_watch_lyrics_panel',
    'timed_lyrics_controller',
    '来源：',
    'LyricFind',
    'lyric_line.eml-fe'
  ]);

  let bestAnchor = null;
  let bestScore = -1;
  const seen = new Set();
  const linePairs = [];

  for (const [name, before, after] of anchors) {
    const idx = text.indexOf(name);
    if (idx < 0) continue;
    const start = Math.max(0, idx - before);
    const end = Math.min(text.length, idx + after);
    const block = text.slice(start, end);
    const cand = collectPairs(block);
    const score = scorePairs(cand);
    if (score > bestScore) {
      bestScore = score;
      bestAnchor = { name, index: idx, start, end, score, candidates: cand };
    }
    for (const pair of cand) {
      if (seen.has(pair.cleaned)) continue;
      seen.add(pair.cleaned);
      linePairs.push(pair);
    }
  }

  return { isLyricsPanel, bestAnchor, linePairs };
}

function collectPairs(block) {
  const out = [];
  const seen = new Set();
  const parts = block.split(/[\n\r\x00]/).map(s => s.trim()).filter(Boolean);
  for (const raw of parts) {
    const cleaned = cleanLyricLine(raw);
    if (!isLyricLine(cleaned)) continue;
    if (seen.has(cleaned)) continue;
    seen.add(cleaned);
    out.push({ raw: compactRaw(raw), cleaned });
    if (out.length >= 30) break;
  }
  return out;
}

function scorePairs(pairs) {
  let score = 0;
  for (const p of pairs) {
    score += 3;
    if (/^[A-Za-z]/.test(p.cleaned)) score += 1;
    if (/[\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/.test(p.cleaned)) score += 1;
    if (/^[0-9]/.test(p.cleaned)) score -= 2;
    if (/[^\p{L}\p{N}\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF\s'"(),.!?\-]/u.test(p.cleaned)) score -= 2;
  }
  return score;
}

function pickReplacementTarget(pairs) {
  for (const p of pairs) {
    const s = p.cleaned;
    if (s.length < 6 || s.length > 60) continue;
    if (/^[0-9]/.test(s)) continue;
    if (/[^\p{L}\p{N}\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF\s'"(),.!?\-]/u.test(s)) continue;
    return p;
  }
  return null;
}

function cleanLyricLine(s) {
  return s
    .replace(/[\u0001-\u001F]/g, ' ')
    .replace(/[\x7F-\x9F]/g, ' ')
    .replace(/^["'`*%#,+.;:!?，。！？、\-_=|\\/\s]+/g, '')
    .replace(/["'`*%#,+.;:!?，。！？、\-_=|\\/\s]+$/g, '')
    .replace(/^[0-9](?=[A-Za-z])/g, '')
    .replace(/^[^\p{L}\p{N}\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]+/gu, '')
    .replace(/[^\p{L}\p{N}\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF：:，,。.!?！？'"（）()\-\s]+$/gu, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function compactRaw(s) {
  return s.replace(/[\u0000-\u001F]/g, ' ').replace(/\s{2,}/g, ' ').trim().slice(0, 120);
}

function isLyricLine(s) {
  if (!s) return false;
  if (s.length < 2 || s.length > 80) return false;
  if (/music_watch_lyrics_panel|timed_lyrics|LyricFind|controller|button|panel|youtube|eml-fe|eml-js-fe|createTimedLyricsController|destroyTimedLyricsController/i.test(s)) return false;
  if (/^[A-Za-z0-9_\-|]{10,}$/.test(s)) return false;
  if (/^[\-–—_=+*/|\\:;,.]+$/.test(s)) return false;
  if (/^[^A-Za-z\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF0-9]+$/.test(s)) return false;
  const cjk = /[\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/.test(s);
  const letter = /[A-Za-z]/.test(s);
  if (!cjk && !letter) return false;
  return true;
}

function buildMarker(byteLen) {
  const seed = '[V5-TEST]';
  let out = '';
  while (utf8Bytes(out).length < byteLen) out += seed;
  const bytes = utf8Bytes(out).slice(0, byteLen);
  return safeDecode(bytes);
}

function utf8Bytes(str) {
  return new TextEncoder().encode(str);
}

function replaceFirstBytes(haystack, needle, repl) {
  const idx = indexOfBytes(haystack, needle);
  if (idx < 0) return { replaced: false, index: -1 };
  if (needle.length !== repl.length) return { replaced: false, index: -1 };
  haystack.set(repl, idx);
  return { replaced: true, index: idx };
}

function indexOfBytes(haystack, needle) {
  outer: for (let i = 0; i <= haystack.length - needle.length; i++) {
    for (let j = 0; j < needle.length; j++) {
      if (haystack[i + j] !== needle[j]) continue outer;
    }
    return i;
  }
  return -1;
}

function safeDecode(u8) {
  try {
    return new TextDecoder('utf-8', { fatal: false }).decode(u8);
  } catch (e) {
    let s = '';
    for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
    try { return decodeURIComponent(escape(s)); } catch (_) { return s; }
  }
}

function hasAny(text, arr) {
  return arr.some(s => text.includes(s));
}

function Env(name) {
  return {
    log: msg => console.log(`[${name}] ${msg}`),
    done: val => $done(val)
  };
}
