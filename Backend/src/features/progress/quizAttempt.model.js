const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    refId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // Quiz _id or FinalTest _id
    },
    type: {
      type: String,
      enum: ['module', 'final'],
      required: true,
    },
    moduleNumber: { type: Number, default: null }, // null for final test
    answers: [{ type: Number }], // indices of selected options
    score: { type: Number, required: true },       // correct count
    percentage: { type: Number, required: true },  // score / total * 100
    passed: { type: Boolean, required: true },
    totalQuestions: { type: Number, required: true },
  },
  { timestamps: true }
);

quizAttemptSchema.index({ userId: 1, type: 1 });
quizAttemptSchema.index({ userId: 1, refId: 1 });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
