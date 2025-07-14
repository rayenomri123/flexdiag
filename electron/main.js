const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os = require('os');

function createWindow() {
  const win = new BrowserWindow({
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  win.webContents.openDevTools();
  win.setMenu(null);
  win.maximize();

  if (app.isPackaged) {
    const indexPath = path.join(process.resourcesPath, 'app.asar', 'dist', 'index.html');
    win.loadFile(indexPath);
  } else {
    win.loadURL('http://localhost:5173');
  }

  // Window controls IPC
  ipcMain.on('window-minimize', () => win.minimize());
  ipcMain.on('window-close', () => win.close());
}

// IPC handler for network interfaces
ipcMain.handle('get-network-interfaces', () => {
  const allIfaces = os.networkInterfaces();
  const ethIfaces = {};
  for (const [name, addrs] of Object.entries(allIfaces)) {
    if (!/^(eth|en)|Ethernet/i.test(name)) continue;
    const usable = addrs.filter(a => !a.internal);
    if (usable.length) {
      ethIfaces[name] = usable;
    }
  }
  return ethIfaces;
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});