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
  useNodesState,
  useReactFlow
} from "reactflow";
import "reactflow/dist/style.css";
import logoImage from "../IXO Logo.png";

// [앱 공통] 에디터 전역에서 반복 사용하는 상수 모음입니다.
const ACCENT = "#3ecf8e";
const LOGO_FALLBACKS = [
  logoImage,
  "./IXO Logo.png",
  "./IXO Logo.PNG",
  "https://github.com/minyang-tech/IXO-Engine/blob/main/IXO%20Logo.png?raw=true"
];

// [노드 UI] 카테고리별 아이콘과 컬러를 최대한 차분한 톤으로 정리했습니다.
const GROUP_ICON = {
  control: "⌁",
  visual: "◫",
  system: "⚙",
  logic: "∑",
  utility: "⊕",
  data: "◈",
  network: "⇄",
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
  network: "#57d8bc"
};

const TRACE_SPEED = {
  "0.5": 1.8,
  "1": 0.9,
  "1.5": 0.6,
  "2": 0.45
};

const DEFAULT_LOG_LIMIT = 150;
const LOCAL_AUTOSAVE_KEY = "ixo-engine-local-autosave-v1";

const LANGUAGE_OPTIONS = [
  { value: "ko", label: "\uD55C\uAD6D\uC5B4" },
  { value: "en", label: "English" },
  { value: "zh", label: "\u4E2D\u6587" },
  { value: "ja", label: "\u65E5\u672C\u8A9E" }
];

const THEME_OPTIONS = {
  mint: {
    label: "Mint",
    accent: "#3ecf8e",
    accentSoft: "rgba(62, 207, 142, 0.16)",
    accentStrong: "rgba(62, 207, 142, 0.28)",
    glow: "rgba(62, 207, 142, 0.28)"
  },
  crimson: {
    label: "Dark Red",
    accent: "#c84c5d",
    accentSoft: "rgba(200, 76, 93, 0.16)",
    accentStrong: "rgba(200, 76, 93, 0.3)",
    glow: "rgba(200, 76, 93, 0.28)"
  },
  ocean: {
    label: "Ocean Blue",
    accent: "#4aa8ff",
    accentSoft: "rgba(74, 168, 255, 0.16)",
    accentStrong: "rgba(74, 168, 255, 0.3)",
    glow: "rgba(74, 168, 255, 0.26)"
  }
};

const PREVIEW_DEVICE_OPTIONS = {
  desktop: { label: "Desktop", width: "100%" },
  tablet: { label: "Tablet", width: "820px" },
  mobile: { label: "Mobile", width: "390px" }
};

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
    http: "HTTP 요청",
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
    "hex-channel": "HEX 채널"
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
    http: "HTTP Request",
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
    "hex-channel": "HEX Channel"
  },
  zh: {},
  ja: {}
};

NODE_TEXT.zh = NODE_TEXT.en;
NODE_TEXT.ja = NODE_TEXT.en;

function getNodeLabel(nodeType, language, fallback) {
  return NODE_TEXT[language]?.[nodeType] || NODE_TEXT.en[nodeType] || fallback || nodeType;
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
    { key: "http-request", label: "HTTP Request", group: "network", type: "http" },
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
    { key: "speech-bubble", label: "Speech Bubble", group: "visual", type: "speech-bubble" },
    { key: "clear-speech", label: "Clear Speech", group: "visual", type: "clear-speech" },
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
const cloneState = (nodes, edges, inputValues, nodeCounter, uiElements) => ({
  nodes: JSON.parse(JSON.stringify(nodes)),
  edges: JSON.parse(JSON.stringify(edges)),
  inputValues: JSON.parse(JSON.stringify(inputValues)),
  nodeCounter,
  uiElements: JSON.parse(JSON.stringify(uiElements))
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
    width: Number(item.width ?? (item.kind === "button" ? 160 : 220)),
    height: Number(item.height ?? (item.kind === "container" ? 160 : item.kind === "image" ? 160 : 44)),
    text: item.text ?? "",
    src: item.src ?? "",
    bindingKey: item.bindingKey ?? "",
    color: item.color ?? "#f3f7f4",
    background: item.background ?? (item.kind === "container" ? "rgba(62, 207, 142, 0.08)" : "transparent"),
    fontSize: Number(item.fontSize ?? 16),
    radius: Number(item.radius ?? 14),
    align: item.align ?? "left",
    actionType: item.actionType ?? "none",
    actionValue: item.actionValue ?? ""
  }));
}

function applyNodeSelectionState(nodes, selectedIds) {
  const selectedSet = new Set(selectedIds);
  return nodes.map((node) => ({ ...node, selected: selectedSet.has(node.id) }));
}

// [UI 요소 생성] Canvas Builder에서 새 요소를 추가할 때 기본값을 제공합니다.
function createUiElement(kind, bindingKey = "", accentColor = ACCENT) {
  const id = `ui-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  if (kind === "image") {
    return {
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
      actionValue: ""
    };
  }

  if (kind === "button") {
    return {
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
      actionValue: "https://minyangtech.n-e.kr/docs/ixo/index"
    };
  }

  if (kind === "container") {
    return {
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
      actionValue: ""
    };
  }

  return {
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
    actionValue: ""
  };
}

// [템플릿] 노드 값이나 UI 텍스트에서 {{refKey}} 문법을 치환합니다.
function applyTemplate(text, context) {
  return String(text || "").replace(/\{\{\s*([^}]+)\s*\}\}/g, (_, key) => String(context[key.trim()] ?? ""));
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
    "ui-text": "UI Text Binding",
    "ui-image": "UI Image Binding",
    "ui-button": "UI Button Binding",
    "ui-container": "UI Container Binding"
  };

  return map[nodeType] ?? label;
}

// [런타임] 노드 그래프를 실제로 계산하고 실행 하이라이트 및 로그 이벤트를 생성합니다.
function runPipeline(nodes, edges, inputValues, paused) {
  const nodeMap = Object.fromEntries(nodes.map((node) => [node.id, node]));
  const outgoing = {};
  const context = {};
  const outputTexts = [];
  const outputImages = [];
  const outputSounds = [];
  const activeEdgeIds = [];
  const activeNodeIds = [];
  const liveValues = {};
  const events = [];

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
      try {
        // [스크립트 노드] 사용자 코드 실행 결과를 받아 콘솔에도 남깁니다.
        // eslint-disable-next-line no-new-func
        const fn = new Function("context", "inputValues", String(value || "return context;"));
        const result = fn(context, inputValues);
        produced = typeof result === "undefined" ? "" : result;
        events.push(makeLog("info", node.data?.label || "Script", `스크립트가 실행되었습니다. 결과: ${String(produced)}`));
      } catch (error) {
        produced = `Script Error: ${error.message}`;
        events.push(makeLog("error", node.data?.label || "Script", produced));
      }
    } else if (type === "condition") {
      const pass = evaluateConditionChain(value, context);
      produced = pass ? "true" : "false";
      events.push(makeLog("trace", node.data?.label || "Condition", `조건 분기 결과: ${produced}`));
    } else if (type === "compare" || type === "merge-data" || type === "constant" || type === "variable" || type === "storage") {
      produced = applyTemplate(value, context);
    } else if (type === "random") {
      produced = Math.floor(Math.random() * ((Number(applyTemplate(value, context)) || 100)));
    } else if (type === "image" || type === "video-player") {
      produced = applyTemplate(value, context);
      outputImages.push({ id: node.id, src: String(produced), label: node.data?.label || "Image" });
    } else if (type === "sound-play" || type === "sound-play-wait" || type === "bgm-play" || type === "audio-player") {
      produced = applyTemplate(value, context);
      if (produced) {
        outputSounds.push({ id: node.id, src: String(produced), label: node.data?.label || "Sound" });
      }
    } else if (type === "system-info") {
      produced = navigator.userAgent;
      outputTexts.push({ id: node.id, text: String(produced), label: node.data?.label || "System Info" });
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
    } else if (type === "rgb-hex") {
      const channels = String(applyTemplate(value, context)).match(/\d+/g)?.slice(0, 3).map((item) => Math.max(0, Math.min(255, Number(item)))) || [255, 0, 0];
      produced = `#${channels.map((item) => item.toString(16).padStart(2, "0")).join("")}`;
    } else if (type === "particle" || type === "file-watcher" || type === "loop" || type === "wait" || type === "switch" || type === "browser" || type === "http") {
      produced = applyTemplate(value, context);
    } else if (
      type.startsWith("signal-") ||
      ["scene-start", "repeat-times", "forever", "break-loop", "skip-cycle", "wait-until", "stop-flow", "restart-flow", "clone-spawn", "clone-remove", "move-steps", "edge-bounce", "change-x", "change-y", "set-x", "set-y", "go-to-point", "glide-point", "turn-angle", "set-heading", "face-target", "show-actor", "hide-actor", "speech-bubble", "clear-speech", "costume-switch", "visual-effect", "size-change", "layer-shift", "flip-horizontal", "pen-down", "pen-up", "pen-color", "pen-size", "fill-start", "fill-stop", "clear-drawing", "sound-stop", "volume-change", "volume-set", "tempo-change", "tempo-set", "pointer-down", "object-clicked", "key-held", "pointer-over", "number-check", "logic-and", "logic-or", "logic-not", "touch-screen", "text-letter", "text-replace", "text-case", "hex-channel"].includes(type)
    ) {
      produced = applyTemplate(value, context);
      outputTexts.push({ id: node.id, text: String(produced || node.data?.label || ""), label: node.data?.label || "Node" });
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
    events
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
  selected,
  onSelect,
  onPointerDown,
  onPointerUp,
  onAction
}) {
  const textValue = resolveUiValue(element, runtime, "text");
  const imageValue = resolveUiValue(element, runtime, "src");

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
    cursor: editable ? "grab" : element.kind === "button" && element.actionType !== "none" ? "pointer" : "default"
  };

  const handleClick = async (event) => {
    event.stopPropagation();
    onSelect?.(element.id);
    if (!editable && element.kind === "button" && element.actionType === "open-url" && element.actionValue) {
      await onAction?.(element.actionValue);
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
        onPointerDown?.(event, element.id);
      }}
      onPointerUp={(event) => {
        event.stopPropagation();
        onPointerUp?.();
      }}
      onPointerCancel={(event) => {
        event.stopPropagation();
        onPointerUp?.();
      }}
    >
      {element.kind === "image" ? (
        imageValue ? <img src={imageValue} alt={element.text || "Builder asset"} /> : <span className="builder-placeholder">Image</span>
      ) : (
        <div className="builder-copy">
          {textValue || (element.kind === "container" ? "Container" : "Empty")}
        </div>
      )}
      {editable ? <span className="builder-badge">{element.kind.toUpperCase()}</span> : null}
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
        <span>{data.category || "Node"}</span>
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
  appendLog,
  uiText,
  previewDevice,
  setPreviewDevice,
  onUiElementSelect,
  onOpenSettings
}) {
  const inputNodes = nodes.filter((node) => node.data?.nodeType === "input");
  const editable = viewMode === "builder";
  const showViewerStage = viewMode === "viewer" || viewMode === "builder";

  return (
    <div className="preview-shell">
      <div className="viewer-header">
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
      </div>

      {editable ? (
        <div className="builder-toolbar">
          <div className="builder-toolbar-copy">
            <strong>{uiText.builderToolbarTitle}</strong>
            <span>{uiText.builderToolbarCopy}</span>
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
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div
        className={`runtime-screen viewer-screen ${editable ? "builder-mode" : ""} ${viewMode === "preview" ? "preview-mode" : ""}`}
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

        {showViewerStage ? (
          <div className="device-toolbar">
            <span>{uiText.responsivePreview}</span>
            <div className="device-tabs">
              {Object.entries(PREVIEW_DEVICE_OPTIONS).map(([key, option]) => (
                <button key={key} className={previewDevice === key ? "active" : ""} onClick={() => setPreviewDevice(key)}>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {showViewerStage ? (
          <div className={`viewer-stage-shell device-${previewDevice}`}>
            <div
              ref={builderCanvasRef}
              className={`viewer-stage ${editable ? "is-editable" : ""}`}
              style={{ width: PREVIEW_DEVICE_OPTIONS[previewDevice]?.width || "100%" }}
              onDragOver={onBuilderDragOver}
              onDrop={onBuilderDrop}
              onClick={(event) => {
                if (editable && event.target === event.currentTarget) {
                  setSelectedUiElementId(null);
                }
              }}
            >
              <div className="viewer-stage-grid" />
              {uiElements.map((element) => (
                <BuilderElement
                  key={element.id}
                  element={element}
                  runtime={runtime}
                  editable={editable}
                  selected={selectedUiElementId === element.id}
                  onSelect={onUiElementSelect}
                  onPointerDown={editable ? onBuilderPointerDown : undefined}
                  onPointerUp={editable ? onBuilderPointerUp : undefined}
                  onAction={async (url) => {
                    await onUiAction(url);
                    appendLog(makeLog("info", "UI Viewer", `버튼 액션이 실행되었습니다: ${url}`));
                  }}
                />
              ))}
            </div>
          </div>
        ) : null}

        {(runtime.outputTexts.length || runtime.outputImages.length || runtime.outputSounds.length) ? (
          <div className="auto-output-stack">
            <div className="auto-output-title">Node Output Feed</div>
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
            <span>Execution</span>
            <strong>{runtime.topo.join(" -> ")}</strong>
          </div>
        ) : null}
      </div>

      {viewMode === "preview" ? <pre className="json-view">{flowJson}</pre> : null}
    </div>
  );
}

// [로그 콘솔] 내부 에러와 실행 이력을 하단 섹션에 정리합니다.
function LogConsole({ logs, onClear }) {
  return (
    <div className="log-console">
      <div className="log-console-header">
        <div>
          <strong>Error Log Console</strong>
          <span>스크립트 실행 결과, 분기 결과, 외부 액션 로그를 아래에 누적합니다.</span>
        </div>
        <button className="ghost-btn" onClick={onClear}>Clear</button>
      </div>

      <div className="log-console-list">
        {logs.length === 0 ? <div className="log-empty">아직 기록된 로그가 없습니다.</div> : null}
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
  draftPreviewDevice,
  setDraftPreviewDevice,
  draftTemplateKey,
  setDraftTemplateKey,
  appInfo,
  updateInfo,
  updateState,
  onCheckForUpdates,
  onDownloadUpdate,
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
              {Object.entries(THEME_OPTIONS).map(([key, option]) => (
                <option key={key} value={key}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="settings-field">
            <span>{uiText.responsivePreview}</span>
            <select value={draftPreviewDevice} onChange={(event) => setDraftPreviewDevice(event.target.value)}>
              {Object.entries(PREVIEW_DEVICE_OPTIONS).map(([key, option]) => (
                <option key={key} value={key}>{option.label}</option>
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
            </div>
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

// [메인 에디터] 노드 편집기, Viewer, Builder, 로그, 저장 기능을 총괄합니다.
function EngineEditor() {
  const { screenToFlowPosition } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [libraryTab, setLibraryTab] = useState("pro");
  const [collapsed, setCollapsed] = useState({});
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedNodeIds, setSelectedNodeIds] = useState([]);
  const [selectedEdgeIds, setSelectedEdgeIds] = useState([]);
  const [selectedUiElementId, setSelectedUiElementId] = useState(null);
  const [inspectorMode, setInspectorMode] = useState("basic");
  const [contextMenu, setContextMenu] = useState(null);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
  const [viewMode, setViewMode] = useState("preview");
  const [logs, setLogs] = useState([]);
  const [dragState, setDragState] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [language, setLanguage] = useState("ko");
  const [themeKey, setThemeKey] = useState("mint");
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [draftLanguage, setDraftLanguage] = useState("ko");
  const [draftThemeKey, setDraftThemeKey] = useState("mint");
  const [draftPreviewDevice, setDraftPreviewDevice] = useState("desktop");
  const [draftTemplateKey, setDraftTemplateKey] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [appInfo, setAppInfo] = useState({ version: "1.0.0", platform: "browser" });
  const [updateInfo, setUpdateInfo] = useState(null);
  const [updateState, setUpdateState] = useState("idle");

  const builderCanvasRef = useRef(null);
  const sidebarRef = useRef(null);
  const nodeCounterRef = useRef(nodeCounter);
  const lastExecutionKeyRef = useRef("");
  const lastActionSignatureRef = useRef("");
  const autoSaveTimerRef = useRef(null);

  useEffect(() => {
    nodeCounterRef.current = nodeCounter;
  }, [nodeCounter]);

  useEffect(() => {
    if (!showSettings) return;
    setDraftLanguage(language);
    setDraftThemeKey(themeKey);
    setDraftPreviewDevice(previewDevice);
    setDraftTemplateKey("");
  }, [language, previewDevice, showSettings, themeKey]);

  const appendLog = useCallback((entry) => {
    setLogs((current) => [...current.slice(-(DEFAULT_LOG_LIMIT - 1)), entry]);
  }, []);

  const runtime = useMemo(() => runPipeline(nodes, edges, inputValues, paused), [nodes, edges, inputValues, paused]);
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
  const selectedUiElement = useMemo(
    () => uiElements.find((item) => item.id === selectedUiElementId) || null,
    [uiElements, selectedUiElementId]
  );
  const currentTheme = THEME_OPTIONS[themeKey] || THEME_OPTIONS.mint;
  const uiText = UI_TEXT[language] || UI_TEXT.ko;

  const sidebarGroups = useMemo(() => {
    const list = LIBRARY_TABS[libraryTab];
    return list.reduce((acc, item) => {
      acc[item.group] = [...(acc[item.group] || []), item];
      return acc;
    }, {});
  }, [libraryTab]);

  const searchCandidates = useMemo(
    () =>
      Object.values(LIBRARY_TABS)
        .flat()
        .filter((item) => getNodeLabel(item.type, language, item.label).toLowerCase().includes(searchTerm.toLowerCase())),
    [language, searchTerm]
  );

  const nodeTypes = useMemo(() => ({ ixoNode: IXONode, ixoGroup: IXOGroupNode }), []);

  // [이력 저장] 의미 있는 편집 직전마다 상태를 보관해 Undo/Redo를 안정적으로 유지합니다.
  const snapshot = useCallback(() => {
    setHistory((current) => [...current.slice(-79), cloneState(nodes, edges, inputValues, nodeCounterRef.current, uiElements)]);
    setFuture([]);
  }, [nodes, edges, inputValues, uiElements]);

  // [이력 적용] 되돌리기 시 복구할 상태를 일관된 방식으로 반영합니다.
  const applyState = useCallback((state) => {
    setNodes(applyNodeSelectionState(state.nodes, []));
    setEdges((state.edges || []).map((edge) => ({ ...edge, selected: false })));
    setInputValues(state.inputValues || {});
    setUiElements(normalizeUiElements(state.uiElements || []));
    setNodeCounter(state.nodeCounter || 1);
    nodeCounterRef.current = state.nodeCounter || 1;
    setSelectedNodeId(null);
    setSelectedNodeIds([]);
    setSelectedEdgeIds([]);
    setSelectedUiElementId(null);
  }, [setEdges, setNodes]);

  // [프로젝트 저장 브리지] Electron 메인 프로세스가 현재 프로젝트를 알고 있도록 동기화합니다.
  useEffect(() => {
    window.ixo?.setDirtyState?.({
      isDirty,
      project: {
        nodes,
        edges,
        nodeCounter,
        inputValues,
        uiElements
      }
    });
  }, [isDirty, nodes, edges, nodeCounter, inputValues, uiElements]);

  // [로컬 자동 저장] 작업 상태를 브라우저 로컬 저장소에 주기적으로 반영합니다.
  useEffect(() => {
    const payload = {
      nodes,
      edges,
      nodeCounter,
      inputValues,
      uiElements,
      viewMode,
      language,
      themeKey,
      previewDevice,
      savedAt: Date.now()
    };

    window.clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = window.setTimeout(() => {
      try {
        window.localStorage?.setItem(LOCAL_AUTOSAVE_KEY, JSON.stringify(payload));
      } catch (error) {
        appendLog(makeLog("error", "Local Auto-Save", "자동 저장에 실패했습니다.", String(error.message || error)));
      }
    }, 250);

    return () => window.clearTimeout(autoSaveTimerRef.current);
  }, [appendLog, edges, inputValues, language, nodeCounter, nodes, previewDevice, themeKey, uiElements, viewMode]);

  // [로컬 자동 복구] 새로고침이나 재실행 뒤 마지막 작업 상태를 복구합니다.
  useEffect(() => {
    try {
      const raw = window.localStorage?.getItem(LOCAL_AUTOSAVE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed?.nodes || !parsed?.edges) return;
      applyState(parsed);
      if (parsed.viewMode) setViewMode(parsed.viewMode);
      if (parsed.language) setLanguage(parsed.language);
      if (parsed.themeKey) setThemeKey(parsed.themeKey);
      if (parsed.previewDevice) setPreviewDevice(parsed.previewDevice);
      if (parsed.language) setDraftLanguage(parsed.language);
      if (parsed.themeKey) setDraftThemeKey(parsed.themeKey);
      if (parsed.previewDevice) setDraftPreviewDevice(parsed.previewDevice);
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

  // [외부 액션] HTTP 요청과 브라우저 열기 노드가 활성화된 경우 한 번만 실행합니다.
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
          const url = applyTemplate(node.data.value, runtime.context);
          signatures.push(`http:${node.id}:${url}`);
          if (lastActionSignatureRef.current.includes(`|http:${node.id}:${url}|`)) continue;

          try {
            await fetch(url);
            setStatus(`HTTP request OK: ${url}`);
            appendLog(makeLog("info", node.data?.label || "HTTP Request", `요청 성공: ${url}`));
          } catch (error) {
            setStatus(`HTTP request failed: ${url}`);
            appendLog(makeLog("error", node.data?.label || "HTTP Request", `요청 실패: ${url}`, String(error.message || error)));
          }
        }

        if (node.data?.nodeType === "browser" && node.data?.value) {
          const url = applyTemplate(node.data.value, runtime.context);
          signatures.push(`browser:${node.id}:${url}`);
          if (lastActionSignatureRef.current.includes(`|browser:${node.id}:${url}|`)) continue;

          if (window.ixo?.openExternal) {
            await window.ixo.openExternal(url);
            setStatus(`Opened browser: ${url}`);
            appendLog(makeLog("info", node.data?.label || "Browser Open", `외부 브라우저 열기: ${url}`));
          }
        }
      }

      lastActionSignatureRef.current = signatures.length ? `|${signatures.join("|")}|` : "";
    };

    runActions();
  }, [appendLog, edges, nodes, paused, runtime.activeEdgeIds, runtime.context]);

  // [Builder 드래그 이동] 선택된 UI 요소를 캔버스 안에서 직접 옮길 수 있게 합니다.
  useEffect(() => {
    if (!dragState) return undefined;

    const handlePointerMove = (event) => {
      const canvas = builderCanvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const nextX = Math.max(0, Math.min(event.clientX - rect.left - dragState.offsetX, rect.width - 32));
      const nextY = Math.max(0, Math.min(event.clientY - rect.top - dragState.offsetY, rect.height - 32));

      setUiElements((current) =>
        current.map((item) => (
          item.id === dragState.id
            ? { ...item, x: Math.round(nextX), y: Math.round(nextY) }
            : item
        ))
      );
    };

    const handlePointerUp = () => {
      setDragState(null);
      setIsDirty(true);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragState]);

  // [단축키] 저장, 되돌리기, 복제, 삭제, 그룹화를 키보드로 바로 사용할 수 있습니다.
  const undo = useCallback(() => {
    setHistory((current) => {
      if (current.length === 0) return current;
      const previous = current[current.length - 1];
      setFuture((futureState) => [...futureState, cloneState(nodes, edges, inputValues, nodeCounterRef.current, uiElements)]);
      applyState(previous);
      setIsDirty(true);
      setStatus("Undo applied.");
      return current.slice(0, -1);
    });
  }, [applyState, edges, inputValues, nodes, uiElements]);

  const redo = useCallback(() => {
    setFuture((current) => {
      if (current.length === 0) return current;
      const next = current[current.length - 1];
      setHistory((historyState) => [...historyState, cloneState(nodes, edges, inputValues, nodeCounterRef.current, uiElements)]);
      applyState(next);
      setIsDirty(true);
      setStatus("Redo applied.");
      return current.slice(0, -1);
    });
  }, [applyState, edges, inputValues, nodes, uiElements]);

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
        refKey: `${nodeType.replace(/[^a-z0-9]/gi, "").toLowerCase()}${id.replace("node-", "")}`,
        groupLabel: ""
      }
    };
  }, [createNodeId]);

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
      setUiElements((current) => current.filter((item) => item.id !== selectedUiElementId));
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
    setSelectedNodeId(null);
    setSelectedNodeIds([]);
    setSelectedEdgeIds([]);
    setStatus("Selected nodes removed.");
    setIsDirty(true);
  }, [selectedEdgeIds, selectedNodeIds, selectedUiElementId, setEdges, setNodes, snapshot]);

  const duplicateSelection = useCallback(() => {
    if (selectedUiElementId && selectedUiElement) {
      snapshot();
      const clone = {
        ...selectedUiElement,
        id: `ui-${Date.now()}`,
        x: selectedUiElement.x + 24,
        y: selectedUiElement.y + 24
      };
      setUiElements((current) => [...current, clone]);
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
  }, [createNodeId, nodes, selectedNodeIds, selectedUiElement, selectedUiElementId, setNodes, snapshot]);

  const saveProject = useCallback(async () => {
    if (!window.ixo?.saveProject) {
      setStatus("Save unavailable in browser mode.");
      return;
    }

    const payload = { nodes, edges, nodeCounter: nodeCounterRef.current, inputValues, uiElements };
    const result = await window.ixo.saveProject(payload);
    if (result.ok) {
      setStatus(`Saved .ixo: ${result.path}`);
      setIsDirty(false);
    }
  }, [edges, inputValues, nodes, uiElements]);

  const loadProject = useCallback(async () => {
    if (!window.ixo?.loadProject) {
      setStatus("Load unavailable in browser mode.");
      return;
    }

    const result = await window.ixo.loadProject();
    if (result.ok && result.data) {
      snapshot();
      setNodes(applyNodeSelectionState(result.data.nodes || [], []));
      setEdges((result.data.edges || []).map((edge) => ({ ...edge, selected: false })));
      setNodeCounter(result.data.nodeCounter || 1);
      nodeCounterRef.current = result.data.nodeCounter || 1;
      setInputValues(result.data.inputValues || {});
      setUiElements(normalizeUiElements(result.data.uiElements || []));
      setSelectedNodeId(null);
      setSelectedNodeIds([]);
      setSelectedEdgeIds([]);
      setSelectedUiElementId(null);
      setLogs([]);
      setStatus(`Loaded .ixo: ${result.path}`);
      setIsDirty(false);
    }
  }, [setEdges, setNodes, snapshot]);

  const exportProject = useCallback(async () => {
    if (!window.ixo?.exportProject) {
      setStatus("Export unavailable in browser mode.");
      return;
    }

    const result = await window.ixo.exportProject({
      nodes,
      edges,
      nodeCounter: nodeCounterRef.current,
      inputValues,
      uiElements
    });

    if (result.ok) {
      setStatus(`Exported archive: ${result.path}`);
    }
  }, [edges, inputValues, nodes, uiElements]);

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

  useEffect(() => {
    if (!window.ixo?.getAppInfo) return undefined;

    let mounted = true;
    window.ixo.getAppInfo().then((info) => {
      if (mounted && info) {
        setAppInfo(info);
      }
    });

    const timer = window.setTimeout(() => {
      checkForUpdates({ silent: true });
    }, 2500);

    return () => {
      mounted = false;
      window.clearTimeout(timer);
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

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        saveProject();
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

      if (event.key === "Delete" && !editing) {
        event.preventDefault();
        deleteSelection();
      }

      if (event.key.toLowerCase() === "g" && !editing && selectedNodeIds.length > 1) {
        event.preventDefault();
        createGroupBox();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [createGroupBox, deleteSelection, duplicateSelection, redo, saveProject, selectedNodeIds.length, undo]);

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

  const onConnect = useCallback((connection) => {
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
  }, [setEdges, snapshot]);

  const handleNodesChange = useCallback((changes) => {
    onNodesChange(changes);
    if (changes.length) setIsDirty(true);
  }, [onNodesChange]);

  const handleEdgesChange = useCallback((changes) => {
    onEdgesChange(changes);
    if (changes.length) setIsDirty(true);
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

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const raw = event.dataTransfer.getData("application/ixo-node");
    if (!raw) return;

    snapshot();

    const nodeDef = JSON.parse(raw);
    const nextNode = makeNode(nodeDef, screenToFlowPosition({ x: event.clientX, y: event.clientY }));
    setNodes((current) => [...current, nextNode]);
    setStatus(`Node added: ${nodeDef.label}`);
    setIsDirty(true);
  }, [makeNode, screenToFlowPosition, setNodes, snapshot]);

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

  const updateNodeField = (field, value) => {
    if (!selectedNode) return;
    snapshot();
    setNodes((current) =>
      current.map((node) => (
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, [field]: value } }
          : node
      ))
    );
    setIsDirty(true);
  };

  const updateUiField = (field, value) => {
    if (!selectedUiElement) return;
    snapshot();
    setUiElements((current) =>
      current.map((item) => (
        item.id === selectedUiElement.id
          ? { ...item, [field]: field === "x" || field === "y" || field === "width" || field === "height" || field === "fontSize" || field === "radius" ? Number(value) : value }
          : item
      ))
    );
    setIsDirty(true);
  };

  const createUiElementFromPalette = useCallback((kind, point = null) => {
    snapshot();

    const selectedBindingKey = selectedNode?.data?.refKey || "";
    const next = createUiElement(kind, selectedBindingKey, currentTheme.accent);
    const finalElement = point ? { ...next, x: point.x, y: point.y } : next;

    setUiElements((current) => [...current, finalElement]);
    setSelectedUiElementId(finalElement.id);
    setViewMode("builder");
    setStatus(`UI element added: ${kind}`);
    setIsDirty(true);
  }, [currentTheme.accent, selectedNode, snapshot]);

  const handleBuilderDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const handleBuilderDrop = useCallback((event) => {
    event.preventDefault();
    const kind = event.dataTransfer.getData("application/ixo-ui");
    if (!kind || !builderCanvasRef.current) return;

    const rect = builderCanvasRef.current.getBoundingClientRect();
    createUiElementFromPalette(kind, {
      x: Math.max(0, Math.round(event.clientX - rect.left - 40)),
      y: Math.max(0, Math.round(event.clientY - rect.top - 20))
    });
  }, [createUiElementFromPalette]);

  const handleBuilderPointerDown = useCallback((event, id) => {
    if (typeof event.button === "number" && event.button !== 0) return;
    if (viewMode !== "builder" || !builderCanvasRef.current) return;

    const rect = builderCanvasRef.current.getBoundingClientRect();
    const target = uiElements.find((item) => item.id === id);
    if (!target) return;

    setDragState({
      id,
      offsetX: event.clientX - rect.left - target.x,
      offsetY: event.clientY - rect.top - target.y
    });
  }, [uiElements, viewMode]);

  const handleBuilderPointerUp = useCallback(() => {
    setDragState(null);
  }, []);

  const openUiAction = useCallback(async (url) => {
    if (!url) return;
    if (window.ixo?.openExternal) {
      await window.ixo.openExternal(url);
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const handleUiElementSelect = useCallback((id) => {
    setSelectedUiElementId(id);
    setSelectedNodeId(null);
    setSelectedNodeIds([]);
    setSelectedEdgeIds([]);
    setNodes((current) => applyNodeSelectionState(current, []));
    setEdges((current) => current.map((edge) => ({ ...edge, selected: false })));
  }, [setEdges, setNodes]);

  const applySettings = useCallback(() => {
    setLanguage(draftLanguage);
    setThemeKey(draftThemeKey);
    setPreviewDevice(draftPreviewDevice);

    if (draftTemplateKey) {
      const template = STARTER_TEMPLATES[draftTemplateKey];
      if (template) {
        snapshot();
        const next = template.build();
        applyState(next);
        setViewMode(next.viewMode || "viewer");
        setLogs([makeLog("info", "Templates", `${template.label} 템플릿을 불러왔습니다.`)]);
        setStatus(`Template loaded: ${template.label}`);
        setIsDirty(true);
      }
    }

    setToastMessage((UI_TEXT[draftLanguage] || UI_TEXT.ko).applied);
  }, [applyState, draftLanguage, draftPreviewDevice, draftTemplateKey, draftThemeKey, snapshot]);

  const cancelSettings = useCallback(() => {
    setDraftLanguage(language);
    setDraftThemeKey(themeKey);
    setDraftPreviewDevice(previewDevice);
    setDraftTemplateKey("");
    setShowSettings(false);
  }, [language, previewDevice, themeKey]);

  const clearLocalAutosave = useCallback(() => {
    window.localStorage?.removeItem(LOCAL_AUTOSAVE_KEY);
    appendLog(makeLog("info", "Local Auto-Save", "로컬 자동 저장 데이터를 삭제했습니다."));
    setStatus("Local auto-save cleared.");
  }, [appendLog]);

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
      <ReactFlow
        nodes={nodesWithTrace}
        edges={edgeView}
        nodeTypes={nodeTypes}
        multiSelectionKeyCode={["Control", "Meta"]}
        onlyRenderVisibleElements
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onPaneContextMenu={onPaneContextMenu}
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
        onNodeDragStart={() => snapshot()}
        onNodeDragStop={(event, node) => {
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
        <Panel position="top-right" className="hint-panel">
          Space: Quick Search | G: Group | Ctrl+S/Z/Y/D | Delete
        </Panel>
      </ReactFlow>

      {contextMenu ? (
        <div className="context-menu" style={{ left: contextMenu.x, top: contextMenu.y }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search nodes..."
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
              placeholder="Type node name and Enter..."
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
        "--glow": currentTheme.glow
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
                <p>Visual logic + UI builder workspace</p>
              </div>
            </div>

            <div className="menu-row">
              <div className="file-menu">
                <button className="menu-btn" onClick={() => setShowFileMenu((current) => !current)}>{uiText.file}</button>
                {showFileMenu ? (
                  <div className="file-dropdown">
                    <button onClick={saveProject}>Save</button>
                    <button onClick={loadProject}>Load</button>
                    <button onClick={exportProject}>Export</button>
                    <button onClick={magicAlign}>Magic Align</button>
                  </div>
                ) : null}
              </div>

              <div className="exec-controls">
                <div className="exec-row exec-row-top">
                  <label htmlFor="speed-control">Speed {speed}x</label>
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
                    {paused ? "Resume" : "Pause"}
                  </button>
                  <label className="trace-inline">
                    <input type="checkbox" checked={debugOverlay} onChange={(event) => setDebugOverlay(event.target.checked)} />
                    Trace
                  </label>
                  <button
                    className="menu-btn docs-btn"
                    onClick={() => window.ixo?.openExternal?.("https://minyangtech.n-e.kr/docs/ixo/index")}
                  >
                    {uiText.docs}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar-header">
            <div className="panel-title">Node Library</div>
            <button className="ghost-btn" onClick={createGroupBox}>Group Selected</button>
          </div>

          <div className="drop-hint-card">
            <strong>{uiText.deleteZone}</strong>
            <span>{uiText.deleteZoneCopy}</span>
          </div>

          <div className="sidebar-tabs">
            <button className={libraryTab === "core" ? "active" : ""} onClick={() => setLibraryTab("core")}>Core</button>
            <button className={libraryTab === "pro" ? "active" : ""} onClick={() => setLibraryTab("pro")}>Pro</button>
          </div>

          {Object.entries(sidebarGroups).map(([group, items]) => (
            <section key={group} className="library-section">
              <button className="section-toggle" onClick={() => toggleSection(group)}>
                <span className="section-label">{GROUP_ICON[group] || "•"} {group.toUpperCase()}</span>
                <span>{collapsed[group] ? "+" : "-"}</span>
              </button>

              {!collapsed[group] ? (
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
          ))}
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
                    appendLog={appendLog}
                    uiText={uiText}
                    previewDevice={previewDevice}
                    setPreviewDevice={setPreviewDevice}
                    onUiElementSelect={handleUiElementSelect}
                    onOpenSettings={() => setShowSettings(true)}
                  />
                </ResizablePanel>
              </PanelGroup>
            </ResizablePanel>

            <PanelResizeHandle className="resize-handle horizontal-handle" />

            <ResizablePanel defaultSize={26} minSize={14}>
              <LogConsole logs={logs} onClear={() => setLogs([])} />
            </ResizablePanel>
          </PanelGroup>
        </section>

        <aside className="properties">
          <div className="panel-title">{viewMode === "builder" && selectedUiElement ? "UI Inspector" : inspectorMode === "inspector" ? "Pro Inspector" : "Properties"}</div>

          <div className="properties-stack">
            <div className="properties-card">
              <div className="summary-grid">
                <div>
                  <strong>{nodes.length}</strong>
                  <span>Nodes</span>
                </div>
                <div>
                  <strong>{edges.length}</strong>
                  <span>Edges</span>
                </div>
                <div>
                  <strong>{uiElements.length}</strong>
                  <span>UI Layers</span>
                </div>
                <div>
                  <strong>{logs.length}</strong>
                  <span>Logs</span>
                </div>
              </div>
              <div className="inspector-note">
                <strong>Viewer Mode</strong>
                <span>{viewMode === "builder" ? "Canvas Builder가 활성화되어 있습니다." : viewMode === "viewer" ? "UI Viewer만 집중해서 보고 있습니다." : "Preview와 JSON 상태를 함께 보고 있습니다."}</span>
              </div>
            </div>

            {selectedUiElement && viewMode === "builder" ? (
              <div className="property-form">
                <label>
                  Element Kind
                  <input type="text" value={selectedUiElement.kind} readOnly />
                </label>
                <label>
                  Text / Label
                  <input type="text" value={selectedUiElement.text || ""} onChange={(event) => updateUiField("text", event.target.value)} />
                </label>
                <label>
                  Image Src
                  <input type="text" value={selectedUiElement.src || ""} onChange={(event) => updateUiField("src", event.target.value)} />
                </label>
                <label>
                  Binding Ref Key
                  <input type="text" value={selectedUiElement.bindingKey || ""} onChange={(event) => updateUiField("bindingKey", event.target.value)} placeholder="welcomeText, username..." />
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
                  Width
                  <input type="number" value={selectedUiElement.width} onChange={(event) => updateUiField("width", event.target.value)} />
                </label>
                <label>
                  Height
                  <input type="number" value={selectedUiElement.height} onChange={(event) => updateUiField("height", event.target.value)} />
                </label>
                <label>
                  Font Size
                  <input type="number" value={selectedUiElement.fontSize} onChange={(event) => updateUiField("fontSize", event.target.value)} />
                </label>
                <label>
                  Radius
                  <input type="number" value={selectedUiElement.radius} onChange={(event) => updateUiField("radius", event.target.value)} />
                </label>
                <label>
                  Text Color
                  <input type="color" value={selectedUiElement.color} onChange={(event) => updateUiField("color", event.target.value)} />
                </label>
                <label>
                  Background
                  <input type="text" value={selectedUiElement.background} onChange={(event) => updateUiField("background", event.target.value)} />
                </label>
                <label>
                  Action Type
                  <select value={selectedUiElement.actionType} onChange={(event) => updateUiField("actionType", event.target.value)}>
                    <option value="none">none</option>
                    <option value="open-url">open-url</option>
                  </select>
                </label>
                <label>
                  Action Value
                  <input type="text" value={selectedUiElement.actionValue || ""} onChange={(event) => updateUiField("actionValue", event.target.value)} />
                </label>
                <button className="danger-btn" onClick={deleteSelection}>Delete UI Element</button>
              </div>
            ) : selectedNode ? (
              <div className="property-form">
                <label>
                  Node Label
                  <input type="text" value={selectedNode.data.label} onChange={(event) => updateNodeField("label", event.target.value)} />
                </label>
                <label>
                  {selectedNode.data.nodeType === "condition"
                    ? "Condition Chain (AND/OR)"
                    : selectedNode.data.nodeType === "math"
                      ? "Math Expression"
                      : selectedNode.data.nodeType === "script"
                        ? "JavaScript Code"
                        : "Value / Setting"}
                  {selectedNode.data.nodeType === "condition" || selectedNode.data.nodeType === "math" || selectedNode.data.nodeType === "script" ? (
                    <textarea
                      value={selectedNode.data.value || ""}
                      onChange={(event) => updateNodeField("value", event.target.value)}
                      placeholder={selectedNode.data.nodeType === "script" ? "return context.username;" : "{{score}} > 10 AND {{role}} == admin"}
                    />
                  ) : (
                    <input
                      type="text"
                      value={selectedNode.data.value || ""}
                      onChange={(event) => updateNodeField("value", event.target.value)}
                      placeholder="text, path, url, expression..."
                    />
                  )}
                </label>
                <label>
                  Ref Key
                  <input type="text" value={selectedNode.data.refKey || ""} onChange={(event) => updateNodeField("refKey", event.target.value)} placeholder="username, totalPrice..." />
                </label>
                <label>
                  Group Label
                  <input type="text" value={selectedNode.data.groupLabel || ""} onChange={(event) => updateNodeField("groupLabel", event.target.value)} placeholder="Flow A, Login, UI..." />
                </label>
                <label>
                  Node Type
                  <input type="text" value={selectedNode.data.nodeType || ""} onChange={(event) => updateNodeField("nodeType", event.target.value)} />
                </label>
                <label>
                  Numeric Slider
                  <input type="range" min="0" max="100" value={Number(selectedNode.data.sliderValue || 0)} onChange={(event) => updateNodeField("sliderValue", event.target.value)} />
                </label>
                <label>
                  Color Picker
                  <input type="color" value={selectedNode.data.colorValue || ACCENT} onChange={(event) => updateNodeField("colorValue", event.target.value)} />
                </label>
                <label>
                  {["audio-player", "sound-play", "sound-play-wait", "bgm-play"].includes(selectedNode.data.nodeType) ? "Sound Upload" : "File Path"}
                  <input
                    type="file"
                    accept={["audio-player", "sound-play", "sound-play-wait", "bgm-play"].includes(selectedNode.data.nodeType) ? "audio/*" : undefined}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (["audio-player", "sound-play", "sound-play-wait", "bgm-play"].includes(selectedNode.data.nodeType)) {
                        updateNodeSoundFile(file);
                        return;
                      }
                      updateNodeField("value", file?.name || "");
                    }}
                  />
                  {selectedNode.data.soundName ? <span className="field-hint">{selectedNode.data.soundName}</span> : null}
                </label>
                <div className="selected-id">Selected ID: {selectedNode.id}</div>
                <button className="ghost-btn" onClick={() => createUiElementFromPalette("text")}>Create Linked UI Text</button>
              </div>
            ) : (
              <div className="placeholder-card">
                <p className="placeholder">노드를 더블 클릭하면 고급 Inspector가 열리고, Builder 모드에서는 UI 요소를 선택해 디자인 속성을 수정할 수 있습니다.</p>
                <div className="placeholder-actions">
                  <button className="ghost-btn" onClick={() => createUiElementFromPalette("text")}>Add UI Text</button>
                  <button className="ghost-btn" onClick={() => createUiElementFromPalette("button")}>Add UI Button</button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </main>

      <footer className="status-bar">
        <span>ENGINE STATUS: {status}{isDirty ? " | Unsaved changes" : ""}</span>
        <span>Nodes {nodes.length} | Edges {edges.length} | UI {uiElements.length} | Mode {viewMode}</span>
      </footer>

      <SettingsModal
        open={showSettings}
        uiText={UI_TEXT[draftLanguage] || uiText}
        draftLanguage={draftLanguage}
        setDraftLanguage={setDraftLanguage}
        draftThemeKey={draftThemeKey}
        setDraftThemeKey={setDraftThemeKey}
        draftPreviewDevice={draftPreviewDevice}
        setDraftPreviewDevice={setDraftPreviewDevice}
        draftTemplateKey={draftTemplateKey}
        setDraftTemplateKey={setDraftTemplateKey}
        appInfo={appInfo}
        updateInfo={updateInfo}
        updateState={updateState}
        onCheckForUpdates={() => checkForUpdates()}
        onDownloadUpdate={downloadUpdate}
        onApply={applySettings}
        onCancel={cancelSettings}
        onClearAutosave={clearLocalAutosave}
      />

      {toastMessage ? <div className="settings-toast">{toastMessage}</div> : null}
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <EngineEditor />
    </ReactFlowProvider>
  );
}
