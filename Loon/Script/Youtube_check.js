/*
 * 感谢并修改自
 * https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/Scripts/streaming-ui-check.js
 * YouTube解锁查询
 * For Loon 373+ Only, 小于373版本会有bug
 * 更新于：2022-04-12
 * 原作者：XIAO_KOP
 * 现作者：Loon0x00
 */

 const YTB_BASE_URL = "https://www.youtube.com/premium";

var inputParams = $environment.params;
var nodeName = inputParams.node;

let flags = new Map([[ "AC" , "🇦🇨" ] ,["AE","🇦🇪"], [ "AF" , "🇦🇫" ] , [ "AI" , "🇦🇮" ] , [ "AL" , "🇦🇱" ] , [ "AM" , "🇦🇲" ] , [ "AQ" , "🇦🇶" ] , [ "AR" , "🇦🇷" ] , [ "AS" , "🇦🇸" ] , [ "AT" , "🇦🇹" ] , [ "AU" , "🇦🇺" ] , [ "AW" , "🇦🇼" ] , [ "AX" , "🇦🇽" ] , [ "AZ" , "🇦🇿" ] , ["BA", "🇧🇦"], [ "BB" , "🇧🇧" ] , [ "BD" , "🇧🇩" ] , [ "BE" , "🇧🇪" ] , [ "BF" , "🇧🇫" ] , [ "BG" , "🇧🇬" ] , [ "BH" , "🇧🇭" ] , [ "BI" , "🇧🇮" ] , [ "BJ" , "🇧🇯" ] , [ "BM" , "🇧🇲" ] , [ "BN" , "🇧🇳" ] , [ "BO" , "🇧🇴" ] , [ "BR" , "🇧🇷" ] , [ "BS" , "🇧🇸" ] , [ "BT" , "🇧🇹" ] , [ "BV" , "🇧🇻" ] , [ "BW" , "🇧🇼" ] , [ "BY" , "🇧🇾" ] , [ "BZ" , "🇧🇿" ] , [ "CA" , "🇨🇦" ] , [ "CF" , "🇨🇫" ] , [ "CH" , "🇨🇭" ] , [ "CK" , "🇨🇰" ] , [ "CL" , "🇨🇱" ] , [ "CM" , "🇨🇲" ] , [ "CN" , "🇨🇳" ] , [ "CO" , "🇨🇴" ] , [ "CP" , "🇨🇵" ] , [ "CR" , "🇨🇷" ] , [ "CU" , "🇨🇺" ] , [ "CV" , "🇨🇻" ] , [ "CW" , "🇨🇼" ] , [ "CX" , "🇨🇽" ] , [ "CY" , "🇨🇾" ] , [ "CZ" , "🇨🇿" ] , [ "DE" , "🇩🇪" ] , [ "DG" , "🇩🇬" ] , [ "DJ" , "🇩🇯" ] , [ "DK" , "🇩🇰" ] , [ "DM" , "🇩🇲" ] , [ "DO" , "🇩🇴" ] , [ "DZ" , "🇩🇿" ] , [ "EA" , "🇪🇦" ] , [ "EC" , "🇪🇨" ] , [ "EE" , "🇪🇪" ] , [ "EG" , "🇪🇬" ] , [ "EH" , "🇪🇭" ] , [ "ER" , "🇪🇷" ] , [ "ES" , "🇪🇸" ] , [ "ET" , "🇪🇹" ] , [ "EU" , "🇪🇺" ] , [ "FI" , "🇫🇮" ] , [ "FJ" , "🇫🇯" ] , [ "FK" , "🇫🇰" ] , [ "FM" , "🇫🇲" ] , [ "FO" , "🇫�" ] , [ "FR" , "🇫🇷" ] , [ "GA" , "🇬🇦" ] , [ "GB" , "🇬🇧" ] , [ "HK" , "🇭🇰" ] ,["HU","🇭🇺"], [ "ID" , "🇮🇩" ] , [ "IE" , "🇮🇪" ] , [ "IL" , "🇮🇱" ] , [ "IM" , "🇮🇲" ] , [ "IN" , "🇮🇳" ] , [ "IS" , "🇮🇸" ] , [ "IT" , "🇮🇹" ] , [ "JP" , "🇯🇵" ] , [ "KR" , "🇰🇷" ] , [ "LU" , "🇱🇺" ] , [ "MO" , "🇲🇴" ] , [ "MX" , "🇲🇽" ] , [ "MY" , "🇲🇾" ] , [ "NL" , "🇳🇱" ] , [ "PH" , "🇵🇭" ] , [ "RO" , "🇷🇴" ] , [ "RS" , "🇷🇸" ] , [ "RU" , "🇷🇺" ] , [ "RW" , "🇷🇼" ] , [ "SA" , "🇸🇦" ] , [ "SB" , "��🇧" ] , [ "SC" , "🇸🇨" ] , [ "SD" , "🇸🇩" ] , [ "SE" , "🇸🇪" ] , [ "SG" , "🇸🇬" ] , [ "TH" , "🇹🇭" ] , [ "TN" , "🇹🇳" ] , [ "TO" , "🇹🇴" ] , [ "TR" , "🇹🇷" ] , [ "TV" , "🇹🇻" ] , [ "TW" , "🇨🇳" ] , [ "UK" , "🇬🇧" ] , [ "UM" , "🇺🇲" ] , [ "US" , "🇺🇸" ] , [ "UY" , "🇺🇾" ] , [ "UZ" , "🇺🇿" ] , [ "VA" , "🇻🇦" ] , [ "VE" , "🇻🇪" ] , [ "VG" , "🇻🇬" ] , [ "VI" , "🇻🇮" ] , [ "VN" , "🇻🇳" ] , [ "ZA" , "🇿🇦"]])

let result = {
    "title": '    📺  YouTube服务查询',
    "YouTube": '<b>YouTube: </b>检测失败，请重试� ❗️',
}

let arrow = " ➟ "

console.log("start execute");
ytbTest().then(value => {
    let content = "--------------------------------------</br>"+([result["YouTube"]]).join("</br></br>")
    content = content + "</br>--------------------------------------</br>"+"<font color=#CD5C5C>"+"<b>节点</b> ➟ " + nodeName+ "</font>"
    content =`<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` + content + `</p>`
    console.log(content);
    $done({"title":result["title"],"htmlMessage":content})
}).catch (values => {
    console.log("reject:" + values);
    let content = "--------------------------------------</br>"+([result["YouTube"]]).join("</br></br>")
    content = content + "</br>--------------------------------------</br>"+"<font color=#CD5C5C>"+"<b>节点</b> ➟ " + nodeName+ "</font>"
    content =`<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` + content + `</p>`
    $done({"title":result["title"],"htmlMessage":content})
})

function ytbTest() {
    return new Promise((resolve, reject) => {
        let params = {
            url: YTB_BASE_URL,
            node: nodeName,
            timeout: 10000, //ms
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
            }
        }
        $httpClient.get(params, (errormsg,response,data) => {
            console.log("----------YTB--------------");
            if (errormsg) {
                console.log("YTB request failed:" + errormsg);
                resolve(errormsg);
                return;
            }
            if (response.status == 200) {
                console.log("YTB request data:" + response.status);
                if (data.indexOf('Premium is not available in your country') !== -1) {
                    result["YouTube"] = "<b>YouTube Premium: </b>未支持 🚫"
                    resolve("YTB test failed");
                } else {
                    let region = ''
                    let re = new RegExp('"GL":"(.*?)"', 'gm')
                    let ret = re.exec(data)
                    if (ret != null && ret.length === 2) {
                        region = ret[1]
                    } else if (data.indexOf('www.google.cn') !== -1) {
                        region = 'CN'
                    } else {
                        region = 'US'
                    }
                    result["YouTube"] = "<b>YouTube Premium: </b>支持 "+arrow+ "⟦"+flags.get(region.toUpperCase())+"⟧ 🎉"
                    resolve(region);
                }
            } else {
                result["YouTube"] = "<b>YouTube Premium: </b>检测失败 ❗️";
                resolve(response.status);
            }
        })
    })
}
