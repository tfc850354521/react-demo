const fs = require('fs');
const md5 = require('../../modules/md5.js');
const svgCaptcha = require('../../modules/svg-captcha.js');
const fspath = require('path');

module.exports = function(){
    const {app, db, ObjectID, jwt} = global;

    // 用户注册
    app.post('/user', async (req, res)=>{
        // 表单验证
        var {username, password, tel} = req.body;
        if( username=='' || password=='' || tel=='' ){
            res.json({'code':0, 'text':'请输入用户名及密码及手机号码'});
            return;
        }
        // 验证码token
        var {cap_token, cap} = req.body;
        try{
            var decoded = jwt.verify(cap_token, 'secret');
            var captext = decoded.text;
            if( captext != cap ){
                res.json({'code':0, 'text':'验证码错误', captext, cap});
                return;
            }
        }catch(e){
            res.json({'code':0, 'text':'验证码token错误'});
            return;
        }
        // 用户名重名
        var where = {username}
        var count = await db.collection("users").find(where).count();
        if( count>0 ){
            res.json({'code':0, 'text':'用户名被占用'});
            return;
        }
        // 手机号重名
        var where = {tel}
        var count = await db.collection("users").find(where).count();
        if( count>0 ){
            res.json({'code':0, 'text':'手机号被占用，可以直接使用手机短信登录'});
            return;
        }
        // 生成数据
        var myobj = {
            username,
            password : md5(password), 
            //img,
            regtime : new Date(),   //.toLocaleString(),
            regip : req.ip,
            lasttime : new Date(),
            lastip : req.ip,
            lastlogin : [],
            tel,
            //telcode:undefined,        // 短信验证码
            //telcodetime:undefined,    // 短信验证码的过期时间
            telregister : false,        // 是否为手机注册
            star : [],                  // 我关注的人
            star_num : 0                // 我关注的人数量
        }
        var result = await db.collection("users").insertOne( myobj );
        var userid = result.insertedId.toString();

        // 用户头像       
        var img = '';
        if( req.file ){
            var newFileName = '';
            var {originalname, path, filename} = req.file;
            var i = originalname.lastIndexOf('.');
            var ext = originalname.substring(i).toLowerCase();
            var allow_ext = ['.jpg','.png','.bmp','.gif','.jpeg'];
            if( allow_ext.indexOf(ext)>-1 ){
                // 根据userid生成目录                
                var useridfolder = fspath.join('./uploads/', userid);   
                var bln = fs.existsSync(useridfolder);
                if( !bln ){
                    fs.mkdirSync(useridfolder);
                }
                // 移动文件
                newFileName = useridfolder+'/'+filename+'-'+originalname;
                fs.renameSync(path, newFileName);
                img = newFileName.replace('uploads/', '').replace('uploads\\', '');
                // 更新数据库
                var whereObj = {_id:ObjectID(userid)};
                var updateObj = {$set:{img}};
                await db.collection("users").updateOne(whereObj, updateObj);
                res.json({'code':1, 'text':'注册成功', 'userid':userid, myobj, 'userimg':img});
            }else{
                res.json({'code':1, 'text':'注册成功，但头像添加失败，上传文件必须是:'+allow_ext.join('、')});
                return;
            }
        }else{
            res.json({'code':1, 'text':'注册成功', 'userid':userid, myobj});
        }      
    })


    // 用户注册时的随机数验证码
    app.get('/svgcaptcha', async (req, res)=>{
        var cap = svgCaptcha();
        
        var captcha = jwt.sign({
            text : cap.text
        }, 'secret', { expiresIn: 60*60*24 });
        
        res.json({...cap, captcha})
    })

    // 获取短信验证码
    app.post('/getphonecode', async (req, res)=>{
        var tel = req.body.tel;
        if( !tel ){
            res.json({'code':0, 'text':'请提交手机号码'});
            return;
        }
        // 随机数验证码token
        var {cap_token, cap} = req.body;
        try{
            var decoded = jwt.verify(cap_token, 'secret');
            var captext = decoded.text;
            if( captext != cap ){
                res.json({'code':0, 'text':'随机数验证码错误', captext, cap});
                return;
            }
        }catch(e){
            res.json({'code':0, 'text':'随机数验证码token错误'});
            return;
        }

        // 随机的验证码
        function rndcode(){
            return parseInt(Math.random()*8999)+1000;
        }
        var telcode = rndcode();

        // 短信验证码多久过期？
        var exp = 60;   // 分钟
        // 检查手机号码是否被注册
        var where = {tel}
        var result = await db.collection("users").find(where).toArray();
        var newRegister = false;

        if( result.length === 0 ){
            /*
            res.json({
                'code':0, 
                'text':'该手机号并未注册，请先注册。'
            });
            return;
            */
            // 如果该手机号没有被注册，则直接短信快速注册
            newRegister = true;
            var telcodetime = new Date();
            telcodetime.setMinutes(telcodetime.getMinutes()+exp);
            
            var myobj = {
                username : '手机用户'+new Date().getTime(),
                password : md5(''+new Date().getTime()), 
                img : '',
                regtime : new Date(),
                regip : req.ip,
                lasttime : new Date(),
                lastip : req.ip,
                lastlogin : [],
                tel,
                telcodetime,
                telcode,
                telregister : true
            }
            
            await db.collection("users").insertOne( myobj );
            result = [myobj];
        }

        // 短信限制
        if ( result[0].telcodetime ){
            if( newRegister ){
                // 这是短信登录时，直接注册的账户，不需要做时间判断了
            }else if( result[0].telcodetime.getTime() - new Date().getTime() > 0 ){
                res.json({
                    'code':0, 
                    'text':exp+'分钟内不需要重复发短信', 
                    'telcode':result[0].telcode,
                    'exptime':result[0].telcodetime.toLocaleString()
                });
                return;
            }
        }

        // 如果时纯粹的短信登录，则需要更新数据库
        if( newRegister===false ){
            var telcodetime = new Date();
            telcodetime.setMinutes(telcodetime.getMinutes()+exp);
            var whereObj = {tel};
            var updateObj = {$set:{
                telcode,
                telcodetime
            }};
            await db.collection("users").updateOne(whereObj, updateObj);
        }

        // 发送短信
        require('../../modules/sms.js')([tel], [telcode, exp]);

        res.json({
            'code':1, 
            'text':'短信验证码发送成功',
            'tel' : tel,
            'telcode' : telcode
        });

    })
}