const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    const MONGO_URI = "mongodb+srv://ngntr:6YE99mWcWgdRkwuB@cluster0.vbkjc.mongodb.net/"; // Replace with your MongoDB URI
    await mongoose.connect(MONGO_URI); // No need to include deprecated options
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1); // Exit the application on connection failure
  }
};

module.exports = connectToDatabase;
