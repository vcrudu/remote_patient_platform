/**
 * Created by Victor on 06/08/2015.
 */

var uuid = require("node-uuid");
var domainModel = require("@vcrudu/hcm.domainmodel");
var Payment = require('./payment');
var _ = require('underscore');
var assert = require('assert');
var util = require('util');

(function(){

    function Order(args){

        assert.ok(args.userId, "User ID is mandatory");
        assert.ok(args.orderId, "Order id is mandatory!");
        assert.equal(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(args.orderId),true,"Order id is not a valid v4 uuid!");
        assert.ok(args.orderItems,"Order items are mandatory!");
        assert.ok(util.isArray(args.orderItems),"Order items list is mandatory. Apparently the orderItems is not a list.");

        var orderStatuses = ['New','Paid','Canceled', 'Shipped','Delivered'];
        var orderStatus = 'New';
        var orderStatusHistory = [];
        var orderItems = [];
        this.devices = [];
        this.createdDate = new Date();
        this.modifiedDate = new Date();

        function OrderItem(model,quantity){
            this.model = model;
            this.quantity=quantity;
        }

        var _addOrderItem = function(model , quantity){
            var existingOrderItem = _.find(orderItems,function(orderItem){
                return orderItem.model === model;
            });

            if(existingOrderItem){
                existingOrderItem.quantity += quantity;
            }else{
                orderItems.push(new OrderItem(model,quantity));
            }
        };

        var _changeOrderStatus = function(newStatus){
            assert.ok(orderStatuses.indexOf(newStatus)>-1,"newStatus should be Order status!");
            assert.ok(orderStatusHistory[orderStatusHistory.length-1]=="Delivered","Order has been delivered already!");
            orderStatus = newStatus;
            this.modifiedDate = new Date();
            orderStatusHistory.push({orderStatus:newStatus,statusChangedDate:this.modifiedDate});
        };

        this.orderId = args.orderId;
        this.userId=args.userId;
        if(args.createdDate) {
            this.createdDate = new Date(args.createdDate);
        }

        if(args.modifiedDate) {
            this.modifiedDate = new Date(args.modifiedDate);
        }

        if(!args.orderStatus){
            orderStatus.orderStatus ='New';
        }
        else orderStatus=args.orderStatus;

        _.forEach(args.orderItems, function(orderItem){
            assert.ok(orderItem.model,"At least one order item does not contain a model property");
            assert.ok(orderItem.quantity,"At least one order item does not contain a quantity property");
            _addOrderItem(orderItem.model, orderItem.quantity);
        });

        if(args.orderStatusHistory) {
            //Verify if orderStatusHistory is Array
            assert.ok(util.isArray(args.orderStatusHistory),"Order status history should be an array");

            //Verify if each element of orderStatusHistory has orderStatus and statusChangedDate
            _.forEach(args.orderStatusHistory, function(orderStatusHistoryElem){
                assert.ok(orderStatuses.indexOf(orderStatusHistoryElem.orderStatus)>-1,
                    "Order status history element should have orderStatus property!");
                assert.ok(orderStatusHistoryElem.statusChangedDate,
                    "Order status history element should have statusChangedDate property!");
                orderStatusHistory.push({orderStatus:orderStatusHistoryElem.orderStatus,
                    statusChangedDate:new Date(orderStatusHistoryElem.statusChangedDate)
                });
            });
        }
        else orderStatusHistory = [{orderStatus:'New', statusChangedDate:new Date()}];

        if(args.devices) {
            devices = args.devices;
        }

        if(args.shippingAddress) {
            this.shippingAddress =  domainModel.createAddress(args.shippingAddress);
        }else{
            this.shippingAddress = domainModel.createAddress(args);
        }

        this.changeOrderStatus = _changeOrderStatus;
        this.addOrderItem = _addOrderItem;
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

        this.getModifiedDate = function(){
            return orderStatusHistory;
        };

        function getDevicePrice(model){
            var foundDevice =_.find(devices,function(device){
               device.model==model;
            });
            return foundDevice.price;
        }

        this.getAmountToPay = function(){
            _.map(orderItems, function(ammount,item){
                    return ammount+item.quantity*getDevicePrice(item.model);
            },0);
            return orderStatusHistory;
        };

        this.getDto = function(){
            return {orderId:this.orderId,
                orderStatus:this.orderStatus,
                modifiedDate:this.modifiedDate,
                orderItems:orderItems,
                shippingAddress:this.shippingAddress
            };
        };
    }

    module.exports = {
        RehydrateObject : function(args){
            return new Order(args);
        },
        BuildObject : function(args){
            args.createdDate = undefined;
            args.modifiedDate = undefined;
            args.orderStatusHistory = undefined;
            return new Order(args);
        },
        getSampleArguments:function(){
            return {orderId:uuid.v4(),
                orderItems:[{model:"model",quantity:"1"}],
                shippingAddress:{addressLine1:"92 Bathurst Gardens", addressLine2 :"Second floor",
                    town:"Great London", county:"London", country:"United Kingdom",
                    postCode:"W1H 2JL"}
            };
        }
    };
})();