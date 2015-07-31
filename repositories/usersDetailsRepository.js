/**
 * Created by Victor on 26/06/2015.
 */

(function(){

    var AWS               = require('aws-sdk');
    var UserFactory       = require('../model').UserFactory;
    var connectionOptions = require('./awsOptions');
    var TABLE_NAME        ="UsersDetails";
    var dynamoDbMapper    = require("./dynamoDbMapper");

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
                    var user = UserFactory.createUserDetailsFromDbEntity(data.Item);
                    callback(null, user);
                }else{
                    callback(null, null);
                }
            });
        },

        save : function(patient, callback) {

            var dynamodb = getDb();

            var params = {
                Item: dynamoDbMapper.createUserDetailsDbEntityFromPatient(patient),
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
        }
    };
})();