/**
 * Created by Victor on 17/10/2015.
 */
(function(){
    var slotsRepository = require('../repositories').Slots;
    var gridCacheClient = require('../services/gridCacheClient');
    var clientNotification = require('../notifications');
    var providersRepository = require('../repositories').Providers;
    var smsClient = require('../smsClient');
    var snsClient = require('../snsClient');
    var loggerProvider = require('../logging');
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    module.exports = {
        bookAppointment: function (userId, slotEpoch, appointmentReason, callback) {
            var dateTime = new Date();
            dateTime.setTime(slotEpoch);
            slotsRepository.getProvidersForSlot(dateTime, function (err, data) {
                if (data.length == 0) {
                    callback("Slot is not available!", null);
                    return;
                }
                var providerIndex = getRandomInt(0, data.length);
                var providerId = data[providerIndex];
                slotsRepository.updateSlot(userId, providerId, slotEpoch, appointmentReason, function (err, result) {
                    if (!err) {
                        gridCacheClient.sendSlotBooked(slotEpoch, providerId);
                        providersRepository.getOne(providerId, function (err, providerDetails) {
                            if (!err) {
                                clientNotification.sendEvent(userId,
                                    'slotBookedSuccessfully',
                                    {
                                        slotDateTime: slotEpoch,
                                        providerId: providerId,
                                        providerName: providerDetails.title + ' ' + providerDetails.name + ' ' + providerDetails.surname
                                    }
                                );
                                smsClient.sendAppointmentSms(userId, slotEpoch, function (err) {
                                    if (err) {
                                        loggerProvider.getLogger().error(err);
                                    }
                                    smsClient.sendProviderAppointmentSms(providerId, slotEpoch, function (err) {
                                        if (err) {
                                            loggerProvider.getLogger().error(err);
                                        }
                                        var appointmentDetails = {
                                            providerId: providerId,
                                            providerTitle: providerDetails.title,
                                            providerFullName: providerDetails.name + ' ' + providerDetails.surname,
                                            providerType: providerDetails.providerType,
                                            appointmentDateTime: slotEpoch
                                        };

                                        snsClient.sendOnAppointmentBookingEvent(userId, appointmentDetails, function (err) {
                                            if(err){
                                                loggerProvider.getLogger().error(new Error("Failed to send OnAppointmentBookingEvent"));
                                            }
                                        });
                                    });
                                });
                            }
                            callback(err, providerDetails);
                        });
                    }
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