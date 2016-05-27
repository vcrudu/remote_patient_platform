/**
 * Created by v.crudu on 02/03/2015.
 */

var orderService = require('./orderService');
var paymentService = require('./paymentService');
var videoService = require('./videoService');
var availabilityService = require('./availabilityService');
var alarmService = require('./alarmService');

(function(){
    module.exports={
        OrderService:orderService,
        PaymentService:paymentService,
        VideoService:videoService,
        AvailabilityService:availabilityService,
        AlarmService:alarmService
    };
})();