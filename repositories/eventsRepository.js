/**
 * Created by Victor on 26/06/2015.
 */

(function(){

    var AWS             = require('aws-sdk');
    var eventsDbMapper     = require('./eventsDbMapper');
    var connectionOptions = require('./awsOptions');
    var TABLE_NAME        = 'Event';
    var _ = require('underscore');
    var loggerProvider = require('../logging');

       var getDb = function(){

       var dynamodb = new AWS.DynamoDB(connectionOptions);

       return dynamodb;

    };

    module.exports = {

        getOne:function(userId, measurementDateTime, callback){
            var params = {
                Key: { userId: { S: userId },measurementDateTime:{N:measurementDateTime.getTime().toString()}},
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
                loggerProvider.getLogger().debug("The event has been found successfully.");
                if(data.Item) {
                    var event = eventsDbMapper.mapEventFromDbEntity(data.Item);
                    callback(null, event);
                }else{
                    callback(null, null);
                }
            });
        },

        getByTimeIntervalAndMeasureType : function(userId, measureType, startTime, endTime, callback){

            var filterExpression='';
            var params;
            if(measureType!='All') {
                filterExpression = '#measurementType=:measurementType';

                params = {
                    KeyConditionExpression: 'userId=:userId AND ' +
                    '#measurementDateTime>=:startTime',

                    ExpressionAttributeNames: {
                        "#measurementType": "measurementType",
                        "#measurementDateTime": "measurementDateTime"
                    },

                    ExpressionAttributeValues: {
                        ":userId": {"S": userId},
                        ":measurementType": {"S": measureType},
                        ":startTime": {"N": startTime.getTime().toString()}//,
                        //":endTime":{"N": endTime.getTime().toString()}
                    },

                    FilterExpression: filterExpression,
                    TableName: TABLE_NAME,
                    Limit: 30
                };
            }else{
                params = {
                    KeyConditionExpression: 'userId=:userId AND ' +
                    '#measurementDateTime>=:startTime',

                    ExpressionAttributeNames: {
                        "#measurementDateTime": "measurementDateTime"
                    },
                    ExpressionAttributeValues: {
                        ":userId": {"S": userId},
                        ":startTime": {"N": startTime.getTime().toString()}//,
                        //":endTime":{"N": endTime.getTime().toString()}
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
                loggerProvider.getLogger().debug("The events has been retrieved successfully.");
                var results=[];
                if(data.Items) {
                    _.forEach(data.Items, function(item){
                        var event = eventsDbMapper.mapEventFromDbEntity(item);
                        results.push(event.getMeasurement());
                    });
                    callback(null, results);
                }else{
                    callback(null, null);
                }
            });
        },

        save : function(event, callback) {

            var dynamodb = getDb();

            var params = {
                Item: eventsDbMapper.mapEventToDbEntity(event),
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

                loggerProvider.getLogger().debug("The user has been inserted successfully.");
                callback(null, data);
            });
        }
    };
})();