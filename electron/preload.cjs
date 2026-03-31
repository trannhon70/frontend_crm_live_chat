const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  focusApp: () => ipcRenderer.send('focus-app')
});