/**
 * Created by Victor on 29/09/2015.
 */

(function() {
    var usersRepository = require('../repositories').Users;
    var usersDetailsRepository = require('../repositories').UsersDetails;
    var videoService = require('../services').VideoService;
    var paymentService = require('../services').PaymentService;
    var logging = require('../logging');
    var assert = require('assert');

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
        var dateFormated = dateRegExInstance.exec(dateString)[0];
        var timeIntervalRegExInstance = new RegExp(timeIntervalRegEx);
        var result = [];
        var timeInterval = timeIntervalRegExInstance.exec(availabilityString);
        while(timeInterval) {
            var startTime = timeInterval[1];
            var endTime = timeInterval[8];
            result.push({date: dateFormated, startTime: startTime, endTime: endTime});
            timeInterval = timeIntervalRegExInstance.exec(availabilityString);
        }
        return result;
    }

    function getAvailabilitiesFromSlots(slots){
        var result = [];
        if(slots.length==0) return result;
        //var aSlot = slots[0];
        //var dateString = aSlot.slotDateTime
        //var anAvailability = {date:aSlot.slotDateTime,};
        return result;
    }

    module.exports = {
        cleanUser: function (userId) {
            paymentService.deleteCustomer(req, userId, function () {
                videoService.deleteVideoUser(userId, function () {
                    usersDetailsRepository.delete(userId, function () {
                        usersRepository.delete(userId, function () {
                        });
                    });
                });
            });
        },
        buildDateTime: function (dateString, timeString) {
            return new Date(getYear(dateString),getMonth(dateString),getDay(dateString),
                getHour(timeString),getMinute(timeString));
        },
        getDay:getDay,
        getYear:getYear,
        getMonth:getMonth,
        getHour:getHour,
        getMinute:getMinute,
        getAvailabilitiesFromString:getAvailabilitiesFromString,
        getAvailabilitiesFromSlots:getAvailabilitiesFromSlots
    }
})();