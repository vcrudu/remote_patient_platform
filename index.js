var express = require("express");
var app = express();
var morgan = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var auth = require("./auth");
var checkExistsUserController = require("./controllers/checkExistsUser");
var controllers = require('./controllers');
var https = require('https');
var fs = require('fs');

process.env.JWT_SECRET = "HABICARIA";

app.use(express.static(__dirname+"/public/"));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}));
// parse application/json
app.use(bodyParser.json());
app.use(morgan("dev"));

auth.configureJwt(app);

checkExistsUserController.init(app);
controllers.init(app);

app.get('/',function(req, res){
    var options = {
        root: __dirname + '/public/'
    };
    res.sendFile('index.html', options);
});

app.get('/register',function(req, res){
    var options = {
        root: __dirname + '/public/'
    };
    res.sendFile('register.html', options);
});

https.createServer({
    key:fs.readFileSync('./cert/trichromekey.pem'),
    cert:fs.readFileSync('./cert/trichromecert.pem'),
    passphrase: "PucaMica123"
},app).listen(8080);