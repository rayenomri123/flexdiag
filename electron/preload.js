const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('windowControlsAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  close: () => ipcRenderer.send('window-close'),
});