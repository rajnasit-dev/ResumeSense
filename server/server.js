require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/database");
const mongoose = require("mongoose")

// connectToDB();

let isConnected = false;

async function connectToMongoDB() {
    // If already connected and socket is active, don't reconnect
    if (isConnected && mongoose.connection.readyState === 1) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB: ", error);
        throw error; // Re-throw so the middleware can handle the failure
    }
}

app.use(async (req, res, next) => {
    try {
        await connectToMongoDB();
        next();
    } catch (error) {
        res.status(500).json({ error: "Database connection failed" });
    }
});

module.exports = app
// app.listen(3000, () => {
//     console.log("Server is running on port 3000");
// });