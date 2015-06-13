var express = require("express");
var app = express();


app.use(express.static(__dirname+"/public/"));
app.get('/',function(req,res){
    var options = {
        root: __dirname + '/public/'
    };
    res.sendFile('index.html', options);
});

app.get('/register',function(req,res){
    var options = {
        root: __dirname + '/public/'
    };
    res.sendFile('register.html', options);
});

app.listen(8080);