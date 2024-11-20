import express from "express";
import bodyParser from "body-parser";
import { connectDB } from "./utils/db.js";
import Category from "./models/Category.js";
import Question from "./models/Question.js";
import { config } from "dotenv";

const app = express();
app.use(bodyParser.json());
config({
  path: "./.env",
});
// Connect to MongoDB
connectDB();

// Create a new category
app.post("/categories", async (req, res) => {
  const { name, description } = req.body;
  try {
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a question linked to a category
app.post("/questions", async (req, res) => {
  const { categoryId, question } = req.body;
  try {
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({ error: "Category not found" });
    }
    const newQuestion = new Question({ categoryId, question });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all questions for a specific category
app.get("/categories/:categoryId/questions", async (req, res) => {
  const { categoryId } = req.params;
  try {
    const questions = await Question.find({ categoryId }).populate(
      "categoryId",
      "name description"
    );
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
