
module.exports = function(){
    const {app, db, ObjectID, jwt} = global;

    // 获取我的地址
    app.get('/address', async (req, res)=>{
        var {token} = req.query;
        // 验证token
        try{
            var decoded = jwt.verify(token, 'secret');
            var userid = decoded.userid;
        }catch(e){
            res.json({'code':0, 'text':'获取地址失败，token错误。'});
            return;
        }
        // 获取
        var where = {_id:ObjectID(userid)}
        var result = await db.collection("users").find(where).toArray();
        var address = result[0].address || [];
        res.json({'code':1, 'text':'获取我的地址成功', address});    
    })

    // 添加我的地址
    app.post('/address', async (req, res)=>{
        var {token, location} = req.body;
        // 验证token
        try{
            var decoded = jwt.verify(token, 'secret');
            var userid = decoded.userid;
        }catch(e){
            res.json({'code':0, 'text':'添加地址失败，token错误。'});
            return;
        }
        //
        if ( location ){
            location = JSON.parse(location);
        }
        // 获取
        var where = {_id:ObjectID(userid)}
        var result = await db.collection("users").find(where).toArray();
        var address = result[0].address || [];
        address.push(location);
        // 修改
        var whereObj = {_id:ObjectID(userid)};
        var updateObj = {$set:{address}};
        await db.collection("users").updateOne(whereObj, updateObj);
        res.json({'code':1, 'text':'新地址添加成功' });
    })
}