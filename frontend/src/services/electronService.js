
const isElectron = typeof window !== 'undefined' && !!window.electronAPI;

const electronService = {
  getAppVersion: () =>
    isElectron ? window.electronAPI.getAppVersion() : Promise.resolve('web'),

  logInfo: (message) => {
    if (isElectron) window.electronAPI.logInfo(message);
    else console.info('[web-mode]', message);
  },

  on: (channel, callback) => {
    if (isElectron) return window.electronAPI.on(channel, callback);
    return () => {};
  },
};

export default electronService;
