/**
 * Created by developer1 on 10/6/2016.
 */
/**
 * Created by Victor on 5/25/2016.
 */

(function() {
    var logging     = require('../logging');
    var _ = require('underscore');
    var uuid = require('node-uuid');
    var schedulePlanRepository     = require('../repositories').SchedulePlanRepository;
    var scheduleManagerService = require('../services/scheduleManagerService');


    module.exports.init = function(router) {


        router.get("/groupschedule/:groupname", function(req, res) {



           
            var byGroupId = req.decoded.email+"#"+req.params.groupname;
          



            schedulePlanRepository.getList(byGroupId,function(err, groupSchedules) {
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
                        items: groupSchedules
                    });
                }
            });
        });



        router.post('/groupschedule', function(req, res){

            
            var byGroupId = req.decoded.email+"#"+req.body.groupname;
          //  console.log("AM AJUNS LA POST!!!!!!     "+byGroupId);
          //  console.log("SCHEDULE ESTE     "+req.body.scheduleData.scheduleName);

         //   if(!req.body.alarmTemplate){
         //       res.status(400).json({
          //          success: false,
         //           error: "The request should contain alarm model."
        //        });
          //  }

            logging.getLogger().trace({url:req.url,userId:req.decoded.email},req.body.alarmTemplate + " notification requested to be created");



            schedulePlanRepository.getOne(byGroupId, req.body.scheduleData, function(err, foundGroupSchedule) {
                if(err) {



                    var incidentTicket = logging.getIncidentTicketNumber("nt");
                    logging.getLogger().error({incident:incidentTicket, url:req.url,userId:req.decoded.email},err);
                    res.status(500).json({
                        success:false,
                        error:logging.getUserErrorMessage(incidentTicket)
                    });
                } else {
                    if (!foundGroupSchedule) {


                        //  schedulePlanRepository.save(byGroupId, req.body.scheduleData, groupMeasurementSchedule, function(newGatErr, newSchedulePlan) {
                        schedulePlanRepository.save(byGroupId, req.body.scheduleData, function (newGatErr, newSchedulePlan) {
                            if (newGatErr) {
                                var newGlobalAlarmIncidentTicket = logging.getIncidentTicketNumber("nt");
                                logging.getLogger().error({
                                    incident: newGlobalAlarmIncidentTicket,
                                    url: req.url,
                                    userId: req.decoded.email
                                }, err);
                                res.status(500).json({
                                    success: false,
                                    error: logging.getUserErrorMessage(newGlobalAlarmIncidentTicket)
                                });
                            }
                            else {
                                scheduleManagerService.setupSchedulePlanForGroup(byGroupId, function (err) {
                                    res.json({
                                        success: true,
                                        item: req.body.scheduleData
                                    });
                                });
                            }
                        });
                    } else {


                        //    console.log("AM AJUNS LA UPDATE!!!!!");
                        //    console.log("GROUP ID +++   "+byGroupId);
                        //    console.log("ALARM NAME IS ==== "+req.body.alarmTemplate.alarmName);
                        schedulePlanRepository.update(byGroupId, req.body.scheduleData, function (updatedGatErr, updatedSchedulePlan) {
                            if (updatedGatErr) {
                                var updatedGlobalAlarmIncidentTicket = logging.getIncidentTicketNumber("nt");
                                logging.getLogger().error({
                                    incident: updatedGlobalAlarmIncidentTicket,
                                    url: req.url,
                                    userId: req.decoded.email
                                }, err);
                                res.status(500).json({
                                    success: false,
                                    error: logging.getUserErrorMessage(updatedGlobalAlarmIncidentTicket)
                                });
                            }
                            else {
                                scheduleManagerService.setupSchedulePlanForGroup(byGroupId, function (err) {
                                    res.json({
                                        success: true,
                                        item: req.body.scheduleData,
                                    });
                                });
                            }
                        });
                        // console.log("A FOST GASIT SCHEDULE!!!!!")}

                    }
                }
            });
        });


        router.delete('/groupschedule/', function(req, res) {

            logging.getLogger().trace({url:req.url,userId:req.decoded.email},req.params.alarmName + " schedule requested to be deleted.");

            //     console.log("ALARM NAME IS   !!!!   "+req.query.alarmName);
            //     console.log("GROUPID IS !!!!!   "+req.decoded.email+"#"+req.query.groupname);
            var byGroupId = req.decoded.email+"#"+req.query.groupname;

            scheduleManagerService.deleteSchedulePlanForGroup(byGroupId, function (err) {
                if(err){
                    res.status(500).json({
                        success:false,
                        error:err
                    });
                }else {
                    schedulePlanRepository.delete(byGroupId, req.query.scheduleName, function(err,data){
                        if(err){
                            res.status(500).json({
                                success:false,
                                error:err
                            });
                        }else{
                            res.status(200).json({
                                success: true
                            });
                        }
                    });
                }
            });
        });
    }
})();