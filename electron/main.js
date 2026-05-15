const { app, BrowserWindow, Menu, ipcMain, dialog, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const os = require("os");
const { spawn } = require("child_process");
const archiver = require("archiver");
const { path7za } = require("7zip-bin");
const { checkForUpdates, downloadReleaseAsset } = require("./updateService");
const windowState = {
  isDirty: false,
  latestProject: null,
  allowClose: false
};

function projectToHtml(project) {
  const safeJson = JSON.stringify(project).replace(/</g, "\\u003c");
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>IXO Export</title>
    <style>
      body { margin: 0; font-family: Segoe UI, sans-serif; background: #08110d; color: #edf6f1; }
      .wrap { padding: 24px; }
      .viewer {
        border: 1px solid rgba(128, 162, 145, 0.18);
        border-radius: 24px;
        background: linear-gradient(180deg, rgba(19, 33, 28, 0.96), rgba(13, 22, 18, 0.96));
        padding: 18px;
        box-shadow: 0 18px 44px rgba(0, 0, 0, 0.24);
      }
      .input-row { display: grid; gap: 8px; margin-bottom: 16px; }
      .input {
        width: 100%;
        padding: 10px 12px;
        border-radius: 14px;
        border: 1px solid rgba(128, 162, 145, 0.18);
        background: #101915;
        color: #edf6f1;
      }
      .viewer-stage {
        position: relative;
        min-height: 420px;
        border-radius: 20px;
        border: 1px solid rgba(128, 162, 145, 0.18);
        overflow: hidden;
        background:
          linear-gradient(180deg, rgba(62, 207, 142, 0.04), rgba(62, 207, 142, 0.01)),
          linear-gradient(180deg, rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0));
      }
      .viewer-grid {
        position: absolute;
        inset: 0;
        background:
          linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
        background-size: 24px 24px;
        opacity: 0.24;
      }
      .builder-item {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      .builder-copy {
        width: 100%;
        padding: 12px;
        white-space: pre-wrap;
        word-break: break-word;
        line-height: 1.45;
      }
      .builder-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .card {
        border: 1px solid rgba(128, 162, 145, 0.18);
        border-radius: 18px;
        background: rgba(255,255,255,0.02);
        padding: 12px;
        margin-top: 12px;
      }
      .kind { color: #95ada2; font-size: 12px; text-transform: uppercase; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <h1>IXO Runtime Export</h1>
      <div id="app"></div>
    </div>
    <script>
      const project = ${safeJson};
      const app = document.getElementById("app");
      const nodes = project.nodes || [];
      const edges = project.edges || [];
      const inputs = project.inputValues || {};
      const uiElements = project.uiElements || [];
      const context = {};
      const outgoing = {};
      const indegree = {};
      nodes.forEach((n) => { outgoing[n.id] = []; indegree[n.id] = 0; });
      edges.forEach((e) => { outgoing[e.source].push(e); indegree[e.target] = (indegree[e.target] || 0) + 1; });
      const queue = Object.keys(indegree).filter((id) => indegree[id] === 0);
      const topo = [];
      while (queue.length) {
        const id = queue.shift();
        topo.push(id);
        (outgoing[id] || []).forEach((e) => {
          indegree[e.target] -= 1;
          if (indegree[e.target] === 0) queue.push(e.target);
        });
      }
      function tpl(text) {
        return String(text || "").replace(/\\{\\{\\s*([^}]+)\\s*\\}\\}/g, (_, key) => String(context[key.trim()] || ""));
      }
      function resolveUiValue(item, field) {
        const base = field === "src" ? item.src : item.text;
        if (item.bindingKey && context[item.bindingKey]) return String(context[item.bindingKey]);
        return tpl(base || "");
      }
      const viewer = document.createElement("div");
      viewer.className = "viewer";
      const inputRow = document.createElement("div");
      inputRow.className = "input-row";
      const stage = document.createElement("div");
      stage.className = "viewer-stage";
      const grid = document.createElement("div");
      grid.className = "viewer-grid";
      stage.appendChild(grid);
      viewer.appendChild(inputRow);
      viewer.appendChild(stage);
      app.appendChild(viewer);
      const inputNodes = nodes.filter((n) => (n.data?.nodeType || "") === "input");
      inputNodes.forEach((node) => {
        const input = document.createElement("input");
        input.className = "input";
        input.placeholder = node.data?.value || "Input";
        input.value = inputs[node.id] || "";
        input.oninput = () => { inputs[node.id] = input.value; render(); };
        inputRow.appendChild(input);
      });
      function renderUi(item) {
        const el = document.createElement("div");
        el.className = "builder-item";
        el.style.left = (item.x || 0) + "px";
        el.style.top = (item.y || 0) + "px";
        el.style.width = (item.width || 220) + "px";
        el.style.height = (item.height || 44) + "px";
        el.style.borderRadius = (item.radius || 0) + "px";
        el.style.color = item.color || "#edf6f1";
        el.style.background = item.kind === "image" ? "transparent" : (item.background || "transparent");
        el.style.fontSize = (item.fontSize || 16) + "px";
        el.style.textAlign = item.align || "left";
        if (item.kind === "image") {
          const img = document.createElement("img");
          img.className = "builder-image";
          img.src = resolveUiValue(item, "src");
          img.alt = item.text || "Builder asset";
          el.appendChild(img);
        } else {
          if (item.kind === "button") {
            el.style.fontWeight = "700";
            el.style.cursor = "pointer";
            if (item.actionType === "open-url" && item.actionValue) {
              el.onclick = () => window.open(item.actionValue, "_blank", "noopener,noreferrer");
            }
          }
          if (item.kind === "container") {
            el.style.border = "1px solid rgba(62, 207, 142, 0.12)";
            el.style.alignItems = "flex-start";
            el.style.justifyContent = "flex-start";
          }
          const copy = document.createElement("div");
          copy.className = "builder-copy";
          copy.textContent = resolveUiValue(item, "text");
          el.appendChild(copy);
        }
        stage.appendChild(el);
      }
      function render() {
        app.querySelectorAll(".card").forEach((el) => el.remove());
        stage.querySelectorAll(".builder-item").forEach((el) => el.remove());
        Object.keys(context).forEach((k) => delete context[k]);
        topo.forEach((id) => {
          const node = nodes.find((n) => n.id === id);
          if (!node) return;
          const t = node.data?.nodeType || "";
          const key = node.data?.refKey || node.id;
          let produced = "";
          if (t === "input") produced = inputs[node.id] || "";
          else if (t === "string" || t === "text" || t === "math" || t === "script") produced = tpl(node.data?.value || "");
          else produced = tpl(node.data?.value || "");
          context[key] = produced;
          if (t === "text" || t === "image" || t === "system-info" || t === "particle" || t === "layout") {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = "<div><strong>" + (node.data?.label || "Node") + "</strong></div>" +
              "<div class='kind'>" + (node.data?.kind || "unknown") + "</div>" +
              (t === "image" ? "<img src='" + produced + "' style='max-width:100%;max-height:180px;border:1px solid #333;margin-top:6px'/>" : "<div>" + produced + "</div>");
            app.appendChild(card);
          }
        });
        uiElements.forEach(renderUi);
      }
      render();
    </script>
  </body>
</html>`;
}

function ensureTempExport(project) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ixo-export-"));
  fs.writeFileSync(
    path.join(tempRoot, "project.ixo"),
    JSON.stringify(project, null, 2),
    "utf-8"
  );
  fs.writeFileSync(path.join(tempRoot, "preview.html"), projectToHtml(project), "utf-8");
  return tempRoot;
}

function getRuntimePlatformInfo() {
  if (process.platform === "win32") {
    return {
      key: "windows",
      label: "Windows",
      folderName: "IXO-Engine-Windows",
      executableName: "IXO Engine.exe",
      devRuntimePath: path.join(__dirname, "..", "release", "windows", "win-unpacked")
    };
  }

  if (process.platform === "linux") {
    return {
      key: "linux",
      label: "Linux",
      folderName: "IXO-Engine-Linux",
      executableName: "ixo-engine",
      devRuntimePath: path.join(__dirname, "..", "release", "linux", "linux-unpacked")
    };
  }

  if (process.platform === "darwin") {
    return {
      key: "macos",
      label: "macOS",
      folderName: "IXO-Engine-macOS",
      executableName: "IXO Engine.app",
      devRuntimePath: path.join(__dirname, "..", "release", "macos", "mac")
    };
  }

  throw new Error(`Export runtime is not supported on ${process.platform}.`);
}

function getPackagedRuntimeRoot() {
  if (process.platform === "darwin") {
    return path.resolve(process.execPath, "..", "..", "..");
  }
  return path.dirname(process.execPath);
}

function findRuntimeSource(platformInfo) {
  const packagedPath = app.isPackaged ? getPackagedRuntimeRoot() : "";
  if (packagedPath && fs.existsSync(packagedPath)) {
    return packagedPath;
  }

  if (fs.existsSync(platformInfo.devRuntimePath)) {
    return platformInfo.devRuntimePath;
  }

  throw new Error(
    `${platformInfo.label} runtime was not found. Run the platform build first, then export again.`
  );
}

function writeExportReadme(targetDir, platformInfo) {
  const launchLine = platformInfo.key === "windows"
    ? `IXO-Engine-Windows\\${platformInfo.executableName}`
    : platformInfo.key === "linux"
      ? `chmod +x IXO-Engine-Linux/${platformInfo.executableName} && ./IXO-Engine-Linux/${platformInfo.executableName}`
      : `open IXO-Engine-macOS/${platformInfo.executableName}`;

  fs.writeFileSync(
    path.join(targetDir, "README.txt"),
    [
      "IXO Engine Export",
      "",
      `Platform: ${platformInfo.label}`,
      `Run: ${launchLine}`,
      "",
      "project.ixo contains the editable IXO project data.",
      "preview.html is a browser-readable preview of the exported project.",
      "The runtime folder contains a ready-to-run IXO Engine build for this platform."
    ].join("\n"),
    "utf-8"
  );
}

function ensureRuntimeExport(project) {
  const tempRoot = ensureTempExport(project);
  const platformInfo = getRuntimePlatformInfo();
  const runtimeSource = findRuntimeSource(platformInfo);
  const runtimeTarget = path.join(tempRoot, platformInfo.folderName);

  fs.cpSync(runtimeSource, runtimeTarget, { recursive: true });

  const exportDir = path.join(
    runtimeTarget,
    process.platform === "darwin" ? path.join("Contents", "Resources") : "resources",
    "export"
  );
  fs.mkdirSync(exportDir, { recursive: true });
  fs.writeFileSync(path.join(exportDir, "project.ixo"), JSON.stringify(project, null, 2), "utf-8");
  fs.writeFileSync(path.join(exportDir, "preview.html"), projectToHtml(project), "utf-8");
  writeExportReadme(tempRoot, platformInfo);

  return tempRoot;
}

function createZip(sourceDir, outputFile) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputFile);
    const archive = archiver("zip", { zlib: { level: 9 } });
    output.on("close", resolve);
    archive.on("error", reject);
    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

function create7z(sourceDir, outputFile) {
  return new Promise((resolve, reject) => {
    const child = spawn(path7za, ["a", "-t7z", outputFile, path.join(sourceDir, "*")], {
      windowsHide: true
    });
    let errorText = "";
    child.stderr.on("data", (chunk) => {
      errorText += String(chunk);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(errorText || "7z archive failed."));
      }
    });
  });
}

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1024,
    minHeight: 640,
    // autoHideMenuBar: true, // 만약 Alt키로 메뉴를 보고 싶다면 이 주석을 해제하세요.
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // 2. 상단 메뉴바(File, Edit 등)를 완전히 제거
  Menu.setApplicationMenu(null); 
  mainWindow.maximize();

  mainWindow.on("close", async (event) => {
    if (windowState.allowClose || !windowState.isDirty) {
      return;
    }
    event.preventDefault();
    const answer = await dialog.showMessageBox(mainWindow, {
      type: "warning",
      title: "Unsaved Changes",
      message: "저장하지 않은 변경 사항이 있습니다. 저장하시겠습니까?",
      buttons: ["예", "아니오", "취소"],
      cancelId: 2,
      defaultId: 0
    });

    if (answer.response === 2) {
      return;
    }
    if (answer.response === 0) {
      const savePath = await dialog.showSaveDialog(mainWindow, {
        title: "Save IXO Project",
        filters: [{ name: "IXO Project", extensions: ["ixo"] }],
        defaultPath: "project.ixo"
      });
      if (savePath.canceled || !savePath.filePath) {
        return;
      }
      fs.writeFileSync(
        savePath.filePath,
        JSON.stringify(windowState.latestProject || {}, null, 2),
        "utf-8"
      );
    }
    windowState.allowClose = true;
    mainWindow.close();
  });

  const devUrl = process.env.ELECTRON_START_URL || "http://localhost:5173";
  
  if (!app.isPackaged) {
    mainWindow.loadURL(devUrl);
    // 개발 모드에서 DevTools(검사)를 자동으로 열고 싶다면 아래 주석을 해제하세요.
    // mainWindow.webContents.openDevTools(); 
    return;
  }

  const exportedPreviewPath = path.join(process.resourcesPath, "export", "preview.html");
  if (fs.existsSync(exportedPreviewPath)) {
    mainWindow.loadFile(exportedPreviewPath);
    return;
  }

  mainWindow.loadFile(path.join(__dirname, "..", "dist", "renderer", "index.html"));
}

app.whenReady().then(() => {
  ipcMain.handle("app:setDirtyState", (_, payload) => {
    windowState.isDirty = Boolean(payload?.isDirty);
    if (payload?.project) {
      windowState.latestProject = payload.project;
    }
    return { ok: true };
  });

  ipcMain.handle("app:getInfo", () => ({
    version: app.getVersion(),
    platform: process.platform
  }));

  ipcMain.handle("app:checkForUpdates", async () => checkForUpdates());

  ipcMain.handle("app:downloadUpdate", async (_, asset) => downloadReleaseAsset(asset));

  ipcMain.handle("project:save", async (_, payload) => {
    const target = await dialog.showSaveDialog({
      title: "Save IXO Project",
      filters: [{ name: "IXO Project", extensions: ["ixo"] }],
      defaultPath: "project.ixo"
    });
    if (target.canceled || !target.filePath) {
      return { ok: false, canceled: true };
    }
    fs.writeFileSync(target.filePath, JSON.stringify(payload, null, 2), "utf-8");
    windowState.isDirty = false;
    windowState.latestProject = payload;
    return { ok: true, path: target.filePath };
  });

  ipcMain.handle("project:load", async () => {
    const target = await dialog.showOpenDialog({
      title: "Load IXO Project",
      filters: [{ name: "IXO Project", extensions: ["ixo"] }],
      properties: ["openFile"]
    });
    if (target.canceled || !target.filePaths[0]) {
      return { ok: false, canceled: true };
    }
    const content = fs.readFileSync(target.filePaths[0], "utf-8");
    const data = JSON.parse(content);
    windowState.isDirty = false;
    windowState.latestProject = data;
    return { ok: true, path: target.filePaths[0], data };
  });

  ipcMain.handle("project:export", async (_, payload) => {
    const target = await dialog.showSaveDialog({
      title: "Export Project",
      filters: [
        { name: "Zip Archive", extensions: ["zip"] },
        { name: "7z Archive", extensions: ["7z"] }
      ],
      defaultPath: "ixo-export.zip"
    });
    if (target.canceled || !target.filePath) {
      return { ok: false, canceled: true };
    }
    const tempDir = ensureRuntimeExport(payload);
    try {
      if (target.filePath.toLowerCase().endsWith(".7z")) {
        await create7z(tempDir, target.filePath);
      } else {
        await createZip(tempDir, target.filePath);
      }
      return { ok: true, path: target.filePath };
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  ipcMain.handle("shell:openExternal", async (_, url) => {
    await shell.openExternal(url);
    return { ok: true };
  });

  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
