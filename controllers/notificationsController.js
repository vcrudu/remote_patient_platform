/**
 * Created by Victor on 06/08/2015.
 */

var notificationsRepository     = require('../repositories').Notifications;
var logging     = require('../logging');
var _ = require('underscore');

(function(){

    module.exports.init = function(router){

        var parseBool = function(str) {
            if (typeof str === "string" && str.toLowerCase() == "true")
                return true;

            return (parseInt(str) > 0);
        }

        router.get('/notifications', function(req, res){
            logging.getLogger().trace({url:req.url,userId:req.decoded.email}, "Notifications list requested.");

            var pageSize = req.query.pageSize;
            var pageNumber = req.query.pageNumber;
            var userName = req.query.userName;
            var notificationType = req.query.notificationType || 'All';
            if(req.query.sample){
                var sampleNotification = {
                    content: "Dear {{userTitle}} {{userFullName}} Trichrome provides a set of devices that you can use to measure your vital signs and monitor your health. If you would like us to monitor your health effectively you can order the medical devices at the following link: {{orderDevicesLink}}.",
                    defaultAction: "openDevicesScreen",
                    dateTime: 1460835816,
                    imageLink: "https://s3-eu-west-1.amazonaws.com/trichrome/public/oximeter-icon.png",
                    summary: "Devices available for you!",
                    title: "Medical Devices",
                    type: "devicesAvailable",
                    userId: "test@test.com"
                };
                res.json(sampleNotification);
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

            if(!pageSize) {
                notificationsRepository.getList(userName, notificationType, startTime, endTime, function(err, notifications){
                    if(err)
                    {
                        var incidentTicket = logging.getIncidentTicketNumber("nt");
                        logging.getLogger().error({incident:incidentTicket, url:req.url,userId:req.decoded.email},err);
                        res.status(500).json({
                            success:false,
                            error:logging.getUserErrorMessage(incidentTicket)
                        });
                    } else {

                        var result = [];
                        _.forEach(notifications, function(notification){
                            result.push(notification);
                        });
                        res.json({
                            count: result.length,
                            success: true,
                            items: result,
                            description: "The result contains the list of notifications."
                        });
                        logging.getLogger().trace({url:req.url,userId:req.decoded.email}, notifications.length + " notifications provided.");
                    }
                });
            } else {
                notificationsRepository.getPagedList(userName, notificationType, startTime, endTime, pageSize, pageNumber, function(err, notifications){
                    if(err)
                    {
                        var incidentTicket = logging.getIncidentTicketNumber("nt");
                        logging.getLogger().error({incident:incidentTicket, url:req.url,userId:req.decoded.email},err);
                        res.status(500).json({
                            success:false,
                            error:logging.getUserErrorMessage(incidentTicket)
                        });
                    } else {

                        var result = [];
                        _.forEach(notifications, function(notification){
                            result.push(notification);
                        });
                        res.json({
                            count: result.length,
                            success: true,
                            items: result,
                            description: "The result contains the list of notifications."
                        });
                        logging.getLogger().trace({url:req.url,userId:req.decoded.email}, notifications.length + " notifications provided.");
                    }
                });
            }

        });

        router.get('/notification', function(req, res){
            var userName = req.query.userName;
            var dateTime = req.query.dateTime;

            if (!userName)
            {
                userName = req.decoded.email;
            }

            notificationsRepository.getByUserIdAndDateTime(userName, dateTime, function(err, notification){
                if(err)
                {
                    var incidentTicket = logging.getIncidentTicketNumber("nt");
                    logging.getLogger().error({incident:incidentTicket, url:req.url,userId:req.decoded.email},err);
                    res.status(500).json({
                        success:false,
                        error:logging.getUserErrorMessage(incidentTicket)
                    });
                } else {
                    res.json({
                        success: true,
                        item: notification,
                    });
                }
            });
        });

        router.post('/notificationread', function(req, res){
            var userName = req.query.userName;
            var dateTime = req.query.dateTime;
            var read = parseBool(req.query.read);

            if (!userName)
            {
                userName = req.decoded.email;
            }

            notificationsRepository.notificationRead(userName, dateTime, read, function(err, notification){
                if(err)
                {
                    var incidentTicket = logging.getIncidentTicketNumber("nt");
                    logging.getLogger().error({incident:incidentTicket, url:req.url,userId:req.decoded.email},err);
                    res.status(500).json({
                        success:false,
                        error:logging.getUserErrorMessage(incidentTicket)
                    });
                } else {
                    res.json({
                        success: true,
                    });
                }
            });
        });

        router.post('/notifications', function(req, res){

            if(!req.body.type){
                res.status(400).json({
                    success: false,
                    error: "The request should contain notification type."
                });
            }
            logging.getLogger().trace({url:req.url,userId:req.decoded.email},req.body.model + " notification requested to be created");

            var deviceEntityToCreate;

            try{
                deviceEntityToCreate = domainModel.createDeviceModel(req.body);
            }catch(err){
                logging.getLogger().error({url:req.url,userId:req.decoded.email,err:err});
                res.status(400).json({
                    success: false,
                    error: err.message
                });
                return;
            }

            notificationsRepository.getOne(deviceEntityToCreate.model, function(err, device){
                if(err)
                {
                    var incidentTicket = logging.getIncidentTicketNumber("nt");
                    logging.getLogger().error({incident:incidentTicket, url:req.url,userId:req.decoded.email},err);
                    res.status(500).json({
                        success:false,
                        error:logging.getUserErrorMessage(incidentTicket)
                    });
                } else {

                    if(device){
                        res.status(400).json({
                            success:false,
                            error:"Such notification type already exists. Use put instead to update it."
                        });
                    }else{
                        notificationsRepository.save(deviceEntityToCreate, function(err, createdDevice){
                            if(err)
                            {
                                var incidentTicket = logging.getIncidentTicketNumber("nt");
                                logging.getLogger().error({incident:incidentTicket, url:req.url,userId:req.decoded.email},err);
                                res.status(500).json({
                                    success:false,
                                    error:logging.getUserErrorMessage(incidentTicket)
                                });
                            } else {
                                res.json({
                                    count: 1,
                                    success: true,
                                    items: [createdDevice],
                                    description: "The result contains the list of created notifications."
                                });
                                logging.getLogger().trace({url:req.url,userId:req.decoded.email}, "Notification has been created successfully.");
                            }
                        });
                    }
                }
            });
        });

        var doUpdate = function(req, res, bodyDevice, next){

            var deviceEntityToUpdate;

            try{

                deviceEntityToUpdate = domainModel.createDeviceModel(bodyDevice);

            }catch(err){
                logging.getLogger().error({url:req.url,userId:req.decoded.email,err:err});
                next({
                    success: false,
                    error: err.message,
                    entityId: bodyDevice.model,
                    statusCode: 400
                });
                return;
            }

            notificationsRepository.getOne(deviceEntityToUpdate.model, function(err, device){

                if(err)
                {
                    var incidentTicket = logging.getIncidentTicketNumber("dv");
                    logging.getLogger().error({incident:incidentTicket, url:req.url,userId:req.decoded.email},err);
                    next({
                        success: false,
                        error: logging.getUserErrorMessage(incidentTicket),
                        entityId: bodyDevice.model,
                        statusCode: 500
                    });
                } else {

                    if(device){
                        notificationsRepository.update(deviceEntityToUpdate, function(err, savedDevice){
                            if(err)
                            {
                                var incidentTicket = logging.getIncidentTicketNumber("dv");
                                logging.getLogger().error({incident:incidentTicket, url:req.url,userId:req.decoded.email},err);
                                next({
                                    success:false,
                                    error:logging.getUserErrorMessage(incidentTicket),
                                    statusCode:500
                                });
                            } else {
                               next();
                            }
                        });
                    }else{
                        next({
                            success:false,
                            error:"The notification does not exist. Use post to add the notification instead.",
                            statusCode:400,
                            entityId:deviceEntity.model
                        });
                    }
                }
            });
        };

        router.put('/notifications', function(req,res){
            logging.getLogger().trace({url:req.url,userId:req.decoded.email},"Notifications batch requested to be updated");

            var devicesList = req.body;

            if(devicesList.constructor!==Array) {
                res.status(400).json({
                    success: false,
                    error: "The body should be array of notifications. Please provide entity id as parameter."
                });
                return;
            }

            _.forEach(devicesList, function(device, index){
               doUpdate(req, res, device, function(err){
                   if(err){
                       res.status(err.statusCode).json({success:false, error:err});
                       return;
                   }else if(index==devicesList.length-1){
                       res.statusCode(200);
                       return;
                   }
               });
            });
        });

        router.delete('/notifications', function(req, res){
            logging.getLogger().trace({url:req.url,userId:req.decoded.email}, " notifications requested to be deleted.");

            var devicesList = req.body;

            if(devicesList.constructor!==Array) {
                res.status(400).json({
                    success: false,
                    error: "The body should be array of notifications. Please provide entity id as parameter."
                });
                return;
            }

            _.forEach(devicesList, function(device, index) {
                notificationsRepository.delete(req.decoded.email, device.dateTime.toString(), function (err, data) {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            error: err
                        });
                    } else {
                        res.status(200).json({
                            success: true
                        });
                    }
                });
            });
        });

        router.delete('/notifications/:date_time', function(req, res){
            logging.getLogger().trace({url:req.url,userId:req.decoded.email},req.params.date_time + " notification requested to be deleted.");

            notificationsRepository.delete(req.params.date_time,function(err,data){
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
    };
})();