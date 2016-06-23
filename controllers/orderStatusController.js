/**
 * Created by victorcrudu on 05/06/2016.
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

    module.exports.init = function(router) {
        router.put('/orders_status', function (req, res) {
            if (!req.body.orderId) {
                res.status(400).json({
                    success: false,
                    message: "Order id is missing!"
                });
            }
            logging.getLogger().trace({
                url: req.url,
                userId: req.decoded.email
            }, "Order status requested to be changed");
            switch (req.body.orderStatus) {
                case "Dispatched":
                {
                    orderService.markOrderDispatched(req, function (error) {
                        if (error) {
                            sendError(res, error);
                            return;
                        } else {
                            res.json({
                                count: 0,
                                success: true,
                                description: "Order status has been modified successfully."
                            });
                        }
                    });
                    break;
                }
                case "Delivered":
                {
                    orderService.markOrderDelivered(req, function (error) {
                        if (error) {
                            sendError(res, error);
                            return;
                        } else {
                            res.json({
                                count: 0,
                                success: true,
                                description: "Order status has been modified successfully."
                            });
                        }
                    });
                    break;
                }
                default:
                {
                    res.status(400).json({
                        success: false,
                        message: "Unrecognised order status!"
                    });
                }
            }
        });
    };
})();