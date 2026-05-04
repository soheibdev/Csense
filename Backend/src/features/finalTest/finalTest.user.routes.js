const router = require('express').Router();
const controller = require('./finalTest.controller');
const { authenticate } = require('../../middleware/auth');
const { requireUser } = require('../../middleware/roleGuard');
const { validate } = require('../../middleware/validate');
const Joi = require('joi');

const submitSchema = Joi.object({
  answers: Joi.array()
    .items(Joi.number().integer().min(0).max(3))
    .length(15)
    .required()
    .messages({
      'array.length': 'You must answer all 15 questions',
    }),
});

router.use(authenticate, requireUser);

router.get('/', controller.getFinalTestUser);
router.post('/submit', validate(submitSchema), controller.submitFinalTest);

module.exports = router;
