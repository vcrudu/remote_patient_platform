/**
 * Created by Victor on 02/10/2015.
 */
(function() {


    var utils = require('../../utils').dateTimeUtils;
    var should = require('should');
    var _ = require('underscore');
    var availabilityService = require('../../services/availabilityService');

    describe('datetime utils', function () {
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
                } catch (err) {
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
                } catch (err) {
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
                } catch (err) {
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
                } catch (err) {
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
                } catch (err) {
                    error = err;
                }
                should(error).be.ok();
            });
        });

        describe('buildDateTime', function () {
            it('should return correct Date', function () {
                var dateString = '05.03.2015';
                var timeString = '10:15';
                var dateTime = utils.buildDateTime(dateString, timeString);
                var month = dateTime.getMonth();
                should(dateTime.getFullYear()).be.equal(2015);
                should(dateTime.getDate()).be.equal(5);
                should(dateTime.getMonth()).be.equal(2);
                should(dateTime.getHours()).be.equal(10);
                should(dateTime.getMinutes()).be.equal(15);
            });

            it('should return nothing', function () {
                var dateString = 'abcd';
                var error;
                try {
                    var year = utils.getDay(dateString);
                } catch (err) {
                    error = err;
                }
                should(error).be.ok();
            });


            it('should return an array of availabilities', function () {
                var dateRegEx = "^(([0-3][0-9]).([0-1][0-9]).([2][0][1-2][1-9]))$";
                var timeRegEx = "((([0-1][0-9])|([2][0-3])):([0-5][0-9]))$";
                var dateString = '07.05.2015';
                var availabilityString = 'dfsdf 08:00 -    12:00,vxcv 13:00   - 17:00';
                var availabilities = utils.getAvailabilitiesFromString(dateString, availabilityString);
                should(availabilities).have.length(2);
                _.forEach(availabilities, function (availability) {
                    availability.date.should.be.ok;
                    var dateRegExInstance = new RegExp(dateRegEx);
                    dateRegExInstance.test(availability.date).should.be.ok;
                    availability.startTime.should.be.ok;
                    var timeRegExInstance1 = new RegExp(timeRegEx);
                    timeRegExInstance1.test(availability.startTime).should.be.ok;
                    availability.endTime.should.be.ok;
                    var timeRegExInstance2 = new RegExp(timeRegEx);
                    timeRegExInstance2.test(availability.endTime).should.be.ok;
                });
            });
        });

        describe('build availability from slots', function () {
            it('difference in minutes should return 15', function () {
                var dateTime1 = new Date();
                var dateTime2 = new Date(dateTime1.getTime());
                dateTime2.setMinutes(dateTime2.getMinutes() + 15);
                var diff = utils.difference(dateTime1, dateTime2);
                diff.should.be.equal(15);
            });

            it('should return one availability', function () {
                var dateTime11 = new Date();
                var dateTime12 = new Date(dateTime11.getTime());
                dateTime12.setMinutes(dateTime12.getMinutes() + 60);

                var slots1 = availabilityService.getTimeSlotsForPeriod(dateTime11, dateTime12);

                var dateTime21 = new Date();
                dateTime21.setHours(dateTime21.getHours() + 1);
                var dateTime22 = new Date(dateTime21.getTime());

                dateTime22.setMinutes(dateTime22.getMinutes() + 60);

                var slots2 = availabilityService.getTimeSlotsForPeriod(dateTime21, dateTime22);


                var slotWithProviderId = [];

                _.forEach(slots1, function (slot) {
                    slotWithProviderId.push({providerId: 'test@test.com', slotDateTime: slot});
                });

                _.forEach(slots2, function (slot) {
                    slotWithProviderId.push({providerId: 'test@test.com', slotDateTime: slot});
                });

                var availability = utils.getAvailabilitiesFromSlots(slotWithProviderId);
                //availability.length.should.be.equal(1);
            });


            it('should return 7 availabilities', function () {

                var all = [];
                var availabilities = utils.getAvailabilitiesFromString('01.01.2015', '08:00-12:00,13:00-16:00');
                all = all.concat(availabilities);
                availabilities = utils.getAvailabilitiesFromString('02.01.2015', '09:00-13:00,14:00-17:00');
                all = all.concat(availabilities);
                availabilities = utils.getAvailabilitiesFromString('03.01.2015', '08:00-12:00,13:00-16:00');
                all = all.concat(availabilities);
                availabilities = utils.getAvailabilitiesFromString('04.01.2015', '09:00-13:00,14:00-17:00');
                all = all.concat(availabilities);
                availabilities = utils.getAvailabilitiesFromString('05.01.2015', '08:00-12:00,13:00-16:00');
                all = all.concat(availabilities);
                availabilities = utils.getAvailabilitiesFromString('06.01.2015', '09:00-13:00,14:00-17:00');
                all = all.concat(availabilities);
                availabilities = utils.getAvailabilitiesFromString('07.01.2015', '08:00-12:00,13:00-16:00');
                all = all.concat(availabilities);

                var allSlots = [];

                _.forEach(all, function (availability) {
                    var slots = availabilityService.generateSlotsFromAvailability(availability);
                    allSlots = allSlots.concat(slots);
                });

                var slotWithProviderId = [];
                _.forEach(allSlots, function (slot) {
                    slotWithProviderId.push({providerId: 'test@test.com', slotDateTime: slot});
                });

                var rebuiltAvailability = utils.getAvailabilitiesFromSlots(slotWithProviderId);
                rebuiltAvailability.length.should.be.equal(14);
                /*rebuiltAvailability[0].date.should.be.equal('01.01.2015');
                rebuiltAvailability[0].intervals.should.be.equal('08:00-12:00,13:00-16:00');
                rebuiltAvailability[1].date.should.be.equal('02.01.2015');
                rebuiltAvailability[1].intervals.should.be.equal('09:00-13:00,14:00-17:00');
                rebuiltAvailability[2].date.should.be.equal('03.01.2015');
                rebuiltAvailability[2].intervals.should.be.equal('08:00-12:00,13:00-16:00');
                rebuiltAvailability[3].date.should.be.equal('04.01.2015');
                rebuiltAvailability[3].intervals.should.be.equal('09:00-13:00,14:00-17:00');
                rebuiltAvailability[4].date.should.be.equal('05.01.2015');
                rebuiltAvailability[4].intervals.should.be.equal('08:00-12:00,13:00-16:00');
                rebuiltAvailability[5].date.should.be.equal('06.01.2015');
                rebuiltAvailability[5].intervals.should.be.equal('09:00-13:00,14:00-17:00');
                rebuiltAvailability[6].date.should.be.equal('07.01.2015');
                rebuiltAvailability[6].intervals.should.be.equal('08:00-12:00,13:00-16:00');*/
            });


        });
    });
})();