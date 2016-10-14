/**
 * Created by home on 03.08.2015.
 */

var AWS = require('aws-sdk');
//var connectionOptions = require('./awsOptions');
var assert = require('assert');
var devicesRepository = require("../repositories/devicesRepository");
var entitiesFactory = require("@vcrudu/hcm.domainmodel");
var _ = require('underscore');



describe.skip("Test Device Repository from Db", function() {

    var deviceModelsResult;
    var deviceModel;
    var count=0;
    var countDel;

    before(function () {
        deviceModel = entitiesFactory.createDeviceModel({
            model: "PT307",
            description: "SN12345",
            price: 2.95,
            manufacturerUrl: "http://example.com",
            imagesUrls: ["http://localhost/image1.jpg", "http://localhost/image2.jpg"],
            deviceModelType: "BloodPressure",
            specifications: ["bla-bla", "tadida-tadida"]
        });
    });

    it("Should get all device Models", function (done) {
        devicesRepository.getAll(function (err, deviceModels) {
            deviceModelResult = deviceModels;
            //assert.notEqual(deviceModelResult.length, 0, "Result should be array with length > 0");
            assert.equal(err, null, "Get all method is not succesfull");
            count = deviceModelResult.length;
            done();
        });
    });
});






