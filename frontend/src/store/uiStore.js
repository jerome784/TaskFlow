import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (isOpen) => set({ isCommandPaletteOpen: isOpen }),
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
  
  isDarkTheme: true, // Default to dark mode for premium feel
  toggleTheme: () => set((state) => ({ isDarkTheme: !state.isDarkTheme })),
}));
