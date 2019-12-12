const express = require('express');
const app = express();
global.app = app;

app.use(express.static('uploads'));

const jwt = require('jsonwebtoken');
global.jwt = jwt;

app.all('*', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    next();
})

const multer = require('multer');     
const upload = multer({"dest":"uploads/"}).single('file1');
app.use(upload);

const bodyParser = require('body-parser');
app.use(bodyParser());

const session = require("express-session");
app.use(session({"secret":"wy"}));

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
global.ObjectID = ObjectID;

const url = "mongodb://localhost:27017/";
MongoClient.connect(url, function(err, database) {
    const db = database.db("react_project");
    global.db = db;
    
    var arr = [
        'user.js', 
        'topic.js', 
        'collect.js', 
        'comment.js', 
        'admin.js', 
        'video.js',
        'ws.js'
    ];
    
    arr.forEach(url=>{
        require('./routers/'+url)();
    })
});

app.listen(100);