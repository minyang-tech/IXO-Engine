const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ixo", {
  version: "1.0.0",
  saveProject: (payload) => ipcRenderer.invoke("project:save", payload),
  loadProject: () => ipcRenderer.invoke("project:load"),
  exportProject: (payload) => ipcRenderer.invoke("project:export", payload),
  requestHttps: (url) => ipcRenderer.invoke("net:httpsRequest", url),
  openExternal: (url) => ipcRenderer.invoke("shell:openExternal", url),
  requestSecurityApproval: (scope) => ipcRenderer.invoke("security:requestApproval", scope),
  resetSecurityApprovals: () => ipcRenderer.invoke("security:resetApprovals"),
  setDirtyState: (payload) => ipcRenderer.invoke("app:setDirtyState", payload),
  getAppInfo: () => ipcRenderer.invoke("app:getInfo"),
  checkForUpdates: () => ipcRenderer.invoke("app:checkForUpdates"),
  downloadUpdate: (asset) => ipcRenderer.invoke("app:downloadUpdate", asset)
});
