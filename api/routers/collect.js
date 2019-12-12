const fs = require('fs');

module.exports = function(){
    const {app, db, ObjectID} = global;

    app.get('/collects', async (req, res)=>{
        var {page, num, token} = req.query;
        if( page==undefined || num==undefined ){
            res.json({
                code : 0,
                text : '参数错误，缺少page和num'
            });
            return;
        }

        try{
            var decoded = jwt.verify(token, 'secret');
            var userid = decoded.userid;
        }catch(e){
            res.json({'code':0, 'text':'获取失败，token错误。'});
            return;
        }

        var skip_v = (page-1)*num;
        var limit_v = num*1;

        var mysort = {_id:-1}	// 1 表示升序； -1 表示降序
        var where = {
            "collects.userid" : userid,
            "collects.valid" : true
        }
        var count = await db.collection("topics").find(where).count();
        var data = await db.collection("topics").find(where).sort(mysort).skip(skip_v).limit(limit_v).toArray();

        res.json({
            code : 1,
            text : '我的收藏获取成功',
            data,
            count,
            page,
            num,
            maxpage : Math.ceil(count/num)
        })
    })

    // 添加
    app.post('/collect', async (req, res)=>{
        
        var {topicid, token} = req.body;
        try{
            var decoded = jwt.verify(token, 'secret');
            var userid = decoded.userid;
            var username = decoded.username;
        }catch(e){
            res.json({'code':0, 'text':'添加失败，token错误。'});
            return;
        }

        // 获取原始数据
        var where = {_id:ObjectID(topicid)};
        var data = await db.collection("topics").find(where).toArray();
        var collects = data[0].collects || [];
        var index = collects.findIndex(item=>item.userid.toString()==userid);
        var valid = true;
        if( index === -1 ){
            // 第一次添加
            collects.push({
                userid,
                username,
                addip : req.ip,
                addtime : new Date(),
                valid : valid    // true收藏；false取消收藏
            });
        }else{
            // 之前保存过
            valid = !collects[index].valid;
            collects[index].valid = valid;
            collects[index].lastip = req.ip;
            collects[index].lasttime = new Date();
        } 
        var collects_num = collects.filter(item=>item.valid).length;

        // 更新
        var whereObj = {_id:ObjectID(topicid)};
        var updateObj = {$set:{
            lasttime : new Date(),
            collects,
            collects_num
        }};
        await db.collection("topics").updateOne(whereObj, updateObj);
        res.json({'code':1, 'text':valid?'收藏成功':'取消收藏', index, valid, 'mycollect':collects[index]});
        
    })

}