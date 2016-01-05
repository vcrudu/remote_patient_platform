/**
 * Created by Victor on 02/10/2015.
 */

var slotsRepository = require('../../../repositories/slotsRepository');
var awsSchemaUtils = require('../../../repositories/awsSchemaUtils');
var awsOptions = require('../../../repositories/awsOptions');
var availabilityService = require('../../../services/availabilityService');
var slotsRepository = require('../../../repositories/slotsRepository');
var uuid = require('node-uuid');
var should = require('should');
var utils = require('../../../utils');

describe('slots', function() {
    this.timeout(20000);

    describe('availabilityService', function () {

        before(function (done) {
            awsOptions.tablesSuffix = uuid.v4()+'_';
            awsSchemaUtils.createSlotTable(awsOptions.tablesSuffix, function (err, description) {
                setTimeout(function () {
                    awsSchemaUtils.checkExistsTable(awsOptions.tablesSuffix + 'Slot', function (err, data) {
                        should.not.exist(err);
                        should.exist(data);
                        var nowTime = new Date();
                        var end = new Date();
                        end = utils.dateTimeUtils.addMinutes(end, 240);
                        var day = nowTime.getDate();
                        if(day<10)day='0'+day;
                        var month = nowTime.getMonth();
                        if(month<10)month='0'+month;
                        var hours = nowTime.getHours();
                        if(hours<10)hours='0'+hours;
                        var hoursEnd = end.getHours();
                        if(hoursEnd<10)hoursEnd='0'+hoursEnd;
                        var minutes = nowTime.getMinutes();
                        if(minutes<10)minutes='0'+minutes;
                        availabilityService.generateNewSlots('test@test.com', [
                            {
                                date: day+'.'+month+'.'+nowTime.getFullYear(),
                                startTime: hours+':'+minutes,
                                endTime: hoursEnd+':'+minutes,
                            }], function (error,slotsStatus) {
                            should(slotsStatus.successCount).be.equal(slotsStatus.slots.length);
                            slotsRepository.updateSlot('patient@test.com','test@test.com',slotsStatus.slots[0], function(err,data) {
                                slotsRepository.updateSlot('patient1@test.com', 'test@test.com', slotsStatus.slots[1], function (err, data) {
                                    slotsRepository.updateSlot('patient2@test.com', 'test@test.com', slotsStatus.slots[2], function (err, data) {
                                        slotsRepository.updateSlot('patient3@test.com', 'test@test.com', slotsStatus.slots[3], function (err, data) {
                                            done();
                                        });
                                    });
                                });
                            });
                        });
                    });
                }, 5000);
            }, 1, 1);
        });

        after(function(done){
            awsSchemaUtils.deleteTable(awsOptions.tablesSuffix + 'Slot', function (err, data) {
                done();
            });
        });

        it('should return a slot', function (done) {
            var nextSlot = availabilityService.getNextSlot(new Date());
            slotsRepository.getOne(nextSlot, function (err, date) {
                should.not.exist(err);
                done();
            });
        });

        it('should return all slots', function (done) {
            var startTime = new Date();
            availabilityService.getAvailability('test@test.com', startTime, function (err, date) {
                should.not.exist(err);
                done();
            });
        });

        it('should generate 9 slots from availability', function (done) {
            var availabilities = [{date:'10.10.2015',startTime:'10:15', endTime:'12:30'}];
            var slots = availabilityService.generateNewSlots('test1',availabilities, function(err, data){
                should(data.slots.length).be.equal(9);
                done();
            });
        });
    });

    describe('getProvidersForSlot', function () {
        var slotDateTime;
        before(function (done) {
            awsOptions.tablesSuffix = uuid.v4()+'_';
            awsSchemaUtils.createSlotTable(awsOptions.tablesSuffix, function (err, description) {
                setTimeout(function () {
                    awsSchemaUtils.checkExistsTable(awsOptions.tablesSuffix + 'Slot', function (err, data) {
                        should.not.exist(err);
                        should.exist(data);
                        var nowTime = new Date();
                        var end = new Date();
                        end = utils.dateTimeUtils.addMinutes(end, 15);
                        var day = nowTime.getDate();
                        if (day < 10)day = '0' + day;
                        var month = nowTime.getMonth();
                        if (month < 10)month = '0' + month;
                        var hours = nowTime.getHours();
                        if (hours < 10)hours = '0' + hours;
                        var hoursEnd = end.getHours();
                        if (hoursEnd < 10)hoursEnd = '0' + hoursEnd;
                        var minutes = nowTime.getMinutes();
                        if (minutes < 10)minutes = '0' + minutes;
                        var availability = {
                            date: day + '.' + month + '.' + nowTime.getFullYear(),
                            startTime: hours + ':' + minutes,
                            endTime: hoursEnd + ':' + minutes,
                        };
                        availabilityService.generateNewSlots('test@test.com', [availability],
                            function (error, slotsStatus) {
                                should(slotsStatus.successCount).be.equal(1);
                                availabilityService.generateNewSlots('test1@test.com', [availability],
                                    function (error, slotsStatus) {
                                        should(slotsStatus.successCount).be.equal(1);
                                        availabilityService.generateNewSlots('test2@test.com', [availability],
                                            function (error, slotsStatus) {
                                                should(slotsStatus.successCount).be.equal(1);
                                                slotDateTime = slotsStatus.slots[0].slotDateTime;
                                            });
                                    });
                            });
                    });
                }, 5000);
            }, 1, 1);
        });

        after(function(done){
            awsSchemaUtils.deleteTable(awsOptions.tablesSuffix + 'Slot', function (err, data) {
                done();
            });
        });

        it('should take 3 providers', function (done) {
            slotsRepository.getProvidersForSlot(slotDateTime, function (err, date) {
                items.length.should.be.equal(3);
                done();
            });
        });
    });
});
