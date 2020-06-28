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

/*

array of objects with user name and socket id

get only users who are online except current logged in user

on request, send msg to the respected socket id and get a msg about the response

---> on request : "request sent" display in the logged in socket (from)
                  "accept request" to be displayed in the other socket (to)
---> on accept  : begin chat by creating room between 2

*/
var users = [];
io.on('connection', function (socket) {
    socket.on('joinChat', function (user) {
        socket.user = user;
        console.log(user, socket.id, 'connected');
        users.push(user);
        updateClients();
        socket.emit('welcomeMessage', {
            user: "Admin",
            text: "welcome to palsApp"
        });
        console.log('message sent')
    });
    socket.on('requestingUser', function (user) {
        // socket.broadcast.to(socket.id).emit('sendMessage', 'for your eyes only');
        socket.emit('sendMessage', user + '<--- Request sent from --->' + socket.user);
    });

    socket.on('acceptingUser', function (user) {
        socket.emit('sendMessage', socket.user + '<--- Accepted Request from' + user + 'and begin chat---->')
    })

    socket.on('requestChat', (data => {
        if (data.length <= 2) {
            socket.broadcast.emit('sendMessage', 'Request accepted');
            socket.join(room);
            socket.on('sendMessage', (message => {
                io.in(room).emit('personalChatMsg', message);
            }));
        }
        else {
            let userList = users.filter(u => { return u !== socket.user; });
            users = userList;
            socket.emit('disconnected');
            updateClients();
        };
    }));
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
