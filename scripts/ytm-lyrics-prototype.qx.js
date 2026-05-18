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
1. 这是一版 v7 实验脚本，会把命中的部分歌词行翻译成中文后回写到原歌词位置。
2. 采用“等字节长度替换”，不改 protobuf 结构长度，只做局部文本替换。
3. 新增：翻译结果繁体转简体、空白规范化、替换目标筛选优化。
4. 若翻译失败、未命中可安全替换的歌词行，脚本会原样放行。

*/

const $ = new Env('YTM Lyrics Prototype v7');
const MAX_LINES = 8;

const T2S_MAP = {
  '臺':'台','萬':'万','與':'与','專':'专','業':'业','東':'东','絲':'丝','丟':'丢','兩':'两','嚴':'严','喪':'丧','個':'个','豐':'丰','臨':'临','為':'为','麗':'丽','舉':'举','麼':'么','義':'义','烏':'乌','樂':'乐','習':'习','鄉':'乡','書':'书','買':'买','亂':'乱','乾':'干','亂':'乱','爭':'争','於':'于','虧':'亏','雲':'云','亞':'亚','產':'产','畝':'亩','親':'亲','褻':'亵','嚐':'尝','億':'亿','僅':'仅','從':'从','侖':'仑','倉':'仓','儀':'仪','們':'们','價':'价','眾':'众','優':'优','會':'会','傘':'伞','偉':'伟','傳':'传','傷':'伤','倫':'伦','偽':'伪','體':'体','餘':'余','傢':'家','備':'备','傑':'杰','債':'债','傾':'倾','僞':'伪','儉':'俭','償':'偿','兒':'儿','兌':'兑','內':'内','兩':'两','冊':'册','寫':'写','軍':'军','農':'农','冠':'冠','冪':'幂','凍':'冻','減':'减','凱':'凯','別':'别','刪':'删','剛':'刚','創':'创','劃':'划','劇':'剧','劉':'刘','劍':'剑','劑':'剂','勁':'劲','動':'动','務':'务','勞':'劳','勢':'势','勳':'勋','勵':'励','勸':'劝','勻':'匀','匯':'汇','區':'区','醫':'医','協':'协','單':'单','賣':'卖','衛':'卫','卻':'却','厲':'厉','壓':'压','厭':'厌','厲':'厉','參':'参','雙':'双','發':'发','變':'变','敘':'叙','疊':'叠','葉':'叶','號':'号','嘆':'叹','嚇':'吓','嗎':'吗','啟':'启','喬':'乔','單':'单','喪':'丧','喲':'哟','嗆':'呛','嗚':'呜','嘗':'尝','嘩':'哗','團':'团','園':'园','圍':'围','國':'国','圖':'图','圓':'圆','塊':'块','塔':'塔','塗':'涂','塵':'尘','境':'境','墊':'垫','增':'增','壘':'垒','壞':'坏','壟':'垄','壩':'坝','士':'士','壯':'壮','聲':'声','壹':'壹','處':'处','備':'备','夠':'够','夢':'梦','夾':'夹','奪':'夺','奮':'奋','奧':'奥','奬':'奖','婦':'妇','媽':'妈','嫵':'妩','嬌':'娇','學':'学','寧':'宁','實':'实','審':'审','寫':'写','寶':'宝','將':'将','專':'专','導':'导','尋':'寻','對':'对','壽':'寿','屆':'届','層':'层','屬':'属','岡':'冈','島':'岛','峽':'峡','崗':'岗','嶺':'岭','嶽':'岳','巔':'巅','幣':'币','幹':'干','幾':'几','廣':'广','庫':'库','廁':'厕','廂':'厢','廈':'厦','廚':'厨','廝':'厮','廟':'庙','應':'应','廢':'废','廣':'广','張':'张','強':'强','彈':'弹','當':'当','錄':'录','彥':'彦','徑':'径','從':'从','復':'复','徵':'征','德':'德','憂':'忧','憐':'怜','態':'态','慘':'惨','慣':'惯','慶':'庆','憂':'忧','憤':'愤','願':'愿','慮':'虑','戲':'戏','戶':'户','拋':'抛','挾':'挟','捲':'卷','掃':'扫','掙':'挣','掛':'挂','採':'采','換':'换','據':'据','擁':'拥','擇':'择','擊':'击','擔':'担','據':'据','擠':'挤','擺':'摆','擴':'扩','攝':'摄','攜':'携','敵':'敌','數':'数','斂':'敛','斃':'毙','斬':'斩','斷':'断','於':'于','時':'时','晉':'晋','暈':'晕','暢':'畅','曆':'历','曉':'晓','書':'书','會':'会','東':'东','條':'条','來':'来','楊':'杨','極':'极','構':'构','槍':'枪','樣':'样','標':'标','樞':'枢','樹':'树','橋':'桥','機':'机','橫':'横','檔':'档','檢':'检','檯':'台','櫃':'柜','權':'权','歡':'欢','歲':'岁','歷':'历','歸':'归','殘':'残','殺':'杀','殼':'壳','毀':'毁','氣':'气','氫':'氢','漢':'汉','沖':'冲','決':'决','況':'况','沒':'没','溝':'沟','溫':'温','灣':'湾','濕':'湿','滅':'灭','滯':'滞','滿':'满','潛':'潜','澀':'涩','澤':'泽','濃':'浓','濟':'济','瀏':'浏','瀉':'泻','灑':'洒','灣':'湾','為':'为','烏':'乌','無':'无','煙':'烟','煩':'烦','熱':'热','愛':'爱','爺':'爷','牆':'墙','牽':'牵','犧':'牺','狀':'状','獨':'独','獎':'奖','獵':'猎','獸':'兽','獻':'献','現':'现','球':'球','瑪':'玛','環':'环','瓊':'琼','產':'产','畫':'画','當':'当','疇':'畴','痠':'酸','發':'发','皺':'皱','盃':'杯','盜':'盗','盞':'盏','監':'监','盤':'盘','眾':'众','眼':'眼','矚':'瞩','礎':'础','確':'确','碼':'码','磚':'砖','禮':'礼','禍':'祸','禪':'禅','離':'离','種':'种','稱':'称','穀':'谷','穩':'稳','穫':'获','窩':'窝','竄':'窜','競':'竞','筆':'笔','築':'筑','簡':'简','糧':'粮','約':'约','級':'级','紀':'纪','紋':'纹','納':'纳','純':'纯','紗':'纱','紙':'纸','級':'级','紮':'扎','細':'细','終':'终','組':'组','經':'经','綁':'绑','結':'结','絕':'绝','統':'统','絲':'丝','絨':'绒','絕':'绝','維':'维','綱':'纲','網':'网','綴':'缀','綠':'绿','緊':'紧','緒':'绪','線':'线','締':'缔','編':'编','緩':'缓','緣':'缘','縣':'县','縫':'缝','總':'总','績':'绩','織':'织','繞':'绕','繩':'绳','繪':'绘','羅':'罗','罰':'罚','罵':'骂','職':'职','聯':'联','聖':'圣','聞':'闻','聰':'聪','聲':'声','聳':'耸','聽':'听','肅':'肃','脅':'胁','脈':'脉','脫':'脱','臉':'脸','臺':'台','與':'与','興':'兴','舊':'旧','艙':'舱','艦':'舰','艱':'艰','藝':'艺','節':'节','範':'范','築':'筑','簽':'签','簾':'帘','簡':'简','類':'类','籃':'篮','糾':'纠','續':'续','纏':'缠','缽':'钵','罐':'罐','聶':'聂','臟':'脏','舉':'举','艸':'艹','蘇':'苏','處':'处','藍':'蓝','藏':'藏','藥':'药','藝':'艺','虛':'虚','蟲':'虫','號':'号','蠟':'蜡','襪':'袜','衛':'卫','補':'补','裝':'装','裡':'里','製':'制','複':'复','襲':'袭','見':'见','規':'规','視':'视','覺':'觉','覽':'览','觀':'观','觸':'触','計':'计','訂':'订','訊':'讯','討':'讨','訓':'训','記':'记','講':'讲','設':'设','訪':'访','訣':'诀','證':'证','評':'评','詞':'词','試':'试','詩':'诗','該':'该','詳':'详','誇':'夸','譽':'誉','誌':'志','認':'认','誤':'误','說':'说','誰':'谁','課':'课','調':'调','請':'请','諒':'谅','論':'论','諷':'讽','講':'讲','謝':'谢','謠':'谣','謹':'谨','證':'证','識':'识','譜':'谱','讀':'读','變':'变','讓':'让','豈':'岂','豐':'丰','貝':'贝','貞':'贞','負':'负','財':'财','責':'责','賢':'贤','敗':'败','帳':'帐','貨':'货','販':'贩','貪':'贪','貫':'贯','貼':'贴','貴':'贵','貸':'贷','費':'费','賀':'贺','賂':'赂','賄':'贿','資':'资','賊':'贼','賓':'宾','賞':'赏','賠':'赔','賴':'赖','賽':'赛','贈':'赠','贊':'赞','趕':'赶','趙':'赵','跡':'迹','踐':'践','車':'车','軌':'轨','軍':'军','軒':'轩','軟':'软','轉':'转','輪':'轮','輯':'辑','輸':'输','辦':'办','辭':'辞','農':'农','邊':'边','達':'达','遙':'遥','遞':'递','遠':'远','適':'适','遲':'迟','選':'选','遺':'遗','邏':'逻','郵':'邮','鄒':'邹','鄧':'邓','鄭':'郑','醜':'丑','醫':'医','釀':'酿','釋':'释','裡':'里','重':'重','鑒':'鉴','針':'针','釘':'钉','釣':'钓','鈔':'钞','鐘':'钟','鋼':'钢','錄':'录','錢':'钱','錦':'锦','錯':'错','鍋':'锅','鍵':'键','鎖':'锁','鎮':'镇','鏡':'镜','鐵':'铁','鑄':'铸','鑑':'鉴','長':'长','門':'门','閉':'闭','開':'开','閃':'闪','間':'间','閱':'阅','閣':'阁','隊':'队','陽':'阳','陰':'阴','陣':'阵','階':'阶','際':'际','隨':'随','險':'险','隱':'隐','難':'难','雖':'虽','雙':'双','雜':'杂','雞':'鸡','離':'离','電':'电','霧':'雾','靈':'灵','靜':'静','靦':'腼','韓':'韩','頁':'页','頂':'顶','頃':'顷','項':'项','順':'顺','須':'须','頑':'顽','頒':'颁','預':'预','領':'领','頸':'颈','頻':'频','顆':'颗','題':'题','額':'额','顏':'颜','顯':'显','風':'风','飛':'飞','飄':'飘','餅':'饼','養':'养','餓':'饿','館':'馆','饒':'饶','馬':'马','馮':'冯','駁':'驳','駐':'驻','駕':'驾','騎':'骑','騙':'骗','騷':'骚','驗':'验','驚':'惊','體':'体','髒':'脏','鬥':'斗','魚':'鱼','鮮':'鲜','鳥':'鸟','鳳':'凤','鳴':'鸣','鴨':'鸭','鷹':'鹰','麗':'丽','麥':'麦','黃':'黄','點':'点','黨':'党','齊':'齐','齒':'齿','龍':'龙'
};

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

    $.log('=== YTM lyrics panel detected (v7) ===');
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
    if (/[\u4E00-\u9FFF]/.test(s) && !/[A-Za-z\u3040-\u30FF\uAC00-\uD7AF]/.test(s)) continue;
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
  out = toSimplified(out);
  out = out.replace(/\s{2,}/g, ' ');
  out = out.replace(/[\u0000-\u001F]/g, '');
  out = out.trim();
  return out;
}

function toSimplified(str) {
  let out = '';
  for (const ch of String(str)) out += (T2S_MAP[ch] || ch);
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
