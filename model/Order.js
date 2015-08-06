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
        assert.ok(args.email,"Email is mandatory");
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

        this.email=args.email;
        this.createdDate = args.createdDate || new Date();

        var orderStatusHistory = [];

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

            orderStatusHistory.push({orderStatus:newStatus,statusChangedDate:new Date()});
        };

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
                if(existingOrderItem.quantity>1){
                    existingOrderItem.quantity--;
                }
                else{
                    orderItems.splice(orderItems.indexOf(existingOrderItem),1);
                }
            }
        };

        this.getOrderItems = function(deviceModel){
            return orderItems;
        };
    };
})();