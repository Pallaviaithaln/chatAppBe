var socket = io();
const form = document.querySelector("form");
const input = document.querySelector(".input");
var userList = [];
socket.on('update', function (users) {
    userList = users.filter(u => { return u != null; });
    document.getElementById('listId').innerHTML = '';                                                                                                              ;
    for (var i = 0; i < userList.length; i++) {
        var a = document.createElement('a');
        a.className = 'links';
        a.text = userList[i];
        a.href = "chat.html";
        console.log(a, "anchor");
        var link = document.querySelectorAll("a");
        console.log(link, "i am here")
        link.onclick = function () {
            document.getElementById('chatId').style.display = "block";
        };
        var div = document.createElement("div");
        div.setAttribute('class', 'users-list');
        div.appendChild(document.createTextNode((userList[i])));
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
socket.on('sendMessage', function (msg) {
    var div = document.createElement("div");
    div.setAttribute('class', 'users-list');
    div.appendChild(document.createTextNode(msg));
    document.getElementsByClassName('left-wrap')[0].appendChild(div);
})
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