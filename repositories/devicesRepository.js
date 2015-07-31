/**
 * Created by Victor on 26/06/2015.
 */

(function(){

    var AWS             = require('aws-sdk');
    var UserFactory     = require('../model').UserFactory;
    var connectionOptions = require('./awsOptions');
    var tableName = 'Devices';

       var getDb = function(){

       var dynamodb = new AWS.DynamoDB(connectionOptions);

       return dynamodb;

    };

    module.exports = {

        getAll : function(){
            var dynamodb = getDb();

        },

        save : function(){},

        delete : function(){}


        /*findOneByEmail : function(email, callback){


            var params = {
                Key: { email: { S: email }},
                TableName: tableName,
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
                TableName: tableName,
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

        save : function(user, callback) {

            var dynamodb = getDb();

            var params = {
                Item: {
                    email: { S: user.email},
                    passwordHash:{S:user.passwordHash},
                    tokenString:{S:user.token}
                },
                TableName: tableName,
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
        }*/
    };
})();