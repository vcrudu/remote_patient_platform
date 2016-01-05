/**
 * Created by Victor on 14/12/2015.
 */

(function(){

    var patientAppointmentsService = require('../services/patientAppointmentsService');
    var availabilityService = require('../services/availabilityService');

    module.exports.init = function(router) {
        router.get('/patientAppointments', function (req, res) {
            var params = req.params;
            patientAppointmentsService.getPatientAppointments(req.decoded.email, function (err, data) {
                res.json({
                    success: true,
                    count: data.length,
                    result: data
                });
            });
        });
    }
})();