/**
 * Created by Victor on 26/06/2015.
 */

(function(){

    var loggerProvider     = require('../logging');
    var AWS             = require('aws-sdk');
    var connectionOptions = require('./awsOptions');
    var notificationDbMapper = require('./notificationDbMapper');
    var _ = require('underscore');
    var TABLE_NAME = 'Notification';

    var getDb = function(){

        var dynamodb = new AWS.DynamoDB(connectionOptions);

        return dynamodb;

    };

    module.exports = {

        getOne:function(userId, type, notificationDateTime, callback){
            var params = {
                Key: { userId: { S: userId },dateTime:{N:notificationDateTime.getTime().toString()}},
                TableName:TABLE_NAME,
                ReturnConsumedCapacity: 'TOTAL'
            };

            var dynamodb = getDb();

            dynamodb.getItem(params, function(err, data){
                if(err) {
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }
                loggerProvider.getLogger().debug("The notification has been found successfully.");
                if(data.Item) {
                    var event = notificationDbMapper.mapNotificationFromDbEntity(data.Item);
                    callback(null, event);
                }else{
                    callback(null, null);
                }
            });
        },

        getByUserIdAndDateTime:function(userId, dateTime, callback){
            var params = {
                Key: { userId: { S: userId }, dateTime:{ N:dateTime }},
                TableName:TABLE_NAME,
                ReturnConsumedCapacity: 'TOTAL'
            };

            var dynamodb = getDb();

            dynamodb.getItem(params, function(err, data){
                if(err) {
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }
                loggerProvider.getLogger().debug("The notification has been found successfully.");
                if(data.Item) {
                    var notification = notificationDbMapper.mapNotificationFromDbEntity(data.Item);
                    callback(null, notification);
                }else{
                    callback(null, null);
                }
            });
        },

        notificationRead : function(userId, dateTime, read, callback){
            var params = {
                Key: { userId: { S: userId }, dateTime:{ N:dateTime }},
                ExpressionAttributeNames: {"#read": "read"},
                TableName:TABLE_NAME,
                ExpressionAttributeValues: {
                    ":p_read": { BOOL: read }
                },
                ReturnConsumedCapacity: "TOTAL",
                ReturnValues: "NONE",
                UpdateExpression: "SET #read=:p_read"
            };

            var dynamodb = getDb();

            dynamodb.updateItem(params, function(err, data) {
                if(err){
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }

                callback(null, null);
            });
        },

        getList : function(userId, category, startTime, endTime, callback){

            var filterExpression='';
            var params;
            if(category!='All') {
                filterExpression = '#category=:category';

                params = {
                    KeyConditionExpression: 'userId=:userId AND ' +
                    '#dateTime>=:startTime',

                    ExpressionAttributeNames: {
                        "#category": "category",
                        "#dateTime": "dateTime"
                    },

                    ExpressionAttributeValues: {
                        ":userId": {"S": userId},
                        ":category": {"S": category},
                        ":startTime": {"N": startTime.getTime().toString()}
                    },

                    FilterExpression: filterExpression,
                    TableName: TABLE_NAME,
                    Limit: 30
                };
            }else{
                params = {
                    KeyConditionExpression: 'userId=:userId AND ' +
                    '#dateTime>=:startTime',

                    ExpressionAttributeNames: {
                        "#dateTime": "dateTime"
                    },
                    ExpressionAttributeValues: {
                        ":userId": {"S": userId},
                        ":startTime": {"N": startTime.getTime().toString()}
                    },
                    TableName: TABLE_NAME,
                    Limit: 30
                };
            }
            var dynamodb = getDb();

            dynamodb.query(params, function(err, data){
                if(err) {
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }
                loggerProvider.getLogger().debug("The notifications has been retrieved successfully.");
                var results=[];
                if(data.Items) {
                    _.forEach(data.Items, function(item){
                        var notification = notificationDbMapper.mapNotificationFromDbEntity(item);
                        results.push(notification);
                    });
                    callback(null, results);
                }else{
                    callback(null, null);
                }
            });
        },

        save : function(notification, callback) {

            var dynamodb = getDb();

            var params = {
                Item: notificationDbMapper.mapNotificationToDbEntity(notification),
                TableName: TABLE_NAME,
                ReturnConsumedCapacity: 'TOTAL',
                ReturnItemCollectionMetrics: 'SIZE',
                ReturnValues: 'ALL_OLD'
            };

            dynamodb.putItem(params, function(err, data) {
                if(err){
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }

                loggerProvider.getLogger().debug("The notification has been inserted successfully.");
                callback(null, data);
            });
        }
    };
})();
