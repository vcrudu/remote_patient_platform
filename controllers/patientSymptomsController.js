/**
 * Created by Victor on 7/7/2016.
 */

(function(){

    var patientSymptomsService = require('../services').PatientSymptomsService;
    
    module.exports.init = function(router) {
        router.post('/symptoms/addPatientSymptoms', function (req, res) {
            if (!req.body.evidence) {
                res.status(400).json({
                    success: false,
                    message: "evidence id is missing!"
                });
            }

            patientSymptomsService.addPatientSymptoms(req.body.evidence, function (err, data) {
                if (err) {
                    res.status(500).json({
                        success: false,
                        error: err,
                        data: undefined
                    });
                } else {
                    res.json({
                        success: true,
                        data: data,
                        error: undefined
                    });
                }
            });
        });

        router.get('/symptoms/:patientId', function (req, res) {
            patientSymptomsService.getLastEvidence(req.params.patientId, function (err, data) {
                if (err) {
                    res.status(500).json({
                        success: false,
                        error: err,
                        data: undefined
                    });
                } else {
                    res.json({
                        success: true,
                        data: data,
                        error: undefined
                    });
                }
            });
        });

        router.get('/symptoms/:patientId/:slotId', function (req, res) {
            patientSymptomsService.getEvidenceBySlotId(req.params.patientId, req.params.slotId, function (err, data) {
                if (err) {
                    res.status(500).json({
                        success: false,
                        error: err,
                        data: undefined
                    });
                } else {
                    res.json({
                        success: true,
                        data: data,
                        error: undefined
                    });
                }
            });
        });
    };
})();