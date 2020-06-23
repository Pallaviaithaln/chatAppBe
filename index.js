let socket = io();
let msgs = '';
document.getElementById("sendBtn").onclick = function() {beginChat()};
function beginChat() {
    msgs += document.getElementById('textName').value + '<br/>';
    document.getElementById('message-container').innerHTML = msgs;
    socket.emit('sendMessage', msgs);
};

// socket.emit('join',
//     io.to('gazoole').emit('chat')
// );
socket.on('newMessage', function (message) {
    console.log(message, "broadcasting")
})
// socket.emit('chat',{
//     user:"Admin",
//     text:"welcome to palsApp"
// });


