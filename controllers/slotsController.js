/**
 * Created by Victor on 06/08/2015.
 */

(function(){


    var availabilityService = require('../services/availabilityService');
    var cacheUrl = 'hcm-availability.elasticbeanstalk.com';
    var http = require('http');
    var loggerProvider = require('../logging');

    module.exports.init = function(app){
        app.get('/slots', function(req, res) {
            var reqOptions = {
                hostname: cacheUrl,
                port: 80,
                path: "/availability"
            };
            http.get(reqOptions, function (cacheResult) {
                cacheResult.setEncoding('utf8');

                var data = "";

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
            }).on('error', function (e) {
                loggerProvider.getLogger().error(e);
            });
        });
    };
})();