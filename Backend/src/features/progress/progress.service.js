const UserProgress = require('./progress.model');
const QuizAttempt = require('./quizAttempt.model');
const Quiz = require('../quizzes/quiz.model');
const FinalTest = require('../finalTest/finalTest.model');

// ── Module Quiz Submission ─────────────────────────────────────

const submitModuleQuiz = async (userId, moduleId, answers) => {
  // 1. Verify the module is accessible for this user
  const progress = await UserProgress.findOne({ userId, moduleId });
  if (!progress) {
    const err = new Error('Module progress not found');
    err.status = 404;
    throw err;
  }
  if (progress.status === 'locked') {
    const err = new Error('This module is locked. Complete the previous module first.');
    err.status = 403;
    throw err;
  }
  if (progress.quizPassed) {
    const err = new Error('You have already passed this quiz');
    err.status = 400;
    throw err;
  }

  // 2. Load quiz with correct answers
  const quiz = await Quiz.findOne({ moduleId });
  if (!quiz) {
    const err = new Error('Quiz not found for this module');
    err.status = 404;
    throw err;
  }
  if (answers.length !== quiz.questions.length) {
    const err = new Error(`Expected ${quiz.questions.length} answers, got ${answers.length}`);
    err.status = 400;
    throw err;
  }

  // 3. Grade each question
  let correct = 0;
  const details = quiz.questions.map((q, i) => {
    const isCorrect = Number(answers[i]) === Number(q.correctIndex);
    if (isCorrect) correct++;
    return {
      questionId: q._id,
      questionText: q.text,
      selectedIndex: answers[i],
      correctIndex: q.correctIndex,
      isCorrect,
      explanation: q.explanation || '',
    };
  });

  const totalQuestions = quiz.questions.length;
  const percentage = Math.round((correct / totalQuestions) * 100);
  const passed = percentage >= quiz.passingScore;

  // 4. Save the attempt
  await QuizAttempt.create({
    userId,
    refId: quiz._id,
    type: 'module',
    moduleNumber: quiz.moduleNumber,
    answers,
    score: correct,
    percentage,
    passed,
    totalQuestions,
  });

  // 5. Update user progress
  progress.attempts += 1;
  progress.quizScore = correct;
  progress.quizPercentage = percentage;

  if (passed) {
    progress.quizPassed = true;
    progress.status = 'completed';
    progress.completedAt = new Date();

    // Unlock next module
    const nextProgress = await UserProgress.findOne({
      userId,
      moduleNumber: quiz.moduleNumber + 1,
    });
    if (nextProgress && nextProgress.status === 'locked') {
      nextProgress.status = 'in_progress';
      await nextProgress.save();
    }
  }

  await progress.save();

  return {
    passed,
    score: correct,
    percentage,
    totalQuestions,
    passingScore: quiz.passingScore,
    attempts: progress.attempts,
    details,
    ...(passed && { message: 'Congratulations! Module completed. Next module is now unlocked.' }),
    ...(!passed && {
      message: `You scored ${percentage}%. Passing score is ${quiz.passingScore}%. Please retry.`,
    }),
  };
};

// ── Final Test Submission ──────────────────────────────────────

const submitFinalTest = async (userId, answers) => {
  // 1. Ensure all modules are completed
  const allProgress = await UserProgress.find({ userId });
  if (allProgress.length === 0) {
    const err = new Error('No modules found for this user');
    err.status = 403;
    throw err;
  }
  const incomplete = allProgress.filter((p) => !p.quizPassed);
  if (incomplete.length > 0) {
    const err = new Error(
      `Complete all modules before taking the final test. Remaining: modules ${incomplete.map((p) => p.moduleNumber).join(', ')}`
    );
    err.status = 403;
    throw err;
  }

  // 2. Load final test
  const finalTest = await FinalTest.findOne();
  if (!finalTest) {
    const err = new Error('Final test has not been created yet');
    err.status = 404;
    throw err;
  }
  if (answers.length !== finalTest.questions.length) {
    const err = new Error(`Expected ${finalTest.questions.length} answers, got ${answers.length}`);
    err.status = 400;
    throw err;
  }

  // 3. Grade
  let correct = 0;
  const details = finalTest.questions.map((q, i) => {
    const isCorrect = Number(answers[i]) === Number(q.correctIndex);
    if (isCorrect) correct++;
    return {
      questionId: q._id,
      questionText: q.text,
      selectedIndex: answers[i],
      correctIndex: q.correctIndex,
      isCorrect,
      explanation: q.explanation || '',
      moduleNumber: q.moduleNumber,
    };
  });

  const totalQuestions = finalTest.questions.length;
  const percentage = Math.round((correct / totalQuestions) * 100);
  const passed = percentage >= finalTest.passingScore;

  // 4. Save attempt
  const attempt = await QuizAttempt.create({
    userId,
    refId: finalTest._id,
    type: 'final',
    moduleNumber: null,
    answers,
    score: correct,
    percentage,
    passed,
    totalQuestions,
  });

  return {
    passed,
    score: correct,
    percentage,
    totalQuestions,
    passingScore: finalTest.passingScore,
    attemptId: attempt._id,
    details,
    ...(passed && {
      message: `Congratulations! You passed with ${percentage}%. Training complete.`,
    }),
    ...(!passed && {
      message: `You scored ${percentage}%. Passing score is ${finalTest.passingScore}%. Please retry.`,
    }),
  };
};

// ── User's own progress ────────────────────────────────────────

const getMyProgress = async (userId) => {
  const modules = await UserProgress.find({ userId })
    .populate('moduleId', 'title number description')
    .sort({ moduleNumber: 1 });

  const attempts = await QuizAttempt.find({ userId }).sort({ createdAt: -1 });
  const finalAttempts = attempts.filter((a) => a.type === 'final');

  const completedCount = modules.filter((m) => m.quizPassed).length;
  const allCompleted = modules.length > 0 && completedCount === modules.length;

  return {
    modules,
    quizAttempts: attempts,
    summary: {
      totalModules: modules.length,
      completedModules: completedCount,
      allModulesCompleted: allCompleted,
      finalTestEligible: allCompleted,
      finalTestPassed: finalAttempts.some((a) => a.passed),
      finalTestAttempts: finalAttempts.length,
      lastFinalScore: finalAttempts[0]?.percentage ?? null,
    },
  };
};

module.exports = { submitModuleQuiz, submitFinalTest, getMyProgress };
