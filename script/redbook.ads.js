const $ = new Env('XHS-Ads-Pro');

let body = $response.body;
const url = $request.url || '';

const KEY_PHOTO = 'RedBookPhotoKey';
const KEY_VIDEO = 'RedBookVideoKey';

function parseJSON(str, fallback = null) {
  try { return JSON.parse(str); } catch { return fallback; }
}
function stringify(obj, fallback = body) {
  try { return JSON.stringify(obj); } catch { return fallback; }
}
function isObj(v) { return v && typeof v === 'object' && !Array.isArray(v); }
function arr(v) { return Array.isArray(v) ? v : []; }
function toArrayMaybe(v) {
  if (Array.isArray(v)) return v;
  if (isObj(v) && Array.isArray(v.items)) return v.items;
  return [];
}
function setNoGoods(note) {
  if (!isObj(note)) return;
  if ('related_goods_num' in note) note.related_goods_num = 0;
  if ('has_related_goods' in note) note.has_related_goods = false;
}
function setSaveConfig(note) {
  if (!isObj(note)) return;
  note.media_save_config = {
    disable_save: false,
    disable_watermark: true,
    disable_weibo_cover: true
  };
}
function setShareEntries(note) {
  if (!isObj(note)) return;
  if (!isObj(note.share_info)) note.share_info = {};
  note.share_info.function_entries = [
    { type: 'video_download' },
    { type: 'generate_image' },
    { type: 'copy_link' },
    { type: 'native_voice' },
    { type: 'video_speed' },
    { type: 'dislike' },
    { type: 'report' },
    { type: 'video_feedback' }
  ];
}
function enableEntries(item) {
  if (!isObj(item) || !Array.isArray(item.function_entries)) return;
  item.function_entries.forEach((x) => {
    if (isObj(x)) {
      x.enable = true;
      if ('reason' in x) delete x.reason;
    }
  });
}
function saveVideoCacheFromModules(modules) {
  const cacheRaw = parseJSON($.read(KEY_VIDEO) || '[]', []);
  let cache = Array.isArray(cacheRaw) ? cacheRaw : [];
  const seen = new Set(cache.map((x) => String(x?.note_id || '')));
  modules.forEach((m) => {
    const master = m?.video_info_v2?.media?.stream?.h264?.[0]?.master_url;
    const noteId = m?.id;
    if (master && noteId && !seen.has(String(noteId))) {
      cache.push({ type: 2, note_id: noteId, download_url: master });
      seen.add(String(noteId));
    }
  });
  while (cache.length > 100) cache.shift();
  $.write(JSON.stringify(cache), KEY_VIDEO);
}

if (body) {
  let obj = parseJSON(body, null);
  if (obj) {
    switch (true) {
      case /api\/sns\/v\d+\/note\/widgets/.test(url): {
        try {
          obj.data = {};
          body = stringify(obj);
        } catch (e) { $.log('widgets:', String(e)); }
        break;
      }

      case /api\/sns\/v\d+\/note\/live_photo\/save/.test(url): {
        try {
          const cache = parseJSON($.read(KEY_PHOTO) || '[]', []);
          if (obj?.data) obj.data.images_list = Array.isArray(cache) ? cache : obj.data.images_list;
          body = stringify(obj);
        } catch (e) { $.log('live_photo:', String(e)); }
        break;
      }

      case /api\/sns\/v\d+\/note\/video\/save/.test(url): {
        try {
          const cache = parseJSON($.read(KEY_VIDEO) || '[]', []);
          const hit = Array.isArray(cache)
            ? cache.find((x) => String(x?.note_id) === String(obj?.data?.note_id || ''))
            : null;
          if (hit) obj.data = hit;
          body = stringify(obj);
        } catch (e) { $.log('video:', String(e)); }
        break;
      }

      case /api\/sns\/v\d+\/note\/comment\/list/.test(url): {
        try {
          const comments = arr(obj?.data?.comments);
          comments.forEach((m) => {
            const pics = arr(m?.pictures);
            pics.forEach((p) => {
              const u = p?.meme_package?.image_url;
              if (u) {
                p.url = u;
                p.origin_url = u;
              }
            });
          });
          body = stringify(obj);
        } catch (e) { $.log('comment:', String(e)); }
        break;
      }

      case /api\/sns\/v\d+\/note\/redtube/.test(url): {
        try {
          const items = toArrayMaybe(obj?.data?.items || obj?.data);
          items.forEach((m) => {
            setNoGoods(m);
            setSaveConfig(m);
            setShareEntries(m);
            enableEntries(m?.share_info || {});
          });
          body = stringify(obj);
        } catch (e) { $.log('redtube:', String(e)); }
        break;
      }

      case /api\/sns\/v\d+\/note\/(tabfeed|videofeed)/.test(url): {
        try {
          const items = toArrayMaybe(obj?.data?.items || obj?.data);
          items.forEach((m) => {
            setNoGoods(m);
            setSaveConfig(m);
            setShareEntries(m);
            enableEntries(m?.share_info || {});
          });
          saveVideoCacheFromModules(items);
          body = stringify(obj);
        } catch (e) { $.log('videofeed:', String(e)); }
        break;
      }

      case /api\/sns\/v\d+\/note\/feed/.test(url): {
        try {
          const modules = arr(obj?.data);
          modules.forEach((m) => {
            setNoGoods(m);
            if (Array.isArray(m?.note_list)) {
              m.note_list.forEach((item) => {
                setSaveConfig(item);
              });
            }
            enableEntries(m?.share_info || {});
          });
          body = stringify(obj);
        } catch (e) { $.log('feed:', String(e)); }
        break;
      }

      case /api\/sns\/v\d+\/note\/imagefeed/.test(url): {
        try {
          const cacheRaw = parseJSON($.read(KEY_PHOTO) || '[]', []);
          const cache = Array.isArray(cacheRaw) ? cacheRaw : [];
          const items = toArrayMaybe(obj?.data?.items || obj?.data);
          items.forEach((m) => {
            setNoGoods(m);
            setSaveConfig(m);
            if (Array.isArray(m?.image_list)) cache.push(...m.image_list);
            if (Array.isArray(m?.images_list)) cache.push(...m.images_list);
            enableEntries(m?.share_info || {});
          });
          const uniq = [];
          const seen = new Set();
          cache.forEach((x) => {
            const k = String(x?.file_id || x?.trace_id || x?.live_photo_file_id || x?.url || JSON.stringify(x));
            if (!seen.has(k)) { seen.add(k); uniq.push(x); }
          });
          while (uniq.length > 100) uniq.shift();
          $.write(JSON.stringify(uniq), KEY_PHOTO);
          body = stringify(obj);
        } catch (e) { $.log('imagefeed:', String(e)); }
        break;
      }

      case /api\/sns\/v\d+\/homefeed\//.test(url): {
        try {
          const list = arr(obj?.data?.items || obj?.data);
          const filtered = list.filter((x) => !x?.is_ads && !x?.ads_info && x?.model_type !== 'live_v2');
          if (Array.isArray(obj?.data)) obj.data = filtered;
          else if (isObj(obj?.data) && Array.isArray(obj.data.items)) obj.data.items = filtered;
          body = stringify(obj);
        } catch (e) { $.log('homefeed:', String(e)); }
        break;
      }

      case /api\/sns\/v\d+\/homefeed\/categories/.test(url): {
        try {
          const cs = arr(obj?.data?.categories);
          obj.data.categories = cs.filter((e) => e?.oid !== 'homefeed.shop' && e?.oid !== 'homefeed.live');
          body = stringify(obj);
        } catch (e) { $.log('categories:', String(e)); }
        break;
      }

      case /api\/sns\/v\d+\/search\/notes\?/.test(url): {
        try {
          const items = arr(obj?.data?.items);
          obj.data.items = items.filter((x) => !x?.ads_info && x?.model_type !== 'ads');
          body = stringify(obj);
        } catch (e) { $.log('search.notes:', String(e)); }
        break;
      }

      case /api\/sns\/v\d+\/search\/hot_list/.test(url): {
        try {
          obj.data = {
            scene: '',
            title: '',
            items: [],
            host: '',
            background_color: {},
            word_request_id: ''
          };
          body = stringify(obj);
        } catch (e) { $.log('hot_list:', String(e)); }
        break;
      }

      case /api\/sns\/v\d+\/search\/trending/.test(url): {
        try {
          obj.data = { title: '', queries: [], type: '', word_request_id: '' };
          body = stringify(obj);
        } catch (e) { $.log('trending:', String(e)); }
        break;
      }

      case /api\/sns\/v\d+\/search\/hint/.test(url): {
        try {
          if (obj?.data?.hint_words) {
            obj.data.hint_words = [{
              title: '搜索笔记',
              type: 'firstEnterOther#itemCfRecWord#搜索笔记#1',
              search_word: '搜索笔记'
            }];
          }
          body = stringify(obj);
        } catch (e) { $.log('hint:', String(e)); }
        break;
      }

      case /api\/sns\/v\d+\/system_service\/splash_config/.test(url): {
        try {
          const groups = arr(obj?.data?.ads_groups);
          groups.forEach((g) => {
            g.start_time = '2208963661';
            g.end_time = '2209050061';
            arr(g.ads).forEach((a) => {
              a.start_time = '2208963661';
              a.end_time = '2209050061';
            });
          });
          body = stringify(obj);
        } catch (e) { $.log('splash_config:', String(e)); }
        break;
      }

      case /api\/sns\/v\d+\/system_service\/config\?/.test(url): {
        try {
          const keys = ['store', 'splash', 'loading_img', 'app_theme', 'cmt_words', 'highlight_tab'];
          if (isObj(obj?.data)) keys.forEach((k) => { if (k in obj.data) delete obj.data[k]; });
          body = stringify(obj);
        } catch (e) { $.log('system_config:', String(e)); }
        break;
      }

      default:
        break;
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
