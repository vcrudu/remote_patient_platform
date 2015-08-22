/**
 * Created by v.crudu on 02/03/2015.
 */

var orderService = require('./orderService');
var paymentService = require('./paymentService');

(function(){
    module.exports={
        OrderService:orderService,
        PaymentService:paymentService
    };
})();