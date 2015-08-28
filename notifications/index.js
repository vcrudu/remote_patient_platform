/**
 * Created by Victor on 27/08/2015.
 */
module.exports={
    init:function(server){
        var io = require('socket.io')(server);
        io.on('connection',function(socket){
           console.log("Client connected...");
            socket.emit('notification',{message:'world!'});
            socket.on('messages',function(data){
                console.log(data);
            });
            socket.on('disconnect',function(){
                console.log('Disconnected!');
            });
        });
    }
};