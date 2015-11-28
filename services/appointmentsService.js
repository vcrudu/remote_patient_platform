/**
 * Created by Victor on 17/10/2015.
 */
(function(){
    var slotsRepository = require('../repositories').Slots;
    var gridCacheClient = require('../services/gridCacheClient');
    module.exports = {
        bookAppointment: function (userId, providerId, dateTime, callback) {
            slotsRepository.updateSlot(userId, providerId, dateTime, function (err, result) {
                if(!err){
                    gridCacheClient.sendSlotBooked(dateTime, providerId);
                }
                callback(err, result);
            });
        },
        cancelAppointment: function (userId, providerId, dateTime, callback) {
            slotsRepository.updateSlot(null, providerId, dateTime, function (err, result) {
                if (!err) {
                    gridCacheClient.sendSlotAvailable(dateTime, providerId);
                }
                callback(err, result);
            });
        }
    };
})();