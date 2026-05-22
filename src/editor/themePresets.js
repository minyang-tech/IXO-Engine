export const ADVANCED_THEME_PRESETS = Object.freeze({
  mint: {
    label: "Mint Console",
    accent: "#3ecf8e",
    accentSoft: "rgba(62, 207, 142, 0.16)",
    accentStrong: "rgba(62, 207, 142, 0.28)",
    glow: "rgba(62, 207, 142, 0.28)",
    background: "#06130d"
  },
  glass: {
    label: "Glass Panel",
    accent: "#92f7d0",
    accentSoft: "rgba(146, 247, 208, 0.14)",
    accentStrong: "rgba(146, 247, 208, 0.26)",
    glow: "rgba(146, 247, 208, 0.24)",
    background: "linear-gradient(135deg, rgba(8, 20, 16, 0.94), rgba(20, 34, 42, 0.92))"
  },
  pixel: {
    label: "Pixel Retro",
    accent: "#ffcf5c",
    accentSoft: "rgba(255, 207, 92, 0.16)",
    accentStrong: "rgba(255, 207, 92, 0.30)",
    glow: "rgba(255, 207, 92, 0.28)",
    background: "#10110c"
  },
  saas: {
    label: "Clean SaaS",
    accent: "#5ad4ff",
    accentSoft: "rgba(90, 212, 255, 0.14)",
    accentStrong: "rgba(90, 212, 255, 0.28)",
    glow: "rgba(90, 212, 255, 0.22)",
    background: "#071018"
  },
  hud: {
    label: "Game HUD",
    accent: "#7cff9b",
    accentSoft: "rgba(124, 255, 155, 0.14)",
    accentStrong: "rgba(124, 255, 155, 0.30)",
    glow: "rgba(124, 255, 155, 0.30)",
    background: "radial-gradient(circle at top, #13251a, #050908 70%)"
  },
  crimson: {
    label: "Dark Red",
    accent: "#c84c5d",
    accentSoft: "rgba(200, 76, 93, 0.16)",
    accentStrong: "rgba(200, 76, 93, 0.3)",
    glow: "rgba(200, 76, 93, 0.28)",
    background: "#14080b"
  },
  ocean: {
    label: "Ocean Blue",
    accent: "#4aa8ff",
    accentSoft: "rgba(74, 168, 255, 0.16)",
    accentStrong: "rgba(74, 168, 255, 0.3)",
    glow: "rgba(74, 168, 255, 0.26)",
    background: "#07121c"
  }
});

export function normalizeThemePreset(preset, fallback) {
  return {
    ...fallback,
    ...preset,
    label: String(preset?.label || fallback?.label || "Custom Theme").slice(0, 48)
  };
}
