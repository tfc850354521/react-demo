const fs = require('fs');
const path = require('path');

module.exports = function(){
    const {app, db, jwt} = global;

    app.get('/load_video', async (req, res)=>{

        var dir = path.join(__dirname,'../video/sz1911');
        var folders = fs.readdirSync(dir);
        var html = ``;

        var len = folders.length;
        for( var i=0; i<len; i++ ){
            var filepath = dir+'/'+folders[i];
            var stats = fs.statSync(filepath);
            if( stats.isDirectory() ){
                var catalogs = fs.readdirSync(filepath);
                for( var j=0,l=catalogs.length; j<l; j++ ){
                    
                    var stats2 = fs.statSync(filepath+'/'+catalogs[j]);
                    if( stats2.isDirectory() ){
                        var files = fs.readdirSync(filepath+'/'+catalogs[j]);
                    
                        console.log(filepath+'/'+catalogs[j], files)
                    }
                }     
            }
        }

        res.send(html);

    })

}