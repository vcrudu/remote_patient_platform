/**
 * Created by Victor on 20/10/2015.
 */

(function(){

    var logging = require('../logging');
    var assert = require('assert');
    var _ = require('underscore');

    var dateRegEx = "^(([0-3][0-9]).([0-1][0-9]).([2][0][1-2][1-9]))$";
    var timeRegEx = "^((([0-1][0-9])|([2][0-3])):([0-5][0-9]))$";
    var timeIntervalRegEx = /((([0-1][0-9])|([2][0-3])):([0-5][0-9]))(\s)*[-](\s)*((([0-1][0-9])|([2][0-3])):([0-5][0-9]))/g;


    function getDay(dateString){
        var dateRegExInstance1 = new RegExp(dateString);
        assert.ok(dateRegExInstance1.test(dateString),"The date string is invalid!");
        var dateRegExInstance2 = new RegExp(dateRegEx);
        var results = dateRegExInstance2.exec(dateString);
        return parseInt(results[2], 10);
    }
    function getYear(dateString){
        var dateRegExInstance1 = new RegExp(dateString);
        assert.ok(dateRegExInstance1.test(dateString),"The date string is invalid!");
        var dateRegExInstance2 = new RegExp(dateRegEx);
        var results = dateRegExInstance2.exec(dateString);
        return parseInt(results[4], 10);
    }
    function getMonth(dateString){
        var dateRegExInstance1 = new RegExp(dateString);
        assert.ok(dateRegExInstance1.test(dateString),"The date string is invalid!");
        var dateRegExInstance2 = new RegExp(dateRegEx);
        var results = dateRegExInstance2.exec(dateString);
        return parseInt(results[3], 10);
    }
    function getHour(timeString) {
        var timeRegExInstance1 = new RegExp(timeRegEx);
        assert.ok(timeRegExInstance1.test(timeString),"The date string is invalid!");
        var timeRegExInstance2 = new RegExp(timeRegEx);
        var results = timeRegExInstance2.exec(timeString);
        return parseInt(results[2], 10);
    }
    function getMinute(timeString){
        var timeRegExInstance1 = new RegExp(timeRegEx);
        assert.ok(timeRegExInstance1.test(timeString),"The date string is invalid!");
        var timeRegExInstance2 = new RegExp(timeRegEx);
        var results = timeRegExInstance2.exec(timeString);
        return parseInt(results[5], 10);
    }

    function getAvailabilitiesFromString(dateString, availabilityString){
        var dateRegExInstance = new RegExp(dateRegEx);
        var dateFormatted = dateRegExInstance.exec(dateString)[0];
        var timeIntervalRegExInstance = new RegExp(timeIntervalRegEx);
        var result = [];
        var timeInterval = timeIntervalRegExInstance.exec(availabilityString);
        while(timeInterval) {
            var startTime = timeInterval[1];
            var endTime = timeInterval[8];
            result.push({date: dateFormatted, startTime: startTime, endTime: endTime});
            timeInterval = timeIntervalRegExInstance.exec(availabilityString);
        }
        return result;
    }

    function addMinutes(date, minutes) {
        var timeInMilliseconds = date.getTime();
        var minutesInMilliseconds = minutes * 60 * 1000;
        timeInMilliseconds = timeInMilliseconds + minutesInMilliseconds;
        var nextSlot = new Date(timeInMilliseconds);
        return nextSlot;
    }

    function difference(dateTime1, dateTime2){
        var timeInMilliseconds1 = dateTime1.getTime();
        var timeInMilliseconds2 = dateTime2.getTime();
        var diff = timeInMilliseconds2 - timeInMilliseconds1;
        var minutes = diff/1000/60;
        return minutes;
    }

    function getDotDateString(dateTime) {
        if(!dateTime){
            console.error("Pizdets");
        }
        var day = dateTime.getDate();
        if (day < 10)day = '0' + day;
        var month = dateTime.getMonth()+1;
        if (month < 10)month = '0' + month;
        return day + '.' + month + '.' + dateTime.getFullYear();
    }

    function getTimeString(dateTime) {
        var hours = dateTime.getHours();
        if (hours < 10)hours = '0' + hours;
        var minutes = dateTime.getMinutes();
        if (minutes < 10)minutes = '0' + minutes;
        return hours + ':' + minutes;
    }

    function getAvailabilitiesFromSlots(slots) {
        var result = [];
        var availabilities = [];
        if (slots.length == 0) return result;
        var aSlot = slots[0];
        if(!aSlot.slotDateTime){
            console.error("Pizdets");
        }
        var availabilityDateString = getDotDateString(aSlot.slotDateTime);
        var availabilityStartTime = getTimeString(aSlot.slotDateTime);
        var availabilityEndTime = getTimeString(addMinutes(aSlot.slotDateTime, 15));
        var nextAvailability;
        if (slots.length == 1) return [{
            date: availabilityDateString,
            startTime: availabilityStartTime,
            endTime: availabilityEndTime
        }];
        for (var i = 1; i < slots.length; i++) {
            if (difference(slots[i - 1].slotDateTime, slots[i].slotDateTime) > 15) {
                availabilityEndTime = getTimeString(addMinutes(slots[i - 1].slotDateTime, 15));
                availabilities.push({
                    date: availabilityDateString,
                    startTime: availabilityStartTime,
                    endTime: availabilityEndTime
                });
                availabilityDateString = getDotDateString(slots[i].slotDateTime);
                availabilityStartTime = getTimeString(slots[i].slotDateTime);
            }
        }
        availabilityEndTime = getTimeString(addMinutes(slots[slots.length - 1].slotDateTime, 15));
        availabilities.push({
            date: availabilityDateString,
            startTime: availabilityStartTime,
            endTime: availabilityEndTime
        });

        var aResult;

        _.forEach(availabilities, function (availability) {
            if (aResult && availability.date === aResult.date) {
                aResult.intervals = aResult.intervals + ',' + availability.startTime + '-' + availability.endTime;
            } else {
                aResult = {
                    date: availability.date,
                    intervals: availability.startTime + '-' + availability.endTime
                };
                result.push(aResult);
            }
        });


        return result;
    }

    module.exports = {
        buildDateTime: function (dateString, timeString) {
            return new Date(getYear(dateString), getMonth(dateString)-1, getDay(dateString),
                getHour(timeString), getMinute(timeString));
        },
        getDay:getDay,
        getYear:getYear,
        getMonth:getMonth,
        getHour:getHour,
        getMinute:getMinute,
        getAvailabilitiesFromString:getAvailabilitiesFromString,
        getAvailabilitiesFromSlots:getAvailabilitiesFromSlots,
        getDotDateString:getDotDateString,
        addMinutes:addMinutes,
        difference:difference
    };
})();