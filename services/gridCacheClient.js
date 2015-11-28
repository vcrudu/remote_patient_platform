/**
 * Created by Victor on 21/11/2015.
 */

(function() {
    var socketClient;
    var io;
    var Rx;
    var loggerProvider = require('../logging');
    var os = require('os');
    var host_name = os.hostname();
    module.exports = {
        init: function () {
            socketClient = require('socket.io-client');
            Rx = require('rx');
            io = socketClient("http://localhost:8082");
            io.on('connect', function(){
                loggerProvider.getLogger().debug(host_name + ' has connected to cache server!');
                io.emit('ehlo', {host_name:host_name});
            });

            io.on('disconnect', function(){
                loggerProvider.getLogger().debug(os.hostname() + ' disconnected from cache server!');
            });
        },
        sendSlotsBatchAvailable: function (slots, providerId) {
            var source = Rx.Observable.fromArray(slots);
            source.subscribe(function(slot){
                io.emit('slotAvailable', {slotDateTime: new Date(slot).getTime(), providerId: providerId});
            });
        },
        sendSlotAvailable: function (slot, providerId) {
            io.emit('slotAvailable', {slotDateTime: new Date(slot).getTime(), providerId: providerId});
        },
        sendSlotBooked: function (slot,providerId) {
            io.emit('slotBooked', {slotDateTime: new Date(slot).getTime(), providerId: providerId});
        },
        sendSlotsBatchRemoved: function (slots, providerId) {
            var source = Rx.Observable.fromArray(slots);
            source.subscribe(function(slot) {
                io.emit('slotRemoved', {slotDateTime: new Date(slot).getTime(), providerId: providerId});
            });
        },
        sendSlotRemoved: function (slot, providerId) {
            io.emit('slotRemoved', {slotDateTime: new Date(slot).getTime(), providerId: providerId});
        }
    };
})();
