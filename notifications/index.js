/**
 * Created by Victor on 27/08/2015.
 */

(function() {

    var usersRepository     = require('../repositories').Users;
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
