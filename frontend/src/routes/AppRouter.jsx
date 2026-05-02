import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAppStore from '@store/useAppStore';
import Welcome        from '@pages/Welcome';
import Login          from '@pages/Login';
import Topics         from '@pages/Topics';
import NotFoundPage   from '@pages/NotFoundPage';

import WhatisScence     from '@pages/WhatisScence';
import Quiz1            from '@pages/Quiz1';
import SocialEngineering from '@pages/SocialEngineering';
import Quiz2            from '@pages/Quiz2';
import PasswordSecurity from '@pages/password-security';
import Quiz3            from '@pages/Quiz3';
import FinalQuiz        from '@pages/FinalQuiz';
import FinalResult      from '@pages/FinalResult';
import AdminDashboard   from '@pages/AdminDashboard';
import ProtectedRoute   from './ProtectedRoute';

// ── Guards ────────────────────────────────────────────────────────────────────

/** Sends unauthenticated users to /login */
function RequireAuth({ children }) {
  const user = useAppStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  return children;
}

/** Sends non-admins away from admin pages */
function RequireAdmin({ children }) {
  const user = useAppStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/what-is-csense" replace />;
  return children;
}

/** Sends already-logged-in users away from the login / welcome pages */
function GuestOnly({ children }) {
  const user = useAppStore((s) => s.user);
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/what-is-csense'} replace />;
  }
  return children;
}

// ── Router ────────────────────────────────────────────────────────────────────

function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        {/* Welcome — guests only */}
        <Route path="/" element={<GuestOnly><Welcome /></GuestOnly>} />

        {/* Login — guests only */}
        <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />

        {/* Admin Dashboard */}
        <Route path="/admin/dashboard" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />

        {/* Protected Learning Routes (Linear flow enforcement) */}
        <Route path="/what-is-csense" element={<ProtectedRoute><WhatisScence /></ProtectedRoute>} />
        <Route path="/quiz/1" element={<ProtectedRoute><Quiz1 /></ProtectedRoute>} />
        <Route path="/social-engineering" element={<ProtectedRoute><SocialEngineering /></ProtectedRoute>} />
        <Route path="/quiz/2" element={<ProtectedRoute><Quiz2 /></ProtectedRoute>} />
        <Route path="/password-security" element={<ProtectedRoute><PasswordSecurity /></ProtectedRoute>} />
        <Route path="/quiz/3" element={<ProtectedRoute><Quiz3 /></ProtectedRoute>} />
        <Route path="/final-quiz" element={<ProtectedRoute><FinalQuiz /></ProtectedRoute>} />
        <Route path="/final-result" element={<ProtectedRoute><FinalResult /></ProtectedRoute>} />
        <Route path="/topics" element={<ProtectedRoute><Topics /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  );
}

export default AppRouter;