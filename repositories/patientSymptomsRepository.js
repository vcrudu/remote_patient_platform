/**
 * Created by Victor on 7/7/2016.
 */

(function(){

    var AWS                 = require('aws-sdk');
    var connectionOptions   = require('./awsOptions');
    var patientSymptomsDbMapper            = require('./patientSymptomsDbMapper');
    var _                   = require('underscore');
    var TABLE_NAME          = 'PatientSymptoms';

    var loggerProvider = require('../logging');

    var getDb = function(){
        return new AWS.DynamoDB(connectionOptions);
    };

    module.exports = {
        save : function(obj, callback){
            var dynamodb = getDb();

            var params = {
                Item: patientSymptomsDbMapper.mapToDbEntity(obj),
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

                loggerProvider.getLogger().debug("The " + TABLE_NAME + " has been inserted successfully.");
                callback(null, obj);
            });
        },
        getLastEvidence: function(patientId, callback) {
            var params = {
                TableName: TABLE_NAME, /* required */
                ExpressionAttributeValues: {
                    ":patientId":{"S":patientId}
                },
                ReturnConsumedCapacity: 'INDEXES',
                KeyConditionExpression: 'patientId = :patientId',
                ScanIndexForward: false,
                Limit: 1
            };

            var dynamodb = getDb();

            dynamodb.query(params, function(err, data){
                if(err) {
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }
                if(data.Items.length>0) {
                    callback(null, patientSymptomsDbMapper.mapFromDbEntity(data.Items[0]));
                }else{
                    callback(null, null);
                }
            });
        }
    };
})();