/**
 * Created by Victor on 14/12/2015.
 */
(function() {

    var slotsRepository = require('../repositories/slotsRepository');
    var usersDetailsRepository = require('../repositories/usersDetailsRepository');
    var usersRepository = require('../repositories/usersRepository');

    function getPatientAppointments(patientId, callback) {
        slotsRepository.getBookedSlotsByPatient(patientId, function (err, data) {
            var result = [];
            var theError;
            if (data.length == 0) callback(null, data);
            _.forEach(data, function (slotItem) {
                usersDetailsRepository.findOneByEmail(slotItem.patientId, function (err, userDetails) {
                    if (err) {
                        result.push(err);
                    } else {
                        usersRepository.findOneByEmail(slotItem.patientId, function (err, user, userDetails) {
                            var onlineStatus;
                            if (!err) {
                                onlineStatus = user.onlineStatus;
                            }
                            result.push({
                                patientId: slotItem.patientId,
                                name: userDetails.title + ' ' + userDetails.firstname + ' ' + userDetails.surname,
                                slotDateTime: slotItem.slotDateTime,
                                slotDateTimeString: slotItem.slotDateTimeString,
                                onlineStatus: onlineStatus
                            });
                            if (result.length == data.length) {
                                callback(null, result);
                            }
                        }, userDetails);
                    }
                });
            });

        });
    }

    module.exports = {
        getPatientAppointments:getPatientAppointments
    }
})();
