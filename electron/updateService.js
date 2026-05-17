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

const PLATFORM_ASSET_PATTERNS = {
  win32: [/\.exe$/i, /\.msi$/i, /\.zip$/i],
  linux: [/\.AppImage$/i, /\.deb$/i, /\.zip$/i],
  darwin: [/\.dmg$/i, /\.zip$/i]
};

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

function pickPlatformAsset(assets = [], platform = process.platform) {
  const patterns = PLATFORM_ASSET_PATTERNS[platform] || [];
  return patterns
    .map((pattern) => assets.find((asset) => pattern.test(asset.name || "")))
    .find(Boolean) || null;
}

async function fetchLatestRelease() {
  const response = await net.fetch(
    `https://api.github.com/repos/${GITHUB_REPOSITORY.owner}/${GITHUB_REPOSITORY.repo}/releases/latest`,
    { headers: RELEASE_HEADERS }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`GitHub release check failed (${response.status}).`);
  }

  return response.json();
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

  const response = await net.fetch(validateReleaseAssetUrl(asset.downloadUrl), { headers: RELEASE_HEADERS });
  if (!response.ok) {
    throw new Error(`Update download failed (${response.status}).`);
  }

  const targetPath = path.join(app.getPath("downloads"), safeDownloadName(asset.name));
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(targetPath, buffer);
  shell.showItemInFolder(targetPath);

  return {
    ok: true,
    path: targetPath,
    name: safeDownloadName(asset.name),
    size: buffer.length
  };
}

module.exports = {
  checkForUpdates,
  downloadReleaseAsset
};
