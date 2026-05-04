const moduleService = require('./module.service');

// ── Admin controllers ──────────────────────────────────────────

const createModule = async (req, res, next) => {
  try {
    const mod = await moduleService.createModule(req.body);
    res.status(201).json({ success: true, message: 'Module created', data: mod });
  } catch (err) {
    next(err);
  }
};

const getAllModules = async (req, res, next) => {
  try {
    const modules = await moduleService.getAllModules();
    res.json({ success: true, count: modules.length, data: modules });
  } catch (err) {
    next(err);
  }
};

const getModuleById = async (req, res, next) => {
  try {
    const mod = await moduleService.getModuleById(req.params.id);
    res.json({ success: true, data: mod });
  } catch (err) {
    next(err);
  }
};

const updateModule = async (req, res, next) => {
  try {
    const mod = await moduleService.updateModule(req.params.id, req.body);
    res.json({ success: true, message: 'Module updated', data: mod });
  } catch (err) {
    next(err);
  }
};

const deleteModule = async (req, res, next) => {
  try {
    await moduleService.deleteModule(req.params.id);
    res.json({ success: true, message: 'Module deleted' });
  } catch (err) {
    next(err);
  }
};

const addImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded' });
    }
    const mod = await moduleService.addImages(req.params.id, req.files);
    res.json({ success: true, message: 'Images uploaded', data: mod.images });
  } catch (err) {
    next(err);
  }
};

const removeImage = async (req, res, next) => {
  try {
    const mod = await moduleService.removeImage(req.params.id, req.params.imageId);
    res.json({ success: true, message: 'Image removed', data: mod.images });
  } catch (err) {
    next(err);
  }
};

const uploadVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No video uploaded' });
    }
    const mod = await moduleService.uploadVideo(req.params.id, req.file);
    res.json({ success: true, message: 'Video uploaded', data: { videoUrl: mod.videoUrl } });
  } catch (err) {
    next(err);
  }
};

// ── User controllers ───────────────────────────────────────────

const getUserModules = async (req, res, next) => {
  try {
    const modules = await moduleService.getUserModules(req.user._id);
    res.json({ success: true, count: modules.length, data: modules });
  } catch (err) {
    next(err);
  }
};

const getUserModuleContent = async (req, res, next) => {
  try {
    const result = await moduleService.getUserModuleContent(req.user._id, req.params.id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
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
