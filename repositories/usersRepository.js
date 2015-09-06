/**
 * Created by Victor on 26/06/2015.
 */

(function(){

    var AWS             = require('aws-sdk');
    var UserFactory     = require('../model').UserFactory;
    var connectionOptions = require('./awsOptions');
    var TABLE_NAME        = 'User';
    var _             = require('underscore');

       var getDb = function(){

       var dynamodb = new AWS.DynamoDB(connectionOptions);

       return dynamodb;

    };

    module.exports = {

        findOneByEmail : function(email, callback){

            var params = {
                Key: { email: { S: email }},
                TableName:TABLE_NAME,
                ReturnConsumedCapacity: 'TOTAL'
            };

            var dynamodb = getDb();

            dynamodb.getItem(params, function(err, data){
                if(err) {
                    console.error(err);
                    callback(err, null);
                    return;
                }
                console.log("The user has been found successfully.");
                if(data.Item) {
                    var user = UserFactory.createUserFromDbEntity(data.Item);
                    callback(null, user);
                }else{
                    callback(null, null);
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
                    console.error(err);
                    callback(err, null);
                    return;
                }
                console.log("The token has been updated successfully.");
                callback(null, data);
            });
        },

        updateOnlineStatus : function(userId, onlineStatus, socketId, callback) {

            var dynamodb = getDb();

            var params = {
                Key: { email: { S: userId }},
                TableName:TABLE_NAME,
                ExpressionAttributeValues: {
                    ":onlineStatus": {"S":onlineStatus  },
                    ":socketId": {"S":socketId  },
                },
                ReturnConsumedCapacity: 'TOTAL',
                UpdateExpression: 'SET onlineStatus=:onlineStatus, socketId=:socketId'
            };

            dynamodb.updateItem(params, function (err, data) {
                if (err) {
                    console.error(err);
                    callback(err, null);
                    return;
                }
                console.log("Online status updated successfully.");
                callback(null, data);
            });
        },

        save : function(user, callback) {

            var dynamodb = getDb();

            var createdDateTime = new Date();

            var params = {
                Item: {
                    email: { S: user.email},
                    passwordHash:{S:user.passwordHash},
                    tokenString:{S:user.token},
                    isActive:{BOOL:user.isActive},
                    name:{S:user.firstname},
                    surname:{S:user.surname},
                    createdDateTime:{N:createdDateTime.getTime().toString()}
                },
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

                console.log("The user has been inserted successfully.");
                callback(null, data);
            });
        },
        delete : function(user, callback) {

            var dynamodb = getDb();

            var params = {
                Key: {
                    email: { S: user.email}
                },
                TableName: TABLE_NAME
            };

            dynamodb.deleteItem(params, function(err, data) {
                if(err){
                    console.error(err);
                    callback(err, null);
                    return;
                }

                console.log("The user has been deleted successfully!");
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
                    console.error(err);
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
        }

    };
})();