/**
 * Created by Victor on 26/06/2015.
 */

(function(){

    var loggerProvider     = require('../logging');
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
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }
                var dbDeviceModels = data.Items;

                var resultDeviceModels = [];
                _.forEach(dbDeviceModels, function(deviceModel){
                    resultDeviceModels.push(deviceModelDbMapper.mapDeviceModelFromDbEntity(deviceModel));
                });
                loggerProvider.getLogger().debug("The device model has been retrieved successfully.");

                callback(null, resultDeviceModels);
            });
        },
        getOne : function(model, callback){
            var dynamodb = getDb();

            var params = {
                Key: { model: { S: model }},
                TableName:TABLE_NAME,
                ReturnConsumedCapacity: 'TOTAL'
            };

            dynamodb.getItem(params, function(err, data){
                if(err) {
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }

                loggerProvider.getLogger().trace(model + "device has been retrieved successfully!");

                if(data.Item) {
                    var deviceModel = deviceModelDbMapper.mapDeviceModelFromDbEntity(data.Item);
                    callback(null, deviceModel);
                }else{
                    callback(null, null);
                }
            });
        },
        save : function(device, callback){
            var dynamodb = getDb();

            var params = {
                Item: deviceModelDbMapper.mapDeviceModelToDbEntity(device),
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

                loggerProvider.getLogger().debug("The device model has been inserted successfully.");
                callback(null, data);
            });
        },

        update : function(device, callback){
            var dynamodb = getDb();

            var params = {
                Key: { /* required */
                    model: { S: device.model}
                },
                TableName: TABLE_NAME, /* required */
                ExpressionAttributeValues: {
                    ":description":{"S":device.description},
                    ":price":{"N":device.price.toString()},
                    ":manufacturerUrl":{"S":device.manufacturerUrl},
                    ":deviceModelType":{"S":device.deviceModelType},
                    ":imagesUrls":{"SS":device.getImagesUrls},
                    ":specifications":{"SS":device.getDeviceModelSpecifications()}
                },
                ReturnConsumedCapacity: 'TOTAL',
                ReturnValues: 'NONE',
                UpdateExpression: 'SET description=:description, ' +
                'price=:price, manufactureUrl=:manufactureUrl, ' +
                'deviceModelType=:deviceModelType, ' +
                'imagesUrls=:imagesUrls, specifications=:specifications'
            };

            dynamodb.updateItem(params, function(err, data) {
                if(err){
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }

                loggerProvider.getLogger().debug("The device model has been updated successfully.");
                callback(null, data);
            });
        },

        delete : function(deviceId, callback){
            var dynamodb = getDb();

            var params = {
                Key: {
                    model: { S: deviceId}
                },
                TableName: TABLE_NAME
            };

            dynamodb.deleteItem(params, function(err, data) {
                if(err){
                    loggerProvider.getLogger().error(err);
                    callback(err, null);
                    return;
                }

                loggerProvider.getLogger().log("The device model has been deleted successfully!");
                callback(null, data);
            });
        }
    };
})();