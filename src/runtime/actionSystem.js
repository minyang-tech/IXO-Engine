export const ACTION_SYSTEM_OPTIONS = Object.freeze([
  { value: "none", label: "None", requiresApproval: false },
  { value: "open-url", label: "Open URL", requiresApproval: true },
  { value: "run-function", label: "Run Function", requiresApproval: false },
  { value: "set-variable", label: "Set Variable", requiresApproval: false },
  { value: "toggle-ui", label: "Toggle UI", requiresApproval: false },
  { value: "go-scene", label: "Go Scene", requiresApproval: false },
  { value: "play-sound", label: "Play Sound", requiresApproval: false },
  { value: "request-https", label: "Request HTTPS", requiresApproval: true }
]);

export function parseSetVariableAction(value = "") {
  const [key, ...rest] = String(value || "").split("=");
  return {
    key: key.trim(),
    value: rest.join("=").trim()
  };
}

export function isActionNetworked(actionType) {
  return actionType === "open-url" || actionType === "request-https";
}
