const fs = require('fs');

module.exports = function(){
    const {app, db, jwt} = global;

    app.post('/adminlogin', async (req, res)=>{
        var {adminname, adminpass} = req.body;
        if( adminname=='wangyang' && adminpass=='wy123456' ){

            var admin_token = jwt.sign({
                adminname,
                adminpass,
            }, 'secret', { expiresIn: 60*60*24 });

            res.json({
                code : 1,
                text : '管理员登录成功',
                admin_token
            });
        }else{
            res.json({
                code : 0,
                text : '管理员登录失败'
            });
        }
    })


    app.get('/checklogin', async (req, res)=>{
        var {at} = req.query;
        
        // 验证码token
        try{
            var decoded = jwt.verify(at, 'secret');
            res.json({'code':1, 'text':'管理员验证码token正确'});
        }catch(e){
            res.json({'code':0, 'text':'管理员验证码token错误'});
            return;
        }
        
    })

}