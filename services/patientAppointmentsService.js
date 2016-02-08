/**
 * Created by Victor on 14/12/2015.
 */
(function() {

    var slotsRepository = require('../repositories/slotsRepository');
    var usersDetailsRepository = require('../repositories/usersDetailsRepository');
    var usersRepository = require('../repositories/usersRepository');
    var providersRepository = require('../repositories/providersRepository');
    var _ = require('underscore');

    function getPatientAppointments(patientId, callback) {
        slotsRepository.getBookedSlotsByPatient(patientId, function (err, data) {
            var result = [];
            var theError;
            if (data.length == 0) callback(null, data);
            _.forEach(data, function (slotItem) {
                providersRepository.getOne(slotItem.providerId, function (err, userDetails) {
                    if (err) {
                        result.push(err);
                    } else {
                        result.push({
                            providerId: slotItem.providerId,
                            providerName: userDetails.title + ' ' + userDetails.name + ' ' + userDetails.surname,
                            slotDateTime: slotItem.slotDateTime.getTime(),
                            slotDateTimeString: slotItem.slotDateTimeString
                        });
                        if (result.length == data.length) {
                            callback(null, result);
                        }
                    }
                });
            });
        });
    }

    module.exports = {
        getPatientAppointments:getPatientAppointments
    }
})();
