const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('windowControlsAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  close: () => ipcRenderer.send('window-close'),
});

contextBridge.exposeInMainWorld('networkAPI', {
  getNetworkInterfaces: () => ipcRenderer.invoke('get-network-interfaces'),
  isEthernetConnected: () => ipcRenderer.invoke('is-ethernet-connected'),
});

contextBridge.exposeInMainWorld('dbAPI', {
  saveNetworkSetup: settings => ipcRenderer.invoke('save-network-setup', settings),
  clearNetworkSetup:     ()       => ipcRenderer.invoke('clear-network-setup'),
  fetchNetworkSetup: () => ipcRenderer.invoke('fetch-network-setup'),
});

contextBridge.exposeInMainWorld('dhcpAPI', {
  start: () => ipcRenderer.invoke('start-dhcp'),
  stop: () => ipcRenderer.invoke('stop-dhcp'),
});