/**
 * Created by Victor on 12/12/2015.
 */

(function() {
    var userRepository = require('../repositories/usersRepository');
    var usersDetailsRepository = require('../repositories/usersDetailsRepository');
    var moment = require('moment');
    var AWS = require('aws-sdk');
    var patientApplicationArn = 'arn:aws:sns:eu-west-1:160466482332:app/GCM/trichrome_health_monitor';
    var providerApplicationArn = 'arn:aws:sns:eu-west-1:160466482332:app/GCM/trichrome_provider';
    var logging = require('../logging');
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
                name: "initStateMachine",
                payload: {
                    userId: userId
                }
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
            if (err) {
                logging.getLogger().error(err);
            }
            if (callback)
                callback(err, data);        // successful response
        });
    }

    function sendOnProvideDetailsEvent(userId, callback) {
        var params = {
            Message: JSON.stringify({
                name: "OnProvideDetails",
                payload: {
                    userId: userId
                }
            }),
            TopicArn: 'arn:aws:sns:eu-west-1:160466482332:hcm-registration'
        };
        snsClient.publish(params, function (err, data) {
            if(err){
                logging.getLogger().error(err);
            }
            if (callback)
                callback(err, data);        // successful response
        });
    }


    function sendOnAppointmentBookingEvent(userId, appointmentDetails, callback) {
        var eventPayload =
        {
            userId: userId,
            providerId: appointmentDetails.providerId,
            providerTitle: appointmentDetails.providerTitle,
            providerFullName: appointmentDetails.providerFullName,
            providerType: appointmentDetails.providerType,
            appointmentDateTime: appointmentDetails.appointmentDateTime
        };

        var params = {
            Message: JSON.stringify({
                name: "OnAppointmentBooking",
                payload: eventPayload
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
            if (err) {
                logging.getLogger().error(err);
            }
            if (callback)
                callback(err, data);        // successful response
        });
    }

    function onPatientInvitedToGroupEvent(patientId, providerId, groupName, callback) {
        var eventPayload =
        {
            userId: patientId,
            providerId: providerId,
            groupName: groupName
        };

        var params = {
            Message: JSON.stringify({
                name: "onPatientInvitedToGroup",
                payload: eventPayload
            }), /* required */
            MessageAttributes: {
                userId: {
                    DataType: 'String',
                    StringValue: patientId /* required */
                },
                providerId: {
                    DataType: 'String',
                    StringValue: providerId /* required */
                },
                groupName: {
                    DataType: 'String',
                    StringValue: groupName /* required */
                }
            },
            TopicArn: 'arn:aws:sns:eu-west-1:160466482332:hcm-registration'
        };
        snsClient.publish(params, function (err, data) {
            if (err) {
                logging.getLogger().error(err);
            }
            if (callback)
                callback(err, data);        // successful response
        });
    }


    function sendOnDevicesOrderingEvent(userId, orderDetails, callback) {
        var eventPayload = {
            userId:userId
        };
        var params = {
            Message: JSON.stringify({
                name: "OnDevicesOrdering",
                payload: eventPayload
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
            if (err) {
                logging.getLogger().error(err);
            }
            if (callback)
                callback(err, data);        // successful response
        });
    }

    function sendOnDevicesDispatchingEvent(userId, order, callback) {
        var eventPayload = {
            userId:userId
        };
        var params = {
            Message: JSON.stringify({
                name: "OnDevicesDispatching",
                payload: eventPayload
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
            if(err){
                logging.getLogger().error(err);
            }
            if (callback)
                callback(err, data);        // successful response
        });
    }

    function sendOnDevicesDeliveringEvent(userId, order, callback) {
        var description = order.getDescription();
        var orderItems = order.getOrderItems();
        var eventPayload = {
            userId: userId,
            orderDetails: {
                description: description,
                orderItems: orderItems
            }
        };
        var params = {
            Message: JSON.stringify({
                name: "OnDevicesDelivering",
                payload: eventPayload
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
            if(err){
                logging.getLogger().error(err);
            }
            if (callback)
                callback(err, data);        // successful response
        });
    }

    function sendOnDevicesInstalledEvent(userId, devicesInstallingDetails, callback) {
        var eventPayload = {
            userId: userId,
            devicesInstallingDetails: devicesInstallingDetails
        };
        var params = {
            Message: JSON.stringify({
                name: "OnDevicesInstalled",
                payload: eventPayload
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
            if(err){
                logging.getLogger().error(err);
            }
            if (callback)
                callback(err, data);        // successful response
        });
    }

    function sendOnMeasurementReceivedEvent(userId, measurementDetails, callback) {
        var eventPayload = {
            userId: userId,
            measurementDetails: measurementDetails
        };
        var params = {
            Message: JSON.stringify({
                name: "OnMeasurementReceived",
                payload: eventPayload
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
            if(err){
                logging.getLogger().error(err);
            }
            if (callback)
                callback(err, data);        // successful response
        });
    }

    function sendOnAlarmEvent(userId, alarmDetails, measurement, callback) {
        var eventPayload = {
            userId: userId,
            alarmDetails: alarmDetails,
            alarmMeasurement: measurement
        };

        var params = {
            Message: JSON.stringify({
                name: "OnAlarm",
                payload: eventPayload
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
            if(err){
                logging.getLogger().error(err);
            }
            if (callback)
                callback(err, data);        // successful response
        });
    }

    function registerWithSNS(token, userType, callback) {

        var params = {
            PlatformApplicationArn: userType === 'patient' ? patientApplicationArn : providerApplicationArn,
            Token: token
        };
        snsClient.createPlatformEndpoint(params, function (err, data) {
            if (err) {
                callback(err);
            }
            else {
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
        getSnsEndpointAttributes: getSnsEndpointAttributes,
        onPatientInvitedToGroupEvent:onPatientInvitedToGroupEvent,
        setSnsEndpointAttributes: setSnsEndpointAttributes,
        sendInitStateMchineEvent: sendInitStateMchineEvent,
        sendOnProvideDetailsEvent: sendOnProvideDetailsEvent,
        sendOnAppointmentBookingEvent: sendOnAppointmentBookingEvent,
        sendOnDevicesOrderingEvent: sendOnDevicesOrderingEvent,
        sendOnDevicesDispatchingEvent: sendOnDevicesDispatchingEvent,
        sendOnDevicesDeliveringEvent: sendOnDevicesDeliveringEvent,
        sendOnDevicesInstalledEvent: sendOnDevicesInstalledEvent,
        sendOnMeasurementReceivedEvent: sendOnMeasurementReceivedEvent,
        sendOnAlarmEvent: sendOnAlarmEvent
    };
})();