/**
 * Created by Victor on 06/08/2015.
 */

var eventsRepository     = require('../repositories').Events;
var EventFactory = require('../model').EventFactory;
var logging = require("../logging");
var notification = require('../notifications');


(function(){

    module.exports.init = function(router){
        router.get('/events', function(req, res){
            var pageSize = req.query.pageSize;
            var pageNumber = req.query.pageNumber;
            var measureType = req.query.measureType || 'All';
            if(req.query.sample){
                if(!req.query.measureType)
                    req.query.measureType = EventFactory.getMeasurementTypes()[0];
                res.json(EventFactory.getSample(req.query.measureType));
                return;
            }

            var startTime =req.query.startTime || new Date();
            var endTime = req.query.endTime || new Date();

            if(!req.query.startTime) {
                startTime.setDate(startTime.getDate() - 7);
            }

            eventsRepository.getByTimeIntervalAndMeasureType(req.decoded.email, measureType, startTime,endTime,function(err,data){
                if(err){
                    var incidentTicket = logging.getIncidentTicketNumber('ev');
                    logging.getLogger().error({incidentTicket:incidentTicket},err);
                    res.status(500).json({
                        success:false,
                        message:logging.getUserErrorMessage(incidentTicket)
                    });
                }else {
                      res.send({
                          success:true,
                          count:data.length,
                          result:data
                      });
                }
            });

        });

        router.post('/events', function(req, res){
            var eventToSave;
            req.body.userId =  req.decoded.email;
            try{
                //Todo-here this trick is temporary fix, should be found out a good sollution
                var dateTime = new Date();
                dateTime.setTime(req.body.measurementDateTime);
                req.body.measurementDateTime = dateTime;
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
                            res.status(200).json({
                                success:true});
                            notification.sendEvent(req.decoded.email,'newMeasurement',eventToSave.getMeasurement());
                        }
                    });
                }
            });
        });
    };
})();