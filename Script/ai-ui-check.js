/**
 * AI 节点检测 v1.1.0 — Quantumult X event-interaction
 * 原创实现；交互形式参考 KOP-XIAO/QuantumultX streaming-ui-check.js。
 * 不读取或捕获账号、Cookie 或真实 API Key，不发送推理请求，不查询第三方 IP 库。
 * 建议 QX build 934+：显式关闭自动 Cookie；更旧版本可能忽略该选项。
 * 仅检测选中节点的入口响应；网页/API/账号/模型权限不是同一件事。
 *
 * [task_local]
 * event-interaction https://raw.githubusercontent.com/Zz1xuan/ONE/main/Script/ai-ui-check.js, tag=AI-节点检测, img-url=checkmark.seal.system, enabled=true
 *
 * 在节点或策略组的交互菜单中运行。须支持 $environment.params、$task.fetch。
 * API 返回结构化鉴权错误仅证明到达鉴权入口，不能证明地区资格或实际调用成功。
 * CDN Trace 仅显示该域名观察到的出口地区，不参与解锁判断。
 */
(function () {
  'use strict';
  const TITLE = 'AI 节点检测';
  const TIMEOUT = 6000;
  const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
  const providers = [
    { name: 'ChatGPT / OpenAI', web: 'https://chatgpt.com/', api: 'https://api.openai.com/v1/models', trace: 'https://chatgpt.com/cdn-cgi/trace', kind: 'openai' },
    { name: 'Claude / Anthropic', web: 'https://claude.ai/', api: 'https://api.anthropic.com/v1/messages', trace: 'https://claude.ai/cdn-cgi/trace', kind: 'anthropic', method: 'POST', body: '{}', headers: { 'content-type': 'application/json', 'anthropic-version': '2023-06-01' } },
    { name: 'Gemini', web: 'https://gemini.google.com/', api: 'https://generativelanguage.googleapis.com/v1beta/models?key=invalid', kind: 'gemini' },
    { name: 'Grok / xAI', web: 'https://grok.com/', api: 'https://api.x.ai/v1/models', trace: 'https://grok.com/cdn-cgi/trace', kind: 'xai' }
  ];
  let finished = false;
  let deadline;
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  function end(html) {
    if (finished) return;
    finished = true;
    if (deadline) clearTimeout(deadline);
    $done({ title: TITLE, htmlMessage: '<p style="text-align:center;font-family:-apple-system;font-size:14px;line-height:1.5;margin:0;padding:8px 0">' + html + '</p>' });
  }
  function limited(promise, ms) {
    return new Promise(function (resolve, reject) {
      const timer = setTimeout(function () { reject(new Error('timeout')); }, ms);
      Promise.resolve(promise).then(function (v) { clearTimeout(timer); resolve(v); }, function (e) { clearTimeout(timer); reject(e); });
    });
  }
  // 白名单按服务/通道隔离，不能从网页跳至 API 或任意同后缀子域。
  const WEB_HOSTS = {
    openai: ['chatgpt.com', 'auth.openai.com'],
    anthropic: ['claude.ai'], gemini: ['gemini.google.com', 'accounts.google.com'],
    xai: ['grok.com']
  };
  function safeURL(value, base, hosts) {
    if (typeof value !== 'string' || !value || value.length > 8192 || /[\\\s\x00-\x1f\x7f]/.test(value)) return null;
    let target = value.split('#')[0];
    if (!target && base) target = base.split('#')[0];
    const origin = base && base.match(/^https:\/\/([^/?#]+)([^?#]*)/);
    if (target.slice(0, 2) === '//') target = 'https:' + target;
    else if (!/^https:\/\//i.test(target)) {
      if (!origin || /^[^/?#]*:/.test(target)) return null;
      const path = origin[2] || '/';
      if (!target) target = path;
      else if (target[0] === '?') target = path + target;
      else if (target[0] !== '/') target = path.slice(0, path.lastIndexOf('/') + 1) + target;
      target = 'https://' + origin[1] + target;
    }
    const m = target.match(/^https:\/\/([a-z0-9.-]+)(\/[^#]*|\?[^#]*)?$/i);
    if (!m || hosts.indexOf(m[1].toLowerCase()) < 0) return null;
    const rest = m[2] || '/';
    const parts = rest.split('?'), stack = [];
    (parts[0] || '/').split('/').forEach(function (part) {
      const dot = part.replace(/%2e/ig, '.');
      if (dot === '..') { if (stack.length > 1) stack.pop(); }
      else if (dot !== '.') stack.push(part);
    });
    let path = stack.join('/');
    if (/(?:^|\/)(?:\.|%2e|\.\.|\.%2e|%2e\.|%2e%2e)$/i.test(parts[0])) path += '/';
    if (path[0] !== '/') path = '/' + path;
    return { url: 'https://' + m[1].toLowerCase() + path + (parts.length > 1 ? '?' + parts.slice(1).join('?') : ''), host: m[1].toLowerCase(), path: path };
  }
  function log(text) {
    if (typeof console !== 'undefined' && console.log) console.log('[AI] ' + text);
  }
  async function fetchVia(url, policy, extra, hosts) {
    const start = Date.now(), seen = {};
    let current = safeURL(url, null, hosts), method = extra && extra.method || 'GET';
    function failed(reason) { return { code: 0, body: '', headers: {}, ms: Date.now() - start, error: reason }; }
    for (let hop = 0; hop <= 2; hop++) {
      if (finished) return failed('stopped');
      if (!current || seen[current.url]) { log('redirect rejected/loop'); return failed('redirect'); }
      seen[current.url] = true;
      const req = Object.assign({ method: method }, extra || {}, { url: current.url, method: method });
      req.headers = Object.assign({ 'User-Agent': UA, 'Accept': '*/*' }, req.headers || {});
      req['auto-cookie'] = false;
      req.opts = { policy: policy, redirection: false };
      const remaining = TIMEOUT - (Date.now() - start);
      if (remaining <= 0) return failed('timeout');
      try {
        const r = await limited($task.fetch(req), remaining);
        const headers = {};
        Object.keys(r.headers || {}).forEach(function (k) { headers[k.toLowerCase()] = String(r.headers[k]); });
        const code = Number(r.statusCode);
        log(current.host + current.path + ' status=' + code);
        if ([301, 302, 303, 307, 308].indexOf(code) >= 0) {
          const next = safeURL(headers.location, current.url, hosts);
          log('redirect host=' + (next ? next.host : 'rejected'));
          if (hop === 2 || !next) return failed('redirect');
          if (code === 303 || ((code === 301 || code === 302) && method === 'POST')) { method = 'GET'; extra = {}; }
          current = next;
          continue;
        }
        return { code: code, body: String(r.body || ''), headers: headers, ms: Date.now() - start, url: current.url, host: current.host, path: current.path };
      } catch (e) {
        const message = String(e && (e.error || e.message) || e);
        return failed(/timeout|timed out/i.test(message) ? 'timeout' : 'network');
      }
    }
    return failed('redirect');
  }
  function result(type, text, r) { return { type: type, text: text, code: r.code, ms: r.ms }; }
  function classify(r, channel, kind) {
    const b = r.body, c = r.code;
    let j;
    try { j = JSON.parse(b); } catch (_) { j = null; }
    const obj = j && typeof j === 'object' && !Array.isArray(j) ? j : null;
    const err = obj && obj.error && typeof obj.error === 'object' && !Array.isArray(obj.error) ? obj.error : null;
    function verdict(type, text, rule) { log(kind + '/' + channel + ' rule=' + rule); return result(type, text, r); }
    if (!c) return verdict('unknown', r.error === 'timeout' ? '检测超时' : r.error === 'redirect' ? '跳转未确认' : '网络 / TLS 异常', r.error || 'network');
    if (c >= 500) return verdict('unknown', '服务端异常', 'server');
    if (r.headers['cf-mitigated'] === 'challenge' || /<title[^>]*>\s*(just a moment|attention required)(?:[.!…\s<])/i.test(b)) return verdict('warn', '安全验证 / WAF 拦截', 'challenge');
    if (c === 429) return verdict('warn', '请求限流，暂无法确认', 'rate');
    const geoCode = err && (err.code || err.type);
    const geo = err && c >= 400 && c < 500 && (
      /^(unsupported_country_region_territory|country_not_supported|region_not_supported)$/.test(String(geoCode || '')) ||
      (kind === 'gemini' && c === 400 && err.status === 'FAILED_PRECONDITION' && /^User location is not supported for the API use\.?$/.test(err.message || '')));
    if (geo) return verdict('blocked', '明确地区限制', 'structured-region');
    if (channel === 'api') {
      const type = err && String(err.type || err.code || '');
      const msg = err && String(err.message || '');
      const openai = kind === 'openai' && c === 401 && err && (type === 'invalid_api_key' || type === 'authentication_error' || /^You didn.t provide an API key\./.test(msg));
      const anthropic = kind === 'anthropic' && c === 401 && obj && obj.type === 'error' && err && type === 'authentication_error';
      const gemini = kind === 'gemini' && c === 400 && err && err.status === 'INVALID_ARGUMENT' && Array.isArray(err.details) && err.details.some(function (d) { return d && d['@type'] === 'type.googleapis.com/google.rpc.ErrorInfo' && d.reason === 'API_KEY_INVALID' && d.domain === 'googleapis.com'; });
      // 公开 GET /v1/models 的真实 401 结构（2026-10-30 无凭据采样）；不泛化任意 401。
      const xai = kind === 'xai' && c === 401 && obj && obj.code === 'unauthenticated:no-credentials' && obj.error === 'No credentials presented.';
      if (openai || anthropic || gemini || xai) return verdict('edge', '鉴权入口可达（未验证调用）', 'structured-auth');
      const listOK = obj && !obj.error && (kind === 'gemini' ? Array.isArray(obj.models) : (kind === 'openai' || kind === 'xai') && obj.object === 'list' && Array.isArray(obj.data));
      if (c >= 200 && c < 300 && listOK) return verdict('edge', '模型列表入口可达（未验证调用）', 'model-list');
    }
    if (c === 403) return verdict('warn', '访问被拒绝，原因待确认', 'forbidden');
    if (channel === 'web' && c >= 200 && c < 300 && /<(?:!doctype html|html|head|body)[\s>]/i.test(b)) {
      if (r.host === 'accounts.google.com' || r.host === 'auth.openai.com' || /\/(login|log-in|signin|sign-in)(?:\/|$)/i.test(r.path || '') || /<input\b[^>]*type\s*=\s*["']?password["'\s>]/i.test(b)) return verdict('login', '需登录（未验证资格）', 'login-page');
      return verdict('web', '网页有响应（未验证登录 / 对话）', 'html-response');
    }
    return verdict('unknown', '响应待确认', 'unrecognized');
  }
  function traceRegion(r, expectedHost) {
    if (!r || r.code !== 200 || !expectedHost || r.host !== expectedHost || r.path !== '/cdn-cgi/trace' || r.body.length > 4096) return '';
    const fields = {}, lines = r.body.trim().split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/^([a-z_]+)=([^\r\n]*)$/);
      if (!m || Object.prototype.hasOwnProperty.call(fields, m[1])) return '';
      fields[m[1]] = m[2];
    }
    const loc = /^[A-Z]{2}$/.test(fields.loc || '') && fields.loc !== 'XX' && fields.loc !== 'ZZ' ? fields.loc : '';
    const valid = fields.h === expectedHost && !!fields.ip && /^\d+(?:\.\d+)?$/.test(fields.ts || '') && !!fields.fl;
    if (valid && loc) log(expectedHost + ' trace-country=' + loc);
    return valid ? loc : '';
  }
  function format(r) {
    const colors = { edge: '#16803c', web: '#16803c', blocked: '#c0392b', warn: '#a86b00', unknown: '#777777' };
    let label = '待确认';
    if (r.type === 'edge') label = /模型列表/.test(r.text) ? '列表可达' : '鉴权可达';
    else if (r.type === 'login') label = '需登录';
    else if (r.type === 'web') label = '有响应';
    else if (r.type === 'blocked') label = '地区受限';
    else if (/安全验证/.test(r.text)) label = '需验证';
    else if (/重定向|跳转/.test(r.text)) label = '跳转';
    else if (/限流/.test(r.text)) label = '限流';
    else if (/超时/.test(r.text)) label = '超时';
    else if (/网络/.test(r.text)) label = '网络异常';
    else if (r.code === 403) label = '拒绝访问';
    else if (r.code >= 500) label = '服务异常';
    else if (/地区|限制页面/.test(r.text)) label = '疑似限制';
    return '<font color="' + (colors[r.type] || colors.unknown) + '">' + label + '</font>';
  }
  async function runProvider(p, policy) {
    const webHosts = WEB_HOSTS[p.kind];
    const apiHost = p.api.match(/^https:\/\/([^/]+)/)[1];
    const webHost = p.web.match(/^https:\/\/([^/]+)/)[1];
    const responses = await Promise.all([
      fetchVia(p.web, policy, null, webHosts),
      fetchVia(p.api, policy, { method: p.method || 'GET', headers: p.headers || {}, ...(p.body ? { body: p.body } : {}) }, [apiHost]),
      p.trace ? fetchVia(p.trace, policy, null, [webHost]) : Promise.resolve(null)
    ]);
    return { name: p.name, web: classify(responses[0], 'web', p.kind), api: classify(responses[1], 'api', p.kind), region: traceRegion(responses[2], webHost) };
  }

  async function chain(policy) {
    if (typeof $configuration === 'undefined') return policy;
    try {
      const response = await limited($configuration.sendMessage({ action: 'get_policy_state', content: policy }), 800);
      const v = response && response.ret && response.ret[policy];
      if (Array.isArray(v)) return policy + ' → ' + v.join(' → ');
      return typeof v === 'string' && v !== policy ? policy + ' → ' + v : policy;
    } catch (_) { return policy; }
  }
  async function main() {
    const params = typeof $environment !== 'undefined' ? $environment.params : null;
    // QX event-interaction 传入节点/策略组名称字符串；不允许静默退回默认出口。
    if (typeof params !== 'string' || !params.trim()) {
      end('请从 Quantumult X 的节点或策略组交互菜单运行本脚本。<br/>未取得节点名称，为避免测错出口，本次不发起检测。');
      return;
    }
    const policy = params;
    deadline = setTimeout(function () { end('检测超过总时限，请重试。<br/>节点：' + esc(policy)); }, 10000);
    const start = Date.now();
    const all = await Promise.all([Promise.all(providers.map(function (p) { return runProvider(p, policy); })), chain(policy)]);
    const rows = all[0];
    const html = rows.map(function (r) {
      const name = r.name.split(' / ')[0];
      return '<b>' + esc(name) + '</b>' + ' [' + (r.region ? esc(r.region) : '?') + ']' + '：网页 ' + format(r.web) + ' · API ' + format(r.api);
    }).join('<br/><br/>') + '<br/><br/><font color="#6959CD">节点 ➟ ' + esc(all[1]) + '</font><br/><font color="#888888" size="2">可达 ≠ 解锁；[地区]来自各网页 CDN trace。<br/>? 未知；API 出口及账号/模型资格未测。<br/>v1.1.0 · ' + ((Date.now() - start) / 1000).toFixed(1) + ' 秒</font>';
    end(html);
  }
  // 仅供离线回归测试；QX 环境不设置此变量。
  if (typeof __AI_CHECK_TEST__ !== 'undefined' && __AI_CHECK_TEST__) {
    __AI_CHECK_TEST__.classify = classify;
    __AI_CHECK_TEST__.traceRegion = traceRegion;
    __AI_CHECK_TEST__.esc = esc;
    __AI_CHECK_TEST__.safeURL = safeURL;
    __AI_CHECK_TEST__.fetchVia = fetchVia;
    __AI_CHECK_TEST__.providers = providers;
    return;
  }
  main().catch(function () { end('检测发生异常，请查看 QX 运行环境并重试。'); });
})();
