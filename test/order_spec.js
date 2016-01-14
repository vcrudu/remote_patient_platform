/**
 * Created by Victor on 06/08/2015.
 */
var should = require('should');
var assert               = require('assert');
var Order                = require('../model').Order;
var entitiesFactory      = require("@vcrudu/hcm.domainmodel");
(function(){

    describe("Test Order entity", function () {

        var address = entitiesFactory.createAddress({addressLine1:"92 Bathurst Gardens", addressLine2 :"Second floor",
            town:"Great London", county:"London", country:"United Kingdom",
            longitude:-0.158995,latitude:51.519912,
            postCode:"W1H 2JL"
        });

        describe("Test default value", function(){
            var orderUnderTest = {};
            before(function(){
                orderUnderTest = new Order({
                    userId : "gcrudu@yahoo.com", orderStatus:'New',
                    orderStatusHistory : [{orderStatus:'New', statusChangedDate:new Date()}],
                    shippingAddress : address
                });
            });

            it("Has email", function(){
                assert.equal(orderUnderTest.userId,'gcrudu@yahoo.com', "Email address does not match");
            });

            it("Throw - Order status should be specified!",function(){
                assert.equal(orderUnderTest.getOrderStatus(), 'New', 'Order status should be specified!');
            });

            it("Throw - Invalid order status!",function(){
                var temp = orderUnderTest.getValidOrderStatuses();
                var temp1 =orderUnderTest.getOrderStatus();
                assert.notEqual(temp.indexOf(temp1),-1, "Invalid order status!");
            });

            it("Throw - Id is not a valid v4 uuid!",function(){
               // /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(orderUnderTest.id).should.be.true;
            });

            it("Create Order successfully and have all the properties initialized",function(){

            });

            it("Add order item successfully",function(){

            });

            it("Remove order item successfully",function(){

            });
        });
        describe("Test userId is mandatory", function(){
            var orderUnderTest;
            var expectedError;
           it("Throw exception userId is mandatory", function(){
               try {
                   orderUnderTest = new Order({
                       orderStatus: 'New',
                       orderStatusHistory: [{orderStatus: 'New', statusChangedDate: new Date()}],
                       shippingAddress : address
                   });
               }catch(error){
                   expectedError = error.message;
               }
               assert.equal(expectedError, "User ID is mandatory", "Should throw error - User ID is mandatory");
           });
        });
        describe("Test order status is mandatory", function(){
            var orderUnderTest;
            var expectedError;
            it("Throw exception order status is mandatory", function(){
                try {
                    orderUnderTest = new Order({
                        userId : "gcrudu@yahoo.com",
                        orderStatusHistory: [{orderStatus: 'New', statusChangedDate: new Date()}],
                        shippingAddress : address
                    });
                }catch(error){
                    expectedError = error.message;
                }
                assert.equal(expectedError, "Order status should be specified!", "Should throw error - Order status should be specified!");
            });
        });
    });

})();