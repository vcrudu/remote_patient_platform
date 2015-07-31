var express = require("express");
var app = express();
var morgan = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var auth = require("./auth");
var checkExistsUserController = require("./controllers/checkExistsUser");

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

checkExistsUserController.init(app);
app.listen(8080);