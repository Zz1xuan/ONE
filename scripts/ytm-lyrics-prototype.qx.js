/*

原型作者：Minis
参考思路：Spotify 歌词增强类脚本写法
用途：拦截 YouTube Music 歌词面板（get_panel），提取歌词行并进行真实翻译替换实验。

------------ Quantumult X 配置 ------------

[mitm]
hostname = youtubei.googleapis.com, translate.googleapis.com

[rewrite_local]
^https:\/\/youtubei\.googleapis\.com\/youtubei\/v1\/get_panel url script-response-body https://raw.githubusercontent.com/Zz1xuan/ONE/main/scripts/ytm-lyrics-prototype.qx.js

说明：
1. 这是一版 v6 实验脚本，会把命中的部分歌词行翻译成中文后回写到原歌词位置。
2. 采用“等字节长度替换”，不改 protobuf 结构长度，只做局部文本替换。
3. 若翻译失败、未命中可安全替换的歌词行，脚本会原样放行。
4. 当前默认最多替换 8 行，优先用于验证真实外部文本替换链路。

*/

const $ = new Env('YTM Lyrics Prototype v6');
const MAX_LINES = 8;

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
      return $.done({ bodyBytes: sliceBytes(raw) });
    }

    $.log('=== YTM lyrics panel detected (v6) ===');
    $.log(`rawBytes: ${raw.byteLength}`);
    $.log(`bestAnchor: ${probe.bestAnchor ? probe.bestAnchor.name : 'none'}`);
    $.log(`candidateLines: ${probe.linePairs.length}`);

    const targets = pickTargets(probe.linePairs, MAX_LINES);
    if (!targets.length) {
      $.log('No safe replacement targets found, pass through unchanged');
      return $.done({ bodyBytes: sliceBytes(raw) });
    }

    $.log(`Selected lines: ${targets.length}`);
    targets.forEach((t, i) => $.log(`${i + 1}. ${t.cleaned}`));

    const translated = await translateLines(targets.map(t => t.cleaned));
    if (!translated.length) {
      $.log('Translation returned empty result, pass through unchanged');
      return $.done({ bodyBytes: sliceBytes(raw) });
    }

    let replacedCount = 0;
    for (let i = 0; i < targets.length; i++) {
      const from = targets[i].cleaned;
      const toRaw = translated[i] || from;
      const toDisplay = normalizeTranslated(toRaw, from);
      if (!toDisplay || toDisplay === from) continue;

      const fromBytes = utf8Bytes(from);
      const toBytes = fitToByteLength(toDisplay, fromBytes.length);
      const hit = replaceFirstBytes(raw, fromBytes, toBytes);
      if (hit.replaced) {
        replacedCount++;
        $.log(`REPLACED ${replacedCount}: ${from} -> ${safeDecode(toBytes)} @ ${hit.index}`);
      } else {
        $.log(`MISS: ${from}`);
      }
    }

    $.log(`Total replaced: ${replacedCount}`);
    return $.done({ bodyBytes: sliceBytes(raw) });
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
      bestAnchor = { name, index: idx, score, count: cand.length };
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

function pickTargets(pairs, limit) {
  const out = [];
  for (const p of pairs) {
    const s = p.cleaned;
    if (s.length < 4 || s.length > 60) continue;
    if (/^[0-9]/.test(s)) continue;
    if (/[^\p{L}\p{N}\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF\s'"(),.!?\-]/u.test(s)) continue;
    if (/[\u4E00-\u9FFF]/.test(s) && !/[A-Za-z\u3040-\u30FF\uAC00-\uD7AF]/.test(s)) continue; // 跳过纯中文
    out.push(p);
    if (out.length >= limit) break;
  }
  return out;
}

async function translateLines(lines) {
  const q = lines.join('\n');
  const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=' + encodeURIComponent(q);
  const resp = await $task.fetch({ url, method: 'GET' });
  if (!resp || resp.statusCode !== 200) throw new Error('translate http failed');
  const data = JSON.parse(resp.body);
  const joined = (data[0] || []).map(x => x[0] || '').join('');
  const result = joined.split('\n');
  $.log(`Translation lines returned: ${result.length}`);
  return result;
}

function normalizeTranslated(s, original) {
  let out = String(s || '').trim();
  if (!out) return '';
  if (out === original) return out;
  out = out.replace(/\s{2,}/g, ' ');
  return out;
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

function utf8Bytes(str) {
  return new TextEncoder().encode(str);
}

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

function sliceBytes(u8) {
  return u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength);
}

function Env(name) {
  return {
    log: msg => console.log(`[${name}] ${msg}`),
    done: val => $done(val)
  };
}
