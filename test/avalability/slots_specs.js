/**
 * Created by Victor on 02/10/2015.
 */

var availabilityService = require('../../services').AvailabilityService;
var should = require('should');

describe('availabilityService', function() {
    describe('first slot generator', function () {
        it('should return next slot at minute 15', function () {
            var now = new Date();
            now.setMinutes(14);
            var slot = availabilityService.getNextSlot(now);
            var day = slot.getDay();
            should(slot.getFullYear()).be.equal(now.getFullYear());
            should(slot.getMonth()).be.equal(now.getMonth());
            should(slot.getDate()).be.equal(now.getDate());
            should(slot.getHours()).be.equal(now.getHours());
            should(slot.getMinutes()).be.equal(15);
        });

        it('should return next slot at minute 30', function () {
            var now = new Date();
            now.setMinutes(24);
            var slot = availabilityService.getNextSlot(now);
            var day = slot.getDay();
            should(slot.getFullYear()).be.equal(now.getFullYear());
            should(slot.getMonth()).be.equal(now.getMonth());
            should(slot.getDate()).be.equal(now.getDate());
            should(slot.getHours()).be.equal(now.getHours());
            should(slot.getMinutes()).be.equal(30);
        });

        it('should return next slot at minute 45', function () {
            var now = new Date();
            now.setMinutes(31);
            var slot = availabilityService.getNextSlot(now);
            var day = slot.getDay();
            should(slot.getFullYear()).be.equal(now.getFullYear());
            should(slot.getMonth()).be.equal(now.getMonth());
            should(slot.getDate()).be.equal(now.getDate());
            should(slot.getHours()).be.equal(now.getHours());
            should(slot.getMinutes()).be.equal(45);
        });

        it('should return next slot at minute 0 of the next hour', function () {
            var now = new Date();
            now.setMinutes(46);
            var slot = availabilityService.getNextSlot(now);
            var day = slot.getDay();
            should(slot.getFullYear()).be.equal(now.getFullYear());
            should(slot.getMonth()).be.equal(now.getMonth());
            should(slot.getDate()).be.equal(now.getDate());
            should(slot.getHours()).be.equal(now.getHours() + 1);
            should(slot.getMinutes()).be.equal(0);
        });
    });

    describe('slots generator', function () {
        it('should return next 3 slots', function () {
            var startTime = new Date();
            var endTime = new Date();
            startTime.setMinutes(14);
            endTime.setMinutes(14);
            endTime.setHours(startTime.getHours()+1)
            var slots = availabilityService.getTimeSlotsForPeriod(startTime, endTime);
            should(slots.length).be.equal(3);
        });

        it('should return next 2 slots', function () {
            var startTime = new Date();
            var endTime = new Date();
            startTime.setMinutes(14);
            endTime.setMinutes(48);
            var slots = availabilityService.getTimeSlotsForPeriod(startTime, endTime);
            should(slots.length).be.equal(2);
        });

        it('should return next 7 slots', function () {
            var startTime = new Date();
            var endTime = new Date();
            startTime.setMinutes(0);
            endTime.setMinutes(59);
            endTime.setHours(startTime.getHours()+1);
            var slots = availabilityService.getTimeSlotsForPeriod(startTime, endTime);
            should(slots.length).be.equal(7);
        });

        it('should generate 9 slots from availability', function () {
            var availabilities = [{date:'10.10.2015',startTime:'10:15', endTime:'12:30'}];
            var slots = availabilityService.generateSlots('test1',availabilities);
            should(slots.length).be.equal(9);
        });

    });
});
