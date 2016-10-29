var logging     = require('../logging');
var _ = require('underscore');
var snsClient = require('../snsClient');
var patientsGroupMemberRepository = require('../repositories/patientsGroupMemberRepository');
var userDetailsRepository     = require('../repositories').UsersDetails;
var util = require('util');

(function() {

    function sendError(res, error) {
        var statusCode;
        if (error.unhandled) {
            statusCode = 500;
        } else {
            statusCode = 400;
        }
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }

    module.exports.init = function (router) {

        router.get('/patientsgroupmember/:groupname', function (req, res) {


            var byProvIdandGroupName = {};
            byProvIdandGroupName.providerId = req.decoded.email;
            byProvIdandGroupName.groupName = req.params.groupname;

            patientsGroupMemberRepository.getList(byProvIdandGroupName, function (err, data) {
                if (err) {
                    res.status(500).json({
                        success: false,

                    });
                } else {

                    var result = [];

                    function sendResultToClient(result) {

                        res.json({
                            count: result.length,
                            success: true,
                            items: result,
                            description: "The result contains the list of patientsGroupMember by providerId and groupName."
                        });
                    }


                    /* old forEach */
                    /*      _.forEach(data, function (patientsmembergroup) {

                     result.push(patientsmembergroup);
                     }); */

                    /* new forEach */

                    if (data && data.length === 0) {
                        sendResultToClient([]);
                    }

                    _.forEach(data, function (patientsmembergroup) {


                        userDetailsRepository.findOneByEmail(patientsmembergroup.patientId, function (err, userDetails) {


                            if (err) {

                                console.log("Eroare email do not found")

                            } else {


                                result.push({patientId: userDetails.firstname + ' ' + userDetails.surname});
                                if (data.length == result.length) {
                                    sendResultToClient(result);
                                }


                            }
                        });


                    });


                    /*    });*/

                    /*          res.json({
                     count: result.length,
                     success: true,
                     items: result,
                     description: "The result contains the list of patientsGroupMember by providerId and groupName."
                     });*/

                }
            });
        });

        router.post('/patientsgroupmember/invitation', function (req, res) {
            snsClient.SendOnPatientInvitedToGroupEvent(req.body.patientId, req.decoded.email, req.body.groupName,
                function (err, data) {
                    if (err) {
                        res.status(500).json({
                            success: false
                        });
                    }
                    if (data) {
                        res.status(200).json({
                            success: true
                        });
                    }
                });
        });

        router.post('/patientsgroupmember/authorise-membership', function (req, res) {
            var authorisationToken = req.query.authorisation;

            var jwt = require('jsonwebtoken');
            var decodedAuthorisationToken = jwt.decode(authorisationToken);

            var groupMember = {
                providerId: decodedAuthorisationToken.providerId,
                groupName: decodedAuthorisationToken.groupName,
                patientId: decodedAuthorisationToken.email,
                createDateTime: (new Date()).getTime(),
                createdBy: decodedAuthorisationToken.providerId
            };

            patientsGroupMemberRepository.save(groupMember, function (err, data) {
                if (err) {
                    res.status(500).json({
                        success: false
                    });
                } else {

                    snsClient.SendOnInvitationToGroupAccepted(decodedAuthorisationToken.email,
                        decodedAuthorisationToken.providerId,
                        decodedAuthorisationToken.groupName,
                        function (err) {
                            if (err) {
                                res.status(500).json({
                                    success: false
                                });
                            } else {
                                res.status(200).json({
                                    success: true
                                });
                            }
                        });
                }
            });
        });

        router.post('/patientsgroupmember', function (req, res) {


            var savedItem = {};
            savedItem.providerId = req.decoded.email;
            savedItem.groupName = req.body.groupName;
            savedItem.patientId = req.body.patientId;
            savedItem.createdBy = req.body.createdBy;
            savedItem.createDateTime = req.body.createDateTime;


            patientsGroupMemberRepository.save(savedItem, function (err, data) {
                if (err) {
                    res.status(500).json({
                        success: false,

                    });
                } else {

                    res.json({
                        success: true,
                        description: "The PatientsGroupMember Item was saved!!!"
                    });

                }
            });
        });


        //      router.delete('/patientsgroupmember', function(req, res){
        //         res.status(400);
        //    });

        //      router.get('/patientsgroup/:providerId', function(req, res){
        //        res.send("This is a patientsGroup with providerId Page!!!");
        //      });


        //     router.delete('/patientsgroup', function(req, res){
        //        res.status(400);
        //     });

        //     router.delete('/patientsgroup/:providerId', function(req, res){
        //        res.status(400);
        //   });
    };
})();