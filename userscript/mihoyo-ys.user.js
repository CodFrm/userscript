// ==UserScript==
// @name         米游社-后台原神签到
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.1
// @description  后台签到原神，需要先登录https://bbs.mihoyo.com/ys/，不用再打开浏览器啦，代码已经原作者允许
// @author       王一之
// @crontab      * 1-23 once * *
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      api-takumi.mihoyo.com
// @require      https://cdn.jsdelivr.net/gh/emn178/js-md5/build/md5.min.js
// @original-script https://greasyfork.org/zh-CN/scripts/432059
// @original-author 苏芣苡
// @original-license MIT
// ==/UserScript==


function ds() {
    var s = 'h8w582wxwgqvahcdkpvdhbh2w9casgfl';
    var t = Math.floor(Date.now() / 1000);
    var r = Math.random().toString(36).slice(-6);
    var c = 'salt=' + s + '&t=' + t + '&r=' + r;
    var ds = t + ',' + r + ',' + md5(c);
    return ds;
}

return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
        url: "https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_cn",
        method: "GET",
        onload: function (xhr) {
            var json = JSON.parse(xhr.responseText)
            if (json.retcode !== 0) {
                GM_notification({
                    title: "原神签到失败",
                    text: json.message
                });
                return reject(json.message);
            }
            var list = json.data.list
            for (var i in list) {

                uid = json.data.list[i].game_uid
                region = json.data.list[i].region
                region_name = json.data.list[i].region_name
                nickname = json.data.list[i].nickname
                level = json.data.list[i].level

                data = '{"act_id":"e202009291139501","region":"' + region + '","uid":"' + uid + '"}'

                GM_xmlhttpRequest({
                    url: 'https://api-takumi.mihoyo.com/event/bbs_sign_reward/sign',
                    method: 'POST',
                    data: data,
                    headers: {
                        'DS': ds(),
                        'x-rpc-app_version': '2.3.0',
                        'x-rpc-client_type': '5',
                        "x-rpc-device_id": "bd7f912e-908c-3692-a520-e70206823495",
                    },
                    onload: function (xhr) {
                        var json = JSON.parse(xhr.responseText)
                        message = json.message
                        var tips = '【' + region_name + '】—【' + nickname + '】[ Lv : ' + level + ']—' + uid + "\n" + message;
                        GM_notification({
                            title: "原神签到成功",
                            text: tips
                        });
                        resolve(tips);
                    }, onerror() {
                        GM_notification({
                            title: "原神签到失败",
                            text: "网络错误,签到失败"
                        });
                        reject("网络错误");
                    }
                });
            }
        }, onerror() {
            GM_notification({
                title: "原神签到失败",
                text: "网络错误,签到失败"
            });
            reject("网络错误");
        }
    });
});
