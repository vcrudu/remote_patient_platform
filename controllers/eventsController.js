/**
 * Created by Victor on 06/08/2015.
 */

var eventsRepository     = require('../repositories').Events;
var EventFactory = require('../model').EventFactory;
var logging = require("../logging");

(function(){

    module.exports.init = function(router){
        router.get('/events', function(req, res){
            var pageSize = req.query.pageSize;
            var pageNumber = req.query.pageNumber;
            var measureType = req.query.measureType;
            if(req.query.sample){
                if(!req.query.measureType)
                    req.query.measureType = EventFactory.getMeasurementTypes()[0];
                res.json(EventFactory.getSample(req.query.measureType));
            }
        });

        router.post('/events', function(req, res){
            var eventToSave;
            req.body.userId =  req.decoded.email;
            try{
                eventToSave = EventFactory.buildEvent(req.body);
            }catch(error){
                res.status(400).json({
                    success:false,
                    message:error.message
                });
                return;
            }

            eventsRepository.getOne(req.decoded.email, eventToSave.getMeasurementDateTime(), function(err, event){
                if(err){
                    var incidentTicket = logging.getIncidentTicketNumber('ev');
                    logging.getLogger().error({incidentTicket:incidentTicket},err);
                    res.status(500).json({
                        success:false,
                        message:logging.getUserErrorMessage(incidentTicket)
                    });
                }else if(event){
                    res.status(400).json({
                        success:false,
                        message:'Event has been provided already.'
                    });
                }else{
                    eventsRepository.save(eventToSave, function(err, data){
                        if(err){
                            var incidentTicket = logging.getIncidentTicketNumber('ev');
                            logging.getLogger().error({incidentTicket:incidentTicket},err);
                            res.status(500).json({
                                success:false,
                                message:logging.getUserErrorMessage(incidentTicket)
                            });
                        }else{
                            res.status(200).end();
                        }
                    });
                }
            });
        });
    };
})();