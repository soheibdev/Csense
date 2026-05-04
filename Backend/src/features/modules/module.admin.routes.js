const router = require('express').Router();
const moduleCtrl = require('./module.controller');
const quizCtrl = require('../quizzes/quiz.controller');
const { authenticate } = require('../../middleware/auth');
const { requireAdmin } = require('../../middleware/roleGuard');
const { validate } = require('../../middleware/validate');
const { uploadImage, uploadVideo } = require('../../config/cloudinary');
const Joi = require('joi');

const moduleSchema = Joi.object({
  number: Joi.number().integer().min(1).max(6).required(),
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().min(10).required(),
  content: Joi.string().min(20).required(),
  isActive: Joi.boolean().default(true),
});

const updateModuleSchema = Joi.object({
  title: Joi.string().min(3).max(200),
  description: Joi.string().min(10),
  content: Joi.string().min(20),
  isActive: Joi.boolean(),
}).min(1);

const questionSchema = Joi.object({
  text: Joi.string().min(5).required(),
  options: Joi.array().items(Joi.string().min(1)).length(4).required(),
  correctIndex: Joi.number().integer().min(0).max(3).required(),
  explanation: Joi.string().allow('').default(''),
});

const quizSchema = Joi.object({
  questions: Joi.array().items(questionSchema).length(5).required().messages({
    'array.length': 'Quiz must have exactly 5 questions',
  }),
  passingScore: Joi.number().min(0).max(100).default(80),
});

// All routes are admin-protected
router.use(authenticate, requireAdmin);

// Module CRUD
router.get('/', moduleCtrl.getAllModules);
router.post('/', validate(moduleSchema), moduleCtrl.createModule);
router.get('/:id', moduleCtrl.getModuleById);
router.put('/:id', validate(updateModuleSchema), moduleCtrl.updateModule);
router.delete('/:id', moduleCtrl.deleteModule);

// Media upload (uses Cloudinary)
router.post('/:id/images', uploadImage.array('images', 5), moduleCtrl.addImages);
router.delete('/:id/images/:imageId', moduleCtrl.removeImage);
router.post('/:id/video', uploadVideo.single('video'), moduleCtrl.uploadVideo);

// Quiz management (nested under module)
router.get('/:moduleId/quiz', quizCtrl.getQuizForAdmin);
router.post('/:moduleId/quiz', validate(quizSchema), quizCtrl.createOrUpdateQuiz);

module.exports = router;
