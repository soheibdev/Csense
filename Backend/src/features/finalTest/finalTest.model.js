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
    moduleNumber: { type: Number, default: null }, // which module this question covers
  },
  { _id: true }
);

const finalTestSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'Final Security Assessment' },
    description: { type: String, default: '' },
    questions: {
      type: [questionSchema],
      validate: [(arr) => arr.length === 15, 'Final test must have exactly 15 questions'],
    },
    passingScore: { type: Number, default: 70 }, // percentage (11/15 ≈ 73%)
  },
  { timestamps: true }
);

module.exports = mongoose.model('FinalTest', finalTestSchema);
