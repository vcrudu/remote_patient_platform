/**
 * Created by Victor on 06/08/2015.
 */

var uuid = require("node-uuid");
var domainModel = require("@vcrudu/hcm.domainmodel");
var Payment = require('./payment');
var commonService = require('../services/commonService');

var _ = require('underscore');
var assert = require('assert');
var util = require('util');

(function(){


    function Order(args) {

        assert.ok(args.userId, "User ID is mandatory");
        assert.ok(args.orderItems, "Order items are mandatory!");
        assert.ok(util.isArray(args.orderItems), "Order items list is mandatory. Apparently the orderItems is not a list.");

        var orderStatuses = ['New', 'Paid', 'Cancelled', 'Dispatched', 'Delivered'];
        var orderStatus = 'New';
        var orderStatusHistory = [];
        var orderItems = [];
        this.createdDate = new Date();
        this.modifiedDate = new Date();
        var devices = args.devices;

        function OrderItem(model, quantity) {
            this.model = model;
            this.quantity = quantity;
        }

        var _addOrderItem = function (model, quantity) {
            if(this.devices) {
                var existingModel = _.find(this.devices, function (device) {
                    return device.model == model;
                });

                assert.ok(existingModel, "Invalid order item!");
            }

            var existingOrderItem = _.find(orderItems, function (orderItem) {
                return orderItem.model === model;
            });

            if (existingOrderItem) {
                existingOrderItem.quantity += quantity;
            } else {
                orderItems.push(new OrderItem(model, quantity));
            }
        };

        var _changeOrderStatus = function (newStatus) {
            assert.ok(orderStatuses.indexOf(newStatus) > -1, "newStatus should be Order status!");
            assert.ok(orderStatus != "Delivered", "Order has been delivered already!");
            orderStatus = newStatus;
            this.modifiedDate = new Date();
            orderStatusHistory.push({orderStatus: newStatus, statusChangedDate: this.modifiedDate});
        };

        if (args.orderId) {
            assert.equal(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(args.orderId), true, "orderId is not a valid v4 uuid!");
            this.orderId = args.orderId;
        } else {
            this.orderId = uuid.v4();
        }

        this.userId = args.userId;
        if (args.createdDate) {
            this.createdDate = new Date(args.createdDate);
        }

        if (args.modifiedDate) {
            this.modifiedDate = new Date(args.modifiedDate);
        }

        if (!args.orderStatus) {
            orderStatus.orderStatus = 'New';
        }
        else orderStatus = args.orderStatus;

        _.forEach(args.orderItems, function (orderItem) {
            assert.ok(orderItem.model, "At least one order item does not contain a model property");
            assert.ok(orderItem.quantity, "At least one order item does not contain a quantity property");
            _addOrderItem(orderItem.model, orderItem.quantity);
        });

        if (args.orderStatusHistory) {
            //Verify if orderStatusHistory is Array
            assert.ok(util.isArray(args.orderStatusHistory), "Order status history should be an array");

            //Verify if each element of orderStatusHistory has orderStatus and statusChangedDate
            _.forEach(args.orderStatusHistory, function (orderStatusHistoryElem) {
                assert.ok(orderStatuses.indexOf(orderStatusHistoryElem.orderStatus) > -1,
                    "Order status history element should have orderStatus property!");
                assert.ok(orderStatusHistoryElem.statusChangedDate,
                    "Order status history element should have statusChangedDate property!");
                orderStatusHistory.push({
                    orderStatus: orderStatusHistoryElem.orderStatus,
                    statusChangedDate: new Date(orderStatusHistoryElem.statusChangedDate)
                });
            });
        }
        else orderStatusHistory = [{orderStatus: 'New', statusChangedDate: new Date()}];

        if (args.shippingAddress) {
            this.shippingAddress = domainModel.createAddress(args.shippingAddress);
        } else {
            this.shippingAddress = domainModel.createAddress(args);
        }

        this.changeOrderStatus = _changeOrderStatus;
        this.addOrderItem = _addOrderItem;
        this.removeOrderItem = function (model) {
            var existingOrderItem = _.find(orderItems, function (orderItem) {
                return orderItem.model === model;
            });

            if (existingOrderItem) {
                if (existingOrderItem.quantity > 1) {
                    existingOrderItem.quantity--;
                }
                else {
                    orderItems.splice(orderItems.indexOf(existingOrderItem), 1);
                }
            }
        };

        this.clearOrderItems = function () {
            orderItems = [];
        };

        this.getOrderItems = function () {
            return orderItems;
        };

        this.getValidOrderStatuses = function () {
            return orderStatuses;
        };

        this.getOrderStatus = function () {
            return orderStatus;
        };

        this.canPay = function () {
            return orderStatus == 'New';
        };


        this.getOrderStatusHistory = function () {
            return orderStatusHistory;
        };

        this.getModifiedDate = function () {
            return orderStatusHistory;
        };

        function getDevicePrice(model) {
            var foundDevice = _.find(devices, function (device) {
                return device.model == model;
            });
            return foundDevice.price;
        }

        this.getAmountToPay = function () {
           var result = _.reduce(orderItems, function (ammount, item) {
                return ammount + item.quantity * getDevicePrice(item.model)*100;
            }, 0);
            return result;
        };

        this.setDevices = function (values) {
            devices = values;
        };

        this.getDescription = function () {
            return "Order monitoring devices.";
        };

        this.getDto = function () {
            return {
                orderId: this.orderId,
                orderStatus: this.orderStatus,
                modifiedDate: this.modifiedDate,
                orderItems: orderItems,
                shippingAddress: this.shippingAddress
            };
        };
    }

    module.exports = {
        RehydrateObject: function (args) {
            return new Order(args);
        },
        BuildObject: function (args) {
            args.createdDate = undefined;
            args.modifiedDate = undefined;
            args.orderStatusHistory = undefined;
            return new Order(args);
        },
        getSample: function () {
            return {
                orderItems: [{model: "model", quantity: "1"}],
                payment: {
                    cardNumber: '4242424242424242',
                    expireMonth: '11',
                    expireYear: '2017',
                    cardSecurityNumber: '345',
                    fundingType: "card",
                    nameOnCard: "John Smith"
                },
                shippingAddress: {
                    addressLine1: "92 Bathurst Gardens", addressLine2: "Second floor",
                    town: "Great London", county: "London", country: "United Kingdom",
                    postCode: "W1H 2JL"
                }
            };
        }
    };
})();