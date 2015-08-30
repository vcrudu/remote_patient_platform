/**
 * Created by Victor on 06/08/2015.
 */

var orderFactory = require('../model').OrderFactory;
var logging     = require('../logging');
var _ = require('underscore');
var orderService = require('../services').OrderService;
var ordersRepository = require('../repositories').Orders;
var util = require('util');

(function(){

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
        router.get('/orders', function(req, res){
            if(req.query.sample){
                res.json(orderFactory.getSample());
            }else{
                logging.getLogger().trace({url:req.url,userId:req.decoded.email}, "Orders list requested.");

                ordersRepository.getOrdersByUserId(req.decoded.email, 'New', function(err, orders){
                    if(err)
                    {
                        var incidentTicket = logging.getIncidentTicketNumber("or");
                        logging.getLogger().error({incident:incidentTicket, url:req.url,userId:req.decoded.email},err);
                        res.status(500).json({
                            success:false,
                            error:logging.getUserErrorMessage(incidentTicket)
                        });
                    } else {

                        var result = [];
                        _.forEach(orders, function(order){
                            result.push(order.getDto());
                        });
                        res.json({
                            count: result.length,
                            success: true,
                            items: result,
                            description: "The result contains the list of user orders."
                        });
                        logging.getLogger().trace({url:req.url,userId:req.decoded.email}, orders.length + " orders provided.");
                    }
                });
            }
        });

        router.get('/orders/:userId', function(req, res){
            logging.getLogger().trace({url:req.url,userId:req.decoded.email}, "Orders list requested.");

            ordersRepository.getOrdersByUserId(req.params.userId, 'All', function(err, orders){
                if(err)
                {
                    var incidentTicket = logging.getIncidentTicketNumber("or");
                    logging.getLogger().error({incident:incidentTicket, url:req.url,userId:req.decoded.email},err);
                    res.status(500).json({
                        success:false,
                        error:logging.getUserErrorMessage(incidentTicket)
                    });
                } else {

                    var result = [];
                    _.forEach(orders, function(order){
                        result.push(order.getDto());
                    });
                    res.json({
                        count: result.length,
                        success: true,
                        items: result,
                        description: "The result contains the list of user orders."
                    });
                    logging.getLogger().trace({url:req.url,userId:req.decoded.email}, orders.length + " orders provided.");
                }
            });
        });

        router.post('/orders', function(req, res) {

            logging.getLogger().trace({url: req.url, userId: req.decoded.email}, "Order requested to be created");

            orderService.createOrder(req, function (error, result) {
                if (error) {
                    sendError(res, error);
                    return;
                } else {
                    res.json({
                        count: 1,
                        success: true,
                        items: [result],
                        description: "The result contains the list of created orders."
                    });
                    logging.getLogger().trace({
                        url: req.url,
                        userId: req.decoded.email
                    }, "Order has been created successfully.");
                }
            });
        });

        router.put('/orders', function(req, res) {
            logging.getLogger().trace({url: req.url, userId: req.decoded.email}, "Orders requested to be changed");
            orderService.updateOrder(req, function(error){
                if(error){
                    sendError(res, error);
                    return;
                }

                orderService.payOrder(req, function (error, result) {
                    if (error) {
                        sendError(res, error);
                        return;
                    } else {
                        res.json({
                            count: 1,
                            success: true,
                            items: [result],
                            description: "The result contains the changed order."
                        });
                        logging.getLogger().trace({
                            url: req.url,
                            userId: req.decoded.email
                        }, "Order status has been changed successfully.");
                    }
                });
            });
        });

        router.put('/orders/:orderId', function(req, res){
            var orderId = req.params.orderId;
            logging.getLogger().trace({url: req.url, userId: req.decoded.email}, "Orders requested to be changed");

            if(req.orderId && req.orderId!=orderId){
                sendError(res, new Error('Entity orderId is different from parameter value!'));
                return;
            }

            orderService.updateOrder(req, function(error){
                if(error){
                    sendError(res, error);
                    return;
                }

                orderService.payOrder(req, function (err, result) {
                    if (error) {
                        sendError(res, error);
                        return;
                    } else {
                        res.json({
                            count: 1,
                            success: true,
                            items: [result],
                            description: "The result contains the changed order."
                        });
                        logging.getLogger().trace({
                            url: req.url,
                            userId: req.decoded.email
                        }, "Order status has been changed successfully.");
                    }
                });
            });
        });

        router.delete('/orders', function(req, res){
            res.status(400);
        });

        router.delete('/orders/:orderId', function(req, res){
            res.status(400);
        });
    };
})();