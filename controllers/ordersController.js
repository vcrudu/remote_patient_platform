/**
 * Created by Victor on 06/08/2015.
 */

var Order = require('../model').Order;
var ordersRepository = require('../repositories').Orders;

(function(){

    module.exports.init = function(app){
        app.get('/orders', function(req, res){
            var params = req.params;
        });

        app.get('/orders/:userId', function(req, res){
            var params = req.params;
            if(userId=="test@test.com"){
                res.json({

                });
            }
        });

        app.post('/orders', function(req, res){

            logging.getLogger().trace({url:req.url,userId:req.decoded.email},"Order requested to be created");

            var orderEntityToCreate;

            try{
                orderEntityToCreate = new Order(req.body);
            }catch(err){
                logging.getLogger().error({url:req.url,userId:req.decoded.email,err:err});
                res.send(400).json({
                    success: false,
                    error: err.message
                });
                return;
            }



                        ordersRepository.save(orderEntityToCreate, function(err, createdOrder){
                            if(err)
                            {
                                var incidentTicket = logging.getIncidentTicketNumber("or");
                                logging.getLogger().error({incident:incidentTicket, url:req.url,userId:req.decoded.email},err);
                                res.send(500).json({
                                    success:false,
                                    error:logging.getUserErrorMessage(incidentTicket)
                                });
                            } else {
                                res.json({
                                    count: 1,
                                    success: true,
                                    items: [createdOrder],
                                    description: "The result contains the list of created devices."
                                });
                                logging.getLogger().trace({url:req.url,userId:req.decoded.email}, "Device has been created successfully.");
                            }
                        });

        });

        app.put('/orders', function(req, res){
            var params = req.params;
        });

        app.put('/orders/:orderId', function(req, res){
            var params = req.params;
        });

        app.delete('/orders', function(req, res){
            res.send(400);
        });
    };
})();