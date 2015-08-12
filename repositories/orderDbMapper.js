/**
 * Created by home on 10.08.2015.
 */

(function() {

    var Order = require('../model').Order;
    var domainModel = require('@vcrudu/hcm.domainmodel');

    function buildArray(source, mapper)
    {
        var all = [];
        for(var i=0; i<source.length; i++)
        {
            var temp = mapper(source[i]);
            all.push(temp);
        }
        return all;
    }

    function mapOrderStatusHistoryToDbEntity(orderStatusHistoryElem)
    {
        return {
            orderStatus : {S: orderStatusHistoryElem.orderStatus},
            statusChangedDate : {S: orderStatusHistoryElem.statusChangedDate.getTime().toString()}
        };
    }

    function mapOrderItemToDbEntity(orderItemElem)
    {
        return {
            model : {S: orderItemElem.model},
            quantity : {N: orderItemElem.quantity}
        };
    }

    function buildDynamoDbString(str){
        if(str) return {S:str};
        else return {NULL:true};
    }

    function mapOrderShippingAddressToDbEntity(shippingAddress)
    {
        return {
            id:{S: shippingAddress.id},
            addressLine1:{S: shippingAddress.addressLine1},
            addressLine2:buildDynamoDbString(shippingAddress.addressLine2),
            town:{S: shippingAddress.town},
            county:{S: shippingAddress.county},
            country:{S: shippingAddress.country},
            postCode:{S: shippingAddress.postCode},
            longitude:buildDynamoDbString(shippingAddress.longitude),
            latitude:buildDynamoDbString(shippingAddress.latitude)
        };
    }

    function mapOrderStatusHistoryFromDbEntity(orderStatusHistoryElem)
    {
        var createdStatusChangedDate = new Date();
        createdStatusChangedDate.setTime(orderStatusHistoryElem.statusChangedDate.S);

        return {
            orderStatus :  orderStatusHistoryElem.orderStatus.S,
            statusChangedDate : createdStatusChangedDate
        };
    }

    function mapOrderItemFromDbEntity(orderItemElem)
    {
        return {
            model : orderItemElem.model.S,
            quantity : orderItemElem.quantity.N
        };
    }

    function mapOrderShippingAddressFromDbEntity(shippingAddress)
    {
        return domainModel.createAddress({
            id: shippingAddress.id.S,
            addressLine1: shippingAddress.addressLine1.S,
            addressLine2: shippingAddress.addressLine2.S,
            town: shippingAddress.town.S,
            county: shippingAddress.county.S,
            country: shippingAddress.country.S,
            postCode: shippingAddress.postCode.S,
            longitude: shippingAddress.longitude.S,
            latitude: shippingAddress.latitude.S
        });
    }

    module.exports  = {

        mapOrderToDbEntity : function(order){
            var fullAddress = mapOrderShippingAddressToDbEntity(order.shippingAddress);
            var allOrderStatusHistory = buildArray(order.getOrderStatusHistory(), mapOrderStatusHistoryToDbEntity);
            var allOrderItems = buildArray(order.getOrderItems(), mapOrderItemToDbEntity);
            return {
                userId : {S : order.userId},
                orderStatus : {S : order.orderStatus},
                createdDate : {S : order.createdDate.getTime().toString()},
                orderStatusHistory : {L : allOrderStatusHistory},
                orderItems : {L : allOrderItems},
                shippingAddress : {M : fullAddress}
            };

        },

        mapOrderFromDbEntity : function(dbEntity){

            var createdDateOriginal = new Date();
            createdDateOriginal.setTime((dbEntity.createdDate.S));

            var allOrderStatusHistory = buildArray(dbEntity.orderStatusHistory.L, mapOrderStatusHistoryFromDbEntity);
            var allOrderItems = buildArray(dbEntity.orderItems.L, mapOrderItemFromDbEntity);
            var fullAddress = mapOrderShippingAddressFromDbEntity(dbEntity.shippingAddress.M);

            var order = new Order({

                userId : dbEntity.userId.S,
                orderStatus : dbEntity.orderStatus.S,
                createdDate : createdDateOriginal,
                orderStatusHistory : allOrderStatusHistory,
                orderItems : allOrderItems,
                shippingAddress : fullAddress
            });

            return order;
        }

    };

})();

