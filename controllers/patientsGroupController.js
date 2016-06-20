var logging     = require('../logging');
var _ = require('underscore');
var patientsGroupRepository = require('../repositories/patientsGroupRepository');
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

        router.get('/patientsgroup', function (req, res) {


            var byProvId = {};
            byProvId.providerId = req.decoded.email;


            patientsGroupRepository.getList(byProvId, function (err, data) {
                if (err) {
                    res.status(500).json({
                        success: false,

                    });
                } else {

                    var result = [];
                    _.forEach(data, function (patientsgroup) {
                        result.push(patientsgroup);
                    });
                    res.json({
                        count: result.length,
                        success: true,
                        items: result,
                        description: "The result contains the list of patientsGroup by providerId."
                    });

                }
            });
        });

        router.post('/patientsgroup', function (req, res) {


            var savedItem = {};
            savedItem.providerId = req.decoded.email;
            savedItem.groupName = req.body.groupName;


            patientsGroupRepository.save(savedItem, function (err, data) {
                if (err) {
                    res.status(500).json({
                        success: false,

                    });
                } else {

                    res.json({
                        success: true,
                        description: "The PatientsGroup Item was saved!!!"
                    });

                }
            });
        });


        //    router.delete('/patientsgroup', function(req, res){
        //       res.status(400);
        //  });


    };
})();