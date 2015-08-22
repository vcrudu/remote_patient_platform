/**
 * Created by Victor on 19/08/2015.
 */
var ordersRepository = require('../repositories').Orders;
var orderFactory = require('../model').OrderFactory;
var Payment = require('../model').Payment;
var logging     = require('../logging');
var _ = require('underscore');
var paymentService = require('./paymentService');

(function(){
    module.exports={
            createNewOrder:function(req, callback){
                if(!req.body.orderId){
                    callback(new Error('Order is missing!'),null);
                    return;
                }

                ordersRepository.getOrderByOrderId(req.body.orderId, function(err, order){
                    if(order){
                        callback(new Error('Order with such an orderId already exists.'),null);
                        return;
                    }
                    try{
                        orderEntityToCreate = orderFactory.BuildObject(_.extend(req.body,{userId:req.decoded.email}));
                    }catch(error){
                        logging.getLogger().error({url:req.url,userId:req.decoded.email,err:error});
                        callback(error,null);
                        return;
                    }
                    ordersRepository.save(orderEntityToCreate, function(err, createdOrder){
                        if(err)
                        {
                            var incidentTicket = logging.getIncidentTicketNumber("or");
                            logging.getLogger().error({incident:incidentTicket, url:req.url,userId:req.decoded.email},err);
                            var unhandledError = new Error(logging.getUserErrorMessage(incidentTicket));
                            unhandledError.unhandled=true;
                            callback(unhandledError, null);
                        } else {
                            callback(null, createdOrder);
                        }
                    });
                });
            },
            payOrder: function(args, callback){
                if(!args.payment){
                    callback(new Error('Payment details are missing!'), null);
                    return;
                }
                var paymentDetails;
                try{
                        paymentDetails = new Payment(args.payment);
                }catch(error){
                    callback(error, null);
                    return;
                }

                ordersRepository.getOrdersByUserId(req.decoded.email, 'New', function(err, orders) {
                        if (err) {
                            var incidentTicket = logging.getIncidentTicketNumber("or");
                            logging.getLogger().error({incident:incidentTicket},err);
                            var unhandledError = new Error(logging.getUserErrorMessage(incidentTicket));
                            unhandledError.unhandled=true;
                            callback(unhandledError, null);
                        }else if(orders && orders.length>0){
                            var order = orders[0];

                            var amountToPay = order.getAmountToPay();
                            paymentService.pay(_.extend(paymentDetails,{amount:amountToPay}),function(err){
                                if(err){
                                    callback(err, null);
                                    return;
                                }
                                order.changeOrderStatus("Paid");
                                ordersRepository.save(order, function(err, order){
                                    if(err){
                                        var incidentTicket = logging.getIncidentTicketNumber("or");
                                        logging.getLogger().error({incident:incidentTicket},err);
                                        var unhandledError = new Error(logging.getUserErrorMessage(incidentTicket));
                                        unhandledError.unhandled=true;
                                        callback(unhandledError, null);
                                    }else{
                                        callback(null, order);
                                    }
                                });
                            });

                        }else{
                            callback(new Error('There are no unpaid orders!'), null);
                        }
                    }
                );
            },
            markOrderShipped:function(args){

            },
            markOrderDelivered:function(args){

            }
    };
})();