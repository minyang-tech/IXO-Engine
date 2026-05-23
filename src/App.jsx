import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Panel as ResizablePanel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Panel,
  Position,
  ReactFlowProvider,
  useEdgesState,
  useNodesState
} from "reactflow";
import "reactflow/dist/style.css";
import logoImage from "../IXO Logo.png";
import { getNodePermissionScope, parseSafeCssText } from "./core/securityPolicy";
import { ADVANCED_THEME_PRESETS, normalizeThemePreset } from "./editor/themePresets";
import { UI_COMPONENT_LIBRARY, createComponentElements } from "./editor/uiComponents";
import { ACTION_SYSTEM_OPTIONS, parseSetVariableAction } from "./runtime/actionSystem";
import { createRuntimeRevision } from "./runtime/incrementalRuntime";
import { createCanvasRenderStats } from "./renderer/canvasRenderer";
import { DEFAULT_EXPORT_SETTINGS, normalizeExportSettings } from "./utils/projectFiles";

// [앱 공통] 에디터 전역에서 반복 사용하는 상수 모음입니다.
const ACCENT = "#3ecf8e";
const LOGO_FALLBACKS = [
  logoImage,
  "./IXO Logo.png",
  "./IXO Logo.PNG",
  "https://github.com/minyang-tech/IXO-Engine/blob/main/IXO%20Logo.png?raw=true"
];
const FALLBACK_APP_VERSION = typeof window !== "undefined" && window.ixo?.version ? window.ixo.version : "1.1.1";

// [노드 UI] 카테고리별 아이콘과 컬러를 최대한 차분한 톤으로 정리했습니다.
const GROUP_ICON = {
  control: "⌁",
  visual: "◫",
  system: "⚙",
  logic: "∑",
  utility: "⊕",
  data: "◈",
  network: "⇄",
  function: "ƒ",
  start: "◆"
};

const NODE_COLOR = {
  start: "#3ecf8e",
  control: "#6cc4ff",
  visual: "#8ce5c0",
  system: "#bfe6d5",
  logic: "#56d9a5",
  utility: "#7ae0cf",
  data: "#7bc8a8",
  network: "#57d8bc",
  function: "#f0b36d"
};

const TRACE_SPEED = {
  "0.5": 1.8,
  "1": 0.9,
  "1.5": 0.6,
  "2": 0.45
};

const DEFAULT_LOG_LIMIT = 150;
const HISTORY_MERGE_WINDOW_MS = 700;
const LOCAL_AUTOSAVE_KEY = "ixo-engine-local-autosave-v1";
const LOCAL_BACKUPS_KEY = "ixo-engine-local-backups-v1";
const LOCAL_SAFE_MODE_KEY = "ixo-engine-safe-mode-v1";
const PROJECT_SCHEMA_VERSION = 2;
const MAX_LOCAL_BACKUPS = 5;
const NETWORK_SAFETY_NOTICE = [
  "## 네트워크 사용 안내",
  "이 애플리케이션은 다음 기능을 위해 HTTPS 기반 네트워크 요청을 사용합니다:",
  "- GitHub API를 통한 최신 버전 확인",
  "- 사용자가 직접 배치한 네트워크 노드 또는 브라우저 열기 노드 실행",
  "",
  "업데이트 확인은 앱 시작 시 한 번만 수행됩니다.",
  "프로젝트 내용은 기본적으로 로컬에 보관되며, 민양테크 서버로 자동 업로드되지 않습니다.",
  "다만 사용자가 만든 네트워크 노드는 사용자가 지정한 외부 서버와 데이터를 주고받을 수 있습니다.",
  "비밀번호, 인증 토큰, 개인정보 등 민감한 정보는 신뢰할 수 없는 서버나 스크립트에 입력하지 마십시오."
].join("\n");
const PRIVACY_POLICY_TEXT = {
  ko: {
    effectiveDate: "시행일: 2026-05-18",
    sections: [
      {
        title: "1. 총칙",
        body: "민양테크는 IXO Engine에서 처리될 수 있는 정보의 범위와 이용자의 권리를 명확히 안내하기 위해 본 개인정보 처리방침을 공개합니다. IXO Engine은 로컬 우선 방식으로 동작하며, 프로젝트 데이터는 기본적으로 사용자의 장치에 저장됩니다."
      },
      {
        title: "2. 개인정보의 처리 목적",
        body: "앱 시작 시 최신 버전 확인을 1회 수행하고, 사용자가 직접 구성한 네트워크 기능을 실행하기 위해 필요한 범위에서만 통신을 수행합니다. 프로젝트 파일, 자동 저장 데이터, Canvas Builder 구성 정보는 민양테크 서버로 자동 업로드되지 않습니다."
      },
      {
        title: "3. 처리될 수 있는 정보 항목",
        body: "업데이트 확인 시 GitHub API 연결 과정에서 IP 주소 등 통신 메타데이터가 외부 서비스 제공자에게 처리될 수 있습니다. 사용자가 네트워크 노드 또는 브라우저 열기 노드에 직접 입력한 URL, 요청 본문, 헤더, 토큰, 개인정보는 사용자가 지정한 외부 서버로 전송될 수 있습니다."
      },
      {
        title: "4. 개인정보의 처리 및 보유 기간",
        body: "민양테크는 업데이트 확인과 관련하여 별도 서버에 개인정보를 저장하지 않습니다. 로컬 프로젝트와 자동 저장 데이터는 사용자가 삭제하거나 초기화할 때까지 사용자의 장치에 남을 수 있으며, 외부 서버로 전송한 정보의 보유 기간은 해당 서비스 운영자의 정책을 따릅니다."
      },
      {
        title: "5. 제3자 제공, 처리위탁 및 국외 이전",
        body: "민양테크는 IXO Engine을 통해 수집한 개인정보를 별도 제3자에게 제공하거나 처리위탁하지 않습니다. 업데이트 확인에는 GitHub API가 사용되며, 사용자가 직접 연결한 외부 서비스는 민양테크가 운영하지 않습니다. 사용자가 선택한 외부 서비스가 국외에 있을 수 있으므로 해당 서비스의 정책을 별도로 확인해야 합니다."
      },
      {
        title: "6. 정보주체의 권리와 행사 방법",
        body: "로컬에 저장된 프로젝트와 자동 저장 데이터는 앱 기능을 통해 삭제 또는 초기화할 수 있습니다. 사용자가 외부 서비스로 직접 전송한 정보의 열람, 정정, 삭제, 처리정지 요구는 해당 서비스 운영자에게 행사해야 합니다."
      },
      {
        title: "7. 파기 절차 및 방법",
        body: "로컬 프로젝트와 자동 저장 데이터는 사용자가 삭제 또는 초기화 기능을 실행할 때 제거됩니다. 민양테크 서버에 별도 저장되는 프로젝트 데이터는 없습니다."
      },
      {
        title: "8. 안전성 확보 조치",
        body: "IXO Engine은 HTTPS 강제, URL 파싱 실패 차단, localhost 및 사설망 차단, 첫 외부 요청 승인, 타임아웃, 중복 요청 방지, 로그 URL 마스킹을 적용합니다. 브라우저 열기 노드와 외부 링크도 같은 정책을 따릅니다."
      },
      {
        title: "9. 이용자 유의사항",
        body: "신뢰할 수 없는 URL, 서버, 스크립트에는 비밀번호, 인증 토큰, 주민등록번호, 결제 정보 등 민감한 정보를 입력하지 마십시오. 사용자가 직접 입력하거나 연결한 URL, 서버, 데이터의 적정성은 사용자가 확인해야 합니다."
      },
      {
        title: "10. 문의처",
        body: "개인정보 처리방침 관련 문의는 support@minyangtech.n-e.kr 로 보낼 수 있습니다."
      },
      {
        title: "11. 방침 변경",
        body: "본 방침이 바뀌면 문서와 앱 내 안내를 갱신합니다."
      }
    ]
  },
  en: {
    effectiveDate: "Effective date: 2026-05-18",
    sections: [
      {
        title: "1. Purpose",
        body: "This policy explains what information may be processed by IXO Engine and how users can control local data. IXO Engine is local-first, and project data stays on the user's device by default."
      },
      {
        title: "2. Processing purpose",
        body: "IXO Engine checks for updates once at startup and communicates only as needed for user-configured network features. Project files and builder data are not automatically uploaded to MinyangTech servers."
      },
      {
        title: "3. Information that may be processed",
        body: "Update checks contact the GitHub API, so connection metadata such as IP addresses may be handled by that provider. URLs, request bodies, headers, tokens, or personal data entered into network nodes may be sent to servers chosen by the user."
      },
      {
        title: "4. Retention",
        body: "IXO Engine does not store personal data on MinyangTech servers for these features. Retention for data sent to third-party servers follows each server operator's policy."
      },
      {
        title: "5. Third parties and external services",
        body: "Update checks use the GitHub API. External services called by user-created network nodes are operated by their own providers, who control their own privacy and security practices."
      },
      {
        title: "6. User rights",
        body: "Local projects and autosaves can be deleted or reset inside the app. Rights regarding data sent to an external service must be exercised with that service operator."
      },
      {
        title: "7. Safeguards",
        body: "IXO Engine enforces HTTPS, blocks invalid URLs, localhost, and private-network targets, requests approval for first external use, applies timeouts and duplicate-request prevention, and masks URLs in logs."
      },
      {
        title: "8. User caution",
        body: "Do not send passwords, authentication tokens, or personal data to servers or scripts you do not trust."
      },
      {
        title: "9. Contact",
        body: "Questions about this policy can be sent to support@minyangtech.n-e.kr."
      }
    ]
  }
};
const RESTRICTED_SCRIPT_BLOCKED_PROPERTIES = new Set([
  "__proto__",
  "prototype",
  "constructor",
  "caller",
  "callee",
  "arguments",
  "__defineGetter__",
  "__defineSetter__",
  "__lookupGetter__",
  "__lookupSetter__"
]);

const LANGUAGE_OPTIONS = [
  { value: "ko", label: "\uD55C\uAD6D\uC5B4" },
  { value: "en", label: "English" },
  { value: "zh", label: "\u4E2D\u6587" },
  { value: "ja", label: "\u65E5\u672C\u8A9E" }
];

const THEME_OPTIONS = ADVANCED_THEME_PRESETS;
const CUSTOM_THEME_PREFIX = "custom-theme-";

function sanitizeThemeToken(value, fallback) {
  const text = String(value || "").trim();
  if (!text) return fallback;
  if (/^#[0-9a-f]{3,8}$/i.test(text)) return text;
  if (/^rgba?\([0-9\s,./%]+\)$/i.test(text)) return text;
  if (/^linear-gradient\(/i.test(text) || /^radial-gradient\(/i.test(text)) return text;
  return fallback;
}

function normalizeUploadedTheme(input, fallback = THEME_OPTIONS.mint) {
  const parsed = typeof input === "string" ? JSON.parse(input) : input;
  const normalized = normalizeThemePreset(parsed || {}, fallback);
  return {
    label: String(normalized.label || "Custom Theme").slice(0, 48),
    accent: sanitizeThemeToken(normalized.accent, fallback.accent),
    accentSoft: sanitizeThemeToken(normalized.accentSoft, fallback.accentSoft),
    accentStrong: sanitizeThemeToken(normalized.accentStrong, fallback.accentStrong),
    glow: sanitizeThemeToken(normalized.glow, fallback.glow),
    background: sanitizeThemeToken(normalized.background, fallback.background),
    bg: sanitizeThemeToken(normalized.bg, fallback.bg || "#08110d"),
    bgSoft: sanitizeThemeToken(normalized.bgSoft, fallback.bgSoft || "#0d1712"),
    panel: sanitizeThemeToken(normalized.panel, fallback.panel || "#101915"),
    panelAlt: sanitizeThemeToken(normalized.panelAlt, fallback.panelAlt || "#13211c"),
    panelElevated: sanitizeThemeToken(normalized.panelElevated, fallback.panelElevated || "#172923"),
    text: sanitizeThemeToken(normalized.text, fallback.text || "#edf6f1"),
    muted: sanitizeThemeToken(normalized.muted, fallback.muted || "#95ada2"),
    line: sanitizeThemeToken(normalized.line, fallback.line || "rgba(128, 162, 145, 0.18)"),
    lineStrong: sanitizeThemeToken(normalized.lineStrong, fallback.lineStrong || "rgba(128, 162, 145, 0.3)"),
    inputBg: sanitizeThemeToken(normalized.inputBg, fallback.inputBg || "#0d1511")
  };
}

const PREVIEW_DEVICE_OPTIONS = {
  desktop: { label: "Desktop", width: "100%" },
  tablet: { label: "Tablet", width: "820px" },
  mobile: { label: "Mobile", width: "390px" }
};

const DESKTOP_EXPORT_TARGET_OPTIONS = [
  {
    key: "windows-portable",
    label: ".exe",
    platform: "PC, Windows",
    detail: "즉시 실행형",
    supported: true
  },
  {
    key: "mac-app",
    label: ".app",
    platform: "PC, Mac",
    detail: "앱 번들",
    supported: true
  },
  {
    key: "linux-bundle",
    label: "Linux bundle",
    platform: "PC, Linux",
    detail: "실행 파일 + 필요 리소스",
    supported: true
  }
];

const MOBILE_EXPORT_TARGET_OPTIONS = [
  {
    key: "android-apk",
    label: ".apk",
    platform: "Mobile, Android",
    detail: "Android 패키징 파이프라인",
    supported: true
  },
  {
    key: "ios-ipa",
    label: ".ipa",
    platform: "Mobile, iPhone / iPad",
    detail: "iOS 패키징 파이프라인",
    supported: true
  }
];

const UI_TEXT = {
  ko: {
    preview: "Preview",
    viewer: "UI Viewer",
    builder: "Canvas Builder",
    settings: "\uC124\uC815",
    settingsTitle: "Engine Settings",
    language: "\uC5B8\uC5B4",
    theme: "\uD14C\uB9C8",
    templates: "\uD504\uB85C\uC81D\uD2B8 \uD15C\uD50C\uB9BF",
    responsivePreview: "\uBC18\uC751\uD615 \uBBF8\uB9AC\uBCF4\uAE30",
    httpsNodes: "HTTPS \uB178\uB4DC",
    httpsNodesDescription: "\uD5C8\uC6A9\uD558\uBA74 \uD504\uB85C\uC81D\uD2B8\uC5D0\uC11C HTTPS \uC694\uCCAD \uB178\uB4DC\uB97C \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
    docs: "Docs",
    file: "File",
    deleteZone: "Delete Zone",
    deleteZoneCopy: "\uB178\uB4DC\uB97C \uC5EC\uAE30\uB85C \uB04C\uC5B4\uC624\uAC70\uB098, \uB178\uB4DC/\uC120 \uC120\uD0DD \uD6C4 Delete \uD0A4\uB97C \uB20C\uB7EC \uC81C\uAC70\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4. Ctrl + \uD074\uB9AD\uC73C\uB85C \uC5EC\uB7EC \uB178\uB4DC\uB97C \uC120\uD0DD\uD574 \uADF8\uB8F9\uD654\uD558\uC138\uC694.",
    viewerBuilderHint: "\uD14D\uC2A4\uD2B8, \uC774\uBBF8\uC9C0, \uBC84\uD2BC\uC744 \uB4DC\uB798\uADF8\uD574\uC11C \uBC30\uCE58\uD558\uACE0 \uB178\uB4DC refKey\uC640 \uC5F0\uACB0\uD558\uC138\uC694.",
    viewerSimpleHint: "\uB178\uB4DC \uB85C\uC9C1\uACFC \uC5F0\uACB0\uB41C \uC2E4\uC81C \uC571 \uD654\uBA74\uC744 \uB2E8\uC21C\uD558\uAC8C \uD655\uC778\uD569\uB2C8\uB2E4.",
    builderToolbarTitle: "Canvas Builder",
    builderToolbarCopy: "\uD314\uB808\uD2B8\uC5D0\uC11C \uC694\uC18C\uB97C \uB04C\uC5B4\uB2E4 \uB193\uC73C\uBA74 UI Viewer\uC640 \uB3D9\uC77C\uD55C \uD654\uBA74\uC5D0 \uC989\uC2DC \uBC18\uC601\uB429\uB2C8\uB2E4.",
    loadTemplate: "\uD15C\uD50C\uB9BF \uBD88\uB7EC\uC624\uAE30",
    clearAutosave: "\uC790\uB3D9 \uC800\uC7A5 \uCD08\uAE30\uD654",
    updates: "\uC5C5\uB370\uC774\uD2B8",
    updateDescription: "GitHub Release\uC5D0\uC11C \uC0C8 \uBC84\uC804\uC744 \uD655\uC778\uD569\uB2C8\uB2E4.",
    currentVersion: "\uD604\uC7AC \uBC84\uC804",
    latestVersion: "\uCD5C\uC2E0 \uBC84\uC804",
    checkUpdates: "\uC5C5\uB370\uC774\uD2B8 \uD655\uC778",
    checkingUpdates: "\uD655\uC778 \uC911...",
    downloadUpdate: "\uC5C5\uB370\uC774\uD2B8 \uB2E4\uC6B4\uB85C\uB4DC",
    downloadingUpdate: "\uB2E4\uC6B4\uB85C\uB4DC \uC911...",
    upToDate: "\uCD5C\uC2E0 \uBC84\uC804\uC785\uB2C8\uB2E4.",
    updateAvailable: "\uC0C8 \uBC84\uC804\uC774 \uC788\uC2B5\uB2C8\uB2E4.",
    updateUnavailable: "\uC5C5\uB370\uC774\uD2B8 \uC815\uBCF4\uB97C \uD655\uC778\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.",
    noReleasePublished: "\uC544\uC9C1 \uACF5\uAC1C\uB41C GitHub Release\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.",
    noPlatformAsset: "\uC774 \uD50C\uB7AB\uD3FC\uC6A9 \uBC30\uD3EC \uD30C\uC77C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
    releaseNotes: "\uB9B4\uB9AC\uC2A4 \uB178\uD2B8",
    downloadReady: "\uB2E4\uC6B4\uB85C\uB4DC \uC644\uB8CC",
    apply: "Apply",
    cancel: "Cancel",
    applied: "\uC801\uC6A9\uB418\uC5C8\uC2B5\uB2C8\uB2E4!",
    selectTemplate: "\uC120\uD0DD \uD15C\uD50C\uB9BF",
    settingsIcon: "\u2699"
  },
  en: {
    preview: "Preview",
    viewer: "UI Viewer",
    builder: "Canvas Builder",
    settings: "Settings",
    settingsTitle: "Engine Settings",
    language: "Language",
    theme: "Theme",
    templates: "Starter Templates",
    responsivePreview: "Responsive Preview",
    httpsNodes: "HTTPS Nodes",
    httpsNodesDescription: "Allow projects to use HTTPS request nodes.",
    docs: "Docs",
    file: "File",
    deleteZone: "Delete Zone",
    deleteZoneCopy: "Drag nodes here to remove them, or select nodes/edges and press Delete. Use Ctrl + click to multi-select and group.",
    viewerBuilderHint: "Drag text, image, and button layers here and bind them to node refKeys.",
    viewerSimpleHint: "Review the running app screen separately from the node graph.",
    builderToolbarTitle: "Canvas Builder",
    builderToolbarCopy: "Drop palette items here and reflect the same design in UI Viewer instantly.",
    loadTemplate: "Load Template",
    clearAutosave: "Clear Auto-Save",
    updates: "Updates",
    updateDescription: "Check GitHub Releases for a newer version.",
    currentVersion: "Current version",
    latestVersion: "Latest version",
    checkUpdates: "Check Updates",
    checkingUpdates: "Checking...",
    downloadUpdate: "Download Update",
    downloadingUpdate: "Downloading...",
    upToDate: "You are up to date.",
    updateAvailable: "A newer version is available.",
    updateUnavailable: "Update information is unavailable.",
    noReleasePublished: "No public GitHub Release has been published yet.",
    noPlatformAsset: "No release file is available for this platform.",
    releaseNotes: "Release notes",
    downloadReady: "Download ready",
    apply: "Apply",
    cancel: "Cancel",
    applied: "Applied!",
    selectTemplate: "Selected Template",
    settingsIcon: "\u2699"
  },
  zh: {
    preview: "\u9884\u89C8",
    viewer: "\u754C\u9762\u67E5\u770B\u5668",
    builder: "\u753B\u5E03\u6784\u5EFA\u5668",
    settings: "\u8BBE\u7F6E",
    settingsTitle: "\u5F15\u64CE\u8BBE\u7F6E",
    language: "\u8BED\u8A00",
    theme: "\u4E3B\u9898",
    templates: "\u9879\u76EE\u6A21\u677F",
    responsivePreview: "\u54CD\u5E94\u5F0F\u9884\u89C8",
    httpsNodes: "HTTPS \u8282\u70B9",
    httpsNodesDescription: "\u5141\u8BB8\u9879\u76EE\u4F7F\u7528 HTTPS \u8BF7\u6C42\u8282\u70B9\u3002",
    docs: "\u6587\u6863",
    file: "\u6587\u4EF6",
    deleteZone: "\u5220\u9664\u533A\u57DF",
    deleteZoneCopy: "\u628A\u8282\u70B9\u62D6\u5230\u8FD9\u91CC\u5373\u53EF\u5220\u9664\uff0c\u6216\u8005\u9009\u4E2D\u8282\u70B9/\u8FDE\u7EBF\u540E\u6309 Delete\u3002\u6309 Ctrl + \u70B9\u51FB\u53EF\u591A\u9009\u540E\u5206\u7EC4\u3002",
    viewerBuilderHint: "\u62D6\u5165\u6587\u672C\u3001\u56FE\u7247\u3001\u6309\u94AE\u5E76\u8FDE\u63A5\u5230\u8282\u70B9 refKey\u3002",
    viewerSimpleHint: "\u5C06\u5B9E\u9645\u5E94\u7528\u754C\u9762\u4E0E\u8282\u70B9\u903B\u8F91\u5206\u5F00\u67E5\u770B\u3002",
    builderToolbarTitle: "\u753B\u5E03\u6784\u5EFA\u5668",
    builderToolbarCopy: "\u628A\u7D20\u6750\u62D6\u5230\u8FD9\u91CC\u540E\uff0cUI Viewer \u4F1A\u7ACB\u5373\u540C\u6B65\u663E\u793A\u3002",
    loadTemplate: "\u52A0\u8F7D\u6A21\u677F",
    clearAutosave: "\u6E05\u9664\u81EA\u52A8\u4FDD\u5B58",
    updates: "\u66F4\u65B0",
    updateDescription: "\u4ECE GitHub Release \u68C0\u67E5\u65B0\u7248\u672C\u3002",
    currentVersion: "\u5F53\u524D\u7248\u672C",
    latestVersion: "\u6700\u65B0\u7248\u672C",
    checkUpdates: "\u68C0\u67E5\u66F4\u65B0",
    checkingUpdates: "\u68C0\u67E5\u4E2D...",
    downloadUpdate: "\u4E0B\u8F7D\u66F4\u65B0",
    downloadingUpdate: "\u4E0B\u8F7D\u4E2D...",
    upToDate: "\u5DF2\u662F\u6700\u65B0\u7248\u672C\u3002",
    updateAvailable: "\u6709\u53EF\u7528\u7684\u65B0\u7248\u672C\u3002",
    updateUnavailable: "\u65E0\u6CD5\u83B7\u53D6\u66F4\u65B0\u4FE1\u606F\u3002",
    noReleasePublished: "\u5C1A\u672A\u53D1\u5E03\u516C\u5F00\u7684 GitHub Release\u3002",
    noPlatformAsset: "\u6CA1\u6709\u9002\u7528\u4E8E\u6B64\u5E73\u53F0\u7684\u53D1\u5E03\u6587\u4EF6\u3002",
    releaseNotes: "\u53D1\u5E03\u8BF4\u660E",
    downloadReady: "\u4E0B\u8F7D\u5B8C\u6210",
    apply: "\u5E94\u7528",
    cancel: "\u53D6\u6D88",
    applied: "\u5DF2\u5E94\u7528\uff01",
    selectTemplate: "\u5DF2\u9009\u62E9\u6A21\u677F",
    settingsIcon: "\u2699"
  },
  ja: {
    preview: "\u30D7\u30EC\u30D3\u30E5\u30FC",
    viewer: "UI Viewer",
    builder: "Canvas Builder",
    settings: "\u8A2D\u5B9A",
    settingsTitle: "Engine Settings",
    language: "\u8A00\u8A9E",
    theme: "\u30C6\u30FC\u30DE",
    templates: "\u30B9\u30BF\u30FC\u30BF\u30FC\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8",
    responsivePreview: "\u30EC\u30B9\u30DD\u30F3\u30B7\u30D6\u78BA\u8A8D",
    httpsNodes: "HTTPS \u30CE\u30FC\u30C9",
    httpsNodesDescription: "\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u3067 HTTPS \u30EA\u30AF\u30A8\u30B9\u30C8\u30CE\u30FC\u30C9\u3092\u4F7F\u7528\u3067\u304D\u308B\u3088\u3046\u306B\u3057\u307E\u3059\u3002",
    docs: "Docs",
    file: "File",
    deleteZone: "Delete Zone",
    deleteZoneCopy: "\u30CE\u30FC\u30C9\u3092\u3053\u3053\u306B\u30C9\u30E9\u30C3\u30B0\u3059\u308B\u304B\u3001\u30CE\u30FC\u30C9/\u7DDA\u3092\u9078\u629E\u3057\u3066 Delete \u3092\u62BC\u3059\u3068\u524A\u9664\u3067\u304D\u307E\u3059\u3002Ctrl + \u30AF\u30EA\u30C3\u30AF\u3067\u8907\u6570\u9078\u629E\u3057\u3066\u30B0\u30EB\u30FC\u30D7\u5316\u3067\u304D\u307E\u3059\u3002",
    viewerBuilderHint: "\u30C6\u30AD\u30B9\u30C8\u3001\u753B\u50CF\u3001\u30DC\u30BF\u30F3\u3092\u30C9\u30E9\u30C3\u30B0\u3057\u3066\u914D\u7F6E\u3057\u3001\u30CE\u30FC\u30C9 refKey \u3068\u9023\u643A\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
    viewerSimpleHint: "\u30CE\u30FC\u30C9\u30ED\u30B8\u30C3\u30AF\u3068\u5206\u96E2\u3057\u3066\u5B9F\u969B\u306E\u753B\u9762\u3092\u78BA\u8A8D\u3057\u307E\u3059\u3002",
    builderToolbarTitle: "Canvas Builder",
    builderToolbarCopy: "\u30D1\u30EC\u30C3\u30C8\u306E\u8981\u7D20\u3092\u3053\u3053\u306B\u7F6E\u304F\u3068\u3001UI Viewer \u306B\u5373\u6642\u53CD\u6620\u3055\u308C\u307E\u3059\u3002",
    loadTemplate: "\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8\u8AAD\u307F\u8FBC\u307F",
    clearAutosave: "\u81EA\u52D5\u4FDD\u5B58\u3092\u524A\u9664",
    updates: "\u30A2\u30C3\u30D7\u30C7\u30FC\u30C8",
    updateDescription: "GitHub Release \u304B\u3089\u65B0\u3057\u3044\u30D0\u30FC\u30B8\u30E7\u30F3\u3092\u78BA\u8A8D\u3057\u307E\u3059\u3002",
    currentVersion: "\u73FE\u5728\u306E\u30D0\u30FC\u30B8\u30E7\u30F3",
    latestVersion: "\u6700\u65B0\u30D0\u30FC\u30B8\u30E7\u30F3",
    checkUpdates: "\u66F4\u65B0\u3092\u78BA\u8A8D",
    checkingUpdates: "\u78BA\u8A8D\u4E2D...",
    downloadUpdate: "\u66F4\u65B0\u3092\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9",
    downloadingUpdate: "\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u4E2D...",
    upToDate: "\u6700\u65B0\u30D0\u30FC\u30B8\u30E7\u30F3\u3067\u3059\u3002",
    updateAvailable: "\u65B0\u3057\u3044\u30D0\u30FC\u30B8\u30E7\u30F3\u304C\u3042\u308A\u307E\u3059\u3002",
    updateUnavailable: "\u66F4\u65B0\u60C5\u5831\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3002",
    noReleasePublished: "\u516C\u958B\u3055\u308C\u305F GitHub Release \u306F\u307E\u3060\u3042\u308A\u307E\u305B\u3093\u3002",
    noPlatformAsset: "\u3053\u306E\u30D7\u30E9\u30C3\u30C8\u30D5\u30A9\u30FC\u30E0\u7528\u306E\u914D\u5E03\u30D5\u30A1\u30A4\u30EB\u304C\u3042\u308A\u307E\u305B\u3093\u3002",
    releaseNotes: "\u30EA\u30EA\u30FC\u30B9\u30CE\u30FC\u30C8",
    downloadReady: "\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u5B8C\u4E86",
    apply: "\u9069\u7528",
    cancel: "\u30AD\u30E3\u30F3\u30BB\u30EB",
    applied: "\u9069\u7528\u3055\u308C\u307E\u3057\u305F\uff01",
    selectTemplate: "\u9078\u629E\u30C6\u30F3\u30D7\u30EC\u30FC\u30C8",
    settingsIcon: "\u2699"
  }
};

const EXTRA_UI_TEXT = {
  ko: {
    preview: "미리보기",
    viewer: "UI 뷰어",
    builder: "캔버스 빌더",
    settingsTitle: "엔진 설정",
    docs: "문서",
    file: "파일",
    builderToolbarTitle: "캔버스 빌더",
    workspaceSubtitle: "Visual logic + UI builder workspace",
    save: "저장",
    load: "불러오기",
    export: "내보내기",
    magicAlign: "자동 정렬",
    speed: "속도",
    resume: "재개",
    pause: "일시정지",
    trace: "추적",
    nodeLibrary: "노드 라이브러리",
    groupSelected: "선택 항목 그룹화",
    safeMode: "안전 모드",
    restoreBackup: "백업 복원",
    autoReset: "자동 초기화",
    close: "닫기",
    findNode: "노드 찾기",
    searchAllNodes: "전체 노드 검색...",
    searchNodes: "노드 검색...",
    quickSearchNodes: "노드 이름을 입력하고 Enter...",
    librarySearchPlaceholder: "Ctrl+F 또는 노드 이름 입력...",
    clear: "지우기",
    result: "결과",
    results: "결과",
    coreTab: "기본",
    proTab: "고급",
    functionsTab: "함수",
    functions: "함수",
    createFunction: "함수 만들기",
    editingFunction: "현재 함수 편집 중",
    returnToMain: "메인으로 돌아가기",
    functionDescription: "함수 설명",
    functionDescriptionPlaceholder: "이 함수가 하는 일을 적어주세요.",
    returnRefKey: "반환 Ref Key",
    parameters: "매개변수",
    addParameter: "매개변수 추가",
    defaultValue: "기본값",
    description: "설명",
    delete: "삭제",
    noParametersHint: "필요할 때 매개변수를 추가하세요.",
    functionNameAria: "함수 이름",
    noParams: "매개변수 없음",
    edit: "편집",
    noFunctions: "아직 함수가 없습니다",
    noFunctionsHint: "직접 만든 함수는 재귀 호출도 가능합니다.",
    noMatchingNodes: "일치하는 노드가 없습니다",
    tryAnotherKeyword: "다른 검색어를 입력하거나 검색을 지워보세요.",
    nodeOutputFeed: "노드 출력 피드",
    execution: "실행 순서",
    errorLogConsole: "오류 로그 콘솔",
    errorLogHint: "스크립트 실행 결과, 분기 결과, 외부 액션 로그를 아래에 누적합니다.",
    noLogs: "아직 기록된 로그가 없습니다.",
    uiInspector: "UI 속성",
    proInspector: "고급 속성",
    properties: "속성",
    nodes: "노드",
    edges: "연결",
    uiLayers: "UI 레이어",
    logs: "로그",
    viewerMode: "보기 모드",
    viewerModeBuilder: "Canvas Builder가 활성화되어 있습니다.",
    viewerModeViewer: "UI Viewer만 집중해서 보고 있습니다.",
    viewerModePreview: "Preview와 JSON 상태를 함께 보고 있습니다.",
    elementKind: "요소 종류",
    textLabel: "텍스트 / 라벨",
    imageSrc: "이미지 주소",
    bindingRefKey: "연결 Ref Key",
    width: "너비",
    height: "높이",
    fontSize: "글자 크기",
    radius: "모서리 반경",
    textColor: "글자 색상",
    background: "배경",
    actionType: "동작 종류",
    actionValue: "동작 값",
    deleteUiElement: "UI 요소 삭제",
    nodeLabel: "노드 라벨",
    conditionChain: "조건식 (AND/OR)",
    mathExpression: "수식",
    javascriptCode: "JavaScript 코드",
    valueSetting: "값 / 설정",
    refKey: "Ref Key",
    groupLabel: "그룹 라벨",
    nodeType: "노드 종류",
    functionArguments: "함수 인수",
    functionNoParams: "이 함수는 매개변수가 없습니다.",
    functionReturnPrefix: "반환값은",
    functionReturnSuffix: "기준으로 전달됩니다.",
    lastExecutedNode: "마지막 실행 노드",
    numericSlider: "숫자 슬라이더",
    colorPicker: "색상 선택",
    soundUpload: "사운드 업로드",
    filePath: "파일 경로",
    selectedId: "선택 ID",
    createLinkedUiText: "연결된 UI 텍스트 만들기",
    emptyInspectorHint: "노드를 더블 클릭하면 고급 Inspector가 열리고, UI Viewer 또는 Canvas Builder에서 UI 요소를 선택해 디자인 속성을 수정할 수 있습니다.",
    addUiText: "UI 텍스트 추가",
    addUiButton: "UI 버튼 추가",
    engineStatus: "엔진 상태",
    unsavedChanges: "저장되지 않은 변경사항",
    mode: "모드",
    paletteText: "텍스트",
    paletteImage: "이미지",
    paletteButton: "버튼",
    paletteInput: "입력",
    paletteContainer: "컨테이너",
    deviceDesktop: "데스크톱",
    deviceTablet: "태블릿",
    deviceMobile: "모바일",
    exportTitle: "최종 산출물",
    cancelExport: "취소하기",
    exportDestinationPrefix: "해당 앱은",
    exportDestinationEmpty: "저장 위치를 선택하세요.",
    exportDestinationSuffix: "에 저장됩니다.",
    pickPath: "경로 선택",
    chooseArtifactTypes: "산출물 형식을 선택하세요.",
    exportRequirementHint: "경로와 형식을 모두 지정해야 내보내기를 진행할 수 있습니다.",
    desktopPipeline: "데스크톱",
    mobilePipeline: "모바일",
    mobilePipelineTitle: "모바일은 별도 패키징 파이프라인으로 처리됩니다.",
    mobilePipelineCopy: "웹 런타임과 프로젝트 데이터를 모바일 워크스페이스로 내보내고, Android/iOS 전용 도구 체인에서 최종 `.apk` 또는 `.ipa`를 빌드합니다.",
    mobileIconPreview: "모바일 아이콘 미리보기",
    mobileIconPreviewHint: "기본 아이콘 또는 선택한 아이콘으로 플랫폼별 결과를 미리 확인합니다.",
    mobileIconPreviewAlt: "모바일 아이콘 미리보기",
    androidAdaptiveIcon: "Android adaptive icon",
    iosAppIcon: "iOS app icon",
    androidIconBackground: "Android 아이콘 배경색",
    selectedAppIconAlt: "선택한 앱 아이콘",
    dragAppIcon: "앱 아이콘 여기 끌어당기기",
    appNamePrompt: "앱 이름을 정해주세요.",
    version: "버전",
    defaultExportHint: "아이콘 또는 이름을 지정하지 않을 시 기본 아이콘과 기본 이름이 사용됩니다.",
    iconFormatsHint: "PNG 또는 ICO 아이콘을 지원합니다.",
    exporting: "내보내는 중...",
    exportAction: "내보내기",
    invalidIcon: "PNG 또는 ICO 파일만 아이콘으로 사용할 수 있습니다.",
    projectTrust: "프로젝트 신뢰",
    trustRestricted: "제한 실행",
    trustReview: "검토 필요",
    trustTrusted: "세션 신뢰됨",
    trustBlocked: "차단됨",
    trustRestrictedHint: "전체 JavaScript 없이 제한 실행만 사용 중입니다.",
    trustReviewHint: "전체 JavaScript가 필요한 스크립트가 있습니다.",
    trustTrustedHint: "이 세션에서 전체 JavaScript 실행을 허용했습니다.",
    trustBlockedHint: "전체 JavaScript 실행을 거부했습니다.",
    fullJavascriptWarningTitle: "전체 JavaScript 모드 경고",
    fullJavascriptWarningCopy: "이 스크립트는 제한 실행으로 처리할 수 없어 프로젝트가 임의 JavaScript를 실행할 수 있습니다. 신뢰할 수 있는 프로젝트에서만 허용하세요.",
    fullJavascriptWhyTitle: "왜 위험한가",
    fullJavascriptWhyItems: [
      "프로젝트 상태와 입력값을 읽거나 바꿀 수 있습니다.",
      "무한 반복이나 무거운 계산으로 앱을 멈추게 할 수 있습니다.",
      "네트워크 노드와 결합되면 토큰이나 개인정보가 외부로 전송될 수 있습니다."
    ],
    fullJavascriptRecommendedTitle: "권장 패턴",
    fullJavascriptRecommendedItems: [
      "가능하면 수식, 조건, 문자 조합 노드를 먼저 사용하세요.",
      "스크립트는 짧은 순수 계산으로 제한하고 민감정보를 넣지 마세요.",
      "출처가 불명확한 프로젝트는 승인 전에 코드를 먼저 검토하세요."
    ],
    fullJavascriptTrustHint: "권장: 직접 작성했거나 충분히 검토한 프로젝트만 세션 신뢰를 부여하세요.",
    requestFullJavascript: "전체 JavaScript 허용 요청",
    fileWatcherPath: "감시 경로",
    chooseWatchPath: "감시 경로 선택",
    chooseWatchPathHint: "파일 또는 폴더를 선택하세요.",
    privacyPolicy: "개인정보 처리방침",
    openPrivacyPolicy: "개인정보 처리방침 보기",
    privacyPolicyIntro: "업데이트 확인과 네트워크 노드 사용 시 어떤 정보가 오갈 수 있는지 확인합니다."
  },
  en: {
    preview: "Preview",
    viewer: "UI Viewer",
    builder: "Canvas Builder",
    settingsTitle: "Engine Settings",
    docs: "Docs",
    file: "File",
    builderToolbarTitle: "Canvas Builder",
    workspaceSubtitle: "Visual logic + UI builder workspace",
    save: "Save",
    load: "Load",
    export: "Export",
    magicAlign: "Magic Align",
    speed: "Speed",
    resume: "Resume",
    pause: "Pause",
    trace: "Trace",
    nodeLibrary: "Node Library",
    groupSelected: "Group Selected",
    safeMode: "Safe Mode",
    restoreBackup: "Restore Backup",
    autoReset: "Auto Reset",
    close: "Close",
    findNode: "Find node",
    searchAllNodes: "Search all nodes...",
    searchNodes: "Search nodes...",
    quickSearchNodes: "Type node name and press Enter...",
    librarySearchPlaceholder: "Ctrl+F or type a node name...",
    clear: "Clear",
    result: "result",
    results: "results",
    coreTab: "Core",
    proTab: "Pro",
    functionsTab: "Functions",
    functions: "Functions",
    createFunction: "Create Function",
    editingFunction: "Editing function",
    returnToMain: "Return to Main",
    functionDescription: "Function Description",
    functionDescriptionPlaceholder: "Describe what this function does.",
    returnRefKey: "Return Ref Key",
    parameters: "Parameters",
    addParameter: "Add Parameter",
    defaultValue: "Default value",
    description: "Description",
    delete: "Delete",
    noParametersHint: "Add parameters when you need them.",
    functionNameAria: "Function name",
    noParams: "no params",
    edit: "Edit",
    noFunctions: "No functions yet",
    noFunctionsHint: "User-defined functions can call themselves recursively.",
    noMatchingNodes: "No matching nodes",
    tryAnotherKeyword: "Try another keyword or clear the search.",
    nodeOutputFeed: "Node Output Feed",
    execution: "Execution",
    errorLogConsole: "Error Log Console",
    errorLogHint: "Script results, branch results, and external action logs accumulate below.",
    noLogs: "No logs yet.",
    uiInspector: "UI Inspector",
    proInspector: "Pro Inspector",
    properties: "Properties",
    nodes: "Nodes",
    edges: "Edges",
    uiLayers: "UI Layers",
    logs: "Logs",
    viewerMode: "Viewer Mode",
    viewerModeBuilder: "Canvas Builder is active.",
    viewerModeViewer: "Focusing on UI Viewer only.",
    viewerModePreview: "Showing Preview and JSON state together.",
    elementKind: "Element Kind",
    textLabel: "Text / Label",
    imageSrc: "Image Src",
    bindingRefKey: "Binding Ref Key",
    width: "Width",
    height: "Height",
    fontSize: "Font Size",
    radius: "Radius",
    textColor: "Text Color",
    background: "Background",
    actionType: "Action Type",
    actionValue: "Action Value",
    deleteUiElement: "Delete UI Element",
    nodeLabel: "Node Label",
    conditionChain: "Condition Chain (AND/OR)",
    mathExpression: "Math Expression",
    javascriptCode: "JavaScript Code",
    valueSetting: "Value / Setting",
    refKey: "Ref Key",
    groupLabel: "Group Label",
    nodeType: "Node Type",
    functionArguments: "Function Arguments",
    functionNoParams: "This function has no parameters.",
    functionReturnPrefix: "Return value is passed from",
    functionReturnSuffix: ".",
    lastExecutedNode: "the last executed node",
    numericSlider: "Numeric Slider",
    colorPicker: "Color Picker",
    soundUpload: "Sound Upload",
    filePath: "File Path",
    selectedId: "Selected ID",
    createLinkedUiText: "Create Linked UI Text",
    emptyInspectorHint: "Double-click a node to open the Pro Inspector, or select a UI element in UI Viewer or Canvas Builder to edit its design properties.",
    addUiText: "Add UI Text",
    addUiButton: "Add UI Button",
    engineStatus: "ENGINE STATUS",
    unsavedChanges: "Unsaved changes",
    mode: "Mode",
    paletteText: "Text",
    paletteImage: "Image",
    paletteButton: "Button",
    paletteInput: "Input",
    paletteContainer: "Container",
    deviceDesktop: "Desktop",
    deviceTablet: "Tablet",
    deviceMobile: "Mobile",
    exportTitle: "Final Artifact",
    cancelExport: "Cancel",
    exportDestinationPrefix: "This app will be saved to",
    exportDestinationEmpty: "Choose a save location.",
    exportDestinationSuffix: "",
    pickPath: "Choose Path",
    chooseArtifactTypes: "Choose artifact types.",
    exportRequirementHint: "You must choose both a path and at least one format before exporting.",
    desktopPipeline: "Desktop",
    mobilePipeline: "Mobile",
    mobilePipelineTitle: "Mobile uses a separate packaging pipeline.",
    mobilePipelineCopy: "The web runtime and project data are exported into a mobile workspace, then Android/iOS toolchains build the final `.apk` or `.ipa`.",
    mobileIconPreview: "Mobile icon preview",
    mobileIconPreviewHint: "Preview how the default or selected icon will appear per platform.",
    mobileIconPreviewAlt: "Mobile icon preview",
    androidAdaptiveIcon: "Android adaptive icon",
    iosAppIcon: "iOS app icon",
    androidIconBackground: "Android icon background",
    selectedAppIconAlt: "Selected app icon",
    dragAppIcon: "Drop app icon here",
    appNamePrompt: "Choose an app name.",
    version: "Version",
    defaultExportHint: "If no icon or name is provided, the default icon and default name are used.",
    iconFormatsHint: "PNG and ICO icons are supported.",
    exporting: "Exporting...",
    exportAction: "Export",
    invalidIcon: "Only PNG or ICO files can be used as icons.",
    projectTrust: "Project Trust",
    trustRestricted: "Restricted",
    trustReview: "Review Needed",
    trustTrusted: "Trusted Session",
    trustBlocked: "Blocked",
    trustRestrictedHint: "Only restricted execution is in use.",
    trustReviewHint: "This project contains scripts that need full JavaScript.",
    trustTrustedHint: "Full JavaScript is approved for this session.",
    trustBlockedHint: "Full JavaScript execution was denied.",
    fullJavascriptWarningTitle: "Full JavaScript Warning",
    fullJavascriptWarningCopy: "This script cannot run in restricted mode and may execute arbitrary JavaScript. Only allow projects you trust.",
    fullJavascriptWhyTitle: "Why this is risky",
    fullJavascriptWhyItems: [
      "It can read or change project state and inputs.",
      "It can freeze the app with loops or expensive work.",
      "Combined with network nodes, it can transmit tokens or personal data."
    ],
    fullJavascriptRecommendedTitle: "Recommended patterns",
    fullJavascriptRecommendedItems: [
      "Prefer math, condition, and text nodes when they are enough.",
      "Keep scripts short, pure, and free of sensitive values.",
      "Review code before trusting projects from outside sources."
    ],
    fullJavascriptTrustHint: "Recommendation: trust only projects you wrote or reviewed carefully.",
    requestFullJavascript: "Request Full JavaScript",
    fileWatcherPath: "Watch Path",
    chooseWatchPath: "Choose Watch Path",
    chooseWatchPathHint: "Choose a file or folder.",
    privacyPolicy: "Privacy Policy",
    openPrivacyPolicy: "Open Privacy Policy",
    privacyPolicyIntro: "Review what may be exchanged during update checks and network-node use."
  },
  zh: {
    preview: "预览",
    viewer: "界面查看器",
    builder: "画布构建器",
    settingsTitle: "引擎设置",
    docs: "文档",
    file: "文件",
    builderToolbarTitle: "画布构建器",
    workspaceSubtitle: "可视化逻辑 + UI 构建工作区",
    save: "保存",
    load: "加载",
    export: "导出",
    magicAlign: "自动对齐",
    speed: "速度",
    resume: "继续",
    pause: "暂停",
    trace: "追踪",
    nodeLibrary: "节点库",
    groupSelected: "组合所选项",
    safeMode: "安全模式",
    restoreBackup: "恢复备份",
    autoReset: "自动重置",
    close: "关闭",
    findNode: "查找节点",
    searchAllNodes: "搜索全部节点...",
    searchNodes: "搜索节点...",
    quickSearchNodes: "输入节点名称并按 Enter...",
    librarySearchPlaceholder: "Ctrl+F 或输入节点名称...",
    clear: "清除",
    result: "项结果",
    results: "项结果",
    coreTab: "基础",
    proTab: "高级",
    functionsTab: "函数",
    functions: "函数",
    createFunction: "创建函数",
    editingFunction: "正在编辑函数",
    returnToMain: "返回主界面",
    functionDescription: "函数说明",
    functionDescriptionPlaceholder: "请描述这个函数的作用。",
    returnRefKey: "返回 Ref Key",
    parameters: "参数",
    addParameter: "添加参数",
    defaultValue: "默认值",
    description: "说明",
    delete: "删除",
    noParametersHint: "需要时再添加参数。",
    functionNameAria: "函数名称",
    noParams: "无参数",
    edit: "编辑",
    noFunctions: "还没有函数",
    noFunctionsHint: "自定义函数也可以递归调用。",
    noMatchingNodes: "没有匹配的节点",
    tryAnotherKeyword: "请尝试其他关键词或清空搜索。",
    nodeOutputFeed: "节点输出流",
    execution: "执行顺序",
    errorLogConsole: "错误日志控制台",
    errorLogHint: "脚本结果、分支结果和外部动作日志会累计显示在下方。",
    noLogs: "还没有日志。",
    uiInspector: "UI 检查器",
    proInspector: "高级检查器",
    properties: "属性",
    nodes: "节点",
    edges: "连线",
    uiLayers: "UI 图层",
    logs: "日志",
    viewerMode: "查看模式",
    viewerModeBuilder: "Canvas Builder 已启用。",
    viewerModeViewer: "当前只查看 UI Viewer。",
    viewerModePreview: "同时查看 Preview 与 JSON 状态。",
    elementKind: "元素类型",
    textLabel: "文本 / 标签",
    imageSrc: "图片地址",
    bindingRefKey: "绑定 Ref Key",
    width: "宽度",
    height: "高度",
    fontSize: "字号",
    radius: "圆角",
    textColor: "文字颜色",
    background: "背景",
    actionType: "动作类型",
    actionValue: "动作值",
    deleteUiElement: "删除 UI 元素",
    nodeLabel: "节点标签",
    conditionChain: "条件表达式 (AND/OR)",
    mathExpression: "数学表达式",
    javascriptCode: "JavaScript 代码",
    valueSetting: "值 / 设置",
    refKey: "Ref Key",
    groupLabel: "分组标签",
    nodeType: "节点类型",
    functionArguments: "函数参数",
    functionNoParams: "此函数没有参数。",
    functionReturnPrefix: "返回值将从",
    functionReturnSuffix: "传出。",
    lastExecutedNode: "最后执行的节点",
    numericSlider: "数字滑块",
    colorPicker: "颜色选择",
    soundUpload: "上传声音",
    filePath: "文件路径",
    selectedId: "已选 ID",
    createLinkedUiText: "创建关联 UI 文本",
    emptyInspectorHint: "双击节点可打开高级检查器；在 UI Viewer 或 Canvas Builder 中选择 UI 元素可编辑设计属性。",
    addUiText: "添加 UI 文本",
    addUiButton: "添加 UI 按钮",
    engineStatus: "引擎状态",
    unsavedChanges: "有未保存更改",
    mode: "模式",
    paletteText: "文本",
    paletteImage: "图片",
    paletteButton: "按钮",
    paletteInput: "输入",
    paletteContainer: "容器",
    deviceDesktop: "桌面",
    deviceTablet: "平板",
    deviceMobile: "移动端",
    exportTitle: "最终产物",
    cancelExport: "取消",
    exportDestinationPrefix: "该应用将保存到",
    exportDestinationEmpty: "请选择保存位置。",
    exportDestinationSuffix: "",
    pickPath: "选择路径",
    chooseArtifactTypes: "请选择产物格式。",
    exportRequirementHint: "必须同时指定路径和格式后才能导出。",
    desktopPipeline: "桌面",
    mobilePipeline: "移动端",
    mobilePipelineTitle: "移动端使用独立打包流程。",
    mobilePipelineCopy: "网页运行时和项目数据会先导出到移动端工作区，再由 Android/iOS 工具链构建最终 `.apk` 或 `.ipa`。",
    mobileIconPreview: "移动端图标预览",
    mobileIconPreviewHint: "预览默认图标或已选图标在各平台上的效果。",
    mobileIconPreviewAlt: "移动端图标预览",
    androidAdaptiveIcon: "Android 自适应图标",
    iosAppIcon: "iOS 应用图标",
    androidIconBackground: "Android 图标背景色",
    selectedAppIconAlt: "已选择的应用图标",
    dragAppIcon: "将应用图标拖到这里",
    appNamePrompt: "请设置应用名称。",
    version: "版本",
    defaultExportHint: "如果未指定图标或名称，将使用默认图标和默认名称。",
    iconFormatsHint: "支持 PNG 或 ICO 图标。",
    exporting: "正在导出...",
    exportAction: "导出",
    invalidIcon: "只能使用 PNG 或 ICO 文件作为图标。",
    projectTrust: "项目可信度",
    trustRestricted: "受限执行",
    trustReview: "需要审查",
    trustTrusted: "本次会话已信任",
    trustBlocked: "已阻止",
    trustRestrictedHint: "当前仅使用受限执行模式。",
    trustReviewHint: "项目中存在需要完整 JavaScript 的脚本。",
    trustTrustedHint: "本次会话已允许完整 JavaScript。",
    trustBlockedHint: "完整 JavaScript 执行已被拒绝。",
    fullJavascriptWarningTitle: "完整 JavaScript 警告",
    fullJavascriptWarningCopy: "此脚本无法在受限模式下运行，可能执行任意 JavaScript。仅允许你信任的项目。",
    fullJavascriptWhyTitle: "为什么有风险",
    fullJavascriptWhyItems: [
      "它可以读取或修改项目状态和输入值。",
      "它可能通过循环或高负载计算使应用卡住。",
      "与网络节点结合时，可能把令牌或个人信息发送到外部。"
    ],
    fullJavascriptRecommendedTitle: "推荐做法",
    fullJavascriptRecommendedItems: [
      "能用数学、条件、文字节点解决时，优先使用节点。",
      "脚本尽量保持简短、纯计算，并避免放入敏感信息。",
      "对外部来源项目，先审查代码再授予信任。"
    ],
    fullJavascriptTrustHint: "建议：只信任自己编写或已充分审查的项目。",
    requestFullJavascript: "请求完整 JavaScript",
    fileWatcherPath: "监视路径",
    chooseWatchPath: "选择监视路径",
    chooseWatchPathHint: "请选择文件或文件夹。",
    privacyPolicy: "隐私政策",
    openPrivacyPolicy: "查看隐私政策",
    privacyPolicyIntro: "查看更新检查和网络节点使用期间可能交换的信息。"
  },
  ja: {
    preview: "プレビュー",
    viewer: "UI ビューアー",
    builder: "キャンバスビルダー",
    settingsTitle: "エンジン設定",
    docs: "ドキュメント",
    file: "ファイル",
    deleteZone: "削除エリア",
    builderToolbarTitle: "キャンバスビルダー",
    workspaceSubtitle: "ビジュアルロジック + UI ビルダー ワークスペース",
    save: "保存",
    load: "読み込み",
    export: "書き出し",
    magicAlign: "自動整列",
    speed: "速度",
    resume: "再開",
    pause: "一時停止",
    trace: "トレース",
    nodeLibrary: "ノードライブラリ",
    groupSelected: "選択項目をグループ化",
    safeMode: "セーフモード",
    restoreBackup: "バックアップを復元",
    autoReset: "自動初期化",
    close: "閉じる",
    findNode: "ノードを検索",
    searchAllNodes: "すべてのノードを検索...",
    searchNodes: "ノードを検索...",
    quickSearchNodes: "ノード名を入力して Enter...",
    librarySearchPlaceholder: "Ctrl+F またはノード名を入力...",
    clear: "クリア",
    result: "件",
    results: "件",
    coreTab: "基本",
    proTab: "高度",
    functionsTab: "関数",
    functions: "関数",
    createFunction: "関数を作成",
    editingFunction: "編集中の関数",
    returnToMain: "メインへ戻る",
    functionDescription: "関数の説明",
    functionDescriptionPlaceholder: "この関数の役割を入力してください。",
    returnRefKey: "戻り値 Ref Key",
    parameters: "引数",
    addParameter: "引数を追加",
    defaultValue: "既定値",
    description: "説明",
    delete: "削除",
    noParametersHint: "必要になったら引数を追加してください。",
    functionNameAria: "関数名",
    noParams: "引数なし",
    edit: "編集",
    noFunctions: "関数はまだありません",
    noFunctionsHint: "自作関数は再帰呼び出しにも対応します。",
    noMatchingNodes: "一致するノードがありません",
    tryAnotherKeyword: "別のキーワードを試すか検索をクリアしてください。",
    nodeOutputFeed: "ノード出力フィード",
    execution: "実行順",
    errorLogConsole: "エラーログコンソール",
    errorLogHint: "スクリプト結果、分岐結果、外部アクションログを下に蓄積します。",
    noLogs: "ログはまだありません。",
    uiInspector: "UI インスペクター",
    proInspector: "高度インスペクター",
    properties: "プロパティ",
    nodes: "ノード",
    edges: "接続",
    uiLayers: "UI レイヤー",
    logs: "ログ",
    viewerMode: "表示モード",
    viewerModeBuilder: "Canvas Builder が有効です。",
    viewerModeViewer: "UI Viewer のみを表示しています。",
    viewerModePreview: "Preview と JSON 状態を同時に表示しています。",
    elementKind: "要素の種類",
    textLabel: "テキスト / ラベル",
    imageSrc: "画像ソース",
    bindingRefKey: "連携 Ref Key",
    width: "幅",
    height: "高さ",
    fontSize: "文字サイズ",
    radius: "角丸",
    textColor: "文字色",
    background: "背景",
    actionType: "アクション種類",
    actionValue: "アクション値",
    deleteUiElement: "UI 要素を削除",
    nodeLabel: "ノードラベル",
    conditionChain: "条件式 (AND/OR)",
    mathExpression: "数式",
    javascriptCode: "JavaScript コード",
    valueSetting: "値 / 設定",
    refKey: "Ref Key",
    groupLabel: "グループラベル",
    nodeType: "ノード種類",
    functionArguments: "関数引数",
    functionNoParams: "この関数には引数がありません。",
    functionReturnPrefix: "戻り値は",
    functionReturnSuffix: "を基準に渡されます。",
    lastExecutedNode: "最後に実行したノード",
    numericSlider: "数値スライダー",
    colorPicker: "色を選択",
    soundUpload: "サウンドをアップロード",
    filePath: "ファイルパス",
    selectedId: "選択 ID",
    createLinkedUiText: "連携 UI テキストを作成",
    emptyInspectorHint: "ノードをダブルクリックすると高度インスペクターが開き、UI Viewer または Canvas Builder で UI 要素を選択してデザイン属性を編集できます。",
    addUiText: "UI テキストを追加",
    addUiButton: "UI ボタンを追加",
    engineStatus: "エンジン状態",
    unsavedChanges: "未保存の変更",
    mode: "モード",
    paletteText: "テキスト",
    paletteImage: "画像",
    paletteButton: "ボタン",
    paletteInput: "入力",
    paletteContainer: "コンテナ",
    deviceDesktop: "デスクトップ",
    deviceTablet: "タブレット",
    deviceMobile: "モバイル",
    exportTitle: "最終成果物",
    cancelExport: "キャンセル",
    exportDestinationPrefix: "このアプリは",
    exportDestinationEmpty: "保存先を選択してください。",
    exportDestinationSuffix: "に保存されます。",
    pickPath: "保存先を選択",
    chooseArtifactTypes: "成果物形式を選択してください。",
    exportRequirementHint: "保存先と形式の両方を指定すると書き出せます。",
    desktopPipeline: "デスクトップ",
    mobilePipeline: "モバイル",
    mobilePipelineTitle: "モバイルは別のパッケージング工程で処理されます。",
    mobilePipelineCopy: "Web ランタイムとプロジェクトデータをモバイルワークスペースへ書き出し、Android/iOS 専用ツールチェーンで最終 `.apk` または `.ipa` をビルドします。",
    mobileIconPreview: "モバイルアイコンのプレビュー",
    mobileIconPreviewHint: "既定または選択したアイコンの各プラットフォーム表示を確認します。",
    mobileIconPreviewAlt: "モバイルアイコンのプレビュー",
    androidAdaptiveIcon: "Android adaptive icon",
    iosAppIcon: "iOS app icon",
    androidIconBackground: "Android アイコン背景色",
    selectedAppIconAlt: "選択したアプリアイコン",
    dragAppIcon: "ここにアプリアイコンをドロップ",
    appNamePrompt: "アプリ名を決めてください。",
    version: "バージョン",
    defaultExportHint: "アイコンまたは名前を指定しない場合は既定のものを使用します。",
    iconFormatsHint: "PNG または ICO アイコンに対応しています。",
    exporting: "書き出し中...",
    exportAction: "書き出し",
    invalidIcon: "アイコンには PNG または ICO ファイルのみ使用できます。",
    projectTrust: "プロジェクト信頼",
    trustRestricted: "制限実行",
    trustReview: "要確認",
    trustTrusted: "このセッションで信頼済み",
    trustBlocked: "ブロック済み",
    trustRestrictedHint: "現在は制限実行のみを使用しています。",
    trustReviewHint: "完全な JavaScript を必要とするスクリプトがあります。",
    trustTrustedHint: "このセッションでは完全な JavaScript を許可しました。",
    trustBlockedHint: "完全な JavaScript 実行を拒否しました。",
    fullJavascriptWarningTitle: "完全 JavaScript モードの警告",
    fullJavascriptWarningCopy: "このスクリプトは制限実行では処理できず、任意の JavaScript を実行する可能性があります。信頼できるプロジェクトだけ許可してください。",
    fullJavascriptWhyTitle: "なぜ危険か",
    fullJavascriptWhyItems: [
      "プロジェクト状態や入力値を読み取り、変更できます。",
      "無限ループや重い処理でアプリを停止させる可能性があります。",
      "ネットワークノードと組み合わせると、トークンや個人情報を外部送信できます。"
    ],
    fullJavascriptRecommendedTitle: "推奨パターン",
    fullJavascriptRecommendedItems: [
      "数式、条件、文字列ノードで足りる場合は先にそちらを使ってください。",
      "スクリプトは短く純粋な計算に絞り、機密情報を入れないでください。",
      "外部由来のプロジェクトは信頼する前にコードを確認してください。"
    ],
    fullJavascriptTrustHint: "推奨: 自作または十分に確認したプロジェクトだけを信頼してください。",
    requestFullJavascript: "完全 JavaScript を許可",
    fileWatcherPath: "監視パス",
    chooseWatchPath: "監視パスを選択",
    chooseWatchPathHint: "ファイルまたはフォルダーを選択してください。",
    privacyPolicy: "プライバシーポリシー",
    openPrivacyPolicy: "プライバシーポリシーを開く",
    privacyPolicyIntro: "更新確認とネットワークノード利用時にやり取りされる情報を確認します。"
  }
};

Object.entries(EXTRA_UI_TEXT).forEach(([language, copy]) => {
  Object.assign(UI_TEXT[language], copy);
});

const GROUP_TEXT = {
  ko: {
    start: "시작",
    control: "제어",
    visual: "시각",
    system: "시스템",
    logic: "논리",
    utility: "유틸리티",
    data: "데이터",
    network: "네트워크",
    function: "함수"
  },
  en: {
    start: "Start",
    control: "Control",
    visual: "Visual",
    system: "System",
    logic: "Logic",
    utility: "Utility",
    data: "Data",
    network: "Network",
    function: "Function"
  },
  zh: {
    start: "开始",
    control: "控制",
    visual: "视觉",
    system: "系统",
    logic: "逻辑",
    utility: "工具",
    data: "数据",
    network: "网络",
    function: "函数"
  },
  ja: {
    start: "開始",
    control: "制御",
    visual: "表示",
    system: "システム",
    logic: "論理",
    utility: "ユーティリティ",
    data: "データ",
    network: "ネットワーク",
    function: "関数"
  }
};

const NODE_TEXT = {
  ko: {
    start: "시작점",
    condition: "조건 분기",
    compare: "값 비교",
    "merge-data": "데이터 합치기",
    script: "스크립트",
    loop: "반복 실행",
    wait: "지연 대기",
    switch: "갈림길",
    text: "텍스트 출력",
    image: "이미지 출력",
    input: "입력 칸",
    trigger: "누름 동작",
    layout: "레이아웃 박스",
    "ui-text": "UI 텍스트",
    "ui-image": "UI 이미지",
    "ui-button": "UI 버튼",
    "ui-container": "UI 컨테이너",
    variable: "전역 값",
    storage: "로컬 저장",
    constant: "고정 값",
    http: "HTTPS 요청",
    browser: "브라우저 열기",
    "system-info": "시스템 정보",
    "audio-player": "오디오 재생",
    "file-watcher": "파일 감시",
    math: "수식 계산",
    string: "문자 조합",
    random: "무작위 값",
    "signal-send": "메시지 보내기",
    "signal-listen": "메시지 받기",
    "scene-start": "화면 시작",
    "repeat-times": "횟수 반복",
    forever: "계속 반복",
    "break-loop": "반복 끝내기",
    "skip-cycle": "이번 반복 넘기기",
    "wait-until": "조건까지 대기",
    "stop-flow": "흐름 멈춤",
    "restart-flow": "처음부터 다시",
    "clone-spawn": "복제본 생성",
    "clone-remove": "복제본 삭제",
    "move-steps": "앞으로 이동",
    "edge-bounce": "가장자리 튕김",
    "change-x": "X 변경",
    "change-y": "Y 변경",
    "set-x": "X 지정",
    "set-y": "Y 지정",
    "go-to-point": "좌표 이동",
    "glide-point": "부드럽게 이동",
    "turn-angle": "각도 회전",
    "set-heading": "방향 지정",
    "face-target": "대상 바라보기",
    "show-actor": "보이기",
    "hide-actor": "숨기기",
    "speech-bubble": "말풍선",
    "clear-speech": "말풍선 지우기",
    "costume-switch": "모양 바꾸기",
    "visual-effect": "효과 조절",
    "size-change": "크기 변경",
    "layer-shift": "레이어 이동",
    "flip-horizontal": "좌우 뒤집기",
    "pen-down": "선 그리기 시작",
    "pen-up": "선 그리기 중지",
    "pen-color": "선 색상",
    "pen-size": "선 굵기",
    "fill-start": "채우기 시작",
    "fill-stop": "채우기 중지",
    "clear-drawing": "그림 지우기",
    "sound-play": "소리 재생",
    "sound-play-wait": "소리 끝까지 재생",
    "sound-stop": "소리 모두 정지",
    "volume-change": "음량 변경",
    "volume-set": "음량 지정",
    "tempo-change": "빠르기 변경",
    "tempo-set": "빠르기 지정",
    "bgm-play": "배경음 재생",
    "pointer-down": "마우스 눌림?",
    "object-clicked": "오브젝트 눌림?",
    "key-held": "키 눌림?",
    "pointer-over": "포인터 닿음?",
    "number-check": "숫자 확인",
    "logic-and": "그리고",
    "logic-or": "또는",
    "logic-not": "아니다",
    "touch-screen": "터치 가능?",
    "random-range": "범위 무작위",
    timer: "초시계",
    "date-part": "날짜 값",
    "text-length": "문자 길이",
    "text-letter": "문자 위치",
    "text-replace": "문자 바꾸기",
    "text-case": "대소문자 변환",
    "rgb-hex": "RGB를 HEX로",
    "hex-channel": "HEX 채널",
    "function-call": "함수 호출"
  },
  en: {
    start: "Start Point",
    condition: "Branch Check",
    compare: "Value Compare",
    "merge-data": "Data Merge",
    script: "Script",
    loop: "Loop Run",
    wait: "Delay Wait",
    switch: "Route Switch",
    text: "Text Output",
    image: "Image Output",
    input: "Input Field",
    trigger: "Press Action",
    layout: "Layout Box",
    "ui-text": "UI Text",
    "ui-image": "UI Image",
    "ui-button": "UI Button",
    "ui-container": "UI Container",
    variable: "Global Value",
    storage: "Local Store",
    constant: "Fixed Value",
    http: "HTTPS Request",
    browser: "Open Browser",
    "system-info": "System Info",
    "audio-player": "Audio Player",
    "file-watcher": "File Watcher",
    math: "Math Formula",
    string: "Text Compose",
    random: "Random Value",
    "signal-send": "Send Message",
    "signal-listen": "Receive Message",
    "scene-start": "Scene Start",
    "repeat-times": "Repeat Count",
    forever: "Repeat Always",
    "break-loop": "End Loop",
    "skip-cycle": "Skip Cycle",
    "wait-until": "Wait Until",
    "stop-flow": "Stop Flow",
    "restart-flow": "Restart Flow",
    "clone-spawn": "Create Copy",
    "clone-remove": "Remove Copy",
    "move-steps": "Move Forward",
    "edge-bounce": "Bounce Edge",
    "change-x": "Change X",
    "change-y": "Change Y",
    "set-x": "Set X",
    "set-y": "Set Y",
    "go-to-point": "Go To Point",
    "glide-point": "Glide To Point",
    "turn-angle": "Turn Angle",
    "set-heading": "Set Heading",
    "face-target": "Face Target",
    "show-actor": "Show Actor",
    "hide-actor": "Hide Actor",
    "speech-bubble": "Speech Bubble",
    "clear-speech": "Clear Speech",
    "costume-switch": "Change Look",
    "visual-effect": "Visual Effect",
    "size-change": "Change Size",
    "layer-shift": "Layer Move",
    "flip-horizontal": "Flip Horizontal",
    "pen-down": "Draw Start",
    "pen-up": "Draw Stop",
    "pen-color": "Stroke Color",
    "pen-size": "Stroke Size",
    "fill-start": "Fill Start",
    "fill-stop": "Fill Stop",
    "clear-drawing": "Clear Drawing",
    "sound-play": "Play Sound",
    "sound-play-wait": "Play Sound To End",
    "sound-stop": "Stop Sounds",
    "volume-change": "Change Volume",
    "volume-set": "Set Volume",
    "tempo-change": "Change Tempo",
    "tempo-set": "Set Tempo",
    "bgm-play": "Play BGM",
    "pointer-down": "Pointer Down?",
    "object-clicked": "Object Pressed?",
    "key-held": "Key Held?",
    "pointer-over": "Pointer Over?",
    "number-check": "Number Check",
    "logic-and": "And",
    "logic-or": "Or",
    "logic-not": "Not",
    "touch-screen": "Touch Ready?",
    "random-range": "Random Range",
    timer: "Timer",
    "date-part": "Date Part",
    "text-length": "Text Length",
    "text-letter": "Text Letter",
    "text-replace": "Replace Text",
    "text-case": "Text Case",
    "rgb-hex": "RGB to HEX",
    "hex-channel": "HEX Channel",
    "function-call": "Function Call"
  },
  zh: {},
  ja: {}
};

NODE_TEXT.zh = {
  start: "起点",
  condition: "条件分支",
  compare: "比较值",
  "merge-data": "合并数据",
  script: "脚本",
  loop: "重复执行",
  wait: "延迟等待",
  switch: "分流",
  text: "文本输出",
  image: "图片输出",
  input: "输入框",
  trigger: "点击动作",
  layout: "布局容器",
  "ui-text": "UI 文本",
  "ui-image": "UI 图片",
  "ui-button": "UI 按钮",
  "ui-container": "UI 容器",
  variable: "全局值",
  storage: "本地存储",
  constant: "常量",
  http: "HTTPS 请求",
  browser: "打开浏览器",
  "system-info": "系统信息",
  "audio-player": "音频播放",
  "file-watcher": "文件监听",
  math: "公式计算",
  string: "字符串组合",
  random: "随机值",
  "signal-send": "发送消息",
  "signal-listen": "接收消息",
  "scene-start": "场景开始",
  "repeat-times": "按次数重复",
  forever: "持续重复",
  "break-loop": "结束循环",
  "skip-cycle": "跳过本次循环",
  "wait-until": "等待条件",
  "stop-flow": "停止流程",
  "restart-flow": "重新开始",
  "clone-spawn": "创建副本",
  "clone-remove": "删除副本",
  "move-steps": "向前移动",
  "edge-bounce": "边缘反弹",
  "change-x": "修改 X",
  "change-y": "修改 Y",
  "set-x": "设置 X",
  "set-y": "设置 Y",
  "go-to-point": "移动到坐标",
  "glide-point": "平滑移动",
  "turn-angle": "旋转角度",
  "set-heading": "设置方向",
  "face-target": "面向目标",
  "show-actor": "显示",
  "hide-actor": "隐藏",
  "speech-bubble": "气泡文字",
  "clear-speech": "清除气泡",
  "costume-switch": "切换外观",
  "visual-effect": "视觉效果",
  "size-change": "修改大小",
  "layer-shift": "调整图层",
  "flip-horizontal": "水平翻转",
  "pen-down": "开始绘制",
  "pen-up": "停止绘制",
  "pen-color": "画笔颜色",
  "pen-size": "画笔粗细",
  "fill-start": "开始填充",
  "fill-stop": "停止填充",
  "clear-drawing": "清除绘图",
  "sound-play": "播放声音",
  "sound-play-wait": "播放到结束",
  "sound-stop": "停止全部声音",
  "volume-change": "调整音量",
  "volume-set": "设置音量",
  "tempo-change": "调整速度",
  "tempo-set": "设置速度",
  "bgm-play": "播放背景音乐",
  "pointer-down": "鼠标按下？",
  "object-clicked": "对象被点击？",
  "key-held": "按键按下？",
  "pointer-over": "指针接触？",
  "number-check": "是否为数字",
  "logic-and": "并且",
  "logic-or": "或者",
  "logic-not": "非",
  "touch-screen": "支持触摸？",
  "random-range": "范围随机",
  timer: "计时器",
  "date-part": "日期值",
  "text-length": "文本长度",
  "text-letter": "文本位置",
  "text-replace": "替换文本",
  "text-case": "大小写转换",
  "rgb-hex": "RGB 转 HEX",
  "hex-channel": "HEX 通道",
  "function-call": "函数调用"
};

NODE_TEXT.ja = {
  start: "開始点",
  condition: "条件分岐",
  compare: "値を比較",
  "merge-data": "データ結合",
  script: "スクリプト",
  loop: "繰り返し実行",
  wait: "待機",
  switch: "分岐",
  text: "テキスト出力",
  image: "画像出力",
  input: "入力欄",
  trigger: "押下動作",
  layout: "レイアウトボックス",
  "ui-text": "UI テキスト",
  "ui-image": "UI 画像",
  "ui-button": "UI ボタン",
  "ui-container": "UI コンテナ",
  variable: "グローバル値",
  storage: "ローカル保存",
  constant: "固定値",
  http: "HTTPS リクエスト",
  browser: "ブラウザを開く",
  "system-info": "システム情報",
  "audio-player": "音声再生",
  "file-watcher": "ファイル監視",
  math: "数式計算",
  string: "文字列結合",
  random: "ランダム値",
  "signal-send": "メッセージ送信",
  "signal-listen": "メッセージ受信",
  "scene-start": "画面開始",
  "repeat-times": "回数繰り返し",
  forever: "ずっと繰り返す",
  "break-loop": "繰り返し終了",
  "skip-cycle": "今回をスキップ",
  "wait-until": "条件まで待機",
  "stop-flow": "流れを停止",
  "restart-flow": "最初から再実行",
  "clone-spawn": "複製を作成",
  "clone-remove": "複製を削除",
  "move-steps": "前へ移動",
  "edge-bounce": "端で跳ね返る",
  "change-x": "X を変更",
  "change-y": "Y を変更",
  "set-x": "X を指定",
  "set-y": "Y を指定",
  "go-to-point": "座標へ移動",
  "glide-point": "なめらかに移動",
  "turn-angle": "角度回転",
  "set-heading": "方向を指定",
  "face-target": "対象を見る",
  "show-actor": "表示",
  "hide-actor": "非表示",
  "speech-bubble": "吹き出し",
  "clear-speech": "吹き出しを消す",
  "costume-switch": "見た目を変更",
  "visual-effect": "効果を調整",
  "size-change": "大きさ変更",
  "layer-shift": "レイヤー移動",
  "flip-horizontal": "左右反転",
  "pen-down": "描画開始",
  "pen-up": "描画停止",
  "pen-color": "線の色",
  "pen-size": "線の太さ",
  "fill-start": "塗りつぶし開始",
  "fill-stop": "塗りつぶし停止",
  "clear-drawing": "描画を消す",
  "sound-play": "音を再生",
  "sound-play-wait": "最後まで再生",
  "sound-stop": "すべて停止",
  "volume-change": "音量変更",
  "volume-set": "音量指定",
  "tempo-change": "速さ変更",
  "tempo-set": "速さ指定",
  "bgm-play": "BGM 再生",
  "pointer-down": "マウス押下？",
  "object-clicked": "オブジェクト押下？",
  "key-held": "キー押下？",
  "pointer-over": "ポインター接触？",
  "number-check": "数値か？",
  "logic-and": "かつ",
  "logic-or": "または",
  "logic-not": "ではない",
  "touch-screen": "タッチ可能？",
  "random-range": "範囲ランダム",
  timer: "タイマー",
  "date-part": "日付値",
  "text-length": "文字列長",
  "text-letter": "文字位置",
  "text-replace": "文字置換",
  "text-case": "大文字小文字変換",
  "rgb-hex": "RGB から HEX",
  "hex-channel": "HEX チャンネル",
  "function-call": "関数呼び出し"
};

function getNodeLabel(nodeType, language, fallback) {
  return NODE_TEXT[language]?.[nodeType] || NODE_TEXT.en[nodeType] || fallback || nodeType;
}

function getGroupLabel(group, language) {
  return GROUP_TEXT[language]?.[group] || GROUP_TEXT.en[group] || group;
}

function getPreviewDeviceLabel(device, uiText) {
  if (device === "tablet") return uiText.deviceTablet;
  if (device === "mobile") return uiText.deviceMobile;
  return uiText.deviceDesktop;
}

const STARTER_TEMPLATES = {
  chat: {
    label: "간단한 대화창 로직",
    build: () => ({
      nodes: applyNodeSelectionState([
        { id: "start", type: "ixoNode", data: { label: "Start", kind: "start", category: "Core", value: "", nodeType: "start", refKey: "boot", groupLabel: "Chat" }, position: { x: 60, y: 180 } },
        { id: "inputMessage", type: "ixoNode", data: { label: "Input Field", kind: "visual", category: "Visual", value: "Type a message", nodeType: "input", refKey: "message", groupLabel: "Chat" }, position: { x: 320, y: 150 } },
        { id: "joinReply", type: "ixoNode", data: { label: "String Join", kind: "utility", category: "Utility", value: "Bot reply: {{message}}", nodeType: "string", refKey: "replyText", groupLabel: "Chat" }, position: { x: 620, y: 150 } },
        { id: "showReply", type: "ixoNode", data: { label: "Add Text", kind: "visual", category: "Visual", value: "{{replyText}}", nodeType: "text", refKey: "viewerText", groupLabel: "Chat" }, position: { x: 920, y: 150 } }
      ], []),
      edges: [
        { id: "e-chat-1", source: "start", target: "inputMessage", markerEnd: { type: MarkerType.ArrowClosed, color: "#d2f8e3" }, style: { stroke: "#8aa29a", strokeWidth: 1.4 } },
        { id: "e-chat-2", source: "inputMessage", target: "joinReply", markerEnd: { type: MarkerType.ArrowClosed, color: "#d2f8e3" }, style: { stroke: "#8aa29a", strokeWidth: 1.4 } },
        { id: "e-chat-3", source: "joinReply", target: "showReply", markerEnd: { type: MarkerType.ArrowClosed, color: "#d2f8e3" }, style: { stroke: "#8aa29a", strokeWidth: 1.4 } }
      ],
      inputValues: {},
      uiElements: normalizeUiElements([
        { id: "ui-chat-title", kind: "text", x: 36, y: 32, width: 260, height: 40, text: "Mini Chat Demo", color: "#eefaf4", fontSize: 24, background: "transparent", radius: 0, align: "left", bindingKey: "", actionType: "none", actionValue: "" },
        { id: "ui-chat-bubble", kind: "container", x: 36, y: 90, width: 360, height: 160, text: "{{replyText}}", bindingKey: "replyText", color: "#dcf7e8", background: "rgba(62, 207, 142, 0.10)", fontSize: 16, radius: 18, align: "left", actionType: "none", actionValue: "" }
      ]),
      nodeCounter: 10,
      viewMode: "viewer"
    })
  },
  score: {
    label: "점수 계산기",
    build: () => ({
      nodes: applyNodeSelectionState([
        { id: "start", type: "ixoNode", data: { label: "Start", kind: "start", category: "Core", value: "", nodeType: "start", refKey: "boot", groupLabel: "Score" }, position: { x: 60, y: 180 } },
        { id: "inputA", type: "ixoNode", data: { label: "Input Field", kind: "visual", category: "Visual", value: "Score A", nodeType: "input", refKey: "scoreA", groupLabel: "Score" }, position: { x: 300, y: 120 } },
        { id: "inputB", type: "ixoNode", data: { label: "Input Field", kind: "visual", category: "Visual", value: "Score B", nodeType: "input", refKey: "scoreB", groupLabel: "Score" }, position: { x: 300, y: 260 } },
        { id: "sum", type: "ixoNode", data: { label: "Math Operator", kind: "logic", category: "Logic", value: "{{scoreA}} + {{scoreB}}", nodeType: "math", refKey: "totalScore", groupLabel: "Score" }, position: { x: 620, y: 190 } },
        { id: "output", type: "ixoNode", data: { label: "Add Text", kind: "visual", category: "Visual", value: "Total: {{totalScore}}", nodeType: "text", refKey: "scoreText", groupLabel: "Score" }, position: { x: 930, y: 190 } }
      ], []),
      edges: [
        { id: "e-score-1", source: "start", target: "inputA", markerEnd: { type: MarkerType.ArrowClosed, color: "#d2f8e3" }, style: { stroke: "#8aa29a", strokeWidth: 1.4 } },
        { id: "e-score-2", source: "start", target: "inputB", markerEnd: { type: MarkerType.ArrowClosed, color: "#d2f8e3" }, style: { stroke: "#8aa29a", strokeWidth: 1.4 } },
        { id: "e-score-3", source: "inputA", target: "sum", markerEnd: { type: MarkerType.ArrowClosed, color: "#d2f8e3" }, style: { stroke: "#8aa29a", strokeWidth: 1.4 } },
        { id: "e-score-4", source: "inputB", target: "sum", markerEnd: { type: MarkerType.ArrowClosed, color: "#d2f8e3" }, style: { stroke: "#8aa29a", strokeWidth: 1.4 } },
        { id: "e-score-5", source: "sum", target: "output", markerEnd: { type: MarkerType.ArrowClosed, color: "#d2f8e3" }, style: { stroke: "#8aa29a", strokeWidth: 1.4 } }
      ],
      inputValues: {},
      uiElements: normalizeUiElements([
        { id: "ui-score-title", kind: "text", x: 40, y: 34, width: 300, height: 40, text: "Score Calculator", color: "#eefaf4", fontSize: 24, background: "transparent", radius: 0, align: "left", bindingKey: "", actionType: "none", actionValue: "" },
        { id: "ui-score-card", kind: "container", x: 40, y: 96, width: 280, height: 120, text: "Result\\n{{totalScore}}", bindingKey: "totalScore", color: "#dcf7e8", background: "rgba(62, 207, 142, 0.10)", fontSize: 22, radius: 18, align: "left", actionType: "none", actionValue: "" }
      ]),
      nodeCounter: 12,
      viewMode: "viewer"
    })
  }
};

// [노드 라이브러리] 기존 노드와 새 UI 빌더용 시각 노드를 함께 제공합니다.
const LIBRARY_TABS = {
  core: [
    { key: "start", label: "Start Node", group: "start", type: "start" },
    { key: "if-else", label: "If / Else", group: "logic", type: "condition" },
    { key: "compare", label: "Compare", group: "logic", type: "compare" },
    { key: "merge-data", label: "Merge Data", group: "logic", type: "merge-data" },
    { key: "script", label: "Script", group: "logic", type: "script" }
  ],
  pro: [
    { key: "loop", label: "Loop", group: "control", type: "loop" },
    { key: "wait", label: "Wait", group: "control", type: "wait" },
    { key: "switch", label: "Switch", group: "control", type: "switch" },
    { key: "add-text", label: "Add Text", group: "visual", type: "text" },
    { key: "add-image", label: "Add Image", group: "visual", type: "image" },
    { key: "input-field", label: "Input Field", group: "visual", type: "input" },
    { key: "button", label: "Button", group: "visual", type: "trigger" },
    { key: "layout-container", label: "Layout Container", group: "visual", type: "layout" },
    { key: "ui-text", label: "UI Text Layer", group: "visual", type: "ui-text" },
    { key: "ui-image", label: "UI Image Layer", group: "visual", type: "ui-image" },
    { key: "ui-button", label: "UI Button Layer", group: "visual", type: "ui-button" },
    { key: "ui-container", label: "UI Container", group: "visual", type: "ui-container" },
    { key: "global-variable", label: "Global Variable", group: "data", type: "variable" },
    { key: "local-storage", label: "Local Storage", group: "data", type: "storage" },
    { key: "constant", label: "Constant", group: "data", type: "constant" },
    { key: "http-request", label: "HTTPS Request", group: "network", type: "http" },
    { key: "browser-open", label: "Browser Open", group: "network", type: "browser" },
    { key: "system-info", label: "System Info", group: "system", type: "system-info" },
    { key: "audio-player", label: "Audio Player", group: "system", type: "audio-player" },
    { key: "file-watcher", label: "File Watcher", group: "system", type: "file-watcher" },
    { key: "math-operator", label: "Math Operator", group: "logic", type: "math" },
    { key: "string-join", label: "String Join", group: "utility", type: "string" },
    { key: "random", label: "Random", group: "utility", type: "random" },
    { key: "signal-send", label: "Send Message", group: "control", type: "signal-send" },
    { key: "signal-listen", label: "Receive Message", group: "control", type: "signal-listen" },
    { key: "scene-start", label: "Scene Start", group: "control", type: "scene-start" },
    { key: "repeat-times", label: "Repeat Count", group: "control", type: "repeat-times" },
    { key: "forever", label: "Repeat Always", group: "control", type: "forever" },
    { key: "break-loop", label: "End Loop", group: "control", type: "break-loop" },
    { key: "skip-cycle", label: "Skip Cycle", group: "control", type: "skip-cycle" },
    { key: "wait-until", label: "Wait Until", group: "control", type: "wait-until" },
    { key: "stop-flow", label: "Stop Flow", group: "control", type: "stop-flow" },
    { key: "restart-flow", label: "Restart Flow", group: "control", type: "restart-flow" },
    { key: "clone-spawn", label: "Create Copy", group: "control", type: "clone-spawn" },
    { key: "clone-remove", label: "Remove Copy", group: "control", type: "clone-remove" },
    { key: "move-steps", label: "Move Forward", group: "visual", type: "move-steps" },
    { key: "edge-bounce", label: "Bounce Edge", group: "visual", type: "edge-bounce" },
    { key: "change-x", label: "Change X", group: "visual", type: "change-x" },
    { key: "change-y", label: "Change Y", group: "visual", type: "change-y" },
    { key: "set-x", label: "Set X", group: "visual", type: "set-x" },
    { key: "set-y", label: "Set Y", group: "visual", type: "set-y" },
    { key: "go-to-point", label: "Go To Point", group: "visual", type: "go-to-point" },
    { key: "glide-point", label: "Glide To Point", group: "visual", type: "glide-point" },
    { key: "turn-angle", label: "Turn Angle", group: "visual", type: "turn-angle" },
    { key: "set-heading", label: "Set Heading", group: "visual", type: "set-heading" },
    { key: "face-target", label: "Face Target", group: "visual", type: "face-target" },
    { key: "show-actor", label: "Show Actor", group: "visual", type: "show-actor" },
    { key: "hide-actor", label: "Hide Actor", group: "visual", type: "hide-actor" },
    { key: "costume-switch", label: "Change Look", group: "visual", type: "costume-switch" },
    { key: "visual-effect", label: "Visual Effect", group: "visual", type: "visual-effect" },
    { key: "size-change", label: "Change Size", group: "visual", type: "size-change" },
    { key: "layer-shift", label: "Layer Move", group: "visual", type: "layer-shift" },
    { key: "flip-horizontal", label: "Flip Horizontal", group: "visual", type: "flip-horizontal" },
    { key: "pen-down", label: "Draw Start", group: "visual", type: "pen-down" },
    { key: "pen-up", label: "Draw Stop", group: "visual", type: "pen-up" },
    { key: "pen-color", label: "Stroke Color", group: "visual", type: "pen-color" },
    { key: "pen-size", label: "Stroke Size", group: "visual", type: "pen-size" },
    { key: "fill-start", label: "Fill Start", group: "visual", type: "fill-start" },
    { key: "fill-stop", label: "Fill Stop", group: "visual", type: "fill-stop" },
    { key: "clear-drawing", label: "Clear Drawing", group: "visual", type: "clear-drawing" },
    { key: "sound-play", label: "Play Sound", group: "system", type: "sound-play" },
    { key: "sound-play-wait", label: "Play Sound To End", group: "system", type: "sound-play-wait" },
    { key: "sound-stop", label: "Stop Sounds", group: "system", type: "sound-stop" },
    { key: "volume-change", label: "Change Volume", group: "system", type: "volume-change" },
    { key: "volume-set", label: "Set Volume", group: "system", type: "volume-set" },
    { key: "tempo-change", label: "Change Tempo", group: "system", type: "tempo-change" },
    { key: "tempo-set", label: "Set Tempo", group: "system", type: "tempo-set" },
    { key: "bgm-play", label: "Play BGM", group: "system", type: "bgm-play" },
    { key: "pointer-down", label: "Pointer Down?", group: "logic", type: "pointer-down" },
    { key: "object-clicked", label: "Object Pressed?", group: "logic", type: "object-clicked" },
    { key: "key-held", label: "Key Held?", group: "logic", type: "key-held" },
    { key: "pointer-over", label: "Pointer Over?", group: "logic", type: "pointer-over" },
    { key: "number-check", label: "Number Check", group: "logic", type: "number-check" },
    { key: "logic-and", label: "And", group: "logic", type: "logic-and" },
    { key: "logic-or", label: "Or", group: "logic", type: "logic-or" },
    { key: "logic-not", label: "Not", group: "logic", type: "logic-not" },
    { key: "touch-screen", label: "Touch Ready?", group: "logic", type: "touch-screen" },
    { key: "random-range", label: "Random Range", group: "utility", type: "random-range" },
    { key: "timer", label: "Timer", group: "utility", type: "timer" },
    { key: "date-part", label: "Date Part", group: "utility", type: "date-part" },
    { key: "text-length", label: "Text Length", group: "utility", type: "text-length" },
    { key: "text-letter", label: "Text Letter", group: "utility", type: "text-letter" },
    { key: "text-replace", label: "Replace Text", group: "utility", type: "text-replace" },
    { key: "text-case", label: "Text Case", group: "utility", type: "text-case" },
    { key: "rgb-hex", label: "RGB to HEX", group: "utility", type: "rgb-hex" },
    { key: "hex-channel", label: "HEX Channel", group: "utility", type: "hex-channel" }
  ]
};

// [UI Builder] 캔버스 빌더에서 드래그 앤 드롭 가능한 요소 팔레트입니다.
const UI_PALETTE = [
  { kind: "text", label: "Text" },
  { kind: "image", label: "Image" },
  { kind: "button", label: "Button" },
  { kind: "custom-button", label: "Custom Button" },
  { kind: "vector", label: "Vector" },
  { kind: "input", label: "Input" },
  { kind: "container", label: "Container" }
];

// [초기 노드] 처음 실행 시 보여줄 샘플 플로우입니다.
const initialNodes = [
  {
    id: "start",
    type: "ixoNode",
    data: {
      label: "Start",
      kind: "start",
      category: "Core",
      value: "",
      nodeType: "start",
      refKey: "boot",
      groupLabel: "Entry"
    },
    position: { x: 60, y: 180 }
  },
  {
    id: "inputName",
    type: "ixoNode",
    data: {
      label: "Input Field",
      kind: "visual",
      category: "Visual",
      value: "Enter your name",
      nodeType: "input",
      refKey: "username",
      groupLabel: "Profile"
    },
    position: { x: 320, y: 120 }
  },
  {
    id: "condition",
    type: "ixoNode",
    data: {
      label: "If / Else",
      kind: "logic",
      category: "Logic",
      value: "{{username}} == admin OR {{username}} == root",
      nodeType: "condition",
      refKey: "isAdmin",
      groupLabel: "Profile"
    },
    position: { x: 600, y: 170 }
  },
  {
    id: "join",
    type: "ixoNode",
    data: {
      label: "String Join",
      kind: "utility",
      category: "Utility",
      value: "Welcome, {{username}}!",
      nodeType: "string",
      refKey: "welcomeText",
      groupLabel: "Greeting"
    },
    position: { x: 900, y: 80 }
  },
  {
    id: "output",
    type: "ixoNode",
    data: {
      label: "Add Text",
      kind: "visual",
      category: "Visual",
      value: "{{welcomeText}}",
      nodeType: "text",
      refKey: "viewerText",
      groupLabel: "Greeting"
    },
    position: { x: 1170, y: 80 }
  }
];

const initialEdges = [
  {
    id: "e-start-input",
    source: "start",
    target: "inputName",
    markerEnd: { type: MarkerType.ArrowClosed, color: "#d2f8e3" },
    style: { stroke: "#8aa29a", strokeWidth: 1.4 }
  },
  {
    id: "e-input-cond",
    source: "inputName",
    target: "condition",
    markerEnd: { type: MarkerType.ArrowClosed, color: "#d2f8e3" },
    style: { stroke: "#8aa29a", strokeWidth: 1.4 }
  },
  {
    id: "e-cond-true",
    source: "condition",
    sourceHandle: "true",
    target: "join",
    markerEnd: { type: MarkerType.ArrowClosed, color: ACCENT },
    style: { stroke: ACCENT, strokeWidth: 1.8 }
  },
  {
    id: "e-join-out",
    source: "join",
    target: "output",
    markerEnd: { type: MarkerType.ArrowClosed, color: "#d2f8e3" },
    style: { stroke: "#8aa29a", strokeWidth: 1.4 }
  }
];

// [초기 UI] Viewer/Builder가 바로 보이도록 샘플 화면도 함께 제공합니다.
const initialUiElements = [
  {
    id: "ui-title",
    kind: "text",
    x: 48,
    y: 40,
    width: 320,
    height: 52,
    text: "Hello, {{username}}",
    bindingKey: "welcomeText",
    color: "#eaf7f0",
    background: "transparent",
    fontSize: 28,
    radius: 0,
    align: "left",
    actionType: "none",
    actionValue: ""
  },
  {
    id: "ui-subtitle",
    kind: "text",
    x: 48,
    y: 96,
    width: 420,
    height: 28,
    text: "Node runtime output is reflected here.",
    bindingKey: "",
    color: "#9fb4aa",
    background: "transparent",
    fontSize: 14,
    radius: 0,
    align: "left",
    actionType: "none",
    actionValue: ""
  },
  {
    id: "ui-cta",
    kind: "button",
    x: 48,
    y: 150,
    width: 168,
    height: 44,
    text: "Open Docs",
    bindingKey: "",
    color: "#08140e",
    background: ACCENT,
    fontSize: 15,
    radius: 14,
    align: "center",
    actionType: "open-url",
    actionValue: "https://minyangtech.n-e.kr/docs/ixo/index"
  }
];

// [상태 스냅샷] Undo/Redo에서 그대로 복구할 프로젝트 상태를 묶습니다.
const cloneState = (
  nodes,
  edges,
  inputValues,
  nodeCounter,
  uiElements,
  functions = [],
  activeFunctionId = null,
  activeScene = "main",
  assets = [],
  exportSettings = normalizeExportSettings(),
  customThemes = {}
) => ({
  nodes: JSON.parse(JSON.stringify(nodes)),
  edges: JSON.parse(JSON.stringify(edges)),
  inputValues: JSON.parse(JSON.stringify(inputValues)),
  nodeCounter,
  uiElements: JSON.parse(JSON.stringify(uiElements)),
  functions: JSON.parse(JSON.stringify(functions)),
  activeFunctionId,
  activeScene,
  assets: JSON.parse(JSON.stringify(assets)),
  exportSettings: normalizeExportSettings(exportSettings),
  customThemes: JSON.parse(JSON.stringify(customThemes || {}))
});

// [로그] 콘솔에 쌓일 로그 엔트리를 공통 포맷으로 생성합니다.
function makeLog(level, source, message, details = "") {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    time: new Date().toLocaleTimeString("ko-KR", { hour12: false }),
    level,
    source,
    message,
    details
  };
}

// [UI 요소] 저장된 UI Builder 요소를 누락 없이 안전하게 보정합니다.
function normalizeUiElements(items = []) {
  return items.map((item, index) => ({
    id: item.id || `ui-${index + 1}`,
    kind: item.kind || "text",
    x: Number(item.x ?? 48),
    y: Number(item.y ?? 48),
    width: Number(item.width ?? (item.kind === "button" || item.kind === "custom-button" ? 160 : 220)),
    height: Number(item.height ?? (item.kind === "container" ? 160 : item.kind === "image" ? 160 : item.kind === "vector" ? 90 : 44)),
    text: item.text ?? "",
    src: item.src ?? "",
    bindingKey: item.bindingKey ?? "",
    color: item.color ?? "#f3f7f4",
    background: item.background ?? (item.kind === "container" || item.kind === "custom-button" ? "rgba(62, 207, 142, 0.08)" : "transparent"),
    fontSize: Number(item.fontSize ?? 16),
    radius: Number(item.radius ?? 14),
    align: item.align ?? "left",
    actionType: item.actionType ?? "none",
    actionValue: item.actionValue ?? "",
    scene: String(item.scene || "main"),
    hidden: Boolean(item.hidden),
    cssText: String(item.cssText || ""),
    hoverCssText: String(item.hoverCssText || ""),
    pressedCssText: String(item.pressedCssText || ""),
    vectorPath: String(item.vectorPath || ""),
    vectorFill: String(item.vectorFill || ACCENT),
    linkedNodeId: item.linkedNodeId ?? ""
  }));
}

function normalizeFunctions(items = []) {
  return items.map((item, index) => ({
    id: item.id || `function-${index + 1}`,
    name: item.name || `function_${index + 1}`,
    description: String(item.description || ""),
    parameters: Array.isArray(item.parameters)
      ? item.parameters
          .map((parameter, parameterIndex) => (
            typeof parameter === "string"
              ? {
                  id: `param-${parameterIndex + 1}`,
                  name: parameter,
                  defaultValue: "",
                  description: ""
                }
              : {
                  id: parameter.id || `param-${parameterIndex + 1}`,
                  name: String(parameter.name || ""),
                  defaultValue: String(parameter.defaultValue || ""),
                  description: String(parameter.description || "")
                }
          ))
          .filter((parameter) => parameter.name)
      : [],
    returnRef: String(item.returnRef || ""),
    nodes: applyNodeSelectionState(item.nodes || [], []),
    edges: (item.edges || []).map((edge) => ({ ...edge, selected: false })),
    inputValues: item.inputValues || {},
    nodeCounter: Number(item.nodeCounter || 1)
  }));
}

function getDefaultProjectState() {
  return {
    schemaVersion: PROJECT_SCHEMA_VERSION,
    nodes: applyNodeSelectionState(initialNodes, []),
    edges: initialEdges.map((edge) => ({ ...edge, selected: false })),
    inputValues: {},
    nodeCounter: 6,
    uiElements: normalizeUiElements(initialUiElements),
    functions: [],
    activeScene: "main",
    assets: [],
    exportSettings: normalizeExportSettings(),
    customThemes: {}
  };
}

function createFunctionDefinition(index = 1) {
  const id = `function-${Date.now()}-${index}`;
  return {
    id,
    name: `function_${index}`,
    description: "",
    parameters: [],
    returnRef: "",
    nodes: [
      {
        id: `${id}-start`,
        type: "ixoNode",
        data: {
          label: "Start",
          kind: "start",
          category: "CORE",
          value: "",
          nodeType: "start",
          refKey: `${id.replace(/[^a-z0-9]/gi, "").toLowerCase()}Start`,
          groupLabel: "Function"
        },
        position: { x: 80, y: 180 }
      }
    ],
    edges: [],
    inputValues: {},
    nodeCounter: 1
  };
}

function createFunctionParameter(index = 1) {
  return {
    id: `param-${Date.now()}-${index}`,
    name: `arg${index}`,
    defaultValue: "",
    description: ""
  };
}

function migrateProjectState(input = {}) {
  const parsed = typeof input === "string" ? JSON.parse(input) : input;
  const migrated = {
    schemaVersion: Number(parsed.schemaVersion || 1),
    nodes: Array.isArray(parsed.nodes) ? parsed.nodes : [],
    edges: Array.isArray(parsed.edges) ? parsed.edges : [],
    inputValues: parsed.inputValues && typeof parsed.inputValues === "object" ? parsed.inputValues : {},
    nodeCounter: Number(parsed.nodeCounter || 1),
    uiElements: normalizeUiElements(parsed.uiElements || []),
    functions: normalizeFunctions(parsed.functions || []),
    viewMode: parsed.viewMode,
    language: parsed.language,
    themeKey: parsed.themeKey,
    previewDevice: parsed.previewDevice,
    activeScene: String(parsed.activeScene || "main"),
    assets: Array.isArray(parsed.assets) ? parsed.assets : [],
    exportSettings: normalizeExportSettings(parsed.exportSettings || {}),
    customThemes: parsed.customThemes && typeof parsed.customThemes === "object" ? parsed.customThemes : {},
    savedAt: parsed.savedAt
  };

  if (migrated.schemaVersion < 2) {
    migrated.schemaVersion = 2;
  }

  return migrated;
}

function validateProjectState(state) {
  return Boolean(
    state
    && Array.isArray(state.nodes)
    && Array.isArray(state.edges)
    && Array.isArray(state.uiElements)
    && Array.isArray(state.functions)
    && Number.isFinite(state.nodeCounter)
  );
}

function parseStoredProject(raw) {
  try {
    const migrated = migrateProjectState(raw);
    return validateProjectState(migrated) ? { ok: true, data: migrated } : { ok: false, error: "Invalid project shape." };
  } catch (error) {
    return { ok: false, error: String(error.message || error) };
  }
}

function getAssetExtension(name = "") {
  const match = String(name).toLowerCase().match(/\.([a-z0-9]+)$/);
  return match ? match[1] : "";
}

function isImageAsset(asset) {
  const extension = getAssetExtension(asset?.name);
  return String(asset?.type || "").startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(extension);
}

function isIxoProjectAsset(asset) {
  return getAssetExtension(asset?.name) === "ixo";
}

function getAssetKindLabel(asset) {
  if (isImageAsset(asset)) return "Image UI";
  if (isIxoProjectAsset(asset)) return "IXO Project";
  if (String(asset?.type || "").startsWith("audio/")) return "Sound";
  return "Asset";
}

function decodeDataUrlText(dataUrl = "") {
  const source = String(dataUrl || "");
  const commaIndex = source.indexOf(",");
  if (!source.startsWith("data:") || commaIndex < 0) return source;
  const meta = source.slice(0, commaIndex);
  const body = source.slice(commaIndex + 1);
  if (meta.includes(";base64")) {
    return decodeURIComponent(escape(window.atob(body)));
  }
  return decodeURIComponent(body);
}

function applyNodeSelectionState(nodes, selectedIds) {
  const selectedSet = new Set(selectedIds);
  return nodes.map((node) => ({ ...node, selected: selectedSet.has(node.id) }));
}

function hasPersistentNodeChange(changes = []) {
  return changes.some((change) => ["position", "remove", "add", "reset"].includes(change.type));
}

function hasPersistentEdgeChange(changes = []) {
  return changes.some((change) => ["remove", "add", "reset"].includes(change.type));
}

// [UI 요소 생성] Canvas Builder에서 새 요소를 추가할 때 기본값을 제공합니다.
function createUiElement(kind, bindingKey = "", accentColor = ACCENT) {
  const id = `ui-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const common = {
    scene: "main",
    hidden: false,
    cssText: "",
    hoverCssText: "",
    pressedCssText: "",
    vectorPath: "",
    vectorFill: accentColor
  };
  if (kind === "image") {
    return {
      ...common,
      id,
      kind,
      x: 72,
      y: 72,
      width: 220,
      height: 160,
      text: "",
      src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
      bindingKey,
      color: "#ffffff",
      background: "#101713",
      fontSize: 14,
      radius: 18,
      align: "center",
      actionType: "none",
      actionValue: "",
      linkedNodeId: ""
    };
  }

  if (kind === "button") {
    return {
      ...common,
      id,
      kind,
      x: 72,
      y: 72,
      width: 160,
      height: 46,
      text: "Action",
      src: "",
      bindingKey,
      color: "#08140e",
      background: accentColor,
      fontSize: 15,
      radius: 14,
      align: "center",
      actionType: "open-url",
      actionValue: "https://minyangtech.n-e.kr/docs/ixo/index",
      linkedNodeId: ""
    };
  }

  if (kind === "custom-button") {
    return {
      ...common,
      id,
      kind,
      x: 72,
      y: 72,
      width: 190,
      height: 58,
      text: "Custom Action",
      src: "",
      bindingKey,
      color: "#08140e",
      background: accentColor,
      fontSize: 15,
      radius: 18,
      align: "center",
      actionType: "run-function",
      actionValue: "",
      vectorPath: "M12 8 H178 Q186 8 186 16 V42 Q186 50 178 50 H12 Q4 50 4 42 V16 Q4 8 12 8 Z",
      vectorFill: accentColor,
      linkedNodeId: ""
    };
  }

  if (kind === "vector") {
    return {
      ...common,
      id,
      kind,
      x: 72,
      y: 72,
      width: 120,
      height: 120,
      text: "",
      src: "",
      bindingKey,
      color: "#f3f7f4",
      background: "transparent",
      fontSize: 14,
      radius: 0,
      align: "center",
      actionType: "none",
      actionValue: "",
      vectorPath: "M60 8 L112 112 H8 Z",
      vectorFill: accentColor,
      linkedNodeId: ""
    };
  }

  if (kind === "input") {
    return {
      ...common,
      id,
      kind,
      x: 72,
      y: 72,
      width: 260,
      height: 48,
      text: "Enter text",
      src: "",
      bindingKey,
      color: "#f3f7f4",
      background: "rgba(4, 12, 9, 0.72)",
      fontSize: 15,
      radius: 14,
      align: "left",
      actionType: "none",
      actionValue: "",
      linkedNodeId: ""
    };
  }

  if (kind === "container") {
    return {
      ...common,
      id,
      kind,
      x: 72,
      y: 72,
      width: 280,
      height: 160,
      text: "Panel",
      src: "",
      bindingKey,
      color: "#d9f4e4",
      background: "rgba(62, 207, 142, 0.10)",
      fontSize: 16,
      radius: 18,
      align: "left",
      actionType: "none",
      actionValue: "",
      linkedNodeId: ""
    };
  }

  return {
    ...common,
    id,
    kind: "text",
    x: 72,
    y: 72,
    width: 220,
    height: 48,
    text: "New text",
    src: "",
    bindingKey,
    color: "#f3f7f4",
    background: "transparent",
    fontSize: 22,
    radius: 0,
    align: "left",
    actionType: "none",
    actionValue: "",
    linkedNodeId: ""
  };
}

function getUiNodeDefinition(kind) {
  if (kind === "image") return { label: "Add Image", group: "visual", type: "image" };
  if (kind === "button" || kind === "custom-button") return { label: "Button", group: "visual", type: "trigger" };
  if (kind === "input") return { label: "Input Field", group: "visual", type: "input" };
  if (kind === "container" || kind === "vector") return { label: "Layout Container", group: "visual", type: "layout" };
  return { label: "Add Text", group: "visual", type: "text" };
}

function getUiNodeTypeFromKind(kind) {
  return getUiNodeDefinition(kind).type;
}

function getUiKindFromNodeType(nodeType) {
  if (nodeType === "image") return "image";
  if (nodeType === "trigger") return "button";
  if (nodeType === "input") return "input";
  if (nodeType === "layout") return "container";
  if (nodeType === "text") return "text";
  return "";
}

function isUiLinkedNodeType(nodeType) {
  return Boolean(getUiKindFromNodeType(nodeType));
}

function getUiNodeValue(element) {
  return element.kind === "image" ? element.src : element.text;
}

function getUiNodePatch(element) {
  const definition = getUiNodeDefinition(element.kind);
  return {
    label: definition.label,
    kind: definition.group,
    category: definition.group.toUpperCase(),
    nodeType: definition.type,
    value: getUiNodeValue(element),
    linkedUiElementId: element.id
  };
}

function createUiElementFromNode(node, index = 0, accentColor = ACCENT) {
  const kind = getUiKindFromNodeType(node.data?.nodeType);
  const base = createUiElement(kind || "text", node.data?.refKey || "", accentColor);
  const columnOffset = (index % 3) * 28;
  const rowOffset = Math.floor(index / 3) * 28;

  return {
    ...base,
    x: base.x + columnOffset,
    y: base.y + rowOffset,
    text: kind === "image" ? base.text : String(node.data?.value || base.text),
    src: kind === "image" ? String(node.data?.value || base.src) : base.src,
    bindingKey: node.data?.refKey || "",
    linkedNodeId: node.id
  };
}

function getUiNodeMatchScore(element, node) {
  if (getUiNodeTypeFromKind(element.kind) !== node.data?.nodeType) return -1;

  let score = 1;
  if (element.bindingKey && element.bindingKey === node.data?.refKey) score += 4;
  if (getUiNodeValue(element) && getUiNodeValue(element) === node.data?.value) score += 2;
  return score;
}

// [템플릿] 노드 값이나 UI 텍스트에서 {{refKey}} 문법을 치환합니다.
function applyTemplate(text, context) {
  return String(text || "").replace(/\{\{\s*([^}]+)\s*\}\}/g, (_, key) => String(context[key.trim()] ?? ""));
}

function normalizeClientHostname(hostname) {
  return String(hostname || "").replace(/^\[|\]$/g, "").toLowerCase();
}

function isPrivateClientIpv4(address) {
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

function isPrivateClientIpv6(address) {
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
  );
}

function isBlockedClientHostname(hostname) {
  const normalized = normalizeClientHostname(hostname);
  return (
    !normalized
    || normalized === "localhost"
    || normalized.endsWith(".localhost")
    || normalized.endsWith(".local")
    || isPrivateClientIpv4(normalized)
    || isPrivateClientIpv6(normalized)
  );
}

function validateClientHttpsUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(String(rawUrl || "").trim());
  } catch {
    return { ok: false, error: "Invalid URL." };
  }

  if (parsed.protocol !== "https:") {
    return { ok: false, error: "Only HTTPS URLs are allowed." };
  }

  if (isBlockedClientHostname(parsed.hostname)) {
    return { ok: false, error: "Local or private network hosts are blocked." };
  }

  return {
    ok: true,
    url: parsed.toString(),
    parsed
  };
}

function maskUrlForLog(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    return `${parsed.origin}${parsed.pathname}${parsed.search ? "?[redacted]" : ""}`;
  } catch {
    return "[invalid url]";
  }
}

async function fetchWithTimeout(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      credentials: "omit",
      redirect: "error",
      signal: controller.signal
    });
  } finally {
    window.clearTimeout(timer);
  }
}

// [조건 비교] 간단한 비교식을 파싱해 Boolean 결과를 반환합니다.
function compareExpression(expression) {
  const match = expression.match(/^(.+?)\s*(==|!=|>=|<=|>|<)\s*(.+)$/);
  if (!match) {
    return Boolean(String(expression || "").trim());
  }

  const [, leftRaw, op, rightRaw] = match;
  const cast = (raw) => {
    const stripped = String(raw).trim().replace(/^['"]|['"]$/g, "");
    const numeric = Number(stripped);
    return Number.isNaN(numeric) ? stripped : numeric;
  };

  const left = cast(leftRaw);
  const right = cast(rightRaw);

  if (op === "==") return left == right;
  if (op === "!=") return left != right;
  if (op === ">") return left > right;
  if (op === "<") return left < right;
  if (op === ">=") return left >= right;
  if (op === "<=") return left <= right;
  return false;
}

// [조건 체인] AND / OR 체인을 순차적으로 계산합니다.
function evaluateConditionChain(expression, context) {
  const rendered = applyTemplate(expression || "", context);
  const orParts = rendered.split(/\s+OR\s+/i).map((part) => part.trim()).filter(Boolean);
  return orParts.some((orPart) =>
    orPart
      .split(/\s+AND\s+/i)
      .map((part) => part.trim())
      .filter(Boolean)
      .every((andPart) => compareExpression(andPart))
  );
}

// [그래프 순서] 현재 노드 그래프에서 실행 순서를 만들기 위한 위상 정렬입니다.
function topoOrder(nodes, edges) {
  const indegree = {};
  const outgoing = {};

  nodes.forEach((node) => {
    indegree[node.id] = 0;
    outgoing[node.id] = [];
  });

  edges.forEach((edge) => {
    indegree[edge.target] = (indegree[edge.target] || 0) + 1;
    outgoing[edge.source] = [...(outgoing[edge.source] || []), edge];
  });

  const queue = Object.keys(indegree).filter((id) => indegree[id] === 0);
  const ordered = [];

  while (queue.length) {
    const current = queue.shift();
    ordered.push(current);

    for (const edge of outgoing[current] || []) {
      indegree[edge.target] -= 1;
      if (indegree[edge.target] === 0) {
        queue.push(edge.target);
      }
    }
  }

  if (ordered.length !== nodes.length) {
    ordered.push(...nodes.map((node) => node.id).filter((id) => !ordered.includes(id)));
  }

  return ordered;
}

// [노드 기본값] 새 노드를 추가할 때 타입별 기본 value를 제공합니다.
function getDefaultNodeValue(nodeType, label) {
  const map = {
    input: "Type here",
    text: "Rendered text",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    trigger: "Click me",
    layout: "Layout container",
    condition: "{{value}} == true",
    compare: "{{a}} == {{b}}",
    "merge-data": "{{left}} {{right}}",
    script: "return context.username || 'guest';",
    switch: "A",
    wait: "500",
    loop: "3",
    math: "12 + 8",
    string: "Hello, {{username}}",
    variable: "{{username}}",
    storage: "session.user",
    constant: "CONSTANT_VALUE",
    http: "https://minyangtech.n-e.kr/docs/ixo/index",
    browser: "https://minyangtech.n-e.kr/docs/ixo/index",
    random: "100",
    "system-info": "Engine runtime ready",
    "audio-player": "sound.mp3",
    "file-watcher": ".",
    "signal-send": "game-ready",
    "signal-listen": "game-ready",
    "scene-start": "main",
    "repeat-times": "10",
    forever: "running",
    "break-loop": "break",
    "skip-cycle": "continue",
    "wait-until": "{{ready}} == true",
    "stop-flow": "stop",
    "restart-flow": "restart",
    "clone-spawn": "actor",
    "clone-remove": "clone",
    "move-steps": "10",
    "edge-bounce": "bounce",
    "change-x": "10",
    "change-y": "10",
    "set-x": "0",
    "set-y": "0",
    "go-to-point": "x: 0, y: 0",
    "glide-point": "1s to x: 0, y: 0",
    "turn-angle": "15",
    "set-heading": "90",
    "face-target": "pointer",
    "show-actor": "visible",
    "hide-actor": "hidden",
    "speech-bubble": "Hello!",
    "clear-speech": "clear",
    "costume-switch": "next-look",
    "visual-effect": "brightness 10",
    "size-change": "10",
    "layer-shift": "front",
    "flip-horizontal": "horizontal",
    "pen-down": "down",
    "pen-up": "up",
    "pen-color": "#3ecf8e",
    "pen-size": "4",
    "fill-start": "#3ecf8e",
    "fill-stop": "fill-end",
    "clear-drawing": "clear",
    "sound-play": "",
    "sound-play-wait": "",
    "sound-stop": "all",
    "volume-change": "10",
    "volume-set": "80",
    "tempo-change": "0.1",
    "tempo-set": "1",
    "bgm-play": "",
    "pointer-down": "false",
    "object-clicked": "false",
    "key-held": "space",
    "pointer-over": "false",
    "number-check": "{{value}} is number",
    "logic-and": "{{left}} AND {{right}}",
    "logic-or": "{{left}} OR {{right}}",
    "logic-not": "{{value}}",
    "touch-screen": "false",
    "random-range": "1..10",
    timer: "seconds",
    "date-part": "year",
    "text-length": "{{text}}",
    "text-letter": "1 of {{text}}",
    "text-replace": "{{text}} | find | replace",
    "text-case": "upper {{text}}",
    "rgb-hex": "255, 0, 0",
    "hex-channel": "#ff0000 R",
    "function-call": label || "Function",
    "ui-text": "UI Text Binding",
    "ui-image": "UI Image Binding",
    "ui-button": "UI Button Binding",
    "ui-container": "UI Container Binding"
  };

  return map[nodeType] ?? label;
}

// [런타임] 노드 그래프를 실제로 계산하고 실행 하이라이트 및 로그 이벤트를 생성합니다.
function runPipeline(
  nodes,
  edges,
  inputValues,
  paused,
  allowScripts = false,
  interactionState = {},
  functionDefinitions = [],
  seedContext = {},
  callDepth = 0
) {
  const nodeMap = Object.fromEntries(nodes.map((node) => [node.id, node]));
  const outgoing = {};
  const context = { ...seedContext };
  const outputTexts = [];
  const outputImages = [];
  const outputSounds = [];
  const activeEdgeIds = [];
  const activeNodeIds = [];
  const liveValues = {};
  const events = [];
  const runtimeState = createRuntimeState();

  nodes.forEach((node) => {
    outgoing[node.id] = [];
  });

  edges.forEach((edge) => {
    outgoing[edge.source] = [...(outgoing[edge.source] || []), edge];
  });

  const topo = topoOrder(nodes, edges);

  topo.forEach((nodeId) => {
    const node = nodeMap[nodeId];
    if (!node) return;

    const incoming = edges.filter((edge) => edge.target === nodeId);
    const isActive = incoming.length === 0 ? true : incoming.some((edge) => activeEdgeIds.includes(edge.id));
    if (!isActive) return;

    activeNodeIds.push(nodeId);

    const type = node.data?.nodeType || "";
    const value = node.data?.value || "";
    const key = node.data?.refKey || node.id;
    let produced = "";

    if (type === "input") {
      produced = inputValues[node.id] ?? "";
    } else if (type === "string" || type === "text" || type === "layout" || type.startsWith("ui-")) {
      produced = applyTemplate(value, context);
    } else if (type === "math") {
      const rendered = applyTemplate(value, context);
      const calc = rendered.match(/^(-?\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(-?\d+(?:\.\d+)?)$/);
      if (calc) {
        const left = Number(calc[1]);
        const right = Number(calc[3]);
        const operator = calc[2];
        produced = operator === "+" ? left + right : operator === "-" ? left - right : operator === "*" ? left * right : right === 0 ? 0 : left / right;
      } else {
        produced = rendered;
      }
    } else if (type === "script") {
      const restrictedResult = tryRunRestrictedScript(value, context, inputValues);
      if (restrictedResult.ok) {
        produced = typeof restrictedResult.value === "undefined" ? "" : restrictedResult.value;
        events.push(makeLog("info", node.data?.label || "Script", `제한 실행 모드로 스크립트가 실행되었습니다. 결과: ${String(produced)}`));
      } else if (!allowScripts) {
        produced = "";
        events.push(makeLog("info", node.data?.label || "Script", "제한 실행 모드에서 허용되지 않는 구문이 있어 전체 JavaScript 승인 전까지 차단되었습니다."));
      } else {
        try {
          // [스크립트 노드] 제한 모드를 벗어난 코드는 별도 승인 후에만 전체 JavaScript로 실행합니다.
          // eslint-disable-next-line no-new-func
          const fn = new Function("context", "inputValues", String(value || "return context;"));
          const result = fn(context, inputValues);
          produced = typeof result === "undefined" ? "" : result;
          events.push(makeLog("info", node.data?.label || "Script", `전체 JavaScript 모드로 스크립트가 실행되었습니다. 결과: ${String(produced)}`));
        } catch (error) {
          produced = `Script Error: ${error.message}`;
          events.push(makeLog("error", node.data?.label || "Script", produced));
        }
      }
    } else if (type === "condition") {
      const pass = evaluateConditionChain(value, context);
      produced = pass ? "true" : "false";
      events.push(makeLog("trace", node.data?.label || "Condition", `조건 분기 결과: ${produced}`));
    } else if (type === "compare") {
      produced = boolText(evaluateConditionChain(value, context));
    } else if (type === "merge-data" || type === "constant" || type === "variable") {
      produced = applyTemplate(value, context);
    } else if (type === "storage") {
      const rendered = applyTemplate(value, context);
      const assignment = rendered.match(/^([^=]+)=(.*)$/);
      try {
        if (assignment) {
          const storageKey = assignment[1].trim();
          const storageValue = assignment[2].trim();
          window.localStorage?.setItem(storageKey, storageValue);
          produced = storageValue;
        } else {
          produced = window.localStorage?.getItem(rendered.trim()) ?? "";
        }
      } catch {
        produced = "";
      }
    } else if (type === "random") {
      produced = Math.floor(Math.random() * ((Number(applyTemplate(value, context)) || 100)));
    } else if (type === "image" || type === "video-player") {
      produced = applyTemplate(value, context);
      outputImages.push({ id: node.id, src: String(produced), label: node.data?.label || "Image" });
    } else if (type === "sound-play" || type === "sound-play-wait" || type === "bgm-play" || type === "audio-player") {
      produced = applyTemplate(value, context);
      if (produced) {
        outputSounds.push({ id: node.id, src: String(produced), label: node.data?.label || "Sound" });
        runtimeState.audio.activeSounds.push({
          id: node.id,
          src: String(produced),
          waitForEnd: type === "sound-play-wait",
          background: type === "bgm-play"
        });
      }
    } else if (type === "system-info") {
      produced = navigator.userAgent;
      outputTexts.push({ id: node.id, text: String(produced), label: node.data?.label || "System Info" });
    } else if (type === "loop" || type === "repeat-times") {
      produced = Math.max(0, Math.floor(toFiniteNumber(applyTemplate(value, context), type === "loop" ? 1 : 0)));
      events.push(makeLog("trace", node.data?.label || "Loop", `반복 횟수: ${produced}`));
    } else if (type === "wait") {
      produced = Math.max(0, toFiniteNumber(applyTemplate(value, context), 0));
      events.push(makeLog("trace", node.data?.label || "Wait", `대기 시간: ${produced}ms`));
    } else if (type === "signal-send") {
      produced = applyTemplate(value, context);
      runtimeState.signals.add(String(produced));
    } else if (type === "signal-listen") {
      produced = boolText(runtimeState.signals.has(String(applyTemplate(value, context))));
    } else if (type === "scene-start") {
      produced = boolText(String(applyTemplate(value, context) || "main") === runtimeState.scene.currentScene);
    } else if (type === "forever") {
      produced = "true";
    } else if (type === "break-loop") {
      runtimeState.control.breakRequested = true;
      produced = "break";
    } else if (type === "skip-cycle") {
      runtimeState.control.skipRequested = true;
      produced = "continue";
    } else if (type === "wait-until") {
      produced = boolText(evaluateConditionChain(value, context));
    } else if (type === "stop-flow") {
      runtimeState.control.stopRequested = true;
      produced = "stop";
    } else if (type === "restart-flow") {
      runtimeState.control.restartRequested = true;
      produced = "restart";
    } else if (type === "clone-spawn") {
      produced = applyTemplate(value, context) || "actor";
      runtimeState.scene.clones.push({
        id: `${produced}-${runtimeState.scene.clones.length + 1}`,
        source: produced
      });
    } else if (type === "clone-remove") {
      const target = String(applyTemplate(value, context));
      const index = runtimeState.scene.clones.findIndex((clone) => clone.id === target || clone.source === target);
      if (index >= 0) {
        runtimeState.scene.clones.splice(index, 1);
      }
      produced = target;
    } else if (type === "move-steps") {
      const actor = getDefaultActor(runtimeState);
      const distance = toFiniteNumber(applyTemplate(value, context), 0);
      const radians = (actor.heading * Math.PI) / 180;
      actor.x += Math.cos(radians) * distance;
      actor.y += Math.sin(radians) * distance;
      produced = `${Math.round(actor.x)},${Math.round(actor.y)}`;
    } else if (type === "edge-bounce") {
      const actor = getDefaultActor(runtimeState);
      const bounced = actor.x < 0 || actor.y < 0 || actor.x > 100 || actor.y > 100;
      if (bounced) actor.heading = (actor.heading + 180) % 360;
      actor.x = Math.max(0, Math.min(100, actor.x));
      actor.y = Math.max(0, Math.min(100, actor.y));
      produced = boolText(bounced);
    } else if (type === "change-x") {
      const actor = getDefaultActor(runtimeState);
      actor.x += toFiniteNumber(applyTemplate(value, context), 0);
      produced = actor.x;
    } else if (type === "change-y") {
      const actor = getDefaultActor(runtimeState);
      actor.y += toFiniteNumber(applyTemplate(value, context), 0);
      produced = actor.y;
    } else if (type === "set-x") {
      const actor = getDefaultActor(runtimeState);
      actor.x = toFiniteNumber(applyTemplate(value, context), actor.x);
      produced = actor.x;
    } else if (type === "set-y") {
      const actor = getDefaultActor(runtimeState);
      actor.y = toFiniteNumber(applyTemplate(value, context), actor.y);
      produced = actor.y;
    } else if (type === "go-to-point" || type === "glide-point") {
      const actor = getDefaultActor(runtimeState);
      const point = parsePointValue(applyTemplate(value, context), actor);
      actor.x = point.x;
      actor.y = point.y;
      produced = `${actor.x},${actor.y}`;
    } else if (type === "turn-angle") {
      const actor = getDefaultActor(runtimeState);
      actor.heading = (actor.heading + toFiniteNumber(applyTemplate(value, context), 0)) % 360;
      produced = actor.heading;
    } else if (type === "set-heading") {
      const actor = getDefaultActor(runtimeState);
      actor.heading = toFiniteNumber(applyTemplate(value, context), actor.heading) % 360;
      produced = actor.heading;
    } else if (type === "face-target") {
      const actor = getDefaultActor(runtimeState);
      if (String(value).toLowerCase().includes("pointer")) {
        const pointerX = toFiniteNumber(interactionState.pointerX, actor.x);
        const pointerY = toFiniteNumber(interactionState.pointerY, actor.y);
        actor.heading = (Math.atan2(pointerY - actor.y, pointerX - actor.x) * 180) / Math.PI;
      }
      produced = actor.heading;
    } else if (type === "show-actor") {
      const actor = getDefaultActor(runtimeState);
      actor.visible = true;
      produced = "visible";
    } else if (type === "hide-actor") {
      const actor = getDefaultActor(runtimeState);
      actor.visible = false;
      produced = "hidden";
    } else if (type === "speech-bubble") {
      const actor = getDefaultActor(runtimeState);
      actor.speech = applyTemplate(value, context);
      produced = actor.speech;
    } else if (type === "clear-speech") {
      const actor = getDefaultActor(runtimeState);
      actor.speech = "";
      produced = "";
    } else if (type === "costume-switch") {
      const actor = getDefaultActor(runtimeState);
      actor.costume = applyTemplate(value, context) || "default";
      produced = actor.costume;
    } else if (type === "visual-effect") {
      const actor = getDefaultActor(runtimeState);
      const [effect = "brightness", amount = "0"] = String(applyTemplate(value, context)).split(/\s+/);
      actor.effects[effect] = toFiniteNumber(amount, 0);
      produced = `${effect}:${actor.effects[effect]}`;
    } else if (type === "size-change") {
      const actor = getDefaultActor(runtimeState);
      actor.size += toFiniteNumber(applyTemplate(value, context), 0);
      produced = actor.size;
    } else if (type === "layer-shift") {
      const actor = getDefaultActor(runtimeState);
      const rendered = String(applyTemplate(value, context)).toLowerCase();
      actor.layer += rendered.includes("back") ? -1 : 1;
      produced = actor.layer;
    } else if (type === "flip-horizontal") {
      const actor = getDefaultActor(runtimeState);
      actor.flipped = !actor.flipped;
      produced = boolText(actor.flipped);
    } else if (type === "pen-down") {
      runtimeState.pen.down = true;
      produced = "down";
    } else if (type === "pen-up") {
      runtimeState.pen.down = false;
      produced = "up";
    } else if (type === "pen-color") {
      runtimeState.pen.color = normalizeHexColor(applyTemplate(value, context));
      produced = runtimeState.pen.color;
    } else if (type === "pen-size") {
      runtimeState.pen.size = Math.max(1, toFiniteNumber(applyTemplate(value, context), runtimeState.pen.size));
      produced = runtimeState.pen.size;
    } else if (type === "fill-start") {
      runtimeState.pen.fill = normalizeHexColor(applyTemplate(value, context));
      produced = runtimeState.pen.fill;
    } else if (type === "fill-stop") {
      runtimeState.pen.fill = null;
      produced = "fill-end";
    } else if (type === "clear-drawing") {
      runtimeState.pen.strokes = [];
      produced = "clear";
    } else if (type === "sound-stop") {
      runtimeState.audio.activeSounds = [];
      produced = "all";
    } else if (type === "volume-change") {
      runtimeState.audio.volume = Math.max(0, Math.min(100, runtimeState.audio.volume + toFiniteNumber(applyTemplate(value, context), 0)));
      produced = runtimeState.audio.volume;
    } else if (type === "volume-set") {
      runtimeState.audio.volume = Math.max(0, Math.min(100, toFiniteNumber(applyTemplate(value, context), runtimeState.audio.volume)));
      produced = runtimeState.audio.volume;
    } else if (type === "tempo-change") {
      runtimeState.audio.tempo = Math.max(0.1, runtimeState.audio.tempo + toFiniteNumber(applyTemplate(value, context), 0));
      produced = runtimeState.audio.tempo;
    } else if (type === "tempo-set") {
      runtimeState.audio.tempo = Math.max(0.1, toFiniteNumber(applyTemplate(value, context), runtimeState.audio.tempo));
      produced = runtimeState.audio.tempo;
    } else if (type === "pointer-down") {
      produced = boolText(Boolean(interactionState.pointerDown));
    } else if (type === "trigger") {
      produced = boolText((interactionState.clickedIds || []).length > 0);
    } else if (type === "object-clicked") {
      produced = boolText((interactionState.clickedIds || []).includes(String(applyTemplate(value, context))));
    } else if (type === "key-held") {
      produced = boolText((interactionState.keysDown || []).includes(String(applyTemplate(value, context)).toLowerCase()));
    } else if (type === "pointer-over") {
      produced = boolText(interactionState.pointerOverId === String(applyTemplate(value, context)));
    } else if (type === "number-check") {
      const rendered = applyTemplate(value, context).replace(/\s+is\s+number$/i, "");
      produced = boolText(rendered.trim() !== "" && !Number.isNaN(Number(rendered)));
    } else if (type === "logic-and") {
      const [left = "", right = ""] = applyTemplate(value, context).split(/\s+AND\s+/i);
      produced = boolText(asBoolean(left) && asBoolean(right));
    } else if (type === "logic-or") {
      const [left = "", right = ""] = applyTemplate(value, context).split(/\s+OR\s+/i);
      produced = boolText(asBoolean(left) || asBoolean(right));
    } else if (type === "logic-not") {
      produced = boolText(!asBoolean(applyTemplate(value, context)));
    } else if (type === "touch-screen") {
      produced = boolText((navigator.maxTouchPoints || 0) > 0);
    } else if (type === "random-range") {
      const [min, max] = String(applyTemplate(value, context)).split("..").map((item) => Number(item.trim()));
      produced = Math.floor((Number.isFinite(min) ? min : 1) + Math.random() * ((Number.isFinite(max) ? max : 10) - (Number.isFinite(min) ? min : 1) + 1));
    } else if (type === "timer") {
      produced = String(Math.round(performance.now() / 1000));
    } else if (type === "date-part") {
      const part = String(value || "year").toLowerCase();
      const now = new Date();
      produced = part.includes("month") ? now.getMonth() + 1 : part.includes("day") ? now.getDate() : part.includes("hour") ? now.getHours() : now.getFullYear();
    } else if (type === "text-length") {
      produced = String(applyTemplate(value, context)).length;
    } else if (type === "text-letter") {
      produced = letterFromExpression(applyTemplate(value, context));
    } else if (type === "text-replace") {
      produced = replaceTextExpression(applyTemplate(value, context));
    } else if (type === "text-case") {
      produced = transformCaseExpression(applyTemplate(value, context));
    } else if (type === "rgb-hex") {
      const channels = String(applyTemplate(value, context)).match(/\d+/g)?.slice(0, 3).map((item) => Math.max(0, Math.min(255, Number(item)))) || [255, 0, 0];
      produced = `#${channels.map((item) => item.toString(16).padStart(2, "0")).join("")}`;
    } else if (type === "hex-channel") {
      produced = getHexChannel(applyTemplate(value, context));
    } else if (type === "file-watcher") {
      const watchPath = applyTemplate(value, context);
      const watchEvent = interactionState.fileWatchEvents?.[watchPath];
      produced = watchEvent ? `${watchEvent.eventType}:${watchEvent.filename || ""}` : "";
    } else if (type === "function-call") {
      const functionId = node.data?.functionId;
      const definition = functionDefinitions.find((item) => item.id === functionId);
      if (!definition) {
        produced = "";
        events.push(makeLog("error", node.data?.label || "Function Call", "연결된 함수를 찾지 못했습니다."));
      } else if (callDepth >= 24) {
        produced = "";
        events.push(makeLog("error", node.data?.label || "Function Call", "재귀 호출 한도(24)를 초과했습니다."));
      } else {
        const parameterContext = Object.fromEntries(
          (definition.parameters || []).map((parameter) => [
            parameter.name,
            applyTemplate(
              node.data?.functionArgs?.[parameter.id]
                ?? node.data?.functionArgs?.[parameter.name]
                ?? parameter.defaultValue
                ?? "",
              context
            )
          ])
        );
        const nested = runPipeline(
          definition.nodes,
          definition.edges,
          definition.inputValues || {},
          paused,
          allowScripts,
          interactionState,
          functionDefinitions,
          {
            ...context,
            ...parameterContext
          },
          callDepth + 1
        );
        produced = definition.returnRef
          ? nested.context[definition.returnRef] ?? ""
          : nested.liveValues[nested.focusedNodeId] ?? "";
        events.push(...nested.events);
      }
    } else if (type === "particle" || type === "switch" || type === "browser" || type === "http") {
      produced = applyTemplate(value, context);
    } else {
      produced = applyTemplate(value, context);
    }

    if (type === "text" || type === "layout" || type === "ui-text" || type === "ui-button" || type === "ui-container") {
      outputTexts.push({ id: node.id, text: String(produced || node.data?.label || ""), label: node.data?.label || "Text" });
    }

    context[key] = produced;
    liveValues[nodeId] = String(produced ?? "");

    if (paused) return;

    if (type === "condition") {
      const pass = String(produced) === "true";
      (outgoing[nodeId] || []).forEach((edge) => {
        if ((pass && edge.sourceHandle === "true") || (!pass && edge.sourceHandle === "false")) {
          activeEdgeIds.push(edge.id);
        }
      });
      return;
    }

    if (type === "switch") {
      (outgoing[nodeId] || []).forEach((edge) => {
        if (!edge.sourceHandle || edge.sourceHandle === String(produced)) {
          activeEdgeIds.push(edge.id);
        }
      });
      return;
    }

    if (
      (type === "signal-listen" || type === "scene-start" || type === "wait-until") &&
      String(produced) !== "true"
    ) {
      return;
    }

    if (type === "stop-flow") {
      return;
    }

    (outgoing[nodeId] || []).forEach((edge) => activeEdgeIds.push(edge.id));
  });

  return {
    context,
    outputTexts,
    outputImages,
    outputSounds,
    activeEdgeIds,
    activeNodeIds,
    focusedNodeId: activeNodeIds[activeNodeIds.length - 1] || null,
    topo,
    liveValues,
    events,
    runtimeState
  };
}

// [UI 바인딩] Builder 요소가 연결된 refKey 또는 템플릿 값을 실제 런타임 값으로 변환합니다.
function resolveUiValue(element, runtime, field) {
  const sourceValue = field === "src" ? element.src : element.text;
  const boundValue = element.bindingKey ? runtime.context[element.bindingKey] : undefined;
  if (typeof boundValue !== "undefined" && boundValue !== "") {
    return String(boundValue);
  }
  return applyTemplate(sourceValue || "", runtime.context);
}

// [UI 컴포넌트] 런타임/빌더 화면에서 공통으로 쓰는 요소 렌더러입니다.
const BuilderElement = memo(function BuilderElement({
  element,
  runtime,
  editable,
  allowAction,
  selected,
  onSelect,
  onPointerDown,
  onPointerUp,
  onAction,
  onInteraction,
  inputValues,
  onInputChange
}) {
  const textValue = resolveUiValue(element, runtime, "text");
  const imageValue = resolveUiValue(element, runtime, "src");
  const inputTargetId = element.linkedNodeId || element.id;
  const inputValue = element.linkedNodeId ? (inputValues?.[element.linkedNodeId] ?? "") : "";
  const inputPlaceholder = textValue || element.text || "Input";
  const isActionElement = element.kind === "button" || element.kind === "custom-button";

  const baseStyle = {
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.width}px`,
    height: `${element.height}px`,
    color: element.color,
    background: element.kind === "image" ? "transparent" : element.background,
    borderRadius: `${element.radius}px`,
    fontSize: `${element.fontSize}px`,
    textAlign: element.align,
    cursor: editable ? "grab" : allowAction && isActionElement && element.actionType !== "none" ? "pointer" : "default",
    ...parseSafeCssText(element.cssText)
  };

  const handleClick = async (event) => {
    event.stopPropagation();
    onSelect?.(element.id);
    onInteraction?.(element.id, "click");
    if (allowAction && !editable && isActionElement && element.actionType !== "none") {
      await onAction?.(element);
    }
  };

  return (
    <div
      className={`builder-item kind-${element.kind} ${selected ? "is-selected" : ""}`}
      style={baseStyle}
      onClick={handleClick}
      onPointerDown={(event) => {
        event.stopPropagation();
        onSelect?.(element.id);
        onPointerDown?.(event, element.id, "move");
      }}
      onPointerUp={(event) => {
        event.stopPropagation();
        onPointerUp?.();
      }}
      onPointerCancel={(event) => {
        event.stopPropagation();
        onPointerUp?.();
      }}
      onPointerEnter={() => onInteraction?.(element.id, "enter")}
      onPointerLeave={() => onInteraction?.(element.id, "leave")}
    >
      {element.kind === "custom-button" || element.kind === "vector" ? (
        <>
          <svg className="builder-vector-layer" viewBox={`0 0 ${Math.max(1, element.width)} ${Math.max(1, element.height)}`} preserveAspectRatio="none" aria-hidden="true">
            {element.vectorPath ? (
              <path
                d={element.vectorPath}
                fill={/z\s*$/i.test(element.vectorPath) ? (element.vectorFill || element.background || ACCENT) : "none"}
                stroke={!/z\s*$/i.test(element.vectorPath) ? (element.vectorFill || element.background || ACCENT) : "none"}
                strokeWidth={!/z\s*$/i.test(element.vectorPath) ? 4 : 0}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <rect x="0" y="0" width={Math.max(1, element.width)} height={Math.max(1, element.height)} rx={element.radius || 0} fill={element.vectorFill || element.background || ACCENT} />
            )}
          </svg>
          {element.kind === "custom-button" ? <div className="builder-copy builder-vector-copy">{textValue || "Custom Button"}</div> : null}
        </>
      ) : element.kind === "image" ? (
        imageValue ? <img src={imageValue} alt={element.text || "Builder asset"} /> : <span className="builder-placeholder">Image</span>
      ) : element.kind === "input" ? (
        <input
          className="builder-input"
          value={inputValue}
          placeholder={inputPlaceholder}
          readOnly={editable}
          tabIndex={editable ? -1 : 0}
          onPointerDown={(event) => {
            if (!editable) {
              event.stopPropagation();
            }
          }}
          onClick={(event) => {
            if (!editable) {
              event.stopPropagation();
            }
          }}
          onChange={(event) => onInputChange?.(inputTargetId, event.target.value)}
        />
      ) : (
        <div className="builder-copy">
          {textValue || (element.kind === "container" ? "Container" : "Empty")}
        </div>
      )}
      {editable ? <span className="builder-badge">{element.kind.toUpperCase()}</span> : null}
      {editable && selected ? (
        <span
          className="builder-resize-handle"
          onPointerDown={(event) => {
            event.stopPropagation();
            onSelect?.(element.id);
            onPointerDown?.(event, element.id, "resize");
          }}
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
});

// [노드 렌더링] 실행 상태와 그룹 라벨, 연결 점을 한 번에 보여주는 기본 노드입니다.
const IXONode = memo(function IXONode({ data, selected }) {
  const color = NODE_COLOR[data.kind] || ACCENT;
  const isCondition = data.nodeType === "condition";
  const isSwitch = data.nodeType === "switch";

  return (
    <div
      className={`ixo-node ${selected ? "selected" : ""} ${data.isActive ? "is-active" : ""} ${data.isFocused ? "is-focused" : ""}`}
      style={{ "--node-color": color }}
    >
      <Handle className="node-handle node-handle-target" type="target" position={Position.Left} />
      <div className="ixo-node-header">
        <span className="ixo-badge">IXO</span>
        <span>{data.displayCategory || data.category || "Node"}</span>
      </div>
      <div className="ixo-node-title-row">
        <div className="ixo-node-title">{data.displayLabel || data.label}</div>
        <div className="node-title-meta">
          {typeof data.executionOrder === "number" ? <span className="node-order-pill">{data.executionOrder}</span> : null}
          <span className="node-link-dot" aria-hidden="true" />
        </div>
      </div>
      <div className="ixo-node-value">{data.value || "..."}</div>
      {data.groupLabel ? <div className="node-group-chip">{data.groupLabel}</div> : null}
      {data.liveValue ? <div className="live-trace-pill">out: {data.liveValue}</div> : null}

      {isCondition ? (
        <>
          <Handle id="true" className="node-handle true-handle" type="source" position={Position.Right} style={{ top: 18 }} />
          <Handle id="false" className="node-handle false-handle" type="source" position={Position.Right} style={{ top: 46 }} />
        </>
      ) : isSwitch ? (
        <>
          <Handle id="A" className="node-handle node-handle-source" type="source" position={Position.Right} style={{ top: 14 }} />
          <Handle id="B" className="node-handle node-handle-source" type="source" position={Position.Right} style={{ top: 32 }} />
          <Handle id="C" className="node-handle node-handle-source" type="source" position={Position.Right} style={{ top: 50 }} />
        </>
      ) : (
        <Handle className="node-handle node-handle-source" type="source" position={Position.Right} />
      )}
    </div>
  );
});

// [그룹 노드] 실제 그룹화 로직의 기반이 되는 시각적 구획 노드입니다.
const IXOGroupNode = memo(function IXOGroupNode({ data, selected }) {
  return (
    <div className={`ixo-group-node ${selected ? "selected" : ""}`}>
      <div className="ixo-group-title">{data.label || "Group"}</div>
      <div className="ixo-group-copy">{data.value || "Drag nodes around this group to keep related logic together."}</div>
    </div>
  );
});

// [런타임 화면] Preview, Viewer, Builder 모드에서 공통으로 사용하는 화면 구성입니다.
function RuntimePanel({
  viewMode,
  setViewMode,
  runtime,
  nodes,
  inputValues,
  onInputChange,
  uiElements,
  selectedUiElementId,
  setSelectedUiElementId,
  onBuilderDrop,
  onBuilderDragOver,
  onBuilderPointerDown,
  onBuilderPointerUp,
  builderCanvasRef,
  debugOverlay,
  flowJson,
  onUiAction,
  onUiInteraction,
  appendLog,
  uiText,
  previewDevice,
  setPreviewDevice,
  onUiElementSelect,
  onOpenSettings,
  activeScene = "main",
  setActiveScene,
  sceneNames = ["main"],
  onCreateScene,
  onDeleteScene,
  onAddComponent,
  runtimeOnly = false
}) {
  const inputNodes = runtimeOnly ? [] : nodes.filter((node) => node.data?.nodeType === "input");
  const editable = viewMode === "builder";
  const showViewerStage = runtimeOnly || viewMode === "viewer" || viewMode === "builder";
  const showDeviceToolbar = showViewerStage && !runtimeOnly;
  const canvasLayerRef = useRef(null);
  const visibleUiElements = useMemo(
    () => uiElements
      .filter((element) => !element.hidden)
      .filter((element) => !element.scene || element.scene === activeScene),
    [activeScene, uiElements]
  );

  useEffect(() => {
    if (!showViewerStage) return undefined;
    const canvas = canvasLayerRef.current;
    const stage = builderCanvasRef?.current;
    if (!canvas || !stage) return undefined;
    const frame = window.requestAnimationFrame(() => {
      const rect = stage.getBoundingClientRect();
      const scale = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(rect.width * scale));
      canvas.height = Math.max(1, Math.round(rect.height * scale));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext("2d");
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);
      visibleUiElements.forEach((element) => {
        if (element.kind === "input" || element.kind === "button" || element.kind === "custom-button") return;
        const x = Number(element.x || 0);
        const y = Number(element.y || 0);
        const width = Number(element.width || 0);
        const height = Number(element.height || 0);
        if (x > rect.width || y > rect.height || x + width < 0 || y + height < 0) return;
        ctx.fillStyle = element.background && element.background !== "transparent" ? element.background : "rgba(62, 207, 142, 0.03)";
        ctx.strokeStyle = "rgba(62, 207, 142, 0.12)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect?.(x, y, width, height, Number(element.radius || 0));
        if (!ctx.roundRect) ctx.rect(x, y, width, height);
        ctx.fill();
        ctx.stroke();
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeScene, builderCanvasRef, showViewerStage, visibleUiElements]);

  return (
    <div className="preview-shell">
      <div className="viewer-header">
        {runtimeOnly ? null : (
          <>
            <div className="viewer-tabs-row">
              <div className="viewer-tabs">
                <button className={viewMode === "preview" ? "active" : ""} onClick={() => setViewMode("preview")}>{uiText.preview}</button>
                <button className={viewMode === "viewer" ? "active" : ""} onClick={() => setViewMode("viewer")}>{uiText.viewer}</button>
                <button className={viewMode === "builder" ? "active" : ""} onClick={() => setViewMode("builder")}>{uiText.builder}</button>
              </div>
              <button className="settings-gear-btn" onClick={onOpenSettings} aria-label={uiText.settings}>
                {uiText.settingsIcon}
              </button>
            </div>
            <p>
              {viewMode === "builder"
                ? uiText.viewerBuilderHint
                : uiText.viewerSimpleHint}
            </p>
          </>
        )}
      </div>

      {editable ? (
        <div className="builder-toolbar">
          <div className="builder-toolbar-copy">
            <strong>{uiText.builderToolbarTitle}</strong>
            <span>{uiText.builderToolbarCopy}</span>
          </div>
          <div className="builder-scene-switcher">
            <span>Scene</span>
            <div>
              {sceneNames.map((scene) => (
                <button key={scene} type="button" className={activeScene === scene ? "active" : ""} onClick={() => setActiveScene?.(scene)}>
                  {scene}
                </button>
              ))}
              <button type="button" className="ghost-btn" onClick={onCreateScene}>+ Scene</button>
              {activeScene !== "main" ? <button type="button" className="ghost-btn danger-lite" onClick={() => onDeleteScene?.(activeScene)}>Delete</button> : null}
            </div>
          </div>
          <div className="builder-palette">
            {UI_PALETTE.map((item) => (
              <button
                key={item.kind}
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData("application/ixo-ui", item.kind);
                  event.dataTransfer.effectAllowed = "copy";
                }}
              >
                {uiText[`palette${item.kind[0].toUpperCase()}${item.kind.slice(1)}`] || item.label}
              </button>
            ))}
          </div>
          <div className="builder-component-palette">
            {UI_COMPONENT_LIBRARY.map((item) => (
              <button key={item.key} type="button" onClick={() => onAddComponent?.(item.key)}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div
        className={`runtime-screen viewer-screen ${editable ? "builder-mode" : ""} ${viewMode === "preview" ? "preview-mode" : ""} ${runtimeOnly ? "runtime-only" : ""}`}
      >
        {inputNodes.length ? (
          <div className="viewer-inputs">
            {inputNodes.map((node) => (
              <label key={node.id} className="viewer-input-field">
                <span>{node.data?.displayLabel || node.data?.label}</span>
                <input
                  className="runtime-input"
                  value={inputValues[node.id] || ""}
                  onChange={(event) => onInputChange(node.id, event.target.value)}
                  placeholder={node.data?.value || "Input"}
                />
              </label>
            ))}
          </div>
        ) : null}

        {showDeviceToolbar ? (
          <div className="device-toolbar">
            <span>{uiText.responsivePreview}</span>
            <div className="device-tabs">
              {Object.entries(PREVIEW_DEVICE_OPTIONS).map(([key, option]) => (
                <button key={key} className={previewDevice === key ? "active" : ""} onClick={() => setPreviewDevice(key)}>
                  {getPreviewDeviceLabel(key, uiText)}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {showViewerStage ? (
          <div className={`viewer-stage-shell device-${previewDevice}`}>
            <div
              ref={builderCanvasRef}
              className={`viewer-stage ${editable ? "is-editable" : ""} ${runtimeOnly ? "is-runtime-only" : ""}`}
              style={{ width: runtimeOnly ? "100%" : PREVIEW_DEVICE_OPTIONS[previewDevice]?.width || "100%" }}
              onDragOver={onBuilderDragOver}
              onDrop={onBuilderDrop}
              onClick={(event) => {
                if (showViewerStage && event.target === event.currentTarget) {
                  setSelectedUiElementId(null);
                }
              }}
            >
              <canvas ref={canvasLayerRef} className="viewer-canvas-layer" aria-hidden="true" />
              {runtimeOnly ? null : <div className="viewer-stage-grid" />}
              {visibleUiElements.map((element) => (
                <BuilderElement
                  key={element.id}
                  element={element}
                  runtime={runtime}
                  editable={editable}
                  allowAction={!editable}
                  selected={selectedUiElementId === element.id}
                  onSelect={onUiElementSelect}
                  onPointerDown={editable ? onBuilderPointerDown : undefined}
                  onPointerUp={editable ? onBuilderPointerUp : undefined}
                  inputValues={inputValues}
                  onInputChange={onInputChange}
                  onAction={async (elementForAction) => {
                    try {
                      const result = await onUiAction(elementForAction);
                      appendLog(makeLog("info", "UI Viewer", `버튼 액션이 실행되었습니다: ${result?.label || elementForAction.actionType}`));
                    } catch (error) {
                      appendLog(makeLog("error", "UI Viewer", `버튼 액션이 차단되었습니다: ${elementForAction.actionType}`, String(error.message || error)));
                    }
                  }}
                  onInteraction={onUiInteraction}
                />
              ))}
            </div>
          </div>
        ) : null}

        {viewMode === "preview" && (runtime.outputTexts.length || runtime.outputImages.length || runtime.outputSounds.length) ? (
          <div className="auto-output-stack">
            <div className="auto-output-title">{uiText.nodeOutputFeed}</div>
            {runtime.outputTexts.map((item) => (
              <div key={item.id} className="runtime-text-row">
                <strong>{item.label}</strong>
                <p className="runtime-text">{item.text}</p>
              </div>
            ))}
            {runtime.outputImages.map((item) => (
              <div key={item.id} className="runtime-image-row">
                <strong>{item.label}</strong>
                {item.src ? <img className="runtime-image" src={item.src} alt={item.label} /> : null}
              </div>
            ))}
            {runtime.outputSounds.map((item) => (
              <div key={item.id} className="runtime-text-row">
                <strong>{item.label}</strong>
                {item.src ? <audio className="runtime-audio" controls src={item.src} /> : null}
              </div>
            ))}
          </div>
        ) : null}

        {debugOverlay ? (
          <div className="debug-overlay">
            <span>{uiText.execution}</span>
            <strong>{runtime.topo.join(" -> ")}</strong>
          </div>
        ) : null}
      </div>

      {viewMode === "preview" ? <pre className="json-view">{flowJson}</pre> : null}
    </div>
  );
}

function VectorDrawPad({ element, accent, onChange }) {
  const [draftPath, setDraftPath] = useState(element?.vectorPath || "");
  const pointsRef = useRef([]);
  const drawingRef = useRef(false);
  const width = Math.max(1, Number(element?.width || 180));
  const height = Math.max(1, Number(element?.height || 100));

  useEffect(() => {
    setDraftPath(element?.vectorPath || "");
  }, [element?.id, element?.vectorPath]);

  const getPoint = useCallback((event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(width, ((event.clientX - rect.left) / rect.width) * width));
    const y = Math.max(0, Math.min(height, ((event.clientY - rect.top) / rect.height) * height));
    return { x: Math.round(x), y: Math.round(y) };
  }, [height, width]);

  const buildFreehandPath = useCallback((points) => (
    points.length
      ? `M${points[0].x} ${points[0].y} ${points.slice(1).map((point) => `L${point.x} ${point.y}`).join(" ")}`
      : ""
  ), []);

  const finishDrawing = useCallback(() => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const nextPath = buildFreehandPath(pointsRef.current);
    if (nextPath) onChange(nextPath);
  }, [buildFreehandPath, onChange]);

  const applyPreset = useCallback((path) => {
    setDraftPath(path);
    onChange(path);
  }, [onChange]);

  return (
    <div className="vector-draw-pad">
      <div className="vector-draw-toolbar">
        <button type="button" className="ghost-btn" onClick={() => applyPreset(`M${Math.round(width * 0.08)} ${Math.round(height * 0.1)} H${Math.round(width * 0.92)} V${Math.round(height * 0.9)} H${Math.round(width * 0.08)} Z`)}>Box</button>
        <button type="button" className="ghost-btn" onClick={() => applyPreset(`M${Math.round(width * 0.5)} ${Math.round(height * 0.08)} L${Math.round(width * 0.92)} ${Math.round(height * 0.9)} H${Math.round(width * 0.08)} Z`)}>Triangle</button>
        <button type="button" className="ghost-btn" onClick={() => applyPreset(`M${Math.round(width * 0.5)} ${Math.round(height * 0.06)} L${Math.round(width * 0.61)} ${Math.round(height * 0.36)} H${Math.round(width * 0.95)} L${Math.round(width * 0.67)} ${Math.round(height * 0.56)} L${Math.round(width * 0.78)} ${Math.round(height * 0.92)} L${Math.round(width * 0.5)} ${Math.round(height * 0.68)} L${Math.round(width * 0.22)} ${Math.round(height * 0.92)} L${Math.round(width * 0.33)} ${Math.round(height * 0.56)} L${Math.round(width * 0.05)} ${Math.round(height * 0.36)} H${Math.round(width * 0.39)} Z`)}>Star</button>
        <button type="button" className="ghost-btn danger-lite" onClick={() => applyPreset("")}>Clear</button>
      </div>
      <svg
        className="vector-draw-surface"
        viewBox={`0 0 ${width} ${height}`}
        onPointerDown={(event) => {
          event.preventDefault();
          drawingRef.current = true;
          pointsRef.current = [getPoint(event)];
          setDraftPath(buildFreehandPath(pointsRef.current));
          event.currentTarget.setPointerCapture?.(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!drawingRef.current) return;
          pointsRef.current = [...pointsRef.current, getPoint(event)].slice(-400);
          setDraftPath(buildFreehandPath(pointsRef.current));
        }}
        onPointerUp={(event) => {
          event.currentTarget.releasePointerCapture?.(event.pointerId);
          finishDrawing();
        }}
        onPointerLeave={finishDrawing}
      >
        <rect x="0" y="0" width={width} height={height} rx="12" />
        {draftPath ? <path d={draftPath} fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /> : null}
      </svg>
      <small>마우스로 직접 그리면 SVG path가 자동 생성됩니다.</small>
    </div>
  );
}

// [로그 콘솔] 내부 에러와 실행 이력을 하단 섹션에 정리합니다.
function LogConsole({ logs, onClear, uiText }) {
  return (
    <div className="log-console">
      <div className="log-console-header">
        <div>
          <strong>{uiText.errorLogConsole}</strong>
          <span>{uiText.errorLogHint}</span>
        </div>
        <button className="ghost-btn" onClick={onClear}>{uiText.clear}</button>
      </div>

      <div className="log-console-list">
        {logs.length === 0 ? <div className="log-empty">{uiText.noLogs}</div> : null}
        {logs.map((log) => (
          <div key={log.id} className={`log-entry level-${log.level}`}>
            <div className="log-meta">
              <span>{log.time}</span>
              <span>{log.source}</span>
              <span>{log.level.toUpperCase()}</span>
            </div>
            <div className="log-message">{log.message}</div>
            {log.details ? <pre className="log-details">{log.details}</pre> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsModal({
  open,
  uiText,
  draftLanguage,
  setDraftLanguage,
  draftThemeKey,
  setDraftThemeKey,
  themeOptions = THEME_OPTIONS,
  onThemeUpload,
  draftPreviewDevice,
  setDraftPreviewDevice,
  draftTemplateKey,
  setDraftTemplateKey,
  draftHttpsNodesEnabled,
  setDraftHttpsNodesEnabled,
  appInfo,
  updateInfo,
  updateState,
  onCheckForUpdates,
  onDownloadUpdate,
  onOpenReleasePage,
  onOpenPrivacyPolicy,
  onApply,
  onCancel,
  onClearAutosave
}) {
  if (!open) return null;

  return (
    <div className="settings-modal-backdrop" onClick={onCancel}>
      <div className="settings-modal" onClick={(event) => event.stopPropagation()}>
        <div className="settings-modal-header">
          <strong>{uiText.settingsTitle}</strong>
          <button className="ghost-btn" onClick={onCancel}>{uiText.cancel}</button>
        </div>

        <div className="settings-modal-body">
          <label className="settings-field">
            <span>{uiText.language}</span>
            <select value={draftLanguage} onChange={(event) => setDraftLanguage(event.target.value)}>
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="settings-field">
            <span>{uiText.theme}</span>
            <select value={draftThemeKey} onChange={(event) => setDraftThemeKey(event.target.value)}>
              {Object.entries(themeOptions).map(([key, option]) => (
                <option key={key} value={key}>{option.label}</option>
              ))}
            </select>
          </label>
          <label className="settings-field theme-upload-field">
            <span>Custom Theme</span>
            <input type="file" accept=".json,.ixo-theme,application/json" onChange={(event) => onThemeUpload?.(event.target.files?.[0])} />
            <small>JSON 테마 파일을 올리면 IXO Engine 전체 UI에 적용할 수 있습니다.</small>
          </label>

          <label className="settings-field">
            <span>{uiText.responsivePreview}</span>
            <select value={draftPreviewDevice} onChange={(event) => setDraftPreviewDevice(event.target.value)}>
              {Object.entries(PREVIEW_DEVICE_OPTIONS).map(([key, option]) => (
                <option key={key} value={key}>{getPreviewDeviceLabel(key, uiText)}</option>
              ))}
            </select>
          </label>

          <label className="settings-field">
            <span>{uiText.templates}</span>
            <select value={draftTemplateKey} onChange={(event) => setDraftTemplateKey(event.target.value)}>
              <option value="">{uiText.selectTemplate}</option>
              {Object.entries(STARTER_TEMPLATES).map(([key, template]) => (
                <option key={key} value={key}>{template.label}</option>
              ))}
            </select>
          </label>

          <label className="settings-toggle-card">
            <span>
              <strong>{uiText.httpsNodes}</strong>
              <small>{uiText.httpsNodesDescription}</small>
            </span>
            <input
              type="checkbox"
              checked={draftHttpsNodesEnabled}
              onChange={(event) => setDraftHttpsNodesEnabled(event.target.checked)}
            />
          </label>

          <section className="update-card">
            <div className="update-card-heading">
              <strong>{uiText.updates}</strong>
              <span>{uiText.updateDescription}</span>
            </div>

            <div className="update-version-grid">
              <span>{uiText.currentVersion}</span>
              <strong>{appInfo?.version || "-"}</strong>
              <span>{uiText.latestVersion}</span>
              <strong>{updateInfo?.latestVersion || "-"}</strong>
            </div>

            <p className={`update-status state-${updateState}`}>
              {updateState === "checking"
                ? uiText.checkingUpdates
                : updateState === "available"
                  ? uiText.updateAvailable
                  : updateState === "current"
                    ? uiText.upToDate
                    : updateState === "no-release"
                      ? uiText.noReleasePublished
                    : updateState === "downloaded"
                      ? uiText.downloadReady
                      : updateState === "error"
                        ? uiText.updateUnavailable
                        : uiText.updateDescription}
            </p>

            {updateInfo?.available && !updateInfo?.asset ? (
              <p className="update-muted">{uiText.noPlatformAsset}</p>
            ) : null}

            {updateInfo?.releaseNotes ? (
              <details className="update-release-notes">
                <summary>{uiText.releaseNotes}</summary>
                <pre>{updateInfo.releaseNotes}</pre>
              </details>
            ) : null}

            <div className="update-actions">
              <button
                className="ghost-btn"
                onClick={onCheckForUpdates}
                disabled={updateState === "checking" || updateState === "downloading"}
              >
                {updateState === "checking" ? uiText.checkingUpdates : uiText.checkUpdates}
              </button>
              {updateInfo?.available && updateInfo?.asset ? (
                <button
                  className="menu-btn docs-btn"
                  onClick={onDownloadUpdate}
                  disabled={updateState === "downloading"}
                >
                  {updateState === "downloading" ? uiText.downloadingUpdate : uiText.downloadUpdate}
                </button>
              ) : null}
              {updateInfo?.releaseUrl ? (
                <button className="ghost-btn" onClick={onOpenReleasePage}>
                  GitHub Release
                </button>
              ) : null}
            </div>
          </section>

          <section className="privacy-card">
            <div>
              <strong>{uiText.privacyPolicy}</strong>
              <span>{uiText.privacyPolicyIntro}</span>
            </div>
            <button className="ghost-btn" onClick={onOpenPrivacyPolicy}>{uiText.openPrivacyPolicy}</button>
          </section>
        </div>

        <div className="settings-modal-actions">
          <button className="ghost-btn" onClick={onClearAutosave}>{uiText.clearAutosave}</button>
          <div className="settings-cta-group">
            <button className="ghost-btn" onClick={onCancel}>{uiText.cancel}</button>
            <button className="menu-btn docs-btn" onClick={onApply}>{uiText.apply}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrivacyPolicyModal({ open, uiText, language, onClose }) {
  if (!open) return null;
  const policy = PRIVACY_POLICY_TEXT[language] || PRIVACY_POLICY_TEXT.ko;

  return (
    <div className="settings-modal-backdrop privacy-modal-backdrop" onClick={onClose}>
      <div className="settings-modal privacy-modal" onClick={(event) => event.stopPropagation()}>
        <div className="settings-modal-header">
          <strong>{uiText.privacyPolicy}</strong>
          <button className="ghost-btn" onClick={onClose}>{uiText.close}</button>
        </div>
        <div className="settings-modal-body privacy-modal-body">
          <p className="privacy-effective-date">{policy.effectiveDate}</p>
          {policy.sections.map((section) => (
            <section key={section.title} className="privacy-section">
              <strong>{section.title}</strong>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function asBoolean(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (["true", "1", "yes", "on"].includes(normalized)) return true;
  if (["false", "0", "no", "off", ""].includes(normalized)) return false;
  return Boolean(value);
}

class RestrictedScriptError extends Error {
  constructor(message) {
    super(message);
    this.name = "RestrictedScriptError";
  }
}

function getRestrictedScriptExpression(code) {
  const normalized = String(code || "return context;").trim();
  const match = normalized.match(/^return\s+([\s\S]*?);?$/);
  if (!match) {
    throw new RestrictedScriptError("Restricted mode only supports a single return expression.");
  }
  const expression = match[1].trim().replace(/;$/, "").trim();
  if (!expression) {
    throw new RestrictedScriptError("Restricted mode requires a return value.");
  }
  return expression;
}

function tokenizeRestrictedScript(source) {
  const tokens = [];
  const operators = ["===", "!==", ">=", "<=", "&&", "||", "??", "==", "!=", "+", "-", "*", "/", "%", ">", "<", "!", "?", ":", ".", "[", "]", "(", ")"];
  let index = 0;

  while (index < source.length) {
    const char = source[index];
    if (/\s/.test(char)) {
      index += 1;
      continue;
    }

    if (char === "'" || char === '"') {
      const quote = char;
      let value = "";
      index += 1;
      while (index < source.length) {
        const current = source[index];
        if (current === "\\") {
          const next = source[index + 1];
          if (typeof next === "undefined") {
            throw new RestrictedScriptError("Unterminated string literal.");
          }
          const escapes = { n: "\n", r: "\r", t: "\t" };
          value += escapes[next] ?? next;
          index += 2;
          continue;
        }
        if (current === quote) {
          index += 1;
          tokens.push({ type: "string", value });
          value = null;
          break;
        }
        value += current;
        index += 1;
      }
      if (value !== null) {
        throw new RestrictedScriptError("Unterminated string literal.");
      }
      continue;
    }

    const numberMatch = source.slice(index).match(/^(?:\d+(?:\.\d+)?|\.\d+)/);
    if (numberMatch) {
      tokens.push({ type: "number", value: Number(numberMatch[0]) });
      index += numberMatch[0].length;
      continue;
    }

    const identifierMatch = source.slice(index).match(/^[A-Za-z_$][\w$]*/);
    if (identifierMatch) {
      tokens.push({ type: "identifier", value: identifierMatch[0] });
      index += identifierMatch[0].length;
      continue;
    }

    const operator = operators.find((candidate) => source.startsWith(candidate, index));
    if (!operator) {
      throw new RestrictedScriptError(`Unsupported token near "${source.slice(index, index + 12)}".`);
    }
    tokens.push({ type: "operator", value: operator });
    index += operator.length;
  }

  tokens.push({ type: "eof", value: "" });
  return tokens;
}

function cloneRestrictedScriptValue(value) {
  try {
    return typeof structuredClone === "function"
      ? structuredClone(value)
      : JSON.parse(JSON.stringify(value));
  } catch {
    return {};
  }
}

function readRestrictedScriptProperty(target, property) {
  const key = String(property);
  if (RESTRICTED_SCRIPT_BLOCKED_PROPERTIES.has(key)) {
    throw new RestrictedScriptError(`Property "${key}" is blocked in restricted mode.`);
  }
  if (target === null || typeof target === "undefined") {
    return undefined;
  }
  if (typeof target !== "object" && typeof target !== "string") {
    return undefined;
  }
  return target[key];
}

function evaluateRestrictedScript(code, context, inputValues) {
  const tokens = tokenizeRestrictedScript(getRestrictedScriptExpression(code));
  const safeRoots = {
    context: cloneRestrictedScriptValue(context),
    inputValues: cloneRestrictedScriptValue(inputValues)
  };
  const precedence = {
    "??": 1,
    "||": 2,
    "&&": 3,
    "==": 4,
    "!=": 4,
    "===": 4,
    "!==": 4,
    ">": 5,
    "<": 5,
    ">=": 5,
    "<=": 5,
    "+": 6,
    "-": 6,
    "*": 7,
    "/": 7,
    "%": 7
  };
  let cursor = 0;

  const current = () => tokens[cursor];
  const match = (value) => {
    if (current().value !== value) return false;
    cursor += 1;
    return true;
  };
  const expect = (value) => {
    if (!match(value)) {
      throw new RestrictedScriptError(`Expected "${value}".`);
    }
  };

  const applyBinary = (operator, left, right) => {
    if (operator === "??") return left ?? right;
    if (operator === "||") return left || right;
    if (operator === "&&") return left && right;
    if (operator === "==") return left == right;
    if (operator === "!=") return left != right;
    if (operator === "===") return left === right;
    if (operator === "!==") return left !== right;
    if (operator === ">") return left > right;
    if (operator === "<") return left < right;
    if (operator === ">=") return left >= right;
    if (operator === "<=") return left <= right;
    if (operator === "+") return left + right;
    if (operator === "-") return left - right;
    if (operator === "*") return left * right;
    if (operator === "/") return left / right;
    if (operator === "%") return left % right;
    throw new RestrictedScriptError(`Operator "${operator}" is not supported.`);
  };

  function parseConditional() {
    const condition = parseBinary();
    if (!match("?")) {
      return condition;
    }
    const whenTrue = parseConditional();
    expect(":");
    const whenFalse = parseConditional();
    return condition ? whenTrue : whenFalse;
  }

  function parsePrimary() {
    const token = current();
    let value;

    if (token.type === "number" || token.type === "string") {
      value = token.value;
      cursor += 1;
    } else if (token.type === "identifier") {
      cursor += 1;
      if (token.value === "true") value = true;
      else if (token.value === "false") value = false;
      else if (token.value === "null") value = null;
      else if (token.value === "undefined") value = undefined;
      else if (Object.prototype.hasOwnProperty.call(safeRoots, token.value)) value = safeRoots[token.value];
      else throw new RestrictedScriptError(`Identifier "${token.value}" is not allowed in restricted mode.`);
    } else if (match("(")) {
      value = parseConditional();
      expect(")");
    } else {
      throw new RestrictedScriptError("Expected a value.");
    }

    while (true) {
      if (match(".")) {
        const property = current();
        if (property.type !== "identifier") {
          throw new RestrictedScriptError("Expected a property name.");
        }
        cursor += 1;
        value = readRestrictedScriptProperty(value, property.value);
        continue;
      }
      if (match("[")) {
        const property = parseConditional();
        expect("]");
        value = readRestrictedScriptProperty(value, property);
        continue;
      }
      if (current().value === "(") {
        throw new RestrictedScriptError("Function calls are not allowed in restricted mode.");
      }
      break;
    }

    return value;
  }

  function parseUnary() {
    if (match("!")) return !parseUnary();
    if (match("+")) return Number(parseUnary());
    if (match("-")) return -Number(parseUnary());
    return parsePrimary();
  }

  function parseBinary(minimumPrecedence = 0) {
    let left = parseUnary();
    while (current().type === "operator" && Object.prototype.hasOwnProperty.call(precedence, current().value)) {
      const operator = current().value;
      const operatorPrecedence = precedence[operator];
      if (operatorPrecedence < minimumPrecedence) break;
      cursor += 1;
      const right = parseBinary(operatorPrecedence + 1);
      left = applyBinary(operator, left, right);
    }
    return left;
  }

  const result = parseConditional();
  if (current().type !== "eof") {
    throw new RestrictedScriptError("Unexpected trailing tokens.");
  }
  return result;
}

function tryRunRestrictedScript(code, context, inputValues) {
  try {
    return { ok: true, value: evaluateRestrictedScript(code, context, inputValues) };
  } catch (error) {
    return { ok: false, error };
  }
}

function canRunRestrictedScript(code) {
  return tryRunRestrictedScript(code, {}, {}).ok;
}

function boolText(value) {
  return value ? "true" : "false";
}

function toFiniteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function parsePointValue(value, fallback = { x: 0, y: 0 }) {
  const rendered = String(value || "");
  const xMatch = rendered.match(/x\s*:\s*(-?\d+(?:\.\d+)?)/i);
  const yMatch = rendered.match(/y\s*:\s*(-?\d+(?:\.\d+)?)/i);
  return {
    x: xMatch ? Number(xMatch[1]) : fallback.x,
    y: yMatch ? Number(yMatch[1]) : fallback.y
  };
}

function normalizeHexColor(value) {
  const match = String(value || "").trim().match(/^#?([0-9a-f]{6})$/i);
  return match ? `#${match[1].toLowerCase()}` : "#000000";
}

function getHexChannel(value) {
  const match = String(value || "").trim().match(/^#?([0-9a-f]{6})\s*([rgb])$/i);
  if (!match) return "";
  const color = match[1];
  const offset = { r: 0, g: 2, b: 4 }[match[2].toLowerCase()];
  return parseInt(color.slice(offset, offset + 2), 16);
}

function replaceTextExpression(value) {
  const [source = "", find = "", replacement = ""] = String(value || "").split("|").map((item) => item.trim());
  return source.split(find).join(replacement);
}

function letterFromExpression(value) {
  const match = String(value || "").match(/^(\d+)\s+of\s+(.+)$/i);
  if (!match) return "";
  const index = Math.max(0, Number(match[1]) - 1);
  return String(match[2] || "").charAt(index);
}

function transformCaseExpression(value) {
  const match = String(value || "").match(/^(upper|lower)\s+(.+)$/i);
  if (!match) return String(value || "");
  return match[1].toLowerCase() === "upper" ? match[2].toUpperCase() : match[2].toLowerCase();
}

function createRuntimeState() {
  return {
    scene: {
      currentScene: "main",
      actors: {
        actor: {
          x: 0,
          y: 0,
          heading: 90,
          visible: true,
          speech: "",
          costume: "default",
          effects: {},
          size: 100,
          layer: 0,
          flipped: false
        }
      },
      clones: []
    },
    pen: {
      down: false,
      color: "#3ecf8e",
      size: 1,
      fill: null,
      strokes: []
    },
    audio: {
      volume: 100,
      tempo: 1,
      activeSounds: []
    },
    signals: new Set(),
    control: {
      breakRequested: false,
      skipRequested: false,
      stopRequested: false,
      restartRequested: false
    }
  };
}

function getDefaultActor(runtimeState) {
  return runtimeState.scene.actors.actor;
}

function ExportModal({
  open,
  uiText,
  appName,
  icon,
  mobileIconBackgroundColor,
  outputPath,
  targets,
  targetOptions,
  pipeline,
  exportSettings,
  mobileBundleId,
  mobileVersionName,
  busy,
  onAppNameChange,
  onIconChange,
  onMobileIconBackgroundColorChange,
  onPickPath,
  onToggleTarget,
  onPipelineChange,
  onExportSettingsChange,
  onMobileBundleIdChange,
  onMobileVersionNameChange,
  onExport,
  onCancel
}) {
  const iconInputRef = useRef(null);
  const mobilePreviewIconSrc = icon?.dataUrl || logoImage;

  const readIconFile = useCallback((file) => {
    if (!file) return;
    const lowerName = file.name.toLowerCase();
    if (!lowerName.endsWith(".png") && !lowerName.endsWith(".ico")) {
      window.alert(uiText.invalidIcon);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onIconChange({
        name: file.name,
        dataUrl: String(reader.result || "")
      });
    };
    reader.readAsDataURL(file);
  }, [onIconChange, uiText.invalidIcon]);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    readIconFile(event.dataTransfer.files?.[0]);
  }, [readIconFile]);

  if (!open) return null;

  return (
    <div className="settings-modal-backdrop" onClick={onCancel}>
      <div className="settings-modal export-modal" onClick={(event) => event.stopPropagation()}>
        <div className="settings-modal-header">
          <strong>{uiText.exportTitle}</strong>
          <button className="ghost-btn" onClick={onCancel}>{uiText.cancelExport}</button>
        </div>

        <div className="settings-modal-body export-modal-body">
          <div className="export-destination-card">
            <span>{uiText.exportDestinationPrefix}</span>
            <strong>{outputPath || uiText.exportDestinationEmpty}</strong>
            <span>{uiText.exportDestinationSuffix}</span>
            <button className="ghost-btn" onClick={onPickPath}>{uiText.pickPath}</button>
          </div>

          <section className="export-target-picker">
            <div>
              <strong>{uiText.chooseArtifactTypes}</strong>
              <span>{uiText.exportRequirementHint}</span>
            </div>
            <div className="export-pipeline-tabs">
              <button className={pipeline === "desktop" ? "active" : ""} onClick={() => onPipelineChange("desktop")}>{uiText.desktopPipeline}</button>
              <button className={pipeline === "mobile" ? "active" : ""} onClick={() => onPipelineChange("mobile")}>{uiText.mobilePipeline}</button>
            </div>
            {pipeline === "mobile" ? (
              <div className="mobile-export-note">
                <strong>{uiText.mobilePipelineTitle}</strong>
                <span>{uiText.mobilePipelineCopy}</span>
              </div>
            ) : null}
            <div className="export-target-grid">
              {targetOptions.map((target) => (
                <label key={target.key} className={`export-target-card ${target.enabled ? "" : "is-disabled"}`}>
                  <input
                    type="checkbox"
                    checked={targets.includes(target.key)}
                    disabled={!target.enabled}
                    onChange={() => onToggleTarget(target.key)}
                  />
                  <span>
                    <strong>{target.label}</strong>
                    <small>{target.platform}</small>
                    <em>{target.detail}</em>
                    {target.note ? <i>{target.note}</i> : null}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <button
            type="button"
            className={`export-icon-dropzone ${icon ? "has-icon" : ""}`}
            onClick={() => iconInputRef.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
          >
            {icon ? <img src={icon.dataUrl} alt={uiText.selectedAppIconAlt} /> : null}
            <span>{icon ? icon.name : uiText.dragAppIcon}</span>
          </button>
          <input
            ref={iconInputRef}
            type="file"
            accept=".png,.ico,image/png,image/x-icon,image/vnd.microsoft.icon"
            hidden
            onChange={(event) => readIconFile(event.target.files?.[0])}
          />

          <label className="settings-field export-name-field">
            <span>{uiText.appNamePrompt}</span>
            <input
              type="text"
              value={appName}
              onChange={(event) => onAppNameChange(event.target.value)}
              placeholder="myt-ixo"
            />
          </label>

          {pipeline === "desktop" ? (
            <section className="export-polish-grid">
              <label className="settings-field">
                <span>Window title</span>
                <input
                  type="text"
                  value={exportSettings.windowTitle}
                  onChange={(event) => onExportSettingsChange({ windowTitle: event.target.value })}
                  placeholder="IXO App"
                />
              </label>
              <label className="settings-field">
                <span>Default width</span>
                <input
                  type="number"
                  value={exportSettings.windowWidth}
                  onChange={(event) => onExportSettingsChange({ windowWidth: event.target.value })}
                />
              </label>
              <label className="settings-field">
                <span>Default height</span>
                <input
                  type="number"
                  value={exportSettings.windowHeight}
                  onChange={(event) => onExportSettingsChange({ windowHeight: event.target.value })}
                />
              </label>
              <label className="settings-field">
                <span>Background</span>
                <input
                  type="color"
                  value={exportSettings.backgroundColor}
                  onChange={(event) => onExportSettingsChange({ backgroundColor: event.target.value })}
                />
              </label>
              <label className="settings-toggle-card compact">
                <span>
                  <strong>Resizable window</strong>
                  <small>내보낸 앱 창 크기 변경 허용</small>
                </span>
                <input
                  type="checkbox"
                  checked={exportSettings.windowResizable}
                  onChange={(event) => onExportSettingsChange({ windowResizable: event.target.checked })}
                />
              </label>
              <label className="settings-field">
                <span>Startup splash</span>
                <select value={exportSettings.splash} onChange={(event) => onExportSettingsChange({ splash: event.target.value })}>
                  <option value="none">None</option>
                  <option value="minimal">Minimal</option>
                  <option value="brand">Brand</option>
                </select>
              </label>
            </section>
          ) : null}

          {pipeline === "mobile" ? (
            <div className="mobile-export-fields">
              <label className="settings-field">
                <span>Bundle ID / Application ID</span>
                <input
                  type="text"
                  value={mobileBundleId}
                  onChange={(event) => onMobileBundleIdChange(event.target.value)}
                  placeholder="com.minyangtech.myapp"
                />
              </label>
              <label className="settings-field">
                <span>{uiText.version}</span>
                <input
                  type="text"
                  value={mobileVersionName}
                  onChange={(event) => onMobileVersionNameChange(event.target.value)}
                  placeholder="1.0.0"
                />
              </label>
            </div>
          ) : null}

          {pipeline === "mobile" ? (
            <section className="mobile-icon-preview-panel">
              <div className="mobile-icon-preview-heading">
                <strong>{uiText.mobileIconPreview}</strong>
                <span>{uiText.mobileIconPreviewHint}</span>
              </div>
              <div className="mobile-icon-preview-grid">
                <div>
                  <small>{uiText.androidAdaptiveIcon}</small>
                  <div className="adaptive-icon-preview" style={{ background: mobileIconBackgroundColor }}>
                    <img src={mobilePreviewIconSrc} alt={uiText.mobileIconPreviewAlt} />
                  </div>
                </div>
                <div>
                  <small>{uiText.iosAppIcon}</small>
                  <div className="ios-icon-preview">
                    <img src={mobilePreviewIconSrc} alt={uiText.mobileIconPreviewAlt} />
                  </div>
                </div>
              </div>
              <label className="settings-field mobile-icon-color-field">
                <span>{uiText.androidIconBackground}</span>
                <input
                  type="color"
                  value={mobileIconBackgroundColor}
                  onChange={(event) => onMobileIconBackgroundColorChange(event.target.value)}
                />
              </label>
            </section>
          ) : null}

          <p className="export-help">
            {uiText.defaultExportHint}
          </p>
        </div>

        <div className="settings-modal-actions">
          <span className="export-note">{uiText.iconFormatsHint}</span>
          <div className="settings-cta-group">
            <button className="ghost-btn" onClick={onCancel}>{uiText.cancelExport}</button>
            <button className="menu-btn docs-btn" onClick={onExport} disabled={busy || !outputPath || targets.length === 0}>
              {busy ? uiText.exporting : uiText.exportAction}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// [메인 에디터] 노드 편집기, Viewer, Builder, 로그, 저장 기능을 총괄합니다.
function EngineEditor() {
  const reactFlowRef = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [libraryTab, setLibraryTab] = useState("pro");
  const [functions, setFunctions] = useState([]);
  const [activeFunctionId, setActiveFunctionId] = useState(null);
  const [collapsed, setCollapsed] = useState({});
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedNodeIds, setSelectedNodeIds] = useState([]);
  const [selectedEdgeIds, setSelectedEdgeIds] = useState([]);
  const [selectedUiElementId, setSelectedUiElementId] = useState(null);
  const [inspectorMode, setInspectorMode] = useState("basic");
  const [contextMenu, setContextMenu] = useState(null);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [librarySearchTerm, setLibrarySearchTerm] = useState("");
  const [status, setStatus] = useState("Ready");
  const [debugOverlay, setDebugOverlay] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [nodeCounter, setNodeCounter] = useState(6);
  const [inputValues, setInputValues] = useState({});
  const [uiElements, setUiElements] = useState(normalizeUiElements(initialUiElements));
  const [isDirty, setIsDirty] = useState(false);
  const [logoIndex, setLogoIndex] = useState(0);
  const [speed, setSpeed] = useState("1");
  const [paused, setPaused] = useState(false);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [flowRevision, setFlowRevision] = useState(0);
  const [viewMode, setViewMode] = useState("preview");
  const [logs, setLogs] = useState([]);
  const [dragState, setDragState] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [language, setLanguage] = useState("ko");
  const [themeKey, setThemeKey] = useState("mint");
  const [customThemes, setCustomThemes] = useState({});
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [activeScene, setActiveScene] = useState("main");
  const [draftLanguage, setDraftLanguage] = useState("ko");
  const [draftThemeKey, setDraftThemeKey] = useState("mint");
  const [draftPreviewDevice, setDraftPreviewDevice] = useState("desktop");
  const [draftTemplateKey, setDraftTemplateKey] = useState("");
  const [httpsNodesEnabled, setHttpsNodesEnabled] = useState(false);
  const [draftHttpsNodesEnabled, setDraftHttpsNodesEnabled] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [appInfo, setAppInfo] = useState({ version: FALLBACK_APP_VERSION, platform: "browser" });
  const [updateInfo, setUpdateInfo] = useState(null);
  const [updateState, setUpdateState] = useState("idle");
  const [scriptExecutionAllowed, setScriptExecutionAllowed] = useState(false);
  const [scriptTrustState, setScriptTrustState] = useState("restricted");
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportAppName, setExportAppName] = useState("");
  const [exportIcon, setExportIcon] = useState(null);
  const [exportOutputPath, setExportOutputPath] = useState("");
  const [exportTargets, setExportTargets] = useState([]);
  const [exportPipeline, setExportPipeline] = useState("desktop");
  const [mobileBundleId, setMobileBundleId] = useState("com.minyangtech.mytixo");
  const [mobileVersionName, setMobileVersionName] = useState("1.0.0");
  const [mobileIconBackgroundColor, setMobileIconBackgroundColor] = useState("#101713");
  const [exportSettings, setExportSettings] = useState(normalizeExportSettings());
  const [assets, setAssets] = useState([]);
  const [projectFilePath, setProjectFilePath] = useState("");
  const [exportCapabilities, setExportCapabilities] = useState({});
  const [exportBusy, setExportBusy] = useState(false);
  const [interactionState, setInteractionState] = useState({
    pointerDown: false,
    pointerX: 0,
    pointerY: 0,
    keysDown: [],
    clickedIds: [],
    pointerOverId: "",
    fileWatchEvents: {}
  });

  const builderCanvasRef = useRef(null);
  const librarySearchInputRef = useRef(null);
  const lastSnapshotMetaRef = useRef({ mergeKey: "", at: 0 });
  const sidebarRef = useRef(null);
  const nodeCounterRef = useRef(nodeCounter);
  const lastExecutionKeyRef = useRef("");
  const lastActionSignatureRef = useRef("");
  const autoSaveTimerRef = useRef(null);
  const mainGraphRef = useRef(null);
  const uiLinkBootstrapRef = useRef(false);
  const nodeDragStartSnapshotRef = useRef(null);
  const historyRestoreGuardRef = useRef(false);
  const pendingRestoredNodesRef = useRef(null);
  const securityDecisionRef = useRef({ external: "pending", httpsNode: "pending", script: "pending", fileWatcher: "pending" });
  const securityApprovalPromiseRef = useRef({});
  const startupHttpsPreferencePromiseRef = useRef(null);
  const startupUpdateCheckRef = useRef(false);
  const inFlightExternalActionsRef = useRef(new Set());
  const runtimeRevisionRef = useRef(null);
  const dragFrameRef = useRef(null);
  const dragEventRef = useRef(null);
  const [safeModeInfo, setSafeModeInfo] = useState(null);

  const screenToFlowPosition = useCallback(
    (point) => reactFlowRef.current?.screenToFlowPosition(point) || point,
    []
  );
  const setCenter = useCallback((...args) => {
    reactFlowRef.current?.setCenter(...args);
  }, []);
  useEffect(() => {
    nodeCounterRef.current = nodeCounter;
  }, [nodeCounter]);

  useEffect(() => {
    if (!showSettings) return;
    setDraftLanguage(language);
    setDraftThemeKey(themeKey);
    setDraftPreviewDevice(previewDevice);
    setDraftTemplateKey("");
    setDraftHttpsNodesEnabled(httpsNodesEnabled);
  }, [httpsNodesEnabled, language, previewDevice, showSettings, themeKey]);

  const appendLog = useCallback((entry) => {
    setLogs((current) => [...current.slice(-(DEFAULT_LOG_LIMIT - 1)), entry]);
  }, []);

  const resetSecurityState = useCallback(async () => {
    securityDecisionRef.current = { external: "pending", httpsNode: "pending", script: "pending", fileWatcher: "pending" };
    securityApprovalPromiseRef.current = {};
    inFlightExternalActionsRef.current.clear();
    setScriptExecutionAllowed(false);
    setScriptTrustState("restricted");
    await window.ixo?.resetSecurityApprovals?.();
  }, []);

  const requestSecurityApproval = useCallback(async (scope, context = {}) => {
    const currentDecision = securityDecisionRef.current[scope];
    if (currentDecision === "approved") {
      return true;
    }
    if (currentDecision === "denied") {
      return false;
    }
    if (securityApprovalPromiseRef.current[scope]) {
      return securityApprovalPromiseRef.current[scope];
    }

    const approvalPromise = (async () => {
      const result = window.ixo?.requestSecurityApproval
        ? await window.ixo.requestSecurityApproval(scope, context)
        : {
            approved: window.confirm(
              scope === "external"
                ? `네트워크 계열 노드 사용을 동의하십니까?\n\n${NETWORK_SAFETY_NOTICE}`
                : scope === "httpsNode"
                  ? `네트워크 계열 노드 사용을 동의하십니까?\n\n${NETWORK_SAFETY_NOTICE}`
                  : scope === "fileWatcher"
                    ? `이 프로젝트가 로컬 파일 또는 폴더 감시 기능을 사용하려고 합니다.\n\n감시 대상: ${context?.path || "선택한 경로"}`
                    : "This project contains script nodes that require full JavaScript execution. Allow for this session?"
            )
          };
      const approved = Boolean(result?.approved);
      securityDecisionRef.current[scope] = approved ? "approved" : "denied";
      if (scope === "httpsNode" && approved) {
        securityDecisionRef.current.external = "approved";
      }
      if (scope === "script") {
        setScriptExecutionAllowed(approved);
        setScriptTrustState(approved ? "trusted" : "blocked");
      }
      return approved;
    })();

    securityApprovalPromiseRef.current[scope] = approvalPromise;
    try {
      return await approvalPromise;
    } finally {
      delete securityApprovalPromiseRef.current[scope];
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadPreference = async () => {
      try {
        let preferences = await window.ixo?.getSecurityPreferences?.();
        if (typeof preferences?.httpsNodesEnabled !== "boolean") {
          if (!startupHttpsPreferencePromiseRef.current) {
            startupHttpsPreferencePromiseRef.current = window.ixo?.promptStartupHttpsPreference?.();
          }
          preferences = await startupHttpsPreferencePromiseRef.current;
        }

        const enabled = Boolean(preferences?.httpsNodesEnabled);
        if (mounted) {
          setHttpsNodesEnabled(enabled);
          setDraftHttpsNodesEnabled(enabled);
        }
      } catch (error) {
        appendLog(makeLog("error", "HTTPS Nodes", "HTTPS 노드 권한 상태를 불러오지 못했습니다.", String(error.message || error)));
      }
    };

    loadPreference();
    return () => {
      mounted = false;
    };
  }, [appendLog]);

  useEffect(() => {
    let mounted = true;
    const loadExportCapabilities = async () => {
      try {
        const capabilities = await window.ixo?.getExportCapabilities?.();
        if (!mounted || !Array.isArray(capabilities)) return;
        setExportCapabilities(Object.fromEntries(capabilities.map((item) => [item.key, item])));
      } catch (error) {
        appendLog(makeLog("error", "Export", "내보내기 대상 정보를 불러오지 못했습니다.", String(error.message || error)));
      }
    };
    loadExportCapabilities();
    return () => {
      mounted = false;
    };
  }, [appendLog]);

  const exportTargetOptions = useMemo(
    () => (exportPipeline === "mobile" ? MOBILE_EXPORT_TARGET_OPTIONS : DESKTOP_EXPORT_TARGET_OPTIONS).map((target) => {
      const capability = exportCapabilities[target.key];
      const runtimeAvailable = capability?.available !== false;
      return {
        ...target,
        enabled: target.supported && runtimeAvailable,
        note: !target.supported
          ? target.note
          : runtimeAvailable
            ? capability?.note || target.note
            : capability?.reason || "현재 기기에 이 플랫폼 런타임이 준비되어 있지 않습니다."
      };
    }),
    [exportCapabilities, exportPipeline]
  );

  useEffect(() => {
    let pointerFrame = 0;
    let latestPointer = null;
    const handlePointerDown = (event) => {
      setInteractionState((current) => ({
        ...current,
        pointerDown: true,
        pointerX: event.clientX,
        pointerY: event.clientY
      }));
    };
    const handlePointerUp = (event) => {
      setInteractionState((current) => ({
        ...current,
        pointerDown: false,
        pointerX: event.clientX,
        pointerY: event.clientY
      }));
    };
    const handlePointerMove = (event) => {
      latestPointer = { x: event.clientX, y: event.clientY };
      if (pointerFrame) return;
      pointerFrame = window.requestAnimationFrame(() => {
        pointerFrame = 0;
        if (!latestPointer) return;
        setInteractionState((current) => ({
          ...current,
          pointerX: latestPointer.x,
          pointerY: latestPointer.y
        }));
      });
    };
    const handleKeyDown = (event) => {
      setInteractionState((current) => ({
        ...current,
        keysDown: current.keysDown.includes(event.key.toLowerCase())
          ? current.keysDown
          : [...current.keysDown, event.key.toLowerCase()]
      }));
    };
    const handleKeyUp = (event) => {
      setInteractionState((current) => ({
        ...current,
        keysDown: current.keysDown.filter((key) => key !== event.key.toLowerCase())
      }));
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (pointerFrame) {
        window.cancelAnimationFrame(pointerFrame);
      }
    };
  }, []);

  useEffect(() => {
    if (!window.ixo?.onWatchEvent) return undefined;
    return window.ixo.onWatchEvent((event) => {
      setInteractionState((current) => ({
        ...current,
        fileWatchEvents: {
          ...current.fileWatchEvents,
          [event.path]: event,
          [event.requestedPath || event.path]: event
        }
      }));
    });
  }, []);

  const requestSecureHttps = useCallback(async (rawUrl) => {
    if (!httpsNodesEnabled) {
      throw new Error("HTTPS nodes are disabled in Settings.");
    }

    const validation = validateClientHttpsUrl(rawUrl);
    if (!validation.ok) {
      throw new Error(validation.error);
    }

    const approved = await requestSecurityApproval("external");
    if (!approved) {
      throw new Error("External actions were blocked by the user.");
    }

    if (window.ixo?.requestHttps) {
      return window.ixo.requestHttps(validation.url);
    }

    const response = await fetchWithTimeout(validation.url);
    return {
      ok: response.ok,
      status: response.status,
      url: validation.url
    };
  }, [httpsNodesEnabled, requestSecurityApproval]);

  const openSecureExternalUrl = useCallback(async (rawUrl) => {
    const validation = validateClientHttpsUrl(rawUrl);
    if (!validation.ok) {
      throw new Error(validation.error);
    }

    const approved = await requestSecurityApproval("external");
    if (!approved) {
      throw new Error("External actions were blocked by the user.");
    }

    if (window.ixo?.openExternal) {
      await window.ixo.openExternal(validation.url);
      return validation.url;
    }

    window.open(validation.url, "_blank", "noopener,noreferrer");
    return validation.url;
  }, [requestSecurityApproval]);

  const runtimeFunctions = useMemo(() => (
    activeFunctionId
      ? functions.map((item) => (
          item.id === activeFunctionId
            ? {
                ...item,
                nodes,
                edges,
                inputValues,
                nodeCounter: nodeCounterRef.current
              }
            : item
        ))
      : functions
  ), [activeFunctionId, edges, functions, inputValues, nodes]);

  const runtime = useMemo(
    () => runPipeline(nodes, edges, inputValues, paused, scriptExecutionAllowed, interactionState, runtimeFunctions),
    [edges, inputValues, interactionState, nodes, paused, runtimeFunctions, scriptExecutionAllowed]
  );
  const runtimeRevision = useMemo(
    () => createRuntimeRevision(nodes, edges, inputValues, runtimeRevisionRef.current),
    [edges, inputValues, nodes]
  );
  useEffect(() => {
    runtimeRevisionRef.current = runtimeRevision;
  }, [runtimeRevision]);
  const runtimeExecutionKey = useMemo(
    () => JSON.stringify({ activeNodeIds: runtime.activeNodeIds, activeEdgeIds: runtime.activeEdgeIds, liveValues: runtime.liveValues, paused }),
    [paused, runtime.activeEdgeIds, runtime.activeNodeIds, runtime.liveValues]
  );

  const nodesWithTrace = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          displayLabel: getNodeLabel(node.data?.nodeType, language, node.data?.label),
          displayCategory: getGroupLabel(node.data?.kind, language),
          liveValue: runtime.liveValues[node.id] ?? "",
          isActive: runtime.activeNodeIds.includes(node.id),
          isFocused: runtime.focusedNodeId === node.id,
          executionOrder: runtime.topo.indexOf(node.id) >= 0 ? runtime.topo.indexOf(node.id) + 1 : null
        }
      })),
    [language, nodes, runtime.activeNodeIds, runtime.focusedNodeId, runtime.liveValues, runtime.topo]
  );

  const flowJson = useMemo(
    () => JSON.stringify({ nodes, edges, inputValues, uiElements }, null, 2),
    [nodes, edges, inputValues, uiElements]
  );

  const selectedNode = useMemo(() => nodes.find((node) => node.id === selectedNodeId) || null, [nodes, selectedNodeId]);
  const selectedFunctionDefinition = useMemo(
    () => functions.find((item) => item.id === selectedNode?.data?.functionId) || null,
    [functions, selectedNode]
  );
  const selectedUiElement = useMemo(
    () => uiElements.find((item) => item.id === selectedUiElementId) || null,
    [uiElements, selectedUiElementId]
  );
  const fullScriptNodeCount = useMemo(
    () => nodes.filter((node) => node.data?.nodeType === "script" && !canRunRestrictedScript(node.data?.value)).length,
    [nodes]
  );
  const selectedScriptRequiresFullJs = Boolean(
    selectedNode?.data?.nodeType === "script"
      && !canRunRestrictedScript(selectedNode.data?.value)
  );
  const themeOptions = useMemo(() => ({ ...THEME_OPTIONS, ...customThemes }), [customThemes]);
  const currentTheme = themeOptions[themeKey] || THEME_OPTIONS.mint;
  const sceneNames = useMemo(() => {
    const names = new Set(["main", activeScene]);
    uiElements.forEach((element) => names.add(String(element.scene || "main")));
    return [...names].filter(Boolean).sort((a, b) => (a === "main" ? -1 : b === "main" ? 1 : a.localeCompare(b)));
  }, [activeScene, uiElements]);
  const uiText = UI_TEXT[language] || UI_TEXT.ko;
  const uiRenderStats = useMemo(
    () => createCanvasRenderStats(uiElements, { x: 0, y: 0, width: 1280, height: 720 }),
    [uiElements]
  );
  const trustLabel = scriptTrustState === "trusted"
    ? uiText.trustTrusted
    : scriptTrustState === "blocked"
      ? uiText.trustBlocked
      : scriptTrustState === "review"
        ? uiText.trustReview
        : uiText.trustRestricted;
  const trustHint = scriptTrustState === "trusted"
    ? uiText.trustTrustedHint
    : scriptTrustState === "blocked"
      ? uiText.trustBlockedHint
      : scriptTrustState === "review"
        ? uiText.trustReviewHint
        : uiText.trustRestrictedHint;

  useEffect(() => {
    if (fullScriptNodeCount === 0) {
      setScriptTrustState("restricted");
      return;
    }
    if (scriptExecutionAllowed) {
      setScriptTrustState("trusted");
      return;
    }
    setScriptTrustState((current) => (current === "blocked" ? "blocked" : "review"));
  }, [fullScriptNodeCount, scriptExecutionAllowed]);

  const normalizedLibrarySearchTerm = librarySearchTerm.trim().toLowerCase();
  const functionLibraryItems = useMemo(
    () => functions.map((item) => ({
      key: `function-call-${item.id}`,
      label: item.name,
      group: "function",
      type: "function-call",
      functionId: item.id
    })),
    [functions]
  );

  const visibleLibraryItems = useMemo(() => {
    const source = normalizedLibrarySearchTerm
      ? [...Object.values(LIBRARY_TABS).flat(), ...functionLibraryItems]
      : libraryTab === "functions"
        ? functionLibraryItems
        : LIBRARY_TABS[libraryTab];

    if (!normalizedLibrarySearchTerm) {
      return source;
    }

    return source.filter((item) => {
      const translatedLabel = getNodeLabel(item.type, language, item.label);
      return [translatedLabel, item.label, item.type, item.group]
        .some((value) => String(value || "").toLowerCase().includes(normalizedLibrarySearchTerm));
    });
  }, [functionLibraryItems, language, libraryTab, normalizedLibrarySearchTerm]);

  const sidebarGroups = useMemo(() => {
    const list = visibleLibraryItems;
    return list.reduce((acc, item) => {
      acc[item.group] = [...(acc[item.group] || []), item];
      return acc;
    }, {});
  }, [visibleLibraryItems]);

  const visibleLibraryNodeCount = visibleLibraryItems.length;

  const searchCandidates = useMemo(
    () =>
      [...Object.values(LIBRARY_TABS).flat(), ...functionLibraryItems]
        .filter((item) => getNodeLabel(item.type, language, item.label).toLowerCase().includes(searchTerm.toLowerCase())),
    [functionLibraryItems, language, searchTerm]
  );

  const nodeTypes = useMemo(() => ({ ixoNode: IXONode, ixoGroup: IXOGroupNode }), []);

  // [이력 저장] 의미 있는 편집 직전마다 상태를 보관해 Undo/Redo를 안정적으로 유지합니다.
  const getSerializableProject = useCallback(() => {
    const serializedFunctions = activeFunctionId
      ? functions.map((item) => (
          item.id === activeFunctionId
            ? {
                ...item,
                nodes,
                edges,
                inputValues,
                nodeCounter: nodeCounterRef.current
              }
            : item
        ))
      : functions;
    const mainGraph = activeFunctionId
      ? mainGraphRef.current || getDefaultProjectState()
      : { nodes, edges, inputValues, nodeCounter: nodeCounterRef.current };

    return {
      schemaVersion: PROJECT_SCHEMA_VERSION,
      nodes: mainGraph.nodes,
      edges: mainGraph.edges,
      inputValues: mainGraph.inputValues,
      nodeCounter: mainGraph.nodeCounter,
      uiElements,
      functions: serializedFunctions,
      activeScene,
      assets,
      exportSettings: normalizeExportSettings(exportSettings),
      customThemes,
      viewMode,
      language,
      themeKey,
      previewDevice,
      savedAt: Date.now()
    };
  }, [activeFunctionId, activeScene, assets, customThemes, edges, exportSettings, functions, inputValues, language, nodes, previewDevice, themeKey, uiElements, viewMode]);

  const snapshot = useCallback(({ mergeKey = "" } = {}) => {
    const now = Date.now();
    const canMerge = Boolean(
      mergeKey
      && lastSnapshotMetaRef.current.mergeKey === mergeKey
      && now - lastSnapshotMetaRef.current.at <= HISTORY_MERGE_WINDOW_MS
    );
    setHistory((current) => (
      canMerge
        ? current
        : [...current.slice(-79), cloneState(nodes, edges, inputValues, nodeCounterRef.current, uiElements, functions, activeFunctionId, activeScene, assets, exportSettings, customThemes)]
    ));
    setFuture([]);
    lastSnapshotMetaRef.current = { mergeKey, at: now };
  }, [activeFunctionId, activeScene, assets, customThemes, edges, exportSettings, functions, inputValues, nodes, uiElements]);

  // [이력 적용] 되돌리기 시 복구할 상태를 일관된 방식으로 반영합니다.
  const applyState = useCallback((state) => {
    const nextNodes = applyNodeSelectionState(state.nodes, []);
    historyRestoreGuardRef.current = true;
    pendingRestoredNodesRef.current = nextNodes;
    setNodes(nextNodes);
    setEdges((state.edges || []).map((edge) => ({ ...edge, selected: false })));
    setInputValues(state.inputValues || {});
    setUiElements(normalizeUiElements(state.uiElements || []));
    setFunctions(normalizeFunctions(state.functions || []));
    setActiveScene(state.activeScene || "main");
    setAssets(Array.isArray(state.assets) ? state.assets : []);
    setExportSettings(normalizeExportSettings(state.exportSettings || {}));
    setCustomThemes(state.customThemes && typeof state.customThemes === "object" ? state.customThemes : {});
    setNodeCounter(state.nodeCounter || 1);
    nodeCounterRef.current = state.nodeCounter || 1;
    setActiveFunctionId(state.activeFunctionId || null);
    mainGraphRef.current = null;
    setSelectedNodeId(null);
    setSelectedNodeIds([]);
    setSelectedEdgeIds([]);
    setSelectedUiElementId(null);
    setFlowRevision((current) => current + 1);
    window.setTimeout(() => {
      historyRestoreGuardRef.current = false;
      pendingRestoredNodesRef.current = null;
    }, 1000);
  }, [setEdges, setNodes]);

  // [프로젝트 저장 브리지] Electron 메인 프로세스가 현재 프로젝트를 알고 있도록 동기화합니다.
  useEffect(() => {
    window.ixo?.setDirtyState?.({
      isDirty,
      project: {
        ...getSerializableProject()
      }
    });
  }, [getSerializableProject, isDirty]);

  // [로컬 자동 저장] 작업 상태를 브라우저 로컬 저장소에 주기적으로 반영합니다.
  useEffect(() => {
    const payload = getSerializableProject();

    window.clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = window.setTimeout(() => {
      try {
        const previousRaw = window.localStorage?.getItem(LOCAL_AUTOSAVE_KEY);
        const previous = previousRaw ? parseStoredProject(previousRaw) : null;
        if (previous?.ok) {
          const rawBackups = window.localStorage?.getItem(LOCAL_BACKUPS_KEY);
          const parsedBackups = rawBackups ? JSON.parse(rawBackups) : [];
          const backups = Array.isArray(parsedBackups) ? parsedBackups : [];
          const nextBackups = [
            {
              savedAt: previous.data.savedAt || Date.now(),
              payload: previous.data
            },
            ...backups
          ].slice(0, MAX_LOCAL_BACKUPS);
          window.localStorage?.setItem(LOCAL_BACKUPS_KEY, JSON.stringify(nextBackups));
        }
        window.localStorage?.setItem(LOCAL_AUTOSAVE_KEY, JSON.stringify(payload));
      } catch (error) {
        appendLog(makeLog("error", "Local Auto-Save", "자동 저장에 실패했습니다.", String(error.message || error)));
      }
    }, 250);

    return () => window.clearTimeout(autoSaveTimerRef.current);
  }, [appendLog, getSerializableProject]);

  // [로컬 자동 복구] 새로고침이나 재실행 뒤 마지막 작업 상태를 복구합니다.
  useEffect(() => {
    try {
      const raw = window.localStorage?.getItem(LOCAL_AUTOSAVE_KEY);
      if (!raw) return;
      const parsed = parseStoredProject(raw);
      let restored = parsed.ok ? parsed.data : null;
      let recoverySource = parsed.ok ? "autosave" : "";

      if (!restored) {
        const rawBackups = window.localStorage?.getItem(LOCAL_BACKUPS_KEY);
        const backups = rawBackups ? JSON.parse(rawBackups) : [];
        const validBackup = Array.isArray(backups)
          ? backups.map((entry) => parseStoredProject(entry.payload)).find((entry) => entry.ok)
          : null;
        if (validBackup?.ok) {
          restored = validBackup.data;
          recoverySource = "backup";
        }
      }

      if (!restored) {
        restored = getDefaultProjectState();
        recoverySource = "reset";
      }

      applyState(restored);
      if (recoverySource !== "autosave") {
        setSafeModeInfo({
          active: true,
          source: recoverySource,
          message: recoverySource === "backup"
            ? "자동 저장이 손상되어 가장 최근 백업으로 복구했습니다."
            : "자동 저장과 백업을 복구할 수 없어 안전한 기본 상태로 초기화했습니다."
        });
        window.localStorage?.setItem(LOCAL_SAFE_MODE_KEY, JSON.stringify({ source: recoverySource, at: Date.now() }));
      }
      if (restored.viewMode) setViewMode(restored.viewMode);
      if (restored.language) setLanguage(restored.language);
      if (restored.themeKey) setThemeKey(restored.themeKey);
      if (restored.previewDevice) setPreviewDevice(restored.previewDevice);
      if (restored.language) setDraftLanguage(restored.language);
      if (restored.themeKey) setDraftThemeKey(restored.themeKey);
      if (restored.previewDevice) setDraftPreviewDevice(restored.previewDevice);
      setStatus("Local auto-save restored.");
      appendLog(makeLog("info", "Local Auto-Save", "로컬 자동 저장 상태를 복구했습니다."));
    } catch (error) {
      appendLog(makeLog("error", "Local Auto-Save", "로컬 자동 저장 복구에 실패했습니다.", String(error.message || error)));
    }
  }, [appendLog, applyState]);

  useEffect(() => {
    if (!toastMessage) return undefined;
    const timer = window.setTimeout(() => setToastMessage(""), 1800);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  // [실행 로그] 같은 실행 결과를 중복 기록하지 않도록 서명을 비교해 콘솔에 누적합니다.
  useEffect(() => {
    if (lastExecutionKeyRef.current === runtimeExecutionKey) return;
    lastExecutionKeyRef.current = runtimeExecutionKey;
    runtime.events.forEach((entry) => appendLog(entry));
  }, [appendLog, runtime.events, runtimeExecutionKey]);

  useEffect(() => {
    if (paused || scriptExecutionAllowed) return;
    const activeScriptNode = nodes.find(
      (node) => runtime.activeNodeIds.includes(node.id)
        && node.data?.nodeType === "script"
        && !canRunRestrictedScript(node.data?.value)
    );
    if (!activeScriptNode) return;

    requestSecurityApproval("script").then((approved) => {
      if (!approved) {
        appendLog(makeLog("error", activeScriptNode.data?.label || "Script", "스크립트 실행이 차단되었습니다."));
      }
    });
  }, [appendLog, nodes, paused, requestSecurityApproval, runtime.activeNodeIds, scriptExecutionAllowed]);

  useEffect(() => {
    if (!window.ixo?.watchPath) return undefined;
    const watcherNodes = nodes.filter((node) => node.data?.nodeType === "file-watcher" && node.data?.value);
    const activePaths = watcherNodes.map((node) => String(node.data.value));
    let disposed = false;

    const startWatchers = async () => {
      if (!activePaths.length) return;
      const approved = await requestSecurityApproval("fileWatcher", { path: activePaths[0] });
      if (!approved || disposed) {
        if (!approved) {
          appendLog(makeLog("error", "File Watcher", "파일 감시 권한이 거부되어 감시를 시작하지 않았습니다."));
        }
        return;
      }

      activePaths.forEach((targetPath) => {
        window.ixo.watchPath(targetPath).catch((error) => {
          appendLog(makeLog("error", "File Watcher", `감시 시작 실패: ${targetPath}`, String(error.message || error)));
        });
      });
    };

    startWatchers();

    return () => {
      disposed = true;
      activePaths.forEach((targetPath) => {
        window.ixo?.unwatchPath?.(targetPath);
      });
    };
  }, [appendLog, nodes, requestSecurityApproval]);

  // [외부 액션] HTTPS 요청과 브라우저 열기 노드가 활성화된 경우 한 번만 실행합니다.
  useEffect(() => {
    if (paused) return;

    const signatures = [];
    const activeTargets = new Set(
      runtime.activeEdgeIds
        .map((id) => edges.find((edge) => edge.id === id)?.target)
        .filter(Boolean)
    );

    const runActions = async () => {
      for (const node of nodes) {
        if (!activeTargets.has(node.id)) continue;
        if (node.data?.nodeType === "http" && node.data?.value) {
          const rawUrl = applyTemplate(node.data.value, runtime.context);
          const validation = validateClientHttpsUrl(rawUrl);
          const signatureUrl = validation.ok ? validation.url : rawUrl;
          const signature = `https:${node.id}:${signatureUrl}`;
          signatures.push(signature);
          if (lastActionSignatureRef.current.includes(`|${signature}|`)) continue;
          if (inFlightExternalActionsRef.current.has(signature)) continue;

          inFlightExternalActionsRef.current.add(signature);
          try {
            if (!validation.ok) {
              throw new Error(validation.error);
            }
            const result = await requestSecureHttps(validation.url);
            if (!result.ok) {
              throw new Error(`HTTPS request failed with status ${result.status}.`);
            }
            const maskedUrl = maskUrlForLog(validation.url);
            setStatus(`HTTPS request OK: ${maskedUrl}`);
            appendLog(makeLog("info", node.data?.label || "HTTPS Request", `요청 성공: ${maskedUrl}`));
          } catch (error) {
            const maskedUrl = validation.ok ? maskUrlForLog(validation.url) : "[blocked url]";
            setStatus(`HTTPS request blocked: ${maskedUrl}`);
            appendLog(makeLog("error", node.data?.label || "HTTPS Request", `요청 차단: ${maskedUrl}`, String(error.message || error)));
          } finally {
            inFlightExternalActionsRef.current.delete(signature);
          }
        }

        if (node.data?.nodeType === "browser" && node.data?.value) {
          const rawUrl = applyTemplate(node.data.value, runtime.context);
          const validation = validateClientHttpsUrl(rawUrl);
          const signatureUrl = validation.ok ? validation.url : rawUrl;
          const signature = `browser:${node.id}:${signatureUrl}`;
          signatures.push(signature);
          if (lastActionSignatureRef.current.includes(`|${signature}|`)) continue;
          if (inFlightExternalActionsRef.current.has(signature)) continue;

          inFlightExternalActionsRef.current.add(signature);
          try {
            if (!validation.ok) {
              throw new Error(validation.error);
            }
            const openedUrl = await openSecureExternalUrl(validation.url);
            const maskedUrl = maskUrlForLog(openedUrl);
            setStatus(`Opened browser: ${maskedUrl}`);
            appendLog(makeLog("info", node.data?.label || "Browser Open", `외부 브라우저 열기: ${maskedUrl}`));
          } catch (error) {
            const maskedUrl = validation.ok ? maskUrlForLog(validation.url) : "[blocked url]";
            setStatus(`Browser open blocked: ${maskedUrl}`);
            appendLog(makeLog("error", node.data?.label || "Browser Open", `외부 브라우저 열기 차단: ${maskedUrl}`, String(error.message || error)));
          } finally {
            inFlightExternalActionsRef.current.delete(signature);
          }
        }
      }

      lastActionSignatureRef.current = signatures.length ? `|${signatures.join("|")}|` : "";
    };

    runActions();
  }, [appendLog, edges, nodes, openSecureExternalUrl, paused, requestSecureHttps, runtime.activeEdgeIds, runtime.context]);

  // [Builder 드래그 이동] 선택된 UI 요소를 캔버스 안에서 직접 옮길 수 있게 합니다.
  useEffect(() => {
    if (!dragState) return undefined;

    const applyDragFrame = () => {
      const event = dragEventRef.current;
      dragFrameRef.current = null;
      if (!event) return;
      const canvas = builderCanvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      if (dragState.mode === "resize") {
        const nextWidth = Math.max(48, Math.min(dragState.startWidth + event.clientX - dragState.startClientX, rect.width - dragState.startX));
        const nextHeight = Math.max(32, Math.min(dragState.startHeight + event.clientY - dragState.startClientY, rect.height - dragState.startY));

        setUiElements((current) =>
          current.map((item) => (
            item.id === dragState.id
              ? { ...item, width: Math.round(nextWidth), height: Math.round(nextHeight) }
              : item
          ))
        );
        return;
      }

      const maxX = Math.max(0, rect.width - Math.max(32, dragState.startWidth || 32));
      const maxY = Math.max(0, rect.height - Math.max(32, dragState.startHeight || 32));
      const nextX = Math.max(0, Math.min(event.clientX - rect.left - dragState.offsetX, maxX));
      const nextY = Math.max(0, Math.min(event.clientY - rect.top - dragState.offsetY, maxY));

      setUiElements((current) =>
        current.map((item) => (
          item.id === dragState.id
            ? { ...item, x: Math.round(nextX), y: Math.round(nextY) }
            : item
          ))
        );
    };

    const handlePointerMove = (event) => {
      dragEventRef.current = {
        clientX: event.clientX,
        clientY: event.clientY
      };
      if (dragFrameRef.current) return;
      dragFrameRef.current = window.requestAnimationFrame(applyDragFrame);
    };

    const handlePointerUp = () => {
      if (dragFrameRef.current) {
        window.cancelAnimationFrame(dragFrameRef.current);
        dragFrameRef.current = null;
      }
      dragEventRef.current = null;
      setDragState(null);
      setIsDirty(true);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      if (dragFrameRef.current) {
        window.cancelAnimationFrame(dragFrameRef.current);
        dragFrameRef.current = null;
      }
    };
  }, [dragState]);

  // [단축키] 저장, 되돌리기, 복제, 삭제, 그룹화를 키보드로 바로 사용할 수 있습니다.
  const undo = useCallback(() => {
    setHistory((current) => {
      if (current.length === 0) return current;
      const previous = current[current.length - 1];
      setFuture((futureState) => [...futureState, cloneState(nodes, edges, inputValues, nodeCounterRef.current, uiElements, functions, activeFunctionId, activeScene, assets, exportSettings, customThemes)]);
      applyState(previous);
      setIsDirty(true);
      setStatus("Undo applied.");
      lastSnapshotMetaRef.current = { mergeKey: "", at: 0 };
      return current.slice(0, -1);
    });
  }, [activeFunctionId, activeScene, applyState, assets, customThemes, edges, exportSettings, functions, inputValues, nodes, uiElements]);

  const redo = useCallback(() => {
    setFuture((current) => {
      if (current.length === 0) return current;
      const next = current[current.length - 1];
      setHistory((historyState) => [...historyState, cloneState(nodes, edges, inputValues, nodeCounterRef.current, uiElements, functions, activeFunctionId, activeScene, assets, exportSettings, customThemes)]);
      applyState(next);
      setIsDirty(true);
      setStatus("Redo applied.");
      lastSnapshotMetaRef.current = { mergeKey: "", at: 0 };
      return current.slice(0, -1);
    });
  }, [activeFunctionId, activeScene, applyState, assets, customThemes, edges, exportSettings, functions, inputValues, nodes, uiElements]);

  const updateInputValue = useCallback((nodeId, value) => {
    setInputValues((current) => ({ ...current, [nodeId]: value }));
    setIsDirty(true);
  }, []);

  const toggleSection = (name) => setCollapsed((current) => ({ ...current, [name]: !current[name] }));

  const createNodeId = useCallback(() => {
    const nextId = `node-${nodeCounterRef.current}`;
    nodeCounterRef.current += 1;
    setNodeCounter(nodeCounterRef.current);
    return nextId;
  }, []);

  const makeNode = useCallback((nodeDef, position) => {
    const nodeType = nodeDef.type || nodeDef.key;
    const id = createNodeId();
    return {
      id,
      type: nodeType === "group" ? "ixoGroup" : "ixoNode",
      position,
      data: {
        label: nodeDef.label,
        kind: nodeDef.group,
        category: nodeDef.group.toUpperCase(),
        value: getDefaultNodeValue(nodeType, nodeDef.label),
        nodeType,
        permissionScope: getNodePermissionScope(nodeType),
        refKey: `${nodeType.replace(/[^a-z0-9]/gi, "").toLowerCase()}${id.replace("node-", "")}`,
        groupLabel: "",
        ...(nodeDef.functionId ? { functionId: nodeDef.functionId, functionArgs: {} } : {})
      }
    };
  }, [createNodeId]);

  const getCommittedFunctions = useCallback(() => (
    activeFunctionId
      ? functions.map((item) => (
          item.id === activeFunctionId
            ? {
                ...item,
                nodes,
                edges,
                inputValues,
                nodeCounter: nodeCounterRef.current
              }
            : item
        ))
      : functions
  ), [activeFunctionId, edges, functions, inputValues, nodes]);

  const loadGraphIntoEditor = useCallback((graph) => {
    setNodes(applyNodeSelectionState(graph.nodes || [], []));
    setEdges((graph.edges || []).map((edge) => ({ ...edge, selected: false })));
    setInputValues(graph.inputValues || {});
    setNodeCounter(graph.nodeCounter || 1);
    nodeCounterRef.current = graph.nodeCounter || 1;
    setSelectedNodeId(null);
    setSelectedNodeIds([]);
    setSelectedEdgeIds([]);
    setSelectedUiElementId(null);
    lastSnapshotMetaRef.current = { mergeKey: "", at: 0 };
  }, [setEdges, setNodes]);

  const enterFunctionEditor = useCallback((functionId) => {
    const committedFunctions = getCommittedFunctions();
    const target = committedFunctions.find((item) => item.id === functionId);
    if (!target) return;

    snapshot();
    if (!activeFunctionId) {
      mainGraphRef.current = {
        nodes,
        edges,
        inputValues,
        nodeCounter: nodeCounterRef.current
      };
    }
    setFunctions(committedFunctions);
    loadGraphIntoEditor(target);
    setActiveFunctionId(functionId);
    setLibraryTab("functions");
    setStatus(`Editing function: ${target.name}`);
  }, [activeFunctionId, edges, getCommittedFunctions, inputValues, loadGraphIntoEditor, nodes, snapshot]);

  const exitFunctionEditor = useCallback(() => {
    if (!activeFunctionId) return;

    snapshot();
    setFunctions(getCommittedFunctions());
    const mainGraph = mainGraphRef.current || getDefaultProjectState();
    loadGraphIntoEditor(mainGraph);
    mainGraphRef.current = null;
    setActiveFunctionId(null);
    setStatus("Returned to main workspace.");
  }, [activeFunctionId, getCommittedFunctions, loadGraphIntoEditor, snapshot]);

  const createFunction = useCallback(() => {
    snapshot();
    const definition = createFunctionDefinition(functions.length + 1);
    const committedFunctions = [...getCommittedFunctions(), definition];
    if (!activeFunctionId) {
      mainGraphRef.current = {
        nodes,
        edges,
        inputValues,
        nodeCounter: nodeCounterRef.current
      };
    }
    setFunctions(committedFunctions);
    loadGraphIntoEditor(definition);
    setActiveFunctionId(definition.id);
    setLibraryTab("functions");
    setStatus(`Function created: ${definition.name}`);
    setIsDirty(true);
  }, [activeFunctionId, edges, functions.length, getCommittedFunctions, inputValues, loadGraphIntoEditor, nodes, snapshot]);

  const renameFunction = useCallback((functionId, name) => {
    snapshot({ mergeKey: `function:${functionId}:name` });
    const nextName = String(name || "").trim() || "function";
    setFunctions((current) => current.map((item) => (
      item.id === functionId
        ? { ...item, name: nextName }
        : item
    )));
    setIsDirty(true);
  }, [snapshot]);

  const updateFunctionSignature = useCallback((functionId, field, value) => {
    snapshot({ mergeKey: `function:${functionId}:${field}` });
    setFunctions((current) => current.map((item) => (
      item.id === functionId
        ? {
            ...item,
            [field]: value
          }
        : item
    )));
    setIsDirty(true);
  }, [snapshot]);

  const addFunctionParameter = useCallback((functionId) => {
    setFunctions((current) => current.map((item) => (
      item.id === functionId
        ? {
            ...item,
            parameters: [
              ...item.parameters,
              createFunctionParameter(item.parameters.length + 1)
            ]
          }
        : item
    )));
    setIsDirty(true);
  }, []);

  const updateFunctionParameter = useCallback((functionId, parameterId, field, value) => {
    snapshot({ mergeKey: `function:${functionId}:parameter:${parameterId}:${field}` });
    setFunctions((current) => current.map((item) => (
      item.id === functionId
        ? {
            ...item,
            parameters: item.parameters.map((parameter) => (
              parameter.id === parameterId
                ? { ...parameter, [field]: value }
                : parameter
            ))
          }
        : item
    )));
    setIsDirty(true);
  }, [snapshot]);

  const removeFunctionParameter = useCallback((functionId, parameterId) => {
    setFunctions((current) => current.map((item) => (
      item.id === functionId
        ? {
            ...item,
            parameters: item.parameters.filter((parameter) => parameter.id !== parameterId)
          }
        : item
    )));
    setIsDirty(true);
  }, []);

  const updateNodeFunctionArg = useCallback((parameterId, value) => {
    if (!selectedNode || selectedNode.data?.nodeType !== "function-call") return;
    snapshot({ mergeKey: `node:${selectedNode.id}:functionArg:${parameterId}` });
    setNodes((current) => current.map((node) => (
      node.id === selectedNode.id
        ? {
            ...node,
            data: {
              ...node.data,
              functionArgs: {
                ...(node.data.functionArgs || {}),
                [parameterId]: value
              }
            }
          }
        : node
    )));
    setIsDirty(true);
  }, [selectedNode, setNodes, snapshot]);

  const deleteFunction = useCallback((functionId) => {
    snapshot();
    const nextFunctions = getCommittedFunctions().filter((item) => item.id !== functionId);
    setFunctions(nextFunctions);
    setNodes((current) => current.filter((node) => node.data?.functionId !== functionId));
    setEdges((current) => current.filter((edge) => {
      const source = nodes.find((node) => node.id === edge.source);
      const target = nodes.find((node) => node.id === edge.target);
      return source?.data?.functionId !== functionId && target?.data?.functionId !== functionId;
    }));
    if (activeFunctionId === functionId) {
      const mainGraph = mainGraphRef.current || getDefaultProjectState();
      loadGraphIntoEditor(mainGraph);
      mainGraphRef.current = null;
      setActiveFunctionId(null);
    }
    setStatus("Function removed.");
    setIsDirty(true);
  }, [activeFunctionId, getCommittedFunctions, loadGraphIntoEditor, nodes, setEdges, setNodes, snapshot]);

  // [UI ↔ Node 동기화] 모든 Canvas UI가 메인 워크스페이스의 기존 표준 노드와 1:1로 연결되도록 유지합니다.
  useEffect(() => {
    if (activeFunctionId || historyRestoreGuardRef.current) return;

    const nodeMap = new Map(nodes.map((node) => [node.id, node]));
    const elementMap = new Map(uiElements.map((element) => [element.id, element]));
    const alreadyLinkedNodeIds = new Set(uiElements.map((element) => element.linkedNodeId).filter((nodeId) => nodeMap.has(nodeId)));
    const staleOrUnlinkedElements = uiElements.filter((element) => !element.linkedNodeId || !nodeMap.has(element.linkedNodeId));
    const availableNodes = nodes.filter((node) => (
      isUiLinkedNodeType(node.data?.nodeType)
      && !alreadyLinkedNodeIds.has(node.id)
      && (!node.data?.linkedUiElementId || !elementMap.has(node.data.linkedUiElementId))
    ));

    if (staleOrUnlinkedElements.length && availableNodes.length) {
      const remainingNodes = [...availableNodes];
      const matchedPairs = [];

      staleOrUnlinkedElements.forEach((element) => {
        let bestIndex = -1;
        let bestScore = -1;

        remainingNodes.forEach((node, index) => {
          const score = getUiNodeMatchScore(element, node);
          if (score > bestScore) {
            bestScore = score;
            bestIndex = index;
          }
        });

        if (bestIndex >= 0 && bestScore >= 1) {
          const [node] = remainingNodes.splice(bestIndex, 1);
          matchedPairs.push({ elementId: element.id, nodeId: node.id });
        }
      });

      if (matchedPairs.length) {
        const nodeByElementId = Object.fromEntries(matchedPairs.map((pair) => [pair.elementId, pair.nodeId]));
        const elementByNodeId = Object.fromEntries(matchedPairs.map((pair) => [pair.nodeId, pair.elementId]));
        setUiElements((current) =>
          current.map((element) => (
            nodeByElementId[element.id]
              ? { ...element, linkedNodeId: nodeByElementId[element.id] }
              : element
          ))
        );
        setNodes((current) =>
          current.map((node) => (
            elementByNodeId[node.id]
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    linkedUiElementId: elementByNodeId[node.id]
                  }
                }
              : node
          ))
        );
        if (uiLinkBootstrapRef.current) {
          setIsDirty(true);
        }
        uiLinkBootstrapRef.current = true;
        return;
      }
    }

    const missingElements = uiElements.filter((element) => !element.linkedNodeId || !nodeMap.has(element.linkedNodeId));

    if (missingElements.length) {
      const createdNodes = missingElements.map((element, index) => {
        const definition = getUiNodeDefinition(element.kind);
        const node = makeNode(definition, {
          x: 980,
          y: 120 + (uiElements.length + index) * 92
        });
        return {
          elementId: element.id,
          node: {
            ...node,
            data: {
              ...node.data,
              ...getUiNodePatch(element),
              refKey: node.data.refKey
            }
          }
        };
      });

      const linkByElementId = Object.fromEntries(createdNodes.map((item) => [item.elementId, item.node.id]));
      setUiElements((current) =>
        current.map((element) => (
          linkByElementId[element.id]
            ? { ...element, linkedNodeId: linkByElementId[element.id] }
            : element
        ))
      );
      setNodes((current) => [...current, ...createdNodes.map((item) => item.node)]);
      if (uiLinkBootstrapRef.current) {
        setIsDirty(true);
      }
      uiLinkBootstrapRef.current = true;
      return;
    }

    const linkedNodeIds = new Set(uiElements.map((element) => element.linkedNodeId).filter(Boolean));
    const orphanedUiNodes = nodes.filter((node) => (
      isUiLinkedNodeType(node.data?.nodeType)
      && !linkedNodeIds.has(node.id)
    ));

    if (orphanedUiNodes.length) {
      const createdElements = orphanedUiNodes.map((node, index) => createUiElementFromNode(node, index, currentTheme.accent));
      const linkByNodeId = Object.fromEntries(createdElements.map((element) => [element.linkedNodeId, element.id]));

      setUiElements((current) => [...current, ...createdElements]);
      setNodes((current) =>
        current.map((node) => (
          linkByNodeId[node.id]
            ? {
                ...node,
                data: {
                  ...node.data,
                  linkedUiElementId: linkByNodeId[node.id]
                }
              }
            : node
        ))
      );
      if (uiLinkBootstrapRef.current) {
        setIsDirty(true);
      }
      uiLinkBootstrapRef.current = true;
      return;
    }

    let changed = false;
    const nextNodes = nodes.map((node) => {
      const linkedElement = uiElements.find((element) => element.linkedNodeId === node.id);
      if (!linkedElement) return node;
      const patch = getUiNodePatch(linkedElement);
      const needsPatch = Object.entries(patch).some(([key, value]) => node.data?.[key] !== value);
      if (!needsPatch) return node;
      changed = true;
      return {
        ...node,
        data: {
          ...node.data,
          ...patch
        }
      };
    });

    if (changed) {
      setNodes(nextNodes);
    }
    uiLinkBootstrapRef.current = true;
  }, [activeFunctionId, currentTheme.accent, makeNode, nodes, setNodes, uiElements]);

  const createGroupBox = useCallback(() => {
    const targets = nodes.filter((node) => selectedNodeIds.includes(node.id));
    if (targets.length < 2) return;

    snapshot();

    const xs = targets.map((node) => node.position.x);
    const ys = targets.map((node) => node.position.y);
    const maxX = Math.max(...targets.map((node) => node.position.x + 240));
    const maxY = Math.max(...targets.map((node) => node.position.y + 130));

    const groupNode = {
      id: `group-${Date.now()}`,
      type: "ixoGroup",
      data: {
        label: "Node Group",
        value: "관련 노드를 한 묶음으로 관리하는 구조의 시작점입니다.",
        nodeType: "group",
        kind: "utility",
        category: "GROUP",
        refKey: "",
        groupLabel: "Structure"
      },
      position: { x: Math.min(...xs) - 36, y: Math.min(...ys) - 44 },
      style: {
        width: maxX - Math.min(...xs) + 72,
        height: maxY - Math.min(...ys) + 84
      }
    };

    setNodes((current) => [...current, groupNode]);
    setSelectedNodeId(groupNode.id);
    setInspectorMode("inspector");
    setStatus("Group box created.");
    setIsDirty(true);
  }, [nodes, selectedNodeIds, setNodes, snapshot]);

  const deleteSelection = useCallback(() => {
    if (!selectedNodeIds.length && !selectedUiElementId && !selectedEdgeIds.length) return;
    snapshot();

    if (selectedUiElementId) {
      const linkedNodeId = selectedUiElement?.linkedNodeId;
      setUiElements((current) => current.filter((item) => item.id !== selectedUiElementId));
      if (linkedNodeId) {
        setNodes((current) => current.filter((node) => node.id !== linkedNodeId));
        setEdges((current) => current.filter((edge) => edge.source !== linkedNodeId && edge.target !== linkedNodeId));
      }
      setSelectedUiElementId(null);
      setStatus("UI element removed.");
      setIsDirty(true);
      return;
    }

    if (selectedEdgeIds.length) {
      const selectedEdges = new Set(selectedEdgeIds);
      setEdges((current) => current.filter((edge) => !selectedEdges.has(edge.id)).map((edge) => ({ ...edge, selected: false })));
      setSelectedEdgeIds([]);
      setStatus("Selected edges removed.");
      setIsDirty(true);
      return;
    }

    const selected = new Set(selectedNodeIds);
    setNodes((current) => current.filter((node) => !selected.has(node.id)));
    setEdges((current) => current.filter((edge) => !selected.has(edge.source) && !selected.has(edge.target)));
    setUiElements((current) => current.filter((item) => !selected.has(item.linkedNodeId)));
    setSelectedNodeId(null);
    setSelectedNodeIds([]);
    setSelectedEdgeIds([]);
    setStatus("Selected nodes removed.");
    setIsDirty(true);
  }, [selectedEdgeIds, selectedNodeIds, selectedUiElement, selectedUiElementId, setEdges, setNodes, snapshot]);

  const duplicateSelection = useCallback(() => {
    if (selectedUiElementId && selectedUiElement) {
      snapshot();
      const linkedNode = makeNode(getUiNodeDefinition(selectedUiElement.kind), {
        x: 980,
        y: 120 + uiElements.length * 92
      });
      const clone = {
        ...selectedUiElement,
        id: `ui-${Date.now()}`,
        x: selectedUiElement.x + 24,
        y: selectedUiElement.y + 24,
        linkedNodeId: linkedNode.id
      };
      linkedNode.data = {
        ...linkedNode.data,
        value: clone.kind === "image" ? clone.src : clone.text,
        refKey: clone.bindingKey || linkedNode.data.refKey,
        linkedUiElementId: clone.id
      };
      setUiElements((current) => [...current, clone]);
      setNodes((current) => [...current, linkedNode]);
      setSelectedUiElementId(clone.id);
      setStatus("UI element duplicated.");
      setIsDirty(true);
      return;
    }

    if (selectedNodeIds.length === 0) return;

    snapshot();
    const targets = nodes.filter((node) => selectedNodeIds.includes(node.id));
    const clones = targets.map((node) => {
      const nextId = createNodeId();
      return {
        ...node,
        id: nextId,
        position: { x: node.position.x + 44, y: node.position.y + 44 },
        data: {
          ...node.data,
          label: `${node.data.label} Copy`,
          refKey: node.data.refKey ? `${node.data.refKey}_copy` : ""
        }
      };
    });

    setNodes((current) => [...current, ...clones]);
    setStatus("Selected nodes duplicated.");
    setIsDirty(true);
  }, [createNodeId, makeNode, nodes, selectedNodeIds, selectedUiElement, selectedUiElementId, setNodes, snapshot, uiElements.length]);

  const saveProject = useCallback(async ({ saveAs = false } = {}) => {
    if (!window.ixo?.saveProject) {
      setStatus("Save unavailable in browser mode.");
      return;
    }

    const payload = getSerializableProject();
    const result = await window.ixo.saveProject(payload, { saveAs });
    if (result.ok) {
      setProjectFilePath(result.path || "");
      setStatus(`Saved .ixo: ${result.path}`);
      setIsDirty(false);
    }
  }, [getSerializableProject]);

  const loadProject = useCallback(async () => {
    if (!window.ixo?.loadProject) {
      setStatus("Load unavailable in browser mode.");
      return;
    }

    const result = await window.ixo.loadProject();
    if (result.ok && result.data) {
      await resetSecurityState();
      snapshot();
      const migrated = migrateProjectState(result.data);
      applyState(migrated);
      if (migrated.viewMode) setViewMode(migrated.viewMode);
      if (migrated.language) setLanguage(migrated.language);
      if (migrated.themeKey) setThemeKey(migrated.themeKey);
      if (migrated.previewDevice) setPreviewDevice(migrated.previewDevice);
      if (migrated.activeScene) setActiveScene(migrated.activeScene);
      if (migrated.assets) setAssets(migrated.assets);
      if (migrated.exportSettings) setExportSettings(normalizeExportSettings(migrated.exportSettings));
      setLogs([]);
      setProjectFilePath(result.path || "");
      setStatus(`Loaded .ixo: ${result.path}`);
      setIsDirty(false);
    }
  }, [applyState, resetSecurityState, snapshot]);

  const pickExportPath = useCallback(async () => {
    if (!window.ixo?.chooseExportPath) {
      setStatus("Export path selection is unavailable in browser mode.");
      return "";
    }

    const result = await window.ixo.chooseExportPath({
      appName: exportAppName
    });
    if (result.ok) {
      setExportOutputPath(result.path);
      return result.path;
    }
    return "";
  }, [exportAppName]);

  const openExportModal = useCallback(async () => {
    if (!window.ixo?.exportProject) {
      setStatus("Export unavailable in browser mode.");
      return;
    }

    setShowFileMenu(false);
    setExportAppName("");
    setExportIcon(null);
    setExportOutputPath("");
    setExportTargets([]);
    setExportPipeline("desktop");
    setMobileBundleId("com.minyangtech.mytixo");
    setMobileVersionName("1.0.0");
    setMobileIconBackgroundColor("#101713");
    setExportSettings(normalizeExportSettings(exportSettings));
    setShowExportModal(true);
  }, [exportSettings]);

  const changeExportPipeline = useCallback((pipeline) => {
    setExportPipeline(pipeline);
    setExportTargets([]);
  }, []);

  const toggleExportTarget = useCallback((targetKey) => {
    const option = exportTargetOptions.find((item) => item.key === targetKey);
    if (!option?.enabled) return;
    setExportTargets((current) => (
      current.includes(targetKey)
        ? current.filter((item) => item !== targetKey)
        : [...current, targetKey]
    ));
  }, [exportTargetOptions]);

  const exportProject = useCallback(async () => {
    if (!window.ixo?.exportProject) {
      setStatus("Export unavailable in browser mode.");
      return;
    }

    try {
      setExportBusy(true);
      if (!exportOutputPath) {
        setStatus("Choose an export folder before exporting.");
        appendLog(makeLog("error", "Export", "내보내기 경로를 먼저 선택해야 합니다."));
        return;
      }
      if (!exportTargets.length) {
        setStatus("Select at least one export format.");
        appendLog(makeLog("error", "Export", "산출물 형식을 하나 이상 선택해야 합니다."));
        return;
      }

      const exportOptions = {
        outputDir: exportOutputPath,
        targets: exportTargets,
        appName: exportAppName,
        icon: exportIcon,
        exportSettings: normalizeExportSettings(exportSettings),
        bundleId: mobileBundleId,
        versionName: mobileVersionName,
        iconBackgroundColor: mobileIconBackgroundColor
      };
      const result = exportPipeline === "mobile"
        ? await window.ixo.exportMobileProject(getSerializableProject(), exportOptions)
        : await window.ixo.exportProject(getSerializableProject(), exportOptions);

      if (result.ok) {
        setStatus(`Exported outputs: ${result.path}`);
        appendLog(makeLog("info", "Export", `Outputs created in: ${result.path}`));
        setShowExportModal(false);
      } else if (!result.canceled) {
        setStatus(`Export failed: ${result.error || "Unknown error"}`);
        appendLog(makeLog("error", "Export", result.error || "Export failed."));
      }
    } catch (error) {
      setStatus(`Export failed: ${error.message}`);
      appendLog(makeLog("error", "Export", error.message || "Export failed."));
    } finally {
      setExportBusy(false);
    }
  }, [appendLog, exportAppName, exportIcon, exportOutputPath, exportPipeline, exportSettings, exportTargets, getSerializableProject, mobileBundleId, mobileIconBackgroundColor, mobileVersionName]);

  const checkForUpdates = useCallback(async ({ silent = false } = {}) => {
    if (!window.ixo?.checkForUpdates) {
      if (!silent) {
        setStatus("Update checks are available in the desktop app.");
      }
      return null;
    }

    setUpdateState("checking");
    try {
      const result = await window.ixo.checkForUpdates();
      setUpdateInfo(result);
      setUpdateState(result.releasePublished === false ? "no-release" : result.available ? "available" : "current");
      if (!silent) {
        setStatus(
          result.releasePublished === false
            ? "No public GitHub Release has been published yet."
            : result.available
              ? `Update available: ${result.latestVersion}`
              : "Already up to date."
        );
      }
      if (result.available) {
        appendLog(makeLog("info", "Updates", `New release detected: ${result.latestVersion}`));
      }
      return result;
    } catch (error) {
      setUpdateState("error");
      if (!silent) {
        setStatus(`Update check failed: ${error.message}`);
      }
      appendLog(makeLog("error", "Updates", error.message || "Update check failed."));
      return null;
    }
  }, [appendLog]);

  const downloadUpdate = useCallback(async () => {
    if (!window.ixo?.downloadUpdate || !updateInfo?.asset) {
      return;
    }

    setUpdateState("downloading");
    try {
      const result = await window.ixo.downloadUpdate(updateInfo.asset);
      setUpdateState("downloaded");
      setStatus(`Update downloaded: ${result.path}`);
      appendLog(makeLog("info", "Updates", `Update downloaded: ${result.path}`));
    } catch (error) {
      setUpdateState("error");
      setStatus(`Update download failed: ${error.message}`);
      appendLog(makeLog("error", "Updates", error.message || "Update download failed."));
    }
  }, [appendLog, updateInfo]);

  const openReleasePageFromSettings = useCallback(async () => {
    const releaseUrl = updateInfo?.releaseUrl || "https://github.com/minyang-tech/IXO-Engine/releases";
    try {
      if (window.ixo?.openReleasePage) {
        const result = await window.ixo.openReleasePage(releaseUrl);
        setStatus(`Opened release page: ${result.url}`);
        return;
      }
      await openSecureExternalUrl(releaseUrl);
    } catch (error) {
      setStatus(`Release page blocked: ${error.message}`);
      appendLog(makeLog("error", "Updates", "릴리스 페이지 열기가 차단되었습니다.", String(error.message || error)));
    }
  }, [appendLog, openSecureExternalUrl, updateInfo]);

  useEffect(() => {
    if (!window.ixo?.getAppInfo) return undefined;

    let mounted = true;
    window.ixo.getAppInfo().then((info) => {
      if (mounted && info) {
        setAppInfo(info);
      }
    });

    let timer = null;
    if (!startupUpdateCheckRef.current) {
      startupUpdateCheckRef.current = true;
      timer = window.setTimeout(() => {
        checkForUpdates({ silent: true });
      }, 2500);
    }

    return () => {
      mounted = false;
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, [checkForUpdates]);

  useEffect(() => {
    const onKeyDown = (event) => {
      const tag = (event.target?.tagName || "").toLowerCase();
      const editing = tag === "input" || tag === "textarea";

      if (event.code === "Space" && !editing) {
        event.preventDefault();
        setQuickSearchOpen(true);
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "f") {
        event.preventDefault();
        librarySearchInputRef.current?.focus();
        librarySearchInputRef.current?.select();
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        saveProject({ saveAs: event.shiftKey });
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        undo();
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
        event.preventDefault();
        redo();
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d") {
        event.preventDefault();
        duplicateSelection();
      }

      if (event.shiftKey && event.key.toLowerCase() === "a" && !editing) {
        event.preventDefault();
        const nodeIds = nodes.map((node) => node.id);
        setSelectedUiElementId(null);
        setSelectedEdgeIds([]);
        setSelectedNodeIds(nodeIds);
        setSelectedNodeId(nodeIds[nodeIds.length - 1] || null);
        setNodes((current) => applyNodeSelectionState(current, nodeIds));
        setEdges((current) => current.map((edge) => ({ ...edge, selected: false })));
      }

      if (event.key === "Delete" && !editing) {
        event.preventDefault();
        deleteSelection();
      }

      if (event.key.toLowerCase() === "g" && !editing && selectedNodeIds.length > 1) {
        event.preventDefault();
        createGroupBox();
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [createGroupBox, deleteSelection, duplicateSelection, nodes, redo, saveProject, selectedNodeIds.length, setEdges, setNodes, undo]);

  // [엣지 하이라이트] 실행 중인 선을 민트 톤과 애니메이션으로 강조합니다.
  const edgeView = useMemo(
    () =>
      edges.map((edge) => {
        const active = runtime.activeEdgeIds.includes(edge.id);
        return {
          ...edge,
          animated: active,
          className: active ? "trace-edge-active" : "trace-edge-idle",
          style: active
            ? { ...edge.style, stroke: currentTheme.accent, strokeWidth: 2.2, filter: `drop-shadow(0 0 10px ${currentTheme.accent})` }
            : { ...edge.style, opacity: 0.64 }
        };
      }),
    [currentTheme.accent, edges, runtime.activeEdgeIds]
  );

  const onConnect = useCallback(async (connection) => {
    const linkedNodes = nodes.filter((node) => (
      node.id === connection.source || node.id === connection.target
    ));
    const httpsNode = linkedNodes.find((node) => node.data?.nodeType === "http");
    if (httpsNode && !httpsNodesEnabled) {
      setStatus("HTTPS node connection blocked in Settings.");
      appendLog(makeLog("error", httpsNode.data?.label || "HTTPS Request", "설정에서 HTTPS 노드가 꺼져 있어 연결할 수 없습니다."));
      return;
    }

    snapshot();
    setEdges((current) =>
      addEdge(
        {
          ...connection,
          markerEnd: { type: MarkerType.ArrowClosed, color: "#d2f8e3" },
          style: { stroke: "#8aa29a", strokeWidth: 1.4 }
        },
        current
      )
    );
    setIsDirty(true);
  }, [appendLog, httpsNodesEnabled, nodes, setEdges, snapshot]);

  const handleNodesChange = useCallback((changes) => {
    if (
      historyRestoreGuardRef.current
      && changes.every((change) => change.type === "dimensions" || change.type === "select")
    ) {
      if (pendingRestoredNodesRef.current) {
        setNodes(pendingRestoredNodesRef.current);
      }
      return;
    }
    onNodesChange(changes);
    if (hasPersistentNodeChange(changes)) setIsDirty(true);
  }, [onNodesChange]);

  const handleEdgesChange = useCallback((changes) => {
    onEdgesChange(changes);
    if (hasPersistentEdgeChange(changes)) setIsDirty(true);
  }, [onEdgesChange]);

  const syncSelectedNodes = useCallback((ids, primaryId = null) => {
    setSelectedNodeIds(ids);
    setSelectedNodeId(primaryId ?? ids[ids.length - 1] ?? null);
    setSelectedUiElementId(null);
    setSelectedEdgeIds([]);
    setNodes((current) => applyNodeSelectionState(current, ids));
    setEdges((current) => current.map((edge) => ({ ...edge, selected: false })));
  }, [setEdges, setNodes]);

  const syncSelectedEdges = useCallback((ids) => {
    const selectedSet = new Set(ids);
    setSelectedEdgeIds(ids);
    setSelectedNodeIds([]);
    setSelectedNodeId(null);
    setSelectedUiElementId(null);
    setNodes((current) => applyNodeSelectionState(current, []));
    setEdges((current) => current.map((edge) => ({ ...edge, selected: selectedSet.has(edge.id) })));
  }, [setEdges, setNodes]);

  // [Builder 탐색] UI를 선택한 상태에서 P를 누르면 대응 노드 위치로 즉시 이동합니다.
  useEffect(() => {
    const onBuilderShortcut = (event) => {
      const tag = (event.target?.tagName || "").toLowerCase();
      const editing = tag === "input" || tag === "textarea" || tag === "select";
      if (editing || viewMode !== "builder" || event.key.toLowerCase() !== "p") return;
      const linkedNodeId = selectedUiElement?.linkedNodeId;
      if (!linkedNodeId) return;
      const linkedNode = nodes.find((node) => node.id === linkedNodeId);
      if (!linkedNode) return;

      event.preventDefault();
      syncSelectedNodes([linkedNode.id], linkedNode.id);
      setCenter(
        linkedNode.position.x + (linkedNode.width || 220) / 2,
        linkedNode.position.y + (linkedNode.height || 120) / 2,
        { zoom: 1.1, duration: 420 }
      );
      setStatus(`Jumped to linked node: ${linkedNode.data?.label || linkedNode.id}`);
    };

    window.addEventListener("keydown", onBuilderShortcut);
    return () => window.removeEventListener("keydown", onBuilderShortcut);
  }, [nodes, selectedUiElement, setCenter, syncSelectedNodes, viewMode]);

  const magicAlign = useCallback(() => {
    snapshot();

    const order = topoOrder(nodes, edges);
    const depth = {};
    nodes.forEach((node) => {
      depth[node.id] = 0;
    });

    edges.forEach((edge) => {
      depth[edge.target] = Math.max(depth[edge.target] || 0, (depth[edge.source] || 0) + 1);
    });

    const byDepth = {};
    order.forEach((id) => {
      const d = depth[id] || 0;
      byDepth[d] = [...(byDepth[d] || []), id];
    });

    const nextNodes = nodes.map((node) => {
      const d = depth[node.id] || 0;
      const row = (byDepth[d] || []).indexOf(node.id);
      return {
        ...node,
        position: { x: 120 + d * 280, y: 84 + row * 156 }
      };
    });

    setNodes(nextNodes);
    setStatus("Magic Align completed.");
    setIsDirty(true);
  }, [edges, nodes, setNodes, snapshot]);

  const onDragStartNode = (event, nodeDef) => {
    event.dataTransfer.setData("application/ixo-node", JSON.stringify(nodeDef));
    event.dataTransfer.effectAllowed = "copy";
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const importIxoAssetIntoWorkspace = useCallback((asset, point = null) => {
    const parsed = parseStoredProject(decodeDataUrlText(asset.dataUrl));
    if (!parsed.ok) {
      throw new Error(parsed.error || "Invalid .ixo file.");
    }
    const project = parsed.data;
    const importedNodesSource = Array.isArray(project.nodes) ? project.nodes : [];
    const importedUiSource = normalizeUiElements(project.uiElements || []);
    if (!importedNodesSource.length && !importedUiSource.length) {
      throw new Error("No nodes or UI elements found in .ixo file.");
    }

    snapshot();
    const nodeIdMap = {};
    const uiIdMap = {};
    importedNodesSource.forEach((node) => {
      nodeIdMap[node.id] = createNodeId();
    });
    importedUiSource.forEach((element) => {
      uiIdMap[element.id] = `ui-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    });

    const minNodeX = Math.min(...importedNodesSource.map((node) => Number(node.position?.x || 0)), 0);
    const minNodeY = Math.min(...importedNodesSource.map((node) => Number(node.position?.y || 0)), 0);
    const minUiX = Math.min(...importedUiSource.map((element) => Number(element.x || 0)), 0);
    const minUiY = Math.min(...importedUiSource.map((element) => Number(element.y || 0)), 0);
    const origin = point || { x: 80, y: 80 };

    const importedUi = importedUiSource.map((element) => ({
      ...element,
      id: uiIdMap[element.id],
      x: Math.max(0, origin.x + Number(element.x || 0) - minUiX),
      y: Math.max(0, origin.y + Number(element.y || 0) - minUiY),
      scene: activeScene,
      linkedNodeId: nodeIdMap[element.linkedNodeId] || ""
    }));
    const importedNodes = importedNodesSource.map((node, index) => ({
      ...node,
      id: nodeIdMap[node.id],
      selected: false,
      position: {
        x: (point?.x ? point.x + 120 : 160) + Number(node.position?.x || 0) - minNodeX + index * 8,
        y: (point?.y ? point.y + 80 : 120) + Number(node.position?.y || 0) - minNodeY + index * 8
      },
      data: {
        ...(node.data || {}),
        linkedUiElementId: uiIdMap[node.data?.linkedUiElementId] || ""
      }
    }));
    const importedEdges = (project.edges || [])
      .filter((edge) => nodeIdMap[edge.source] && nodeIdMap[edge.target])
      .map((edge, index) => ({
        ...edge,
        id: `edge-${Date.now()}-${index}`,
        source: nodeIdMap[edge.source],
        target: nodeIdMap[edge.target],
        selected: false
      }));

    setNodes((current) => [...current, ...importedNodes]);
    setEdges((current) => [...current, ...importedEdges]);
    setUiElements((current) => [...current, ...importedUi]);
    if (Array.isArray(project.assets) && project.assets.length) {
      setAssets((current) => [...current, ...project.assets.map((item) => ({ ...item, id: `asset-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }))]);
    }
    setSelectedUiElementId(importedUi[0]?.id || null);
    setViewMode(importedUi.length ? "builder" : viewMode);
    setStatus(`IXO asset imported: ${asset.name}`);
    setIsDirty(true);
  }, [activeScene, createNodeId, setEdges, setNodes, snapshot, viewMode]);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const assetId = event.dataTransfer.getData("application/ixo-asset-id");
    if (assetId) {
      const asset = assets.find((item) => item.id === assetId);
      if (!asset || !isIxoProjectAsset(asset)) return;
      try {
        importIxoAssetIntoWorkspace(asset, screenToFlowPosition({ x: event.clientX, y: event.clientY }));
      } catch (error) {
        setStatus(`IXO import failed: ${error.message}`);
        appendLog(makeLog("error", "Asset Manager", ".ixo asset을 노드 workspace에 붙여넣지 못했습니다.", String(error.message || error)));
      }
      return;
    }

    const raw = event.dataTransfer.getData("application/ixo-node");
    if (!raw) return;

    snapshot();

    const nodeDef = JSON.parse(raw);
    const nextNode = makeNode(nodeDef, screenToFlowPosition({ x: event.clientX, y: event.clientY }));
    setNodes((current) => [...current, nextNode]);
    setStatus(`Node added: ${nodeDef.label}`);
    setIsDirty(true);
  }, [appendLog, assets, importIxoAssetIntoWorkspace, makeNode, screenToFlowPosition, setNodes, snapshot]);

  const onPaneContextMenu = useCallback((event) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      flowPosition: screenToFlowPosition({ x: event.clientX, y: event.clientY })
    });
    setSearchTerm("");
  }, [screenToFlowPosition]);

  const addNodeFromSearch = (nodeDef, source = "context") => {
    const point = source === "center"
      ? screenToFlowPosition({ x: window.innerWidth * 0.53, y: window.innerHeight * 0.45 })
      : contextMenu?.flowPosition;

    if (!point) return;

    snapshot();

    const nextNode = makeNode(nodeDef, point);
    setNodes((current) => [...current, nextNode]);
    setContextMenu(null);
    setQuickSearchOpen(false);
    setStatus(`Quick add: ${nodeDef.label}`);
    setIsDirty(true);
  };

  const updateNodeSoundFile = (file) => {
    if (!selectedNode || !file) return;
    const reader = new FileReader();
    reader.onload = () => {
      snapshot();
      setNodes((current) =>
        current.map((node) => (
          node.id === selectedNode.id
            ? { ...node, data: { ...node.data, value: String(reader.result || ""), soundName: file.name } }
            : node
        ))
      );
      setStatus(`Sound loaded: ${file.name}`);
      setIsDirty(true);
    };
    reader.readAsDataURL(file);
  };

  const addAssetFile = useCallback((file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const asset = {
        id: `asset-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        dataUrl: String(reader.result || ""),
        createdAt: Date.now()
      };
      snapshot();
      setAssets((current) => [...current, asset]);
      setStatus(`Asset added: ${file.name}`);
      setIsDirty(true);
    };
    reader.readAsDataURL(file);
  }, [snapshot]);

  const removeAsset = useCallback((assetId) => {
    snapshot();
    setAssets((current) => current.filter((asset) => asset.id !== assetId));
    setIsDirty(true);
  }, [snapshot]);

  const cleanupUnusedAssets = useCallback(() => {
    const used = new Set();
    uiElements.forEach((element) => {
      if (element.src) used.add(element.src);
      if (element.actionValue) used.add(element.actionValue);
    });
    snapshot();
    setAssets((current) => current.filter((asset) => used.has(asset.dataUrl) || used.has(asset.name)));
    setStatus("Unused assets cleaned.");
    setIsDirty(true);
  }, [snapshot, uiElements]);

  const handleThemeUpload = useCallback((file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const theme = normalizeUploadedTheme(String(reader.result || ""), currentTheme);
        const key = `${CUSTOM_THEME_PREFIX}${Date.now()}`;
        snapshot();
        setCustomThemes((current) => ({ ...current, [key]: theme }));
        setDraftThemeKey(key);
        setThemeKey(key);
        setStatus(`Theme uploaded: ${theme.label}`);
        setIsDirty(true);
      } catch (error) {
        setStatus(`Theme upload failed: ${error.message}`);
        appendLog(makeLog("error", "Theme", "사용자 지정 테마를 불러오지 못했습니다.", String(error.message || error)));
      }
    };
    reader.readAsText(file, "utf-8");
  }, [appendLog, currentTheme, snapshot]);

  const createScene = useCallback(() => {
    const base = "scene";
    let index = sceneNames.length + 1;
    let nextName = `${base}-${index}`;
    while (sceneNames.includes(nextName)) {
      index += 1;
      nextName = `${base}-${index}`;
    }
    snapshot();
    setActiveScene(nextName);
    setStatus(`Scene created: ${nextName}`);
    setIsDirty(true);
  }, [sceneNames, snapshot]);

  const deleteScene = useCallback((sceneName) => {
    if (!sceneName || sceneName === "main") return;
    const count = uiElements.filter((element) => (element.scene || "main") === sceneName).length;
    const confirmed = window.confirm(`${sceneName} Scene을 삭제할까요?\n이 Scene의 UI ${count}개가 main으로 이동됩니다.`);
    if (!confirmed) return;
    snapshot();
    setUiElements((current) => current.map((element) => (
      (element.scene || "main") === sceneName ? { ...element, scene: "main" } : element
    )));
    setActiveScene("main");
    setStatus(`Scene removed: ${sceneName}`);
    setIsDirty(true);
  }, [snapshot, uiElements]);

  const updateNodeField = (field, value) => {
    if (!selectedNode) return;
    snapshot({ mergeKey: `node:${selectedNode.id}:${field}` });
    setNodes((current) =>
      current.map((node) => (
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, [field]: value } }
          : node
      ))
    );
    if (selectedNode.data?.linkedUiElementId && ["value", "refKey"].includes(field)) {
      setUiElements((current) =>
        current.map((item) => (
          item.id === selectedNode.data.linkedUiElementId
            ? {
                ...item,
                ...(field === "value"
                  ? item.kind === "image"
                    ? { src: value }
                    : { text: value }
                  : { bindingKey: value })
              }
            : item
        ))
      );
    }
    setIsDirty(true);
  };

  const updateUiField = (field, value) => {
    if (!selectedUiElement) return;
    snapshot({ mergeKey: `ui:${selectedUiElement.id}:${field}` });
    const nextValue = field === "x" || field === "y" || field === "width" || field === "height" || field === "fontSize" || field === "radius" ? Number(value) : value;
    setUiElements((current) =>
      current.map((item) => (
        item.id === selectedUiElement.id
          ? { ...item, [field]: nextValue }
          : item
      ))
    );
    if (selectedUiElement.linkedNodeId && ["text", "src", "bindingKey"].includes(field)) {
      setNodes((current) =>
        current.map((node) => (
          node.id === selectedUiElement.linkedNodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  value: field === "bindingKey"
                    ? node.data.value
                    : String(nextValue ?? ""),
                  refKey: field === "bindingKey"
                    ? String(nextValue || node.data.refKey || "")
                    : node.data.refKey
                }
              }
            : node
        ))
      );
    }
    setIsDirty(true);
  };

  const chooseFileWatcherPath = useCallback(async () => {
    if (!selectedNode || selectedNode.data?.nodeType !== "file-watcher") return;
    try {
      const result = await window.ixo?.chooseWatchPath?.();
      if (!result?.ok || !result.path) {
        return;
      }
      updateNodeField("value", result.path);
      setStatus(`File watcher path selected: ${result.path}`);
    } catch (error) {
      setStatus(`File watcher path selection failed: ${error.message}`);
      appendLog(makeLog("error", "File Watcher", "감시 경로 선택에 실패했습니다.", String(error.message || error)));
    }
  }, [appendLog, selectedNode]);

  const createUiElementFromPalette = useCallback((kind, point = null, overrides = {}) => {
    snapshot();

    const next = {
      ...createUiElement(kind, "", currentTheme.accent),
      ...overrides
    };
    const definition = getUiNodeDefinition(kind);
    const linkedNode = makeNode(
      definition,
      {
        x: 980,
        y: 120 + uiElements.length * 92
      }
    );
    linkedNode.data = {
      ...linkedNode.data,
      ...getUiNodePatch(next),
      refKey: linkedNode.data.refKey,
      linkedUiElementId: next.id
    };
    const finalElement = {
      ...(point ? { ...next, x: point.x, y: point.y } : next),
      scene: activeScene,
      linkedNodeId: linkedNode.id
    };

    setUiElements((current) => [...current, finalElement]);
    setNodes((current) => [...current, linkedNode]);
    setSelectedUiElementId(finalElement.id);
    setViewMode("builder");
    setStatus(`UI element added: ${kind}`);
    setIsDirty(true);
  }, [activeScene, currentTheme.accent, makeNode, setNodes, snapshot, uiElements.length]);


  const createUiComponentFromPalette = useCallback((componentKey, point = null) => {
    snapshot();
    const origin = point || { x: 72, y: 72 };
    const componentElements = createComponentElements(componentKey, createUiElement, currentTheme.accent, origin)
      .map((element) => ({ ...normalizeUiElements([element])[0], scene: activeScene }));
    const createdPairs = componentElements.map((element, index) => {
      const definition = getUiNodeDefinition(element.kind);
      const linkedNode = makeNode(definition, {
        x: 980,
        y: 120 + (uiElements.length + index) * 92
      });
      linkedNode.data = {
        ...linkedNode.data,
        ...getUiNodePatch(element),
        refKey: linkedNode.data.refKey,
        linkedUiElementId: element.id
      };
      return {
        element: { ...element, linkedNodeId: linkedNode.id },
        node: linkedNode
      };
    });

    setUiElements((current) => [...current, ...createdPairs.map((pair) => pair.element)]);
    setNodes((current) => [...current, ...createdPairs.map((pair) => pair.node)]);
    setSelectedUiElementId(createdPairs[0]?.element.id || null);
    setViewMode("builder");
    setStatus(`UI component added: ${componentKey}`);
    setIsDirty(true);
  }, [activeScene, currentTheme.accent, makeNode, setNodes, snapshot, uiElements.length]);

  const handleBuilderDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const handleBuilderDrop = useCallback((event) => {
    event.preventDefault();
    const kind = event.dataTransfer.getData("application/ixo-ui");
    const assetId = event.dataTransfer.getData("application/ixo-asset-id");
    if ((!kind && !assetId) || !builderCanvasRef.current) return;

    const rect = builderCanvasRef.current.getBoundingClientRect();
    const point = {
      x: Math.max(0, Math.round(event.clientX - rect.left - 40)),
      y: Math.max(0, Math.round(event.clientY - rect.top - 20))
    };

    if (assetId) {
      const asset = assets.find((item) => item.id === assetId);
      if (!asset) return;
      try {
        if (isImageAsset(asset)) {
          createUiElementFromPalette("image", point, {
            src: asset.dataUrl,
            text: asset.name,
            background: "transparent"
          });
          return;
        }
        if (isIxoProjectAsset(asset)) {
          importIxoAssetIntoWorkspace(asset, point);
          return;
        }
        setStatus(`이 asset은 캔버스에 직접 배치할 수 없습니다: ${asset.name}`);
      } catch (error) {
        setStatus(`Asset import failed: ${error.message}`);
        appendLog(makeLog("error", "Asset Manager", "Asset을 캔버스에 배치하지 못했습니다.", String(error.message || error)));
      }
      return;
    }

    createUiElementFromPalette(kind, point);
  }, [appendLog, assets, createUiElementFromPalette, importIxoAssetIntoWorkspace]);

  const handleBuilderPointerDown = useCallback((event, id, mode = "move") => {
    if (typeof event.button === "number" && event.button !== 0) return;
    if (viewMode !== "builder" || !builderCanvasRef.current) return;

    const rect = builderCanvasRef.current.getBoundingClientRect();
    const target = uiElements.find((item) => item.id === id);
    if (!target) return;

    snapshot();
    setDragState({
      id,
      mode: mode === "resize" ? "resize" : "move",
      offsetX: event.clientX - rect.left - target.x,
      offsetY: event.clientY - rect.top - target.y,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: target.x,
      startY: target.y,
      startWidth: target.width,
      startHeight: target.height
    });
  }, [snapshot, uiElements, viewMode]);

  const handleBuilderPointerUp = useCallback(() => {
    setDragState(null);
  }, []);

  const openUiAction = useCallback(async (element) => {
    if (!element?.actionType || element.actionType === "none") {
      return { ok: true, label: "No action" };
    }

    const actionValue = applyTemplate(element.actionValue || "", runtime.context);
    if (element.actionType === "open-url") {
      const openedUrl = await openSecureExternalUrl(actionValue);
      return { ok: true, label: `Open URL ${maskUrlForLog(openedUrl)}` };
    }
    if (element.actionType === "request-https") {
      const result = await requestSecureHttps(actionValue);
      return { ok: true, label: `Request HTTPS ${maskUrlForLog(result?.url || actionValue)}` };
    }
    if (element.actionType === "set-variable") {
      const parsed = parseSetVariableAction(actionValue);
      if (!parsed.key) throw new Error("Set Variable action needs key=value.");
      const targetNode = nodes.find((node) => node.id === parsed.key || node.data?.refKey === parsed.key);
      if (!targetNode) throw new Error(`Variable target was not found: ${parsed.key}`);
      setInputValues((current) => ({ ...current, [targetNode.id]: parsed.value }));
      return { ok: true, label: `Set ${parsed.key}` };
    }
    if (element.actionType === "toggle-ui") {
      const target = actionValue || element.id;
      setUiElements((current) => current.map((item) => (
        item.id === target || item.bindingKey === target
          ? { ...item, hidden: !item.hidden }
          : item
      )));
      return { ok: true, label: `Toggle UI ${target}` };
    }
    if (element.actionType === "go-scene") {
      setActiveScene(actionValue || "main");
      return { ok: true, label: `Go Scene ${actionValue || "main"}` };
    }
    if (element.actionType === "play-sound") {
      const audio = new Audio(actionValue);
      await audio.play();
      return { ok: true, label: "Play Sound" };
    }
    if (element.actionType === "run-function") {
      const targetName = actionValue.trim();
      const found = functions.find((item) => item.id === targetName || item.name === targetName);
      if (!found) throw new Error(`Function was not found: ${targetName || "(empty)"}`);
      appendLog(makeLog("info", "Action System", `Function queued: ${found.name}`));
      return { ok: true, label: `Run Function ${found.name}` };
    }

    return { ok: true, label: element.actionType };
  }, [appendLog, functions, nodes, openSecureExternalUrl, requestSecureHttps, runtime.context]);

  const handleUiInteraction = useCallback((id, action) => {
    setInteractionState((current) => {
      if (action === "enter") {
        return { ...current, pointerOverId: id };
      }
      if (action === "leave") {
        return current.pointerOverId === id ? { ...current, pointerOverId: "" } : current;
      }
      if (action === "click") {
        window.setTimeout(() => {
          setInteractionState((latest) => ({
            ...latest,
            clickedIds: latest.clickedIds.filter((clickedId) => clickedId !== id)
          }));
        }, 120);
        return {
          ...current,
          clickedIds: [id]
        };
      }
      return current;
    });
  }, []);

  const handleUiElementSelect = useCallback((id) => {
    setSelectedUiElementId(id);
    setSelectedNodeId(null);
    setSelectedNodeIds([]);
    setSelectedEdgeIds([]);
    setNodes((current) => applyNodeSelectionState(current, []));
    setEdges((current) => current.map((edge) => ({ ...edge, selected: false })));
  }, [setEdges, setNodes]);

  const applySettings = useCallback(async () => {
    setLanguage(draftLanguage);
    setThemeKey(draftThemeKey);
    setPreviewDevice(draftPreviewDevice);
    setHttpsNodesEnabled(draftHttpsNodesEnabled);
    await window.ixo?.setHttpsNodesEnabled?.(draftHttpsNodesEnabled);
    if (!draftHttpsNodesEnabled) {
      await resetSecurityState();
    }

    if (draftTemplateKey) {
      const template = STARTER_TEMPLATES[draftTemplateKey];
      if (template) {
        snapshot();
        const next = template.build();
        resetSecurityState();
        applyState(next);
        setViewMode(next.viewMode || "viewer");
        setLogs([makeLog("info", "Templates", `${template.label} 템플릿을 불러왔습니다.`)]);
        setStatus(`Template loaded: ${template.label}`);
        setIsDirty(true);
      }
    }

    setToastMessage((UI_TEXT[draftLanguage] || UI_TEXT.ko).applied);
  }, [applyState, draftHttpsNodesEnabled, draftLanguage, draftPreviewDevice, draftTemplateKey, draftThemeKey, resetSecurityState, snapshot]);

  const cancelSettings = useCallback(() => {
    setDraftLanguage(language);
    setDraftThemeKey(themeKey);
    setDraftPreviewDevice(previewDevice);
    setDraftTemplateKey("");
    setDraftHttpsNodesEnabled(httpsNodesEnabled);
    setShowSettings(false);
  }, [httpsNodesEnabled, language, previewDevice, themeKey]);

  const clearLocalAutosave = useCallback(() => {
    window.localStorage?.removeItem(LOCAL_AUTOSAVE_KEY);
    appendLog(makeLog("info", "Local Auto-Save", "로컬 자동 저장 데이터를 삭제했습니다."));
    setStatus("Local auto-save cleared.");
  }, [appendLog]);

  const restoreLatestBackup = useCallback(() => {
    try {
      const rawBackups = window.localStorage?.getItem(LOCAL_BACKUPS_KEY);
      const backups = rawBackups ? JSON.parse(rawBackups) : [];
      const validBackup = Array.isArray(backups)
        ? backups.map((entry) => parseStoredProject(entry.payload)).find((entry) => entry.ok)
        : null;
      if (!validBackup?.ok) {
        setStatus("No valid backup is available.");
        appendLog(makeLog("error", "Safe Mode", "복구 가능한 백업이 없습니다."));
        return;
      }

      applyState(validBackup.data);
      window.localStorage?.setItem(LOCAL_AUTOSAVE_KEY, JSON.stringify(validBackup.data));
      setSafeModeInfo({
        active: true,
        source: "manual-backup",
        message: "가장 최근 백업을 수동으로 복원했습니다."
      });
      setStatus("Latest backup restored.");
      appendLog(makeLog("info", "Safe Mode", "가장 최근 백업을 복원했습니다."));
    } catch (error) {
      appendLog(makeLog("error", "Safe Mode", "백업 복원에 실패했습니다.", String(error.message || error)));
    }
  }, [appendLog, applyState]);

  const resetProjectToSafeDefaults = useCallback(() => {
    snapshot();
    const fallback = getDefaultProjectState();
    applyState(fallback);
    window.localStorage?.setItem(LOCAL_AUTOSAVE_KEY, JSON.stringify(fallback));
    setSafeModeInfo({
      active: true,
      source: "manual-reset",
      message: "안전한 기본 프로젝트로 초기화했습니다."
    });
    setStatus("Project reset to safe defaults.");
    appendLog(makeLog("info", "Safe Mode", "안전한 기본 프로젝트로 초기화했습니다."));
  }, [appendLog, applyState, snapshot]);

  const dismissSafeMode = useCallback(() => {
    setSafeModeInfo(null);
    window.localStorage?.removeItem(LOCAL_SAFE_MODE_KEY);
  }, []);

  const handleNodeDropToSidebar = useCallback((event, node) => {
    const sidebarElement = sidebarRef.current;
    if (!event?.clientX || !event?.clientY || !sidebarElement) return;

    const rect = sidebarElement.getBoundingClientRect();
    const insideSidebar =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!insideSidebar) return;

    snapshot();

    const activeIds = selectedNodeIds.includes(node.id) ? selectedNodeIds : [node.id];
    const selectedSet = new Set(activeIds);
    setNodes((current) => current.filter((item) => !selectedSet.has(item.id)));
    setEdges((current) => current.filter((edge) => !selectedSet.has(edge.source) && !selectedSet.has(edge.target)));
    setSelectedNodeId(null);
    setSelectedNodeIds([]);
    setSelectedEdgeIds([]);
    setStatus("Dragged nodes to sidebar and removed them.");
    setIsDirty(true);
  }, [selectedNodeIds, setEdges, setNodes, snapshot]);

  const CanvasPane = (
    <div className="editor-area" onDrop={onDrop} onDragOver={onDragOver} style={{ "--trace-duration": `${TRACE_SPEED[speed]}s` }}>
      <ReactFlowProvider key={flowRevision}>
      <ReactFlow
        nodes={nodesWithTrace}
        edges={edgeView}
        nodeTypes={nodeTypes}
        multiSelectionKeyCode={["Control", "Meta"]}
        onlyRenderVisibleElements
        onInit={(instance) => {
          reactFlowRef.current = instance;
        }}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onPaneContextMenu={onPaneContextMenu}
        onNodeDragStart={(event, node) => {
          nodeDragStartSnapshotRef.current = cloneState(
            nodes.map((item) => (
              item.id === node.id
                ? { ...item, position: { ...node.position } }
                : item
            )),
            edges,
            inputValues,
            nodeCounterRef.current,
            uiElements,
            functions,
            activeFunctionId,
            activeScene,
            assets,
            exportSettings,
            customThemes
          );
        }}
        onSelectionChange={({ nodes: selectedNodes = [], edges: selectedEdges = [] }) => {
          const nodeIds = selectedNodes.map((node) => node.id);
          const edgeIds = selectedEdges.map((edge) => edge.id);
          if (nodeIds.length) {
            syncSelectedNodes(nodeIds, nodeIds[nodeIds.length - 1]);
            return;
          }
          if (edgeIds.length) {
            syncSelectedEdges(edgeIds);
            return;
          }
          setSelectedNodeIds([]);
          setSelectedEdgeIds([]);
          setSelectedNodeId(null);
        }}
        onNodeDragStop={(event, node) => {
          if (nodeDragStartSnapshotRef.current) {
            const dragSnapshot = nodeDragStartSnapshotRef.current;
            setHistory((current) => [...current.slice(-79), dragSnapshot]);
            setFuture([]);
            lastSnapshotMetaRef.current = { mergeKey: "", at: Date.now() };
            nodeDragStartSnapshotRef.current = null;
          }
          handleNodeDropToSidebar(event, node);
        }}
        onNodeClick={(event, node) => {
          if (event.ctrlKey || event.metaKey) {
            const exists = selectedNodeIds.includes(node.id);
            const nextIds = exists ? selectedNodeIds.filter((id) => id !== node.id) : [...selectedNodeIds, node.id];
            syncSelectedNodes(nextIds, node.id);
          } else {
            syncSelectedNodes([node.id], node.id);
          }
          setInspectorMode("basic");
        }}
        onNodeDoubleClick={(_, node) => {
          syncSelectedNodes([node.id], node.id);
          setInspectorMode("inspector");
        }}
        onEdgeClick={(event, edge) => {
          event.preventDefault();
          if (event.ctrlKey || event.metaKey) {
            const exists = selectedEdgeIds.includes(edge.id);
            const nextIds = exists ? selectedEdgeIds.filter((id) => id !== edge.id) : [...selectedEdgeIds, edge.id];
            syncSelectedEdges(nextIds);
          } else {
            syncSelectedEdges([edge.id]);
          }
        }}
        onPaneClick={() => {
          setSelectedNodeId(null);
          setSelectedNodeIds([]);
          setSelectedEdgeIds([]);
          setSelectedUiElementId(null);
          setNodes((current) => applyNodeSelectionState(current, []));
          setEdges((current) => current.map((edge) => ({ ...edge, selected: false })));
          setContextMenu(null);
        }}
        fitView
      >
        <MiniMap nodeColor={(node) => NODE_COLOR[node.data?.kind] || ACCENT} pannable zoomable />
        <Controls />
        <Background color="#1d2a24" gap={24} size={1.1} variant="dots" />
        <Panel position="top-right" className="canvas-command-panel">
          <label className="canvas-search">
            <span>{uiText.findNode}</span>
            <input
              value={librarySearchTerm}
              onChange={(event) => setLibrarySearchTerm(event.target.value)}
              placeholder={uiText.searchAllNodes}
            />
          </label>
          <div className="canvas-command-meta">
            <span>{visibleLibraryNodeCount} {visibleLibraryNodeCount === 1 ? uiText.result : uiText.results}</span>
            <kbd>Ctrl+F</kbd>
          </div>
        </Panel>
      </ReactFlow>
      </ReactFlowProvider>

      {contextMenu ? (
        <div className="context-menu" style={{ left: contextMenu.x, top: contextMenu.y }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={uiText.searchNodes}
            autoFocus
          />
          <div className="context-list">
            {searchCandidates.slice(0, 10).map((item) => (
              <button key={item.key} onClick={() => addNodeFromSearch(item)}>
                <span style={{ background: NODE_COLOR[item.group] }} />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {quickSearchOpen ? (
        <div className="quick-search-overlay" onClick={() => setQuickSearchOpen(false)}>
          <div className="quick-search-card" onClick={(event) => event.stopPropagation()}>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={uiText.quickSearchNodes}
              autoFocus
              onKeyDown={(event) => {
                if (event.key === "Enter" && searchCandidates[0]) addNodeFromSearch(searchCandidates[0], "center");
                if (event.key === "Escape") setQuickSearchOpen(false);
              }}
            />
            <div className="quick-search-list">
              {searchCandidates.slice(0, 8).map((item) => (
                <button key={item.key} onClick={() => addNodeFromSearch(item, "center")}>
                  {getNodeLabel(item.type, language, item.label)}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <div
      className={`app-shell lang-${language}`}
      style={{
        "--accent": currentTheme.accent,
        "--accent-soft": currentTheme.accentSoft,
        "--accent-strong": currentTheme.accentStrong,
        "--glow": currentTheme.glow,
        "--theme-bg": currentTheme.background || "#08110d",
        "--bg": currentTheme.bg || "#08110d",
        "--bg-soft": currentTheme.bgSoft || "#0d1712",
        "--panel": currentTheme.panel || "#101915",
        "--panel-alt": currentTheme.panelAlt || "#13211c",
        "--panel-elevated": currentTheme.panelElevated || "#172923",
        "--text": currentTheme.text || "#edf6f1",
        "--muted": currentTheme.muted || "#95ada2",
        "--line": currentTheme.line || "rgba(128, 162, 145, 0.18)",
        "--line-strong": currentTheme.lineStrong || "rgba(128, 162, 145, 0.3)",
        "--input-bg": currentTheme.inputBg || "#0d1511"
      }}
    >
      <main className="workspace">
        <aside className="sidebar" ref={sidebarRef}>
          <div className="command-center">
            <div className="brand">
              <span className="brand-mark">
                <img
                  src={LOGO_FALLBACKS[logoIndex]}
                  alt="IXO Logo"
                  onError={() => setLogoIndex((index) => (index + 1 < LOGO_FALLBACKS.length ? index + 1 : index))}
                />
              </span>
              <div className="brand-copy">
                <h1>IXO Engine</h1>
                <p>{uiText.workspaceSubtitle}</p>
              </div>
            </div>

            <div className={`project-trust-card state-${scriptTrustState}`}>
              <span>{uiText.projectTrust}</span>
              <strong>{trustLabel}</strong>
              <small>{fullScriptNodeCount ? `${trustHint} (${fullScriptNodeCount})` : trustHint}</small>
              {fullScriptNodeCount ? (
                <div className="project-trust-guidance">
                  <span>{uiText.fullJavascriptWhyTitle}</span>
                  <ul>
                    {uiText.fullJavascriptWhyItems.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <span>{uiText.fullJavascriptRecommendedTitle}</span>
                  <ul>
                    {uiText.fullJavascriptRecommendedItems.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="menu-row">
              <div className="file-menu">
                <button className="menu-btn" onClick={() => setShowFileMenu((current) => !current)}>{uiText.file}</button>
                {showFileMenu ? (
                  <div className="file-dropdown">
                    <button onClick={() => saveProject()}>{uiText.save}</button>
                    <button onClick={() => saveProject({ saveAs: true })}>Save As...</button>
                    <button onClick={loadProject}>{uiText.load}</button>
                    <button onClick={openExportModal}>{uiText.export}</button>
                    <button onClick={magicAlign}>{uiText.magicAlign}</button>
                  </div>
                ) : null}
              </div>

              <div className="exec-controls">
                <div className="exec-row exec-row-top">
                  <label htmlFor="speed-control">{uiText.speed} {speed}x</label>
                  <input
                    id="speed-control"
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.5"
                    value={speed}
                    onChange={(event) => setSpeed(event.target.value)}
                  />
                </div>

                <div className="exec-row exec-row-bottom">
                  <button className="menu-btn" onClick={() => setPaused((current) => !current)}>
                    {paused ? uiText.resume : uiText.pause}
                  </button>
                  <label className="trace-inline">
                    <input type="checkbox" checked={debugOverlay} onChange={(event) => setDebugOverlay(event.target.checked)} />
                    {uiText.trace}
                  </label>
                  <button
                    className="menu-btn docs-btn"
                    onClick={async () => {
                      try {
                        await openSecureExternalUrl("https://minyangtech.n-e.kr/docs/ixo/index");
                      } catch (error) {
                        appendLog(makeLog("error", "Docs", "문서 열기가 차단되었습니다.", String(error.message || error)));
                      }
                    }}
                  >
                    {uiText.docs}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <section className="scene-manager-card">
            <div className="scene-manager-head">
              <strong>Scenes</strong>
              <button className="ghost-btn" onClick={createScene}>+ Scene</button>
            </div>
            <div className="scene-button-list">
              {sceneNames.map((scene) => (
                <button
                  key={scene}
                  type="button"
                  className={activeScene === scene ? "active" : ""}
                  onClick={() => setActiveScene(scene)}
                >
                  <span>{scene}</span>
                  <em>{uiElements.filter((element) => (element.scene || "main") === scene).length}</em>
                </button>
              ))}
            </div>
            <small>현재 Scene: {activeScene}. Canvas Builder의 UI는 선택한 Scene에 추가됩니다.</small>
            {activeScene !== "main" ? (
              <button className="ghost-btn danger-lite" onClick={() => deleteScene(activeScene)}>Move scene UI to main</button>
            ) : null}
          </section>

          <div className="sidebar-header">
            <div className="panel-title">{uiText.nodeLibrary}</div>
            <button className="ghost-btn" onClick={createGroupBox}>{uiText.groupSelected}</button>
          </div>

          {safeModeInfo?.active ? (
            <section className="safe-mode-card">
              <strong>{uiText.safeMode}</strong>
              <span>{safeModeInfo.message}</span>
              <div>
                <button className="ghost-btn" onClick={restoreLatestBackup}>{uiText.restoreBackup}</button>
                <button className="ghost-btn" onClick={resetProjectToSafeDefaults}>{uiText.autoReset}</button>
                <button className="ghost-btn" onClick={dismissSafeMode}>{uiText.close}</button>
              </div>
            </section>
          ) : null}

          <label className="library-search">
            <span>{uiText.findNode}</span>
            <div className="library-search-field">
              <input
                ref={librarySearchInputRef}
                value={librarySearchTerm}
                onChange={(event) => setLibrarySearchTerm(event.target.value)}
                placeholder={uiText.librarySearchPlaceholder}
              />
              {librarySearchTerm ? (
                <button type="button" onClick={() => setLibrarySearchTerm("")}>{uiText.clear}</button>
              ) : null}
            </div>
          </label>

          <div className="drop-hint-card">
            <strong>{uiText.deleteZone}</strong>
            <span>{uiText.deleteZoneCopy}</span>
          </div>

          <div className="sidebar-tabs">
            <button className={libraryTab === "core" ? "active" : ""} onClick={() => setLibraryTab("core")}>{uiText.coreTab}</button>
            <button className={libraryTab === "pro" ? "active" : ""} onClick={() => setLibraryTab("pro")}>{uiText.proTab}</button>
            <button className={libraryTab === "functions" ? "active" : ""} onClick={() => setLibraryTab("functions")}>{uiText.functionsTab}</button>
          </div>

          {libraryTab === "functions" ? (
            <section className="function-hub">
              <div className="function-hub-head">
                <strong>{uiText.functions}</strong>
                <button className="ghost-btn" onClick={createFunction}>{uiText.createFunction}</button>
              </div>
              {activeFunctionId ? (
                <div className="function-editor-state">
                  <span>{uiText.editingFunction}</span>
                  <strong>{functions.find((item) => item.id === activeFunctionId)?.name || "function"}</strong>
                  <button className="ghost-btn" onClick={exitFunctionEditor}>{uiText.returnToMain}</button>
                </div>
              ) : null}
              {activeFunctionId ? (
                <div className="function-signature-editor">
                  <label>
                    <span>{uiText.functionDescription}</span>
                    <textarea
                      value={functions.find((item) => item.id === activeFunctionId)?.description || ""}
                      onChange={(event) => updateFunctionSignature(activeFunctionId, "description", event.target.value)}
                      placeholder={uiText.functionDescriptionPlaceholder}
                    />
                  </label>
                  <label>
                    <span>{uiText.returnRefKey}</span>
                    <input
                      value={functions.find((item) => item.id === activeFunctionId)?.returnRef || ""}
                      onChange={(event) => updateFunctionSignature(activeFunctionId, "returnRef", event.target.value)}
                      placeholder="result"
                    />
                  </label>
                  <div className="function-parameter-head">
                    <strong>{uiText.parameters}</strong>
                    <button className="ghost-btn" onClick={() => addFunctionParameter(activeFunctionId)}>{uiText.addParameter}</button>
                  </div>
                  <div className="function-parameter-list">
                    {(functions.find((item) => item.id === activeFunctionId)?.parameters || []).map((parameter) => (
                      <div key={parameter.id} className="function-parameter-row">
                        <input
                          value={parameter.name}
                          onChange={(event) => updateFunctionParameter(activeFunctionId, parameter.id, "name", event.target.value)}
                          placeholder="name"
                        />
                        <input
                          value={parameter.defaultValue}
                          onChange={(event) => updateFunctionParameter(activeFunctionId, parameter.id, "defaultValue", event.target.value)}
                          placeholder={uiText.defaultValue}
                        />
                        <input
                          value={parameter.description}
                          onChange={(event) => updateFunctionParameter(activeFunctionId, parameter.id, "description", event.target.value)}
                          placeholder={uiText.description}
                        />
                        <button className="ghost-btn danger-lite" onClick={() => removeFunctionParameter(activeFunctionId, parameter.id)}>{uiText.delete}</button>
                      </div>
                    ))}
                    {!(functions.find((item) => item.id === activeFunctionId)?.parameters || []).length ? (
                      <span className="field-hint">{uiText.noParametersHint}</span>
                    ) : null}
                  </div>
                </div>
              ) : null}
              {functions.length ? (
                <div className="function-list">
                  {functions.map((item) => (
                    <div key={item.id} className={`function-list-item ${item.id === activeFunctionId ? "is-active" : ""}`}>
                      <input
                        value={item.name}
                        onChange={(event) => renameFunction(item.id, event.target.value)}
                        aria-label={uiText.functionNameAria}
                      />
                      <small>{item.parameters.length ? `(${item.parameters.map((parameter) => parameter.name).join(", ")})` : `(${uiText.noParams})`}</small>
                      <button className="ghost-btn" onClick={() => enterFunctionEditor(item.id)}>{uiText.edit}</button>
                      <button className="ghost-btn danger-lite" onClick={() => deleteFunction(item.id)}>{uiText.delete}</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="library-empty-state compact">
                  <strong>{uiText.noFunctions}</strong>
                  <span>{uiText.noFunctionsHint}</span>
                </div>
              )}
            </section>
          ) : null}

          {visibleLibraryNodeCount ? (
            Object.entries(sidebarGroups).map(([group, items]) => (
              <section key={group} className="library-section">
                <button className="section-toggle" onClick={() => toggleSection(group)}>
                  <span className="section-label">{GROUP_ICON[group] || "•"} {getGroupLabel(group, language)}</span>
                  <span>{normalizedLibrarySearchTerm ? "-" : collapsed[group] ? "+" : "-"}</span>
                </button>

                {normalizedLibrarySearchTerm || !collapsed[group] ? (
                  <div className="node-list">
                    {items.map((item) => (
                      <button
                        key={item.key}
                        draggable
                        onDragStart={(event) => onDragStartNode(event, item)}
                        className="node-chip"
                      >
                        <span className="node-chip-dot" style={{ background: NODE_COLOR[item.group] }} />
                        {getNodeLabel(item.type, language, item.label)}
                      </button>
                    ))}
                  </div>
                ) : null}
              </section>
            ))
          ) : (
            <div className="library-empty-state">
              <strong>{uiText.noMatchingNodes}</strong>
              <span>{uiText.tryAnotherKeyword}</span>
            </div>
          )}
        </aside>

        <section className="canvas-zone">
          <PanelGroup direction="vertical" className="vertical-panels">
            <ResizablePanel defaultSize={74} minSize={45}>
              <PanelGroup direction="horizontal" className="split-group">
                <ResizablePanel defaultSize={61} minSize={34}>
                  {CanvasPane}
                </ResizablePanel>
                <PanelResizeHandle className="resize-handle" />
                <ResizablePanel defaultSize={39} minSize={25}>
                  <RuntimePanel
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    runtime={runtime}
                    nodes={nodesWithTrace}
                    inputValues={inputValues}
                    onInputChange={updateInputValue}
                    uiElements={uiElements}
                    selectedUiElementId={selectedUiElementId}
                    setSelectedUiElementId={setSelectedUiElementId}
                    onBuilderDrop={handleBuilderDrop}
                    onBuilderDragOver={handleBuilderDragOver}
                    onBuilderPointerDown={handleBuilderPointerDown}
                    onBuilderPointerUp={handleBuilderPointerUp}
                    builderCanvasRef={builderCanvasRef}
                    debugOverlay={debugOverlay}
                    flowJson={flowJson}
                    onUiAction={openUiAction}
                    onUiInteraction={handleUiInteraction}
                    appendLog={appendLog}
                    uiText={uiText}
                    previewDevice={previewDevice}
                    setPreviewDevice={setPreviewDevice}
                    onUiElementSelect={handleUiElementSelect}
                    onOpenSettings={() => setShowSettings(true)}
                    activeScene={activeScene}
                    setActiveScene={setActiveScene}
                    sceneNames={sceneNames}
                    onCreateScene={createScene}
                    onDeleteScene={deleteScene}
                    onAddComponent={createUiComponentFromPalette}
                  />
                </ResizablePanel>
              </PanelGroup>
            </ResizablePanel>

            <PanelResizeHandle className="resize-handle horizontal-handle" />

            <ResizablePanel defaultSize={26} minSize={14}>
              <LogConsole logs={logs} onClear={() => setLogs([])} uiText={uiText} />
            </ResizablePanel>
          </PanelGroup>
        </section>

        <aside className="properties">
          <div className="panel-title">{selectedUiElement ? uiText.uiInspector : inspectorMode === "inspector" ? uiText.proInspector : uiText.properties}</div>

          <div className="properties-stack">
            <div className="properties-card">
              <div className="summary-grid">
                <div>
                  <strong>{nodes.length}</strong>
                  <span>{uiText.nodes}</span>
                </div>
                <div>
                  <strong>{edges.length}</strong>
                  <span>{uiText.edges}</span>
                </div>
                <div>
                  <strong>{uiElements.length}</strong>
                  <span>{uiText.uiLayers}</span>
                </div>
                <div>
                  <strong>{logs.length}</strong>
                  <span>{uiText.logs}</span>
                </div>
              </div>
              <div className="inspector-note">
                <strong>{uiText.viewerMode}</strong>
                <span>{viewMode === "builder" ? uiText.viewerModeBuilder : viewMode === "viewer" ? uiText.viewerModeViewer : uiText.viewerModePreview}</span>
              </div>
            </div>

            <section className="asset-manager-card">
              <div className="asset-manager-head">
                <strong>Asset Manager</strong>
                <span>{assets.length} assets</span>
              </div>
              <label className="asset-upload-btn">
                <input type="file" accept="image/*,audio/*,.svg,.json,.ixo,.ixo-theme" onChange={(event) => addAssetFile(event.target.files?.[0])} />
                Drag/upload asset or .ixo
              </label>
              {assets.length ? (
                <div className="asset-list">
                  {assets.slice(-5).map((asset) => (
                    <div
                      key={asset.id}
                      className={`asset-row ${isImageAsset(asset) || isIxoProjectAsset(asset) ? "is-draggable" : ""}`}
                      draggable={isImageAsset(asset) || isIxoProjectAsset(asset)}
                      onDragStart={(event) => {
                        event.dataTransfer.setData("application/ixo-asset-id", asset.id);
                        event.dataTransfer.effectAllowed = "copy";
                      }}
                      title={isImageAsset(asset) ? "Canvas Builder로 끌어 이미지 UI를 만들 수 있습니다." : isIxoProjectAsset(asset) ? "Canvas Builder로 끌어 노드/UI를 붙여넣을 수 있습니다." : asset.name}
                    >
                      <span>{asset.name}<em>{getAssetKindLabel(asset)}</em></span>
                      <button className="ghost-btn danger-lite" onClick={() => removeAsset(asset.id)}>{uiText.delete}</button>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="field-hint">Export에는 사용 중인 파일만 포함되도록 정리할 수 있습니다.</span>
              )}
              <button className="ghost-btn" onClick={cleanupUnusedAssets}>Clean unused</button>
            </section>

            {selectedUiElement ? (
              <div className="property-form">
                <label>
                  {uiText.elementKind}
                  <input type="text" value={selectedUiElement.kind} readOnly />
                </label>
                <label>
                  {uiText.textLabel}
                  <input type="text" value={selectedUiElement.text || ""} onChange={(event) => updateUiField("text", event.target.value)} />
                </label>
                <label>
                  {uiText.imageSrc}
                  <input type="text" value={selectedUiElement.src || ""} onChange={(event) => updateUiField("src", event.target.value)} />
                </label>
                <label>
                  {uiText.bindingRefKey}
                  <input type="text" value={selectedUiElement.bindingKey || ""} onChange={(event) => updateUiField("bindingKey", event.target.value)} placeholder="welcomeText, username..." />
                </label>
                <label>
                  Scene
                  <select value={selectedUiElement.scene || "main"} onChange={(event) => updateUiField("scene", event.target.value)}>
                    {sceneNames.map((scene) => <option key={scene} value={scene}>{scene}</option>)}
                  </select>
                </label>
                <label>
                  X
                  <input type="number" value={selectedUiElement.x} onChange={(event) => updateUiField("x", event.target.value)} />
                </label>
                <label>
                  Y
                  <input type="number" value={selectedUiElement.y} onChange={(event) => updateUiField("y", event.target.value)} />
                </label>
                <label>
                  {uiText.width}
                  <input type="number" value={selectedUiElement.width} onChange={(event) => updateUiField("width", event.target.value)} />
                </label>
                <label>
                  {uiText.height}
                  <input type="number" value={selectedUiElement.height} onChange={(event) => updateUiField("height", event.target.value)} />
                </label>
                <label>
                  {uiText.fontSize}
                  <input type="number" value={selectedUiElement.fontSize} onChange={(event) => updateUiField("fontSize", event.target.value)} />
                </label>
                <label>
                  {uiText.radius}
                  <input type="number" value={selectedUiElement.radius} onChange={(event) => updateUiField("radius", event.target.value)} />
                </label>
                <label>
                  {uiText.textColor}
                  <input type="color" value={selectedUiElement.color} onChange={(event) => updateUiField("color", event.target.value)} />
                </label>
                <label>
                  {uiText.background}
                  <input type="text" value={selectedUiElement.background} onChange={(event) => updateUiField("background", event.target.value)} />
                </label>
                <label>
                  CSS
                  <textarea value={selectedUiElement.cssText || ""} onChange={(event) => updateUiField("cssText", event.target.value)} placeholder="box-shadow: 0 12px 36px rgba(0,0,0,.22); padding: 12px;" />
                </label>
                {["custom-button", "vector"].includes(selectedUiElement.kind) ? (
                  <>
                    <VectorDrawPad
                      element={selectedUiElement}
                      accent={selectedUiElement.vectorFill || currentTheme.accent}
                      onChange={(path) => updateUiField("vectorPath", path)}
                    />
                    <label>
                      Vector Fill
                      <input type="color" value={selectedUiElement.vectorFill || currentTheme.accent} onChange={(event) => updateUiField("vectorFill", event.target.value)} />
                    </label>
                    <details className="advanced-vector-path">
                      <summary>Advanced SVG path</summary>
                      <textarea value={selectedUiElement.vectorPath || ""} onChange={(event) => updateUiField("vectorPath", event.target.value)} placeholder="M10 10 H120 V60 H10 Z" />
                    </details>
                  </>
                ) : null}
                <label>
                  {uiText.actionType}
                  <select value={selectedUiElement.actionType} onChange={(event) => updateUiField("actionType", event.target.value)}>
                    {ACTION_SYSTEM_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
                <label>
                  {uiText.actionValue}
                  <input type="text" value={selectedUiElement.actionValue || ""} onChange={(event) => updateUiField("actionValue", event.target.value)} />
                </label>
                <button className="danger-btn" onClick={deleteSelection}>{uiText.deleteUiElement}</button>
              </div>
            ) : selectedNode ? (
              <div className="property-form">
                <label>
                  {uiText.nodeLabel}
                  <input type="text" value={selectedNode.data.label} onChange={(event) => updateNodeField("label", event.target.value)} />
                </label>
                <label>
                  {selectedNode.data.nodeType === "condition"
                    ? uiText.conditionChain
                    : selectedNode.data.nodeType === "math"
                      ? uiText.mathExpression
                      : selectedNode.data.nodeType === "script"
                        ? uiText.javascriptCode
                        : uiText.valueSetting}
                  {selectedNode.data.nodeType === "condition" || selectedNode.data.nodeType === "math" || selectedNode.data.nodeType === "script" ? (
                    <textarea
                      value={selectedNode.data.value || ""}
                      onChange={(event) => updateNodeField("value", event.target.value)}
                      placeholder={selectedNode.data.nodeType === "script" ? "return context.username;" : "{{score}} > 10 AND {{role}} == admin"}
                    />
                  ) : selectedNode.data.nodeType === "file-watcher" ? (
                    <div className="watch-path-picker">
                      <input
                        type="text"
                        value={selectedNode.data.value || ""}
                        readOnly
                        placeholder={uiText.chooseWatchPathHint}
                      />
                      <button className="ghost-btn" onClick={chooseFileWatcherPath}>{uiText.chooseWatchPath}</button>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={selectedNode.data.value || ""}
                      onChange={(event) => updateNodeField("value", event.target.value)}
                      placeholder="text, path, url, expression..."
                    />
                  )}
                </label>
                {selectedScriptRequiresFullJs ? (
                  <section className={`script-warning-card state-${scriptTrustState}`}>
                    <strong>{uiText.fullJavascriptWarningTitle}</strong>
                    <p>{uiText.fullJavascriptWarningCopy}</p>
                    <div className="script-warning-grid">
                      <div>
                        <span>{uiText.fullJavascriptWhyTitle}</span>
                        <ul>
                          {uiText.fullJavascriptWhyItems.map((item) => <li key={item}>{item}</li>)}
                        </ul>
                      </div>
                      <div>
                        <span>{uiText.fullJavascriptRecommendedTitle}</span>
                        <ul>
                          {uiText.fullJavascriptRecommendedItems.map((item) => <li key={item}>{item}</li>)}
                        </ul>
                      </div>
                    </div>
                    <small>{uiText.fullJavascriptTrustHint}</small>
                    <button
                      className="ghost-btn"
                      onClick={() => requestSecurityApproval("script")}
                      disabled={scriptTrustState === "trusted"}
                    >
                      {uiText.requestFullJavascript}
                    </button>
                  </section>
                ) : null}
                <label>
                  {uiText.refKey}
                  <input type="text" value={selectedNode.data.refKey || ""} onChange={(event) => updateNodeField("refKey", event.target.value)} placeholder="username, totalPrice..." />
                </label>
                <label>
                  {uiText.groupLabel}
                  <input type="text" value={selectedNode.data.groupLabel || ""} onChange={(event) => updateNodeField("groupLabel", event.target.value)} placeholder="Flow A, Login, UI..." />
                </label>
                <label>
                  {uiText.nodeType}
                  <input type="text" value={selectedNode.data.nodeType || ""} onChange={(event) => updateNodeField("nodeType", event.target.value)} />
                </label>
                <label>
                  Permission Scope
                  <input type="text" value={selectedNode.data.permissionScope || getNodePermissionScope(selectedNode.data.nodeType) || "none"} readOnly />
                </label>
                {selectedNode.data.nodeType === "function-call" && selectedFunctionDefinition ? (
                  <div className="function-call-args">
                    <strong>{uiText.functionArguments}</strong>
                    {selectedFunctionDefinition.parameters.length ? (
                      selectedFunctionDefinition.parameters.map((parameter) => (
                        <label key={parameter.id}>
                          <span>{parameter.name}</span>
                          <input
                            type="text"
                            value={selectedNode.data.functionArgs?.[parameter.id] ?? selectedNode.data.functionArgs?.[parameter.name] ?? ""}
                            onChange={(event) => updateNodeFunctionArg(parameter.id, event.target.value)}
                            placeholder={parameter.defaultValue || `{{${parameter.name}}}`}
                          />
                          {parameter.description ? <em>{parameter.description}</em> : null}
                          {parameter.defaultValue ? <small>{uiText.defaultValue}: {parameter.defaultValue}</small> : null}
                        </label>
                      ))
                    ) : (
                      <span className="field-hint">{uiText.functionNoParams}</span>
                    )}
                    <span className="field-hint">
                      {uiText.functionReturnPrefix} `{selectedFunctionDefinition.returnRef || uiText.lastExecutedNode}` {uiText.functionReturnSuffix}
                    </span>
                  </div>
                ) : null}
                <label>
                  {uiText.numericSlider}
                  <input type="range" min="0" max="100" value={Number(selectedNode.data.sliderValue || 0)} onChange={(event) => updateNodeField("sliderValue", event.target.value)} />
                </label>
                <label>
                  {uiText.colorPicker}
                  <input type="color" value={selectedNode.data.colorValue || ACCENT} onChange={(event) => updateNodeField("colorValue", event.target.value)} />
                </label>
                {["audio-player", "sound-play", "sound-play-wait", "bgm-play"].includes(selectedNode.data.nodeType) ? (
                  <label>
                    {uiText.soundUpload}
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(event) => updateNodeSoundFile(event.target.files?.[0])}
                    />
                    {selectedNode.data.soundName ? <span className="field-hint">{selectedNode.data.soundName}</span> : null}
                  </label>
                ) : selectedNode.data.nodeType !== "file-watcher" ? (
                  <label>
                    {uiText.filePath}
                    <input
                      type="file"
                      onChange={(event) => updateNodeField("value", event.target.files?.[0]?.name || "")}
                    />
                  </label>
                ) : null}
                <div className="selected-id">{uiText.selectedId}: {selectedNode.id}</div>
                <button className="ghost-btn" onClick={() => createUiElementFromPalette("text")}>{uiText.createLinkedUiText}</button>
              </div>
            ) : (
              <div className="placeholder-card">
                <p className="placeholder">{uiText.emptyInspectorHint}</p>
                <div className="placeholder-actions">
                  <button className="ghost-btn" onClick={() => createUiElementFromPalette("text")}>{uiText.addUiText}</button>
                  <button className="ghost-btn" onClick={() => createUiElementFromPalette("button")}>{uiText.addUiButton}</button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </main>

      <footer className="status-bar">
        <span>{uiText.engineStatus}: {status}{isDirty ? ` | ${uiText.unsavedChanges}` : ""}{projectFilePath ? ` | ${projectFilePath}` : ""}</span>
        <span>{uiText.nodes} {nodes.length} | {uiText.edges} {edges.length} | UI {uiElements.length} | Dirty {runtimeRevision.dirtyNodeIds.length} | Culled {uiRenderStats.culled} | {uiText.mode} {viewMode}</span>
      </footer>

      <SettingsModal
        open={showSettings}
        uiText={UI_TEXT[draftLanguage] || uiText}
        draftLanguage={draftLanguage}
        setDraftLanguage={setDraftLanguage}
        draftThemeKey={draftThemeKey}
        setDraftThemeKey={setDraftThemeKey}
        themeOptions={themeOptions}
        onThemeUpload={handleThemeUpload}
        draftPreviewDevice={draftPreviewDevice}
        setDraftPreviewDevice={setDraftPreviewDevice}
        draftTemplateKey={draftTemplateKey}
        setDraftTemplateKey={setDraftTemplateKey}
        draftHttpsNodesEnabled={draftHttpsNodesEnabled}
        setDraftHttpsNodesEnabled={setDraftHttpsNodesEnabled}
        appInfo={appInfo}
        updateInfo={updateInfo}
        updateState={updateState}
        onCheckForUpdates={() => checkForUpdates()}
        onDownloadUpdate={downloadUpdate}
        onOpenReleasePage={openReleasePageFromSettings}
        onOpenPrivacyPolicy={() => setShowPrivacyPolicy(true)}
        onApply={applySettings}
        onCancel={cancelSettings}
        onClearAutosave={clearLocalAutosave}
      />

      <PrivacyPolicyModal
        open={showPrivacyPolicy}
        uiText={uiText}
        language={language}
        onClose={() => setShowPrivacyPolicy(false)}
      />

      <ExportModal
        open={showExportModal}
        uiText={uiText}
        appName={exportAppName}
        icon={exportIcon}
        mobileIconBackgroundColor={mobileIconBackgroundColor}
        outputPath={exportOutputPath}
        targets={exportTargets}
        targetOptions={exportTargetOptions}
        pipeline={exportPipeline}
        exportSettings={exportSettings}
        mobileBundleId={mobileBundleId}
        mobileVersionName={mobileVersionName}
        busy={exportBusy}
        onAppNameChange={setExportAppName}
        onIconChange={setExportIcon}
        onMobileIconBackgroundColorChange={setMobileIconBackgroundColor}
        onPickPath={pickExportPath}
        onToggleTarget={toggleExportTarget}
        onPipelineChange={changeExportPipeline}
        onExportSettingsChange={(patch) => setExportSettings((current) => normalizeExportSettings({ ...current, ...patch }))}
        onMobileBundleIdChange={setMobileBundleId}
        onMobileVersionNameChange={setMobileVersionName}
        onExport={exportProject}
        onCancel={() => {
          if (!exportBusy) {
            setShowExportModal(false);
          }
        }}
      />

      {toastMessage ? <div className="settings-toast">{toastMessage}</div> : null}
    </div>
  );
}

function ExportRuntimeApp() {
  const [project, setProject] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [inputValues, setInputValues] = useState({});
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [activeScene, setActiveScene] = useState("main");
  const [hiddenUiIds, setHiddenUiIds] = useState([]);
  const [httpsNodesEnabled, setHttpsNodesEnabled] = useState(false);
  const [scriptExecutionAllowed, setScriptExecutionAllowed] = useState(false);
  const [interactionState, setInteractionState] = useState({
    pointerDown: false,
    pointerX: 0,
    pointerY: 0,
    keysDown: [],
    clickedIds: [],
    hoveredIds: [],
    pointerOverId: "",
    fileWatchEvents: {}
  });
  const builderCanvasRef = useRef(null);
  const inFlightExternalActionsRef = useRef(new Set());
  const lastActionSignatureRef = useRef("");

  useEffect(() => {
    let mounted = true;
    const loadProject = async () => {
      try {
        const embedded = await window.ixo?.getEmbeddedRuntimeProject?.();
        const raw = embedded || await fetch("./project.json").then((response) => {
          if (!response.ok) {
            throw new Error("Runtime project file was not found.");
          }
          return response.json();
        });
        const migrated = migrateProjectState(raw || {});
        if (!validateProjectState(migrated)) {
          throw new Error("Embedded runtime project is invalid.");
        }
        if (!mounted) return;
        setProject(migrated);
        setInputValues(migrated.inputValues || {});
        setPreviewDevice(migrated.previewDevice || "desktop");
        setActiveScene(migrated.activeScene || "main");
      } catch (error) {
        if (mounted) {
          setLoadError(String(error.message || error));
        }
      }
    };
    loadProject();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadSecurityPreference = async () => {
      try {
        const preferences = await window.ixo?.getSecurityPreferences?.();
        const startupPreference = preferences?.httpsNodesEnabled === null
          ? await window.ixo?.promptStartupHttpsPreference?.()
          : preferences;
        if (mounted) {
          setHttpsNodesEnabled(Boolean(startupPreference?.httpsNodesEnabled));
        }
      } catch {
        if (mounted) {
          setHttpsNodesEnabled(false);
        }
      }
    };
    loadSecurityPreference();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      setInteractionState((current) => ({
        ...current,
        pointerDown: true,
        pointerX: event.clientX,
        pointerY: event.clientY
      }));
    };
    const handlePointerUp = (event) => {
      setInteractionState((current) => ({
        ...current,
        pointerDown: false,
        pointerX: event.clientX,
        pointerY: event.clientY
      }));
    };
    const handlePointerMove = (event) => {
      setInteractionState((current) => ({
        ...current,
        pointerX: event.clientX,
        pointerY: event.clientY
      }));
    };
    const handleKeyDown = (event) => {
      setInteractionState((current) => ({
        ...current,
        keysDown: current.keysDown.includes(event.key.toLowerCase())
          ? current.keysDown
          : [...current.keysDown, event.key.toLowerCase()]
      }));
    };
    const handleKeyUp = (event) => {
      setInteractionState((current) => ({
        ...current,
        keysDown: current.keysDown.filter((key) => key !== event.key.toLowerCase())
      }));
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!window.ixo?.onWatchEvent) return undefined;
    return window.ixo.onWatchEvent((event) => {
      setInteractionState((current) => ({
        ...current,
        fileWatchEvents: {
          ...current.fileWatchEvents,
          [event.path]: event,
          [event.requestedPath || event.path]: event
        }
      }));
    });
  }, []);

  const requestSecurityApproval = useCallback(async (scope, context = {}) => {
    if (!window.ixo?.requestSecurityApproval) return false;
    const result = await window.ixo.requestSecurityApproval(scope, context);
    return Boolean(result?.approved);
  }, []);

  const requestSecureHttps = useCallback(async (rawUrl) => {
    if (!httpsNodesEnabled) {
      throw new Error("HTTPS nodes are disabled.");
    }
    const validation = validateClientHttpsUrl(rawUrl);
    if (!validation.ok) {
      throw new Error(validation.error);
    }
    if (!await requestSecurityApproval("external")) {
      throw new Error("External actions were blocked by the user.");
    }
    return window.ixo?.requestHttps?.(validation.url);
  }, [httpsNodesEnabled, requestSecurityApproval]);

  const openSecureExternalUrl = useCallback(async (rawUrl) => {
    const validation = validateClientHttpsUrl(rawUrl);
    if (!validation.ok) {
      throw new Error(validation.error);
    }
    if (!await requestSecurityApproval("external")) {
      throw new Error("External actions were blocked by the user.");
    }
    await window.ixo?.openExternal?.(validation.url);
    return validation.url;
  }, [requestSecurityApproval]);

  const runtime = useMemo(() => (
    project
      ? runPipeline(
          project.nodes,
          project.edges,
          inputValues,
          false,
          scriptExecutionAllowed,
          interactionState,
          project.functions
        )
      : createRuntimeState()
  ), [inputValues, interactionState, project, scriptExecutionAllowed]);

  const nodesWithTrace = useMemo(() => (
    (project?.nodes || []).map((node) => ({
      ...node,
      data: {
        ...node.data,
        displayLabel: getNodeLabel(node.data?.nodeType, project?.language || "ko", node.data?.label),
        displayCategory: getGroupLabel(node.data?.kind, project?.language || "ko"),
        liveValue: runtime.liveValues[node.id] ?? "",
        isActive: runtime.activeNodeIds.includes(node.id),
        isFocused: runtime.focusedNodeId === node.id
      }
    }))
  ), [project, runtime.activeNodeIds, runtime.focusedNodeId, runtime.liveValues]);

  const runtimeUiElements = useMemo(() => {
    const existingElements = Array.isArray(project?.uiElements) ? project.uiElements : [];
    const linkedInputNodeIds = new Set(
      existingElements
        .filter((element) => element.kind === "input")
        .map((element) => element.linkedNodeId)
        .filter(Boolean)
    );
    const linkedInputKeys = new Set(
      existingElements
        .filter((element) => element.kind === "input")
        .map((element) => element.bindingKey)
        .filter(Boolean)
    );
    const theme = THEME_OPTIONS[project?.themeKey] || THEME_OPTIONS.mint;
    const generatedInputs = (project?.nodes || [])
      .filter((node) => node.data?.nodeType === "input")
      .filter((node) => !linkedInputNodeIds.has(node.id) && !(node.data?.refKey && linkedInputKeys.has(node.data.refKey)))
      .map((node, index) => createUiElementFromNode(node, existingElements.length + index, theme.accent));

    const combined = generatedInputs.length ? [...existingElements, ...generatedInputs] : existingElements;
    return combined.map((element) => ({ ...element, hidden: element.hidden || hiddenUiIds.includes(element.id) }));
  }, [hiddenUiIds, project]);

  useEffect(() => {
    if (!project) return;

    const signatures = [];
    const activeTargets = new Set(
      runtime.activeEdgeIds
        .map((id) => project.edges.find((edge) => edge.id === id)?.target)
        .filter(Boolean)
    );

    const runExternalActions = async () => {
      for (const node of project.nodes) {
        if (!activeTargets.has(node.id) || !node.data?.value) continue;
        const rawUrl = applyTemplate(node.data.value, runtime.context);

        if (node.data?.nodeType === "http") {
          const validation = validateClientHttpsUrl(rawUrl);
          const signatureUrl = validation.ok ? validation.url : rawUrl;
          const signature = `https:${node.id}:${signatureUrl}`;
          signatures.push(signature);
          if (lastActionSignatureRef.current.includes(`|${signature}|`) || inFlightExternalActionsRef.current.has(signature)) continue;
          inFlightExternalActionsRef.current.add(signature);
          try {
            if (!validation.ok) throw new Error(validation.error);
            await requestSecureHttps(validation.url);
          } finally {
            inFlightExternalActionsRef.current.delete(signature);
          }
        }

        if (node.data?.nodeType === "browser") {
          const validation = validateClientHttpsUrl(rawUrl);
          const signatureUrl = validation.ok ? validation.url : rawUrl;
          const signature = `browser:${node.id}:${signatureUrl}`;
          signatures.push(signature);
          if (lastActionSignatureRef.current.includes(`|${signature}|`) || inFlightExternalActionsRef.current.has(signature)) continue;
          inFlightExternalActionsRef.current.add(signature);
          try {
            if (!validation.ok) throw new Error(validation.error);
            await openSecureExternalUrl(validation.url);
          } finally {
            inFlightExternalActionsRef.current.delete(signature);
          }
        }
      }
      lastActionSignatureRef.current = signatures.length ? `|${signatures.join("|")}|` : "";
    };

    runExternalActions().catch(() => {});
  }, [openSecureExternalUrl, project, requestSecureHttps, runtime.activeEdgeIds, runtime.context]);

  useEffect(() => {
    if (!project || scriptExecutionAllowed) return;
    const activeScriptNode = project.nodes.find(
      (node) => runtime.activeNodeIds.includes(node.id)
        && node.data?.nodeType === "script"
        && !canRunRestrictedScript(node.data?.value)
    );
    if (!activeScriptNode) return;
    requestSecurityApproval("script").then((approved) => {
      if (approved) {
        setScriptExecutionAllowed(true);
      }
    });
  }, [project, requestSecurityApproval, runtime.activeNodeIds, scriptExecutionAllowed]);

  useEffect(() => {
    if (!project || !window.ixo?.watchPath) return undefined;
    const watcherNodes = project.nodes.filter((node) => node.data?.nodeType === "file-watcher" && node.data?.value);
    const activePaths = watcherNodes.map((node) => String(node.data.value));
    let disposed = false;

    const startWatchers = async () => {
      if (!activePaths.length) return;
      const approved = await requestSecurityApproval("fileWatcher", { path: activePaths[0] });
      if (!approved || disposed) return;
      activePaths.forEach((targetPath) => {
        window.ixo.watchPath(targetPath).catch(() => {});
      });
    };

    startWatchers();
    return () => {
      disposed = true;
      activePaths.forEach((targetPath) => {
        window.ixo?.unwatchPath?.(targetPath);
      });
    };
  }, [project, requestSecurityApproval]);

  const handleUiInteraction = useCallback((id, action) => {
    setInteractionState((current) => {
      if (action === "enter") {
        return {
          ...current,
          hoveredIds: current.hoveredIds.includes(id) ? current.hoveredIds : [...current.hoveredIds, id],
          pointerOverId: id
        };
      }
      if (action === "leave") {
        return {
          ...current,
          hoveredIds: current.hoveredIds.filter((hoveredId) => hoveredId !== id),
          pointerOverId: current.pointerOverId === id ? "" : current.pointerOverId
        };
      }
      if (action === "click") {
        window.setTimeout(() => {
          setInteractionState((latest) => ({
            ...latest,
            clickedIds: latest.clickedIds.filter((clickedId) => clickedId !== id)
          }));
        }, 120);
        return {
          ...current,
          clickedIds: [id]
        };
      }
      return current;
    });
  }, []);

  const openUiAction = useCallback(async (element) => {
    if (!element?.actionType || element.actionType === "none") {
      return { ok: true, label: "No action" };
    }
    const actionValue = applyTemplate(element.actionValue || "", runtime.context);
    if (element.actionType === "open-url") {
      const openedUrl = await openSecureExternalUrl(actionValue);
      return { ok: true, label: `Open URL ${maskUrlForLog(openedUrl)}` };
    }
    if (element.actionType === "request-https") {
      const result = await requestSecureHttps(actionValue);
      return { ok: true, label: `Request HTTPS ${maskUrlForLog(result?.url || actionValue)}` };
    }
    if (element.actionType === "set-variable") {
      const parsed = parseSetVariableAction(actionValue);
      const targetNode = project?.nodes.find((node) => node.id === parsed.key || node.data?.refKey === parsed.key);
      if (!targetNode) throw new Error(`Variable target was not found: ${parsed.key}`);
      setInputValues((current) => ({ ...current, [targetNode.id]: parsed.value }));
      return { ok: true, label: `Set ${parsed.key}` };
    }
    if (element.actionType === "toggle-ui") {
      const target = actionValue || element.id;
      const targetElements = runtimeUiElements.filter((item) => item.id === target || item.bindingKey === target);
      setHiddenUiIds((current) => {
        const next = new Set(current);
        targetElements.forEach((item) => {
          if (next.has(item.id)) next.delete(item.id);
          else next.add(item.id);
        });
        return [...next];
      });
      return { ok: true, label: `Toggle UI ${target}` };
    }
    if (element.actionType === "go-scene") {
      setActiveScene(actionValue || "main");
      return { ok: true, label: `Go Scene ${actionValue || "main"}` };
    }
    if (element.actionType === "play-sound") {
      const audio = new Audio(actionValue);
      await audio.play();
      return { ok: true, label: "Play Sound" };
    }
    if (element.actionType === "run-function") {
      return { ok: true, label: `Function ${actionValue || "queued"}` };
    }
    return { ok: true, label: element.actionType };
  }, [openSecureExternalUrl, project?.nodes, requestSecureHttps, runtime.context, runtimeUiElements]);

  const language = project?.language || "ko";
  const currentTheme = THEME_OPTIONS[project?.themeKey] || THEME_OPTIONS.mint;
  const runtimeExportSettings = normalizeExportSettings(project?.exportSettings || {});

  useEffect(() => {
    if (!project) return undefined;
    document.title = runtimeExportSettings.windowTitle || "IXO App";
    document.body.style.background = runtimeExportSettings.backgroundColor;
    return () => {
      document.body.style.background = "";
    };
  }, [project, runtimeExportSettings.backgroundColor, runtimeExportSettings.windowTitle]);

  if (loadError) {
    return <div className="runtime-export-error">Export runtime load failed: {loadError}</div>;
  }

  if (!project) {
    return <div className="runtime-export-loading">Loading exported app...</div>;
  }

  return (
    <div
      className={`runtime-export-shell lang-${language}`}
      style={{
        "--accent": currentTheme.accent,
        "--accent-soft": currentTheme.accentSoft,
        "--accent-strong": currentTheme.accentStrong,
        "--glow": currentTheme.glow,
        "--runtime-bg": runtimeExportSettings.backgroundColor
      }}
    >
      <RuntimePanel
        viewMode="viewer"
        setViewMode={() => {}}
        runtime={runtime}
        nodes={nodesWithTrace}
        inputValues={inputValues}
        onInputChange={(nodeId, value) => setInputValues((current) => ({ ...current, [nodeId]: value }))}
        uiElements={runtimeUiElements}
        selectedUiElementId={null}
        setSelectedUiElementId={() => {}}
        onBuilderDrop={() => {}}
        onBuilderDragOver={() => {}}
        onBuilderPointerDown={() => {}}
        onBuilderPointerUp={() => {}}
        builderCanvasRef={builderCanvasRef}
        debugOverlay={false}
        flowJson=""
        onUiAction={openUiAction}
        onUiInteraction={handleUiInteraction}
        appendLog={() => {}}
        uiText={UI_TEXT[language] || UI_TEXT.ko}
        previewDevice={previewDevice}
        setPreviewDevice={setPreviewDevice}
        onUiElementSelect={() => {}}
        onOpenSettings={() => {}}
        activeScene={activeScene}
        setActiveScene={setActiveScene}
        runtimeOnly
      />
    </div>
  );
}

export default function App() {
  const isExportRuntime = new URLSearchParams(window.location.search).get("runtime") === "1";
  return (
    <ReactFlowProvider>
      {isExportRuntime ? <ExportRuntimeApp /> : <EngineEditor />}
    </ReactFlowProvider>
  );
}
