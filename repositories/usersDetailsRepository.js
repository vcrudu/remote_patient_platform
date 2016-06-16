/**
 * Created by Victor on 26/06/2015.
 */

(function(){

    var AWS               = require('aws-sdk');
    var UserFactory       = require('../model').UserFactory;
    var connectionOptions = require('./awsOptions');
    var TABLE_NAME        = "UserDetails";
    var dynamoDbMapper    = require("./dynamoDbMapper");
    var _                 = require('underscore');
    var loggerProvider    = require('../logging');

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
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }
                loggerProvider.getLogger().debug("The "+TABLE_NAME+" has been found successfully.");
                if(data.Item) {
                    var user = UserFactory.createUserDetailsFromDbEntity(data.Item);
                    callback(null, user);
                }else{
                    callback(null, null);
                }
            });
        },

        getUserDetailsByNhsNumber : function(nhsNumber, callback){
            var filterExpression='';
            var params = {
                KeyConditionExpression: '#nhsNumber=:nhsNumber',

                ExpressionAttributeNames: {
                    "#nhsNumber": "nhsNumber"
                },
                ExpressionAttributeValues: {
                    ":nhsNumber": {"S": nhsNumber}
                },
                IndexName:'nhsNumber-index',
                TableName: connectionOptions.tablesSuffix + TABLE_NAME,
                Limit: 700
            };
            var dynamodb = getDb();

            dynamodb.query(params, function(err, data){
                if(err) {
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }
                loggerProvider.getLogger().debug("The user has been found successfully.");
                var results=[];
                if(data.Items && data.Items.length>0) {
                    _.forEach(data.Items, function(item){

                        results.push({nhsNumber: item.nhsNumber.S});
                    });
                    callback(null, results);
                }else{
                    callback(null, null);
                }
            });
        },

        findPatient : function(email, callback){

            var params = {
                Key: { email: { S: email }},
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
                loggerProvider.getLogger().debug("The "+TABLE_NAME+"  has been found successfully.");
                if(data.Item) {
                    var user = dynamoDbMapper.mapPatientFromUserDetailsDbEntity(data.Item);
                    callback(null, user);
                }else{
                    callback(null, null);
                }
            });
        },

        save : function(patient, callback) {
            if(!patient){
                callback(null, null);
                return;
            }
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
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }

                loggerProvider.getLogger().debug("The "+TABLE_NAME+" has been inserted successfully.");
                callback(null, data);
            });
        },

        update : function(patientDetails, callback) {
            var dynamodb = getDb();

            var patientDbEntity = dynamoDbMapper.createUserDetailsDbEntityFromPatient(patientDetails)

            var params = {
                Key: { /* required */
                    email: { S: patientDetails.email }
                },
                TableName: TABLE_NAME,
                ExpressionAttributeNames: {"#uname": "name"},
                ExpressionAttributeValues: {
                    ":ud_name": patientDbEntity.name,
                    ":ud_surname": patientDbEntity.surname,
                    ":ud_title": patientDbEntity.title,
                    ":ud_date_of_birth": patientDbEntity.dateOfBirth,
                    ":ud_gender": patientDbEntity.gender,
                    ":ud_address": patientDbEntity.address,
                    ":ud_ethnicity": patientDbEntity.ethnicity,
                    ":ud_nhsNumber": patientDbEntity.nhsNumber,
                    ":ud_otherIdentifiers": patientDbEntity.otherIdentifiers,
                    ":ud_mobile": patientDbEntity.mobile,
                    ":ud_phone": patientDbEntity.phone,
                    ":ud_weight": patientDbEntity.weight,
                    ":ud_height": patientDbEntity.height,
                },
                ReturnConsumedCapacity: 'TOTAL',
                ReturnValues: 'NONE',
                UpdateExpression: 'SET #uname=:ud_name, surname=:ud_surname, title=:ud_title, dateOfBirth=:ud_date_of_birth, gender=:ud_gender, address=:ud_address, ethnicity=:ud_ethnicity, ' +
                    "nhsNumber=:ud_nhsNumber, otherIdentifiers=:ud_otherIdentifiers, mobile=:ud_mobile, phone=:ud_phone, weight=:ud_weight, height=:ud_height"
            };

            dynamodb.updateItem(params, function(err, data) {
                if(err){
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }

                loggerProvider.getLogger().debug("The "+TABLE_NAME+" has been updated successfully.");
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

                var dbPpatients = data.Items;

                var resultPatients=[];

                _.forEach(dbPpatients, function(patient){
                    resultPatients.push(dynamoDbMapper.mapPatientFromUserDetailsDbEntity(patient));
                });

                //console.log("The users has been retrieved successfully.");
                callback(null, resultPatients);
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

                loggerProvider.getLogger().debug("The "+TABLE_NAME+" has been deleted successfully!");
                callback(null, data);
            });
        }
    };
})();