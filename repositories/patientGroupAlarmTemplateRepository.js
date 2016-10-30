/**
 * Created by Victor on 5/25/2016.
 */

(function(){
    var loggerProvider     = require('../logging');
    var AWS             = require('aws-sdk');
    var alarmTemplateDbMapper             = require('./alarmTemplateDbMapper');
    var connectionOptions = require('./awsOptions');
    var _ = require('underscore');
    var TABLE_NAME = 'PatientGroupAlarmTemplate';

    var getDb = function(){

        var dynamodb = new AWS.DynamoDB(connectionOptions);

        return dynamodb;

    };

    module.exports = {
        getAll: function(byGroupId, callback) {



            var queryParams = {
                TableName: TABLE_NAME,
                KeyConditionExpression: 'groupId=:groupId',

                ExpressionAttributeValues: {
                    ":groupId": {S: byGroupId.groupId}
                }
            };

            var dynamodb = getDb();

            dynamodb.query(queryParams, function(err, data){

             

                if(err) {


                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }
                loggerProvider.getLogger().debug("The global alarms has been retrieved successfully.");
                var globalAlarms=[];
                if(data.Items) {

                    _.forEach(data.Items, function(item){
                        var globalAlarm = alarmTemplateDbMapper.mapGroupAlarmFromDbEntity(item);
                        globalAlarms.push(globalAlarm);
                    });

   
                    callback(null, globalAlarms);
                }else{
                    callback(null, null);
                }
            });
        },

        get: function(byGroupId, alarmName, callback){


          

            var params = {
                Key: {
                    groupId : { S: byGroupId},
                    alarmName: { S: alarmName } },
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
                loggerProvider.getLogger().debug("The alarm has been found successfully.");
                if(data.Item) {
                    var globalAlarmTemplate = alarmTemplateDbMapper.mapGroupAlarmFromDbEntity(data.Item);
                    callback(null, globalAlarmTemplate);
                }else{
                    callback(null, null);
                }
            });
        },
        
       

        new : function(byGroupId, groupAlarm, callback) {

            var dynamodb = getDb();

            var params = {
                Item: alarmTemplateDbMapper.mapGroupAlarmToDbEntity(byGroupId, groupAlarm),
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

                loggerProvider.getLogger().debug("The global alarm template has been inserted successfully.");
                callback(null, data);
            });
        },

        update : function(byGroupId, groupAlarm, callback) {


       //    console.log("SUNTEM IN INTERIORUL UPDATE!!!!!!!!");
      //      console.log("GROUP ID IS === "+byGroupId);
       //     console.log("ALARM NAME IS === "+groupAlarm.alarmName);

            var dynamodb = getDb();

            var dbEntity = alarmTemplateDbMapper.mapGroupAlarmToDbEntity(byGroupId, groupAlarm);

       //     console.log("DBENTITY CU SUCCESSS!!!!!!!!!!!!!!!!!");
            var params = {
                Key: { groupId : { S: byGroupId}, alarmName: { S: groupAlarm.alarmName }},
                TableName:TABLE_NAME,
                ExpressionAttributeNames: {"#rules": "rules"},
                ExpressionAttributeValues: {
                    ":p_rules": dbEntity.rules,
                    ":p_alarmDescription": dbEntity.alarmDescription
                },
                ReturnConsumedCapacity: "TOTAL",
                ReturnValues: "NONE",
                UpdateExpression: "SET #rules=:p_rules, alarmDescription=:p_alarmDescription"
            };

            dynamodb.updateItem(params, function(err, data) {
                if(err){
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }

                callback(null, groupAlarm);
            });
        },

        delete : function(byGroupId, alarmName, callback){
            var dynamodb = getDb();

            var params = {
                Key: {
            groupId : { S: byGroupId},
            alarmName: { S: alarmName}
                },
                TableName: TABLE_NAME
            };

            dynamodb.deleteItem(params, function(err, data) {
                if(err){
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }

                //loggerProvider.getLogger().log("The alarm template has been deleted successfully!");
                callback(null, data);
            });
        }
    };

})();