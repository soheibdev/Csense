const FinalTest = require('./finalTest.model');

const createFinalTest = async (data) => {
  const existing = await FinalTest.findOne();
  if (existing) {
    const err = new Error('Final test already exists. Use PUT to update it.');
    err.status = 409;
    throw err;
  }
  return FinalTest.create(data);
};

const getFinalTest = async () => {
  const test = await FinalTest.findOne();
  if (!test) {
    const err = new Error('Final test has not been created yet');
    err.status = 404;
    throw err;
  }
  return test;
};

const updateFinalTest = async (data) => {
  const test = await FinalTest.findOne();
  if (!test) {
    const err = new Error('Final test not found');
    err.status = 404;
    throw err;
  }
  Object.assign(test, data);
  await test.save();
  return test;
};

// For users: strip correct answers
const getFinalTestForUser = async () => {
  const test = await getFinalTest();

  const sanitized = test.questions.map((q) => ({
    _id: q._id,
    text: q.text,
    options: q.options,
    moduleNumber: q.moduleNumber,
  }));

  return {
    _id: test._id,
    title: test.title,
    description: test.description,
    totalQuestions: test.questions.length,
    passingScore: test.passingScore,
    questions: sanitized,
  };
};

module.exports = { createFinalTest, getFinalTest, updateFinalTest, getFinalTestForUser };
