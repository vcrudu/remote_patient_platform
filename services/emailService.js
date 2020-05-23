/**
  Created by Vladcod on 06.01.2016.
 **/

(function() {

    var AWS = require('aws-sdk');
    var jwt = require("jsonwebtoken");
    var ses = new AWS.SES({
        accessKeyId: 'AKIAIPWSWF2LW7TKO7TA',
        secretAccessKey: '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',
        region: 'eu-west-1',
        apiVersion: '2010-12-01',
    });
    var s3Client = new AWS.S3({
        apiVersion: '2006-03-01',
        endpoint: "s3-eu-west-1.amazonaws.com",
        accessKeyId: "AKIAJHYGK2RWWUKI5UTA",
        secretAccessKey: "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",
        sslEnabled: true
    });

    var userDetailsRepository = require('../repositories').UsersDetails;
    var providersRepository = require('../repositories').Providers; 
    // this must relate to a verified SES account
    var from = 'noreply@trichromehealth.com';
    var url = 'https://loclahost/#/reset-password?token=';
    var patientActivateLink = 'https://loclahost/#/activate?token=';


    function sendPatientSubscriptionConfirmation(userId, callback) {
        var userToken = jwt.sign({email:userId}, process.env.JWT_SECRET);
        userDetailsRepository.findOneByEmail(userId, function (err, data) {
            var title = data.title;
            var name = data.firstname;
            var surname = data.surname;
            var link = patientActivateLink + userToken;
            /*-----trimite email-----*/
            var s3params = {
                Bucket: 'trichrome', /* required */
                Key: 'private/email/templates/confirmSubscription.html'
            };
            s3Client.getObject(s3params, function (err, data) {

                var s3Content = data.Body.toString();


                var titleMsg = s3Content.replace("{{title}}", title);
                var nameMsg = titleMsg.replace("{{name}}", name);
                var linkMsg = nameMsg.replace("{{confirmLink}}", link);
                var allMessage = linkMsg.replace("{{surname}}", surname);
                var params = {
                    Source: from,
                    Destination: {ToAddresses: [userId, 'admin@trichromehealth.com']},
                    Message: {
                        Subject: {
                            Data: 'A Message from trichromehealth'
                        },
                        Body: {
                            Text: {
                                Data: 'Subscription confirmation'
                            },
                            Html: {
                                Data: allMessage
                            }
                        }
                    }
                };
                ses.sendEmail(params, function (err, data) {
                    if (err) {
                        console.log(err, err.stack); // an error occurred
                        callback(err, null);

                    } else {
                        console.log(data);// successful response
                        callback(null, data);
                    }

                });
            });
        });
    }

    function sendProviderSubscriptionConfirmation(userId, callback) {
        var userToken = jwt.sign({email:userId}, process.env.JWT_SECRET);
        providersRepository.getOne(userId, function (err, data) {
            var title = data.title;
            var name = data.name;
            var surname = data.surname;
            var link = patientActivateLink + userToken;
            /*-----trimite email-----*/
            var s3params = {
                Bucket: 'trichrome', /* required */
                Key: 'private/email/templates/confirmSubscription.html'
            };

            s3Client.getObject(s3params, function (err, data) {

                var s3Content = data.Body.toString();


                var titleMsg = s3Content.replace("{{title}}", title);
                var nameMsg = titleMsg.replace("{{name}}", name);
                var linkMsg = nameMsg.replace("{{confirmLink}}", link);
                var allMessage = linkMsg.replace("{{surname}}", surname);
                var params = {
                    Source: from,
                    Destination: {ToAddresses: [userId, 'admin@trichromehealth.com']},
                    Message: {
                        Subject: {
                            Data: 'A Message from trichromehealth'
                        },
                        Body: {
                            Text: {
                                Data: 'Subscription confirmation'
                            },
                            Html: {
                                Data: allMessage
                            }
                        }
                    }
                };
                ses.sendEmail(params, function (err, data) {
                    if (err) {
                        console.log(err, err.stack); // an error occurred
                        callback(err, null);

                    } else {
                        console.log(data);// successful response
                        callback(null, data);
                    }

                });
            });
        });
    }

    function sendBookedAppointment(userId, params) {

    }

    function sendPasswordReset(user, callback) {
        var userToken = jwt.sign({email: user.email}, process.env.JWT_SECRET);

        var sendEmail = function (data, callback) {
            var link = url + userToken;
            var title = data.title;
            var name = data.firstname || data.name;
            var surname = data.surname;
            /*-----trimite email-----*/
            var s3params = {
                Bucket: 'trichrome', /* required */
                Key: 'private/email/templates/resetPassword.html'
            };
            s3Client.getObject(s3params, function (err, data) {

                var s3Content = data.Body.toString();


                var titleMsg = s3Content.replace("{{title}}", title);
                var nameMsg = titleMsg.replace("{{name}}", name);
                var linkMsg = nameMsg.replace("{{resetPasswordLink}}", link);
                var allMessage = linkMsg.replace("{{surname}}", surname);
                var params = {
                    Source: from,
                    Destination: {ToAddresses: [user.email]},
                    Message: {
                        Subject: {
                            Data: 'A Message from trichromehealth'
                        },
                        Body: {
                            Text: {
                                Data: 'Confirmation',
                            },
                            Html: {
                                Data: allMessage,
                            }
                        }
                    }
                }
                ses.sendEmail(params, function (err, data) {
                    if (err) {
                        console.log(err, err.stack); // an error occurred
                        callback(err, null);

                    } else {
                        console.log(data);// successful response
                        callback(null, data);
                    }

                });
            });
        };

        if (user.type == "patient") {
            userDetailsRepository.findOneByEmail(user.email, function (err, data) {
                sendEmail(data, callback);
            });
        } else {
            providersRepository.getOne(user.email, function (err, data) {
                sendEmail(data, callback);
            });
        }
    }

    function sendAvailabilityChanged(userID, params) {

    }

    function sendAppointNotification(userID, params) {

    }

    module.exports = {
        sendPatientSubscriptionConfirmation: sendPatientSubscriptionConfirmation,
        sendProviderSubscriptionConfirmation: sendProviderSubscriptionConfirmation,
        sendPasswordReset: sendPasswordReset
    }

})();
/*sendSubscriptionCofirmation
, sendBookedAppointment,

sendAvailabilityChanged,
sendAppointNotification
The main parameter of the methods will be userId*/