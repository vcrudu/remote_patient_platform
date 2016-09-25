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
                    KeyConditionExpression: 'userId=:userId',

                    ExpressionAttributeNames: {
                        "#category": "category"
                    },

                    ExpressionAttributeValues: {
                        ":userId": {"S": userId},
                        ":category": {"S": category}
                    },
                    ScanIndexForward:false,

                    FilterExpression: filterExpression,
                    TableName: TABLE_NAME,
                    Limit: 30
                };
            }else{
                params = {
                    KeyConditionExpression: 'userId=:userId',

                    ExpressionAttributeValues: {
                        ":userId": {"S": userId}
                    },
                    ScanIndexForward:false,
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

        getPagedList : function(userId, category, startTime, endTime, pageSize, pageNumber, callback){

            var filterExpression='';
            var params;
            if(category!='All') {
                filterExpression = '#category=:category';

                params = {
                    KeyConditionExpression: 'userId=:userId',

                    ExpressionAttributeNames: {
                        "#category": "category"
                    },

                    ExpressionAttributeValues: {
                        ":userId": {"S": userId},
                        ":category": {"S": category}
                    },
                    ScanIndexForward:false,

                    FilterExpression: filterExpression,
                    TableName: TABLE_NAME,
                    Limit: pageSize
                };
            }else{
                params = {
                    KeyConditionExpression: 'userId=:userId',

                    ExpressionAttributeValues: {
                        ":userId": {"S": userId}
                    },
                    ScanIndexForward:false,
                    TableName: TABLE_NAME,
                    Limit: pageSize
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
        },

        delete : function(userId, dateTime, callback) {

            var dynamodb = getDb();

            var params = {
                Key: { userId: { S: userId }, dateTime:{ N:dateTime }},
                TableName: TABLE_NAME
            };

            dynamodb.deleteItem(params, function(err, data) {
                if(err){
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }

                loggerProvider.getLogger().debug("Notifications was deleted successfully!");
                callback(null, data);
            });
        },

        deleteAll : function(userId, listToDelete, callback) {
            var dynamodb = getDb();

            var deleteRequests = [];
            for (var i=0; i < listToDelete.length; i++) {

                deleteRequests.push({DeleteRequest : {
                    Key: { userId: { S: userId }, dateTime:{ N:listToDelete[i].dateTime.toString() }},
                }})

            }

            var params = {
                RequestItems : {
                    'Notification' : deleteRequests
                }
            };

            dynamodb.batchWriteItem(params, function(err, data) {
                if (err) {
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }

                loggerProvider.getLogger().debug("Notifications were deleted successfully!");
                callback(null, data);
            });
        },
    };
})();
