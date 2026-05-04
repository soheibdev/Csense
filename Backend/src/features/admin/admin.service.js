const User = require('../users/user.model');
const UserProgress = require('../progress/progress.model');
const QuizAttempt = require('../progress/quizAttempt.model');
const Module = require('../modules/module.model');

const getStats = async () => {
  const [
    totalUsers,
    activeUsers,
    totalModules,
    totalAttempts,
    passedAttempts,
    allProgress,
    recentUsers,
  ] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'user', isActive: true }),
    Module.countDocuments({ isActive: true }),
    QuizAttempt.countDocuments(),
    QuizAttempt.countDocuments({ passed: true }),
    UserProgress.find(),
    User.find({ role: 'user' })
      .select('name email createdAt isActive')
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  // Count users who completed all modules
  const progressByUser = {};
  allProgress.forEach((p) => {
    const uid = p.userId.toString();
    if (!progressByUser[uid]) progressByUser[uid] = [];
    progressByUser[uid].push(p);
  });

  let completedAll = 0;
  Object.values(progressByUser).forEach((list) => {
    if (list.length > 0 && list.every((p) => p.quizPassed)) completedAll++;
  });

  // Final test stats
  const finalAttempts = await QuizAttempt.countDocuments({ type: 'final' });
  const finalPassed = await QuizAttempt.countDocuments({ type: 'final', passed: true });

  // Module completion breakdown
  const moduleStats = await UserProgress.aggregate([
    {
      $group: {
        _id: '$moduleNumber',
        totalUsers: { $sum: 1 },
        completedUsers: { $sum: { $cond: ['$quizPassed', 1, 0] } },
        avgScore: { $avg: '$quizScore' },
        avgPercentage: { $avg: '$quizPercentage' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return {
    overview: {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      totalModules,
      completedAllModules: completedAll,
      completionRate: totalUsers > 0 ? Math.round((completedAll / totalUsers) * 100) : 0,
    },
    quizStats: {
      totalAttempts,
      passedAttempts,
      overallPassRate: totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0,
    },
    finalTestStats: {
      totalAttempts: finalAttempts,
      passedAttempts: finalPassed,
      passRate: finalAttempts > 0 ? Math.round((finalPassed / finalAttempts) * 100) : 0,
    },
    moduleBreakdown: moduleStats.map((m) => ({
      moduleNumber: m._id,
      totalUsers: m.totalUsers,
      completedUsers: m.completedUsers,
      completionRate: m.totalUsers > 0 ? Math.round((m.completedUsers / m.totalUsers) * 100) : 0,
      avgScore: Math.round(m.avgScore || 0),
      avgPercentage: Math.round(m.avgPercentage || 0),
    })),
    recentUsers,
  };
};

module.exports = { getStats };
