/**
 * Created by Victor on 14/12/2015.
 */

(function(){

    var providerAppointmentsService = require('../services/providerAppointmentsService');
    var availabilityService = require('../services/availabilityService');

    module.exports.init = function(router) {
        router.get('/providerAppointments', function (req, res) {
            var params = req.params;
            providerAppointmentsService.getProviderAppointments(req.decoded.email, function (err, data) {
                res.json({
                    success: true,
                    count: data.length,
                    result: data
                });
            });
        });
    };
})();