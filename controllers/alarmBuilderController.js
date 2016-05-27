/**
 * Created by Victor on 5/25/2016.
 */

(function() {
    var logging     = require('../logging');
    var _ = require('underscore');
    var uuid = require('node-uuid');
    var globalAlarmRepository     = require('../repositories').GlobalAlarmTemplate;

    module.exports.init = function(router) {
        router.get("/globalalarms", function(req, res) {
            globalAlarmRepository.getAll(function(err, globalAlarms) {
                if(err) {
                    var incidentTicket = logging.getIncidentTicketNumber("nt");
                    logging.getLogger().error({incident:incidentTicket, url:req.url,userId:req.decoded.email},err);
                    res.status(500).json({
                        success:false,
                        error:logging.getUserErrorMessage(incidentTicket)
                    });
                } else {
                    res.json({
                        success: true,
                        items: globalAlarms
                    });
                }
            });
        });

        router.post('/globalalarm', function(req, res){

            if(!req.body.alarmTemplate){
                res.status(400).json({
                    success: false,
                    error: "The request should contain alarm model."
                });
            }

            logging.getLogger().trace({url:req.url,userId:req.decoded.email},req.body.alarmTemplate + " notification requested to be created");

            globalAlarmRepository.get(req.body.alarmTemplate.alarmName, function(err, foundGlobalAlarmTemplate) {
                if(err) {
                    var incidentTicket = logging.getIncidentTicketNumber("nt");
                    logging.getLogger().error({incident:incidentTicket, url:req.url,userId:req.decoded.email},err);
                    res.status(500).json({
                        success:false,
                        error:logging.getUserErrorMessage(incidentTicket)
                    });
                } else {
                    if (!foundGlobalAlarmTemplate) {
                        globalAlarmRepository.new(req.body.alarmTemplate, function(newGatErr, newGlobalAlarmTemplate) {
                            if(newGatErr) {
                                var newGlobalAlarmIncidentTicket = logging.getIncidentTicketNumber("nt");
                                logging.getLogger().error({incident:newGlobalAlarmIncidentTicket, url:req.url,userId:req.decoded.email},err);
                                res.status(500).json({
                                    success:false,
                                    error:logging.getUserErrorMessage(newGlobalAlarmIncidentTicket)
                                });
                            }
                            else {
                                res.json({
                                    success: true,
                                    item: req.body.alarmTemplate,
                                });
                            }
                        });
                    }
                    else {
                        globalAlarmRepository.update(req.body.alarmTemplate, function(updatedGatErr, updatedGlobalAlarmTemplate) {
                            if(updatedGatErr) {
                                var updatedGlobalAlarmIncidentTicket = logging.getIncidentTicketNumber("nt");
                                logging.getLogger().error({incident:updatedGlobalAlarmIncidentTicket, url:req.url,userId:req.decoded.email},err);
                                res.status(500).json({
                                    success:false,
                                    error:logging.getUserErrorMessage(updatedGlobalAlarmIncidentTicket)
                                });
                            }
                            else {
                                res.json({
                                    success: true,
                                    item: req.body.alarmTemplate,
                                });
                            }
                        });
                    }
                }
            });
        });

        router.delete('/globalalarm/:alarmName', function(req, res) {

            logging.getLogger().trace({url:req.url,userId:req.decoded.email},req.params.alarmName + " alarm requested to be deleted.");

            globalAlarmRepository.delete(req.params.alarmName, function(err,data){
                if(err){
                    res.status(500).json({
                        success:false,
                        error:err
                    });
                }else{
                    res.status(200).json({
                        success:true
                    });
                }
            });

        });
    }
})();