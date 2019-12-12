module.exports = function(){
    const {jwt, db, ObjectID, app} = global;

    app.post('/chats', async (req, res)=>{
        var token = req.body.token;
        var myuser;
        try{
            myuser = jwt.verify(token, 'secret');
        }catch(e){
            res.json({'code':0, 'text':'无法获取聊天名单，token错误，请先登录。'});
            return;
        }
        // 获取我的聊天名单
        var where = {_id:ObjectID(myuser.userid)}
        var result = await db.collection("users").find(where).toArray();
        var chats = result[0].chats || [];
        res.json({'code':1, 'text':'聊天名单获取成功', chats});
    })

    const WebSocketServer = require('ws').Server;
    const wss = new WebSocketServer({port:1001});
    const clients = {}  // 保存所有的客户端
    
    wss.on('connection', (ws, req)=>{
        // 获取客户端ip
        var ip = ws._socket.remoteAddress;
        // 获取用户token
        var myuser = {};
        var token = req.url.substring(2);
        try{
            myuser = jwt.verify(token, 'secret');
        }catch(e){
            ws.send(JSON.stringify({'code':0, 'text':'无法使用聊天室功能，token错误，请先登录。'}));
            return;
        }
        // 记录每一个人的socket
        clients[myuser.userid] = ws;

        // 客户端向服务器发送的数据
        ws.on('message', message=>{ 
            // 服务器得到客户端发过来的数据后，处理一下数据
            var msg = {
                myuser : {
                    userid : myuser.userid,
                    userimg : myuser.userimg,
                    username : myuser.username,
                    usertel : myuser.usertel,
                },
                ...JSON.parse(message),
                addtime : new Date(),
                myip : ip
            };           
            // 不能发送空数据
            if( !msg.content ){
                ws.send(JSON.stringify({'code':0, 'text':'不能发送空数据。'}));
                return;
            }    
            // 我与某人对话的初略痕迹
            if (msg.status === '痕迹'){
                // 查找
                function users_chats(my, to){
                    var targetid = msg[to].userid;
                    var where = {_id:ObjectID(msg[my].userid)}
                    db.collection("users").find(where).toArray((err, result)=>{
                        if( result.length === 0 ){
                            ws.send(JSON.stringify({'code':0, 'text':'对方并非我们的用户'}));
                            return;
                        }
                        var chats = result[0].chats || [];
                        var index = chats.findIndex(item=>item.target.userid===targetid);
                        if( index === -1 ){
                            // 第一次添加
                            chats.push({
                                target : msg[to],
                                addtime : msg.addtime,
                                myip : msg.myip
                            });                   
                            // 更新目标的数据库
                            var updateObj = {$set:{chats}};
                            db.collection("users").updateOne(where, updateObj);
                        }
                    });
                }
                // 我给某人发言时，更新我的数据库记录
                users_chats('myuser', 'touser');
                // 我给某人发言时，更新他的数据库记录
                users_chats('touser', 'myuser');
            }
            // 对方是否已读该信息
            msg.read = 0;   // 未读           
            // 目标客户端的socket
            var c = clients[msg.touser.userid];
            // 对方在线时，对方的socket直接得数据
            if( c && c.readyState === 1 ){
                msg.read = 1;   // 已读
                // 如果对方正在线中，则直接发数据
                msg.toip = c._socket.remoteAddress;
                msg.status = '接收';
                c.send(JSON.stringify(msg));
            }
            // 我接收到的数据
            msg.status = '发送';
            ws.send(JSON.stringify(msg))
            // 无论对方是否在线，数据都保存到数据库中
            db.collection("chat").insertOne( msg );
        });
    });
}