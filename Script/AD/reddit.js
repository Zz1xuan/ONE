// 一佬
// Reddit 去广告 + 关 NSFW + 自动翻译

if (typeof $request !== 'undefined' && $request && $request.headers) {
  var headers = $request.headers;
  delete headers['x-reddit-translations'];
  delete headers['X-Reddit-Translations'];
  headers['x-reddit-translations'] = 'enabled, seo, zh-hans';
  $done({ headers: headers });
} else if (typeof $response !== 'undefined' && $response && $response.body) {
  function walk(value) {
    if (Array.isArray(value)) {
      var out = [];
      for (var i = 0; i < value.length; i++) {
        var next = walk(value[i]);
        if (next !== undefined) out.push(next);
      }
      return out;
    }

    if (value && typeof value === 'object') {
      for (var key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          var child = walk(value[key]);
          if (child === undefined) {
            delete value[key];
          } else {
            value[key] = child;
          }
        }
      }

      if (value.isNsfw === true) value.isNsfw = false;
      if (value.isNsfwMediaBlocked === true) value.isNsfwMediaBlocked = false;
      if (value.isNsfwContentShown === false) value.isNsfwContentShown = true;
      if (Array.isArray(value.commentsPageAds)) value.commentsPageAds = [];

      if (
        value.node &&
        typeof value.node === 'object' &&
        Array.isArray(value.node.cells) &&
        value.node.cells.some(function (cell) {
          return cell && (cell.__typename === 'AdMetadataCell' || cell.isAdPost === true);
        })
      ) {
        return undefined;
      }

      if (value.node && typeof value.node === 'object' && value.node.adPayload) {
        return undefined;
      }

      if (value.__typename === 'AdPost') {
        return undefined;
      }
    }

    return value;
  }

  try {
    var body = JSON.parse($response.body);
    $done({ body: JSON.stringify(walk(body)) });
  } catch (e) {
    console.log('reddit.js parse error: ' + e);
    $done({});
  }
} else {
  $done({});
}
