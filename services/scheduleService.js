/**
 * Created by victorcrudu on 28/09/2016.
 */
(function () {

        var globalMeasurementScheduleRepository = require('../repositories/globalMeasurementScheduleRepository');
        var schedulePlan = function (scheduleType, context, callback) {
                globalMeasurementScheduleRepository.getOne(scheduleType, function (err, globalMeasurementScheduleData) {
                        if (err) {
                                callback(err);
                        } else {
                                //globalMeasurementScheduleData
                        }
                });
        };

        module.exports = {
                schedulePlan: schedulePlan
        }
})();