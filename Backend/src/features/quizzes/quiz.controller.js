const quizService = require('./quiz.service');

// Admin: get quiz with correct answers
const getQuizForAdmin = async (req, res, next) => {
  try {
    const quiz = await quizService.getQuizByModuleId(req.params.moduleId);
    res.json({ success: true, data: quiz });
  } catch (err) {
    next(err);
  }
};

// Admin: create or update quiz
const createOrUpdateQuiz = async (req, res, next) => {
  try {
    const quiz = await quizService.createOrUpdateQuiz(req.params.moduleId, req.body);
    res.json({ success: true, message: 'Quiz saved successfully', data: quiz });
  } catch (err) {
    next(err);
  }
};

// User: get quiz without correct answers
const getQuizForUser = async (req, res, next) => {
  try {
    const quiz = await quizService.getQuizForUser(req.params.moduleId);
    res.json({ success: true, data: quiz });
  } catch (err) {
    next(err);
  }
};

module.exports = { getQuizForAdmin, createOrUpdateQuiz, getQuizForUser };
