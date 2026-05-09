import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  purpose: localStorage.getItem('purpose') || null, // 'TEAM' or 'INDIVIDUAL'
  
  login: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  
  setPurpose: (purpose) => {
    localStorage.setItem('purpose', purpose);
    set({ purpose });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('purpose');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false, purpose: null });
  },
  
  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    set({ user });
  },
}));
