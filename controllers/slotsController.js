/**
 * Created by Victor on 06/08/2015.
 */

(function(){

    var availabilityService = require('../services/availabilityService');

    module.exports.init = function(app){
        app.get('/slots', function(req, res) {
            availabilityService.getProvidersAvailability(function (err, data) {
                if (!err) {
                    res.json({
                        success: true,
                        count: data.length,
                        result: data
                    });
                }
            });
        });
    };
})();