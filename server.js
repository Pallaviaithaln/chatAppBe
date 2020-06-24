const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const port = process.env.PORT || 3000
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
// let msgs = '';
io.on('connection', function (socket) {
    socket.on('joinGroup', function (room) {
        socket.join(room);
        socket.on('sendMessage', function (message) {
            io.in(room).emit('groupChatMessage', message);
        });
    })
    // socket.join('game');
    // socket.on('sendMessage', function (message) {
    //     // io.emit('groupChatMessage', message);
    //     io.in('game').emit('groupChatMessage', message);
    //     console.log(message, "sendMessage");
    // });
    socket.emit('welcomeMessage', {
        user: "Admin",
        text: "welcome to palsApp"
    });
    socket.broadcast.emit('groupChat', {
        user: "admin",
        text: "HI ALLLL new member joined"
    })
    console.log('message sent')
    socket.on('disconnect', () => {
        console.log('disconnected');
    });
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})
