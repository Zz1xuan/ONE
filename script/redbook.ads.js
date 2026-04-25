const $ = new Env('XHS-Ads-Pro');
const KEY_PHOTO = 'RedBookPhotoKey';
const KEY_VIDEO = 'RedBookVideoKey';
const url = $request.url || '';
let body = $response.body;

const SHARE_ENTRIES = [
  { type: 'video_download' },
  { type: 'generate_image' },
  { type: 'copy_link' },
  { type: 'native_voice' },
  { type: 'video_speed' },
  { type: 'dislike' },
  { type: 'report' },
  { type: 'video_feedback' }
];

const parse = (s, d = null) => { try { return JSON.parse(s); } catch { return d; } };
const dump = (o, d = body) => { try { return JSON.stringify(o); } catch { return d; } };
const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
const arr = (v) => Array.isArray(v) ? v : [];
const keyOf = (x) => String(x?.file_id || x?.trace_id || x?.live_photo_file_id || x?.url || JSON.stringify(x));

function listFrom(data) {
  if (Array.isArray(data)) return data;
  if (isObj(data) && Array.isArray(data.items)) return data.items;
  return [];
}

function stripGoods(m) {
  if (!isObj(m)) return;
  if ('related_goods_num' in m) m.related_goods_num = 0;
  if ('has_related_goods' in m) m.has_related_goods = false;
}

function unlockSave(m) {
  if (!isObj(m)) return;
  m.media_save_config = { disable_save: false, disable_watermark: true, disable_weibo_cover: true };
}

function forceShare(m) {
  if (!isObj(m)) return;
  if (!isObj(m.share_info)) m.share_info = {};
  m.share_info.function_entries = SHARE_ENTRIES.map((x) => ({ ...x }));
}

function enableEntriesByShare(share) {
  const entries = arr(share?.function_entries);
  entries.forEach((x) => {
    if (!isObj(x)) return;
    x.enable = true;
    if ('reason' in x) delete x.reason;
  });
}

function saveVideoCache(modules) {
  const old = parse($.read(KEY_VIDEO) || '[]', []);
  const cache = Array.isArray(old) ? old : [];
  const seen = new Set(cache.map((x) => String(x?.note_id || '')));
  modules.forEach((m) => {
    const noteId = m?.id;
    const master = m?.video_info_v2?.media?.stream?.h264?.[0]?.master_url;
    if (noteId && master && !seen.has(String(noteId))) {
      cache.push({ type: 2, note_id: noteId, download_url: master });
      seen.add(String(noteId));
    }
  });
  while (cache.length > 100) cache.shift();
  $.write(JSON.stringify(cache), KEY_VIDEO);
}

function savePhotoCache(items) {
  const old = parse($.read(KEY_PHOTO) || '[]', []);
  const pool = Array.isArray(old) ? old : [];
  items.forEach((m) => {
    if (Array.isArray(m?.image_list)) pool.push(...m.image_list);
    if (Array.isArray(m?.images_list)) pool.push(...m.images_list);
  });
  const seen = new Set();
  const uniq = [];
  pool.forEach((x) => {
    const k = keyOf(x);
    if (!seen.has(k)) { seen.add(k); uniq.push(x); }
  });
  while (uniq.length > 100) uniq.shift();
  $.write(JSON.stringify(uniq), KEY_PHOTO);
}

function inUrl(re) { return re.test(url); }

if (body) {
  const obj = parse(body, null);
  if (obj) {
    try {
      if (inUrl(/api\/sns\/v\d+\/note\/widgets/)) {
        obj.data = {};
      } else if (inUrl(/api\/sns\/v\d+\/note\/live_photo\/save/)) {
        const cache = parse($.read(KEY_PHOTO) || '[]', []);
        if (obj?.data && Array.isArray(cache)) obj.data.images_list = cache;
      } else if (inUrl(/api\/sns\/v\d+\/note\/video\/save/)) {
        const cache = parse($.read(KEY_VIDEO) || '[]', []);
        const hit = Array.isArray(cache) ? cache.find((x) => String(x?.note_id) === String(obj?.data?.note_id || '')) : null;
        if (hit) obj.data = hit;
      } else if (inUrl(/api\/sns\/v\d+\/note\/comment\/list/)) {
        arr(obj?.data?.comments).forEach((c) => {
          arr(c?.pictures).forEach((p) => {
            const u = p?.meme_package?.image_url;
            if (u) { p.url = u; p.origin_url = u; }
          });
        });
      } else if (inUrl(/api\/sns\/v\d+\/note\/redtube/)) {
        listFrom(obj?.data?.items || obj?.data).forEach((m) => {
          stripGoods(m); unlockSave(m); forceShare(m); enableEntriesByShare(m?.share_info);
        });
      } else if (inUrl(/api\/sns\/v\d+\/note\/(tabfeed|videofeed)/)) {
        const items = listFrom(obj?.data?.items || obj?.data);
        items.forEach((m) => {
          stripGoods(m); unlockSave(m); forceShare(m); enableEntriesByShare(m?.share_info);
        });
        saveVideoCache(items);
      } else if (inUrl(/api\/sns\/v\d+\/note\/feed/)) {
        arr(obj?.data).forEach((m) => {
          stripGoods(m);
          arr(m?.note_list).forEach(unlockSave);
          enableEntriesByShare(m?.share_info);
        });
      } else if (inUrl(/api\/sns\/v\d+\/note\/imagefeed/)) {
        const items = listFrom(obj?.data?.items || obj?.data);
        items.forEach((m) => { stripGoods(m); unlockSave(m); enableEntriesByShare(m?.share_info); });
        savePhotoCache(items);
      } else if (inUrl(/api\/sns\/v\d+\/homefeed\/categories/)) {
        const cs = arr(obj?.data?.categories);
        if (obj?.data) obj.data.categories = cs.filter((e) => e?.oid !== 'homefeed.shop' && e?.oid !== 'homefeed.live');
      } else if (inUrl(/api\/sns\/v\d+\/homefeed\//)) {
        const list = arr(obj?.data?.items || obj?.data);
        const filtered = list.filter((x) => !x?.is_ads && !x?.ads_info && x?.model_type !== 'live_v2');
        if (Array.isArray(obj?.data)) obj.data = filtered;
        else if (isObj(obj?.data) && Array.isArray(obj.data.items)) obj.data.items = filtered;
      } else if (inUrl(/api\/sns\/v\d+\/search\/notes\?/)) {
        const items = arr(obj?.data?.items);
        if (obj?.data) obj.data.items = items.filter((x) => !x?.ads_info && x?.model_type !== 'ads');
      } else if (inUrl(/api\/sns\/v\d+\/search\/hot_list/)) {
        obj.data = { scene: '', title: '', items: [], host: '', background_color: {}, word_request_id: '' };
      } else if (inUrl(/api\/sns\/v\d+\/search\/trending/)) {
        obj.data = { title: '', queries: [], type: '', word_request_id: '' };
      } else if (inUrl(/api\/sns\/v\d+\/search\/hint/)) {
        if (obj?.data?.hint_words) {
          obj.data.hint_words = [{ title: '搜索笔记', type: 'firstEnterOther#itemCfRecWord#搜索笔记#1', search_word: '搜索笔记' }];
        }
      } else if (inUrl(/api\/sns\/v\d+\/system_service\/splash_config/)) {
        arr(obj?.data?.ads_groups).forEach((g) => {
          g.start_time = '2208963661';
          g.end_time = '2209050061';
          arr(g.ads).forEach((a) => { a.start_time = '2208963661'; a.end_time = '2209050061'; });
        });
      } else if (inUrl(/api\/sns\/v\d+\/system_service\/config\?/)) {
        const keys = ['store', 'splash', 'loading_img', 'app_theme', 'cmt_words', 'highlight_tab'];
        if (isObj(obj?.data)) keys.forEach((k) => { if (k in obj.data) delete obj.data[k]; });
      }
      body = dump(obj);
    } catch (e) {
      $.log('xhs-handle-error:', String(e));
    }
  }
}

$done({ body });

function Env(name) {
  return {
    name,
    read(key) {
      if (typeof $persistentStore !== 'undefined') return $persistentStore.read(key);
      if (typeof $prefs !== 'undefined') return $prefs.valueForKey(key);
      return null;
    },
    write(val, key) {
      if (typeof $persistentStore !== 'undefined') return $persistentStore.write(val, key);
      if (typeof $prefs !== 'undefined') return $prefs.setValueForKey(val, key);
      return false;
    },
    log(...args) { console.log(args.join(' ')); }
  };
}
