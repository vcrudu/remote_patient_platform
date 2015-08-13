/**
 * Created by Victor on 26/06/2015.
 */

(function(){

    var AWS             = require('aws-sdk');
    var eventsDbMapper     = require('./eventsDbMapper');
    var connectionOptions = require('./awsOptions');
    var TABLE_NAME        = 'Event';

       var getDb = function(){

       var dynamodb = new AWS.DynamoDB(connectionOptions);

       return dynamodb;

    };

    module.exports = {
        getByTimeIntervalAndMeasureType : function(userId, measureType, startTime, endTime, callback){

            var params = {
                "ExpressionAttributeNames":
                {
                    "#measurementType" :"measurementType",
                    "#measurementDateTime" :"measurementDateTime"
                },
                "ExpressionAttributeValues":
                {
                    ":measurementType" :{"S": measureType},
                    ":startTime":{"N": startTime.getTime().toString()},
                    ":endTime":{"N": endTime.getTime().toString()}
                },
                "FilterExpression": "#measurementDateTime>=:startTime AND" +
                "#measurementDateTime<=:startTime AND #measurementType=:measurementType",
                "TableName": TABLE_NAME
            };

            var dynamodb = getDb();

            dynamodb.query(params, function(err, data){
                if(err) {
                    console.error(err);
                    callback(err, null);
                    return;
                }
                console.log("The events has been retrieved successfully.");
                if(data.Item) {
                    var user = UserFactory.createUserFromDbEntity(data.Item);
                    callback(null, user);
                }else{
                    callback(null, null);
                }
            });
        },

        save : function(event, callback) {

            var dynamodb = getDb();

            var params = {
                Item: eventsDbMapper.mapEventToDbEntity(),
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