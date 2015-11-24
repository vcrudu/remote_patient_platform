/**
 * Created by Victor on 06/08/2015.
 */

(function(){


    var availabilityService = require('../services/availabilityService');
    var cacheUrl = 'localhost';
    var http = require('http');

    module.exports.init = function(app){
        app.get('/slots', function(req, res) {
            var reqOptions = {
                hostname: cacheUrl,
                port: 8082,
                path: "/availability"
            };

            http.get(reqOptions, function (cacheResult) {
                cacheResult.setEncoding('utf8');

                var data="";

                cacheResult.on('data', function (d) {
                    data = data + d.toString('utf8');
                });

                cacheResult.on('end', function (e) {
                    var obj = JSON.parse(data);
                    res.json(obj);
                });

                cacheResult.on('error', function (e) {
                    res.status(500).json(e);
                });
            });
        });
    };
})();