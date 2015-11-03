/**
 * Created by Victor on 26/06/2015.
 */

(function(){

    var AWS             = require('aws-sdk');
    var connectionOptions = require('./awsOptions');
    var TABLE_NAME        = 'Slot';
    var _ = require('underscore');

    function addMinutes(date, minutes) {
        var timeInMilliseconds = date.getTime();
        var minutesInMilliseconds = minutes * 60 * 1000;
        timeInMilliseconds = timeInMilliseconds + minutesInMilliseconds;
        var nextSlot = new Date(timeInMilliseconds);
        return nextSlot;
    }

    var Rx = require('rx');

       var getDb = function(){

       var dynamodb = new AWS.DynamoDB(connectionOptions);

       return dynamodb;

    };

    module.exports = {
        getProvidersForSlot:function(startTime, callback){
            var dynamodb = getDb();
            var filterExpression='attribute_not_exists (patientId)';
            var params = {
                KeyConditionExpression: '#slotDateTime=:slotDateTime AND ' +
                '#providerId>=:providerId',

                ExpressionAttributeNames: {
                    "#providerId": "providerId",
                    "#slotDateTime": "slotDateTime"
                },
                ExpressionAttributeValues: {
                    ":providerId": {"S": '0'},
                    ":slotDateTime": {"N": startTime.getTime().toString()}
                },
                TableName: connectionOptions.tablesSuffix + TABLE_NAME,
                Limit: 30
            };
            var dynamodb = getDb();

            dynamodb.query(params, function(err, data){
                if(err) {
                    console.error(err);
                    callback(err, null);
                    return;
                }
                console.log("The events has been retrieved successfully.");
                var results=[];
                if(data.Items) {
                    _.forEach(data.Items, function(item){
                        var time = parseInt(item.slotDateTime.N);
                        var slotDateTime = new Date();
                        slotDateTime.setTime(time);
                        results.push({providerId: item.providerId.S, slotDateTime: slotDateTime});
                    });
                    callback(null, results);
                }else{
                    callback(null, null);
                }
            });
        },
        getOne : function(startTime, callback) {
            var dynamodb = getDb();

            function tryOne(startTime, callback) {

                var filterExpression = '';
                var params;
                filterExpression = 'attribute_not_exists (patientId)';
                params = {
                    KeyConditionExpression: '#slotDateTime=:startTime',

                    ExpressionAttributeNames: {
                        "#slotDateTime": "slotDateTime"
                    },
                    ExpressionAttributeValues: {
                        ":startTime": {"N": startTime.getTime().toString()}
                    },
                    FilterExpression: filterExpression,
                    TableName:connectionOptions.tablesSuffix + TABLE_NAME,
                    Limit: 1
                };

                dynamodb.query(params, function (err, data) {
                    if (err) {
                        console.error(err);
                        callback(err, null);
                        return;
                    }
                    console.log("The slot has been retrieved successfully.");
                    var results = [];
                    if (data.Items&&data.Items.length>0) {
                        var time = parseInt(data.Items[0].slotDateTime.N);
                        var slotDateTime = new Date();
                        slotDateTime.setTime(time);
                        var slot = {
                            profiderId: data.Items[0].providerId.S,
                            slotDateTime: slotDateTime
                        };
                        callback(null, slot);
                    } else {
                        tryOne(addMinutes(startTime,15),callback);
                    }
                });
            }

            tryOne(startTime, callback);
        },

        updateSlot:function(patientId, providerId, dateTime, callback) {
            var dynamodb = getDb();

            var params = {
                Key: {
                    /* required */
                    slotDateTime: {N: dateTime.getTime().toString()},
                    providerId: {S: providerId}
                },
                TableName: connectionOptions.tablesSuffix + TABLE_NAME, /* required */
                ExpressionAttributeValues: {
                    ":patientId": {"S": patientId}
                },
                ConditionExpression:'attribute_not_exists(patientId)',
                    ReturnConsumedCapacity: 'TOTAL',
                ReturnValues: 'NONE',
                UpdateExpression: 'SET patientId=:patientId'
            };

            dynamodb.updateItem(params, function (err, data) {
                if (err) {
                    console.error(err);
                    callback(err, null);
                    return;
                }

                console.log("The slot has been updated successfully.");
                callback(null, data);
            });
        },
        getSlotsByProvider : function(providerId, startTime, callback){
            var filterExpression='';
            var params = {
                    KeyConditionExpression: '#providerId=:providerId AND ' +
                    '#slotDateTime>=:startTime',

                    ExpressionAttributeNames: {
                        "#providerId": "providerId",
                        "#slotDateTime": "slotDateTime"
                    },
                    ExpressionAttributeValues: {
                        ":providerId": {"S": providerId},
                        ":startTime": {"N": startTime.getTime().toString()}
                    },
                    IndexName:'providerId-slotDateTime-index',
                    TableName: connectionOptions.tablesSuffix + TABLE_NAME,
                    Limit: 700
                };
            var dynamodb = getDb();

            dynamodb.query(params, function(err, data){
                if(err) {
                    console.error(err);
                    callback(err, null);
                    return;
                }
                console.log("The events has been retrieved successfully.");
                var results=[];
                if(data.Items) {
                    _.forEach(data.Items, function(item){
                        var time = parseInt(item.slotDateTime.N);
                        var slotDateTime = new Date();
                        slotDateTime.setTime(time);
                        results.push({providerId: item.providerId.S, slotDateTime: slotDateTime});
                    });
                    callback(null, results);
                }else{
                    callback(null, null);
                }
            });
        },
        saveBatch : function(slots, providerId, callback) {
            var dynamodb = getDb();

            var slotsStatus = {slots:[],errorCount:0,successCount:0};

            var source = Rx.Observable.create(function(observer){
                _.forEach(slots, function(slot) {
                    var params = {
                        Item: {
                            providerId:{S:providerId},
                            slotDateTime:{N:slot.getTime().toString()}
                        },
                        TableName: connectionOptions.tablesSuffix + TABLE_NAME,
                        ReturnConsumedCapacity: 'TOTAL',
                        ReturnItemCollectionMetrics: 'SIZE',
                        ReturnValues: 'ALL_OLD'
                    };

                    dynamodb.putItem(params, function(err, data) {
                        if(err){
                            console.error(err);
                            slot.err=err;
                            slotsStatus.slots.push(slot);
                            slotsStatus.errorCount++;
                            //observer.onError(err);
                        }else{
                            slotsStatus.successCount++;
                            slotsStatus.slots.push(slot);
                            if(slotsStatus.slots.length===slots.length){
                                slotsStatus.slots=slots;
                                observer.onCompleted(slotsStatus);
                            }else {
                                observer.onNext(data);
                            }
                        }
                    });
                });
            });

            source.subscribe(function(data){

            },function(err){

            },function(data){
                callback(null, slotsStatus);
            });

        },
        deleteBatch : function(slots, providerId, callback) {
            var dynamodb = getDb();

            var slotsStatus = {slots:[],errorCount:0,successCount:0};

            var source = Rx.Observable.create(function(observer){
                _.forEach(slots, function(slot) {
                    var params = {
                        Key: {
                            providerId:{S:providerId},
                            slotDateTime:{N:slot.getTime().toString()}
                        },
                        TableName: connectionOptions.tablesSuffix + TABLE_NAME,
                        ReturnConsumedCapacity: 'TOTAL',
                        ReturnItemCollectionMetrics: 'SIZE',
                        ReturnValues: 'ALL_OLD'
                    };

                    dynamodb.deleteItem(params, function(err, data) {
                        if(err){
                            console.error(err);
                            slot.err=err;
                            slotsStatus.slots.push(slot);
                            slotsStatus.errorCount++;
                            //observer.onError(err);
                        }else{
                            slotsStatus.successCount++;
                            slotsStatus.slots.push(slot);
                            if(slotsStatus.slots.length===slots.length){
                                observer.onCompleted(slotsStatus);
                            }else {
                                observer.onNext(data);
                            }
                        }
                    });
                });
            });

            source.subscribe(function(data){

            },function(err){
            },function(data){
                callback(null, slotsStatus);
            });

        }
    };
})();


