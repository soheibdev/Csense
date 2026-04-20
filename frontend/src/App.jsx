import React from 'react';
import AppRouter from './routes/AppRouter';

/**
 * App.jsx — Root component.
 *
 * Responsibility: compose global providers (theme, auth, etc.)
 * and delegate all routing to AppRouter.
 */
function App() {
  return (
    <AppRouter />
  );
}

export default App;
