export const NODE_PERMISSION_SCOPES = Object.freeze({
  network: "network",
  external: "external",
  script: "script",
  fileWatcher: "fileWatcher",
  asset: "asset",
  theme: "theme"
});

export const NODE_PERMISSION_BY_TYPE = Object.freeze({
  http: NODE_PERMISSION_SCOPES.network,
  browser: NODE_PERMISSION_SCOPES.external,
  script: NODE_PERMISSION_SCOPES.script,
  "file-watcher": NODE_PERMISSION_SCOPES.fileWatcher,
  "sound-play": NODE_PERMISSION_SCOPES.asset,
  "sound-play-wait": NODE_PERMISSION_SCOPES.asset,
  "bgm-play": NODE_PERMISSION_SCOPES.asset,
  "audio-player": NODE_PERMISSION_SCOPES.asset
});

const SAFE_CSS_PROPERTIES = new Set([
  "alignItems",
  "backdropFilter",
  "border",
  "borderColor",
  "borderStyle",
  "borderWidth",
  "boxShadow",
  "display",
  "fontStyle",
  "fontWeight",
  "gap",
  "justifyContent",
  "letterSpacing",
  "lineHeight",
  "margin",
  "opacity",
  "outline",
  "padding",
  "textDecoration",
  "textShadow",
  "textTransform",
  "transform",
  "whiteSpace"
]);

const CSS_BLOCKLIST = /url\s*\(|@import|expression\s*\(|javascript:|data:/i;

function toCamelCase(property) {
  return String(property || "")
    .trim()
    .toLowerCase()
    .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function parseSafeCssText(cssText = "") {
  if (!cssText || typeof cssText !== "string") return {};

  return cssText
    .split(";")
    .map((rule) => rule.trim())
    .filter(Boolean)
    .reduce((style, rule) => {
      const separator = rule.indexOf(":");
      if (separator <= 0) return style;

      const property = toCamelCase(rule.slice(0, separator));
      const value = rule.slice(separator + 1).trim();
      if (!SAFE_CSS_PROPERTIES.has(property)) return style;
      if (!value || CSS_BLOCKLIST.test(value)) return style;

      style[property] = value;
      return style;
    }, {});
}

export function getNodePermissionScope(nodeType) {
  return NODE_PERMISSION_BY_TYPE[nodeType] || null;
}

export function isSafeThemeName(name) {
  return /^[a-z0-9 _-]{1,48}$/i.test(String(name || ""));
}
