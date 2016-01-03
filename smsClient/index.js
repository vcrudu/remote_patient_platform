/**
 * Created by Victor on 12/12/2015.
 */

(function() {
    var clockwork = require('clockwork')({key: '14fa969186419ef51679bd6ac938834e37e05b32'});
    var userDetailsRepository = require('../repositories/usersDetailsRepository');
    var moment = require('moment');

    function sendAppointmentSms(toUser, slotDateTimeEpoch, callback) {
        userDetailsRepository.findOneByEmail(toUser, function (err, data) {
            var slotDateTime = new Date();
            slotDateTime.setTime(slotDateTimeEpoch);
            var momentSlotDateTime = moment(slotDateTime);
            var content = "Dear " + data.title + " " + data.firstname + " " + data.surname + ", " +
                        "this is confirmation of your appointment at " + momentSlotDateTime.format('hh:mmA')+
                ' on ' + momentSlotDateTime.format('dddd, DD of MMM') + '. Please be online at the specified time.';

            if (!err) {
                if(data.mobile) {
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

    module.exports = {sendAppointmentSms: sendAppointmentSms};
})();