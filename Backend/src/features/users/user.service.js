const bcrypt = require('bcryptjs');
const User = require('./user.model');
const UserProgress = require('../progress/progress.model');
const QuizAttempt = require('../progress/quizAttempt.model');
const Module = require('../modules/module.model');

const createUser = async ({ name, email, password, role = 'user' }, adminId) => {
  email = email.toLowerCase().trim();
  const exists = await User.findOne({ email });
  if (exists) {
    const err = new Error('Email already in use');
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, role, createdBy: adminId });

  // Initialize locked progress for all existing active modules
  if (role === 'user') {
    const modules = await Module.find({ isActive: true }).sort({ number: 1 });
    if (modules.length > 0) {
      const progressDocs = modules.map((mod, index) => ({
        userId: user._id,
        moduleId: mod._id,
        moduleNumber: mod.number,
        status: index === 0 ? 'in_progress' : 'locked',
      }));
      await UserProgress.insertMany(progressDocs);
    }
  }

  return user;
};

const getAllUsers = async ({ page = 1, limit = 20, search = '' } = {}) => {
  const query = { role: 'user' };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select('-passwordHash')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return { users, total, page: Number(page), totalPages: Math.ceil(total / limit) };
};

const getUserById = async (id) => {
  const user = await User.findById(id).select('-passwordHash');
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  return user;
};

const updateUser = async (id, data) => {
  if (data.password) {
    data.passwordHash = await bcrypt.hash(data.password, 12);
    delete data.password;
  }

  const user = await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).select('-passwordHash');

  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  await UserProgress.deleteMany({ userId: id });
  await QuizAttempt.deleteMany({ userId: id });
};

const getUserProgress = async (userId) => {
  await getUserById(userId);

  const progress = await UserProgress.find({ userId })
    .populate('moduleId', 'title number description')
    .sort({ moduleNumber: 1 });

  const attempts = await QuizAttempt.find({ userId }).sort({ createdAt: -1 });

  const allCompleted = progress.length > 0 && progress.every((p) => p.quizPassed);
  const completedCount = progress.filter((p) => p.quizPassed).length;

  const finalTestAttempts = attempts.filter((a) => a.type === 'final');
  const finalPassed = finalTestAttempts.some((a) => a.passed);

  return {
    modules: progress,
    summary: {
      totalModules: progress.length,
      completedModules: completedCount,
      allModulesCompleted: allCompleted,
      finalTestPassed: finalPassed,
      finalTestAttempts: finalTestAttempts.length,
    },
  };
};

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser, getUserProgress };
