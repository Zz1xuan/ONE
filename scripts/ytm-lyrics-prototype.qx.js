/*

原型作者：Minis
用途：YouTube Music 歌词排障版。仅做重日志探针，不做外部歌词替换。

------------ Quantumult X 配置 ------------

[mitm]
hostname = youtubei.googleapis.com

[rewrite_local]
^https:\/\/youtubei\.googleapis\.com\/youtubei\/v1\/get_watch\?id= url script-response-body https://raw.githubusercontent.com/Zz1xuan/ONE/main/scripts/ytm-lyrics-prototype.qx.js
^https:\/\/youtubei\.googleapis\.com\/youtubei\/v1\/get_panel url script-response-body https://raw.githubusercontent.com/Zz1xuan/ONE/main/scripts/ytm-lyrics-prototype.qx.js

说明：
1. 这是一版排障脚本，优先输出尽量详细的日志。
2. 当前不做歌词替换，先把 get_watch / get_panel 的入口、歌词提取、候选匹配样本打全。
3. 适合把 QX 日志发回做下一步精确修正。

*/

const $ = new Env('YTM Lyrics Debug');

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
  $.log('===== GET_WATCH DEBUG =====');
  $.log(`url=${url}`);
  $.log(`videoId=${videoId || 'unknown'}`);
  $.log(`rawBytes=${raw.byteLength}`);

  const markers = [
    'music_watch_lyrics_panel',
    'music-lyrics-button',
    '歌词',
    'timed_lyrics_controller',
    'engagement',
    'music_detail_header',
    'related-panel',
    'comment-panel'
  ];
  for (const key of markers) $.log(`marker:${key} index=${text.indexOf(key)}`);

  const hints = extractContexts(text, ['music_watch_lyrics_panel','music-lyrics-button','歌词','music_detail_header','engagement']);
  hints.forEach((x, i) => {
    $.log(`context${i+1}.key=${x.key}`);
    $.log(`context${i+1}.text=${x.context}`);
  });

  const cands = collectReadableLines(text, 30);
  $.log(`watchReadableCandidates=${cands.length}`);
  cands.slice(0, 20).forEach((s, i) => $.log(`watchCand${i+1}=${s}`));
  return $.done({ bodyBytes: sliceBytes(raw) });
}

function handleGetPanel(url, raw, text) {
  $.log('===== GET_PANEL DEBUG =====');
  $.log(`url=${url}`);
  $.log(`rawBytes=${raw.byteLength}`);

  const anchors = [
    ['来源：LyricFind', 2600, 400],
    ['来源：', 2400, 400],
    ['LyricFind', 2600, 400],
    ['timed_lyrics_controller', 5200, 1200],
    ['lyric_line.eml-fe', 5600, 1400],
    ['music_watch_lyrics_panel', 6400, 1800]
  ];

  for (const [name] of anchors) $.log(`anchor:${name} index=${text.indexOf(name)}`);
  $.log(`marker:translateHandler index=${text.indexOf('TimedLyricsController_handleTranslateButtonTap')}`);
  $.log(`marker:pronunciationHandler index=${text.indexOf('TimedLyricsController_handlePronunciationButtonTap')}`);

  const blocks = [];
  for (const [name, before, after] of anchors) {
    const idx = text.indexOf(name);
    if (idx < 0) continue;
    const start = Math.max(0, idx - before);
    const end = Math.min(text.length, idx + after);
    const block = text.slice(start, end);
    const pairs = collectPairs(block, 40);
    const score = scorePairs(pairs);
    blocks.push({ name, idx, start, end, score, pairs });
  }
  blocks.sort((a,b) => b.score - a.score);
  $.log(`blockCount=${blocks.length}`);
  blocks.slice(0, 6).forEach((b, i) => {
    $.log(`block${i+1}.anchor=${b.name}`);
    $.log(`block${i+1}.idx=${b.idx}`);
    $.log(`block${i+1}.window=[${b.start},${b.end}]`);
    $.log(`block${i+1}.score=${b.score}`);
    $.log(`block${i+1}.pairs=${b.pairs.length}`);
  });

  const merged = mergePairs(blocks.flatMap(b => b.pairs));
  $.log(`mergedPairs=${merged.length}`);
  merged.slice(0, 20).forEach((p, i) => {
    $.log(`pair${i+1}.raw=${p.raw}`);
    $.log(`pair${i+1}.clean=${p.cleaned}`);
  });

  const zh = merged.filter(x => /[\u4E00-\u9FFF]/.test(x.cleaned));
  const nonZh = merged.filter(x => !/[\u4E00-\u9FFF]/.test(x.cleaned));
  $.log(`zhPairs=${zh.length}`);
  $.log(`nonZhPairs=${nonZh.length}`);
  zh.slice(0, 10).forEach((p, i) => $.log(`zh${i+1}=${p.cleaned}`));
  nonZh.slice(0, 10).forEach((p, i) => $.log(`nonZh${i+1}=${p.cleaned}`));

  const querySample = buildQuerySample(merged);
  $.log(`querySampleCount=${querySample.length}`);
  querySample.forEach((s, i) => $.log(`query${i+1}=${s}`));

  return $.done({ bodyBytes: sliceBytes(raw) });
}

function buildQuerySample(pairs) {
  const out = [];
  for (const p of pairs) {
    const s = p.cleaned;
    if (!s || s.length < 4) continue;
    if (/[^\p{L}\p{N}\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF\s'"(),.!?\-]/u.test(s)) continue;
    out.push(s);
    if (out.length >= 8) break;
  }
  return out;
}

function extractContexts(text, keys) {
  const out = [];
  for (const key of keys) {
    const idx = text.indexOf(key);
    if (idx < 0) continue;
    const s = Math.max(0, idx - 180);
    const e = Math.min(text.length, idx + 260);
    out.push({ key, context: compact(text.slice(s, e)) });
  }
  return out;
}

function collectReadableLines(text, limit) {
  const out = [];
  const seen = new Set();
  for (const part of text.split(/[\n\r\x00]/).map(s => s.trim()).filter(Boolean)) {
    const s = cleanLyricLine(part);
    if (!isLyricLine(s) || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
    if (out.length >= limit) break;
  }
  return out;
}

function collectPairs(block, limit) {
  const out = [];
  const seen = new Set();
  for (const raw of block.split(/[\n\r\x00]/).map(s => s.trim()).filter(Boolean)) {
    const cleaned = cleanLyricLine(raw);
    if (!isLyricLine(cleaned) || seen.has(cleaned)) continue;
    seen.add(cleaned);
    out.push({ raw: compact(raw), cleaned });
    if (out.length >= limit) break;
  }
  return out;
}

function mergePairs(arr) {
  const out = [];
  const seen = new Set();
  for (const p of arr) {
    if (seen.has(p.cleaned)) continue;
    seen.add(p.cleaned);
    out.push(p);
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

function cleanLyricLine(s) {
  return String(s || '')
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

function isLyricLine(s) {
  if (!s) return false;
  if (s.length < 2 || s.length > 100) return false;
  if (/music_watch_lyrics_panel|timed_lyrics|LyricFind|controller|button|panel|youtube|eml-fe|eml-js-fe|createTimedLyricsController|destroyTimedLyricsController/i.test(s)) return false;
  if (/^[A-Za-z0-9_\-|]{10,}$/.test(s)) return false;
  if (/^[\-–—_=+*/|\\:;,.]+$/.test(s)) return false;
  if (/^[^A-Za-z\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF0-9]+$/.test(s)) return false;
  return /[A-Za-z\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/.test(s);
}

function compact(s) {
  return String(s || '').replace(/[\u0000-\u001F]/g, ' ').replace(/\s{2,}/g, ' ').trim().slice(0, 220);
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
