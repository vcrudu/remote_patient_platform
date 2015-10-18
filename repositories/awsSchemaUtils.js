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

    function checkExistsTable(tableName, callback){
        var dynamoDb = getDb();

        var params = {
            TableName: tableName /* required */
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
        },*/

        checkExistsTable: checkExistsTable,
        createUserTable: createUserTable,
        createSlotTable: createSlotTable,
        deleteTable: deleteTable
    };
})();