/**
 * AI 节点检测 v1.0.1 — Quantumult X event-interaction
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
    { name: 'Grok / xAI', web: 'https://grok.com/', api: 'https://api.x.ai/v1/models', kind: 'xai' }
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
  async function fetchVia(url, policy, extra) {
    const req = Object.assign({ url: url, method: 'GET' }, extra || {});
    req.headers = Object.assign({ 'User-Agent': UA, 'Accept': '*/*' }, req.headers || {});
    req['auto-cookie'] = false;
    req.opts = { policy: policy, redirection: false };
    const start = Date.now();
    try {
      const r = await limited($task.fetch(req), TIMEOUT);
      const headers = {};
      Object.keys(r.headers || {}).forEach(function (k) { headers[k.toLowerCase()] = String(r.headers[k]); });
      return { code: Number(r.statusCode), body: String(r.body || ''), headers: headers, ms: Date.now() - start };
    } catch (e) {
      const message = String(e && (e.error || e.message) || e);
      return { code: 0, body: '', headers: {}, ms: Date.now() - start, error: /timeout|timed out/i.test(message) ? 'timeout' : 'network' };
    }
  }
  function result(type, text, r) { return { type: type, text: text, code: r.code, ms: r.ms }; }
  function classify(r, channel, kind) {
    const b = r.body;
    const c = r.code;
    let j;
    try { j = JSON.parse(b); } catch (_) { j = null; }
    const err = j && j.error && typeof j.error === 'object' ? j.error : null;
    const evidence = err ? JSON.stringify(err) : b;
    if (!c) return result('unknown', r.error === 'timeout' ? '检测超时' : '网络 / TLS 异常', r);
    if (c >= 500) return result('unknown', '服务端异常', r);
    if (c === 429) return result('warn', '请求限流，暂无法确认', r);
    if (/unsupported_country|unsupported.country.region.territory|country_not_supported|region_not_supported|not available in (your |this )?(country|region)|not supported in (your |this )?(country|region)|requests? from this location (are|is) not supported|user location is not supported|地区不受支持|您所在的国家\/地区不受支持/i.test(evidence)) {
      return err && c >= 400 ? result('blocked', '明确地区限制', r) : result('warn', '含地区限制文案，待确认', r);
    }
    if (r.headers['cf-mitigated'] === 'challenge' || /<title>\s*(just a moment|attention required)|cf-chl-|challenge-platform|verify (that )?you are human/i.test(b)) return result('warn', '安全验证 / WAF 拦截', r);
    if (c === 403) return result('warn', '访问被拒绝，原因待确认', r);
    if (channel === 'api') {
      const type = err && String(err.type || err.code || err.status || '');
      const msg = err && String(err.message || '');
      const openai = kind === 'openai' && c === 401 && err && (/invalid_api_key|authentication_error/.test(type) || /missing (bearer|authentication)|didn.t provide an api key|provide.*api key|incorrect api key/i.test(msg));
      const anthropic = kind === 'anthropic' && c === 401 && err && /authentication_error/.test(type);
      const gemini = kind === 'gemini' && c === 400 && err && (/API_KEY_INVALID/.test(JSON.stringify(err)) || /API key not valid/i.test(msg));
      const xai = kind === 'xai' && c === 401 && err && /api.key|credentials|unauth|authentication/i.test(type + ' ' + msg);
      if (openai || anthropic || gemini || xai) return result('edge', '鉴权入口可达（未验证调用）', r);
      const listOK = !j || j.error ? false : kind === 'gemini' ? Array.isArray(j.models) : (kind === 'openai' || kind === 'xai') && j.object === 'list' && Array.isArray(j.data);
      if (c >= 200 && c < 300 && listOK) return result('edge', '模型列表入口可达（未验证调用）', r);
      return result('unknown', '响应待确认', r);
    }
    if (c >= 300 && c < 400) {
      let location = r.headers.location || '';
      if (/unsupported|not.available|restricted|unavailable/i.test(location)) return result('warn', '跳转到限制页面，待确认', r);
      let host = '';
      try { host = location.match(/^https?:\/\/([^/?#]+)/i)[1].split('@').pop(); } catch (_) { /* relative redirect */ }
      return result('warn', '入口重定向' + (host ? ' → ' + host : '') + '（未验证落地页）', r);
    }
    if (c >= 200 && c < 300 && /<(?:!doctype html|html|head|body)[\s>]/i.test(b)) return result('web', '网页有响应（未验证登录 / 对话）', r);
    return result('unknown', '响应待确认', r);
  }
  function traceRegion(r) {
    if (!r || r.code !== 200) return '';
    const m = r.body.match(/^loc=([A-Z]{2})\s*$/m);
    return m ? m[1] : '';
  }
  function format(r) {
    const colors = { edge: '#16803c', web: '#16803c', blocked: '#c0392b', warn: '#a86b00', unknown: '#777777' };
    let label = '待确认';
    if (r.type === 'edge') label = '鉴权可达';
    else if (r.type === 'web') label = '有响应';
    else if (r.type === 'blocked') label = '地区受限';
    else if (/安全验证/.test(r.text)) label = '需验证';
    else if (/重定向/.test(r.text)) label = '跳转';
    else if (/限流/.test(r.text)) label = '限流';
    else if (/超时/.test(r.text)) label = '超时';
    else if (/网络/.test(r.text)) label = '网络异常';
    else if (r.code === 403) label = '拒绝访问';
    else if (r.code >= 500) label = '服务异常';
    else if (/地区|限制页面/.test(r.text)) label = '疑似限制';
    return '<font color="' + (colors[r.type] || colors.unknown) + '">' + label + '</font>';
  }
  async function runProvider(p, policy) {
    const responses = await Promise.all([
      fetchVia(p.web, policy),
      fetchVia(p.api, policy, { method: p.method || 'GET', headers: p.headers || {}, ...(p.body ? { body: p.body } : {}) }),
      p.trace ? fetchVia(p.trace, policy) : Promise.resolve(null)
    ]);
    return { name: p.name, web: classify(responses[0], 'web', p.kind), api: classify(responses[1], 'api', p.kind), region: traceRegion(responses[2]) };
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
      return '<b>' + esc(name) + '</b>' + (r.region ? ' [' + esc(r.region) + ']' : '') + '：网页 ' + format(r.web) + ' · API ' + format(r.api);
    }).join('<br/><br/>') + '<br/><br/><font color="#6959CD">节点 ➟ ' + esc(all[1]) + '</font><br/><font color="#888888" size="2">可达 ≠ 解锁；[地区]仅指网页域名出口。<br/>v1.0.1 · ' + ((Date.now() - start) / 1000).toFixed(1) + ' 秒</font>';
    end(html);
  }
  // 仅供离线回归测试；QX 环境不设置此变量。
  if (typeof __AI_CHECK_TEST__ !== 'undefined' && __AI_CHECK_TEST__) {
    __AI_CHECK_TEST__.classify = classify;
    __AI_CHECK_TEST__.traceRegion = traceRegion;
    __AI_CHECK_TEST__.esc = esc;
    return;
  }
  main().catch(function () { end('检测发生异常，请查看 QX 运行环境并重试。'); });
})();
