require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/database");
const mongoose = require("mongoose")

connectToDB();

let isConnected = false;

async function connectToMongoDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB: ",error);
    }
}

app.use(async (req, res, next) => {
    if(!isConnected){
        connectToMongoDB();
    }
    next();
})

module.exports = app
// app.listen(3000, () => {
//     console.log("Server is running on port 3000");
// });