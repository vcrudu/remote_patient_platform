/**
 * Created by Victor on 17/10/2015.
 */
(function(){
    var slotsRepository = require('../repositories').Slots;
    var gridCacheClient = require('../services/gridCacheClient');
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    module.exports = {
        bookAppointment: function (userId, slotEpoch, callback) {
            var dateTime = new Date();
            dateTime.setTime(slotEpoch);
            slotsRepository.getProvidersForSlot(dateTime, function (err, data) {
                if (data.length == 0) callback("Slot is not available!", null);
                var providerIndex = getRandomInt(0, data.length);
                var providerId = data[providerIndex];
                slotsRepository.updateSlot(userId, providerId, slotEpoch, function (err, result) {
                    if (!err) {
                        gridCacheClient.sendSlotBooked(slotEpoch, providerId);
                    }
                    callback(err, result);
                });
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