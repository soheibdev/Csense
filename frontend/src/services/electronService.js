/**
 * electronService.js — Typed wrapper around window.electronAPI.
 *
 * Always check for the presence of window.electronAPI so the app can
 * also run in a plain browser during development without Electron.
 */

const isElectron = typeof window !== 'undefined' && !!window.electronAPI;

const electronService = {
  /** Returns the app version string from package.json */
  getAppVersion: () =>
    isElectron ? window.electronAPI.getAppVersion() : Promise.resolve('web'),

  /** Logs a message to the Electron main-process console */
  logInfo: (message) => {
    if (isElectron) window.electronAPI.logInfo(message);
    else console.info('[web-mode]', message);
  },

  /** Subscribe to an IPC push channel. Returns an unsubscribe fn. */
  on: (channel, callback) => {
    if (isElectron) return window.electronAPI.on(channel, callback);
    return () => {}; // no-op in browser
  },
};

export default electronService;
