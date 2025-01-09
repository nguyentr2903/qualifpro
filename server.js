const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const appRoutes = require("./app");
const taskRoutes = require("./routes/tasks");
const goalsRoutes = require("./routes/goals");
const eventsRouter = require("./routes/events");
const statsRouter = require("./routes/stats");
const locationRouter = require("./routes/geocode");
const { scheduleTaskNotifications } = require("./cronScheduler");
const { scheduleGoalNotifications } = require("./cronScheduler");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Serve static files
app.use(express.static("public"));

// Routes
app.use("/", appRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/events", eventsRouter);
app.use("/api/stats", statsRouter);
app.use("/api/geocode", locationRouter);

// 404 Error Handler
app.use((req, res) => {
  res.status(404).render("404", { message: "Page Not Found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});


// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI is not defined in environment variables.");
  process.exit(1); // Exit if the database URI is missing
}

mongoose
  .connect(MONGO_URI, { socketTimeoutMS: 30000, connectTimeoutMS: 30000 })
  .then(() => {
    console.log("Connected to MongoDB");

    // Start the cron scheduler after MongoDB is connected
    scheduleTaskNotifications();
    scheduleGoalNotifications();
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit on database connection failure
  });
