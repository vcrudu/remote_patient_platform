/**
 * Created by Victor on 06/08/2015.
 */

(function(){
    var availabilityService = require('../services/availabilityService');
    var slotsRepository     = require('../repositories').Slots;
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
        app.get('/slots/:slotId', function(req, res) {

            loggerProvider.getLogger().trace({url:req.url,userId:req.decoded.email}, "Slots by id requested.");

            var slotId = req.params.slotId;
            var slotDateTime = new Date(parseFloat(slotId));
            slotsRepository.getBookedOne(slotDateTime, function (err, data) {
                if (err) {
                    var incidentTicket = logging.getIncidentTicketNumber('pr');
                    logging.getLogger().error({incidentTicket: incidentTicket}, err);
                    res.status(500).json({
                        success: false,
                        message: logging.getUserErrorMessage(incidentTicket)
                    });
                } else {
                    res.send({
                        success: true,
                        result: data
                    });
                }
            });
        });
    };
})();