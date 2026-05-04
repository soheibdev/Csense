const progressService = require('./progress.service');

const submitModuleQuiz = async (req, res, next) => {
  try {
    const result = await progressService.submitModuleQuiz(
      req.user._id,
      req.params.id,   // moduleId from URL
      req.body.answers
    );
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const getMyProgress = async (req, res, next) => {
  try {
    const result = await progressService.getMyProgress(req.user._id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitModuleQuiz, getMyProgress };
