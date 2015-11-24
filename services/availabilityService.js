/**
 * Created by Victor on 01/10/2015.
 */


(function(){

    var util = require('util');
    var _    = require('underscore');
    var  assert = require('assert');
    var utils = require('../utils/dateTimeUtils');
    var slotRepository = require('../repositories').Slots;
    var slotMinutes = [0, 15, 30, 45];
    var dateRegEx = '^([0-3][0-9].[0-1][0-9].[2][0][1-2][1-9])$';
    var timeRegEx = '^((([0-1][0-9])|([2][0-3])):([0-5][0-9]))$';
    var gridCacheClient = require('../services/gridCacheClient');

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

    function getProvidersAvailability(callback) {
        var slotsForSeveralDays = getSlotsForSeveralDays(7);
        var slotsProvidersResult = [];
        var slotsWithExistingProviders = [];
        _.forEach(slotsForSeveralDays, function (slot) {
            slotRepository.getProvidersForSlot(slot, function (err, data) {
                //var countProviders = data;
                if(data.length>0)
                    slotsWithExistingProviders.push({slotDateTime: slot.getTime(), countOfProviders: data.length, providers:data});
                slotsProvidersResult.push({slotDateTime: slot.getTime(), countOfProviders: data.length, providers:data});
                if (slotsProvidersResult.length === slotsForSeveralDays.length) {
                    slotsProvidersResult.sort(function(a, b){
                        return a.slotDateTime-b.slotDateTime;
                    });
                    callback(null, slotsProvidersResult);
                }
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
        var lastSlot = addMinutes(slotsForPeriod[slotsForPeriod.length - 1], 15);
        slotsForPeriod.push(lastSlot);
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
        generateSlots: function (providerId, availabilities, callback) {
            try {
                assert.ok(providerId, "providerId should not be null!");
                assert.ok(util.isArray(availabilities), "availabilities should be array!");
            } catch (err) {
                callback(err, null);
                return;
            }

            var distinctDays = [];
            _.forEach(availabilities, function (availability) {
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
                        _.forEach(availabilities, function (availability) {
                            try {
                                var slots = generateSlotsFromAvailability(availability);
                                slotRepository.saveBatch(slots, providerId, function (error, data) {
                                    if (error) {
                                        console.error(error);
                                    }else {
                                        availabilitiesSaveStatus.push(availability);
                                        gridCacheClient.sendSlotsBatchAvailable(slots, providerId);
                                        allSlots = allSlots.concat(slots);
                                        if (availabilitiesSaveStatus.length === availabilities.length) {
                                            callback(null, allSlots);
                                        }
                                    }
                                });
                            } catch (err) {
                            }
                        });
                    }
                });
            });
        },

        getTimeSlotsForPeriod: getTimeSlotsForPeriod,
        getNextSlot: getNextSlot,
        generateSlotsFromAvailability: generateSlotsFromAvailability,
        getProvidersAvailability: getProvidersAvailability,
        getSlotsForDay: getSlotsForDay,
        getSlotsForSeveralDays: getSlotsForSeveralDays,
        getFormattedDateString:getFormattedDateString
    };
})();


