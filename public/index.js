var socket = io();
const form = document.querySelector("form");
const input = document.querySelector(".input");
var userList = [];

socket.on('update', function (users) {
    userList = users.filter(u => { return u != null; });
    document.getElementById('listId').innerHTML = '';;
    for (var i = 0; i < userList.length; i++) {
        var userlink = document.createElement('span');
        userlink.className = 'links';
        userlink.appendChild(document.createTextNode(userList[i]));
        userlink.onclick = function () {
            // document.getElementById('listId').style.display = "none";
            let currentUser = this.textContent;
            socket.emit('requestingUser', currentUser);
            socket.on('sendMessage', function(msg){
                console.log(msg, "sendMEssage");
                document.getElementById('listId').innerHTML = currentUser +'<br>'+ msg;
            });
            // document.getElementById('chatId').style.display = "block";
        };
        var div = document.createElement("div");
        div.setAttribute('class', 'users-list');
        div.appendChild(userlink);
        document.getElementById('listId').appendChild(div);
    }
});
function joinChat() {
    let user = document.getElementById('userName').value;
    console.log(user, "<------roomName----->");
    socket.emit('joinChat', user);
    userList += user;
    console.log(userList, "client");
    document.getElementById("fields-div").style.display = "none";
    document.getElementsByClassName("left-wrap")[0].style.display = "block";
}

// socket.on('sendMessage', function (msg) {
//     var div = document.createElement("div");
//     div.setAttribute('class', 'users-list');
//     div.appendChild(document.createTextNode(msg));
//     document.getElementsByClassName('left-wrap')[0].appendChild(div);
// })
// function beginChat() {
//     socket.emit('sendMessage', document.getElementById('userName').value);
// };
socket.on('groupChatMessage', function (msg) {
    var div = document.createElement("div");
    div.innerHTML = msg;
    document.body.appendChild(div);
});
socket.on('welcomeMessage', function (welcome) {
    console.log('welcomeMessage', welcome);
});