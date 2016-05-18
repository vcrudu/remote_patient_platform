/**
 * Created by Victor on 26/06/2015.
 */

(function(){

    var AWS             = require('aws-sdk');
    var UserFactory     = require('../model').UserFactory;
    var connectionOptions = require('./awsOptions');
    var TABLE_NAME        = 'User';
    var _             = require('underscore');
    var loggerProvider = require('../logging');
    var util = require('util');

       var getDb = function(){

       var dynamodb = new AWS.DynamoDB(connectionOptions);

       return dynamodb;

    };

    module.exports = {

        findOneByEmail : function(email, callback, state){

            var params = {
                Key: { email: { S: email }},
                TableName:TABLE_NAME,
                ReturnConsumedCapacity: 'TOTAL'
            };

            var dynamodb = getDb();

            dynamodb.getItem(params, function(err, data){
                if(err) {
                    loggerProvider.getLogger().error(err);
                    callback(err, null, state);
                    return;
                }
                loggerProvider.getLogger().debug("The user has been found successfully.");
                if(data.Item) {
                    var user = UserFactory.createUserFromDbEntity(data.Item);
                    callback(null, user, state);
                }else{
                    callback(null, null, state);
                }
            });
        },

        findOneByNhsNumber : function(nhsNumber, callback, state){

            var params = {
                Key: { nhsNumber: { S: nhsNumber }},
                TableName:TABLE_NAME,
                ReturnConsumedCapacity: 'TOTAL'
            };

            var dynamodb = getDb();

            dynamodb.getItem(params, function(err, data){
                if(err) {
                    loggerProvider.getLogger().error(err);
                    callback(err, null, state);
                    return;
                }
                loggerProvider.getLogger().debug("The user has been found successfully.");
                if(data.Item) {
                    var user = UserFactory.createUserFromDbEntity(data.Item);
                    callback(null, user, state);
                }else{
                    callback(null, null, state);
                }
            });
        },
        
        updateToken : function(user, callback) {

            var dynamodb = getDb();

            var params = {
                Key: { email: { S: user.email }},
                TableName:TABLE_NAME,
                ExpressionAttributeValues: {
                    ":tokenString": {"S":user.token  },
                },
                ReturnConsumedCapacity: 'TOTAL',
                UpdateExpression: 'SET tokenString=:tokenString'
            };


            dynamodb.updateItem(params, function (err, data) {
                if (err) {
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }
                loggerProvider.getLogger().debug("The token has been updated successfully.");
                callback(null, data);
            });
        },

        updateOnlineStatus : function(userId, onlineStatus, socketIds, callback) {
            var dynamodb = getDb();

            var mappedSocketIds = _.map(socketIds, function(socketId){
                return {"S":socketId};
            });

            var params = {
                Key: { email: { S: userId }},
                TableName:TABLE_NAME,
                ExpressionAttributeValues: {
                    ":onlineStatus": {"S":onlineStatus  },
                    ":socketIds": {"L":mappedSocketIds  },
                },
                ReturnConsumedCapacity: 'TOTAL',
                UpdateExpression: 'SET onlineStatus=:onlineStatus, socketIds=:socketIds'
            };

            dynamodb.updateItem(params, function (err, data) {
                if (err) {
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }
                loggerProvider.getLogger().debug("Online status updated successfully.");
                callback(null, data);
            });
        },

        save : function(user, callback) {

            var dynamodb = getDb();

            var dbUser = UserFactory.createDbEntityFromUser(user);

            var params = {
                Item: dbUser,
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
        },
        delete : function(userId, callback) {

            var dynamodb = getDb();

            var params = {
                Key: {
                    email: { S: userId}
                },
                TableName: TABLE_NAME
            };

            dynamodb.deleteItem(params, function(err, data) {
                if(err){
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }

                loggerProvider.getLogger().debug("The user has been deleted successfully!");
                callback(null, data);
            });
        },
        getAll : function(callback) {

            var dynamodb = getDb();

            var params = {
                TableName: TABLE_NAME,
                ReturnConsumedCapacity: 'TOTAL'
            };

            dynamodb.scan(params, function(err, data) {
                if(err){
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }

                var dbUsers = data.Items;

                var resultUsers=[];

                _.forEach(dbUsers, function(dbUser){
                    var user = UserFactory.createUserFromDbEntity(dbUser);
                    resultUsers.push(user);
                });

                //console.log("The users has been retrieved successfully.");
                callback(null, resultUsers);
            });
        },
        getAllByType : function(type, callback) {

            var dynamodb = getDb();

            var filterExpression='#onlineStatus=:onlineStatus';
            var params = {
                KeyConditionExpression: '#type=:type AND ' +
                '#email>=:email',

                ExpressionAttributeNames: {
                    "#type": "type",
                    "#email": "email",
                    "#onlineStatus":"onlineStatus"
                },
                ExpressionAttributeValues: {
                    ":type": {"S": type},
                    ":email": {"S": '0'},
                    ":onlineStatus":{"S": 'online'}
                },
                FilterExpression: filterExpression,
                IndexName: 'type-email-index',
                TableName: connectionOptions.tablesSuffix + TABLE_NAME,
                Limit: 700
            };

            dynamodb.query(params, function(err, data) {
                if(err){
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }

                var dbUsers = data.Items;

                var resultUsers=[];

                _.forEach(dbUsers, function(dbUser){
                    var user = UserFactory.createUserFromDbEntity(dbUser);
                    resultUsers.push(user);
                });

                //console.log("The users has been retrieved successfully.");
                callback(null, resultUsers);
            });
        },
        resetUserPassword:function (userData,callback){


                var dynamodb = getDb();

                var params = {
                    Key: { email: { S: userData.email }},
                    TableName:TABLE_NAME,
                    ExpressionAttributeValues: {
                        ":passwordHash": {"S":userData.passwordHash  },
                    },
                    ReturnConsumedCapacity: 'TOTAL',
                    UpdateExpression: 'SET passwordHash=:passwordHash'
                };


                dynamodb.updateItem(params, function (err, data) {
                    if (err) {
                        callback(err, null);
                        return;
                    }

                    callback(null, data);
                });

        }
    };
})();