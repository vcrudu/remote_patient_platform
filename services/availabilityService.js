/**
 * Created by Victor on 01/10/2015.
 */


(function(){

    var util = require('util');
    var _    = require('underscore');
    var  assert = require('assert');
    var utils = require('../utils/dateTimeUtils');
    var slotRepository = require('../repositories/slotsRepository');
    var usersDetailsRepository = require('../repositories/usersDetailsRepository');
    var usersRepository = require('../repositories/usersRepository');
    var slotMinutes = [0, 15, 30, 45];
    var dateRegEx = '^([0-3][0-9].[0-1][0-9].[2][0][1-2][1-9])$';
    var timeRegEx = '^((([0-1][0-9])|([2][0-3])):([0-5][0-9]))$';
    var gridCacheClient = require('../services/gridCacheClient');
    var loggerProvider = require('../logging');
    var Rx = require('rx');

    function addMinutes(date, minutes) {
        var timeInMilliseconds = date.getTime();
        var minutesInMilliseconds = minutes * 60 * 1000;
        timeInMilliseconds = timeInMilliseconds + minutesInMilliseconds;
        var nextSlot = new Date(timeInMilliseconds);
        return nextSlot;
    }

    function addDays(date, days) {
        var timeInMilliseconds = date.getTime();
        var minutesInMilliseconds = days * 24 * 60 * 60 * 1000;
        timeInMilliseconds = timeInMilliseconds + minutesInMilliseconds;
        var nextSlot = new Date(timeInMilliseconds);
        return nextSlot;
    }

    function getNextSlot(date){
        var nextSlotDateTime = new Date(date.getTime());
        nextSlotDateTime.setSeconds(0);
        nextSlotDateTime.setMilliseconds(0);
        var startMinute = date.getMinutes();
        var minuteDiff;

        for (i = 0; i < slotMinutes.length; i++) {
            if (startMinute >= 45) {
                minuteDiff = 60 - startMinute;
                break;
            }

            if (slotMinutes[i] >= startMinute) {
                minuteDiff = slotMinutes[i]-startMinute;
                break;
            }
        }
        return addMinutes(nextSlotDateTime,minuteDiff);
    }

    function getTimeSlotsForPeriod(startDate, endDate) {
        assert.ok(startDate < endDate, 'Start date should be less then end date');
        var slotsList = [];
        var aSlot = getNextSlot(startDate);

        var aSlotEndTime = new Date(aSlot.getTime());
        aSlotEndTime.setMinutes(aSlotEndTime.getMinutes()+15);

        while (aSlotEndTime <= endDate){
            slotsList.push(aSlot);
            aSlot = addMinutes(aSlot, 15);
            aSlotEndTime = new Date(aSlot.getTime());
            aSlotEndTime.setMinutes(aSlotEndTime.getMinutes()+15);
        }
        return slotsList;
    }

    function generateSlotsFromAvailability(availability){
        assert.ok(availability.date, "Availability date is not specified!");
        var dateRegExInstance = new RegExp(dateRegEx);
        assert.ok(dateRegExInstance.test(availability.date), "Availability date is incorrect");
        assert.ok(availability.startTime, "Availability date is not specified!");
        var timeRegExInstance1 = new RegExp(timeRegEx);
        assert.ok(timeRegExInstance1.test(availability.startTime), "Availability start time is incorrect");
        assert.ok(availability.endTime, "Availability date is not specified!");
        var timeRegExInstance2 = new RegExp(timeRegEx);
        assert.ok(timeRegExInstance2.test(availability.endTime), "Availability start time is incorrect");
        var startDateTime = utils.buildDateTime(availability.date,availability.startTime);
        var endDateTime = utils.buildDateTime(availability.date,availability.endTime);
        var slots = getTimeSlotsForPeriod(startDateTime, endDateTime);
        return slots;
    }

    function generateSlotsFromMultipleAvailabilities(availabilities){
        var allSlots = [];
        _.forEach(availabilities, function(availability){
            var slots = generateSlotsFromAvailability(availability);
            allSlots = allSlots.concat(slots);
        });
        return allSlots;
    }

    function getProvidersAvailability(callback) {
        var slotsForSeveralDays = getSlotsForSeveralDays(7);
        var slotsProvidersResult = [];
        var slotsWithExistingProviders = [];
        _.forEach(slotsForSeveralDays, function (slot) {
            slotRepository.getProvidersForSlot(slot, function (err, data) {
                //var countProviders = data;
                if(data.length>0)
                    slotsWithExistingProviders.push({slotDateTimeString:slot ,slotDateTime: slot.getTime(), countOfProviders: data.length, providers:data});
                slotsProvidersResult.push({slotDateTimeString:slot ,slotDateTime: slot.getTime(), countOfProviders: data.length, providers:data});
                if (slotsProvidersResult.length === slotsForSeveralDays.length) {
                    slotsProvidersResult.sort(function(a, b){
                        return a.slotDateTime-b.slotDateTime;
                    });
                    callback(null, slotsProvidersResult);
                }
            });
        });
    }

    function getSlotWithProviders(slotDateTime, callback) {
        var slot = new Date();
        slot.setTime(slotDateTime);
        slotRepository.getProvidersForSlot(slot, function (err, data) {
            callback(null, {
                slotDateTimeString: slot
                , slotDateTime: slot.getTime(),
                countOfProviders: data.length,
                providers: data
            });
        });
    }

    function getSlotsForDay(date, fromHour) {
        var startFromHour;
        if(fromHour){
            startFromHour = getFormattedTimeString(fromHour);
        }else{
            startFromHour = '00:00';
        }
        var slotsForPeriod = generateSlotsFromAvailability({
            date: date,
            startTime: startFromHour,
            endTime: "23:59"
        });
        if(slotsForPeriod.length>0) {
            var lastSlot = addMinutes(slotsForPeriod[slotsForPeriod.length - 1], 15);
            slotsForPeriod.push(lastSlot);
        }
        return slotsForPeriod;
    }

    function getFormattedDateString(date) {
        var nowTime = date;
        var day = date.getDate();
        if (day < 10)day = '0' + day;
        var month = date.getMonth() + 1;
        if (month < 10)month = '0' + month;
        return day + '.' + month + '.' + date.getFullYear();
    }

    function getFormattedTimeString(date) {
        var hours = date.getHours();
        if (hours < 10)hours = '0' + hours;
        var minutes = date.getMinutes();
        if (minutes < 10)minutes = '0' + minutes;

        return hours + ':' + minutes;
    }

    function getSlotsForSeveralDays(numberOfDays) {
        var resultSlots=[];
        var nowDate = new Date();
        var dateString = getFormattedDateString(nowDate);
        var slots = getSlotsForDay(dateString, nowDate);

        _.forEach(slots, function (slot) {
            resultSlots.push(slot);
        });

        for (var i = 1; i < numberOfDays; i++) {
            var date = addDays(nowDate, i);
            dateString = getFormattedDateString(date);
            slots = getSlotsForDay(dateString);
            _.forEach(slots, function (slot) {
                resultSlots.push(slot);
            });
        }
        return resultSlots;
    }

    function extendConstrainSlots(providerId, newAvailabilities, oldAvailabilities, callback) {
        /*
         *
         * This is the method that modify slots
         * generate old slots
         * generate new slots
         * get all slots in the new that are not in the old (Make difference)
         * if nothing delete what remains
         * if anything then add only remained slots in the new list
         *
         */

        try {
            assert.ok(providerId, "providerId should not be null!");
            assert.ok(util.isArray(newAvailabilities), "availabilities should be array!");
        } catch (err) {
            callback(err, null);
            return;
        }

        function GetDistinctAvailabilityDays(availabilities) {
            var result = [];
            _.forEach(availabilities, function (availability) {
                if (!_.find(result, function (day) {
                        return day.date === availability.date;
                    })) {
                    result.push(availability);
                }
            });
            return result;
        }

        var distinctNewAvailabilitiesDays = GetDistinctAvailabilityDays(newAvailabilities);
        var distinctOldAvailabilitiesDays = GetDistinctAvailabilityDays(oldAvailabilities);

        if (distinctNewAvailabilitiesDays.length > 1 || distinctOldAvailabilitiesDays.length > 1) {
            callback(new Error("Availability modification is possible only for one day." +
                " Please don't specify multiple days!"), null);
            return;
        }

        var allSlots = [];
        var availabilitiesSaveStatus = [];
        //todo-here this function is not implemented, don't use
    }

    function deleteSlots(providerId, oldAvailabilities, callback) {
        /*
        * This method delete the slots
        * */
        try {
            assert.ok(providerId, "providerId should not be null!");
            assert.ok(util.isArray(oldAvailabilities), "availabilities should be array!");
        } catch (err) {
            callback(err, null);
            return;
        }

        var distinctDays = [];
        _.forEach(oldAvailabilities, function (availability) {
            if (!_.find(distinctDays, function (day) {
                    return day.date === availability.date;
                })) {
                distinctDays.push(availability);
            }
        });

        var distinctDaysDeleteStatus = [];
        var allSlots = [];
        _.forEach(distinctDays, function (distinctDay) {
            var slotsToDelete = getSlotsForDay(distinctDay.date);
            slotRepository.deleteBatch(slotsToDelete, providerId, function (err, data) {
                gridCacheClient.sendSlotsBatchRemoved(slotsToDelete,providerId);
                distinctDaysDeleteStatus.push(distinctDay);
                if (distinctDaysDeleteStatus.length === distinctDays.length) {
                    var availabilitiesSaveStatus = [];
                    _.forEach(oldAvailabilities, function (availability) {
                        try {
                            var slots = generateSlotsFromAvailability(availability);
                            slotRepository.saveBatch(slots, providerId, function (error, data) {
                                if (error) {
                                    loggerProvider.getLogger().error(error);
                                } else {
                                    availabilitiesSaveStatus.push(availability);
                                    gridCacheClient.sendSlotsBatchAvailable(slots, providerId);
                                    allSlots = allSlots.concat(slots);
                                    if (availabilitiesSaveStatus.length === oldAvailabilities.length) {
                                        callback(null, allSlots);
                                    }
                                }
                            });
                        } catch (err) {
                            loggerProvider.getLogger().error(err);
                        }
                    });
                }
            });
        });
    }

    module.exports = {
        getAvailability: function (providerId, dateTime, callback) {
            slotRepository.getSlotsByProvider(providerId, dateTime, function (err, data) {
                if (err) {
                    callback(err, null);
                } else {
                    var rebuiltAvailability = utils.getAvailabilitiesFromSlots(data);
                    callback(null, rebuiltAvailability);
                }
            });
        },
        getBookedSlots: function (providerId, dateTime, callback) {
            slotRepository.getBookedSlotsByProvider(providerId, dateTime, null, function (err, data) {
                var result=[];
                var theError;
                if(data.length==0) callback(null, data);
                _.forEach(data,function(slotItem){
                    usersDetailsRepository.findOneByEmail(slotItem.patientId, function (err, userDetails) {
                        if (err) {
                            result.push(err);
                        } else {
                            usersRepository.findOneByEmail(slotItem.patientId, function (err, user, userDetails) {
                                var onlineStatus;
                                if(!err) {
                                    onlineStatus = user.onlineStatus;
                                }
                                result.push({
                                    patientId: slotItem.patientId,
                                    name: userDetails.title + ' ' + userDetails.firstname + ' ' + userDetails.surname,
                                    slotDateTime: slotItem.slotDateTime,
                                    slotDateTimeString: slotItem.slotDateTimeString,
                                    onlineStatus:onlineStatus
                                });
                                if (result.length == data.length) {
                                    callback(null, result);
                                }
                            }, userDetails);
                        }
                    });
                });

            });
        },
        generateNewSlots: function (providerId, newAvailabilities, oldAvailabilities, callback) {
            try {
                assert.ok(providerId, "providerId should not be null!");
                assert.ok(util.isArray(newAvailabilities), "availabilities should be array!");
            } catch (err) {
                callback(err, null);
                return;
            }

            var distinctDays = [];
            _.forEach(newAvailabilities, function (availability) {
                if (!_.find(distinctDays, function (day) {
                        return day.date === availability.date;
                    })) {
                    distinctDays.push(availability);
                }
            });

            if (distinctDays.length > 1) {
                callback(new Error("Change availability for one day only!"), null);
            } else {
                var slotsToDelete;
                var toAddSlots = generateSlotsFromMultipleAvailabilities(newAvailabilities);
                var oldSlots = generateSlotsFromMultipleAvailabilities(oldAvailabilities);

                var distinctToAddSlotsSource = Rx.Observable.from(toAddSlots).distinct(function(toAddSlot) {
                    return toAddSlot.getTime();
                });

                var toAddSlotsFromDistinctSource = [];

                distinctToAddSlotsSource.subscribe(function(toAddSlot){
                    toAddSlotsFromDistinctSource.push(toAddSlot);
                });

                toAddSlots = toAddSlotsFromDistinctSource;

                if (oldAvailabilities) {
                    slotsToDelete = _.filter(oldSlots, function (oldSlot) {
                        return !_.find(toAddSlots, function (toAddSlot) {
                            return oldSlot.getTime() == toAddSlot.getTime();
                        });
                    });

                    toAddSlots = _.filter(toAddSlots, function (toAddSlot) {
                        return !_.find(oldSlots, function (oldSlot) {
                            return oldSlot.getTime() == toAddSlot.getTime();
                        });
                    });

                    if (slotsToDelete && slotsToDelete.length > 0) {
                        var availabilitiesToDelete = utils.getAvailabilitiesFromSlotsAsDate(slotsToDelete);
                        var availabilityToDeleteStatus = [];
                        _.forEach(availabilitiesToDelete, function (availabilityToDelete) {
                            var startTime = utils.buildDateTime(availabilityToDelete.date, availabilityToDelete.startTime);
                            var endTime = utils.buildDateTime(availabilityToDelete.date, availabilityToDelete.endTime);
                            slotRepository.getBookedSlotsByProvider(providerId, startTime, endTime,
                                function (err, data) {
                                    if (data.length > 0) {
                                        callback(new Error("You have booked appointments for the specified intervals. Please transfer the " +
                                            "appointments to other provider before changing the schedule!"));
                                        return;
                                    } else {
                                        availabilityToDeleteStatus.push(availabilityToDelete);
                                        if (availabilityToDeleteStatus.length == availabilitiesToDelete.length) {
                                            slotRepository.deleteBatch(slotsToDelete, providerId, function (err, data) {
                                                //todo-here if error - don't send slotsBatchRemoved
                                                gridCacheClient.sendSlotsBatchRemoved(slotsToDelete, providerId);
                                                try {
                                                    if(toAddSlots.lenth>0) {
                                                        slotRepository.saveBatch(toAddSlots, providerId, function (error, data) {
                                                            if (error) {
                                                                loggerProvider.getLogger().error(error);
                                                            } else {
                                                                gridCacheClient.sendSlotsBatchAvailable(toAddSlots, providerId);
                                                                callback(null, toAddSlots);
                                                            }
                                                        });
                                                    } else callback(null, []);
                                                } catch (err) {
                                                    loggerProvider.getLogger().error(err);
                                                }
                                            });
                                        }
                                    }
                                });
                        });
                    }else {
                        try {
                            slotRepository.saveBatch(toAddSlots, providerId, function (error, data) {
                                if (error) {
                                    loggerProvider.getLogger().error(error);
                                } else {
                                    gridCacheClient.sendSlotsBatchAvailable(toAddSlots, providerId);
                                    callback(null, toAddSlots);
                                }
                            });
                        } catch (err) {
                            loggerProvider.getLogger().error(err);
                        }
                    }
                } else {
                    try {
                        slotRepository.saveBatch(toAddSlots, providerId, function (error, data) {
                            if (error) {
                                loggerProvider.getLogger().error(error);
                            } else {
                                gridCacheClient.sendSlotsBatchAvailable(toAddSlots, providerId);
                                callback(null, toAddSlots);
                            }
                        });
                    } catch (err) {
                        loggerProvider.getLogger().error(err);
                    }
                }
            }
        },
        modifySlots: function (providerId, newAvailabilities, oldAvailabilities, operation, callback) {
            try {
                assert.ok(providerId, "providerId should not be null!");
                assert.ok(util.isArray(newAvailabilities), "availabilities should be array!");
                assert.ok(util.isArray(oldAvailabilities), "old availabilities should be array!");
            } catch (err) {
                callback(err, null);
                return;
            }

            extendConstrainSlots(providerId, newAvailabilities, oldAvailabilities, callback);
        },
        extendSlots: extendConstrainSlots,
        deleteSlots: deleteSlots,
        getTimeSlotsForPeriod: getTimeSlotsForPeriod,
        getNextSlot: getNextSlot,
        generateSlotsFromAvailability: generateSlotsFromAvailability,
        getProvidersAvailability: getProvidersAvailability,
        getSlotsForDay: getSlotsForDay,
        getSlotsForSeveralDays: getSlotsForSeveralDays,
        getFormattedDateString:getFormattedDateString,
        getSlotWithProviders:getSlotWithProviders
    };
})();


