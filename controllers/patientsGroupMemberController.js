var logging     = require('../logging');
var _ = require('underscore');
var patientsGroupMemberRepository = require('../repositories/patientsGroupMemberRepository');
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
                    _.forEach(data, function (patientsmembergroup) {
                        result.push(patientsmembergroup);
                    });
                    res.json({
                        count: result.length,
                        success: true,
                        items: result,
                        description: "The result contains the list of patientsGroupMember by providerId and groupName."
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