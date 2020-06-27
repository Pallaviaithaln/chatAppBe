const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const port = process.env.PORT || 3000
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
app.use(express.static(path.join(__dirname, 'public')));
// let msgs = '';
var users = [];
io.on('connection', function (socket) {
    socket.on('joinChat', function (user) {
        socket.user = user;
        console.log(user, socket.user, 'connected');
        users.push(user);
        updateClients();
        socket.emit('welcomeMessage', {
            user: "Admin",
            text: "welcome to palsApp"
        });
        console.log('message sent')
    });
    // socket.on('joinGroup', function (room) {
    //     socket.join(room);
    //     socket.on('sendMessage', function (message) {
    //         io.in(room).emit('groupChatMessage', message);
    //     });
    // });
    socket.on('disconnect', function () {
        console.log(users, socket.user, "diconnecting")
        // users.filter(u=>u!=socket.user);
        for (var i = 0; i < users.length; i++) {
            if (users[i] == socket.user) {
                delete users[i];
            }
        }
        updateClients();
    });
    function updateClients() {
        console.log(users, 'update');
        io.sockets.emit('update', users);
    }
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})
