/**
 * Created by Victor on 13/08/2015.
 */

(function(){

    var AWS                 = require('aws-sdk');
    //var UserFactory         = require('../model').UserFactory;
    var connectionOptions   = require('./awsOptions');
    var providerDbMapper            = require('./providerDbMapper');
    var _                   = require('underscore');
    var TABLE_NAME          = 'Provider';

    var loggerProvider = require('../logging');

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
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }
                var dbCollection = data.Items;

                var dbData = [];
                _.forEach(dbCollection, function(dbModel){
                    dbData.push(providerDbMapper.mapFromDbEntity(dbModel));
                });
                loggerProvider.getLogger().debug("The " + TABLE_NAME + " data has been retrieved successfully.");

                callback(null, dbData);
            });
        },

        save : function(obj, callback){
            var dynamodb = getDb();

            var params = {
                Item:providerDbMapper.mapToDbEntity(obj),
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
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }
                loggerProvider.getLogger().debug("The " + TABLE_NAME +  " has been deleted successfully!");
                callback(null, data);
            });
        }
    };
})();