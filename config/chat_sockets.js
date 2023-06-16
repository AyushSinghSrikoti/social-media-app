module.exports.chatSockets = function (socketServer) {
    let io = require('socket.io')(socketServer, {
        cors: {
            origin: 'http://localhost:8080', // Replace with the appropriate origin
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true // Add this line to allow credentials
        }
    });

    io.sockets.on('connection', function (socket) {
        console.log('new connection received', socket.id);

        socket.on('disconnect' , function(){
            console.log('socket disconnected');
        });

        socket.on('join room' , function(data){
            console.log('joining request received' , data);
            socket.join(data.chatroom);

            io.in(data.chatroom).emit('user joined' , data);
        })

        socket.on('send_message', function(data){
            io.in(data.chatroom).emit('receive_message', data);
        });

        
    });


}
