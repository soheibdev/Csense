const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');

// ── Route imports ──────────────────────────────────────────────
const authRoutes           = require('./features/auth/auth.routes');
const adminUserRoutes      = require('./features/users/user.routes');
const adminModuleRoutes    = require('./features/modules/module.admin.routes');
const adminFinalTestRoutes = require('./features/finalTest/finalTest.admin.routes');
const adminRoutes          = require('./features/admin/admin.routes');
const userModuleRoutes     = require('./features/modules/module.user.routes');
const userFinalTestRoutes  = require('./features/finalTest/finalTest.user.routes');
const progressRoutes       = require('./features/progress/progress.routes');

const app = express();

// ── Security headers ───────────────────────────────────────────
app.use(helmet());

// ── CORS ───────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ── Rate limiting ──────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again in 15 minutes' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { success: false, message: 'Too many login attempts, please try again later' },
});

app.use('/api', globalLimiter);
app.use('/api/auth/login', authLimiter);

// ── Body parsing ───────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── HTTP logging ───────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ── Health check ───────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Condor Training API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ── Auth routes ────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ── Admin routes ───────────────────────────────────────────────
app.use('/api/admin/users',      adminUserRoutes);
app.use('/api/admin/modules',    adminModuleRoutes);
app.use('/api/admin/final-test', adminFinalTestRoutes);
app.use('/api/admin',            adminRoutes);

// ── Employee routes ────────────────────────────────────────────
app.use('/api/modules',    userModuleRoutes);
app.use('/api/final-test', userFinalTestRoutes);
app.use('/api/progress',   progressRoutes);

// ── 404 ────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ── Global error handler ───────────────────────────────────────
app.use(errorHandler);

module.exports = app;
