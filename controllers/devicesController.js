/**
 * Created by Victor on 06/08/2015.
 */

var devicesRepository     = require('../repositories').Devices;
var logging     = require('../logging');
var domainModel = require('@vcrudu/hcm.domainmodel');
var _ = require('underscore');

(function(){

    module.exports.init = function(router){

        router.get('/devices', function(req, res){
            logging.getLogger().trace({url:req.url,userId:req.decoded.email}, "Devices list requested.");

            devicesRepository.getAll(function(err, devices){
                if(err)
                {
                    var incidentTicket = logging.getIncidentTicketNumber("dv");
                    logging.getLogger().error({incident:incidentTicket, url:req.url,userId:req.decoded.email},err);
                    res.send(500).json({
                        success:false,
                        error:logging.getUserErrorMessage(incidentTicket)
                    });
                } else {

                    var result = [];
                    _.forEach(devices, function(device){
                        result.push(device.getDto());
                    });
                    res.json({
                        count: result.length,
                        success: true,
                        items: result,
                        description: "The result contains the list of devices available to buy."
                    });
                    logging.getLogger().trace({url:req.url,userId:req.decoded.email}, devices.length + " devices provided.");
                }
            });
        });

        router.get('/devices/:model', function(req, res){
            logging.getLogger().trace({url:req.url,userId:req.decoded.email},req.params.model + " device details requested.");
            devicesRepository.getOne(req.params.model, function(err, device){
                if(err)
                {
                    var incidentTicket = logging.getIncidentTicketNumber("dv");
                    logging.getLogger().error({incident:incidentTicket, url:req.url,userId:req.decoded.email},err);
                    res.send(500).json({
                        success:false,
                        error:logging.getUserErrorMessage(incidentTicket)
                    });
                } else {
                    res.json({
                        count: 1,
                        success: true,
                        items: [device.getDto()],
                        description: "The result contains the devices details."
                    });
                    logging.getLogger().trace({url:req.url,userId:req.decoded.email}, device.model + " device provided.");
                }
            });
        });

        router.post('/devices', function(req, res){

            if(!req.body.model){
                res.send(400).json({
                    success: false,
                    error: "The request should contain device model details."
                });
            }
            logging.getLogger().trace({url:req.url,userId:req.decoded.email},req.body.model + " device requested to be created");

            var deviceEntityToCreate;

            try{
                deviceEntityToCreate = domainModel.createDeviceModel(req.body);
            }catch(err){
                logging.getLogger().error({url:req.url,userId:req.decoded.email,err:err});
                res.send(400).json({
                    success: false,
                    error: err.message
                });
                return;
            }

            devicesRepository.getOne(deviceEntityToCreate.model, function(err, device){
                if(err)
                {
                    var incidentTicket = logging.getIncidentTicketNumber("dv");
                    logging.getLogger().error({incident:incidentTicket, url:req.url,userId:req.decoded.email},err);
                    res.send(500).json({
                        success:false,
                        error:logging.getUserErrorMessage(incidentTicket)
                    });
                } else {

                    if(device){
                        res.send(400).json({
                            success:false,
                            error:"Such device model already exists. Use put instead to update it."
                        });
                    }else{
                        devicesRepository.save(deviceEntityToCreate, function(err, createdDevice){
                            if(err)
                            {
                                var incidentTicket = logging.getIncidentTicketNumber("dv");
                                logging.getLogger().error({incident:incidentTicket, url:req.url,userId:req.decoded.email},err);
                                res.send(500).json({
                                    success:false,
                                    error:logging.getUserErrorMessage(incidentTicket)
                                });
                            } else {
                                res.json({
                                    count: 1,
                                    success: true,
                                    items: [createdDevice],
                                    description: "The result contains the list of created devices."
                                });
                                logging.getLogger().trace({url:req.url,userId:req.decoded.email}, "Device has been created successfully.");
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

            devicesRepository.getOne(deviceEntityToUpdate.model, function(err, device){

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
                        devicesRepository.update(deviceEntityToUpdate, function(err, savedDevice){
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
                            error:"The device model does not exist.Use post to add the device model instead.",
                            statusCode:400,
                            entityId:deviceEntity.model
                        });
                    }
                }
            });
        };

        router.put('/devices', function(req,res){
            logging.getLogger().trace({url:req.url,userId:req.decoded.email},"Devices batch requested to be updated");

            var devicesList = req.body;

            if(devicesList.constructor!==Array) {
                res.send(400).json({
                    success: false,
                    error: "The body should be array of devices. Please provide entity id as parameter."
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

        router.put('/devices/:model', function(req, res){
            logging.getLogger().trace({url:req.url,userId:req.decoded.email},req.params.model + " device requested to be created");

            var deviceEntityToUpdate;

            try{

                deviceEntityToUpdate = domainModel.createDeviceModel(req.body);

            }catch(err){
                logging.getLogger().error({url:req.url,userId:req.decoded.email,err:err});
                res.send(400).json({
                    success: false,
                    error: err.message
                });
                return;
            }

            devicesRepository.getOne(model, function(err, device){

                if(err)
                {
                    var incidentTicket = logging.getIncidentTicketNumber("dv");
                    logging.getLogger().error({incident:incidentTicket, url:req.url,userId:req.decoded.email},err);
                    res.send(500).json({
                        success:false,
                        error:logging.getUserErrorMessage(incidentTicket)
                    });
                } else {

                    if(device){
                        devicesRepository.update(deviceEntityToUpdate, function(err, updatedDevice){
                            if(err)
                            {
                                var incidentTicket = logging.getIncidentTicketNumber("dv");
                                logging.getLogger().error({incident:incidentTicket,url:req.url,userId:req.decoded.email},err);
                                res.send(500).json({
                                    success:false,
                                    error:logging.getUserErrorMessage(incidentTicket)
                                });
                            } else {
                                res.json({
                                    count: 1,
                                    success: true,
                                    items: [updatedDevice],
                                    description: "The result contains the list of created devices."
                                });
                                logging.getLogger().trace({url:req.url,userId:req.decoded.email}, deviceEntityToUpdate.model + " updated successfully.");
                            }
                        });
                    }else{
                        res.send(400).json({
                            success:false,
                            error:"Such a device model does not exists. Use post to add a new device model."
                        });
                    }
                }
            });

        });

        router.delete('/devices/:model', function(req, res){
            logging.getLogger().trace({url:req.url,userId:req.decoded.email},req.params.model + " device requested to be deleted.");

            devicesRepository.delete(req.params.model,function(err,data){
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

        router.delete('/api/devices', function(req, res){
            logging.getLogger().trace({url:req.url,userId:req.decoded.email},"Devices requested to be deleted by "+req.decoded.email);
            res.status(405);
        });
    };
})();