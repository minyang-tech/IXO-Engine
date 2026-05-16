const { app, BrowserWindow, Menu, ipcMain, dialog, shell, net: electronNet } = require("electron");
const path = require("path");
const fs = require("fs");
const originalFs = require("original-fs");
const os = require("os");
const dns = require("dns").promises;
const nodeNet = require("net");
const { spawn } = require("child_process");
const { checkForUpdates, downloadReleaseAsset } = require("./updateService");
const EXTERNAL_REQUEST_TIMEOUT_MS = 8000;
const MAX_EXTERNAL_REDIRECTS = 3;
const DEFAULT_EXPORT_APP_STEM = "myt-ixo";
const SECURITY_PREFERENCES_FILE = "security-preferences.json";
const trustedWebContentsIds = new Set();
const securityApprovalsByWebContents = new Map();
const fileWatchersByWebContents = new Map();
let startupHttpsPreferencePromise = null;
const windowState = {
  isDirty: false,
  latestProject: null,
  allowClose: false
};

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function projectToHtml(project, appName = DEFAULT_EXPORT_APP_STEM) {
  const safeJson = JSON.stringify(project).replace(/</g, "\\u003c");
  const safeAppName = escapeHtml(appName);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeAppName}</title>
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
    </style>
  </head>
  <body>
    <div class="wrap">
      <h1>${safeAppName}</h1>
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
        return String(text || "").replace(/\\{\\{\\s*([^}]+)\\s*\\}\\}/g, (_, key) => String(context[key.trim()] ?? ""));
      }
      function cast(raw) {
        const stripped = String(raw ?? "").trim().replace(/^['"]|['"]$/g, "");
        const numeric = Number(stripped);
        return Number.isNaN(numeric) ? stripped : numeric;
      }
      function compare(expression) {
        const match = String(expression || "").match(/^(.+?)\\s*(==|!=|>=|<=|>|<)\\s*(.+)$/);
        if (!match) return Boolean(String(expression || "").trim());
        const left = cast(match[1]);
        const right = cast(match[3]);
        if (match[2] === "==") return left == right;
        if (match[2] === "!=") return left != right;
        if (match[2] === ">") return left > right;
        if (match[2] === "<") return left < right;
        if (match[2] === ">=") return left >= right;
        if (match[2] === "<=") return left <= right;
        return false;
      }
      function condition(expression) {
        return tpl(expression || "")
          .split(/\\s+OR\\s+/i)
          .filter(Boolean)
          .some((part) => part.split(/\\s+AND\\s+/i).filter(Boolean).every(compare));
      }
      function math(expression) {
        const rendered = tpl(expression || "");
        const match = rendered.match(/^(-?\\d+(?:\\.\\d+)?)\\s*([\\+\\-\\*\\/])\\s*(-?\\d+(?:\\.\\d+)?)$/);
        if (!match) return rendered;
        const left = Number(match[1]);
        const right = Number(match[3]);
        if (match[2] === "+") return left + right;
        if (match[2] === "-") return left - right;
        if (match[2] === "*") return left * right;
        return right === 0 ? 0 : left / right;
      }
      function letter(value) {
        const match = String(value || "").match(/^(\\d+)\\s+of\\s+(.+)$/i);
        return match ? String(match[2]).charAt(Math.max(0, Number(match[1]) - 1)) : "";
      }
      function replaceText(value) {
        const parts = String(value || "").split("|").map((part) => part.trim());
        return String(parts[0] || "").split(parts[1] || "").join(parts[2] || "");
      }
      function textCase(value) {
        const match = String(value || "").match(/^(upper|lower)\\s+(.+)$/i);
        return !match ? String(value || "") : match[1].toLowerCase() === "upper" ? match[2].toUpperCase() : match[2].toLowerCase();
      }
      function resolveUiValue(item, field) {
        const base = field === "src" ? item.src : item.text;
        if (item.bindingKey && typeof context[item.bindingKey] !== "undefined" && context[item.bindingKey] !== "") {
          return String(context[item.bindingKey]);
        }
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
        input.value = inputs[node.id] ?? "";
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
        stage.querySelectorAll(".builder-item").forEach((el) => el.remove());
        Object.keys(context).forEach((k) => delete context[k]);
        topo.forEach((id) => {
          const node = nodes.find((n) => n.id === id);
          if (!node) return;
          const t = node.data?.nodeType || "";
          const key = node.data?.refKey || node.id;
          let produced = "";
          if (t === "input") produced = inputs[node.id] ?? "";
          else if (t === "math") produced = math(node.data?.value || "");
          else if (t === "condition" || t === "compare") produced = condition(node.data?.value || "") ? "true" : "false";
          else if (t === "random") produced = Math.floor(Math.random() * (Number(tpl(node.data?.value || "")) || 100));
          else if (t === "random-range") {
            const [min, max] = tpl(node.data?.value || "").split("..").map((part) => Number(part.trim()));
            produced = Math.floor((Number.isFinite(min) ? min : 1) + Math.random() * ((Number.isFinite(max) ? max : 10) - (Number.isFinite(min) ? min : 1) + 1));
          }
          else if (t === "timer") produced = String(Math.round(performance.now() / 1000));
          else if (t === "date-part") {
            const part = String(node.data?.value || "year").toLowerCase();
            const now = new Date();
            produced = part.includes("month") ? now.getMonth() + 1 : part.includes("day") ? now.getDate() : part.includes("hour") ? now.getHours() : now.getFullYear();
          }
          else if (t === "text-length") produced = String(tpl(node.data?.value || "")).length;
          else if (t === "text-letter") produced = letter(tpl(node.data?.value || ""));
          else if (t === "text-replace") produced = replaceText(tpl(node.data?.value || ""));
          else if (t === "text-case") produced = textCase(tpl(node.data?.value || ""));
          else if (t === "rgb-hex") {
            const channels = String(tpl(node.data?.value || "")).match(/\\d+/g)?.slice(0, 3).map((item) => Math.max(0, Math.min(255, Number(item)))) || [255, 0, 0];
            produced = "#" + channels.map((item) => item.toString(16).padStart(2, "0")).join("");
          }
          else produced = tpl(node.data?.value || "");
          context[key] = produced;
        });
        uiElements.forEach(renderUi);
      }
      render();
    </script>
  </body>
</html>`;
}

function ensureTempExport() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "ixo-export-"));
}

function getSecurityPreferencesPath() {
  return path.join(app.getPath("userData"), SECURITY_PREFERENCES_FILE);
}

function readSecurityPreferences() {
  try {
    return JSON.parse(fs.readFileSync(getSecurityPreferencesPath(), "utf-8"));
  } catch {
    return {};
  }
}

function writeSecurityPreferences(next) {
  fs.mkdirSync(path.dirname(getSecurityPreferencesPath()), { recursive: true });
  fs.writeFileSync(getSecurityPreferencesPath(), JSON.stringify(next, null, 2), "utf-8");
}

function getRuntimePlatformInfo(targetPlatform = process.platform) {
  if (targetPlatform === "win32" || targetPlatform === "windows") {
    return {
      key: "windows",
      label: "Windows",
      folderName: "IXO-Engine-Windows",
      executableName: "IXO Engine.exe",
      devRuntimePaths: [
        path.join(__dirname, "..", "dist_electron_final", "win-unpacked"),
        path.join(__dirname, "..", "release", "windows", "win-unpacked"),
        path.join(__dirname, "..", "dist_release_final", "win-unpacked"),
        path.join(__dirname, "..", "dist_electron", "win-unpacked")
      ]
    };
  }

  if (targetPlatform === "linux") {
    return {
      key: "linux",
      label: "Linux",
      folderName: "IXO-Engine-Linux",
      executableName: "ixo-engine",
      devRuntimePaths: [
        path.join(__dirname, "..", "dist_electron_final", "linux-unpacked"),
        path.join(__dirname, "..", "release", "linux", "linux-unpacked"),
        path.join(__dirname, "..", "dist_release_linux_final", "linux-unpacked")
      ]
    };
  }

  if (targetPlatform === "darwin" || targetPlatform === "macos") {
    return {
      key: "macos",
      label: "macOS",
      folderName: "IXO-Engine-macOS",
      executableName: "IXO Engine.app",
      devRuntimePaths: [
        path.join(__dirname, "..", "dist_electron_final", "mac"),
        path.join(__dirname, "..", "release", "macos", "mac"),
        path.join(__dirname, "..", "dist_release_mac_final", "mac")
      ]
    };
  }

  throw new Error(`Export runtime is not supported on ${targetPlatform}.`);
}

function getSecurityApprovals(webContentsId) {
  if (!securityApprovalsByWebContents.has(webContentsId)) {
    securityApprovalsByWebContents.set(webContentsId, {
      external: false,
      httpsNode: false,
      script: false
    });
  }
  return securityApprovalsByWebContents.get(webContentsId);
}

function resetSecurityApprovals(webContentsId) {
  securityApprovalsByWebContents.set(webContentsId, {
    external: false,
    httpsNode: false,
    script: false
  });
}

function getWatcherBucket(webContentsId) {
  if (!fileWatchersByWebContents.has(webContentsId)) {
    fileWatchersByWebContents.set(webContentsId, new Map());
  }
  return fileWatchersByWebContents.get(webContentsId);
}

function closeWatchers(webContentsId) {
  const bucket = fileWatchersByWebContents.get(webContentsId);
  if (!bucket) return;
  bucket.forEach((watcher) => watcher.close());
  fileWatchersByWebContents.delete(webContentsId);
}

function assertTrustedSender(event) {
  if (!trustedWebContentsIds.has(event.sender.id)) {
    throw new Error("Blocked IPC call from an untrusted renderer.");
  }
}

function normalizeHostname(hostname) {
  return String(hostname || "").replace(/^\[|\]$/g, "").toLowerCase();
}

function isPrivateIpv4(address) {
  const parts = address.split(".").map((part) => Number(part));
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return false;
  }

  const [first, second] = parts;
  return (
    first === 0
    || first === 10
    || first === 127
    || (first === 100 && second >= 64 && second <= 127)
    || (first === 169 && second === 254)
    || (first === 172 && second >= 16 && second <= 31)
    || (first === 192 && second === 168)
    || (first === 198 && (second === 18 || second === 19))
  );
}

function isPrivateIpv6(address) {
  const normalized = address.toLowerCase();
  return (
    normalized === "::"
    || normalized === "::1"
    || normalized.startsWith("fc")
    || normalized.startsWith("fd")
    || normalized.startsWith("fe8")
    || normalized.startsWith("fe9")
    || normalized.startsWith("fea")
    || normalized.startsWith("feb")
    || normalized.startsWith("::ffff:127.")
    || normalized.startsWith("::ffff:10.")
    || normalized.startsWith("::ffff:192.168.")
  );
}

function isPrivateIpAddress(address) {
  const ipVersion = nodeNet.isIP(address);
  if (ipVersion === 4) {
    return isPrivateIpv4(address);
  }
  if (ipVersion === 6) {
    return isPrivateIpv6(address);
  }
  return false;
}

function isBlockedHostname(hostname) {
  const normalized = normalizeHostname(hostname);
  return (
    !normalized
    || normalized === "localhost"
    || normalized.endsWith(".localhost")
    || normalized.endsWith(".local")
    || isPrivateIpAddress(normalized)
  );
}

async function validatePublicHttpsUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(String(rawUrl || "").trim());
  } catch {
    throw new Error("Invalid URL.");
  }

  if (parsed.protocol !== "https:") {
    throw new Error("Only HTTPS URLs are allowed.");
  }

  if (isBlockedHostname(parsed.hostname)) {
    throw new Error("Local or private network hosts are blocked.");
  }

  const resolvedAddresses = await dns.lookup(parsed.hostname, {
    all: true,
    verbatim: true
  });

  if (!resolvedAddresses.length || resolvedAddresses.some(({ address }) => isPrivateIpAddress(address))) {
    throw new Error("Local or private network destinations are blocked.");
  }

  return parsed;
}

async function fetchValidatedHttpsUrl(rawUrl, remainingRedirects = MAX_EXTERNAL_REDIRECTS) {
  const parsed = await validatePublicHttpsUrl(rawUrl);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), EXTERNAL_REQUEST_TIMEOUT_MS);

  try {
    const response = await electronNet.fetch(parsed.toString(), {
      method: "GET",
      redirect: "manual",
      cache: "no-store",
      credentials: "omit",
      signal: controller.signal
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) {
        return { ok: response.ok, status: response.status, url: parsed.toString() };
      }
      if (remainingRedirects <= 0) {
        throw new Error("Too many redirects.");
      }
      return fetchValidatedHttpsUrl(new URL(location, parsed).toString(), remainingRedirects - 1);
    }

    return {
      ok: response.ok,
      status: response.status,
      url: parsed.toString()
    };
  } finally {
    clearTimeout(timer);
  }
}

async function requestSecurityApproval(event, scope, context = {}) {
  assertTrustedSender(event);
  if (!["external", "httpsNode", "script"].includes(scope)) {
    throw new Error("Unknown security approval scope.");
  }

  const approvals = getSecurityApprovals(event.sender.id);
  if (approvals[scope]) {
    return { approved: true, alreadyApproved: true };
  }

  const copy = scope === "httpsNode"
    ? {
        title: "HTTPS Node Approval",
        message: "https:// 통신 노드의 사용을 원하십니까?",
        detail: "승인하면 이 프로젝트 세션에서 HTTPS 요청 노드를 연결하고 실행할 수 있습니다."
      }
    : scope === "external"
      ? {
          title: "External Action Approval",
          message: "This project wants to use HTTPS requests or open an external browser.",
          detail: "Allow external actions for this project session?"
        }
      : {
        title: "Script Execution Approval",
        message: "This project contains script nodes that can run custom code.",
        detail: "Allow script nodes for this project session?"
      };

  const result = await dialog.showMessageBox(BrowserWindow.fromWebContents(event.sender), {
    type: "warning",
    title: copy.title,
    message: copy.message,
    detail: copy.detail,
    buttons: ["Allow", "Block"],
    defaultId: 1,
    cancelId: 1,
    noLink: true
  });

  approvals[scope] = result.response === 0;
  if (scope === "httpsNode" && approvals[scope]) {
    approvals.external = true;
  }
  return { approved: approvals[scope], alreadyApproved: false };
}

async function ensureStartupHttpsPreference(parentWindow) {
  const preferences = readSecurityPreferences();
  if (typeof preferences.httpsNodesEnabled === "boolean") {
    return preferences.httpsNodesEnabled;
  }

  if (!startupHttpsPreferencePromise) {
    startupHttpsPreferencePromise = (async () => {
      const result = await dialog.showMessageBox(parentWindow, {
        type: "question",
        title: "HTTPS Node Permission",
        message: "https:// 통신 노드의 사용을 원하십니까?",
        detail: "허용하면 프로젝트에서 HTTPS 요청 노드를 사용할 수 있습니다. 나중에 설정에서 언제든 켜거나 끌 수 있습니다.",
        buttons: ["허용", "거부"],
        defaultId: 0,
        cancelId: 1,
        noLink: true
      });

      const httpsNodesEnabled = result.response === 0;
      writeSecurityPreferences({
        ...preferences,
        httpsNodesEnabled
      });
      return httpsNodesEnabled;
    })().finally(() => {
      startupHttpsPreferencePromise = null;
    });
  }

  return startupHttpsPreferencePromise;
}

function getPackagedRuntimeRoot() {
  if (process.platform === "darwin") {
    return path.resolve(process.execPath, "..", "..", "..");
  }
  return path.dirname(process.execPath);
}

function findRuntimeSource(platformInfo) {
  const packagedPath = app.isPackaged ? getPackagedRuntimeRoot() : "";
  if (packagedPath && fs.existsSync(packagedPath) && fs.statSync(packagedPath).isDirectory()) {
    return packagedPath;
  }

  const developmentRuntimePath = platformInfo.devRuntimePaths.find((candidate) => (
    fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()
  ));
  if (developmentRuntimePath) {
    return developmentRuntimePath;
  }

  throw new Error(
    `${platformInfo.label} runtime was not found. Run the platform build first, then export again.`
  );
}

function sanitizeExportAppStem(rawName) {
  const withoutExtension = String(rawName || "")
    .trim()
    .replace(/\.(exe|app)$/i, "");
  const cleaned = withoutExtension
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-")
    .replace(/\s+/g, " ")
    .replace(/[. ]+$/g, "")
    .trim();
  return cleaned || DEFAULT_EXPORT_APP_STEM;
}

function getExportExecutableName(platformInfo, appStem) {
  if (platformInfo.key === "windows") {
    return `${appStem}.exe`;
  }
  if (platformInfo.key === "macos") {
    return `${appStem}.app`;
  }
  return appStem;
}

function normalizeExportOptions(options, platformInfo) {
  const appStem = sanitizeExportAppStem(options?.appName);
  return {
    appStem,
    executableName: getExportExecutableName(platformInfo, appStem),
    icon: options?.icon || null
  };
}

function copyRuntimeIntoExportRoot(runtimeSource, tempRoot, platformInfo, runtimeFs) {
  if (platformInfo.key === "macos") {
    const sourceAppBundle = runtimeSource.endsWith(".app")
      ? runtimeSource
      : path.join(runtimeSource, platformInfo.executableName);
    const targetAppBundle = path.join(tempRoot, platformInfo.executableName);
    runtimeFs.cpSync(sourceAppBundle, targetAppBundle, { recursive: true });
    return targetAppBundle;
  }

  runtimeFs.readdirSync(runtimeSource).forEach((entry) => {
    runtimeFs.cpSync(
      path.join(runtimeSource, entry),
      path.join(tempRoot, entry),
      { recursive: true }
    );
  });
  return tempRoot;
}

function decodeIconDataUrl(icon) {
  if (!icon?.dataUrl || typeof icon.dataUrl !== "string") {
    return null;
  }

  const match = icon.dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Export icon data is invalid.");
  }

  return {
    mime: match[1],
    buffer: Buffer.from(match[2], "base64"),
    originalName: String(icon.name || "")
  };
}

async function materializeWindowsIcon(icon, tempRoot) {
  const decoded = decodeIconDataUrl(icon);
  if (!decoded) {
    return null;
  }

  const extension = path.extname(decoded.originalName).toLowerCase();
  if (extension === ".ico" || decoded.mime === "image/x-icon" || decoded.mime === "image/vnd.microsoft.icon") {
    const iconPath = path.join(tempRoot, "export-icon.ico");
    fs.writeFileSync(iconPath, decoded.buffer);
    return iconPath;
  }

  if (extension === ".png" || decoded.mime === "image/png") {
    const pngPath = path.join(tempRoot, "export-icon.png");
    const icoPath = path.join(tempRoot, "export-icon.ico");
    fs.writeFileSync(pngPath, decoded.buffer);
    const { default: pngToIco } = await import("png-to-ico");
    const icoBuffer = await pngToIco(pngPath);
    fs.writeFileSync(icoPath, icoBuffer);
    return icoPath;
  }

  throw new Error("Export icon must be a PNG or ICO file.");
}

function getRceditExecutablePath() {
  const executableName = process.arch === "x64" ? "rcedit-x64.exe" : "rcedit.exe";
  if (!app.isPackaged) {
    return path.join(__dirname, "..", "node_modules", "rcedit", "bin", executableName);
  }
  return path.join(process.resourcesPath, "app.asar.unpacked", "node_modules", "rcedit", "bin", executableName);
}

function runRcedit(executablePath, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(executablePath, args, { windowsHide: true });
    let errorText = "";
    child.stderr.on("data", (chunk) => {
      errorText += String(chunk);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(errorText || "Failed to customize exported executable."));
      }
    });
  });
}

async function customizeWindowsExecutable(executablePath, exportOptions, tempRoot) {
  if (process.platform !== "win32") {
    return;
  }

  const args = [
    executablePath,
    "--set-version-string",
    "ProductName",
    exportOptions.appStem,
    "--set-version-string",
    "FileDescription",
    exportOptions.appStem,
    "--set-version-string",
    "InternalName",
    exportOptions.executableName,
    "--set-version-string",
    "OriginalFilename",
    exportOptions.executableName
  ];

  const iconPath = await materializeWindowsIcon(exportOptions.icon, tempRoot);
  if (iconPath) {
    args.push("--set-icon", iconPath);
  }

  await runRcedit(getRceditExecutablePath(), args);
}

async function renameExportExecutable(runtimeTarget, platformInfo, exportOptions, runtimeFs) {
  if (platformInfo.key === "macos") {
    const renamedBundlePath = path.join(path.dirname(runtimeTarget), exportOptions.executableName);
    if (runtimeTarget !== renamedBundlePath) {
      runtimeFs.renameSync(runtimeTarget, renamedBundlePath);
    }
    return renamedBundlePath;
  }

  const originalExecutablePath = path.join(runtimeTarget, platformInfo.executableName);
  const renamedExecutablePath = path.join(runtimeTarget, exportOptions.executableName);

  if (originalExecutablePath !== renamedExecutablePath) {
    runtimeFs.renameSync(originalExecutablePath, renamedExecutablePath);
  }

  await customizeWindowsExecutable(renamedExecutablePath, exportOptions, runtimeTarget);
  return runtimeTarget;
}

async function ensureRuntimeExport(project, options = {}) {
  const tempRoot = ensureTempExport();
  const platformInfo = getRuntimePlatformInfo(options?.targetPlatform);
  try {
    const exportOptions = normalizeExportOptions(options, platformInfo);
    const runtimeSource = findRuntimeSource(platformInfo);
    const runtimeFs = originalFs;
    const resourcesDir = process.platform === "darwin"
      ? path.join("Contents", "Resources")
      : "resources";

    // Electron's patched fs treats app.asar like a directory; original-fs keeps it as a file.
    const copiedRuntimeTarget = copyRuntimeIntoExportRoot(runtimeSource, tempRoot, platformInfo, runtimeFs);
    const runtimeTarget = await renameExportExecutable(copiedRuntimeTarget, platformInfo, exportOptions, runtimeFs);

    const exportDir = path.join(
      runtimeTarget,
      resourcesDir,
      "export"
    );
    fs.mkdirSync(exportDir, { recursive: true });
    fs.writeFileSync(path.join(exportDir, "runtime.html"), projectToHtml(project, exportOptions.appStem), "utf-8");

    return tempRoot;
  } catch (error) {
    const cleanupFs = originalFs;
    cleanupFs.rmSync(tempRoot, { recursive: true, force: true });
    throw error;
  }
}

async function removeDirectoryWithRetry(targetDir) {
  const cleanupFs = originalFs;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      cleanupFs.rmSync(targetDir, { recursive: true, force: true });
      return;
    } catch (error) {
      if (attempt === 4) {
        console.warn(`Failed to remove temporary export directory: ${targetDir}`, error);
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }
}

function normalizeOutputDirectory(dirPath) {
  return String(dirPath || "").trim();
}

function getDefaultExportDirectoryPath(appName) {
  const appStem = sanitizeExportAppStem(appName);
  return path.join(app.getPath("downloads"), appStem);
}

const EXPORT_TARGETS = {
  "windows-portable": {
    platform: "windows",
    folderSuffix: "windows-portable",
    kind: "runtime-folder"
  },
  "mac-app": {
    platform: "macos",
    folderSuffix: "macos-app",
    kind: "runtime-folder"
  },
  "linux-bundle": {
    platform: "linux",
    folderSuffix: "linux-bundle",
    kind: "runtime-folder"
  }
};

function validateExportTargets(targets) {
  if (!Array.isArray(targets) || targets.length === 0) {
    throw new Error("Select at least one export format.");
  }

  const unsupported = targets.filter((target) => !EXPORT_TARGETS[target]);
  if (unsupported.length) {
    throw new Error(`These targets need a separate packaging pipeline: ${unsupported.join(", ")}`);
  }

  return [...new Set(targets)];
}

function getExportCapabilities() {
  return Object.entries(EXPORT_TARGETS).map(([key, target]) => {
    try {
      const platformInfo = getRuntimePlatformInfo(target.platform);
      findRuntimeSource(platformInfo);
      return { key, available: true };
    } catch (error) {
      return {
        key,
        available: false,
        reason: String(error.message || error)
      };
    }
  });
}

async function exportRuntimeTarget(project, options, targetKey, outputDir) {
  const target = EXPORT_TARGETS[targetKey];
  const tempDir = await ensureRuntimeExport(project, {
    ...options,
    targetPlatform: target.platform
  });
  try {
    const destination = path.join(
      outputDir,
      `${sanitizeExportAppStem(options?.appName)}-${target.folderSuffix}`
    );
    originalFs.rmSync(destination, { recursive: true, force: true });
    originalFs.mkdirSync(path.dirname(destination), { recursive: true });
    originalFs.cpSync(tempDir, destination, { recursive: true });
    return destination;
  } finally {
    await removeDirectoryWithRetry(tempDir);
  }
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

  const webContentsId = mainWindow.webContents.id;
  trustedWebContentsIds.add(webContentsId);
  resetSecurityApprovals(webContentsId);
  mainWindow.on("closed", () => {
    trustedWebContentsIds.delete(webContentsId);
    securityApprovalsByWebContents.delete(webContentsId);
    closeWatchers(webContentsId);
    if (process.platform !== "darwin") {
      app.quit();
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

  const exportedRuntimePath = path.join(process.resourcesPath, "export", "runtime.html");
  if (fs.existsSync(exportedRuntimePath)) {
    mainWindow.loadFile(exportedRuntimePath);
    return;
  }

  mainWindow.loadFile(path.join(__dirname, "..", "dist", "renderer", "index.html"));
}

app.whenReady().then(() => {
  ipcMain.handle("app:setDirtyState", (event, payload) => {
    assertTrustedSender(event);
    windowState.isDirty = Boolean(payload?.isDirty);
    if (payload?.project) {
      windowState.latestProject = payload.project;
    }
    return { ok: true };
  });

  ipcMain.handle("app:getInfo", (event) => {
    assertTrustedSender(event);
    return {
    version: app.getVersion(),
    platform: process.platform
    };
  });

  ipcMain.handle("app:checkForUpdates", async (event) => {
    assertTrustedSender(event);
    return checkForUpdates();
  });

  ipcMain.handle("app:downloadUpdate", async (event, asset) => {
    assertTrustedSender(event);
    return downloadReleaseAsset(asset);
  });

  ipcMain.handle("security:requestApproval", async (event, scope, context) => requestSecurityApproval(event, scope, context));

  ipcMain.handle("security:getPreferences", (event) => {
    assertTrustedSender(event);
    return readSecurityPreferences();
  });

  ipcMain.handle("security:setHttpsNodesEnabled", (event, enabled) => {
    assertTrustedSender(event);
    const next = {
      ...readSecurityPreferences(),
      httpsNodesEnabled: Boolean(enabled)
    };
    writeSecurityPreferences(next);
    return next;
  });

  ipcMain.handle("security:promptStartupHttpsPreference", async (event) => {
    assertTrustedSender(event);
    const parentWindow = BrowserWindow.fromWebContents(event.sender);
    return {
      httpsNodesEnabled: await ensureStartupHttpsPreference(parentWindow)
    };
  });

  ipcMain.handle("fs:watchPath", async (event, rawPath) => {
    assertTrustedSender(event);
    const requestedPath = String(rawPath || "").trim();
    if (!requestedPath) {
      throw new Error("A file or folder path is required.");
    }

    const targetPath = path.resolve(requestedPath);
    if (!fs.existsSync(targetPath)) {
      throw new Error("The selected file or folder does not exist.");
    }

    const bucket = getWatcherBucket(event.sender.id);
    if (bucket.has(targetPath)) {
      return { ok: true, path: targetPath, alreadyWatching: true };
    }

    const watcher = fs.watch(targetPath, { persistent: false }, (eventType, filename) => {
      if (!event.sender.isDestroyed()) {
        event.sender.send("fs:watchEvent", {
          path: targetPath,
          requestedPath,
          eventType,
          filename: filename ? String(filename) : "",
          at: Date.now()
        });
      }
    });
    bucket.set(targetPath, watcher);
    return { ok: true, path: targetPath, alreadyWatching: false };
  });

  ipcMain.handle("fs:unwatchPath", async (event, rawPath) => {
    assertTrustedSender(event);
    const targetPath = path.resolve(String(rawPath || "").trim());
    const bucket = getWatcherBucket(event.sender.id);
    bucket.get(targetPath)?.close();
    bucket.delete(targetPath);
    return { ok: true, path: targetPath };
  });

  ipcMain.handle("security:resetApprovals", async (event) => {
    assertTrustedSender(event);
    resetSecurityApprovals(event.sender.id);
    return { ok: true };
  });

  ipcMain.handle("project:save", async (event, payload) => {
    assertTrustedSender(event);
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

  ipcMain.handle("project:load", async (event) => {
    assertTrustedSender(event);
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
    resetSecurityApprovals(event.sender.id);
    return { ok: true, path: target.filePaths[0], data };
  });

  ipcMain.handle("project:chooseExportPath", async (event, options = {}) => {
    assertTrustedSender(event);
    const target = await dialog.showOpenDialog({
      title: "Choose Export Folder",
      defaultPath: getDefaultExportDirectoryPath(options?.appName),
      properties: ["openDirectory", "createDirectory"]
    });
    if (target.canceled || !target.filePaths[0]) {
      return { ok: false, canceled: true };
    }
    return { ok: true, path: normalizeOutputDirectory(target.filePaths[0]) };
  });

  ipcMain.handle("project:getExportCapabilities", (event) => {
    assertTrustedSender(event);
    return getExportCapabilities();
  });

  ipcMain.handle("project:export", async (event, payload, options = {}) => {
    assertTrustedSender(event);
    try {
      const outputDir = normalizeOutputDirectory(options?.outputDir);
      if (!outputDir) {
        throw new Error("Choose an export folder before exporting.");
      }
      const targets = validateExportTargets(options?.targets);
      originalFs.mkdirSync(outputDir, { recursive: true });

      const outputs = [];
      for (const target of targets) {
        outputs.push(await exportRuntimeTarget(payload, options, target, outputDir));
      }

      shell.showItemInFolder(outputs[0]);
      return { ok: true, path: outputDir, outputs };
    } catch (error) {
      return { ok: false, error: error.message || "Export failed." };
    }
  });

  ipcMain.handle("net:httpsRequest", async (event, url) => {
    assertTrustedSender(event);
    if (!getSecurityApprovals(event.sender.id).external) {
      throw new Error("External actions require approval.");
    }
    return fetchValidatedHttpsUrl(url);
  });

  ipcMain.handle("shell:openExternal", async (event, url) => {
    assertTrustedSender(event);
    if (!getSecurityApprovals(event.sender.id).external) {
      throw new Error("External actions require approval.");
    }
    const parsed = await validatePublicHttpsUrl(url);
    await shell.openExternal(parsed.toString());
    return { ok: true, url: parsed.toString() };
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
