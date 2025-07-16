const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os = require('os');
const db = require(path.join(__dirname, '../database', 'index.js'));
const si = require('systeminformation');
const { exec } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    frame: false,
    webPreferences: {
      backgroundThrottling: false,
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
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
      // 1) Delete all existing rows
      db.run(`DELETE FROM network_setup`, err => {
        if (err) return reject(err.message);
        // 2) Insert the new row
        db.run(
          `INSERT INTO network_setup (interface, ip_host, subnet, pool_val1, pool_val2)
           VALUES (?, ?, ?, ?, ?)`,
          [interface, ip_host, subnet, pool_val1, pool_val2],
          err2 => {
            if (err2) {
              console.error('Error saving network setup:', err2);
              return reject(err2.message);
            }
            resolve(true);
          }
        );
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

// IPC: Start DHCP (assign temporary IP to interface)
ipcMain.handle('start-dhcp', async () => {
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM network_setup', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    if (rows.length === 0) throw new Error("No network setup found");

    const { interface: iface, ip_host, subnet } = rows[0];
    const netmask = subnet || '255.255.255.0'; // Fallback default

    const platform = process.platform;
    let cmd = '';

    if (platform === 'win32') {
      // Windows command (PowerShell style)
      cmd = `netsh interface ip set address "${iface}" static ${ip_host} ${netmask}`;
    } else if (platform === 'linux') {
      // Linux command (assumes sudo permission)
      cmd = `sudo ip addr add ${ip_host}/${netmask} dev ${iface}`;
    } else {
      throw new Error("Unsupported platform");
    }

    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error(`start-dhcp error: ${stderr}`);
          return reject(stderr);
        }
        console.log(`start-dhcp: ${stdout}`);
        resolve(true);
      });
    });

  } catch (err) {
    console.error("start-dhcp error:", err);
    throw err;
  }
});

// IPC: Stop DHCP (remove host IP from interface)
ipcMain.handle('stop-dhcp', async () => {
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM network_setup', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    if (rows.length === 0) throw new Error("No network setup found");

    const { interface: iface, ip_host, subnet } = rows[0];
    const netmask = subnet || '255.255.255.0';

    const platform = process.platform;
    let cmd = '';

    if (platform === 'win32') {
      // Restore DHCP settings (remove static IP)
      cmd = `netsh interface ip set address "${iface}" dhcp`;
    } else if (platform === 'linux') {
      cmd = `sudo ip addr del ${ip_host}/${netmask} dev ${iface}`;
    } else {
      throw new Error("Unsupported platform");
    }

    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error(`stop-dhcp error: ${stderr}`);
          return reject(stderr);
        }
        console.log(`stop-dhcp: ${stdout}`);
        resolve(true);
      });
    });

  } catch (err) {
    console.error("stop-dhcp error:", err);
    throw err;
  }
});

// disable Chromium’s timer throttling in background or occluded windows
app.commandLine.appendSwitch('disable-background-timer-throttling');
// disable Chromium’s occlusion/backgrounding heuristics
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-features', 'Translate,AutofillServerCommunication'); 
app.disableHardwareAcceleration(false);

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', async (event) => {
  console.log('App is quitting, attempting to stop DHCP...');
  try {
    const rows = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM network_setup', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    if (rows.length === 0) return;

    const { interface: iface, ip_host, subnet } = rows[0];
    const netmask = subnet || '255.255.255.0';
    const platform = process.platform;

    let cmd = '';

    if (platform === 'win32') {
      cmd = `netsh interface ip set address "${iface}" dhcp`;
    } else if (platform === 'linux') {
      cmd = `sudo ip addr del ${ip_host}/${netmask} dev ${iface}`;
    }

    await new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.error('Failed to stop DHCP on quit:', stderr);
          return reject(stderr);
        }
        console.log('DHCP stopped on app quit');
        resolve();
      });
    });

  } catch (err) {
    console.error('Error during DHCP cleanup on quit:', err);
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});