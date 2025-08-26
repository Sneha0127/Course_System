const mongoose = require("mongoose");

// Single quiz question (with 4 options and correct answer)
const quizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }], 
  correctAnswer: { type: String, required: true }
});

const quesSetSchema = new mongoose.Schema({
  title: { type: String, required: true },    
  type: { type: String, default: "quiz" },     
  quiz: [quizSchema]                     
});

// Module Schema
const moduleSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  title: { type: String, required: true },     
  description: String,
  order: Number,
  quesSet: [quesSetSchema],            // holds ques1 quess2...
  unlockedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default:[]
    }
  ]
});

module.exports = mongoose.model("Module", moduleSchema);
