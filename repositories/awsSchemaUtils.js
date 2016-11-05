/**
 * Created by Victor on 16/09/2015.
 */

(function(){

    var connectionOptions = require('./awsOptions1');
    var AWS               = require('aws-sdk');
    var loggerProvider    = require('../logging');

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
            TableName:name,
        };

        checkExistsTable(params.TableName, function (err, result) {
            if (err) {
                callback(err, null);
            } else if (result) {
                /*dynamoDb.deleteTable(params, function (err) {
                    dynamoDb.waitFor('tableNotExists', params, function(err, data) {
                        if (err) loggerProvider.getLogger().error(err); // an error occurred
                        else     callback(err);           // successful response
                    });

                });*/
            }
        });
    }


    //crearea tabelei alarm
    function createAlarmTable(suffix, callback, readCapacity, writeCapacity) {

        var dynamoDb = getDb();
        if (suffix) suffix = suffix + "_";
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
                ReadCapacityUnits: readCapacity || 1,
                WriteCapacityUnits: writeCapacity || 1        }
        };

        dynamoDb.createTable(params, function(err, data) {
            if (err){
                loggerProvider.getLogger().error(err);
                callback(err, null);
            }	else {
                loggerProvider.getLogger().debug(data);
                callback(null,data);
            }});
    }

    //crearea tabelei DeviceModel
    function createDeviceModelTable(suffix, callback, readCapacity, writeCapacity) {

        var dynamoDb = getDb();
        if (suffix) suffix = suffix + "_";
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
                ReadCapacityUnits: readCapacity || 1,
                WriteCapacityUnits: writeCapacity || 1        }
        };

        dynamoDb.createTable(params, function(err, data) {
            if (err){
                loggerProvider.getLogger().error(err);
                callback(err, null);
            }	else {
                loggerProvider.getLogger().debug(data);
                callback(null,data);
            }});
    }

    //crearea tabelei AppointmentFeedback
    function createAppointmentFeedbackTable(suffix, callback, readCapacity, writeCapacity) {

        var dynamoDb = getDb();
        if (suffix) suffix = suffix + "_";
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
                ReadCapacityUnits: readCapacity || 1,
                WriteCapacityUnits: writeCapacity || 1        }
        };

        dynamoDb.createTable(params, function(err, data) {
            if (err){
                console.log(JSON.stringify(err, null, 2));
                callback(err, null);
            }	else {
                console.log(JSON.stringify(data, null, 2));
                callback(null,data);
            }});
    }

    //crearea tabelei Event
    function createEventTable(suffix, callback, readCapacity, writeCapacity) {

        var dynamoDb = getDb();
        if (suffix) suffix = suffix + "_";
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
                ReadCapacityUnits: readCapacity || 1,
                WriteCapacityUnits: writeCapacity || 1        }
        };

        dynamoDb.createTable(params, function(err, data) {
            if (err){
                console.log(JSON.stringify(err, null, 2));
                callback(err, null);
            }	else {
                console.log(JSON.stringify(data, null, 2));
                callback(null,data);
            }});
    }

    //crearea tabelei Order
    function createOrderTable(suffix, callback, readCapacity, writeCapacity) {

        var dynamoDb = getDb();
        if (suffix) suffix = suffix + "_";
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
                ReadCapacityUnits: readCapacity || 1,
                WriteCapacityUnits: writeCapacity || 1        }
        };

        dynamoDb.createTable(params, function(err, data) {
            if (err){
                console.log(JSON.stringify(err, null, 2));
                callback(err, null);
            }	else {
                console.log(JSON.stringify(data, null, 2));
                callback(null,data);
            }});
    }

    //crearea tabelei PatientAppointment
    function createPatientAppointmentTable(suffix, callback, readCapacity, writeCapacity) {

        var dynamoDb = getDb();
        if (suffix) suffix = suffix + "_";
        var tb = suffix + 'PatientAppointment';

        var params = {
            TableName:tb,
            KeySchema: [
                {AttributeName: "appointmentId", KeyType: "HASH"},
                {AttributeName: "appointmentDateTime", KeyType: "RANGE"},

            ],
            AttributeDefinitions: [
                {AttributeName: "appointmentId", AttributeType: "S"},
                {AttributeName: "appointmentDateTime", AttributeType: "S" }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: readCapacity || 1,
                WriteCapacityUnits: writeCapacity || 1        }
        };

        dynamoDb.createTable(params, function(err, data) {
            if (err){
                console.log(JSON.stringify(err, null, 2));
                callback(err, null);
            }	else {
                console.log(JSON.stringify(data, null, 2));
                callback(null,data);
            }});
    }

    //crearea tabelei Provider
    function createProviderTable(suffix, callback, readCapacity, writeCapacity) {

        var dynamoDb = getDb();
        if (suffix) suffix = suffix + "_";
        var tb = suffix + 'Provider';

        var params = {
            TableName:tb,
            KeySchema: [
                {AttributeName: "email", KeyType: "HASH"}

            ],
            AttributeDefinitions: [
                {AttributeName: "email", AttributeType: "S"}
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: readCapacity || 1,
                WriteCapacityUnits: writeCapacity || 1        }
        };

        dynamoDb.createTable(params, function(err, data) {
            if (err){
                console.log(JSON.stringify(err, null, 2));
                callback(err, null);
            }	else {
                console.log(JSON.stringify(data, null, 2));
                callback(null,data);
            }});
    }

    //crearea tabelei Slot
    function createSlotTable(suffix, callback, readCapacity, writeCapacity) {

        var dynamoDb = getDb();
        if (suffix) suffix = suffix + "_";
        var tb = suffix + 'Slot';

        var params = {
            TableName:tb,
            KeySchema: [
                {AttributeName: "slotDateTime", KeyType: "HASH"},
                {AttributeName: "providerId", KeyType: "RANGE"},

            ],
            AttributeDefinitions: [
                {AttributeName: "slotDateTime", AttributeType: "N"},
                {AttributeName: "providerId", AttributeType: "S" }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: readCapacity || 1,
                WriteCapacityUnits: writeCapacity || 1        }
        };

        dynamoDb.createTable(params, function(err, data) {
            if (err){
                console.log(JSON.stringify(err, null, 2));
                callback(err, null);
            }	else {
                console.log(JSON.stringify(data, null, 2));
                callback(null,data);
            }});
    }


    //crearea tabelei User
    function createUserTable(suffix, callback, readCapacity, writeCapacity) {

        var dynamoDb = getDb();
        if (suffix) suffix = suffix + "_";
        var tb = suffix + 'User';

        var params = {
            TableName:tb,
            KeySchema: [
                {AttributeName: "email", KeyType: "HASH"}

            ],
            AttributeDefinitions: [
                {AttributeName: "email", AttributeType: "S"}

            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: readCapacity || 1,
                WriteCapacityUnits: writeCapacity || 1        }
        };

        dynamoDb.createTable(params, function(err, data) {
            if (err){
                console.log(JSON.stringify(err, null, 2));
                callback(err, null);
            }	else {
                console.log(JSON.stringify(data, null, 2));
                callback(null,data);
            }});
    }


    function createUserDetailsTable(suffix, callback, readCapacity, writeCapacity) {

        var dynamoDb = getDb();
        if (suffix) suffix = suffix + "_";
        var tb = suffix + 'UserDetails';

        var params = {
            TableName:tb,
            KeySchema: [
                {AttributeName: "email", KeyType: "HASH"}

            ],
            AttributeDefinitions: [
                {AttributeName: "email", AttributeType: "S"}

            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: readCapacity || 1,
                WriteCapacityUnits: writeCapacity || 1        }
        };

        dynamoDb.createTable(params, function(err, data) {
            if (err){
                console.log(JSON.stringify(err, null, 2));
                callback(err, null);
            }	else {
                console.log(JSON.stringify(data, null, 2));
                callback(null,data);
            }});
    }

    function createVitalSignTable(suffix, callback, readCapacity, writeCapacity) {

        var dynamoDb = getDb();
        if (suffix) suffix = suffix + "_";
        var tb = suffix + 'VitalSign';

        var params = {
            TableName:tb,
            KeySchema: [
                {AttributeName: "vitalSignId", KeyType: "HASH"},
                {AttributeName: "createdDateTime", KeyType: "RANGE"},

            ],
            AttributeDefinitions: [
                {AttributeName: "vitalSignId", AttributeType: "S"},
                {AttributeName: "createdDateTime", AttributeType: "S" }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: readCapacity || 1,
                WriteCapacityUnits: writeCapacity || 1        }
        };

        dynamoDb.createTable(params, function(err, data) {
            if (err){
                console.log(JSON.stringify(err, null, 2));
                callback(err, null);
            }	else {
                console.log(JSON.stringify(data, null, 2));
                callback(null,data);
            }});
    }

    module.exports={
        createAlarmTable:createAlarmTable,
        createAppointmentFeedbackTable:createAppointmentFeedbackTable,
        createDeviceModelTable:createDeviceModelTable,
        createEventTable:createEventTable,
        createOrderTable:createOrderTable,
        createPatientAppointmentTable:createPatientAppointmentTable,
        createProviderTable:createProviderTable,
        createSlotTable:createSlotTable,
        createUserTable:createUserTable,
        createUserDetailsTable:createUserDetailsTable,
        createVitalSignTable:createVitalSignTable,
        deleteTable:deleteTable,
        checkExistsTable:checkExistsTable,
    };


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