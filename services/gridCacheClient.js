/**
 * Created by Victor on 21/11/2015.
 */

(function() {
    var socketClient;
    var io;
    var notification = require('../notifications');
    var Rx;
    var loggerProvider = require('../logging');
    var os = require('os');
    var host_name = os.hostname();
    module.exports = {
        init: function () {
            socketClient = require('socket.io-client');
            Rx = require('rx');
            io = socketClient("http://hcm-availability.elasticbeanstalk.com");
            io.on('connect', function () {
                loggerProvider.getLogger().debug(host_name + ' has connected to cache server!');
                io.emit('ehlo', {host_name: host_name});
            });

            io.on('disconnect', function () {
                loggerProvider.getLogger().debug(os.hostname() + ' disconnected from cache server!');
            });
        },
        sendSlotsBatchAvailable: function (slots, providerId) {
            var source = Rx.Observable.fromArray(slots);
            source.subscribe(function (slot) {
                var payLoad = {slotDateTime: new Date(slot).getTime(), providerId: providerId};
                io.emit('slotAvailable', payLoad);
                notification.broadcastSlotChangedEvent('slotAvailable', payLoad);
            });
        },
        sendSlotAvailable: function (slot, providerId) {
            var payLoad = {slotDateTime: new Date(slot).getTime(), providerId: providerId};
            io.emit('slotAvailable',payLoad);
            notification.broadcastSlotChangedEvent('slotAvailable', payLoad);
        },
        sendSlotBooked: function (slot, providerId) {
            var payLoad = {slotDateTime: new Date(slot).getTime(), providerId: providerId};
            io.emit('slotBooked', payLoad);
            notification.broadcastSlotChangedEvent('slotBooked', payLoad);
        },
        sendSlotsBatchRemoved: function (slots, providerId) {
            var source = Rx.Observable.fromArray(slots);
            source.subscribe(function (slot) {
                var payLoad = {slotDateTime: new Date(slot).getTime(), providerId: providerId};
                io.emit('slotRemoved', payLoad);
                notification.broadcastSlotChangedEvent('slotRemoved', payLoad);
            });
        },
        sendSlotRemoved: function (slot, providerId) {
            var payLoad = {slotDateTime: new Date(slot).getTime(), providerId: providerId};
            io.emit('slotRemoved', payLoad);
            notification.broadcastSlotChangedEvent('slotRemoved', payLoad);
        }
    };
})();
