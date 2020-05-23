/**
 * Created by Victor on 07/08/2015.
 */

(function() {
    var apiKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
    var apiSecret = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
    var zoomApiUrl = "api.zoom.us";
    var sslPort = 443;
    var https = require('https');
    var fs = require('fs');
    var querystring = require('querystring');
    var _ = require('underscore');
    var moment = require('moment');

    function getUser(userId, callback) {

        var post_data = querystring.stringify({
            'api_key' : apiKey,
            'api_secret': apiSecret,
            'data_type': 'JSON',
            'email' : userId,
            'type' : '1',
            'login_type' : '99'
        });

        var reqOptions = {
            hostname: zoomApiUrl,
            port: sslPort,
            path: "/v1/user/getbyemail",
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': post_data.length
            }
        };

        var req = https.request(reqOptions, function (res) {

            res.setEncoding('utf8');

            var data="";

            res.on('data', function (d) {
                data = data + d.toString('utf8');
            });

            res.on('end', function (e) {
                var obj = JSON.parse(data);
                callback(null, obj);
            });

            req.on('error', function (e) {
                callback(e, null);
            });

        });

        req.write(post_data);
        req.end();
    }

    module.exports = {
        createVideoUser: function (userId, firstName,surname, callback) {


            var post_data = querystring.stringify({
                'api_key' : apiKey,
                'api_secret': apiSecret,
                'data_type': 'JSON',
                'email' : userId,
                'type' : '1',
                'first_name' : firstName,
                'last_name' : surname,
                'enable_e2e_encryption':'true'
            });

            var reqOptions = {
                hostname: zoomApiUrl,
                port: sslPort,
                path: "/v1/user/custcreate",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': post_data.length
                }
            };

            var req = https.request(reqOptions, function (res) {

                res.setEncoding('utf8');

                var data="";

                res.on('data', function (d) {
                    data = data + d.toString('utf8');
                });

                res.on('end', function (e) {
                    var obj = JSON.parse(data);
                    callback(null, obj);
                });

                req.on('error', function (e) {
                    callback(e, null);
                });

            });

            req.write(post_data);
            req.end();
        },
        deleteVideoUser: function (userId, callback) {


            var post_data = querystring.stringify({
                'api_key' : apiKey,
                'api_secret': apiSecret,
                'data_type': 'JSON',
                'email' : userId,
                'type' : '1',
                'enable_e2e_encryption':'true'
            });

            var reqOptions = {
                hostname: zoomApiUrl,
                port: sslPort,
                path: "/v1/user/delete",
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': post_data.length
                }
            };

            var req = https.request(reqOptions, function (res) {

                res.setEncoding('utf8');

                var data="";

                res.on('data', function (d) {
                    data = data + d.toString('utf8');
                });

                res.on('end', function (e) {
                    var obj = JSON.parse(data);
                    callback(null, obj);
                });

                req.on('error', function (e) {
                    callback(e, null);
                });

            });

            req.write(post_data);
            req.end();
        },
        getUser: getUser,
        createVideoMeeting: function (userId, callback) {

            getUser(userId,function(error, user){

                var post_data = querystring.stringify({
                    'api_key': apiKey,
                    'api_secret': apiSecret,
                    'data_type': 'JSON',
                    'host_id': user.id,
                    'topic': 'appointment',
                    'start_time': moment(new Date()).utc().format(),
                    'duration': 16,
                    'type': '2',
                    'option_jbh': true
                });

                var reqOptions = {
                    hostname: zoomApiUrl,
                    port: sslPort,
                    path: "/v1/meeting/create",
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': post_data.length
                    }
                };

                var req = https.request(reqOptions, function (res) {

                    res.setEncoding('utf8');

                    var data="";

                    res.on('data', function (d) {
                        data = data + d.toString('utf8');
                    });

                    res.on('end', function (e) {
                        var obj = JSON.parse(data);
                        callback(null, _.extend(obj, {
                            first_name: user.first_name,
                            last_name: user.last_name,
                            token: user.token
                        }));
                    });

                    req.on('error', function (e) {
                        callback(e, null);
                    });

                });

                req.write(post_data);
                req.end();
            });
        }
    };
})();

