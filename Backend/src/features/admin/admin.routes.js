const router = require('express').Router();
const controller = require('./admin.controller');
const { authenticate } = require('../../middleware/auth');
const { requireAdmin } = require('../../middleware/roleGuard');

router.use(authenticate, requireAdmin);

router.get('/stats', controller.getStats);

module.exports = router;
