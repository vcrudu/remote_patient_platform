/**
 * Created by Victor on 02/10/2015.
 */

var utils = require('../../utils');
var should = require('should');

describe('datetime utils', function() {
    describe('getHour', function () {
        it('should return hour 10', function () {
            var timeString = '10:15';
            var hour = utils.getHour(timeString);
            should(hour).be.equal(10);
        });

        it('should return nothing', function () {
            var timeString = 'abcd';
            var error;
            try {
                var hour = utils.getHour(timeString);
            }catch(err){
                error = err;
            }
            should(error).be.ok();
        });
    });

    describe('getMinute', function () {
        it('should return minute 15', function () {
            var timeString = '10:15';
            var minute = utils.getMinute(timeString);
            should(minute).be.equal(15);
        });

        it('should return nothing', function () {
            var timeString = 'abcd';
            var error;
            try {
                var minute = utils.getMinute(timeString);
            }catch(err){
                error = err;
            }
            should(error).be.ok();
        });
    });

    describe('getYear', function () {
        it('should return year 2015', function () {
            var dateString = '03.03.2015';
            var year = utils.getYear(dateString);
            should(year).be.equal(2015);
        });

        it('should return nothing', function () {
            var dateString = 'abcd';
            var error;
            try {
                var year = utils.getYear(dateString);
            }catch(err){
                error = err;
            }
            should(error).be.ok();
        });
    });

    describe('getMonth', function () {
        it('should return month 03', function () {
            var dateString = '03.04.2015';
            var year = utils.getMonth(dateString);
            should(year).be.equal(4);
        });

        it('should return nothing', function () {
            var dateString = 'abcd';
            var error;
            try {
                var year = utils.getMonth(dateString);
            }catch(err){
                error = err;
            }
            should(error).be.ok();
        });
    });

    describe('getDay', function () {
        it('should return day 05', function () {
            var dateString = '05.03.2015';
            var day = utils.getDay(dateString);
            should(day).be.equal(5);
        });

        it('should return nothing', function () {
            var dateString = 'abcd';
            var error;
            try {
                var year = utils.getDay(dateString);
            }catch(err){
                error = err;
            }
            should(error).be.ok();
        });
    })

    describe('buildDateTime', function () {
        it('should return correct Date', function () {
            var dateString = '05.03.2015';
            var timeString = '10:15';
            var dateTime = utils.buildDateTime(dateString, timeString);
            should(dateTime.getFullYear()).be.equal(2015);
            should(dateTime.getDate()).be.equal(5);
            should(dateTime.getMonth()).be.equal(3);
            should(dateTime.getHours()).be.equal(10);
            should(dateTime.getMinutes()).be.equal(15);
        });

        it('should return nothing', function () {
            var dateString = 'abcd';
            var error;
            try {
                var year = utils.getDay(dateString);
            }catch(err){
                error = err;
            }
            should(error).be.ok();
        });
    });
});
