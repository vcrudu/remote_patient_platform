/**
 * Created by Victor on 5/25/2016.
 */

(function(){
    var loggerProvider     = require('../logging');
    var AWS             = require('aws-sdk');
    var alarmTemplateDbMapper             = require('./alarmTemplateDbMapper');
    var connectionOptions = require('./awsOptions');
    var _ = require('underscore');
    var TABLE_NAME = 'GlobalAlarmTemplate';

    var getDb = function(){

        var dynamodb = new AWS.DynamoDB(connectionOptions);

        return dynamodb;

    };

    module.exports = {
        getAll: function(callback) {
            var scanParams = {
                TableName: TABLE_NAME
            };

            var dynamodb = getDb();

            dynamodb.scan(scanParams, function(err, data){
                if(err) {
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }
                loggerProvider.getLogger().debug("The global alarms has been retrieved successfully.");
                var globalAlarms=[];
                if(data.Items) {
                    _.forEach(data.Items, function(item){
                        var globalAlarm = alarmTemplateDbMapper.mapGlobalAlarmFromDbEntity(item);
                        globalAlarms.push(globalAlarm);
                    });
                    callback(null, globalAlarms);
                }else{
                    callback(null, null);
                }
            });
        },
        
        get: function(alarmName, callback){
            var params = {
                Key: { alarmName: { S: alarmName } },
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
                    var globalAlarmTemplate = alarmTemplateDbMapper.mapGlobalAlarmFromDbEntity(data.Item);
                    callback(null, globalAlarmTemplate);
                }else{
                    callback(null, null);
                }
            });
        },

      

        new : function(globalAlarm, callback) {

            var dynamodb = getDb();
          
            var params = {
                Item: alarmTemplateDbMapper.mapGlobalAlarmToDbEntity(globalAlarm),
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

        update : function(globalAlarm, callback) {

            var dynamodb = getDb();

            var dbEntity = alarmTemplateDbMapper.mapGlobalAlarmToDbEntity(globalAlarm);

            var params = {
                Key: { alarmName: { S: globalAlarm.alarmName }},
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

                callback(null, globalAlarm);
            });
        },

        delete : function(alarmName, callback){
            var dynamodb = getDb();

            var params = {
                Key: {
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