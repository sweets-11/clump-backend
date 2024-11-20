import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  question: { type: String, required: true },
});

const Question = mongoose.model("Question", questionSchema);

export default Question;
