import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { authApi } from './api/auth';
import { useAuthStore } from './store/authStore';

function App() {
  const { token, user, setUser, logout } = useAuthStore();

  useEffect(() => {
    if (!token || user) return;

    authApi.me()
      .then(setUser)
      .catch(logout);
  }, [token, user, setUser, logout]);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
