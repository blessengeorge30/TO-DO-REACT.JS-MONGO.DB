const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = "mongodb://127.0.0.1:27017/test";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

const TaskSchema = new mongoose.Schema({
  listName: String,
  tasks: [
    {
      text: String,
      completed: Boolean,
    },
  ],
});

const TaskModel = mongoose.model("Task", TaskSchema);

// Create or update a to-do list
app.post("/tasks", async (req, res) => {
  const { listName, tasks } = req.body;
  const existingList = await TaskModel.findOne({ listName });

  if (existingList) {
    existingList.tasks = tasks;
    await existingList.save();
  } else {
    await TaskModel.create({ listName, tasks });
  }
  res.send({ message: "Task list updated" });
});

// Get tasks by list name
app.get("/tasks/:listName", async (req, res) => {
  const listName = req.params.listName;
  const tasks = await TaskModel.findOne({ listName });
  res.json(tasks || { listName, tasks: [] });
});

// **Updated: Get all task lists with tasks**
app.get("/tasks", async (req, res) => {
  try {
    const allLists = await TaskModel.find({}, "listName tasks");
    res.json(allLists);
  } catch (error) {
    res.status(500).json({ error: "Error fetching all lists" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
