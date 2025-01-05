const express = require("express");
const mongoose = require("mongoose");
const Goal = require('./models/Goal'); // Update the path if needed
const Task = require('./models/Task'); // Ensure Task is imported as well if needed
const router = express.Router();
const connectToDatabase = require("./db/database");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI;
const client = new MongoClient(MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


// Call the connection function when the application starts
(async () => {
  await connectToDatabase();
})();

// Application Routes
router.get("/", async (req, res) => {
  try {
    // Fetch tasks that have a valid location
    const nearbyTasks = await Task.find({ "task_location.address": { $ne: "" } }).limit(5); // Example query

    // Pass the data to the EJS template
    res.render("index", { 
      title: "Home", 
      nearbyTasks 
    });
  } catch (error) {
    console.error("Error fetching nearby tasks:", error);
    res.status(500).send("An error occurred");
  }
});


router.get("/dashboard", async (req, res) => {
  try {
    const goals = await Goal.find({}).select(
      "title description due_date goal_location subtasks progress priority completed"
    );
    const nearbyTasks = await Task.find({ task_location: { $ne: null, $ne: "" } }).select("title description due_date due_time priority task_location");
  
    res.render("dashboard", {
      goals, // Ensure goals are passed
      nearbyTasks, // Ensure nearbyTasks are passed
      currentDate: new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }),
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).send("Internal Server Error");
  }
});





router.get("/settings/", (req, res) => {
  res.render("settings", {
    title: "PlanCake - Settings",
    activeSection: "tasks-goals",
  });
});

router.get("/logout", (req, res) => {
  res.redirect("/");
});



module.exports = router;
