/**
 * Created by victorcrudu on 12/10/2016.
 */

(function() {
    var logging = require('../logging');
    var SchedulePlan = require('../model/schedulePlan');

    var globalMeasurementScheduleRepository = require('../repositories/globalMeasurementScheduleRepository');
    var schedulePlan = function (scheduleType, context, callback) {
        globalMeasurementScheduleRepository.getOne(scheduleType, function (err, globalMeasurementScheduleData) {
            if (err) {
                callback(err);
            } else {
                var userDetails = context;

                //globalMeasurementScheduleData
            }
        });
    };

    var scheduleRecurentJob = function (userId, eventToTrigger,
                                        timeString,
                                        scheduleType, offsetInMinutes,
                                        timezone, callback) {

        var reqOptions = {
            hostname: 'hcm-scheduler.eu-west-1.elasticbeanstalk.com',
            port: 80,
            path: "/jobs",
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InZjcnVkdUBob3RtYWlsLmNvbSIsImlhdCI6MTQzODU0Mzc5OH0.hEJl-vGudvpQDCWgiPkdKKEtj1kOl59b59wveW5w1X4'
            }
        };

        var post_data = JSON.stringify(
            {
                recurrent: true,
                eventToTrigger: eventToTrigger,
                timeString: timeString,
                jobProcessorName: "sendStateMachineEvent",
                scheduleType: scheduleType,
                offsetInMinutes: offsetInMinutes,
                timezone: timezone,
                userId: userId
            });

        logging.getLogger().debug(post_data);

        var req = http.request(reqOptions, function (res) {

            res.setEncoding('utf8');

            var data = "";

            res.on('data', function (d) {
                data = data + d.toString('utf8');
            });

            res.on('end', function () {
                callback(null);
            });

            req.on('error', function (e) {
                logging.getLogger().error(e);
                callback(e);
            });

        });

        req.write(post_data);
        req.end();
    };

    var setupSchedulePlan = function (userId, eventToTrigger, timeZone, schedulePlan, callback) {
        var schedulePlanObj = new SchedulePlan(schedulePlan);

        var source = Rx.Observable.from(schedulePlanObj.dayTimePoints).flatMap(function (dayTimePoint) {
                return Rx.Observable.from(dayTimePoint.reminders).concat(Rx.Observable.just(0)).distinct();
            },
            function (dayTimePoint, reminder) {
                scheduleRecurentJob(userId, eventToTrigger, dayTimePoint.time, schedulePlan.scheduleType, reminder, timeZone, function (err) {
                    return err;
                });
            }
        );

        source.subscribe(null, null, function () {
            callback();
        });
    };

    module.exports = {
        setupSchedulePlan: setupSchedulePlan
    };

})();