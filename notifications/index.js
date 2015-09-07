/**
 * Created by Victor on 27/08/2015.
 */

(function() {

    var usersRepository     = require('../repositories').Users;
    var videoService     = require('../services/videoService');
    var jwt                 = require("jsonwebtoken");
    var _                 = require("underscore");

    module.exports = {
        init: function (server) {
            var io = require('socket.io')(server);

            io.on('connection', function (socket) {
                console.log("Client connected...");
                socket.auth = false;
                socket.on('authenticate', function(data){
                    console.log("Client authenticate...");
                    if (data.token){
                        jwt.verify(data.token, process.env.JWT_SECRET, function(err, decoded) {
                            if(!err){
                                socket.userId = decoded.email;
                                usersRepository.updateOnlineStatus(decoded.email,'online',socket.id,function(err, result){
                                    socket.auth=true;
                                    console.log("online status online...");
                                    /*_.each(io.nsps, function(nsp) {
                                        if(_.findWhere(nsp.sockets, {id: socket.id})) {
                                            console.log("restoring socket to", nsp.name);
                                            nsp.connected[socket.id] = socket;
                                        }
                                    });*/
                                });
                            }else{
                                console.log(err);
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
                                        setTimeout(function(){
                                            socket.emit('meetingData', {joinUrl: meeting.join_url});
                                        },5000);
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
                    console.log('Disconnected!');
                    usersRepository.updateOnlineStatus(socket.userId, 'offline',socket.id,function(err, result){
                        socket.auth=false;
                        console.log("online status offline...");
                       /* _.each(io.nsps, function(nsp) {
                            if(_.findWhere(nsp.sockets, {id: socket.id})) {
                                console.log("restoring socket to", nsp.name);
                                nsp.connected[socket.id] = socket;
                            }
                        });*/
                    });
                });
            });
        }
    };
})();
