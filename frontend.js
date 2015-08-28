var express = require("express");
var app = express();
var morgan = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
//var auth = require("./auth");
//var checkExistsUserController = require("./controllers/checkExistsUser");
//var controllers = require('./controllers');
var https = require('https');
var http = require('http');
var fs = require('fs');
var logging     = require('./logging');

process.env.JWT_SECRET = "HABICARIA";

app.use(express.static(__dirname+"/public/"));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, x-access-token');
    next();
});

app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}));
// parse application/json
app.use(bodyParser.json());
app.use(morgan("dev"));

//auth.configureJwt(app);

//checkExistsUserController.init(app);
//controllers.init(app);

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

/*https.createServer({
 key:fs.readFileSync('./cert/trichromekey.pem'),
 cert:fs.readFileSync('./cert/trichromecert.pem'),
 passphrase: "PucaMica123"
 },app).listen(8080);*/

var PORT = process.env.port || 8080;
logging.getLogger().trace({message:"Main port used - ",port:PORT});

var server = http.createServer(app);
//var notifications = require('./notifications');
//notifications.init(server);
server.listen(PORT);