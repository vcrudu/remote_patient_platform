/**
 * Created by Victor on 5/27/2016.
 */

(function(){
    var eventsRepository = require('../repositories').Events;
    var globalAlarmsRepository = require('../repositories').GlobalAlarmTemplate;
    var userDetailsRepository = require('../repositories').UsersDetails;
    var _ = require('underscore');
    const util = require('util');
    const vm = require('vm');

    module.exports = {
        getSatisfiedAlarms: function(event, callback) {
            var userId = event.userId;
            var measurementUnixDateTime = event.getMeasurementDateTime();

            var dateTime = new Date(measurementUnixDateTime);
            var queryDateTime = dateTime.setDate(dateTime.getDate() - 1);

            var satisfiedAlarms = [];

            eventsRepository.getByTimeIntervalAndMeasureType(userId, "All", new Date(queryDateTime), dateTime, function(err, result) {
                if (err) {
                }
                else {
                    var sortedResult = _.sortBy(result, 'measurementDateTime').reverse();

                    var lastTemperatureEvent =_.find(sortedResult, function (x) { return x.measurementType === "temperature" });
                    var lastBloodOxygenEvent =_.find(sortedResult, function (x) { return x.measurementType === "bloodOxygen" });
                    var lastHeartRateEvent =_.find(sortedResult, function (x) { return x.measurementType === "heartRate" });
                    var lastBloodPressureEvent =_.find(sortedResult, function (x) { return x.measurementType === "bloodPressure" });

                    userDetailsRepository.findOneByEmail(userId, function(ud_err, userResult) {
                        if (ud_err) {
                            return callback(ud_err, null);
                        }
                        else {
                            var user = userResult;

                            var gender = user.sex;
                            var weight = user.weight;

                            globalAlarmsRepository.getAll(function(g_err, alarmsResult) {
                                if (g_err) {
                                    return callback(g_err, null);
                                }
                                else {
                                    _.forEach(alarmsResult, function(globalAlarm){
                                        var rules = globalAlarm.rules;

                                        var contextObject = {};
                                        try {
                                            _.forEach(rules, function(rule){
                                                switch (rule.ruleTemplate) {
                                                    case "BloodPressureSystolicBetween":
                                                    case "BloodPressureSystolic":
                                                        if (!lastBloodPressureEvent) {
                                                            throw new Error('break');
                                                        }
                                                        else {
                                                            contextObject.systolic = lastBloodPressureEvent.systolic;
                                                        }
                                                        break;
                                                    case "BloodPressureDiastolicBetween":
                                                    case "BloodPressureDiastolic":
                                                        if (!lastBloodPressureEvent) {
                                                            throw new Error('break');
                                                        }
                                                        else {
                                                            contextObject.diastolic = lastBloodPressureEvent.diastolic;
                                                        }
                                                        break;
                                                    case "HeartRateBetween":
                                                    case "HeartRate":
                                                        if (!lastHeartRateEvent) {
                                                            throw new Error('break');
                                                        }
                                                        else {
                                                            contextObject.heartRate = lastHeartRateEvent.heartRate;
                                                        }
                                                        break;
                                                    case "BloodOxygenBetween":
                                                    case "BloodOxygen":
                                                        if (!lastBloodOxygenEvent) {
                                                            throw new Error('break');
                                                        }
                                                        else {
                                                            contextObject.bloodOxygen = lastBloodOxygenEvent.bloodOxygen;
                                                        }
                                                        break;
                                                    case "TemperatureBetween":
                                                    case "Temperature":
                                                        if (!lastTemperatureEvent) {
                                                            throw new Error('break');
                                                        }
                                                        else {
                                                            contextObject.temperature = lastTemperatureEvent.temperature;
                                                        }
                                                        break;
                                                    case "WeightBetween":
                                                    case "Weight":
                                                        if (!weight) {
                                                            throw new Error('break');
                                                        }
                                                        else {
                                                            contextObject.weight = weight;
                                                        }
                                                        break;
                                                    case "Sex":
                                                        if (!gender) {
                                                            throw new Error('break');
                                                        }
                                                        else {
                                                            contextObject.sex = gender.toLocaleLowerCase();
                                                        }
                                                        break;
                                                }
                                            });
                                        }
                                        catch (exc) {
                                            contextObject = undefined;
                                        }

                                        if (contextObject) {
                                            switch (event.getMeasurementType()) {
                                                case "temperature":
                                                    if (!contextObject.temperature) {
                                                        contextObject = undefined;
                                                    }
                                                    break;
                                                case "bloodOxygen":
                                                    if (!contextObject.bloodOxygen) {
                                                        contextObject = undefined;
                                                    }
                                                    break;
                                                case "heartRate":
                                                    if (!contextObject.heartRate) {
                                                        contextObject = undefined;
                                                    }
                                                    break;
                                                case "bloodPressure":
                                                    if (!contextObject.systolic) {
                                                        contextObject = undefined;
                                                    }
                                                    break;
                                            }
                                        }

                                        if (contextObject) {
                                            var script = "";
                                            var index = 0;
                                            _.forEach(rules, function(rule) {
                                                switch (rule.ruleTemplate) {
                                                    case "BloodPressureSystolicBetween":
                                                    case "BloodPressureDiastolicBetween":
                                                    case "HeartRateBetween":
                                                    case "BloodOxygenBetween":
                                                    case "TemperatureBetween":
                                                    case "WeightBetween":
                                                        var conditions = rule.conditions;
                                                        if (index > 0) {
                                                            script += " && ";
                                                        }
                                                        script += (rule.prefix ? "(" : "!(") + conditions[0].expression + " && " + conditions[1].expression + ")";
                                                        break;
                                                    case "BloodPressureSystolic":
                                                    case "BloodPressureDiastolic":
                                                    case "HeartRate":
                                                    case "BloodOxygen":
                                                    case "Temperature":
                                                    case "Weight":
                                                    case "Sex":
                                                        var conditions = rule.conditions;
                                                        if (index > 0) {
                                                            script += " && ";
                                                        }
                                                        script += (rule.prefix ? "" : "!") + conditions[0].expression;
                                                        break;
                                                }

                                                index++;
                                            });

                                            if (script && script != "") {

                                                var context = new vm.createContext(contextObject);
                                                var script = new vm.Script('needForAlarm = ' + script);
                                                script.runInContext(context);

                                                if (contextObject.needForAlarm) {
                                                    satisfiedAlarms.push(globalAlarm);
                                                }

                                            }
                                        }
                                    });
                                    
                                    return callback(null, satisfiedAlarms);
                                }
                            })
                        }
                    })
                }

            });

            //return satisfiedAlarms;
        }
    };
})();