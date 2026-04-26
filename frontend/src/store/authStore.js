import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  purpose: localStorage.getItem('purpose') || null, // 'TEAM' or 'INDIVIDUAL'
  
  login: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },
  
  setPurpose: (purpose) => {
    localStorage.setItem('purpose', purpose);
    set({ purpose });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('purpose');
    set({ user: null, token: null, isAuthenticated: false, purpose: null });
  },
  
  setUser: (user) => set({ user }),
}));
