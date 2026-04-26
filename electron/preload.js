const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ixo", {
  version: "0.1.0",
  saveProject: (payload) => ipcRenderer.invoke("project:save", payload),
  loadProject: () => ipcRenderer.invoke("project:load"),
  exportProject: (payload) => ipcRenderer.invoke("project:export", payload),
  openExternal: (url) => ipcRenderer.invoke("shell:openExternal", url),
  setDirtyState: (payload) => ipcRenderer.invoke("app:setDirtyState", payload)
});
