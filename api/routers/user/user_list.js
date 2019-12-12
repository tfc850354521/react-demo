
module.exports = function(){
    const {app, db, ObjectID} = global;

    // 获取用户列表
    app.get('/users', async (req, res)=>{
        var {page, num, userid, username_like, username} = req.query;
        if( page==undefined || num==undefined ){
            res.json({
                code : 0,
                text : '参数错误，缺少page和num参数'
            });
            return;
        }

        var skip_v = (page-1)*num;
        var limit_v = num*1;

        var mysort = {_id:-1}	// 1 表示升序； -1 表示降序
        var where = {}
        if( userid ){
            where = { _id : ObjectID(userid) }
        }
        if( username ){
            where = { username }
        }
        if( username_like ){
            where = { username : new RegExp(username_like) }
        }

        var count = await db.collection("users").find(where).count();
        var data = await db.collection("users").find(where).sort(mysort).skip(skip_v).limit(limit_v).toArray();
        res.json({
            code : 1,
            text : '获取成功',
            data,
            count,
            page,
            num,
            maxpage : Math.ceil(count/num)
        })
    })
}