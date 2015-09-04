/**
 * Created by Victor on 13/08/2015.
 */

(function(){

    var AWS                 = require('aws-sdk');
    //var UserFactory         = require('../model').UserFactory;
    var connectionOptions   = require('./awsOptions');
    var hpMapper            = require('./healthProfessionalDbMapper');
    var _                   = require('underscore');
    var TABLE_NAME          = 'HealthProfessional';

    var getDb = function(){
        return new AWS.DynamoDB(connectionOptions);
    };

    module.exports = {

        getAll : function(callback){
            var dynamodb = getDb();

            var params = {
                TableName: TABLE_NAME,
                ReturnConsumedCapacity: 'TOTAL'

            };

            dynamodb.scan(params,function(err, data){
                if(err){
                    console.error(err);
                    callback(err, null);
                    return;
                }
                var dbCollection = data.Items;

                var dbData = [];
                _.forEach(dbCollection, function(dbModel){
                    dbData.push(hpMapper.mapFromDbEntity(dbModel));
                });
                console.log("The " + TABLE_NAME + " data has been retrieved successfully.");

                callback(null, dbData);
            });
        },

        save : function(obj, callback){
            var dynamodb = getDb();

            var params = {
                Item: hpMapper.mapToDbEntity(obj),
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

                console.log("The " + TABLE_NAME + " has been inserted successfully.");
                callback(null, data);
            });
        },

        delete : function(obj, callback){
            var dynamodb = getDb();

            var params = {
                Key: {
                    model: { S: obj.model}
                },
                TableName: TABLE_NAME
            };

            dynamodb.deleteItem(params, function(err, data) {
                if(err){
                    console.error(err);
                    callback(err, null);
                    return;
                }
                console.log("The " + TABLE_NAME +  " has been deleted successfully!");
                callback(null, data);
            });
        }
    };
})();