const userService = require('./user.service');

const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body, req.user._id);
    res.status(201).json({ success: true, message: 'User created successfully', data: user });
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const result = await userService.getAllUsers({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      search: search || '',
    });
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json({ success: true, message: 'User updated successfully', data: user });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ success: true, message: 'User and all related data deleted' });
  } catch (err) {
    next(err);
  }
};

const getUserProgress = async (req, res, next) => {
  try {
    const result = await userService.getUserProgress(req.params.id);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser, getUserProgress };
