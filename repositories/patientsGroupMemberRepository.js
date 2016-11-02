(function() {

  var AWS = require('aws-sdk');
  var connectionOptions = require('./awsOptions');
  var _ = require("underscore");
  var loggerProvider    = require('../logging');

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
          {AttributeName: "groupId", KeyType: "HASH"},
          {AttributeName: "patientId", KeyType: "RANGE"}
        ],

        AttributeDefinitions: [
          {AttributeName: "groupId", AttributeType: "S"},
          {AttributeName: "patientId", AttributeType: "S"}
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      };

      this.dynamoDb.createTable(params, function (err, data) {

        if (err) {
          callback(err, null);
        } else {
          callback(null, data);
        }
      });
    },

    getOne: function (byGroupIdAndPatientId, callback) {

      if (!this.dynamoDb) {
        this.dynamoDb = getDbLocal();
      }

      var mapPatientsGroupMemberFromDbEntity = function (dbEntity) {
        var patientsGroupMember = {};

        patientsGroupMember.groupId = dbEntity.groupId.S;
        patientsGroupMember.patientId = dbEntity.patientId.S;
        patientsGroupMember.createDateTime = dbEntity.createDateTime.N;
        patientsGroupMember.createdBy = dbEntity.createdBy.S;
        return patientsGroupMember;
      };

      var params = {

        TableName: "PatientsGroupMember",

        Key: {
          groupId: {S: byGroupIdAndPatientId.providerId + "#" + byGroupIdAndPatientId.groupName},
          patientId: {S: byGroupIdAndPatientId.patientId}
        }
      };

      this.dynamoDb.getItem(params, function (err, data) {

        if (err) {
          callback(err, null);
          return;
        }

        if (data.Item) {
          var mappedPatientsGroupMemberObject = mapPatientsGroupMemberFromDbEntity(data.Item);
          callback(null, mappedPatientsGroupMemberObject);
        } else {
          callback(true, null);
        }
      });
    },

    getByPatientId: function (patientId, callback) {

      if (!this.dynamoDb) {
        this.dynamoDb = getDbLocal();
      }

      var params = {
        KeyConditionExpression: '#patientId=:patientId AND ' +
        '#groupId>=:groupId',

        ExpressionAttributeNames: {
          "#patientId": "patientId",
          "#groupId": "groupId"
        },
        ExpressionAttributeValues: {
          ":patientId": {"S": patientId},
          ":groupId": {"S": String.fromCharCode(0)}
        },
        IndexName: 'patientId-groupId-index',
        TableName: 'PatientsGroupMember',
        Limit: 700
      };

      var mapPatientsGroupMemberFromDbEntity = function (dbEntity) {
        var patientsGroupMember = {};

        patientsGroupMember.groupId = dbEntity.groupId.S;
        patientsGroupMember.patientId = dbEntity.patientId.S;
        return patientsGroupMember;
      };

      this.dynamoDb.query(params, function (err, data) {
        if (err) {
          loggerProvider.getLogger().error(err);
          callback(err, null);
          return;
        }

        var dbMembers = data.Items;

        var resultMembers = [];

        _.forEach(dbMembers, function (dbMember) {
          var member = mapPatientsGroupMemberFromDbEntity(dbMember);
          resultMembers.push(member);
        });

        callback(null, resultMembers);
      });
    },

    getList: function (byGroupId, callback) {

      if (!this.dynamoDb) {
        this.dynamoDb = getDbLocal();
      }

      var mapPatientsGroupMemberFromDbEntity = function (dbEntity) {
        var patientsGroupMember = {};
        patientsGroupMember.groupId = dbEntity.groupId.S;
        patientsGroupMember.patientId = dbEntity.patientId.S;
        patientsGroupMember.createDateTime = dbEntity.createDateTime.N;
        patientsGroupMember.createdBy = dbEntity.createdBy.S;
        return patientsGroupMember;
      };

      var params = {

        TableName: "PatientsGroupMember",

        KeyConditionExpression: 'groupId=:groupId',

        ExpressionAttributeValues: {
          ":groupId": {S: byGroupId.providerId + "#" + byGroupId.groupName},
        }
      };

      this.dynamoDb.query(params, function (err, data) {

        if (err) {
          callback(err, null);
          return;
        }
        var listOfPatientsGroupMember = [];
        if (data.Items) {
          _.forEach(data.Items, function (item) {
            var patientsGroupMemberItem = mapPatientsGroupMemberFromDbEntity(item);
            listOfPatientsGroupMember.push(patientsGroupMemberItem);
          });
          callback(null, listOfPatientsGroupMember);
        } else {
          callback(null, null);
        }
      });
    },
    getListByGroupId: function (groupId, callback) {

      if (!this.dynamoDb) {
        this.dynamoDb = getDbLocal();
      }

      var mapPatientsGroupMemberFromDbEntity = function (dbEntity) {
        var patientsGroupMember = {};
        patientsGroupMember.groupId = dbEntity.groupId.S;
        patientsGroupMember.patientId = dbEntity.patientId.S;
        patientsGroupMember.createDateTime = dbEntity.createDateTime.N;
        patientsGroupMember.createdBy = dbEntity.createdBy.S;
        return patientsGroupMember;
      };

      var params = {

        TableName: "PatientsGroupMember",

        KeyConditionExpression: 'groupId=:groupId',

        ExpressionAttributeValues: {
          ":groupId": {S: groupId}
        }
      };

      this.dynamoDb.query(params, function (err, data) {

        if (err) {
          callback(err, null);
          return;
        }
        var listOfPatientsGroupMember = [];
        if (data.Items) {
          _.forEach(data.Items, function (item) {
            var patientsGroupMemberItem = mapPatientsGroupMemberFromDbEntity(item);
            listOfPatientsGroupMember.push(patientsGroupMemberItem);
          });
          callback(null, listOfPatientsGroupMember);
        } else {
          callback(null, null);
        }
      });
    },

    save: function (patientsGroupMember, callback) {

      if (!this.dynamoDb) {
        this.dynamoDb = getDbLocal();
      }
      var mapPatientsGroupMemberToDbEntity = function (patientGroupItem) {
        var mappedPatientsGroupMember = {};
        mappedPatientsGroupMember.groupId = {S: patientGroupItem.providerId + "#" + patientGroupItem.groupName};
        mappedPatientsGroupMember.patientId = {S: patientGroupItem.patientId};
        mappedPatientsGroupMember.createDateTime = {N: patientGroupItem.createDateTime.toString()};
        mappedPatientsGroupMember.createdBy = {S: patientGroupItem.createdBy};
        return mappedPatientsGroupMember;
      }

      var params = {

        TableName: "PatientsGroupMember",
        Item: mapPatientsGroupMemberToDbEntity(patientsGroupMember)
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

    delete: function (byGroupIdAndPatientId, callback) {

      if (!this.dynamoDb) {
        this.dynamoDb = getDbLocal();
      }

      var params = {

        TableName: "PatientsGroupMember",

        Key: {
          groupId: {S: byGroupIdAndPatientId.providerId + "#" + byGroupIdAndPatientId.groupName},
          patientId: {S: byGroupIdAndPatientId.patientId}
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
          callback(err, false);
        } else {
          callback(null, true)
        }
      });
    },

    checkExistsTable: function (tableName, callback) {

      var params = {

        TableName: tableName /* required */
      };

      this.dynamoDb.describeTable(params, function (err, data) {

        if (err) {
          if (err.code == 'ResourceNotFoundException') {
            callback(null, false);
          }
          callback(err);
        } else {
          callback(null, true, data);
        }
      });
    },

    setDependencies: function (dynamoDb) {

      this.dynamoDb = dynamoDb
    }

  };
})();
