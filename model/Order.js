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

        assert.ok(args.userId, "User ID is mandatory");
        assert.ok(args.orderStatus, "Order status should be specified!");
        assert.notEqual(orderStatuses.indexOf(args.orderStatus),-1, "Invalid order status!");

        this.userId=args.userId;
        this.createdDate = args.createdDate || new Date();


        var orderStatus = args.orderStatus;

        var orderStatusHistory = [];
        var orderItems = [];
        var OrderItem = function(model,quantity){
            this.model = model;
            this.quantity=quantity;
        };


        assert.ok(args.id, "Order id is mandatory!");

        assert.equal(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(args.id),true,"Order id is not a valid v4 uuid!");
        this.id = args.id;

        if(args.orderStatusHistory) {
            //Verify if orderStatusHistory is Array
            assert.ok(args.orderStatusHistory.constructor.toString().indexOf("Array")>-1,"Order status history should be an array");

            //Verify if each element of orderStatusHistory has orderStatus and statusChangedDate
            _.forEach(args.orderStatusHistory, function(orderStatusHistoryElem){
                assert.ok(orderStatuses.indexOf(orderStatusHistoryElem.orderStatus)>-1,
                    "Order status history element should have orderStatus property!");
                assert.ok(orderStatusHistoryElem.statusChangedDate,
                    "Order status history element should have statusChangedDate property!");
            });
            orderStatusHistory = args.orderStatusHistory;
        }
        else orderStatusHistory = [{orderStatus:'New', statusChangedDate:new Date()}];

        this.changeOrderStatus = function(newStatus){
            assert.ok(orderStatuses.indexOf(newStatus)>-1,
                "newStatus should be Order status!");
            assert.ok(orderStatusHistory[orderStatusHistory.length-1]=="Delivered","Order has been delivered already!");
            orderStatus = newStatus;
            orderStatusHistory.push({orderStatus:newStatus,statusChangedDate:new Date()});
        };


        this.shippingAddress = args.shippingAddress || domainModel.createAddress(args);

        this.addOrderItem = function(model , quantity){
            var existingOrderItem = _.find(orderItems,function(orderItem){
               return orderItem.model === model;
            });

            if(existingOrderItem){
                existingOrderItem.quantity += quantity;
            }else{
                orderItems.push(new OrderItem(model,quantity));
            }
        };

        this.removeOrderItem = function(model){
            var existingOrderItem = _.find(orderItems, function(orderItem){
                return orderItem.model === model;
            });

            if(existingOrderItem){
                if(existingOrderItem.quantity>1){
                    existingOrderItem.quantity--;
                }
                else{
                    orderItems.splice(orderItems.indexOf(existingOrderItem),1);
                }
            }
        };

        this.getOrderItems = function(){
            return orderItems;
        };

        this.getValidOrderStatuses = function(){
          return orderStatuses;
        };

        this.getOrderStatus = function(){
          return orderStatus;
        };

        this.getOrderStatusHistory = function(){
            return orderStatusHistory;
        };

    };
})()