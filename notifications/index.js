/**
 * Created by Victor on 27/08/2015.
 */

(function() {

    var usersRepository = require('../repositories').Users;
    var videoService = require('../services/videoService');
    var patientAppointmentsService = require('../services/patientAppointmentsService');
    var jwt = require("jsonwebtoken");
    var _ = require("underscore");
    var NS = "socket.io";

    var loggerProvider = require('../logging');

    var redis = require('socket.io-redis');

    var io;

    module.exports = {
        init: function (server) {
            io = require('socket.io')(server);
            /*var adapter = redis({ host: 'socket-io-scala.kx6css.0001.euw1.cache.amazonaws.com', port: 6379 });
             adapter.pubClient.on('error', function(error){
             loggerProvider.getLogger().error(NS+"::pubClient::"+error);
             });

             adapter.subClient.on('error', function(error){
             loggerProvider.getLogger().error(NS+"::subClient::"+error);
             });

             io.adapter(adapter);*/
            function notifyProvidersAboutPatientOnlineStatus(onlineStatus, socketUser) {
                usersRepository.findOneByEmail(socketUser.email, function (err, user) {
                    if (!err && user && user.type === "patient") {
                        patientAppointmentsService.getPatientAppointments(user.email, function (err, appointmentsResult) {
                            if (appointmentsResult.length > 0) {
                                _.forEach(appointmentsResult, function (appointment) {
                                    usersRepository.findOneByEmail(appointment.providerId, function (err, providerUser) {
                                        if (!err && providerUser && providerUser.socketIds) {
                                            var namespace = io.sockets;
                                            var onlineSockets = _.filter(namespace.sockets, function (webSocket) {
                                                return !!_.find(providerUser.socketIds, function (providerSocketId) {
                                                    return providerSocketId === webSocket.id;
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

                socket.emit('connected', socket.id);

                socket.auth = false;
                socket.on('authenticate', function (data) {
                    loggerProvider.getLogger().info(NS+"::"+"Client authenticate...");
                    if (data.token) {
                        jwt.verify(data.token, process.env.JWT_SECRET, function (err, decoded) {
                            if (!err) {
                                socket.userId = decoded.email;
                                loggerProvider.getLogger().info({module: NS, event: "authenticate", success: true});
                                usersRepository.findOneByEmail(decoded.email, function (err, socketsData) {
                                    if (err) {
                                        loggerProvider.getLogger().info({
                                            module: NS,
                                            event: "usersRepository.findOneByEmail.socketData",
                                            success: false,
                                            err: err
                                        });
                                    }

                                    var namespace = io.sockets;
                                    var onlineSockets = _.filter(socketsData.socketIds, function (oldSocketId) {
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
                                        if (onlineSockets) {
                                            loggerProvider.getLogger().info({
                                                module: NS,
                                                event: "usersRepository.updateOnlineStatus",
                                                success: true,
                                                numberOfOnlineSockets: onlineSockets.length
                                            });
                                        }
                                        /*_.each(io.nsps, function(nsp) {
                                         if(_.findWhere(nsp.sockets, {id: socket.id})) {
                                         console.log("restoring socket to", nsp.name);
                                         nsp.connected[socket.id] = socket;
                                         }
                                         });*/
                                    });
                                });
                            } else {
                                loggerProvider.getLogger().error({module: NS, err: err, success: false});
                            }
                        });
                    }
                });

                socket.on('call', function (data) {
                    var namespace = io.sockets;
                    loggerProvider.getLogger().info({
                        module: NS,
                        event: "call",
                        success: true,
                        data: data
                    });

                    usersRepository.findOneByEmail(data.recipient, function (err, user) {
                        if (err) {
                            socket.emit('errorRetrieveUser', data);
                            loggerProvider.getLogger().error({
                                module: NS,
                                event: "call.recipient.errorRetrieveRecipient",
                                data: data,
                                err: err,
                                success: false
                            });
                        } else if (user) {
                            loggerProvider.getLogger().info({
                                module: NS,
                                event: "call.recipient.usersRepository.findOneByEmail",
                                user: user.email,
                                success: true
                            });

                            if (user.socketIds && user.socketIds.length > 0) {
                                loggerProvider.getLogger().info({
                                    module: NS,
                                    event: "call.recipient.user.socketIds.length",
                                    numberOfSockets: user.socketIds.length,
                                    success: true
                                });

                                var recipientSockets = Object.keys(namespace.sockets).map(function(key){
                                    return namespace.sockets[key];
                                }).filter(function (aSocket) {
                                    return !!user.socketIds.find(function (userSocketId) {
                                        return (aSocket.id === userSocketId) && aSocket.connected
                                    });
                                });

                                if (recipientSockets.length == 0) {
                                    socket.emit('recipientOffline', data);
                                    loggerProvider.getLogger().info({
                                        module: NS,
                                        event: "recipientOffline",
                                        user: user.email,
                                        success: true
                                    });
                                } else {
                                    data.callerSocketId = socket.id;
                                    recipientSockets.forEach(function (recipientSocket) {
                                        recipientSocket.emit('call', data);
                                        loggerProvider.getLogger().info({
                                            module: NS,
                                            event: "recipientSocket.call",
                                            recipientSocket: recipientSocket.id,
                                            success: true
                                        });
                                    });
                                }
                            } else {
                                loggerProvider.getLogger().info({
                                    module: NS,
                                    event: "noSocketsRegistered",
                                    success: true
                                });
                            }
                        } else {
                            loggerProvider.getLogger().error({
                                module: NS,
                                event: "invalidRecipient",
                                data: data,
                                success: false
                            });

                            socket.emit('invalidRecipient', data);
                        }
                    });
                });

                //Todo-here cancel event from caller should be different event
                socket.on('cancelByRecipient', function (data) {
                    var namespace = io.sockets;
                    loggerProvider.getLogger().info({
                        module: NS,
                        event: "cancelByRecipient",
                        data: data,
                        success: true
                    });

                    usersRepository.findOneByEmail(data.recipient, function (err, user) {
                        if (err) {
                            socket.emit('errorRetrieveUser', data);
                            loggerProvider.getLogger().error({
                                module: NS,
                                event: "cancelByRecipient.errorRetrieveRecipientUser",
                                data: data,
                                success: false
                            });
                        } else if (user) {
                            loggerProvider.getLogger().info({
                                module: NS,
                                event: "cancelByRecipient.usersRepository.findOneByEmail",
                                user: user,
                                success: true
                            });

                            usersRepository.findOneByEmail(data.caller, function (err, callerUser) {
                                if (callerUser) {
                                    loggerProvider.getLogger().info({
                                        module: NS,
                                        event: "cancelByRecipient.usersRepository.findOneByEmail.callerUser",
                                        user: callerUser,
                                        success: true
                                    });
                                    if (callerUser.socketIds && callerUser.socketIds.length > 0) {

                                        var callerSockets = Object.keys(namespace.sockets).map(function(key){
                                            return namespace.sockets[key];
                                        }).filter(function (aSocket) {
                                            return !!callerUser.socketIds.find(function (userSocketId) {
                                                return (aSocket.id === userSocketId) && aSocket.connected
                                            });
                                        });

                                        if (callerSockets.length == 0) {
                                            loggerProvider.getLogger().info({
                                                module: NS,
                                                event: "noCallerSockets",
                                                callerUser: callerUser.email,
                                                success: true
                                            });
                                        } else {
                                            callerSockets.forEach(function (callerSocket) {
                                                callerSocket.emit('cancelByRecipient', data);
                                                loggerProvider.getLogger().info({
                                                    module: NS,
                                                    event: "callerSocket.cancelByRecipient",
                                                    callerSocket: callerSocket,
                                                    success: true
                                                });
                                            });
                                        }
                                    }
                                }
                            });

                            var recipientSockets = Object.keys(namespace.sockets).map(function(key){
                                return namespace.sockets[key];
                            }).filter(function (aSocket) {
                                return !!user.socketIds.find(function (userSocketId) {
                                    return (aSocket.id === userSocketId) && aSocket.connected
                                });
                            });

                            if (recipientSockets.length == 0) {
                                loggerProvider.getLogger().info({
                                    module: NS,
                                    event: "noRecipientSockets",
                                    recipientUser: user.email,
                                    success: false
                                });
                            } else {
                                recipientSockets.forEach(function (recipientSocket) {
                                    recipientSocket.emit('cancelByCaller', data);
                                    loggerProvider.getLogger().info({
                                        module: NS,
                                        event: "recipientSocket.cancelByCaller",
                                        recipientSocket: recipientSocket.id,
                                        success: true
                                    });
                                });
                            }
                        } else {
                            socket.emit('invalidRecipient', data);
                            loggerProvider.getLogger().error({
                                module: NS,
                                event: "cancelByRecipient.invalidRecipient",
                                data: data,
                                success: false
                            });
                        }
                    });
                });

                socket.on('cancelByCaller', function (data) {
                    var namespace = io.sockets;
                    loggerProvider.getLogger().info({
                        module: NS,
                        event: "cancelByCaller",
                        data: data,
                        success: true
                    });
                    usersRepository.findOneByEmail(data.recipient, function (err, user) {
                        if (err) {
                            socket.emit('errorRetrieveUser', data);
                            loggerProvider.getLogger().error({
                                module: NS,
                                event: "cancelByCaller.errorRetrieveUser",
                                data: data,
                                success: false
                            });
                        } else if (user) {
                            if (user.socketIds && user.socketIds.length > 0) {
                                loggerProvider.getLogger().info({
                                    module: NS,
                                    event: "cancelByCaller.user.socketIds.length",
                                    numberOfSockets: user.socketIds.length,
                                    success: true
                                });
                                for (var i = 0; i < user.socketIds.length; i ++) {
                                    var recipientSocket = _.find(namespace.sockets, function (aSocket) {
                                        return aSocket.id === user.socketIds[i];//user.socketId;
                                    });
                                    if (recipientSocket && recipientSocket.connected) {
                                        recipientSocket.emit('cancelByCaller', data);
                                        loggerProvider.getLogger().info({
                                            module: NS,
                                            event: "recipientSocket.cancelByCaller",
                                            recipientSocket: recipientSocket,
                                            success: true
                                        });
                                    }
                                }
                            } else{
                                loggerProvider.getLogger().info({
                                    module: NS,
                                    event: "cancelByCaller.noSocketsRegistered",
                                    success: true
                                });
                            }
                        } else {
                            socket.emit('invalidRecipient', data);
                            loggerProvider.getLogger().error({
                                module: NS,
                                event: "cancelByCaller.invalidRecipient",
                                data: data,
                                success: false
                            });
                        }
                    });
                });

                socket.on('answer', function (data) {
                    var namespace = io.sockets;
                    loggerProvider.getLogger().info({
                        module: NS,
                        event: "answer",
                        success: true,
                        data: data
                    });
                    usersRepository.findOneByEmail(data.caller, function (err, callerUser) {
                        if (err) {
                            socket.emit('errorRetrieveUser', data);
                            loggerProvider.getLogger().error({
                                module: NS,
                                event: "answer.errorRetrieveCaller",
                                data: data,
                                err: err,
                                success: false
                            });
                        } else if (callerUser) {
                            loggerProvider.getLogger().info({
                                module: NS,
                                event: "answer.usersRepository.findOneByEmail.callerUser",
                                callerUser: callerUser.email,
                                success: true
                            });

                            if (callerUser.socketIds && callerUser.socketIds.length > 0) {
                                loggerProvider.getLogger().info({
                                    module: NS,
                                    event: "answer.callerUser.socketIds.length",
                                    numberOfSockets: callerUser.socketIds.length,
                                    success: true
                                });

                                var callerSockets = Object.keys(namespace.sockets).map(function(key){
                                    return namespace.sockets[key];
                                }).filter(function (aSocket) {
                                    return !!callerUser.socketIds.find(function (userSocketId) {
                                        return (aSocket.id === userSocketId) && aSocket.connected
                                    });
                                });

                                var realCallerSocktet;
                                if(data.callerSocketId){
                                    realCallerSocktet = callerSockets.find(function (callerSocket) {
                                        return callerSocket.id === data.callerSocketId;
                                    });
                                }

                                if(realCallerSocktet && realCallerSocktet.connected){
                                    videoService.createVideoMeeting(data.caller, function (err, meeting) {
                                        if (err) {
                                            realCallerSocktet.emit('errorZoom', err);
                                            socket.emit('errorZoom', err);
                                            loggerProvider.getLogger().error({
                                                module: NS,
                                                event: "answer.realCallerSocktet.connected.videoService.createVideoMeeting",
                                                err: err,
                                                success: false
                                            });
                                        } else {
                                            realCallerSocktet.emit('answer', _.extend(data, meeting));
                                            setTimeout(function () {
                                                socket.emit('meetingData', {joinUrl: meeting.join_url, meetingNo:meeting.id});
                                            }, 0);

                                            loggerProvider.getLogger().info({
                                                module: NS,
                                                event: "answer.realCallerSocktet.connected.videoService.createVideoMeeting",
                                                meetingData: _.extend(data, meeting),
                                                success: true
                                            });
                                        }
                                    });
                                } else {
                                    videoService.createVideoMeeting(data.caller, function (err, meeting) {
                                        if (err) {
                                            callerSockets.forEach(function (callerSocket) {
                                                if (callerSocket.connected) {
                                                    callerSocket.emit('errorZoom', err);
                                                    socket.emit('errorZoom', err);
                                                }
                                            });

                                            loggerProvider.getLogger().error({
                                                module: NS,
                                                event: "answer.videoService.createVideoMeeting",
                                                err: err,
                                                success: false
                                            });
                                        } else {
                                            loggerProvider.getLogger().info({
                                                module: NS,
                                                event: "answer.videoService.createVideoMeeting",
                                                meetingData: _.extend(data, meeting),
                                                success: true
                                            });
                                            callerSockets.forEach(function (callerSocket) {
                                                if (callerSocket.connected) {
                                                    callerSocket.emit('answer', _.extend(data, meeting));
                                                    setTimeout(function () {
                                                        socket.emit('meetingData', {joinUrl: meeting.join_url, meetingNo:meeting.id});
                                                    }, 0);
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        } else {
                            socket.emit('invalidRecipient', data);
                        }
                    });
                });

                socket.on('disconnect', function () {
                    loggerProvider.getLogger().debug(NS+"::"+'Disconnected!');
                    usersRepository.findOneByEmail(socket.userId, function (err, socketsData) {
                        if(!socketsData) return;
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
                                notifyProvidersAboutPatientOnlineStatus(onlineStatus, {email: socket.userId});
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