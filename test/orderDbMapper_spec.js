/**
 * Created by home on 10.08.2015.
 */

var assert = require('assert');
var OrderDbMapper = require("../repositories/orderDbMapper");
var entitiesFactory = require("@vcrudu/hcm.domainmodel");
var Order = require('../model').Order;

describe("Test mapping from Order entity to Db", function () {
    var order = {};
    var address = {};

    before(function() {

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

    it("Is mapping correct", function() {
        var temp = order.getOrderStatusHistory();
        var temp1 = order.getOrderItems();
        var dbOrder =OrderDbMapper.mapOrderToDbEntity(order);
        assert.equal(dbOrder.userId.S, order.userId, "Order user ID does not match");
        assert.equal(dbOrder.orderStatus.S, order.orderStatus, "Order status does not match");
        assert.equal(dbOrder.createdDate.N, order.createdDate.getTime(), "Order created date does not match");
        assert.equal(dbOrder.orderStatusHistory.L.length, temp.length, "Order length does not match");
        for(var i=0; i<dbOrder.orderStatusHistory.L.length; i++) {
            assert.equal(dbOrder.orderStatusHistory.L[i].orderStatus.S, temp[i].orderStatus, "Order status history element does not match");
            assert.equal(dbOrder.orderStatusHistory.L[i].statusChangedDate.S, temp[i].statusChangedDate.getTime(), "Order status history element does not match");
        }
        assert.equal(dbOrder.orderItems.L.length, temp1.length, "Order items length does not match");
        for(i=0; i<dbOrder.orderItems.L.length; i++){
            assert.equal(dbOrder.orderItems.L[i].model.S, temp1[i].model, "Order item model does not match");
            assert.equal(dbOrder.orderItems.L[i].quantity.N, temp1[i].quantity, "Order item quantity does not match");
        }
        assert.equal(dbOrder.shippingAddress.M.id.S, order.shippingAddress.id, "Order address id does not match");
        assert.equal(dbOrder.shippingAddress.M.addressLine1.S, order.shippingAddress.addressLine1, "Order address line 1 does not match");
        assert.equal(dbOrder.shippingAddress.M.addressLine2.S, order.shippingAddress.addressLine2, "Order address line 2 does not match");
        assert.equal(dbOrder.shippingAddress.M.town.S, order.shippingAddress.town, "Order town does not match");
        assert.equal(dbOrder.shippingAddress.M.county.S, order.shippingAddress.county, "Order county does not match");
        assert.equal(dbOrder.shippingAddress.M.country.S, order.shippingAddress.country, "Order country does not match");
        assert.equal(dbOrder.shippingAddress.M.postCode.S, order.shippingAddress.postCode, "Order post code does not match");
        assert.equal(dbOrder.shippingAddress.M.longitude.S, order.shippingAddress.longitude, "Order longitude does not match");
        assert.equal(dbOrder.shippingAddress.M.latitude.S, order.shippingAddress.latitude, "Order latitude does not match");
    });
});

