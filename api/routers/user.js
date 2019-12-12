
module.exports = function(){
    var arr = [
        'user_charts.js',
        'user_list.js',
        'user_login.js',
        'user_register.js',
        'user_star.js',
        'user_update.js',
        'user_address.js',
    ];

    arr.forEach(file=>{
        require('./user/'+file)();
    })
}