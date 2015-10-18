/**
 * Created by Victor on 02/10/2015.
 */

var slotsRepository = require('../../../repositories/slotsRepository');
var awsSchemaUtils = require('../../../repositories/awsSchemaUtils');
var awsOptions = require('../../../repositories/awsOptions');
var availabilityService = require('../../../services/availabilityService');
var uuid = require('node-uuid');
var should = require('should');

describe('slotsRepository', function() {
    this.timeout(20000);
    before(function (done) {
        awsOptions.tablesSuffix = uuid.v4()+'_';
        awsSchemaUtils.createSlotTable(awsOptions.tablesSuffix, function (err, description) {
            setTimeout(function () {
                awsSchemaUtils.checkExistsTable(awsOptions.tablesSuffix + 'Slot', function (err, data) {
                    should.not.exist(err);
                    should.exist(data);
                    var nowTime = new Date();
                    var day = nowTime.getDate();
                    if(day<10)day='0'+day;
                    var month = nowTime.getMonth();
                    if(day<10)day='0'+day;
                    if(month<10)month='0'+month;
                    var hours = nowTime.getHours();
                    if(hours<10)hours='0'+hours;
                    var hoursEnd = nowTime.getHours()+4;
                    if(hoursEnd<10)hoursEnd='0'+hoursEnd;
                    var minutes = nowTime.getMinutes()
                    if(minutes<10)minutes='0'+minutes;
                    availabilityService.generateSlots('test@test.com', [
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

    describe('getOne', function () {
        it('should return a slot', function (done) {
            var nextSlot = availabilityService.getNextSlot(new Date());
            slotsRepository.getOne(nextSlot,function(err, date){
                should.not.exist(err);
                done();
            });
        });
    });
});
