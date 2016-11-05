/**
 * Created by developer1 on 10/6/2016.
 */
/**
 * Created by Victor on 5/25/2016.
 */

(function(){
    var loggerProvider     = require('../logging');
    var AWS             = require('aws-sdk');
    var schedulePlanDbMapper             = require('./schedulePlanDbMapper');
    var connectionOptions = require('./awsOptions');
    var _ = require('underscore');
    var TABLE_NAME = 'GroupSchedule';

    var getDb = function(){

        var dynamoDb = new AWS.DynamoDB(connectionOptions);

        return dynamoDb;

    };
    var dynamoDb = getDb();
    module.exports = {


        createTable: function createTable(callback) {

            var params = {

                TableName: TABLE_NAME,

                KeySchema: [{ AttributeName: "scheduleName", KeyType: "HASH" },
                            {AttributeName: "groupId", keyType: "RANGE"}],

                AttributeDefinitions: [{ AttributeName: "scheduleName", AttributeType: "S" },
                                       { AttributeName: "groupId", AttributeType: "S" } ],

                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5
                }
            };

           dynamoDb.createTable(params, function (err, data) {

                if (err) {
                    callback(err, null);
                }

                if (data) {
                    callback(null, data);
                }
            });
        },

        deleteTable: function deleteTable(callback) {

            var params = {
                TableName: TABLE_NAME
            };

            /*dynamoDb.deleteTable(params, function (err) {

                if (err) {
                    callback(err, false);
                } else {
                    callback(null, true);
                }
            });*/
        },

        getList: function(byGroupId, callback) {



            var queryParams = {
                TableName: TABLE_NAME,
                                
                KeyConditionExpression: 'groupId=:groupId',


                ExpressionAttributeValues: {
                    ":groupId": {S: byGroupId}

                }
            };



            dynamoDb.query(queryParams, function(err, data){



                if(err) {


                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }
                loggerProvider.getLogger().debug("The schedules list has been retrieved successfully.");
                var schedulesList=[];
                if(data.Items) {

                    _.forEach(data.Items, function(item){
                        var scheduleList = schedulePlanDbMapper.mapSchedulePlanFromDbEntity(item);
                        schedulesList.push(scheduleList);
                    });


                    callback(null,schedulesList);
                }else{
                    callback(null, null);
                }
            });
        },

        getOne: function getOne(byGroupId, scheduleData, callback) {

            var params = {
                Key: { groupId: {S: byGroupId},
                       scheduleName: { S: scheduleData.scheduleName } },
                TableName: TABLE_NAME,
                ReturnConsumedCapacity: 'TOTAL'
            };


            dynamoDb.getItem(params, function (err, data) {
                if (err) {
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }
                loggerProvider.getLogger().debug("The notification has been found successfully.");
                if (data.Item) {

                    var groupMeasurementSchedule = schedulePlanDbMapper.mapSchedulePlanFromDbEntity(data.Item);
                    callback(null, groupMeasurementSchedule);
                } else {
                    callback(null, null);
                }
            });
        },



      //  save : function (byGroupId, scheduleName, groupMeasurementSchedule, callback) {
        save : function (byGroupId, scheduleData, callback) {

            var params = {
              //  Item: schedulePlanDbMapper.mapSchedulePlanToDbEntity(byGroupId, scheduleName, groupMeasurementSchedule),
                Item: schedulePlanDbMapper.mapSchedulePlanToDbEntity(byGroupId, scheduleData),
                TableName: TABLE_NAME,
                ReturnConsumedCapacity: 'TOTAL',
                ReturnItemCollectionMetrics: 'SIZE',
                ReturnValues: 'ALL_OLD'
            };

            dynamoDb.putItem(params, function (err, data) {
                if (err) {
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }

                loggerProvider.getLogger().debug("The event has been inserted successfully.");
                callback(null, data);
            });
        },
        
        update : function(byGroupId, scheduleData, callback) {


            //    console.log("SUNTEM IN INTERIORUL UPDATE!!!!!!!!");
            //      console.log("GROUP ID IS === "+byGroupId);
            //     console.log("ALARM NAME IS === "+groupAlarm.alarmName);


            var dbEntity = schedulePlanDbMapper.mapSchedulePlanToDbEntity(byGroupId, scheduleData);
           

            //     console.log("DBENTITY CU SUCCESSS!!!!!!!!!!!!!!!!!");
            var params = {
                Key: { groupId : { S: byGroupId}, scheduleName: { S: scheduleData.scheduleName }},
                TableName: TABLE_NAME,
                ExpressionAttributeNames: {"#dayTimePoints": "dayTimePoints"},
                ExpressionAttributeValues: {
                     ":dayTimePoints": dbEntity.dayTimePoints
                },
                ReturnConsumedCapacity: 'TOTAL',
                ReturnItemCollectionMetrics: 'SIZE',
                ReturnValues: 'NONE',
                UpdateExpression: "SET #dayTimePoints=:dayTimePoints"
            };

            dynamoDb.updateItem(params, function(err, data) {
                if(err){
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }

                callback(null, data);
            });
        },


        delete : function(byGroupId, scheduleName, callback){


            var params = {
                Key: {
                    groupId : { S: byGroupId},
                    scheduleName: { S: scheduleName}
                },
                TableName: TABLE_NAME
            };

            dynamoDb.deleteItem(params, function(err, data) {
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
