const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os = require('os');
const db = require(path.join(__dirname, '../database', 'index.js'));

function createWindow() {
  const win = new BrowserWindow({
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  // win.webContents.openDevTools();
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

// Ethernet connectivity IPC handler
ipcMain.handle('is-ethernet-connected', () => {
  const allIfaces = os.networkInterfaces();
  const ethKey = Object.keys(allIfaces)
    .find(name => /^Ethernet$/i.test(name));
  if (!ethKey) {
    return false;
  }
  return allIfaces[ethKey].some(addr => !addr.internal);
});

// IPC to save a network setup
ipcMain.handle('save-network-setup', async (_, { interface, ip_host, subnet, pool_val1, pool_val2 }) => {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT INTO network_setup(interface, ip_host, subnet, pool_val1, pool_val2)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(interface) DO UPDATE SET
        ip_host=excluded.ip_host,
        subnet=excluded.subnet,
        pool_val1=excluded.pool_val1,
        pool_val2=excluded.pool_val2
    `);
    stmt.run(interface, ip_host, subnet, pool_val1, pool_val2, err => {
      stmt.finalize();
      if (err) reject(err.message);
      else resolve(true);
    });
  });
});

// IPC to fetch all saved network setups
ipcMain.handle('fetch-network-setup', () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM network_setup', (err, rows) => {
      if (err) reject(err.message);
      else resolve(rows);
    });
  });
});

// IPC to clear all rows from network_setup
ipcMain.handle('clear-network-setup', async () => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM network_setup`, err => {
      if (err) reject(err.message);
      else resolve(true);
    });
  });
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});