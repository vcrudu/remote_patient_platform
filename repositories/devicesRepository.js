/**
 * Created by Victor on 26/06/2015.
 */

(function(){

    var AWS             = require('aws-sdk');
    var UserFactory     = require('../model').UserFactory;
    var connectionOptions = require('./awsOptions');
    var deviceModelDbMapper = require('./deviceModelDbMapper');
    var _ = require('underscore');
    var TABLE_NAME = 'DeviceModel';

       var getDb = function(){

       var dynamodb = new AWS.DynamoDB(connectionOptions);

       return dynamodb;

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
                var dbDeviceModels = data.Items;

                var resultDeviceModels = [];
                _.forEach(dbDeviceModels, function(deviceModel){
                    resultDeviceModels.push(deviceModelDbMapper.mapDeviceModelFromDbEntity(deviceModel));
                });
                console.log("The device model has been retrieved successfully.");

                callback(null, resultDeviceModels);
            });
        },

        save : function(device, callback){
            var dynamodb = getDb();

            var params = {
                Item: deviceModelDbMapper.mapDbEntityFromDeviceModel(device),
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

                console.log("The device model has been inserted successfully.");
                callback(null, data);
            });
        },

        delete : function(device, callback){
            var dynamodb = getDb();

            var params = {
                Key: {
                    model: { S: device.model}
                },
                TableName: TABLE_NAME
            };

            dynamodb.deleteItem(params, function(err, data) {
                if(err){
                    console.error(err);
                    callback(err, null);
                    return;
                }

                console.log("The device model has been deleted successfully!");
                callback(null, data);
            });
        }

    };
})();