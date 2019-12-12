

module.exports = function(){
    const {app, db, ObjectID, jwt} = global;

    // 我关注其他用户
    app.post('/star', async (req, res)=>{
        // 验证码token
        var {token, touserid, tousername, touserimg} = req.body;
        try{
            var decoded = jwt.verify(token, 'secret');
            var myuser = decoded;
        }catch(e){
            res.json({'code':0, 'text':'请先登录，token错误'});
            return;
        }
        // 验证数据
        if( !touserid || !tousername || !touserimg ){
            res.json({'code':0, 'text':'关注失败，缺少必要参数。'});
            return;
        }
        // 数据库
        var where = {_id:ObjectID(myuser.userid)}
        var result = await db.collection("users").find(where).toArray();
        var star = result[0].star || [];
        if( touserid === myuser.userid ){
            res.json({'code':0, 'text':'关注失败，自己不能关注自己。'});
            return;
        }
        var index = star.findIndex(item=>item.userid===touserid);
        var text;
        if( index === -1 ){
            star.push({
                userid:touserid,
                username:tousername,
                userimg:touserimg,
                time:new Date(),
                ip : req.ip,
                valid : true    // true关注；false取消关注
            });
            text = '关注用户成功';
        }else{
            star[index].valid = !star[index].valid;
            star[index].lastip = req.ip;
            star[index].lasttime = new Date();
            text = star[index].valid ? '重新关注用户成功' : '取消关注';
        }
        var star_num = star.filter(item=>item.valid).length;
        // 更新数据库
        var whereObj = {_id:ObjectID(myuser.userid)};
        var updateObj = {$set:{
            lasttime : new Date(),
            star,
            star_num
        }};
        await db.collection("users").updateOne(whereObj, updateObj);

        res.json({'code':1, text, index});
    })
}