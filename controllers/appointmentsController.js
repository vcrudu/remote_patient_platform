/**
 * Created by Victor on 06/08/2015.
 */

(function(){

    var appointmentsService = require('../services/appointmentsService');

    module.exports.init = function(router){
        router.get('/appointments', function(req, res) {
            var params = req.params;
            res.send(400);
        });

        router.get('/appointments/:userId', function(req, res){
            var params = req.params;
            res.send(400);
        });

        router.post('/appointments', function(req, res){
            var body = req.body;
            res.send(400);
        });

        router.put('/appointments', function(req, res){
            var slot = req.body;
            if(!slot.cancel){
                appointmentsService.bookAppointment(req.decoded.email, slot.slotDateTime, function(err, data){
                    res.json({
                        success: true,
                        count: 1,
                        result: data
                    });
                });
            }else {
                appointmentsService.cancelAppointment(req.decoded.email, slot.slotDateTime, function (err, data) {
                    res.json({
                        success: true,
                        count: 1,
                        result: data
                    });
                });
            }

        });
    };
})();