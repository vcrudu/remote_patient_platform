/**
 * Created by Victor on 19/08/2015.
 */
var ordersRepository = require('../repositories').Orders;
var devicesRepository = require('../repositories').Devices;
var orderFactory = require('../model').OrderFactory;
var Payment = require('../model').Payment;
var logging     = require('../logging');
var _ = require('underscore');
var paymentService = require('./paymentService');
var snsClient = require('../snsClient');

(function() {

    function processUnhandledError(req, error, callback){
        var incidentTicket = logging.getIncidentTicketNumber("or");
        logging.getLogger().error({
            incident: incidentTicket,
            url: req.url,
            userId: req.decoded.email
        }, error);
        var unhandledError = new Error(logging.getUserErrorMessage(incidentTicket));
        unhandledError.unhandled = true;
        callback(unhandledError, null);
    }

    function saveOrder(req, order, callback) {
        ordersRepository.save(order, function (error, savedOrder) {
            if (error) {
                processUnhandledError(req, error, callback);
            } else {
                callback(null, savedOrder);
            }
        });
    }

    function getValidDevices(req, callback) {
        devicesRepository.getAll(function (err, result) {
            var devices=[];
            if (err) {
                processUnhandledError(req, err, callback);
            } else {
                _.forEach(result, function (device) {
                    devices.push(device);
                });
                callback(null, devices);
            }
        });
    }


    module.exports = {
        createOrder: function (req, callback) {

            getValidDevices(req, function (err, devices) {
                if(err){
                    callback(err,null);
                    return;
                }

                var orderEntityToCreate;

                try {
                    orderEntityToCreate = orderFactory.BuildObject(_.extend(req.body, {
                        userId: req.decoded.email, devices: devices
                    }));
                } catch (error) {
                    logging.getLogger().error({url: req.url, userId: req.decoded.email, err: error});
                    callback(error, null);
                    return;
                }

                if (req.body.payment) {
                    var payment;

                    try{
                        payment = new Payment(req.body.payment);
                    }catch(error){
                        logging.getLogger().error({url: req.url, userId: req.decoded.email, err: error});
                        callback(error, null);
                    }
                    paymentService.chargeNonCustomer(payment, orderEntityToCreate, function (error, charge) {
                        if (error) {
                            if (error.type == 'StripeCardError') {
                                callback(error, null);
                                return;
                            } else {
                                processUnhandledError(req, error, callback);
                                return;
                            }
                        } else {
                            orderEntityToCreate.changeOrderStatus('Paid');
                            saveOrder(req, orderEntityToCreate, function (error, createdOrder) {
                                callback(error, createdOrder);
                            });
                        }
                    });
                } else {
                    saveOrder(req, orderEntityToCreate, function (error, createdOrder) {
                        callback(error, createdOrder);
                    });
                }
            });
        },

        payOrder: function (req, callback) {
            if (!req.body.orderId) {
                callback(new Error('Order id is missing!'), null);
                return;
            }

            if (!req.body.payment) {
                callback(new Error('Payment details are missing!'), null);
                return;
            }

            ordersRepository.getOrderByOrderId(req.decoded.email, req.body.orderId, function (err, order) {
                if(!order.canPay()){
                    callback(new Error('Order is already paid or cancelled!'), null);
                    return;
                }

                var payment = new Payment(req.body.payment);
                paymentService.chargeNonCustomer(payment, order, function (error, charge) {
                    if (error) {
                        if (error.type == 'StripeCardError') {
                            callback(error, null);
                            return;
                        } else {
                           processUnhandledError(req,error, callback);
                           return;
                        }
                    } else {
                        order.changeOrderStatus('Paid');
                        saveOrder(req, order, function (error, savedOrder) {
                            snsClient.sendOnDevicesOrderingEvent(req.decoded.email, savedOrder, function(err){
                                if (err) {
                                    logging.getLogger().error("Failed to send OnDevicesOrdering event!");
                                }
                            });
                            callback(error, savedOrder);
                        });
                    }
                });
            });
        },

        updateOrder: function (req, callback) {
            ordersRepository.getOrderByOrderId(req.decoded.email, req.body.orderId, function (err, order) {
                if(err) {
                    processUnhandledError(req, err, callback);
                    return;
                }

                if(req.body.orderItems && req.body.orderItems.length>0) {
                    order.clearOrderItems();

                    _.forEach(req.body.orderItems, function (orderItem) {
                        order.addOrderItem(orderItem.model, orderItem.quality);
                    });

                    order.modifiedDate = new Date();

                    saveOrder(req, order, function (error, savedOrder) {
                        callback(error, savedOrder);
                    });
                }else{
                    callback(null, order);
                }
            });
        },

        markOrderDelivered: function (req, callback) {
            ordersRepository.getOrderByOrderId(req.decoded.email, req.body.orderId, function (err, order) {
                if (err) {
                    processUnhandledError(req, err, callback);
                    return;
                }
                order.changeOrderStatus('Delivered');
                saveOrder(req, order, function (error, savedOrder) {
                    if (!error) {
                        snsClient.sendOnDevicesDeliveringEvent(req.decoded.email, savedOrder, function (err) {
                            if (err) {
                                logging.getLogger().error("Failed to send OnDevicesDelivering event!");
                            }
                        });
                    }
                    callback(error, savedOrder);
                });
            });
        },

        markOrderDispatched: function (req, callback) {
            ordersRepository.getOrderByOrderId(req.decoded.email, req.body.orderId, function (err, order) {
                if(err) {
                    processUnhandledError(req, err, callback);
                    return;
                }
                order.changeOrderStatus('Dispatched');
                saveOrder(req, order, function (error, savedOrder) {
                    if(!error){
                        snsClient.sendOnDevicesDispatchingEvent(req.decoded.email, savedOrder, function (err) {
                            if(err){
                                logging.getLogger().error("Failed to send OnDevicesDispatching event!");
                            }
                        });
                    }
                    callback(error, savedOrder);
                });
            });
        },

        cancelOrder: function (req) {
            ordersRepository.getOrderByOrderId(req.body.orderId, function (err, order) {
                order.changeOrderStatus('Cancelled');
                saveOrder(req, order, function (error, savedOrder) {
                    callback(error, savedOrder);
                });
            });
        }
    };
})();