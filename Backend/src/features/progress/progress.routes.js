const router = require('express').Router();
const controller = require('./progress.controller');
const { authenticate } = require('../../middleware/auth');
const { requireUser } = require('../../middleware/roleGuard');

router.use(authenticate, requireUser);

router.get('/', controller.getMyProgress);

module.exports = router;
