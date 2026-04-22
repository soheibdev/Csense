
const { contextBridge, ipcRenderer } = require('electron');

// ─── Whitelist of allowed IPC channels ───────────────────────────────────────
const ALLOWED_INVOKE_CHANNELS = ['app:getVersion'];
const ALLOWED_SEND_CHANNELS    = ['log:info'];
const ALLOWED_RECEIVE_CHANNELS = ['app:update-available'];

// ─── Expose safe API to renderer via window.electronAPI ──────────────────────
contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * Invoke a two-way IPC call (request → response).
   * @param {string} channel
   * @param {...any}  args
   * @returns {Promise<any>}
   */
  invoke: (channel, ...args) => {
    if (ALLOWED_INVOKE_CHANNELS.includes(channel)) {
      return ipcRenderer.invoke(channel, ...args);
    }
    return Promise.reject(new Error(`Channel "${channel}" is not permitted.`));
  },

  /**
   * Send a one-way IPC message to the main process.
   * @param {string} channel
   * @param {...any}  args
   */
  send: (channel, ...args) => {
    if (ALLOWED_SEND_CHANNELS.includes(channel)) {
      ipcRenderer.send(channel, ...args);
    } else {
      console.warn(`[preload] Blocked send on channel: "${channel}"`);
    }
  },

  /**
   * Listen for messages pushed FROM the main process.
   * Returns a cleanup function to remove the listener.
   * @param {string}   channel
   * @param {Function} callback
   * @returns {Function} unsubscribe
   */
  on: (channel, callback) => {
    if (ALLOWED_RECEIVE_CHANNELS.includes(channel)) {
      const subscription = (_event, ...args) => callback(...args);
      ipcRenderer.on(channel, subscription);
      // Return an unsubscribe function so React effects can clean up
      return () => ipcRenderer.removeListener(channel, subscription);
    }
    console.warn(`[preload] Blocked listener on channel: "${channel}"`);
    return () => {};
  },

  // ── Convenience helpers ──────────────────────────────────────────────────
  getAppVersion: () => ipcRenderer.invoke('app:getVersion'),
  logInfo: (msg) => ipcRenderer.send('log:info', msg),
});
