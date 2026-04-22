const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const isDev = process.env.NODE_ENV === "development";

let win;

function createWindow() {
  win = new BrowserWindow({
     width: 1200,
     height: 800,
     fullscreen: true,
     frame: false,
     kiosk: true,
     webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: !isDev, 
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "../frontend/dist/index.html"));
  }

  win.once("ready-to-show", () => {
    win.show();
    if (isDev) {
      win.webContents.openDevTools({ mode: "detach" });
    }
  });

  return win;
}

// App ready
app.whenReady().then(async () => {
  if (isDev) {
    try {
      const { default: installExtension, REACT_DEVELOPER_TOOLS } = require("electron-devtools-installer");
      await installExtension(REACT_DEVELOPER_TOOLS, {
        loadExtensionOptions: { allowFileAccess: true },
      });
      console.log("React DevTools installed successfully");
    } catch (err) {
      console.log("DevTools install error:", err);
    }
  }

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit app
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("app:getVersion", () => app.getVersion());

ipcMain.on("log:info", (_event, msg) => {
  console.log("[Renderer]", msg);
});

// Debug
console.log("DEV MODE:", isDev);