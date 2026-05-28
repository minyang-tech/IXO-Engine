const { app, net, shell } = require("electron");
const fs = require("fs");
const path = require("path");

const GITHUB_REPOSITORY = {
  owner: "minyang-tech",
  repo: "IXO-Engine"
};

const RELEASE_HEADERS = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "IXO-Engine"
};

const PLATFORM_ASSET_RULES = {
  win32: {
    tokens: ["windows", "win", "win32", "win64"],
    forbiddenTokens: ["linux", "appimage", "deb", "debian", "ubuntu", "mac", "macos", "darwin", "dmg", "apk", "ipa"],
    priorities: [
      { extensions: [".exe"], requirePlatformToken: false },
      { extensions: [".zip"], requirePlatformToken: true }
    ]
  },
  linux: {
    tokens: ["linux", "appimage", "deb", "debian", "ubuntu"],
    forbiddenTokens: ["windows", "win32", "win64", "setup.exe", "mac", "macos", "darwin", "dmg", "apk", "ipa"],
    priorities: [
      { extensions: [".appimage", ".deb"], requirePlatformToken: false },
      { extensions: [".zip"], requirePlatformToken: true }
    ]
  },
  darwin: {
    tokens: ["mac", "macos", "darwin", "osx", "dmg"],
    forbiddenTokens: ["windows", "win32", "win64", "linux", "appimage", "deb", "debian", "ubuntu", "apk", "ipa"],
    priorities: [
      { extensions: [".dmg"], requirePlatformToken: false },
      { extensions: [".zip"], requirePlatformToken: true }
    ]
  }
};
const UPDATE_REQUEST_TIMEOUT_MS = 8000;
const MAX_RELEASE_JSON_BYTES = 1024 * 1024;
const MAX_UPDATE_DOWNLOAD_BYTES = 600 * 1024 * 1024;

function normalizeVersion(version) {
  return String(version || "")
    .trim()
    .replace(/^v/i, "")
    .split("-")[0];
}

function compareVersions(left, right) {
  const leftParts = normalizeVersion(left).split(".").map((part) => Number(part) || 0);
  const rightParts = normalizeVersion(right).split(".").map((part) => Number(part) || 0);
  const maxLength = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < maxLength; index += 1) {
    const delta = (leftParts[index] || 0) - (rightParts[index] || 0);
    if (delta !== 0) {
      return delta;
    }
  }

  return 0;
}

function serializeAsset(asset) {
  if (!asset) return null;
  return {
    id: asset.id,
    name: asset.name,
    size: asset.size,
    contentType: asset.content_type,
    downloadUrl: asset.browser_download_url
  };
}

function normalizeAssetName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, " ")
    .trim();
}

function hasToken(normalizedName, token) {
  const normalizedToken = String(token || "").toLowerCase();
  if (!normalizedToken) return false;
  if (normalizedToken.includes(".")) {
    return normalizedName.includes(normalizedToken);
  }
  return normalizedName
    .split(/[\s._-]+/)
    .filter(Boolean)
    .includes(normalizedToken);
}

function getAssetExtension(name) {
  const lowerName = String(name || "").toLowerCase();
  if (lowerName.endsWith(".appimage")) return ".appimage";
  return path.extname(lowerName);
}

function matchesPlatformAssetRule(asset, rule, priority) {
  const name = asset?.name || "";
  const normalizedName = normalizeAssetName(name);
  const extension = getAssetExtension(name);
  const hasAllowedExtension = priority.extensions.includes(extension);
  if (!hasAllowedExtension) {
    return false;
  }

  if (rule.forbiddenTokens.some((token) => hasToken(normalizedName, token))) {
    return false;
  }

  if (priority.requirePlatformToken && !rule.tokens.some((token) => hasToken(normalizedName, token))) {
    return false;
  }

  return true;
}

function pickPlatformAsset(assets = [], platform = process.platform) {
  const rule = PLATFORM_ASSET_RULES[platform];
  if (!rule) return null;

  return rule.priorities
    .map((priority) => assets.find((asset) => matchesPlatformAssetRule(asset, rule, priority)))
    .find(Boolean) || null;
}

async function fetchLatestRelease() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPDATE_REQUEST_TIMEOUT_MS);
  let response;
  try {
    response = await net.fetch(
      `https://api.github.com/repos/${GITHUB_REPOSITORY.owner}/${GITHUB_REPOSITORY.repo}/releases/latest`,
      { headers: RELEASE_HEADERS, signal: controller.signal }
    );
  } finally {
    clearTimeout(timer);
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`GitHub release check failed (${response.status}).`);
  }

  const contentLength = Number(response.headers.get("content-length") || 0);
  if (contentLength > MAX_RELEASE_JSON_BYTES) {
    throw new Error("GitHub release metadata is too large.");
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length > MAX_RELEASE_JSON_BYTES) {
    throw new Error("GitHub release metadata exceeded the maximum size limit.");
  }
  return JSON.parse(buffer.toString("utf-8"));
}

async function checkForUpdates() {
  const release = await fetchLatestRelease();
  const currentVersion = app.getVersion();
  if (!release) {
    return {
      available: false,
      currentVersion,
      latestVersion: null,
      releaseName: null,
      releaseNotes: "",
      publishedAt: null,
      asset: null,
      releaseUrl: `https://github.com/${GITHUB_REPOSITORY.owner}/${GITHUB_REPOSITORY.repo}/releases`,
      releasePublished: false
    };
  }

  const latestVersion = normalizeVersion(release.tag_name || release.name);
  const asset = serializeAsset(pickPlatformAsset(release.assets || []));

  return {
    available: compareVersions(latestVersion, currentVersion) > 0,
    currentVersion,
    latestVersion,
    releaseName: release.name || release.tag_name || latestVersion,
    releaseNotes: release.body || "",
    publishedAt: release.published_at || null,
    asset,
    releaseUrl: release.html_url || `https://github.com/${GITHUB_REPOSITORY.owner}/${GITHUB_REPOSITORY.repo}/releases/latest`,
    releasePublished: true
  };
}

function safeDownloadName(name) {
  return path.basename(name || `IXO-Engine-${Date.now()}`);
}

function validateReleaseAssetUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(String(rawUrl || ""));
  } catch {
    throw new Error("Release asset URL is invalid.");
  }

  const expectedPrefix = `/minyang-tech/IXO-Engine/releases/download/`;
  if (
    parsed.protocol !== "https:"
    || parsed.hostname !== "github.com"
    || !parsed.pathname.startsWith(expectedPrefix)
  ) {
    throw new Error("Release asset URL is not trusted.");
  }

  return parsed.toString();
}

async function downloadReleaseAsset(asset) {
  if (!asset?.downloadUrl) {
    throw new Error("No downloadable release asset is available for this platform.");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPDATE_REQUEST_TIMEOUT_MS);
  let response;
  try {
    response = await net.fetch(validateReleaseAssetUrl(asset.downloadUrl), { headers: RELEASE_HEADERS, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
  if (!response.ok) {
    throw new Error(`Update download failed (${response.status}).`);
  }
  const contentLength = Number(response.headers.get("content-length") || 0);
  if (contentLength > MAX_UPDATE_DOWNLOAD_BYTES) {
    throw new Error("Update asset is larger than the allowed limit.");
  }

  const updateDir = path.join(app.getPath("temp"), "ixo-engine-update");
  fs.rmSync(updateDir, { recursive: true, force: true });
  fs.mkdirSync(updateDir, { recursive: true });
  const targetPath = path.join(updateDir, safeDownloadName(asset.name));
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length > MAX_UPDATE_DOWNLOAD_BYTES) {
    throw new Error("Update download exceeded the maximum size limit.");
  }
  fs.writeFileSync(targetPath, buffer);
  if (process.platform !== "win32") {
    fs.chmodSync(targetPath, 0o755);
  }
  const launchError = await shell.openPath(targetPath);
  if (launchError) {
    throw new Error(`Update apply failed: ${launchError}`);
  }

  return {
    ok: true,
    path: targetPath,
    name: safeDownloadName(asset.name),
    size: buffer.length,
    action: "launched"
  };
}

async function openReleasePage(rawUrl) {
  const url = String(rawUrl || `https://github.com/${GITHUB_REPOSITORY.owner}/${GITHUB_REPOSITORY.repo}/releases`).trim();
  const parsed = new URL(url);
  if (parsed.protocol !== "https:" || parsed.hostname !== "github.com" || !parsed.pathname.startsWith(`/${GITHUB_REPOSITORY.owner}/${GITHUB_REPOSITORY.repo}/releases`)) {
    throw new Error("Release page URL is not trusted.");
  }
  await shell.openExternal(parsed.toString());
  return { ok: true, url: parsed.toString() };
}

module.exports = {
  checkForUpdates,
  downloadReleaseAsset,
  openReleasePage
};
