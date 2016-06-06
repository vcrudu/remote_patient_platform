/**
 * Created by Victor on 12/12/2015.
 */

(function() {
    var userRepository = require('../repositories/usersRepository');
    var usersDetailsRepository = require('../repositories/usersDetailsRepository');
    var moment = require('moment');
    var AWS = require('aws-sdk');
    var applicationArn = 'arn:aws:sns:eu-west-1:160466482332:app/GCM/trichrome_health_monitor';
    var snsClient = new AWS.SNS({
        apiVersion: '2010-03-31',
        endpoint: "https://sns.eu-west-1.amazonaws.com",
        accessKeyId: "AKIAJURYPOXFRG4ITPQA",
        secretAccessKey: "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",
        sslEnabled: true
    });
    var util = require('util');

    function sendAppointmentEmail(toUser, slotDateTimeEpoch, callback) {
        userRepository.findOneByEmail(toUser, function (err, data) {
            var slotDateTime = new Date();
            slotDateTime.setTime(slotDateTimeEpoch);
            var momentSlotDateTime = moment(slotDateTime);
            var content = "Dear " + data.title + " " + data.firstname + " " + data.surname + ", " +
                "this is confirmation of your appointment at " + momentSlotDateTime.format('hh:mmA') +
                ' on ' + momentSlotDateTime.format('dddd, DD of MMM') + '. ' +
                '\nPlease be online at the specified time.' +
                '\nKind regards,' +
                '\nThrichrome Healthcare.';

            if (!err) {

                var params = {
                    Message: content, /* required */
                    MessageAttributes: {
                        someKey: {
                            DataType: 'String' /* required */

                        }
                    },
                    Subject: 'Trichrome appointment',
                    TargetArn: 'arn:aws:sns:eu-west-1:160466482332:Trichrome',
                    TopicArn: 'arn:aws:sns:eu-west-1:160466482332:Trichrome'
                };
                snsClient.publish(params, function (err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    else     console.log(data);           // successful response
                });
            }
        });
    }

    function sendInitStateMchineEvent(userId, callback) {
        var params = {
            Message: JSON.stringify({
                userId: userId,
                eventName: "initStateMachine"
            }), /* required */
            MessageAttributes: {
                userId: {
                    DataType: 'String',
                    StringValue: userId /* required */
                }
            },
            TopicArn: 'arn:aws:sns:eu-west-1:160466482332:hcm-registration'
        };
        snsClient.publish(params, function (err, data) {
            if(callback)
            callback(err, data);        // successful response
        });
    }

    function registerWithSNS(token, callback) {

        var params = {
            PlatformApplicationArn: applicationArn,
            Token: token
        };
        snsClient.createPlatformEndpoint(params, function (err, data) {
            if (err) {
                console.log(err, err.stack);
                callback(err);
            }
            else {
                util.inspect(data, true, 2);
                callback(null, data.EndpointArn);
            }
        });
    }

    function getSnsEndpointAttributes(endpointArn, callback) {

        var params = {
            EndpointArn: endpointArn /* required */
        };

        snsClient.getEndpointAttributes(params, function (err, data) {
            if (err) {
                console.log(err, err.stack);
                callback(err);
            }
            else {
                if (data) {
                    callback(null, {
                        endpointArn: endpointArn,
                        token: data.Token,
                        enabled: data.Enabled
                    });
                } else callback(null, null);
            }
        });
    }

    function setSnsEndpointAttributes(endpointArn, token, callback) {

        var params = {
            Attributes: {
                Enabled: 'true',
                Token: token
            },
            EndpointArn: endpointArn
        };

        snsClient.setEndpointAttributes(params, function (err) {
            if (err) {
                console.log(err, err.stack);
                callback(err);
            }
            else {
                callback();
            }
        });
    }


    module.exports = {
        sendAppointmentEmail: sendAppointmentEmail,
        registerWithSNS: registerWithSNS,
        getSnsEndpointAttributes:getSnsEndpointAttributes,
        setSnsEndpointAttributes:setSnsEndpointAttributes,
        sendInitStateMchineEvent:sendInitStateMchineEvent
    };
})();