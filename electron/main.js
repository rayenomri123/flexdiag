const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os = require('os');
const db = require(path.join(__dirname, '../database', 'index.js'));
const si = require('systeminformation');

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

// IPC to check if any wired (Ethernet) NIC is up
ipcMain.handle('is-ethernet-connected', async () => {
  try {
    const ifaces = await si.networkInterfaces();
    const realEthernet = ifaces.filter(iface =>
      iface.type === 'wired' &&
      iface.operstate === 'up' &&
      iface.virtual === false &&
      iface.speed > 0 &&
      /^(eth|en|Ethernet)/i.test(iface.iface)
    );
    return realEthernet.length > 0;
  } catch (err) {
    console.error('Error in is-ethernet-connected:', err);
    return false;
  }
});

// IPC to save a network setup (modified to ensure only one row)
ipcMain.handle('save-network-setup', async (_, { interface, ip_host, subnet, pool_val1, pool_val2 }) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Step 1: Delete all existing rows in network_setup
      db.run(`DELETE FROM network_setup`, err => {
        if (err) {
          console.error('Error clearing network_setup:', err);
          return reject(err.message);
        }

        // Step 2: Insert the new row
        const stmt = db.prepare(`
          INSERT INTO network_setup (interface, ip_host, subnet, pool_val1, pool_val2)
          VALUES (?, ?, ?, ?, ?)
        `);
        stmt.run(interface, ip_host, subnet, pool_val1, pool_val2, err => {
          stmt.finalize();
          if (err) {
            console.error('Error inserting network setup:', err);
            reject(err.message);
          } else {
            resolve(true);
          }
        });
      });
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