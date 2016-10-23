/**
 * Created by victorcrudu on 12/10/2016.
 */

(function() {
    var logging = require('../logging');
    var SchedulePlan = require('../model/schedulePlan');
    var loggerProvider = require('../logging');
    var GlobalMeasurementScheduleRepository = require('../repositories/globalMeasurementScheduleRepository');
    var AWS             = require('aws-sdk');
    var connectionOptions = require('../repositories/awsOptions');
    var Rx = require('rx');
    var http = require('http');

    var getDb = function(){

        var dynamodb = new AWS.DynamoDB(connectionOptions);

        return dynamodb;

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
                userId: userId,
                payload: {userId: userId, eventName: "OnMeasurementExpected", scheduleType: "bloodPressure"}
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

    var setupSchedulePlan = function (userDetails, callback) {
        var userId, eventToTrigger, timeZone, schedulePlan;
        userId = userDetails.email;
        eventToTrigger = 'OnMeasurementExpected';
        timeZone = 'Europe/London';
        var healthProblems = userDetails.getHealthProblems();
        if (healthProblems.find(function (healthProblem) {
                return healthProblem.problemType.toLowerCase().indexOf("hypertension") != -1;
            })) {

            var globalMeasurementScheduleRepository = new GlobalMeasurementScheduleRepository(getDb());

            globalMeasurementScheduleRepository.getOne('bloodPressure', function (err, globalMeasurementScheduleData) {
                if (err) {
                    callback(err);
                } else {

                    schedulePlan = globalMeasurementScheduleData;

                    var schedulePlanObj = new SchedulePlan(schedulePlan);

                    var source = Rx.Observable.from(schedulePlanObj.dayTimePoints).flatMap(function (dayTimePoint) {
                            return Rx.Observable.from(dayTimePoint.reminders).concat(Rx.Observable.just(0)).distinct();
                        },
                        function (dayTimePoint, reminder) {
                            return {
                                userId: userId,
                                eventToTrigger: eventToTrigger,
                                timeString: dayTimePoint.time,
                                scheduleType: schedulePlan.scheduleType,
                                reminder: reminder, timeZone: timeZone
                            };
                        }
                    );

                    source.subscribe(function (schedulePlan) {
                        scheduleRecurentJob(schedulePlan.userId,
                            schedulePlan.eventToTrigger,
                            schedulePlan.timeString,
                            schedulePlan.scheduleType,
                            schedulePlan.reminder,
                            schedulePlan.timeZone, function (err) {
                                return err;
                            });

                    }, function (err) {
                        loggerProvider.getLogger().error(err);
                    }, function () {
                        loggerProvider.getLogger().info("Schedule plan hypertension for the user " + userId);
                        callback();
                    });
                }
            });
        }
    };

    module.exports = {
        setupSchedulePlan: setupSchedulePlan
    };

})();