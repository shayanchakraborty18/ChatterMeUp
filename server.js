import express from "express";
import cors from "cors";
import http from "http";
import {Server, Socket} from "socket.io";
import path from "path";
import { Chat } from "./chatterup.schema.js";
import dotenv from 'dotenv';
dotenv.config();

const app = express();

//apply cors
app.use(cors());

// setup static folder
app.use(express.static(path.resolve("public")));

//1. create server
export const server = http.createServer(app);

// 2. create socket server
const io = new Server(server,  {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});

// home route setup
app.get("/", (req, res, next) => {
	res.sendFile(path.resolve('index.html'));
})

let onlineUsers = [];

// socket implementation
io.on('connect', (socket) => {
	console.log('Connection is established');


	// Event: New User joins
	socket.on("join", async (name) => {
		// console.log(name);
		const oldMessages = await Chat.find();
		onlineUsers.push({ id: socket.id, name: name });
		io.emit("onlineUser", onlineUsers);
		socket.emit("joined", oldMessages);
	});

	// Event: Typing
	socket.on("typing", (name) => {
		io.emit("typing", {id: socket.id, name: name});
	});

	//Listner : send message
	socket.on("sendMessage", async (newMessage) => {
		if(!newMessage.userName) return;

		const msg = await Chat.create({
			name: newMessage.userName,
			message: newMessage.message,
			time: new Date()
		});
		io.emit("newMessage", {socketId: socket.id, msg});
	});


	socket.on("disconnect", () => {
		console.log("Connection is disconnected");
		const userIndexToRemove = onlineUsers.findIndex((user) => user.id == socket.id);
		onlineUsers.splice(userIndexToRemove, 1);
		io.emit("onlineUser", onlineUsers);
	})
})








