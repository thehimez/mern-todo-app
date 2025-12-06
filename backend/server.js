require("dotenv").config();  // <-- ADD THIS LINE FIRST

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// Connect to MongoDB (from Render environment variable)
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// Todo model
const Todo = mongoose.model(
  "Todo",
  new mongoose.Schema({
    text: String,
    completed: Boolean,
  })
);

// ===== ROUTES =====

// Get all todos
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// Add new todo
app.post("/todos", async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    completed: false,
  });
  res.json(todo);
});

// Toggle completed
app.put("/todos/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.completed = !todo.completed;
  await todo.save();
  res.json(todo);
});

// Delete TODO
app.delete("/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Todo deleted" });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
