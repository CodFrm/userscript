// ==UserScript==
// @name         V2EX 自动签到
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.2
// @description  v2ex 每日自动签到脚本
// @author       wyz
// @crontab      * 10 once * *
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      www.v2ex.com
// @debug
// @supportURL   https://bbs.tampermonkey.net.cn/forum.php?mod=viewthread&tid=414
// @homepage     https://bbs.tampermonkey.net.cn/forum.php?mod=viewthread&tid=414
// ==/UserScript==

return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://www.v2ex.com/mission/daily',
        onload: function (xhr) {
            if (xhr.status == 200) {
                const regex = /value="领取 X 铜币" onclick="location.href = '(.*?)'/gm;
                let m = regex.exec(xhr.responseText);
                if (!m) {
                    GM_notification('V2EX可能已经签过到了');
                    resolve('V2EX可能已经签过到了');
                    return;
                }
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://www.v2ex.com' + m[1],
                    onload: function (xhr) {
                        GM_notification('V2EX自动签到成功');
                        resolve('V2EX签到完成');
                    }
                });
            } else {
                GM_notification({
                    title: 'V2EX自动签到 - ScriptCat',
                    text: 'V2EX自动签到失败,账号未登录,请先登录',
                });
                reject('V2EX账号未登录');
            }
        }
    });
});
