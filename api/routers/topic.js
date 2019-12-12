const fs = require('fs');

module.exports = function(){
    const {app, db, ObjectID} = global;

    // 获取主题
    app.get('/topics', async (req, res)=>{
        var {page, num, userid, topicid} = req.query;
        if( page==undefined || num==undefined ){
            res.json({
                code : 0,
                text : '参数错误'
            });
            return;
        }

        var skip_v = (page-1)*num;
        var limit_v = num*1;

        var mysort = {_id:-1}	// 1 表示升序； -1 表示降序
        var where = {}
        if( userid ){   // 根据发布人查询
            where = {
                userid
            }
        }
        if( topicid ){  // 根据编号查询
            where = {
                _id : ObjectID(topicid)
            }
        }

        var count = await db.collection("topics").find(where).count();
        var data = await db.collection("topics").find(where).sort(mysort).skip(skip_v).limit(limit_v).toArray();
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

    // 添加主题
    app.post('/topic', async (req, res)=>{
        
        // 验证token
        var {content, token} = req.body;
        try{
            var decoded = jwt.verify(token, 'secret');
            var userid = decoded.userid;
            var username = decoded.username;
            var userimg = decoded.userimg;
            var usertel = decoded.usertel;
        }catch(e){
            res.json({'code':0, 'text':'添加失败，token错误。'});
            return;
        }
        // 文件上传
        var newFileName = '';
        if( req.file ){
            var {originalname, path, filename} = req.file;
            var i = originalname.lastIndexOf('.');
            var ext = originalname.substring(i).toLowerCase();
            var allow_ext = ['.mov','.mp4','.jpg','.png','.bmp','.gif','.jpeg'];
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
        // 写入数据
        var myobj = {
            content,  
            file : newFileName,
            userid,
            user:{
                userid,
                username,
                userimg,
                usertel
            },
            addtime : new Date(),//.toLocaleString(),
            ip : req.ip,
            lasttime : new Date(),//.toLocaleString(),
            collects : [],
            collects_num : 0,
            comments : [],
            comments_num : 0,
            thumbs : [],
            thumbs_mun : 0
        }
        var result = await db.collection("topics").insertOne( myobj );
        res.json({'code':1, 'text':'添加成功', 'topicid':result.insertedId, newFileName})
    })

    // 我给某个主题点赞
    app.post('/thumbs', async (req, res)=>{
        // 验证码token
        var {token, topicid} = req.body;
        try{
            var decoded = jwt.verify(token, 'secret');
            var myuser = decoded;
        }catch(e){
            res.json({'code':0, 'text':'请先登录，token错误'});
            return;
        }
        // 验证数据
        if( !topicid ){
            res.json({'code':0, 'text':'点赞失败，缺少topicid参数。'});
            return;
        }
        // 数据库
        var where = {_id:ObjectID(topicid)}
        var result = await db.collection("topics").find(where).toArray();
        var userid = result[0].userid;
        var thumbs = result[0].thumbs || [];
        if( userid === myuser.userid ){
            res.json({'code':0, 'text':'点赞失败，自己不能给自己点赞。'});
            return;
        }
        var index = thumbs.findIndex(item=>item._id===myuser._id);
        var text;
        if( index === -1 ){
            thumbs.push({
                userid:myuser.userid,
                username:myuser.username,
                userimg:myuser.userimg,
                time:new Date(),
                ip : req.ip,
                valid : true    // true点赞；false取消点赞
            })
            text = '点赞成功';
        }else{
            thumbs[index].valid = !thumbs[index].valid;
            thumbs[index].lastip = req.ip;
            thumbs[index].lasttime = new Date();
            text = thumbs[index].valid ? '重新点赞成功' : '取消点赞';
        }
        var thumbs_num = thumbs.filter(item=>item.valid).length;
        // 更新数据库
        var whereObj = {_id:ObjectID(topicid)};
        var updateObj = {$set:{
            lasttime : new Date(),
            thumbs,
            thumbs_num
        }};
        await db.collection("topics").updateOne(whereObj, updateObj);

        res.json({'code':1, text, index});
    })

}

