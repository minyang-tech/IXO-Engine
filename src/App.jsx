import { useCallback, useEffect, useMemo, useState } from "react";
import { Panel as ResizablePanel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Handle,
  MiniMap,
  Panel,
  ReactFlowProvider,
  useReactFlow,
  MarkerType,
  Position,
  useEdgesState,
  useNodesState
} from "reactflow";
import "reactflow/dist/style.css";

const LOGO_FALLBACKS = ["/IXO Logo.png", "/IXO Logo.PNG", "https://github.com/minyang-tech/IXO-Engine/blob/main/IXO%20Logo.png?raw=true"];
const GROUP_ICON = { control: "⌁", visual: "◫", system: "⚙", logic: "∑", utility: "⊕", data: "◈", network: "⇄", start: "◆" };
const NODE_COLOR = { start: "#3ecf8e", control: "#4ea1ff", visual: "#b17dff", system: "#ffd166", logic: "#62d6ff", utility: "#7cb6ff", data: "#e0b35a", network: "#e63946" };
const TRACE_SPEED = { "0.5": 1.8, "1": 0.9, "1.5": 0.6, "2": 0.45 };

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
    { key: "color-picker", label: "Color Picker", group: "visual", type: "color-picker" },
    { key: "video-player", label: "Video Player", group: "visual", type: "video-player" },
    { key: "particle", label: "Particle", group: "visual", type: "particle" },
    { key: "system-info", label: "System Info", group: "system", type: "system-info" },
    { key: "audio-player", label: "Audio Player", group: "system", type: "audio-player" },
    { key: "file-watcher", label: "File Watcher", group: "system", type: "file-watcher" },
    { key: "add-text", label: "Add Text", group: "visual", type: "text" },
    { key: "add-image", label: "Add Image", group: "visual", type: "image" },
    { key: "input-field", label: "Input Field", group: "visual", type: "input" },
    { key: "button", label: "Button", group: "visual", type: "trigger" },
    { key: "layout-container", label: "Layout Container", group: "visual", type: "layout" },
    { key: "global-variable", label: "Global Variable", group: "data", type: "variable" },
    { key: "local-storage", label: "Local Storage", group: "data", type: "storage" },
    { key: "constant", label: "Constant", group: "data", type: "constant" },
    { key: "http-request", label: "HTTP Request", group: "network", type: "http" },
    { key: "browser-open", label: "Browser Open", group: "network", type: "browser" },
    { key: "math-operator", label: "Math Operator", group: "logic", type: "math" },
    { key: "string-join", label: "String Join", group: "utility", type: "string" },
    { key: "random", label: "Random", group: "utility", type: "random" }
  ]
};

const initialNodes = [
  { id: "start", type: "ixoNode", data: { label: "Start", kind: "start", category: "Core", value: "", nodeType: "start", refKey: "" }, position: { x: 60, y: 180 } },
  { id: "inputName", type: "ixoNode", data: { label: "Input Field", kind: "visual", category: "Visual", value: "Enter your name", nodeType: "input", refKey: "username" }, position: { x: 320, y: 120 } },
  { id: "condition", type: "ixoNode", data: { label: "If / Else", kind: "logic", category: "Logic", value: "{{username}} == admin OR {{username}} == root", nodeType: "condition", refKey: "" }, position: { x: 600, y: 170 } },
  { id: "join", type: "ixoNode", data: { label: "String Join", kind: "utility", category: "Utility", value: "Welcome, {{username}}!", nodeType: "string", refKey: "welcomeText" }, position: { x: 900, y: 80 } },
  { id: "output", type: "ixoNode", data: { label: "Add Text", kind: "visual", category: "Visual", value: "{{welcomeText}}", nodeType: "text", refKey: "" }, position: { x: 1170, y: 80 } }
];

const initialEdges = [
  { id: "e-start-input", source: "start", target: "inputName", markerEnd: { type: MarkerType.ArrowClosed, color: "#ffffff" }, style: { stroke: "#d6ddff", strokeWidth: 1.4 } },
  { id: "e-input-cond", source: "inputName", target: "condition", markerEnd: { type: MarkerType.ArrowClosed, color: "#ffffff" }, style: { stroke: "#d6ddff", strokeWidth: 1.4 } },
  { id: "e-cond-true", source: "condition", sourceHandle: "true", target: "join", markerEnd: { type: MarkerType.ArrowClosed, color: "#3ecf8e" }, style: { stroke: "#3ecf8e", strokeWidth: 1.8 } },
  { id: "e-join-out", source: "join", target: "output", markerEnd: { type: MarkerType.ArrowClosed, color: "#ffffff" }, style: { stroke: "#d6ddff", strokeWidth: 1.4 } }
];

const cloneState = (nodes, edges, inputValues, nodeCounter) => ({
  nodes: JSON.parse(JSON.stringify(nodes)),
  edges: JSON.parse(JSON.stringify(edges)),
  inputValues: JSON.parse(JSON.stringify(inputValues)),
  nodeCounter
});

function applyTemplate(text, context) {
  return String(text || "").replace(/\{\{\s*([^}]+)\s*\}\}/g, (_, key) => String(context[key.trim()] ?? ""));
}

function compareExpression(expression) {
  const match = expression.match(/^(.+?)\s*(==|!=|>=|<=|>|<)\s*(.+)$/);
  if (!match) return Boolean(expression.trim());
  const [, leftRaw, op, rightRaw] = match;
  const cast = (raw) => {
    const stripped = raw.trim().replace(/^['"]|['"]$/g, "");
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

function evaluateConditionChain(expression, context) {
  const rendered = applyTemplate(expression || "", context);
  const orParts = rendered.split(/\s+OR\s+/i).map((p) => p.trim()).filter(Boolean);
  return orParts.some((orPart) =>
    orPart.split(/\s+AND\s+/i).map((p) => p.trim()).filter(Boolean).every((andPart) => compareExpression(andPart))
  );
}

function topoOrder(nodes, edges) {
  const indegree = {};
  const outgoing = {};
  nodes.forEach((node) => {
    indegree[node.id] = 0;
    outgoing[node.id] = [];
  });
  edges.forEach((edge) => {
    indegree[edge.target] = (indegree[edge.target] || 0) + 1;
    if (!outgoing[edge.source]) outgoing[edge.source] = [];
    outgoing[edge.source].push(edge);
  });
  const queue = Object.keys(indegree).filter((id) => indegree[id] === 0);
  const topo = [];
  while (queue.length) {
    const current = queue.shift();
    topo.push(current);
    for (const edge of outgoing[current] || []) {
      indegree[edge.target] -= 1;
      if (indegree[edge.target] === 0) queue.push(edge.target);
    }
  }
  if (topo.length !== nodes.length) topo.push(...nodes.map((n) => n.id).filter((id) => !topo.includes(id)));
  return topo;
}

function runPipeline(nodes, edges, inputValues, paused) {
  const nodeMap = Object.fromEntries(nodes.map((node) => [node.id, node]));
  const outgoing = {};
  nodes.forEach((node) => {
    outgoing[node.id] = [];
  });
  edges.forEach((edge) => {
    if (!outgoing[edge.source]) outgoing[edge.source] = [];
    outgoing[edge.source].push(edge);
  });
  const topo = topoOrder(nodes, edges);
  const context = {};
  const outputTexts = [];
  const outputImages = [];
  const activeEdgeIds = [];
  const activeByNode = {};
  const liveValues = {};

  topo.forEach((nodeId) => {
    const node = nodeMap[nodeId];
    if (!node) return;
    const incoming = edges.filter((e) => e.target === nodeId);
    activeByNode[nodeId] = incoming.length === 0 ? true : incoming.some((e) => activeEdgeIds.includes(e.id));
    if (!activeByNode[nodeId]) return;
    const type = node.data?.nodeType || "";
    const value = node.data?.value || "";
    const key = node.data?.refKey || node.id;
    let produced = "";

    if (type === "input") produced = inputValues[node.id] ?? "";
    else if (type === "string") produced = applyTemplate(value, context);
    else if (type === "math") {
      const rendered = applyTemplate(value, context);
      const calc = rendered.match(/^(-?\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(-?\d+(?:\.\d+)?)$/);
      if (calc) {
        const a = Number(calc[1]);
        const b = Number(calc[3]);
        const op = calc[2];
        produced = op === "+" ? a + b : op === "-" ? a - b : op === "*" ? a * b : b === 0 ? 0 : a / b;
      } else produced = rendered;
    } else if (type === "script") {
      try {
        // eslint-disable-next-line no-new-func
        const fn = new Function("context", "inputValues", String(value || "return context;"));
        const result = fn(context, inputValues);
        produced = typeof result === "undefined" ? "" : result;
      } catch (error) {
        produced = `Script Error: ${error.message}`;
      }
    } else if (type === "constant" || type === "variable" || type === "storage" || type === "merge-data" || type === "compare") produced = applyTemplate(value, context);
    else if (type === "random") produced = Math.floor(Math.random() * ((Number(applyTemplate(value, context)) || 100)));
    else if (type === "text" || type === "layout" || type === "particle" || type === "system-info") {
      produced = applyTemplate(value, context) || node.data.label;
      outputTexts.push({ id: node.id, text: String(produced) });
    } else if (type === "image" || type === "video-player") {
      produced = applyTemplate(value, context);
      outputImages.push({ id: node.id, src: String(produced) });
    } else if (type === "color-picker") produced = value || "#ffffff";
    else if (type === "audio-player") produced = applyTemplate(value, context);
    else if (type === "file-watcher") produced = `Watching: ${value || "."}`;
    else if (type === "loop") produced = applyTemplate(value || "0", context);
    else if (type === "wait") produced = applyTemplate(value || "0", context);
    else if (type === "switch") produced = applyTemplate(value || "A", context);

    context[key] = produced;
    liveValues[nodeId] = String(produced);

    if (paused) return;
    if (type === "condition") {
      const pass = evaluateConditionChain(value, context);
      (outgoing[nodeId] || []).forEach((edge) => {
        if ((pass && edge.sourceHandle === "true") || (!pass && edge.sourceHandle === "false")) activeEdgeIds.push(edge.id);
      });
    } else if (type === "switch") {
      (outgoing[nodeId] || []).forEach((edge) => {
        if (!edge.sourceHandle || edge.sourceHandle === produced) activeEdgeIds.push(edge.id);
      });
    } else {
      (outgoing[nodeId] || []).forEach((edge) => activeEdgeIds.push(edge.id));
    }
  });
  return { context, outputTexts, outputImages, activeEdgeIds, topo, liveValues };
}

function IXONode({ data, selected }) {
  const color = NODE_COLOR[data.kind] || "#ffffff";
  const isCondition = data.nodeType === "condition";
  const isSwitch = data.nodeType === "switch";
  const liveValue = data.liveValue || "";
  return (
    <div className={`ixo-node ${selected ? "selected" : ""}`} style={{ "--node-color": color }}>
      <Handle className="node-handle" type="target" position={Position.Left} />
      <div className="ixo-node-header"><span className="ixo-badge">IXO</span><span>{data.category || "Node"}</span></div>
      <div className="ixo-node-title">{data.label}</div>
      <div className="ixo-node-value">{data.value || "..."}</div>
      {liveValue ? <div className="live-trace-pill">out: {liveValue}</div> : null}
      {isCondition ? (
        <>
          <Handle id="true" className="node-handle true-handle" type="source" position={Position.Right} style={{ top: 16 }} />
          <Handle id="false" className="node-handle false-handle" type="source" position={Position.Right} style={{ top: 42 }} />
        </>
      ) : isSwitch ? (
        <>
          <Handle id="A" className="node-handle" type="source" position={Position.Right} style={{ top: 14 }} />
          <Handle id="B" className="node-handle" type="source" position={Position.Right} style={{ top: 28 }} />
          <Handle id="C" className="node-handle" type="source" position={Position.Right} style={{ top: 42 }} />
        </>
      ) : (
        <Handle className="node-handle" type="source" position={Position.Right} />
      )}
    </div>
  );
}

function RuntimePreview({ runtime, nodes, inputValues, setInputValues, debugOverlay }) {
  const inputs = nodes.filter((n) => n.data?.nodeType === "input");
  return (
    <div className="preview-shell">
      <div className="preview-surface">
        <h3>Live App Preview</h3>
        <p>Pipeline + live value trace + execution controls.</p>
        <div className="runtime-screen">
          {inputs.map((node) => (
            <input key={node.id} className="runtime-input" value={inputValues[node.id] || ""} onChange={(event) => setInputValues((prev) => ({ ...prev, [node.id]: event.target.value }))} placeholder={node.data?.value || "Input"} />
          ))}
          {runtime.outputTexts.map((item) => <p key={item.id} className="runtime-text">{item.text}</p>)}
          {runtime.outputImages.map((item) => (item.src ? <img key={item.id} className="runtime-image" src={item.src} alt="Preview" /> : null))}
        </div>
        {debugOverlay ? <div className="debug-overlay"><span>Execution:</span><strong>{runtime.topo.join(" -> ")}</strong></div> : null}
      </div>
      <pre className="json-view">{JSON.stringify(runtime, null, 2)}</pre>
    </div>
  );
}

function EngineEditor() {
  const { screenToFlowPosition } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [libraryTab, setLibraryTab] = useState("pro");
  const [collapsed, setCollapsed] = useState({});
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedNodeIds, setSelectedNodeIds] = useState([]);
  const [inspectorMode, setInspectorMode] = useState("basic");
  const [contextMenu, setContextMenu] = useState(null);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("Ready");
  const [debugOverlay, setDebugOverlay] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [nodeCounter, setNodeCounter] = useState(6);
  const [inputValues, setInputValues] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [logoIndex, setLogoIndex] = useState(0);
  const [speed, setSpeed] = useState("1");
  const [paused, setPaused] = useState(false);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);

  const runtime = useMemo(() => runPipeline(nodes, edges, inputValues, paused), [nodes, edges, inputValues, paused]);
  const nodesWithTrace = useMemo(
    () => nodes.map((n) => ({ ...n, data: { ...n.data, liveValue: runtime.liveValues[n.id] ?? "" } })),
    [nodes, runtime.liveValues]
  );

  const snapshot = useCallback(() => {
    setHistory((h) => [...h.slice(-79), cloneState(nodes, edges, inputValues, nodeCounter)]);
    setFuture([]);
  }, [nodes, edges, inputValues, nodeCounter]);

  const applyState = (state) => {
    setNodes(state.nodes);
    setEdges(state.edges);
    setInputValues(state.inputValues || {});
    setNodeCounter(state.nodeCounter || 1);
  };

  useEffect(() => {
    window.ixo?.setDirtyState?.({ isDirty, project: { nodes, edges, nodeCounter, inputValues } });
  }, [isDirty, nodes, edges, nodeCounter, inputValues]);

  useEffect(() => {
    const activeTargets = new Set(runtime.activeEdgeIds.map((id) => edges.find((e) => e.id === id)?.target).filter(Boolean));
    if (!paused) {
      nodes.filter((n) => n.data?.nodeType === "http" && activeTargets.has(n.id) && n.data?.value).forEach(async (n) => {
        try {
          await fetch(applyTemplate(n.data.value, runtime.context));
          setStatus(`HTTP request OK: ${n.data.value}`);
        } catch {
          setStatus(`HTTP request failed: ${n.data.value}`);
        }
      });
      nodes.filter((n) => n.data?.nodeType === "browser" && activeTargets.has(n.id)).forEach(async (n) => {
        const url = applyTemplate(n.data?.value, runtime.context);
        if (url && window.ixo?.openExternal) {
          await window.ixo.openExternal(url);
          setStatus(`Opened browser: ${url}`);
        }
      });
    }
  }, [edges, nodes, runtime.activeEdgeIds, runtime.context, paused]);

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
  });

  const edgeView = useMemo(() => edges.map((edge) => {
    const active = runtime.activeEdgeIds.includes(edge.id);
    return {
      ...edge,
      animated: active,
      className: active ? "trace-edge-active" : "trace-edge-idle",
      style: active
        ? { ...edge.style, stroke: "#ffffff", strokeWidth: 2.3, filter: "drop-shadow(0 0 8px #ffffff)" }
        : edge.style
    };
  }), [edges, runtime.activeEdgeIds]);

  const onConnect = useCallback((connection) => {
    snapshot();
    setEdges((current) => addEdge({ ...connection, markerEnd: { type: MarkerType.ArrowClosed, color: "#ffffff" }, style: { stroke: "#d6ddff", strokeWidth: 1.4 } }, current));
    setIsDirty(true);
  }, [setEdges, snapshot]);

  const selectedNode = useMemo(() => nodes.find((node) => node.id === selectedNodeId) || null, [nodes, selectedNodeId]);
  const nodeTypes = useMemo(() => ({ ixoNode: IXONode }), []);
  const flowJson = useMemo(() => JSON.stringify({ nodes, edges, inputValues }, null, 2), [nodes, edges, inputValues]);
  const sidebarGroups = useMemo(() => {
    const list = LIBRARY_TABS[libraryTab];
    const groups = {};
    for (const item of list) {
      if (!groups[item.group]) groups[item.group] = [];
      groups[item.group].push(item);
    }
    return groups;
  }, [libraryTab]);
  const searchCandidates = useMemo(() => Object.values(LIBRARY_TABS).flat().filter((item) => item.label.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm]);

  const toggleSection = (name) => setCollapsed((current) => ({ ...current, [name]: !current[name] }));
  const makeNode = useCallback((nodeDef, position) => {
    const id = `node-${nodeCounter}`;
    setNodeCounter((current) => current + 1);
    return { id, type: "ixoNode", position, data: { label: nodeDef.label, kind: nodeDef.group, category: nodeDef.group.toUpperCase(), value: "", nodeType: nodeDef.type || nodeDef.key, refKey: "" } };
  }, [nodeCounter]);

  const magicAlign = () => {
    snapshot();
    const order = topoOrder(nodes, edges);
    const depth = {};
    nodes.forEach((n) => (depth[n.id] = 0));
    edges.forEach((e) => {
      depth[e.target] = Math.max(depth[e.target] || 0, (depth[e.source] || 0) + 1);
    });
    const byDepth = {};
    order.forEach((id) => {
      const d = depth[id] || 0;
      if (!byDepth[d]) byDepth[d] = [];
      byDepth[d].push(id);
    });
    const next = nodes.map((node) => {
      const d = depth[node.id] || 0;
      const row = byDepth[d].indexOf(node.id);
      return { ...node, position: { x: 120 + d * 280, y: 80 + row * 150 } };
    });
    setNodes(next);
    setStatus("Magic Align completed.");
    setIsDirty(true);
  };

  const createGroupBox = () => {
    const targets = nodes.filter((n) => selectedNodeIds.includes(n.id));
    if (targets.length < 2) return;
    snapshot();
    const xs = targets.map((n) => n.position.x);
    const ys = targets.map((n) => n.position.y);
    const maxX = Math.max(...targets.map((n) => n.position.x + 220));
    const maxY = Math.max(...targets.map((n) => n.position.y + 90));
    const groupNode = {
      id: `group-${Date.now()}`,
      type: "group",
      data: { label: "Group Box (comment)", kind: "utility", category: "Group", value: "Edit comment in inspector", nodeType: "group", refKey: "" },
      position: { x: Math.min(...xs) - 40, y: Math.min(...ys) - 40 },
      style: { width: maxX - Math.min(...xs) + 80, height: maxY - Math.min(...ys) + 80, background: "rgba(255,255,255,0.04)", border: "1px dashed #ffffff88" },
      draggable: true
    };
    setNodes((current) => [...current, groupNode]);
    setSelectedNodeId(groupNode.id);
    setInspectorMode("inspector");
    setStatus("Group Box created.");
    setIsDirty(true);
  };

  const undo = () => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setFuture((f) => [...f, cloneState(nodes, edges, inputValues, nodeCounter)]);
      applyState(prev);
      setIsDirty(true);
      return h.slice(0, -1);
    });
  };
  const redo = () => {
    setFuture((f) => {
      if (f.length === 0) return f;
      const next = f[f.length - 1];
      setHistory((h) => [...h, cloneState(nodes, edges, inputValues, nodeCounter)]);
      applyState(next);
      setIsDirty(true);
      return f.slice(0, -1);
    });
  };
  const deleteSelection = () => {
    if (selectedNodeIds.length === 0) return;
    snapshot();
    const setIds = new Set(selectedNodeIds);
    setNodes((current) => current.filter((n) => !setIds.has(n.id)));
    setEdges((current) => current.filter((e) => !setIds.has(e.source) && !setIds.has(e.target)));
    setSelectedNodeId(null);
    setSelectedNodeIds([]);
    setIsDirty(true);
  };
  const duplicateSelection = () => {
    if (selectedNodeIds.length === 0) return;
    snapshot();
    const targets = nodes.filter((n) => selectedNodeIds.includes(n.id));
    const clones = targets.map((node, idx) => ({
      ...node,
      id: `node-${nodeCounter + idx}`,
      position: { x: node.position.x + 40, y: node.position.y + 40 },
      data: { ...node.data, label: `${node.data.label} Copy` }
    }));
    setNodeCounter((c) => c + clones.length);
    setNodes((current) => [...current, ...clones]);
    setIsDirty(true);
  };

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
    setContextMenu({ x: event.clientX, y: event.clientY, flowPosition: screenToFlowPosition({ x: event.clientX, y: event.clientY }) });
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

  const updateNodeField = (field, value) => {
    if (!selectedNode) return;
    snapshot();
    setNodes((current) => current.map((node) => node.id === selectedNode.id ? { ...node, data: { ...node.data, [field]: value } } : node));
    setIsDirty(true);
  };

  const saveProject = async () => {
    if (!window.ixo?.saveProject) return setStatus("Save unavailable in browser mode.");
    const result = await window.ixo.saveProject({ nodes, edges, nodeCounter, inputValues });
    if (result.ok) {
      setStatus(`Saved .ixo: ${result.path}`);
      setIsDirty(false);
    }
  };
  const loadProject = async () => {
    if (!window.ixo?.loadProject) return setStatus("Load unavailable in browser mode.");
    const result = await window.ixo.loadProject();
    if (result.ok && result.data) {
      snapshot();
      setNodes(result.data.nodes || []);
      setEdges(result.data.edges || []);
      setNodeCounter(result.data.nodeCounter || 1);
      setInputValues(result.data.inputValues || {});
      setStatus(`Loaded .ixo: ${result.path}`);
      setIsDirty(false);
    }
  };
  const exportProject = async () => {
    if (!window.ixo?.exportProject) return setStatus("Export unavailable in browser mode.");
    const result = await window.ixo.exportProject({ nodes, edges, nodeCounter, inputValues });
    if (result.ok) setStatus(`Exported archive: ${result.path}`);
  };

  const CanvasPane = (
    <div className="editor-area" onDrop={onDrop} onDragOver={onDragOver} style={{ "--trace-duration": `${TRACE_SPEED[speed]}s` }}>
      <ReactFlow
        nodes={nodesWithTrace}
        edges={edgeView}
        nodeTypes={nodeTypes}
        onNodesChange={(changes) => {
          onNodesChange(changes);
          setIsDirty(true);
        }}
        onEdgesChange={(changes) => {
          onEdgesChange(changes);
          setIsDirty(true);
        }}
        onConnect={onConnect}
        onPaneContextMenu={onPaneContextMenu}
        onSelectionChange={({ nodes: selected }) => setSelectedNodeIds(selected.map((n) => n.id))}
        onNodeClick={(_, node) => {
          setSelectedNodeId(node.id);
          setInspectorMode("basic");
        }}
        onNodeDoubleClick={(_, node) => {
          setSelectedNodeId(node.id);
          setInspectorMode("inspector");
        }}
        onPaneClick={() => {
          setSelectedNodeId(null);
          setContextMenu(null);
        }}
        fitView
      >
        <MiniMap nodeColor={(node) => NODE_COLOR[node.data?.kind] || "#ffffff"} pannable zoomable />
        <Controls />
        <Background color="#292929" gap={22} size={1.2} variant="dots" />
        <Panel position="top-right" className="hint-panel">Space: Quick Search | G: Group | Ctrl+S/Z/Y/D</Panel>
      </ReactFlow>
      {contextMenu ? (
        <div className="context-menu" style={{ left: contextMenu.x, top: contextMenu.y }}>
          <input type="text" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search nodes..." autoFocus />
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
          <div className="quick-search-card" onClick={(e) => e.stopPropagation()}>
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Type node name and Enter..." autoFocus onKeyDown={(e) => {
              if (e.key === "Enter" && searchCandidates[0]) addNodeFromSearch(searchCandidates[0], "center");
              if (e.key === "Escape") setQuickSearchOpen(false);
            }} />
            <div className="quick-search-list">
              {searchCandidates.slice(0, 8).map((item) => (
                <button key={item.key} onClick={() => addNodeFromSearch(item, "center")}>{item.label}</button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <div className="app-shell">
      <main className="workspace">
        <aside className="sidebar">
          <div className="command-center">
            <div className="brand">
              <span className="brand-mark">
                <img src={LOGO_FALLBACKS[logoIndex]} alt="IXO Logo" onError={() => setLogoIndex((index) => (index + 1 < LOGO_FALLBACKS.length ? index + 1 : index))} />
              </span>
              <h1>IXO Engine</h1>
            </div>
            <div className="menu-row">
              <div className="file-menu">
                <button className="menu-btn" onClick={() => setShowFileMenu((v) => !v)}>File</button>
                {showFileMenu ? (
                  <div className="file-dropdown">
                    <button onClick={saveProject}>Save</button>
                    <button onClick={loadProject}>Load</button>
                    <button onClick={exportProject}>Export</button>
                    <button onClick={magicAlign}>Magic Align</button>
                  </div>
                ) : null}
              </div>
             {/* 기존 exec-controls를 이 구조로 교체 */}
            <div className="exec-controls">
  {/* 상단: 스피드 슬라이더 영역 */}
          <div className="exec-row-top">
    <label>Speed {speed}x</label>
    <input 
      type="range" 
      min="0.5" 
      max="2" 
      step="0.5" 
      value={speed} 
      onChange={(e) => setSpeed(e.target.value)} 
    />
  </div>
  
  {/* 하단: 제어 버튼 및 Docs 영역 */}
  <div className="exec-row-bottom">
    <button className="menu-btn" onClick={() => setPaused((p) => !p)}>
      {paused ? "Resume" : "Pause"}
    </button>
    <label className="trace-inline">
      <input type="checkbox" checked={debugOverlay} onChange={(event) => setDebugOverlay(event.target.checked)} />
      Trace
    </label>
    {/* Docs 버튼 추가: 외부 브라우저 호출 */}
    <button 
      className="menu-btn docs-btn" 
      onClick={() => window.ixo?.openExternal('https://minyangtech.n-e.kr/docs/ixo/index')}
      style={{ borderColor: "#3ecf8e", marginLeft: "auto" }}
    >
      Docs
    </button>
  </div>
</div>
            </div>
          </div>

          <div className="panel-title">Node Library</div>
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
                    <button key={item.key} draggable onDragStart={(event) => onDragStartNode(event, item)} className="node-chip">
                      <span className="node-chip-dot" style={{ background: NODE_COLOR[item.group] }} />
                      {item.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </section>
          ))}
        </aside>

        <section className="canvas-zone">
          <PanelGroup direction="horizontal" className="split-group">
            <ResizablePanel defaultSize={62} minSize={35}>{CanvasPane}</ResizablePanel>
            <PanelResizeHandle className="resize-handle" />
            <ResizablePanel defaultSize={38} minSize={25}>
              <RuntimePreview runtime={runtime} nodes={nodes} inputValues={inputValues} setInputValues={setInputValues} debugOverlay={debugOverlay} />
            </ResizablePanel>
          </PanelGroup>
        </section>

        <aside className="properties">
          <div className="panel-title">{inspectorMode === "inspector" ? "Pro Inspector" : "Properties"}</div>
          {selectedNode ? (
            <div className="property-form">
              <label>Node Label<input type="text" value={selectedNode.data.label} onChange={(event) => updateNodeField("label", event.target.value)} /></label>
              <label>
                {selectedNode.data.nodeType === "condition" ? "Condition Chain (AND/OR)" : selectedNode.data.nodeType === "math" ? "Math Expression" : selectedNode.data.nodeType === "script" ? "JavaScript Code" : "Value / Setting"}
                {selectedNode.data.nodeType === "condition" || selectedNode.data.nodeType === "math" || selectedNode.data.nodeType === "script" ? (
                  <textarea value={selectedNode.data.value || ""} onChange={(event) => updateNodeField("value", event.target.value)} placeholder={selectedNode.data.nodeType === "script" ? "return context.username;" : "{{score}} > 10 AND {{role}} == admin"} />
                ) : (
                  <input type="text" value={selectedNode.data.value || ""} onChange={(event) => updateNodeField("value", event.target.value)} placeholder="text, path, url, expression..." />
                )}
              </label>
              <label>Ref Key<input type="text" value={selectedNode.data.refKey || ""} onChange={(event) => updateNodeField("refKey", event.target.value)} placeholder="username, totalPrice..." /></label>
              <label>Node Type<input type="text" value={selectedNode.data.nodeType || ""} onChange={(event) => updateNodeField("nodeType", event.target.value)} /></label>
              <label>Numeric Slider<input type="range" min="0" max="100" value={Number(selectedNode.data.sliderValue || 0)} onChange={(e) => updateNodeField("sliderValue", e.target.value)} /></label>
              <label>Color Picker<input type="color" value={selectedNode.data.colorValue || "#ffffff"} onChange={(e) => updateNodeField("colorValue", e.target.value)} /></label>
              <label>File Path<input type="file" onChange={(e) => updateNodeField("value", e.target.files?.[0]?.name || "")} /></label>
              <div className="selected-id">Selected ID: {selectedNode.id}</div>
            </div>
          ) : (
            <p className="placeholder">Double click a node to enter Inspector mode.</p>
          )}
        </aside>
      </main>
      <footer className="status-bar">
        <span>ENGINE STATUS: {status}{isDirty ? " • Unsaved changes" : ""}</span>
        <span>Nodes {nodes.length} | Edges {edges.length} | {flowJson.length} bytes</span>
      </footer>
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
