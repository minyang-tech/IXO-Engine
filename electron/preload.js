const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ixo", {
  version: "1.0.0",
  saveProject: (payload) => ipcRenderer.invoke("project:save", payload),
  loadProject: () => ipcRenderer.invoke("project:load"),
  chooseExportPath: (options) => ipcRenderer.invoke("project:chooseExportPath", options),
  getExportCapabilities: () => ipcRenderer.invoke("project:getExportCapabilities"),
  getEmbeddedRuntimeProject: () => ipcRenderer.invoke("project:getEmbeddedRuntimeProject"),
  exportProject: (payload, options) => ipcRenderer.invoke("project:export", payload, options),
  exportMobileProject: (payload, options) => ipcRenderer.invoke("project:exportMobile", payload, options),
  requestHttps: (url) => ipcRenderer.invoke("net:httpsRequest", url),
  openExternal: (url) => ipcRenderer.invoke("shell:openExternal", url),
  requestSecurityApproval: (scope, context) => ipcRenderer.invoke("security:requestApproval", scope, context),
  getSecurityPreferences: () => ipcRenderer.invoke("security:getPreferences"),
  setHttpsNodesEnabled: (enabled) => ipcRenderer.invoke("security:setHttpsNodesEnabled", enabled),
  promptStartupHttpsPreference: () => ipcRenderer.invoke("security:promptStartupHttpsPreference"),
  resetSecurityApprovals: () => ipcRenderer.invoke("security:resetApprovals"),
  watchPath: (targetPath) => ipcRenderer.invoke("fs:watchPath", targetPath),
  unwatchPath: (targetPath) => ipcRenderer.invoke("fs:unwatchPath", targetPath),
  onWatchEvent: (listener) => {
    const wrapped = (_event, payload) => listener(payload);
    ipcRenderer.on("fs:watchEvent", wrapped);
    return () => ipcRenderer.removeListener("fs:watchEvent", wrapped);
  },
  setDirtyState: (payload) => ipcRenderer.invoke("app:setDirtyState", payload),
  getAppInfo: () => ipcRenderer.invoke("app:getInfo"),
  checkForUpdates: () => ipcRenderer.invoke("app:checkForUpdates"),
  downloadUpdate: (asset) => ipcRenderer.invoke("app:downloadUpdate", asset)
});
