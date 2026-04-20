import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from '@pages/HomePage';
import DashboardPage from '@pages/DashboardPage';
import NotFoundPage from '@pages/NotFoundPage';

/**
 * AppRouter.jsx
 *
 * Uses HashRouter so that deep-links work correctly when Electron
 * loads the app from the filesystem (file:// protocol).
 *
 * Routes:
 *  /           → HomePage
 *  /dashboard  → DashboardPage
 *  *           → NotFoundPage (404)
 */
function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/"          element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*"          element={<NotFoundPage />} />
      </Routes>
    </HashRouter>
  );
}

export default AppRouter;
