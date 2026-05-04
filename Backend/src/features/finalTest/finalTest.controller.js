const finalTestService = require('./finalTest.service');
const progressService = require('../progress/progress.service');

// Admin controllers
const createFinalTest = async (req, res, next) => {
  try {
    const test = await finalTestService.createFinalTest(req.body);
    res.status(201).json({ success: true, message: 'Final test created', data: test });
  } catch (err) {
    next(err);
  }
};

const getFinalTestAdmin = async (req, res, next) => {
  try {
    const test = await finalTestService.getFinalTest();
    res.json({ success: true, data: test });
  } catch (err) {
    next(err);
  }
};

const updateFinalTest = async (req, res, next) => {
  try {
    const test = await finalTestService.updateFinalTest(req.body);
    res.json({ success: true, message: 'Final test updated', data: test });
  } catch (err) {
    next(err);
  }
};

// User controllers
const getFinalTestUser = async (req, res, next) => {
  try {
    const test = await finalTestService.getFinalTestForUser();
    res.json({ success: true, data: test });
  } catch (err) {
    next(err);
  }
};

const submitFinalTest = async (req, res, next) => {
  try {
    const result = await progressService.submitFinalTest(req.user._id, req.body.answers);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = { createFinalTest, getFinalTestAdmin, updateFinalTest, getFinalTestUser, submitFinalTest };
