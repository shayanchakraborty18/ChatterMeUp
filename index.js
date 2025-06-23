import {server} from "./server.js";
import {connectToDatabase} from "./dbconfig.js";


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
	console.log(`App is listening on port ${PORT}`);
	connectToDatabase();
})