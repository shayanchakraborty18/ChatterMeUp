import  mongoose from "mongoose";

const db_link = process.env.DB_URL || `mongodb://0.0.0.0:27017` || `mongodb://localhost:27017`;

export const connectToDatabase = async () => {
	try {
		await mongoose.connect(`${db_link}/chatterup`);
		console.log("MongoDB Connection Successful");
	} catch (err) {
		console.error("Error in MongoDB Connection ", err);
	}
}