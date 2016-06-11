/**
 * Created by Victor on 12/12/2015.
 */

(function() {
    var clockwork = require('clockwork')({key: '14fa969186419ef51679bd6ac938834e37e05b32'});
    var userDetailsRepository = require('../repositories/usersDetailsRepository');
    var providersRepository = require('../repositories/providersRepository');
    var moment = require('moment');

    function sendAppointmentSms(toUser, slotDateTimeEpoch, callback) {
        userDetailsRepository.findOneByEmail(toUser, function (err, data) {
            var slotDateTime = new Date();
            slotDateTime.setTime(slotDateTimeEpoch);
            var momentSlotDateTime = moment(slotDateTime);
            var content = "Dear " + data.title + " " + data.firstname + " " + data.surname + ", " +
                "this is confirmation of your appointment at " + momentSlotDateTime.format('hh:mmA') +
                ' on ' + momentSlotDateTime.format('dddd, DD of MMM') + '. Please be online at the specified time.';

            if (!err) {
                if (data.mobile) {
                    clockwork.sendSms({To: data.mobile, Content: content},
                        function (error, resp) {
                            if (error) {
                                console.log('Something went wrong', error);
                                callback(error, null);
                            } else {
                                console.log('Message sent', resp);
                                callback(null, 'Message sent', resp);
                            }
                        });
                }
            }
        });
    }

    function sendProviderAppointmentSms(providerId, slotDateTimeEpoch, callback) {
        providersRepository.getOne(providerId, function (err, provider) {
            var slotDateTime = new Date();
            slotDateTime.setTime(slotDateTimeEpoch);
            var momentSlotDateTime = moment(slotDateTime);
            var content = "Dear " + provider.title + " " + provider.name + " " + provider.surname + ", " +
                "this is confirmation that you have an appointment at " + momentSlotDateTime.format('hh:mmA') +
                ' on ' + momentSlotDateTime.format('dddd, DD of MMM') + '. Please call the patient at the specified time.';

            if (!err) {
                var mobileNumber = provider.getMobileNumber();
                if (mobileNumber) {
                    clockwork.sendSms({To: mobileNumber.contact, Content: content},
                        function (error, resp) {
                            if (error) {
                                console.log('Something went wrong', error);
                                callback(error, null);
                            } else {
                                console.log('Message sent', resp);
                                callback(null, 'Message sent', resp);
                            }
                        });
                } else{
                    callback(null, null);
                }
            }
        });
    }

    module.exports = {
        sendAppointmentSms: sendAppointmentSms,
        sendProviderAppointmentSms: sendProviderAppointmentSms
    };
})();