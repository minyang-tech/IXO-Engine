const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ixo", {
  version: "1.0.0",
  saveProject: (payload) => ipcRenderer.invoke("project:save", payload),
  loadProject: () => ipcRenderer.invoke("project:load"),
  exportProject: (payload) => ipcRenderer.invoke("project:export", payload),
  openExternal: (url) => ipcRenderer.invoke("shell:openExternal", url),
  setDirtyState: (payload) => ipcRenderer.invoke("app:setDirtyState", payload),
  getAppInfo: () => ipcRenderer.invoke("app:getInfo"),
  checkForUpdates: () => ipcRenderer.invoke("app:checkForUpdates"),
  downloadUpdate: (asset) => ipcRenderer.invoke("app:downloadUpdate", asset)
});
