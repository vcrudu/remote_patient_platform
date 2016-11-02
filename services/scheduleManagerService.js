/**
 * Created by victorcrudu on 12/10/2016.
 */

(function() {
    var logging = require('../logging');
    var SchedulePlan = require('../model/schedulePlan');
    var loggerProvider = require('../logging');
    var GlobalMeasurementScheduleRepository = require('../repositories/globalMeasurementScheduleRepository');
    var patientsGroupMemberRepository = require('../repositories/patientsGroupMemberRepository');
    var schedulePlanRepository = require('../repositories/schedulePlanRepository');

    var AWS = require('aws-sdk');
    var connectionOptions = require('../repositories/awsOptions');
    var Rx = require('rx');
    var http = require('http');

    var getDb = function () {

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

    var scheduleDeleteJob = function (userId,
                                      scheduleType, callback) {

        var reqOptions = {
            hostname: 'hcm-scheduler.eu-west-1.elasticbeanstalk.com',
            port: 80,
            path: "/jobs?userId=" + userId + "&jobProcessorName=sendStateMachineEvent&scheduleType=" + scheduleType,
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InZjcnVkdUBob3RtYWlsLmNvbSIsImlhdCI6MTQzODU0Mzc5OH0.hEJl-vGudvpQDCWgiPkdKKEtj1kOl59b59wveW5w1X4'
            }
        };

        logging.getLogger().debug(reqOptions.path);

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

        var containsHyperTension = false;
        for (var i = 0; i < healthProblems.length; i++) {
            if (healthProblems[i].problemType.toString().toLowerCase().indexOf("hypertension") !== -1) {
                containsHyperTension = true;
                break;
            }
        }

        if (containsHyperTension) {
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
                        callback(err);
                    }, function () {
                        loggerProvider.getLogger().info("Schedule plan hypertension for the user " + userId);
                        callback();
                    });
                }
            });
        } else {
            /*patientsGroupMemberRepository.getByPatientId(userDetails, function (err, group) {
             schedulePlanRepository.getList(groupId, function (err, schedulesList) {
             schedulesList.forEach(function (schedule) {
             switch(schedule.scheduleName){
             case "Body Temperature":{
             scheduleDeleteJob(userDetails.email, 'bloodPressure', function (err) {
             if(!err){
             schedule.dayTimePoints.forEach(function (dayTimePoint) {
             scheduleRecurentJob(userId,'sendStateMachineEvent',dayTimePoint)
             });
             }
             });
             }
             }
             });
             });
             //
             });*/

            callback();
        }
    };


    var setupSchedulePlanForGroup = function (groupId) {
        schedulePlanRepository.getList(groupId, function (err, schedulePlans) {
            if (!err) {
                patientsGroupMemberRepository.getListByGroupId(groupId, function (err, members) {
                    if (!err) {
                        var source = Rx.Observable.from(members).concatMap(function (member) {
                            return Rx.Observable.from(schedulePlans);
                        }, function (member, schedulePlan) {
                            return {
                                patientId: member.patientId,
                                scheduleType: schedulePlan.scheduleName,
                                dayTimePoints: schedulePlan.dayTimePoints
                            };
                        }).concatMap(function (result) {
                            return Rx.Observable.from(result.dayTimePoints);
                        }, function (result, dayTimePoint) {
                            return {
                                patientId: result.patientId,
                                scheduleType: result.scheduleType,
                                dayTimePoint: dayTimePoint
                            };
                        }).concatMap(function (result) {
                            return Rx.Observable.from(result.dayTimePoint.reminders).concat(Rx.Observable.just(result.dayTimePoint.time)).distinct();
                        }, function (result, timeString) {
                            return {
                                patientId: result.patientId,
                                scheduleType: result.scheduleType,
                                timeString: timeString
                            };
                        });

                        source.subscribe(function (scheduleJobDetails) {
                            scheduleDeleteJob(scheduleJobDetails.patientId, scheduleJobDetails.scheduleType, function (err) {
                                if (err) {
                                    loggerProvider.getLogger().info({
                                        module: 'scheduleManagerService',
                                        event: "setupSchedulePlanForGroup.scheduleDeleteJob",
                                        success: false,
                                        err: err
                                    });
                                } else {
                                    loggerProvider.getLogger().info({
                                        module: 'scheduleManagerService',
                                        event: "setupSchedulePlanForGroup.scheduleDeleteJob",
                                        success: true,
                                        scheduleJobDetails: scheduleJobDetails
                                    });

                                    var timeZone = 'Europe/London';
                                    var eventToTrigger = 'OnMeasurementExpected';
                                    scheduleRecurentJob(scheduleJobDetails.patientId, eventToTrigger,
                                        scheduleJobDetails.timeString,
                                        scheduleJobDetails.scheduleType,
                                        0, timeZone, function (err) {
                                            if (err) {
                                                loggerProvider.getLogger().info({
                                                    module: 'scheduleManagerService',
                                                    event: "setupSchedulePlanForGroup.scheduleRecurentJob",
                                                    success: false,
                                                    err: err
                                                });
                                            } else {
                                                loggerProvider.getLogger().info({
                                                    module: 'scheduleManagerService',
                                                    event: "setupSchedulePlanForGroup.scheduleRecurentJob",
                                                    success: true,
                                                    scheduleJobDetails: scheduleJobDetails
                                                });
                                            }
                                    });
                                }

                            });
                        });
                    }
                });
            }
        });
    };

    module.exports = {
        setupSchedulePlan: setupSchedulePlan,
        setupSchedulePlanForGroup: setupSchedulePlanForGroup
    };
})();