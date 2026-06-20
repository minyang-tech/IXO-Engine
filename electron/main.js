const { app, BrowserWindow, Menu, ipcMain, dialog, shell, net: electronNet, nativeImage } = require("electron");
const path = require("path");
const fs = require("fs");
const originalFs = require("original-fs");
const os = require("os");
const crypto = require("crypto");
const dns = require("dns").promises;
const nodeNet = require("net");
const { spawn } = require("child_process");
const { checkForUpdates, downloadReleaseAsset, openReleasePage } = require("./updateService");
const EXTERNAL_REQUEST_TIMEOUT_MS = 8000;
const MAX_EXTERNAL_REDIRECTS = 3;
const MAX_EXTERNAL_RESPONSE_BYTES = 1024 * 1024;
const DEFAULT_EXPORT_APP_STEM = "myt-ixo";
const MOBILE_ICON_BACKGROUND_COLOR = "#101713";
const ANDROID_ICON_DENSITIES = [
  { name: "mdpi", legacySize: 48, adaptiveSize: 108 },
  { name: "hdpi", legacySize: 72, adaptiveSize: 162 },
  { name: "xhdpi", legacySize: 96, adaptiveSize: 216 },
  { name: "xxhdpi", legacySize: 144, adaptiveSize: 324 },
  { name: "xxxhdpi", legacySize: 192, adaptiveSize: 432 }
];
const IOS_APP_ICON_SLOTS = [
  { idiom: "iphone", size: "20x20", scale: "2x", pixels: 40 },
  { idiom: "iphone", size: "20x20", scale: "3x", pixels: 60 },
  { idiom: "iphone", size: "29x29", scale: "2x", pixels: 58 },
  { idiom: "iphone", size: "29x29", scale: "3x", pixels: 87 },
  { idiom: "iphone", size: "40x40", scale: "2x", pixels: 80 },
  { idiom: "iphone", size: "40x40", scale: "3x", pixels: 120 },
  { idiom: "iphone", size: "60x60", scale: "2x", pixels: 120 },
  { idiom: "iphone", size: "60x60", scale: "3x", pixels: 180 },
  { idiom: "ipad", size: "20x20", scale: "1x", pixels: 20 },
  { idiom: "ipad", size: "20x20", scale: "2x", pixels: 40 },
  { idiom: "ipad", size: "29x29", scale: "1x", pixels: 29 },
  { idiom: "ipad", size: "29x29", scale: "2x", pixels: 58 },
  { idiom: "ipad", size: "40x40", scale: "1x", pixels: 40 },
  { idiom: "ipad", size: "40x40", scale: "2x", pixels: 80 },
  { idiom: "ipad", size: "76x76", scale: "1x", pixels: 76 },
  { idiom: "ipad", size: "76x76", scale: "2x", pixels: 152 },
  { idiom: "ipad", size: "83.5x83.5", scale: "2x", pixels: 167 },
  { idiom: "ios-marketing", size: "1024x1024", scale: "1x", pixels: 1024 }
];
const SECURITY_PREFERENCES_FILE = "security-preferences.json";
const FALLBACK_NETWORK_SAFETY_NOTICE = [
  "## 네트워크 사용 안내",
  "이 애플리케이션은 다음 기능을 위해 HTTPS 기반 네트워크 요청을 사용합니다:",
  "- GitHub API를 통한 최신 버전 확인",
  "- 기능 동작에 필요한 외부 데이터 로딩 (필요한 경우)",
  "",
  "이 앱은 개인 정보를 수집, 저장 또는 외부로 전송하지 않습니다.",
  "사용자의 계정 정보나 식별 가능한 데이터는 처리되지 않습니다.",
  "본 애플리케이션의 주요 기능은 로컬 환경에서 실행되며, 네트워크 연결은 업데이트 확인 및 일부 기능 제공에만 제한적으로 사용됩니다."
].join("\n");
const trustedWebContentsIds = new Set();
const securityApprovalsByWebContents = new Map();
const fileWatchersByWebContents = new Map();
const previewProjectsByWebContents = new Map();
let startupHttpsPreferencePromise = null;
const windowState = {
  isDirty: false,
  latestProject: null,
  currentProjectPath: "",
  allowClose: false
};
const hasSingleInstanceLock = app.requestSingleInstanceLock();

if (!hasSingleInstanceLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    const [mainWindow] = BrowserWindow.getAllWindows();
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
  });
}

function getSecurityPreferencesPath() {
  return path.join(app.getPath("userData"), SECURITY_PREFERENCES_FILE);
}

function getNetworkSafetyNotice() {
  const candidates = [
    path.join(__dirname, "..", "notice for safety.md"),
    path.join(process.resourcesPath || "", "app.asar", "notice for safety.md"),
    path.join(process.resourcesPath || "", "notice for safety.md")
  ];

  for (const candidate of candidates) {
    try {
      if (candidate && fs.existsSync(candidate)) {
        return fs.readFileSync(candidate, "utf-8").trim();
      }
    } catch {
      // Fall back to the embedded copy below.
    }
  }

  return FALLBACK_NETWORK_SAFETY_NOTICE;
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
        path.join(__dirname, "..", "release", "windows", "win-unpacked")
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
        path.join(__dirname, "..", "release", "linux", "linux-unpacked")
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
        path.join(__dirname, "..", "release", "macos", "mac")
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
      script: false,
      fileWatcher: false
    });
  }
  return securityApprovalsByWebContents.get(webContentsId);
}

function readEmbeddedRuntimeProject() {
  try {
    const projectPath = path.join(process.resourcesPath || "", "export", "project.json");
    if (!fs.existsSync(projectPath)) return null;
    return JSON.parse(fs.readFileSync(projectPath, "utf-8"));
  } catch {
    return null;
  }
}

function getEmbeddedRuntimeWindowSettings() {
  const settings = readEmbeddedRuntimeProject()?.exportSettings || {};
  return {
    title: String(settings.windowTitle || "IXO Engine").slice(0, 80),
    width: Math.max(320, Math.min(Number(settings.windowWidth || 1600), 3840)),
    height: Math.max(240, Math.min(Number(settings.windowHeight || 1000), 2160)),
    resizable: Boolean(settings.windowResizable ?? true),
    backgroundColor: /^#[0-9a-f]{6}$/i.test(String(settings.backgroundColor || "")) ? settings.backgroundColor : "#06130d"
  };
}

function resetSecurityApprovals(webContentsId) {
  securityApprovalsByWebContents.set(webContentsId, {
    external: false,
    httpsNode: false,
    script: false,
    fileWatcher: false
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

async function openDocsPage() {
  const docsUrl = new URL("https://minyangtech.n-e.kr/docs/ixo/index");
  await shell.openExternal(docsUrl.toString());
  return { ok: true, url: docsUrl.toString() };
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

    const contentLength = Number(response.headers.get("content-length") || 0);
    if (contentLength > MAX_EXTERNAL_RESPONSE_BYTES) {
      throw new Error("HTTPS response is too large.");
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length > MAX_EXTERNAL_RESPONSE_BYTES) {
      throw new Error("HTTPS response exceeded the maximum size limit.");
    }

    return {
      ok: response.ok,
      status: response.status,
      url: parsed.toString(),
      bytes: buffer.length,
      contentType: response.headers.get("content-type") || "",
      bodyPreview: buffer.toString("utf-8", 0, Math.min(buffer.length, 2048))
    };
  } finally {
    clearTimeout(timer);
  }
}

async function requestSecurityApproval(event, scope, context = {}) {
  assertTrustedSender(event);
  if (!["external", "httpsNode", "script", "fileWatcher"].includes(scope)) {
    throw new Error("Unknown security approval scope.");
  }

  const approvals = getSecurityApprovals(event.sender.id);
  if (approvals[scope]) {
    return { approved: true, alreadyApproved: true };
  }

  const copy = scope === "httpsNode"
    ? {
        title: "Network Node Approval",
        message: "네트워크 계열 노드 사용을 동의하십니까?",
        detail: getNetworkSafetyNotice()
      }
    : scope === "external"
      ? {
          title: "Network Node Approval",
          message: "네트워크 계열 노드 사용을 동의하십니까?",
          detail: getNetworkSafetyNotice()
        }
      : scope === "fileWatcher"
        ? {
            title: "File Watcher Approval",
            message: "이 프로젝트가 로컬 파일 또는 폴더 감시 기능을 사용하려고 합니다.",
            detail: `감시 대상: ${String(context?.path || "선택한 경로")}\n\n허용하면 이 세션 동안 파일 변경 이벤트를 읽을 수 있습니다.`
          }
        : {
            title: "Full Script Execution Approval",
            message: "This project contains script nodes that require full JavaScript execution.",
            detail: "Restricted script mode is used by default. Allow full JavaScript for this project session?"
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
        title: "Network Node Permission",
        message: "네트워크 계열 노드 사용을 동의하십니까?",
        detail: getNetworkSafetyNotice(),
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

function ensureTempExport() {
  return originalFs.mkdtempSync(path.join(app.getPath("temp"), "ixo-export-"));
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

function formatSignalMinute(value = Date.now()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (part) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function sanitizeSignalText(value = "", fallback = "") {
  return String(value || fallback)
    .replace(/[\u0000-\u001f<>]/g, "")
    .trim()
    .slice(0, 80);
}

function collectNodeBuildSignals(project = {}) {
  const collect = (nodes = [], scope = "workspace") => nodes.map((node) => ({
    id: sanitizeSignalText(node?.id, "node"),
    scope,
    type: sanitizeSignalText(node?.data?.nodeType || node?.data?.kind || node?.type, "unknown"),
    label: sanitizeSignalText(node?.data?.label, "Unknown Node"),
    group: sanitizeSignalText(node?.data?.kind || node?.data?.category, "unknown"),
    insertedAt: formatSignalMinute(node?.data?.insertedAt || node?.data?.insertedAtMinute || node?.data?.createdAt || "")
  }));

  const workspaceNodes = collect(project?.nodes || [], "workspace");
  const functionNodes = (project?.functions || []).flatMap((definition) => (
    collect(definition?.nodes || [], `function:${sanitizeSignalText(definition?.name || definition?.id, "anonymous")}`)
  ));
  return [...workspaceNodes, ...functionNodes].slice(0, 1000);
}

function getCreatorNetworkConsentSignal(project = {}) {
  const consent = project?.securityConsent?.networkNodes || project?.securityConsent?.networkNodeCreatorConsent || {};
  return {
    consented: Boolean(consent.creatorConsented || consent.consented),
    consentedAt: formatSignalMinute(consent.consentedAt || ""),
    consentVersion: Number(consent.consentVersion || 1),
    scope: "creator-only"
  };
}

function createIxoBuildSignal(project, options = {}, targetPlatform = "desktop") {
  const generatedAt = new Date();
  const stableSummary = {
    schemaVersion: project?.schemaVersion || 1,
    scenes: Array.isArray(project?.scenes) ? project.scenes : [],
    nodeCount: Array.isArray(project?.nodes) ? project.nodes.length : 0,
    uiCount: Array.isArray(project?.uiElements) ? project.uiElements.length : 0,
    assetCount: Array.isArray(project?.assets) ? project.assets.length : 0,
    appName: sanitizeExportAppStem(options?.appName)
  };
  const projectHash = crypto
    .createHash("sha256")
    .update(JSON.stringify(stableSummary))
    .digest("hex");

  return {
    product: "IXO Engine",
    signalVersion: 2,
    engineVersion: app.getVersion(),
    targetPlatform,
    appName: stableSummary.appName,
    generatedAt: generatedAt.toISOString(),
    releasedAt: formatSignalMinute(generatedAt),
    projectHash,
    networkNodeCreatorConsent: getCreatorNetworkConsentSignal(project),
    nodeSignals: collectNodeBuildSignals(project),
    signalTypes: [
      "creator-network-consent",
      "node-inventory",
      "node-inserted-minute",
      "release-minute",
      "metadata-only"
    ],
    privacyMode: "metadata-only-no-node-values",
    purpose: "IXO Engine 산출물의 악용 추적과 정당한 제작 출처 확인을 위한 비가시 제작 신호"
  };
}

function collectReferencedAssetValues(project = {}) {
  const used = new Set();
  const remember = (value) => {
    const text = String(value || "").trim();
    if (text) used.add(text);
  };

  (project.uiElements || []).forEach((element) => {
    remember(element.src);
    remember(element.actionValue);
    remember(element.vectorFill);
  });
  (project.nodes || []).forEach((node) => {
    remember(node?.data?.value);
    remember(node?.data?.soundName);
  });
  return used;
}

function trimUnusedAssetsForExport(project = {}) {
  if (!Array.isArray(project.assets) || project.assets.length === 0) return project;
  const used = collectReferencedAssetValues(project);
  return {
    ...project,
    assets: project.assets.filter((asset) => (
      used.has(asset.id)
      || used.has(asset.name)
      || used.has(asset.dataUrl)
      || [...used].some((value) => value.includes(asset.name) || value.includes(asset.dataUrl))
    ))
  };
}

function attachIxoBuildSignal(project, options = {}, targetPlatform = "desktop") {
  const exportProject = trimUnusedAssetsForExport(project);
  const signal = createIxoBuildSignal(exportProject, options, targetPlatform);
  return {
    project: {
      ...exportProject,
      _ixoBuildSignal: signal
    },
    signal
  };
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
    const { project: exportProject, signal } = attachIxoBuildSignal(project, exportOptions, platformInfo.platform || platformInfo.key);
    fs.mkdirSync(exportDir, { recursive: true });
    fs.writeFileSync(path.join(exportDir, "project.json"), JSON.stringify(exportProject, null, 2), "utf-8");
    fs.writeFileSync(path.join(exportDir, ".ixo-origin.json"), JSON.stringify(signal, null, 2), "utf-8");

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

const DESKTOP_EXPORT_TARGETS = {
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

const MOBILE_EXPORT_TARGETS = {
  "android-apk": {
    platform: "android",
    folderSuffix: "android-apk-pipeline",
    artifactExtension: ".apk",
    kind: "mobile-workspace"
  },
  "ios-ipa": {
    platform: "ios",
    folderSuffix: "ios-ipa-pipeline",
    artifactExtension: ".ipa",
    kind: "mobile-workspace"
  }
};

function validateTargetSelection(targets, supportedTargets) {
  if (!Array.isArray(targets) || targets.length === 0) {
    throw new Error("Select at least one export format.");
  }

  const unsupported = targets.filter((target) => !supportedTargets[target]);
  if (unsupported.length) {
    throw new Error(`Unsupported export targets: ${unsupported.join(", ")}`);
  }

  return [...new Set(targets)];
}

function validateDesktopExportTargets(targets) {
  return validateTargetSelection(targets, DESKTOP_EXPORT_TARGETS);
}

function validateMobileExportTargets(targets) {
  return validateTargetSelection(targets, MOBILE_EXPORT_TARGETS);
}

function getExportCapabilities() {
  const desktop = Object.entries(DESKTOP_EXPORT_TARGETS).map(([key, target]) => {
    try {
      const platformInfo = getRuntimePlatformInfo(target.platform);
      findRuntimeSource(platformInfo);
      return { key, pipeline: "desktop", available: true };
    } catch (error) {
      return {
        key,
        pipeline: "desktop",
        available: false,
        reason: String(error.message || error)
      };
    }
  });

  const mobile = Object.entries(MOBILE_EXPORT_TARGETS).map(([key, target]) => ({
    key,
    pipeline: "mobile",
    available: true,
    note: target.platform === "ios"
      ? "iOS 최종 빌드는 macOS + Xcode에서 진행합니다."
      : "Android 최종 빌드는 Android SDK가 준비된 환경에서 진행합니다."
  }));

  return [...desktop, ...mobile];
}

async function exportRuntimeTarget(project, options, targetKey, outputDir) {
  const target = DESKTOP_EXPORT_TARGETS[targetKey];
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

function sanitizeBundleId(rawBundleId) {
  const fallback = "com.minyangtech.mytixo";
  const cleaned = String(rawBundleId || fallback)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_.]/g, "")
    .replace(/\.+/g, ".")
    .replace(/^\.+|\.+$/g, "");
  return cleaned.includes(".") ? cleaned : fallback;
}

function sanitizeNpmPackageName(rawName) {
  const cleaned = String(rawName || DEFAULT_EXPORT_APP_STEM)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^[._-]+|[._-]+$/g, "");
  return cleaned || DEFAULT_EXPORT_APP_STEM;
}

function normalizeMobileIconBackgroundColor(rawColor) {
  const candidate = String(rawColor || "").trim();
  return /^#[0-9a-f]{6}$/i.test(candidate) ? candidate : MOBILE_ICON_BACKGROUND_COLOR;
}

function getCapacitorPackageJson(target, manifest) {
  return {
    name: sanitizeNpmPackageName(manifest.displayName),
    version: manifest.versionName,
    private: true,
    type: "module",
    scripts: {
      "mobile:check": "node ./scripts/check-workspace.mjs",
      "mobile:add": `cap add ${target.platform}`,
      "mobile:sync": "cap sync",
      "mobile:open": `cap open ${target.platform}`
    },
    dependencies: {
      "@capacitor/core": "latest",
      [`@capacitor/${target.platform}`]: "latest"
    },
    devDependencies: {
      "@capacitor/cli": "latest"
    }
  };
}

function getDefaultMobileIconSource() {
  const candidates = [
    path.join(__dirname, "..", "IXO Logo.png"),
    path.join(process.resourcesPath || "", "app.asar", "IXO Logo.png"),
    path.join(process.resourcesPath || "", "IXO Logo.png")
  ];

  for (const candidate of candidates) {
    if (candidate && fs.existsSync(candidate)) {
      return {
        mime: "image/png",
        buffer: fs.readFileSync(candidate),
        originalName: "IXO Logo.png",
        isDefault: true
      };
    }
  }

  return null;
}

function getMobileIconSource(icon) {
  return decodeIconDataUrl(icon) || getDefaultMobileIconSource();
}

function resizeIconToPng(iconSource, pixels) {
  const image = nativeImage.createFromBuffer(iconSource.buffer);
  if (image.isEmpty()) {
    throw new Error("Mobile export icon could not be decoded.");
  }
  return image.resize({ width: pixels, height: pixels, quality: "best" }).toPNG();
}

function writeAndroidAdaptiveIconAssets(destination, iconSource, backgroundColor) {
  const resRoot = path.join(destination, "assets", "icons", "android", "res");
  const generatedFiles = [];

  ANDROID_ICON_DENSITIES.forEach(({ name, legacySize, adaptiveSize }) => {
    const folder = path.join(resRoot, `mipmap-${name}`);
    fs.mkdirSync(folder, { recursive: true });
    const legacyBuffer = resizeIconToPng(iconSource, legacySize);
    const adaptiveBuffer = resizeIconToPng(iconSource, adaptiveSize);
    [
      ["ic_launcher.png", legacyBuffer],
      ["ic_launcher_round.png", legacyBuffer],
      ["ic_launcher_foreground.png", adaptiveBuffer]
    ].forEach(([filename, buffer]) => {
      const target = path.join(folder, filename);
      fs.writeFileSync(target, buffer);
      generatedFiles.push(path.relative(destination, target));
    });
  });

  const adaptiveFolder = path.join(resRoot, "mipmap-anydpi-v26");
  const valuesFolder = path.join(resRoot, "values");
  fs.mkdirSync(adaptiveFolder, { recursive: true });
  fs.mkdirSync(valuesFolder, { recursive: true });

  const adaptiveXml = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">',
    '  <background android:drawable="@color/ic_launcher_background" />',
    '  <foreground android:drawable="@mipmap/ic_launcher_foreground" />',
    '</adaptive-icon>'
  ].join("\n");
  const colorsXml = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<resources>',
    `  <color name="ic_launcher_background">${backgroundColor}</color>`,
    '</resources>'
  ].join("\n");

  [
    [path.join(adaptiveFolder, "ic_launcher.xml"), adaptiveXml],
    [path.join(adaptiveFolder, "ic_launcher_round.xml"), adaptiveXml],
    [path.join(valuesFolder, "colors.xml"), colorsXml]
  ].forEach(([target, contents]) => {
    fs.writeFileSync(target, contents, "utf-8");
    generatedFiles.push(path.relative(destination, target));
  });

  return generatedFiles;
}

function writeIosAppIconAssets(destination, iconSource) {
  const appIconSet = path.join(destination, "assets", "icons", "ios", "AppIcon.appiconset");
  fs.mkdirSync(appIconSet, { recursive: true });
  const generatedFiles = [];

  const images = IOS_APP_ICON_SLOTS.map((slot) => {
    const filename = `icon-${slot.idiom}-${slot.size.replace(".", "_")}-${slot.scale}.png`;
    const target = path.join(appIconSet, filename);
    fs.writeFileSync(target, resizeIconToPng(iconSource, slot.pixels));
    generatedFiles.push(path.relative(destination, target));
    return {
      idiom: slot.idiom,
      size: slot.size,
      scale: slot.scale,
      filename
    };
  });

  const contentsPath = path.join(appIconSet, "Contents.json");
  fs.writeFileSync(contentsPath, JSON.stringify({
    images,
    info: {
      author: "xcode",
      version: 1
    }
  }, null, 2), "utf-8");
  generatedFiles.push(path.relative(destination, contentsPath));
  return generatedFiles;
}

function getCapacitorConfig(manifest) {
  return {
    appId: manifest.bundleId,
    appName: manifest.displayName,
    webDir: "web",
    bundledWebRuntime: false,
    server: {
      androidScheme: "https"
    }
  };
}

function getCapacitorWorkspaceCheckScript() {
  return [
    "import { existsSync } from 'node:fs';",
    "",
    "const requiredFiles = [",
    "  'web/runtime.html',",
    "  'web/project.json',",
    "  'mobile-export.json',",
    "  'capacitor.config.json'",
    "];",
    "",
    "const missing = requiredFiles.filter((file) => !existsSync(file));",
    "if (missing.length) {",
    "  console.error(`Missing required mobile workspace files: ${missing.join(', ')}`);",
    "  process.exit(1);",
    "}",
    "",
    "console.log('Mobile workspace looks ready.');"
  ].join("\n");
}

function getMobileBuildReadme(target, manifest) {
  const common = [
    `# ${manifest.displayName} ${target.artifactExtension} Pipeline`,
    "",
    "이 폴더는 IXO Engine에서 분리 생성한 모바일 패키징 워크스페이스입니다.",
    "",
    "## 포함 파일",
    "- `web/`: exported runtime과 동일한 웹 런타임",
    "- `web/runtime.html`: 모바일 WebView가 여는 런타임 진입점",
    "- `project.json`: IXO 프로젝트 데이터",
    "- `mobile-export.json`: 모바일 빌드 메타데이터",
    "- `package.json`: Capacitor 워크스페이스 의존성과 명령",
    "- `capacitor.config.json`: 앱 ID, 앱 이름, webDir 설정",
    "- `assets/icons/`: 플랫폼별로 자동 리사이즈된 앱 아이콘 세트",
    "",
    "## 빌드 흐름",
    "1. `npm install`",
    "2. `npm run mobile:check`",
    "3. `npm run mobile:add`",
    "4. `npm run mobile:sync`",
    "5. `npm run mobile:open`",
    "6. 플랫폼별 서명과 스토어 설정을 적용합니다."
  ];

  const platformSteps = target.platform === "android"
    ? [
        "",
        "## Android",
        "- Android Studio 또는 CI에서 `applicationId`를 `mobile-export.json`의 `bundleId`와 맞춥니다.",
        "- `assets/icons/android/res/`를 Android 프로젝트의 `app/src/main/res/`에 복사하면 adaptive icon과 legacy launcher icon을 바로 사용할 수 있습니다.",
        `- adaptive icon 배경색은 \`${manifest.iconBackgroundColor}\`이며, 필요하면 \`values/colors.xml\`에서 교체하세요.`,
        "- release keystore를 연결한 뒤 `.apk` 또는 `.aab`를 빌드합니다.",
        "- 현재 워크스페이스는 Android SDK가 없는 PC에서도 생성할 수 있습니다."
      ]
    : [
        "",
        "## iOS",
        "- macOS의 Xcode 프로젝트에서 `bundleIdentifier`를 `mobile-export.json`의 `bundleId`와 맞춥니다.",
        "- `assets/icons/ios/AppIcon.appiconset/`을 Xcode asset catalog의 `AppIcon`으로 가져오면 됩니다.",
        "- Apple Developer 서명 설정을 연결한 뒤 `.ipa`를 archive/export 합니다.",
        "- iOS 최종 산출물은 macOS + Xcode 환경에서만 빌드합니다."
      ];

  return [...common, ...platformSteps].join("\n");
}

function copyRendererIntoMobileWorkspace(destination) {
  const rendererSource = path.join(__dirname, "..", "dist", "renderer");
  if (!fs.existsSync(rendererSource)) {
    throw new Error("Renderer build is missing. Run the renderer build before mobile export.");
  }
  const webDir = path.join(destination, "web");
  originalFs.cpSync(rendererSource, webDir, { recursive: true });
  return webDir;
}

function exportMobileWorkspace(project, options, targetKey, outputDir) {
  const target = MOBILE_EXPORT_TARGETS[targetKey];
  const appStem = sanitizeExportAppStem(options?.appName);
  const destination = path.join(outputDir, `${appStem}-${target.folderSuffix}`);
  originalFs.rmSync(destination, { recursive: true, force: true });
  originalFs.mkdirSync(destination, { recursive: true });

  const webDir = copyRendererIntoMobileWorkspace(destination);
  const { project: exportProject, signal } = attachIxoBuildSignal(project, options, target.platform);
  fs.writeFileSync(path.join(destination, "project.json"), JSON.stringify(exportProject, null, 2), "utf-8");
  fs.writeFileSync(path.join(webDir, "project.json"), JSON.stringify(exportProject, null, 2), "utf-8");
  fs.writeFileSync(path.join(webDir, ".ixo-origin.json"), JSON.stringify(signal, null, 2), "utf-8");
  fs.writeFileSync(
    path.join(webDir, "runtime.html"),
    "<!doctype html><meta charset=\"utf-8\"><script>location.replace('./index.html?runtime=1')</script>",
    "utf-8"
  );

  const manifest = {
    target: target.platform,
    requestedArtifact: target.artifactExtension,
    displayName: appStem,
    bundleId: sanitizeBundleId(options?.bundleId),
    versionName: String(options?.versionName || "1.0.0"),
    generatedAt: new Date().toISOString(),
    runtimeMode: "shared-renderer",
    sourceProject: "project.json",
    webRoot: "web",
    launchPath: "runtime.html",
    ixoBuildSignal: signal,
    wrapper: "capacitor",
    iconBackgroundColor: normalizeMobileIconBackgroundColor(options?.iconBackgroundColor),
    commands: {
      install: "npm install",
      check: "npm run mobile:check",
      add: "npm run mobile:add",
      sync: "npm run mobile:sync",
      open: "npm run mobile:open"
    }
  };
  fs.writeFileSync(path.join(destination, "mobile-export.json"), JSON.stringify(manifest, null, 2), "utf-8");
  fs.writeFileSync(path.join(destination, "README.md"), getMobileBuildReadme(target, manifest), "utf-8");
  fs.writeFileSync(path.join(destination, "package.json"), JSON.stringify(getCapacitorPackageJson(target, manifest), null, 2), "utf-8");
  fs.writeFileSync(path.join(destination, "capacitor.config.json"), JSON.stringify(getCapacitorConfig(manifest), null, 2), "utf-8");
  fs.writeFileSync(path.join(destination, ".gitignore"), "node_modules/\nandroid/\nios/\n", "utf-8");
  fs.mkdirSync(path.join(destination, "scripts"), { recursive: true });
  fs.writeFileSync(path.join(destination, "scripts", "check-workspace.mjs"), getCapacitorWorkspaceCheckScript(), "utf-8");

  const decodedIcon = getMobileIconSource(options?.icon);
  if (decodedIcon) {
    const extension = path.extname(decodedIcon.originalName) || (decodedIcon.mime === "image/png" ? ".png" : ".ico");
    fs.mkdirSync(path.join(destination, "assets"), { recursive: true });
    fs.writeFileSync(path.join(destination, "assets", `app-icon${extension}`), decodedIcon.buffer);
    const generatedIconFiles = target.platform === "android"
      ? writeAndroidAdaptiveIconAssets(destination, decodedIcon, manifest.iconBackgroundColor)
      : writeIosAppIconAssets(destination, decodedIcon);
    manifest.iconAssets = {
      source: decodedIcon.isDefault ? "default" : "custom",
      generatedFiles: generatedIconFiles
    };
    fs.writeFileSync(path.join(destination, "mobile-export.json"), JSON.stringify(manifest, null, 2), "utf-8");
  }

  return destination;
}

function createMainWindow() {
  const embeddedWindowSettings = getEmbeddedRuntimeWindowSettings();
  const mainWindow = new BrowserWindow({
    width: embeddedWindowSettings.width,
    height: embeddedWindowSettings.height,
    minWidth: 1024,
    minHeight: 640,
    title: embeddedWindowSettings.title,
    resizable: embeddedWindowSettings.resizable,
    backgroundColor: embeddedWindowSettings.backgroundColor,
    // autoHideMenuBar: true, // 留뚯빟 Alt?ㅻ줈 硫붾돱瑜?蹂닿퀬 ?띕떎硫???二쇱꽍???댁젣?섏꽭??
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  });

  const webContentsId = mainWindow.webContents.id;
  trustedWebContentsIds.add(webContentsId);
  resetSecurityApprovals(webContentsId);
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  mainWindow.webContents.on("will-navigate", (event) => {
    event.preventDefault();
  });
  mainWindow.webContents.session.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false);
  });
  mainWindow.on("closed", () => {
    trustedWebContentsIds.delete(webContentsId);
    securityApprovalsByWebContents.delete(webContentsId);
    closeWatchers(webContentsId);
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  // 2. ?곷떒 硫붾돱諛?File, Edit ??瑜??꾩쟾???쒓굅
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
      message: "There are unsaved changes. Save before closing?",
      buttons: ["Save", "Don't Save", "Cancel"],
      cancelId: 2,
      defaultId: 0
    });

    if (answer.response === 2) {
      return;
    }
    if (answer.response === 0) {
      let targetPath = windowState.currentProjectPath;
      if (!targetPath) {
        const savePath = await dialog.showSaveDialog(mainWindow, {
          title: "Save IXO Project",
          filters: [{ name: "IXO Project", extensions: ["ixo"] }],
          defaultPath: "project.ixo"
        });
        if (savePath.canceled || !savePath.filePath) {
          return;
        }
        targetPath = savePath.filePath;
      }
      fs.writeFileSync(
        targetPath,
        JSON.stringify(windowState.latestProject || {}, null, 2),
        "utf-8"
      );
      windowState.currentProjectPath = targetPath;
    }
    windowState.allowClose = true;
    mainWindow.close();
  });

  const devUrl = process.env.ELECTRON_START_URL || "http://localhost:5173";
  
  if (!app.isPackaged) {
    mainWindow.loadURL(devUrl);
    // 媛쒕컻 紐⑤뱶?먯꽌 DevTools(寃??瑜??먮룞?쇰줈 ?닿퀬 ?띕떎硫??꾨옒 二쇱꽍???댁젣?섏꽭??
    // mainWindow.webContents.openDevTools(); 
    return;
  }

  const exportedRuntimeProjectPath = path.join(process.resourcesPath, "export", "project.json");
  if (fs.existsSync(exportedRuntimeProjectPath)) {
    mainWindow.loadFile(path.join(__dirname, "..", "dist", "renderer", "index.html"), {
      query: { runtime: "1" }
    });
    return;
  }

  mainWindow.loadFile(path.join(__dirname, "..", "dist", "renderer", "index.html"));
}

function loadRendererEntry(window, query = {}) {
  const devUrl = process.env.ELECTRON_START_URL || "http://localhost:5173";
  if (!app.isPackaged) {
    const url = new URL(devUrl);
    Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, String(value)));
    window.loadURL(url.toString());
    return;
  }

  window.loadFile(path.join(__dirname, "..", "dist", "renderer", "index.html"), { query });
}

function createPreviewWindow(project) {
  const previewWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 720,
    minHeight: 480,
    title: "IXO Preview",
    backgroundColor: "#06130d",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  });

  const webContentsId = previewWindow.webContents.id;
  trustedWebContentsIds.add(webContentsId);
  resetSecurityApprovals(webContentsId);
  previewProjectsByWebContents.set(webContentsId, project);
  previewWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  previewWindow.webContents.on("will-navigate", (event) => {
    event.preventDefault();
  });
  previewWindow.webContents.session.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false);
  });
  previewWindow.on("closed", () => {
    trustedWebContentsIds.delete(webContentsId);
    securityApprovalsByWebContents.delete(webContentsId);
    previewProjectsByWebContents.delete(webContentsId);
    closeWatchers(webContentsId);
  });

  loadRendererEntry(previewWindow, { runtime: "1", preview: "1" });
  return previewWindow;
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

  ipcMain.handle("app:openReleasePage", async (event, releaseUrl) => {
    assertTrustedSender(event);
    return openReleasePage(releaseUrl);
  });

  ipcMain.handle("app:openDocsPage", async (event) => {
    assertTrustedSender(event);
    return openDocsPage();
  });

  ipcMain.handle("security:requestApproval", async (event, scope, context) => requestSecurityApproval(event, scope, context));

  ipcMain.handle("security:getPreferences", (event) => {
    assertTrustedSender(event);
    return readSecurityPreferences();
  });

  ipcMain.handle("security:setHttpsNodesEnabled", (event, enabled) => {
    assertTrustedSender(event);
    const allow = Boolean(enabled);
    const next = {
      ...readSecurityPreferences(),
      httpsNodesEnabled: allow,
      networkConsentAcceptedAt: allow ? new Date().toISOString() : ""
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
    if (!getSecurityApprovals(event.sender.id).fileWatcher) {
      throw new Error("File watcher access requires approval.");
    }
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

  ipcMain.handle("project:save", async (event, payload, options = {}) => {
    assertTrustedSender(event);
    let targetPath = options?.saveAs ? "" : windowState.currentProjectPath;
    if (!targetPath) {
      const target = await dialog.showSaveDialog({
        title: "Save IXO Project",
        filters: [{ name: "IXO Project", extensions: ["ixo"] }],
        defaultPath: windowState.currentProjectPath || "project.ixo"
      });
      if (target.canceled || !target.filePath) {
        return { ok: false, canceled: true };
      }
      targetPath = target.filePath;
    }
    fs.writeFileSync(targetPath, JSON.stringify(payload, null, 2), "utf-8");
    windowState.isDirty = false;
    windowState.latestProject = payload;
    windowState.currentProjectPath = targetPath;
    return { ok: true, path: targetPath };
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
    windowState.currentProjectPath = target.filePaths[0];
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

  ipcMain.handle("project:getEmbeddedRuntimeProject", (event) => {
    assertTrustedSender(event);
    return previewProjectsByWebContents.get(event.sender.id) || readEmbeddedRuntimeProject();
  });

  ipcMain.handle("project:openPreview", (event, payload) => {
    assertTrustedSender(event);
    createPreviewWindow(payload || {});
    return { ok: true };
  });

  ipcMain.handle("project:export", async (event, payload, options = {}) => {
    assertTrustedSender(event);
    try {
      const outputDir = normalizeOutputDirectory(options?.outputDir);
      if (!outputDir) {
        throw new Error("Choose an export folder before exporting.");
      }
      const targets = validateDesktopExportTargets(options?.targets);
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

  ipcMain.handle("fs:chooseWatchPath", async (event) => {
    assertTrustedSender(event);
    const target = await dialog.showOpenDialog(BrowserWindow.fromWebContents(event.sender), {
      title: "Choose File or Folder to Watch",
      properties: ["openFile", "openDirectory"]
    });
    if (target.canceled || !target.filePaths[0]) {
      return { ok: false, canceled: true };
    }
    return { ok: true, path: path.resolve(target.filePaths[0]) };
  });

  ipcMain.handle("project:exportMobile", async (event, payload, options = {}) => {
    assertTrustedSender(event);
    try {
      const outputDir = normalizeOutputDirectory(options?.outputDir);
      if (!outputDir) {
        throw new Error("Choose an export folder before exporting.");
      }
      const targets = validateMobileExportTargets(options?.targets);
      originalFs.mkdirSync(outputDir, { recursive: true });

      const outputs = targets.map((target) => exportMobileWorkspace(payload, options, target, outputDir));
      shell.showItemInFolder(outputs[0]);
      return { ok: true, path: outputDir, outputs, pipeline: "mobile" };
    } catch (error) {
      return { ok: false, error: error.message || "Mobile export failed." };
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
