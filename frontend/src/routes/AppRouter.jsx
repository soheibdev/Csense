import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from '@pages/Login';
import Topics from '@pages/Topics';

function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/topics" element={<Topics />} />
      </Routes>
    </HashRouter>
  );
}

export default AppRouter;