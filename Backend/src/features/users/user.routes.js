const router = require('express').Router();
const controller = require('./user.controller');
const { authenticate } = require('../../middleware/auth');
const { requireAdmin } = require('../../middleware/roleGuard');
const { validate } = require('../../middleware/validate');
const Joi = require('joi');

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters',
  }),
  role: Joi.string().valid('user', 'admin').default('user'),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  password: Joi.string().min(8),
  isActive: Joi.boolean(),
}).min(1);

// All routes require admin authentication
router.use(authenticate, requireAdmin);

router.get('/', controller.getAllUsers);
router.post('/', validate(createUserSchema), controller.createUser);
router.get('/:id', controller.getUserById);
router.put('/:id', validate(updateUserSchema), controller.updateUser);
router.delete('/:id', controller.deleteUser);
router.get('/:id/progress', controller.getUserProgress);

module.exports = router;
