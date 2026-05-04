const router = require('express').Router();
const controller = require('./finalTest.controller');
const { authenticate } = require('../../middleware/auth');
const { requireAdmin } = require('../../middleware/roleGuard');
const { validate } = require('../../middleware/validate');
const Joi = require('joi');

const questionSchema = Joi.object({
  text: Joi.string().min(5).required(),
  options: Joi.array().items(Joi.string().min(1)).length(4).required(),
  correctIndex: Joi.number().integer().min(0).max(3).required(),
  explanation: Joi.string().allow('').default(''),
  moduleNumber: Joi.number().integer().min(1).max(6).allow(null).default(null),
});

const finalTestSchema = Joi.object({
  title: Joi.string().min(3).default('Final Security Assessment'),
  description: Joi.string().allow('').default(''),
  questions: Joi.array().items(questionSchema).length(15).required().messages({
    'array.length': 'Final test must have exactly 15 questions',
  }),
  passingScore: Joi.number().min(0).max(100).default(70),
});

const updateFinalTestSchema = Joi.object({
  title: Joi.string().min(3),
  description: Joi.string().allow(''),
  questions: Joi.array().items(questionSchema).length(15).messages({
    'array.length': 'Final test must have exactly 15 questions',
  }),
  passingScore: Joi.number().min(0).max(100),
}).min(1);

router.use(authenticate, requireAdmin);

router.get('/', controller.getFinalTestAdmin);
router.post('/', validate(finalTestSchema), controller.createFinalTest);
router.put('/', validate(updateFinalTestSchema), controller.updateFinalTest);

module.exports = router;
