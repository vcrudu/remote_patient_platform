/**
 * Created by Victor on 19/08/2015.
 */
var ordersRepository = require('../repositories').Orders;
var orderFactory = require('../model').OrderFactory;
var Payment = require('../model').Payment;
var logging     = require('../logging');
var _ = require('underscore');
var paymentService = require('./paymentService');

(function() {

    function handleStorageError(error, callback){
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
                var incidentTicket = logging.getIncidentTicketNumber("or");
                logging.getLogger().error({
                    incident: incidentTicket,
                    url: req.url,
                    userId: req.decoded.email
                }, error);
                var unhandledError = new Error(logging.getUserErrorMessage(incidentTicket));
                unhandledError.unhandled = true;
                callback(unhandledError, null);
            } else {
                callback(null, savedOrder);
            }
        });
    }

    module.exports = {
        createOrder: function (req, callback) {

            var orderEntityToCreate;
            ordersRepository.getOrderByOrderId(req.body.orderId, function (err, order) {
                if (order) {
                    var handledError = new Error("The order already exists!");
                    handledError.unhandled = false;
                    callback(handledError);
                    return;
                }
                try {
                    orderEntityToCreate = orderFactory.BuildObject(_.extend(req.body, {userId: req.decoded.email}));
                } catch (error) {
                    logging.getLogger().error({url: req.url, userId: req.decoded.email, err: error});
                    callback(error, null);
                    return;
                }

                if (req.body.payment) {
                    var payment = new Payment(req.body.payment);
                    paymentService.chargeNonCustomer(payment, order, function (error, charge) {
                        if (error) {
                            if (error.type == 'StripeCardError') {
                                var handledError = new Error(error.message);
                                handledError.unhandled = false;
                                callback(handledError, null);
                                return;
                            } else {
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
                        } else {
                            orderEntityToCreate.changeOrderStatus('Paid');
                            saveOrder(req, orderEntityToCreate, function (error, createdOrder) {
                                callback(error, createdOrder);
                            });
                        }
                    });
                } else {
                    saveOrder(req, order, function (error, createdOrder) {
                        callback(error, createdOrder);
                    });
                }
            });
        },

        payOrder: function (req, callback) {
            if (!req.body.payment) {
                callback(new Error('Payment details are missing!'), null);
                return;
            }

            ordersRepository.getOrderByOrderId(req.body.orderId, function (err, order) {
                var payment = new Payment(req.body.payment);
                paymentService.chargeNonCustomer(payment, order, function (error, charge) {
                    if (error) {
                        if (error.type == 'StripeCardError') {
                            var handledError = new Error(error.message);
                            handledError.unhandled = false;
                            callback(handledError, null);
                            return;
                        } else {
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
                    } else {
                        order.changeOrderStatus('Paid');
                        saveOrder(req, order, function (error, savedOrder) {
                            callback(error, savedOrder);
                        });
                    }
                });
            });
        },

        markOrderShipped: function (req, callback) {
            ordersRepository.getOrderByOrderId(req.body.orderId, function (err, order) {
                handleStorageError(callback);
                order.changeOrderStatus('Shipped');
                saveOrder(req, order, function (error, savedOrder) {
                    callback(error, savedOrder);
                });
            });
        },

        markOrderDelivered: function (req, callback) {
            ordersRepository.getOrderByOrderId(req.body.orderId, function (err, order) {
                handleStorageError(callback);
                order.changeOrderStatus('Delivered');
                saveOrder(req, order, function (error, savedOrder) {
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