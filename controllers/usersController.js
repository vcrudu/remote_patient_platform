/**
 * Created by Victor on 30/08/2015.
 */
/**
 * Created by Victor on 06/08/2015.
 */



(function(){


    var userDetailsRepository     = require('../repositories').UsersDetails;
    var usersRepository     = require('../repositories').Users;
    var domainModel = require('@vcrudu/hcm.domainmodel');
    var logging = require("../logging");
    var _ = require("underscore");
    var snsClient = require('../snsClient');
    var utils = require('../utils');

    function sendError(res, error) {
        var statusCode;
        if (error.unhandled) {
            statusCode = 500;
        } else {
            statusCode = 400;
        }
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }

    module.exports.init = function(router){
        router.get('/users/:userId', function(req, res){
            userDetailsRepository.findOneByEmail(req.params.userId, function(err,data){
                if(err){
                    var incidentTicket = logging.getIncidentTicketNumber('us');
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

        router.get('/patients/:userId', function(req, res) {
            userDetailsRepository.findPatient(req.params.userId, function (err, data) {
                if (err) {
                    var incidentTicket = logging.getIncidentTicketNumber('us');
                    logging.getLogger().error({incidentTicket: incidentTicket}, err);
                    res.status(500).json({
                        success: false,
                        message: logging.getUserErrorMessage(incidentTicket)
                    });
                } else {
                    if (data) {
                        res.send({
                            success: true,
                            count: data ? data.length : 0,
                            result: data
                        });
                    } else {
                        usersRepository.findOneByEmail(req.params.userId, function (err, data) {
                            if (err) {
                                var incidentTicket = logging.getIncidentTicketNumber('us');
                                logging.getLogger().error({incidentTicket: incidentTicket}, err);
                                res.status(500).json({
                                    success: false,
                                    message: logging.getUserErrorMessage(incidentTicket)
                                });
                            } else {
                                res.send({
                                    success: true,
                                    count: data ? data.length : 0,
                                    result: data
                                });
                            }
                        });
                    }
                }
            });
        });

        router.post('/patient', function(req, res){

            if(!req.body.model){
                res.status(400).json({
                    success: false,
                    error: "The request should contain patient model details."
                });
            }
            else {
                userDetailsRepository.update(req.body.model, function(err, savedUserDetails){
                    if(err){
                        var incidentTicket = logging.getIncidentTicketNumber('us');
                        logging.getLogger().error({incidentTicket:incidentTicket},err);
                        res.status(500).json({
                            success:false,
                            message:logging.getUserErrorMessage(incidentTicket)
                        });
                    }else {
                        snsClient.sendOnProvideDetailsEvent(req.decoded.email, function (err, data) {
                            if(err){
                                logging.getLogger().error(err);
                                logging.getLogger().error(new Error("Failed to send OnProvideDetailsEvent"));
                            }
                        });
                        res.send({
                            success:true,
                            result:req.body.model
                        });
                    }
                });
            }
        });

        router.get('/contacts/:userId', function(req, res){
            usersRepository.findOneByEmail(req.params.userId, function(err,data){
                if(err){
                    var incidentTicket = logging.getIncidentTicketNumber('us');
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

        router.post('/token_signin', function(req, res){
            usersRepository.findOneByEmail(req.decoded.email,function(err, user){
                if(err){
                    res.json({
                        success:false,
                        error:err
                    });
                }else{
                    if(user && user.isActive) {
                        user.token = req.headers['x-access-token'];
                        userDetailsRepository.findOneByEmail(user.email, function (err, userDetails) {
                            if (err) {
                                res.json({
                                    success:false,
                                    error:err
                                });
                            }
                            else {
                                res.json({
                                    success: true,
                                    data: _.extend(user, userDetails),
                                    token: user.token
                                });
                            }
                        });
                    } else{
                        res.status(401).json({
                            success:false,
                            error:'The user is unauthorised!'
                        });
                    }
                }
            });
        });
    };
})();