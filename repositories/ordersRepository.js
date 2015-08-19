/**
 * Created by home on 13.08.2015.
 */

(function(){

    var AWS             = require('aws-sdk');
    var OrderDbMapper    = require('./orderDbMapper');
    var connectionOptions = require('./awsOptions');
    var TABLE_NAME        = 'Order';

    var getDb = function(){

        var dynamodb = new AWS.DynamoDB(connectionOptions);

        return dynamodb;

    };

    module.exports = {

        findOrdersByUserId : function(userId, callback){

            var params = {
                Key: { userId: { S: userId }},
                TableName : TABLE_NAME,
                ReturnConsumedCapacity: 'TOTAL'
            };

            var dynamodb = getDb();

            dynamodb.getItem(params, function(err, data){
                if(err) {
                    console.error(err);
                    callback(err, null);
                    return;
                }
                console.log("The order has been found successfully.");
                if(data.Item) {
                    var order = OrderDbMapper.mapOrderFromDbEntity(data.Item);
                    callback(null, order);
                }else{
                    callback(null, null);
                }
            });
        },

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

                console.log("The order has been inserted successfully.");
                callback(null, data);
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