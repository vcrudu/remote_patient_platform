/**
 * Created by Victor on 06/08/2015.
 */

var eventsRepository     = require('../repositories').Events;
var EventFactory = require('../model').EventFactory;
var logging = require("../logging");
var notification = require('../notifications');
const vm = require('vm');


(function(){

    module.exports.init = function(router){
        router.get('/events', function(req, res){
            var pageSize = req.query.pageSize;
            var pageNumber = req.query.pageNumber;
            var userName = req.query.userName;
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

            if (!userName)
            {
                userName = req.decoded.email;
            }
            eventsRepository.getByTimeIntervalAndMeasureType(userName, measureType, startTime,endTime,function(err,data){
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
                //Todo-here this trick is temporary fix, should be found out a good solution
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

            /*var conditions = [{ factTemplate: "factResult = temperature >= 36.5" }];

            var sandbox = {
                temperature: 36.5,
            };

            var context = new vm.createContext(sandbox);
            var script = new vm.Script(conditions[0].factTemplate);

            script.runInContext(context);*/

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