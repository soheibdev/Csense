const router = require('express').Router();
const moduleCtrl = require('./module.controller');
const progressCtrl = require('../progress/progress.controller');
const { authenticate } = require('../../middleware/auth');
const { requireUser } = require('../../middleware/roleGuard');
const { validate } = require('../../middleware/validate');
const Joi = require('joi');

const submitQuizSchema = Joi.object({
  answers: Joi.array()
    .items(Joi.number().integer().min(0).max(3))
    .length(5)
    .required()
    .messages({
      'array.length': 'You must answer all 5 questions',
    }),
});

// All routes require authenticated employee
router.use(authenticate, requireUser);

router.get('/', moduleCtrl.getUserModules);
router.get('/:id', moduleCtrl.getUserModuleContent);
router.post('/:id/quiz/submit', validate(submitQuizSchema), progressCtrl.submitModuleQuiz);

module.exports = router;
