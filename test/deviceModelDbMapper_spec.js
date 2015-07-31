/**
 * Created by home on 31.07.2015.
 */

var assert = require('assert');
var DeviceModel = require("../repositories/deviceModelDbMapper");
var entitiesFactory = require("@vcrudu/hcm.domainmodel");

describe("Test mapping from entity to Db", function () {
    var deviceModel = {};

    before(function () {

        deviceModel = entitiesFactory.createDeviceModel({
            model: "PT307", description: "SN12345", price: 2.95,
            specifications: ["Negru", "Alb"], manufacturerUrl: "http://example.com",
            imagesUrls: ["http://image1.jpg", "http://image2.jpg"], deviceModelType: "BloodPressure"
        });
    });
    it("Is mapping correct", function() {
        var dbDeviceModel =DeviceModel.mapDeviceDetailsDbEntityFromDevice(deviceModel);
        assert.equal(dbDeviceModel.model.S, deviceModel.model, "Device model does not match");
        assert.equal(dbDeviceModel.description.S, deviceModel.description, "Device model description does not match");
        assert.equal(dbDeviceModel.price.N, deviceModel.price, "Device model price does not match");
        assert.equal(dbDeviceModel.specifications.SS, deviceModel.specifications, "Device model specifications does not match");
        assert.equal(dbDeviceModel.manufacturerUrl.S, deviceModel.manufacturerUrl, "Device model manufacturer URL does not match");
        assert.equal(dbDeviceModel.imagesUrls.L, deviceModel.imagesUrls, "Device model images URLs does not match");
    });
});

