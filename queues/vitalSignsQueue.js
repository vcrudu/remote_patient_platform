/**
 * Created by Victor on 13/08/2015.
 */

/**
 * Created by Victor on 26/06/2015.
 */

(function(){

    var AWS             = require('aws-sdk');
    var eventsDbMapper     = require('./eventsDbMapper');
    var sqsOptions = require('./awsSQSOptions');
    var TABLE_NAME        = 'Event';

    var getSQSObject = function(){
        var sqs = new AWS.SQS(sqsOptions);
        return sqs;
    };

    module.exports = {
        sendVitalSignMessage : function(event){
            var params = {
                MessageBody: 'Test message', /* required */
                QueueUrl: sqsOptions.endpoint, /* required */
                DelaySeconds: 0,
                MessageAttributes: {
                    eventId: {
                        DataType: 'String', /* required */
                        StringValue: event.getEventId()
                    },
                }
            };
            var sqsObject = getSQSObject();

            sqsObject.sendMessage(params, function(err, data){
                if(err) {
                    console.error(err);
                    callback(err, null);
                    return;
                }
                console.log("The events has been retrieved successfully.");
                if(data.Item) {
                    var user = UserFactory.createUserFromDbEntity(data.Item);
                    callback(null, user);
                }else{
                    callback(null, null);
                }
            });
        },

        readVitalSignMessages : function(event, callback) {

            var sqsObject = getSQSObject();

            var params = {
                Item: eventsDbMapper.mapEventToDbEntity(),
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

                console.log("The user has been inserted successfully.");
                callback(null, data);
            });
        }
    };
})();