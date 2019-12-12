const md5 = require('../../modules/md5.js');

module.exports = function(){
    const {app, db, ObjectID, jwt} = global;

    // 使用手机短信登录
    app.post('/usephonelogin', async (req, res)=>{
        var {tel, telcode} = req.body;
        // 表单数据验证
        if( tel=='' || telcode == '' ){
            res.json({'code':0, 'text':'请输入手机号码或短信验证码'});
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

        // 查询手机是否存在
        var where = {tel}
        var result = await db.collection("users").find(where).toArray();
        if( result.length === 0 ){
            res.json({'code':0, 'text':'不存在该手机账户，请先注册'});
            return;
        }

        // 短信验证
        var {telcodetime} = result[0];
        if ( telcodetime ){
            if( telcodetime.getTime() - new Date().getTime() > 0 ){
                if( result[0].telcode != telcode ){
                    res.json({'code':0, 'text':'手机短信验证码错误'});
                    return;
                }
            }else{
                res.json({'code':0, 'text':'手机短信验证码于'+telcodetime.toLocaleString()+'过期了'});
                return;
            }
        }else{
            res.json({'code':0, 'text':'还未向该手机发送短信验证码'});
            return;
        }

        // 短信验证通过
        var {token} = await login_success_update(result[0], req.ip);

        res.json({
            'code':1, 
            'text':'手机短信登录成功',
            result : result[0],
            token
        });
    })

    async function login_success_update(item, ip){
        var lastlogin = item.lastlogin ? [...item.lastlogin] : [];
        var last = {
            lasttime : new Date(),
            lastip : ip,
        }
        lastlogin.push({...last});

        var whereObj = {_id:item._id};
        var updateObj = {$set:{...last, lastlogin}};
        await db.collection("users").updateOne(whereObj, updateObj);

        var token = jwt.sign({
            userid : item._id.toString(),
            username : item.username,
            password : item.password,
            usertel : item.tel,
            userimg : item.img,
        }, 'secret', { expiresIn: 60*60*24 });

        return new Promise((resolve, reject)=>{
            resolve({token})
        })
    }


    // 用户名登录
    app.post('/user_login', async (req, res)=>{
        var {username, password} = req.body;
        if( username==undefined || password==undefined ){
            res.json({
                code : 0,
                text : '请输入用户名或密码'
            });
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
        // 验证数据库
        var where = {username, password:md5(password)}
        var result = await db.collection("users").find(where).toArray();
        if( result.length === 0 ){
            res.json({'code':0, 'text':'用户名或密码错误'});
            return;
        }

        var {token} = await login_success_update(result[0], req.ip);

        res.json({
            'code':1, 
            'text':'登录成功',
            result : result[0],
            token
        });
    })
}