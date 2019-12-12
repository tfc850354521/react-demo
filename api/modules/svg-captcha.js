const svgCaptcha = require('svg-captcha');

module.exports = function(){
    const cap = svgCaptcha.create({
        size: 4, // 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        noise: 1, // 干扰线条的数量
        color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
        background: '#f5f5f5', // 验证码图片背景颜色
        width: 100, // width of captcha
        height: 30, // height of captcha
        fontSize: 30, // captcha text size
        //charPreset: 'abcd', // 预设的字符串
    });
    return cap;
}