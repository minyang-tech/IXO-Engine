const COMPONENT_TEXT = {
  navbar: "Navbar",
  card: "Card title",
  modal: "Modal title",
  toast: "Toast message",
  form: "Form",
  list: "List item",
  sidebar: "Sidebar",
  dialog: "Dialog title",
  spinner: "Loading"
};

export const UI_COMPONENT_LIBRARY = Object.freeze([
  { key: "navbar", label: "Navbar" },
  { key: "card", label: "Card" },
  { key: "modal", label: "Modal" },
  { key: "toast", label: "Toast" },
  { key: "form", label: "Form" },
  { key: "list", label: "List" },
  { key: "sidebar", label: "Sidebar" },
  { key: "dialog", label: "Dialog" },
  { key: "spinner", label: "Loading Spinner" }
]);

export function createComponentElements(componentKey, createElement, accentColor, origin = { x: 72, y: 72 }) {
  const key = String(componentKey || "").toLowerCase();
  const text = COMPONENT_TEXT[key] || "Component";
  const make = (kind, patch = {}) => ({
    ...createElement(kind, "", accentColor),
    ...patch,
    id: `ui-${key}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  });

  if (key === "navbar") {
    return [
      make("container", { x: origin.x, y: origin.y, width: 520, height: 64, text: "", radius: 18, background: "rgba(62, 207, 142, 0.12)" }),
      make("text", { x: origin.x + 24, y: origin.y + 18, width: 160, height: 28, text: "IXO App", fontSize: 20 }),
      make("button", { x: origin.x + 372, y: origin.y + 12, width: 124, height: 40, text: "Action", actionType: "none" })
    ];
  }

  if (key === "form") {
    return [
      make("container", { x: origin.x, y: origin.y, width: 420, height: 220, text: "", radius: 22 }),
      make("text", { x: origin.x + 28, y: origin.y + 24, width: 220, height: 32, text, fontSize: 22 }),
      make("input", { x: origin.x + 28, y: origin.y + 78, width: 340, height: 48, text: "Enter value" }),
      make("button", { x: origin.x + 28, y: origin.y + 146, width: 148, height: 44, text: "Submit", actionType: "none" })
    ];
  }

  if (key === "sidebar") {
    return [
      make("container", { x: origin.x, y: origin.y, width: 220, height: 380, text: "", radius: 24 }),
      make("text", { x: origin.x + 24, y: origin.y + 24, width: 150, height: 28, text, fontSize: 20 }),
      make("button", { x: origin.x + 24, y: origin.y + 76, width: 160, height: 42, text: "Menu 1", actionType: "none" }),
      make("button", { x: origin.x + 24, y: origin.y + 130, width: 160, height: 42, text: "Menu 2", actionType: "none" })
    ];
  }

  if (key === "toast" || key === "spinner") {
    return [
      make(key === "spinner" ? "vector" : "container", {
        x: origin.x,
        y: origin.y,
        width: key === "spinner" ? 84 : 300,
        height: key === "spinner" ? 84 : 74,
        text,
        radius: key === "spinner" ? 999 : 18,
        vectorPath: key === "spinner" ? "M50 10 A40 40 0 1 1 18 74" : "",
        cssText: key === "spinner" ? "border: 4px solid rgba(255,255,255,0.16); border-top-color: #3ecf8e;" : ""
      })
    ];
  }

  return [
    make("container", {
      x: origin.x,
      y: origin.y,
      width: key === "modal" || key === "dialog" ? 420 : 320,
      height: key === "modal" || key === "dialog" ? 220 : 170,
      text,
      radius: 22,
      background: "rgba(62, 207, 142, 0.10)"
    }),
    make("text", {
      x: origin.x + 28,
      y: origin.y + 24,
      width: 240,
      height: 32,
      text,
      fontSize: 22
    }),
    make("button", {
      x: origin.x + 28,
      y: origin.y + 92,
      width: 132,
      height: 42,
      text: key === "list" ? "Open" : "Confirm",
      actionType: "none"
    })
  ];
}
