/**
 * Created by Victor on 17/10/2015.
 */
(function(){
    var slotsRepository = require('../repositories').Slots;
    module.exports = {
        bookAppointment: function (userId, dateTime, callback) {
            slotsRepository.updateSlot(userId, dateTime, function (err, result) {
                callback(err, result);
            });
        }
    };
})();