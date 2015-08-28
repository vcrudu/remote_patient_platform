/**
 * Created by home on 13.08.2015.
 */
var AWS = require('aws-sdk');
//var connectionOptions = require('./awsOptions');
var assert = require('assert');
var orderRepository = require("../repositories/ordersRepository");
var entitiesFactory = require("@vcrudu/hcm.domainmodel");
var _ = require('underscore');
var Order = require('../model').Order;

describe("Test Device Repository from Db", function() {

    var order = {};
    var address = {};
    var count=0;
    var countDel;

    before(function () {
        address = entitiesFactory.createAddress({addressLine1:"92 Bathurst Gardens", addressLine2 :"Second floor",
            town:"Great London", county:"London", country:"United Kingdom",
            longitude:-0.158995,latitude:51.519912,
            postCode:"W1H 2JL"});

        order = new Order({
            userId : "gcrudu@yahoo.com", orderStatus:'New',
            orderStatusHistory : [{orderStatus:'New', statusChangedDate:new Date()}],
            shippingAddress : address
        });

        order.addOrderItem("Termometru", 2);
    });

    it("Should get order by user ID", function (done) {
        orderRepository.findOneByUserId(order.userId, function (err, orderResult) {
            assert.equal(orderResult.userId,  order.userId, "Order user ID does not match");
            assert.equal(err, null, "Get by user ID method is not succesfull");

            done();
        });
    });

   /* it("Should save device Model ", function (done) {
        devicesRepository.save(deviceModel, function (err, data) {
            assert.equal(err, null, "Device Model save  method is not succesfull!");
            count = count + 1;
            done();
        });
    });

    it("Should delete device Model ", function (done) {
        devicesRepository.delete(deviceModel, function (err, data) {
            assert.equal(err, null, "Device Model has been delete succesfull!");
            countDel = count-1;

            devicesRepository.getAll(function (err, deviceModels) {
                deviceModelResult = deviceModels;
                assert.notEqual(countDel, count, "Result should be array with length > 0");


                done();
            });
        });
    });*/

});