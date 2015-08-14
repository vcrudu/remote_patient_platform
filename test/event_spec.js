/**
 * Created by Victor on 06/08/2015.
 */
var Event                = require('../model').Event;
var assert               = require('assert');

(function(){

    describe("Test event entity", function () {
        describe("Heart rate event entity", function () {
            var eventUnderTest;
            var measurementDateTime = new Date();
            before(function () {
                eventUnderTest = new Event({
                    heartRate: 81,
                    measurementDateTime: measurementDateTime,
                    userId: "test@test.com"
                });
            });

            it("Measurement type is Heart Rate", function () {
                assert.ok(eventUnderTest.getMeasurement().measurementType == "HeartRate", "Measurement type should be Heart Rate");
            });

            it("Measurement type is retrieved", function () {
                assert.ok(eventUnderTest.getMeasurement().measurementType == "HeartRate", "Measurement type should be Heart Rate");
                assert.ok(eventUnderTest.getMeasurement().measurementDateTime === measurementDateTime, "Measurement date time is not correct");
                assert.ok(eventUnderTest.getMeasurement().heartRate === 81, "Heart rate time is not correct");
                assert.ok(eventUnderTest.getMeasurement().userId === "test@test.com", "User id is not correct");
            });
        });

        describe("Blood pressure event entity", function () {
            var eventUnderTest;
            var measurementDateTime = new Date();
            before(function () {
                eventUnderTest = new Event({
                    heartRate: 81,
                    measurementDateTime: measurementDateTime,
                    userId: "test@test.com"
                });
            });

            it("Measurement type is retrieved", function () {
                assert.ok(eventUnderTest.getMeasurement().measurementType == "BloodPressure", "Measurement type should be BloodPressure");
                assert.ok(eventUnderTest.getMeasurement().measurementDateTime === measurementDateTime, "Measurement date time is not correct");
                assert.ok(eventUnderTest.getMeasurement().bloodPressure.systolic === 81, "Heart rate time is not correct");
                assert.ok(eventUnderTest.getMeasurement().userId === "test@test.com", "User id is not correct");
            });
        });
    });
})();