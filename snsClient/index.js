/**
 * Created by Victor on 12/12/2015.
 */

(function() {
    var userDetailsRepository = require('../repositories/usersDetailsRepository');
    var moment = require('moment');
    var AWS             = require('aws-sdk');
    var snsClient       = new AWS.SNS({apiVersion: '2010-03-31',
        endpoint:"https://sns.eu-west-1.amazonaws.com",
        accessKeyId:"AKIAJURYPOXFRG4ITPQA",
        secretAccessKey:"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",
        sslEnabled:true
    });

    function sendAppointmentEmail(toUser, slotDateTimeEpoch, callback) {
        userDetailsRepository.findOneByEmail(toUser, function (err, data) {
            var slotDateTime = new Date();
            slotDateTime.setTime(slotDateTimeEpoch);
            var momentSlotDateTime = moment(slotDateTime);
            var content = "Dear " + data.title + " " + data.firstname + " " + data.surname + ", " +
                        "this is confirmation of your appointment at " + momentSlotDateTime.format('hh:mmA')+
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
                snsClient.publish(params, function(err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    else     console.log(data);           // successful response
                });
            }
        });
    }

    module.exports = {sendAppointmentEmail: sendAppointmentEmail};
})();