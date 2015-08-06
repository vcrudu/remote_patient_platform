/**
 * Created by Victor on 06/08/2015.
 */

var uuid = require("node-uuid");
var domainModel = require("@vcrudu/hcm.domainmodel");
var _ = require('underscore');
var assert = require('assert');

(function(){
    module.exports = function(args){
        var orderStatuses = ['New','Paid', 'Shipped','Delivered'];
        assert.ok(args.orderStatus,"Order status should be specified!");
        assert.notEqual(orderStatuses.indexOf(args.orderStatus),-1, "Invalid order status!");

        var OrderItem = function(deviceModel,quantity){
            this.deviceModel = deviceModel;
            this.quantity=quantity;
        };

        if(args.id) {
            assert.equal(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(args.id),true,"Id is not a valid v4 uuid!");
            address.id = args.id;
        }else{
            address.id = uuid.v4();
        }

        this.shippingAddress = domainModel.createAddress(args);
        var orderItems = [];

        this.addOrderItem = function(deviceModel){
            var existingOrderLine = _.find(orderLines,function(orderItem){
               return orderItem.deviceModel === deviceModel;
            });

            if(existingOrderLine){
                existingOrderLine.quantity++;
            }else{
                orderItems.push(new OrderItem(deviceModel,1));
            }
        };

        this.removeOrderItem = function(deviceModel){
            var existingOrderItem = _.find(orderItems, function(orderItem){
                return orderItem.deviceModel === deviceModel;
            });

            if(existingOrderItem){
                existingOrderItem.quantity++;
            }else{
                orderItems.push(new OrderItem(deviceModel,1));
            }
        };

        this.getOrderItems = function(deviceModel){
            return orderItems;
        };
    };
})();