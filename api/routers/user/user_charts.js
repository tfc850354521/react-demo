

module.exports = function(){
    const {app, db} = global;

    // 获取最近5天的用户增长数量
    app.get('/user_charts', async (req, res)=>{
        var d = {}

        for( var i=0; i<5; i++){
            var dt1 = new Date();
            dt1.setDate(dt1.getDate()-i);
            dt1.setHours(0);
            dt1.setMinutes(0);
            dt1.setSeconds(0);

            var dt2 = new Date();
            dt2.setDate(dt2.getDate()-i+1);
            dt2.setHours(0);
            dt2.setMinutes(0);
            dt2.setSeconds(0);

            var where = {
                "regtime":{$gte:dt1}, 
                "regtime":{$lte:dt2}
            }
            
            var count = await db.collection("users").find(where).count();

            d[i] = {
                dt1,
                dt2,
                count
            };
        }

        res.json({
            code : 1,
            text : '获取成功',
            d
        })
    })
}