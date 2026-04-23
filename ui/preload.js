const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // execName = capitalized exe name e.g. "Boid", "Ball", "Electric"
  // This matches the values in App.jsx's SIM_EXECUTABLE map
  launchSim: (execName) => ipcRenderer.invoke('launch-sim', execName),
  killSim:   ()         => ipcRenderer.invoke('kill-sim'),
})