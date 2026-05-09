import { create } from 'zustand';

export const useUIStore = create((set) => ({
  sidebarCollapsed: false,
  mobileNavOpen: false,
  loadingBar: false,

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setSidebarCollapsed: (val) => set({ sidebarCollapsed: val }),

  setMobileNavOpen: (val) => set({ mobileNavOpen: val }),

  setLoadingBar: (val) => set({ loadingBar: val }),
}));
