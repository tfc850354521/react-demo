const fs = require('fs');

module.exports = function(){
    const {app, db, ObjectID} = global;

    app.get('/comments', async (req, res)=>{
        
        var {topicid, token} = req.query;
        var where = {};
        if( topicid == undefined ){
            // 获取我评论过的主题
            try{
                var decoded = jwt.verify(token, 'secret');
                var userid = decoded.userid;
            }catch(e){
                res.json({'code':0, 'text':'获取失败，token错误。'});
                return;
            }

            where = {
                'comments.userid' : userid
            }
        }else{
            // 获取指定编号的主题（主题中含评论字段）
            where = {
                _id : ObjectID(topicid)
            }
        }

        var data = await db.collection("topics").find(where).toArray();

        res.json({
            code : 1,
            text : '获取成功',
            topicid,
            data
        })
        
    })

    // 添加
    app.post('/comment', async (req, res)=>{
        
        var {topicid, token, content} = req.body;
        try{
            var decoded = jwt.verify(token, 'secret');
            var userid = decoded.userid;
            var username = decoded.username;
        }catch(e){
            res.json({'code':0, 'text':'添加失败，token错误。'});
            return;
        }
        // 数据验证
        if( !topicid ){
            res.json({'code':0, 'text':'添加失败，缺少主题编号'});
            return;
        }
        if( !content ){
            res.json({'code':0, 'text':'添加失败，缺少评论内容'});
            return;
        }

        // 获取原始数据
        var where = {_id:ObjectID(topicid)};
        var data = await db.collection("topics").find(where).toArray();
        var comments = data[0].comments || [];
        // 添加评论
        var item = {
            userid,
            username,
            content,
            time : new Date(),
            ip : req.ip
        }
        comments.push(item);
        // 更新主题
        var whereObj = {_id:ObjectID(topicid)};
        var updateObj = {$set:{
            lasttime : new Date(),
            comments,
            comments_num : comments.length
        }};
        var result = await db.collection("topics").updateOne(whereObj, updateObj);
        res.json({'code':1, 'text':'评论添加成功', item});
        
        
    })

}