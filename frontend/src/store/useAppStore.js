import { create } from 'zustand';

export const BADGE_DEFS = {
  'csense-novice': { id: 'csense-novice', name: 'CSense Novice', description: 'Passed the first module', icon: '🔰', quizKey: 'quiz1' },
  'social-engineer': { id: 'social-engineer', name: 'Social Engineer', description: 'Passed Social Engineering', icon: '🎭', quizKey: 'quiz2' },
  'password-master': { id: 'password-master', name: 'Password Master', description: 'Passed Password Security', icon: '🔑', quizKey: 'quiz3' },
  'csense-champion': { id: 'csense-champion', name: 'CSense Champion', description: 'Passed the Final Assessment', icon: '🏆', quizKey: 'final-quiz' },
};

export const XP_REWARDS = {
  'quiz1': 50,
  'quiz2': 100,
  'quiz3': 100,
  'final-quiz': 200,
};

// ── Auth is NEVER rehydrated on startup ─────────────────────────────────────
// The app always starts at Welcome → Login.
// Progress data IS persisted so interrupted sessions can resume after re-login.

const useAppStore = create((set) => ({

  // Auth — always starts null (forces Welcome → Login on every app launch)
  user: null,
  accessToken: null,
  refreshToken: null,

  // Progress — rehydrated from localStorage for session recovery
  currentModule: localStorage.getItem('currentStep') || 'what-is-csense',
  xp: parseInt(localStorage.getItem('xp') || '0', 10),
  badges: JSON.parse(localStorage.getItem('badges') || '[]'),
  quizScores: JSON.parse(localStorage.getItem('quizScores') || '{}'),

  setAuth: (user, accessToken, refreshToken) => set({ user, accessToken, refreshToken }),
  setUser: (user) => set({ user }),
  clearUser: () => {
    set({ user: null, accessToken: null, refreshToken: null, currentModule: 'what-is-csense' });
    localStorage.removeItem('currentStep');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  setCurrentModule: (step) => {
    set({ currentModule: step });
    localStorage.setItem('currentStep', step);
  },

  addXP: (amount) => set((s) => {
    const newXP = s.xp + amount;
    localStorage.setItem('xp', newXP.toString());
    return { xp: newXP };
  }),

  unlockBadge: (badgeId) => set((s) => {
    if (s.badges.includes(badgeId)) return s;
    const newBadges = [...s.badges, badgeId];
    localStorage.setItem('badges', JSON.stringify(newBadges));
    return { badges: newBadges };
  }),

  setQuizScore: (key, scoreData) => set((s) => {
    const newScores = { ...s.quizScores, [key]: scoreData };
    localStorage.setItem('quizScores', JSON.stringify(newScores));
    return { quizScores: newScores };
  }),

  clearSession: () => set((s) => {
    localStorage.removeItem('xp');
    localStorage.removeItem('badges');
    localStorage.removeItem('quizScores');
    localStorage.setItem('currentStep', 'what-is-csense');
    return { xp: 0, badges: [], quizScores: {}, currentModule: 'what-is-csense' };
  }),

  // ── UI slice ──────────────────────────────────────────────────────────────
  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  // ── Notification slice ────────────────────────────────────────────────────
  notifications: [],
  addNotification: (n) =>
    set((s) => ({ notifications: [...s.notifications, { id: Date.now(), ...n }] })),
  dismissNotification: (id) =>
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),

  // ── Admin slice ───────────────────────────────────────────────────────────
  adminStats: null,
  setAdminStats: (stats) => set({ adminStats: stats }),

  employees: [],
  setEmployees: (employees) => set({ employees }),

  moduleStats: [],
  setModuleStats: (moduleStats) => set({ moduleStats }),

  adminLoading: false,
  setAdminLoading: (adminLoading) => set({ adminLoading }),

  adminError: null,
  setAdminError: (adminError) => set({ adminError }),
}));

export default useAppStore;