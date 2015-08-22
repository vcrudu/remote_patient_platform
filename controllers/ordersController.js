/**
 * Created by Victor on 06/08/2015.
 */

var orderFactory = require('../model').OrderFactory;
var logging     = require('../logging');
var _ = require('underscore');
var orderService = require('../services').OrderService;

(function(){

    module.exports.init = function(router){
        router.get('/orders', function(req, res){
            if(req.query.sample){
                res.json(orderFactory.getSampleArguments());
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

        });

        router.post('/orders', function(req, res){

            logging.getLogger().trace({url:req.url,userId:req.decoded.email},"Order requested to be created");

            orderService.createNewOrder(req, function(error, result){
                if(error){
                    if(error.unhandled) {
                        res.status(400).json({
                            success: false,
                            message: error.message
                        });
                    }else {
                        res.status(500).json({
                            success: false,
                            error: error.message
                        });
                    }
                    return;
                }else{

                    res.json({
                        count: 1,
                        success: true,
                        items: [result],
                        description: "The result contains the list of created orders."
                    });
                    logging.getLogger().trace({url:req.url,userId:req.decoded.email}, "Order has been created successfully.");
                }
            });
        });

        router.put('/orders', function(req, res){
            logging.getLogger().trace({url:req.url,userId:req.decoded.email},"Order requested to be changed");
            orderService.payOrder(req,function(err){
                if(error){
                    if(error.unhandled) {
                        res.status(400).json({
                            success: false,
                            message: error.message
                        });
                    }else {
                        res.status(500).json({
                            success: false,
                            error: error.message
                        });
                    }
                    return;
                }else{
                    res.json({
                        count: 1,
                        success: true,
                        items: [result],
                        description: "The result contains the changed orders."
                    });
                    logging.getLogger().trace({url:req.url,userId:req.decoded.email}, "Order status has been changed successfully.");
                }
            });
        });

        router.put('/orders/:orderId', function(req, res){
            var params = req.params;
        });

        router.delete('/orders', function(req, res){
            res.status(400);
        });

        router.delete('/orders/:orderId', function(req, res){
            res.status(400);
        });
    };
})();