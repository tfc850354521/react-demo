const fs = require('fs');
const md5 = require('../../modules/md5.js');

module.exports = function(){
    const {app, db, ObjectID, jwt} = global;

    // 修改用户名
    app.post('/modifyusername', async (req, res)=>{
        var {token, newusername} = req.body;
        // 验证token
        try{
            var decoded = jwt.verify(token, 'secret');
            var userid = decoded.userid;
            //var username = decoded.username;
        }catch(e){
            res.json({'code':0, 'text':'修改失败，token错误。'});
            return;
        }
        // 用户名是否重复
        var where = {username:newusername}
        var result = await db.collection("users").find(where).toArray();
        if( result.length === 1 ){
            res.json({'code':0, 'text':'修改失败，新用户名已被占用。'});
            return;
        }
        // 修改
        var whereObj = {_id:ObjectID(userid)};
        var updateObj = {$set:{username:newusername}};
        await db.collection("users").updateOne(whereObj, updateObj);
        res.json({'code':1, 'text':'用户名修改成功' });
    })


    // 修改用户头像
    app.post('/modifyuserimg', async (req, res)=>{
        var {token} = req.body;
        // 验证token
        try{
            var decoded = jwt.verify(token, 'secret');
            var userid = decoded.userid;
            //var username = decoded.username;
        }catch(e){
            res.json({'code':0, 'text':'修改失败，token错误。'});
            return;
        }
        // 图片上传
        var newFileName = '';
        if( req.file ){
            var {originalname, path, filename} = req.file;
            var i = originalname.lastIndexOf('.');
            var ext = originalname.substring(i).toLowerCase();
            var allow_ext = ['.jpg','.png','.bmp','.gif','.jpeg'];
            if( allow_ext.indexOf(ext)>-1 ){
                // 根据userid生成目录
                var useridfolder = require('path').join('./uploads/', userid);
                var bln = fs.existsSync(useridfolder);
                if( !bln ){
                    fs.mkdirSync(useridfolder);
                }
                // 移动文件
                newFileName = useridfolder+'/'+filename+'-'+originalname;
                fs.renameSync(path, newFileName);
                newFileName = newFileName.replace('uploads/', '').replace('uploads\\', '');
            }else{
                res.json({'code':0, 'text':'添加失败，上传文件必须是:'+allow_ext.join('、')});
                return;
            }
        }else{
            res.json({'code':0, 'text':'添加失败，必须上传文件。'});
            return;
        }
        // 修改数据
        var whereObj = {_id:ObjectID(userid)};
        var updateObj = {$set:{img:newFileName}};
        await db.collection("users").updateOne(whereObj, updateObj);
        res.json({'code':1, 'text':'用户头像修改成功', newFileName });
    })

    // 修改用户密码
    app.post('/modifyuserpwd', async (req, res)=>{
        var {token, newuserpwd} = req.body;
        // 验证token
        try{
            var decoded = jwt.verify(token, 'secret');
            var userid = decoded.userid;
            //var username = decoded.username;
        }catch(e){
            res.json({'code':0, 'text':'修改失败，token错误。'});
            return;
        }
        // 修改
        var whereObj = {_id:ObjectID(userid)};
        var updateObj = {$set:{password:md5(newuserpwd)}};
        await db.collection("users").updateOne(whereObj, updateObj);
        res.json({'code':1, 'text':'用户密码修改成功' });
    })

}