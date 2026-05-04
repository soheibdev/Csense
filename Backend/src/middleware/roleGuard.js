const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: admin access required',
    });
  }
  next();
};

const requireUser = (req, res, next) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: employee account required',
    });
  }
  next();
};

module.exports = { requireAdmin, requireUser };
