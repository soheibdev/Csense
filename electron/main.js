const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// ─── Constants ────────────────────────────────────────────────────────────────
const isDev = process.env.NODE_ENV === 'development';
const VITE_DEV_SERVER_URL = 'http://localhost:5173';

// ─── Window Factory ───────────────────────────────────────────────────────────
function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 600,
    show: false, // don't show until ready-to-show
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0f0f0f',
    icon: path.join(__dirname, '../frontend/public/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,   // ✅ Renderer cannot access Node APIs
      nodeIntegration: false,   // ✅ No Node.js in renderer
      sandbox: true,            // ✅ Extra OS-level isolation
      webSecurity: true,
    },
  });

  // ── Load URL or built files ──────────────────────────────────────────────
  if (isDev) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(path.join(__dirname, '../frontend/dist/index.html'));
  }

  // ── Graceful show ───────────────────────────────────────────────────────
  win.once('ready-to-show', () => {
    win.show();
    win.focus();
  });

  return win;
}

// ─── App Lifecycle ────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  createWindow();

  // macOS: re-create window when dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  // On macOS, apps conventionally stay active until the user quits explicitly
  if (process.platform !== 'darwin') app.quit();
});

// ─── IPC Handlers ─────────────────────────────────────────────────────────────
// Example: renderer asks for app version
ipcMain.handle('app:getVersion', () => app.getVersion());

// Example: renderer sends a log message to the main process
ipcMain.on('log:info', (_event, message) => {
  console.log('[Renderer]', message);
});
