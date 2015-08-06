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
            manufacturerUrl: "http://example.com", specifications: ["Negru", "Alb"],
            imagesUrls :["http://localhost/image1.jpg", "http://localhost/image2.jpg"],  deviceModelType: "BloodPressure"
        });
        deviceModel.addDeviceModelSpecifications("Negru", "Alb");
        deviceModel.addImagesUrls("http://localhost/image1.jpg", "http://localhost/image2.jpg");
    });
    it("Is mapping correct", function() {
        var dbDeviceModel =DeviceModel.mapDbEntityFromDeviceModel(deviceModel);
        var temp = deviceModel.getDeviceModelSpecifications();
        var temp1 = deviceModel.getImagesUrls();
        assert.equal(dbDeviceModel.model.S, deviceModel.model, "Device model does not match");
        assert.equal(dbDeviceModel.description.S, deviceModel.description, "Device model description does not match");
        assert.equal(dbDeviceModel.price.N, deviceModel.price, "Device model price does not match");
        assert.equal(dbDeviceModel.specifications.SS, temp, "Device model specifications does not match");
        assert.equal(dbDeviceModel.manufacturerUrl.S, deviceModel.manufacturerUrl, "Device model manufacturer URL does not match");
        assert.equal(dbDeviceModel.imagesUrls.SS, temp1, "Device model images URLs does not match");
    });
});

