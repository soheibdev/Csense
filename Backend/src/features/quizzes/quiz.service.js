const Quiz = require('./quiz.model');
const Module = require('../modules/module.model');

const createOrUpdateQuiz = async (moduleId, { questions, passingScore }) => {
  const mod = await Module.findById(moduleId);
  if (!mod) {
    const err = new Error('Module not found');
    err.status = 404;
    throw err;
  }

  const quiz = await Quiz.findOneAndUpdate(
    { moduleId },
    { moduleId, moduleNumber: mod.number, questions, passingScore },
    { new: true, upsert: true, runValidators: true }
  );

  return quiz;
};

const getQuizByModuleId = async (moduleId) => {
  const quiz = await Quiz.findOne({ moduleId });
  if (!quiz) {
    const err = new Error('No quiz found for this module');
    err.status = 404;
    throw err;
  }
  return quiz;
};

// For users: strip correct answers
const getQuizForUser = async (moduleId) => {
  const quiz = await getQuizByModuleId(moduleId);

  const sanitized = quiz.questions.map((q) => ({
    _id: q._id,
    text: q.text,
    options: q.options,
    // correctIndex intentionally excluded
  }));

  return {
    _id: quiz._id,
    moduleId: quiz.moduleId,
    moduleNumber: quiz.moduleNumber,
    totalQuestions: quiz.questions.length,
    passingScore: quiz.passingScore,
    questions: sanitized,
  };
};

module.exports = { createOrUpdateQuiz, getQuizByModuleId, getQuizForUser };
