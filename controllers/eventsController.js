/**
 * Created by Victor on 06/08/2015.
 */

var eventsRepository     = require('../repositories').Events;
var Event = require('../model').Event;
var logging = require("../logging");

(function(){

    module.exports.init = function(router){
        router.get('/events', function(req, res){
            var pageSize = req.query.pageSize;
            var pageNumber = req.query.pageNumber;
            var measureType = req.query.measureType;

        });

        router.post('/events', function(req, res){
            var eventToSave;
            try{
                eventToSave = new Event(req.body);
            }catch(error){
                res.status(400).json({
                    success:false,
                    message:error.message
                });
                return;
            }

            eventsRepository.save(eventToSave, function(err, data){
                if(err){
                    var incidentTicket = logging.getIncidentTicketNumber('ev');
                    logging.getLogger().error({incidentTicket:incidentTicket},err);
                    res.status(500).json({
                        success:false,
                        message:logging.getUserErrorMessage(incidentTicket)
                    });
                }else{
                    res.status(200);
                }
            });
        });
    };
})();