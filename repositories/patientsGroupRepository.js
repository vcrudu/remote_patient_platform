(function() {
    var _ = require("underscore");
    var AWS = require('aws-sdk');
    var connectionOptions = require('./awsOptions');

    var getDbLocal = function () {

        var dynamodb = new AWS.DynamoDB(connectionOptions);
        return dynamodb;
    };
    module.exports =

    {

        createTable: function (tablename, callback) {

            var params = {

                TableName: tablename,

                KeySchema: [
                    {AttributeName: "providerId", KeyType: "HASH"},
                    {AttributeName: "groupName", KeyType: "RANGE"}
                ],

                AttributeDefinitions: [
                    {AttributeName: "providerId", AttributeType: "S"},
                    {AttributeName: "groupName", AttributeType: "S"}
                ],

                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5
                }
            };

            this.dynamoDb.createTable(params, function (err, data) {

                if (err) {
                    callback(err, null);
                }

                if (data) {
                    callback(null, data);
                }
            });
        },

        getOne: function (patientsGroup, callback) {

            if (!this.dynamoDb) {
                this.dynamoDb = getDbLocal();
            }

            var mapPatientsGroupFromDbEntity = function (dbEntity) {
                var patientsGroup = {};

                patientsGroup.providerId = dbEntity.providerId.S;
                patientsGroup.groupName = dbEntity.groupName.S;

                return patientsGroup;
            };

            var params = {

                TableName: "PatientsGroup",

                Key: {
                    "providerId": {S: patientsGroup.providerId},
                    "groupName": {S: patientsGroup.groupName}
                },
            };

            this.dynamoDb.getItem(params, function (err, data) {

                if (err) {

                    callback(err, null);
                    return;
                }

                if (data.Item) {
                    var mappedPatientsGroupObject = mapPatientsGroupFromDbEntity(data.Item);

                    callback(null, mappedPatientsGroupObject);

                } else {
                    callback(null, null);
                }
            });
        },

        getList: function (byProviderId, callback) {

            if (!this.dynamoDb) {
                this.dynamoDb = getDbLocal();
            }

            var mapPatientsGroupFromDbEntity = function (dbEntity) {
                var patientsGroup = {};

                patientsGroup.providerId = dbEntity.providerId.S;
                patientsGroup.groupName = dbEntity.groupName.S;

                return patientsGroup;

            };


            var params = {

                TableName: "PatientsGroup",

                KeyConditionExpression: 'providerId=:providerId',

                ExpressionAttributeValues: {
                    ":providerId": {S: byProviderId.providerId}
                },
            };
            this.dynamoDb.query(params, function (err, data) {

                if (err) {
                    callback(err, null);
                    return;
                }

                var listOfPatientsGroup = [];
                if (data.Items) {
                    _.forEach(data.Items, function (item) {
                        var patientsGroupItem = mapPatientsGroupFromDbEntity(item);
                        listOfPatientsGroup.push(patientsGroupItem);
                    });
                    callback(null, listOfPatientsGroup);
                } else {
                    callback(null, null);
                }

            });
        },

        save: function (patientsGroup, callback) {

            if (!this.dynamoDb) {
                this.dynamoDb = getDbLocal();
            }

            var mapPatientsGroupToDbEntity = function (patientGroupItem) {
                var mappedPatientsGroup = {};

                mappedPatientsGroup.providerId = {S: patientGroupItem.providerId};
                mappedPatientsGroup.groupName = {S: patientGroupItem.groupName};
                return mappedPatientsGroup;

            }
            var params = {

                TableName: "PatientsGroup",
                Item: mapPatientsGroupToDbEntity(patientsGroup)
            };
            this.dynamoDb.putItem(params, function (err, data) {

                if (err) {
                    callback(err, null);
                    return;
                }

                if (data) {
                    callback(null, data)
                }
            });
        },

        delete: function (patientsGroup, callback) {

            if (!this.dynamoDb) {
                this.dynamoDb = getDbLocal();
            }

            var params = {

                TableName: "PatientsGroup",

                Key: {
                    "providerId": {S: patientsGroup.providerId},
                    "groupName": {S: patientsGroup.groupName}
                }
            };

            this.dynamoDb.deleteItem(params, function (err, data) {

                if (err) {
                    callback(err, null);
                    return;
                }

                callback(null, data);
            });
        },

        deleteTable: function (name, callback) {

            if (!this.dynamoDb) {
                this.dynamoDb = getDbLocal();
            }
            var params = {

                TableName: name
            };

            this.dynamoDb.deleteTable(params, function (err, data) {

                if (err) {
                    callback(err, null);
                } else {
                    callback(null, data)
                }
            });
        },

        checkExistsTable: function (tableName, callback) {

            var params = {

                TableName: tableName
            };

            this.dynamoDb.describeTable(params, function (err, data) {

                if (err) {
                    callback(err, null);
                }

                if (data) {
                    callback(null, true);
                }
            });
        },

        setDependencies: function (dynamoDb) {

            this.dynamoDb = dynamoDb
        }
    };
})();
