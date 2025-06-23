import mongoose from "mongoose";

const chatterupSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Name is required']
	},
	message: String,
	time: Date,
});

export const Chat = mongoose.model("Chat", chatterupSchema);
