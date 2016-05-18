/**
 * Created by victorcrudu on 17/05/2016.
 */
/**
 * Created by Victor on 26/06/2015.
 */

(function(){

    var AWS             = require('aws-sdk');
    var connectionOptions = require('./awsOptions');
    var TABLE_NAME        = 'SnsEndpoint';
    var _             = require('underscore');
    var loggerProvider = require('../logging');
    var util = require('util');

    var getDb = function(){

        var dynamodb = new AWS.DynamoDB(connectionOptions);

        return dynamodb;

    };

    function getItem(token, callback, state) {

        var params = {
            Key: {token: {S: token}},
            TableName: TABLE_NAME,
            ReturnConsumedCapacity: 'TOTAL'
        };
        var dynamodb = getDb();

        dynamodb.getItem(params, function (err, data) {
            if (err) {
                loggerProvider.getLogger().error(err);
                callback(err, null, state);
                return;
            }
            loggerProvider.getLogger().debug("The user has been found successfully by token.");
            if (data.Item) {
                var snsEndpoint = {
                    userId: data.Item.userId.S,
                    token: data.Item.token.S,
                    endpointArn: data.Item.endpointArn.S
                };
                callback(null, snsEndpoint, state);
            } else {
                callback(null, null, state);
            }
        });
    }

    module.exports = {

        findOne: getItem,

        findFirst: function (token1, token2, callback, state) {

            getItem(token1, function(err, snsEndpoint){
                if(!err && snsEndpoint){
                    callback(null, snsEndpoint);
                } else {
                    getItem(token2, function (err, snsEndpoint) {
                        callback(err, snsEndpoint);
                    });
                }
            });
        },

        updateSnsEndpoint: function (token, userId, endpointArn, callback) {
            var dynamodb = getDb();

            var params = {
                Key: {token: {S: token}},
                TableName: TABLE_NAME,
                ExpressionAttributeValues: {
                    ":userId": {"S": userId},
                    ":endpointArn": {"S": endpointArn}
                },
                ReturnConsumedCapacity: 'TOTAL',
                UpdateExpression: 'SET userId=:userId AND endpointArn=:endpointArn'
            };

            dynamodb.updateItem(params, function (err, data) {
                if (err) {
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }
                loggerProvider.getLogger().debug(userId + " gcmToken updated successfully.");
                callback(null, data);
            });

        },

        delete : function(token, callback) {

            var dynamodb = getDb();

            var params = {
                Key: {
                    token: { S: token}
                },
                TableName: TABLE_NAME
            };

            dynamodb.deleteItem(params, function(err, data) {
                if(err){
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }

                loggerProvider.getLogger().debug("The sns endpoint entity has been deleted successfully!");
                callback(null, data);
            });
        },

        deleteUserFromEndpoint: function (token, userId, callback) {
            var dynamodb = getDb();

            var params = {
                Key: {token: {S: token}},
                TableName: TABLE_NAME,
                ReturnConsumedCapacity: 'TOTAL',
                UpdateExpression: 'REMOVE userId'
            };

            dynamodb.updateItem(params, function (err, data) {
                if (err) {
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }
                loggerProvider.getLogger().debug("gcmToken removed successfully.");
                callback(null, data);
            });
        },

        save: function (token, endpointArn, userId, callback) {

            var dynamodb = getDb();

            var params = {
                Item: {
                    token: {S: token},
                    endpointArn: {S: endpointArn},
                    userId: {S: userId}
                },
                TableName: TABLE_NAME,
                ReturnConsumedCapacity: 'TOTAL',
                ReturnItemCollectionMetrics: 'SIZE',
                ReturnValues: 'ALL_OLD'
            };

            dynamodb.putItem(params, function (err, data) {
                if (err) {
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