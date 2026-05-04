const Module = require('./module.model');
const UserProgress = require('../progress/progress.model');
const User = require('../users/user.model');
const { deleteFile } = require('../../config/cloudinary');

const createModule = async (data) => {
  const exists = await Module.findOne({ number: data.number });
  if (exists) {
    const err = new Error(`Module number ${data.number} already exists`);
    err.status = 409;
    throw err;
  }

  const mod = await Module.create(data);

  // Auto-create locked progress for all existing users
  const users = await User.find({ role: 'user', isActive: true });
  if (users.length > 0) {
    const progressDocs = users.map((u) => ({
      userId: u._id,
      moduleId: mod._id,
      moduleNumber: mod.number,
      status: 'locked',
    }));
    await UserProgress.insertMany(progressDocs, { ordered: false }).catch(() => {});
  }

  return mod;
};

const getAllModules = async () => {
  return Module.find().sort({ number: 1 });
};

const getModuleById = async (id) => {
  const mod = await Module.findById(id);
  if (!mod) {
    const err = new Error('Module not found');
    err.status = 404;
    throw err;
  }
  return mod;
};

const updateModule = async (id, data) => {
  const mod = await Module.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!mod) {
    const err = new Error('Module not found');
    err.status = 404;
    throw err;
  }
  return mod;
};

const deleteModule = async (id) => {
  const mod = await Module.findByIdAndDelete(id);
  if (!mod) {
    const err = new Error('Module not found');
    err.status = 404;
    throw err;
  }

  // Cleanup Cloudinary files
  if (mod.videoPublicId) {
    await deleteFile(mod.videoPublicId, 'video').catch(() => {});
  }
  for (const img of mod.images) {
    await deleteFile(img.publicId).catch(() => {});
  }

  await UserProgress.deleteMany({ moduleId: id });
};

const addImages = async (id, files) => {
  const mod = await getModuleById(id);
  const newImages = files.map((f) => ({
    url: f.path,
    publicId: f.filename,
    caption: '',
  }));
  mod.images.push(...newImages);
  await mod.save();
  return mod;
};

const removeImage = async (moduleId, imageId) => {
  const mod = await getModuleById(moduleId);
  const image = mod.images.id(imageId);
  if (!image) {
    const err = new Error('Image not found');
    err.status = 404;
    throw err;
  }
  await deleteFile(image.publicId).catch(() => {});
  mod.images.pull(imageId);
  await mod.save();
  return mod;
};

const uploadVideo = async (id, file) => {
  const mod = await getModuleById(id);

  // Delete old video if exists
  if (mod.videoPublicId) {
    await deleteFile(mod.videoPublicId, 'video').catch(() => {});
  }

  mod.videoUrl = file.path;
  mod.videoPublicId = file.filename;
  await mod.save();
  return mod;
};

// User-facing: get modules with personal lock/unlock status
const getUserModules = async (userId) => {
  const modules = await Module.find({ isActive: true })
    .select('number title description images videoUrl')
    .sort({ number: 1 });

  const progressList = await UserProgress.find({ userId });
  const progressMap = {};
  progressList.forEach((p) => {
    progressMap[p.moduleId.toString()] = p;
  });

  return modules.map((mod) => {
    const progress = progressMap[mod._id.toString()];
    return {
      _id: mod._id,
      number: mod.number,
      title: mod.title,
      description: mod.description,
      hasVideo: !!mod.videoUrl,
      imageCount: mod.images.length,
      status: progress ? progress.status : 'locked',
      quizPassed: progress ? progress.quizPassed : false,
      quizScore: progress ? progress.quizScore : null,
      completedAt: progress ? progress.completedAt : null,
    };
  });
};

// User-facing: get single module content (only if unlocked)
const getUserModuleContent = async (userId, moduleId) => {
  const progress = await UserProgress.findOne({ userId, moduleId });

  if (!progress || progress.status === 'locked') {
    const err = new Error('Module is locked. Complete the previous module first.');
    err.status = 403;
    throw err;
  }

  const mod = await Module.findOne({ _id: moduleId, isActive: true });
  if (!mod) {
    const err = new Error('Module not found');
    err.status = 404;
    throw err;
  }

  return { module: mod, progress };
};

module.exports = {
  createModule,
  getAllModules,
  getModuleById,
  updateModule,
  deleteModule,
  addImages,
  removeImage,
  uploadVideo,
  getUserModules,
  getUserModuleContent,
};
