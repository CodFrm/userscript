// ==UserScript==
// @name         bilibili自动签到
// @namespace    wyz
// @version      1.1.4
// @author       wyz
// @crontab * * once * *
// @debug
// @grant GM_xmlhttpRequest
// @grant GM_notification
// @connect api.bilibili.com
// @connect api.live.bilibili.com
// @cloudCat
// @exportCookie domain=api.bilibili.com
// @exportCookie domain=api.live.bilibili.com
// ==/UserScript==

return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://api.bilibili.com/x/web-interface/nav',
        responseType: "json",
        onload: function (xhr) {

            switch (xhr.response.code) {
                case 0:
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: 'https://api.live.bilibili.com/sign/doSign',
                        responseType: "json",
                        onload: function (xhr) {

                            switch (xhr.response.code) {
                                case 0:
                                    GM_notification('哔哩哔哩直播自动签到成功');
                                    break;
                                case 1011040:
                                    GM_notification({
                                        title: 'bilibili自动签到 - ScriptCat',
                                        text: '重复签到',
                                    });
                                    break;
                                default:
                            }
                            resolve('B站签到完成');
                        }
                    });
                    break;
                case -101:
                    GM_notification({
                        title: 'bilibili自动签到 - ScriptCat',
                        text: '哔哩哔哩签到失败,账号未登录,请先登录',
                    });
                    resolve('哔哩哔哩签到失败,账号未登录,请先登录');
                    break;
                default:

            }

        },
        onerror: function () {
            GM_notification({
                title: 'bilibili自动签到 - ScriptCat',
                text: '网络错误,bilibili签到失败',
            });
            reject('网络错误,bilibili签到失败');
        }
    });

});


