/**
 * Created by Victor on 27/08/2015.
 */

(function() {

    var usersRepository = require('../repositories').Users;
    var videoService = require('../services/videoService');
    var patientAppointmentsService = require('../services/patientAppointmentsService');
    var jwt = require("jsonwebtoken");
    var _ = require("underscore");
    var NS = "Notifications";

    var loggerProvider = require('../logging');

    var io;

    module.exports = {
        init: function (server) {
            io = require('socket.io')(server);
            function notifyProvidersAboutPatientOnlineStatus(onlineStatus, socketUser) {
                usersRepository.findOneByEmail(socketUser.email, function (err, user) {
                    if (!err && user && user.type === "patient") {
                        patientAppointmentsService.getPatientAppointments(user.email, function (err, appointmentsResult) {
                            if (appointmentsResult.length > 0) {
                                _.forEach(appointmentsResult, function (appointment) {
                                    usersRepository.findOneByEmail(appointment.providerId, function (err, providerUser) {
                                        if (!err && providerUser && providerUser.socketIds) {
                                            var namespace = io.sockets;
                                            var onlineSockets = _.filter(providerUser.socketIds, function (socketId) {
                                                return !!_.find(namespace.sockets, function (socket) {
                                                    return socketId === socket.id;
                                                });
                                            });
                                            _.forEach(onlineSockets, function (onlineSocket) {
                                                if (onlineSocket.connected) {
                                                    onlineSocket.emit('onlineStatus', {
                                                        recipientId: user.email,
                                                        onlineStatus: onlineStatus
                                                    });
                                                }
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            }

            io.on('connection', function (socket) {
                loggerProvider.getLogger().debug(NS+"::"+"Client connected...");
                socket.auth = false;
                socket.on('authenticate', function (data) {
                    loggerProvider.getLogger().debug(NS+"::"+"Client authenticate...");
                    if (data.token) {
                        jwt.verify(data.token, process.env.JWT_SECRET, function (err, decoded) {
                            if (!err) {
                                socket.userId = decoded.email;
                                usersRepository.findOneByEmail(decoded.email, function (err, socketsData) {
                                    var namespace = io.sockets;
                                    var onlineSockets = _.filter(socketsData.socketIds,function(oldSocketId) {
                                        return !!_.find(namespace.sockets, function (activeSocket) {
                                            return oldSocketId === activeSocket.id;
                                        });
                                    });

                                    onlineSockets = onlineSockets.concat([socket.id]);

                                    usersRepository.updateOnlineStatus(decoded.email, 'online', onlineSockets, function (err, result) {
                                        if (!err) {
                                            notifyProvidersAboutPatientOnlineStatus('online', decoded);
                                        }
                                        socket.auth = true;
                                        loggerProvider.getLogger().debug(NS + "::" + decoded.email + " status online...");
                                        /*_.each(io.nsps, function(nsp) {
                                         if(_.findWhere(nsp.sockets, {id: socket.id})) {
                                         console.log("restoring socket to", nsp.name);
                                         nsp.connected[socket.id] = socket;
                                         }
                                         });*/
                                    });
                                });
                            } else {
                                loggerProvider.getLogger().error(err);
                            }
                        });
                    }
                });

                /*_.each(io.nsps, function(nsp){
                 nsp.on('connect', function(socket){
                 if (!socket.auth) {
                 console.log("removing socket from", nsp.name)
                 delete nsp.connected[socket.id];
                 }
                 });
                 });*/

                /* setTimeout(function(){
                 //If the socket didn't authenticate, disconnect it
                 if (!socket.auth) {
                 console.log("Disconnecting socket ", socket.id);
                 socket.disconnect('unauthorized');
                 }
                 }, 10000);*/

                socket.on('call', function (data) {
                    var namespace = io.sockets;
                    usersRepository.findOneByEmail(data.recipient, function (err, user) {
                        if (err) {
                            socket.emit('errorRetrieveUser', data);
                        } else if (user) {
                            var recipientSocket = _.find(namespace.sockets, function (aSocket) {
                                return aSocket.id === user.socketId;
                            });
                            if (recipientSocket && recipientSocket.connected) {
                                recipientSocket.emit('call', data);
                            } else {
                                socket.emit('recipientOffline', data);
                            }
                        } else {
                            socket.emit('invalidRecipient', data);
                        }
                    });
                });

                socket.on('cancel', function (data) {
                    var namespace = io.sockets;
                    usersRepository.findOneByEmail(data.recipient, function (err, user) {
                        if (err) {
                            socket.emit('errorRetrieveUser', data);
                        } else if (user) {
                            var recipientSocket = _.find(namespace.sockets, function (aSocket) {
                                return aSocket.id === user.socketId;
                            });
                            if (recipientSocket && recipientSocket.connected) {
                                usersRepository.findOneByEmail(data.caller, function (err, callerUser) {
                                    if (callerUser) {
                                        var callerSocket = _.find(namespace.sockets, function (aCallerSocket) {
                                            return aCallerSocket.id === callerUser.socketId;
                                        });
                                        callerSocket.emit('cancel', data);
                                    }
                                });
                                recipientSocket.emit('cancel', data);
                            } else {
                                socket.emit('recipientOffline', data);
                            }
                        } else {
                            socket.emit('invalidRecipient', data);
                        }
                    });
                });

                socket.on('answer', function (data) {
                    var namespace = io.sockets;
                    usersRepository.findOneByEmail(data.caller, function (err, user) {
                        if (err) {
                            socket.emit('errorRetrieveUser', data);
                        } else if (user) {
                            var callerSocket = _.find(namespace.sockets, function (aSocket) {
                                return aSocket.id === user.socketId;
                            });
                            if (callerSocket && callerSocket.connected) {
                                videoService.createVideoMeeting(data.caller, function (err, meeting) {
                                    if (err) {
                                        callerSocket.emit('errorZoom', err);
                                        socket.emit('errorZoom', err);
                                    } else {
                                        callerSocket.emit('answer', _.extend(data, meeting));
                                        setTimeout(function () {
                                            socket.emit('meetingData', {joinUrl: meeting.join_url});
                                        }, 5000);
                                    }
                                });
                            } else {
                                socket.emit('recipientOffline', data);
                            }
                        } else {
                            socket.emit('invalidRecipient', data);
                        }
                    });
                });

                socket.on('disconnect', function () {
                    loggerProvider.getLogger().debug(NS+"::"+'Disconnected!');
                    usersRepository.findOneByEmail(socket.userId, function (err, socketsData) {
                        var namespace = io.sockets;
                        var onlineSockets = _.filter(socketsData.socketIds, function (oldSocketId) {
                            return !!_.find(namespace.sockets, function (activeSocket) {
                                return oldSocketId === activeSocket.id;
                            });
                        });

                        var currentSocketIndex = _.indexOf(onlineSockets,socket.id);

                        if(currentSocketIndex!=-1)
                        onlineSockets.splice(currentSocketIndex, 1);
                        var onlineStatus = onlineSockets.length==0?'offline':'online';
                        usersRepository.updateOnlineStatus(socket.userId, onlineStatus, onlineSockets, function (err, result) {
                            if (!err) {
                                notifyProvidersAboutPatientOnlineStatus('onlineStatus', {email: socket.userId});
                            }
                            socket.auth = false;
                            loggerProvider.getLogger().debug(NS + "::" + "status offline...");
                            /* _.each(io.nsps, function(nsp) {
                             if(_.findWhere(nsp.sockets, {id: socket.id})) {
                             console.log("restoring socket to", nsp.name);
                             nsp.connected[socket.id] = socket;
                             }
                             });*/
                        });
                    });
                });
            });
        },

        sendEvent: function (recipient, eventName, payLoad) {
            var namespace = io.sockets;
            usersRepository.findOneByEmail(recipient, function (err, user) {
                if (err) {
                    var incidentTicket = loggerProvider.getIncidentTicketNumber('sc');
                    loggerProvider.getLogger().error({incidentTicket: incidentTicket}, err);
                } else if (user) {
                    var socket = _.find(namespace.sockets, function (aSocket) {
                        return aSocket.id === user.socketId;
                    });
                    if(socket){
                        socket.emit(eventName, payLoad);
                    }
                }
            });
        },

        broadcastSlotChangedEvent: function (eventName, slot) {
            if(io && io.sockets)
            io.sockets.emit(eventName, slot);
        }
    };
})();