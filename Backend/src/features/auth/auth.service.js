const jwt = require('jsonwebtoken');
const User = require('../users/user.model');

const generateTokens = (user) => {
  const payload = { id: user._id, role: user.role };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });

  return { accessToken, refreshToken };
};

const login = async (email, password) => {
  email = email.toLowerCase().trim();
  console.log("Login attempt:", email);
  
  const user = await User.findOne({ email });
  console.log("User found:", user ? user._id : null);
  
  if (!user) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }
  if (!user.isActive) {
    const err = new Error('Your account has been deactivated');
    err.status = 403;
    throw err;
  }

  const isMatch = await user.comparePassword(password);
  console.log("Password match:", isMatch);
  
  if (!isMatch) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  const tokens = generateTokens(user);
  return { user, ...tokens };
};

const refreshTokens = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) throw new Error('User not found');

    return generateTokens(user);
  } catch {
    const err = new Error('Invalid or expired refresh token');
    err.status = 401;
    throw err;
  }
};

module.exports = { login, refreshTokens, generateTokens };
