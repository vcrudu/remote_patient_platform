var express = require("express");
var app = express();
var morgan = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var auth = require("./auth");
var checkExistsUserController = require("./controllers/checkExistsUser");
var controllers = require('./controllers');
var https = require('https');
var http = require('http');
var fs = require('fs');
var logging     = require('./logging');
var gridCacheClient = require('./services/gridCacheClient');
var checkExistsNhs = require("./controllers/checkExistsNhs");
var reset = require("./controllers/reset");
var resetPasswordController = require("./controllers/resetPasswordController");
var confirmSubscriptionController = require("./controllers/confirmSubscription");

process.env.JWT_SECRET = "HABICARIA";

app.use(express.static(__dirname+"/public/"));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, x-access-token');
    next();
});

app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}));
// parse application/json
app.use(bodyParser.json());
app.use(morgan("dev"));

auth.configureJwt(app);

reset.init(app);
resetPasswordController.init(app);
checkExistsUserController.init(app);
checkExistsNhs.init(app);
controllers.init(app);
confirmSubscriptionController.init(app);


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

var PORT = process.env.port || 8081;
logging.getLogger().debug({message:"Server started at port " + PORT} );
var server = http.createServer(app);
var notifications = require('./notifications');
notifications.init(server);
gridCacheClient.init();

process.on('uncaughtException', function (err) {
    logging.getLogger().error(err);
    process.exit(1);
});

//server.listen(PORT, "192.168.1.219");
server.listen(PORT);

