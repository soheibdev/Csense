const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    options: {
      type: [String],
      validate: [(arr) => arr.length === 4, 'Each question must have exactly 4 options'],
      required: true,
    },
    correctIndex: { type: Number, required: true, min: 0, max: 3 },
    explanation: { type: String, default: '' },
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: true,
      unique: true,
    },
    moduleNumber: { type: Number, required: true },
    questions: {
      type: [questionSchema],
      validate: [(arr) => arr.length === 5, 'Module quiz must have exactly 5 questions'],
    },
    passingScore: { type: Number, default: 80 }, // percentage (4/5 = 80%)
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
