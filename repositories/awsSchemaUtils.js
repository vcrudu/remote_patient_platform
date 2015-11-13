/**
 * Created by Victor on 16/09/2015.
 */

(function(){

    var connectionOptions = require('./awsOptions');
    var AWS               = require('aws-sdk');

    var getDb = function(){
        var dynamodb = new AWS.DynamoDB(connectionOptions);
        return dynamodb;
    };

    //Verifica existenta tabelei
    function checkExistsTable(tableName, callback){
        var dynamoDb = getDb();

        var params = {
            TableName: tableName /* required */
        };

        dynamoDb.describeTable(params, function(err, data) {
            if (err){
                if(err.code=='ResourceNotFoundException'){
                    callback(null, false);
                }
                callback(err);
            }
            else
                callback(null, true, data);
        });
    }

    //Sterge tabela
    function deleteTable(name, callback) {
        var dynamoDb = getDb();

        var params = {
            TableName: name,
        };

        /*checkExistsTable("TestAlarm", function (err, result) {
         console.log("ok");
         if (result) {
         console.log("ok");
         callback(err, null);
         } else {
         console.log("ok1");
         dynamoDb.deleteTable(params, function (err,data) {
         callback(err);
         });
         }
         });*/
        dynamoDb.deleteTable(params, function(err, data) {
            if (err) console.log(err); // an error occurred
            else console.log(data); // successful response
        });
    }


    //crearea tabelei alarm
    function createAlarmTable(suffix, callback, readCapacity, writeCapacity) {

        var dynamoDb = getDb();
        var tb = suffix + 'Alarm';

        var params = {
            TableName:tb,
            KeySchema: [
                {AttributeName: "alarmId", KeyType: "HASH"},
                {AttributeName: "createdDateTime", KeyType: "RANGE" }
            ],
            AttributeDefinitions: [
                {AttributeName: "alarmId", AttributeType: "S"},
                {AttributeName: "createdDateTime", AttributeType: "S" }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: readCapacity,
                WriteCapacityUnits: writeCapacity
            }
        };

        dynamoDb.createTable(params, function(err, data) {
            if (err){
                console.log(JSON.stringify(err, null, 2));
                callback(err, null);
            }	else {
                console.log(JSON.stringify(data, null, 2));
                callback(data, null);
            }});
    };

    function createDeviceModelTable(suffix, callback, readCapacity, writeCapacity) {

        var dynamoDb = getDb();
        var tb = suffix + 'DeviceModel';

        var params = {
            TableName:tb,
            KeySchema: [
                {AttributeName: "model", KeyType: "HASH"}

            ],
            AttributeDefinitions: [
                {AttributeName: "model", AttributeType: "S"}
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: readCapacity,
                WriteCapacityUnits: writeCapacity
            }
        };

        dynamoDb.createTable(params, function(err, data) {
            if (err){
                console.log(JSON.stringify(err, null, 2));
                callback(err, null);
            }	else {
                console.log(JSON.stringify(data, null, 2));
                callback(data, null);
            }});
    };

    function createAppointmentFeedbackTable(suffix, callback, readCapacity, writeCapacity) {

        var dynamoDb = getDb();
        var tb = suffix + 'AppointmentFeedback';

        var params = {
            TableName:tb,
            KeySchema: [
                {AttributeName: "feedbackId", KeyType: "HASH"},
                {AttributeName: "appointmentId", KeyType: "RANGE"},

            ],
            AttributeDefinitions: [
                {AttributeName: "feedbackId", AttributeType: "S"},
                {AttributeName: "appointmentId", AttributeType: "S" }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: readCapacity,
                WriteCapacityUnits: writeCapacity
            }
        };

        dynamoDb.createTable(params, function(err, data) {
            if (err){
                console.log(JSON.stringify(err, null, 2));
                callback(err, null);
            }	else {
                console.log(JSON.stringify(data, null, 2));
                callback(data, null);
            }});
    };

    function createEventTable(suffix, callback, readCapacity, writeCapacity) {

        var dynamoDb = getDb();
        var tb = suffix + 'Event';

        var params = {
            TableName:tb,
            KeySchema: [
                {AttributeName: "userId", KeyType: "HASH"},
                {AttributeName: "measurementDateTime", KeyType: "RANGE"},

            ],
            AttributeDefinitions: [
                {AttributeName: "userId", AttributeType: "S"},
                {AttributeName: "measurementDateTime", AttributeType: "N" }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: readCapacity,
                WriteCapacityUnits: writeCapacity
            }
        };

        dynamoDb.createTable(params, function(err, data) {
            if (err){
                console.log(JSON.stringify(err, null, 2));
                callback(err, null);
            }	else {
                console.log(JSON.stringify(data, null, 2));
                callback(data, null);
            }});
    };

    function createOrderTable(suffix, callback, readCapacity, writeCapacity) {

        var dynamoDb = getDb();
        var tb = suffix + 'Order';

        var params = {
            TableName:tb,
            KeySchema: [
                {AttributeName: "userId", KeyType: "HASH"},
                {AttributeName: "orderId", KeyType: "RANGE"},

            ],
            AttributeDefinitions: [
                {AttributeName: "userId", AttributeType: "S"},
                {AttributeName: "orderId", AttributeType: "S" }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: readCapacity,
                WriteCapacityUnits: writeCapacity
            }
        };

        dynamoDb.createTable(params, function(err, data) {
            if (err){
                console.log(JSON.stringify(err, null, 2));
                callback(err, null);
            }	else {
                console.log(JSON.stringify(data, null, 2));
                callback(data, null);
            }});
    };


    module.exports={
        createAlarmTable:createAlarmTable,
        createAppointmentFeedbackTable:createAppointmentFeedbackTable,
        createDeviceModelTable:createDeviceModelTable,
        createEventTable:createEventTable,
        createOrderTable:createOrderTable,
        deleteTable:deleteTable,
        checkExistsTable:checkExistsTable,
    }


})();

/**
 * Created by Victor on 16/09/2015.


(function(){

    var connectionOptions = require('./awsOptions');
    var AWS               = require('aws-sdk');

    var getDb = function(){
        var dynamodb = new AWS.DynamoDB(connectionOptions);
        return dynamodb;
    };

    function checkExistsTable(tableName, callback){
        var dynamoDb = getDb();

        var params = {
            TableName: tableName /* required
        };

        dynamoDb.describeTable(params, function(err, data) {
            if (err){
                if(err.code=='ResourceNotFoundException'){
                    callback(null, false);
                }else callback(err);
            }
            else
            callback(null, true, data);
        });
    }

    function createUserTable(suffix, callback, readCapacity, writeCapacity) {
        if (suffix) suffix = suffix + "_";

        var dynamoDb = getDb();

        var params = {
            TableName: suffix + "User",
            KeySchema: [
                {AttributeName: "email", KeyType: "HASH"}
            ],
            AttributeDefinitions: [
                {AttributeName: "email", AttributeType: "S"}
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: readCapacity || 1,
                WriteCapacityUnits: writeCapacity || 1
            }
        };

        checkExistsTable(suffix, function (err, result, description) {
            if (!result) {
                dynamoDb.createTable(params, function (err, data) {
                    callback(err, data);
                });
            } else {
                callback(null, description);
            }
        });
    }

    function createProviderTable(suffix, callback, readCapacity, writeCapacity) {
        if (suffix) suffix = suffix + "_";

        var tableName = suffix + "Provider";

        var dynamoDb = getDb();

        var params = {
            TableName: tableName,
            KeySchema: [
                {AttributeName: "email", KeyType: "HASH"}
            ],
            AttributeDefinitions: [
                {AttributeName: "email", AttributeType: "S"}
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: readCapacity || 1,
                WriteCapacityUnits: writeCapacity || 1
            }
        };

        checkExistsTable(tableName, function (err, result, description) {
            if (!result) {
                dynamoDb.createTable(params, function (err, data) {
                    callback(err, data);
                });
            } else {
                callback(null, description);
            }
        });
    }

    function createSlotTable(suffix, callback, readCapacity, writeCapacity) {
        if (suffix) suffix = suffix;

        var tableName = suffix + "Slot";
        var dynamoDb = getDb();

        var params = {
            TableName: tableName,
            KeySchema: [
                {AttributeName: "slotDateTime", KeyType: "HASH"},
                {AttributeName: "providerId", KeyType: "RANGE"}
            ],
            AttributeDefinitions: [
                {AttributeName: "slotDateTime", AttributeType: "N"},
                {AttributeName: "providerId", AttributeType: "S"}
            ],
            GlobalSecondaryIndexes: [ // optional (list of GlobalSecondaryIndex)
                {
                    IndexName: 'providerId-slotDateTime-index',
                    KeySchema: [
                        { // Required HASH type attribute
                            AttributeName: 'providerId',
                            KeyType: 'HASH',
                        },
                        { // Optional RANGE key type for HASH + RANGE secondary indexes
                            AttributeName: 'slotDateTime',
                            KeyType: 'RANGE',
                        }
                    ],
                    Projection: { // attributes to project into the index
                        ProjectionType: 'ALL' // (ALL | KEYS_ONLY | INCLUDE)

                    },
                    ProvisionedThroughput: { // throughput to provision to the index
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1
                    }
                }
                // ... more global secondary indexes ...
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: readCapacity || 1,
                WriteCapacityUnits: writeCapacity || 1
            }
        };

        checkExistsTable(tableName, function (err, result, description) {
            if (!result) {
                dynamoDb.createTable(params, function (err, data) {
                    callback(err, data);
                });
            } else {
                callback(null, description);
            }
        });
    }

    function deleteTable(name, callback) {
        var dynamoDb = getDb();

        var params = {
            TableName: name
        };

        checkExistsTable(params.TableName, function (err, result) {
            if (err) {
                callback(err, null);
            } else if (result) {
                dynamoDb.deleteTable(params, function (err) {
                    callback(err);
                });
            }
        });
    }

    module.exports = {
        /*createHcmTables: function (suffix, callback, readCapacity, writeCapacity) {
            assert(suffix, "Suffix should be provided!");
            createUserTable(suffix, readCapacity, writeCapacity, function (error, data) {

            });
        },

        deleteHcmTables: function (suffix, readCapacity, writeCapacity, callback) {
            assert(suffix, "Suffix should be provided!");
            deleteUserTable(suffix, readCapacity, writeCapacity, function (error, data) {

            });
        },

        checkExistsTable: checkExistsTable,
        createUserTable: createUserTable,
        createSlotTable: createSlotTable,
        deleteTable: deleteTable
    };
})();*/