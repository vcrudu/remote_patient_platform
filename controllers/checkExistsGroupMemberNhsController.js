
(function() {

    var usersDetailsRepository = require('../repositories').UsersDetails;
    var patientsGroupMemberRepository = require('../repositories/patientsGroupMemberRepository');
    module.exports.init = function (app) {
        app.get('/checkExistsGroupMemberNhs', function (req, res) {


            if (!req.query.nhsNumber) {
                res.json({
                    success: false
                });
            }

            usersDetailsRepository.getUserEmailDetailsByNhsNumber(req.query.nhsNumber, function (err, user) {

                if (err) {

                    res.json({
                        success: false,
                        data: err
                    });
                } else {
                    if (user) {
                        var byGroupIdAndPatientId = {};

                        byGroupIdAndPatientId.providerId = req.query.providerId;
                        byGroupIdAndPatientId.groupName = req.query.groupName;
                        byGroupIdAndPatientId.patientId = user[0].email;

                        patientsGroupMemberRepository.getByPatientId(byGroupIdAndPatientId.patientId, function (err, members) {
                            if (err || members.length === 0) {
                                res.json({
                                    success: false,
                                    data: user

                                });
                            } else {
                                res.json({
                                    success: true,
                                    data: user

                                });
                            }
                        });
                    } else {
                        res.json({
                            success: false,
                            data: null
                        });
                    }
                }
            });
        });
    };
})();
