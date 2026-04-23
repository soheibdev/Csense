import { create } from 'zustand';

const useAppStore = create((set) => ({

  user: null,
  accessToken: null,
  refreshToken: null,
  setAuth: (user, accessToken, refreshToken) => set({ user, accessToken, refreshToken }),
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null, accessToken: null, refreshToken: null }),

  // ── UI slice ──────────────────────────────────────────────────────────────
  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  // ── Notification slice ────────────────────────────────────────────────────
  notifications: [],
  addNotification: (n) =>
    set((s) => ({ notifications: [...s.notifications, { id: Date.now(), ...n }] })),
  dismissNotification: (id) =>
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
}));

export default useAppStore;
