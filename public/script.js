const socket = io.connect();

const myPrompt = document.getElementById('my-prompt');
const userName = document.getElementById('name');
const message = document.getElementById('text-message');
const sendMessage = document.getElementById('message-form');
const welcome = document.getElementById('welcome');
const onlineUsers = document.getElementById('online-user');
const userCount = document.getElementById('count');
const messageList = document.getElementById("message-list");
const oldMsg = document.createElement("div");

//on page load
document.addEventListener('DOMContentLoaded', () => {
	myPrompt.style.display = 'flex';
});

// on submit prompt form we will join the user
myPrompt.addEventListener("submit", (event) => {
	event.preventDefault();
	welcome.innerText = "Welcome " + userName.value;
	myPrompt.style.display = "none";
	socket.emit("join", userName.value);
});
//Event: Online users and get all messages
socket.on("onlineUser", (users) => {
	onlineUsers.innerHTML = '';
	userCount.innerText = `Online (${users.length})`;
	users && users.map((user) => {
		const  img = (user.id == socket.id && user.name == userName.value) ? 'me.jpg' : 'face.png';
		const newUser = document.createElement("div");
		newUser.innerHTML = `<div class="user">
                            <img src="images/${img}" alt="R">
                            <p>${user.name}</p>
                            <span class="online-dot"></span>
                            <p id="${user.id}" class="typing"><p>
                    </div>`;
		onlineUsers.appendChild(newUser);
	});
});

// Event Listner : retrive old messages
socket.on("joined", (messages) => {
	messages.forEach((message) => {
		const timestamp = new Date(message.time);
		oldMsg.innerHTML = `
        <div class="message-block" >
            <img src="images/face.png" alt="pic">
            <div class="message-content">
                <span class="name" >${message.name}</span>
                <span class="timestamp">${timestamp.getHours()}:${timestamp.getMinutes()}</span>
                <div class="message" >${message.message}</div>
                
            </div>
        </div>`;
		messageList.appendChild(oldMsg);
	});
	scrollToBottom();
});

//typing
let isTyping = false;
message.addEventListener('input', (evt) => {
	if(!isTyping) {
		isTyping = true;
		socket.emit("typing", userName.value);
		setTimeout(() => { isTyping = false }, 2000);
	}
});

//Listner : typing
socket.on("typing", (userData) => {
	document.getElementById(userData.id).innerText =  "typing...";
	setTimeout(() => {
		document.getElementById(userData.id).innerText =  "";
	}, 2000)
});

// send message to server
sendMessage.addEventListener("submit", (evt) => {
	evt.preventDefault();
	const msgData = { userName: userName.value, message: message.value }
	socket.emit("sendMessage", msgData);
	message.value = "";
});

//Listner: new message
socket.on("newMessage", (obj) => {
	// console.log(obj);
	const newMessage = obj.msg;
	const socketId = obj.socketId;
	const messageList = document.getElementById("message-list");
	const msg = document.createElement("div");
	const timestamp = new Date(newMessage.time);
	if (socketId == socket.id) {
		msg.innerHTML = `
        <div class="message-block-user">
            <img src="images/me.jpg" alt="pic">
            <div class="message-content" style="background-color: #6b63e1; color: white;">
                <span class="name" style="color:white;">${
			newMessage.name
		}</span>
                <span class="timestamp">${timestamp.getHours()}:${timestamp.getMinutes()}</span>
                <div class="message">${newMessage.message}</div>
                
            </div>
        </div>`;
		messageList.appendChild(msg);
	} else {
		msg.innerHTML = `
        <div class="message-block">
            <img src="images/face.png" alt="pic">
            <div class="message-content">
                <span class="name">${newMessage.name}</span>
                <span class="timestamp">Sent ${timestamp.getHours()}:${timestamp.getMinutes()}</span>
                <div class="message">${newMessage.message}</div>
                
            </div>
        </div>`;
		messageList.appendChild(msg);
	}
	scrollToBottom();
});


function scrollToBottom() {
	const messageList = document.getElementById("message-list");
	messageList.scrollTop = messageList.scrollHeight;
}