const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: true,
    },
    moduleNumber: { type: Number, required: true },
    status: {
      type: String,
      enum: ['locked', 'in_progress', 'completed'],
      default: 'locked',
    },
    quizScore: { type: Number, default: 0 },      // number of correct answers
    quizPercentage: { type: Number, default: 0 },  // percentage
    quizPassed: { type: Boolean, default: false },
    attempts: { type: Number, default: 0 },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userProgressSchema.index({ userId: 1, moduleId: 1 }, { unique: true });
userProgressSchema.index({ userId: 1, moduleNumber: 1 });

module.exports = mongoose.model('UserProgress', userProgressSchema);
