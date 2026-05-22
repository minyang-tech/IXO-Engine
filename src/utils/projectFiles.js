export const DEFAULT_EXPORT_SETTINGS = Object.freeze({
  windowTitle: "IXO App",
  windowWidth: 1280,
  windowHeight: 720,
  windowResizable: true,
  backgroundColor: "#06130d",
  splash: "none"
});

export function normalizeExportSettings(settings = {}) {
  return {
    ...DEFAULT_EXPORT_SETTINGS,
    ...settings,
    windowTitle: String(settings.windowTitle || DEFAULT_EXPORT_SETTINGS.windowTitle).slice(0, 80),
    windowWidth: Math.max(320, Math.min(Number(settings.windowWidth || DEFAULT_EXPORT_SETTINGS.windowWidth), 3840)),
    windowHeight: Math.max(240, Math.min(Number(settings.windowHeight || DEFAULT_EXPORT_SETTINGS.windowHeight), 2160)),
    windowResizable: Boolean(settings.windowResizable ?? DEFAULT_EXPORT_SETTINGS.windowResizable),
    backgroundColor: /^#[0-9a-f]{6}$/i.test(String(settings.backgroundColor || "")) ? settings.backgroundColor : DEFAULT_EXPORT_SETTINGS.backgroundColor,
    splash: ["none", "minimal", "brand"].includes(settings.splash) ? settings.splash : DEFAULT_EXPORT_SETTINGS.splash
  };
}
