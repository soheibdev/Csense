import { create } from 'zustand';

/**
 * useAppStore — global Zustand store.
 *
 * Add slices (auth, ui, notifications…) by composing additional
 * create() calls or using the Zustand slice pattern.
 */
const useAppStore = create((set) => ({
  // ── User slice ────────────────────────────────────────────────────────────
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),

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
