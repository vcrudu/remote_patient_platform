/**
 * Created by Victor on 01/10/2015.
 */


(function(){

    var util = require('util');
    var _    = require('underscore');
    var  assert = require('assert');
    var utils = require('../utils');
    var slotRepository = require('../repositories').Slots;
    var slotMinutes = [0, 15, 30, 45];
    var dateRegEx = '^([0-3][0-9].[0-1][0-9].[2][0][1-2][1-9])$';
    var timeRegEx = '^((([0-1][0-9])|([2][0-3])):([0-5][0-9]))$';

    function addMinutes(date, minutes) {
        var timeInMilliseconds = date.getTime();
        var minutesInMilliseconds = minutes * 60 * 1000;
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

    module.exports = {
        getAvailability: function(providerId, dateTime, callback) {
            slotRepository.getSlots(providerId, dateTime, function (err, data) {
                callback(err, data);
            });
        },
        generateSlots: function(providerId, availabilities, callback) {
            assert.ok(providerId, "providerId should not be null!");
            assert.ok(util.isArray(availabilities), "availabilities should be array!");
            var allSlots = [];
            _.forEach(availabilities, function (availability) {
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

                _.forEach(slots,function(slot){
                    allSlots.push(slot);
                });

                slotRepository.saveBatch(allSlots, providerId, function(error,data){
                    callback(error, data);
                });
            });

        },

        getTimeSlotsForPeriod:getTimeSlotsForPeriod,
        getNextSlot:getNextSlot
    }
})();


