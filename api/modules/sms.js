// https://cloud.tencent.com/document/product/382/3772
var QcloudSms = require("qcloudsms_js");

module.exports = function(phoneNumbers, params){
        
    // 短信应用 SDK AppID
    // https://console.cloud.tencent.com/smsv2/app-manage
    var appid = '1400009099'; // SDK AppID 以1400开头

    // 短信应用 SDK AppKey
    var appkey = "9ff91d87c2cd7cd0ea762f141975d1df37481d48700d70ac37470aefc60f9bad";
    // 需要发送短信的手机号码
    //var phoneNumbers = [tel];   //["13718932754"];
    // 短信模板 ID，需要在短信控制台中申请
    // https://console.cloud.tencent.com/smsv2/csms-template
    var templateId = '7839' // NOTE: 这里的模板ID`7839`只是示例，真实的模板 ID 需要在短信控制台中申请
    // 签名
    // https://console.cloud.tencent.com/smsv2/csms-sign
    var smsSign = '王杨个人文章分享'    //"腾讯云";  // NOTE: 签名参数使用的是`签名内容`，而不是`签名ID`。这里的签名"腾讯云"只是示例，真实的签名需要在短信控制台申请
    // 实例化 QcloudSms
    var qcloudsms = QcloudSms(appid, appkey);
    // 设置请求回调处理, 这里只是演示，用户需要自定义相应处理回调
    function callback(err, res, resData) {
        //if (err) {
            //console.log("err: ", err);
        //} else {
            //console.log("request data: ", res.req);
            //console.log("response data: ", resData);
        //}
    }

    var ssender = qcloudsms.SmsSingleSender();
    //var params = [telcode, exp];
    ssender.sendWithParam("86", phoneNumbers[0], templateId, params, smsSign, "", "", callback);

}