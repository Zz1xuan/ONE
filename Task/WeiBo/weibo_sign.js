/*
脚本名称：微博签到 - 完整任务版
脚本说明：微博每日签到 + 自动完成可执行任务，支持多账号
环境变量：WB_TOKEN、WB_COOKIE（青龙）
更新时间：2026-06-28
====================================================================================================
配置 (Surge)
[MITM]
api.weibo.cn
m.weibo.cn

[Script]
获取微博Token = type=http-request,pattern=^https:\/\/api\.weibo\.cn\/\d\/users\/show,requires-body=0,max-size=0,script-path=https://raw.githubusercontent.com/Zz1xuan/ONE/main/Task/WeiBo/weibo_sign.js
获取微博Cookie = type=http-request,pattern=^https:\/\/api\.weibo\.cn\/2\/logservice\/attach,requires-body=0,max-size=0,script-path=https://raw.githubusercontent.com/Zz1xuan/ONE/main/Task/WeiBo/weibo_sign.js

新浪微博 = type=cron,cronexp=15 8 * * *,timeout=120,script-path=https://raw.githubusercontent.com/Zz1xuan/ONE/main/Task/WeiBo/weibo_sign.js,script-update-interval=0
----------------------------------------------------------------------------------------------------
配置 (QuanX)
[MITM]
api.weibo.cn
m.weibo.cn

[rewrite_local]
^https:\/\/api\.weibo\.cn\/\d\/users\/show url script-request-header https://raw.githubusercontent.com/Zz1xuan/ONE/main/Task/WeiBo/weibo_sign.js
^https:\/\/api\.weibo\.cn\/2\/logservice\/attach url script-request-header https://raw.githubusercontent.com/Zz1xuan/ONE/main/Task/WeiBo/weibo_sign.js

[task_local]
15 8 * * * https://raw.githubusercontent.com/Zz1xuan/ONE/main/Task/WeiBo/weibo_sign.js, tag=新浪微博, enabled=true
====================================================================================================
*/

const $ = new Env('新浪微博')
let tokenArr = [], cookieArr = [];
let wbtoken = $.getdata('sy_token_wb');
let cookies = $.getdata('wb_cookie');
let results = [];

// ==================== Cookie/Token 获取 ====================
if (typeof $request !== 'undefined') {
    GetCookie();
    $.done()
} else {
    !(async () => {
        try {
            // --- 解析多账号 ---
            if (!$.isNode() && wbtoken && wbtoken.indexOf("#") === -1) {
                tokenArr.push(wbtoken);
                cookieArr.push(cookies || '');
            } else {
                // Node.js (青龙) 从环境变量读取
                if ($.isNode()) {
                    if (process.env.WB_TOKEN) {
                        wbtoken = process.env.WB_TOKEN.includes('#') ? process.env.WB_TOKEN.split('#') :
                                 process.env.WB_TOKEN.includes('\n') ? process.env.WB_TOKEN.split('\n') : [process.env.WB_TOKEN];
                    } else { wbtoken = []; }
                    if (process.env.WB_COOKIE) {
                        cookies = process.env.WB_COOKIE.includes('#') ? process.env.WB_COOKIE.split('#') :
                                  process.env.WB_COOKIE.includes('\n') ? process.env.WB_COOKIE.split('\n') : [process.env.WB_COOKIE];
                    } else { cookies = []; }
                } else if (wbtoken && wbtoken.indexOf("#") > -1) {
                    wbtoken = wbtoken.split("#");
                    cookies = (cookies || '').split("#");
                }
                // 对齐 token 和 cookie 数组
                for (let i = 0; i < Math.max(wbtoken.length, cookies.length); i++) {
                    if (wbtoken[i]) tokenArr.push(wbtoken[i]);
                    cookieArr.push(cookies[i] || '');
                }
            }

            if (!tokenArr[0]) {
                $.msg($.name, '【提示】请先获取微博Token和Cookie', '打开微博App触发 capture');
                return;
            }

            $.log(`\n=== 共 ${tokenArr.length} 个账号 ===\n`);

            for (let i = 0; i < tokenArr.length; i++) {
                if (!tokenArr[i]) continue;
                
                let token = tokenArr[i];
                let cookie = cookieArr[i] || '';
                $.index = i + 1;
                
                $.log(`\n────────────── 【账号 ${$.index}】 ──────────────`);
                
                // 确保 from 参数
                if (token.indexOf("from") === -1) {
                    token = "&from=10B3193010" + token;
                }
                
                // 提取 uid 用于去重和日志
                let uid = (token.match(/uid=(\d+)/) || [])[1] || '';
                
                // 提取 gsid
                let gsid = (token.match(/gsid=([_a-zA-Z0-9-]+)/) || [])[1] || '';
                
                // 提取 s (signature)
                let s = (token.match(/[&?]s=(\w+)/) || [])[1] || '';
                
                // 提取 aid (用于 m.weibo.cn)
                let aid = (token.match(/aid=([^&]+)/) || [])[1] || '';

                // 从 cookie 提取 XSRF-TOKEN / st
                let st = '';
                if (cookie) {
                    let stMatch = cookie.match(/XSRF-TOKEN=([^;]+)/);
                    if (stMatch) st = stMatch[1];
                }

                let accountResult = {
                    uid: uid || 'unknown',
                    tasks: []
                };

                // ========== 执行任务链 ==========
                
                // 1️⃣ 每日签到
                await doSignin(token);
                
                // 2️⃣ 获取任务列表（m.weibo.cn）
                let taskData = null;
                if (cookie && st) {
                    taskData = await fetchTasks(cookie, st, aid);
                } else {
                    $.log('⚠️ 缺少 Cookie/XSRF-TOKEN，跳过任务列表获取');
                }
                
                // 3️⃣ 尝试自动完成任务
                if (taskData && taskData.data && taskData.data.actions) {
                    await processDailyTasks(token, cookie, st, aid, gsid, taskData);
                }
                
                // 4️⃣ 获取签到主页信息（积分/红包）
                await getSigninInfo(cookie, st, aid);
                
                // 5️⃣ 标记系统通知已读
                if (cookie && st) {
                    await sysNotice(cookie, st);
                }
                
                $.log(`────────────── 【账号 ${$.index} 完成】──────────────\n`);
            }

            // 汇总通知
            let successCount = results.filter(r => r.includes('✅')).length;
            let failCount = results.filter(r => r.includes('❌')).length;
            let summary = results.join('\n');
            if (results.length > 0) {
                $.msg($.name, `完成 ${tokenArr.length} 个账号`, summary);
            }

        } catch (e) {
            $.logErr(e);
        }
    })()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())
}

// ==================== 签到 ====================
function doSignin(token) {
    return new Promise(resolve => {
        let opt = {
            url: `https://api.weibo.cn/2/checkin/add?c=iphone&${token}`,
            headers: {
                "User-Agent": "Weibo/62823 (iPhone; iOS 15.2; Scale/3.00)"
            }
        };
        $.get(opt, (error, resp, data) => {
            try {
                let result = JSON.parse(data);
                if (result.status == 10000) {
                    let msg = `✅ 每日签到：连续签到 ${result.data.continuous} 天，${result.data.desc}`;
                    $.log(msg);
                    results.push(msg);
                } else if (result.errno == 30000) {
                    let msg = `✅ 每日签到：已签到（重复）`;
                    $.log(msg);
                    results.push(msg);
                } else if (result.status == 90005) {
                    let msg = `⚠️ 每日签到：${result.msg}`;
                    $.log(msg);
                    results.push(msg);
                } else {
                    let msg = `❌ 每日签到：失败 (${result.errno || result.status})`;
                    $.log(msg);
                    results.push(msg);
                }
            } catch (e) {
                $.log(`❌ 签到返回解析失败: ${data}`);
                results.push(`❌ 签到失败`);
            }
            resolve();
        });
    });
}

// ==================== 获取任务列表 ====================
function fetchTasks(cookie, st, aid) {
    return new Promise(resolve => {
        let url = `https://m.weibo.cn/c/checkin/getTask?v3revision=1&aid=${aid}&st=${st}`;
        let opt = {
            url: url,
            headers: {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Weibo (iPhone14,5__weibo__16.6.2__iphone__os26.5)",
                "Referer": "https://m.weibo.cn/c/checkin",
                "X-Requested-With": "XMLHttpRequest",
                "Cookie": cookie
            }
        };
        $.get(opt, (error, resp, data) => {
            try {
                let result = JSON.parse(data);
                if (result.ok == 1) {
                    $.log(`📋 获取任务列表成功`);
                    resolve(result);
                } else {
                    $.log(`⚠️ 获取任务列表失败: ${result.msg}`);
                    resolve(null);
                }
            } catch (e) {
                $.log(`❌ 解析任务列表失败`);
                resolve(null);
            }
        });
    });
}

// ==================== 处理每日任务 ====================
async function processDailyTasks(token, cookie, st, aid, gsid, taskData) {
    let dailyTasks = taskData.data.actions.daily || [];
    
    $.log(`\n📋 每日任务共 ${dailyTasks.length} 个：`);
    
    // 定义各任务的处理函数
    const taskHandlers = {
        // 可自动完成的任务
        'hot_search': async (task) => {
            $.log(`  🔍 尝试完成任务: ${task.name}`);
            let result = await visitHotSearch(token);
            if (result) {
                await reportTaskComplete(cookie, st, task.ename);
                return `✅ ${task.name}`;
            }
            return `⚠️ ${task.name}: 访问失败`;
        },
        
        'fishery_visit': async (task) => {
            $.log(`  🐟 尝试完成任务: ${task.name}`);
            let result = await visitFishery(token);
            if (result) {
                await reportTaskComplete(cookie, st, task.ename);
                return `✅ ${task.name}`;
            }
            return `⚠️ ${task.name}: 访问失败`;
        },
        
        'act_like': async (task) => {
            $.log(`  👍 尝试完成任务: ${task.name}`);
            // 尝试通过 actionLog 报告完成
            await reportTaskComplete(cookie, st, task.ename);
            // 同时尝试实际点赞
            await doLike(token);
            return `✅ ${task.name}`;
        },
        
        'daily_answer': async (task) => {
            $.log(`  📝 尝试完成任务: ${task.name}`);
            await reportTaskComplete(cookie, st, task.ename);
            return `ℹ️ ${task.name}: 已上报`;
        },
        
        'daka': async (task) => {
            $.log(`  📌 尝试完成任务: ${task.name}`);
            await reportTaskComplete(cookie, st, task.ename);
            return `ℹ️ ${task.name}: 已上报`;
        },
        
        'follow': async (task) => {
            $.log(`  👤 尝试完成任务: ${task.name}`);
            await reportTaskComplete(cookie, st, task.ename);
            return `ℹ️ ${task.name}: 已上报`;
        },
        
        'repost': async (task) => {
            $.log(`  🔄 尝试完成任务: ${task.name}`);
            await reportTaskComplete(cookie, st, task.ename);
            return `ℹ️ ${task.name}: 已上报`;
        },
        
        'comment': async (task) => {
            $.log(`  💬 尝试完成任务: ${task.name}`);
            await reportTaskComplete(cookie, st, task.ename);
            return `ℹ️ ${task.name}: 已上报`;
        },
        
        'shortplay': async (task) => {
            $.log(`  🎬 尝试完成任务: ${task.name}`);
            await reportTaskComplete(cookie, st, task.ename);
            return `ℹ️ ${task.name}: 已上报`;
        },
        
        'liveshow': async (task) => {
            $.log(`  📺 尝试完成任务: ${task.name}`);
            await reportTaskComplete(cookie, st, task.ename);
            return `ℹ️ ${task.name}: 已上报`;
        },
        
        // type=1 的任务（开启通知等）无法通过 API 完成，跳过
        'push': async (task) => {
            return `⏭️ ${task.name}: 需手动开启通知`;
        }
    };
    
    for (let task of dailyTasks) {
        if (task.status == 1) {
            $.log(`  ✅ ${task.name}: 已完成，跳过`);
            continue;
        }
        
        let handler = taskHandlers[task.ename];
        if (handler) {
            let msg = await handler(task);
            results.push(`[账号${$.index}] ${msg}`);
        } else {
            $.log(`  ⏭️ ${task.name}: 未适配 (${task.ename})`);
            results.push(`[账号${$.index}] ⏭️ ${task.name}: 未适配`);
        }
        
        // 任务间稍作延迟
        await sleep(1000);
    }
}

// ==================== 上报任务完成 (actionLog) ====================
function reportTaskComplete(cookie, st, taskName) {
    return new Promise(resolve => {
        let t = Date.now();
        let url = `https://m.weibo.cn/h5logs/actionLog?type=pic&act_code=2138&ext=freq%3A11%7CtaskName%3A${taskName}&uicode=10000746&t=${t}`;
        let opt = {
            url: url,
            headers: {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Weibo (iPhone14,5__weibo__16.6.2__iphone__os26.5)",
                "Referer": "https://m.weibo.cn/c/checkin",
                "Cookie": cookie
            }
        };
        $.get(opt, () => {
            $.log(`    📊 上报任务完成: ${taskName}`);
            resolve(true);
        });
    });
}

// ==================== 访问热搜 ====================
function visitHotSearch(token) {
    return new Promise(resolve => {
        let opt = {
            url: `https://api.weibo.cn/2/statuses/hot_weibo?c=iphone&${token}`,
            headers: {
                "User-Agent": "Weibo/62823 (iPhone; iOS 15.2; Scale/3.00)"
            }
        };
        $.get(opt, (error, resp, data) => {
            try {
                let result = JSON.parse(data);
                if (result) {
                    $.log(`    🔍 访问热搜成功`);
                    resolve(true);
                } else {
                    resolve(false);
                }
            } catch (e) {
                resolve(false);
            }
        });
    });
}

// ==================== 访问微博渔场 ====================
function visitFishery(token) {
    return new Promise(resolve => {
        let opt = {
            url: `https://api.weibo.cn/2/page/group/feed?c=iphone&containerid=230283&${token}`,
            headers: {
                "User-Agent": "Weibo/62823 (iPhone; iOS 15.2; Scale/3.00)"
            }
        };
        $.get(opt, () => {
            resolve(true);
        });
    });
}

// ==================== 点赞 ====================
function doLike(token) {
    return new Promise(resolve => {
        // 获取一条微博动态来点赞
        let opt = {
            url: `https://api.weibo.cn/2/statuses/friends/timeline?c=iphone&count=1&${token}`,
            headers: {
                "User-Agent": "Weibo/62823 (iPhone; iOS 15.2; Scale/3.00)"
            }
        };
        $.get(opt, (error, resp, data) => {
            try {
                let result = JSON.parse(data);
                if (result && result.statuses && result.statuses[0]) {
                    let mid = result.statuses[0].mid;
                    let likeOpt = {
                        url: `https://api.weibo.cn/2/likes/create?c=iphone&mid=${mid}&${token}`,
                        headers: {
                            "User-Agent": "Weibo/62823 (iPhone; iOS 15.2; Scale/3.00)"
                        }
                    };
                    $.get(likeOpt, () => {
                        $.log(`    👍 点赞成功`);
                        resolve(true);
                    });
                } else {
                    resolve(false);
                }
            } catch (e) {
                resolve(false);
            }
        });
    });
}

// ==================== 签到主页信息 ====================
function getSigninInfo(cookie, st, aid) {
    return new Promise(resolve => {
        if (!cookie || !st) {
            $.log('⚠️ 缺少 Cookie，跳过签到信息获取');
            resolve();
            return;
        }
        let url = `https://m.weibo.cn/c/checkin/ug/v2/signin/signin?v3revision=1&ua=iPhone14%252C5__weibo__16.6.2__iphone__os26.5&from=10G6293010&luicode=20000101&aid=${aid}&st=${st}`;
        let opt = {
            url: url,
            headers: {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Weibo (iPhone14,5__weibo__16.6.2__iphone__os26.5)",
                "Referer": "https://m.weibo.cn/c/checkin",
                "Cookie": cookie
            }
        };
        $.get(opt, (error, resp, data) => {
            try {
                let result = JSON.parse(data);
                if (result.ok == 1) {
                    let points = result.data.header.points.value;
                    let money = result.data.header.money.value;
                    let continuous = result.data.sign_in.continuous || 0;
                    $.log(`\n📊 积分: ${points}  |  任务红包: ¥${money}  |  连签 ${continuous} 天`);
                    results.push(`[账号${$.index}] 📊 积分:${points} 红包:¥${money} 连签${continuous}天`);
                }
            } catch (e) {}
            resolve();
        });
    });
}

// ==================== 系统通知已读 ====================
function sysNotice(cookie, st) {
    return new Promise(resolve => {
        let opt = {
            url: `https://m.weibo.cn/c/checkin/sysNotice?st=${st}`,
            headers: {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Weibo (iPhone14,5__weibo__16.6.2__iphone__os26.5)",
                "Referer": "https://m.weibo.cn/c/checkin",
                "X-Requested-With": "XMLHttpRequest",
                "Cookie": cookie,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: ""
        };
        $.post(opt, () => {
            $.log(`📬 系统通知已读`);
            resolve();
        });
    });
}

// ==================== Cookie/Token 获取（修复去重） ====================
function GetCookie() {
    // --- 从 URL 捕获 Token (gsid) ---
    if ($request && $request.method != 'OPTIONS' && $request.url.indexOf("gsid=") > -1) {
        const url = $request.url;
        let token = url.match(/from=\w+/) + url.match(/&uid=\d+/) + url.match(/&gsid=[_a-zA-Z0-9-]+/) + url.match(/&s=\w+/);
        let uid = (token.match(/uid=(\d+)/) || [])[1];
        
        if (!uid) {
            $.log('⚠️ 未能提取 uid');
            return;
        }
        
        let existingTokens = $.getdata('sy_token_wb') || '';
        
        // 修复：精确匹配 uid，避免子串误判
        let uidPattern = new RegExp(`uid=${uid}(?:&|$)`);
        if (existingTokens && uidPattern.test(existingTokens)) {
            $.log(`⏭️ 账号 ${uid} Token 已存在，跳过`);
        } else {
            let newTokens = existingTokens ? existingTokens + "#" + token : token;
            $.setdata(newTokens, 'sy_token_wb');
            $.log(`✅ 账号 ${uid} Token 捕获成功`);
            $.msg($.name, `获取微博Token: 成功`, `账号 ${uid}`);
        }
    }
    
    // --- 从 Header Cookie 捕获 SUB ---
    if ($request && $request.method != 'OPTIONS' && $request.headers && $request.headers.Cookie) {
        let cookieHeader = $request.headers.Cookie;
        let subMatch = cookieHeader.match(/SUB=([^;]+)/);
        let subpMatch = cookieHeader.match(/SUBP=([^;]+)/);
        let scfMatch = cookieHeader.match(/SCF=([^;]+)/);
        let xsrfMatch = cookieHeader.match(/XSRF-TOKEN=([^;]+)/);
        
        if (subMatch) {
            // 保存完整的 Cookie（SUB + SCF + SUBP + XSRF-TOKEN）
            let importantCookies = [];
            if (subMatch) importantCookies.push(`SUB=${subMatch[1]}`);
            if (subpMatch) importantCookies.push(`SUBP=${subpMatch[1]}`);
            if (scfMatch) importantCookies.push(`SCF=${scfMatch[1]}`);
            if (xsrfMatch) importantCookies.push(`XSRF-TOKEN=${xsrfMatch[1]}`);
            
            let fullCookie = importantCookies.join('; ');
            let existingCookies = $.getdata('wb_cookie') || '';
            
            // 修复：精确匹配 SUB 值
            let subVal = subMatch[1];
            if (existingCookies && existingCookies.includes(subVal)) {
                $.log(`⏭️ 账号 Cookie 已存在，跳过`);
            } else {
                let newCookies = existingCookies ? existingCookies + "#" + fullCookie : fullCookie;
                $.setdata(newCookies, 'wb_cookie');
                let count = newCookies.split('#').length;
                $.log(`✅ 账号 Cookie ${count} 捕获成功`);
                $.msg($.name, `获取微博Cookie: 成功`, `共 ${count} 个账号`);
            }
        }
    }
}

// ==================== 工具函数 ====================
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// ==================== Env 框架 ====================
function Env(t, e) {
    class s {
        constructor(t) { this.env = t }
        send(t, e = "GET") {
            t = "string" == typeof t ? { url: t } : t;
            let s = this.get;
            return "POST" === e && (s = this.post),
            new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) })
        }
        get(t) { return this.send.call(this.env, t) }
        post(t) { return this.send.call(this.env, t, "POST") }
    }
    return new class {
        constructor(t, e) {
            this.name = t, this.http = new s(this),
            this.data = null, this.dataFile = "box.dat",
            this.logs = [], this.isMute = !1, this.isNeedRewrite = !1,
            this.logSeparator = "\n", this.startTime = (new Date).getTime(),
            Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`)
        }
        isNode() { return "undefined" != typeof module && !!module.exports }
        isQuanX() { return "undefined" != typeof $task }
        isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon }
        isLoon() { return "undefined" != typeof $loon }
        toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } }
        toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } }
        getjson(t, e) {
            let s = e;
            const i = this.getdata(t);
            if (i) try { s = JSON.parse(this.getdata(t)) } catch {}
            return s
        }
        setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } }
        getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) }
        runScript(t, e) { return new Promise(s => {
            let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
            i = i ? i.replace(/\n/g, "").trim() : i;
            let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
            r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
            const [o, h] = i.split("@"),
            a = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } };
            this.post(a, (t, e, i) => s(i))
        }).catch(t => this.logErr(t)) }
        loaddata() {
            if (!this.isNode()) return {};
            this.fs = this.fs || require("fs"),
            this.path = this.path || require("path");
            const t = this.path.resolve(this.dataFile),
                e = this.path.resolve(process.cwd(), this.dataFile),
                s = this.fs.existsSync(t),
                i = !s && this.fs.existsSync(e);
            if (!s && !i) return {};
            const r = s ? t : e;
            try { return JSON.parse(this.fs.readFileSync(r)) } catch { return {} }
        }
        writedata() {
            if (this.isNode()) {
                this.fs = this.fs || require("fs"),
                this.path = this.path || require("path");
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    i = !s && this.fs.existsSync(e),
                    r = JSON.stringify(this.data);
                s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
            }
        }
        lodash_get(t, e, s) {
            const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
            let r = t;
            for (const t of i)
                if (r = Object(r)[t], void 0 === r) return s;
            return r
        }
        lodash_set(t, e, s) {
            return Object(t) !== t ? t : (
                Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []),
                e.slice(0, -1).reduce((t, s, i) =>
                    Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t
                )[e[e.length - 1]] = s, t
            )
        }
        getdata(t) {
            let e = this.getval(t);
            if (/^@/.test(t)) {
                const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t),
                    r = s ? this.getval(s) : "";
                if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch { e = "" }
            }
            return e
        }
        setdata(t, e) {
            let s = !1;
            if (/^@/.test(e)) {
                const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e),
                    o = this.getval(i),
                    h = i ? "null" === o ? null : o || "{}" : "{}";
                try {
                    const e = JSON.parse(h);
                    this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
                } catch {
                    const o = {};
                    this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
                }
            } else s = this.setval(t, e);
            return s
        }
        getval(t) {
            return this.isSurge() || this.isLoon() ? $persistentStore.read(t) :
                this.isQuanX() ? $prefs.valueForKey(t) :
                this.isNode() ? (this.data = this.loaddata(), this.data[t]) :
                this.data && this.data[t] || null
        }
        setval(t, e) {
            return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) :
                this.isQuanX() ? $prefs.setValueForKey(t, e) :
                this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) :
                this.data && this.data[e] || null
        }
        initGotEnv(t) {
            this.got = this.got || require("got"),
            this.cktough = this.cktough || require("tough-cookie"),
            this.ckjar = this.ckjar || new this.cktough.CookieJar,
            t && (t.headers = t.headers || {},
                void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
        }
        get(t, e = (() => {})) {
            t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]),
            this.isSurge() || this.isLoon() ? (
                this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {},
                    Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })),
                $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })
            ) : this.isQuanX() ? (
                this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })),
                $task.fetch(t).then(t => {
                    const { statusCode: s, statusCode: i, headers: r, body: o } = t;
                    e(null, { status: s, statusCode: i, headers: r, body: o }, o)
                }, t => e(t))
            ) : this.isNode() && (
                this.initGotEnv(t),
                this.got(t).on("redirect", (t, e) => {
                    try {
                        if (t.headers["set-cookie"]) {
                            const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
                            s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
                        }
                    } catch (t) { this.logErr(t) }
                }).then(t => {
                    const { statusCode: s, statusCode: i, headers: r, body: o } = t;
                    e(null, { status: s, statusCode: i, headers: r, body: o }, o)
                }, t => {
                    const { message: s, response: i } = t;
                    e(s, i, i && i.body)
                })
            )
        }
        post(t, e = (() => {})) {
            const s = t.method ? t.method.toLocaleLowerCase() : "post";
            t.body && t.headers && !t.headers["Content-Type"] &&
                (t.headers["Content-Type"] = "application/x-www-form-urlencoded"),
            t.headers && delete t.headers["Content-Length"],
            this.isSurge() || this.isLoon() ? (
                this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {},
                    Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })),
                $httpClient[s](t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })
            ) : this.isQuanX() ? (
                t.method = s,
                this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })),
                $task.fetch(t).then(t => {
                    const { statusCode: s, statusCode: i, headers: r, body: o } = t;
                    e(null, { status: s, statusCode: i, headers: r, body: o }, o)
                }, t => e(t))
            ) : this.isNode() && (this.initGotEnv(t), this.got({...t, method: s}).then(t => {
                    const { statusCode: s, statusCode: i, headers: r, body: o } = t;
                    e(null, { status: s, statusCode: i, headers: r, body: o }, o)
                }, t => {
                    const { message: s, response: i } = t;
                    e(s, i, i && i.body)
                })
            )
        }
        time(t, e = null) {
            const s = e ? new Date(e) : new Date;
            let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() };
            /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length)));
            for (let e in i)
                new RegExp("(" + e + ")").test(t) &&
                (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length)));
            return t
        }
        msg(e = t, s = "", i = "", r) {
            const o = t => {
                if (!t) return t;
                if ("string" == typeof t)
                    return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0;
                if ("object" == typeof t) {
                    if (this.isLoon()) {
                        let e = t.openUrl || t.url || t["open-url"],
                            s = t.mediaUrl || t["media-url"];
                        return { openUrl: e, mediaUrl: s }
                    }
                    if (this.isQuanX()) {
                        let e = t["open-url"] || t.url || t.openUrl,
                            s = t["media-url"] || t.mediaUrl;
                        return { "open-url": e, "media-url": s }
                    }
                    if (this.isSurge()) {
                        let e = t.url || t.openUrl || t["open-url"];
                        return { url: e }
                    }
                }
            };
            this.isMute || (
                this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) :
                this.isQuanX() && $notify(e, s, i, o(r))
            );
            if (!this.isMuteLog) {
                let t = ["", "==============📣系统通知📣=============="];
                t.push(e), s && t.push(s), i && t.push(i),
                console.log(t.join("\n")), this.logs = this.logs.concat(t)
            }
        }
        log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) }
        logErr(t, e) {
            const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
            s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t)
        }
        wait(t) { return new Promise(e => setTimeout(e, t)) }
        done(t = {}) {
            const e = (new Date).getTime(),
                s = (e - this.startTime) / 1e3;
            this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(),
            (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
        }
    }(t, e)
}
