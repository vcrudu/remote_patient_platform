/**
 * Created by home on 13.08.2015.
 */

(function(){

    var AWS             = require('aws-sdk');
    var OrderDbMapper    = require('./orderDbMapper');
    var connectionOptions = require('./awsOptions');
    var TABLE_NAME        = 'Order';
    var orderIdIndexName = 'orderId-index';
    var _ = require('underscore');
    var logging     = require('../logging');
    var devicesRepository = require('./devicesRepository');

    var getDb = function(){

        var dynamodb = new AWS.DynamoDB(connectionOptions);

        return dynamodb;

    };

    function getValidDevices(callback) {
        devicesRepository.getAll(function (err, result) {
            var devices=[];
            if (err) {
                callback(err,null);
            } else {
                _.forEach(result, function (device) {
                    devices.push(device);
                });
                callback(null, devices);
            }
        });
    }

    function getOrdersByUserId(userId, orderStatus, callback){

        var params = {
            TableName: TABLE_NAME, /* required */
            ExpressionAttributeValues: {
                ":userId":{"S":userId},
                ":orderStatus":{"S":orderStatus}
            },
            ReturnConsumedCapacity: 'INDEXES',
            KeyConditionExpression  : 'userId = :userId',
            FilterExpression: 'orderStatus = :orderStatus'
        };

        var dynamodb = getDb();

        dynamodb.query(params, function(err, data){
            if(err) {
                console.error(err);
                callback(err, null);
                return;
            }
            console.log("The order has been found successfully.");
            if(data.Items) {
                if(data.Items.length>0) {
                    getValidDevices(function(error, devices){
                        var orders = [];
                        _.forEach(data.Items, function (order) {
                            var mappedOrder = OrderDbMapper.mapOrderFromDbEntity(order);
                            mappedOrder.setDevices(devices);
                            orders.push(mappedOrder);
                        });
                        callback(null, orders);
                    });
                }
            }else{
                callback(null, null);
            }
        });
    }

    function getOrderByOrderId(userId, orderId, callback) {

        var params = {
            TableName: TABLE_NAME, /* required */
            ExpressionAttributeValues: {
                ":userId":{"S":userId},
                ":orderId": {"S": orderId}
            },
            ReturnConsumedCapacity: 'INDEXES',
            KeyConditionExpression: 'userId = :userId AND orderId = :orderId'
        };

        var dynamodb = getDb();

        dynamodb.query(params, function (err, data) {
            if (err) {
                console.error(err);
                callback(err, null);
                return;
            }
            if (data.Items.length > 0) {
                getValidDevices(function (error, devices) {
                    var order = OrderDbMapper.mapOrderFromDbEntity(data.Items[0]);
                    order.setDevices(devices);
                    callback(null, order);
                });
            } else {
                callback(null, null);
            }
        });
    }

    module.exports = {

        getOrdersByUserId : getOrdersByUserId,

        getLightOrderByOrderId : function(orderId, callback){

            var params = {
                TableName: TABLE_NAME, /* required */
                IndexName:orderIdIndexName,
                ExpressionAttributeValues: {
                    ":orderId":{"S":orderId}
                },
                ReturnConsumedCapacity: 'INDEXES',
                KeyConditionExpression  : 'orderId = :orderId'
            };

            var dynamodb = getDb();

            dynamodb.query(params, function(err, data){
                if(err) {
                    console.error(err);
                    callback(err, null);
                    return;
                }
                console.log("The order has been found successfully.");
                if(data.Items.length>0) {
                    callback(null, OrderDbMapper.mapOrderLightFromDbEntity(data.Items[0]));
                }else{
                    callback(null, null);
                }
            });
        },
        getOrderByOrderId : getOrderByOrderId,

        save : function(order, callback){
            var dynamodb = getDb();

            var params = {
                Item: OrderDbMapper.mapOrderToDbEntity(order),
                TableName: TABLE_NAME,
                ReturnConsumedCapacity: 'TOTAL',
                ReturnItemCollectionMetrics: 'SIZE',
                ReturnValues: 'ALL_OLD'
            };

            dynamodb.putItem(params, function(err, data) {
                if(err){
                    console.error(err);
                    callback(err, null);
                    return;
                }
                getOrderByOrderId(order.userId, order.orderId, function(err, data){
                    console.log("The order has been inserted successfully.");
                    callback(null, data);
                });
            });
        },

        updateOrder : function(order, callback) {

            var dynamodb = getDb();

            var params = {
                Key: { userId: { S: order.userId }},
                TableName:TABLE_NAME,
                ExpressionAttributeValues: {
                    ":tokenString": {"S":order.token  }
                },
                ReturnConsumedCapacity: 'TOTAL',
                UpdateExpression: 'SET tokenString=:tokenString'
            };


            dynamodb.updateItem(params, function (err, data) {
                if (err) {
                    console.error(err);
                    callback(err, null);
                    return;
                }
                console.log("The token has been updated successfully.");
                callback(null, data);
            });
        },

        delete : function(order, callback) {

            var dynamodb = getDb();

            var params = {
                Key: {
                    userId: { S: order.userId}
                },
                TableName: TABLE_NAME
            };

            dynamodb.deleteItem(params, function(err, data) {
                if(err){
                    console.error(err);
                    callback(err, null);
                    return;
                }

                console.log("The order has been deleted successfully!");
                callback(null, data);
            });
        }

    };
})();