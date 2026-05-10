function _mergeNamespaces(n2, m2) {
  for (var i = 0; i < m2.length; i++) {
    const e = m2[i];
    if (typeof e !== "string" && !Array.isArray(e)) {
      for (const k2 in e) {
        if (k2 !== "default" && !(k2 in n2)) {
          const d = Object.getOwnPropertyDescriptor(e, k2);
          if (d) {
            Object.defineProperty(n2, k2, d.get ? d : {
              enumerable: true,
              get: () => e[k2]
            });
          }
        }
      }
    }
  }
  return Object.freeze(Object.defineProperty(n2, Symbol.toStringTag, { value: "Module" }));
}
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
var react = { exports: {} };
var react_production_min = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l$1 = Symbol.for("react.element"), n$1 = Symbol.for("react.portal"), p$2 = Symbol.for("react.fragment"), q$1 = Symbol.for("react.strict_mode"), r = Symbol.for("react.profiler"), t = Symbol.for("react.provider"), u = Symbol.for("react.context"), v$1 = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), z$1 = Symbol.iterator;
function A$1(a) {
  if (null === a || "object" !== typeof a) return null;
  a = z$1 && a[z$1] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var B$1 = { isMounted: function() {
  return false;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, C$1 = Object.assign, D$1 = {};
function E$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
E$1.prototype.isReactComponent = {};
E$1.prototype.setState = function(a, b) {
  if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, a, b, "setState");
};
E$1.prototype.forceUpdate = function(a) {
  this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};
function F() {
}
F.prototype = E$1.prototype;
function G$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
var H$1 = G$1.prototype = new F();
H$1.constructor = G$1;
C$1(H$1, E$1.prototype);
H$1.isPureReactComponent = true;
var I$1 = Array.isArray, J = Object.prototype.hasOwnProperty, K$1 = { current: null }, L$1 = { key: true, ref: true, __self: true, __source: true };
function M$1(a, b, e) {
  var d, c = {}, k2 = null, h = null;
  if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k2 = "" + b.key), b) J.call(b, d) && !L$1.hasOwnProperty(d) && (c[d] = b[d]);
  var g = arguments.length - 2;
  if (1 === g) c.children = e;
  else if (1 < g) {
    for (var f2 = Array(g), m2 = 0; m2 < g; m2++) f2[m2] = arguments[m2 + 2];
    c.children = f2;
  }
  if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
  return { $$typeof: l$1, type: a, key: k2, ref: h, props: c, _owner: K$1.current };
}
function N$1(a, b) {
  return { $$typeof: l$1, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
}
function O$1(a) {
  return "object" === typeof a && null !== a && a.$$typeof === l$1;
}
function escape(a) {
  var b = { "=": "=0", ":": "=2" };
  return "$" + a.replace(/[=:]/g, function(a2) {
    return b[a2];
  });
}
var P$1 = /\/+/g;
function Q$1(a, b) {
  return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
}
function R$1(a, b, e, d, c) {
  var k2 = typeof a;
  if ("undefined" === k2 || "boolean" === k2) a = null;
  var h = false;
  if (null === a) h = true;
  else switch (k2) {
    case "string":
    case "number":
      h = true;
      break;
    case "object":
      switch (a.$$typeof) {
        case l$1:
        case n$1:
          h = true;
      }
  }
  if (h) return h = a, c = c(h), a = "" === d ? "." + Q$1(h, 0) : d, I$1(c) ? (e = "", null != a && (e = a.replace(P$1, "$&/") + "/"), R$1(c, b, e, "", function(a2) {
    return a2;
  })) : null != c && (O$1(c) && (c = N$1(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P$1, "$&/") + "/") + a)), b.push(c)), 1;
  h = 0;
  d = "" === d ? "." : d + ":";
  if (I$1(a)) for (var g = 0; g < a.length; g++) {
    k2 = a[g];
    var f2 = d + Q$1(k2, g);
    h += R$1(k2, b, e, f2, c);
  }
  else if (f2 = A$1(a), "function" === typeof f2) for (a = f2.call(a), g = 0; !(k2 = a.next()).done; ) k2 = k2.value, f2 = d + Q$1(k2, g++), h += R$1(k2, b, e, f2, c);
  else if ("object" === k2) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
  return h;
}
function S$1(a, b, e) {
  if (null == a) return a;
  var d = [], c = 0;
  R$1(a, d, "", "", function(a2) {
    return b.call(e, a2, c++);
  });
  return d;
}
function T$1(a) {
  if (-1 === a._status) {
    var b = a._result;
    b = b();
    b.then(function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
    }, function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
    });
    -1 === a._status && (a._status = 0, a._result = b);
  }
  if (1 === a._status) return a._result.default;
  throw a._result;
}
var U$1 = { current: null }, V$1 = { transition: null }, W$1 = { ReactCurrentDispatcher: U$1, ReactCurrentBatchConfig: V$1, ReactCurrentOwner: K$1 };
function X$1() {
  throw Error("act(...) is not supported in production builds of React.");
}
react_production_min.Children = { map: S$1, forEach: function(a, b, e) {
  S$1(a, function() {
    b.apply(this, arguments);
  }, e);
}, count: function(a) {
  var b = 0;
  S$1(a, function() {
    b++;
  });
  return b;
}, toArray: function(a) {
  return S$1(a, function(a2) {
    return a2;
  }) || [];
}, only: function(a) {
  if (!O$1(a)) throw Error("React.Children.only expected to receive a single React element child.");
  return a;
} };
react_production_min.Component = E$1;
react_production_min.Fragment = p$2;
react_production_min.Profiler = r;
react_production_min.PureComponent = G$1;
react_production_min.StrictMode = q$1;
react_production_min.Suspense = w;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$1;
react_production_min.act = X$1;
react_production_min.cloneElement = function(a, b, e) {
  if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
  var d = C$1({}, a.props), c = a.key, k2 = a.ref, h = a._owner;
  if (null != b) {
    void 0 !== b.ref && (k2 = b.ref, h = K$1.current);
    void 0 !== b.key && (c = "" + b.key);
    if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
    for (f2 in b) J.call(b, f2) && !L$1.hasOwnProperty(f2) && (d[f2] = void 0 === b[f2] && void 0 !== g ? g[f2] : b[f2]);
  }
  var f2 = arguments.length - 2;
  if (1 === f2) d.children = e;
  else if (1 < f2) {
    g = Array(f2);
    for (var m2 = 0; m2 < f2; m2++) g[m2] = arguments[m2 + 2];
    d.children = g;
  }
  return { $$typeof: l$1, type: a.type, key: c, ref: k2, props: d, _owner: h };
};
react_production_min.createContext = function(a) {
  a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
  a.Provider = { $$typeof: t, _context: a };
  return a.Consumer = a;
};
react_production_min.createElement = M$1;
react_production_min.createFactory = function(a) {
  var b = M$1.bind(null, a);
  b.type = a;
  return b;
};
react_production_min.createRef = function() {
  return { current: null };
};
react_production_min.forwardRef = function(a) {
  return { $$typeof: v$1, render: a };
};
react_production_min.isValidElement = O$1;
react_production_min.lazy = function(a) {
  return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T$1 };
};
react_production_min.memo = function(a, b) {
  return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
};
react_production_min.startTransition = function(a) {
  var b = V$1.transition;
  V$1.transition = {};
  try {
    a();
  } finally {
    V$1.transition = b;
  }
};
react_production_min.unstable_act = X$1;
react_production_min.useCallback = function(a, b) {
  return U$1.current.useCallback(a, b);
};
react_production_min.useContext = function(a) {
  return U$1.current.useContext(a);
};
react_production_min.useDebugValue = function() {
};
react_production_min.useDeferredValue = function(a) {
  return U$1.current.useDeferredValue(a);
};
react_production_min.useEffect = function(a, b) {
  return U$1.current.useEffect(a, b);
};
react_production_min.useId = function() {
  return U$1.current.useId();
};
react_production_min.useImperativeHandle = function(a, b, e) {
  return U$1.current.useImperativeHandle(a, b, e);
};
react_production_min.useInsertionEffect = function(a, b) {
  return U$1.current.useInsertionEffect(a, b);
};
react_production_min.useLayoutEffect = function(a, b) {
  return U$1.current.useLayoutEffect(a, b);
};
react_production_min.useMemo = function(a, b) {
  return U$1.current.useMemo(a, b);
};
react_production_min.useReducer = function(a, b, e) {
  return U$1.current.useReducer(a, b, e);
};
react_production_min.useRef = function(a) {
  return U$1.current.useRef(a);
};
react_production_min.useState = function(a) {
  return U$1.current.useState(a);
};
react_production_min.useSyncExternalStore = function(a, b, e) {
  return U$1.current.useSyncExternalStore(a, b, e);
};
react_production_min.useTransition = function() {
  return U$1.current.useTransition();
};
react_production_min.version = "18.3.1";
{
  react.exports = react_production_min;
}
var reactExports = react.exports;
const React$2 = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
const React$3 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: React$2
}, [reactExports]);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f = reactExports, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$1 = { key: true, ref: true, __self: true, __source: true };
function q(c, a, g) {
  var b, d = {}, e = null, h = null;
  void 0 !== g && (e = "" + g);
  void 0 !== a.key && (e = "" + a.key);
  void 0 !== a.ref && (h = a.ref);
  for (b in a) m$1.call(a, b) && !p$1.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
  return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
}
reactJsxRuntime_production_min.Fragment = l;
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
var reactDom = { exports: {} };
var reactDom_production_min = {};
var scheduler = { exports: {} };
var scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(exports$1) {
  function f2(a, b) {
    var c = a.length;
    a.push(b);
    a: for (; 0 < c; ) {
      var d = c - 1 >>> 1, e = a[d];
      if (0 < g(e, b)) a[d] = b, a[c] = e, c = d;
      else break a;
    }
  }
  function h(a) {
    return 0 === a.length ? null : a[0];
  }
  function k2(a) {
    if (0 === a.length) return null;
    var b = a[0], c = a.pop();
    if (c !== b) {
      a[0] = c;
      a: for (var d = 0, e = a.length, w2 = e >>> 1; d < w2; ) {
        var m2 = 2 * (d + 1) - 1, C2 = a[m2], n2 = m2 + 1, x2 = a[n2];
        if (0 > g(C2, c)) n2 < e && 0 > g(x2, C2) ? (a[d] = x2, a[n2] = c, d = n2) : (a[d] = C2, a[m2] = c, d = m2);
        else if (n2 < e && 0 > g(x2, c)) a[d] = x2, a[n2] = c, d = n2;
        else break a;
      }
    }
    return b;
  }
  function g(a, b) {
    var c = a.sortIndex - b.sortIndex;
    return 0 !== c ? c : a.id - b.id;
  }
  if ("object" === typeof performance && "function" === typeof performance.now) {
    var l2 = performance;
    exports$1.unstable_now = function() {
      return l2.now();
    };
  } else {
    var p2 = Date, q2 = p2.now();
    exports$1.unstable_now = function() {
      return p2.now() - q2;
    };
  }
  var r2 = [], t2 = [], u2 = 1, v2 = null, y2 = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
  "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function G2(a) {
    for (var b = h(t2); null !== b; ) {
      if (null === b.callback) k2(t2);
      else if (b.startTime <= a) k2(t2), b.sortIndex = b.expirationTime, f2(r2, b);
      else break;
      b = h(t2);
    }
  }
  function H2(a) {
    B2 = false;
    G2(a);
    if (!A2) if (null !== h(r2)) A2 = true, I2(J2);
    else {
      var b = h(t2);
      null !== b && K2(H2, b.startTime - a);
    }
  }
  function J2(a, b) {
    A2 = false;
    B2 && (B2 = false, E2(L2), L2 = -1);
    z2 = true;
    var c = y2;
    try {
      G2(b);
      for (v2 = h(r2); null !== v2 && (!(v2.expirationTime > b) || a && !M2()); ) {
        var d = v2.callback;
        if ("function" === typeof d) {
          v2.callback = null;
          y2 = v2.priorityLevel;
          var e = d(v2.expirationTime <= b);
          b = exports$1.unstable_now();
          "function" === typeof e ? v2.callback = e : v2 === h(r2) && k2(r2);
          G2(b);
        } else k2(r2);
        v2 = h(r2);
      }
      if (null !== v2) var w2 = true;
      else {
        var m2 = h(t2);
        null !== m2 && K2(H2, m2.startTime - b);
        w2 = false;
      }
      return w2;
    } finally {
      v2 = null, y2 = c, z2 = false;
    }
  }
  var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
  function M2() {
    return exports$1.unstable_now() - Q2 < P2 ? false : true;
  }
  function R2() {
    if (null !== O2) {
      var a = exports$1.unstable_now();
      Q2 = a;
      var b = true;
      try {
        b = O2(true, a);
      } finally {
        b ? S2() : (N2 = false, O2 = null);
      }
    } else N2 = false;
  }
  var S2;
  if ("function" === typeof F2) S2 = function() {
    F2(R2);
  };
  else if ("undefined" !== typeof MessageChannel) {
    var T2 = new MessageChannel(), U2 = T2.port2;
    T2.port1.onmessage = R2;
    S2 = function() {
      U2.postMessage(null);
    };
  } else S2 = function() {
    D2(R2, 0);
  };
  function I2(a) {
    O2 = a;
    N2 || (N2 = true, S2());
  }
  function K2(a, b) {
    L2 = D2(function() {
      a(exports$1.unstable_now());
    }, b);
  }
  exports$1.unstable_IdlePriority = 5;
  exports$1.unstable_ImmediatePriority = 1;
  exports$1.unstable_LowPriority = 4;
  exports$1.unstable_NormalPriority = 3;
  exports$1.unstable_Profiling = null;
  exports$1.unstable_UserBlockingPriority = 2;
  exports$1.unstable_cancelCallback = function(a) {
    a.callback = null;
  };
  exports$1.unstable_continueExecution = function() {
    A2 || z2 || (A2 = true, I2(J2));
  };
  exports$1.unstable_forceFrameRate = function(a) {
    0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a ? Math.floor(1e3 / a) : 5;
  };
  exports$1.unstable_getCurrentPriorityLevel = function() {
    return y2;
  };
  exports$1.unstable_getFirstCallbackNode = function() {
    return h(r2);
  };
  exports$1.unstable_next = function(a) {
    switch (y2) {
      case 1:
      case 2:
      case 3:
        var b = 3;
        break;
      default:
        b = y2;
    }
    var c = y2;
    y2 = b;
    try {
      return a();
    } finally {
      y2 = c;
    }
  };
  exports$1.unstable_pauseExecution = function() {
  };
  exports$1.unstable_requestPaint = function() {
  };
  exports$1.unstable_runWithPriority = function(a, b) {
    switch (a) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        a = 3;
    }
    var c = y2;
    y2 = a;
    try {
      return b();
    } finally {
      y2 = c;
    }
  };
  exports$1.unstable_scheduleCallback = function(a, b, c) {
    var d = exports$1.unstable_now();
    "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
    switch (a) {
      case 1:
        var e = -1;
        break;
      case 2:
        e = 250;
        break;
      case 5:
        e = 1073741823;
        break;
      case 4:
        e = 1e4;
        break;
      default:
        e = 5e3;
    }
    e = c + e;
    a = { id: u2++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
    c > d ? (a.sortIndex = c, f2(t2, a), null === h(r2) && a === h(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c - d))) : (a.sortIndex = e, f2(r2, a), A2 || z2 || (A2 = true, I2(J2)));
    return a;
  };
  exports$1.unstable_shouldYield = M2;
  exports$1.unstable_wrapCallback = function(a) {
    var b = y2;
    return function() {
      var c = y2;
      y2 = b;
      try {
        return a.apply(this, arguments);
      } finally {
        y2 = c;
      }
    };
  };
})(scheduler_production_min);
{
  scheduler.exports = scheduler_production_min;
}
var schedulerExports = scheduler.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aa = reactExports, ca = schedulerExports;
function p(a) {
  for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
  return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var da = /* @__PURE__ */ new Set(), ea = {};
function fa(a, b) {
  ha(a, b);
  ha(a + "Capture", b);
}
function ha(a, b) {
  ea[a] = b;
  for (a = 0; a < b.length; a++) da.add(b[a]);
}
var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
function oa(a) {
  if (ja.call(ma, a)) return true;
  if (ja.call(la, a)) return false;
  if (ka.test(a)) return ma[a] = true;
  la[a] = true;
  return false;
}
function pa(a, b, c, d) {
  if (null !== c && 0 === c.type) return false;
  switch (typeof b) {
    case "function":
    case "symbol":
      return true;
    case "boolean":
      if (d) return false;
      if (null !== c) return !c.acceptsBooleans;
      a = a.toLowerCase().slice(0, 5);
      return "data-" !== a && "aria-" !== a;
    default:
      return false;
  }
}
function qa(a, b, c, d) {
  if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return true;
  if (d) return false;
  if (null !== c) switch (c.type) {
    case 3:
      return !b;
    case 4:
      return false === b;
    case 5:
      return isNaN(b);
    case 6:
      return isNaN(b) || 1 > b;
  }
  return false;
}
function v(a, b, c, d, e, f2, g) {
  this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
  this.attributeName = d;
  this.attributeNamespace = e;
  this.mustUseProperty = c;
  this.propertyName = a;
  this.type = b;
  this.sanitizeURL = f2;
  this.removeEmptyString = g;
}
var z = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
  z[a] = new v(a, 0, false, a, null, false, false);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
  var b = a[0];
  z[b] = new v(b, 1, false, a[1], null, false, false);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
  z[a] = new v(a, 2, false, a.toLowerCase(), null, false, false);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
  z[a] = new v(a, 2, false, a, null, false, false);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
  z[a] = new v(a, 3, false, a.toLowerCase(), null, false, false);
});
["checked", "multiple", "muted", "selected"].forEach(function(a) {
  z[a] = new v(a, 3, true, a, null, false, false);
});
["capture", "download"].forEach(function(a) {
  z[a] = new v(a, 4, false, a, null, false, false);
});
["cols", "rows", "size", "span"].forEach(function(a) {
  z[a] = new v(a, 6, false, a, null, false, false);
});
["rowSpan", "start"].forEach(function(a) {
  z[a] = new v(a, 5, false, a.toLowerCase(), null, false, false);
});
var ra = /[\-:]([a-z])/g;
function sa(a) {
  return a[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
  var b = a.replace(
    ra,
    sa
  );
  z[b] = new v(b, 1, false, a, null, false, false);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
});
["tabIndex", "crossOrigin"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, false, false);
});
z.xlinkHref = new v("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
["src", "href", "action", "formAction"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, true, true);
});
function ta(a, b, c, d) {
  var e = z.hasOwnProperty(b) ? z[b] : null;
  if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? false : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
}
var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
var Ia = Symbol.for("react.offscreen");
var Ja = Symbol.iterator;
function Ka(a) {
  if (null === a || "object" !== typeof a) return null;
  a = Ja && a[Ja] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var A = Object.assign, La;
function Ma(a) {
  if (void 0 === La) try {
    throw Error();
  } catch (c) {
    var b = c.stack.trim().match(/\n( *(at )?)/);
    La = b && b[1] || "";
  }
  return "\n" + La + a;
}
var Na = false;
function Oa(a, b) {
  if (!a || Na) return "";
  Na = true;
  var c = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (b) if (b = function() {
      throw Error();
    }, Object.defineProperty(b.prototype, "props", { set: function() {
      throw Error();
    } }), "object" === typeof Reflect && Reflect.construct) {
      try {
        Reflect.construct(b, []);
      } catch (l2) {
        var d = l2;
      }
      Reflect.construct(a, [], b);
    } else {
      try {
        b.call();
      } catch (l2) {
        d = l2;
      }
      a.call(b.prototype);
    }
    else {
      try {
        throw Error();
      } catch (l2) {
        d = l2;
      }
      a();
    }
  } catch (l2) {
    if (l2 && d && "string" === typeof l2.stack) {
      for (var e = l2.stack.split("\n"), f2 = d.stack.split("\n"), g = e.length - 1, h = f2.length - 1; 1 <= g && 0 <= h && e[g] !== f2[h]; ) h--;
      for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f2[h]) {
        if (1 !== g || 1 !== h) {
          do
            if (g--, h--, 0 > h || e[g] !== f2[h]) {
              var k2 = "\n" + e[g].replace(" at new ", " at ");
              a.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a.displayName));
              return k2;
            }
          while (1 <= g && 0 <= h);
        }
        break;
      }
    }
  } finally {
    Na = false, Error.prepareStackTrace = c;
  }
  return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
}
function Pa(a) {
  switch (a.tag) {
    case 5:
      return Ma(a.type);
    case 16:
      return Ma("Lazy");
    case 13:
      return Ma("Suspense");
    case 19:
      return Ma("SuspenseList");
    case 0:
    case 2:
    case 15:
      return a = Oa(a.type, false), a;
    case 11:
      return a = Oa(a.type.render, false), a;
    case 1:
      return a = Oa(a.type, true), a;
    default:
      return "";
  }
}
function Qa(a) {
  if (null == a) return null;
  if ("function" === typeof a) return a.displayName || a.name || null;
  if ("string" === typeof a) return a;
  switch (a) {
    case ya:
      return "Fragment";
    case wa:
      return "Portal";
    case Aa:
      return "Profiler";
    case za:
      return "StrictMode";
    case Ea:
      return "Suspense";
    case Fa:
      return "SuspenseList";
  }
  if ("object" === typeof a) switch (a.$$typeof) {
    case Ca:
      return (a.displayName || "Context") + ".Consumer";
    case Ba:
      return (a._context.displayName || "Context") + ".Provider";
    case Da:
      var b = a.render;
      a = a.displayName;
      a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
      return a;
    case Ga:
      return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
    case Ha:
      b = a._payload;
      a = a._init;
      try {
        return Qa(a(b));
      } catch (c) {
      }
  }
  return null;
}
function Ra(a) {
  var b = a.type;
  switch (a.tag) {
    case 24:
      return "Cache";
    case 9:
      return (b.displayName || "Context") + ".Consumer";
    case 10:
      return (b._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return b;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Qa(b);
    case 8:
      return b === za ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if ("function" === typeof b) return b.displayName || b.name || null;
      if ("string" === typeof b) return b;
  }
  return null;
}
function Sa(a) {
  switch (typeof a) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return a;
    case "object":
      return a;
    default:
      return "";
  }
}
function Ta(a) {
  var b = a.type;
  return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
}
function Ua(a) {
  var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
  if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
    var e = c.get, f2 = c.set;
    Object.defineProperty(a, b, { configurable: true, get: function() {
      return e.call(this);
    }, set: function(a2) {
      d = "" + a2;
      f2.call(this, a2);
    } });
    Object.defineProperty(a, b, { enumerable: c.enumerable });
    return { getValue: function() {
      return d;
    }, setValue: function(a2) {
      d = "" + a2;
    }, stopTracking: function() {
      a._valueTracker = null;
      delete a[b];
    } };
  }
}
function Va(a) {
  a._valueTracker || (a._valueTracker = Ua(a));
}
function Wa(a) {
  if (!a) return false;
  var b = a._valueTracker;
  if (!b) return true;
  var c = b.getValue();
  var d = "";
  a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
  a = d;
  return a !== c ? (b.setValue(a), true) : false;
}
function Xa(a) {
  a = a || ("undefined" !== typeof document ? document : void 0);
  if ("undefined" === typeof a) return null;
  try {
    return a.activeElement || a.body;
  } catch (b) {
    return a.body;
  }
}
function Ya(a, b) {
  var c = b.checked;
  return A({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
}
function Za(a, b) {
  var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
  c = Sa(null != b.value ? b.value : c);
  a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
}
function ab(a, b) {
  b = b.checked;
  null != b && ta(a, "checked", b, false);
}
function bb(a, b) {
  ab(a, b);
  var c = Sa(b.value), d = b.type;
  if (null != c) if ("number" === d) {
    if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
  } else a.value !== "" + c && (a.value = "" + c);
  else if ("submit" === d || "reset" === d) {
    a.removeAttribute("value");
    return;
  }
  b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
  null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
}
function db(a, b, c) {
  if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
    var d = b.type;
    if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
    b = "" + a._wrapperState.initialValue;
    c || b === a.value || (a.value = b);
    a.defaultValue = b;
  }
  c = a.name;
  "" !== c && (a.name = "");
  a.defaultChecked = !!a._wrapperState.initialChecked;
  "" !== c && (a.name = c);
}
function cb(a, b, c) {
  if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
}
var eb = Array.isArray;
function fb(a, b, c, d) {
  a = a.options;
  if (b) {
    b = {};
    for (var e = 0; e < c.length; e++) b["$" + c[e]] = true;
    for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = true);
  } else {
    c = "" + Sa(c);
    b = null;
    for (e = 0; e < a.length; e++) {
      if (a[e].value === c) {
        a[e].selected = true;
        d && (a[e].defaultSelected = true);
        return;
      }
      null !== b || a[e].disabled || (b = a[e]);
    }
    null !== b && (b.selected = true);
  }
}
function gb(a, b) {
  if (null != b.dangerouslySetInnerHTML) throw Error(p(91));
  return A({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
}
function hb(a, b) {
  var c = b.value;
  if (null == c) {
    c = b.children;
    b = b.defaultValue;
    if (null != c) {
      if (null != b) throw Error(p(92));
      if (eb(c)) {
        if (1 < c.length) throw Error(p(93));
        c = c[0];
      }
      b = c;
    }
    null == b && (b = "");
    c = b;
  }
  a._wrapperState = { initialValue: Sa(c) };
}
function ib(a, b) {
  var c = Sa(b.value), d = Sa(b.defaultValue);
  null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
  null != d && (a.defaultValue = "" + d);
}
function jb(a) {
  var b = a.textContent;
  b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
}
function kb(a) {
  switch (a) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function lb(a, b) {
  return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
}
var mb, nb = function(a) {
  return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
    MSApp.execUnsafeLocalFunction(function() {
      return a(b, c, d, e);
    });
  } : a;
}(function(a, b) {
  if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b;
  else {
    mb = mb || document.createElement("div");
    mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
    for (b = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
    for (; b.firstChild; ) a.appendChild(b.firstChild);
  }
});
function ob(a, b) {
  if (b) {
    var c = a.firstChild;
    if (c && c === a.lastChild && 3 === c.nodeType) {
      c.nodeValue = b;
      return;
    }
  }
  a.textContent = b;
}
var pb = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
}, qb = ["Webkit", "ms", "Moz", "O"];
Object.keys(pb).forEach(function(a) {
  qb.forEach(function(b) {
    b = b + a.charAt(0).toUpperCase() + a.substring(1);
    pb[b] = pb[a];
  });
});
function rb(a, b, c) {
  return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
}
function sb(a, b) {
  a = a.style;
  for (var c in b) if (b.hasOwnProperty(c)) {
    var d = 0 === c.indexOf("--"), e = rb(c, b[c], d);
    "float" === c && (c = "cssFloat");
    d ? a.setProperty(c, e) : a[c] = e;
  }
}
var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
function ub(a, b) {
  if (b) {
    if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(p(137, a));
    if (null != b.dangerouslySetInnerHTML) {
      if (null != b.children) throw Error(p(60));
      if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML)) throw Error(p(61));
    }
    if (null != b.style && "object" !== typeof b.style) throw Error(p(62));
  }
}
function vb(a, b) {
  if (-1 === a.indexOf("-")) return "string" === typeof b.is;
  switch (a) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
var wb = null;
function xb(a) {
  a = a.target || a.srcElement || window;
  a.correspondingUseElement && (a = a.correspondingUseElement);
  return 3 === a.nodeType ? a.parentNode : a;
}
var yb = null, zb = null, Ab = null;
function Bb(a) {
  if (a = Cb(a)) {
    if ("function" !== typeof yb) throw Error(p(280));
    var b = a.stateNode;
    b && (b = Db(b), yb(a.stateNode, a.type, b));
  }
}
function Eb(a) {
  zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
}
function Fb() {
  if (zb) {
    var a = zb, b = Ab;
    Ab = zb = null;
    Bb(a);
    if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
  }
}
function Gb(a, b) {
  return a(b);
}
function Hb() {
}
var Ib = false;
function Jb(a, b, c) {
  if (Ib) return a(b, c);
  Ib = true;
  try {
    return Gb(a, b, c);
  } finally {
    if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
  }
}
function Kb(a, b) {
  var c = a.stateNode;
  if (null === c) return null;
  var d = Db(c);
  if (null === d) return null;
  c = d[b];
  a: switch (b) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
      a = !d;
      break a;
    default:
      a = false;
  }
  if (a) return null;
  if (c && "function" !== typeof c) throw Error(p(231, b, typeof c));
  return c;
}
var Lb = false;
if (ia) try {
  var Mb = {};
  Object.defineProperty(Mb, "passive", { get: function() {
    Lb = true;
  } });
  window.addEventListener("test", Mb, Mb);
  window.removeEventListener("test", Mb, Mb);
} catch (a) {
  Lb = false;
}
function Nb(a, b, c, d, e, f2, g, h, k2) {
  var l2 = Array.prototype.slice.call(arguments, 3);
  try {
    b.apply(c, l2);
  } catch (m2) {
    this.onError(m2);
  }
}
var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a) {
  Ob = true;
  Pb = a;
} };
function Tb(a, b, c, d, e, f2, g, h, k2) {
  Ob = false;
  Pb = null;
  Nb.apply(Sb, arguments);
}
function Ub(a, b, c, d, e, f2, g, h, k2) {
  Tb.apply(this, arguments);
  if (Ob) {
    if (Ob) {
      var l2 = Pb;
      Ob = false;
      Pb = null;
    } else throw Error(p(198));
    Qb || (Qb = true, Rb = l2);
  }
}
function Vb(a) {
  var b = a, c = a;
  if (a.alternate) for (; b.return; ) b = b.return;
  else {
    a = b;
    do
      b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
    while (a);
  }
  return 3 === b.tag ? c : null;
}
function Wb(a) {
  if (13 === a.tag) {
    var b = a.memoizedState;
    null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
    if (null !== b) return b.dehydrated;
  }
  return null;
}
function Xb(a) {
  if (Vb(a) !== a) throw Error(p(188));
}
function Yb(a) {
  var b = a.alternate;
  if (!b) {
    b = Vb(a);
    if (null === b) throw Error(p(188));
    return b !== a ? null : a;
  }
  for (var c = a, d = b; ; ) {
    var e = c.return;
    if (null === e) break;
    var f2 = e.alternate;
    if (null === f2) {
      d = e.return;
      if (null !== d) {
        c = d;
        continue;
      }
      break;
    }
    if (e.child === f2.child) {
      for (f2 = e.child; f2; ) {
        if (f2 === c) return Xb(e), a;
        if (f2 === d) return Xb(e), b;
        f2 = f2.sibling;
      }
      throw Error(p(188));
    }
    if (c.return !== d.return) c = e, d = f2;
    else {
      for (var g = false, h = e.child; h; ) {
        if (h === c) {
          g = true;
          c = e;
          d = f2;
          break;
        }
        if (h === d) {
          g = true;
          d = e;
          c = f2;
          break;
        }
        h = h.sibling;
      }
      if (!g) {
        for (h = f2.child; h; ) {
          if (h === c) {
            g = true;
            c = f2;
            d = e;
            break;
          }
          if (h === d) {
            g = true;
            d = f2;
            c = e;
            break;
          }
          h = h.sibling;
        }
        if (!g) throw Error(p(189));
      }
    }
    if (c.alternate !== d) throw Error(p(190));
  }
  if (3 !== c.tag) throw Error(p(188));
  return c.stateNode.current === c ? a : b;
}
function Zb(a) {
  a = Yb(a);
  return null !== a ? $b(a) : null;
}
function $b(a) {
  if (5 === a.tag || 6 === a.tag) return a;
  for (a = a.child; null !== a; ) {
    var b = $b(a);
    if (null !== b) return b;
    a = a.sibling;
  }
  return null;
}
var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc$1 = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
function mc(a) {
  if (lc && "function" === typeof lc.onCommitFiberRoot) try {
    lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
  } catch (b) {
  }
}
var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
function nc(a) {
  a >>>= 0;
  return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
}
var rc = 64, sc = 4194304;
function tc(a) {
  switch (a & -a) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return a & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return a & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return a;
  }
}
function uc(a, b) {
  var c = a.pendingLanes;
  if (0 === c) return 0;
  var d = 0, e = a.suspendedLanes, f2 = a.pingedLanes, g = c & 268435455;
  if (0 !== g) {
    var h = g & ~e;
    0 !== h ? d = tc(h) : (f2 &= g, 0 !== f2 && (d = tc(f2)));
  } else g = c & ~e, 0 !== g ? d = tc(g) : 0 !== f2 && (d = tc(f2));
  if (0 === d) return 0;
  if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f2 = b & -b, e >= f2 || 16 === e && 0 !== (f2 & 4194240))) return b;
  0 !== (d & 4) && (d |= c & 16);
  b = a.entangledLanes;
  if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
  return d;
}
function vc(a, b) {
  switch (a) {
    case 1:
    case 2:
    case 4:
      return b + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return b + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function wc(a, b) {
  for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f2 = a.pendingLanes; 0 < f2; ) {
    var g = 31 - oc(f2), h = 1 << g, k2 = e[g];
    if (-1 === k2) {
      if (0 === (h & c) || 0 !== (h & d)) e[g] = vc(h, b);
    } else k2 <= b && (a.expiredLanes |= h);
    f2 &= ~h;
  }
}
function xc(a) {
  a = a.pendingLanes & -1073741825;
  return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
}
function yc() {
  var a = rc;
  rc <<= 1;
  0 === (rc & 4194240) && (rc = 64);
  return a;
}
function zc(a) {
  for (var b = [], c = 0; 31 > c; c++) b.push(a);
  return b;
}
function Ac(a, b, c) {
  a.pendingLanes |= b;
  536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
  a = a.eventTimes;
  b = 31 - oc(b);
  a[b] = c;
}
function Bc(a, b) {
  var c = a.pendingLanes & ~b;
  a.pendingLanes = b;
  a.suspendedLanes = 0;
  a.pingedLanes = 0;
  a.expiredLanes &= b;
  a.mutableReadLanes &= b;
  a.entangledLanes &= b;
  b = a.entanglements;
  var d = a.eventTimes;
  for (a = a.expirationTimes; 0 < c; ) {
    var e = 31 - oc(c), f2 = 1 << e;
    b[e] = 0;
    d[e] = -1;
    a[e] = -1;
    c &= ~f2;
  }
}
function Cc(a, b) {
  var c = a.entangledLanes |= b;
  for (a = a.entanglements; c; ) {
    var d = 31 - oc(c), e = 1 << d;
    e & b | a[d] & b && (a[d] |= b);
    c &= ~e;
  }
}
var C = 0;
function Dc(a) {
  a &= -a;
  return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
}
var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a, b) {
  switch (a) {
    case "focusin":
    case "focusout":
      Lc = null;
      break;
    case "dragenter":
    case "dragleave":
      Mc = null;
      break;
    case "mouseover":
    case "mouseout":
      Nc = null;
      break;
    case "pointerover":
    case "pointerout":
      Oc.delete(b.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Pc.delete(b.pointerId);
  }
}
function Tc(a, b, c, d, e, f2) {
  if (null === a || a.nativeEvent !== f2) return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f2, targetContainers: [e] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
  a.eventSystemFlags |= d;
  b = a.targetContainers;
  null !== e && -1 === b.indexOf(e) && b.push(e);
  return a;
}
function Uc(a, b, c, d, e) {
  switch (b) {
    case "focusin":
      return Lc = Tc(Lc, a, b, c, d, e), true;
    case "dragenter":
      return Mc = Tc(Mc, a, b, c, d, e), true;
    case "mouseover":
      return Nc = Tc(Nc, a, b, c, d, e), true;
    case "pointerover":
      var f2 = e.pointerId;
      Oc.set(f2, Tc(Oc.get(f2) || null, a, b, c, d, e));
      return true;
    case "gotpointercapture":
      return f2 = e.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a, b, c, d, e)), true;
  }
  return false;
}
function Vc(a) {
  var b = Wc(a.target);
  if (null !== b) {
    var c = Vb(b);
    if (null !== c) {
      if (b = c.tag, 13 === b) {
        if (b = Wb(c), null !== b) {
          a.blockedOn = b;
          Ic(a.priority, function() {
            Gc(c);
          });
          return;
        }
      } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
        a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
        return;
      }
    }
  }
  a.blockedOn = null;
}
function Xc(a) {
  if (null !== a.blockedOn) return false;
  for (var b = a.targetContainers; 0 < b.length; ) {
    var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
    if (null === c) {
      c = a.nativeEvent;
      var d = new c.constructor(c.type, c);
      wb = d;
      c.target.dispatchEvent(d);
      wb = null;
    } else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
    b.shift();
  }
  return true;
}
function Zc(a, b, c) {
  Xc(a) && c.delete(b);
}
function $c() {
  Jc = false;
  null !== Lc && Xc(Lc) && (Lc = null);
  null !== Mc && Xc(Mc) && (Mc = null);
  null !== Nc && Xc(Nc) && (Nc = null);
  Oc.forEach(Zc);
  Pc.forEach(Zc);
}
function ad(a, b) {
  a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
}
function bd(a) {
  function b(b2) {
    return ad(b2, a);
  }
  if (0 < Kc.length) {
    ad(Kc[0], a);
    for (var c = 1; c < Kc.length; c++) {
      var d = Kc[c];
      d.blockedOn === a && (d.blockedOn = null);
    }
  }
  null !== Lc && ad(Lc, a);
  null !== Mc && ad(Mc, a);
  null !== Nc && ad(Nc, a);
  Oc.forEach(b);
  Pc.forEach(b);
  for (c = 0; c < Qc.length; c++) d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
  for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); ) Vc(c), null === c.blockedOn && Qc.shift();
}
var cd = ua.ReactCurrentBatchConfig, dd = true;
function ed(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 1, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function gd(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 4, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function fd(a, b, c, d) {
  if (dd) {
    var e = Yc(a, b, c, d);
    if (null === e) hd(a, b, d, id$1, c), Sc(a, d);
    else if (Uc(e, a, b, c, d)) d.stopPropagation();
    else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
      for (; null !== e; ) {
        var f2 = Cb(e);
        null !== f2 && Ec(f2);
        f2 = Yc(a, b, c, d);
        null === f2 && hd(a, b, d, id$1, c);
        if (f2 === e) break;
        e = f2;
      }
      null !== e && d.stopPropagation();
    } else hd(a, b, d, null, c);
  }
}
var id$1 = null;
function Yc(a, b, c, d) {
  id$1 = null;
  a = xb(d);
  a = Wc(a);
  if (null !== a) if (b = Vb(a), null === b) a = null;
  else if (c = b.tag, 13 === c) {
    a = Wb(b);
    if (null !== a) return a;
    a = null;
  } else if (3 === c) {
    if (b.stateNode.current.memoizedState.isDehydrated) return 3 === b.tag ? b.stateNode.containerInfo : null;
    a = null;
  } else b !== a && (a = null);
  id$1 = a;
  return null;
}
function jd(a) {
  switch (a) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (ec()) {
        case fc:
          return 1;
        case gc:
          return 4;
        case hc:
        case ic:
          return 16;
        case jc:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var kd = null, ld = null, md = null;
function nd() {
  if (md) return md;
  var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f2 = e.length;
  for (a = 0; a < c && b[a] === e[a]; a++) ;
  var g = c - a;
  for (d = 1; d <= g && b[c - d] === e[f2 - d]; d++) ;
  return md = e.slice(a, 1 < d ? 1 - d : void 0);
}
function od(a) {
  var b = a.keyCode;
  "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
  10 === a && (a = 13);
  return 32 <= a || 13 === a ? a : 0;
}
function pd() {
  return true;
}
function qd() {
  return false;
}
function rd(a) {
  function b(b2, d, e, f2, g) {
    this._reactName = b2;
    this._targetInst = e;
    this.type = d;
    this.nativeEvent = f2;
    this.target = g;
    this.currentTarget = null;
    for (var c in a) a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f2) : f2[c]);
    this.isDefaultPrevented = (null != f2.defaultPrevented ? f2.defaultPrevented : false === f2.returnValue) ? pd : qd;
    this.isPropagationStopped = qd;
    return this;
  }
  A(b.prototype, { preventDefault: function() {
    this.defaultPrevented = true;
    var a2 = this.nativeEvent;
    a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
  }, stopPropagation: function() {
    var a2 = this.nativeEvent;
    a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
  }, persist: function() {
  }, isPersistent: pd });
  return b;
}
var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
  return a.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
  return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
}, movementX: function(a) {
  if ("movementX" in a) return a.movementX;
  a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
  return wd;
}, movementY: function(a) {
  return "movementY" in a ? a.movementY : xd;
} }), Bd = rd(Ad), Cd = A({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A({}, sd, { clipboardData: function(a) {
  return "clipboardData" in a ? a.clipboardData : window.clipboardData;
} }), Jd = rd(Id), Kd = A({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, Nd = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Pd(a) {
  var b = this.nativeEvent;
  return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
}
function zd() {
  return Pd;
}
var Qd = A({}, ud, { key: function(a) {
  if (a.key) {
    var b = Md[a.key] || a.key;
    if ("Unidentified" !== b) return b;
  }
  return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
  return "keypress" === a.type ? od(a) : 0;
}, keyCode: function(a) {
  return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
}, which: function(a) {
  return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
} }), Rd = rd(Qd), Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A({}, Ad, {
  deltaX: function(a) {
    return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
  },
  deltaY: function(a) {
    return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be = null;
ia && "documentMode" in document && (be = document.documentMode);
var ce = ia && "TextEvent" in window && !be, de = ia && (!ae || be && 8 < be && 11 >= be), ee = String.fromCharCode(32), fe = false;
function ge(a, b) {
  switch (a) {
    case "keyup":
      return -1 !== $d.indexOf(b.keyCode);
    case "keydown":
      return 229 !== b.keyCode;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
function he(a) {
  a = a.detail;
  return "object" === typeof a && "data" in a ? a.data : null;
}
var ie = false;
function je(a, b) {
  switch (a) {
    case "compositionend":
      return he(b);
    case "keypress":
      if (32 !== b.which) return null;
      fe = true;
      return ee;
    case "textInput":
      return a = b.data, a === ee && fe ? null : a;
    default:
      return null;
  }
}
function ke(a, b) {
  if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
  switch (a) {
    case "paste":
      return null;
    case "keypress":
      if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
        if (b.char && 1 < b.char.length) return b.char;
        if (b.which) return String.fromCharCode(b.which);
      }
      return null;
    case "compositionend":
      return de && "ko" !== b.locale ? null : b.data;
    default:
      return null;
  }
}
var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
function me(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return "input" === b ? !!le[a.type] : "textarea" === b ? true : false;
}
function ne(a, b, c, d) {
  Eb(d);
  b = oe(b, "onChange");
  0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
}
var pe = null, qe = null;
function re(a) {
  se(a, 0);
}
function te(a) {
  var b = ue(a);
  if (Wa(b)) return a;
}
function ve(a, b) {
  if ("change" === a) return b;
}
var we = false;
if (ia) {
  var xe;
  if (ia) {
    var ye = "oninput" in document;
    if (!ye) {
      var ze = document.createElement("div");
      ze.setAttribute("oninput", "return;");
      ye = "function" === typeof ze.oninput;
    }
    xe = ye;
  } else xe = false;
  we = xe && (!document.documentMode || 9 < document.documentMode);
}
function Ae() {
  pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
}
function Be(a) {
  if ("value" === a.propertyName && te(qe)) {
    var b = [];
    ne(b, qe, a, xb(a));
    Jb(re, b);
  }
}
function Ce(a, b, c) {
  "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
}
function De(a) {
  if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
}
function Ee(a, b) {
  if ("click" === a) return te(b);
}
function Fe(a, b) {
  if ("input" === a || "change" === a) return te(b);
}
function Ge(a, b) {
  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
}
var He = "function" === typeof Object.is ? Object.is : Ge;
function Ie(a, b) {
  if (He(a, b)) return true;
  if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
  var c = Object.keys(a), d = Object.keys(b);
  if (c.length !== d.length) return false;
  for (d = 0; d < c.length; d++) {
    var e = c[d];
    if (!ja.call(b, e) || !He(a[e], b[e])) return false;
  }
  return true;
}
function Je(a) {
  for (; a && a.firstChild; ) a = a.firstChild;
  return a;
}
function Ke(a, b) {
  var c = Je(a);
  a = 0;
  for (var d; c; ) {
    if (3 === c.nodeType) {
      d = a + c.textContent.length;
      if (a <= b && d >= b) return { node: c, offset: b - a };
      a = d;
    }
    a: {
      for (; c; ) {
        if (c.nextSibling) {
          c = c.nextSibling;
          break a;
        }
        c = c.parentNode;
      }
      c = void 0;
    }
    c = Je(c);
  }
}
function Le(a, b) {
  return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
}
function Me() {
  for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
    try {
      var c = "string" === typeof b.contentWindow.location.href;
    } catch (d) {
      c = false;
    }
    if (c) a = b.contentWindow;
    else break;
    b = Xa(a.document);
  }
  return b;
}
function Ne(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
}
function Oe(a) {
  var b = Me(), c = a.focusedElem, d = a.selectionRange;
  if (b !== c && c && c.ownerDocument && Le(c.ownerDocument.documentElement, c)) {
    if (null !== d && Ne(c)) {
      if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c) c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
      else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
        a = a.getSelection();
        var e = c.textContent.length, f2 = Math.min(d.start, e);
        d = void 0 === d.end ? f2 : Math.min(d.end, e);
        !a.extend && f2 > d && (e = d, d = f2, f2 = e);
        e = Ke(c, f2);
        var g = Ke(
          c,
          d
        );
        e && g && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f2 > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
      }
    }
    b = [];
    for (a = c; a = a.parentNode; ) 1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
    "function" === typeof c.focus && c.focus();
    for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
  }
}
var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = false;
function Ue(a, b, c) {
  var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
  Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe)));
}
function Ve(a, b) {
  var c = {};
  c[a.toLowerCase()] = b.toLowerCase();
  c["Webkit" + a] = "webkit" + b;
  c["Moz" + a] = "moz" + b;
  return c;
}
var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
function Ze(a) {
  if (Xe[a]) return Xe[a];
  if (!We[a]) return a;
  var b = We[a], c;
  for (c in b) if (b.hasOwnProperty(c) && c in Ye) return Xe[a] = b[c];
  return a;
}
var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a, b) {
  df.set(a, b);
  fa(b, [a]);
}
for (var gf = 0; gf < ef.length; gf++) {
  var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
  ff(jf, "on" + kf);
}
ff($e, "onAnimationEnd");
ff(af, "onAnimationIteration");
ff(bf, "onAnimationStart");
ff("dblclick", "onDoubleClick");
ff("focusin", "onFocus");
ff("focusout", "onBlur");
ff(cf, "onTransitionEnd");
ha("onMouseEnter", ["mouseout", "mouseover"]);
ha("onMouseLeave", ["mouseout", "mouseover"]);
ha("onPointerEnter", ["pointerout", "pointerover"]);
ha("onPointerLeave", ["pointerout", "pointerover"]);
fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a, b, c) {
  var d = a.type || "unknown-event";
  a.currentTarget = c;
  Ub(d, b, void 0, a);
  a.currentTarget = null;
}
function se(a, b) {
  b = 0 !== (b & 4);
  for (var c = 0; c < a.length; c++) {
    var d = a[c], e = d.event;
    d = d.listeners;
    a: {
      var f2 = void 0;
      if (b) for (var g = d.length - 1; 0 <= g; g--) {
        var h = d[g], k2 = h.instance, l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
      else for (g = 0; g < d.length; g++) {
        h = d[g];
        k2 = h.instance;
        l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
    }
  }
  if (Qb) throw a = Rb, Qb = false, Rb = null, a;
}
function D(a, b) {
  var c = b[of];
  void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
  var d = a + "__bubble";
  c.has(d) || (pf(b, a, 2, false), c.add(d));
}
function qf(a, b, c) {
  var d = 0;
  b && (d |= 4);
  pf(c, a, d, b);
}
var rf = "_reactListening" + Math.random().toString(36).slice(2);
function sf(a) {
  if (!a[rf]) {
    a[rf] = true;
    da.forEach(function(b2) {
      "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
    });
    var b = 9 === a.nodeType ? a : a.ownerDocument;
    null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
  }
}
function pf(a, b, c, d) {
  switch (jd(b)) {
    case 1:
      var e = ed;
      break;
    case 4:
      e = gd;
      break;
    default:
      e = fd;
  }
  c = e.bind(null, b, c, a);
  e = void 0;
  !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = true);
  d ? void 0 !== e ? a.addEventListener(b, c, { capture: true, passive: e }) : a.addEventListener(b, c, true) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, false);
}
function hd(a, b, c, d, e) {
  var f2 = d;
  if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (; ; ) {
    if (null === d) return;
    var g = d.tag;
    if (3 === g || 4 === g) {
      var h = d.stateNode.containerInfo;
      if (h === e || 8 === h.nodeType && h.parentNode === e) break;
      if (4 === g) for (g = d.return; null !== g; ) {
        var k2 = g.tag;
        if (3 === k2 || 4 === k2) {
          if (k2 = g.stateNode.containerInfo, k2 === e || 8 === k2.nodeType && k2.parentNode === e) return;
        }
        g = g.return;
      }
      for (; null !== h; ) {
        g = Wc(h);
        if (null === g) return;
        k2 = g.tag;
        if (5 === k2 || 6 === k2) {
          d = f2 = g;
          continue a;
        }
        h = h.parentNode;
      }
    }
    d = d.return;
  }
  Jb(function() {
    var d2 = f2, e2 = xb(c), g2 = [];
    a: {
      var h2 = df.get(a);
      if (void 0 !== h2) {
        var k3 = td, n2 = a;
        switch (a) {
          case "keypress":
            if (0 === od(c)) break a;
          case "keydown":
          case "keyup":
            k3 = Rd;
            break;
          case "focusin":
            n2 = "focus";
            k3 = Fd;
            break;
          case "focusout":
            n2 = "blur";
            k3 = Fd;
            break;
          case "beforeblur":
          case "afterblur":
            k3 = Fd;
            break;
          case "click":
            if (2 === c.button) break a;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k3 = Bd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k3 = Dd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k3 = Vd;
            break;
          case $e:
          case af:
          case bf:
            k3 = Hd;
            break;
          case cf:
            k3 = Xd;
            break;
          case "scroll":
            k3 = vd;
            break;
          case "wheel":
            k3 = Zd;
            break;
          case "copy":
          case "cut":
          case "paste":
            k3 = Jd;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k3 = Td;
        }
        var t2 = 0 !== (b & 4), J2 = !t2 && "scroll" === a, x2 = t2 ? null !== h2 ? h2 + "Capture" : null : h2;
        t2 = [];
        for (var w2 = d2, u2; null !== w2; ) {
          u2 = w2;
          var F2 = u2.stateNode;
          5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
          if (J2) break;
          w2 = w2.return;
        }
        0 < t2.length && (h2 = new k3(h2, n2, null, c, e2), g2.push({ event: h2, listeners: t2 }));
      }
    }
    if (0 === (b & 7)) {
      a: {
        h2 = "mouseover" === a || "pointerover" === a;
        k3 = "mouseout" === a || "pointerout" === a;
        if (h2 && c !== wb && (n2 = c.relatedTarget || c.fromElement) && (Wc(n2) || n2[uf])) break a;
        if (k3 || h2) {
          h2 = e2.window === e2 ? e2 : (h2 = e2.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
          if (k3) {
            if (n2 = c.relatedTarget || c.toElement, k3 = d2, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag)) n2 = null;
          } else k3 = null, n2 = d2;
          if (k3 !== n2) {
            t2 = Bd;
            F2 = "onMouseLeave";
            x2 = "onMouseEnter";
            w2 = "mouse";
            if ("pointerout" === a || "pointerover" === a) t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
            J2 = null == k3 ? h2 : ue(k3);
            u2 = null == n2 ? h2 : ue(n2);
            h2 = new t2(F2, w2 + "leave", k3, c, e2);
            h2.target = J2;
            h2.relatedTarget = u2;
            F2 = null;
            Wc(e2) === d2 && (t2 = new t2(x2, w2 + "enter", n2, c, e2), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
            J2 = F2;
            if (k3 && n2) b: {
              t2 = k3;
              x2 = n2;
              w2 = 0;
              for (u2 = t2; u2; u2 = vf(u2)) w2++;
              u2 = 0;
              for (F2 = x2; F2; F2 = vf(F2)) u2++;
              for (; 0 < w2 - u2; ) t2 = vf(t2), w2--;
              for (; 0 < u2 - w2; ) x2 = vf(x2), u2--;
              for (; w2--; ) {
                if (t2 === x2 || null !== x2 && t2 === x2.alternate) break b;
                t2 = vf(t2);
                x2 = vf(x2);
              }
              t2 = null;
            }
            else t2 = null;
            null !== k3 && wf(g2, h2, k3, t2, false);
            null !== n2 && null !== J2 && wf(g2, J2, n2, t2, true);
          }
        }
      }
      a: {
        h2 = d2 ? ue(d2) : window;
        k3 = h2.nodeName && h2.nodeName.toLowerCase();
        if ("select" === k3 || "input" === k3 && "file" === h2.type) var na = ve;
        else if (me(h2)) if (we) na = Fe;
        else {
          na = De;
          var xa = Ce;
        }
        else (k3 = h2.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
        if (na && (na = na(a, d2))) {
          ne(g2, na, c, e2);
          break a;
        }
        xa && xa(a, h2, d2);
        "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
      }
      xa = d2 ? ue(d2) : window;
      switch (a) {
        case "focusin":
          if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d2, Se = null;
          break;
        case "focusout":
          Se = Re = Qe = null;
          break;
        case "mousedown":
          Te = true;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Te = false;
          Ue(g2, c, e2);
          break;
        case "selectionchange":
          if (Pe) break;
        case "keydown":
        case "keyup":
          Ue(g2, c, e2);
      }
      var $a;
      if (ae) b: {
        switch (a) {
          case "compositionstart":
            var ba = "onCompositionStart";
            break b;
          case "compositionend":
            ba = "onCompositionEnd";
            break b;
          case "compositionupdate":
            ba = "onCompositionUpdate";
            break b;
        }
        ba = void 0;
      }
      else ie ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
      ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e2), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
      if ($a = ce ? je(a, c) : ke(a, c)) d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c, e2), g2.push({ event: e2, listeners: d2 }), e2.data = $a);
    }
    se(g2, b);
  });
}
function tf(a, b, c) {
  return { instance: a, listener: b, currentTarget: c };
}
function oe(a, b) {
  for (var c = b + "Capture", d = []; null !== a; ) {
    var e = a, f2 = e.stateNode;
    5 === e.tag && null !== f2 && (e = f2, f2 = Kb(a, c), null != f2 && d.unshift(tf(a, f2, e)), f2 = Kb(a, b), null != f2 && d.push(tf(a, f2, e)));
    a = a.return;
  }
  return d;
}
function vf(a) {
  if (null === a) return null;
  do
    a = a.return;
  while (a && 5 !== a.tag);
  return a ? a : null;
}
function wf(a, b, c, d, e) {
  for (var f2 = b._reactName, g = []; null !== c && c !== d; ) {
    var h = c, k2 = h.alternate, l2 = h.stateNode;
    if (null !== k2 && k2 === d) break;
    5 === h.tag && null !== l2 && (h = l2, e ? (k2 = Kb(c, f2), null != k2 && g.unshift(tf(c, k2, h))) : e || (k2 = Kb(c, f2), null != k2 && g.push(tf(c, k2, h))));
    c = c.return;
  }
  0 !== g.length && a.push({ event: b, listeners: g });
}
var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
function zf(a) {
  return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
}
function Af(a, b, c) {
  b = zf(b);
  if (zf(a) !== b && c) throw Error(p(425));
}
function Bf() {
}
var Cf = null, Df = null;
function Ef(a, b) {
  return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
}
var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
  return Hf.resolve(null).then(a).catch(If);
} : Ff;
function If(a) {
  setTimeout(function() {
    throw a;
  });
}
function Kf(a, b) {
  var c = b, d = 0;
  do {
    var e = c.nextSibling;
    a.removeChild(c);
    if (e && 8 === e.nodeType) if (c = e.data, "/$" === c) {
      if (0 === d) {
        a.removeChild(e);
        bd(b);
        return;
      }
      d--;
    } else "$" !== c && "$?" !== c && "$!" !== c || d++;
    c = e;
  } while (c);
  bd(b);
}
function Lf(a) {
  for (; null != a; a = a.nextSibling) {
    var b = a.nodeType;
    if (1 === b || 3 === b) break;
    if (8 === b) {
      b = a.data;
      if ("$" === b || "$!" === b || "$?" === b) break;
      if ("/$" === b) return null;
    }
  }
  return a;
}
function Mf(a) {
  a = a.previousSibling;
  for (var b = 0; a; ) {
    if (8 === a.nodeType) {
      var c = a.data;
      if ("$" === c || "$!" === c || "$?" === c) {
        if (0 === b) return a;
        b--;
      } else "/$" === c && b++;
    }
    a = a.previousSibling;
  }
  return null;
}
var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
function Wc(a) {
  var b = a[Of];
  if (b) return b;
  for (var c = a.parentNode; c; ) {
    if (b = c[uf] || c[Of]) {
      c = b.alternate;
      if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a; ) {
        if (c = a[Of]) return c;
        a = Mf(a);
      }
      return b;
    }
    a = c;
    c = a.parentNode;
  }
  return null;
}
function Cb(a) {
  a = a[Of] || a[uf];
  return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
}
function ue(a) {
  if (5 === a.tag || 6 === a.tag) return a.stateNode;
  throw Error(p(33));
}
function Db(a) {
  return a[Pf] || null;
}
var Sf = [], Tf = -1;
function Uf(a) {
  return { current: a };
}
function E(a) {
  0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
}
function G(a, b) {
  Tf++;
  Sf[Tf] = a.current;
  a.current = b;
}
var Vf = {}, H = Uf(Vf), Wf = Uf(false), Xf = Vf;
function Yf(a, b) {
  var c = a.type.contextTypes;
  if (!c) return Vf;
  var d = a.stateNode;
  if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
  var e = {}, f2;
  for (f2 in c) e[f2] = b[f2];
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
  return e;
}
function Zf(a) {
  a = a.childContextTypes;
  return null !== a && void 0 !== a;
}
function $f() {
  E(Wf);
  E(H);
}
function ag(a, b, c) {
  if (H.current !== Vf) throw Error(p(168));
  G(H, b);
  G(Wf, c);
}
function bg(a, b, c) {
  var d = a.stateNode;
  b = b.childContextTypes;
  if ("function" !== typeof d.getChildContext) return c;
  d = d.getChildContext();
  for (var e in d) if (!(e in b)) throw Error(p(108, Ra(a) || "Unknown", e));
  return A({}, c, d);
}
function cg(a) {
  a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
  Xf = H.current;
  G(H, a);
  G(Wf, Wf.current);
  return true;
}
function dg(a, b, c) {
  var d = a.stateNode;
  if (!d) throw Error(p(169));
  c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
  G(Wf, c);
}
var eg = null, fg = false, gg = false;
function hg(a) {
  null === eg ? eg = [a] : eg.push(a);
}
function ig(a) {
  fg = true;
  hg(a);
}
function jg() {
  if (!gg && null !== eg) {
    gg = true;
    var a = 0, b = C;
    try {
      var c = eg;
      for (C = 1; a < c.length; a++) {
        var d = c[a];
        do
          d = d(true);
        while (null !== d);
      }
      eg = null;
      fg = false;
    } catch (e) {
      throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
    } finally {
      C = b, gg = false;
    }
  }
  return null;
}
var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
function tg(a, b) {
  kg[lg++] = ng;
  kg[lg++] = mg;
  mg = a;
  ng = b;
}
function ug(a, b, c) {
  og[pg++] = rg;
  og[pg++] = sg;
  og[pg++] = qg;
  qg = a;
  var d = rg;
  a = sg;
  var e = 32 - oc(d) - 1;
  d &= ~(1 << e);
  c += 1;
  var f2 = 32 - oc(b) + e;
  if (30 < f2) {
    var g = e - e % 5;
    f2 = (d & (1 << g) - 1).toString(32);
    d >>= g;
    e -= g;
    rg = 1 << 32 - oc(b) + e | c << e | d;
    sg = f2 + a;
  } else rg = 1 << f2 | c << e | d, sg = a;
}
function vg(a) {
  null !== a.return && (tg(a, 1), ug(a, 1, 0));
}
function wg(a) {
  for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
  for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
}
var xg = null, yg = null, I = false, zg = null;
function Ag(a, b) {
  var c = Bg(5, null, null, 0);
  c.elementType = "DELETED";
  c.stateNode = b;
  c.return = a;
  b = a.deletions;
  null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
}
function Cg(a, b) {
  switch (a.tag) {
    case 5:
      var c = a.type;
      b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
      return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
    case 6:
      return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
    case 13:
      return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
    default:
      return false;
  }
}
function Dg(a) {
  return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
}
function Eg(a) {
  if (I) {
    var b = yg;
    if (b) {
      var c = b;
      if (!Cg(a, b)) {
        if (Dg(a)) throw Error(p(418));
        b = Lf(c.nextSibling);
        var d = xg;
        b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
      }
    } else {
      if (Dg(a)) throw Error(p(418));
      a.flags = a.flags & -4097 | 2;
      I = false;
      xg = a;
    }
  }
}
function Fg(a) {
  for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
  xg = a;
}
function Gg(a) {
  if (a !== xg) return false;
  if (!I) return Fg(a), I = true, false;
  var b;
  (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
  if (b && (b = yg)) {
    if (Dg(a)) throw Hg(), Error(p(418));
    for (; b; ) Ag(a, b), b = Lf(b.nextSibling);
  }
  Fg(a);
  if (13 === a.tag) {
    a = a.memoizedState;
    a = null !== a ? a.dehydrated : null;
    if (!a) throw Error(p(317));
    a: {
      a = a.nextSibling;
      for (b = 0; a; ) {
        if (8 === a.nodeType) {
          var c = a.data;
          if ("/$" === c) {
            if (0 === b) {
              yg = Lf(a.nextSibling);
              break a;
            }
            b--;
          } else "$" !== c && "$!" !== c && "$?" !== c || b++;
        }
        a = a.nextSibling;
      }
      yg = null;
    }
  } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
  return true;
}
function Hg() {
  for (var a = yg; a; ) a = Lf(a.nextSibling);
}
function Ig() {
  yg = xg = null;
  I = false;
}
function Jg(a) {
  null === zg ? zg = [a] : zg.push(a);
}
var Kg = ua.ReactCurrentBatchConfig;
function Lg(a, b, c) {
  a = c.ref;
  if (null !== a && "function" !== typeof a && "object" !== typeof a) {
    if (c._owner) {
      c = c._owner;
      if (c) {
        if (1 !== c.tag) throw Error(p(309));
        var d = c.stateNode;
      }
      if (!d) throw Error(p(147, a));
      var e = d, f2 = "" + a;
      if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f2) return b.ref;
      b = function(a2) {
        var b2 = e.refs;
        null === a2 ? delete b2[f2] : b2[f2] = a2;
      };
      b._stringRef = f2;
      return b;
    }
    if ("string" !== typeof a) throw Error(p(284));
    if (!c._owner) throw Error(p(290, a));
  }
  return a;
}
function Mg(a, b) {
  a = Object.prototype.toString.call(b);
  throw Error(p(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
}
function Ng(a) {
  var b = a._init;
  return b(a._payload);
}
function Og(a) {
  function b(b2, c2) {
    if (a) {
      var d2 = b2.deletions;
      null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
    }
  }
  function c(c2, d2) {
    if (!a) return null;
    for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
    return null;
  }
  function d(a2, b2) {
    for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
    return a2;
  }
  function e(a2, b2) {
    a2 = Pg(a2, b2);
    a2.index = 0;
    a2.sibling = null;
    return a2;
  }
  function f2(b2, c2, d2) {
    b2.index = d2;
    if (!a) return b2.flags |= 1048576, c2;
    d2 = b2.alternate;
    if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
    b2.flags |= 2;
    return c2;
  }
  function g(b2) {
    a && null === b2.alternate && (b2.flags |= 2);
    return b2;
  }
  function h(a2, b2, c2, d2) {
    if (null === b2 || 6 !== b2.tag) return b2 = Qg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function k2(a2, b2, c2, d2) {
    var f3 = c2.type;
    if (f3 === ya) return m2(a2, b2, c2.props.children, d2, c2.key);
    if (null !== b2 && (b2.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && Ng(f3) === b2.type)) return d2 = e(b2, c2.props), d2.ref = Lg(a2, b2, c2), d2.return = a2, d2;
    d2 = Rg(c2.type, c2.key, c2.props, null, a2.mode, d2);
    d2.ref = Lg(a2, b2, c2);
    d2.return = a2;
    return d2;
  }
  function l2(a2, b2, c2, d2) {
    if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = Sg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2.children || []);
    b2.return = a2;
    return b2;
  }
  function m2(a2, b2, c2, d2, f3) {
    if (null === b2 || 7 !== b2.tag) return b2 = Tg(c2, a2.mode, d2, f3), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function q2(a2, b2, c2) {
    if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = Qg("" + b2, a2.mode, c2), b2.return = a2, b2;
    if ("object" === typeof b2 && null !== b2) {
      switch (b2.$$typeof) {
        case va:
          return c2 = Rg(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = Lg(a2, null, b2), c2.return = a2, c2;
        case wa:
          return b2 = Sg(b2, a2.mode, c2), b2.return = a2, b2;
        case Ha:
          var d2 = b2._init;
          return q2(a2, d2(b2._payload), c2);
      }
      if (eb(b2) || Ka(b2)) return b2 = Tg(b2, a2.mode, c2, null), b2.return = a2, b2;
      Mg(a2, b2);
    }
    return null;
  }
  function r2(a2, b2, c2, d2) {
    var e2 = null !== b2 ? b2.key : null;
    if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e2 ? null : h(a2, b2, "" + c2, d2);
    if ("object" === typeof c2 && null !== c2) {
      switch (c2.$$typeof) {
        case va:
          return c2.key === e2 ? k2(a2, b2, c2, d2) : null;
        case wa:
          return c2.key === e2 ? l2(a2, b2, c2, d2) : null;
        case Ha:
          return e2 = c2._init, r2(
            a2,
            b2,
            e2(c2._payload),
            d2
          );
      }
      if (eb(c2) || Ka(c2)) return null !== e2 ? null : m2(a2, b2, c2, d2, null);
      Mg(a2, c2);
    }
    return null;
  }
  function y2(a2, b2, c2, d2, e2) {
    if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
    if ("object" === typeof d2 && null !== d2) {
      switch (d2.$$typeof) {
        case va:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k2(b2, a2, d2, e2);
        case wa:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l2(b2, a2, d2, e2);
        case Ha:
          var f3 = d2._init;
          return y2(a2, b2, c2, f3(d2._payload), e2);
      }
      if (eb(d2) || Ka(d2)) return a2 = a2.get(c2) || null, m2(b2, a2, d2, e2, null);
      Mg(b2, d2);
    }
    return null;
  }
  function n2(e2, g2, h2, k3) {
    for (var l3 = null, m3 = null, u2 = g2, w2 = g2 = 0, x2 = null; null !== u2 && w2 < h2.length; w2++) {
      u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
      var n3 = r2(e2, u2, h2[w2], k3);
      if (null === n3) {
        null === u2 && (u2 = x2);
        break;
      }
      a && u2 && null === n3.alternate && b(e2, u2);
      g2 = f2(n3, g2, w2);
      null === m3 ? l3 = n3 : m3.sibling = n3;
      m3 = n3;
      u2 = x2;
    }
    if (w2 === h2.length) return c(e2, u2), I && tg(e2, w2), l3;
    if (null === u2) {
      for (; w2 < h2.length; w2++) u2 = q2(e2, h2[w2], k3), null !== u2 && (g2 = f2(u2, g2, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
      I && tg(e2, w2);
      return l3;
    }
    for (u2 = d(e2, u2); w2 < h2.length; w2++) x2 = y2(u2, e2, w2, h2[w2], k3), null !== x2 && (a && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g2 = f2(x2, g2, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
    a && u2.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function t2(e2, g2, h2, k3) {
    var l3 = Ka(h2);
    if ("function" !== typeof l3) throw Error(p(150));
    h2 = l3.call(h2);
    if (null == h2) throw Error(p(151));
    for (var u2 = l3 = null, m3 = g2, w2 = g2 = 0, x2 = null, n3 = h2.next(); null !== m3 && !n3.done; w2++, n3 = h2.next()) {
      m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
      var t3 = r2(e2, m3, n3.value, k3);
      if (null === t3) {
        null === m3 && (m3 = x2);
        break;
      }
      a && m3 && null === t3.alternate && b(e2, m3);
      g2 = f2(t3, g2, w2);
      null === u2 ? l3 = t3 : u2.sibling = t3;
      u2 = t3;
      m3 = x2;
    }
    if (n3.done) return c(
      e2,
      m3
    ), I && tg(e2, w2), l3;
    if (null === m3) {
      for (; !n3.done; w2++, n3 = h2.next()) n3 = q2(e2, n3.value, k3), null !== n3 && (g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
      I && tg(e2, w2);
      return l3;
    }
    for (m3 = d(e2, m3); !n3.done; w2++, n3 = h2.next()) n3 = y2(m3, e2, w2, n3.value, k3), null !== n3 && (a && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
    a && m3.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function J2(a2, d2, f3, h2) {
    "object" === typeof f3 && null !== f3 && f3.type === ya && null === f3.key && (f3 = f3.props.children);
    if ("object" === typeof f3 && null !== f3) {
      switch (f3.$$typeof) {
        case va:
          a: {
            for (var k3 = f3.key, l3 = d2; null !== l3; ) {
              if (l3.key === k3) {
                k3 = f3.type;
                if (k3 === ya) {
                  if (7 === l3.tag) {
                    c(a2, l3.sibling);
                    d2 = e(l3, f3.props.children);
                    d2.return = a2;
                    a2 = d2;
                    break a;
                  }
                } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && Ng(k3) === l3.type) {
                  c(a2, l3.sibling);
                  d2 = e(l3, f3.props);
                  d2.ref = Lg(a2, l3, f3);
                  d2.return = a2;
                  a2 = d2;
                  break a;
                }
                c(a2, l3);
                break;
              } else b(a2, l3);
              l3 = l3.sibling;
            }
            f3.type === ya ? (d2 = Tg(f3.props.children, a2.mode, h2, f3.key), d2.return = a2, a2 = d2) : (h2 = Rg(f3.type, f3.key, f3.props, null, a2.mode, h2), h2.ref = Lg(a2, d2, f3), h2.return = a2, a2 = h2);
          }
          return g(a2);
        case wa:
          a: {
            for (l3 = f3.key; null !== d2; ) {
              if (d2.key === l3) if (4 === d2.tag && d2.stateNode.containerInfo === f3.containerInfo && d2.stateNode.implementation === f3.implementation) {
                c(a2, d2.sibling);
                d2 = e(d2, f3.children || []);
                d2.return = a2;
                a2 = d2;
                break a;
              } else {
                c(a2, d2);
                break;
              }
              else b(a2, d2);
              d2 = d2.sibling;
            }
            d2 = Sg(f3, a2.mode, h2);
            d2.return = a2;
            a2 = d2;
          }
          return g(a2);
        case Ha:
          return l3 = f3._init, J2(a2, d2, l3(f3._payload), h2);
      }
      if (eb(f3)) return n2(a2, d2, f3, h2);
      if (Ka(f3)) return t2(a2, d2, f3, h2);
      Mg(a2, f3);
    }
    return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f3), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = Qg(f3, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
  }
  return J2;
}
var Ug = Og(true), Vg = Og(false), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
function $g() {
  Zg = Yg = Xg = null;
}
function ah(a) {
  var b = Wg.current;
  E(Wg);
  a._currentValue = b;
}
function bh(a, b, c) {
  for (; null !== a; ) {
    var d = a.alternate;
    (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
    if (a === c) break;
    a = a.return;
  }
}
function ch(a, b) {
  Xg = a;
  Zg = Yg = null;
  a = a.dependencies;
  null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (dh = true), a.firstContext = null);
}
function eh(a) {
  var b = a._currentValue;
  if (Zg !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Yg) {
    if (null === Xg) throw Error(p(308));
    Yg = a;
    Xg.dependencies = { lanes: 0, firstContext: a };
  } else Yg = Yg.next = a;
  return b;
}
var fh = null;
function gh(a) {
  null === fh ? fh = [a] : fh.push(a);
}
function hh(a, b, c, d) {
  var e = b.interleaved;
  null === e ? (c.next = c, gh(b)) : (c.next = e.next, e.next = c);
  b.interleaved = c;
  return ih(a, d);
}
function ih(a, b) {
  a.lanes |= b;
  var c = a.alternate;
  null !== c && (c.lanes |= b);
  c = a;
  for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
  return 3 === c.tag ? c.stateNode : null;
}
var jh = false;
function kh(a) {
  a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function lh(a, b) {
  a = a.updateQueue;
  b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
}
function mh(a, b) {
  return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
}
function nh(a, b, c) {
  var d = a.updateQueue;
  if (null === d) return null;
  d = d.shared;
  if (0 !== (K & 2)) {
    var e = d.pending;
    null === e ? b.next = b : (b.next = e.next, e.next = b);
    d.pending = b;
    return ih(a, c);
  }
  e = d.interleaved;
  null === e ? (b.next = b, gh(d)) : (b.next = e.next, e.next = b);
  d.interleaved = b;
  return ih(a, c);
}
function oh(a, b, c) {
  b = b.updateQueue;
  if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
function ph(a, b) {
  var c = a.updateQueue, d = a.alternate;
  if (null !== d && (d = d.updateQueue, c === d)) {
    var e = null, f2 = null;
    c = c.firstBaseUpdate;
    if (null !== c) {
      do {
        var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
        null === f2 ? e = f2 = g : f2 = f2.next = g;
        c = c.next;
      } while (null !== c);
      null === f2 ? e = f2 = b : f2 = f2.next = b;
    } else e = f2 = b;
    c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f2, shared: d.shared, effects: d.effects };
    a.updateQueue = c;
    return;
  }
  a = c.lastBaseUpdate;
  null === a ? c.firstBaseUpdate = b : a.next = b;
  c.lastBaseUpdate = b;
}
function qh(a, b, c, d) {
  var e = a.updateQueue;
  jh = false;
  var f2 = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
  if (null !== h) {
    e.shared.pending = null;
    var k2 = h, l2 = k2.next;
    k2.next = null;
    null === g ? f2 = l2 : g.next = l2;
    g = k2;
    var m2 = a.alternate;
    null !== m2 && (m2 = m2.updateQueue, h = m2.lastBaseUpdate, h !== g && (null === h ? m2.firstBaseUpdate = l2 : h.next = l2, m2.lastBaseUpdate = k2));
  }
  if (null !== f2) {
    var q2 = e.baseState;
    g = 0;
    m2 = l2 = k2 = null;
    h = f2;
    do {
      var r2 = h.lane, y2 = h.eventTime;
      if ((d & r2) === r2) {
        null !== m2 && (m2 = m2.next = {
          eventTime: y2,
          lane: 0,
          tag: h.tag,
          payload: h.payload,
          callback: h.callback,
          next: null
        });
        a: {
          var n2 = a, t2 = h;
          r2 = b;
          y2 = c;
          switch (t2.tag) {
            case 1:
              n2 = t2.payload;
              if ("function" === typeof n2) {
                q2 = n2.call(y2, q2, r2);
                break a;
              }
              q2 = n2;
              break a;
            case 3:
              n2.flags = n2.flags & -65537 | 128;
            case 0:
              n2 = t2.payload;
              r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
              if (null === r2 || void 0 === r2) break a;
              q2 = A({}, q2, r2);
              break a;
            case 2:
              jh = true;
          }
        }
        null !== h.callback && 0 !== h.lane && (a.flags |= 64, r2 = e.effects, null === r2 ? e.effects = [h] : r2.push(h));
      } else y2 = { eventTime: y2, lane: r2, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g |= r2;
      h = h.next;
      if (null === h) if (h = e.shared.pending, null === h) break;
      else r2 = h, h = r2.next, r2.next = null, e.lastBaseUpdate = r2, e.shared.pending = null;
    } while (1);
    null === m2 && (k2 = q2);
    e.baseState = k2;
    e.firstBaseUpdate = l2;
    e.lastBaseUpdate = m2;
    b = e.shared.interleaved;
    if (null !== b) {
      e = b;
      do
        g |= e.lane, e = e.next;
      while (e !== b);
    } else null === f2 && (e.shared.lanes = 0);
    rh |= g;
    a.lanes = g;
    a.memoizedState = q2;
  }
}
function sh(a, b, c) {
  a = b.effects;
  b.effects = null;
  if (null !== a) for (b = 0; b < a.length; b++) {
    var d = a[b], e = d.callback;
    if (null !== e) {
      d.callback = null;
      d = c;
      if ("function" !== typeof e) throw Error(p(191, e));
      e.call(d);
    }
  }
}
var th = {}, uh = Uf(th), vh = Uf(th), wh = Uf(th);
function xh(a) {
  if (a === th) throw Error(p(174));
  return a;
}
function yh(a, b) {
  G(wh, b);
  G(vh, a);
  G(uh, th);
  a = b.nodeType;
  switch (a) {
    case 9:
    case 11:
      b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
      break;
    default:
      a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
  }
  E(uh);
  G(uh, b);
}
function zh() {
  E(uh);
  E(vh);
  E(wh);
}
function Ah(a) {
  xh(wh.current);
  var b = xh(uh.current);
  var c = lb(b, a.type);
  b !== c && (G(vh, a), G(uh, c));
}
function Bh(a) {
  vh.current === a && (E(uh), E(vh));
}
var L = Uf(0);
function Ch(a) {
  for (var b = a; null !== b; ) {
    if (13 === b.tag) {
      var c = b.memoizedState;
      if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
    } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
      if (0 !== (b.flags & 128)) return b;
    } else if (null !== b.child) {
      b.child.return = b;
      b = b.child;
      continue;
    }
    if (b === a) break;
    for (; null === b.sibling; ) {
      if (null === b.return || b.return === a) return null;
      b = b.return;
    }
    b.sibling.return = b.return;
    b = b.sibling;
  }
  return null;
}
var Dh = [];
function Eh() {
  for (var a = 0; a < Dh.length; a++) Dh[a]._workInProgressVersionPrimary = null;
  Dh.length = 0;
}
var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M = null, N = null, O = null, Ih = false, Jh = false, Kh = 0, Lh = 0;
function P() {
  throw Error(p(321));
}
function Mh(a, b) {
  if (null === b) return false;
  for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return false;
  return true;
}
function Nh(a, b, c, d, e, f2) {
  Hh = f2;
  M = b;
  b.memoizedState = null;
  b.updateQueue = null;
  b.lanes = 0;
  Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
  a = c(d, e);
  if (Jh) {
    f2 = 0;
    do {
      Jh = false;
      Kh = 0;
      if (25 <= f2) throw Error(p(301));
      f2 += 1;
      O = N = null;
      b.updateQueue = null;
      Fh.current = Qh;
      a = c(d, e);
    } while (Jh);
  }
  Fh.current = Rh;
  b = null !== N && null !== N.next;
  Hh = 0;
  O = N = M = null;
  Ih = false;
  if (b) throw Error(p(300));
  return a;
}
function Sh() {
  var a = 0 !== Kh;
  Kh = 0;
  return a;
}
function Th() {
  var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  null === O ? M.memoizedState = O = a : O = O.next = a;
  return O;
}
function Uh() {
  if (null === N) {
    var a = M.alternate;
    a = null !== a ? a.memoizedState : null;
  } else a = N.next;
  var b = null === O ? M.memoizedState : O.next;
  if (null !== b) O = b, N = a;
  else {
    if (null === a) throw Error(p(310));
    N = a;
    a = { memoizedState: N.memoizedState, baseState: N.baseState, baseQueue: N.baseQueue, queue: N.queue, next: null };
    null === O ? M.memoizedState = O = a : O = O.next = a;
  }
  return O;
}
function Vh(a, b) {
  return "function" === typeof b ? b(a) : b;
}
function Wh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = N, e = d.baseQueue, f2 = c.pending;
  if (null !== f2) {
    if (null !== e) {
      var g = e.next;
      e.next = f2.next;
      f2.next = g;
    }
    d.baseQueue = e = f2;
    c.pending = null;
  }
  if (null !== e) {
    f2 = e.next;
    d = d.baseState;
    var h = g = null, k2 = null, l2 = f2;
    do {
      var m2 = l2.lane;
      if ((Hh & m2) === m2) null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d = l2.hasEagerState ? l2.eagerState : a(d, l2.action);
      else {
        var q2 = {
          lane: m2,
          action: l2.action,
          hasEagerState: l2.hasEagerState,
          eagerState: l2.eagerState,
          next: null
        };
        null === k2 ? (h = k2 = q2, g = d) : k2 = k2.next = q2;
        M.lanes |= m2;
        rh |= m2;
      }
      l2 = l2.next;
    } while (null !== l2 && l2 !== f2);
    null === k2 ? g = d : k2.next = h;
    He(d, b.memoizedState) || (dh = true);
    b.memoizedState = d;
    b.baseState = g;
    b.baseQueue = k2;
    c.lastRenderedState = d;
  }
  a = c.interleaved;
  if (null !== a) {
    e = a;
    do
      f2 = e.lane, M.lanes |= f2, rh |= f2, e = e.next;
    while (e !== a);
  } else null === e && (c.lanes = 0);
  return [b.memoizedState, c.dispatch];
}
function Xh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = c.dispatch, e = c.pending, f2 = b.memoizedState;
  if (null !== e) {
    c.pending = null;
    var g = e = e.next;
    do
      f2 = a(f2, g.action), g = g.next;
    while (g !== e);
    He(f2, b.memoizedState) || (dh = true);
    b.memoizedState = f2;
    null === b.baseQueue && (b.baseState = f2);
    c.lastRenderedState = f2;
  }
  return [f2, d];
}
function Yh() {
}
function Zh(a, b) {
  var c = M, d = Uh(), e = b(), f2 = !He(d.memoizedState, e);
  f2 && (d.memoizedState = e, dh = true);
  d = d.queue;
  $h(ai.bind(null, c, d, a), [a]);
  if (d.getSnapshot !== b || f2 || null !== O && O.memoizedState.tag & 1) {
    c.flags |= 2048;
    bi(9, ci.bind(null, c, d, e, b), void 0, null);
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(c, b, e);
  }
  return e;
}
function di(a, b, c) {
  a.flags |= 16384;
  a = { getSnapshot: b, value: c };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
}
function ci(a, b, c, d) {
  b.value = c;
  b.getSnapshot = d;
  ei(b) && fi(a);
}
function ai(a, b, c) {
  return c(function() {
    ei(b) && fi(a);
  });
}
function ei(a) {
  var b = a.getSnapshot;
  a = a.value;
  try {
    var c = b();
    return !He(a, c);
  } catch (d) {
    return true;
  }
}
function fi(a) {
  var b = ih(a, 1);
  null !== b && gi(b, a, 1, -1);
}
function hi(a) {
  var b = Th();
  "function" === typeof a && (a = a());
  b.memoizedState = b.baseState = a;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a };
  b.queue = a;
  a = a.dispatch = ii.bind(null, M, a);
  return [b.memoizedState, a];
}
function bi(a, b, c, d) {
  a = { tag: a, create: b, destroy: c, deps: d, next: null };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
  return a;
}
function ji() {
  return Uh().memoizedState;
}
function ki(a, b, c, d) {
  var e = Th();
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, void 0, void 0 === d ? null : d);
}
function li(a, b, c, d) {
  var e = Uh();
  d = void 0 === d ? null : d;
  var f2 = void 0;
  if (null !== N) {
    var g = N.memoizedState;
    f2 = g.destroy;
    if (null !== d && Mh(d, g.deps)) {
      e.memoizedState = bi(b, c, f2, d);
      return;
    }
  }
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, f2, d);
}
function mi(a, b) {
  return ki(8390656, 8, a, b);
}
function $h(a, b) {
  return li(2048, 8, a, b);
}
function ni(a, b) {
  return li(4, 2, a, b);
}
function oi(a, b) {
  return li(4, 4, a, b);
}
function pi(a, b) {
  if ("function" === typeof b) return a = a(), b(a), function() {
    b(null);
  };
  if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
    b.current = null;
  };
}
function qi(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return li(4, 4, pi.bind(null, b, a), c);
}
function ri() {
}
function si(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  c.memoizedState = [a, b];
  return a;
}
function ti(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  a = a();
  c.memoizedState = [a, b];
  return a;
}
function ui(a, b, c) {
  if (0 === (Hh & 21)) return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c;
  He(c, b) || (c = yc(), M.lanes |= c, rh |= c, a.baseState = true);
  return b;
}
function vi(a, b) {
  var c = C;
  C = 0 !== c && 4 > c ? c : 4;
  a(true);
  var d = Gh.transition;
  Gh.transition = {};
  try {
    a(false), b();
  } finally {
    C = c, Gh.transition = d;
  }
}
function wi() {
  return Uh().memoizedState;
}
function xi(a, b, c) {
  var d = yi(a);
  c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, c);
  else if (c = hh(a, b, c, d), null !== c) {
    var e = R();
    gi(c, a, d, e);
    Bi(c, b, d);
  }
}
function ii(a, b, c) {
  var d = yi(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, e);
  else {
    var f2 = a.alternate;
    if (0 === a.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b.lastRenderedReducer, null !== f2)) try {
      var g = b.lastRenderedState, h = f2(g, c);
      e.hasEagerState = true;
      e.eagerState = h;
      if (He(h, g)) {
        var k2 = b.interleaved;
        null === k2 ? (e.next = e, gh(b)) : (e.next = k2.next, k2.next = e);
        b.interleaved = e;
        return;
      }
    } catch (l2) {
    } finally {
    }
    c = hh(a, b, e, d);
    null !== c && (e = R(), gi(c, a, d, e), Bi(c, b, d));
  }
}
function zi(a) {
  var b = a.alternate;
  return a === M || null !== b && b === M;
}
function Ai(a, b) {
  Jh = Ih = true;
  var c = a.pending;
  null === c ? b.next = b : (b.next = c.next, c.next = b);
  a.pending = b;
}
function Bi(a, b, c) {
  if (0 !== (c & 4194240)) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false }, Oh = { readContext: eh, useCallback: function(a, b) {
  Th().memoizedState = [a, void 0 === b ? null : b];
  return a;
}, useContext: eh, useEffect: mi, useImperativeHandle: function(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return ki(
    4194308,
    4,
    pi.bind(null, b, a),
    c
  );
}, useLayoutEffect: function(a, b) {
  return ki(4194308, 4, a, b);
}, useInsertionEffect: function(a, b) {
  return ki(4, 2, a, b);
}, useMemo: function(a, b) {
  var c = Th();
  b = void 0 === b ? null : b;
  a = a();
  c.memoizedState = [a, b];
  return a;
}, useReducer: function(a, b, c) {
  var d = Th();
  b = void 0 !== c ? c(b) : b;
  d.memoizedState = d.baseState = b;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
  d.queue = a;
  a = a.dispatch = xi.bind(null, M, a);
  return [d.memoizedState, a];
}, useRef: function(a) {
  var b = Th();
  a = { current: a };
  return b.memoizedState = a;
}, useState: hi, useDebugValue: ri, useDeferredValue: function(a) {
  return Th().memoizedState = a;
}, useTransition: function() {
  var a = hi(false), b = a[0];
  a = vi.bind(null, a[1]);
  Th().memoizedState = a;
  return [b, a];
}, useMutableSource: function() {
}, useSyncExternalStore: function(a, b, c) {
  var d = M, e = Th();
  if (I) {
    if (void 0 === c) throw Error(p(407));
    c = c();
  } else {
    c = b();
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(d, b, c);
  }
  e.memoizedState = c;
  var f2 = { value: c, getSnapshot: b };
  e.queue = f2;
  mi(ai.bind(
    null,
    d,
    f2,
    a
  ), [a]);
  d.flags |= 2048;
  bi(9, ci.bind(null, d, f2, c, b), void 0, null);
  return c;
}, useId: function() {
  var a = Th(), b = Q.identifierPrefix;
  if (I) {
    var c = sg;
    var d = rg;
    c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
    b = ":" + b + "R" + c;
    c = Kh++;
    0 < c && (b += "H" + c.toString(32));
    b += ":";
  } else c = Lh++, b = ":" + b + "r" + c.toString(32) + ":";
  return a.memoizedState = b;
}, unstable_isNewReconciler: false }, Ph = {
  readContext: eh,
  useCallback: si,
  useContext: eh,
  useEffect: $h,
  useImperativeHandle: qi,
  useInsertionEffect: ni,
  useLayoutEffect: oi,
  useMemo: ti,
  useReducer: Wh,
  useRef: ji,
  useState: function() {
    return Wh(Vh);
  },
  useDebugValue: ri,
  useDeferredValue: function(a) {
    var b = Uh();
    return ui(b, N.memoizedState, a);
  },
  useTransition: function() {
    var a = Wh(Vh)[0], b = Uh().memoizedState;
    return [a, b];
  },
  useMutableSource: Yh,
  useSyncExternalStore: Zh,
  useId: wi,
  unstable_isNewReconciler: false
}, Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
  return Xh(Vh);
}, useDebugValue: ri, useDeferredValue: function(a) {
  var b = Uh();
  return null === N ? b.memoizedState = a : ui(b, N.memoizedState, a);
}, useTransition: function() {
  var a = Xh(Vh)[0], b = Uh().memoizedState;
  return [a, b];
}, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
function Ci(a, b) {
  if (a && a.defaultProps) {
    b = A({}, b);
    a = a.defaultProps;
    for (var c in a) void 0 === b[c] && (b[c] = a[c]);
    return b;
  }
  return b;
}
function Di(a, b, c, d) {
  b = a.memoizedState;
  c = c(d, b);
  c = null === c || void 0 === c ? b : A({}, b, c);
  a.memoizedState = c;
  0 === a.lanes && (a.updateQueue.baseState = c);
}
var Ei = { isMounted: function(a) {
  return (a = a._reactInternals) ? Vb(a) === a : false;
}, enqueueSetState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueReplaceState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.tag = 1;
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueForceUpdate: function(a, b) {
  a = a._reactInternals;
  var c = R(), d = yi(a), e = mh(c, d);
  e.tag = 2;
  void 0 !== b && null !== b && (e.callback = b);
  b = nh(a, e, d);
  null !== b && (gi(b, a, d, c), oh(b, a, d));
} };
function Fi(a, b, c, d, e, f2, g) {
  a = a.stateNode;
  return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f2, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e, f2) : true;
}
function Gi(a, b, c) {
  var d = false, e = Vf;
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? f2 = eh(f2) : (e = Zf(b) ? Xf : H.current, d = b.contextTypes, f2 = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
  b = new b(c, f2);
  a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
  b.updater = Ei;
  a.stateNode = b;
  b._reactInternals = a;
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f2);
  return b;
}
function Hi(a, b, c, d) {
  a = b.state;
  "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
  "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
  b.state !== a && Ei.enqueueReplaceState(b, b.state, null);
}
function Ii(a, b, c, d) {
  var e = a.stateNode;
  e.props = c;
  e.state = a.memoizedState;
  e.refs = {};
  kh(a);
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? e.context = eh(f2) : (f2 = Zf(b) ? Xf : H.current, e.context = Yf(a, f2));
  e.state = a.memoizedState;
  f2 = b.getDerivedStateFromProps;
  "function" === typeof f2 && (Di(a, b, f2, c), e.state = a.memoizedState);
  "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && Ei.enqueueReplaceState(e, e.state, null), qh(a, c, e, d), e.state = a.memoizedState);
  "function" === typeof e.componentDidMount && (a.flags |= 4194308);
}
function Ji(a, b) {
  try {
    var c = "", d = b;
    do
      c += Pa(d), d = d.return;
    while (d);
    var e = c;
  } catch (f2) {
    e = "\nError generating stack: " + f2.message + "\n" + f2.stack;
  }
  return { value: a, source: b, stack: e, digest: null };
}
function Ki(a, b, c) {
  return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
}
function Li(a, b) {
  try {
    console.error(b.value);
  } catch (c) {
    setTimeout(function() {
      throw c;
    });
  }
}
var Mi = "function" === typeof WeakMap ? WeakMap : Map;
function Ni(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  c.payload = { element: null };
  var d = b.value;
  c.callback = function() {
    Oi || (Oi = true, Pi = d);
    Li(a, b);
  };
  return c;
}
function Qi(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  var d = a.type.getDerivedStateFromError;
  if ("function" === typeof d) {
    var e = b.value;
    c.payload = function() {
      return d(e);
    };
    c.callback = function() {
      Li(a, b);
    };
  }
  var f2 = a.stateNode;
  null !== f2 && "function" === typeof f2.componentDidCatch && (c.callback = function() {
    Li(a, b);
    "function" !== typeof d && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
    var c2 = b.stack;
    this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
  });
  return c;
}
function Si(a, b, c) {
  var d = a.pingCache;
  if (null === d) {
    d = a.pingCache = new Mi();
    var e = /* @__PURE__ */ new Set();
    d.set(b, e);
  } else e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
  e.has(c) || (e.add(c), a = Ti.bind(null, a, b, c), b.then(a, a));
}
function Ui(a) {
  do {
    var b;
    if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
    if (b) return a;
    a = a.return;
  } while (null !== a);
  return null;
}
function Vi(a, b, c, d, e) {
  if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = mh(-1, 1), b.tag = 2, nh(c, b, 1))), c.lanes |= 1), a;
  a.flags |= 65536;
  a.lanes = e;
  return a;
}
var Wi = ua.ReactCurrentOwner, dh = false;
function Xi(a, b, c, d) {
  b.child = null === a ? Vg(b, null, c, d) : Ug(b, a.child, c, d);
}
function Yi(a, b, c, d, e) {
  c = c.render;
  var f2 = b.ref;
  ch(b, e);
  d = Nh(a, b, c, d, f2, e);
  c = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && c && vg(b);
  b.flags |= 1;
  Xi(a, b, d, e);
  return b.child;
}
function $i(a, b, c, d, e) {
  if (null === a) {
    var f2 = c.type;
    if ("function" === typeof f2 && !aj(f2) && void 0 === f2.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f2, bj(a, b, f2, d, e);
    a = Rg(c.type, null, d, b, b.mode, e);
    a.ref = b.ref;
    a.return = b;
    return b.child = a;
  }
  f2 = a.child;
  if (0 === (a.lanes & e)) {
    var g = f2.memoizedProps;
    c = c.compare;
    c = null !== c ? c : Ie;
    if (c(g, d) && a.ref === b.ref) return Zi(a, b, e);
  }
  b.flags |= 1;
  a = Pg(f2, d);
  a.ref = b.ref;
  a.return = b;
  return b.child = a;
}
function bj(a, b, c, d, e) {
  if (null !== a) {
    var f2 = a.memoizedProps;
    if (Ie(f2, d) && a.ref === b.ref) if (dh = false, b.pendingProps = d = f2, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (dh = true);
    else return b.lanes = a.lanes, Zi(a, b, e);
  }
  return cj(a, b, c, d, e);
}
function dj(a, b, c) {
  var d = b.pendingProps, e = d.children, f2 = null !== a ? a.memoizedState : null;
  if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c;
  else {
    if (0 === (c & 1073741824)) return a = null !== f2 ? f2.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(ej, fj), fj |= a, null;
    b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
    d = null !== f2 ? f2.baseLanes : c;
    G(ej, fj);
    fj |= d;
  }
  else null !== f2 ? (d = f2.baseLanes | c, b.memoizedState = null) : d = c, G(ej, fj), fj |= d;
  Xi(a, b, e, c);
  return b.child;
}
function gj(a, b) {
  var c = b.ref;
  if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
}
function cj(a, b, c, d, e) {
  var f2 = Zf(c) ? Xf : H.current;
  f2 = Yf(b, f2);
  ch(b, e);
  c = Nh(a, b, c, d, f2, e);
  d = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && d && vg(b);
  b.flags |= 1;
  Xi(a, b, c, e);
  return b.child;
}
function hj(a, b, c, d, e) {
  if (Zf(c)) {
    var f2 = true;
    cg(b);
  } else f2 = false;
  ch(b, e);
  if (null === b.stateNode) ij(a, b), Gi(b, c, d), Ii(b, c, d, e), d = true;
  else if (null === a) {
    var g = b.stateNode, h = b.memoizedProps;
    g.props = h;
    var k2 = g.context, l2 = c.contextType;
    "object" === typeof l2 && null !== l2 ? l2 = eh(l2) : (l2 = Zf(c) ? Xf : H.current, l2 = Yf(b, l2));
    var m2 = c.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g.getSnapshotBeforeUpdate;
    q2 || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k2 !== l2) && Hi(b, g, d, l2);
    jh = false;
    var r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    k2 = b.memoizedState;
    h !== d || r2 !== k2 || Wf.current || jh ? ("function" === typeof m2 && (Di(b, c, m2, d), k2 = b.memoizedState), (h = jh || Fi(b, c, h, d, r2, k2, l2)) ? (q2 || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k2), g.props = d, g.state = k2, g.context = l2, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
  } else {
    g = b.stateNode;
    lh(a, b);
    h = b.memoizedProps;
    l2 = b.type === b.elementType ? h : Ci(b.type, h);
    g.props = l2;
    q2 = b.pendingProps;
    r2 = g.context;
    k2 = c.contextType;
    "object" === typeof k2 && null !== k2 ? k2 = eh(k2) : (k2 = Zf(c) ? Xf : H.current, k2 = Yf(b, k2));
    var y2 = c.getDerivedStateFromProps;
    (m2 = "function" === typeof y2 || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q2 || r2 !== k2) && Hi(b, g, d, k2);
    jh = false;
    r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    var n2 = b.memoizedState;
    h !== q2 || r2 !== n2 || Wf.current || jh ? ("function" === typeof y2 && (Di(b, c, y2, d), n2 = b.memoizedState), (l2 = jh || Fi(b, c, l2, d, r2, n2, k2) || false) ? (m2 || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n2, k2), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n2, k2)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n2), g.props = d, g.state = n2, g.context = k2, d = l2) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), d = false);
  }
  return jj(a, b, c, d, f2, e);
}
function jj(a, b, c, d, e, f2) {
  gj(a, b);
  var g = 0 !== (b.flags & 128);
  if (!d && !g) return e && dg(b, c, false), Zi(a, b, f2);
  d = b.stateNode;
  Wi.current = b;
  var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
  b.flags |= 1;
  null !== a && g ? (b.child = Ug(b, a.child, null, f2), b.child = Ug(b, null, h, f2)) : Xi(a, b, h, f2);
  b.memoizedState = d.state;
  e && dg(b, c, true);
  return b.child;
}
function kj(a) {
  var b = a.stateNode;
  b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
  yh(a, b.containerInfo);
}
function lj(a, b, c, d, e) {
  Ig();
  Jg(e);
  b.flags |= 256;
  Xi(a, b, c, d);
  return b.child;
}
var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
function nj(a) {
  return { baseLanes: a, cachePool: null, transitions: null };
}
function oj(a, b, c) {
  var d = b.pendingProps, e = L.current, f2 = false, g = 0 !== (b.flags & 128), h;
  (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
  if (h) f2 = true, b.flags &= -129;
  else if (null === a || null !== a.memoizedState) e |= 1;
  G(L, e & 1);
  if (null === a) {
    Eg(b);
    a = b.memoizedState;
    if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
    g = d.children;
    a = d.fallback;
    return f2 ? (d = b.mode, f2 = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g) : f2 = pj(g, d, 0, null), a = Tg(a, d, c, null), f2.return = b, a.return = b, f2.sibling = a, b.child = f2, b.child.memoizedState = nj(c), b.memoizedState = mj, a) : qj(b, g);
  }
  e = a.memoizedState;
  if (null !== e && (h = e.dehydrated, null !== h)) return rj(a, b, g, d, h, e, c);
  if (f2) {
    f2 = d.fallback;
    g = b.mode;
    e = a.child;
    h = e.sibling;
    var k2 = { mode: "hidden", children: d.children };
    0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k2, b.deletions = null) : (d = Pg(e, k2), d.subtreeFlags = e.subtreeFlags & 14680064);
    null !== h ? f2 = Pg(h, f2) : (f2 = Tg(f2, g, c, null), f2.flags |= 2);
    f2.return = b;
    d.return = b;
    d.sibling = f2;
    b.child = d;
    d = f2;
    f2 = b.child;
    g = a.child.memoizedState;
    g = null === g ? nj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
    f2.memoizedState = g;
    f2.childLanes = a.childLanes & ~c;
    b.memoizedState = mj;
    return d;
  }
  f2 = a.child;
  a = f2.sibling;
  d = Pg(f2, { mode: "visible", children: d.children });
  0 === (b.mode & 1) && (d.lanes = c);
  d.return = b;
  d.sibling = null;
  null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
  b.child = d;
  b.memoizedState = null;
  return d;
}
function qj(a, b) {
  b = pj({ mode: "visible", children: b }, a.mode, 0, null);
  b.return = a;
  return a.child = b;
}
function sj(a, b, c, d) {
  null !== d && Jg(d);
  Ug(b, a.child, null, c);
  a = qj(b, b.pendingProps.children);
  a.flags |= 2;
  b.memoizedState = null;
  return a;
}
function rj(a, b, c, d, e, f2, g) {
  if (c) {
    if (b.flags & 256) return b.flags &= -257, d = Ki(Error(p(422))), sj(a, b, g, d);
    if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
    f2 = d.fallback;
    e = b.mode;
    d = pj({ mode: "visible", children: d.children }, e, 0, null);
    f2 = Tg(f2, e, g, null);
    f2.flags |= 2;
    d.return = b;
    f2.return = b;
    d.sibling = f2;
    b.child = d;
    0 !== (b.mode & 1) && Ug(b, a.child, null, g);
    b.child.memoizedState = nj(g);
    b.memoizedState = mj;
    return f2;
  }
  if (0 === (b.mode & 1)) return sj(a, b, g, null);
  if ("$!" === e.data) {
    d = e.nextSibling && e.nextSibling.dataset;
    if (d) var h = d.dgst;
    d = h;
    f2 = Error(p(419));
    d = Ki(f2, d, void 0);
    return sj(a, b, g, d);
  }
  h = 0 !== (g & a.childLanes);
  if (dh || h) {
    d = Q;
    if (null !== d) {
      switch (g & -g) {
        case 4:
          e = 2;
          break;
        case 16:
          e = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          e = 32;
          break;
        case 536870912:
          e = 268435456;
          break;
        default:
          e = 0;
      }
      e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
      0 !== e && e !== f2.retryLane && (f2.retryLane = e, ih(a, e), gi(d, a, e, -1));
    }
    tj();
    d = Ki(Error(p(421)));
    return sj(a, b, g, d);
  }
  if ("$?" === e.data) return b.flags |= 128, b.child = a.child, b = uj.bind(null, a), e._reactRetry = b, null;
  a = f2.treeContext;
  yg = Lf(e.nextSibling);
  xg = b;
  I = true;
  zg = null;
  null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
  b = qj(b, d.children);
  b.flags |= 4096;
  return b;
}
function vj(a, b, c) {
  a.lanes |= b;
  var d = a.alternate;
  null !== d && (d.lanes |= b);
  bh(a.return, b, c);
}
function wj(a, b, c, d, e) {
  var f2 = a.memoizedState;
  null === f2 ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f2.isBackwards = b, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d, f2.tail = c, f2.tailMode = e);
}
function xj(a, b, c) {
  var d = b.pendingProps, e = d.revealOrder, f2 = d.tail;
  Xi(a, b, d.children, c);
  d = L.current;
  if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
  else {
    if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
      if (13 === a.tag) null !== a.memoizedState && vj(a, c, b);
      else if (19 === a.tag) vj(a, c, b);
      else if (null !== a.child) {
        a.child.return = a;
        a = a.child;
        continue;
      }
      if (a === b) break a;
      for (; null === a.sibling; ) {
        if (null === a.return || a.return === b) break a;
        a = a.return;
      }
      a.sibling.return = a.return;
      a = a.sibling;
    }
    d &= 1;
  }
  G(L, d);
  if (0 === (b.mode & 1)) b.memoizedState = null;
  else switch (e) {
    case "forwards":
      c = b.child;
      for (e = null; null !== c; ) a = c.alternate, null !== a && null === Ch(a) && (e = c), c = c.sibling;
      c = e;
      null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
      wj(b, false, e, c, f2);
      break;
    case "backwards":
      c = null;
      e = b.child;
      for (b.child = null; null !== e; ) {
        a = e.alternate;
        if (null !== a && null === Ch(a)) {
          b.child = e;
          break;
        }
        a = e.sibling;
        e.sibling = c;
        c = e;
        e = a;
      }
      wj(b, true, c, null, f2);
      break;
    case "together":
      wj(b, false, null, null, void 0);
      break;
    default:
      b.memoizedState = null;
  }
  return b.child;
}
function ij(a, b) {
  0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
}
function Zi(a, b, c) {
  null !== a && (b.dependencies = a.dependencies);
  rh |= b.lanes;
  if (0 === (c & b.childLanes)) return null;
  if (null !== a && b.child !== a.child) throw Error(p(153));
  if (null !== b.child) {
    a = b.child;
    c = Pg(a, a.pendingProps);
    b.child = c;
    for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = Pg(a, a.pendingProps), c.return = b;
    c.sibling = null;
  }
  return b.child;
}
function yj(a, b, c) {
  switch (b.tag) {
    case 3:
      kj(b);
      Ig();
      break;
    case 5:
      Ah(b);
      break;
    case 1:
      Zf(b.type) && cg(b);
      break;
    case 4:
      yh(b, b.stateNode.containerInfo);
      break;
    case 10:
      var d = b.type._context, e = b.memoizedProps.value;
      G(Wg, d._currentValue);
      d._currentValue = e;
      break;
    case 13:
      d = b.memoizedState;
      if (null !== d) {
        if (null !== d.dehydrated) return G(L, L.current & 1), b.flags |= 128, null;
        if (0 !== (c & b.child.childLanes)) return oj(a, b, c);
        G(L, L.current & 1);
        a = Zi(a, b, c);
        return null !== a ? a.sibling : null;
      }
      G(L, L.current & 1);
      break;
    case 19:
      d = 0 !== (c & b.childLanes);
      if (0 !== (a.flags & 128)) {
        if (d) return xj(a, b, c);
        b.flags |= 128;
      }
      e = b.memoizedState;
      null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
      G(L, L.current);
      if (d) break;
      else return null;
    case 22:
    case 23:
      return b.lanes = 0, dj(a, b, c);
  }
  return Zi(a, b, c);
}
var zj, Aj, Bj, Cj;
zj = function(a, b) {
  for (var c = b.child; null !== c; ) {
    if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
    else if (4 !== c.tag && null !== c.child) {
      c.child.return = c;
      c = c.child;
      continue;
    }
    if (c === b) break;
    for (; null === c.sibling; ) {
      if (null === c.return || c.return === b) return;
      c = c.return;
    }
    c.sibling.return = c.return;
    c = c.sibling;
  }
};
Aj = function() {
};
Bj = function(a, b, c, d) {
  var e = a.memoizedProps;
  if (e !== d) {
    a = b.stateNode;
    xh(uh.current);
    var f2 = null;
    switch (c) {
      case "input":
        e = Ya(a, e);
        d = Ya(a, d);
        f2 = [];
        break;
      case "select":
        e = A({}, e, { value: void 0 });
        d = A({}, d, { value: void 0 });
        f2 = [];
        break;
      case "textarea":
        e = gb(a, e);
        d = gb(a, d);
        f2 = [];
        break;
      default:
        "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
    }
    ub(c, d);
    var g;
    c = null;
    for (l2 in e) if (!d.hasOwnProperty(l2) && e.hasOwnProperty(l2) && null != e[l2]) if ("style" === l2) {
      var h = e[l2];
      for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
    } else "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
    for (l2 in d) {
      var k2 = d[l2];
      h = null != e ? e[l2] : void 0;
      if (d.hasOwnProperty(l2) && k2 !== h && (null != k2 || null != h)) if ("style" === l2) if (h) {
        for (g in h) !h.hasOwnProperty(g) || k2 && k2.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
        for (g in k2) k2.hasOwnProperty(g) && h[g] !== k2[g] && (c || (c = {}), c[g] = k2[g]);
      } else c || (f2 || (f2 = []), f2.push(
        l2,
        c
      )), c = k2;
      else "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h = h ? h.__html : void 0, null != k2 && h !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D("scroll", a), f2 || h === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
    }
    c && (f2 = f2 || []).push("style", c);
    var l2 = f2;
    if (b.updateQueue = l2) b.flags |= 4;
  }
};
Cj = function(a, b, c, d) {
  c !== d && (b.flags |= 4);
};
function Dj(a, b) {
  if (!I) switch (a.tailMode) {
    case "hidden":
      b = a.tail;
      for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
      null === c ? a.tail = null : c.sibling = null;
      break;
    case "collapsed":
      c = a.tail;
      for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
      null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
  }
}
function S(a) {
  var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
  if (b) for (var e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
  else for (e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
  a.subtreeFlags |= d;
  a.childLanes = c;
  return b;
}
function Ej(a, b, c) {
  var d = b.pendingProps;
  wg(b);
  switch (b.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return S(b), null;
    case 1:
      return Zf(b.type) && $f(), S(b), null;
    case 3:
      d = b.stateNode;
      zh();
      E(Wf);
      E(H);
      Eh();
      d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
      if (null === a || null === a.child) Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Fj(zg), zg = null));
      Aj(a, b);
      S(b);
      return null;
    case 5:
      Bh(b);
      var e = xh(wh.current);
      c = b.type;
      if (null !== a && null != b.stateNode) Bj(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      else {
        if (!d) {
          if (null === b.stateNode) throw Error(p(166));
          S(b);
          return null;
        }
        a = xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.type;
          var f2 = b.memoizedProps;
          d[Of] = b;
          d[Pf] = f2;
          a = 0 !== (b.mode & 1);
          switch (c) {
            case "dialog":
              D("cancel", d);
              D("close", d);
              break;
            case "iframe":
            case "object":
            case "embed":
              D("load", d);
              break;
            case "video":
            case "audio":
              for (e = 0; e < lf.length; e++) D(lf[e], d);
              break;
            case "source":
              D("error", d);
              break;
            case "img":
            case "image":
            case "link":
              D(
                "error",
                d
              );
              D("load", d);
              break;
            case "details":
              D("toggle", d);
              break;
            case "input":
              Za(d, f2);
              D("invalid", d);
              break;
            case "select":
              d._wrapperState = { wasMultiple: !!f2.multiple };
              D("invalid", d);
              break;
            case "textarea":
              hb(d, f2), D("invalid", d);
          }
          ub(c, f2);
          e = null;
          for (var g in f2) if (f2.hasOwnProperty(g)) {
            var h = f2[g];
            "children" === g ? "string" === typeof h ? d.textContent !== h && (true !== f2.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f2.suppressHydrationWarning && Af(
              d.textContent,
              h,
              a
            ), e = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D("scroll", d);
          }
          switch (c) {
            case "input":
              Va(d);
              db(d, f2, true);
              break;
            case "textarea":
              Va(d);
              jb(d);
              break;
            case "select":
            case "option":
              break;
            default:
              "function" === typeof f2.onClick && (d.onclick = Bf);
          }
          d = e;
          b.updateQueue = d;
          null !== d && (b.flags |= 4);
        } else {
          g = 9 === e.nodeType ? e : e.ownerDocument;
          "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
          "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
          a[Of] = b;
          a[Pf] = d;
          zj(a, b, false, false);
          b.stateNode = a;
          a: {
            g = vb(c, d);
            switch (c) {
              case "dialog":
                D("cancel", a);
                D("close", a);
                e = d;
                break;
              case "iframe":
              case "object":
              case "embed":
                D("load", a);
                e = d;
                break;
              case "video":
              case "audio":
                for (e = 0; e < lf.length; e++) D(lf[e], a);
                e = d;
                break;
              case "source":
                D("error", a);
                e = d;
                break;
              case "img":
              case "image":
              case "link":
                D(
                  "error",
                  a
                );
                D("load", a);
                e = d;
                break;
              case "details":
                D("toggle", a);
                e = d;
                break;
              case "input":
                Za(a, d);
                e = Ya(a, d);
                D("invalid", a);
                break;
              case "option":
                e = d;
                break;
              case "select":
                a._wrapperState = { wasMultiple: !!d.multiple };
                e = A({}, d, { value: void 0 });
                D("invalid", a);
                break;
              case "textarea":
                hb(a, d);
                e = gb(a, d);
                D("invalid", a);
                break;
              default:
                e = d;
            }
            ub(c, e);
            h = e;
            for (f2 in h) if (h.hasOwnProperty(f2)) {
              var k2 = h[f2];
              "style" === f2 ? sb(a, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c || "" !== k2) && ob(a, k2) : "number" === typeof k2 && ob(a, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D("scroll", a) : null != k2 && ta(a, f2, k2, g));
            }
            switch (c) {
              case "input":
                Va(a);
                db(a, d, false);
                break;
              case "textarea":
                Va(a);
                jb(a);
                break;
              case "option":
                null != d.value && a.setAttribute("value", "" + Sa(d.value));
                break;
              case "select":
                a.multiple = !!d.multiple;
                f2 = d.value;
                null != f2 ? fb(a, !!d.multiple, f2, false) : null != d.defaultValue && fb(
                  a,
                  !!d.multiple,
                  d.defaultValue,
                  true
                );
                break;
              default:
                "function" === typeof e.onClick && (a.onclick = Bf);
            }
            switch (c) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                d = !!d.autoFocus;
                break a;
              case "img":
                d = true;
                break a;
              default:
                d = false;
            }
          }
          d && (b.flags |= 4);
        }
        null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      }
      S(b);
      return null;
    case 6:
      if (a && null != b.stateNode) Cj(a, b, a.memoizedProps, d);
      else {
        if ("string" !== typeof d && null === b.stateNode) throw Error(p(166));
        c = xh(wh.current);
        xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.memoizedProps;
          d[Of] = b;
          if (f2 = d.nodeValue !== c) {
            if (a = xg, null !== a) switch (a.tag) {
              case 3:
                Af(d.nodeValue, c, 0 !== (a.mode & 1));
                break;
              case 5:
                true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
            }
          }
          f2 && (b.flags |= 4);
        } else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
      }
      S(b);
      return null;
    case 13:
      E(L);
      d = b.memoizedState;
      if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
        if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f2 = false;
        else if (f2 = Gg(b), null !== d && null !== d.dehydrated) {
          if (null === a) {
            if (!f2) throw Error(p(318));
            f2 = b.memoizedState;
            f2 = null !== f2 ? f2.dehydrated : null;
            if (!f2) throw Error(p(317));
            f2[Of] = b;
          } else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
          S(b);
          f2 = false;
        } else null !== zg && (Fj(zg), zg = null), f2 = true;
        if (!f2) return b.flags & 65536 ? b : null;
      }
      if (0 !== (b.flags & 128)) return b.lanes = c, b;
      d = null !== d;
      d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (L.current & 1) ? 0 === T && (T = 3) : tj()));
      null !== b.updateQueue && (b.flags |= 4);
      S(b);
      return null;
    case 4:
      return zh(), Aj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
    case 10:
      return ah(b.type._context), S(b), null;
    case 17:
      return Zf(b.type) && $f(), S(b), null;
    case 19:
      E(L);
      f2 = b.memoizedState;
      if (null === f2) return S(b), null;
      d = 0 !== (b.flags & 128);
      g = f2.rendering;
      if (null === g) if (d) Dj(f2, false);
      else {
        if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
          g = Ch(a);
          if (null !== g) {
            b.flags |= 128;
            Dj(f2, false);
            d = g.updateQueue;
            null !== d && (b.updateQueue = d, b.flags |= 4);
            b.subtreeFlags = 0;
            d = c;
            for (c = b.child; null !== c; ) f2 = c, a = d, f2.flags &= 14680066, g = f2.alternate, null === g ? (f2.childLanes = 0, f2.lanes = a, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g.childLanes, f2.lanes = g.lanes, f2.child = g.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g.memoizedProps, f2.memoizedState = g.memoizedState, f2.updateQueue = g.updateQueue, f2.type = g.type, a = g.dependencies, f2.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
            G(L, L.current & 1 | 2);
            return b.child;
          }
          a = a.sibling;
        }
        null !== f2.tail && B() > Gj && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
      }
      else {
        if (!d) if (a = Ch(g), null !== a) {
          if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Dj(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g.alternate && !I) return S(b), null;
        } else 2 * B() - f2.renderingStartTime > Gj && 1073741824 !== c && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
        f2.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f2.last, null !== c ? c.sibling = g : b.child = g, f2.last = g);
      }
      if (null !== f2.tail) return b = f2.tail, f2.rendering = b, f2.tail = b.sibling, f2.renderingStartTime = B(), b.sibling = null, c = L.current, G(L, d ? c & 1 | 2 : c & 1), b;
      S(b);
      return null;
    case 22:
    case 23:
      return Hj(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (fj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(p(156, b.tag));
}
function Ij(a, b) {
  wg(b);
  switch (b.tag) {
    case 1:
      return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 3:
      return zh(), E(Wf), E(H), Eh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
    case 5:
      return Bh(b), null;
    case 13:
      E(L);
      a = b.memoizedState;
      if (null !== a && null !== a.dehydrated) {
        if (null === b.alternate) throw Error(p(340));
        Ig();
      }
      a = b.flags;
      return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 19:
      return E(L), null;
    case 4:
      return zh(), null;
    case 10:
      return ah(b.type._context), null;
    case 22:
    case 23:
      return Hj(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Jj = false, U = false, Kj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
function Lj(a, b) {
  var c = a.ref;
  if (null !== c) if ("function" === typeof c) try {
    c(null);
  } catch (d) {
    W(a, b, d);
  }
  else c.current = null;
}
function Mj(a, b, c) {
  try {
    c();
  } catch (d) {
    W(a, b, d);
  }
}
var Nj = false;
function Oj(a, b) {
  Cf = dd;
  a = Me();
  if (Ne(a)) {
    if ("selectionStart" in a) var c = { start: a.selectionStart, end: a.selectionEnd };
    else a: {
      c = (c = a.ownerDocument) && c.defaultView || window;
      var d = c.getSelection && c.getSelection();
      if (d && 0 !== d.rangeCount) {
        c = d.anchorNode;
        var e = d.anchorOffset, f2 = d.focusNode;
        d = d.focusOffset;
        try {
          c.nodeType, f2.nodeType;
        } catch (F2) {
          c = null;
          break a;
        }
        var g = 0, h = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a, r2 = null;
        b: for (; ; ) {
          for (var y2; ; ) {
            q2 !== c || 0 !== e && 3 !== q2.nodeType || (h = g + e);
            q2 !== f2 || 0 !== d && 3 !== q2.nodeType || (k2 = g + d);
            3 === q2.nodeType && (g += q2.nodeValue.length);
            if (null === (y2 = q2.firstChild)) break;
            r2 = q2;
            q2 = y2;
          }
          for (; ; ) {
            if (q2 === a) break b;
            r2 === c && ++l2 === e && (h = g);
            r2 === f2 && ++m2 === d && (k2 = g);
            if (null !== (y2 = q2.nextSibling)) break;
            q2 = r2;
            r2 = q2.parentNode;
          }
          q2 = y2;
        }
        c = -1 === h || -1 === k2 ? null : { start: h, end: k2 };
      } else c = null;
    }
    c = c || { start: 0, end: 0 };
  } else c = null;
  Df = { focusedElem: a, selectionRange: c };
  dd = false;
  for (V = b; null !== V; ) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
  else for (; null !== V; ) {
    b = V;
    try {
      var n2 = b.alternate;
      if (0 !== (b.flags & 1024)) switch (b.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (null !== n2) {
            var t2 = n2.memoizedProps, J2 = n2.memoizedState, x2 = b.stateNode, w2 = x2.getSnapshotBeforeUpdate(b.elementType === b.type ? t2 : Ci(b.type, t2), J2);
            x2.__reactInternalSnapshotBeforeUpdate = w2;
          }
          break;
        case 3:
          var u2 = b.stateNode.containerInfo;
          1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(p(163));
      }
    } catch (F2) {
      W(b, b.return, F2);
    }
    a = b.sibling;
    if (null !== a) {
      a.return = b.return;
      V = a;
      break;
    }
    V = b.return;
  }
  n2 = Nj;
  Nj = false;
  return n2;
}
function Pj(a, b, c) {
  var d = b.updateQueue;
  d = null !== d ? d.lastEffect : null;
  if (null !== d) {
    var e = d = d.next;
    do {
      if ((e.tag & a) === a) {
        var f2 = e.destroy;
        e.destroy = void 0;
        void 0 !== f2 && Mj(b, c, f2);
      }
      e = e.next;
    } while (e !== d);
  }
}
function Qj(a, b) {
  b = b.updateQueue;
  b = null !== b ? b.lastEffect : null;
  if (null !== b) {
    var c = b = b.next;
    do {
      if ((c.tag & a) === a) {
        var d = c.create;
        c.destroy = d();
      }
      c = c.next;
    } while (c !== b);
  }
}
function Rj(a) {
  var b = a.ref;
  if (null !== b) {
    var c = a.stateNode;
    switch (a.tag) {
      case 5:
        a = c;
        break;
      default:
        a = c;
    }
    "function" === typeof b ? b(a) : b.current = a;
  }
}
function Sj(a) {
  var b = a.alternate;
  null !== b && (a.alternate = null, Sj(b));
  a.child = null;
  a.deletions = null;
  a.sibling = null;
  5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
  a.stateNode = null;
  a.return = null;
  a.dependencies = null;
  a.memoizedProps = null;
  a.memoizedState = null;
  a.pendingProps = null;
  a.stateNode = null;
  a.updateQueue = null;
}
function Tj(a) {
  return 5 === a.tag || 3 === a.tag || 4 === a.tag;
}
function Uj(a) {
  a: for (; ; ) {
    for (; null === a.sibling; ) {
      if (null === a.return || Tj(a.return)) return null;
      a = a.return;
    }
    a.sibling.return = a.return;
    for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
      if (a.flags & 2) continue a;
      if (null === a.child || 4 === a.tag) continue a;
      else a.child.return = a, a = a.child;
    }
    if (!(a.flags & 2)) return a.stateNode;
  }
}
function Vj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
  else if (4 !== d && (a = a.child, null !== a)) for (Vj(a, b, c), a = a.sibling; null !== a; ) Vj(a, b, c), a = a.sibling;
}
function Wj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
  else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a; ) Wj(a, b, c), a = a.sibling;
}
var X = null, Xj = false;
function Yj(a, b, c) {
  for (c = c.child; null !== c; ) Zj(a, b, c), c = c.sibling;
}
function Zj(a, b, c) {
  if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
    lc.onCommitFiberUnmount(kc, c);
  } catch (h) {
  }
  switch (c.tag) {
    case 5:
      U || Lj(c, b);
    case 6:
      var d = X, e = Xj;
      X = null;
      Yj(a, b, c);
      X = d;
      Xj = e;
      null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X.removeChild(c.stateNode));
      break;
    case 18:
      null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X, c.stateNode));
      break;
    case 4:
      d = X;
      e = Xj;
      X = c.stateNode.containerInfo;
      Xj = true;
      Yj(a, b, c);
      X = d;
      Xj = e;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!U && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
        e = d = d.next;
        do {
          var f2 = e, g = f2.destroy;
          f2 = f2.tag;
          void 0 !== g && (0 !== (f2 & 2) ? Mj(c, b, g) : 0 !== (f2 & 4) && Mj(c, b, g));
          e = e.next;
        } while (e !== d);
      }
      Yj(a, b, c);
      break;
    case 1:
      if (!U && (Lj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
        d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
      } catch (h) {
        W(c, b, h);
      }
      Yj(a, b, c);
      break;
    case 21:
      Yj(a, b, c);
      break;
    case 22:
      c.mode & 1 ? (U = (d = U) || null !== c.memoizedState, Yj(a, b, c), U = d) : Yj(a, b, c);
      break;
    default:
      Yj(a, b, c);
  }
}
function ak(a) {
  var b = a.updateQueue;
  if (null !== b) {
    a.updateQueue = null;
    var c = a.stateNode;
    null === c && (c = a.stateNode = new Kj());
    b.forEach(function(b2) {
      var d = bk.bind(null, a, b2);
      c.has(b2) || (c.add(b2), b2.then(d, d));
    });
  }
}
function ck(a, b) {
  var c = b.deletions;
  if (null !== c) for (var d = 0; d < c.length; d++) {
    var e = c[d];
    try {
      var f2 = a, g = b, h = g;
      a: for (; null !== h; ) {
        switch (h.tag) {
          case 5:
            X = h.stateNode;
            Xj = false;
            break a;
          case 3:
            X = h.stateNode.containerInfo;
            Xj = true;
            break a;
          case 4:
            X = h.stateNode.containerInfo;
            Xj = true;
            break a;
        }
        h = h.return;
      }
      if (null === X) throw Error(p(160));
      Zj(f2, g, e);
      X = null;
      Xj = false;
      var k2 = e.alternate;
      null !== k2 && (k2.return = null);
      e.return = null;
    } catch (l2) {
      W(e, b, l2);
    }
  }
  if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) dk(b, a), b = b.sibling;
}
function dk(a, b) {
  var c = a.alternate, d = a.flags;
  switch (a.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      ck(b, a);
      ek(a);
      if (d & 4) {
        try {
          Pj(3, a, a.return), Qj(3, a);
        } catch (t2) {
          W(a, a.return, t2);
        }
        try {
          Pj(5, a, a.return);
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 1:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      break;
    case 5:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      if (a.flags & 32) {
        var e = a.stateNode;
        try {
          ob(e, "");
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      if (d & 4 && (e = a.stateNode, null != e)) {
        var f2 = a.memoizedProps, g = null !== c ? c.memoizedProps : f2, h = a.type, k2 = a.updateQueue;
        a.updateQueue = null;
        if (null !== k2) try {
          "input" === h && "radio" === f2.type && null != f2.name && ab(e, f2);
          vb(h, g);
          var l2 = vb(h, f2);
          for (g = 0; g < k2.length; g += 2) {
            var m2 = k2[g], q2 = k2[g + 1];
            "style" === m2 ? sb(e, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e, q2) : "children" === m2 ? ob(e, q2) : ta(e, m2, q2, l2);
          }
          switch (h) {
            case "input":
              bb(e, f2);
              break;
            case "textarea":
              ib(e, f2);
              break;
            case "select":
              var r2 = e._wrapperState.wasMultiple;
              e._wrapperState.wasMultiple = !!f2.multiple;
              var y2 = f2.value;
              null != y2 ? fb(e, !!f2.multiple, y2, false) : r2 !== !!f2.multiple && (null != f2.defaultValue ? fb(
                e,
                !!f2.multiple,
                f2.defaultValue,
                true
              ) : fb(e, !!f2.multiple, f2.multiple ? [] : "", false));
          }
          e[Pf] = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 6:
      ck(b, a);
      ek(a);
      if (d & 4) {
        if (null === a.stateNode) throw Error(p(162));
        e = a.stateNode;
        f2 = a.memoizedProps;
        try {
          e.nodeValue = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 3:
      ck(b, a);
      ek(a);
      if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
        bd(b.containerInfo);
      } catch (t2) {
        W(a, a.return, t2);
      }
      break;
    case 4:
      ck(b, a);
      ek(a);
      break;
    case 13:
      ck(b, a);
      ek(a);
      e = a.child;
      e.flags & 8192 && (f2 = null !== e.memoizedState, e.stateNode.isHidden = f2, !f2 || null !== e.alternate && null !== e.alternate.memoizedState || (fk = B()));
      d & 4 && ak(a);
      break;
    case 22:
      m2 = null !== c && null !== c.memoizedState;
      a.mode & 1 ? (U = (l2 = U) || m2, ck(b, a), U = l2) : ck(b, a);
      ek(a);
      if (d & 8192) {
        l2 = null !== a.memoizedState;
        if ((a.stateNode.isHidden = l2) && !m2 && 0 !== (a.mode & 1)) for (V = a, m2 = a.child; null !== m2; ) {
          for (q2 = V = m2; null !== V; ) {
            r2 = V;
            y2 = r2.child;
            switch (r2.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                Pj(4, r2, r2.return);
                break;
              case 1:
                Lj(r2, r2.return);
                var n2 = r2.stateNode;
                if ("function" === typeof n2.componentWillUnmount) {
                  d = r2;
                  c = r2.return;
                  try {
                    b = d, n2.props = b.memoizedProps, n2.state = b.memoizedState, n2.componentWillUnmount();
                  } catch (t2) {
                    W(d, c, t2);
                  }
                }
                break;
              case 5:
                Lj(r2, r2.return);
                break;
              case 22:
                if (null !== r2.memoizedState) {
                  gk(q2);
                  continue;
                }
            }
            null !== y2 ? (y2.return = r2, V = y2) : gk(q2);
          }
          m2 = m2.sibling;
        }
        a: for (m2 = null, q2 = a; ; ) {
          if (5 === q2.tag) {
            if (null === m2) {
              m2 = q2;
              try {
                e = q2.stateNode, l2 ? (f2 = e.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h = q2.stateNode, k2 = q2.memoizedProps.style, g = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h.style.display = rb("display", g));
              } catch (t2) {
                W(a, a.return, t2);
              }
            }
          } else if (6 === q2.tag) {
            if (null === m2) try {
              q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
            } catch (t2) {
              W(a, a.return, t2);
            }
          } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a) && null !== q2.child) {
            q2.child.return = q2;
            q2 = q2.child;
            continue;
          }
          if (q2 === a) break a;
          for (; null === q2.sibling; ) {
            if (null === q2.return || q2.return === a) break a;
            m2 === q2 && (m2 = null);
            q2 = q2.return;
          }
          m2 === q2 && (m2 = null);
          q2.sibling.return = q2.return;
          q2 = q2.sibling;
        }
      }
      break;
    case 19:
      ck(b, a);
      ek(a);
      d & 4 && ak(a);
      break;
    case 21:
      break;
    default:
      ck(
        b,
        a
      ), ek(a);
  }
}
function ek(a) {
  var b = a.flags;
  if (b & 2) {
    try {
      a: {
        for (var c = a.return; null !== c; ) {
          if (Tj(c)) {
            var d = c;
            break a;
          }
          c = c.return;
        }
        throw Error(p(160));
      }
      switch (d.tag) {
        case 5:
          var e = d.stateNode;
          d.flags & 32 && (ob(e, ""), d.flags &= -33);
          var f2 = Uj(a);
          Wj(a, f2, e);
          break;
        case 3:
        case 4:
          var g = d.stateNode.containerInfo, h = Uj(a);
          Vj(a, h, g);
          break;
        default:
          throw Error(p(161));
      }
    } catch (k2) {
      W(a, a.return, k2);
    }
    a.flags &= -3;
  }
  b & 4096 && (a.flags &= -4097);
}
function hk(a, b, c) {
  V = a;
  ik(a);
}
function ik(a, b, c) {
  for (var d = 0 !== (a.mode & 1); null !== V; ) {
    var e = V, f2 = e.child;
    if (22 === e.tag && d) {
      var g = null !== e.memoizedState || Jj;
      if (!g) {
        var h = e.alternate, k2 = null !== h && null !== h.memoizedState || U;
        h = Jj;
        var l2 = U;
        Jj = g;
        if ((U = k2) && !l2) for (V = e; null !== V; ) g = V, k2 = g.child, 22 === g.tag && null !== g.memoizedState ? jk(e) : null !== k2 ? (k2.return = g, V = k2) : jk(e);
        for (; null !== f2; ) V = f2, ik(f2), f2 = f2.sibling;
        V = e;
        Jj = h;
        U = l2;
      }
      kk(a);
    } else 0 !== (e.subtreeFlags & 8772) && null !== f2 ? (f2.return = e, V = f2) : kk(a);
  }
}
function kk(a) {
  for (; null !== V; ) {
    var b = V;
    if (0 !== (b.flags & 8772)) {
      var c = b.alternate;
      try {
        if (0 !== (b.flags & 8772)) switch (b.tag) {
          case 0:
          case 11:
          case 15:
            U || Qj(5, b);
            break;
          case 1:
            var d = b.stateNode;
            if (b.flags & 4 && !U) if (null === c) d.componentDidMount();
            else {
              var e = b.elementType === b.type ? c.memoizedProps : Ci(b.type, c.memoizedProps);
              d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
            }
            var f2 = b.updateQueue;
            null !== f2 && sh(b, f2, d);
            break;
          case 3:
            var g = b.updateQueue;
            if (null !== g) {
              c = null;
              if (null !== b.child) switch (b.child.tag) {
                case 5:
                  c = b.child.stateNode;
                  break;
                case 1:
                  c = b.child.stateNode;
              }
              sh(b, g, c);
            }
            break;
          case 5:
            var h = b.stateNode;
            if (null === c && b.flags & 4) {
              c = h;
              var k2 = b.memoizedProps;
              switch (b.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  k2.autoFocus && c.focus();
                  break;
                case "img":
                  k2.src && (c.src = k2.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (null === b.memoizedState) {
              var l2 = b.alternate;
              if (null !== l2) {
                var m2 = l2.memoizedState;
                if (null !== m2) {
                  var q2 = m2.dehydrated;
                  null !== q2 && bd(q2);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(p(163));
        }
        U || b.flags & 512 && Rj(b);
      } catch (r2) {
        W(b, b.return, r2);
      }
    }
    if (b === a) {
      V = null;
      break;
    }
    c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function gk(a) {
  for (; null !== V; ) {
    var b = V;
    if (b === a) {
      V = null;
      break;
    }
    var c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function jk(a) {
  for (; null !== V; ) {
    var b = V;
    try {
      switch (b.tag) {
        case 0:
        case 11:
        case 15:
          var c = b.return;
          try {
            Qj(4, b);
          } catch (k2) {
            W(b, c, k2);
          }
          break;
        case 1:
          var d = b.stateNode;
          if ("function" === typeof d.componentDidMount) {
            var e = b.return;
            try {
              d.componentDidMount();
            } catch (k2) {
              W(b, e, k2);
            }
          }
          var f2 = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, f2, k2);
          }
          break;
        case 5:
          var g = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, g, k2);
          }
      }
    } catch (k2) {
      W(b, b.return, k2);
    }
    if (b === a) {
      V = null;
      break;
    }
    var h = b.sibling;
    if (null !== h) {
      h.return = b.return;
      V = h;
      break;
    }
    V = b.return;
  }
}
var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok = ua.ReactCurrentBatchConfig, K = 0, Q = null, Y = null, Z = 0, fj = 0, ej = Uf(0), T = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = false, Pi = null, Ri = null, vk = false, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
function R() {
  return 0 !== (K & 6) ? B() : -1 !== Ak ? Ak : Ak = B();
}
function yi(a) {
  if (0 === (a.mode & 1)) return 1;
  if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
  if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
  a = C;
  if (0 !== a) return a;
  a = window.event;
  a = void 0 === a ? 16 : jd(a.type);
  return a;
}
function gi(a, b, c, d) {
  if (50 < yk) throw yk = 0, zk = null, Error(p(185));
  Ac(a, c, d);
  if (0 === (K & 2) || a !== Q) a === Q && (0 === (K & 2) && (qk |= c), 4 === T && Ck(a, Z)), Dk(a, d), 1 === c && 0 === K && 0 === (b.mode & 1) && (Gj = B() + 500, fg && jg());
}
function Dk(a, b) {
  var c = a.callbackNode;
  wc(a, b);
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
  else if (b = d & -d, a.callbackPriority !== b) {
    null != c && bc(c);
    if (1 === b) 0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
      0 === (K & 6) && jg();
    }), c = null;
    else {
      switch (Dc(d)) {
        case 1:
          c = fc;
          break;
        case 4:
          c = gc;
          break;
        case 16:
          c = hc;
          break;
        case 536870912:
          c = jc;
          break;
        default:
          c = hc;
      }
      c = Fk(c, Gk.bind(null, a));
    }
    a.callbackPriority = b;
    a.callbackNode = c;
  }
}
function Gk(a, b) {
  Ak = -1;
  Bk = 0;
  if (0 !== (K & 6)) throw Error(p(327));
  var c = a.callbackNode;
  if (Hk() && a.callbackNode !== c) return null;
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) return null;
  if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Ik(a, d);
  else {
    b = d;
    var e = K;
    K |= 2;
    var f2 = Jk();
    if (Q !== a || Z !== b) uk = null, Gj = B() + 500, Kk(a, b);
    do
      try {
        Lk();
        break;
      } catch (h) {
        Mk(a, h);
      }
    while (1);
    $g();
    mk.current = f2;
    K = e;
    null !== Y ? b = 0 : (Q = null, Z = 0, b = T);
  }
  if (0 !== b) {
    2 === b && (e = xc(a), 0 !== e && (d = e, b = Nk(a, e)));
    if (1 === b) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
    if (6 === b) Ck(a, d);
    else {
      e = a.current.alternate;
      if (0 === (d & 30) && !Ok(e) && (b = Ik(a, d), 2 === b && (f2 = xc(a), 0 !== f2 && (d = f2, b = Nk(a, f2))), 1 === b)) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
      a.finishedWork = e;
      a.finishedLanes = d;
      switch (b) {
        case 0:
        case 1:
          throw Error(p(345));
        case 2:
          Pk(a, tk, uk);
          break;
        case 3:
          Ck(a, d);
          if ((d & 130023424) === d && (b = fk + 500 - B(), 10 < b)) {
            if (0 !== uc(a, 0)) break;
            e = a.suspendedLanes;
            if ((e & d) !== d) {
              R();
              a.pingedLanes |= a.suspendedLanes & e;
              break;
            }
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 4:
          Ck(a, d);
          if ((d & 4194240) === d) break;
          b = a.eventTimes;
          for (e = -1; 0 < d; ) {
            var g = 31 - oc(d);
            f2 = 1 << g;
            g = b[g];
            g > e && (e = g);
            d &= ~f2;
          }
          d = e;
          d = B() - d;
          d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * lk(d / 1960)) - d;
          if (10 < d) {
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), d);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 5:
          Pk(a, tk, uk);
          break;
        default:
          throw Error(p(329));
      }
    }
  }
  Dk(a, B());
  return a.callbackNode === c ? Gk.bind(null, a) : null;
}
function Nk(a, b) {
  var c = sk;
  a.current.memoizedState.isDehydrated && (Kk(a, b).flags |= 256);
  a = Ik(a, b);
  2 !== a && (b = tk, tk = c, null !== b && Fj(b));
  return a;
}
function Fj(a) {
  null === tk ? tk = a : tk.push.apply(tk, a);
}
function Ok(a) {
  for (var b = a; ; ) {
    if (b.flags & 16384) {
      var c = b.updateQueue;
      if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
        var e = c[d], f2 = e.getSnapshot;
        e = e.value;
        try {
          if (!He(f2(), e)) return false;
        } catch (g) {
          return false;
        }
      }
    }
    c = b.child;
    if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
    else {
      if (b === a) break;
      for (; null === b.sibling; ) {
        if (null === b.return || b.return === a) return true;
        b = b.return;
      }
      b.sibling.return = b.return;
      b = b.sibling;
    }
  }
  return true;
}
function Ck(a, b) {
  b &= ~rk;
  b &= ~qk;
  a.suspendedLanes |= b;
  a.pingedLanes &= ~b;
  for (a = a.expirationTimes; 0 < b; ) {
    var c = 31 - oc(b), d = 1 << c;
    a[c] = -1;
    b &= ~d;
  }
}
function Ek(a) {
  if (0 !== (K & 6)) throw Error(p(327));
  Hk();
  var b = uc(a, 0);
  if (0 === (b & 1)) return Dk(a, B()), null;
  var c = Ik(a, b);
  if (0 !== a.tag && 2 === c) {
    var d = xc(a);
    0 !== d && (b = d, c = Nk(a, d));
  }
  if (1 === c) throw c = pk, Kk(a, 0), Ck(a, b), Dk(a, B()), c;
  if (6 === c) throw Error(p(345));
  a.finishedWork = a.current.alternate;
  a.finishedLanes = b;
  Pk(a, tk, uk);
  Dk(a, B());
  return null;
}
function Qk(a, b) {
  var c = K;
  K |= 1;
  try {
    return a(b);
  } finally {
    K = c, 0 === K && (Gj = B() + 500, fg && jg());
  }
}
function Rk(a) {
  null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
  var b = K;
  K |= 1;
  var c = ok.transition, d = C;
  try {
    if (ok.transition = null, C = 1, a) return a();
  } finally {
    C = d, ok.transition = c, K = b, 0 === (K & 6) && jg();
  }
}
function Hj() {
  fj = ej.current;
  E(ej);
}
function Kk(a, b) {
  a.finishedWork = null;
  a.finishedLanes = 0;
  var c = a.timeoutHandle;
  -1 !== c && (a.timeoutHandle = -1, Gf(c));
  if (null !== Y) for (c = Y.return; null !== c; ) {
    var d = c;
    wg(d);
    switch (d.tag) {
      case 1:
        d = d.type.childContextTypes;
        null !== d && void 0 !== d && $f();
        break;
      case 3:
        zh();
        E(Wf);
        E(H);
        Eh();
        break;
      case 5:
        Bh(d);
        break;
      case 4:
        zh();
        break;
      case 13:
        E(L);
        break;
      case 19:
        E(L);
        break;
      case 10:
        ah(d.type._context);
        break;
      case 22:
      case 23:
        Hj();
    }
    c = c.return;
  }
  Q = a;
  Y = a = Pg(a.current, null);
  Z = fj = b;
  T = 0;
  pk = null;
  rk = qk = rh = 0;
  tk = sk = null;
  if (null !== fh) {
    for (b = 0; b < fh.length; b++) if (c = fh[b], d = c.interleaved, null !== d) {
      c.interleaved = null;
      var e = d.next, f2 = c.pending;
      if (null !== f2) {
        var g = f2.next;
        f2.next = e;
        d.next = g;
      }
      c.pending = d;
    }
    fh = null;
  }
  return a;
}
function Mk(a, b) {
  do {
    var c = Y;
    try {
      $g();
      Fh.current = Rh;
      if (Ih) {
        for (var d = M.memoizedState; null !== d; ) {
          var e = d.queue;
          null !== e && (e.pending = null);
          d = d.next;
        }
        Ih = false;
      }
      Hh = 0;
      O = N = M = null;
      Jh = false;
      Kh = 0;
      nk.current = null;
      if (null === c || null === c.return) {
        T = 1;
        pk = b;
        Y = null;
        break;
      }
      a: {
        var f2 = a, g = c.return, h = c, k2 = b;
        b = Z;
        h.flags |= 32768;
        if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
          var l2 = k2, m2 = h, q2 = m2.tag;
          if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
            var r2 = m2.alternate;
            r2 ? (m2.updateQueue = r2.updateQueue, m2.memoizedState = r2.memoizedState, m2.lanes = r2.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
          }
          var y2 = Ui(g);
          if (null !== y2) {
            y2.flags &= -257;
            Vi(y2, g, h, f2, b);
            y2.mode & 1 && Si(f2, l2, b);
            b = y2;
            k2 = l2;
            var n2 = b.updateQueue;
            if (null === n2) {
              var t2 = /* @__PURE__ */ new Set();
              t2.add(k2);
              b.updateQueue = t2;
            } else n2.add(k2);
            break a;
          } else {
            if (0 === (b & 1)) {
              Si(f2, l2, b);
              tj();
              break a;
            }
            k2 = Error(p(426));
          }
        } else if (I && h.mode & 1) {
          var J2 = Ui(g);
          if (null !== J2) {
            0 === (J2.flags & 65536) && (J2.flags |= 256);
            Vi(J2, g, h, f2, b);
            Jg(Ji(k2, h));
            break a;
          }
        }
        f2 = k2 = Ji(k2, h);
        4 !== T && (T = 2);
        null === sk ? sk = [f2] : sk.push(f2);
        f2 = g;
        do {
          switch (f2.tag) {
            case 3:
              f2.flags |= 65536;
              b &= -b;
              f2.lanes |= b;
              var x2 = Ni(f2, k2, b);
              ph(f2, x2);
              break a;
            case 1:
              h = k2;
              var w2 = f2.type, u2 = f2.stateNode;
              if (0 === (f2.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Ri || !Ri.has(u2)))) {
                f2.flags |= 65536;
                b &= -b;
                f2.lanes |= b;
                var F2 = Qi(f2, h, b);
                ph(f2, F2);
                break a;
              }
          }
          f2 = f2.return;
        } while (null !== f2);
      }
      Sk(c);
    } catch (na) {
      b = na;
      Y === c && null !== c && (Y = c = c.return);
      continue;
    }
    break;
  } while (1);
}
function Jk() {
  var a = mk.current;
  mk.current = Rh;
  return null === a ? Rh : a;
}
function tj() {
  if (0 === T || 3 === T || 2 === T) T = 4;
  null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
}
function Ik(a, b) {
  var c = K;
  K |= 2;
  var d = Jk();
  if (Q !== a || Z !== b) uk = null, Kk(a, b);
  do
    try {
      Tk();
      break;
    } catch (e) {
      Mk(a, e);
    }
  while (1);
  $g();
  K = c;
  mk.current = d;
  if (null !== Y) throw Error(p(261));
  Q = null;
  Z = 0;
  return T;
}
function Tk() {
  for (; null !== Y; ) Uk(Y);
}
function Lk() {
  for (; null !== Y && !cc$1(); ) Uk(Y);
}
function Uk(a) {
  var b = Vk(a.alternate, a, fj);
  a.memoizedProps = a.pendingProps;
  null === b ? Sk(a) : Y = b;
  nk.current = null;
}
function Sk(a) {
  var b = a;
  do {
    var c = b.alternate;
    a = b.return;
    if (0 === (b.flags & 32768)) {
      if (c = Ej(c, b, fj), null !== c) {
        Y = c;
        return;
      }
    } else {
      c = Ij(c, b);
      if (null !== c) {
        c.flags &= 32767;
        Y = c;
        return;
      }
      if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
      else {
        T = 6;
        Y = null;
        return;
      }
    }
    b = b.sibling;
    if (null !== b) {
      Y = b;
      return;
    }
    Y = b = a;
  } while (null !== b);
  0 === T && (T = 5);
}
function Pk(a, b, c) {
  var d = C, e = ok.transition;
  try {
    ok.transition = null, C = 1, Wk(a, b, c, d);
  } finally {
    ok.transition = e, C = d;
  }
  return null;
}
function Wk(a, b, c, d) {
  do
    Hk();
  while (null !== wk);
  if (0 !== (K & 6)) throw Error(p(327));
  c = a.finishedWork;
  var e = a.finishedLanes;
  if (null === c) return null;
  a.finishedWork = null;
  a.finishedLanes = 0;
  if (c === a.current) throw Error(p(177));
  a.callbackNode = null;
  a.callbackPriority = 0;
  var f2 = c.lanes | c.childLanes;
  Bc(a, f2);
  a === Q && (Y = Q = null, Z = 0);
  0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || vk || (vk = true, Fk(hc, function() {
    Hk();
    return null;
  }));
  f2 = 0 !== (c.flags & 15990);
  if (0 !== (c.subtreeFlags & 15990) || f2) {
    f2 = ok.transition;
    ok.transition = null;
    var g = C;
    C = 1;
    var h = K;
    K |= 4;
    nk.current = null;
    Oj(a, c);
    dk(c, a);
    Oe(Df);
    dd = !!Cf;
    Df = Cf = null;
    a.current = c;
    hk(c);
    dc();
    K = h;
    C = g;
    ok.transition = f2;
  } else a.current = c;
  vk && (vk = false, wk = a, xk = e);
  f2 = a.pendingLanes;
  0 === f2 && (Ri = null);
  mc(c.stateNode);
  Dk(a, B());
  if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
  if (Oi) throw Oi = false, a = Pi, Pi = null, a;
  0 !== (xk & 1) && 0 !== a.tag && Hk();
  f2 = a.pendingLanes;
  0 !== (f2 & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
  jg();
  return null;
}
function Hk() {
  if (null !== wk) {
    var a = Dc(xk), b = ok.transition, c = C;
    try {
      ok.transition = null;
      C = 16 > a ? 16 : a;
      if (null === wk) var d = false;
      else {
        a = wk;
        wk = null;
        xk = 0;
        if (0 !== (K & 6)) throw Error(p(331));
        var e = K;
        K |= 4;
        for (V = a.current; null !== V; ) {
          var f2 = V, g = f2.child;
          if (0 !== (V.flags & 16)) {
            var h = f2.deletions;
            if (null !== h) {
              for (var k2 = 0; k2 < h.length; k2++) {
                var l2 = h[k2];
                for (V = l2; null !== V; ) {
                  var m2 = V;
                  switch (m2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Pj(8, m2, f2);
                  }
                  var q2 = m2.child;
                  if (null !== q2) q2.return = m2, V = q2;
                  else for (; null !== V; ) {
                    m2 = V;
                    var r2 = m2.sibling, y2 = m2.return;
                    Sj(m2);
                    if (m2 === l2) {
                      V = null;
                      break;
                    }
                    if (null !== r2) {
                      r2.return = y2;
                      V = r2;
                      break;
                    }
                    V = y2;
                  }
                }
              }
              var n2 = f2.alternate;
              if (null !== n2) {
                var t2 = n2.child;
                if (null !== t2) {
                  n2.child = null;
                  do {
                    var J2 = t2.sibling;
                    t2.sibling = null;
                    t2 = J2;
                  } while (null !== t2);
                }
              }
              V = f2;
            }
          }
          if (0 !== (f2.subtreeFlags & 2064) && null !== g) g.return = f2, V = g;
          else b: for (; null !== V; ) {
            f2 = V;
            if (0 !== (f2.flags & 2048)) switch (f2.tag) {
              case 0:
              case 11:
              case 15:
                Pj(9, f2, f2.return);
            }
            var x2 = f2.sibling;
            if (null !== x2) {
              x2.return = f2.return;
              V = x2;
              break b;
            }
            V = f2.return;
          }
        }
        var w2 = a.current;
        for (V = w2; null !== V; ) {
          g = V;
          var u2 = g.child;
          if (0 !== (g.subtreeFlags & 2064) && null !== u2) u2.return = g, V = u2;
          else b: for (g = w2; null !== V; ) {
            h = V;
            if (0 !== (h.flags & 2048)) try {
              switch (h.tag) {
                case 0:
                case 11:
                case 15:
                  Qj(9, h);
              }
            } catch (na) {
              W(h, h.return, na);
            }
            if (h === g) {
              V = null;
              break b;
            }
            var F2 = h.sibling;
            if (null !== F2) {
              F2.return = h.return;
              V = F2;
              break b;
            }
            V = h.return;
          }
        }
        K = e;
        jg();
        if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
          lc.onPostCommitFiberRoot(kc, a);
        } catch (na) {
        }
        d = true;
      }
      return d;
    } finally {
      C = c, ok.transition = b;
    }
  }
  return false;
}
function Xk(a, b, c) {
  b = Ji(c, b);
  b = Ni(a, b, 1);
  a = nh(a, b, 1);
  b = R();
  null !== a && (Ac(a, 1, b), Dk(a, b));
}
function W(a, b, c) {
  if (3 === a.tag) Xk(a, a, c);
  else for (; null !== b; ) {
    if (3 === b.tag) {
      Xk(b, a, c);
      break;
    } else if (1 === b.tag) {
      var d = b.stateNode;
      if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Ri || !Ri.has(d))) {
        a = Ji(c, a);
        a = Qi(b, a, 1);
        b = nh(b, a, 1);
        a = R();
        null !== b && (Ac(b, 1, a), Dk(b, a));
        break;
      }
    }
    b = b.return;
  }
}
function Ti(a, b, c) {
  var d = a.pingCache;
  null !== d && d.delete(b);
  b = R();
  a.pingedLanes |= a.suspendedLanes & c;
  Q === a && (Z & c) === c && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B() - fk ? Kk(a, 0) : rk |= c);
  Dk(a, b);
}
function Yk(a, b) {
  0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
  var c = R();
  a = ih(a, b);
  null !== a && (Ac(a, b, c), Dk(a, c));
}
function uj(a) {
  var b = a.memoizedState, c = 0;
  null !== b && (c = b.retryLane);
  Yk(a, c);
}
function bk(a, b) {
  var c = 0;
  switch (a.tag) {
    case 13:
      var d = a.stateNode;
      var e = a.memoizedState;
      null !== e && (c = e.retryLane);
      break;
    case 19:
      d = a.stateNode;
      break;
    default:
      throw Error(p(314));
  }
  null !== d && d.delete(b);
  Yk(a, c);
}
var Vk;
Vk = function(a, b, c) {
  if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) dh = true;
  else {
    if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return dh = false, yj(a, b, c);
    dh = 0 !== (a.flags & 131072) ? true : false;
  }
  else dh = false, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
  b.lanes = 0;
  switch (b.tag) {
    case 2:
      var d = b.type;
      ij(a, b);
      a = b.pendingProps;
      var e = Yf(b, H.current);
      ch(b, c);
      e = Nh(null, b, d, a, e, c);
      var f2 = Sh();
      b.flags |= 1;
      "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f2 = true, cg(b)) : f2 = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, kh(b), e.updater = Ei, b.stateNode = e, e._reactInternals = b, Ii(b, d, a, c), b = jj(null, b, d, true, f2, c)) : (b.tag = 0, I && f2 && vg(b), Xi(null, b, e, c), b = b.child);
      return b;
    case 16:
      d = b.elementType;
      a: {
        ij(a, b);
        a = b.pendingProps;
        e = d._init;
        d = e(d._payload);
        b.type = d;
        e = b.tag = Zk(d);
        a = Ci(d, a);
        switch (e) {
          case 0:
            b = cj(null, b, d, a, c);
            break a;
          case 1:
            b = hj(null, b, d, a, c);
            break a;
          case 11:
            b = Yi(null, b, d, a, c);
            break a;
          case 14:
            b = $i(null, b, d, Ci(d.type, a), c);
            break a;
        }
        throw Error(p(
          306,
          d,
          ""
        ));
      }
      return b;
    case 0:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), cj(a, b, d, e, c);
    case 1:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), hj(a, b, d, e, c);
    case 3:
      a: {
        kj(b);
        if (null === a) throw Error(p(387));
        d = b.pendingProps;
        f2 = b.memoizedState;
        e = f2.element;
        lh(a, b);
        qh(b, d, null, c);
        var g = b.memoizedState;
        d = g.element;
        if (f2.isDehydrated) if (f2 = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f2, b.memoizedState = f2, b.flags & 256) {
          e = Ji(Error(p(423)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else if (d !== e) {
          e = Ji(Error(p(424)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = true, zg = null, c = Vg(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
        else {
          Ig();
          if (d === e) {
            b = Zi(a, b, c);
            break a;
          }
          Xi(a, b, d, c);
        }
        b = b.child;
      }
      return b;
    case 5:
      return Ah(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f2 = null !== a ? a.memoizedProps : null, g = e.children, Ef(d, e) ? g = null : null !== f2 && Ef(d, f2) && (b.flags |= 32), gj(a, b), Xi(a, b, g, c), b.child;
    case 6:
      return null === a && Eg(b), null;
    case 13:
      return oj(a, b, c);
    case 4:
      return yh(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Ug(b, null, d, c) : Xi(a, b, d, c), b.child;
    case 11:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), Yi(a, b, d, e, c);
    case 7:
      return Xi(a, b, b.pendingProps, c), b.child;
    case 8:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 12:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 10:
      a: {
        d = b.type._context;
        e = b.pendingProps;
        f2 = b.memoizedProps;
        g = e.value;
        G(Wg, d._currentValue);
        d._currentValue = g;
        if (null !== f2) if (He(f2.value, g)) {
          if (f2.children === e.children && !Wf.current) {
            b = Zi(a, b, c);
            break a;
          }
        } else for (f2 = b.child, null !== f2 && (f2.return = b); null !== f2; ) {
          var h = f2.dependencies;
          if (null !== h) {
            g = f2.child;
            for (var k2 = h.firstContext; null !== k2; ) {
              if (k2.context === d) {
                if (1 === f2.tag) {
                  k2 = mh(-1, c & -c);
                  k2.tag = 2;
                  var l2 = f2.updateQueue;
                  if (null !== l2) {
                    l2 = l2.shared;
                    var m2 = l2.pending;
                    null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                    l2.pending = k2;
                  }
                }
                f2.lanes |= c;
                k2 = f2.alternate;
                null !== k2 && (k2.lanes |= c);
                bh(
                  f2.return,
                  c,
                  b
                );
                h.lanes |= c;
                break;
              }
              k2 = k2.next;
            }
          } else if (10 === f2.tag) g = f2.type === b.type ? null : f2.child;
          else if (18 === f2.tag) {
            g = f2.return;
            if (null === g) throw Error(p(341));
            g.lanes |= c;
            h = g.alternate;
            null !== h && (h.lanes |= c);
            bh(g, c, b);
            g = f2.sibling;
          } else g = f2.child;
          if (null !== g) g.return = f2;
          else for (g = f2; null !== g; ) {
            if (g === b) {
              g = null;
              break;
            }
            f2 = g.sibling;
            if (null !== f2) {
              f2.return = g.return;
              g = f2;
              break;
            }
            g = g.return;
          }
          f2 = g;
        }
        Xi(a, b, e.children, c);
        b = b.child;
      }
      return b;
    case 9:
      return e = b.type, d = b.pendingProps.children, ch(b, c), e = eh(e), d = d(e), b.flags |= 1, Xi(a, b, d, c), b.child;
    case 14:
      return d = b.type, e = Ci(d, b.pendingProps), e = Ci(d.type, e), $i(a, b, d, e, c);
    case 15:
      return bj(a, b, b.type, b.pendingProps, c);
    case 17:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), ij(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, ch(b, c), Gi(b, d, e), Ii(b, d, e, c), jj(null, b, d, true, a, c);
    case 19:
      return xj(a, b, c);
    case 22:
      return dj(a, b, c);
  }
  throw Error(p(156, b.tag));
};
function Fk(a, b) {
  return ac(a, b);
}
function $k(a, b, c, d) {
  this.tag = a;
  this.key = c;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = b;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = d;
  this.subtreeFlags = this.flags = 0;
  this.deletions = null;
  this.childLanes = this.lanes = 0;
  this.alternate = null;
}
function Bg(a, b, c, d) {
  return new $k(a, b, c, d);
}
function aj(a) {
  a = a.prototype;
  return !(!a || !a.isReactComponent);
}
function Zk(a) {
  if ("function" === typeof a) return aj(a) ? 1 : 0;
  if (void 0 !== a && null !== a) {
    a = a.$$typeof;
    if (a === Da) return 11;
    if (a === Ga) return 14;
  }
  return 2;
}
function Pg(a, b) {
  var c = a.alternate;
  null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
  c.flags = a.flags & 14680064;
  c.childLanes = a.childLanes;
  c.lanes = a.lanes;
  c.child = a.child;
  c.memoizedProps = a.memoizedProps;
  c.memoizedState = a.memoizedState;
  c.updateQueue = a.updateQueue;
  b = a.dependencies;
  c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
  c.sibling = a.sibling;
  c.index = a.index;
  c.ref = a.ref;
  return c;
}
function Rg(a, b, c, d, e, f2) {
  var g = 2;
  d = a;
  if ("function" === typeof a) aj(a) && (g = 1);
  else if ("string" === typeof a) g = 5;
  else a: switch (a) {
    case ya:
      return Tg(c.children, e, f2, b);
    case za:
      g = 8;
      e |= 8;
      break;
    case Aa:
      return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f2, a;
    case Ea:
      return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f2, a;
    case Fa:
      return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f2, a;
    case Ia:
      return pj(c, e, f2, b);
    default:
      if ("object" === typeof a && null !== a) switch (a.$$typeof) {
        case Ba:
          g = 10;
          break a;
        case Ca:
          g = 9;
          break a;
        case Da:
          g = 11;
          break a;
        case Ga:
          g = 14;
          break a;
        case Ha:
          g = 16;
          d = null;
          break a;
      }
      throw Error(p(130, null == a ? a : typeof a, ""));
  }
  b = Bg(g, c, b, e);
  b.elementType = a;
  b.type = d;
  b.lanes = f2;
  return b;
}
function Tg(a, b, c, d) {
  a = Bg(7, a, d, b);
  a.lanes = c;
  return a;
}
function pj(a, b, c, d) {
  a = Bg(22, a, d, b);
  a.elementType = Ia;
  a.lanes = c;
  a.stateNode = { isHidden: false };
  return a;
}
function Qg(a, b, c) {
  a = Bg(6, a, null, b);
  a.lanes = c;
  return a;
}
function Sg(a, b, c) {
  b = Bg(4, null !== a.children ? a.children : [], a.key, b);
  b.lanes = c;
  b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
  return b;
}
function al(a, b, c, d, e) {
  this.tag = b;
  this.containerInfo = a;
  this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
  this.timeoutHandle = -1;
  this.callbackNode = this.pendingContext = this.context = null;
  this.callbackPriority = 0;
  this.eventTimes = zc(0);
  this.expirationTimes = zc(-1);
  this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
  this.entanglements = zc(0);
  this.identifierPrefix = d;
  this.onRecoverableError = e;
  this.mutableSourceEagerHydrationData = null;
}
function bl(a, b, c, d, e, f2, g, h, k2) {
  a = new al(a, b, c, h, k2);
  1 === b ? (b = 1, true === f2 && (b |= 8)) : b = 0;
  f2 = Bg(3, null, null, b);
  a.current = f2;
  f2.stateNode = a;
  f2.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
  kh(f2);
  return a;
}
function cl(a, b, c) {
  var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
  return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
}
function dl(a) {
  if (!a) return Vf;
  a = a._reactInternals;
  a: {
    if (Vb(a) !== a || 1 !== a.tag) throw Error(p(170));
    var b = a;
    do {
      switch (b.tag) {
        case 3:
          b = b.stateNode.context;
          break a;
        case 1:
          if (Zf(b.type)) {
            b = b.stateNode.__reactInternalMemoizedMergedChildContext;
            break a;
          }
      }
      b = b.return;
    } while (null !== b);
    throw Error(p(171));
  }
  if (1 === a.tag) {
    var c = a.type;
    if (Zf(c)) return bg(a, c, b);
  }
  return b;
}
function el(a, b, c, d, e, f2, g, h, k2) {
  a = bl(c, d, true, a, e, f2, g, h, k2);
  a.context = dl(null);
  c = a.current;
  d = R();
  e = yi(c);
  f2 = mh(d, e);
  f2.callback = void 0 !== b && null !== b ? b : null;
  nh(c, f2, e);
  a.current.lanes = e;
  Ac(a, e, d);
  Dk(a, d);
  return a;
}
function fl(a, b, c, d) {
  var e = b.current, f2 = R(), g = yi(e);
  c = dl(c);
  null === b.context ? b.context = c : b.pendingContext = c;
  b = mh(f2, g);
  b.payload = { element: a };
  d = void 0 === d ? null : d;
  null !== d && (b.callback = d);
  a = nh(e, b, g);
  null !== a && (gi(a, e, g, f2), oh(a, e, g));
  return g;
}
function gl(a) {
  a = a.current;
  if (!a.child) return null;
  switch (a.child.tag) {
    case 5:
      return a.child.stateNode;
    default:
      return a.child.stateNode;
  }
}
function hl(a, b) {
  a = a.memoizedState;
  if (null !== a && null !== a.dehydrated) {
    var c = a.retryLane;
    a.retryLane = 0 !== c && c < b ? c : b;
  }
}
function il(a, b) {
  hl(a, b);
  (a = a.alternate) && hl(a, b);
}
function jl() {
  return null;
}
var kl = "function" === typeof reportError ? reportError : function(a) {
  console.error(a);
};
function ll(a) {
  this._internalRoot = a;
}
ml.prototype.render = ll.prototype.render = function(a) {
  var b = this._internalRoot;
  if (null === b) throw Error(p(409));
  fl(a, b, null, null);
};
ml.prototype.unmount = ll.prototype.unmount = function() {
  var a = this._internalRoot;
  if (null !== a) {
    this._internalRoot = null;
    var b = a.containerInfo;
    Rk(function() {
      fl(null, a, null, null);
    });
    b[uf] = null;
  }
};
function ml(a) {
  this._internalRoot = a;
}
ml.prototype.unstable_scheduleHydration = function(a) {
  if (a) {
    var b = Hc();
    a = { blockedOn: null, target: a, priority: b };
    for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++) ;
    Qc.splice(c, 0, a);
    0 === c && Vc(a);
  }
};
function nl(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
}
function ol(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
}
function pl() {
}
function ql(a, b, c, d, e) {
  if (e) {
    if ("function" === typeof d) {
      var f2 = d;
      d = function() {
        var a2 = gl(g);
        f2.call(a2);
      };
    }
    var g = el(b, d, a, 0, null, false, false, "", pl);
    a._reactRootContainer = g;
    a[uf] = g.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    Rk();
    return g;
  }
  for (; e = a.lastChild; ) a.removeChild(e);
  if ("function" === typeof d) {
    var h = d;
    d = function() {
      var a2 = gl(k2);
      h.call(a2);
    };
  }
  var k2 = bl(a, 0, false, null, null, false, false, "", pl);
  a._reactRootContainer = k2;
  a[uf] = k2.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  Rk(function() {
    fl(b, k2, c, d);
  });
  return k2;
}
function rl(a, b, c, d, e) {
  var f2 = c._reactRootContainer;
  if (f2) {
    var g = f2;
    if ("function" === typeof e) {
      var h = e;
      e = function() {
        var a2 = gl(g);
        h.call(a2);
      };
    }
    fl(b, g, a, e);
  } else g = ql(c, b, a, e, d);
  return gl(g);
}
Ec = function(a) {
  switch (a.tag) {
    case 3:
      var b = a.stateNode;
      if (b.current.memoizedState.isDehydrated) {
        var c = tc(b.pendingLanes);
        0 !== c && (Cc(b, c | 1), Dk(b, B()), 0 === (K & 6) && (Gj = B() + 500, jg()));
      }
      break;
    case 13:
      Rk(function() {
        var b2 = ih(a, 1);
        if (null !== b2) {
          var c2 = R();
          gi(b2, a, 1, c2);
        }
      }), il(a, 1);
  }
};
Fc = function(a) {
  if (13 === a.tag) {
    var b = ih(a, 134217728);
    if (null !== b) {
      var c = R();
      gi(b, a, 134217728, c);
    }
    il(a, 134217728);
  }
};
Gc = function(a) {
  if (13 === a.tag) {
    var b = yi(a), c = ih(a, b);
    if (null !== c) {
      var d = R();
      gi(c, a, b, d);
    }
    il(a, b);
  }
};
Hc = function() {
  return C;
};
Ic = function(a, b) {
  var c = C;
  try {
    return C = a, b();
  } finally {
    C = c;
  }
};
yb = function(a, b, c) {
  switch (b) {
    case "input":
      bb(a, c);
      b = c.name;
      if ("radio" === c.type && null != b) {
        for (c = a; c.parentNode; ) c = c.parentNode;
        c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
        for (b = 0; b < c.length; b++) {
          var d = c[b];
          if (d !== a && d.form === a.form) {
            var e = Db(d);
            if (!e) throw Error(p(90));
            Wa(d);
            bb(d, e);
          }
        }
      }
      break;
    case "textarea":
      ib(a, c);
      break;
    case "select":
      b = c.value, null != b && fb(a, !!c.multiple, b, false);
  }
};
Gb = Qk;
Hb = Rk;
var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] }, tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
  a = Zb(a);
  return null === a ? null : a.stateNode;
}, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
  var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!vl.isDisabled && vl.supportsFiber) try {
    kc = vl.inject(ul), lc = vl;
  } catch (a) {
  }
}
reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
reactDom_production_min.createPortal = function(a, b) {
  var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
  if (!nl(b)) throw Error(p(200));
  return cl(a, b, null, c);
};
reactDom_production_min.createRoot = function(a, b) {
  if (!nl(a)) throw Error(p(299));
  var c = false, d = "", e = kl;
  null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
  b = bl(a, 1, false, null, null, c, false, d, e);
  a[uf] = b.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  return new ll(b);
};
reactDom_production_min.findDOMNode = function(a) {
  if (null == a) return null;
  if (1 === a.nodeType) return a;
  var b = a._reactInternals;
  if (void 0 === b) {
    if ("function" === typeof a.render) throw Error(p(188));
    a = Object.keys(a).join(",");
    throw Error(p(268, a));
  }
  a = Zb(b);
  a = null === a ? null : a.stateNode;
  return a;
};
reactDom_production_min.flushSync = function(a) {
  return Rk(a);
};
reactDom_production_min.hydrate = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, true, c);
};
reactDom_production_min.hydrateRoot = function(a, b, c) {
  if (!nl(a)) throw Error(p(405));
  var d = null != c && c.hydratedSources || null, e = false, f2 = "", g = kl;
  null !== c && void 0 !== c && (true === c.unstable_strictMode && (e = true), void 0 !== c.identifierPrefix && (f2 = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
  b = el(b, null, a, 1, null != c ? c : null, e, false, f2, g);
  a[uf] = b.current;
  sf(a);
  if (d) for (a = 0; a < d.length; a++) c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(
    c,
    e
  );
  return new ml(b);
};
reactDom_production_min.render = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, false, c);
};
reactDom_production_min.unmountComponentAtNode = function(a) {
  if (!ol(a)) throw Error(p(40));
  return a._reactRootContainer ? (Rk(function() {
    rl(null, null, a, false, function() {
      a._reactRootContainer = null;
      a[uf] = null;
    });
  }), true) : false;
};
reactDom_production_min.unstable_batchedUpdates = Qk;
reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
  if (!ol(c)) throw Error(p(200));
  if (null == a || void 0 === a._reactInternals) throw Error(p(38));
  return rl(a, b, c, false, d);
};
reactDom_production_min.version = "18.3.1-next-f1338f8080-20240426";
function checkDCE() {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
    return;
  }
  try {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    console.error(err);
  }
}
{
  checkDCE();
  reactDom.exports = reactDom_production_min;
}
var reactDomExports = reactDom.exports;
var createRoot;
var m = reactDomExports;
{
  createRoot = m.createRoot;
  m.hydrateRoot;
}
const {
  createElement,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect: useEffect$2,
  useImperativeHandle,
  useLayoutEffect: useLayoutEffect$1,
  useMemo: useMemo$1,
  useRef: useRef$1,
  useState: useState$1
} = React$3;
const useId = React$3["useId".toString()];
const useIsomorphicLayoutEffect = useLayoutEffect$1;
const wrappedUseId = typeof useId === "function" ? useId : () => null;
let counter = 0;
function useUniqueId(idFromParams = null) {
  const idFromUseId = wrappedUseId();
  const idRef = useRef$1(idFromParams || idFromUseId || null);
  if (idRef.current === null) {
    idRef.current = "" + counter++;
  }
  return idRef.current;
}
const PanelGroupContext = createContext(null);
PanelGroupContext.displayName = "PanelGroupContext";
function PanelWithForwardedRef({
  children: children2 = null,
  className: classNameFromProps = "",
  collapsedSize = 0,
  collapsible = false,
  defaultSize: defaultSize2 = null,
  forwardedRef,
  id: idFromProps = null,
  maxSize = null,
  minSize,
  onCollapse = null,
  onResize = null,
  order = null,
  style: styleFromProps = {},
  tagName: Type = "div"
}) {
  const context = useContext(PanelGroupContext);
  if (context === null) {
    throw Error(`Panel components must be rendered within a PanelGroup container`);
  }
  const panelId = useUniqueId(idFromProps);
  const {
    collapsePanel,
    expandPanel,
    getPanelSize,
    getPanelStyle,
    registerPanel,
    resizePanel,
    units,
    unregisterPanel
  } = context;
  if (minSize == null) {
    if (units === "percentages") {
      minSize = 10;
    } else {
      minSize = 0;
    }
  }
  const callbacksRef = useRef$1({
    onCollapse,
    onResize
  });
  useEffect$2(() => {
    callbacksRef.current.onCollapse = onCollapse;
    callbacksRef.current.onResize = onResize;
  });
  const style2 = getPanelStyle(panelId, defaultSize2);
  const committedValuesRef = useRef$1({
    size: parseSizeFromStyle(style2)
  });
  const panelDataRef = useRef$1({
    callbacksRef,
    collapsedSize,
    collapsible,
    defaultSize: defaultSize2,
    id: panelId,
    idWasAutoGenerated: idFromProps == null,
    maxSize,
    minSize,
    order
  });
  useIsomorphicLayoutEffect(() => {
    committedValuesRef.current.size = parseSizeFromStyle(style2);
    panelDataRef.current.callbacksRef = callbacksRef;
    panelDataRef.current.collapsedSize = collapsedSize;
    panelDataRef.current.collapsible = collapsible;
    panelDataRef.current.defaultSize = defaultSize2;
    panelDataRef.current.id = panelId;
    panelDataRef.current.idWasAutoGenerated = idFromProps == null;
    panelDataRef.current.maxSize = maxSize;
    panelDataRef.current.minSize = minSize;
    panelDataRef.current.order = order;
  });
  useIsomorphicLayoutEffect(() => {
    registerPanel(panelId, panelDataRef);
    return () => {
      unregisterPanel(panelId);
    };
  }, [order, panelId, registerPanel, unregisterPanel]);
  useImperativeHandle(forwardedRef, () => ({
    collapse: () => collapsePanel(panelId),
    expand: () => expandPanel(panelId),
    getCollapsed() {
      return committedValuesRef.current.size === 0;
    },
    getId() {
      return panelId;
    },
    getSize(units2) {
      return getPanelSize(panelId, units2);
    },
    resize: (percentage, units2) => resizePanel(panelId, percentage, units2)
  }), [collapsePanel, expandPanel, getPanelSize, panelId, resizePanel]);
  return createElement(Type, {
    children: children2,
    className: classNameFromProps,
    "data-panel": "",
    "data-panel-collapsible": collapsible || void 0,
    "data-panel-id": panelId,
    "data-panel-size": parseFloat("" + style2.flexGrow).toFixed(1),
    id: `data-panel-id-${panelId}`,
    style: {
      ...style2,
      ...styleFromProps
    }
  });
}
const Panel$1 = forwardRef((props, ref) => createElement(PanelWithForwardedRef, {
  ...props,
  forwardedRef: ref
}));
PanelWithForwardedRef.displayName = "Panel";
Panel$1.displayName = "forwardRef(Panel)";
function parseSizeFromStyle(style2) {
  const {
    flexGrow
  } = style2;
  if (typeof flexGrow === "string") {
    return parseFloat(flexGrow);
  } else {
    return flexGrow;
  }
}
const PRECISION = 10;
function adjustByDelta(event, committedValues, idBefore, idAfter, deltaPixels, prevSizes, panelSizeBeforeCollapse, initialDragState) {
  const {
    id: groupId,
    panels,
    units
  } = committedValues;
  const groupSizePixels = units === "pixels" ? getAvailableGroupSizePixels(groupId) : NaN;
  const {
    sizes: initialSizes
  } = initialDragState || {};
  const baseSizes = initialSizes || prevSizes;
  const panelsArray = panelsMapToSortedArray(panels);
  const nextSizes = baseSizes.concat();
  let deltaApplied = 0;
  {
    const pivotId2 = deltaPixels < 0 ? idAfter : idBefore;
    const index2 = panelsArray.findIndex((panel2) => panel2.current.id === pivotId2);
    const panel = panelsArray[index2];
    const baseSize = baseSizes[index2];
    const nextSize = safeResizePanel(units, groupSizePixels, panel, baseSize, baseSize + Math.abs(deltaPixels), event);
    if (baseSize === nextSize) {
      return baseSizes;
    } else {
      if (nextSize === 0 && baseSize > 0) {
        panelSizeBeforeCollapse.set(pivotId2, baseSize);
      }
      deltaPixels = deltaPixels < 0 ? baseSize - nextSize : nextSize - baseSize;
    }
  }
  let pivotId = deltaPixels < 0 ? idBefore : idAfter;
  let index = panelsArray.findIndex((panel) => panel.current.id === pivotId);
  while (true) {
    const panel = panelsArray[index];
    const baseSize = baseSizes[index];
    const deltaRemaining = Math.abs(deltaPixels) - Math.abs(deltaApplied);
    const nextSize = safeResizePanel(units, groupSizePixels, panel, baseSize, baseSize - deltaRemaining, event);
    if (baseSize !== nextSize) {
      if (nextSize === 0 && baseSize > 0) {
        panelSizeBeforeCollapse.set(panel.current.id, baseSize);
      }
      deltaApplied += baseSize - nextSize;
      nextSizes[index] = nextSize;
      if (deltaApplied.toPrecision(PRECISION).localeCompare(Math.abs(deltaPixels).toPrecision(PRECISION), void 0, {
        numeric: true
      }) >= 0) {
        break;
      }
    }
    if (deltaPixels < 0) {
      if (--index < 0) {
        break;
      }
    } else {
      if (++index >= panelsArray.length) {
        break;
      }
    }
  }
  if (deltaApplied === 0) {
    return baseSizes;
  }
  pivotId = deltaPixels < 0 ? idAfter : idBefore;
  index = panelsArray.findIndex((panel) => panel.current.id === pivotId);
  nextSizes[index] = baseSizes[index] + deltaApplied;
  return nextSizes;
}
function callPanelCallbacks(panelsArray, sizes, panelIdToLastNotifiedSizeMap) {
  sizes.forEach((size, index) => {
    const panelRef = panelsArray[index];
    if (!panelRef) {
      return;
    }
    const {
      callbacksRef,
      collapsedSize,
      collapsible,
      id: id2
    } = panelRef.current;
    const lastNotifiedSize = panelIdToLastNotifiedSizeMap[id2];
    if (lastNotifiedSize !== size) {
      panelIdToLastNotifiedSizeMap[id2] = size;
      const {
        onCollapse,
        onResize
      } = callbacksRef.current;
      if (onResize) {
        onResize(size, lastNotifiedSize);
      }
      if (collapsible && onCollapse) {
        if ((lastNotifiedSize == null || lastNotifiedSize === collapsedSize) && size !== collapsedSize) {
          onCollapse(false);
        } else if (lastNotifiedSize !== collapsedSize && size === collapsedSize) {
          onCollapse(true);
        }
      }
    }
  });
}
function calculateDefaultLayout({
  groupId,
  panels,
  units
}) {
  const groupSizePixels = units === "pixels" ? getAvailableGroupSizePixels(groupId) : NaN;
  const panelsArray = panelsMapToSortedArray(panels);
  const sizes = Array(panelsArray.length);
  let numPanelsWithSizes = 0;
  let remainingSize = 100;
  for (let index = 0; index < panelsArray.length; index++) {
    const panel = panelsArray[index];
    const {
      defaultSize: defaultSize2
    } = panel.current;
    if (defaultSize2 != null) {
      numPanelsWithSizes++;
      sizes[index] = units === "pixels" ? defaultSize2 / groupSizePixels * 100 : defaultSize2;
      remainingSize -= sizes[index];
    }
  }
  for (let index = 0; index < panelsArray.length; index++) {
    const panel = panelsArray[index];
    let {
      defaultSize: defaultSize2,
      id: id2,
      maxSize,
      minSize
    } = panel.current;
    if (defaultSize2 != null) {
      continue;
    }
    if (units === "pixels") {
      minSize = minSize / groupSizePixels * 100;
      if (maxSize != null) {
        maxSize = maxSize / groupSizePixels * 100;
      }
    }
    const remainingPanels = panelsArray.length - numPanelsWithSizes;
    const size = Math.min(maxSize != null ? maxSize : 100, Math.max(minSize, remainingSize / remainingPanels));
    sizes[index] = size;
    numPanelsWithSizes++;
    remainingSize -= size;
  }
  if (remainingSize !== 0) {
    for (let index = 0; index < panelsArray.length; index++) {
      const panel = panelsArray[index];
      let {
        maxSize,
        minSize
      } = panel.current;
      if (units === "pixels") {
        minSize = minSize / groupSizePixels * 100;
        if (maxSize != null) {
          maxSize = maxSize / groupSizePixels * 100;
        }
      }
      const size = Math.min(maxSize != null ? maxSize : 100, Math.max(minSize, sizes[index] + remainingSize));
      if (size !== sizes[index]) {
        remainingSize -= size - sizes[index];
        sizes[index] = size;
        if (Math.abs(remainingSize).toFixed(3) === "0.000") {
          break;
        }
      }
    }
  }
  if (Math.abs(remainingSize).toFixed(3) !== "0.000") ;
  return sizes;
}
function getBeforeAndAfterIds(id2, panelsArray) {
  if (panelsArray.length < 2) {
    return [null, null];
  }
  const index = panelsArray.findIndex((panel) => panel.current.id === id2);
  if (index < 0) {
    return [null, null];
  }
  const isLastPanel = index === panelsArray.length - 1;
  const idBefore = isLastPanel ? panelsArray[index - 1].current.id : id2;
  const idAfter = isLastPanel ? id2 : panelsArray[index + 1].current.id;
  return [idBefore, idAfter];
}
function getAvailableGroupSizePixels(groupId) {
  const panelGroupElement = getPanelGroup(groupId);
  if (panelGroupElement == null) {
    return NaN;
  }
  const direction = panelGroupElement.getAttribute("data-panel-group-direction");
  const resizeHandles = getResizeHandlesForGroup(groupId);
  if (direction === "horizontal") {
    return panelGroupElement.offsetWidth - resizeHandles.reduce((accumulated, handle) => {
      return accumulated + handle.offsetWidth;
    }, 0);
  } else {
    return panelGroupElement.offsetHeight - resizeHandles.reduce((accumulated, handle) => {
      return accumulated + handle.offsetHeight;
    }, 0);
  }
}
function getFlexGrow(panels, id2, sizes) {
  if (panels.size === 1) {
    return "100";
  }
  const panelsArray = panelsMapToSortedArray(panels);
  const index = panelsArray.findIndex((panel) => panel.current.id === id2);
  const size = sizes[index];
  if (size == null) {
    return "0";
  }
  return size.toPrecision(PRECISION);
}
function getPanel(id2) {
  const element2 = document.querySelector(`[data-panel-id="${id2}"]`);
  if (element2) {
    return element2;
  }
  return null;
}
function getPanelGroup(id2) {
  const element2 = document.querySelector(`[data-panel-group-id="${id2}"]`);
  if (element2) {
    return element2;
  }
  return null;
}
function getResizeHandle(id2) {
  const element2 = document.querySelector(`[data-panel-resize-handle-id="${id2}"]`);
  if (element2) {
    return element2;
  }
  return null;
}
function getResizeHandleIndex(id2) {
  const handles = getResizeHandles();
  const index = handles.findIndex((handle) => handle.getAttribute("data-panel-resize-handle-id") === id2);
  return index ?? null;
}
function getResizeHandles() {
  return Array.from(document.querySelectorAll(`[data-panel-resize-handle-id]`));
}
function getResizeHandlesForGroup(groupId) {
  return Array.from(document.querySelectorAll(`[data-panel-resize-handle-id][data-panel-group-id="${groupId}"]`));
}
function getResizeHandlePanelIds(groupId, handleId, panelsArray) {
  var _a, _b, _c, _d;
  const handle = getResizeHandle(handleId);
  const handles = getResizeHandlesForGroup(groupId);
  const index = handle ? handles.indexOf(handle) : -1;
  const idBefore = ((_b = (_a = panelsArray[index]) == null ? void 0 : _a.current) == null ? void 0 : _b.id) ?? null;
  const idAfter = ((_d = (_c = panelsArray[index + 1]) == null ? void 0 : _c.current) == null ? void 0 : _d.id) ?? null;
  return [idBefore, idAfter];
}
function panelsMapToSortedArray(panels) {
  return Array.from(panels.values()).sort((panelA, panelB) => {
    const orderA = panelA.current.order;
    const orderB = panelB.current.order;
    if (orderA == null && orderB == null) {
      return 0;
    } else if (orderA == null) {
      return -1;
    } else if (orderB == null) {
      return 1;
    } else {
      return orderA - orderB;
    }
  });
}
function safeResizePanel(units, groupSizePixels, panel, prevSize, nextSize, event = null) {
  var _a;
  let {
    collapsedSize,
    collapsible,
    maxSize,
    minSize
  } = panel.current;
  if (units === "pixels") {
    collapsedSize = collapsedSize / groupSizePixels * 100;
    if (maxSize != null) {
      maxSize = maxSize / groupSizePixels * 100;
    }
    minSize = minSize / groupSizePixels * 100;
  }
  if (collapsible) {
    if (prevSize > collapsedSize) {
      if (nextSize <= minSize / 2 + collapsedSize) {
        return collapsedSize;
      }
    } else {
      const isKeyboardEvent = (_a = event == null ? void 0 : event.type) == null ? void 0 : _a.startsWith("key");
      if (!isKeyboardEvent) {
        if (nextSize < minSize) {
          return collapsedSize;
        }
      }
    }
  }
  return Math.min(maxSize != null ? maxSize : 100, Math.max(minSize, nextSize));
}
function validatePanelProps(units, panelData) {
  const {
    collapsible,
    defaultSize: defaultSize2,
    maxSize,
    minSize
  } = panelData.current;
  if (minSize < 0 || units === "percentages" && minSize > 100) {
    panelData.current.minSize = 0;
  }
  if (maxSize != null) {
    if (maxSize < 0 || units === "percentages" && maxSize > 100) {
      panelData.current.maxSize = null;
    }
  }
  if (defaultSize2 !== null) {
    if (defaultSize2 < 0 || units === "percentages" && defaultSize2 > 100) {
      panelData.current.defaultSize = null;
    } else if (defaultSize2 < minSize && !collapsible) {
      panelData.current.defaultSize = minSize;
    } else if (maxSize != null && defaultSize2 > maxSize) {
      panelData.current.defaultSize = maxSize;
    }
  }
}
function validatePanelGroupLayout({
  groupId,
  panels,
  nextSizes,
  prevSizes,
  units
}) {
  nextSizes = [...nextSizes];
  const panelsArray = panelsMapToSortedArray(panels);
  const groupSizePixels = units === "pixels" ? getAvailableGroupSizePixels(groupId) : NaN;
  let remainingSize = 0;
  for (let index = 0; index < panelsArray.length; index++) {
    const panel = panelsArray[index];
    const prevSize = prevSizes[index];
    const nextSize = nextSizes[index];
    const safeNextSize = safeResizePanel(units, groupSizePixels, panel, prevSize, nextSize);
    if (nextSize != safeNextSize) {
      remainingSize += nextSize - safeNextSize;
      nextSizes[index] = safeNextSize;
    }
  }
  if (remainingSize.toFixed(3) !== "0.000") {
    for (let index = 0; index < panelsArray.length; index++) {
      const panel = panelsArray[index];
      let {
        maxSize,
        minSize
      } = panel.current;
      if (units === "pixels") {
        minSize = minSize / groupSizePixels * 100;
        if (maxSize != null) {
          maxSize = maxSize / groupSizePixels * 100;
        }
      }
      const size = Math.min(maxSize != null ? maxSize : 100, Math.max(minSize, nextSizes[index] + remainingSize));
      if (size !== nextSizes[index]) {
        remainingSize -= size - nextSizes[index];
        nextSizes[index] = size;
        if (Math.abs(remainingSize).toFixed(3) === "0.000") {
          break;
        }
      }
    }
  }
  if (remainingSize.toFixed(3) !== "0.000") ;
  return nextSizes;
}
function assert(expectedCondition, message = "Assertion failed!") {
  if (!expectedCondition) {
    console.error(message);
    throw Error(message);
  }
}
function useWindowSplitterPanelGroupBehavior({
  committedValuesRef,
  groupId,
  panels,
  setSizes,
  sizes,
  panelSizeBeforeCollapse
}) {
  useEffect$2(() => {
    const {
      direction,
      panels: panels2
    } = committedValuesRef.current;
    const groupElement = getPanelGroup(groupId);
    assert(groupElement != null, `No group found for id "${groupId}"`);
    const {
      height,
      width
    } = groupElement.getBoundingClientRect();
    const handles = getResizeHandlesForGroup(groupId);
    const cleanupFunctions = handles.map((handle) => {
      const handleId = handle.getAttribute("data-panel-resize-handle-id");
      const panelsArray = panelsMapToSortedArray(panels2);
      const [idBefore, idAfter] = getResizeHandlePanelIds(groupId, handleId, panelsArray);
      if (idBefore == null || idAfter == null) {
        return () => {
        };
      }
      let currentMinSize = 0;
      let currentMaxSize = 100;
      let totalMinSize = 0;
      let totalMaxSize = 0;
      panelsArray.forEach((panelData) => {
        const {
          id: id2,
          maxSize,
          minSize
        } = panelData.current;
        if (id2 === idBefore) {
          currentMinSize = minSize;
          currentMaxSize = maxSize != null ? maxSize : 100;
        } else {
          totalMinSize += minSize;
          totalMaxSize += maxSize != null ? maxSize : 100;
        }
      });
      const ariaValueMax = Math.min(currentMaxSize, 100 - totalMinSize);
      const ariaValueMin = Math.max(currentMinSize, (panelsArray.length - 1) * 100 - totalMaxSize);
      const flexGrow = getFlexGrow(panels2, idBefore, sizes);
      handle.setAttribute("aria-valuemax", "" + Math.round(ariaValueMax));
      handle.setAttribute("aria-valuemin", "" + Math.round(ariaValueMin));
      handle.setAttribute("aria-valuenow", "" + Math.round(parseInt(flexGrow)));
      const onKeyDown = (event) => {
        if (event.defaultPrevented) {
          return;
        }
        switch (event.key) {
          case "Enter": {
            event.preventDefault();
            const index = panelsArray.findIndex((panel) => panel.current.id === idBefore);
            if (index >= 0) {
              const panelData = panelsArray[index];
              const size = sizes[index];
              if (size != null) {
                let delta = 0;
                if (size.toPrecision(PRECISION) <= panelData.current.minSize.toPrecision(PRECISION)) {
                  delta = direction === "horizontal" ? width : height;
                } else {
                  delta = -(direction === "horizontal" ? width : height);
                }
                const nextSizes = adjustByDelta(event, committedValuesRef.current, idBefore, idAfter, delta, sizes, panelSizeBeforeCollapse.current, null);
                if (sizes !== nextSizes) {
                  setSizes(nextSizes);
                }
              }
            }
            break;
          }
        }
      };
      handle.addEventListener("keydown", onKeyDown);
      const panelBefore = getPanel(idBefore);
      if (panelBefore != null) {
        handle.setAttribute("aria-controls", panelBefore.id);
      }
      return () => {
        handle.removeAttribute("aria-valuemax");
        handle.removeAttribute("aria-valuemin");
        handle.removeAttribute("aria-valuenow");
        handle.removeEventListener("keydown", onKeyDown);
        if (panelBefore != null) {
          handle.removeAttribute("aria-controls");
        }
      };
    });
    return () => {
      cleanupFunctions.forEach((cleanupFunction) => cleanupFunction());
    };
  }, [committedValuesRef, groupId, panels, panelSizeBeforeCollapse, setSizes, sizes]);
}
function useWindowSplitterResizeHandlerBehavior({
  disabled,
  handleId,
  resizeHandler
}) {
  useEffect$2(() => {
    if (disabled || resizeHandler == null) {
      return;
    }
    const handleElement = getResizeHandle(handleId);
    if (handleElement == null) {
      return;
    }
    const onKeyDown = (event) => {
      if (event.defaultPrevented) {
        return;
      }
      switch (event.key) {
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
        case "ArrowUp":
        case "End":
        case "Home": {
          event.preventDefault();
          resizeHandler(event);
          break;
        }
        case "F6": {
          event.preventDefault();
          const handles = getResizeHandles();
          const index = getResizeHandleIndex(handleId);
          assert(index !== null);
          const nextIndex = event.shiftKey ? index > 0 ? index - 1 : handles.length - 1 : index + 1 < handles.length ? index + 1 : 0;
          const nextHandle = handles[nextIndex];
          nextHandle.focus();
          break;
        }
      }
    };
    handleElement.addEventListener("keydown", onKeyDown);
    return () => {
      handleElement.removeEventListener("keydown", onKeyDown);
    };
  }, [disabled, handleId, resizeHandler]);
}
function areEqual$1(arrayA, arrayB) {
  if (arrayA.length !== arrayB.length) {
    return false;
  }
  for (let index = 0; index < arrayA.length; index++) {
    if (arrayA[index] !== arrayB[index]) {
      return false;
    }
  }
  return true;
}
function getDragOffset(event, handleId, direction, initialOffset = 0, initialHandleElementRect = null) {
  const isHorizontal = direction === "horizontal";
  let pointerOffset = 0;
  if (isMouseEvent$1(event)) {
    pointerOffset = isHorizontal ? event.clientX : event.clientY;
  } else if (isTouchEvent(event)) {
    const firstTouch = event.touches[0];
    pointerOffset = isHorizontal ? firstTouch.screenX : firstTouch.screenY;
  } else {
    return 0;
  }
  const handleElement = getResizeHandle(handleId);
  const rect = initialHandleElementRect || handleElement.getBoundingClientRect();
  const elementOffset = isHorizontal ? rect.left : rect.top;
  return pointerOffset - elementOffset - initialOffset;
}
function getMovement(event, groupId, handleId, panelsArray, direction, prevSizes, initialDragState) {
  const {
    dragOffset = 0,
    dragHandleRect,
    sizes: initialSizes
  } = initialDragState || {};
  const baseSizes = initialSizes || prevSizes;
  if (isKeyDown(event)) {
    const isHorizontal = direction === "horizontal";
    const groupElement = getPanelGroup(groupId);
    const rect = groupElement.getBoundingClientRect();
    const groupSizeInPixels = isHorizontal ? rect.width : rect.height;
    const denominator = event.shiftKey ? 10 : 100;
    const delta = groupSizeInPixels / denominator;
    let movement = 0;
    switch (event.key) {
      case "ArrowDown":
        movement = isHorizontal ? 0 : delta;
        break;
      case "ArrowLeft":
        movement = isHorizontal ? -delta : 0;
        break;
      case "ArrowRight":
        movement = isHorizontal ? delta : 0;
        break;
      case "ArrowUp":
        movement = isHorizontal ? 0 : -delta;
        break;
      case "End":
        movement = groupSizeInPixels;
        break;
      case "Home":
        movement = -groupSizeInPixels;
        break;
    }
    const [idBefore, idAfter] = getResizeHandlePanelIds(groupId, handleId, panelsArray);
    const targetPanelId = movement < 0 ? idBefore : idAfter;
    const targetPanelIndex = panelsArray.findIndex((panel) => panel.current.id === targetPanelId);
    const targetPanel = panelsArray[targetPanelIndex];
    if (targetPanel.current.collapsible) {
      const baseSize = baseSizes[targetPanelIndex];
      if (baseSize === 0 || baseSize.toPrecision(PRECISION) === targetPanel.current.minSize.toPrecision(PRECISION)) {
        movement = movement < 0 ? -targetPanel.current.minSize * groupSizeInPixels : targetPanel.current.minSize * groupSizeInPixels;
      }
    }
    return movement;
  } else {
    return getDragOffset(event, handleId, direction, dragOffset, dragHandleRect);
  }
}
function isKeyDown(event) {
  return event.type === "keydown";
}
function isMouseEvent$1(event) {
  return event.type.startsWith("mouse");
}
function isTouchEvent(event) {
  return event.type.startsWith("touch");
}
let currentState = null;
let element = null;
function getCursorStyle(state) {
  switch (state) {
    case "horizontal":
      return "ew-resize";
    case "horizontal-max":
      return "w-resize";
    case "horizontal-min":
      return "e-resize";
    case "vertical":
      return "ns-resize";
    case "vertical-max":
      return "n-resize";
    case "vertical-min":
      return "s-resize";
  }
}
function resetGlobalCursorStyle() {
  if (element !== null) {
    document.head.removeChild(element);
    currentState = null;
    element = null;
  }
}
function setGlobalCursorStyle(state) {
  if (currentState === state) {
    return;
  }
  currentState = state;
  const style2 = getCursorStyle(state);
  if (element === null) {
    element = document.createElement("style");
    document.head.appendChild(element);
  }
  element.innerHTML = `*{cursor: ${style2}!important;}`;
}
function debounce(callback, durationMs = 10) {
  let timeoutId = null;
  let callable = (...args) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      callback(...args);
    }, durationMs);
  };
  return callable;
}
function getSerializationKey(panels) {
  return panels.map((panel) => {
    const {
      minSize,
      order
    } = panel.current;
    return order ? `${order}:${minSize}` : `${minSize}`;
  }).sort((a, b) => a.localeCompare(b)).join(",");
}
function loadSerializedPanelGroupState(autoSaveId, storage) {
  try {
    const serialized = storage.getItem(`PanelGroup:sizes:${autoSaveId}`);
    if (serialized) {
      const parsed = JSON.parse(serialized);
      if (typeof parsed === "object" && parsed != null) {
        return parsed;
      }
    }
  } catch (error) {
  }
  return null;
}
function loadPanelLayout(autoSaveId, panels, storage) {
  const state = loadSerializedPanelGroupState(autoSaveId, storage);
  if (state) {
    const key = getSerializationKey(panels);
    return state[key] ?? null;
  }
  return null;
}
function savePanelGroupLayout(autoSaveId, panels, sizes, storage) {
  const key = getSerializationKey(panels);
  const state = loadSerializedPanelGroupState(autoSaveId, storage) || {};
  state[key] = sizes;
  try {
    storage.setItem(`PanelGroup:sizes:${autoSaveId}`, JSON.stringify(state));
  } catch (error) {
    console.error(error);
  }
}
const debounceMap = {};
function initializeDefaultStorage(storageObject) {
  try {
    if (typeof localStorage !== "undefined") {
      storageObject.getItem = (name) => {
        return localStorage.getItem(name);
      };
      storageObject.setItem = (name, value) => {
        localStorage.setItem(name, value);
      };
    } else {
      throw new Error("localStorage not supported in this environment");
    }
  } catch (error) {
    console.error(error);
    storageObject.getItem = () => null;
    storageObject.setItem = () => {
    };
  }
}
const defaultStorage = {
  getItem: (name) => {
    initializeDefaultStorage(defaultStorage);
    return defaultStorage.getItem(name);
  },
  setItem: (name, value) => {
    initializeDefaultStorage(defaultStorage);
    defaultStorage.setItem(name, value);
  }
};
function PanelGroupWithForwardedRef({
  autoSaveId,
  children: children2 = null,
  className: classNameFromProps = "",
  direction,
  disablePointerEventsDuringResize = false,
  forwardedRef,
  id: idFromProps = null,
  onLayout,
  storage = defaultStorage,
  style: styleFromProps = {},
  tagName: Type = "div",
  units = "percentages"
}) {
  const groupId = useUniqueId(idFromProps);
  const [activeHandleId, setActiveHandleId] = useState$1(null);
  const [panels, setPanels] = useState$1(/* @__PURE__ */ new Map());
  const initialDragStateRef = useRef$1(null);
  useRef$1({
    didLogDefaultSizeWarning: false,
    didLogIdAndOrderWarning: false,
    didLogInvalidLayoutWarning: false,
    prevPanelIds: []
  });
  const callbacksRef = useRef$1({
    onLayout
  });
  useEffect$2(() => {
    callbacksRef.current.onLayout = onLayout;
  });
  const panelIdToLastNotifiedSizeMapRef = useRef$1({});
  const [sizes, setSizes] = useState$1([]);
  const panelSizeBeforeCollapse = useRef$1(/* @__PURE__ */ new Map());
  const prevDeltaRef = useRef$1(0);
  const committedValuesRef = useRef$1({
    direction,
    id: groupId,
    panels,
    sizes,
    units
  });
  useImperativeHandle(forwardedRef, () => ({
    getId: () => groupId,
    getLayout: (unitsFromParams) => {
      const {
        sizes: sizes2,
        units: unitsFromProps
      } = committedValuesRef.current;
      const units2 = unitsFromParams ?? unitsFromProps;
      if (units2 === "pixels") {
        const groupSizePixels = getAvailableGroupSizePixels(groupId);
        return sizes2.map((size) => size / 100 * groupSizePixels);
      } else {
        return sizes2;
      }
    },
    setLayout: (sizes2, unitsFromParams) => {
      const {
        id: groupId2,
        panels: panels2,
        sizes: prevSizes,
        units: units2
      } = committedValuesRef.current;
      if ((unitsFromParams || units2) === "pixels") {
        const groupSizePixels = getAvailableGroupSizePixels(groupId2);
        sizes2 = sizes2.map((size) => size / groupSizePixels * 100);
      }
      const panelIdToLastNotifiedSizeMap = panelIdToLastNotifiedSizeMapRef.current;
      const panelsArray = panelsMapToSortedArray(panels2);
      const nextSizes = validatePanelGroupLayout({
        groupId: groupId2,
        panels: panels2,
        nextSizes: sizes2,
        prevSizes,
        units: units2
      });
      if (!areEqual$1(prevSizes, nextSizes)) {
        setSizes(nextSizes);
        callPanelCallbacks(panelsArray, nextSizes, panelIdToLastNotifiedSizeMap);
      }
    }
  }), [groupId]);
  useIsomorphicLayoutEffect(() => {
    committedValuesRef.current.direction = direction;
    committedValuesRef.current.id = groupId;
    committedValuesRef.current.panels = panels;
    committedValuesRef.current.sizes = sizes;
    committedValuesRef.current.units = units;
  });
  useWindowSplitterPanelGroupBehavior({
    committedValuesRef,
    groupId,
    panels,
    setSizes,
    sizes,
    panelSizeBeforeCollapse
  });
  useEffect$2(() => {
    const {
      onLayout: onLayout2
    } = callbacksRef.current;
    const {
      panels: panels2,
      sizes: sizes2
    } = committedValuesRef.current;
    if (sizes2.length > 0) {
      if (onLayout2) {
        onLayout2(sizes2);
      }
      const panelIdToLastNotifiedSizeMap = panelIdToLastNotifiedSizeMapRef.current;
      const panelsArray = panelsMapToSortedArray(panels2);
      callPanelCallbacks(panelsArray, sizes2, panelIdToLastNotifiedSizeMap);
    }
  }, [sizes]);
  useIsomorphicLayoutEffect(() => {
    const {
      id: groupId2,
      sizes: sizes2,
      units: units2
    } = committedValuesRef.current;
    if (sizes2.length === panels.size) {
      return;
    }
    let defaultSizes = null;
    if (autoSaveId) {
      const panelsArray = panelsMapToSortedArray(panels);
      defaultSizes = loadPanelLayout(autoSaveId, panelsArray, storage);
    }
    if (defaultSizes != null) {
      const validatedSizes = validatePanelGroupLayout({
        groupId: groupId2,
        panels,
        nextSizes: defaultSizes,
        prevSizes: defaultSizes,
        units: units2
      });
      setSizes(validatedSizes);
    } else {
      const sizes3 = calculateDefaultLayout({
        groupId: groupId2,
        panels,
        units: units2
      });
      setSizes(sizes3);
    }
  }, [autoSaveId, panels, storage]);
  useEffect$2(() => {
    if (autoSaveId) {
      if (sizes.length === 0 || sizes.length !== panels.size) {
        return;
      }
      const panelsArray = panelsMapToSortedArray(panels);
      if (!debounceMap[autoSaveId]) {
        debounceMap[autoSaveId] = debounce(savePanelGroupLayout, 100);
      }
      debounceMap[autoSaveId](autoSaveId, panelsArray, sizes, storage);
    }
  }, [autoSaveId, panels, sizes, storage]);
  useIsomorphicLayoutEffect(() => {
    if (units === "pixels") {
      const resizeObserver = new ResizeObserver(() => {
        const {
          panels: panels2,
          sizes: prevSizes
        } = committedValuesRef.current;
        const nextSizes = validatePanelGroupLayout({
          groupId,
          panels: panels2,
          nextSizes: prevSizes,
          prevSizes,
          units
        });
        if (!areEqual$1(prevSizes, nextSizes)) {
          setSizes(nextSizes);
        }
      });
      resizeObserver.observe(getPanelGroup(groupId));
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [groupId, units]);
  const getPanelSize = useCallback((id2, unitsFromParams) => {
    const {
      panels: panels2,
      units: unitsFromProps
    } = committedValuesRef.current;
    const panelsArray = panelsMapToSortedArray(panels2);
    const index = panelsArray.findIndex((panel) => panel.current.id === id2);
    const size = sizes[index];
    const units2 = unitsFromParams ?? unitsFromProps;
    if (units2 === "pixels") {
      const groupSizePixels = getAvailableGroupSizePixels(groupId);
      return size / 100 * groupSizePixels;
    } else {
      return size;
    }
  }, [groupId, sizes]);
  const getPanelStyle = useCallback((id2, defaultSize2) => {
    const {
      panels: panels2
    } = committedValuesRef.current;
    if (panels2.size === 0) {
      return {
        flexBasis: 0,
        flexGrow: defaultSize2 != null ? defaultSize2 : void 0,
        flexShrink: 1,
        // Without this, Panel sizes may be unintentionally overridden by their content.
        overflow: "hidden"
      };
    }
    const flexGrow = getFlexGrow(panels2, id2, sizes);
    return {
      flexBasis: 0,
      flexGrow,
      flexShrink: 1,
      // Without this, Panel sizes may be unintentionally overridden by their content.
      overflow: "hidden",
      // Disable pointer events inside of a panel during resize.
      // This avoid edge cases like nested iframes.
      pointerEvents: disablePointerEventsDuringResize && activeHandleId !== null ? "none" : void 0
    };
  }, [activeHandleId, disablePointerEventsDuringResize, sizes]);
  const registerPanel = useCallback((id2, panelRef) => {
    const {
      units: units2
    } = committedValuesRef.current;
    validatePanelProps(units2, panelRef);
    setPanels((prevPanels) => {
      if (prevPanels.has(id2)) {
        return prevPanels;
      }
      const nextPanels = new Map(prevPanels);
      nextPanels.set(id2, panelRef);
      return nextPanels;
    });
  }, []);
  const registerResizeHandle = useCallback((handleId) => {
    const resizeHandler = (event) => {
      event.preventDefault();
      const {
        direction: direction2,
        panels: panels2,
        sizes: prevSizes
      } = committedValuesRef.current;
      const panelsArray = panelsMapToSortedArray(panels2);
      const [idBefore, idAfter] = getResizeHandlePanelIds(groupId, handleId, panelsArray);
      if (idBefore == null || idAfter == null) {
        return;
      }
      let movement = getMovement(event, groupId, handleId, panelsArray, direction2, prevSizes, initialDragStateRef.current);
      if (movement === 0) {
        return;
      }
      const groupElement = getPanelGroup(groupId);
      const rect = groupElement.getBoundingClientRect();
      const isHorizontal = direction2 === "horizontal";
      if (document.dir === "rtl" && isHorizontal) {
        movement = -movement;
      }
      const size = isHorizontal ? rect.width : rect.height;
      const delta = movement / size * 100;
      const nextSizes = adjustByDelta(event, committedValuesRef.current, idBefore, idAfter, delta, prevSizes, panelSizeBeforeCollapse.current, initialDragStateRef.current);
      const sizesChanged = !areEqual$1(prevSizes, nextSizes);
      if (isMouseEvent$1(event) || isTouchEvent(event)) {
        if (prevDeltaRef.current != delta) {
          if (!sizesChanged) {
            if (isHorizontal) {
              setGlobalCursorStyle(movement < 0 ? "horizontal-min" : "horizontal-max");
            } else {
              setGlobalCursorStyle(movement < 0 ? "vertical-min" : "vertical-max");
            }
          } else {
            setGlobalCursorStyle(isHorizontal ? "horizontal" : "vertical");
          }
        }
      }
      if (sizesChanged) {
        const panelIdToLastNotifiedSizeMap = panelIdToLastNotifiedSizeMapRef.current;
        setSizes(nextSizes);
        callPanelCallbacks(panelsArray, nextSizes, panelIdToLastNotifiedSizeMap);
      }
      prevDeltaRef.current = delta;
    };
    return resizeHandler;
  }, [groupId]);
  const unregisterPanel = useCallback((id2) => {
    setPanels((prevPanels) => {
      if (!prevPanels.has(id2)) {
        return prevPanels;
      }
      const nextPanels = new Map(prevPanels);
      nextPanels.delete(id2);
      return nextPanels;
    });
  }, []);
  const collapsePanel = useCallback((id2) => {
    const {
      panels: panels2,
      sizes: prevSizes
    } = committedValuesRef.current;
    const panel = panels2.get(id2);
    if (panel == null) {
      return;
    }
    const {
      collapsedSize,
      collapsible
    } = panel.current;
    if (!collapsible) {
      return;
    }
    const panelsArray = panelsMapToSortedArray(panels2);
    const index = panelsArray.indexOf(panel);
    if (index < 0) {
      return;
    }
    const currentSize = prevSizes[index];
    if (currentSize === collapsedSize) {
      return;
    }
    panelSizeBeforeCollapse.current.set(id2, currentSize);
    const [idBefore, idAfter] = getBeforeAndAfterIds(id2, panelsArray);
    if (idBefore == null || idAfter == null) {
      return;
    }
    const isLastPanel = index === panelsArray.length - 1;
    const delta = isLastPanel ? currentSize : collapsedSize - currentSize;
    const nextSizes = adjustByDelta(null, committedValuesRef.current, idBefore, idAfter, delta, prevSizes, panelSizeBeforeCollapse.current, null);
    if (prevSizes !== nextSizes) {
      const panelIdToLastNotifiedSizeMap = panelIdToLastNotifiedSizeMapRef.current;
      setSizes(nextSizes);
      callPanelCallbacks(panelsArray, nextSizes, panelIdToLastNotifiedSizeMap);
    }
  }, []);
  const expandPanel = useCallback((id2) => {
    const {
      panels: panels2,
      sizes: prevSizes
    } = committedValuesRef.current;
    const panel = panels2.get(id2);
    if (panel == null) {
      return;
    }
    const {
      collapsedSize,
      minSize
    } = panel.current;
    const sizeBeforeCollapse = panelSizeBeforeCollapse.current.get(id2) || minSize;
    if (!sizeBeforeCollapse) {
      return;
    }
    const panelsArray = panelsMapToSortedArray(panels2);
    const index = panelsArray.indexOf(panel);
    if (index < 0) {
      return;
    }
    const currentSize = prevSizes[index];
    if (currentSize !== collapsedSize) {
      return;
    }
    const [idBefore, idAfter] = getBeforeAndAfterIds(id2, panelsArray);
    if (idBefore == null || idAfter == null) {
      return;
    }
    const isLastPanel = index === panelsArray.length - 1;
    const delta = isLastPanel ? collapsedSize - sizeBeforeCollapse : sizeBeforeCollapse;
    const nextSizes = adjustByDelta(null, committedValuesRef.current, idBefore, idAfter, delta, prevSizes, panelSizeBeforeCollapse.current, null);
    if (prevSizes !== nextSizes) {
      const panelIdToLastNotifiedSizeMap = panelIdToLastNotifiedSizeMapRef.current;
      setSizes(nextSizes);
      callPanelCallbacks(panelsArray, nextSizes, panelIdToLastNotifiedSizeMap);
    }
  }, []);
  const resizePanel = useCallback((id2, nextSize, unitsFromParams) => {
    const {
      id: groupId2,
      panels: panels2,
      sizes: prevSizes,
      units: units2
    } = committedValuesRef.current;
    if ((unitsFromParams || units2) === "pixels") {
      const groupSizePixels = getAvailableGroupSizePixels(groupId2);
      nextSize = nextSize / groupSizePixels * 100;
    }
    const panel = panels2.get(id2);
    if (panel == null) {
      return;
    }
    let {
      collapsedSize,
      collapsible,
      maxSize,
      minSize
    } = panel.current;
    if (units2 === "pixels") {
      const groupSizePixels = getAvailableGroupSizePixels(groupId2);
      minSize = minSize / groupSizePixels * 100;
      if (maxSize != null) {
        maxSize = maxSize / groupSizePixels * 100;
      }
    }
    const panelsArray = panelsMapToSortedArray(panels2);
    const index = panelsArray.indexOf(panel);
    if (index < 0) {
      return;
    }
    const currentSize = prevSizes[index];
    if (currentSize === nextSize) {
      return;
    }
    if (collapsible && nextSize === collapsedSize) ;
    else {
      nextSize = Math.min(maxSize != null ? maxSize : 100, Math.max(minSize, nextSize));
    }
    const [idBefore, idAfter] = getBeforeAndAfterIds(id2, panelsArray);
    if (idBefore == null || idAfter == null) {
      return;
    }
    const isLastPanel = index === panelsArray.length - 1;
    const delta = isLastPanel ? currentSize - nextSize : nextSize - currentSize;
    const nextSizes = adjustByDelta(null, committedValuesRef.current, idBefore, idAfter, delta, prevSizes, panelSizeBeforeCollapse.current, null);
    if (prevSizes !== nextSizes) {
      const panelIdToLastNotifiedSizeMap = panelIdToLastNotifiedSizeMapRef.current;
      setSizes(nextSizes);
      callPanelCallbacks(panelsArray, nextSizes, panelIdToLastNotifiedSizeMap);
    }
  }, []);
  const context = useMemo$1(() => ({
    activeHandleId,
    collapsePanel,
    direction,
    expandPanel,
    getPanelSize,
    getPanelStyle,
    groupId,
    registerPanel,
    registerResizeHandle,
    resizePanel,
    startDragging: (id2, event) => {
      setActiveHandleId(id2);
      if (isMouseEvent$1(event) || isTouchEvent(event)) {
        const handleElement = getResizeHandle(id2);
        initialDragStateRef.current = {
          dragHandleRect: handleElement.getBoundingClientRect(),
          dragOffset: getDragOffset(event, id2, direction),
          sizes: committedValuesRef.current.sizes
        };
      }
    },
    stopDragging: () => {
      resetGlobalCursorStyle();
      setActiveHandleId(null);
      initialDragStateRef.current = null;
    },
    units,
    unregisterPanel
  }), [activeHandleId, collapsePanel, direction, expandPanel, getPanelSize, getPanelStyle, groupId, registerPanel, registerResizeHandle, resizePanel, units, unregisterPanel]);
  const style2 = {
    display: "flex",
    flexDirection: direction === "horizontal" ? "row" : "column",
    height: "100%",
    overflow: "hidden",
    width: "100%"
  };
  return createElement(PanelGroupContext.Provider, {
    children: createElement(Type, {
      children: children2,
      className: classNameFromProps,
      "data-panel-group": "",
      "data-panel-group-direction": direction,
      "data-panel-group-id": groupId,
      "data-panel-group-units": units,
      style: {
        ...style2,
        ...styleFromProps
      }
    }),
    value: context
  });
}
const PanelGroup = forwardRef((props, ref) => createElement(PanelGroupWithForwardedRef, {
  ...props,
  forwardedRef: ref
}));
PanelGroupWithForwardedRef.displayName = "PanelGroup";
PanelGroup.displayName = "forwardRef(PanelGroup)";
function PanelResizeHandle({
  children: children2 = null,
  className: classNameFromProps = "",
  disabled = false,
  id: idFromProps = null,
  onDragging,
  style: styleFromProps = {},
  tagName: Type = "div"
}) {
  const divElementRef = useRef$1(null);
  const callbacksRef = useRef$1({
    onDragging
  });
  useEffect$2(() => {
    callbacksRef.current.onDragging = onDragging;
  });
  const panelGroupContext = useContext(PanelGroupContext);
  if (panelGroupContext === null) {
    throw Error(`PanelResizeHandle components must be rendered within a PanelGroup container`);
  }
  const {
    activeHandleId,
    direction,
    groupId,
    registerResizeHandle,
    startDragging,
    stopDragging
  } = panelGroupContext;
  const resizeHandleId = useUniqueId(idFromProps);
  const isDragging = activeHandleId === resizeHandleId;
  const [isFocused, setIsFocused] = useState$1(false);
  const [resizeHandler, setResizeHandler] = useState$1(null);
  const stopDraggingAndBlur = useCallback(() => {
    const div = divElementRef.current;
    div.blur();
    stopDragging();
    const {
      onDragging: onDragging2
    } = callbacksRef.current;
    if (onDragging2) {
      onDragging2(false);
    }
  }, [stopDragging]);
  useEffect$2(() => {
    if (disabled) {
      setResizeHandler(null);
    } else {
      const resizeHandler2 = registerResizeHandle(resizeHandleId);
      setResizeHandler(() => resizeHandler2);
    }
  }, [disabled, resizeHandleId, registerResizeHandle]);
  useEffect$2(() => {
    if (disabled || resizeHandler == null || !isDragging) {
      return;
    }
    const onMove = (event) => {
      resizeHandler(event);
    };
    const onMouseLeave = (event) => {
      resizeHandler(event);
    };
    const divElement = divElementRef.current;
    const targetDocument = divElement.ownerDocument;
    targetDocument.body.addEventListener("contextmenu", stopDraggingAndBlur);
    targetDocument.body.addEventListener("mousemove", onMove);
    targetDocument.body.addEventListener("touchmove", onMove);
    targetDocument.body.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mouseup", stopDraggingAndBlur);
    window.addEventListener("touchend", stopDraggingAndBlur);
    return () => {
      targetDocument.body.removeEventListener("contextmenu", stopDraggingAndBlur);
      targetDocument.body.removeEventListener("mousemove", onMove);
      targetDocument.body.removeEventListener("touchmove", onMove);
      targetDocument.body.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mouseup", stopDraggingAndBlur);
      window.removeEventListener("touchend", stopDraggingAndBlur);
    };
  }, [direction, disabled, isDragging, resizeHandler, stopDraggingAndBlur]);
  useWindowSplitterResizeHandlerBehavior({
    disabled,
    handleId: resizeHandleId,
    resizeHandler
  });
  const style2 = {
    cursor: getCursorStyle(direction),
    touchAction: "none",
    userSelect: "none"
  };
  return createElement(Type, {
    children: children2,
    className: classNameFromProps,
    "data-resize-handle-active": isDragging ? "pointer" : isFocused ? "keyboard" : void 0,
    "data-panel-group-direction": direction,
    "data-panel-group-id": groupId,
    "data-panel-resize-handle-enabled": !disabled,
    "data-panel-resize-handle-id": resizeHandleId,
    onBlur: () => setIsFocused(false),
    onFocus: () => setIsFocused(true),
    onMouseDown: (event) => {
      startDragging(resizeHandleId, event.nativeEvent);
      const {
        onDragging: onDragging2
      } = callbacksRef.current;
      if (onDragging2) {
        onDragging2(true);
      }
    },
    onMouseUp: stopDraggingAndBlur,
    onTouchCancel: stopDraggingAndBlur,
    onTouchEnd: stopDraggingAndBlur,
    onTouchStart: (event) => {
      startDragging(resizeHandleId, event.nativeEvent);
      const {
        onDragging: onDragging2
      } = callbacksRef.current;
      if (onDragging2) {
        onDragging2(true);
      }
    },
    ref: divElementRef,
    role: "separator",
    style: {
      ...style2,
      ...styleFromProps
    },
    tabIndex: 0
  });
}
PanelResizeHandle.displayName = "PanelResizeHandle";
function cc(names) {
  if (typeof names === "string" || typeof names === "number") return "" + names;
  let out = "";
  if (Array.isArray(names)) {
    for (let i = 0, tmp; i < names.length; i++) {
      if ((tmp = cc(names[i])) !== "") {
        out += (out && " ") + tmp;
      }
    }
  } else {
    for (let k2 in names) {
      if (names[k2]) out += (out && " ") + k2;
    }
  }
  return out;
}
var withSelector = { exports: {} };
var withSelector_production = {};
var shim$2 = { exports: {} };
var useSyncExternalStoreShim_production = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React$1 = reactExports;
function is$1(x2, y2) {
  return x2 === y2 && (0 !== x2 || 1 / x2 === 1 / y2) || x2 !== x2 && y2 !== y2;
}
var objectIs$1 = "function" === typeof Object.is ? Object.is : is$1, useState = React$1.useState, useEffect$1 = React$1.useEffect, useLayoutEffect = React$1.useLayoutEffect, useDebugValue$2 = React$1.useDebugValue;
function useSyncExternalStore$2(subscribe, getSnapshot) {
  var value = getSnapshot(), _useState = useState({ inst: { value, getSnapshot } }), inst = _useState[0].inst, forceUpdate = _useState[1];
  useLayoutEffect(
    function() {
      inst.value = value;
      inst.getSnapshot = getSnapshot;
      checkIfSnapshotChanged(inst) && forceUpdate({ inst });
    },
    [subscribe, value, getSnapshot]
  );
  useEffect$1(
    function() {
      checkIfSnapshotChanged(inst) && forceUpdate({ inst });
      return subscribe(function() {
        checkIfSnapshotChanged(inst) && forceUpdate({ inst });
      });
    },
    [subscribe]
  );
  useDebugValue$2(value);
  return value;
}
function checkIfSnapshotChanged(inst) {
  var latestGetSnapshot = inst.getSnapshot;
  inst = inst.value;
  try {
    var nextValue = latestGetSnapshot();
    return !objectIs$1(inst, nextValue);
  } catch (error) {
    return true;
  }
}
function useSyncExternalStore$1(subscribe, getSnapshot) {
  return getSnapshot();
}
var shim$1 = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
useSyncExternalStoreShim_production.useSyncExternalStore = void 0 !== React$1.useSyncExternalStore ? React$1.useSyncExternalStore : shim$1;
{
  shim$2.exports = useSyncExternalStoreShim_production;
}
var shimExports = shim$2.exports;
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React = reactExports, shim = shimExports;
function is(x2, y2) {
  return x2 === y2 && (0 !== x2 || 1 / x2 === 1 / y2) || x2 !== x2 && y2 !== y2;
}
var objectIs = "function" === typeof Object.is ? Object.is : is, useSyncExternalStore = shim.useSyncExternalStore, useRef = React.useRef, useEffect = React.useEffect, useMemo = React.useMemo, useDebugValue$1 = React.useDebugValue;
withSelector_production.useSyncExternalStoreWithSelector = function(subscribe, getSnapshot, getServerSnapshot, selector2, isEqual) {
  var instRef = useRef(null);
  if (null === instRef.current) {
    var inst = { hasValue: false, value: null };
    instRef.current = inst;
  } else inst = instRef.current;
  instRef = useMemo(
    function() {
      function memoizedSelector(nextSnapshot) {
        if (!hasMemo) {
          hasMemo = true;
          memoizedSnapshot = nextSnapshot;
          nextSnapshot = selector2(nextSnapshot);
          if (void 0 !== isEqual && inst.hasValue) {
            var currentSelection = inst.value;
            if (isEqual(currentSelection, nextSnapshot))
              return memoizedSelection = currentSelection;
          }
          return memoizedSelection = nextSnapshot;
        }
        currentSelection = memoizedSelection;
        if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
        var nextSelection = selector2(nextSnapshot);
        if (void 0 !== isEqual && isEqual(currentSelection, nextSelection))
          return memoizedSnapshot = nextSnapshot, currentSelection;
        memoizedSnapshot = nextSnapshot;
        return memoizedSelection = nextSelection;
      }
      var hasMemo = false, memoizedSnapshot, memoizedSelection, maybeGetServerSnapshot = void 0 === getServerSnapshot ? null : getServerSnapshot;
      return [
        function() {
          return memoizedSelector(getSnapshot());
        },
        null === maybeGetServerSnapshot ? void 0 : function() {
          return memoizedSelector(maybeGetServerSnapshot());
        }
      ];
    },
    [getSnapshot, getServerSnapshot, selector2, isEqual]
  );
  var value = useSyncExternalStore(subscribe, instRef[0], instRef[1]);
  useEffect(
    function() {
      inst.hasValue = true;
      inst.value = value;
    },
    [value]
  );
  useDebugValue$1(value);
  return value;
};
{
  withSelector.exports = withSelector_production;
}
var withSelectorExports = withSelector.exports;
const useSyncExternalStoreExports = /* @__PURE__ */ getDefaultExportFromCjs(withSelectorExports);
const __vite_import_meta_env__ = {};
const createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState2;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const destroy = () => {
    if ((__vite_import_meta_env__ ? "production" : void 0) !== "production") {
      console.warn(
        "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
      );
    }
    listeners.clear();
  };
  const api = { setState, getState, getInitialState, subscribe, destroy };
  const initialState2 = state = createState(setState, getState, api);
  return api;
};
const createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;
const { useDebugValue } = React$2;
const { useSyncExternalStoreWithSelector } = useSyncExternalStoreExports;
const identity$2 = (arg) => arg;
function useStoreWithEqualityFn(api, selector2 = identity$2, equalityFn) {
  const slice = useSyncExternalStoreWithSelector(
    api.subscribe,
    api.getState,
    api.getServerState || api.getInitialState,
    selector2,
    equalityFn
  );
  useDebugValue(slice);
  return slice;
}
const createWithEqualityFnImpl = (createState, defaultEqualityFn) => {
  const api = createStore(createState);
  const useBoundStoreWithEqualityFn = (selector2, equalityFn = defaultEqualityFn) => useStoreWithEqualityFn(api, selector2, equalityFn);
  Object.assign(useBoundStoreWithEqualityFn, api);
  return useBoundStoreWithEqualityFn;
};
const createWithEqualityFn = (createState, defaultEqualityFn) => createState ? createWithEqualityFnImpl(createState, defaultEqualityFn) : createWithEqualityFnImpl;
function shallow$1(objA, objB) {
  if (Object.is(objA, objB)) {
    return true;
  }
  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
    return false;
  }
  if (objA instanceof Map && objB instanceof Map) {
    if (objA.size !== objB.size) return false;
    for (const [key, value] of objA) {
      if (!Object.is(value, objB.get(key))) {
        return false;
      }
    }
    return true;
  }
  if (objA instanceof Set && objB instanceof Set) {
    if (objA.size !== objB.size) return false;
    for (const value of objA) {
      if (!objB.has(value)) {
        return false;
      }
    }
    return true;
  }
  const keysA = Object.keys(objA);
  if (keysA.length !== Object.keys(objB).length) {
    return false;
  }
  for (const keyA of keysA) {
    if (!Object.prototype.hasOwnProperty.call(objB, keyA) || !Object.is(objA[keyA], objB[keyA])) {
      return false;
    }
  }
  return true;
}
var noop$1 = { value: () => {
} };
function dispatch() {
  for (var i = 0, n2 = arguments.length, _ = {}, t2; i < n2; ++i) {
    if (!(t2 = arguments[i] + "") || t2 in _ || /[\s.]/.test(t2)) throw new Error("illegal type: " + t2);
    _[t2] = [];
  }
  return new Dispatch(_);
}
function Dispatch(_) {
  this._ = _;
}
function parseTypenames$1(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function(t2) {
    var name = "", i = t2.indexOf(".");
    if (i >= 0) name = t2.slice(i + 1), t2 = t2.slice(0, i);
    if (t2 && !types.hasOwnProperty(t2)) throw new Error("unknown type: " + t2);
    return { type: t2, name };
  });
}
Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _ = this._, T2 = parseTypenames$1(typename + "", _), t2, i = -1, n2 = T2.length;
    if (arguments.length < 2) {
      while (++i < n2) if ((t2 = (typename = T2[i]).type) && (t2 = get$1(_[t2], typename.name))) return t2;
      return;
    }
    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
    while (++i < n2) {
      if (t2 = (typename = T2[i]).type) _[t2] = set$1(_[t2], typename.name, callback);
      else if (callback == null) for (t2 in _) _[t2] = set$1(_[t2], typename.name, null);
    }
    return this;
  },
  copy: function() {
    var copy = {}, _ = this._;
    for (var t2 in _) copy[t2] = _[t2].slice();
    return new Dispatch(copy);
  },
  call: function(type, that) {
    if ((n2 = arguments.length - 2) > 0) for (var args = new Array(n2), i = 0, n2, t2; i < n2; ++i) args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (t2 = this._[type], i = 0, n2 = t2.length; i < n2; ++i) t2[i].value.apply(that, args);
  },
  apply: function(type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (var t2 = this._[type], i = 0, n2 = t2.length; i < n2; ++i) t2[i].value.apply(that, args);
  }
};
function get$1(type, name) {
  for (var i = 0, n2 = type.length, c; i < n2; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}
function set$1(type, name, callback) {
  for (var i = 0, n2 = type.length; i < n2; ++i) {
    if (type[i].name === name) {
      type[i] = noop$1, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({ name, value: callback });
  return type;
}
var xhtml = "http://www.w3.org/1999/xhtml";
const namespaces = {
  svg: "http://www.w3.org/2000/svg",
  xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function namespace(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return namespaces.hasOwnProperty(prefix) ? { space: namespaces[prefix], local: name } : name;
}
function creatorInherit(name) {
  return function() {
    var document2 = this.ownerDocument, uri = this.namespaceURI;
    return uri === xhtml && document2.documentElement.namespaceURI === xhtml ? document2.createElement(name) : document2.createElementNS(uri, name);
  };
}
function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}
function creator(name) {
  var fullname = namespace(name);
  return (fullname.local ? creatorFixed : creatorInherit)(fullname);
}
function none() {
}
function selector$h(selector2) {
  return selector2 == null ? none : function() {
    return this.querySelector(selector2);
  };
}
function selection_select(select2) {
  if (typeof select2 !== "function") select2 = selector$h(select2);
  for (var groups = this._groups, m2 = groups.length, subgroups = new Array(m2), j = 0; j < m2; ++j) {
    for (var group = groups[j], n2 = group.length, subgroup = subgroups[j] = new Array(n2), node, subnode, i = 0; i < n2; ++i) {
      if ((node = group[i]) && (subnode = select2.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }
  return new Selection$1(subgroups, this._parents);
}
function array(x2) {
  return x2 == null ? [] : Array.isArray(x2) ? x2 : Array.from(x2);
}
function empty() {
  return [];
}
function selectorAll(selector2) {
  return selector2 == null ? empty : function() {
    return this.querySelectorAll(selector2);
  };
}
function arrayAll(select2) {
  return function() {
    return array(select2.apply(this, arguments));
  };
}
function selection_selectAll(select2) {
  if (typeof select2 === "function") select2 = arrayAll(select2);
  else select2 = selectorAll(select2);
  for (var groups = this._groups, m2 = groups.length, subgroups = [], parents = [], j = 0; j < m2; ++j) {
    for (var group = groups[j], n2 = group.length, node, i = 0; i < n2; ++i) {
      if (node = group[i]) {
        subgroups.push(select2.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }
  return new Selection$1(subgroups, parents);
}
function matcher(selector2) {
  return function() {
    return this.matches(selector2);
  };
}
function childMatcher(selector2) {
  return function(node) {
    return node.matches(selector2);
  };
}
var find = Array.prototype.find;
function childFind(match) {
  return function() {
    return find.call(this.children, match);
  };
}
function childFirst() {
  return this.firstElementChild;
}
function selection_selectChild(match) {
  return this.select(match == null ? childFirst : childFind(typeof match === "function" ? match : childMatcher(match)));
}
var filter = Array.prototype.filter;
function children() {
  return Array.from(this.children);
}
function childrenFilter(match) {
  return function() {
    return filter.call(this.children, match);
  };
}
function selection_selectChildren(match) {
  return this.selectAll(match == null ? children : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
}
function selection_filter(match) {
  if (typeof match !== "function") match = matcher(match);
  for (var groups = this._groups, m2 = groups.length, subgroups = new Array(m2), j = 0; j < m2; ++j) {
    for (var group = groups[j], n2 = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n2; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }
  return new Selection$1(subgroups, this._parents);
}
function sparse(update) {
  return new Array(update.length);
}
function selection_enter() {
  return new Selection$1(this._enter || this._groups.map(sparse), this._parents);
}
function EnterNode(parent, datum2) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum2;
}
EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) {
    return this._parent.insertBefore(child, this._next);
  },
  insertBefore: function(child, next) {
    return this._parent.insertBefore(child, next);
  },
  querySelector: function(selector2) {
    return this._parent.querySelector(selector2);
  },
  querySelectorAll: function(selector2) {
    return this._parent.querySelectorAll(selector2);
  }
};
function constant$3(x2) {
  return function() {
    return x2;
  };
}
function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0, node, groupLength = group.length, dataLength = data.length;
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}
function bindKey(parent, group, enter, update, exit, data, key) {
  var i, node, nodeByKeyValue = /* @__PURE__ */ new Map(), groupLength = group.length, dataLength = data.length, keyValues = new Array(groupLength), keyValue;
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
      if (nodeByKeyValue.has(keyValue)) {
        exit[i] = node;
      } else {
        nodeByKeyValue.set(keyValue, node);
      }
    }
  }
  for (i = 0; i < dataLength; ++i) {
    keyValue = key.call(parent, data[i], i, data) + "";
    if (node = nodeByKeyValue.get(keyValue)) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue.delete(keyValue);
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && nodeByKeyValue.get(keyValues[i]) === node) {
      exit[i] = node;
    }
  }
}
function datum(node) {
  return node.__data__;
}
function selection_data(value, key) {
  if (!arguments.length) return Array.from(this, datum);
  var bind = key ? bindKey : bindIndex, parents = this._parents, groups = this._groups;
  if (typeof value !== "function") value = constant$3(value);
  for (var m2 = groups.length, update = new Array(m2), enter = new Array(m2), exit = new Array(m2), j = 0; j < m2; ++j) {
    var parent = parents[j], group = groups[j], groupLength = group.length, data = arraylike(value.call(parent, parent && parent.__data__, j, parents)), dataLength = data.length, enterGroup = enter[j] = new Array(dataLength), updateGroup = update[j] = new Array(dataLength), exitGroup = exit[j] = new Array(groupLength);
    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength) ;
        previous._next = next || null;
      }
    }
  }
  update = new Selection$1(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}
function arraylike(data) {
  return typeof data === "object" && "length" in data ? data : Array.from(data);
}
function selection_exit() {
  return new Selection$1(this._exit || this._groups.map(sparse), this._parents);
}
function selection_join(onenter, onupdate, onexit) {
  var enter = this.enter(), update = this, exit = this.exit();
  if (typeof onenter === "function") {
    enter = onenter(enter);
    if (enter) enter = enter.selection();
  } else {
    enter = enter.append(onenter + "");
  }
  if (onupdate != null) {
    update = onupdate(update);
    if (update) update = update.selection();
  }
  if (onexit == null) exit.remove();
  else onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}
function selection_merge(context) {
  var selection2 = context.selection ? context.selection() : context;
  for (var groups0 = this._groups, groups1 = selection2._groups, m0 = groups0.length, m1 = groups1.length, m2 = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m2; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n2 = group0.length, merge = merges[j] = new Array(n2), node, i = 0; i < n2; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }
  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }
  return new Selection$1(merges, this._parents);
}
function selection_order() {
  for (var groups = this._groups, j = -1, m2 = groups.length; ++j < m2; ) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0; ) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }
  return this;
}
function selection_sort(compare) {
  if (!compare) compare = ascending;
  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }
  for (var groups = this._groups, m2 = groups.length, sortgroups = new Array(m2), j = 0; j < m2; ++j) {
    for (var group = groups[j], n2 = group.length, sortgroup = sortgroups[j] = new Array(n2), node, i = 0; i < n2; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }
  return new Selection$1(sortgroups, this._parents).order();
}
function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}
function selection_call() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}
function selection_nodes() {
  return Array.from(this);
}
function selection_node() {
  for (var groups = this._groups, j = 0, m2 = groups.length; j < m2; ++j) {
    for (var group = groups[j], i = 0, n2 = group.length; i < n2; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }
  return null;
}
function selection_size() {
  let size = 0;
  for (const node of this) ++size;
  return size;
}
function selection_empty() {
  return !this.node();
}
function selection_each(callback) {
  for (var groups = this._groups, j = 0, m2 = groups.length; j < m2; ++j) {
    for (var group = groups[j], i = 0, n2 = group.length, node; i < n2; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }
  return this;
}
function attrRemove$1(name) {
  return function() {
    this.removeAttribute(name);
  };
}
function attrRemoveNS$1(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}
function attrConstant$1(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}
function attrConstantNS$1(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}
function attrFunction$1(name, value) {
  return function() {
    var v2 = value.apply(this, arguments);
    if (v2 == null) this.removeAttribute(name);
    else this.setAttribute(name, v2);
  };
}
function attrFunctionNS$1(fullname, value) {
  return function() {
    var v2 = value.apply(this, arguments);
    if (v2 == null) this.removeAttributeNS(fullname.space, fullname.local);
    else this.setAttributeNS(fullname.space, fullname.local, v2);
  };
}
function selection_attr(name, value) {
  var fullname = namespace(name);
  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
  }
  return this.each((value == null ? fullname.local ? attrRemoveNS$1 : attrRemove$1 : typeof value === "function" ? fullname.local ? attrFunctionNS$1 : attrFunction$1 : fullname.local ? attrConstantNS$1 : attrConstant$1)(fullname, value));
}
function defaultView(node) {
  return node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView;
}
function styleRemove$1(name) {
  return function() {
    this.style.removeProperty(name);
  };
}
function styleConstant$1(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}
function styleFunction$1(name, value, priority) {
  return function() {
    var v2 = value.apply(this, arguments);
    if (v2 == null) this.style.removeProperty(name);
    else this.style.setProperty(name, v2, priority);
  };
}
function selection_style(name, value, priority) {
  return arguments.length > 1 ? this.each((value == null ? styleRemove$1 : typeof value === "function" ? styleFunction$1 : styleConstant$1)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
}
function styleValue(node, name) {
  return node.style.getPropertyValue(name) || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
}
function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}
function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}
function propertyFunction(name, value) {
  return function() {
    var v2 = value.apply(this, arguments);
    if (v2 == null) delete this[name];
    else this[name] = v2;
  };
}
function selection_property(name, value) {
  return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
}
function classArray(string) {
  return string.trim().split(/^|\s+/);
}
function classList(node) {
  return node.classList || new ClassList(node);
}
function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}
ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};
function classedAdd(node, names) {
  var list = classList(node), i = -1, n2 = names.length;
  while (++i < n2) list.add(names[i]);
}
function classedRemove(node, names) {
  var list = classList(node), i = -1, n2 = names.length;
  while (++i < n2) list.remove(names[i]);
}
function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}
function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}
function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}
function selection_classed(name, value) {
  var names = classArray(name + "");
  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n2 = names.length;
    while (++i < n2) if (!list.contains(names[i])) return false;
    return true;
  }
  return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
}
function textRemove() {
  this.textContent = "";
}
function textConstant$1(value) {
  return function() {
    this.textContent = value;
  };
}
function textFunction$1(value) {
  return function() {
    var v2 = value.apply(this, arguments);
    this.textContent = v2 == null ? "" : v2;
  };
}
function selection_text(value) {
  return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction$1 : textConstant$1)(value)) : this.node().textContent;
}
function htmlRemove() {
  this.innerHTML = "";
}
function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}
function htmlFunction(value) {
  return function() {
    var v2 = value.apply(this, arguments);
    this.innerHTML = v2 == null ? "" : v2;
  };
}
function selection_html(value) {
  return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
}
function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}
function selection_raise() {
  return this.each(raise);
}
function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function selection_lower() {
  return this.each(lower);
}
function selection_append(name) {
  var create2 = typeof name === "function" ? name : creator(name);
  return this.select(function() {
    return this.appendChild(create2.apply(this, arguments));
  });
}
function constantNull() {
  return null;
}
function selection_insert(name, before) {
  var create2 = typeof name === "function" ? name : creator(name), select2 = before == null ? constantNull : typeof before === "function" ? before : selector$h(before);
  return this.select(function() {
    return this.insertBefore(create2.apply(this, arguments), select2.apply(this, arguments) || null);
  });
}
function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}
function selection_remove() {
  return this.each(remove);
}
function selection_cloneShallow() {
  var clone = this.cloneNode(false), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function selection_cloneDeep() {
  var clone = this.cloneNode(true), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function selection_clone(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}
function selection_datum(value) {
  return arguments.length ? this.property("__data__", value) : this.node().__data__;
}
function contextListener(listener) {
  return function(event) {
    listener.call(this, event, this.__data__);
  };
}
function parseTypenames(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t2) {
    var name = "", i = t2.indexOf(".");
    if (i >= 0) name = t2.slice(i + 1), t2 = t2.slice(0, i);
    return { type: t2, name };
  });
}
function onRemove(typename) {
  return function() {
    var on = this.__on;
    if (!on) return;
    for (var j = 0, i = -1, m2 = on.length, o; j < m2; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
      } else {
        on[++i] = o;
      }
    }
    if (++i) on.length = i;
    else delete this.__on;
  };
}
function onAdd(typename, value, options) {
  return function() {
    var on = this.__on, o, listener = contextListener(value);
    if (on) for (var j = 0, m2 = on.length; j < m2; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
        this.addEventListener(o.type, o.listener = listener, o.options = options);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, options);
    o = { type: typename.type, name: typename.name, value, listener, options };
    if (!on) this.__on = [o];
    else on.push(o);
  };
}
function selection_on(typename, value, options) {
  var typenames = parseTypenames(typename + ""), i, n2 = typenames.length, t2;
  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on) for (var j = 0, m2 = on.length, o; j < m2; ++j) {
      for (i = 0, o = on[j]; i < n2; ++i) {
        if ((t2 = typenames[i]).type === o.type && t2.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }
  on = value ? onAdd : onRemove;
  for (i = 0; i < n2; ++i) this.each(on(typenames[i], value, options));
  return this;
}
function dispatchEvent(node, type, params) {
  var window2 = defaultView(node), event = window2.CustomEvent;
  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window2.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
    else event.initEvent(type, false, false);
  }
  node.dispatchEvent(event);
}
function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}
function dispatchFunction(type, params) {
  return function() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}
function selection_dispatch(type, params) {
  return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type, params));
}
function* selection_iterator() {
  for (var groups = this._groups, j = 0, m2 = groups.length; j < m2; ++j) {
    for (var group = groups[j], i = 0, n2 = group.length, node; i < n2; ++i) {
      if (node = group[i]) yield node;
    }
  }
}
var root = [null];
function Selection$1(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}
function selection() {
  return new Selection$1([[document.documentElement]], root);
}
function selection_selection() {
  return this;
}
Selection$1.prototype = selection.prototype = {
  constructor: Selection$1,
  select: selection_select,
  selectAll: selection_selectAll,
  selectChild: selection_selectChild,
  selectChildren: selection_selectChildren,
  filter: selection_filter,
  data: selection_data,
  enter: selection_enter,
  exit: selection_exit,
  join: selection_join,
  merge: selection_merge,
  selection: selection_selection,
  order: selection_order,
  sort: selection_sort,
  call: selection_call,
  nodes: selection_nodes,
  node: selection_node,
  size: selection_size,
  empty: selection_empty,
  each: selection_each,
  attr: selection_attr,
  style: selection_style,
  property: selection_property,
  classed: selection_classed,
  text: selection_text,
  html: selection_html,
  raise: selection_raise,
  lower: selection_lower,
  append: selection_append,
  insert: selection_insert,
  remove: selection_remove,
  clone: selection_clone,
  datum: selection_datum,
  on: selection_on,
  dispatch: selection_dispatch,
  [Symbol.iterator]: selection_iterator
};
function select(selector2) {
  return typeof selector2 === "string" ? new Selection$1([[document.querySelector(selector2)]], [document.documentElement]) : new Selection$1([[selector2]], root);
}
function sourceEvent(event) {
  let sourceEvent2;
  while (sourceEvent2 = event.sourceEvent) event = sourceEvent2;
  return event;
}
function pointer(event, node) {
  event = sourceEvent(event);
  if (node === void 0) node = event.currentTarget;
  if (node) {
    var svg = node.ownerSVGElement || node;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      point.x = event.clientX, point.y = event.clientY;
      point = point.matrixTransform(node.getScreenCTM().inverse());
      return [point.x, point.y];
    }
    if (node.getBoundingClientRect) {
      var rect = node.getBoundingClientRect();
      return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
    }
  }
  return [event.pageX, event.pageY];
}
const nonpassive = { passive: false };
const nonpassivecapture = { capture: true, passive: false };
function nopropagation$1(event) {
  event.stopImmediatePropagation();
}
function noevent$1(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}
function dragDisable(view) {
  var root2 = view.document.documentElement, selection2 = select(view).on("dragstart.drag", noevent$1, nonpassivecapture);
  if ("onselectstart" in root2) {
    selection2.on("selectstart.drag", noevent$1, nonpassivecapture);
  } else {
    root2.__noselect = root2.style.MozUserSelect;
    root2.style.MozUserSelect = "none";
  }
}
function yesdrag(view, noclick) {
  var root2 = view.document.documentElement, selection2 = select(view).on("dragstart.drag", null);
  if (noclick) {
    selection2.on("click.drag", noevent$1, nonpassivecapture);
    setTimeout(function() {
      selection2.on("click.drag", null);
    }, 0);
  }
  if ("onselectstart" in root2) {
    selection2.on("selectstart.drag", null);
  } else {
    root2.style.MozUserSelect = root2.__noselect;
    delete root2.__noselect;
  }
}
const constant$2 = (x2) => () => x2;
function DragEvent(type, {
  sourceEvent: sourceEvent2,
  subject,
  target,
  identifier,
  active,
  x: x2,
  y: y2,
  dx,
  dy,
  dispatch: dispatch2
}) {
  Object.defineProperties(this, {
    type: { value: type, enumerable: true, configurable: true },
    sourceEvent: { value: sourceEvent2, enumerable: true, configurable: true },
    subject: { value: subject, enumerable: true, configurable: true },
    target: { value: target, enumerable: true, configurable: true },
    identifier: { value: identifier, enumerable: true, configurable: true },
    active: { value: active, enumerable: true, configurable: true },
    x: { value: x2, enumerable: true, configurable: true },
    y: { value: y2, enumerable: true, configurable: true },
    dx: { value: dx, enumerable: true, configurable: true },
    dy: { value: dy, enumerable: true, configurable: true },
    _: { value: dispatch2 }
  });
}
DragEvent.prototype.on = function() {
  var value = this._.on.apply(this._, arguments);
  return value === this._ ? this : value;
};
function defaultFilter$1(event) {
  return !event.ctrlKey && !event.button;
}
function defaultContainer() {
  return this.parentNode;
}
function defaultSubject(event, d) {
  return d == null ? { x: event.x, y: event.y } : d;
}
function defaultTouchable$1() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function drag() {
  var filter2 = defaultFilter$1, container = defaultContainer, subject = defaultSubject, touchable = defaultTouchable$1, gestures = {}, listeners = dispatch("start", "drag", "end"), active = 0, mousedownx, mousedowny, mousemoving, touchending, clickDistance2 = 0;
  function drag2(selection2) {
    selection2.on("mousedown.drag", mousedowned).filter(touchable).on("touchstart.drag", touchstarted).on("touchmove.drag", touchmoved, nonpassive).on("touchend.drag touchcancel.drag", touchended).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function mousedowned(event, d) {
    if (touchending || !filter2.call(this, event, d)) return;
    var gesture = beforestart(this, container.call(this, event, d), event, d, "mouse");
    if (!gesture) return;
    select(event.view).on("mousemove.drag", mousemoved, nonpassivecapture).on("mouseup.drag", mouseupped, nonpassivecapture);
    dragDisable(event.view);
    nopropagation$1(event);
    mousemoving = false;
    mousedownx = event.clientX;
    mousedowny = event.clientY;
    gesture("start", event);
  }
  function mousemoved(event) {
    noevent$1(event);
    if (!mousemoving) {
      var dx = event.clientX - mousedownx, dy = event.clientY - mousedowny;
      mousemoving = dx * dx + dy * dy > clickDistance2;
    }
    gestures.mouse("drag", event);
  }
  function mouseupped(event) {
    select(event.view).on("mousemove.drag mouseup.drag", null);
    yesdrag(event.view, mousemoving);
    noevent$1(event);
    gestures.mouse("end", event);
  }
  function touchstarted(event, d) {
    if (!filter2.call(this, event, d)) return;
    var touches = event.changedTouches, c = container.call(this, event, d), n2 = touches.length, i, gesture;
    for (i = 0; i < n2; ++i) {
      if (gesture = beforestart(this, c, event, d, touches[i].identifier, touches[i])) {
        nopropagation$1(event);
        gesture("start", event, touches[i]);
      }
    }
  }
  function touchmoved(event) {
    var touches = event.changedTouches, n2 = touches.length, i, gesture;
    for (i = 0; i < n2; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        noevent$1(event);
        gesture("drag", event, touches[i]);
      }
    }
  }
  function touchended(event) {
    var touches = event.changedTouches, n2 = touches.length, i, gesture;
    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function() {
      touchending = null;
    }, 500);
    for (i = 0; i < n2; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        nopropagation$1(event);
        gesture("end", event, touches[i]);
      }
    }
  }
  function beforestart(that, container2, event, d, identifier, touch) {
    var dispatch2 = listeners.copy(), p2 = pointer(touch || event, container2), dx, dy, s;
    if ((s = subject.call(that, new DragEvent("beforestart", {
      sourceEvent: event,
      target: drag2,
      identifier,
      active,
      x: p2[0],
      y: p2[1],
      dx: 0,
      dy: 0,
      dispatch: dispatch2
    }), d)) == null) return;
    dx = s.x - p2[0] || 0;
    dy = s.y - p2[1] || 0;
    return function gesture(type, event2, touch2) {
      var p0 = p2, n2;
      switch (type) {
        case "start":
          gestures[identifier] = gesture, n2 = active++;
          break;
        case "end":
          delete gestures[identifier], --active;
        case "drag":
          p2 = pointer(touch2 || event2, container2), n2 = active;
          break;
      }
      dispatch2.call(
        type,
        that,
        new DragEvent(type, {
          sourceEvent: event2,
          subject: s,
          target: drag2,
          identifier,
          active: n2,
          x: p2[0] + dx,
          y: p2[1] + dy,
          dx: p2[0] - p0[0],
          dy: p2[1] - p0[1],
          dispatch: dispatch2
        }),
        d
      );
    };
  }
  drag2.filter = function(_) {
    return arguments.length ? (filter2 = typeof _ === "function" ? _ : constant$2(!!_), drag2) : filter2;
  };
  drag2.container = function(_) {
    return arguments.length ? (container = typeof _ === "function" ? _ : constant$2(_), drag2) : container;
  };
  drag2.subject = function(_) {
    return arguments.length ? (subject = typeof _ === "function" ? _ : constant$2(_), drag2) : subject;
  };
  drag2.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant$2(!!_), drag2) : touchable;
  };
  drag2.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? drag2 : value;
  };
  drag2.clickDistance = function(_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, drag2) : Math.sqrt(clickDistance2);
  };
  return drag2;
}
function define(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}
function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition) prototype[key] = definition[key];
  return prototype;
}
function Color() {
}
var darker = 0.7;
var brighter = 1 / darker;
var reI = "\\s*([+-]?\\d+)\\s*", reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", reHex = /^#([0-9a-f]{3,8})$/, reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`), reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`), reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`), reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`), reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`), reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);
var named = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
define(Color, color, {
  copy(channels) {
    return Object.assign(new this.constructor(), this, channels);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: color_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: color_formatHex,
  formatHex8: color_formatHex8,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});
function color_formatHex() {
  return this.rgb().formatHex();
}
function color_formatHex8() {
  return this.rgb().formatHex8();
}
function color_formatHsl() {
  return hslConvert(this).formatHsl();
}
function color_formatRgb() {
  return this.rgb().formatRgb();
}
function color(format) {
  var m2, l2;
  format = (format + "").trim().toLowerCase();
  return (m2 = reHex.exec(format)) ? (l2 = m2[1].length, m2 = parseInt(m2[1], 16), l2 === 6 ? rgbn(m2) : l2 === 3 ? new Rgb(m2 >> 8 & 15 | m2 >> 4 & 240, m2 >> 4 & 15 | m2 & 240, (m2 & 15) << 4 | m2 & 15, 1) : l2 === 8 ? rgba(m2 >> 24 & 255, m2 >> 16 & 255, m2 >> 8 & 255, (m2 & 255) / 255) : l2 === 4 ? rgba(m2 >> 12 & 15 | m2 >> 8 & 240, m2 >> 8 & 15 | m2 >> 4 & 240, m2 >> 4 & 15 | m2 & 240, ((m2 & 15) << 4 | m2 & 15) / 255) : null) : (m2 = reRgbInteger.exec(format)) ? new Rgb(m2[1], m2[2], m2[3], 1) : (m2 = reRgbPercent.exec(format)) ? new Rgb(m2[1] * 255 / 100, m2[2] * 255 / 100, m2[3] * 255 / 100, 1) : (m2 = reRgbaInteger.exec(format)) ? rgba(m2[1], m2[2], m2[3], m2[4]) : (m2 = reRgbaPercent.exec(format)) ? rgba(m2[1] * 255 / 100, m2[2] * 255 / 100, m2[3] * 255 / 100, m2[4]) : (m2 = reHslPercent.exec(format)) ? hsla(m2[1], m2[2] / 100, m2[3] / 100, 1) : (m2 = reHslaPercent.exec(format)) ? hsla(m2[1], m2[2] / 100, m2[3] / 100, m2[4]) : named.hasOwnProperty(format) ? rgbn(named[format]) : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}
function rgbn(n2) {
  return new Rgb(n2 >> 16 & 255, n2 >> 8 & 255, n2 & 255, 1);
}
function rgba(r2, g, b, a) {
  if (a <= 0) r2 = g = b = NaN;
  return new Rgb(r2, g, b, a);
}
function rgbConvert(o) {
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Rgb();
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}
function rgb(r2, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r2) : new Rgb(r2, g, b, opacity == null ? 1 : opacity);
}
function Rgb(r2, g, b, opacity) {
  this.r = +r2;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}
define(Rgb, rgb, extend(Color, {
  brighter(k2) {
    k2 = k2 == null ? brighter : Math.pow(brighter, k2);
    return new Rgb(this.r * k2, this.g * k2, this.b * k2, this.opacity);
  },
  darker(k2) {
    k2 = k2 == null ? darker : Math.pow(darker, k2);
    return new Rgb(this.r * k2, this.g * k2, this.b * k2, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && (-0.5 <= this.g && this.g < 255.5) && (-0.5 <= this.b && this.b < 255.5) && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: rgb_formatHex,
  // Deprecated! Use color.formatHex.
  formatHex: rgb_formatHex,
  formatHex8: rgb_formatHex8,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));
function rgb_formatHex() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
}
function rgb_formatHex8() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function rgb_formatRgb() {
  const a = clampa(this.opacity);
  return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
}
function clampa(opacity) {
  return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
}
function clampi(value) {
  return Math.max(0, Math.min(255, Math.round(value) || 0));
}
function hex(value) {
  value = clampi(value);
  return (value < 16 ? "0" : "") + value.toString(16);
}
function hsla(h, s, l2, a) {
  if (a <= 0) h = s = l2 = NaN;
  else if (l2 <= 0 || l2 >= 1) h = s = NaN;
  else if (s <= 0) h = NaN;
  return new Hsl(h, s, l2, a);
}
function hslConvert(o) {
  if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color)) o = color(o);
  if (!o) return new Hsl();
  if (o instanceof Hsl) return o;
  o = o.rgb();
  var r2 = o.r / 255, g = o.g / 255, b = o.b / 255, min = Math.min(r2, g, b), max = Math.max(r2, g, b), h = NaN, s = max - min, l2 = (max + min) / 2;
  if (s) {
    if (r2 === max) h = (g - b) / s + (g < b) * 6;
    else if (g === max) h = (b - r2) / s + 2;
    else h = (r2 - g) / s + 4;
    s /= l2 < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s = l2 > 0 && l2 < 1 ? 0 : h;
  }
  return new Hsl(h, s, l2, o.opacity);
}
function hsl(h, s, l2, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l2, opacity == null ? 1 : opacity);
}
function Hsl(h, s, l2, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l2;
  this.opacity = +opacity;
}
define(Hsl, hsl, extend(Color, {
  brighter(k2) {
    k2 = k2 == null ? brighter : Math.pow(brighter, k2);
    return new Hsl(this.h, this.s, this.l * k2, this.opacity);
  },
  darker(k2) {
    k2 = k2 == null ? darker : Math.pow(darker, k2);
    return new Hsl(this.h, this.s, this.l * k2, this.opacity);
  },
  rgb() {
    var h = this.h % 360 + (this.h < 0) * 360, s = isNaN(h) || isNaN(this.s) ? 0 : this.s, l2 = this.l, m2 = l2 + (l2 < 0.5 ? l2 : 1 - l2) * s, m1 = 2 * l2 - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
      this.opacity
    );
  },
  clamp() {
    return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && (0 <= this.l && this.l <= 1) && (0 <= this.opacity && this.opacity <= 1);
  },
  formatHsl() {
    const a = clampa(this.opacity);
    return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
  }
}));
function clamph(value) {
  value = (value || 0) % 360;
  return value < 0 ? value + 360 : value;
}
function clampt(value) {
  return Math.max(0, Math.min(1, value || 0));
}
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}
const constant$1 = (x2) => () => x2;
function linear(a, d) {
  return function(t2) {
    return a + t2 * d;
  };
}
function exponential(a, b, y2) {
  return a = Math.pow(a, y2), b = Math.pow(b, y2) - a, y2 = 1 / y2, function(t2) {
    return Math.pow(a + t2 * b, y2);
  };
}
function gamma(y2) {
  return (y2 = +y2) === 1 ? nogamma : function(a, b) {
    return b - a ? exponential(a, b, y2) : constant$1(isNaN(a) ? b : a);
  };
}
function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : constant$1(isNaN(a) ? b : a);
}
const interpolateRgb = function rgbGamma(y2) {
  var color2 = gamma(y2);
  function rgb$1(start2, end) {
    var r2 = color2((start2 = rgb(start2)).r, (end = rgb(end)).r), g = color2(start2.g, end.g), b = color2(start2.b, end.b), opacity = nogamma(start2.opacity, end.opacity);
    return function(t2) {
      start2.r = r2(t2);
      start2.g = g(t2);
      start2.b = b(t2);
      start2.opacity = opacity(t2);
      return start2 + "";
    };
  }
  rgb$1.gamma = rgbGamma;
  return rgb$1;
}(1);
function interpolateNumber(a, b) {
  return a = +a, b = +b, function(t2) {
    return a * (1 - t2) + b * t2;
  };
}
var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, reB = new RegExp(reA.source, "g");
function zero(b) {
  return function() {
    return b;
  };
}
function one(b) {
  return function(t2) {
    return b(t2) + "";
  };
}
function interpolateString(a, b) {
  var bi2 = reA.lastIndex = reB.lastIndex = 0, am, bm, bs, i = -1, s = [], q2 = [];
  a = a + "", b = b + "";
  while ((am = reA.exec(a)) && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi2) {
      bs = b.slice(bi2, bs);
      if (s[i]) s[i] += bs;
      else s[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) {
      if (s[i]) s[i] += bm;
      else s[++i] = bm;
    } else {
      s[++i] = null;
      q2.push({ i, x: interpolateNumber(am, bm) });
    }
    bi2 = reB.lastIndex;
  }
  if (bi2 < b.length) {
    bs = b.slice(bi2);
    if (s[i]) s[i] += bs;
    else s[++i] = bs;
  }
  return s.length < 2 ? q2[0] ? one(q2[0].x) : zero(b) : (b = q2.length, function(t2) {
    for (var i2 = 0, o; i2 < b; ++i2) s[(o = q2[i2]).i] = o.x(t2);
    return s.join("");
  });
}
var degrees = 180 / Math.PI;
var identity$1 = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function decompose(a, b, c, d, e, f2) {
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f2,
    rotate: Math.atan2(b, a) * degrees,
    skewX: Math.atan(skewX) * degrees,
    scaleX,
    scaleY
  };
}
var svgNode;
function parseCss(value) {
  const m2 = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
  return m2.isIdentity ? identity$1 : decompose(m2.a, m2.b, m2.c, m2.d, m2.e, m2.f);
}
function parseSvg(value) {
  if (value == null) return identity$1;
  if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate())) return identity$1;
  value = value.matrix;
  return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
}
function interpolateTransform(parse, pxComma, pxParen, degParen) {
  function pop(s) {
    return s.length ? s.pop() + " " : "";
  }
  function translate(xa, ya2, xb2, yb2, s, q2) {
    if (xa !== xb2 || ya2 !== yb2) {
      var i = s.push("translate(", null, pxComma, null, pxParen);
      q2.push({ i: i - 4, x: interpolateNumber(xa, xb2) }, { i: i - 2, x: interpolateNumber(ya2, yb2) });
    } else if (xb2 || yb2) {
      s.push("translate(" + xb2 + pxComma + yb2 + pxParen);
    }
  }
  function rotate(a, b, s, q2) {
    if (a !== b) {
      if (a - b > 180) b += 360;
      else if (b - a > 180) a += 360;
      q2.push({ i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b) });
    } else if (b) {
      s.push(pop(s) + "rotate(" + b + degParen);
    }
  }
  function skewX(a, b, s, q2) {
    if (a !== b) {
      q2.push({ i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b) });
    } else if (b) {
      s.push(pop(s) + "skewX(" + b + degParen);
    }
  }
  function scale(xa, ya2, xb2, yb2, s, q2) {
    if (xa !== xb2 || ya2 !== yb2) {
      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
      q2.push({ i: i - 4, x: interpolateNumber(xa, xb2) }, { i: i - 2, x: interpolateNumber(ya2, yb2) });
    } else if (xb2 !== 1 || yb2 !== 1) {
      s.push(pop(s) + "scale(" + xb2 + "," + yb2 + ")");
    }
  }
  return function(a, b) {
    var s = [], q2 = [];
    a = parse(a), b = parse(b);
    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q2);
    rotate(a.rotate, b.rotate, s, q2);
    skewX(a.skewX, b.skewX, s, q2);
    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q2);
    a = b = null;
    return function(t2) {
      var i = -1, n2 = q2.length, o;
      while (++i < n2) s[(o = q2[i]).i] = o.x(t2);
      return s.join("");
    };
  };
}
var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");
var epsilon2 = 1e-12;
function cosh(x2) {
  return ((x2 = Math.exp(x2)) + 1 / x2) / 2;
}
function sinh(x2) {
  return ((x2 = Math.exp(x2)) - 1 / x2) / 2;
}
function tanh(x2) {
  return ((x2 = Math.exp(2 * x2)) - 1) / (x2 + 1);
}
const interpolateZoom = function zoomRho(rho, rho2, rho4) {
  function zoom2(p0, p1) {
    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2], dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, i, S2;
    if (d2 < epsilon2) {
      S2 = Math.log(w1 / w0) / rho;
      i = function(t2) {
        return [
          ux0 + t2 * dx,
          uy0 + t2 * dy,
          w0 * Math.exp(rho * t2 * S2)
        ];
      };
    } else {
      var d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1), b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S2 = (r1 - r0) / rho;
      i = function(t2) {
        var s = t2 * S2, coshr0 = cosh(r0), u2 = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
        return [
          ux0 + u2 * dx,
          uy0 + u2 * dy,
          w0 * coshr0 / cosh(rho * s + r0)
        ];
      };
    }
    i.duration = S2 * 1e3 * rho / Math.SQRT2;
    return i;
  }
  zoom2.rho = function(_) {
    var _1 = Math.max(1e-3, +_), _2 = _1 * _1, _4 = _2 * _2;
    return zoomRho(_1, _2, _4);
  };
  return zoom2;
}(Math.SQRT2, 2, 4);
var frame = 0, timeout$1 = 0, interval = 0, pokeDelay = 1e3, taskHead, taskTail, clockLast = 0, clockNow = 0, clockSkew = 0, clock = typeof performance === "object" && performance.now ? performance : Date, setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f2) {
  setTimeout(f2, 17);
};
function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}
function clearNow() {
  clockNow = 0;
}
function Timer() {
  this._call = this._time = this._next = null;
}
Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function(callback, delay, time) {
    if (typeof callback !== "function") throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
    if (!this._next && taskTail !== this) {
      if (taskTail) taskTail._next = this;
      else taskHead = this;
      taskTail = this;
    }
    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function() {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};
function timer(callback, delay, time) {
  var t2 = new Timer();
  t2.restart(callback, delay, time);
  return t2;
}
function timerFlush() {
  now();
  ++frame;
  var t2 = taskHead, e;
  while (t2) {
    if ((e = clockNow - t2._time) >= 0) t2._call.call(void 0, e);
    t2 = t2._next;
  }
  --frame;
}
function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  frame = timeout$1 = 0;
  try {
    timerFlush();
  } finally {
    frame = 0;
    nap();
    clockNow = 0;
  }
}
function poke() {
  var now2 = clock.now(), delay = now2 - clockLast;
  if (delay > pokeDelay) clockSkew -= delay, clockLast = now2;
}
function nap() {
  var t0, t1 = taskHead, t2, time = Infinity;
  while (t1) {
    if (t1._call) {
      if (time > t1._time) time = t1._time;
      t0 = t1, t1 = t1._next;
    } else {
      t2 = t1._next, t1._next = null;
      t1 = t0 ? t0._next = t2 : taskHead = t2;
    }
  }
  taskTail = t0;
  sleep(time);
}
function sleep(time) {
  if (frame) return;
  if (timeout$1) timeout$1 = clearTimeout(timeout$1);
  var delay = time - clockNow;
  if (delay > 24) {
    if (time < Infinity) timeout$1 = setTimeout(wake, time - clock.now() - clockSkew);
    if (interval) interval = clearInterval(interval);
  } else {
    if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
    frame = 1, setFrame(wake);
  }
}
function timeout(callback, delay, time) {
  var t2 = new Timer();
  delay = delay == null ? 0 : +delay;
  t2.restart((elapsed) => {
    t2.stop();
    callback(elapsed + delay);
  }, delay, time);
  return t2;
}
var emptyOn = dispatch("start", "end", "cancel", "interrupt");
var emptyTween = [];
var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;
function schedule(node, name, id2, index, group, timing) {
  var schedules = node.__transition;
  if (!schedules) node.__transition = {};
  else if (id2 in schedules) return;
  create(node, id2, {
    name,
    index,
    // For context during callback.
    group,
    // For context during callback.
    on: emptyOn,
    tween: emptyTween,
    time: timing.time,
    delay: timing.delay,
    duration: timing.duration,
    ease: timing.ease,
    timer: null,
    state: CREATED
  });
}
function init(node, id2) {
  var schedule2 = get(node, id2);
  if (schedule2.state > CREATED) throw new Error("too late; already scheduled");
  return schedule2;
}
function set(node, id2) {
  var schedule2 = get(node, id2);
  if (schedule2.state > STARTED) throw new Error("too late; already running");
  return schedule2;
}
function get(node, id2) {
  var schedule2 = node.__transition;
  if (!schedule2 || !(schedule2 = schedule2[id2])) throw new Error("transition not found");
  return schedule2;
}
function create(node, id2, self) {
  var schedules = node.__transition, tween;
  schedules[id2] = self;
  self.timer = timer(schedule2, 0, self.time);
  function schedule2(elapsed) {
    self.state = SCHEDULED;
    self.timer.restart(start2, self.delay, self.time);
    if (self.delay <= elapsed) start2(elapsed - self.delay);
  }
  function start2(elapsed) {
    var i, j, n2, o;
    if (self.state !== SCHEDULED) return stop();
    for (i in schedules) {
      o = schedules[i];
      if (o.name !== self.name) continue;
      if (o.state === STARTED) return timeout(start2);
      if (o.state === RUNNING) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("interrupt", node, node.__data__, o.index, o.group);
        delete schedules[i];
      } else if (+i < id2) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("cancel", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }
    }
    timeout(function() {
      if (self.state === STARTED) {
        self.state = RUNNING;
        self.timer.restart(tick, self.delay, self.time);
        tick(elapsed);
      }
    });
    self.state = STARTING;
    self.on.call("start", node, node.__data__, self.index, self.group);
    if (self.state !== STARTING) return;
    self.state = STARTED;
    tween = new Array(n2 = self.tween.length);
    for (i = 0, j = -1; i < n2; ++i) {
      if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
        tween[++j] = o;
      }
    }
    tween.length = j + 1;
  }
  function tick(elapsed) {
    var t2 = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1), i = -1, n2 = tween.length;
    while (++i < n2) {
      tween[i].call(node, t2);
    }
    if (self.state === ENDING) {
      self.on.call("end", node, node.__data__, self.index, self.group);
      stop();
    }
  }
  function stop() {
    self.state = ENDED;
    self.timer.stop();
    delete schedules[id2];
    for (var i in schedules) return;
    delete node.__transition;
  }
}
function interrupt(node, name) {
  var schedules = node.__transition, schedule2, active, empty2 = true, i;
  if (!schedules) return;
  name = name == null ? null : name + "";
  for (i in schedules) {
    if ((schedule2 = schedules[i]).name !== name) {
      empty2 = false;
      continue;
    }
    active = schedule2.state > STARTING && schedule2.state < ENDING;
    schedule2.state = ENDED;
    schedule2.timer.stop();
    schedule2.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule2.index, schedule2.group);
    delete schedules[i];
  }
  if (empty2) delete node.__transition;
}
function selection_interrupt(name) {
  return this.each(function() {
    interrupt(this, name);
  });
}
function tweenRemove(id2, name) {
  var tween0, tween1;
  return function() {
    var schedule2 = set(this, id2), tween = schedule2.tween;
    if (tween !== tween0) {
      tween1 = tween0 = tween;
      for (var i = 0, n2 = tween1.length; i < n2; ++i) {
        if (tween1[i].name === name) {
          tween1 = tween1.slice();
          tween1.splice(i, 1);
          break;
        }
      }
    }
    schedule2.tween = tween1;
  };
}
function tweenFunction(id2, name, value) {
  var tween0, tween1;
  if (typeof value !== "function") throw new Error();
  return function() {
    var schedule2 = set(this, id2), tween = schedule2.tween;
    if (tween !== tween0) {
      tween1 = (tween0 = tween).slice();
      for (var t2 = { name, value }, i = 0, n2 = tween1.length; i < n2; ++i) {
        if (tween1[i].name === name) {
          tween1[i] = t2;
          break;
        }
      }
      if (i === n2) tween1.push(t2);
    }
    schedule2.tween = tween1;
  };
}
function transition_tween(name, value) {
  var id2 = this._id;
  name += "";
  if (arguments.length < 2) {
    var tween = get(this.node(), id2).tween;
    for (var i = 0, n2 = tween.length, t2; i < n2; ++i) {
      if ((t2 = tween[i]).name === name) {
        return t2.value;
      }
    }
    return null;
  }
  return this.each((value == null ? tweenRemove : tweenFunction)(id2, name, value));
}
function tweenValue(transition, name, value) {
  var id2 = transition._id;
  transition.each(function() {
    var schedule2 = set(this, id2);
    (schedule2.value || (schedule2.value = {}))[name] = value.apply(this, arguments);
  });
  return function(node) {
    return get(node, id2).value[name];
  };
}
function interpolate(a, b) {
  var c;
  return (typeof b === "number" ? interpolateNumber : b instanceof color ? interpolateRgb : (c = color(b)) ? (b = c, interpolateRgb) : interpolateString)(a, b);
}
function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}
function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}
function attrConstant(name, interpolate2, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = this.getAttribute(name);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate2(string00 = string0, value1);
  };
}
function attrConstantNS(fullname, interpolate2, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = this.getAttributeNS(fullname.space, fullname.local);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate2(string00 = string0, value1);
  };
}
function attrFunction(name, interpolate2, value) {
  var string00, string10, interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null) return void this.removeAttribute(name);
    string0 = this.getAttribute(name);
    string1 = value1 + "";
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate2(string00 = string0, value1));
  };
}
function attrFunctionNS(fullname, interpolate2, value) {
  var string00, string10, interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
    string0 = this.getAttributeNS(fullname.space, fullname.local);
    string1 = value1 + "";
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate2(string00 = string0, value1));
  };
}
function transition_attr(name, value) {
  var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate;
  return this.attrTween(name, typeof value === "function" ? (fullname.local ? attrFunctionNS : attrFunction)(fullname, i, tweenValue(this, "attr." + name, value)) : value == null ? (fullname.local ? attrRemoveNS : attrRemove)(fullname) : (fullname.local ? attrConstantNS : attrConstant)(fullname, i, value));
}
function attrInterpolate(name, i) {
  return function(t2) {
    this.setAttribute(name, i.call(this, t2));
  };
}
function attrInterpolateNS(fullname, i) {
  return function(t2) {
    this.setAttributeNS(fullname.space, fullname.local, i.call(this, t2));
  };
}
function attrTweenNS(fullname, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
    return t0;
  }
  tween._value = value;
  return tween;
}
function attrTween(name, value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
    return t0;
  }
  tween._value = value;
  return tween;
}
function transition_attrTween(name, value) {
  var key = "attr." + name;
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error();
  var fullname = namespace(name);
  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}
function delayFunction(id2, value) {
  return function() {
    init(this, id2).delay = +value.apply(this, arguments);
  };
}
function delayConstant(id2, value) {
  return value = +value, function() {
    init(this, id2).delay = value;
  };
}
function transition_delay(value) {
  var id2 = this._id;
  return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id2, value)) : get(this.node(), id2).delay;
}
function durationFunction(id2, value) {
  return function() {
    set(this, id2).duration = +value.apply(this, arguments);
  };
}
function durationConstant(id2, value) {
  return value = +value, function() {
    set(this, id2).duration = value;
  };
}
function transition_duration(value) {
  var id2 = this._id;
  return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id2, value)) : get(this.node(), id2).duration;
}
function easeConstant(id2, value) {
  if (typeof value !== "function") throw new Error();
  return function() {
    set(this, id2).ease = value;
  };
}
function transition_ease(value) {
  var id2 = this._id;
  return arguments.length ? this.each(easeConstant(id2, value)) : get(this.node(), id2).ease;
}
function easeVarying(id2, value) {
  return function() {
    var v2 = value.apply(this, arguments);
    if (typeof v2 !== "function") throw new Error();
    set(this, id2).ease = v2;
  };
}
function transition_easeVarying(value) {
  if (typeof value !== "function") throw new Error();
  return this.each(easeVarying(this._id, value));
}
function transition_filter(match) {
  if (typeof match !== "function") match = matcher(match);
  for (var groups = this._groups, m2 = groups.length, subgroups = new Array(m2), j = 0; j < m2; ++j) {
    for (var group = groups[j], n2 = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n2; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }
  return new Transition(subgroups, this._parents, this._name, this._id);
}
function transition_merge(transition) {
  if (transition._id !== this._id) throw new Error();
  for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m2 = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m2; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n2 = group0.length, merge = merges[j] = new Array(n2), node, i = 0; i < n2; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }
  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }
  return new Transition(merges, this._parents, this._name, this._id);
}
function start(name) {
  return (name + "").trim().split(/^|\s+/).every(function(t2) {
    var i = t2.indexOf(".");
    if (i >= 0) t2 = t2.slice(0, i);
    return !t2 || t2 === "start";
  });
}
function onFunction(id2, name, listener) {
  var on0, on1, sit = start(name) ? init : set;
  return function() {
    var schedule2 = sit(this, id2), on = schedule2.on;
    if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);
    schedule2.on = on1;
  };
}
function transition_on(name, listener) {
  var id2 = this._id;
  return arguments.length < 2 ? get(this.node(), id2).on.on(name) : this.each(onFunction(id2, name, listener));
}
function removeFunction(id2) {
  return function() {
    var parent = this.parentNode;
    for (var i in this.__transition) if (+i !== id2) return;
    if (parent) parent.removeChild(this);
  };
}
function transition_remove() {
  return this.on("end.remove", removeFunction(this._id));
}
function transition_select(select2) {
  var name = this._name, id2 = this._id;
  if (typeof select2 !== "function") select2 = selector$h(select2);
  for (var groups = this._groups, m2 = groups.length, subgroups = new Array(m2), j = 0; j < m2; ++j) {
    for (var group = groups[j], n2 = group.length, subgroup = subgroups[j] = new Array(n2), node, subnode, i = 0; i < n2; ++i) {
      if ((node = group[i]) && (subnode = select2.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
        schedule(subgroup[i], name, id2, i, subgroup, get(node, id2));
      }
    }
  }
  return new Transition(subgroups, this._parents, name, id2);
}
function transition_selectAll(select2) {
  var name = this._name, id2 = this._id;
  if (typeof select2 !== "function") select2 = selectorAll(select2);
  for (var groups = this._groups, m2 = groups.length, subgroups = [], parents = [], j = 0; j < m2; ++j) {
    for (var group = groups[j], n2 = group.length, node, i = 0; i < n2; ++i) {
      if (node = group[i]) {
        for (var children2 = select2.call(node, node.__data__, i, group), child, inherit2 = get(node, id2), k2 = 0, l2 = children2.length; k2 < l2; ++k2) {
          if (child = children2[k2]) {
            schedule(child, name, id2, k2, children2, inherit2);
          }
        }
        subgroups.push(children2);
        parents.push(node);
      }
    }
  }
  return new Transition(subgroups, parents, name, id2);
}
var Selection = selection.prototype.constructor;
function transition_selection() {
  return new Selection(this._groups, this._parents);
}
function styleNull(name, interpolate2) {
  var string00, string10, interpolate0;
  return function() {
    var string0 = styleValue(this, name), string1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = interpolate2(string00 = string0, string10 = string1);
  };
}
function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}
function styleConstant(name, interpolate2, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = styleValue(this, name);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate2(string00 = string0, value1);
  };
}
function styleFunction(name, interpolate2, value) {
  var string00, string10, interpolate0;
  return function() {
    var string0 = styleValue(this, name), value1 = value(this), string1 = value1 + "";
    if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate2(string00 = string0, value1));
  };
}
function styleMaybeRemove(id2, name) {
  var on0, on1, listener0, key = "style." + name, event = "end." + key, remove2;
  return function() {
    var schedule2 = set(this, id2), on = schedule2.on, listener = schedule2.value[key] == null ? remove2 || (remove2 = styleRemove(name)) : void 0;
    if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);
    schedule2.on = on1;
  };
}
function transition_style(name, value, priority) {
  var i = (name += "") === "transform" ? interpolateTransformCss : interpolate;
  return value == null ? this.styleTween(name, styleNull(name, i)).on("end.style." + name, styleRemove(name)) : typeof value === "function" ? this.styleTween(name, styleFunction(name, i, tweenValue(this, "style." + name, value))).each(styleMaybeRemove(this._id, name)) : this.styleTween(name, styleConstant(name, i, value), priority).on("end.style." + name, null);
}
function styleInterpolate(name, i, priority) {
  return function(t2) {
    this.style.setProperty(name, i.call(this, t2), priority);
  };
}
function styleTween(name, value, priority) {
  var t2, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t2 = (i0 = i) && styleInterpolate(name, i, priority);
    return t2;
  }
  tween._value = value;
  return tween;
}
function transition_styleTween(name, value, priority) {
  var key = "style." + (name += "");
  if (arguments.length < 2) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error();
  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
}
function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}
function textFunction(value) {
  return function() {
    var value1 = value(this);
    this.textContent = value1 == null ? "" : value1;
  };
}
function transition_text(value) {
  return this.tween("text", typeof value === "function" ? textFunction(tweenValue(this, "text", value)) : textConstant(value == null ? "" : value + ""));
}
function textInterpolate(i) {
  return function(t2) {
    this.textContent = i.call(this, t2);
  };
}
function textTween(value) {
  var t0, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
    return t0;
  }
  tween._value = value;
  return tween;
}
function transition_textTween(value) {
  var key = "text";
  if (arguments.length < 1) return (key = this.tween(key)) && key._value;
  if (value == null) return this.tween(key, null);
  if (typeof value !== "function") throw new Error();
  return this.tween(key, textTween(value));
}
function transition_transition() {
  var name = this._name, id0 = this._id, id1 = newId();
  for (var groups = this._groups, m2 = groups.length, j = 0; j < m2; ++j) {
    for (var group = groups[j], n2 = group.length, node, i = 0; i < n2; ++i) {
      if (node = group[i]) {
        var inherit2 = get(node, id0);
        schedule(node, name, id1, i, group, {
          time: inherit2.time + inherit2.delay + inherit2.duration,
          delay: 0,
          duration: inherit2.duration,
          ease: inherit2.ease
        });
      }
    }
  }
  return new Transition(groups, this._parents, name, id1);
}
function transition_end() {
  var on0, on1, that = this, id2 = that._id, size = that.size();
  return new Promise(function(resolve, reject) {
    var cancel = { value: reject }, end = { value: function() {
      if (--size === 0) resolve();
    } };
    that.each(function() {
      var schedule2 = set(this, id2), on = schedule2.on;
      if (on !== on0) {
        on1 = (on0 = on).copy();
        on1._.cancel.push(cancel);
        on1._.interrupt.push(cancel);
        on1._.end.push(end);
      }
      schedule2.on = on1;
    });
    if (size === 0) resolve();
  });
}
var id = 0;
function Transition(groups, parents, name, id2) {
  this._groups = groups;
  this._parents = parents;
  this._name = name;
  this._id = id2;
}
function newId() {
  return ++id;
}
var selection_prototype = selection.prototype;
Transition.prototype = {
  constructor: Transition,
  select: transition_select,
  selectAll: transition_selectAll,
  selectChild: selection_prototype.selectChild,
  selectChildren: selection_prototype.selectChildren,
  filter: transition_filter,
  merge: transition_merge,
  selection: transition_selection,
  transition: transition_transition,
  call: selection_prototype.call,
  nodes: selection_prototype.nodes,
  node: selection_prototype.node,
  size: selection_prototype.size,
  empty: selection_prototype.empty,
  each: selection_prototype.each,
  on: transition_on,
  attr: transition_attr,
  attrTween: transition_attrTween,
  style: transition_style,
  styleTween: transition_styleTween,
  text: transition_text,
  textTween: transition_textTween,
  remove: transition_remove,
  tween: transition_tween,
  delay: transition_delay,
  duration: transition_duration,
  ease: transition_ease,
  easeVarying: transition_easeVarying,
  end: transition_end,
  [Symbol.iterator]: selection_prototype[Symbol.iterator]
};
function cubicInOut(t2) {
  return ((t2 *= 2) <= 1 ? t2 * t2 * t2 : (t2 -= 2) * t2 * t2 + 2) / 2;
}
var defaultTiming = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: cubicInOut
};
function inherit(node, id2) {
  var timing;
  while (!(timing = node.__transition) || !(timing = timing[id2])) {
    if (!(node = node.parentNode)) {
      throw new Error(`transition ${id2} not found`);
    }
  }
  return timing;
}
function selection_transition(name) {
  var id2, timing;
  if (name instanceof Transition) {
    id2 = name._id, name = name._name;
  } else {
    id2 = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
  }
  for (var groups = this._groups, m2 = groups.length, j = 0; j < m2; ++j) {
    for (var group = groups[j], n2 = group.length, node, i = 0; i < n2; ++i) {
      if (node = group[i]) {
        schedule(node, name, id2, i, group, timing || inherit(node, id2));
      }
    }
  }
  return new Transition(groups, this._parents, name, id2);
}
selection.prototype.interrupt = selection_interrupt;
selection.prototype.transition = selection_transition;
const constant = (x2) => () => x2;
function ZoomEvent(type, {
  sourceEvent: sourceEvent2,
  target,
  transform,
  dispatch: dispatch2
}) {
  Object.defineProperties(this, {
    type: { value: type, enumerable: true, configurable: true },
    sourceEvent: { value: sourceEvent2, enumerable: true, configurable: true },
    target: { value: target, enumerable: true, configurable: true },
    transform: { value: transform, enumerable: true, configurable: true },
    _: { value: dispatch2 }
  });
}
function Transform(k2, x2, y2) {
  this.k = k2;
  this.x = x2;
  this.y = y2;
}
Transform.prototype = {
  constructor: Transform,
  scale: function(k2) {
    return k2 === 1 ? this : new Transform(this.k * k2, this.x, this.y);
  },
  translate: function(x2, y2) {
    return x2 === 0 & y2 === 0 ? this : new Transform(this.k, this.x + this.k * x2, this.y + this.k * y2);
  },
  apply: function(point) {
    return [point[0] * this.k + this.x, point[1] * this.k + this.y];
  },
  applyX: function(x2) {
    return x2 * this.k + this.x;
  },
  applyY: function(y2) {
    return y2 * this.k + this.y;
  },
  invert: function(location) {
    return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
  },
  invertX: function(x2) {
    return (x2 - this.x) / this.k;
  },
  invertY: function(y2) {
    return (y2 - this.y) / this.k;
  },
  rescaleX: function(x2) {
    return x2.copy().domain(x2.range().map(this.invertX, this).map(x2.invert, x2));
  },
  rescaleY: function(y2) {
    return y2.copy().domain(y2.range().map(this.invertY, this).map(y2.invert, y2));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var identity = new Transform(1, 0, 0);
Transform.prototype;
function nopropagation(event) {
  event.stopImmediatePropagation();
}
function noevent(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}
function defaultFilter(event) {
  return (!event.ctrlKey || event.type === "wheel") && !event.button;
}
function defaultExtent() {
  var e = this;
  if (e instanceof SVGElement) {
    e = e.ownerSVGElement || e;
    if (e.hasAttribute("viewBox")) {
      e = e.viewBox.baseVal;
      return [[e.x, e.y], [e.x + e.width, e.y + e.height]];
    }
    return [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
  }
  return [[0, 0], [e.clientWidth, e.clientHeight]];
}
function defaultTransform() {
  return this.__zoom || identity;
}
function defaultWheelDelta(event) {
  return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 2e-3) * (event.ctrlKey ? 10 : 1);
}
function defaultTouchable() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function defaultConstrain(transform, extent, translateExtent) {
  var dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0], dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0], dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1], dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1];
  return transform.translate(
    dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
    dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
  );
}
function zoom() {
  var filter2 = defaultFilter, extent = defaultExtent, constrain = defaultConstrain, wheelDelta2 = defaultWheelDelta, touchable = defaultTouchable, scaleExtent = [0, Infinity], translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]], duration = 250, interpolate2 = interpolateZoom, listeners = dispatch("start", "zoom", "end"), touchstarting, touchfirst, touchending, touchDelay = 500, wheelDelay = 150, clickDistance2 = 0, tapDistance = 10;
  function zoom2(selection2) {
    selection2.property("__zoom", defaultTransform).on("wheel.zoom", wheeled, { passive: false }).on("mousedown.zoom", mousedowned).on("dblclick.zoom", dblclicked).filter(touchable).on("touchstart.zoom", touchstarted).on("touchmove.zoom", touchmoved).on("touchend.zoom touchcancel.zoom", touchended).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  zoom2.transform = function(collection, transform, point, event) {
    var selection2 = collection.selection ? collection.selection() : collection;
    selection2.property("__zoom", defaultTransform);
    if (collection !== selection2) {
      schedule2(collection, transform, point, event);
    } else {
      selection2.interrupt().each(function() {
        gesture(this, arguments).event(event).start().zoom(null, typeof transform === "function" ? transform.apply(this, arguments) : transform).end();
      });
    }
  };
  zoom2.scaleBy = function(selection2, k2, p2, event) {
    zoom2.scaleTo(selection2, function() {
      var k0 = this.__zoom.k, k1 = typeof k2 === "function" ? k2.apply(this, arguments) : k2;
      return k0 * k1;
    }, p2, event);
  };
  zoom2.scaleTo = function(selection2, k2, p2, event) {
    zoom2.transform(selection2, function() {
      var e = extent.apply(this, arguments), t0 = this.__zoom, p0 = p2 == null ? centroid(e) : typeof p2 === "function" ? p2.apply(this, arguments) : p2, p1 = t0.invert(p0), k1 = typeof k2 === "function" ? k2.apply(this, arguments) : k2;
      return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
    }, p2, event);
  };
  zoom2.translateBy = function(selection2, x2, y2, event) {
    zoom2.transform(selection2, function() {
      return constrain(this.__zoom.translate(
        typeof x2 === "function" ? x2.apply(this, arguments) : x2,
        typeof y2 === "function" ? y2.apply(this, arguments) : y2
      ), extent.apply(this, arguments), translateExtent);
    }, null, event);
  };
  zoom2.translateTo = function(selection2, x2, y2, p2, event) {
    zoom2.transform(selection2, function() {
      var e = extent.apply(this, arguments), t2 = this.__zoom, p0 = p2 == null ? centroid(e) : typeof p2 === "function" ? p2.apply(this, arguments) : p2;
      return constrain(identity.translate(p0[0], p0[1]).scale(t2.k).translate(
        typeof x2 === "function" ? -x2.apply(this, arguments) : -x2,
        typeof y2 === "function" ? -y2.apply(this, arguments) : -y2
      ), e, translateExtent);
    }, p2, event);
  };
  function scale(transform, k2) {
    k2 = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k2));
    return k2 === transform.k ? transform : new Transform(k2, transform.x, transform.y);
  }
  function translate(transform, p0, p1) {
    var x2 = p0[0] - p1[0] * transform.k, y2 = p0[1] - p1[1] * transform.k;
    return x2 === transform.x && y2 === transform.y ? transform : new Transform(transform.k, x2, y2);
  }
  function centroid(extent2) {
    return [(+extent2[0][0] + +extent2[1][0]) / 2, (+extent2[0][1] + +extent2[1][1]) / 2];
  }
  function schedule2(transition, transform, point, event) {
    transition.on("start.zoom", function() {
      gesture(this, arguments).event(event).start();
    }).on("interrupt.zoom end.zoom", function() {
      gesture(this, arguments).event(event).end();
    }).tween("zoom", function() {
      var that = this, args = arguments, g = gesture(that, args).event(event), e = extent.apply(that, args), p2 = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point, w2 = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]), a = that.__zoom, b = typeof transform === "function" ? transform.apply(that, args) : transform, i = interpolate2(a.invert(p2).concat(w2 / a.k), b.invert(p2).concat(w2 / b.k));
      return function(t2) {
        if (t2 === 1) t2 = b;
        else {
          var l2 = i(t2), k2 = w2 / l2[2];
          t2 = new Transform(k2, p2[0] - l2[0] * k2, p2[1] - l2[1] * k2);
        }
        g.zoom(null, t2);
      };
    });
  }
  function gesture(that, args, clean) {
    return !clean && that.__zooming || new Gesture(that, args);
  }
  function Gesture(that, args) {
    this.that = that;
    this.args = args;
    this.active = 0;
    this.sourceEvent = null;
    this.extent = extent.apply(that, args);
    this.taps = 0;
  }
  Gesture.prototype = {
    event: function(event) {
      if (event) this.sourceEvent = event;
      return this;
    },
    start: function() {
      if (++this.active === 1) {
        this.that.__zooming = this;
        this.emit("start");
      }
      return this;
    },
    zoom: function(key, transform) {
      if (this.mouse && key !== "mouse") this.mouse[1] = transform.invert(this.mouse[0]);
      if (this.touch0 && key !== "touch") this.touch0[1] = transform.invert(this.touch0[0]);
      if (this.touch1 && key !== "touch") this.touch1[1] = transform.invert(this.touch1[0]);
      this.that.__zoom = transform;
      this.emit("zoom");
      return this;
    },
    end: function() {
      if (--this.active === 0) {
        delete this.that.__zooming;
        this.emit("end");
      }
      return this;
    },
    emit: function(type) {
      var d = select(this.that).datum();
      listeners.call(
        type,
        this.that,
        new ZoomEvent(type, {
          sourceEvent: this.sourceEvent,
          target: zoom2,
          transform: this.that.__zoom,
          dispatch: listeners
        }),
        d
      );
    }
  };
  function wheeled(event, ...args) {
    if (!filter2.apply(this, arguments)) return;
    var g = gesture(this, args).event(event), t2 = this.__zoom, k2 = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t2.k * Math.pow(2, wheelDelta2.apply(this, arguments)))), p2 = pointer(event);
    if (g.wheel) {
      if (g.mouse[0][0] !== p2[0] || g.mouse[0][1] !== p2[1]) {
        g.mouse[1] = t2.invert(g.mouse[0] = p2);
      }
      clearTimeout(g.wheel);
    } else if (t2.k === k2) return;
    else {
      g.mouse = [p2, t2.invert(p2)];
      interrupt(this);
      g.start();
    }
    noevent(event);
    g.wheel = setTimeout(wheelidled, wheelDelay);
    g.zoom("mouse", constrain(translate(scale(t2, k2), g.mouse[0], g.mouse[1]), g.extent, translateExtent));
    function wheelidled() {
      g.wheel = null;
      g.end();
    }
  }
  function mousedowned(event, ...args) {
    if (touchending || !filter2.apply(this, arguments)) return;
    var currentTarget = event.currentTarget, g = gesture(this, args, true).event(event), v2 = select(event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true), p2 = pointer(event, currentTarget), x0 = event.clientX, y0 = event.clientY;
    dragDisable(event.view);
    nopropagation(event);
    g.mouse = [p2, this.__zoom.invert(p2)];
    interrupt(this);
    g.start();
    function mousemoved(event2) {
      noevent(event2);
      if (!g.moved) {
        var dx = event2.clientX - x0, dy = event2.clientY - y0;
        g.moved = dx * dx + dy * dy > clickDistance2;
      }
      g.event(event2).zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = pointer(event2, currentTarget), g.mouse[1]), g.extent, translateExtent));
    }
    function mouseupped(event2) {
      v2.on("mousemove.zoom mouseup.zoom", null);
      yesdrag(event2.view, g.moved);
      noevent(event2);
      g.event(event2).end();
    }
  }
  function dblclicked(event, ...args) {
    if (!filter2.apply(this, arguments)) return;
    var t0 = this.__zoom, p0 = pointer(event.changedTouches ? event.changedTouches[0] : event, this), p1 = t0.invert(p0), k1 = t0.k * (event.shiftKey ? 0.5 : 2), t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, args), translateExtent);
    noevent(event);
    if (duration > 0) select(this).transition().duration(duration).call(schedule2, t1, p0, event);
    else select(this).call(zoom2.transform, t1, p0, event);
  }
  function touchstarted(event, ...args) {
    if (!filter2.apply(this, arguments)) return;
    var touches = event.touches, n2 = touches.length, g = gesture(this, args, event.changedTouches.length === n2).event(event), started, i, t2, p2;
    nopropagation(event);
    for (i = 0; i < n2; ++i) {
      t2 = touches[i], p2 = pointer(t2, this);
      p2 = [p2, this.__zoom.invert(p2), t2.identifier];
      if (!g.touch0) g.touch0 = p2, started = true, g.taps = 1 + !!touchstarting;
      else if (!g.touch1 && g.touch0[2] !== p2[2]) g.touch1 = p2, g.taps = 0;
    }
    if (touchstarting) touchstarting = clearTimeout(touchstarting);
    if (started) {
      if (g.taps < 2) touchfirst = p2[0], touchstarting = setTimeout(function() {
        touchstarting = null;
      }, touchDelay);
      interrupt(this);
      g.start();
    }
  }
  function touchmoved(event, ...args) {
    if (!this.__zooming) return;
    var g = gesture(this, args).event(event), touches = event.changedTouches, n2 = touches.length, i, t2, p2, l2;
    noevent(event);
    for (i = 0; i < n2; ++i) {
      t2 = touches[i], p2 = pointer(t2, this);
      if (g.touch0 && g.touch0[2] === t2.identifier) g.touch0[0] = p2;
      else if (g.touch1 && g.touch1[2] === t2.identifier) g.touch1[0] = p2;
    }
    t2 = g.that.__zoom;
    if (g.touch1) {
      var p0 = g.touch0[0], l0 = g.touch0[1], p1 = g.touch1[0], l1 = g.touch1[1], dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp, dl2 = (dl2 = l1[0] - l0[0]) * dl2 + (dl2 = l1[1] - l0[1]) * dl2;
      t2 = scale(t2, Math.sqrt(dp / dl2));
      p2 = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
      l2 = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
    } else if (g.touch0) p2 = g.touch0[0], l2 = g.touch0[1];
    else return;
    g.zoom("touch", constrain(translate(t2, p2, l2), g.extent, translateExtent));
  }
  function touchended(event, ...args) {
    if (!this.__zooming) return;
    var g = gesture(this, args).event(event), touches = event.changedTouches, n2 = touches.length, i, t2;
    nopropagation(event);
    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function() {
      touchending = null;
    }, touchDelay);
    for (i = 0; i < n2; ++i) {
      t2 = touches[i];
      if (g.touch0 && g.touch0[2] === t2.identifier) delete g.touch0;
      else if (g.touch1 && g.touch1[2] === t2.identifier) delete g.touch1;
    }
    if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
    if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);
    else {
      g.end();
      if (g.taps === 2) {
        t2 = pointer(t2, this);
        if (Math.hypot(touchfirst[0] - t2[0], touchfirst[1] - t2[1]) < tapDistance) {
          var p2 = select(this).on("dblclick.zoom");
          if (p2) p2.apply(this, arguments);
        }
      }
    }
  }
  zoom2.wheelDelta = function(_) {
    return arguments.length ? (wheelDelta2 = typeof _ === "function" ? _ : constant(+_), zoom2) : wheelDelta2;
  };
  zoom2.filter = function(_) {
    return arguments.length ? (filter2 = typeof _ === "function" ? _ : constant(!!_), zoom2) : filter2;
  };
  zoom2.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant(!!_), zoom2) : touchable;
  };
  zoom2.extent = function(_) {
    return arguments.length ? (extent = typeof _ === "function" ? _ : constant([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom2) : extent;
  };
  zoom2.scaleExtent = function(_) {
    return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom2) : [scaleExtent[0], scaleExtent[1]];
  };
  zoom2.translateExtent = function(_) {
    return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom2) : [[translateExtent[0][0], translateExtent[0][1]], [translateExtent[1][0], translateExtent[1][1]]];
  };
  zoom2.constrain = function(_) {
    return arguments.length ? (constrain = _, zoom2) : constrain;
  };
  zoom2.duration = function(_) {
    return arguments.length ? (duration = +_, zoom2) : duration;
  };
  zoom2.interpolate = function(_) {
    return arguments.length ? (interpolate2 = _, zoom2) : interpolate2;
  };
  zoom2.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? zoom2 : value;
  };
  zoom2.clickDistance = function(_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom2) : Math.sqrt(clickDistance2);
  };
  zoom2.tapDistance = function(_) {
    return arguments.length ? (tapDistance = +_, zoom2) : tapDistance;
  };
  return zoom2;
}
const StoreContext = reactExports.createContext(null);
const Provider$1 = StoreContext.Provider;
const errorMessages = {
  error001: () => "[React Flow]: Seems like you have not used zustand provider as an ancestor. Help: https://reactflow.dev/error#001",
  error002: () => "It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.",
  error003: (nodeType) => `Node type "${nodeType}" not found. Using fallback type "default".`,
  error004: () => "The React Flow parent container needs a width and a height to render the graph.",
  error005: () => "Only child nodes can use a parent extent.",
  error006: () => "Can't create edge. An edge needs a source and a target.",
  error007: (id2) => `The old edge with id=${id2} does not exist.`,
  error009: (type) => `Marker type "${type}" doesn't exist.`,
  error008: (sourceHandle, edge) => `Couldn't create edge for ${!sourceHandle ? "source" : "target"} handle id: "${!sourceHandle ? edge.sourceHandle : edge.targetHandle}", edge id: ${edge.id}.`,
  error010: () => "Handle: No node id found. Make sure to only use a Handle inside a custom Node.",
  error011: (edgeType) => `Edge type "${edgeType}" not found. Using fallback type "default".`,
  error012: (id2) => `Node with id "${id2}" does not exist, it may have been removed. This can happen when a node is deleted before the "onNodeClick" handler is called.`
};
const zustandErrorMessage = errorMessages["error001"]();
function useStore(selector2, equalityFn) {
  const store = reactExports.useContext(StoreContext);
  if (store === null) {
    throw new Error(zustandErrorMessage);
  }
  return useStoreWithEqualityFn(store, selector2, equalityFn);
}
const useStoreApi = () => {
  const store = reactExports.useContext(StoreContext);
  if (store === null) {
    throw new Error(zustandErrorMessage);
  }
  return reactExports.useMemo(() => ({
    getState: store.getState,
    setState: store.setState,
    subscribe: store.subscribe,
    destroy: store.destroy
  }), [store]);
};
const selector$g = (s) => s.userSelectionActive ? "none" : "all";
function Panel({ position, children: children2, className, style: style2, ...rest }) {
  const pointerEvents = useStore(selector$g);
  const positionClasses = `${position}`.split("-");
  return React$2.createElement("div", { className: cc(["react-flow__panel", className, ...positionClasses]), style: { ...style2, pointerEvents }, ...rest }, children2);
}
function Attribution({ proOptions, position = "bottom-right" }) {
  if (proOptions == null ? void 0 : proOptions.hideAttribution) {
    return null;
  }
  return React$2.createElement(
    Panel,
    { position, className: "react-flow__attribution", "data-message": "Please only hide this attribution when you are subscribed to React Flow Pro: https://reactflow.dev/pro" },
    React$2.createElement("a", { href: "https://reactflow.dev", target: "_blank", rel: "noopener noreferrer", "aria-label": "React Flow attribution" }, "React Flow")
  );
}
const EdgeText = ({ x: x2, y: y2, label, labelStyle = {}, labelShowBg = true, labelBgStyle = {}, labelBgPadding = [2, 4], labelBgBorderRadius = 2, children: children2, className, ...rest }) => {
  const edgeRef = reactExports.useRef(null);
  const [edgeTextBbox, setEdgeTextBbox] = reactExports.useState({ x: 0, y: 0, width: 0, height: 0 });
  const edgeTextClasses = cc(["react-flow__edge-textwrapper", className]);
  reactExports.useEffect(() => {
    if (edgeRef.current) {
      const textBbox = edgeRef.current.getBBox();
      setEdgeTextBbox({
        x: textBbox.x,
        y: textBbox.y,
        width: textBbox.width,
        height: textBbox.height
      });
    }
  }, [label]);
  if (typeof label === "undefined" || !label) {
    return null;
  }
  return React$2.createElement(
    "g",
    { transform: `translate(${x2 - edgeTextBbox.width / 2} ${y2 - edgeTextBbox.height / 2})`, className: edgeTextClasses, visibility: edgeTextBbox.width ? "visible" : "hidden", ...rest },
    labelShowBg && React$2.createElement("rect", { width: edgeTextBbox.width + 2 * labelBgPadding[0], x: -labelBgPadding[0], y: -labelBgPadding[1], height: edgeTextBbox.height + 2 * labelBgPadding[1], className: "react-flow__edge-textbg", style: labelBgStyle, rx: labelBgBorderRadius, ry: labelBgBorderRadius }),
    React$2.createElement("text", { className: "react-flow__edge-text", y: edgeTextBbox.height / 2, dy: "0.3em", ref: edgeRef, style: labelStyle }, label),
    children2
  );
};
var EdgeText$1 = reactExports.memo(EdgeText);
const getDimensions = (node) => ({
  width: node.offsetWidth,
  height: node.offsetHeight
});
const clamp = (val, min = 0, max = 1) => Math.min(Math.max(val, min), max);
const clampPosition = (position = { x: 0, y: 0 }, extent) => ({
  x: clamp(position.x, extent[0][0], extent[1][0]),
  y: clamp(position.y, extent[0][1], extent[1][1])
});
const calcAutoPanVelocity = (value, min, max) => {
  if (value < min) {
    return clamp(Math.abs(value - min), 1, 50) / 50;
  } else if (value > max) {
    return -clamp(Math.abs(value - max), 1, 50) / 50;
  }
  return 0;
};
const calcAutoPan = (pos, bounds) => {
  const xMovement = calcAutoPanVelocity(pos.x, 35, bounds.width - 35) * 20;
  const yMovement = calcAutoPanVelocity(pos.y, 35, bounds.height - 35) * 20;
  return [xMovement, yMovement];
};
const getHostForElement = (element2) => {
  var _a;
  return ((_a = element2.getRootNode) == null ? void 0 : _a.call(element2)) || (window == null ? void 0 : window.document);
};
const getBoundsOfBoxes = (box1, box2) => ({
  x: Math.min(box1.x, box2.x),
  y: Math.min(box1.y, box2.y),
  x2: Math.max(box1.x2, box2.x2),
  y2: Math.max(box1.y2, box2.y2)
});
const rectToBox = ({ x: x2, y: y2, width, height }) => ({
  x: x2,
  y: y2,
  x2: x2 + width,
  y2: y2 + height
});
const boxToRect = ({ x: x2, y: y2, x2: x22, y2: y22 }) => ({
  x: x2,
  y: y2,
  width: x22 - x2,
  height: y22 - y2
});
const nodeToRect = (node) => ({
  ...node.positionAbsolute || { x: 0, y: 0 },
  width: node.width || 0,
  height: node.height || 0
});
const getBoundsOfRects = (rect1, rect2) => boxToRect(getBoundsOfBoxes(rectToBox(rect1), rectToBox(rect2)));
const getOverlappingArea = (rectA, rectB) => {
  const xOverlap = Math.max(0, Math.min(rectA.x + rectA.width, rectB.x + rectB.width) - Math.max(rectA.x, rectB.x));
  const yOverlap = Math.max(0, Math.min(rectA.y + rectA.height, rectB.y + rectB.height) - Math.max(rectA.y, rectB.y));
  return Math.ceil(xOverlap * yOverlap);
};
const isRectObject = (obj) => isNumeric(obj.width) && isNumeric(obj.height) && isNumeric(obj.x) && isNumeric(obj.y);
const isNumeric = (n2) => !isNaN(n2) && isFinite(n2);
const internalsSymbol = Symbol.for("internals");
const elementSelectionKeys = ["Enter", " ", "Escape"];
const devWarn = (id2, message) => {
};
const isReactKeyboardEvent = (event) => "nativeEvent" in event;
function isInputDOMNode(event) {
  var _a, _b;
  const kbEvent = isReactKeyboardEvent(event) ? event.nativeEvent : event;
  const target = ((_b = (_a = kbEvent.composedPath) == null ? void 0 : _a.call(kbEvent)) == null ? void 0 : _b[0]) || event.target;
  const isInput = ["INPUT", "SELECT", "TEXTAREA"].includes(target == null ? void 0 : target.nodeName) || (target == null ? void 0 : target.hasAttribute("contenteditable"));
  return isInput || !!(target == null ? void 0 : target.closest(".nokey"));
}
const isMouseEvent = (event) => "clientX" in event;
const getEventPosition = (event, bounds) => {
  var _a, _b;
  const isMouseTriggered = isMouseEvent(event);
  const evtX = isMouseTriggered ? event.clientX : (_a = event.touches) == null ? void 0 : _a[0].clientX;
  const evtY = isMouseTriggered ? event.clientY : (_b = event.touches) == null ? void 0 : _b[0].clientY;
  return {
    x: evtX - ((bounds == null ? void 0 : bounds.left) ?? 0),
    y: evtY - ((bounds == null ? void 0 : bounds.top) ?? 0)
  };
};
const isMacOs = () => {
  var _a;
  return typeof navigator !== "undefined" && ((_a = navigator == null ? void 0 : navigator.userAgent) == null ? void 0 : _a.indexOf("Mac")) >= 0;
};
const BaseEdge = ({ id: id2, path, labelX, labelY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, interactionWidth = 20 }) => {
  return React$2.createElement(
    React$2.Fragment,
    null,
    React$2.createElement("path", { id: id2, style: style2, d: path, fill: "none", className: "react-flow__edge-path", markerEnd, markerStart }),
    interactionWidth && React$2.createElement("path", { d: path, fill: "none", strokeOpacity: 0, strokeWidth: interactionWidth, className: "react-flow__edge-interaction" }),
    label && isNumeric(labelX) && isNumeric(labelY) ? React$2.createElement(EdgeText$1, { x: labelX, y: labelY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius }) : null
  );
};
BaseEdge.displayName = "BaseEdge";
function getMouseHandler$1(id2, getState, handler) {
  return handler === void 0 ? handler : (event) => {
    const edge = getState().edges.find((e) => e.id === id2);
    if (edge) {
      handler(event, { ...edge });
    }
  };
}
function getEdgeCenter({ sourceX, sourceY, targetX, targetY }) {
  const xOffset = Math.abs(targetX - sourceX) / 2;
  const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;
  const yOffset = Math.abs(targetY - sourceY) / 2;
  const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;
  return [centerX, centerY, xOffset, yOffset];
}
function getBezierEdgeCenter({ sourceX, sourceY, targetX, targetY, sourceControlX, sourceControlY, targetControlX, targetControlY }) {
  const centerX = sourceX * 0.125 + sourceControlX * 0.375 + targetControlX * 0.375 + targetX * 0.125;
  const centerY = sourceY * 0.125 + sourceControlY * 0.375 + targetControlY * 0.375 + targetY * 0.125;
  const offsetX = Math.abs(centerX - sourceX);
  const offsetY = Math.abs(centerY - sourceY);
  return [centerX, centerY, offsetX, offsetY];
}
var ConnectionMode;
(function(ConnectionMode2) {
  ConnectionMode2["Strict"] = "strict";
  ConnectionMode2["Loose"] = "loose";
})(ConnectionMode || (ConnectionMode = {}));
var PanOnScrollMode;
(function(PanOnScrollMode2) {
  PanOnScrollMode2["Free"] = "free";
  PanOnScrollMode2["Vertical"] = "vertical";
  PanOnScrollMode2["Horizontal"] = "horizontal";
})(PanOnScrollMode || (PanOnScrollMode = {}));
var SelectionMode;
(function(SelectionMode2) {
  SelectionMode2["Partial"] = "partial";
  SelectionMode2["Full"] = "full";
})(SelectionMode || (SelectionMode = {}));
var ConnectionLineType;
(function(ConnectionLineType2) {
  ConnectionLineType2["Bezier"] = "default";
  ConnectionLineType2["Straight"] = "straight";
  ConnectionLineType2["Step"] = "step";
  ConnectionLineType2["SmoothStep"] = "smoothstep";
  ConnectionLineType2["SimpleBezier"] = "simplebezier";
})(ConnectionLineType || (ConnectionLineType = {}));
var MarkerType;
(function(MarkerType2) {
  MarkerType2["Arrow"] = "arrow";
  MarkerType2["ArrowClosed"] = "arrowclosed";
})(MarkerType || (MarkerType = {}));
var Position;
(function(Position2) {
  Position2["Left"] = "left";
  Position2["Top"] = "top";
  Position2["Right"] = "right";
  Position2["Bottom"] = "bottom";
})(Position || (Position = {}));
function getControl({ pos, x1, y1, x2, y2 }) {
  if (pos === Position.Left || pos === Position.Right) {
    return [0.5 * (x1 + x2), y1];
  }
  return [x1, 0.5 * (y1 + y2)];
}
function getSimpleBezierPath({ sourceX, sourceY, sourcePosition = Position.Bottom, targetX, targetY, targetPosition = Position.Top }) {
  const [sourceControlX, sourceControlY] = getControl({
    pos: sourcePosition,
    x1: sourceX,
    y1: sourceY,
    x2: targetX,
    y2: targetY
  });
  const [targetControlX, targetControlY] = getControl({
    pos: targetPosition,
    x1: targetX,
    y1: targetY,
    x2: sourceX,
    y2: sourceY
  });
  const [labelX, labelY, offsetX, offsetY] = getBezierEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourceControlX,
    sourceControlY,
    targetControlX,
    targetControlY
  });
  return [
    `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`,
    labelX,
    labelY,
    offsetX,
    offsetY
  ];
}
const SimpleBezierEdge = reactExports.memo(({ sourceX, sourceY, targetX, targetY, sourcePosition = Position.Bottom, targetPosition = Position.Top, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, interactionWidth }) => {
  const [path, labelX, labelY] = getSimpleBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });
  return React$2.createElement(BaseEdge, { path, labelX, labelY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, interactionWidth });
});
SimpleBezierEdge.displayName = "SimpleBezierEdge";
const handleDirections = {
  [Position.Left]: { x: -1, y: 0 },
  [Position.Right]: { x: 1, y: 0 },
  [Position.Top]: { x: 0, y: -1 },
  [Position.Bottom]: { x: 0, y: 1 }
};
const getDirection = ({ source, sourcePosition = Position.Bottom, target }) => {
  if (sourcePosition === Position.Left || sourcePosition === Position.Right) {
    return source.x < target.x ? { x: 1, y: 0 } : { x: -1, y: 0 };
  }
  return source.y < target.y ? { x: 0, y: 1 } : { x: 0, y: -1 };
};
const distance = (a, b) => Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
function getPoints({ source, sourcePosition = Position.Bottom, target, targetPosition = Position.Top, center, offset }) {
  const sourceDir = handleDirections[sourcePosition];
  const targetDir = handleDirections[targetPosition];
  const sourceGapped = { x: source.x + sourceDir.x * offset, y: source.y + sourceDir.y * offset };
  const targetGapped = { x: target.x + targetDir.x * offset, y: target.y + targetDir.y * offset };
  const dir = getDirection({
    source: sourceGapped,
    sourcePosition,
    target: targetGapped
  });
  const dirAccessor = dir.x !== 0 ? "x" : "y";
  const currDir = dir[dirAccessor];
  let points = [];
  let centerX, centerY;
  const sourceGapOffset = { x: 0, y: 0 };
  const targetGapOffset = { x: 0, y: 0 };
  const [defaultCenterX, defaultCenterY, defaultOffsetX, defaultOffsetY] = getEdgeCenter({
    sourceX: source.x,
    sourceY: source.y,
    targetX: target.x,
    targetY: target.y
  });
  if (sourceDir[dirAccessor] * targetDir[dirAccessor] === -1) {
    centerX = center.x ?? defaultCenterX;
    centerY = center.y ?? defaultCenterY;
    const verticalSplit = [
      { x: centerX, y: sourceGapped.y },
      { x: centerX, y: targetGapped.y }
    ];
    const horizontalSplit = [
      { x: sourceGapped.x, y: centerY },
      { x: targetGapped.x, y: centerY }
    ];
    if (sourceDir[dirAccessor] === currDir) {
      points = dirAccessor === "x" ? verticalSplit : horizontalSplit;
    } else {
      points = dirAccessor === "x" ? horizontalSplit : verticalSplit;
    }
  } else {
    const sourceTarget = [{ x: sourceGapped.x, y: targetGapped.y }];
    const targetSource = [{ x: targetGapped.x, y: sourceGapped.y }];
    if (dirAccessor === "x") {
      points = sourceDir.x === currDir ? targetSource : sourceTarget;
    } else {
      points = sourceDir.y === currDir ? sourceTarget : targetSource;
    }
    if (sourcePosition === targetPosition) {
      const diff = Math.abs(source[dirAccessor] - target[dirAccessor]);
      if (diff <= offset) {
        const gapOffset = Math.min(offset - 1, offset - diff);
        if (sourceDir[dirAccessor] === currDir) {
          sourceGapOffset[dirAccessor] = (sourceGapped[dirAccessor] > source[dirAccessor] ? -1 : 1) * gapOffset;
        } else {
          targetGapOffset[dirAccessor] = (targetGapped[dirAccessor] > target[dirAccessor] ? -1 : 1) * gapOffset;
        }
      }
    }
    if (sourcePosition !== targetPosition) {
      const dirAccessorOpposite = dirAccessor === "x" ? "y" : "x";
      const isSameDir = sourceDir[dirAccessor] === targetDir[dirAccessorOpposite];
      const sourceGtTargetOppo = sourceGapped[dirAccessorOpposite] > targetGapped[dirAccessorOpposite];
      const sourceLtTargetOppo = sourceGapped[dirAccessorOpposite] < targetGapped[dirAccessorOpposite];
      const flipSourceTarget = sourceDir[dirAccessor] === 1 && (!isSameDir && sourceGtTargetOppo || isSameDir && sourceLtTargetOppo) || sourceDir[dirAccessor] !== 1 && (!isSameDir && sourceLtTargetOppo || isSameDir && sourceGtTargetOppo);
      if (flipSourceTarget) {
        points = dirAccessor === "x" ? sourceTarget : targetSource;
      }
    }
    const sourceGapPoint = { x: sourceGapped.x + sourceGapOffset.x, y: sourceGapped.y + sourceGapOffset.y };
    const targetGapPoint = { x: targetGapped.x + targetGapOffset.x, y: targetGapped.y + targetGapOffset.y };
    const maxXDistance = Math.max(Math.abs(sourceGapPoint.x - points[0].x), Math.abs(targetGapPoint.x - points[0].x));
    const maxYDistance = Math.max(Math.abs(sourceGapPoint.y - points[0].y), Math.abs(targetGapPoint.y - points[0].y));
    if (maxXDistance >= maxYDistance) {
      centerX = (sourceGapPoint.x + targetGapPoint.x) / 2;
      centerY = points[0].y;
    } else {
      centerX = points[0].x;
      centerY = (sourceGapPoint.y + targetGapPoint.y) / 2;
    }
  }
  const pathPoints = [
    source,
    { x: sourceGapped.x + sourceGapOffset.x, y: sourceGapped.y + sourceGapOffset.y },
    ...points,
    { x: targetGapped.x + targetGapOffset.x, y: targetGapped.y + targetGapOffset.y },
    target
  ];
  return [pathPoints, centerX, centerY, defaultOffsetX, defaultOffsetY];
}
function getBend(a, b, c, size) {
  const bendSize = Math.min(distance(a, b) / 2, distance(b, c) / 2, size);
  const { x: x2, y: y2 } = b;
  if (a.x === x2 && x2 === c.x || a.y === y2 && y2 === c.y) {
    return `L${x2} ${y2}`;
  }
  if (a.y === y2) {
    const xDir2 = a.x < c.x ? -1 : 1;
    const yDir2 = a.y < c.y ? 1 : -1;
    return `L ${x2 + bendSize * xDir2},${y2}Q ${x2},${y2} ${x2},${y2 + bendSize * yDir2}`;
  }
  const xDir = a.x < c.x ? 1 : -1;
  const yDir = a.y < c.y ? -1 : 1;
  return `L ${x2},${y2 + bendSize * yDir}Q ${x2},${y2} ${x2 + bendSize * xDir},${y2}`;
}
function getSmoothStepPath({ sourceX, sourceY, sourcePosition = Position.Bottom, targetX, targetY, targetPosition = Position.Top, borderRadius = 5, centerX, centerY, offset = 20 }) {
  const [points, labelX, labelY, offsetX, offsetY] = getPoints({
    source: { x: sourceX, y: sourceY },
    sourcePosition,
    target: { x: targetX, y: targetY },
    targetPosition,
    center: { x: centerX, y: centerY },
    offset
  });
  const path = points.reduce((res, p2, i) => {
    let segment = "";
    if (i > 0 && i < points.length - 1) {
      segment = getBend(points[i - 1], p2, points[i + 1], borderRadius);
    } else {
      segment = `${i === 0 ? "M" : "L"}${p2.x} ${p2.y}`;
    }
    res += segment;
    return res;
  }, "");
  return [path, labelX, labelY, offsetX, offsetY];
}
const SmoothStepEdge = reactExports.memo(({ sourceX, sourceY, targetX, targetY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, sourcePosition = Position.Bottom, targetPosition = Position.Top, markerEnd, markerStart, pathOptions, interactionWidth }) => {
  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: pathOptions == null ? void 0 : pathOptions.borderRadius,
    offset: pathOptions == null ? void 0 : pathOptions.offset
  });
  return React$2.createElement(BaseEdge, { path, labelX, labelY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, interactionWidth });
});
SmoothStepEdge.displayName = "SmoothStepEdge";
const StepEdge = reactExports.memo((props) => {
  var _a;
  return React$2.createElement(SmoothStepEdge, { ...props, pathOptions: reactExports.useMemo(() => {
    var _a2;
    return { borderRadius: 0, offset: (_a2 = props.pathOptions) == null ? void 0 : _a2.offset };
  }, [(_a = props.pathOptions) == null ? void 0 : _a.offset]) });
});
StepEdge.displayName = "StepEdge";
function getStraightPath({ sourceX, sourceY, targetX, targetY }) {
  const [labelX, labelY, offsetX, offsetY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY
  });
  return [`M ${sourceX},${sourceY}L ${targetX},${targetY}`, labelX, labelY, offsetX, offsetY];
}
const StraightEdge = reactExports.memo(({ sourceX, sourceY, targetX, targetY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, interactionWidth }) => {
  const [path, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  return React$2.createElement(BaseEdge, { path, labelX, labelY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, interactionWidth });
});
StraightEdge.displayName = "StraightEdge";
function calculateControlOffset(distance2, curvature) {
  if (distance2 >= 0) {
    return 0.5 * distance2;
  }
  return curvature * 25 * Math.sqrt(-distance2);
}
function getControlWithCurvature({ pos, x1, y1, x2, y2, c }) {
  switch (pos) {
    case Position.Left:
      return [x1 - calculateControlOffset(x1 - x2, c), y1];
    case Position.Right:
      return [x1 + calculateControlOffset(x2 - x1, c), y1];
    case Position.Top:
      return [x1, y1 - calculateControlOffset(y1 - y2, c)];
    case Position.Bottom:
      return [x1, y1 + calculateControlOffset(y2 - y1, c)];
  }
}
function getBezierPath({ sourceX, sourceY, sourcePosition = Position.Bottom, targetX, targetY, targetPosition = Position.Top, curvature = 0.25 }) {
  const [sourceControlX, sourceControlY] = getControlWithCurvature({
    pos: sourcePosition,
    x1: sourceX,
    y1: sourceY,
    x2: targetX,
    y2: targetY,
    c: curvature
  });
  const [targetControlX, targetControlY] = getControlWithCurvature({
    pos: targetPosition,
    x1: targetX,
    y1: targetY,
    x2: sourceX,
    y2: sourceY,
    c: curvature
  });
  const [labelX, labelY, offsetX, offsetY] = getBezierEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourceControlX,
    sourceControlY,
    targetControlX,
    targetControlY
  });
  return [
    `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`,
    labelX,
    labelY,
    offsetX,
    offsetY
  ];
}
const BezierEdge = reactExports.memo(({ sourceX, sourceY, targetX, targetY, sourcePosition = Position.Bottom, targetPosition = Position.Top, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, pathOptions, interactionWidth }) => {
  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: pathOptions == null ? void 0 : pathOptions.curvature
  });
  return React$2.createElement(BaseEdge, { path, labelX, labelY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, interactionWidth });
});
BezierEdge.displayName = "BezierEdge";
const NodeIdContext = reactExports.createContext(null);
const Provider = NodeIdContext.Provider;
NodeIdContext.Consumer;
const useNodeId = () => {
  const nodeId = reactExports.useContext(NodeIdContext);
  return nodeId;
};
const isEdge = (element2) => "id" in element2 && "source" in element2 && "target" in element2;
const getEdgeId = ({ source, sourceHandle, target, targetHandle }) => `reactflow__edge-${source}${sourceHandle || ""}-${target}${targetHandle || ""}`;
const getMarkerId = (marker, rfId) => {
  if (typeof marker === "undefined") {
    return "";
  }
  if (typeof marker === "string") {
    return marker;
  }
  const idPrefix = rfId ? `${rfId}__` : "";
  return `${idPrefix}${Object.keys(marker).sort().map((key) => `${key}=${marker[key]}`).join("&")}`;
};
const connectionExists = (edge, edges) => {
  return edges.some((el2) => el2.source === edge.source && el2.target === edge.target && (el2.sourceHandle === edge.sourceHandle || !el2.sourceHandle && !edge.sourceHandle) && (el2.targetHandle === edge.targetHandle || !el2.targetHandle && !edge.targetHandle));
};
const addEdge = (edgeParams, edges) => {
  if (!edgeParams.source || !edgeParams.target) {
    return edges;
  }
  let edge;
  if (isEdge(edgeParams)) {
    edge = { ...edgeParams };
  } else {
    edge = {
      ...edgeParams,
      id: getEdgeId(edgeParams)
    };
  }
  if (connectionExists(edge, edges)) {
    return edges;
  }
  return edges.concat(edge);
};
const pointToRendererPoint = ({ x: x2, y: y2 }, [tx, ty, tScale], snapToGrid, [snapX, snapY]) => {
  const position = {
    x: (x2 - tx) / tScale,
    y: (y2 - ty) / tScale
  };
  if (snapToGrid) {
    return {
      x: snapX * Math.round(position.x / snapX),
      y: snapY * Math.round(position.y / snapY)
    };
  }
  return position;
};
const rendererPointToPoint = ({ x: x2, y: y2 }, [tx, ty, tScale]) => {
  return {
    x: x2 * tScale + tx,
    y: y2 * tScale + ty
  };
};
const getNodePositionWithOrigin = (node, nodeOrigin = [0, 0]) => {
  if (!node) {
    return {
      x: 0,
      y: 0,
      positionAbsolute: {
        x: 0,
        y: 0
      }
    };
  }
  const offsetX = (node.width ?? 0) * nodeOrigin[0];
  const offsetY = (node.height ?? 0) * nodeOrigin[1];
  const position = {
    x: node.position.x - offsetX,
    y: node.position.y - offsetY
  };
  return {
    ...position,
    positionAbsolute: node.positionAbsolute ? {
      x: node.positionAbsolute.x - offsetX,
      y: node.positionAbsolute.y - offsetY
    } : position
  };
};
const getNodesBounds = (nodes, nodeOrigin = [0, 0]) => {
  if (nodes.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  const box = nodes.reduce((currBox, node) => {
    const { x: x2, y: y2 } = getNodePositionWithOrigin(node, nodeOrigin).positionAbsolute;
    return getBoundsOfBoxes(currBox, rectToBox({
      x: x2,
      y: y2,
      width: node.width || 0,
      height: node.height || 0
    }));
  }, { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity });
  return boxToRect(box);
};
const getNodesInside = (nodeInternals, rect, [tx, ty, tScale] = [0, 0, 1], partially = false, excludeNonSelectableNodes = false, nodeOrigin = [0, 0]) => {
  const paneRect = {
    x: (rect.x - tx) / tScale,
    y: (rect.y - ty) / tScale,
    width: rect.width / tScale,
    height: rect.height / tScale
  };
  const visibleNodes = [];
  nodeInternals.forEach((node) => {
    const { width, height, selectable = true, hidden = false } = node;
    if (excludeNonSelectableNodes && !selectable || hidden) {
      return false;
    }
    const { positionAbsolute } = getNodePositionWithOrigin(node, nodeOrigin);
    const nodeRect = {
      x: positionAbsolute.x,
      y: positionAbsolute.y,
      width: width || 0,
      height: height || 0
    };
    const overlappingArea = getOverlappingArea(paneRect, nodeRect);
    const notInitialized = typeof width === "undefined" || typeof height === "undefined" || width === null || height === null;
    const partiallyVisible = partially && overlappingArea > 0;
    const area = (width || 0) * (height || 0);
    const isVisible = notInitialized || partiallyVisible || overlappingArea >= area;
    if (isVisible || node.dragging) {
      visibleNodes.push(node);
    }
  });
  return visibleNodes;
};
const getConnectedEdges = (nodes, edges) => {
  const nodeIds = nodes.map((node) => node.id);
  return edges.filter((edge) => nodeIds.includes(edge.source) || nodeIds.includes(edge.target));
};
const getViewportForBounds = (bounds, width, height, minZoom, maxZoom, padding = 0.1) => {
  const xZoom = width / (bounds.width * (1 + padding));
  const yZoom = height / (bounds.height * (1 + padding));
  const zoom2 = Math.min(xZoom, yZoom);
  const clampedZoom = clamp(zoom2, minZoom, maxZoom);
  const boundsCenterX = bounds.x + bounds.width / 2;
  const boundsCenterY = bounds.y + bounds.height / 2;
  const x2 = width / 2 - boundsCenterX * clampedZoom;
  const y2 = height / 2 - boundsCenterY * clampedZoom;
  return { x: x2, y: y2, zoom: clampedZoom };
};
const getD3Transition = (selection2, duration = 0) => {
  return selection2.transition().duration(duration);
};
function getHandles(node, handleBounds, type, currentHandle) {
  return (handleBounds[type] || []).reduce((res, h) => {
    var _a, _b;
    if (`${node.id}-${h.id}-${type}` !== currentHandle) {
      res.push({
        id: h.id || null,
        type,
        nodeId: node.id,
        x: (((_a = node.positionAbsolute) == null ? void 0 : _a.x) ?? 0) + h.x + h.width / 2,
        y: (((_b = node.positionAbsolute) == null ? void 0 : _b.y) ?? 0) + h.y + h.height / 2
      });
    }
    return res;
  }, []);
}
function getClosestHandle(event, doc, pos, connectionRadius, handles, validator) {
  const { x: x2, y: y2 } = getEventPosition(event);
  const domNodes = doc.elementsFromPoint(x2, y2);
  const handleBelow = domNodes.find((el2) => el2.classList.contains("react-flow__handle"));
  if (handleBelow) {
    const handleNodeId = handleBelow.getAttribute("data-nodeid");
    if (handleNodeId) {
      const handleType = getHandleType(void 0, handleBelow);
      const handleId = handleBelow.getAttribute("data-handleid");
      const validHandleResult = validator({ nodeId: handleNodeId, id: handleId, type: handleType });
      if (validHandleResult) {
        const handle = handles.find((h) => h.nodeId === handleNodeId && h.type === handleType && h.id === handleId);
        return {
          handle: {
            id: handleId,
            type: handleType,
            nodeId: handleNodeId,
            x: (handle == null ? void 0 : handle.x) || pos.x,
            y: (handle == null ? void 0 : handle.y) || pos.y
          },
          validHandleResult
        };
      }
    }
  }
  let closestHandles = [];
  let minDistance = Infinity;
  handles.forEach((handle) => {
    const distance2 = Math.sqrt((handle.x - pos.x) ** 2 + (handle.y - pos.y) ** 2);
    if (distance2 <= connectionRadius) {
      const validHandleResult = validator(handle);
      if (distance2 <= minDistance) {
        if (distance2 < minDistance) {
          closestHandles = [{ handle, validHandleResult }];
        } else if (distance2 === minDistance) {
          closestHandles.push({
            handle,
            validHandleResult
          });
        }
        minDistance = distance2;
      }
    }
  });
  if (!closestHandles.length) {
    return { handle: null, validHandleResult: defaultResult() };
  }
  if (closestHandles.length === 1) {
    return closestHandles[0];
  }
  const hasValidHandle = closestHandles.some(({ validHandleResult }) => validHandleResult.isValid);
  const hasTargetHandle = closestHandles.some(({ handle }) => handle.type === "target");
  return closestHandles.find(({ handle, validHandleResult }) => hasTargetHandle ? handle.type === "target" : hasValidHandle ? validHandleResult.isValid : true) || closestHandles[0];
}
const nullConnection = { source: null, target: null, sourceHandle: null, targetHandle: null };
const defaultResult = () => ({
  handleDomNode: null,
  isValid: false,
  connection: nullConnection,
  endHandle: null
});
function isValidHandle(handle, connectionMode, fromNodeId, fromHandleId, fromType, isValidConnection, doc) {
  const isTarget = fromType === "target";
  const handleToCheck = doc.querySelector(`.react-flow__handle[data-id="${handle == null ? void 0 : handle.nodeId}-${handle == null ? void 0 : handle.id}-${handle == null ? void 0 : handle.type}"]`);
  const result = {
    ...defaultResult(),
    handleDomNode: handleToCheck
  };
  if (handleToCheck) {
    const handleType = getHandleType(void 0, handleToCheck);
    const handleNodeId = handleToCheck.getAttribute("data-nodeid");
    const handleId = handleToCheck.getAttribute("data-handleid");
    const connectable = handleToCheck.classList.contains("connectable");
    const connectableEnd = handleToCheck.classList.contains("connectableend");
    const connection = {
      source: isTarget ? handleNodeId : fromNodeId,
      sourceHandle: isTarget ? handleId : fromHandleId,
      target: isTarget ? fromNodeId : handleNodeId,
      targetHandle: isTarget ? fromHandleId : handleId
    };
    result.connection = connection;
    const isConnectable = connectable && connectableEnd;
    const isValid = isConnectable && (connectionMode === ConnectionMode.Strict ? isTarget && handleType === "source" || !isTarget && handleType === "target" : handleNodeId !== fromNodeId || handleId !== fromHandleId);
    if (isValid) {
      result.endHandle = {
        nodeId: handleNodeId,
        handleId,
        type: handleType
      };
      result.isValid = isValidConnection(connection);
    }
  }
  return result;
}
function getHandleLookup({ nodes, nodeId, handleId, handleType }) {
  return nodes.reduce((res, node) => {
    if (node[internalsSymbol]) {
      const { handleBounds } = node[internalsSymbol];
      let sourceHandles = [];
      let targetHandles = [];
      if (handleBounds) {
        sourceHandles = getHandles(node, handleBounds, "source", `${nodeId}-${handleId}-${handleType}`);
        targetHandles = getHandles(node, handleBounds, "target", `${nodeId}-${handleId}-${handleType}`);
      }
      res.push(...sourceHandles, ...targetHandles);
    }
    return res;
  }, []);
}
function getHandleType(edgeUpdaterType, handleDomNode) {
  if (edgeUpdaterType) {
    return edgeUpdaterType;
  } else if (handleDomNode == null ? void 0 : handleDomNode.classList.contains("target")) {
    return "target";
  } else if (handleDomNode == null ? void 0 : handleDomNode.classList.contains("source")) {
    return "source";
  }
  return null;
}
function resetRecentHandle(handleDomNode) {
  handleDomNode == null ? void 0 : handleDomNode.classList.remove("valid", "connecting", "react-flow__handle-valid", "react-flow__handle-connecting");
}
function getConnectionStatus(isInsideConnectionRadius, isHandleValid) {
  let connectionStatus = null;
  if (isHandleValid) {
    connectionStatus = "valid";
  } else if (isInsideConnectionRadius && !isHandleValid) {
    connectionStatus = "invalid";
  }
  return connectionStatus;
}
function handlePointerDown({ event, handleId, nodeId, onConnect, isTarget, getState, setState, isValidConnection, edgeUpdaterType, onReconnectEnd }) {
  const doc = getHostForElement(event.target);
  const { connectionMode, domNode, autoPanOnConnect, connectionRadius, onConnectStart, panBy, getNodes, cancelConnection } = getState();
  let autoPanId = 0;
  let closestHandle;
  const { x: x2, y: y2 } = getEventPosition(event);
  const clickedHandle = doc == null ? void 0 : doc.elementFromPoint(x2, y2);
  const handleType = getHandleType(edgeUpdaterType, clickedHandle);
  const containerBounds = domNode == null ? void 0 : domNode.getBoundingClientRect();
  if (!containerBounds || !handleType) {
    return;
  }
  let prevActiveHandle;
  let connectionPosition = getEventPosition(event, containerBounds);
  let autoPanStarted = false;
  let connection = null;
  let isValid = false;
  let handleDomNode = null;
  const handleLookup = getHandleLookup({
    nodes: getNodes(),
    nodeId,
    handleId,
    handleType
  });
  const autoPan = () => {
    if (!autoPanOnConnect) {
      return;
    }
    const [xMovement, yMovement] = calcAutoPan(connectionPosition, containerBounds);
    panBy({ x: xMovement, y: yMovement });
    autoPanId = requestAnimationFrame(autoPan);
  };
  setState({
    connectionPosition,
    connectionStatus: null,
    // connectionNodeId etc will be removed in the next major in favor of connectionStartHandle
    connectionNodeId: nodeId,
    connectionHandleId: handleId,
    connectionHandleType: handleType,
    connectionStartHandle: {
      nodeId,
      handleId,
      type: handleType
    },
    connectionEndHandle: null
  });
  onConnectStart == null ? void 0 : onConnectStart(event, { nodeId, handleId, handleType });
  function onPointerMove(event2) {
    const { transform } = getState();
    connectionPosition = getEventPosition(event2, containerBounds);
    const { handle, validHandleResult } = getClosestHandle(event2, doc, pointToRendererPoint(connectionPosition, transform, false, [1, 1]), connectionRadius, handleLookup, (handle2) => isValidHandle(handle2, connectionMode, nodeId, handleId, isTarget ? "target" : "source", isValidConnection, doc));
    closestHandle = handle;
    if (!autoPanStarted) {
      autoPan();
      autoPanStarted = true;
    }
    handleDomNode = validHandleResult.handleDomNode;
    connection = validHandleResult.connection;
    isValid = validHandleResult.isValid;
    setState({
      connectionPosition: closestHandle && isValid ? rendererPointToPoint({
        x: closestHandle.x,
        y: closestHandle.y
      }, transform) : connectionPosition,
      connectionStatus: getConnectionStatus(!!closestHandle, isValid),
      connectionEndHandle: validHandleResult.endHandle
    });
    if (!closestHandle && !isValid && !handleDomNode) {
      return resetRecentHandle(prevActiveHandle);
    }
    if (connection.source !== connection.target && handleDomNode) {
      resetRecentHandle(prevActiveHandle);
      prevActiveHandle = handleDomNode;
      handleDomNode.classList.add("connecting", "react-flow__handle-connecting");
      handleDomNode.classList.toggle("valid", isValid);
      handleDomNode.classList.toggle("react-flow__handle-valid", isValid);
    }
  }
  function onPointerUp(event2) {
    var _a, _b;
    if ((closestHandle || handleDomNode) && connection && isValid) {
      onConnect == null ? void 0 : onConnect(connection);
    }
    (_b = (_a = getState()).onConnectEnd) == null ? void 0 : _b.call(_a, event2);
    if (edgeUpdaterType) {
      onReconnectEnd == null ? void 0 : onReconnectEnd(event2);
    }
    resetRecentHandle(prevActiveHandle);
    cancelConnection();
    cancelAnimationFrame(autoPanId);
    autoPanStarted = false;
    isValid = false;
    connection = null;
    handleDomNode = null;
    doc.removeEventListener("mousemove", onPointerMove);
    doc.removeEventListener("mouseup", onPointerUp);
    doc.removeEventListener("touchmove", onPointerMove);
    doc.removeEventListener("touchend", onPointerUp);
  }
  doc.addEventListener("mousemove", onPointerMove);
  doc.addEventListener("mouseup", onPointerUp);
  doc.addEventListener("touchmove", onPointerMove);
  doc.addEventListener("touchend", onPointerUp);
}
const alwaysValid = () => true;
const selector$f = (s) => ({
  connectionStartHandle: s.connectionStartHandle,
  connectOnClick: s.connectOnClick,
  noPanClassName: s.noPanClassName
});
const connectingSelector = (nodeId, handleId, type) => (state) => {
  const { connectionStartHandle: startHandle, connectionEndHandle: endHandle, connectionClickStartHandle: clickHandle } = state;
  return {
    connecting: (startHandle == null ? void 0 : startHandle.nodeId) === nodeId && (startHandle == null ? void 0 : startHandle.handleId) === handleId && (startHandle == null ? void 0 : startHandle.type) === type || (endHandle == null ? void 0 : endHandle.nodeId) === nodeId && (endHandle == null ? void 0 : endHandle.handleId) === handleId && (endHandle == null ? void 0 : endHandle.type) === type,
    clickConnecting: (clickHandle == null ? void 0 : clickHandle.nodeId) === nodeId && (clickHandle == null ? void 0 : clickHandle.handleId) === handleId && (clickHandle == null ? void 0 : clickHandle.type) === type
  };
};
const Handle = reactExports.forwardRef(({ type = "source", position = Position.Top, isValidConnection, isConnectable = true, isConnectableStart = true, isConnectableEnd = true, id: id2, onConnect, children: children2, className, onMouseDown, onTouchStart, ...rest }, ref) => {
  var _a, _b;
  const handleId = id2 || null;
  const isTarget = type === "target";
  const store = useStoreApi();
  const nodeId = useNodeId();
  const { connectOnClick, noPanClassName } = useStore(selector$f, shallow$1);
  const { connecting, clickConnecting } = useStore(connectingSelector(nodeId, handleId, type), shallow$1);
  if (!nodeId) {
    (_b = (_a = store.getState()).onError) == null ? void 0 : _b.call(_a, "010", errorMessages["error010"]());
  }
  const onConnectExtended = (params) => {
    const { defaultEdgeOptions, onConnect: onConnectAction, hasDefaultEdges } = store.getState();
    const edgeParams = {
      ...defaultEdgeOptions,
      ...params
    };
    if (hasDefaultEdges) {
      const { edges, setEdges } = store.getState();
      setEdges(addEdge(edgeParams, edges));
    }
    onConnectAction == null ? void 0 : onConnectAction(edgeParams);
    onConnect == null ? void 0 : onConnect(edgeParams);
  };
  const onPointerDown = (event) => {
    if (!nodeId) {
      return;
    }
    const isMouseTriggered = isMouseEvent(event);
    if (isConnectableStart && (isMouseTriggered && event.button === 0 || !isMouseTriggered)) {
      handlePointerDown({
        event,
        handleId,
        nodeId,
        onConnect: onConnectExtended,
        isTarget,
        getState: store.getState,
        setState: store.setState,
        isValidConnection: isValidConnection || store.getState().isValidConnection || alwaysValid
      });
    }
    if (isMouseTriggered) {
      onMouseDown == null ? void 0 : onMouseDown(event);
    } else {
      onTouchStart == null ? void 0 : onTouchStart(event);
    }
  };
  const onClick = (event) => {
    const { onClickConnectStart, onClickConnectEnd, connectionClickStartHandle, connectionMode, isValidConnection: isValidConnectionStore } = store.getState();
    if (!nodeId || !connectionClickStartHandle && !isConnectableStart) {
      return;
    }
    if (!connectionClickStartHandle) {
      onClickConnectStart == null ? void 0 : onClickConnectStart(event, { nodeId, handleId, handleType: type });
      store.setState({ connectionClickStartHandle: { nodeId, type, handleId } });
      return;
    }
    const doc = getHostForElement(event.target);
    const isValidConnectionHandler = isValidConnection || isValidConnectionStore || alwaysValid;
    const { connection, isValid } = isValidHandle({
      nodeId,
      id: handleId,
      type
    }, connectionMode, connectionClickStartHandle.nodeId, connectionClickStartHandle.handleId || null, connectionClickStartHandle.type, isValidConnectionHandler, doc);
    if (isValid) {
      onConnectExtended(connection);
    }
    onClickConnectEnd == null ? void 0 : onClickConnectEnd(event);
    store.setState({ connectionClickStartHandle: null });
  };
  return React$2.createElement("div", { "data-handleid": handleId, "data-nodeid": nodeId, "data-handlepos": position, "data-id": `${nodeId}-${handleId}-${type}`, className: cc([
    "react-flow__handle",
    `react-flow__handle-${position}`,
    "nodrag",
    noPanClassName,
    className,
    {
      source: !isTarget,
      target: isTarget,
      connectable: isConnectable,
      connectablestart: isConnectableStart,
      connectableend: isConnectableEnd,
      connecting: clickConnecting,
      // this class is used to style the handle when the user is connecting
      connectionindicator: isConnectable && (isConnectableStart && !connecting || isConnectableEnd && connecting)
    }
  ]), onMouseDown: onPointerDown, onTouchStart: onPointerDown, onClick: connectOnClick ? onClick : void 0, ref, ...rest }, children2);
});
Handle.displayName = "Handle";
var Handle$1 = reactExports.memo(Handle);
const DefaultNode = ({ data, isConnectable, targetPosition = Position.Top, sourcePosition = Position.Bottom }) => {
  return React$2.createElement(
    React$2.Fragment,
    null,
    React$2.createElement(Handle$1, { type: "target", position: targetPosition, isConnectable }),
    data == null ? void 0 : data.label,
    React$2.createElement(Handle$1, { type: "source", position: sourcePosition, isConnectable })
  );
};
DefaultNode.displayName = "DefaultNode";
var DefaultNode$1 = reactExports.memo(DefaultNode);
const InputNode = ({ data, isConnectable, sourcePosition = Position.Bottom }) => React$2.createElement(
  React$2.Fragment,
  null,
  data == null ? void 0 : data.label,
  React$2.createElement(Handle$1, { type: "source", position: sourcePosition, isConnectable })
);
InputNode.displayName = "InputNode";
var InputNode$1 = reactExports.memo(InputNode);
const OutputNode = ({ data, isConnectable, targetPosition = Position.Top }) => React$2.createElement(
  React$2.Fragment,
  null,
  React$2.createElement(Handle$1, { type: "target", position: targetPosition, isConnectable }),
  data == null ? void 0 : data.label
);
OutputNode.displayName = "OutputNode";
var OutputNode$1 = reactExports.memo(OutputNode);
const GroupNode = () => null;
GroupNode.displayName = "GroupNode";
const selector$e = (s) => ({
  selectedNodes: s.getNodes().filter((n2) => n2.selected),
  selectedEdges: s.edges.filter((e) => e.selected).map((e) => ({ ...e }))
});
const selectId = (obj) => obj.id;
function areEqual(a, b) {
  return shallow$1(a.selectedNodes.map(selectId), b.selectedNodes.map(selectId)) && shallow$1(a.selectedEdges.map(selectId), b.selectedEdges.map(selectId));
}
const SelectionListener = reactExports.memo(({ onSelectionChange }) => {
  const store = useStoreApi();
  const { selectedNodes, selectedEdges } = useStore(selector$e, areEqual);
  reactExports.useEffect(() => {
    const params = { nodes: selectedNodes, edges: selectedEdges };
    onSelectionChange == null ? void 0 : onSelectionChange(params);
    store.getState().onSelectionChange.forEach((fn) => fn(params));
  }, [selectedNodes, selectedEdges, onSelectionChange]);
  return null;
});
SelectionListener.displayName = "SelectionListener";
const changeSelector = (s) => !!s.onSelectionChange;
function Wrapper$1({ onSelectionChange }) {
  const storeHasSelectionChange = useStore(changeSelector);
  if (onSelectionChange || storeHasSelectionChange) {
    return React$2.createElement(SelectionListener, { onSelectionChange });
  }
  return null;
}
const selector$d = (s) => ({
  setNodes: s.setNodes,
  setEdges: s.setEdges,
  setDefaultNodesAndEdges: s.setDefaultNodesAndEdges,
  setMinZoom: s.setMinZoom,
  setMaxZoom: s.setMaxZoom,
  setTranslateExtent: s.setTranslateExtent,
  setNodeExtent: s.setNodeExtent,
  reset: s.reset
});
function useStoreUpdater(value, setStoreState) {
  reactExports.useEffect(() => {
    if (typeof value !== "undefined") {
      setStoreState(value);
    }
  }, [value]);
}
function useDirectStoreUpdater(key, value, setState) {
  reactExports.useEffect(() => {
    if (typeof value !== "undefined") {
      setState({ [key]: value });
    }
  }, [value]);
}
const StoreUpdater = ({ nodes, edges, defaultNodes, defaultEdges, onConnect, onConnectStart, onConnectEnd, onClickConnectStart, onClickConnectEnd, nodesDraggable, nodesConnectable, nodesFocusable, edgesFocusable, edgesUpdatable, elevateNodesOnSelect, minZoom, maxZoom, nodeExtent, onNodesChange, onEdgesChange, elementsSelectable, connectionMode, snapGrid, snapToGrid, translateExtent, connectOnClick, defaultEdgeOptions, fitView: fitView2, fitViewOptions, onNodesDelete, onEdgesDelete, onNodeDrag, onNodeDragStart, onNodeDragStop, onSelectionDrag, onSelectionDragStart, onSelectionDragStop, noPanClassName, nodeOrigin, rfId, autoPanOnConnect, autoPanOnNodeDrag, onError, connectionRadius, isValidConnection, nodeDragThreshold }) => {
  const { setNodes, setEdges, setDefaultNodesAndEdges, setMinZoom, setMaxZoom, setTranslateExtent, setNodeExtent, reset } = useStore(selector$d, shallow$1);
  const store = useStoreApi();
  reactExports.useEffect(() => {
    const edgesWithDefaults = defaultEdges == null ? void 0 : defaultEdges.map((e) => ({ ...e, ...defaultEdgeOptions }));
    setDefaultNodesAndEdges(defaultNodes, edgesWithDefaults);
    return () => {
      reset();
    };
  }, []);
  useDirectStoreUpdater("defaultEdgeOptions", defaultEdgeOptions, store.setState);
  useDirectStoreUpdater("connectionMode", connectionMode, store.setState);
  useDirectStoreUpdater("onConnect", onConnect, store.setState);
  useDirectStoreUpdater("onConnectStart", onConnectStart, store.setState);
  useDirectStoreUpdater("onConnectEnd", onConnectEnd, store.setState);
  useDirectStoreUpdater("onClickConnectStart", onClickConnectStart, store.setState);
  useDirectStoreUpdater("onClickConnectEnd", onClickConnectEnd, store.setState);
  useDirectStoreUpdater("nodesDraggable", nodesDraggable, store.setState);
  useDirectStoreUpdater("nodesConnectable", nodesConnectable, store.setState);
  useDirectStoreUpdater("nodesFocusable", nodesFocusable, store.setState);
  useDirectStoreUpdater("edgesFocusable", edgesFocusable, store.setState);
  useDirectStoreUpdater("edgesUpdatable", edgesUpdatable, store.setState);
  useDirectStoreUpdater("elementsSelectable", elementsSelectable, store.setState);
  useDirectStoreUpdater("elevateNodesOnSelect", elevateNodesOnSelect, store.setState);
  useDirectStoreUpdater("snapToGrid", snapToGrid, store.setState);
  useDirectStoreUpdater("snapGrid", snapGrid, store.setState);
  useDirectStoreUpdater("onNodesChange", onNodesChange, store.setState);
  useDirectStoreUpdater("onEdgesChange", onEdgesChange, store.setState);
  useDirectStoreUpdater("connectOnClick", connectOnClick, store.setState);
  useDirectStoreUpdater("fitViewOnInit", fitView2, store.setState);
  useDirectStoreUpdater("fitViewOnInitOptions", fitViewOptions, store.setState);
  useDirectStoreUpdater("onNodesDelete", onNodesDelete, store.setState);
  useDirectStoreUpdater("onEdgesDelete", onEdgesDelete, store.setState);
  useDirectStoreUpdater("onNodeDrag", onNodeDrag, store.setState);
  useDirectStoreUpdater("onNodeDragStart", onNodeDragStart, store.setState);
  useDirectStoreUpdater("onNodeDragStop", onNodeDragStop, store.setState);
  useDirectStoreUpdater("onSelectionDrag", onSelectionDrag, store.setState);
  useDirectStoreUpdater("onSelectionDragStart", onSelectionDragStart, store.setState);
  useDirectStoreUpdater("onSelectionDragStop", onSelectionDragStop, store.setState);
  useDirectStoreUpdater("noPanClassName", noPanClassName, store.setState);
  useDirectStoreUpdater("nodeOrigin", nodeOrigin, store.setState);
  useDirectStoreUpdater("rfId", rfId, store.setState);
  useDirectStoreUpdater("autoPanOnConnect", autoPanOnConnect, store.setState);
  useDirectStoreUpdater("autoPanOnNodeDrag", autoPanOnNodeDrag, store.setState);
  useDirectStoreUpdater("onError", onError, store.setState);
  useDirectStoreUpdater("connectionRadius", connectionRadius, store.setState);
  useDirectStoreUpdater("isValidConnection", isValidConnection, store.setState);
  useDirectStoreUpdater("nodeDragThreshold", nodeDragThreshold, store.setState);
  useStoreUpdater(nodes, setNodes);
  useStoreUpdater(edges, setEdges);
  useStoreUpdater(minZoom, setMinZoom);
  useStoreUpdater(maxZoom, setMaxZoom);
  useStoreUpdater(translateExtent, setTranslateExtent);
  useStoreUpdater(nodeExtent, setNodeExtent);
  return null;
};
const style = { display: "none" };
const ariaLiveStyle = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0px, 0px, 0px, 0px)",
  clipPath: "inset(100%)"
};
const ARIA_NODE_DESC_KEY = "react-flow__node-desc";
const ARIA_EDGE_DESC_KEY = "react-flow__edge-desc";
const ARIA_LIVE_MESSAGE = "react-flow__aria-live";
const selector$c = (s) => s.ariaLiveMessage;
function AriaLiveMessage({ rfId }) {
  const ariaLiveMessage = useStore(selector$c);
  return React$2.createElement("div", { id: `${ARIA_LIVE_MESSAGE}-${rfId}`, "aria-live": "assertive", "aria-atomic": "true", style: ariaLiveStyle }, ariaLiveMessage);
}
function A11yDescriptions({ rfId, disableKeyboardA11y }) {
  return React$2.createElement(
    React$2.Fragment,
    null,
    React$2.createElement(
      "div",
      { id: `${ARIA_NODE_DESC_KEY}-${rfId}`, style },
      "Press enter or space to select a node.",
      !disableKeyboardA11y && "You can then use the arrow keys to move the node around.",
      " Press delete to remove it and escape to cancel.",
      " "
    ),
    React$2.createElement("div", { id: `${ARIA_EDGE_DESC_KEY}-${rfId}`, style }, "Press enter or space to select an edge. You can then press delete to remove it or escape to cancel."),
    !disableKeyboardA11y && React$2.createElement(AriaLiveMessage, { rfId })
  );
}
var useKeyPress = (keyCode = null, options = { actInsideInputWithModifier: true }) => {
  const [keyPressed, setKeyPressed] = reactExports.useState(false);
  const modifierPressed = reactExports.useRef(false);
  const pressedKeys = reactExports.useRef(/* @__PURE__ */ new Set([]));
  const [keyCodes, keysToWatch] = reactExports.useMemo(() => {
    if (keyCode !== null) {
      const keyCodeArr = Array.isArray(keyCode) ? keyCode : [keyCode];
      const keys = keyCodeArr.filter((kc2) => typeof kc2 === "string").map((kc2) => kc2.split("+"));
      const keysFlat = keys.reduce((res, item) => res.concat(...item), []);
      return [keys, keysFlat];
    }
    return [[], []];
  }, [keyCode]);
  reactExports.useEffect(() => {
    const doc = typeof document !== "undefined" ? document : null;
    const target = (options == null ? void 0 : options.target) || doc;
    if (keyCode !== null) {
      const downHandler = (event) => {
        modifierPressed.current = event.ctrlKey || event.metaKey || event.shiftKey;
        const preventAction = (!modifierPressed.current || modifierPressed.current && !options.actInsideInputWithModifier) && isInputDOMNode(event);
        if (preventAction) {
          return false;
        }
        const keyOrCode = useKeyOrCode(event.code, keysToWatch);
        pressedKeys.current.add(event[keyOrCode]);
        if (isMatchingKey(keyCodes, pressedKeys.current, false)) {
          event.preventDefault();
          setKeyPressed(true);
        }
      };
      const upHandler = (event) => {
        const preventAction = (!modifierPressed.current || modifierPressed.current && !options.actInsideInputWithModifier) && isInputDOMNode(event);
        if (preventAction) {
          return false;
        }
        const keyOrCode = useKeyOrCode(event.code, keysToWatch);
        if (isMatchingKey(keyCodes, pressedKeys.current, true)) {
          setKeyPressed(false);
          pressedKeys.current.clear();
        } else {
          pressedKeys.current.delete(event[keyOrCode]);
        }
        if (event.key === "Meta") {
          pressedKeys.current.clear();
        }
        modifierPressed.current = false;
      };
      const resetHandler = () => {
        pressedKeys.current.clear();
        setKeyPressed(false);
      };
      target == null ? void 0 : target.addEventListener("keydown", downHandler);
      target == null ? void 0 : target.addEventListener("keyup", upHandler);
      window.addEventListener("blur", resetHandler);
      return () => {
        target == null ? void 0 : target.removeEventListener("keydown", downHandler);
        target == null ? void 0 : target.removeEventListener("keyup", upHandler);
        window.removeEventListener("blur", resetHandler);
      };
    }
  }, [keyCode, setKeyPressed]);
  return keyPressed;
};
function isMatchingKey(keyCodes, pressedKeys, isUp) {
  return keyCodes.filter((keys) => isUp || keys.length === pressedKeys.size).some((keys) => keys.every((k2) => pressedKeys.has(k2)));
}
function useKeyOrCode(eventCode, keysToWatch) {
  return keysToWatch.includes(eventCode) ? "code" : "key";
}
function calculateXYZPosition(node, nodeInternals, result, nodeOrigin) {
  var _a, _b;
  const parentId = node.parentNode || node.parentId;
  if (!parentId) {
    return result;
  }
  const parentNode = nodeInternals.get(parentId);
  const parentNodePosition = getNodePositionWithOrigin(parentNode, nodeOrigin);
  return calculateXYZPosition(parentNode, nodeInternals, {
    x: (result.x ?? 0) + parentNodePosition.x,
    y: (result.y ?? 0) + parentNodePosition.y,
    z: (((_a = parentNode[internalsSymbol]) == null ? void 0 : _a.z) ?? 0) > (result.z ?? 0) ? ((_b = parentNode[internalsSymbol]) == null ? void 0 : _b.z) ?? 0 : result.z ?? 0
  }, nodeOrigin);
}
function updateAbsoluteNodePositions(nodeInternals, nodeOrigin, parentNodes) {
  nodeInternals.forEach((node) => {
    var _a;
    const parentId = node.parentNode || node.parentId;
    if (parentId && !nodeInternals.has(parentId)) {
      throw new Error(`Parent node ${parentId} not found`);
    }
    if (parentId || (parentNodes == null ? void 0 : parentNodes[node.id])) {
      const { x: x2, y: y2, z: z2 } = calculateXYZPosition(node, nodeInternals, {
        ...node.position,
        z: ((_a = node[internalsSymbol]) == null ? void 0 : _a.z) ?? 0
      }, nodeOrigin);
      node.positionAbsolute = {
        x: x2,
        y: y2
      };
      node[internalsSymbol].z = z2;
      if (parentNodes == null ? void 0 : parentNodes[node.id]) {
        node[internalsSymbol].isParent = true;
      }
    }
  });
}
function createNodeInternals(nodes, nodeInternals, nodeOrigin, elevateNodesOnSelect) {
  const nextNodeInternals = /* @__PURE__ */ new Map();
  const parentNodes = {};
  const selectedNodeZ = elevateNodesOnSelect ? 1e3 : 0;
  nodes.forEach((node) => {
    var _a;
    const z2 = (isNumeric(node.zIndex) ? node.zIndex : 0) + (node.selected ? selectedNodeZ : 0);
    const currInternals = nodeInternals.get(node.id);
    const internals = {
      ...node,
      positionAbsolute: {
        x: node.position.x,
        y: node.position.y
      }
    };
    const parentId = node.parentNode || node.parentId;
    if (parentId) {
      parentNodes[parentId] = true;
    }
    const resetHandleBounds = (currInternals == null ? void 0 : currInternals.type) && (currInternals == null ? void 0 : currInternals.type) !== node.type;
    Object.defineProperty(internals, internalsSymbol, {
      enumerable: false,
      value: {
        handleBounds: resetHandleBounds ? void 0 : (_a = currInternals == null ? void 0 : currInternals[internalsSymbol]) == null ? void 0 : _a.handleBounds,
        z: z2
      }
    });
    nextNodeInternals.set(node.id, internals);
  });
  updateAbsoluteNodePositions(nextNodeInternals, nodeOrigin, parentNodes);
  return nextNodeInternals;
}
function fitView(get2, options = {}) {
  const { getNodes, width, height, minZoom, maxZoom, d3Zoom, d3Selection, fitViewOnInitDone, fitViewOnInit, nodeOrigin } = get2();
  const isInitialFitView = options.initial && !fitViewOnInitDone && fitViewOnInit;
  const d3initialized = d3Zoom && d3Selection;
  if (d3initialized && (isInitialFitView || !options.initial)) {
    const nodes = getNodes().filter((n2) => {
      var _a;
      const isVisible = options.includeHiddenNodes ? n2.width && n2.height : !n2.hidden;
      if ((_a = options.nodes) == null ? void 0 : _a.length) {
        return isVisible && options.nodes.some((optionNode) => optionNode.id === n2.id);
      }
      return isVisible;
    });
    const nodesInitialized = nodes.every((n2) => n2.width && n2.height);
    if (nodes.length > 0 && nodesInitialized) {
      const bounds = getNodesBounds(nodes, nodeOrigin);
      const { x: x2, y: y2, zoom: zoom2 } = getViewportForBounds(bounds, width, height, options.minZoom ?? minZoom, options.maxZoom ?? maxZoom, options.padding ?? 0.1);
      const nextTransform = identity.translate(x2, y2).scale(zoom2);
      if (typeof options.duration === "number" && options.duration > 0) {
        d3Zoom.transform(getD3Transition(d3Selection, options.duration), nextTransform);
      } else {
        d3Zoom.transform(d3Selection, nextTransform);
      }
      return true;
    }
  }
  return false;
}
function handleControlledNodeSelectionChange(nodeChanges, nodeInternals) {
  nodeChanges.forEach((change) => {
    const node = nodeInternals.get(change.id);
    if (node) {
      nodeInternals.set(node.id, {
        ...node,
        [internalsSymbol]: node[internalsSymbol],
        selected: change.selected
      });
    }
  });
  return new Map(nodeInternals);
}
function handleControlledEdgeSelectionChange(edgeChanges, edges) {
  return edges.map((e) => {
    const change = edgeChanges.find((change2) => change2.id === e.id);
    if (change) {
      e.selected = change.selected;
    }
    return e;
  });
}
function updateNodesAndEdgesSelections({ changedNodes, changedEdges, get: get2, set: set2 }) {
  const { nodeInternals, edges, onNodesChange, onEdgesChange, hasDefaultNodes, hasDefaultEdges } = get2();
  if (changedNodes == null ? void 0 : changedNodes.length) {
    if (hasDefaultNodes) {
      set2({ nodeInternals: handleControlledNodeSelectionChange(changedNodes, nodeInternals) });
    }
    onNodesChange == null ? void 0 : onNodesChange(changedNodes);
  }
  if (changedEdges == null ? void 0 : changedEdges.length) {
    if (hasDefaultEdges) {
      set2({ edges: handleControlledEdgeSelectionChange(changedEdges, edges) });
    }
    onEdgesChange == null ? void 0 : onEdgesChange(changedEdges);
  }
}
const noop = () => {
};
const initialViewportHelper = {
  zoomIn: noop,
  zoomOut: noop,
  zoomTo: noop,
  getZoom: () => 1,
  setViewport: noop,
  getViewport: () => ({ x: 0, y: 0, zoom: 1 }),
  fitView: () => false,
  setCenter: noop,
  fitBounds: noop,
  project: (position) => position,
  screenToFlowPosition: (position) => position,
  flowToScreenPosition: (position) => position,
  viewportInitialized: false
};
const selector$b = (s) => ({
  d3Zoom: s.d3Zoom,
  d3Selection: s.d3Selection
});
const useViewportHelper = () => {
  const store = useStoreApi();
  const { d3Zoom, d3Selection } = useStore(selector$b, shallow$1);
  const viewportHelperFunctions = reactExports.useMemo(() => {
    if (d3Selection && d3Zoom) {
      return {
        zoomIn: (options) => d3Zoom.scaleBy(getD3Transition(d3Selection, options == null ? void 0 : options.duration), 1.2),
        zoomOut: (options) => d3Zoom.scaleBy(getD3Transition(d3Selection, options == null ? void 0 : options.duration), 1 / 1.2),
        zoomTo: (zoomLevel, options) => d3Zoom.scaleTo(getD3Transition(d3Selection, options == null ? void 0 : options.duration), zoomLevel),
        getZoom: () => store.getState().transform[2],
        setViewport: (transform, options) => {
          const [x2, y2, zoom2] = store.getState().transform;
          const nextTransform = identity.translate(transform.x ?? x2, transform.y ?? y2).scale(transform.zoom ?? zoom2);
          d3Zoom.transform(getD3Transition(d3Selection, options == null ? void 0 : options.duration), nextTransform);
        },
        getViewport: () => {
          const [x2, y2, zoom2] = store.getState().transform;
          return { x: x2, y: y2, zoom: zoom2 };
        },
        fitView: (options) => fitView(store.getState, options),
        setCenter: (x2, y2, options) => {
          const { width, height, maxZoom } = store.getState();
          const nextZoom = typeof (options == null ? void 0 : options.zoom) !== "undefined" ? options.zoom : maxZoom;
          const centerX = width / 2 - x2 * nextZoom;
          const centerY = height / 2 - y2 * nextZoom;
          const transform = identity.translate(centerX, centerY).scale(nextZoom);
          d3Zoom.transform(getD3Transition(d3Selection, options == null ? void 0 : options.duration), transform);
        },
        fitBounds: (bounds, options) => {
          const { width, height, minZoom, maxZoom } = store.getState();
          const { x: x2, y: y2, zoom: zoom2 } = getViewportForBounds(bounds, width, height, minZoom, maxZoom, (options == null ? void 0 : options.padding) ?? 0.1);
          const transform = identity.translate(x2, y2).scale(zoom2);
          d3Zoom.transform(getD3Transition(d3Selection, options == null ? void 0 : options.duration), transform);
        },
        // @deprecated Use `screenToFlowPosition`.
        project: (position) => {
          const { transform, snapToGrid, snapGrid } = store.getState();
          console.warn("[DEPRECATED] `project` is deprecated. Instead use `screenToFlowPosition`. There is no need to subtract the react flow bounds anymore! https://reactflow.dev/api-reference/types/react-flow-instance#screen-to-flow-position");
          return pointToRendererPoint(position, transform, snapToGrid, snapGrid);
        },
        screenToFlowPosition: (position) => {
          const { transform, snapToGrid, snapGrid, domNode } = store.getState();
          if (!domNode) {
            return position;
          }
          const { x: domX, y: domY } = domNode.getBoundingClientRect();
          const relativePosition = {
            x: position.x - domX,
            y: position.y - domY
          };
          return pointToRendererPoint(relativePosition, transform, snapToGrid, snapGrid);
        },
        flowToScreenPosition: (position) => {
          const { transform, domNode } = store.getState();
          if (!domNode) {
            return position;
          }
          const { x: domX, y: domY } = domNode.getBoundingClientRect();
          const rendererPosition = rendererPointToPoint(position, transform);
          return {
            x: rendererPosition.x + domX,
            y: rendererPosition.y + domY
          };
        },
        viewportInitialized: true
      };
    }
    return initialViewportHelper;
  }, [d3Zoom, d3Selection]);
  return viewportHelperFunctions;
};
function useReactFlow() {
  const viewportHelper = useViewportHelper();
  const store = useStoreApi();
  const getNodes = reactExports.useCallback(() => {
    return store.getState().getNodes().map((n2) => ({ ...n2 }));
  }, []);
  const getNode = reactExports.useCallback((id2) => {
    return store.getState().nodeInternals.get(id2);
  }, []);
  const getEdges = reactExports.useCallback(() => {
    const { edges = [] } = store.getState();
    return edges.map((e) => ({ ...e }));
  }, []);
  const getEdge = reactExports.useCallback((id2) => {
    const { edges = [] } = store.getState();
    return edges.find((e) => e.id === id2);
  }, []);
  const setNodes = reactExports.useCallback((payload) => {
    const { getNodes: getNodes2, setNodes: setNodes2, hasDefaultNodes, onNodesChange } = store.getState();
    const nodes = getNodes2();
    const nextNodes = typeof payload === "function" ? payload(nodes) : payload;
    if (hasDefaultNodes) {
      setNodes2(nextNodes);
    } else if (onNodesChange) {
      const changes = nextNodes.length === 0 ? nodes.map((node) => ({ type: "remove", id: node.id })) : nextNodes.map((node) => ({ item: node, type: "reset" }));
      onNodesChange(changes);
    }
  }, []);
  const setEdges = reactExports.useCallback((payload) => {
    const { edges = [], setEdges: setEdges2, hasDefaultEdges, onEdgesChange } = store.getState();
    const nextEdges = typeof payload === "function" ? payload(edges) : payload;
    if (hasDefaultEdges) {
      setEdges2(nextEdges);
    } else if (onEdgesChange) {
      const changes = nextEdges.length === 0 ? edges.map((edge) => ({ type: "remove", id: edge.id })) : nextEdges.map((edge) => ({ item: edge, type: "reset" }));
      onEdgesChange(changes);
    }
  }, []);
  const addNodes = reactExports.useCallback((payload) => {
    const nodes = Array.isArray(payload) ? payload : [payload];
    const { getNodes: getNodes2, setNodes: setNodes2, hasDefaultNodes, onNodesChange } = store.getState();
    if (hasDefaultNodes) {
      const currentNodes = getNodes2();
      const nextNodes = [...currentNodes, ...nodes];
      setNodes2(nextNodes);
    } else if (onNodesChange) {
      const changes = nodes.map((node) => ({ item: node, type: "add" }));
      onNodesChange(changes);
    }
  }, []);
  const addEdges = reactExports.useCallback((payload) => {
    const nextEdges = Array.isArray(payload) ? payload : [payload];
    const { edges = [], setEdges: setEdges2, hasDefaultEdges, onEdgesChange } = store.getState();
    if (hasDefaultEdges) {
      setEdges2([...edges, ...nextEdges]);
    } else if (onEdgesChange) {
      const changes = nextEdges.map((edge) => ({ item: edge, type: "add" }));
      onEdgesChange(changes);
    }
  }, []);
  const toObject = reactExports.useCallback(() => {
    const { getNodes: getNodes2, edges = [], transform } = store.getState();
    const [x2, y2, zoom2] = transform;
    return {
      nodes: getNodes2().map((n2) => ({ ...n2 })),
      edges: edges.map((e) => ({ ...e })),
      viewport: {
        x: x2,
        y: y2,
        zoom: zoom2
      }
    };
  }, []);
  const deleteElements = reactExports.useCallback(({ nodes: nodesDeleted, edges: edgesDeleted }) => {
    const { nodeInternals, getNodes: getNodes2, edges, hasDefaultNodes, hasDefaultEdges, onNodesDelete, onEdgesDelete, onNodesChange, onEdgesChange } = store.getState();
    const nodeIds = (nodesDeleted || []).map((node) => node.id);
    const edgeIds = (edgesDeleted || []).map((edge) => edge.id);
    const nodesToRemove = getNodes2().reduce((res, node) => {
      const parentId = node.parentNode || node.parentId;
      const parentHit = !nodeIds.includes(node.id) && parentId && res.find((n2) => n2.id === parentId);
      const deletable = typeof node.deletable === "boolean" ? node.deletable : true;
      if (deletable && (nodeIds.includes(node.id) || parentHit)) {
        res.push(node);
      }
      return res;
    }, []);
    const deletableEdges = edges.filter((e) => typeof e.deletable === "boolean" ? e.deletable : true);
    const initialHitEdges = deletableEdges.filter((e) => edgeIds.includes(e.id));
    if (nodesToRemove || initialHitEdges) {
      const connectedEdges = getConnectedEdges(nodesToRemove, deletableEdges);
      const edgesToRemove = [...initialHitEdges, ...connectedEdges];
      const edgeIdsToRemove = edgesToRemove.reduce((res, edge) => {
        if (!res.includes(edge.id)) {
          res.push(edge.id);
        }
        return res;
      }, []);
      if (hasDefaultEdges || hasDefaultNodes) {
        if (hasDefaultEdges) {
          store.setState({
            edges: edges.filter((e) => !edgeIdsToRemove.includes(e.id))
          });
        }
        if (hasDefaultNodes) {
          nodesToRemove.forEach((node) => {
            nodeInternals.delete(node.id);
          });
          store.setState({
            nodeInternals: new Map(nodeInternals)
          });
        }
      }
      if (edgeIdsToRemove.length > 0) {
        onEdgesDelete == null ? void 0 : onEdgesDelete(edgesToRemove);
        if (onEdgesChange) {
          onEdgesChange(edgeIdsToRemove.map((id2) => ({
            id: id2,
            type: "remove"
          })));
        }
      }
      if (nodesToRemove.length > 0) {
        onNodesDelete == null ? void 0 : onNodesDelete(nodesToRemove);
        if (onNodesChange) {
          const nodeChanges = nodesToRemove.map((n2) => ({ id: n2.id, type: "remove" }));
          onNodesChange(nodeChanges);
        }
      }
    }
  }, []);
  const getNodeRect = reactExports.useCallback((nodeOrRect) => {
    const isRect = isRectObject(nodeOrRect);
    const node = isRect ? null : store.getState().nodeInternals.get(nodeOrRect.id);
    if (!isRect && !node) {
      return [null, null, isRect];
    }
    const nodeRect = isRect ? nodeOrRect : nodeToRect(node);
    return [nodeRect, node, isRect];
  }, []);
  const getIntersectingNodes = reactExports.useCallback((nodeOrRect, partially = true, nodes) => {
    const [nodeRect, node, isRect] = getNodeRect(nodeOrRect);
    if (!nodeRect) {
      return [];
    }
    return (nodes || store.getState().getNodes()).filter((n2) => {
      if (!isRect && (n2.id === node.id || !n2.positionAbsolute)) {
        return false;
      }
      const currNodeRect = nodeToRect(n2);
      const overlappingArea = getOverlappingArea(currNodeRect, nodeRect);
      const partiallyVisible = partially && overlappingArea > 0;
      return partiallyVisible || overlappingArea >= nodeRect.width * nodeRect.height;
    });
  }, []);
  const isNodeIntersecting = reactExports.useCallback((nodeOrRect, area, partially = true) => {
    const [nodeRect] = getNodeRect(nodeOrRect);
    if (!nodeRect) {
      return false;
    }
    const overlappingArea = getOverlappingArea(nodeRect, area);
    const partiallyVisible = partially && overlappingArea > 0;
    return partiallyVisible || overlappingArea >= nodeRect.width * nodeRect.height;
  }, []);
  return reactExports.useMemo(() => {
    return {
      ...viewportHelper,
      getNodes,
      getNode,
      getEdges,
      getEdge,
      setNodes,
      setEdges,
      addNodes,
      addEdges,
      toObject,
      deleteElements,
      getIntersectingNodes,
      isNodeIntersecting
    };
  }, [
    viewportHelper,
    getNodes,
    getNode,
    getEdges,
    getEdge,
    setNodes,
    setEdges,
    addNodes,
    addEdges,
    toObject,
    deleteElements,
    getIntersectingNodes,
    isNodeIntersecting
  ]);
}
const deleteKeyOptions = { actInsideInputWithModifier: false };
var useGlobalKeyHandler = ({ deleteKeyCode, multiSelectionKeyCode }) => {
  const store = useStoreApi();
  const { deleteElements } = useReactFlow();
  const deleteKeyPressed = useKeyPress(deleteKeyCode, deleteKeyOptions);
  const multiSelectionKeyPressed = useKeyPress(multiSelectionKeyCode);
  reactExports.useEffect(() => {
    if (deleteKeyPressed) {
      const { edges, getNodes } = store.getState();
      const selectedNodes = getNodes().filter((node) => node.selected);
      const selectedEdges = edges.filter((edge) => edge.selected);
      deleteElements({ nodes: selectedNodes, edges: selectedEdges });
      store.setState({ nodesSelectionActive: false });
    }
  }, [deleteKeyPressed]);
  reactExports.useEffect(() => {
    store.setState({ multiSelectionActive: multiSelectionKeyPressed });
  }, [multiSelectionKeyPressed]);
};
function useResizeHandler(rendererNode) {
  const store = useStoreApi();
  reactExports.useEffect(() => {
    let resizeObserver;
    const updateDimensions = () => {
      var _a, _b;
      if (!rendererNode.current) {
        return;
      }
      const size = getDimensions(rendererNode.current);
      if (size.height === 0 || size.width === 0) {
        (_b = (_a = store.getState()).onError) == null ? void 0 : _b.call(_a, "004", errorMessages["error004"]());
      }
      store.setState({ width: size.width || 500, height: size.height || 500 });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    if (rendererNode.current) {
      resizeObserver = new ResizeObserver(() => updateDimensions());
      resizeObserver.observe(rendererNode.current);
    }
    return () => {
      window.removeEventListener("resize", updateDimensions);
      if (resizeObserver && rendererNode.current) {
        resizeObserver.unobserve(rendererNode.current);
      }
    };
  }, []);
}
const containerStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0
};
const viewChanged = (prevViewport, eventTransform) => prevViewport.x !== eventTransform.x || prevViewport.y !== eventTransform.y || prevViewport.zoom !== eventTransform.k;
const eventToFlowTransform = (eventTransform) => ({
  x: eventTransform.x,
  y: eventTransform.y,
  zoom: eventTransform.k
});
const isWrappedWithClass = (event, className) => event.target.closest(`.${className}`);
const isRightClickPan = (panOnDrag, usedButton) => usedButton === 2 && Array.isArray(panOnDrag) && panOnDrag.includes(2);
const wheelDelta = (event) => {
  const factor = event.ctrlKey && isMacOs() ? 10 : 1;
  return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 2e-3) * factor;
};
const selector$a = (s) => ({
  d3Zoom: s.d3Zoom,
  d3Selection: s.d3Selection,
  d3ZoomHandler: s.d3ZoomHandler,
  userSelectionActive: s.userSelectionActive
});
const ZoomPane = ({ onMove, onMoveStart, onMoveEnd, onPaneContextMenu, zoomOnScroll = true, zoomOnPinch = true, panOnScroll = false, panOnScrollSpeed = 0.5, panOnScrollMode = PanOnScrollMode.Free, zoomOnDoubleClick = true, elementsSelectable, panOnDrag = true, defaultViewport, translateExtent, minZoom, maxZoom, zoomActivationKeyCode, preventScrolling = true, children: children2, noWheelClassName, noPanClassName }) => {
  const timerId = reactExports.useRef();
  const store = useStoreApi();
  const isZoomingOrPanning = reactExports.useRef(false);
  const zoomedWithRightMouseButton = reactExports.useRef(false);
  const zoomPane = reactExports.useRef(null);
  const prevTransform = reactExports.useRef({ x: 0, y: 0, zoom: 0 });
  const { d3Zoom, d3Selection, d3ZoomHandler, userSelectionActive } = useStore(selector$a, shallow$1);
  const zoomActivationKeyPressed = useKeyPress(zoomActivationKeyCode);
  const mouseButton = reactExports.useRef(0);
  const isPanScrolling = reactExports.useRef(false);
  const panScrollTimeout = reactExports.useRef();
  useResizeHandler(zoomPane);
  reactExports.useEffect(() => {
    if (zoomPane.current) {
      const bbox = zoomPane.current.getBoundingClientRect();
      const d3ZoomInstance = zoom().scaleExtent([minZoom, maxZoom]).translateExtent(translateExtent);
      const selection2 = select(zoomPane.current).call(d3ZoomInstance);
      const updatedTransform = identity.translate(defaultViewport.x, defaultViewport.y).scale(clamp(defaultViewport.zoom, minZoom, maxZoom));
      const extent = [
        [0, 0],
        [bbox.width, bbox.height]
      ];
      const constrainedTransform = d3ZoomInstance.constrain()(updatedTransform, extent, translateExtent);
      d3ZoomInstance.transform(selection2, constrainedTransform);
      d3ZoomInstance.wheelDelta(wheelDelta);
      store.setState({
        d3Zoom: d3ZoomInstance,
        d3Selection: selection2,
        d3ZoomHandler: selection2.on("wheel.zoom"),
        // we need to pass transform because zoom handler is not registered when we set the initial transform
        transform: [constrainedTransform.x, constrainedTransform.y, constrainedTransform.k],
        domNode: zoomPane.current.closest(".react-flow")
      });
    }
  }, []);
  reactExports.useEffect(() => {
    if (d3Selection && d3Zoom) {
      if (panOnScroll && !zoomActivationKeyPressed && !userSelectionActive) {
        d3Selection.on("wheel.zoom", (event) => {
          if (isWrappedWithClass(event, noWheelClassName)) {
            return false;
          }
          event.preventDefault();
          event.stopImmediatePropagation();
          const currentZoom = d3Selection.property("__zoom").k || 1;
          if (event.ctrlKey && zoomOnPinch) {
            const point = pointer(event);
            const pinchDelta = wheelDelta(event);
            const zoom2 = currentZoom * Math.pow(2, pinchDelta);
            d3Zoom.scaleTo(d3Selection, zoom2, point, event);
            return;
          }
          const deltaNormalize = event.deltaMode === 1 ? 20 : 1;
          let deltaX = panOnScrollMode === PanOnScrollMode.Vertical ? 0 : event.deltaX * deltaNormalize;
          let deltaY = panOnScrollMode === PanOnScrollMode.Horizontal ? 0 : event.deltaY * deltaNormalize;
          if (!isMacOs() && event.shiftKey && panOnScrollMode !== PanOnScrollMode.Vertical) {
            deltaX = event.deltaY * deltaNormalize;
            deltaY = 0;
          }
          d3Zoom.translateBy(
            d3Selection,
            -(deltaX / currentZoom) * panOnScrollSpeed,
            -(deltaY / currentZoom) * panOnScrollSpeed,
            // @ts-ignore
            { internal: true }
          );
          const nextViewport = eventToFlowTransform(d3Selection.property("__zoom"));
          const { onViewportChangeStart, onViewportChange, onViewportChangeEnd } = store.getState();
          clearTimeout(panScrollTimeout.current);
          if (!isPanScrolling.current) {
            isPanScrolling.current = true;
            onMoveStart == null ? void 0 : onMoveStart(event, nextViewport);
            onViewportChangeStart == null ? void 0 : onViewportChangeStart(nextViewport);
          }
          if (isPanScrolling.current) {
            onMove == null ? void 0 : onMove(event, nextViewport);
            onViewportChange == null ? void 0 : onViewportChange(nextViewport);
            panScrollTimeout.current = setTimeout(() => {
              onMoveEnd == null ? void 0 : onMoveEnd(event, nextViewport);
              onViewportChangeEnd == null ? void 0 : onViewportChangeEnd(nextViewport);
              isPanScrolling.current = false;
            }, 150);
          }
        }, { passive: false });
      } else if (typeof d3ZoomHandler !== "undefined") {
        d3Selection.on("wheel.zoom", function(event, d) {
          const invalidEvent = !preventScrolling && event.type === "wheel" && !event.ctrlKey;
          if (invalidEvent || isWrappedWithClass(event, noWheelClassName)) {
            return null;
          }
          event.preventDefault();
          d3ZoomHandler.call(this, event, d);
        }, { passive: false });
      }
    }
  }, [
    userSelectionActive,
    panOnScroll,
    panOnScrollMode,
    d3Selection,
    d3Zoom,
    d3ZoomHandler,
    zoomActivationKeyPressed,
    zoomOnPinch,
    preventScrolling,
    noWheelClassName,
    onMoveStart,
    onMove,
    onMoveEnd
  ]);
  reactExports.useEffect(() => {
    if (d3Zoom) {
      d3Zoom.on("start", (event) => {
        var _a, _b;
        if (!event.sourceEvent || event.sourceEvent.internal) {
          return null;
        }
        mouseButton.current = (_a = event.sourceEvent) == null ? void 0 : _a.button;
        const { onViewportChangeStart } = store.getState();
        const flowTransform = eventToFlowTransform(event.transform);
        isZoomingOrPanning.current = true;
        prevTransform.current = flowTransform;
        if (((_b = event.sourceEvent) == null ? void 0 : _b.type) === "mousedown") {
          store.setState({ paneDragging: true });
        }
        onViewportChangeStart == null ? void 0 : onViewportChangeStart(flowTransform);
        onMoveStart == null ? void 0 : onMoveStart(event.sourceEvent, flowTransform);
      });
    }
  }, [d3Zoom, onMoveStart]);
  reactExports.useEffect(() => {
    if (d3Zoom) {
      if (userSelectionActive && !isZoomingOrPanning.current) {
        d3Zoom.on("zoom", null);
      } else if (!userSelectionActive) {
        d3Zoom.on("zoom", (event) => {
          var _a;
          const { onViewportChange } = store.getState();
          store.setState({ transform: [event.transform.x, event.transform.y, event.transform.k] });
          zoomedWithRightMouseButton.current = !!(onPaneContextMenu && isRightClickPan(panOnDrag, mouseButton.current ?? 0));
          if ((onMove || onViewportChange) && !((_a = event.sourceEvent) == null ? void 0 : _a.internal)) {
            const flowTransform = eventToFlowTransform(event.transform);
            onViewportChange == null ? void 0 : onViewportChange(flowTransform);
            onMove == null ? void 0 : onMove(event.sourceEvent, flowTransform);
          }
        });
      }
    }
  }, [userSelectionActive, d3Zoom, onMove, panOnDrag, onPaneContextMenu]);
  reactExports.useEffect(() => {
    if (d3Zoom) {
      d3Zoom.on("end", (event) => {
        if (!event.sourceEvent || event.sourceEvent.internal) {
          return null;
        }
        const { onViewportChangeEnd } = store.getState();
        isZoomingOrPanning.current = false;
        store.setState({ paneDragging: false });
        if (onPaneContextMenu && isRightClickPan(panOnDrag, mouseButton.current ?? 0) && !zoomedWithRightMouseButton.current) {
          onPaneContextMenu(event.sourceEvent);
        }
        zoomedWithRightMouseButton.current = false;
        if ((onMoveEnd || onViewportChangeEnd) && viewChanged(prevTransform.current, event.transform)) {
          const flowTransform = eventToFlowTransform(event.transform);
          prevTransform.current = flowTransform;
          clearTimeout(timerId.current);
          timerId.current = setTimeout(() => {
            onViewportChangeEnd == null ? void 0 : onViewportChangeEnd(flowTransform);
            onMoveEnd == null ? void 0 : onMoveEnd(event.sourceEvent, flowTransform);
          }, panOnScroll ? 150 : 0);
        }
      });
    }
  }, [d3Zoom, panOnScroll, panOnDrag, onMoveEnd, onPaneContextMenu]);
  reactExports.useEffect(() => {
    if (d3Zoom) {
      d3Zoom.filter((event) => {
        const zoomScroll = zoomActivationKeyPressed || zoomOnScroll;
        const pinchZoom = zoomOnPinch && event.ctrlKey;
        if ((panOnDrag === true || Array.isArray(panOnDrag) && panOnDrag.includes(1)) && event.button === 1 && event.type === "mousedown" && (isWrappedWithClass(event, "react-flow__node") || isWrappedWithClass(event, "react-flow__edge"))) {
          return true;
        }
        if (!panOnDrag && !zoomScroll && !panOnScroll && !zoomOnDoubleClick && !zoomOnPinch) {
          return false;
        }
        if (userSelectionActive) {
          return false;
        }
        if (!zoomOnDoubleClick && event.type === "dblclick") {
          return false;
        }
        if (isWrappedWithClass(event, noWheelClassName) && event.type === "wheel") {
          return false;
        }
        if (isWrappedWithClass(event, noPanClassName) && (event.type !== "wheel" || panOnScroll && event.type === "wheel" && !zoomActivationKeyPressed)) {
          return false;
        }
        if (!zoomOnPinch && event.ctrlKey && event.type === "wheel") {
          return false;
        }
        if (!zoomScroll && !panOnScroll && !pinchZoom && event.type === "wheel") {
          return false;
        }
        if (!panOnDrag && (event.type === "mousedown" || event.type === "touchstart")) {
          return false;
        }
        if (Array.isArray(panOnDrag) && !panOnDrag.includes(event.button) && event.type === "mousedown") {
          return false;
        }
        const buttonAllowed = Array.isArray(panOnDrag) && panOnDrag.includes(event.button) || !event.button || event.button <= 1;
        return (!event.ctrlKey || event.type === "wheel") && buttonAllowed;
      });
    }
  }, [
    userSelectionActive,
    d3Zoom,
    zoomOnScroll,
    zoomOnPinch,
    panOnScroll,
    zoomOnDoubleClick,
    panOnDrag,
    elementsSelectable,
    zoomActivationKeyPressed
  ]);
  return React$2.createElement("div", { className: "react-flow__renderer", ref: zoomPane, style: containerStyle }, children2);
};
const selector$9 = (s) => ({
  userSelectionActive: s.userSelectionActive,
  userSelectionRect: s.userSelectionRect
});
function UserSelection() {
  const { userSelectionActive, userSelectionRect } = useStore(selector$9, shallow$1);
  const isActive = userSelectionActive && userSelectionRect;
  if (!isActive) {
    return null;
  }
  return React$2.createElement("div", { className: "react-flow__selection react-flow__container", style: {
    width: userSelectionRect.width,
    height: userSelectionRect.height,
    transform: `translate(${userSelectionRect.x}px, ${userSelectionRect.y}px)`
  } });
}
function handleParentExpand(res, updateItem) {
  const parentId = updateItem.parentNode || updateItem.parentId;
  const parent = res.find((e) => e.id === parentId);
  if (parent) {
    const extendWidth = updateItem.position.x + updateItem.width - parent.width;
    const extendHeight = updateItem.position.y + updateItem.height - parent.height;
    if (extendWidth > 0 || extendHeight > 0 || updateItem.position.x < 0 || updateItem.position.y < 0) {
      parent.style = { ...parent.style };
      parent.style.width = parent.style.width ?? parent.width;
      parent.style.height = parent.style.height ?? parent.height;
      if (extendWidth > 0) {
        parent.style.width += extendWidth;
      }
      if (extendHeight > 0) {
        parent.style.height += extendHeight;
      }
      if (updateItem.position.x < 0) {
        const xDiff = Math.abs(updateItem.position.x);
        parent.position.x = parent.position.x - xDiff;
        parent.style.width += xDiff;
        updateItem.position.x = 0;
      }
      if (updateItem.position.y < 0) {
        const yDiff = Math.abs(updateItem.position.y);
        parent.position.y = parent.position.y - yDiff;
        parent.style.height += yDiff;
        updateItem.position.y = 0;
      }
      parent.width = parent.style.width;
      parent.height = parent.style.height;
    }
  }
}
function applyChanges(changes, elements) {
  if (changes.some((c) => c.type === "reset")) {
    return changes.filter((c) => c.type === "reset").map((c) => c.item);
  }
  const initElements = changes.filter((c) => c.type === "add").map((c) => c.item);
  return elements.reduce((res, item) => {
    const currentChanges = changes.filter((c) => c.id === item.id);
    if (currentChanges.length === 0) {
      res.push(item);
      return res;
    }
    const updateItem = { ...item };
    for (const currentChange of currentChanges) {
      if (currentChange) {
        switch (currentChange.type) {
          case "select": {
            updateItem.selected = currentChange.selected;
            break;
          }
          case "position": {
            if (typeof currentChange.position !== "undefined") {
              updateItem.position = currentChange.position;
            }
            if (typeof currentChange.positionAbsolute !== "undefined") {
              updateItem.positionAbsolute = currentChange.positionAbsolute;
            }
            if (typeof currentChange.dragging !== "undefined") {
              updateItem.dragging = currentChange.dragging;
            }
            if (updateItem.expandParent) {
              handleParentExpand(res, updateItem);
            }
            break;
          }
          case "dimensions": {
            if (typeof currentChange.dimensions !== "undefined") {
              updateItem.width = currentChange.dimensions.width;
              updateItem.height = currentChange.dimensions.height;
            }
            if (typeof currentChange.updateStyle !== "undefined") {
              updateItem.style = { ...updateItem.style || {}, ...currentChange.dimensions };
            }
            if (typeof currentChange.resizing === "boolean") {
              updateItem.resizing = currentChange.resizing;
            }
            if (updateItem.expandParent) {
              handleParentExpand(res, updateItem);
            }
            break;
          }
          case "remove": {
            return res;
          }
        }
      }
    }
    res.push(updateItem);
    return res;
  }, initElements);
}
function applyNodeChanges(changes, nodes) {
  return applyChanges(changes, nodes);
}
function applyEdgeChanges(changes, edges) {
  return applyChanges(changes, edges);
}
const createSelectionChange = (id2, selected) => ({
  id: id2,
  type: "select",
  selected
});
function getSelectionChanges(items, selectedIds) {
  return items.reduce((res, item) => {
    const willBeSelected = selectedIds.includes(item.id);
    if (!item.selected && willBeSelected) {
      item.selected = true;
      res.push(createSelectionChange(item.id, true));
    } else if (item.selected && !willBeSelected) {
      item.selected = false;
      res.push(createSelectionChange(item.id, false));
    }
    return res;
  }, []);
}
const wrapHandler = (handler, containerRef) => {
  return (event) => {
    if (event.target !== containerRef.current) {
      return;
    }
    handler == null ? void 0 : handler(event);
  };
};
const selector$8 = (s) => ({
  userSelectionActive: s.userSelectionActive,
  elementsSelectable: s.elementsSelectable,
  dragging: s.paneDragging
});
const Pane = reactExports.memo(({ isSelecting, selectionMode = SelectionMode.Full, panOnDrag, onSelectionStart, onSelectionEnd, onPaneClick, onPaneContextMenu, onPaneScroll, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, children: children2 }) => {
  const container = reactExports.useRef(null);
  const store = useStoreApi();
  const prevSelectedNodesCount = reactExports.useRef(0);
  const prevSelectedEdgesCount = reactExports.useRef(0);
  const containerBounds = reactExports.useRef();
  const { userSelectionActive, elementsSelectable, dragging } = useStore(selector$8, shallow$1);
  const resetUserSelection = () => {
    store.setState({ userSelectionActive: false, userSelectionRect: null });
    prevSelectedNodesCount.current = 0;
    prevSelectedEdgesCount.current = 0;
  };
  const onClick = (event) => {
    onPaneClick == null ? void 0 : onPaneClick(event);
    store.getState().resetSelectedElements();
    store.setState({ nodesSelectionActive: false });
  };
  const onContextMenu = (event) => {
    if (Array.isArray(panOnDrag) && (panOnDrag == null ? void 0 : panOnDrag.includes(2))) {
      event.preventDefault();
      return;
    }
    onPaneContextMenu == null ? void 0 : onPaneContextMenu(event);
  };
  const onWheel = onPaneScroll ? (event) => onPaneScroll(event) : void 0;
  const onMouseDown = (event) => {
    const { resetSelectedElements, domNode } = store.getState();
    containerBounds.current = domNode == null ? void 0 : domNode.getBoundingClientRect();
    if (!elementsSelectable || !isSelecting || event.button !== 0 || event.target !== container.current || !containerBounds.current) {
      return;
    }
    const { x: x2, y: y2 } = getEventPosition(event, containerBounds.current);
    resetSelectedElements();
    store.setState({
      userSelectionRect: {
        width: 0,
        height: 0,
        startX: x2,
        startY: y2,
        x: x2,
        y: y2
      }
    });
    onSelectionStart == null ? void 0 : onSelectionStart(event);
  };
  const onMouseMove = (event) => {
    const { userSelectionRect, nodeInternals, edges, transform, onNodesChange, onEdgesChange, nodeOrigin, getNodes } = store.getState();
    if (!isSelecting || !containerBounds.current || !userSelectionRect) {
      return;
    }
    store.setState({ userSelectionActive: true, nodesSelectionActive: false });
    const mousePos = getEventPosition(event, containerBounds.current);
    const startX = userSelectionRect.startX ?? 0;
    const startY = userSelectionRect.startY ?? 0;
    const nextUserSelectRect = {
      ...userSelectionRect,
      x: mousePos.x < startX ? mousePos.x : startX,
      y: mousePos.y < startY ? mousePos.y : startY,
      width: Math.abs(mousePos.x - startX),
      height: Math.abs(mousePos.y - startY)
    };
    const nodes = getNodes();
    const selectedNodes = getNodesInside(nodeInternals, nextUserSelectRect, transform, selectionMode === SelectionMode.Partial, true, nodeOrigin);
    const selectedEdgeIds = getConnectedEdges(selectedNodes, edges).map((e) => e.id);
    const selectedNodeIds = selectedNodes.map((n2) => n2.id);
    if (prevSelectedNodesCount.current !== selectedNodeIds.length) {
      prevSelectedNodesCount.current = selectedNodeIds.length;
      const changes = getSelectionChanges(nodes, selectedNodeIds);
      if (changes.length) {
        onNodesChange == null ? void 0 : onNodesChange(changes);
      }
    }
    if (prevSelectedEdgesCount.current !== selectedEdgeIds.length) {
      prevSelectedEdgesCount.current = selectedEdgeIds.length;
      const changes = getSelectionChanges(edges, selectedEdgeIds);
      if (changes.length) {
        onEdgesChange == null ? void 0 : onEdgesChange(changes);
      }
    }
    store.setState({
      userSelectionRect: nextUserSelectRect
    });
  };
  const onMouseUp = (event) => {
    if (event.button !== 0) {
      return;
    }
    const { userSelectionRect } = store.getState();
    if (!userSelectionActive && userSelectionRect && event.target === container.current) {
      onClick == null ? void 0 : onClick(event);
    }
    store.setState({ nodesSelectionActive: prevSelectedNodesCount.current > 0 });
    resetUserSelection();
    onSelectionEnd == null ? void 0 : onSelectionEnd(event);
  };
  const onMouseLeave = (event) => {
    if (userSelectionActive) {
      store.setState({ nodesSelectionActive: prevSelectedNodesCount.current > 0 });
      onSelectionEnd == null ? void 0 : onSelectionEnd(event);
    }
    resetUserSelection();
  };
  const hasActiveSelection = elementsSelectable && (isSelecting || userSelectionActive);
  return React$2.createElement(
    "div",
    { className: cc(["react-flow__pane", { dragging, selection: isSelecting }]), onClick: hasActiveSelection ? void 0 : wrapHandler(onClick, container), onContextMenu: wrapHandler(onContextMenu, container), onWheel: wrapHandler(onWheel, container), onMouseEnter: hasActiveSelection ? void 0 : onPaneMouseEnter, onMouseDown: hasActiveSelection ? onMouseDown : void 0, onMouseMove: hasActiveSelection ? onMouseMove : onPaneMouseMove, onMouseUp: hasActiveSelection ? onMouseUp : void 0, onMouseLeave: hasActiveSelection ? onMouseLeave : onPaneMouseLeave, ref: container, style: containerStyle },
    children2,
    React$2.createElement(UserSelection, null)
  );
});
Pane.displayName = "Pane";
function isParentSelected(node, nodeInternals) {
  const parentId = node.parentNode || node.parentId;
  if (!parentId) {
    return false;
  }
  const parentNode = nodeInternals.get(parentId);
  if (!parentNode) {
    return false;
  }
  if (parentNode.selected) {
    return true;
  }
  return isParentSelected(parentNode, nodeInternals);
}
function hasSelector(target, selector2, nodeRef) {
  let current = target;
  do {
    if (current == null ? void 0 : current.matches(selector2))
      return true;
    if (current === nodeRef.current)
      return false;
    current = current.parentElement;
  } while (current);
  return false;
}
function getDragItems(nodeInternals, nodesDraggable, mousePos, nodeId) {
  return Array.from(nodeInternals.values()).filter((n2) => (n2.selected || n2.id === nodeId) && (!n2.parentNode || n2.parentId || !isParentSelected(n2, nodeInternals)) && (n2.draggable || nodesDraggable && typeof n2.draggable === "undefined")).map((n2) => {
    var _a, _b;
    return {
      id: n2.id,
      position: n2.position || { x: 0, y: 0 },
      positionAbsolute: n2.positionAbsolute || { x: 0, y: 0 },
      distance: {
        x: mousePos.x - (((_a = n2.positionAbsolute) == null ? void 0 : _a.x) ?? 0),
        y: mousePos.y - (((_b = n2.positionAbsolute) == null ? void 0 : _b.y) ?? 0)
      },
      delta: {
        x: 0,
        y: 0
      },
      extent: n2.extent,
      parentNode: n2.parentNode || n2.parentId,
      parentId: n2.parentNode || n2.parentId,
      width: n2.width,
      height: n2.height,
      expandParent: n2.expandParent
    };
  });
}
function clampNodeExtent(node, extent) {
  if (!extent || extent === "parent") {
    return extent;
  }
  return [extent[0], [extent[1][0] - (node.width || 0), extent[1][1] - (node.height || 0)]];
}
function calcNextPosition(node, nextPosition, nodeInternals, nodeExtent, nodeOrigin = [0, 0], onError) {
  const clampedNodeExtent = clampNodeExtent(node, node.extent || nodeExtent);
  let currentExtent = clampedNodeExtent;
  const parentId = node.parentNode || node.parentId;
  if (node.extent === "parent" && !node.expandParent) {
    if (parentId && node.width && node.height) {
      const parent = nodeInternals.get(parentId);
      const { x: parentX, y: parentY } = getNodePositionWithOrigin(parent, nodeOrigin).positionAbsolute;
      currentExtent = parent && isNumeric(parentX) && isNumeric(parentY) && isNumeric(parent.width) && isNumeric(parent.height) ? [
        [parentX + node.width * nodeOrigin[0], parentY + node.height * nodeOrigin[1]],
        [
          parentX + parent.width - node.width + node.width * nodeOrigin[0],
          parentY + parent.height - node.height + node.height * nodeOrigin[1]
        ]
      ] : currentExtent;
    } else {
      onError == null ? void 0 : onError("005", errorMessages["error005"]());
      currentExtent = clampedNodeExtent;
    }
  } else if (node.extent && parentId && node.extent !== "parent") {
    const parent = nodeInternals.get(parentId);
    const { x: parentX, y: parentY } = getNodePositionWithOrigin(parent, nodeOrigin).positionAbsolute;
    currentExtent = [
      [node.extent[0][0] + parentX, node.extent[0][1] + parentY],
      [node.extent[1][0] + parentX, node.extent[1][1] + parentY]
    ];
  }
  let parentPosition = { x: 0, y: 0 };
  if (parentId) {
    const parentNode = nodeInternals.get(parentId);
    parentPosition = getNodePositionWithOrigin(parentNode, nodeOrigin).positionAbsolute;
  }
  const positionAbsolute = currentExtent && currentExtent !== "parent" ? clampPosition(nextPosition, currentExtent) : nextPosition;
  return {
    position: {
      x: positionAbsolute.x - parentPosition.x,
      y: positionAbsolute.y - parentPosition.y
    },
    positionAbsolute
  };
}
function getEventHandlerParams({ nodeId, dragItems, nodeInternals }) {
  const extentedDragItems = dragItems.map((n2) => {
    const node = nodeInternals.get(n2.id);
    return {
      ...node,
      position: n2.position,
      positionAbsolute: n2.positionAbsolute
    };
  });
  return [nodeId ? extentedDragItems.find((n2) => n2.id === nodeId) : extentedDragItems[0], extentedDragItems];
}
const getHandleBounds = (selector2, nodeElement, zoom2, nodeOrigin) => {
  const handles = nodeElement.querySelectorAll(selector2);
  if (!handles || !handles.length) {
    return null;
  }
  const handlesArray = Array.from(handles);
  const nodeBounds = nodeElement.getBoundingClientRect();
  const nodeOffset = {
    x: nodeBounds.width * nodeOrigin[0],
    y: nodeBounds.height * nodeOrigin[1]
  };
  return handlesArray.map((handle) => {
    const handleBounds = handle.getBoundingClientRect();
    return {
      id: handle.getAttribute("data-handleid"),
      position: handle.getAttribute("data-handlepos"),
      x: (handleBounds.left - nodeBounds.left - nodeOffset.x) / zoom2,
      y: (handleBounds.top - nodeBounds.top - nodeOffset.y) / zoom2,
      ...getDimensions(handle)
    };
  });
};
function getMouseHandler(id2, getState, handler) {
  return handler === void 0 ? handler : (event) => {
    const node = getState().nodeInternals.get(id2);
    if (node) {
      handler(event, { ...node });
    }
  };
}
function handleNodeClick({ id: id2, store, unselect = false, nodeRef }) {
  const { addSelectedNodes, unselectNodesAndEdges, multiSelectionActive, nodeInternals, onError } = store.getState();
  const node = nodeInternals.get(id2);
  if (!node) {
    onError == null ? void 0 : onError("012", errorMessages["error012"](id2));
    return;
  }
  store.setState({ nodesSelectionActive: false });
  if (!node.selected) {
    addSelectedNodes([id2]);
  } else if (unselect || node.selected && multiSelectionActive) {
    unselectNodesAndEdges({ nodes: [node], edges: [] });
    requestAnimationFrame(() => {
      var _a;
      return (_a = nodeRef == null ? void 0 : nodeRef.current) == null ? void 0 : _a.blur();
    });
  }
}
function useGetPointerPosition() {
  const store = useStoreApi();
  const getPointerPosition = reactExports.useCallback(({ sourceEvent: sourceEvent2 }) => {
    const { transform, snapGrid, snapToGrid } = store.getState();
    const x2 = sourceEvent2.touches ? sourceEvent2.touches[0].clientX : sourceEvent2.clientX;
    const y2 = sourceEvent2.touches ? sourceEvent2.touches[0].clientY : sourceEvent2.clientY;
    const pointerPos = {
      x: (x2 - transform[0]) / transform[2],
      y: (y2 - transform[1]) / transform[2]
    };
    return {
      xSnapped: snapToGrid ? snapGrid[0] * Math.round(pointerPos.x / snapGrid[0]) : pointerPos.x,
      ySnapped: snapToGrid ? snapGrid[1] * Math.round(pointerPos.y / snapGrid[1]) : pointerPos.y,
      ...pointerPos
    };
  }, []);
  return getPointerPosition;
}
function wrapSelectionDragFunc(selectionFunc) {
  return (event, _, nodes) => selectionFunc == null ? void 0 : selectionFunc(event, nodes);
}
function useDrag({ nodeRef, disabled = false, noDragClassName, handleSelector, nodeId, isSelectable, selectNodesOnDrag }) {
  const store = useStoreApi();
  const [dragging, setDragging] = reactExports.useState(false);
  const dragItems = reactExports.useRef([]);
  const lastPos = reactExports.useRef({ x: null, y: null });
  const autoPanId = reactExports.useRef(0);
  const containerBounds = reactExports.useRef(null);
  const mousePosition = reactExports.useRef({ x: 0, y: 0 });
  const dragEvent = reactExports.useRef(null);
  const autoPanStarted = reactExports.useRef(false);
  const dragStarted = reactExports.useRef(false);
  const abortDrag = reactExports.useRef(false);
  const getPointerPosition = useGetPointerPosition();
  reactExports.useEffect(() => {
    if (nodeRef == null ? void 0 : nodeRef.current) {
      const selection2 = select(nodeRef.current);
      const updateNodes = ({ x: x2, y: y2 }) => {
        const { nodeInternals, onNodeDrag, onSelectionDrag, updateNodePositions, nodeExtent, snapGrid, snapToGrid, nodeOrigin, onError } = store.getState();
        lastPos.current = { x: x2, y: y2 };
        let hasChange = false;
        let nodesBox = { x: 0, y: 0, x2: 0, y2: 0 };
        if (dragItems.current.length > 1 && nodeExtent) {
          const rect = getNodesBounds(dragItems.current, nodeOrigin);
          nodesBox = rectToBox(rect);
        }
        dragItems.current = dragItems.current.map((n2) => {
          const nextPosition = { x: x2 - n2.distance.x, y: y2 - n2.distance.y };
          if (snapToGrid) {
            nextPosition.x = snapGrid[0] * Math.round(nextPosition.x / snapGrid[0]);
            nextPosition.y = snapGrid[1] * Math.round(nextPosition.y / snapGrid[1]);
          }
          const adjustedNodeExtent = [
            [nodeExtent[0][0], nodeExtent[0][1]],
            [nodeExtent[1][0], nodeExtent[1][1]]
          ];
          if (dragItems.current.length > 1 && nodeExtent && !n2.extent) {
            adjustedNodeExtent[0][0] = n2.positionAbsolute.x - nodesBox.x + nodeExtent[0][0];
            adjustedNodeExtent[1][0] = n2.positionAbsolute.x + (n2.width ?? 0) - nodesBox.x2 + nodeExtent[1][0];
            adjustedNodeExtent[0][1] = n2.positionAbsolute.y - nodesBox.y + nodeExtent[0][1];
            adjustedNodeExtent[1][1] = n2.positionAbsolute.y + (n2.height ?? 0) - nodesBox.y2 + nodeExtent[1][1];
          }
          const updatedPos = calcNextPosition(n2, nextPosition, nodeInternals, adjustedNodeExtent, nodeOrigin, onError);
          hasChange = hasChange || n2.position.x !== updatedPos.position.x || n2.position.y !== updatedPos.position.y;
          n2.position = updatedPos.position;
          n2.positionAbsolute = updatedPos.positionAbsolute;
          return n2;
        });
        if (!hasChange) {
          return;
        }
        updateNodePositions(dragItems.current, true, true);
        setDragging(true);
        const onDrag = nodeId ? onNodeDrag : wrapSelectionDragFunc(onSelectionDrag);
        if (onDrag && dragEvent.current) {
          const [currentNode, nodes] = getEventHandlerParams({
            nodeId,
            dragItems: dragItems.current,
            nodeInternals
          });
          onDrag(dragEvent.current, currentNode, nodes);
        }
      };
      const autoPan = () => {
        if (!containerBounds.current) {
          return;
        }
        const [xMovement, yMovement] = calcAutoPan(mousePosition.current, containerBounds.current);
        if (xMovement !== 0 || yMovement !== 0) {
          const { transform, panBy } = store.getState();
          lastPos.current.x = (lastPos.current.x ?? 0) - xMovement / transform[2];
          lastPos.current.y = (lastPos.current.y ?? 0) - yMovement / transform[2];
          if (panBy({ x: xMovement, y: yMovement })) {
            updateNodes(lastPos.current);
          }
        }
        autoPanId.current = requestAnimationFrame(autoPan);
      };
      const startDrag = (event) => {
        var _a;
        const { nodeInternals, multiSelectionActive, nodesDraggable, unselectNodesAndEdges, onNodeDragStart, onSelectionDragStart } = store.getState();
        dragStarted.current = true;
        const onStart = nodeId ? onNodeDragStart : wrapSelectionDragFunc(onSelectionDragStart);
        if ((!selectNodesOnDrag || !isSelectable) && !multiSelectionActive && nodeId) {
          if (!((_a = nodeInternals.get(nodeId)) == null ? void 0 : _a.selected)) {
            unselectNodesAndEdges();
          }
        }
        if (nodeId && isSelectable && selectNodesOnDrag) {
          handleNodeClick({
            id: nodeId,
            store,
            nodeRef
          });
        }
        const pointerPos = getPointerPosition(event);
        lastPos.current = pointerPos;
        dragItems.current = getDragItems(nodeInternals, nodesDraggable, pointerPos, nodeId);
        if (onStart && dragItems.current) {
          const [currentNode, nodes] = getEventHandlerParams({
            nodeId,
            dragItems: dragItems.current,
            nodeInternals
          });
          onStart(event.sourceEvent, currentNode, nodes);
        }
      };
      if (disabled) {
        selection2.on(".drag", null);
      } else {
        const dragHandler = drag().on("start", (event) => {
          const { domNode, nodeDragThreshold } = store.getState();
          if (nodeDragThreshold === 0) {
            startDrag(event);
          }
          abortDrag.current = false;
          const pointerPos = getPointerPosition(event);
          lastPos.current = pointerPos;
          containerBounds.current = (domNode == null ? void 0 : domNode.getBoundingClientRect()) || null;
          mousePosition.current = getEventPosition(event.sourceEvent, containerBounds.current);
        }).on("drag", (event) => {
          var _a, _b;
          const pointerPos = getPointerPosition(event);
          const { autoPanOnNodeDrag, nodeDragThreshold } = store.getState();
          if (event.sourceEvent.type === "touchmove" && event.sourceEvent.touches.length > 1) {
            abortDrag.current = true;
          }
          if (abortDrag.current) {
            return;
          }
          if (!autoPanStarted.current && dragStarted.current && autoPanOnNodeDrag) {
            autoPanStarted.current = true;
            autoPan();
          }
          if (!dragStarted.current) {
            const x2 = pointerPos.xSnapped - (((_a = lastPos == null ? void 0 : lastPos.current) == null ? void 0 : _a.x) ?? 0);
            const y2 = pointerPos.ySnapped - (((_b = lastPos == null ? void 0 : lastPos.current) == null ? void 0 : _b.y) ?? 0);
            const distance2 = Math.sqrt(x2 * x2 + y2 * y2);
            if (distance2 > nodeDragThreshold) {
              startDrag(event);
            }
          }
          if ((lastPos.current.x !== pointerPos.xSnapped || lastPos.current.y !== pointerPos.ySnapped) && dragItems.current && dragStarted.current) {
            dragEvent.current = event.sourceEvent;
            mousePosition.current = getEventPosition(event.sourceEvent, containerBounds.current);
            updateNodes(pointerPos);
          }
        }).on("end", (event) => {
          if (!dragStarted.current || abortDrag.current) {
            return;
          }
          setDragging(false);
          autoPanStarted.current = false;
          dragStarted.current = false;
          cancelAnimationFrame(autoPanId.current);
          if (dragItems.current) {
            const { updateNodePositions, nodeInternals, onNodeDragStop, onSelectionDragStop } = store.getState();
            const onStop = nodeId ? onNodeDragStop : wrapSelectionDragFunc(onSelectionDragStop);
            updateNodePositions(dragItems.current, false, false);
            if (onStop) {
              const [currentNode, nodes] = getEventHandlerParams({
                nodeId,
                dragItems: dragItems.current,
                nodeInternals
              });
              onStop(event.sourceEvent, currentNode, nodes);
            }
          }
        }).filter((event) => {
          const target = event.target;
          const isDraggable = !event.button && (!noDragClassName || !hasSelector(target, `.${noDragClassName}`, nodeRef)) && (!handleSelector || hasSelector(target, handleSelector, nodeRef));
          return isDraggable;
        });
        selection2.call(dragHandler);
        return () => {
          selection2.on(".drag", null);
        };
      }
    }
  }, [
    nodeRef,
    disabled,
    noDragClassName,
    handleSelector,
    isSelectable,
    store,
    nodeId,
    selectNodesOnDrag,
    getPointerPosition
  ]);
  return dragging;
}
function useUpdateNodePositions() {
  const store = useStoreApi();
  const updatePositions = reactExports.useCallback((params) => {
    const { nodeInternals, nodeExtent, updateNodePositions, getNodes, snapToGrid, snapGrid, onError, nodesDraggable } = store.getState();
    const selectedNodes = getNodes().filter((n2) => n2.selected && (n2.draggable || nodesDraggable && typeof n2.draggable === "undefined"));
    const xVelo = snapToGrid ? snapGrid[0] : 5;
    const yVelo = snapToGrid ? snapGrid[1] : 5;
    const factor = params.isShiftPressed ? 4 : 1;
    const positionDiffX = params.x * xVelo * factor;
    const positionDiffY = params.y * yVelo * factor;
    const nodeUpdates = selectedNodes.map((n2) => {
      if (n2.positionAbsolute) {
        const nextPosition = { x: n2.positionAbsolute.x + positionDiffX, y: n2.positionAbsolute.y + positionDiffY };
        if (snapToGrid) {
          nextPosition.x = snapGrid[0] * Math.round(nextPosition.x / snapGrid[0]);
          nextPosition.y = snapGrid[1] * Math.round(nextPosition.y / snapGrid[1]);
        }
        const { positionAbsolute, position } = calcNextPosition(n2, nextPosition, nodeInternals, nodeExtent, void 0, onError);
        n2.position = position;
        n2.positionAbsolute = positionAbsolute;
      }
      return n2;
    });
    updateNodePositions(nodeUpdates, true, false);
  }, []);
  return updatePositions;
}
const arrowKeyDiffs = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
};
var wrapNode = (NodeComponent) => {
  const NodeWrapper = ({ id: id2, type, data, xPos, yPos, xPosOrigin, yPosOrigin, selected, onClick, onMouseEnter, onMouseMove, onMouseLeave, onContextMenu, onDoubleClick, style: style2, className, isDraggable, isSelectable, isConnectable, isFocusable, selectNodesOnDrag, sourcePosition, targetPosition, hidden, resizeObserver, dragHandle, zIndex, isParent, noDragClassName, noPanClassName, initialized, disableKeyboardA11y, ariaLabel, rfId, hasHandleBounds }) => {
    const store = useStoreApi();
    const nodeRef = reactExports.useRef(null);
    const prevNodeRef = reactExports.useRef(null);
    const prevSourcePosition = reactExports.useRef(sourcePosition);
    const prevTargetPosition = reactExports.useRef(targetPosition);
    const prevType = reactExports.useRef(type);
    const hasPointerEvents = isSelectable || isDraggable || onClick || onMouseEnter || onMouseMove || onMouseLeave;
    const updatePositions = useUpdateNodePositions();
    const onMouseEnterHandler = getMouseHandler(id2, store.getState, onMouseEnter);
    const onMouseMoveHandler = getMouseHandler(id2, store.getState, onMouseMove);
    const onMouseLeaveHandler = getMouseHandler(id2, store.getState, onMouseLeave);
    const onContextMenuHandler = getMouseHandler(id2, store.getState, onContextMenu);
    const onDoubleClickHandler = getMouseHandler(id2, store.getState, onDoubleClick);
    const onSelectNodeHandler = (event) => {
      const { nodeDragThreshold } = store.getState();
      if (isSelectable && (!selectNodesOnDrag || !isDraggable || nodeDragThreshold > 0)) {
        handleNodeClick({
          id: id2,
          store,
          nodeRef
        });
      }
      if (onClick) {
        const node = store.getState().nodeInternals.get(id2);
        if (node) {
          onClick(event, { ...node });
        }
      }
    };
    const onKeyDown = (event) => {
      if (isInputDOMNode(event)) {
        return;
      }
      if (disableKeyboardA11y) {
        return;
      }
      if (elementSelectionKeys.includes(event.key) && isSelectable) {
        const unselect = event.key === "Escape";
        handleNodeClick({
          id: id2,
          store,
          unselect,
          nodeRef
        });
      } else if (isDraggable && selected && Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)) {
        store.setState({
          ariaLiveMessage: `Moved selected node ${event.key.replace("Arrow", "").toLowerCase()}. New position, x: ${~~xPos}, y: ${~~yPos}`
        });
        updatePositions({
          x: arrowKeyDiffs[event.key].x,
          y: arrowKeyDiffs[event.key].y,
          isShiftPressed: event.shiftKey
        });
      }
    };
    reactExports.useEffect(() => {
      return () => {
        if (prevNodeRef.current) {
          resizeObserver == null ? void 0 : resizeObserver.unobserve(prevNodeRef.current);
          prevNodeRef.current = null;
        }
      };
    }, []);
    reactExports.useEffect(() => {
      if (nodeRef.current && !hidden) {
        const currNode = nodeRef.current;
        if (!initialized || !hasHandleBounds || prevNodeRef.current !== currNode) {
          if (prevNodeRef.current) {
            resizeObserver == null ? void 0 : resizeObserver.unobserve(prevNodeRef.current);
          }
          resizeObserver == null ? void 0 : resizeObserver.observe(currNode);
          prevNodeRef.current = currNode;
        }
      }
    }, [hidden, initialized, hasHandleBounds]);
    reactExports.useEffect(() => {
      const typeChanged = prevType.current !== type;
      const sourcePosChanged = prevSourcePosition.current !== sourcePosition;
      const targetPosChanged = prevTargetPosition.current !== targetPosition;
      if (nodeRef.current && (typeChanged || sourcePosChanged || targetPosChanged)) {
        if (typeChanged) {
          prevType.current = type;
        }
        if (sourcePosChanged) {
          prevSourcePosition.current = sourcePosition;
        }
        if (targetPosChanged) {
          prevTargetPosition.current = targetPosition;
        }
        store.getState().updateNodeDimensions([{ id: id2, nodeElement: nodeRef.current, forceUpdate: true }]);
      }
    }, [id2, type, sourcePosition, targetPosition]);
    const dragging = useDrag({
      nodeRef,
      disabled: hidden || !isDraggable,
      noDragClassName,
      handleSelector: dragHandle,
      nodeId: id2,
      isSelectable,
      selectNodesOnDrag
    });
    if (hidden) {
      return null;
    }
    return React$2.createElement(
      "div",
      { className: cc([
        "react-flow__node",
        `react-flow__node-${type}`,
        {
          // this is overwritable by passing `nopan` as a class name
          [noPanClassName]: isDraggable
        },
        className,
        {
          selected,
          selectable: isSelectable,
          parent: isParent,
          dragging
        }
      ]), ref: nodeRef, style: {
        zIndex,
        transform: `translate(${xPosOrigin}px,${yPosOrigin}px)`,
        pointerEvents: hasPointerEvents ? "all" : "none",
        visibility: initialized ? "visible" : "hidden",
        ...style2
      }, "data-id": id2, "data-testid": `rf__node-${id2}`, onMouseEnter: onMouseEnterHandler, onMouseMove: onMouseMoveHandler, onMouseLeave: onMouseLeaveHandler, onContextMenu: onContextMenuHandler, onClick: onSelectNodeHandler, onDoubleClick: onDoubleClickHandler, onKeyDown: isFocusable ? onKeyDown : void 0, tabIndex: isFocusable ? 0 : void 0, role: isFocusable ? "button" : void 0, "aria-describedby": disableKeyboardA11y ? void 0 : `${ARIA_NODE_DESC_KEY}-${rfId}`, "aria-label": ariaLabel },
      React$2.createElement(
        Provider,
        { value: id2 },
        React$2.createElement(NodeComponent, { id: id2, data, type, xPos, yPos, selected, isConnectable, sourcePosition, targetPosition, dragging, dragHandle, zIndex })
      )
    );
  };
  NodeWrapper.displayName = "NodeWrapper";
  return reactExports.memo(NodeWrapper);
};
const selector$7 = (s) => {
  const selectedNodes = s.getNodes().filter((n2) => n2.selected);
  return {
    ...getNodesBounds(selectedNodes, s.nodeOrigin),
    transformString: `translate(${s.transform[0]}px,${s.transform[1]}px) scale(${s.transform[2]})`,
    userSelectionActive: s.userSelectionActive
  };
};
function NodesSelection({ onSelectionContextMenu, noPanClassName, disableKeyboardA11y }) {
  const store = useStoreApi();
  const { width, height, x: left, y: top, transformString, userSelectionActive } = useStore(selector$7, shallow$1);
  const updatePositions = useUpdateNodePositions();
  const nodeRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    var _a;
    if (!disableKeyboardA11y) {
      (_a = nodeRef.current) == null ? void 0 : _a.focus({
        preventScroll: true
      });
    }
  }, [disableKeyboardA11y]);
  useDrag({
    nodeRef
  });
  if (userSelectionActive || !width || !height) {
    return null;
  }
  const onContextMenu = onSelectionContextMenu ? (event) => {
    const selectedNodes = store.getState().getNodes().filter((n2) => n2.selected);
    onSelectionContextMenu(event, selectedNodes);
  } : void 0;
  const onKeyDown = (event) => {
    if (Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)) {
      updatePositions({
        x: arrowKeyDiffs[event.key].x,
        y: arrowKeyDiffs[event.key].y,
        isShiftPressed: event.shiftKey
      });
    }
  };
  return React$2.createElement(
    "div",
    { className: cc(["react-flow__nodesselection", "react-flow__container", noPanClassName]), style: {
      transform: transformString
    } },
    React$2.createElement("div", { ref: nodeRef, className: "react-flow__nodesselection-rect", onContextMenu, tabIndex: disableKeyboardA11y ? void 0 : -1, onKeyDown: disableKeyboardA11y ? void 0 : onKeyDown, style: {
      width,
      height,
      top,
      left
    } })
  );
}
var NodesSelection$1 = reactExports.memo(NodesSelection);
const selector$6 = (s) => s.nodesSelectionActive;
const FlowRenderer = ({ children: children2, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneContextMenu, onPaneScroll, deleteKeyCode, onMove, onMoveStart, onMoveEnd, selectionKeyCode, selectionOnDrag, selectionMode, onSelectionStart, onSelectionEnd, multiSelectionKeyCode, panActivationKeyCode, zoomActivationKeyCode, elementsSelectable, zoomOnScroll, zoomOnPinch, panOnScroll: _panOnScroll, panOnScrollSpeed, panOnScrollMode, zoomOnDoubleClick, panOnDrag: _panOnDrag, defaultViewport, translateExtent, minZoom, maxZoom, preventScrolling, onSelectionContextMenu, noWheelClassName, noPanClassName, disableKeyboardA11y }) => {
  const nodesSelectionActive = useStore(selector$6);
  const selectionKeyPressed = useKeyPress(selectionKeyCode);
  const panActivationKeyPressed = useKeyPress(panActivationKeyCode);
  const panOnDrag = panActivationKeyPressed || _panOnDrag;
  const panOnScroll = panActivationKeyPressed || _panOnScroll;
  const isSelecting = selectionKeyPressed || selectionOnDrag && panOnDrag !== true;
  useGlobalKeyHandler({ deleteKeyCode, multiSelectionKeyCode });
  return React$2.createElement(
    ZoomPane,
    { onMove, onMoveStart, onMoveEnd, onPaneContextMenu, elementsSelectable, zoomOnScroll, zoomOnPinch, panOnScroll, panOnScrollSpeed, panOnScrollMode, zoomOnDoubleClick, panOnDrag: !selectionKeyPressed && panOnDrag, defaultViewport, translateExtent, minZoom, maxZoom, zoomActivationKeyCode, preventScrolling, noWheelClassName, noPanClassName },
    React$2.createElement(
      Pane,
      { onSelectionStart, onSelectionEnd, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneContextMenu, onPaneScroll, panOnDrag, isSelecting: !!isSelecting, selectionMode },
      children2,
      nodesSelectionActive && React$2.createElement(NodesSelection$1, { onSelectionContextMenu, noPanClassName, disableKeyboardA11y })
    )
  );
};
FlowRenderer.displayName = "FlowRenderer";
var FlowRenderer$1 = reactExports.memo(FlowRenderer);
function useVisibleNodes(onlyRenderVisible) {
  const nodes = useStore(reactExports.useCallback((s) => onlyRenderVisible ? getNodesInside(s.nodeInternals, { x: 0, y: 0, width: s.width, height: s.height }, s.transform, true) : s.getNodes(), [onlyRenderVisible]));
  return nodes;
}
function createNodeTypes(nodeTypes) {
  const standardTypes = {
    input: wrapNode(nodeTypes.input || InputNode$1),
    default: wrapNode(nodeTypes.default || DefaultNode$1),
    output: wrapNode(nodeTypes.output || OutputNode$1),
    group: wrapNode(nodeTypes.group || GroupNode)
  };
  const wrappedTypes = {};
  const specialTypes = Object.keys(nodeTypes).filter((k2) => !["input", "default", "output", "group"].includes(k2)).reduce((res, key) => {
    res[key] = wrapNode(nodeTypes[key] || DefaultNode$1);
    return res;
  }, wrappedTypes);
  return {
    ...standardTypes,
    ...specialTypes
  };
}
const getPositionWithOrigin = ({ x: x2, y: y2, width, height, origin }) => {
  if (!width || !height) {
    return { x: x2, y: y2 };
  }
  if (origin[0] < 0 || origin[1] < 0 || origin[0] > 1 || origin[1] > 1) {
    return { x: x2, y: y2 };
  }
  return {
    x: x2 - width * origin[0],
    y: y2 - height * origin[1]
  };
};
const selector$5 = (s) => ({
  nodesDraggable: s.nodesDraggable,
  nodesConnectable: s.nodesConnectable,
  nodesFocusable: s.nodesFocusable,
  elementsSelectable: s.elementsSelectable,
  updateNodeDimensions: s.updateNodeDimensions,
  onError: s.onError
});
const NodeRenderer = (props) => {
  const { nodesDraggable, nodesConnectable, nodesFocusable, elementsSelectable, updateNodeDimensions, onError } = useStore(selector$5, shallow$1);
  const nodes = useVisibleNodes(props.onlyRenderVisibleElements);
  const resizeObserverRef = reactExports.useRef();
  const resizeObserver = reactExports.useMemo(() => {
    if (typeof ResizeObserver === "undefined") {
      return null;
    }
    const observer = new ResizeObserver((entries) => {
      const updates = entries.map((entry) => ({
        id: entry.target.getAttribute("data-id"),
        nodeElement: entry.target,
        forceUpdate: true
      }));
      updateNodeDimensions(updates);
    });
    resizeObserverRef.current = observer;
    return observer;
  }, []);
  reactExports.useEffect(() => {
    return () => {
      var _a;
      (_a = resizeObserverRef == null ? void 0 : resizeObserverRef.current) == null ? void 0 : _a.disconnect();
    };
  }, []);
  return React$2.createElement("div", { className: "react-flow__nodes", style: containerStyle }, nodes.map((node) => {
    var _a, _b, _c;
    let nodeType = node.type || "default";
    if (!props.nodeTypes[nodeType]) {
      onError == null ? void 0 : onError("003", errorMessages["error003"](nodeType));
      nodeType = "default";
    }
    const NodeComponent = props.nodeTypes[nodeType] || props.nodeTypes.default;
    const isDraggable = !!(node.draggable || nodesDraggable && typeof node.draggable === "undefined");
    const isSelectable = !!(node.selectable || elementsSelectable && typeof node.selectable === "undefined");
    const isConnectable = !!(node.connectable || nodesConnectable && typeof node.connectable === "undefined");
    const isFocusable = !!(node.focusable || nodesFocusable && typeof node.focusable === "undefined");
    const clampedPosition = props.nodeExtent ? clampPosition(node.positionAbsolute, props.nodeExtent) : node.positionAbsolute;
    const posX = (clampedPosition == null ? void 0 : clampedPosition.x) ?? 0;
    const posY = (clampedPosition == null ? void 0 : clampedPosition.y) ?? 0;
    const posOrigin = getPositionWithOrigin({
      x: posX,
      y: posY,
      width: node.width ?? 0,
      height: node.height ?? 0,
      origin: props.nodeOrigin
    });
    return React$2.createElement(NodeComponent, { key: node.id, id: node.id, className: node.className, style: node.style, type: nodeType, data: node.data, sourcePosition: node.sourcePosition || Position.Bottom, targetPosition: node.targetPosition || Position.Top, hidden: node.hidden, xPos: posX, yPos: posY, xPosOrigin: posOrigin.x, yPosOrigin: posOrigin.y, selectNodesOnDrag: props.selectNodesOnDrag, onClick: props.onNodeClick, onMouseEnter: props.onNodeMouseEnter, onMouseMove: props.onNodeMouseMove, onMouseLeave: props.onNodeMouseLeave, onContextMenu: props.onNodeContextMenu, onDoubleClick: props.onNodeDoubleClick, selected: !!node.selected, isDraggable, isSelectable, isConnectable, isFocusable, resizeObserver, dragHandle: node.dragHandle, zIndex: ((_a = node[internalsSymbol]) == null ? void 0 : _a.z) ?? 0, isParent: !!((_b = node[internalsSymbol]) == null ? void 0 : _b.isParent), noDragClassName: props.noDragClassName, noPanClassName: props.noPanClassName, initialized: !!node.width && !!node.height, rfId: props.rfId, disableKeyboardA11y: props.disableKeyboardA11y, ariaLabel: node.ariaLabel, hasHandleBounds: !!((_c = node[internalsSymbol]) == null ? void 0 : _c.handleBounds) });
  }));
};
NodeRenderer.displayName = "NodeRenderer";
var NodeRenderer$1 = reactExports.memo(NodeRenderer);
const shiftX = (x2, shift, position) => {
  if (position === Position.Left)
    return x2 - shift;
  if (position === Position.Right)
    return x2 + shift;
  return x2;
};
const shiftY = (y2, shift, position) => {
  if (position === Position.Top)
    return y2 - shift;
  if (position === Position.Bottom)
    return y2 + shift;
  return y2;
};
const EdgeUpdaterClassName = "react-flow__edgeupdater";
const EdgeAnchor = ({ position, centerX, centerY, radius = 10, onMouseDown, onMouseEnter, onMouseOut, type }) => React$2.createElement("circle", { onMouseDown, onMouseEnter, onMouseOut, className: cc([EdgeUpdaterClassName, `${EdgeUpdaterClassName}-${type}`]), cx: shiftX(centerX, radius, position), cy: shiftY(centerY, radius, position), r: radius, stroke: "transparent", fill: "transparent" });
const alwaysValidConnection = () => true;
var wrapEdge = (EdgeComponent) => {
  const EdgeWrapper = ({ id: id2, className, type, data, onClick, onEdgeDoubleClick, selected, animated, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, source, target, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, elementsSelectable, hidden, sourceHandleId, targetHandleId, onContextMenu, onMouseEnter, onMouseMove, onMouseLeave, reconnectRadius, onReconnect, onReconnectStart, onReconnectEnd, markerEnd, markerStart, rfId, ariaLabel, isFocusable, isReconnectable, pathOptions, interactionWidth, disableKeyboardA11y }) => {
    const edgeRef = reactExports.useRef(null);
    const [updateHover, setUpdateHover] = reactExports.useState(false);
    const [updating, setUpdating] = reactExports.useState(false);
    const store = useStoreApi();
    const markerStartUrl = reactExports.useMemo(() => `url('#${getMarkerId(markerStart, rfId)}')`, [markerStart, rfId]);
    const markerEndUrl = reactExports.useMemo(() => `url('#${getMarkerId(markerEnd, rfId)}')`, [markerEnd, rfId]);
    if (hidden) {
      return null;
    }
    const onEdgeClick = (event) => {
      var _a;
      const { edges, addSelectedEdges, unselectNodesAndEdges, multiSelectionActive } = store.getState();
      const edge = edges.find((e) => e.id === id2);
      if (!edge) {
        return;
      }
      if (elementsSelectable) {
        store.setState({ nodesSelectionActive: false });
        if (edge.selected && multiSelectionActive) {
          unselectNodesAndEdges({ nodes: [], edges: [edge] });
          (_a = edgeRef.current) == null ? void 0 : _a.blur();
        } else {
          addSelectedEdges([id2]);
        }
      }
      if (onClick) {
        onClick(event, edge);
      }
    };
    const onEdgeDoubleClickHandler = getMouseHandler$1(id2, store.getState, onEdgeDoubleClick);
    const onEdgeContextMenu = getMouseHandler$1(id2, store.getState, onContextMenu);
    const onEdgeMouseEnter = getMouseHandler$1(id2, store.getState, onMouseEnter);
    const onEdgeMouseMove = getMouseHandler$1(id2, store.getState, onMouseMove);
    const onEdgeMouseLeave = getMouseHandler$1(id2, store.getState, onMouseLeave);
    const handleEdgeUpdater = (event, isSourceHandle) => {
      if (event.button !== 0) {
        return;
      }
      const { edges, isValidConnection: isValidConnectionStore } = store.getState();
      const nodeId = isSourceHandle ? target : source;
      const handleId = (isSourceHandle ? targetHandleId : sourceHandleId) || null;
      const handleType = isSourceHandle ? "target" : "source";
      const isValidConnection = isValidConnectionStore || alwaysValidConnection;
      const isTarget = isSourceHandle;
      const edge = edges.find((e) => e.id === id2);
      setUpdating(true);
      onReconnectStart == null ? void 0 : onReconnectStart(event, edge, handleType);
      const _onReconnectEnd = (evt) => {
        setUpdating(false);
        onReconnectEnd == null ? void 0 : onReconnectEnd(evt, edge, handleType);
      };
      const onConnectEdge = (connection) => onReconnect == null ? void 0 : onReconnect(edge, connection);
      handlePointerDown({
        event,
        handleId,
        nodeId,
        onConnect: onConnectEdge,
        isTarget,
        getState: store.getState,
        setState: store.setState,
        isValidConnection,
        edgeUpdaterType: handleType,
        onReconnectEnd: _onReconnectEnd
      });
    };
    const onEdgeUpdaterSourceMouseDown = (event) => handleEdgeUpdater(event, true);
    const onEdgeUpdaterTargetMouseDown = (event) => handleEdgeUpdater(event, false);
    const onEdgeUpdaterMouseEnter = () => setUpdateHover(true);
    const onEdgeUpdaterMouseOut = () => setUpdateHover(false);
    const inactive = !elementsSelectable && !onClick;
    const onKeyDown = (event) => {
      var _a;
      if (!disableKeyboardA11y && elementSelectionKeys.includes(event.key) && elementsSelectable) {
        const { unselectNodesAndEdges, addSelectedEdges, edges } = store.getState();
        const unselect = event.key === "Escape";
        if (unselect) {
          (_a = edgeRef.current) == null ? void 0 : _a.blur();
          unselectNodesAndEdges({ edges: [edges.find((e) => e.id === id2)] });
        } else {
          addSelectedEdges([id2]);
        }
      }
    };
    return React$2.createElement(
      "g",
      { className: cc([
        "react-flow__edge",
        `react-flow__edge-${type}`,
        className,
        { selected, animated, inactive, updating: updateHover }
      ]), onClick: onEdgeClick, onDoubleClick: onEdgeDoubleClickHandler, onContextMenu: onEdgeContextMenu, onMouseEnter: onEdgeMouseEnter, onMouseMove: onEdgeMouseMove, onMouseLeave: onEdgeMouseLeave, onKeyDown: isFocusable ? onKeyDown : void 0, tabIndex: isFocusable ? 0 : void 0, role: isFocusable ? "button" : "img", "data-testid": `rf__edge-${id2}`, "aria-label": ariaLabel === null ? void 0 : ariaLabel ? ariaLabel : `Edge from ${source} to ${target}`, "aria-describedby": isFocusable ? `${ARIA_EDGE_DESC_KEY}-${rfId}` : void 0, ref: edgeRef },
      !updating && React$2.createElement(EdgeComponent, { id: id2, source, target, selected, animated, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, data, style: style2, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, sourceHandleId, targetHandleId, markerStart: markerStartUrl, markerEnd: markerEndUrl, pathOptions, interactionWidth }),
      isReconnectable && React$2.createElement(
        React$2.Fragment,
        null,
        (isReconnectable === "source" || isReconnectable === true) && React$2.createElement(EdgeAnchor, { position: sourcePosition, centerX: sourceX, centerY: sourceY, radius: reconnectRadius, onMouseDown: onEdgeUpdaterSourceMouseDown, onMouseEnter: onEdgeUpdaterMouseEnter, onMouseOut: onEdgeUpdaterMouseOut, type: "source" }),
        (isReconnectable === "target" || isReconnectable === true) && React$2.createElement(EdgeAnchor, { position: targetPosition, centerX: targetX, centerY: targetY, radius: reconnectRadius, onMouseDown: onEdgeUpdaterTargetMouseDown, onMouseEnter: onEdgeUpdaterMouseEnter, onMouseOut: onEdgeUpdaterMouseOut, type: "target" })
      )
    );
  };
  EdgeWrapper.displayName = "EdgeWrapper";
  return reactExports.memo(EdgeWrapper);
};
function createEdgeTypes(edgeTypes) {
  const standardTypes = {
    default: wrapEdge(edgeTypes.default || BezierEdge),
    straight: wrapEdge(edgeTypes.bezier || StraightEdge),
    step: wrapEdge(edgeTypes.step || StepEdge),
    smoothstep: wrapEdge(edgeTypes.step || SmoothStepEdge),
    simplebezier: wrapEdge(edgeTypes.simplebezier || SimpleBezierEdge)
  };
  const wrappedTypes = {};
  const specialTypes = Object.keys(edgeTypes).filter((k2) => !["default", "bezier"].includes(k2)).reduce((res, key) => {
    res[key] = wrapEdge(edgeTypes[key] || BezierEdge);
    return res;
  }, wrappedTypes);
  return {
    ...standardTypes,
    ...specialTypes
  };
}
function getHandlePosition(position, nodeRect, handle = null) {
  const x2 = ((handle == null ? void 0 : handle.x) || 0) + nodeRect.x;
  const y2 = ((handle == null ? void 0 : handle.y) || 0) + nodeRect.y;
  const width = (handle == null ? void 0 : handle.width) || nodeRect.width;
  const height = (handle == null ? void 0 : handle.height) || nodeRect.height;
  switch (position) {
    case Position.Top:
      return {
        x: x2 + width / 2,
        y: y2
      };
    case Position.Right:
      return {
        x: x2 + width,
        y: y2 + height / 2
      };
    case Position.Bottom:
      return {
        x: x2 + width / 2,
        y: y2 + height
      };
    case Position.Left:
      return {
        x: x2,
        y: y2 + height / 2
      };
  }
}
function getHandle(bounds, handleId) {
  if (!bounds) {
    return null;
  }
  if (bounds.length === 1 || !handleId) {
    return bounds[0];
  } else if (handleId) {
    return bounds.find((d) => d.id === handleId) || null;
  }
  return null;
}
const getEdgePositions = (sourceNodeRect, sourceHandle, sourcePosition, targetNodeRect, targetHandle, targetPosition) => {
  const sourceHandlePos = getHandlePosition(sourcePosition, sourceNodeRect, sourceHandle);
  const targetHandlePos = getHandlePosition(targetPosition, targetNodeRect, targetHandle);
  return {
    sourceX: sourceHandlePos.x,
    sourceY: sourceHandlePos.y,
    targetX: targetHandlePos.x,
    targetY: targetHandlePos.y
  };
};
function isEdgeVisible({ sourcePos, targetPos, sourceWidth, sourceHeight, targetWidth, targetHeight, width, height, transform }) {
  const edgeBox = {
    x: Math.min(sourcePos.x, targetPos.x),
    y: Math.min(sourcePos.y, targetPos.y),
    x2: Math.max(sourcePos.x + sourceWidth, targetPos.x + targetWidth),
    y2: Math.max(sourcePos.y + sourceHeight, targetPos.y + targetHeight)
  };
  if (edgeBox.x === edgeBox.x2) {
    edgeBox.x2 += 1;
  }
  if (edgeBox.y === edgeBox.y2) {
    edgeBox.y2 += 1;
  }
  const viewBox = rectToBox({
    x: (0 - transform[0]) / transform[2],
    y: (0 - transform[1]) / transform[2],
    width: width / transform[2],
    height: height / transform[2]
  });
  const xOverlap = Math.max(0, Math.min(viewBox.x2, edgeBox.x2) - Math.max(viewBox.x, edgeBox.x));
  const yOverlap = Math.max(0, Math.min(viewBox.y2, edgeBox.y2) - Math.max(viewBox.y, edgeBox.y));
  const overlappingArea = Math.ceil(xOverlap * yOverlap);
  return overlappingArea > 0;
}
function getNodeData(node) {
  var _a, _b, _c, _d, _e;
  const handleBounds = ((_a = node == null ? void 0 : node[internalsSymbol]) == null ? void 0 : _a.handleBounds) || null;
  const isValid = handleBounds && (node == null ? void 0 : node.width) && (node == null ? void 0 : node.height) && typeof ((_b = node == null ? void 0 : node.positionAbsolute) == null ? void 0 : _b.x) !== "undefined" && typeof ((_c = node == null ? void 0 : node.positionAbsolute) == null ? void 0 : _c.y) !== "undefined";
  return [
    {
      x: ((_d = node == null ? void 0 : node.positionAbsolute) == null ? void 0 : _d.x) || 0,
      y: ((_e = node == null ? void 0 : node.positionAbsolute) == null ? void 0 : _e.y) || 0,
      width: (node == null ? void 0 : node.width) || 0,
      height: (node == null ? void 0 : node.height) || 0
    },
    handleBounds,
    !!isValid
  ];
}
const defaultEdgeTree = [{ level: 0, isMaxLevel: true, edges: [] }];
function groupEdgesByZLevel(edges, nodeInternals, elevateEdgesOnSelect = false) {
  let maxLevel = -1;
  const levelLookup = edges.reduce((tree, edge) => {
    var _a, _b;
    const hasZIndex = isNumeric(edge.zIndex);
    let z2 = hasZIndex ? edge.zIndex : 0;
    if (elevateEdgesOnSelect) {
      const targetNode = nodeInternals.get(edge.target);
      const sourceNode = nodeInternals.get(edge.source);
      const edgeOrConnectedNodeSelected = edge.selected || (targetNode == null ? void 0 : targetNode.selected) || (sourceNode == null ? void 0 : sourceNode.selected);
      const selectedZIndex = Math.max(((_a = sourceNode == null ? void 0 : sourceNode[internalsSymbol]) == null ? void 0 : _a.z) || 0, ((_b = targetNode == null ? void 0 : targetNode[internalsSymbol]) == null ? void 0 : _b.z) || 0, 1e3);
      z2 = (hasZIndex ? edge.zIndex : 0) + (edgeOrConnectedNodeSelected ? selectedZIndex : 0);
    }
    if (tree[z2]) {
      tree[z2].push(edge);
    } else {
      tree[z2] = [edge];
    }
    maxLevel = z2 > maxLevel ? z2 : maxLevel;
    return tree;
  }, {});
  const edgeTree = Object.entries(levelLookup).map(([key, edges2]) => {
    const level = +key;
    return {
      edges: edges2,
      level,
      isMaxLevel: level === maxLevel
    };
  });
  if (edgeTree.length === 0) {
    return defaultEdgeTree;
  }
  return edgeTree;
}
function useVisibleEdges(onlyRenderVisible, nodeInternals, elevateEdgesOnSelect) {
  const edges = useStore(reactExports.useCallback((s) => {
    if (!onlyRenderVisible) {
      return s.edges;
    }
    return s.edges.filter((e) => {
      const sourceNode = nodeInternals.get(e.source);
      const targetNode = nodeInternals.get(e.target);
      return (sourceNode == null ? void 0 : sourceNode.width) && (sourceNode == null ? void 0 : sourceNode.height) && (targetNode == null ? void 0 : targetNode.width) && (targetNode == null ? void 0 : targetNode.height) && isEdgeVisible({
        sourcePos: sourceNode.positionAbsolute || { x: 0, y: 0 },
        targetPos: targetNode.positionAbsolute || { x: 0, y: 0 },
        sourceWidth: sourceNode.width,
        sourceHeight: sourceNode.height,
        targetWidth: targetNode.width,
        targetHeight: targetNode.height,
        width: s.width,
        height: s.height,
        transform: s.transform
      });
    });
  }, [onlyRenderVisible, nodeInternals]));
  return groupEdgesByZLevel(edges, nodeInternals, elevateEdgesOnSelect);
}
const ArrowSymbol = ({ color: color2 = "none", strokeWidth = 1 }) => {
  return React$2.createElement("polyline", { style: {
    stroke: color2,
    strokeWidth
  }, strokeLinecap: "round", strokeLinejoin: "round", fill: "none", points: "-5,-4 0,0 -5,4" });
};
const ArrowClosedSymbol = ({ color: color2 = "none", strokeWidth = 1 }) => {
  return React$2.createElement("polyline", { style: {
    stroke: color2,
    fill: color2,
    strokeWidth
  }, strokeLinecap: "round", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4 -5,-4" });
};
const MarkerSymbols = {
  [MarkerType.Arrow]: ArrowSymbol,
  [MarkerType.ArrowClosed]: ArrowClosedSymbol
};
function useMarkerSymbol(type) {
  const store = useStoreApi();
  const symbol = reactExports.useMemo(() => {
    var _a, _b;
    const symbolExists = Object.prototype.hasOwnProperty.call(MarkerSymbols, type);
    if (!symbolExists) {
      (_b = (_a = store.getState()).onError) == null ? void 0 : _b.call(_a, "009", errorMessages["error009"](type));
      return null;
    }
    return MarkerSymbols[type];
  }, [type]);
  return symbol;
}
const Marker = ({ id: id2, type, color: color2, width = 12.5, height = 12.5, markerUnits = "strokeWidth", strokeWidth, orient = "auto-start-reverse" }) => {
  const Symbol2 = useMarkerSymbol(type);
  if (!Symbol2) {
    return null;
  }
  return React$2.createElement(
    "marker",
    { className: "react-flow__arrowhead", id: id2, markerWidth: `${width}`, markerHeight: `${height}`, viewBox: "-10 -10 20 20", markerUnits, orient, refX: "0", refY: "0" },
    React$2.createElement(Symbol2, { color: color2, strokeWidth })
  );
};
const markerSelector = ({ defaultColor: defaultColor2, rfId }) => (s) => {
  const ids = [];
  return s.edges.reduce((markers, edge) => {
    [edge.markerStart, edge.markerEnd].forEach((marker) => {
      if (marker && typeof marker === "object") {
        const markerId = getMarkerId(marker, rfId);
        if (!ids.includes(markerId)) {
          markers.push({ id: markerId, color: marker.color || defaultColor2, ...marker });
          ids.push(markerId);
        }
      }
    });
    return markers;
  }, []).sort((a, b) => a.id.localeCompare(b.id));
};
const MarkerDefinitions = ({ defaultColor: defaultColor2, rfId }) => {
  const markers = useStore(
    reactExports.useCallback(markerSelector({ defaultColor: defaultColor2, rfId }), [defaultColor2, rfId]),
    // the id includes all marker options, so we just need to look at that part of the marker
    (a, b) => !(a.length !== b.length || a.some((m2, i) => m2.id !== b[i].id))
  );
  return React$2.createElement("defs", null, markers.map((marker) => React$2.createElement(Marker, { id: marker.id, key: marker.id, type: marker.type, color: marker.color, width: marker.width, height: marker.height, markerUnits: marker.markerUnits, strokeWidth: marker.strokeWidth, orient: marker.orient })));
};
MarkerDefinitions.displayName = "MarkerDefinitions";
var MarkerDefinitions$1 = reactExports.memo(MarkerDefinitions);
const selector$4 = (s) => ({
  nodesConnectable: s.nodesConnectable,
  edgesFocusable: s.edgesFocusable,
  edgesUpdatable: s.edgesUpdatable,
  elementsSelectable: s.elementsSelectable,
  width: s.width,
  height: s.height,
  connectionMode: s.connectionMode,
  nodeInternals: s.nodeInternals,
  onError: s.onError
});
const EdgeRenderer = ({ defaultMarkerColor, onlyRenderVisibleElements, elevateEdgesOnSelect, rfId, edgeTypes, noPanClassName, onEdgeContextMenu, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, onEdgeClick, onEdgeDoubleClick, onReconnect, onReconnectStart, onReconnectEnd, reconnectRadius, children: children2, disableKeyboardA11y }) => {
  const { edgesFocusable, edgesUpdatable, elementsSelectable, width, height, connectionMode, nodeInternals, onError } = useStore(selector$4, shallow$1);
  const edgeTree = useVisibleEdges(onlyRenderVisibleElements, nodeInternals, elevateEdgesOnSelect);
  if (!width) {
    return null;
  }
  return React$2.createElement(
    React$2.Fragment,
    null,
    edgeTree.map(({ level, edges, isMaxLevel }) => React$2.createElement(
      "svg",
      { key: level, style: { zIndex: level }, width, height, className: "react-flow__edges react-flow__container" },
      isMaxLevel && React$2.createElement(MarkerDefinitions$1, { defaultColor: defaultMarkerColor, rfId }),
      React$2.createElement("g", null, edges.map((edge) => {
        const [sourceNodeRect, sourceHandleBounds, sourceIsValid] = getNodeData(nodeInternals.get(edge.source));
        const [targetNodeRect, targetHandleBounds, targetIsValid] = getNodeData(nodeInternals.get(edge.target));
        if (!sourceIsValid || !targetIsValid) {
          return null;
        }
        let edgeType = edge.type || "default";
        if (!edgeTypes[edgeType]) {
          onError == null ? void 0 : onError("011", errorMessages["error011"](edgeType));
          edgeType = "default";
        }
        const EdgeComponent = edgeTypes[edgeType] || edgeTypes.default;
        const targetNodeHandles = connectionMode === ConnectionMode.Strict ? targetHandleBounds.target : (targetHandleBounds.target ?? []).concat(targetHandleBounds.source ?? []);
        const sourceHandle = getHandle(sourceHandleBounds.source, edge.sourceHandle);
        const targetHandle = getHandle(targetNodeHandles, edge.targetHandle);
        const sourcePosition = (sourceHandle == null ? void 0 : sourceHandle.position) || Position.Bottom;
        const targetPosition = (targetHandle == null ? void 0 : targetHandle.position) || Position.Top;
        const isFocusable = !!(edge.focusable || edgesFocusable && typeof edge.focusable === "undefined");
        const edgeReconnectable = edge.reconnectable || edge.updatable;
        const isReconnectable = typeof onReconnect !== "undefined" && (edgeReconnectable || edgesUpdatable && typeof edgeReconnectable === "undefined");
        if (!sourceHandle || !targetHandle) {
          onError == null ? void 0 : onError("008", errorMessages["error008"](sourceHandle, edge));
          return null;
        }
        const { sourceX, sourceY, targetX, targetY } = getEdgePositions(sourceNodeRect, sourceHandle, sourcePosition, targetNodeRect, targetHandle, targetPosition);
        return React$2.createElement(EdgeComponent, { key: edge.id, id: edge.id, className: cc([edge.className, noPanClassName]), type: edgeType, data: edge.data, selected: !!edge.selected, animated: !!edge.animated, hidden: !!edge.hidden, label: edge.label, labelStyle: edge.labelStyle, labelShowBg: edge.labelShowBg, labelBgStyle: edge.labelBgStyle, labelBgPadding: edge.labelBgPadding, labelBgBorderRadius: edge.labelBgBorderRadius, style: edge.style, source: edge.source, target: edge.target, sourceHandleId: edge.sourceHandle, targetHandleId: edge.targetHandle, markerEnd: edge.markerEnd, markerStart: edge.markerStart, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, elementsSelectable, onContextMenu: onEdgeContextMenu, onMouseEnter: onEdgeMouseEnter, onMouseMove: onEdgeMouseMove, onMouseLeave: onEdgeMouseLeave, onClick: onEdgeClick, onEdgeDoubleClick, onReconnect, onReconnectStart, onReconnectEnd, reconnectRadius, rfId, ariaLabel: edge.ariaLabel, isFocusable, isReconnectable, pathOptions: "pathOptions" in edge ? edge.pathOptions : void 0, interactionWidth: edge.interactionWidth, disableKeyboardA11y });
      }))
    )),
    children2
  );
};
EdgeRenderer.displayName = "EdgeRenderer";
var EdgeRenderer$1 = reactExports.memo(EdgeRenderer);
const selector$3 = (s) => `translate(${s.transform[0]}px,${s.transform[1]}px) scale(${s.transform[2]})`;
function Viewport({ children: children2 }) {
  const transform = useStore(selector$3);
  return React$2.createElement("div", { className: "react-flow__viewport react-flow__container", style: { transform } }, children2);
}
function useOnInitHandler(onInit) {
  const rfInstance = useReactFlow();
  const isInitialized = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (!isInitialized.current && rfInstance.viewportInitialized && onInit) {
      setTimeout(() => onInit(rfInstance), 1);
      isInitialized.current = true;
    }
  }, [onInit, rfInstance.viewportInitialized]);
}
const oppositePosition = {
  [Position.Left]: Position.Right,
  [Position.Right]: Position.Left,
  [Position.Top]: Position.Bottom,
  [Position.Bottom]: Position.Top
};
const ConnectionLine = ({ nodeId, handleType, style: style2, type = ConnectionLineType.Bezier, CustomComponent, connectionStatus }) => {
  var _a, _b, _c;
  const { fromNode, handleId, toX, toY, connectionMode } = useStore(reactExports.useCallback((s) => ({
    fromNode: s.nodeInternals.get(nodeId),
    handleId: s.connectionHandleId,
    toX: (s.connectionPosition.x - s.transform[0]) / s.transform[2],
    toY: (s.connectionPosition.y - s.transform[1]) / s.transform[2],
    connectionMode: s.connectionMode
  }), [nodeId]), shallow$1);
  const fromHandleBounds = (_a = fromNode == null ? void 0 : fromNode[internalsSymbol]) == null ? void 0 : _a.handleBounds;
  let handleBounds = fromHandleBounds == null ? void 0 : fromHandleBounds[handleType];
  if (connectionMode === ConnectionMode.Loose) {
    handleBounds = handleBounds ? handleBounds : fromHandleBounds == null ? void 0 : fromHandleBounds[handleType === "source" ? "target" : "source"];
  }
  if (!fromNode || !handleBounds) {
    return null;
  }
  const fromHandle = handleId ? handleBounds.find((d) => d.id === handleId) : handleBounds[0];
  const fromHandleX = fromHandle ? fromHandle.x + fromHandle.width / 2 : (fromNode.width ?? 0) / 2;
  const fromHandleY = fromHandle ? fromHandle.y + fromHandle.height / 2 : fromNode.height ?? 0;
  const fromX = (((_b = fromNode.positionAbsolute) == null ? void 0 : _b.x) ?? 0) + fromHandleX;
  const fromY = (((_c = fromNode.positionAbsolute) == null ? void 0 : _c.y) ?? 0) + fromHandleY;
  const fromPosition = fromHandle == null ? void 0 : fromHandle.position;
  const toPosition = fromPosition ? oppositePosition[fromPosition] : null;
  if (!fromPosition || !toPosition) {
    return null;
  }
  if (CustomComponent) {
    return React$2.createElement(CustomComponent, { connectionLineType: type, connectionLineStyle: style2, fromNode, fromHandle, fromX, fromY, toX, toY, fromPosition, toPosition, connectionStatus });
  }
  let dAttr = "";
  const pathParams = {
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition
  };
  if (type === ConnectionLineType.Bezier) {
    [dAttr] = getBezierPath(pathParams);
  } else if (type === ConnectionLineType.Step) {
    [dAttr] = getSmoothStepPath({
      ...pathParams,
      borderRadius: 0
    });
  } else if (type === ConnectionLineType.SmoothStep) {
    [dAttr] = getSmoothStepPath(pathParams);
  } else if (type === ConnectionLineType.SimpleBezier) {
    [dAttr] = getSimpleBezierPath(pathParams);
  } else {
    dAttr = `M${fromX},${fromY} ${toX},${toY}`;
  }
  return React$2.createElement("path", { d: dAttr, fill: "none", className: "react-flow__connection-path", style: style2 });
};
ConnectionLine.displayName = "ConnectionLine";
const selector$2$1 = (s) => ({
  nodeId: s.connectionNodeId,
  handleType: s.connectionHandleType,
  nodesConnectable: s.nodesConnectable,
  connectionStatus: s.connectionStatus,
  width: s.width,
  height: s.height
});
function ConnectionLineWrapper({ containerStyle: containerStyle2, style: style2, type, component }) {
  const { nodeId, handleType, nodesConnectable, width, height, connectionStatus } = useStore(selector$2$1, shallow$1);
  const isValid = !!(nodeId && handleType && width && nodesConnectable);
  if (!isValid) {
    return null;
  }
  return React$2.createElement(
    "svg",
    { style: containerStyle2, width, height, className: "react-flow__edges react-flow__connectionline react-flow__container" },
    React$2.createElement(
      "g",
      { className: cc(["react-flow__connection", connectionStatus]) },
      React$2.createElement(ConnectionLine, { nodeId, handleType, style: style2, type, CustomComponent: component, connectionStatus })
    )
  );
}
function useNodeOrEdgeTypes(nodeOrEdgeTypes, createTypes) {
  reactExports.useRef(null);
  useStoreApi();
  const typesParsed = reactExports.useMemo(() => {
    return createTypes(nodeOrEdgeTypes);
  }, [nodeOrEdgeTypes]);
  return typesParsed;
}
const GraphView = ({ nodeTypes, edgeTypes, onMove, onMoveStart, onMoveEnd, onInit, onNodeClick, onEdgeClick, onNodeDoubleClick, onEdgeDoubleClick, onNodeMouseEnter, onNodeMouseMove, onNodeMouseLeave, onNodeContextMenu, onSelectionContextMenu, onSelectionStart, onSelectionEnd, connectionLineType, connectionLineStyle, connectionLineComponent, connectionLineContainerStyle, selectionKeyCode, selectionOnDrag, selectionMode, multiSelectionKeyCode, panActivationKeyCode, zoomActivationKeyCode, deleteKeyCode, onlyRenderVisibleElements, elementsSelectable, selectNodesOnDrag, defaultViewport, translateExtent, minZoom, maxZoom, preventScrolling, defaultMarkerColor, zoomOnScroll, zoomOnPinch, panOnScroll, panOnScrollSpeed, panOnScrollMode, zoomOnDoubleClick, panOnDrag, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneScroll, onPaneContextMenu, onEdgeContextMenu, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, onReconnect, onReconnectStart, onReconnectEnd, reconnectRadius, noDragClassName, noWheelClassName, noPanClassName, elevateEdgesOnSelect, disableKeyboardA11y, nodeOrigin, nodeExtent, rfId }) => {
  const nodeTypesWrapped = useNodeOrEdgeTypes(nodeTypes, createNodeTypes);
  const edgeTypesWrapped = useNodeOrEdgeTypes(edgeTypes, createEdgeTypes);
  useOnInitHandler(onInit);
  return React$2.createElement(
    FlowRenderer$1,
    { onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneContextMenu, onPaneScroll, deleteKeyCode, selectionKeyCode, selectionOnDrag, selectionMode, onSelectionStart, onSelectionEnd, multiSelectionKeyCode, panActivationKeyCode, zoomActivationKeyCode, elementsSelectable, onMove, onMoveStart, onMoveEnd, zoomOnScroll, zoomOnPinch, zoomOnDoubleClick, panOnScroll, panOnScrollSpeed, panOnScrollMode, panOnDrag, defaultViewport, translateExtent, minZoom, maxZoom, onSelectionContextMenu, preventScrolling, noDragClassName, noWheelClassName, noPanClassName, disableKeyboardA11y },
    React$2.createElement(
      Viewport,
      null,
      React$2.createElement(
        EdgeRenderer$1,
        { edgeTypes: edgeTypesWrapped, onEdgeClick, onEdgeDoubleClick, onlyRenderVisibleElements, onEdgeContextMenu, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, onReconnect, onReconnectStart, onReconnectEnd, reconnectRadius, defaultMarkerColor, noPanClassName, elevateEdgesOnSelect: !!elevateEdgesOnSelect, disableKeyboardA11y, rfId },
        React$2.createElement(ConnectionLineWrapper, { style: connectionLineStyle, type: connectionLineType, component: connectionLineComponent, containerStyle: connectionLineContainerStyle })
      ),
      React$2.createElement("div", { className: "react-flow__edgelabel-renderer" }),
      React$2.createElement(NodeRenderer$1, { nodeTypes: nodeTypesWrapped, onNodeClick, onNodeDoubleClick, onNodeMouseEnter, onNodeMouseMove, onNodeMouseLeave, onNodeContextMenu, selectNodesOnDrag, onlyRenderVisibleElements, noPanClassName, noDragClassName, disableKeyboardA11y, nodeOrigin, nodeExtent, rfId })
    )
  );
};
GraphView.displayName = "GraphView";
var GraphView$1 = reactExports.memo(GraphView);
const infiniteExtent = [
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
];
const initialState = {
  rfId: "1",
  width: 0,
  height: 0,
  transform: [0, 0, 1],
  nodeInternals: /* @__PURE__ */ new Map(),
  edges: [],
  onNodesChange: null,
  onEdgesChange: null,
  hasDefaultNodes: false,
  hasDefaultEdges: false,
  d3Zoom: null,
  d3Selection: null,
  d3ZoomHandler: void 0,
  minZoom: 0.5,
  maxZoom: 2,
  translateExtent: infiniteExtent,
  nodeExtent: infiniteExtent,
  nodesSelectionActive: false,
  userSelectionActive: false,
  userSelectionRect: null,
  connectionNodeId: null,
  connectionHandleId: null,
  connectionHandleType: "source",
  connectionPosition: { x: 0, y: 0 },
  connectionStatus: null,
  connectionMode: ConnectionMode.Strict,
  domNode: null,
  paneDragging: false,
  noPanClassName: "nopan",
  nodeOrigin: [0, 0],
  nodeDragThreshold: 0,
  snapGrid: [15, 15],
  snapToGrid: false,
  nodesDraggable: true,
  nodesConnectable: true,
  nodesFocusable: true,
  edgesFocusable: true,
  edgesUpdatable: true,
  elementsSelectable: true,
  elevateNodesOnSelect: true,
  fitViewOnInit: false,
  fitViewOnInitDone: false,
  fitViewOnInitOptions: void 0,
  onSelectionChange: [],
  multiSelectionActive: false,
  connectionStartHandle: null,
  connectionEndHandle: null,
  connectionClickStartHandle: null,
  connectOnClick: true,
  ariaLiveMessage: "",
  autoPanOnConnect: true,
  autoPanOnNodeDrag: true,
  connectionRadius: 20,
  onError: devWarn,
  isValidConnection: void 0
};
const createRFStore = () => createWithEqualityFn((set2, get2) => ({
  ...initialState,
  setNodes: (nodes) => {
    const { nodeInternals, nodeOrigin, elevateNodesOnSelect } = get2();
    set2({ nodeInternals: createNodeInternals(nodes, nodeInternals, nodeOrigin, elevateNodesOnSelect) });
  },
  getNodes: () => {
    return Array.from(get2().nodeInternals.values());
  },
  setEdges: (edges) => {
    const { defaultEdgeOptions = {} } = get2();
    set2({ edges: edges.map((e) => ({ ...defaultEdgeOptions, ...e })) });
  },
  setDefaultNodesAndEdges: (nodes, edges) => {
    const hasDefaultNodes = typeof nodes !== "undefined";
    const hasDefaultEdges = typeof edges !== "undefined";
    const nodeInternals = hasDefaultNodes ? createNodeInternals(nodes, /* @__PURE__ */ new Map(), get2().nodeOrigin, get2().elevateNodesOnSelect) : /* @__PURE__ */ new Map();
    const nextEdges = hasDefaultEdges ? edges : [];
    set2({ nodeInternals, edges: nextEdges, hasDefaultNodes, hasDefaultEdges });
  },
  updateNodeDimensions: (updates) => {
    const { onNodesChange, nodeInternals, fitViewOnInit, fitViewOnInitDone, fitViewOnInitOptions, domNode, nodeOrigin } = get2();
    const viewportNode = domNode == null ? void 0 : domNode.querySelector(".react-flow__viewport");
    if (!viewportNode) {
      return;
    }
    const style2 = window.getComputedStyle(viewportNode);
    const { m22: zoom2 } = new window.DOMMatrixReadOnly(style2.transform);
    const changes = updates.reduce((res, update) => {
      const node = nodeInternals.get(update.id);
      if (node == null ? void 0 : node.hidden) {
        nodeInternals.set(node.id, {
          ...node,
          [internalsSymbol]: {
            ...node[internalsSymbol],
            // we need to reset the handle bounds when the node is hidden
            // in order to force a new observation when the node is shown again
            handleBounds: void 0
          }
        });
      } else if (node) {
        const dimensions = getDimensions(update.nodeElement);
        const doUpdate = !!(dimensions.width && dimensions.height && (node.width !== dimensions.width || node.height !== dimensions.height || update.forceUpdate));
        if (doUpdate) {
          nodeInternals.set(node.id, {
            ...node,
            [internalsSymbol]: {
              ...node[internalsSymbol],
              handleBounds: {
                source: getHandleBounds(".source", update.nodeElement, zoom2, nodeOrigin),
                target: getHandleBounds(".target", update.nodeElement, zoom2, nodeOrigin)
              }
            },
            ...dimensions
          });
          res.push({
            id: node.id,
            type: "dimensions",
            dimensions
          });
        }
      }
      return res;
    }, []);
    updateAbsoluteNodePositions(nodeInternals, nodeOrigin);
    const nextFitViewOnInitDone = fitViewOnInitDone || fitViewOnInit && !fitViewOnInitDone && fitView(get2, { initial: true, ...fitViewOnInitOptions });
    set2({ nodeInternals: new Map(nodeInternals), fitViewOnInitDone: nextFitViewOnInitDone });
    if ((changes == null ? void 0 : changes.length) > 0) {
      onNodesChange == null ? void 0 : onNodesChange(changes);
    }
  },
  updateNodePositions: (nodeDragItems, positionChanged = true, dragging = false) => {
    const { triggerNodeChanges } = get2();
    const changes = nodeDragItems.map((node) => {
      const change = {
        id: node.id,
        type: "position",
        dragging
      };
      if (positionChanged) {
        change.positionAbsolute = node.positionAbsolute;
        change.position = node.position;
      }
      return change;
    });
    triggerNodeChanges(changes);
  },
  triggerNodeChanges: (changes) => {
    const { onNodesChange, nodeInternals, hasDefaultNodes, nodeOrigin, getNodes, elevateNodesOnSelect } = get2();
    if (changes == null ? void 0 : changes.length) {
      if (hasDefaultNodes) {
        const nodes = applyNodeChanges(changes, getNodes());
        const nextNodeInternals = createNodeInternals(nodes, nodeInternals, nodeOrigin, elevateNodesOnSelect);
        set2({ nodeInternals: nextNodeInternals });
      }
      onNodesChange == null ? void 0 : onNodesChange(changes);
    }
  },
  addSelectedNodes: (selectedNodeIds) => {
    const { multiSelectionActive, edges, getNodes } = get2();
    let changedNodes;
    let changedEdges = null;
    if (multiSelectionActive) {
      changedNodes = selectedNodeIds.map((nodeId) => createSelectionChange(nodeId, true));
    } else {
      changedNodes = getSelectionChanges(getNodes(), selectedNodeIds);
      changedEdges = getSelectionChanges(edges, []);
    }
    updateNodesAndEdgesSelections({
      changedNodes,
      changedEdges,
      get: get2,
      set: set2
    });
  },
  addSelectedEdges: (selectedEdgeIds) => {
    const { multiSelectionActive, edges, getNodes } = get2();
    let changedEdges;
    let changedNodes = null;
    if (multiSelectionActive) {
      changedEdges = selectedEdgeIds.map((edgeId) => createSelectionChange(edgeId, true));
    } else {
      changedEdges = getSelectionChanges(edges, selectedEdgeIds);
      changedNodes = getSelectionChanges(getNodes(), []);
    }
    updateNodesAndEdgesSelections({
      changedNodes,
      changedEdges,
      get: get2,
      set: set2
    });
  },
  unselectNodesAndEdges: ({ nodes, edges } = {}) => {
    const { edges: storeEdges, getNodes } = get2();
    const nodesToUnselect = nodes ? nodes : getNodes();
    const edgesToUnselect = edges ? edges : storeEdges;
    const changedNodes = nodesToUnselect.map((n2) => {
      n2.selected = false;
      return createSelectionChange(n2.id, false);
    });
    const changedEdges = edgesToUnselect.map((edge) => createSelectionChange(edge.id, false));
    updateNodesAndEdgesSelections({
      changedNodes,
      changedEdges,
      get: get2,
      set: set2
    });
  },
  setMinZoom: (minZoom) => {
    const { d3Zoom, maxZoom } = get2();
    d3Zoom == null ? void 0 : d3Zoom.scaleExtent([minZoom, maxZoom]);
    set2({ minZoom });
  },
  setMaxZoom: (maxZoom) => {
    const { d3Zoom, minZoom } = get2();
    d3Zoom == null ? void 0 : d3Zoom.scaleExtent([minZoom, maxZoom]);
    set2({ maxZoom });
  },
  setTranslateExtent: (translateExtent) => {
    var _a;
    (_a = get2().d3Zoom) == null ? void 0 : _a.translateExtent(translateExtent);
    set2({ translateExtent });
  },
  resetSelectedElements: () => {
    const { edges, getNodes } = get2();
    const nodes = getNodes();
    const nodesToUnselect = nodes.filter((e) => e.selected).map((n2) => createSelectionChange(n2.id, false));
    const edgesToUnselect = edges.filter((e) => e.selected).map((e) => createSelectionChange(e.id, false));
    updateNodesAndEdgesSelections({
      changedNodes: nodesToUnselect,
      changedEdges: edgesToUnselect,
      get: get2,
      set: set2
    });
  },
  setNodeExtent: (nodeExtent) => {
    const { nodeInternals } = get2();
    nodeInternals.forEach((node) => {
      node.positionAbsolute = clampPosition(node.position, nodeExtent);
    });
    set2({
      nodeExtent,
      nodeInternals: new Map(nodeInternals)
    });
  },
  panBy: (delta) => {
    const { transform, width, height, d3Zoom, d3Selection, translateExtent } = get2();
    if (!d3Zoom || !d3Selection || !delta.x && !delta.y) {
      return false;
    }
    const nextTransform = identity.translate(transform[0] + delta.x, transform[1] + delta.y).scale(transform[2]);
    const extent = [
      [0, 0],
      [width, height]
    ];
    const constrainedTransform = d3Zoom == null ? void 0 : d3Zoom.constrain()(nextTransform, extent, translateExtent);
    d3Zoom.transform(d3Selection, constrainedTransform);
    const transformChanged = transform[0] !== constrainedTransform.x || transform[1] !== constrainedTransform.y || transform[2] !== constrainedTransform.k;
    return transformChanged;
  },
  cancelConnection: () => set2({
    connectionNodeId: initialState.connectionNodeId,
    connectionHandleId: initialState.connectionHandleId,
    connectionHandleType: initialState.connectionHandleType,
    connectionStatus: initialState.connectionStatus,
    connectionStartHandle: initialState.connectionStartHandle,
    connectionEndHandle: initialState.connectionEndHandle
  }),
  reset: () => set2({ ...initialState })
}), Object.is);
const ReactFlowProvider = ({ children: children2 }) => {
  const storeRef = reactExports.useRef(null);
  if (!storeRef.current) {
    storeRef.current = createRFStore();
  }
  return React$2.createElement(Provider$1, { value: storeRef.current }, children2);
};
ReactFlowProvider.displayName = "ReactFlowProvider";
const Wrapper = ({ children: children2 }) => {
  const isWrapped = reactExports.useContext(StoreContext);
  if (isWrapped) {
    return React$2.createElement(React$2.Fragment, null, children2);
  }
  return React$2.createElement(ReactFlowProvider, null, children2);
};
Wrapper.displayName = "ReactFlowWrapper";
const defaultNodeTypes = {
  input: InputNode$1,
  default: DefaultNode$1,
  output: OutputNode$1,
  group: GroupNode
};
const defaultEdgeTypes = {
  default: BezierEdge,
  straight: StraightEdge,
  step: StepEdge,
  smoothstep: SmoothStepEdge,
  simplebezier: SimpleBezierEdge
};
const initNodeOrigin = [0, 0];
const initSnapGrid = [15, 15];
const initDefaultViewport = { x: 0, y: 0, zoom: 1 };
const wrapperStyle = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "relative",
  zIndex: 0
};
const ReactFlow = reactExports.forwardRef(({ nodes, edges, defaultNodes, defaultEdges, className, nodeTypes = defaultNodeTypes, edgeTypes = defaultEdgeTypes, onNodeClick, onEdgeClick, onInit, onMove, onMoveStart, onMoveEnd, onConnect, onConnectStart, onConnectEnd, onClickConnectStart, onClickConnectEnd, onNodeMouseEnter, onNodeMouseMove, onNodeMouseLeave, onNodeContextMenu, onNodeDoubleClick, onNodeDragStart, onNodeDrag, onNodeDragStop, onNodesDelete, onEdgesDelete, onSelectionChange, onSelectionDragStart, onSelectionDrag, onSelectionDragStop, onSelectionContextMenu, onSelectionStart, onSelectionEnd, connectionMode = ConnectionMode.Strict, connectionLineType = ConnectionLineType.Bezier, connectionLineStyle, connectionLineComponent, connectionLineContainerStyle, deleteKeyCode = "Backspace", selectionKeyCode = "Shift", selectionOnDrag = false, selectionMode = SelectionMode.Full, panActivationKeyCode = "Space", multiSelectionKeyCode = isMacOs() ? "Meta" : "Control", zoomActivationKeyCode = isMacOs() ? "Meta" : "Control", snapToGrid = false, snapGrid = initSnapGrid, onlyRenderVisibleElements = false, selectNodesOnDrag = true, nodesDraggable, nodesConnectable, nodesFocusable, nodeOrigin = initNodeOrigin, edgesFocusable, edgesUpdatable, elementsSelectable, defaultViewport = initDefaultViewport, minZoom = 0.5, maxZoom = 2, translateExtent = infiniteExtent, preventScrolling = true, nodeExtent, defaultMarkerColor = "#b1b1b7", zoomOnScroll = true, zoomOnPinch = true, panOnScroll = false, panOnScrollSpeed = 0.5, panOnScrollMode = PanOnScrollMode.Free, zoomOnDoubleClick = true, panOnDrag = true, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneScroll, onPaneContextMenu, children: children2, onEdgeContextMenu, onEdgeDoubleClick, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, onEdgeUpdate, onEdgeUpdateStart, onEdgeUpdateEnd, onReconnect, onReconnectStart, onReconnectEnd, reconnectRadius = 10, edgeUpdaterRadius = 10, onNodesChange, onEdgesChange, noDragClassName = "nodrag", noWheelClassName = "nowheel", noPanClassName = "nopan", fitView: fitView2 = false, fitViewOptions, connectOnClick = true, attributionPosition, proOptions, defaultEdgeOptions, elevateNodesOnSelect = true, elevateEdgesOnSelect = false, disableKeyboardA11y = false, autoPanOnConnect = true, autoPanOnNodeDrag = true, connectionRadius = 20, isValidConnection, onError, style: style2, id: id2, nodeDragThreshold, ...rest }, ref) => {
  const rfId = id2 || "1";
  return React$2.createElement(
    "div",
    { ...rest, style: { ...style2, ...wrapperStyle }, ref, className: cc(["react-flow", className]), "data-testid": "rf__wrapper", id: id2 },
    React$2.createElement(
      Wrapper,
      null,
      React$2.createElement(GraphView$1, { onInit, onMove, onMoveStart, onMoveEnd, onNodeClick, onEdgeClick, onNodeMouseEnter, onNodeMouseMove, onNodeMouseLeave, onNodeContextMenu, onNodeDoubleClick, nodeTypes, edgeTypes, connectionLineType, connectionLineStyle, connectionLineComponent, connectionLineContainerStyle, selectionKeyCode, selectionOnDrag, selectionMode, deleteKeyCode, multiSelectionKeyCode, panActivationKeyCode, zoomActivationKeyCode, onlyRenderVisibleElements, selectNodesOnDrag, defaultViewport, translateExtent, minZoom, maxZoom, preventScrolling, zoomOnScroll, zoomOnPinch, zoomOnDoubleClick, panOnScroll, panOnScrollSpeed, panOnScrollMode, panOnDrag, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneScroll, onPaneContextMenu, onSelectionContextMenu, onSelectionStart, onSelectionEnd, onEdgeContextMenu, onEdgeDoubleClick, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, onReconnect: onReconnect ?? onEdgeUpdate, onReconnectStart: onReconnectStart ?? onEdgeUpdateStart, onReconnectEnd: onReconnectEnd ?? onEdgeUpdateEnd, reconnectRadius: reconnectRadius ?? edgeUpdaterRadius, defaultMarkerColor, noDragClassName, noWheelClassName, noPanClassName, elevateEdgesOnSelect, rfId, disableKeyboardA11y, nodeOrigin, nodeExtent }),
      React$2.createElement(StoreUpdater, { nodes, edges, defaultNodes, defaultEdges, onConnect, onConnectStart, onConnectEnd, onClickConnectStart, onClickConnectEnd, nodesDraggable, nodesConnectable, nodesFocusable, edgesFocusable, edgesUpdatable, elementsSelectable, elevateNodesOnSelect, minZoom, maxZoom, nodeExtent, onNodesChange, onEdgesChange, snapToGrid, snapGrid, connectionMode, translateExtent, connectOnClick, defaultEdgeOptions, fitView: fitView2, fitViewOptions, onNodesDelete, onEdgesDelete, onNodeDragStart, onNodeDrag, onNodeDragStop, onSelectionDrag, onSelectionDragStart, onSelectionDragStop, noPanClassName, nodeOrigin, rfId, autoPanOnConnect, autoPanOnNodeDrag, onError, connectionRadius, isValidConnection, nodeDragThreshold }),
      React$2.createElement(Wrapper$1, { onSelectionChange }),
      children2,
      React$2.createElement(Attribution, { proOptions, position: attributionPosition }),
      React$2.createElement(A11yDescriptions, { rfId, disableKeyboardA11y })
    )
  );
});
ReactFlow.displayName = "ReactFlow";
function createUseItemsState(applyChanges2) {
  return (initialItems) => {
    const [items, setItems] = reactExports.useState(initialItems);
    const onItemsChange = reactExports.useCallback((changes) => setItems((items2) => applyChanges2(changes, items2)), []);
    return [items, setItems, onItemsChange];
  };
}
const useNodesState = createUseItemsState(applyNodeChanges);
const useEdgesState = createUseItemsState(applyEdgeChanges);
const MiniMapNode = ({ id: id2, x: x2, y: y2, width, height, style: style2, color: color2, strokeColor, strokeWidth, className, borderRadius, shapeRendering, onClick, selected }) => {
  const { background, backgroundColor } = style2 || {};
  const fill = color2 || background || backgroundColor;
  return React$2.createElement("rect", { className: cc(["react-flow__minimap-node", { selected }, className]), x: x2, y: y2, rx: borderRadius, ry: borderRadius, width, height, fill, stroke: strokeColor, strokeWidth, shapeRendering, onClick: onClick ? (event) => onClick(event, id2) : void 0 });
};
MiniMapNode.displayName = "MiniMapNode";
var MiniMapNode$1 = reactExports.memo(MiniMapNode);
const selector$1$1 = (s) => s.nodeOrigin;
const selectorNodes = (s) => s.getNodes().filter((node) => !node.hidden && node.width && node.height);
const getAttrFunction = (func) => func instanceof Function ? func : () => func;
function MiniMapNodes({
  nodeStrokeColor = "transparent",
  nodeColor = "#e2e2e2",
  nodeClassName = "",
  nodeBorderRadius = 5,
  nodeStrokeWidth = 2,
  // We need to rename the prop to be `CapitalCase` so that JSX will render it as
  // a component properly.
  nodeComponent: NodeComponent = MiniMapNode$1,
  onClick
}) {
  const nodes = useStore(selectorNodes, shallow$1);
  const nodeOrigin = useStore(selector$1$1);
  const nodeColorFunc = getAttrFunction(nodeColor);
  const nodeStrokeColorFunc = getAttrFunction(nodeStrokeColor);
  const nodeClassNameFunc = getAttrFunction(nodeClassName);
  const shapeRendering = typeof window === "undefined" || !!window.chrome ? "crispEdges" : "geometricPrecision";
  return React$2.createElement(React$2.Fragment, null, nodes.map((node) => {
    const { x: x2, y: y2 } = getNodePositionWithOrigin(node, nodeOrigin).positionAbsolute;
    return React$2.createElement(NodeComponent, { key: node.id, x: x2, y: y2, width: node.width, height: node.height, style: node.style, selected: node.selected, className: nodeClassNameFunc(node), color: nodeColorFunc(node), borderRadius: nodeBorderRadius, strokeColor: nodeStrokeColorFunc(node), strokeWidth: nodeStrokeWidth, shapeRendering, onClick, id: node.id });
  }));
}
var MiniMapNodes$1 = reactExports.memo(MiniMapNodes);
const defaultWidth = 200;
const defaultHeight = 150;
const selector$2 = (s) => {
  const nodes = s.getNodes();
  const viewBB = {
    x: -s.transform[0] / s.transform[2],
    y: -s.transform[1] / s.transform[2],
    width: s.width / s.transform[2],
    height: s.height / s.transform[2]
  };
  return {
    viewBB,
    boundingRect: nodes.length > 0 ? getBoundsOfRects(getNodesBounds(nodes, s.nodeOrigin), viewBB) : viewBB,
    rfId: s.rfId
  };
};
const ARIA_LABEL_KEY = "react-flow__minimap-desc";
function MiniMap({
  style: style2,
  className,
  nodeStrokeColor = "transparent",
  nodeColor = "#e2e2e2",
  nodeClassName = "",
  nodeBorderRadius = 5,
  nodeStrokeWidth = 2,
  // We need to rename the prop to be `CapitalCase` so that JSX will render it as
  // a component properly.
  nodeComponent,
  maskColor = "rgb(240, 240, 240, 0.6)",
  maskStrokeColor = "none",
  maskStrokeWidth = 1,
  position = "bottom-right",
  onClick,
  onNodeClick,
  pannable = false,
  zoomable = false,
  ariaLabel = "React Flow mini map",
  inversePan = false,
  zoomStep = 10,
  offsetScale = 5
}) {
  const store = useStoreApi();
  const svg = reactExports.useRef(null);
  const { boundingRect, viewBB, rfId } = useStore(selector$2, shallow$1);
  const elementWidth = (style2 == null ? void 0 : style2.width) ?? defaultWidth;
  const elementHeight = (style2 == null ? void 0 : style2.height) ?? defaultHeight;
  const scaledWidth = boundingRect.width / elementWidth;
  const scaledHeight = boundingRect.height / elementHeight;
  const viewScale = Math.max(scaledWidth, scaledHeight);
  const viewWidth = viewScale * elementWidth;
  const viewHeight = viewScale * elementHeight;
  const offset = offsetScale * viewScale;
  const x2 = boundingRect.x - (viewWidth - boundingRect.width) / 2 - offset;
  const y2 = boundingRect.y - (viewHeight - boundingRect.height) / 2 - offset;
  const width = viewWidth + offset * 2;
  const height = viewHeight + offset * 2;
  const labelledBy = `${ARIA_LABEL_KEY}-${rfId}`;
  const viewScaleRef = reactExports.useRef(0);
  viewScaleRef.current = viewScale;
  reactExports.useEffect(() => {
    if (svg.current) {
      const selection2 = select(svg.current);
      const zoomHandler = (event) => {
        const { transform, d3Selection, d3Zoom } = store.getState();
        if (event.sourceEvent.type !== "wheel" || !d3Selection || !d3Zoom) {
          return;
        }
        const pinchDelta = -event.sourceEvent.deltaY * (event.sourceEvent.deltaMode === 1 ? 0.05 : event.sourceEvent.deltaMode ? 1 : 2e-3) * zoomStep;
        const zoom2 = transform[2] * Math.pow(2, pinchDelta);
        d3Zoom.scaleTo(d3Selection, zoom2);
      };
      const panHandler = (event) => {
        const { transform, d3Selection, d3Zoom, translateExtent, width: width2, height: height2 } = store.getState();
        if (event.sourceEvent.type !== "mousemove" || !d3Selection || !d3Zoom) {
          return;
        }
        const moveScale = viewScaleRef.current * Math.max(1, transform[2]) * (inversePan ? -1 : 1);
        const position2 = {
          x: transform[0] - event.sourceEvent.movementX * moveScale,
          y: transform[1] - event.sourceEvent.movementY * moveScale
        };
        const extent = [
          [0, 0],
          [width2, height2]
        ];
        const nextTransform = identity.translate(position2.x, position2.y).scale(transform[2]);
        const constrainedTransform = d3Zoom.constrain()(nextTransform, extent, translateExtent);
        d3Zoom.transform(d3Selection, constrainedTransform);
      };
      const zoomAndPanHandler = zoom().on("zoom", pannable ? panHandler : null).on("zoom.wheel", zoomable ? zoomHandler : null);
      selection2.call(zoomAndPanHandler);
      return () => {
        selection2.on("zoom", null);
      };
    }
  }, [pannable, zoomable, inversePan, zoomStep]);
  const onSvgClick = onClick ? (event) => {
    const rfCoord = pointer(event);
    onClick(event, { x: rfCoord[0], y: rfCoord[1] });
  } : void 0;
  const onSvgNodeClick = onNodeClick ? (event, nodeId) => {
    const node = store.getState().nodeInternals.get(nodeId);
    onNodeClick(event, node);
  } : void 0;
  return React$2.createElement(
    Panel,
    { position, style: style2, className: cc(["react-flow__minimap", className]), "data-testid": "rf__minimap" },
    React$2.createElement(
      "svg",
      { width: elementWidth, height: elementHeight, viewBox: `${x2} ${y2} ${width} ${height}`, role: "img", "aria-labelledby": labelledBy, ref: svg, onClick: onSvgClick },
      ariaLabel && React$2.createElement("title", { id: labelledBy }, ariaLabel),
      React$2.createElement(MiniMapNodes$1, { onClick: onSvgNodeClick, nodeColor, nodeStrokeColor, nodeBorderRadius, nodeClassName, nodeStrokeWidth, nodeComponent }),
      React$2.createElement("path", { className: "react-flow__minimap-mask", d: `M${x2 - offset},${y2 - offset}h${width + offset * 2}v${height + offset * 2}h${-width - offset * 2}z
        M${viewBB.x},${viewBB.y}h${viewBB.width}v${viewBB.height}h${-viewBB.width}z`, fill: maskColor, fillRule: "evenodd", stroke: maskStrokeColor, strokeWidth: maskStrokeWidth, pointerEvents: "none" })
    )
  );
}
MiniMap.displayName = "MiniMap";
var MiniMap$1 = reactExports.memo(MiniMap);
function PlusIcon() {
  return React$2.createElement(
    "svg",
    { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32" },
    React$2.createElement("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" })
  );
}
function MinusIcon() {
  return React$2.createElement(
    "svg",
    { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 5" },
    React$2.createElement("path", { d: "M0 0h32v4.2H0z" })
  );
}
function FitViewIcon() {
  return React$2.createElement(
    "svg",
    { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 30" },
    React$2.createElement("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" })
  );
}
function LockIcon() {
  return React$2.createElement(
    "svg",
    { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32" },
    React$2.createElement("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" })
  );
}
function UnlockIcon() {
  return React$2.createElement(
    "svg",
    { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32" },
    React$2.createElement("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z" })
  );
}
const ControlButton = ({ children: children2, className, ...rest }) => React$2.createElement("button", { type: "button", className: cc(["react-flow__controls-button", className]), ...rest }, children2);
ControlButton.displayName = "ControlButton";
const selector$1 = (s) => ({
  isInteractive: s.nodesDraggable || s.nodesConnectable || s.elementsSelectable,
  minZoomReached: s.transform[2] <= s.minZoom,
  maxZoomReached: s.transform[2] >= s.maxZoom
});
const Controls = ({ style: style2, showZoom = true, showFitView = true, showInteractive = true, fitViewOptions, onZoomIn, onZoomOut, onFitView, onInteractiveChange, className, children: children2, position = "bottom-left" }) => {
  const store = useStoreApi();
  const [isVisible, setIsVisible] = reactExports.useState(false);
  const { isInteractive, minZoomReached, maxZoomReached } = useStore(selector$1, shallow$1);
  const { zoomIn, zoomOut, fitView: fitView2 } = useReactFlow();
  reactExports.useEffect(() => {
    setIsVisible(true);
  }, []);
  if (!isVisible) {
    return null;
  }
  const onZoomInHandler = () => {
    zoomIn();
    onZoomIn == null ? void 0 : onZoomIn();
  };
  const onZoomOutHandler = () => {
    zoomOut();
    onZoomOut == null ? void 0 : onZoomOut();
  };
  const onFitViewHandler = () => {
    fitView2(fitViewOptions);
    onFitView == null ? void 0 : onFitView();
  };
  const onToggleInteractivity = () => {
    store.setState({
      nodesDraggable: !isInteractive,
      nodesConnectable: !isInteractive,
      elementsSelectable: !isInteractive
    });
    onInteractiveChange == null ? void 0 : onInteractiveChange(!isInteractive);
  };
  return React$2.createElement(
    Panel,
    { className: cc(["react-flow__controls", className]), position, style: style2, "data-testid": "rf__controls" },
    showZoom && React$2.createElement(
      React$2.Fragment,
      null,
      React$2.createElement(
        ControlButton,
        { onClick: onZoomInHandler, className: "react-flow__controls-zoomin", title: "zoom in", "aria-label": "zoom in", disabled: maxZoomReached },
        React$2.createElement(PlusIcon, null)
      ),
      React$2.createElement(
        ControlButton,
        { onClick: onZoomOutHandler, className: "react-flow__controls-zoomout", title: "zoom out", "aria-label": "zoom out", disabled: minZoomReached },
        React$2.createElement(MinusIcon, null)
      )
    ),
    showFitView && React$2.createElement(
      ControlButton,
      { className: "react-flow__controls-fitview", onClick: onFitViewHandler, title: "fit view", "aria-label": "fit view" },
      React$2.createElement(FitViewIcon, null)
    ),
    showInteractive && React$2.createElement(ControlButton, { className: "react-flow__controls-interactive", onClick: onToggleInteractivity, title: "toggle interactivity", "aria-label": "toggle interactivity" }, isInteractive ? React$2.createElement(UnlockIcon, null) : React$2.createElement(LockIcon, null)),
    children2
  );
};
Controls.displayName = "Controls";
var Controls$1 = reactExports.memo(Controls);
var BackgroundVariant;
(function(BackgroundVariant2) {
  BackgroundVariant2["Lines"] = "lines";
  BackgroundVariant2["Dots"] = "dots";
  BackgroundVariant2["Cross"] = "cross";
})(BackgroundVariant || (BackgroundVariant = {}));
function LinePattern({ color: color2, dimensions, lineWidth }) {
  return React$2.createElement("path", { stroke: color2, strokeWidth: lineWidth, d: `M${dimensions[0] / 2} 0 V${dimensions[1]} M0 ${dimensions[1] / 2} H${dimensions[0]}` });
}
function DotPattern({ color: color2, radius }) {
  return React$2.createElement("circle", { cx: radius, cy: radius, r: radius, fill: color2 });
}
const defaultColor = {
  [BackgroundVariant.Dots]: "#91919a",
  [BackgroundVariant.Lines]: "#eee",
  [BackgroundVariant.Cross]: "#e2e2e2"
};
const defaultSize = {
  [BackgroundVariant.Dots]: 1,
  [BackgroundVariant.Lines]: 1,
  [BackgroundVariant.Cross]: 6
};
const selector = (s) => ({ transform: s.transform, patternId: `pattern-${s.rfId}` });
function Background({
  id: id2,
  variant = BackgroundVariant.Dots,
  // only used for dots and cross
  gap = 20,
  // only used for lines and cross
  size,
  lineWidth = 1,
  offset = 2,
  color: color2,
  style: style2,
  className
}) {
  const ref = reactExports.useRef(null);
  const { transform, patternId } = useStore(selector, shallow$1);
  const patternColor = color2 || defaultColor[variant];
  const patternSize = size || defaultSize[variant];
  const isDots = variant === BackgroundVariant.Dots;
  const isCross = variant === BackgroundVariant.Cross;
  const gapXY = Array.isArray(gap) ? gap : [gap, gap];
  const scaledGap = [gapXY[0] * transform[2] || 1, gapXY[1] * transform[2] || 1];
  const scaledSize = patternSize * transform[2];
  const patternDimensions = isCross ? [scaledSize, scaledSize] : scaledGap;
  const patternOffset = isDots ? [scaledSize / offset, scaledSize / offset] : [patternDimensions[0] / offset, patternDimensions[1] / offset];
  return React$2.createElement(
    "svg",
    { className: cc(["react-flow__background", className]), style: {
      ...style2,
      position: "absolute",
      width: "100%",
      height: "100%",
      top: 0,
      left: 0
    }, ref, "data-testid": "rf__background" },
    React$2.createElement("pattern", { id: patternId + id2, x: transform[0] % scaledGap[0], y: transform[1] % scaledGap[1], width: scaledGap[0], height: scaledGap[1], patternUnits: "userSpaceOnUse", patternTransform: `translate(-${patternOffset[0]},-${patternOffset[1]})` }, isDots ? React$2.createElement(DotPattern, { color: patternColor, radius: scaledSize / offset }) : React$2.createElement(LinePattern, { dimensions: patternDimensions, color: patternColor, lineWidth })),
    React$2.createElement("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: `url(#${patternId + id2})` })
  );
}
Background.displayName = "Background";
var Background$1 = reactExports.memo(Background);
const logoImage = "" + new URL("IXO Logo-CZVrwHHB.png", import.meta.url).href;
const ACCENT = "#3ecf8e";
const LOGO_FALLBACKS = [
  logoImage,
  "./IXO Logo.png",
  "./IXO Logo.PNG",
  "https://github.com/minyang-tech/IXO-Engine/blob/main/IXO%20Logo.png?raw=true"
];
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
const LOCAL_AUTOSAVE_KEY = "ixo-engine-local-autosave-v1";
const LANGUAGE_OPTIONS = [
  { value: "ko", label: "한국어" },
  { value: "en", label: "English" },
  { value: "zh", label: "中文" },
  { value: "ja", label: "日本語" }
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
    settings: "설정",
    settingsTitle: "Engine Settings",
    language: "언어",
    theme: "테마",
    templates: "프로젝트 템플릿",
    responsivePreview: "반응형 미리보기",
    docs: "Docs",
    file: "File",
    deleteZone: "Delete Zone",
    deleteZoneCopy: "노드를 여기로 끌어오거나, 노드/선 선택 후 Delete 키를 눌러 제거할 수 있습니다. Ctrl + 클릭으로 여러 노드를 선택해 그룹화하세요.",
    viewerBuilderHint: "텍스트, 이미지, 버튼을 드래그해서 배치하고 노드 refKey와 연결하세요.",
    viewerSimpleHint: "노드 로직과 연결된 실제 앱 화면을 단순하게 확인합니다.",
    builderToolbarTitle: "Canvas Builder",
    builderToolbarCopy: "팔레트에서 요소를 끌어다 놓으면 UI Viewer와 동일한 화면에 즉시 반영됩니다.",
    loadTemplate: "템플릿 불러오기",
    clearAutosave: "자동 저장 초기화",
    apply: "Apply",
    cancel: "Cancel",
    applied: "적용되었습니다!",
    selectTemplate: "선택 템플릿",
    settingsIcon: "⚙"
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
    apply: "Apply",
    cancel: "Cancel",
    applied: "Applied!",
    selectTemplate: "Selected Template",
    settingsIcon: "⚙"
  },
  zh: {
    preview: "预览",
    viewer: "界面查看器",
    builder: "画布构建器",
    settings: "设置",
    settingsTitle: "引擎设置",
    language: "语言",
    theme: "主题",
    templates: "项目模板",
    responsivePreview: "响应式预览",
    docs: "文档",
    file: "文件",
    deleteZone: "删除区域",
    deleteZoneCopy: "把节点拖到这里即可删除，或者选中节点/连线后按 Delete。按 Ctrl + 点击可多选后分组。",
    viewerBuilderHint: "拖入文本、图片、按钮并连接到节点 refKey。",
    viewerSimpleHint: "将实际应用界面与节点逻辑分开查看。",
    builderToolbarTitle: "画布构建器",
    builderToolbarCopy: "把素材拖到这里后，UI Viewer 会立即同步显示。",
    loadTemplate: "加载模板",
    clearAutosave: "清除自动保存",
    apply: "应用",
    cancel: "取消",
    applied: "已应用！",
    selectTemplate: "已选择模板",
    settingsIcon: "⚙"
  },
  ja: {
    preview: "プレビュー",
    viewer: "UI Viewer",
    builder: "Canvas Builder",
    settings: "設定",
    settingsTitle: "Engine Settings",
    language: "言語",
    theme: "テーマ",
    templates: "スターターテンプレート",
    responsivePreview: "レスポンシブ確認",
    docs: "Docs",
    file: "File",
    deleteZone: "Delete Zone",
    deleteZoneCopy: "ノードをここにドラッグするか、ノード/線を選択して Delete を押すと削除できます。Ctrl + クリックで複数選択してグループ化できます。",
    viewerBuilderHint: "テキスト、画像、ボタンをドラッグして配置し、ノード refKey と連携してください。",
    viewerSimpleHint: "ノードロジックと分離して実際の画面を確認します。",
    builderToolbarTitle: "Canvas Builder",
    builderToolbarCopy: "パレットの要素をここに置くと、UI Viewer に即時反映されます。",
    loadTemplate: "テンプレート読み込み",
    clearAutosave: "自動保存を削除",
    apply: "適用",
    cancel: "キャンセル",
    applied: "適用されました！",
    selectTemplate: "選択テンプレート",
    settingsIcon: "⚙"
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
  var _a;
  return ((_a = NODE_TEXT[language]) == null ? void 0 : _a[nodeType]) || NODE_TEXT.en[nodeType] || fallback || nodeType;
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
const UI_PALETTE = [
  { kind: "text", label: "Text" },
  { kind: "image", label: "Image" },
  { kind: "button", label: "Button" },
  { kind: "container", label: "Container" }
];
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
const cloneState = (nodes, edges, inputValues, nodeCounter, uiElements) => ({
  nodes: JSON.parse(JSON.stringify(nodes)),
  edges: JSON.parse(JSON.stringify(edges)),
  inputValues: JSON.parse(JSON.stringify(inputValues)),
  nodeCounter,
  uiElements: JSON.parse(JSON.stringify(uiElements))
});
function makeLog(level, source, message, details = "") {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    time: (/* @__PURE__ */ new Date()).toLocaleTimeString("ko-KR", { hour12: false }),
    level,
    source,
    message,
    details
  };
}
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
function createUiElement(kind, bindingKey = "", accentColor = ACCENT) {
  const id2 = `ui-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  if (kind === "image") {
    return {
      id: id2,
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
      id: id2,
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
      id: id2,
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
    id: id2,
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
function applyTemplate(text, context) {
  return String(text || "").replace(/\{\{\s*([^}]+)\s*\}\}/g, (_, key) => String(context[key.trim()] ?? ""));
}
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
function evaluateConditionChain(expression, context) {
  const rendered = applyTemplate(expression || "", context);
  const orParts = rendered.split(/\s+OR\s+/i).map((part) => part.trim()).filter(Boolean);
  return orParts.some(
    (orPart) => orPart.split(/\s+AND\s+/i).map((part) => part.trim()).filter(Boolean).every((andPart) => compareExpression(andPart))
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
    outgoing[edge.source] = [...outgoing[edge.source] || [], edge];
  });
  const queue = Object.keys(indegree).filter((id2) => indegree[id2] === 0);
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
    ordered.push(...nodes.map((node) => node.id).filter((id2) => !ordered.includes(id2)));
  }
  return ordered;
}
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
    outgoing[edge.source] = [...outgoing[edge.source] || [], edge];
  });
  const topo = topoOrder(nodes, edges);
  topo.forEach((nodeId) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
    const node = nodeMap[nodeId];
    if (!node) return;
    const incoming = edges.filter((edge) => edge.target === nodeId);
    const isActive = incoming.length === 0 ? true : incoming.some((edge) => activeEdgeIds.includes(edge.id));
    if (!isActive) return;
    activeNodeIds.push(nodeId);
    const type = ((_a = node.data) == null ? void 0 : _a.nodeType) || "";
    const value = ((_b = node.data) == null ? void 0 : _b.value) || "";
    const key = ((_c = node.data) == null ? void 0 : _c.refKey) || node.id;
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
        const fn = new Function("context", "inputValues", String(value || "return context;"));
        const result = fn(context, inputValues);
        produced = typeof result === "undefined" ? "" : result;
        events.push(makeLog("info", ((_d = node.data) == null ? void 0 : _d.label) || "Script", `스크립트가 실행되었습니다. 결과: ${String(produced)}`));
      } catch (error) {
        produced = `Script Error: ${error.message}`;
        events.push(makeLog("error", ((_e = node.data) == null ? void 0 : _e.label) || "Script", produced));
      }
    } else if (type === "condition") {
      const pass = evaluateConditionChain(value, context);
      produced = pass ? "true" : "false";
      events.push(makeLog("trace", ((_f = node.data) == null ? void 0 : _f.label) || "Condition", `조건 분기 결과: ${produced}`));
    } else if (type === "compare" || type === "merge-data" || type === "constant" || type === "variable" || type === "storage") {
      produced = applyTemplate(value, context);
    } else if (type === "random") {
      produced = Math.floor(Math.random() * (Number(applyTemplate(value, context)) || 100));
    } else if (type === "image" || type === "video-player") {
      produced = applyTemplate(value, context);
      outputImages.push({ id: node.id, src: String(produced), label: ((_g = node.data) == null ? void 0 : _g.label) || "Image" });
    } else if (type === "sound-play" || type === "sound-play-wait" || type === "bgm-play" || type === "audio-player") {
      produced = applyTemplate(value, context);
      if (produced) {
        outputSounds.push({ id: node.id, src: String(produced), label: ((_h = node.data) == null ? void 0 : _h.label) || "Sound" });
      }
    } else if (type === "system-info") {
      produced = navigator.userAgent;
      outputTexts.push({ id: node.id, text: String(produced), label: ((_i = node.data) == null ? void 0 : _i.label) || "System Info" });
    } else if (type === "random-range") {
      const [min, max] = String(applyTemplate(value, context)).split("..").map((item) => Number(item.trim()));
      produced = Math.floor((Number.isFinite(min) ? min : 1) + Math.random() * ((Number.isFinite(max) ? max : 10) - (Number.isFinite(min) ? min : 1) + 1));
    } else if (type === "timer") {
      produced = String(Math.round(performance.now() / 1e3));
    } else if (type === "date-part") {
      const part = String(value || "year").toLowerCase();
      const now2 = /* @__PURE__ */ new Date();
      produced = part.includes("month") ? now2.getMonth() + 1 : part.includes("day") ? now2.getDate() : part.includes("hour") ? now2.getHours() : now2.getFullYear();
    } else if (type === "text-length") {
      produced = String(applyTemplate(value, context)).length;
    } else if (type === "rgb-hex") {
      const channels = ((_j = String(applyTemplate(value, context)).match(/\d+/g)) == null ? void 0 : _j.slice(0, 3).map((item) => Math.max(0, Math.min(255, Number(item))))) || [255, 0, 0];
      produced = `#${channels.map((item) => item.toString(16).padStart(2, "0")).join("")}`;
    } else if (type === "particle" || type === "file-watcher" || type === "loop" || type === "wait" || type === "switch" || type === "browser" || type === "http") {
      produced = applyTemplate(value, context);
    } else if (type.startsWith("signal-") || ["scene-start", "repeat-times", "forever", "break-loop", "skip-cycle", "wait-until", "stop-flow", "restart-flow", "clone-spawn", "clone-remove", "move-steps", "edge-bounce", "change-x", "change-y", "set-x", "set-y", "go-to-point", "glide-point", "turn-angle", "set-heading", "face-target", "show-actor", "hide-actor", "speech-bubble", "clear-speech", "costume-switch", "visual-effect", "size-change", "layer-shift", "flip-horizontal", "pen-down", "pen-up", "pen-color", "pen-size", "fill-start", "fill-stop", "clear-drawing", "sound-stop", "volume-change", "volume-set", "tempo-change", "tempo-set", "pointer-down", "object-clicked", "key-held", "pointer-over", "number-check", "logic-and", "logic-or", "logic-not", "touch-screen", "text-letter", "text-replace", "text-case", "hex-channel"].includes(type)) {
      produced = applyTemplate(value, context);
      outputTexts.push({ id: node.id, text: String(produced || ((_k = node.data) == null ? void 0 : _k.label) || ""), label: ((_l = node.data) == null ? void 0 : _l.label) || "Node" });
    } else {
      produced = applyTemplate(value, context);
    }
    if (type === "text" || type === "layout" || type === "ui-text" || type === "ui-button" || type === "ui-container") {
      outputTexts.push({ id: node.id, text: String(produced || ((_m = node.data) == null ? void 0 : _m.label) || ""), label: ((_n = node.data) == null ? void 0 : _n.label) || "Text" });
    }
    context[key] = produced;
    liveValues[nodeId] = String(produced ?? "");
    if (paused) return;
    if (type === "condition") {
      const pass = String(produced) === "true";
      (outgoing[nodeId] || []).forEach((edge) => {
        if (pass && edge.sourceHandle === "true" || !pass && edge.sourceHandle === "false") {
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
function resolveUiValue(element2, runtime, field) {
  const sourceValue = field === "src" ? element2.src : element2.text;
  const boundValue = element2.bindingKey ? runtime.context[element2.bindingKey] : void 0;
  if (typeof boundValue !== "undefined" && boundValue !== "") {
    return String(boundValue);
  }
  return applyTemplate(sourceValue || "", runtime.context);
}
const BuilderElement = reactExports.memo(function BuilderElement2({
  element: element2,
  runtime,
  editable,
  selected,
  onSelect,
  onPointerDown,
  onPointerUp,
  onAction
}) {
  const textValue = resolveUiValue(element2, runtime, "text");
  const imageValue = resolveUiValue(element2, runtime, "src");
  const baseStyle = {
    left: `${element2.x}px`,
    top: `${element2.y}px`,
    width: `${element2.width}px`,
    height: `${element2.height}px`,
    color: element2.color,
    background: element2.kind === "image" ? "transparent" : element2.background,
    borderRadius: `${element2.radius}px`,
    fontSize: `${element2.fontSize}px`,
    textAlign: element2.align,
    cursor: editable ? "grab" : element2.kind === "button" && element2.actionType !== "none" ? "pointer" : "default"
  };
  const handleClick = async (event) => {
    event.stopPropagation();
    onSelect == null ? void 0 : onSelect(element2.id);
    if (!editable && element2.kind === "button" && element2.actionType === "open-url" && element2.actionValue) {
      await (onAction == null ? void 0 : onAction(element2.actionValue));
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `builder-item kind-${element2.kind} ${selected ? "is-selected" : ""}`,
      style: baseStyle,
      onClick: handleClick,
      onPointerDown: (event) => {
        event.stopPropagation();
        onSelect == null ? void 0 : onSelect(element2.id);
        onPointerDown == null ? void 0 : onPointerDown(event, element2.id);
      },
      onPointerUp: (event) => {
        event.stopPropagation();
        onPointerUp == null ? void 0 : onPointerUp();
      },
      onPointerCancel: (event) => {
        event.stopPropagation();
        onPointerUp == null ? void 0 : onPointerUp();
      },
      children: [
        element2.kind === "image" ? imageValue ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imageValue, alt: element2.text || "Builder asset" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "builder-placeholder", children: "Image" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "builder-copy", children: textValue || (element2.kind === "container" ? "Container" : "Empty") }),
        editable ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "builder-badge", children: element2.kind.toUpperCase() }) : null
      ]
    }
  );
});
const IXONode = reactExports.memo(function IXONode2({ data, selected }) {
  const color2 = NODE_COLOR[data.kind] || ACCENT;
  const isCondition = data.nodeType === "condition";
  const isSwitch = data.nodeType === "switch";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `ixo-node ${selected ? "selected" : ""} ${data.isActive ? "is-active" : ""} ${data.isFocused ? "is-focused" : ""}`,
      style: { "--node-color": color2 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Handle$1, { className: "node-handle node-handle-target", type: "target", position: Position.Left }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ixo-node-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ixo-badge", children: "IXO" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: data.category || "Node" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ixo-node-title-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ixo-node-title", children: data.displayLabel || data.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "node-title-meta", children: [
            typeof data.executionOrder === "number" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "node-order-pill", children: data.executionOrder }) : null,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "node-link-dot", "aria-hidden": "true" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ixo-node-value", children: data.value || "..." }),
        data.groupLabel ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "node-group-chip", children: data.groupLabel }) : null,
        data.liveValue ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "live-trace-pill", children: [
          "out: ",
          data.liveValue
        ] }) : null,
        isCondition ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Handle$1, { id: "true", className: "node-handle true-handle", type: "source", position: Position.Right, style: { top: 18 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Handle$1, { id: "false", className: "node-handle false-handle", type: "source", position: Position.Right, style: { top: 46 } })
        ] }) : isSwitch ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Handle$1, { id: "A", className: "node-handle node-handle-source", type: "source", position: Position.Right, style: { top: 14 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Handle$1, { id: "B", className: "node-handle node-handle-source", type: "source", position: Position.Right, style: { top: 32 } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Handle$1, { id: "C", className: "node-handle node-handle-source", type: "source", position: Position.Right, style: { top: 50 } })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Handle$1, { className: "node-handle node-handle-source", type: "source", position: Position.Right })
      ]
    }
  );
});
const IXOGroupNode = reactExports.memo(function IXOGroupNode2({ data, selected }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `ixo-group-node ${selected ? "selected" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ixo-group-title", children: data.label || "Group" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ixo-group-copy", children: data.value || "Drag nodes around this group to keep related logic together." })
  ] });
});
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
  var _a;
  const inputNodes = nodes.filter((node) => {
    var _a2;
    return ((_a2 = node.data) == null ? void 0 : _a2.nodeType) === "input";
  });
  const editable = viewMode === "builder";
  const showViewerStage = viewMode === "viewer" || viewMode === "builder";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preview-shell", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "viewer-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "viewer-tabs-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "viewer-tabs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: viewMode === "preview" ? "active" : "", onClick: () => setViewMode("preview"), children: uiText.preview }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: viewMode === "viewer" ? "active" : "", onClick: () => setViewMode("viewer"), children: uiText.viewer }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: viewMode === "builder" ? "active" : "", onClick: () => setViewMode("builder"), children: uiText.builder })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "settings-gear-btn", onClick: onOpenSettings, "aria-label": uiText.settings, children: uiText.settingsIcon })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: viewMode === "builder" ? uiText.viewerBuilderHint : uiText.viewerSimpleHint })
    ] }),
    editable ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "builder-toolbar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "builder-toolbar-copy", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: uiText.builderToolbarTitle }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: uiText.builderToolbarCopy })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "builder-palette", children: UI_PALETTE.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          draggable: true,
          onDragStart: (event) => {
            event.dataTransfer.setData("application/ixo-ui", item.kind);
            event.dataTransfer.effectAllowed = "copy";
          },
          children: item.label
        },
        item.kind
      )) })
    ] }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `runtime-screen viewer-screen ${editable ? "builder-mode" : ""} ${viewMode === "preview" ? "preview-mode" : ""}`,
        onClick: () => editable && setSelectedUiElementId(null),
        children: [
          inputNodes.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "viewer-inputs", children: inputNodes.map((node) => {
            var _a2, _b, _c;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "viewer-input-field", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: ((_a2 = node.data) == null ? void 0 : _a2.displayLabel) || ((_b = node.data) == null ? void 0 : _b.label) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  className: "runtime-input",
                  value: inputValues[node.id] || "",
                  onChange: (event) => onInputChange(node.id, event.target.value),
                  placeholder: ((_c = node.data) == null ? void 0 : _c.value) || "Input"
                }
              )
            ] }, node.id);
          }) }) : null,
          showViewerStage ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "device-toolbar", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: uiText.responsivePreview }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "device-tabs", children: Object.entries(PREVIEW_DEVICE_OPTIONS).map(([key, option]) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: previewDevice === key ? "active" : "", onClick: () => setPreviewDevice(key), children: option.label }, key)) })
          ] }) : null,
          showViewerStage ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `viewer-stage-shell device-${previewDevice}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              ref: builderCanvasRef,
              className: `viewer-stage ${editable ? "is-editable" : ""}`,
              style: { width: ((_a = PREVIEW_DEVICE_OPTIONS[previewDevice]) == null ? void 0 : _a.width) || "100%" },
              onDragOver: onBuilderDragOver,
              onDrop: onBuilderDrop,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "viewer-stage-grid" }),
                uiElements.map((element2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  BuilderElement,
                  {
                    element: element2,
                    runtime,
                    editable,
                    selected: selectedUiElementId === element2.id,
                    onSelect: onUiElementSelect,
                    onPointerDown: editable ? onBuilderPointerDown : void 0,
                    onPointerUp: editable ? onBuilderPointerUp : void 0,
                    onAction: async (url) => {
                      await onUiAction(url);
                      appendLog(makeLog("info", "UI Viewer", `버튼 액션이 실행되었습니다: ${url}`));
                    }
                  },
                  element2.id
                ))
              ]
            }
          ) }) : null,
          runtime.outputTexts.length || runtime.outputImages.length || runtime.outputSounds.length ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "auto-output-stack", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "auto-output-title", children: "Node Output Feed" }),
            runtime.outputTexts.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "runtime-text-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: item.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "runtime-text", children: item.text })
            ] }, item.id)),
            runtime.outputImages.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "runtime-image-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: item.label }),
              item.src ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "runtime-image", src: item.src, alt: item.label }) : null
            ] }, item.id)),
            runtime.outputSounds.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "runtime-text-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: item.label }),
              item.src ? /* @__PURE__ */ jsxRuntimeExports.jsx("audio", { className: "runtime-audio", controls: true, src: item.src }) : null
            ] }, item.id))
          ] }) : null,
          debugOverlay ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "debug-overlay", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Execution" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: runtime.topo.join(" -> ") })
          ] }) : null
        ]
      }
    ),
    viewMode === "preview" ? /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "json-view", children: flowJson }) : null
  ] });
}
function LogConsole({ logs, onClear }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "log-console", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "log-console-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Error Log Console" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "스크립트 실행 결과, 분기 결과, 외부 액션 로그를 아래에 누적합니다." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "ghost-btn", onClick: onClear, children: "Clear" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "log-console-list", children: [
      logs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "log-empty", children: "아직 기록된 로그가 없습니다." }) : null,
      logs.map((log) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `log-entry level-${log.level}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "log-meta", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: log.time }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: log.source }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: log.level.toUpperCase() })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "log-message", children: log.message }),
        log.details ? /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "log-details", children: log.details }) : null
      ] }, log.id))
    ] })
  ] });
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
  onApply,
  onCancel,
  onClearAutosave
}) {
  if (!open) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-modal-backdrop", onClick: onCancel, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-modal", onClick: (event) => event.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-modal-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: uiText.settingsTitle }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "ghost-btn", onClick: onCancel, children: uiText.cancel })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-modal-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "settings-field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: uiText.language }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: draftLanguage, onChange: (event) => setDraftLanguage(event.target.value), children: LANGUAGE_OPTIONS.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: option.value, children: option.label }, option.value)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "settings-field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: uiText.theme }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: draftThemeKey, onChange: (event) => setDraftThemeKey(event.target.value), children: Object.entries(THEME_OPTIONS).map(([key, option]) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: key, children: option.label }, key)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "settings-field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: uiText.responsivePreview }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: draftPreviewDevice, onChange: (event) => setDraftPreviewDevice(event.target.value), children: Object.entries(PREVIEW_DEVICE_OPTIONS).map(([key, option]) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: key, children: option.label }, key)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "settings-field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: uiText.templates }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: draftTemplateKey, onChange: (event) => setDraftTemplateKey(event.target.value), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: uiText.selectTemplate }),
          Object.entries(STARTER_TEMPLATES).map(([key, template]) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: key, children: template.label }, key))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-modal-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "ghost-btn", onClick: onClearAutosave, children: uiText.clearAutosave }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-cta-group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "ghost-btn", onClick: onCancel, children: uiText.cancel }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "menu-btn docs-btn", onClick: onApply, children: uiText.apply })
      ] })
    ] })
  ] }) });
}
function EngineEditor() {
  const { screenToFlowPosition } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [libraryTab, setLibraryTab] = reactExports.useState("pro");
  const [collapsed, setCollapsed] = reactExports.useState({});
  const [selectedNodeId, setSelectedNodeId] = reactExports.useState(null);
  const [selectedNodeIds, setSelectedNodeIds] = reactExports.useState([]);
  const [selectedEdgeIds, setSelectedEdgeIds] = reactExports.useState([]);
  const [selectedUiElementId, setSelectedUiElementId] = reactExports.useState(null);
  const [inspectorMode, setInspectorMode] = reactExports.useState("basic");
  const [contextMenu, setContextMenu] = reactExports.useState(null);
  const [quickSearchOpen, setQuickSearchOpen] = reactExports.useState(false);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("Ready");
  const [debugOverlay, setDebugOverlay] = reactExports.useState(false);
  const [showFileMenu, setShowFileMenu] = reactExports.useState(false);
  const [nodeCounter, setNodeCounter] = reactExports.useState(6);
  const [inputValues, setInputValues] = reactExports.useState({});
  const [uiElements, setUiElements] = reactExports.useState(normalizeUiElements(initialUiElements));
  const [isDirty, setIsDirty] = reactExports.useState(false);
  const [logoIndex, setLogoIndex] = reactExports.useState(0);
  const [speed, setSpeed] = reactExports.useState("1");
  const [paused, setPaused] = reactExports.useState(false);
  const [history, setHistory] = reactExports.useState([]);
  const [future, setFuture] = reactExports.useState([]);
  const [viewMode, setViewMode] = reactExports.useState("preview");
  const [logs, setLogs] = reactExports.useState([]);
  const [dragState, setDragState] = reactExports.useState(null);
  const [showSettings, setShowSettings] = reactExports.useState(false);
  const [language, setLanguage] = reactExports.useState("ko");
  const [themeKey, setThemeKey] = reactExports.useState("mint");
  const [previewDevice, setPreviewDevice] = reactExports.useState("desktop");
  const [draftLanguage, setDraftLanguage] = reactExports.useState("ko");
  const [draftThemeKey, setDraftThemeKey] = reactExports.useState("mint");
  const [draftPreviewDevice, setDraftPreviewDevice] = reactExports.useState("desktop");
  const [draftTemplateKey, setDraftTemplateKey] = reactExports.useState("");
  const [toastMessage, setToastMessage] = reactExports.useState("");
  const builderCanvasRef = reactExports.useRef(null);
  const sidebarRef = reactExports.useRef(null);
  const nodeCounterRef = reactExports.useRef(nodeCounter);
  const lastExecutionKeyRef = reactExports.useRef("");
  const lastActionSignatureRef = reactExports.useRef("");
  const autoSaveTimerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    nodeCounterRef.current = nodeCounter;
  }, [nodeCounter]);
  reactExports.useEffect(() => {
    if (!showSettings) return;
    setDraftLanguage(language);
    setDraftThemeKey(themeKey);
    setDraftPreviewDevice(previewDevice);
    setDraftTemplateKey("");
  }, [language, previewDevice, showSettings, themeKey]);
  const appendLog = reactExports.useCallback((entry) => {
    setLogs((current) => [...current.slice(-149), entry]);
  }, []);
  const runtime = reactExports.useMemo(() => runPipeline(nodes, edges, inputValues, paused), [nodes, edges, inputValues, paused]);
  const runtimeExecutionKey = reactExports.useMemo(
    () => JSON.stringify({ activeNodeIds: runtime.activeNodeIds, activeEdgeIds: runtime.activeEdgeIds, liveValues: runtime.liveValues, paused }),
    [paused, runtime.activeEdgeIds, runtime.activeNodeIds, runtime.liveValues]
  );
  const nodesWithTrace = reactExports.useMemo(
    () => nodes.map((node) => {
      var _a, _b;
      return {
        ...node,
        data: {
          ...node.data,
          displayLabel: getNodeLabel((_a = node.data) == null ? void 0 : _a.nodeType, language, (_b = node.data) == null ? void 0 : _b.label),
          liveValue: runtime.liveValues[node.id] ?? "",
          isActive: runtime.activeNodeIds.includes(node.id),
          isFocused: runtime.focusedNodeId === node.id,
          executionOrder: runtime.topo.indexOf(node.id) >= 0 ? runtime.topo.indexOf(node.id) + 1 : null
        }
      };
    }),
    [language, nodes, runtime.activeNodeIds, runtime.focusedNodeId, runtime.liveValues, runtime.topo]
  );
  const flowJson = reactExports.useMemo(
    () => JSON.stringify({ nodes, edges, inputValues, uiElements }, null, 2),
    [nodes, edges, inputValues, uiElements]
  );
  const selectedNode = reactExports.useMemo(() => nodes.find((node) => node.id === selectedNodeId) || null, [nodes, selectedNodeId]);
  const selectedUiElement = reactExports.useMemo(
    () => uiElements.find((item) => item.id === selectedUiElementId) || null,
    [uiElements, selectedUiElementId]
  );
  const currentTheme = THEME_OPTIONS[themeKey] || THEME_OPTIONS.mint;
  const uiText = UI_TEXT[language] || UI_TEXT.ko;
  const sidebarGroups = reactExports.useMemo(() => {
    const list = LIBRARY_TABS[libraryTab];
    return list.reduce((acc, item) => {
      acc[item.group] = [...acc[item.group] || [], item];
      return acc;
    }, {});
  }, [libraryTab]);
  const searchCandidates = reactExports.useMemo(
    () => Object.values(LIBRARY_TABS).flat().filter((item) => getNodeLabel(item.type, language, item.label).toLowerCase().includes(searchTerm.toLowerCase())),
    [language, searchTerm]
  );
  const nodeTypes = reactExports.useMemo(() => ({ ixoNode: IXONode, ixoGroup: IXOGroupNode }), []);
  const snapshot = reactExports.useCallback(() => {
    setHistory((current) => [...current.slice(-79), cloneState(nodes, edges, inputValues, nodeCounterRef.current, uiElements)]);
    setFuture([]);
  }, [nodes, edges, inputValues, uiElements]);
  const applyState = reactExports.useCallback((state) => {
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
  reactExports.useEffect(() => {
    var _a, _b;
    (_b = (_a = window.ixo) == null ? void 0 : _a.setDirtyState) == null ? void 0 : _b.call(_a, {
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
  reactExports.useEffect(() => {
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
      var _a;
      try {
        (_a = window.localStorage) == null ? void 0 : _a.setItem(LOCAL_AUTOSAVE_KEY, JSON.stringify(payload));
      } catch (error) {
        appendLog(makeLog("error", "Local Auto-Save", "자동 저장에 실패했습니다.", String(error.message || error)));
      }
    }, 250);
    return () => window.clearTimeout(autoSaveTimerRef.current);
  }, [appendLog, edges, inputValues, language, nodeCounter, nodes, previewDevice, themeKey, uiElements, viewMode]);
  reactExports.useEffect(() => {
    var _a;
    try {
      const raw = (_a = window.localStorage) == null ? void 0 : _a.getItem(LOCAL_AUTOSAVE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!(parsed == null ? void 0 : parsed.nodes) || !(parsed == null ? void 0 : parsed.edges)) return;
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
  reactExports.useEffect(() => {
    if (!toastMessage) return void 0;
    const timer2 = window.setTimeout(() => setToastMessage(""), 1800);
    return () => window.clearTimeout(timer2);
  }, [toastMessage]);
  reactExports.useEffect(() => {
    if (lastExecutionKeyRef.current === runtimeExecutionKey) return;
    lastExecutionKeyRef.current = runtimeExecutionKey;
    runtime.events.forEach((entry) => appendLog(entry));
  }, [appendLog, runtime.events, runtimeExecutionKey]);
  reactExports.useEffect(() => {
    if (paused) return;
    const signatures = [];
    const activeTargets = new Set(
      runtime.activeEdgeIds.map((id2) => {
        var _a;
        return (_a = edges.find((edge) => edge.id === id2)) == null ? void 0 : _a.target;
      }).filter(Boolean)
    );
    const runActions = async () => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      for (const node of nodes) {
        if (!activeTargets.has(node.id)) continue;
        if (((_a = node.data) == null ? void 0 : _a.nodeType) === "http" && ((_b = node.data) == null ? void 0 : _b.value)) {
          const url = applyTemplate(node.data.value, runtime.context);
          signatures.push(`http:${node.id}:${url}`);
          if (lastActionSignatureRef.current.includes(`|http:${node.id}:${url}|`)) continue;
          try {
            await fetch(url);
            setStatus(`HTTP request OK: ${url}`);
            appendLog(makeLog("info", ((_c = node.data) == null ? void 0 : _c.label) || "HTTP Request", `요청 성공: ${url}`));
          } catch (error) {
            setStatus(`HTTP request failed: ${url}`);
            appendLog(makeLog("error", ((_d = node.data) == null ? void 0 : _d.label) || "HTTP Request", `요청 실패: ${url}`, String(error.message || error)));
          }
        }
        if (((_e = node.data) == null ? void 0 : _e.nodeType) === "browser" && ((_f = node.data) == null ? void 0 : _f.value)) {
          const url = applyTemplate(node.data.value, runtime.context);
          signatures.push(`browser:${node.id}:${url}`);
          if (lastActionSignatureRef.current.includes(`|browser:${node.id}:${url}|`)) continue;
          if ((_g = window.ixo) == null ? void 0 : _g.openExternal) {
            await window.ixo.openExternal(url);
            setStatus(`Opened browser: ${url}`);
            appendLog(makeLog("info", ((_h = node.data) == null ? void 0 : _h.label) || "Browser Open", `외부 브라우저 열기: ${url}`));
          }
        }
      }
      lastActionSignatureRef.current = signatures.length ? `|${signatures.join("|")}|` : "";
    };
    runActions();
  }, [appendLog, edges, nodes, paused, runtime.activeEdgeIds, runtime.context]);
  reactExports.useEffect(() => {
    if (!dragState) return void 0;
    const handlePointerMove = (event) => {
      const canvas = builderCanvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const nextX = Math.max(0, Math.min(event.clientX - rect.left - dragState.offsetX, rect.width - 32));
      const nextY = Math.max(0, Math.min(event.clientY - rect.top - dragState.offsetY, rect.height - 32));
      setUiElements(
        (current) => current.map((item) => item.id === dragState.id ? { ...item, x: Math.round(nextX), y: Math.round(nextY) } : item)
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
  const undo = reactExports.useCallback(() => {
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
  const redo = reactExports.useCallback(() => {
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
  const updateInputValue = reactExports.useCallback((nodeId, value) => {
    setInputValues((current) => ({ ...current, [nodeId]: value }));
    setIsDirty(true);
  }, []);
  const toggleSection = (name) => setCollapsed((current) => ({ ...current, [name]: !current[name] }));
  const createNodeId = reactExports.useCallback(() => {
    const nextId = `node-${nodeCounterRef.current}`;
    nodeCounterRef.current += 1;
    setNodeCounter(nodeCounterRef.current);
    return nextId;
  }, []);
  const makeNode = reactExports.useCallback((nodeDef, position) => {
    const nodeType = nodeDef.type || nodeDef.key;
    const id2 = createNodeId();
    return {
      id: id2,
      type: nodeType === "group" ? "ixoGroup" : "ixoNode",
      position,
      data: {
        label: nodeDef.label,
        kind: nodeDef.group,
        category: nodeDef.group.toUpperCase(),
        value: getDefaultNodeValue(nodeType, nodeDef.label),
        nodeType,
        refKey: `${nodeType.replace(/[^a-z0-9]/gi, "").toLowerCase()}${id2.replace("node-", "")}`,
        groupLabel: ""
      }
    };
  }, [createNodeId]);
  const createGroupBox = reactExports.useCallback(() => {
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
  const deleteSelection = reactExports.useCallback(() => {
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
  const duplicateSelection = reactExports.useCallback(() => {
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
  const saveProject = reactExports.useCallback(async () => {
    var _a;
    if (!((_a = window.ixo) == null ? void 0 : _a.saveProject)) {
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
  const loadProject = reactExports.useCallback(async () => {
    var _a;
    if (!((_a = window.ixo) == null ? void 0 : _a.loadProject)) {
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
  const exportProject = reactExports.useCallback(async () => {
    var _a;
    if (!((_a = window.ixo) == null ? void 0 : _a.exportProject)) {
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
  reactExports.useEffect(() => {
    const onKeyDown = (event) => {
      var _a;
      const tag = (((_a = event.target) == null ? void 0 : _a.tagName) || "").toLowerCase();
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
  const edgeView = reactExports.useMemo(
    () => edges.map((edge) => {
      const active = runtime.activeEdgeIds.includes(edge.id);
      return {
        ...edge,
        animated: active,
        className: active ? "trace-edge-active" : "trace-edge-idle",
        style: active ? { ...edge.style, stroke: currentTheme.accent, strokeWidth: 2.2, filter: `drop-shadow(0 0 10px ${currentTheme.accent})` } : { ...edge.style, opacity: 0.64 }
      };
    }),
    [currentTheme.accent, edges, runtime.activeEdgeIds]
  );
  const onConnect = reactExports.useCallback((connection) => {
    snapshot();
    setEdges(
      (current) => addEdge(
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
  const handleNodesChange = reactExports.useCallback((changes) => {
    onNodesChange(changes);
    if (changes.length) setIsDirty(true);
  }, [onNodesChange]);
  const handleEdgesChange = reactExports.useCallback((changes) => {
    onEdgesChange(changes);
    if (changes.length) setIsDirty(true);
  }, [onEdgesChange]);
  const syncSelectedNodes = reactExports.useCallback((ids, primaryId = null) => {
    setSelectedNodeIds(ids);
    setSelectedNodeId(primaryId ?? ids[ids.length - 1] ?? null);
    setSelectedUiElementId(null);
    setSelectedEdgeIds([]);
    setNodes((current) => applyNodeSelectionState(current, ids));
    setEdges((current) => current.map((edge) => ({ ...edge, selected: false })));
  }, [setEdges, setNodes]);
  const syncSelectedEdges = reactExports.useCallback((ids) => {
    const selectedSet = new Set(ids);
    setSelectedEdgeIds(ids);
    setSelectedNodeIds([]);
    setSelectedNodeId(null);
    setSelectedUiElementId(null);
    setNodes((current) => applyNodeSelectionState(current, []));
    setEdges((current) => current.map((edge) => ({ ...edge, selected: selectedSet.has(edge.id) })));
  }, [setEdges, setNodes]);
  const magicAlign = reactExports.useCallback(() => {
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
    order.forEach((id2) => {
      const d = depth[id2] || 0;
      byDepth[d] = [...byDepth[d] || [], id2];
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
  const onDragOver = reactExports.useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);
  const onDrop = reactExports.useCallback((event) => {
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
  const onPaneContextMenu = reactExports.useCallback((event) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      flowPosition: screenToFlowPosition({ x: event.clientX, y: event.clientY })
    });
    setSearchTerm("");
  }, [screenToFlowPosition]);
  const addNodeFromSearch = (nodeDef, source = "context") => {
    const point = source === "center" ? screenToFlowPosition({ x: window.innerWidth * 0.53, y: window.innerHeight * 0.45 }) : contextMenu == null ? void 0 : contextMenu.flowPosition;
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
      setNodes(
        (current) => current.map((node) => node.id === selectedNode.id ? { ...node, data: { ...node.data, value: String(reader.result || ""), soundName: file.name } } : node)
      );
      setStatus(`Sound loaded: ${file.name}`);
      setIsDirty(true);
    };
    reader.readAsDataURL(file);
  };
  const updateNodeField = (field, value) => {
    if (!selectedNode) return;
    snapshot();
    setNodes(
      (current) => current.map((node) => node.id === selectedNode.id ? { ...node, data: { ...node.data, [field]: value } } : node)
    );
    setIsDirty(true);
  };
  const updateUiField = (field, value) => {
    if (!selectedUiElement) return;
    snapshot();
    setUiElements(
      (current) => current.map((item) => item.id === selectedUiElement.id ? { ...item, [field]: field === "x" || field === "y" || field === "width" || field === "height" || field === "fontSize" || field === "radius" ? Number(value) : value } : item)
    );
    setIsDirty(true);
  };
  const createUiElementFromPalette = reactExports.useCallback((kind, point = null) => {
    var _a;
    snapshot();
    const selectedBindingKey = ((_a = selectedNode == null ? void 0 : selectedNode.data) == null ? void 0 : _a.refKey) || "";
    const next = createUiElement(kind, selectedBindingKey, currentTheme.accent);
    const finalElement = point ? { ...next, x: point.x, y: point.y } : next;
    setUiElements((current) => [...current, finalElement]);
    setSelectedUiElementId(finalElement.id);
    setViewMode("builder");
    setStatus(`UI element added: ${kind}`);
    setIsDirty(true);
  }, [currentTheme.accent, selectedNode, snapshot]);
  const handleBuilderDragOver = reactExports.useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);
  const handleBuilderDrop = reactExports.useCallback((event) => {
    event.preventDefault();
    const kind = event.dataTransfer.getData("application/ixo-ui");
    if (!kind || !builderCanvasRef.current) return;
    const rect = builderCanvasRef.current.getBoundingClientRect();
    createUiElementFromPalette(kind, {
      x: Math.max(0, Math.round(event.clientX - rect.left - 40)),
      y: Math.max(0, Math.round(event.clientY - rect.top - 20))
    });
  }, [createUiElementFromPalette]);
  const handleBuilderPointerDown = reactExports.useCallback((event, id2) => {
    if (typeof event.button === "number" && event.button !== 0) return;
    if (viewMode !== "builder" || !builderCanvasRef.current) return;
    const rect = builderCanvasRef.current.getBoundingClientRect();
    const target = uiElements.find((item) => item.id === id2);
    if (!target) return;
    setDragState({
      id: id2,
      offsetX: event.clientX - rect.left - target.x,
      offsetY: event.clientY - rect.top - target.y
    });
  }, [uiElements, viewMode]);
  const handleBuilderPointerUp = reactExports.useCallback(() => {
    setDragState(null);
  }, []);
  const openUiAction = reactExports.useCallback(async (url) => {
    var _a;
    if (!url) return;
    if ((_a = window.ixo) == null ? void 0 : _a.openExternal) {
      await window.ixo.openExternal(url);
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);
  const handleUiElementSelect = reactExports.useCallback((id2) => {
    setSelectedUiElementId(id2);
    setSelectedNodeId(null);
    setSelectedNodeIds([]);
    setSelectedEdgeIds([]);
    setNodes((current) => applyNodeSelectionState(current, []));
    setEdges((current) => current.map((edge) => ({ ...edge, selected: false })));
  }, [setEdges, setNodes]);
  const applySettings = reactExports.useCallback(() => {
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
  const cancelSettings = reactExports.useCallback(() => {
    setDraftLanguage(language);
    setDraftThemeKey(themeKey);
    setDraftPreviewDevice(previewDevice);
    setDraftTemplateKey("");
    setShowSettings(false);
  }, [language, previewDevice, themeKey]);
  const clearLocalAutosave = reactExports.useCallback(() => {
    var _a;
    (_a = window.localStorage) == null ? void 0 : _a.removeItem(LOCAL_AUTOSAVE_KEY);
    appendLog(makeLog("info", "Local Auto-Save", "로컬 자동 저장 데이터를 삭제했습니다."));
    setStatus("Local auto-save cleared.");
  }, [appendLog]);
  const handleNodeDropToSidebar = reactExports.useCallback((event, node) => {
    const sidebarElement = sidebarRef.current;
    if (!(event == null ? void 0 : event.clientX) || !(event == null ? void 0 : event.clientY) || !sidebarElement) return;
    const rect = sidebarElement.getBoundingClientRect();
    const insideSidebar = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
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
  const CanvasPane = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "editor-area", onDrop, onDragOver, style: { "--trace-duration": `${TRACE_SPEED[speed]}s` }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      ReactFlow,
      {
        nodes: nodesWithTrace,
        edges: edgeView,
        nodeTypes,
        multiSelectionKeyCode: ["Control", "Meta"],
        onlyRenderVisibleElements: true,
        onNodesChange: handleNodesChange,
        onEdgesChange: handleEdgesChange,
        onConnect,
        onPaneContextMenu,
        onSelectionChange: ({ nodes: selectedNodes = [], edges: selectedEdges = [] }) => {
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
          setSelectedUiElementId(null);
        },
        onNodeDragStart: () => snapshot(),
        onNodeDragStop: (event, node) => {
          handleNodeDropToSidebar(event, node);
        },
        onNodeClick: (event, node) => {
          if (event.ctrlKey || event.metaKey) {
            const exists = selectedNodeIds.includes(node.id);
            const nextIds = exists ? selectedNodeIds.filter((id2) => id2 !== node.id) : [...selectedNodeIds, node.id];
            syncSelectedNodes(nextIds, node.id);
          } else {
            syncSelectedNodes([node.id], node.id);
          }
          setInspectorMode("basic");
        },
        onNodeDoubleClick: (_, node) => {
          syncSelectedNodes([node.id], node.id);
          setInspectorMode("inspector");
        },
        onEdgeClick: (event, edge) => {
          event.preventDefault();
          if (event.ctrlKey || event.metaKey) {
            const exists = selectedEdgeIds.includes(edge.id);
            const nextIds = exists ? selectedEdgeIds.filter((id2) => id2 !== edge.id) : [...selectedEdgeIds, edge.id];
            syncSelectedEdges(nextIds);
          } else {
            syncSelectedEdges([edge.id]);
          }
        },
        onPaneClick: () => {
          setSelectedNodeId(null);
          setSelectedNodeIds([]);
          setSelectedEdgeIds([]);
          setSelectedUiElementId(null);
          setNodes((current) => applyNodeSelectionState(current, []));
          setEdges((current) => current.map((edge) => ({ ...edge, selected: false })));
          setContextMenu(null);
        },
        fitView: true,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MiniMap$1, { nodeColor: (node) => {
            var _a;
            return NODE_COLOR[(_a = node.data) == null ? void 0 : _a.kind] || ACCENT;
          }, pannable: true, zoomable: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Controls$1, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Background$1, { color: "#1d2a24", gap: 24, size: 1.1, variant: "dots" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { position: "top-right", className: "hint-panel", children: "Space: Quick Search | G: Group | Ctrl+S/Z/Y/D | Delete" })
        ]
      }
    ),
    contextMenu ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "context-menu", style: { left: contextMenu.x, top: contextMenu.y }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          value: searchTerm,
          onChange: (event) => setSearchTerm(event.target.value),
          placeholder: "Search nodes...",
          autoFocus: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "context-list", children: searchCandidates.slice(0, 10).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => addNodeFromSearch(item), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { background: NODE_COLOR[item.group] } }),
        item.label
      ] }, item.key)) })
    ] }) : null,
    quickSearchOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "quick-search-overlay", onClick: () => setQuickSearchOpen(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "quick-search-card", onClick: (event) => event.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          value: searchTerm,
          onChange: (event) => setSearchTerm(event.target.value),
          placeholder: "Type node name and Enter...",
          autoFocus: true,
          onKeyDown: (event) => {
            if (event.key === "Enter" && searchCandidates[0]) addNodeFromSearch(searchCandidates[0], "center");
            if (event.key === "Escape") setQuickSearchOpen(false);
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "quick-search-list", children: searchCandidates.slice(0, 8).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => addNodeFromSearch(item, "center"), children: getNodeLabel(item.type, language, item.label) }, item.key)) })
    ] }) }) : null
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `app-shell lang-${language}`,
      style: {
        "--accent": currentTheme.accent,
        "--accent-soft": currentTheme.accentSoft,
        "--accent-strong": currentTheme.accentStrong,
        "--glow": currentTheme.glow
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "workspace", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "sidebar", ref: sidebarRef, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "command-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brand", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "brand-mark", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: LOGO_FALLBACKS[logoIndex],
                    alt: "IXO Logo",
                    onError: () => setLogoIndex((index) => index + 1 < LOGO_FALLBACKS.length ? index + 1 : index)
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brand-copy", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "IXO Engine" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Visual logic + UI builder workspace" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "menu-row", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "file-menu", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "menu-btn", onClick: () => setShowFileMenu((current) => !current), children: uiText.file }),
                  showFileMenu ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "file-dropdown", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: saveProject, children: "Save" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: loadProject, children: "Load" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: exportProject, children: "Export" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: magicAlign, children: "Magic Align" })
                  ] }) : null
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "exec-controls", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "exec-row exec-row-top", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "speed-control", children: [
                      "Speed ",
                      speed,
                      "x"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        id: "speed-control",
                        type: "range",
                        min: "0.5",
                        max: "2",
                        step: "0.5",
                        value: speed,
                        onChange: (event) => setSpeed(event.target.value)
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "exec-row exec-row-bottom", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "menu-btn", onClick: () => setPaused((current) => !current), children: paused ? "Resume" : "Pause" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "trace-inline", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: debugOverlay, onChange: (event) => setDebugOverlay(event.target.checked) }),
                      "Trace"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        className: "menu-btn docs-btn",
                        onClick: () => {
                          var _a, _b;
                          return (_b = (_a = window.ixo) == null ? void 0 : _a.openExternal) == null ? void 0 : _b.call(_a, "https://minyangtech.n-e.kr/docs/ixo/index");
                        },
                        children: uiText.docs
                      }
                    )
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sidebar-header", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "panel-title", children: "Node Library" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "ghost-btn", onClick: createGroupBox, children: "Group Selected" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "drop-hint-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: uiText.deleteZone }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: uiText.deleteZoneCopy })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sidebar-tabs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: libraryTab === "core" ? "active" : "", onClick: () => setLibraryTab("core"), children: "Core" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: libraryTab === "pro" ? "active" : "", onClick: () => setLibraryTab("pro"), children: "Pro" })
            ] }),
            Object.entries(sidebarGroups).map(([group, items]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "library-section", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "section-toggle", onClick: () => toggleSection(group), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "section-label", children: [
                  GROUP_ICON[group] || "•",
                  " ",
                  group.toUpperCase()
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: collapsed[group] ? "+" : "-" })
              ] }),
              !collapsed[group] ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "node-list", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  draggable: true,
                  onDragStart: (event) => onDragStartNode(event, item),
                  className: "node-chip",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "node-chip-dot", style: { background: NODE_COLOR[item.group] } }),
                    getNodeLabel(item.type, language, item.label)
                  ]
                },
                item.key
              )) }) : null
            ] }, group))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "canvas-zone", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelGroup, { direction: "vertical", className: "vertical-panels", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Panel$1, { defaultSize: 74, minSize: 45, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PanelGroup, { direction: "horizontal", className: "split-group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Panel$1, { defaultSize: 61, minSize: 34, children: CanvasPane }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(PanelResizeHandle, { className: "resize-handle" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Panel$1, { defaultSize: 39, minSize: 25, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                RuntimePanel,
                {
                  viewMode,
                  setViewMode,
                  runtime,
                  nodes: nodesWithTrace,
                  inputValues,
                  onInputChange: updateInputValue,
                  uiElements,
                  selectedUiElementId,
                  setSelectedUiElementId,
                  onBuilderDrop: handleBuilderDrop,
                  onBuilderDragOver: handleBuilderDragOver,
                  onBuilderPointerDown: handleBuilderPointerDown,
                  onBuilderPointerUp: handleBuilderPointerUp,
                  builderCanvasRef,
                  debugOverlay,
                  flowJson,
                  onUiAction: openUiAction,
                  appendLog,
                  uiText,
                  previewDevice,
                  setPreviewDevice,
                  onUiElementSelect: handleUiElementSelect,
                  onOpenSettings: () => setShowSettings(true)
                }
              ) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PanelResizeHandle, { className: "resize-handle horizontal-handle" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Panel$1, { defaultSize: 26, minSize: 14, children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogConsole, { logs, onClear: () => setLogs([]) }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "properties", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "panel-title", children: viewMode === "builder" && selectedUiElement ? "UI Inspector" : inspectorMode === "inspector" ? "Pro Inspector" : "Properties" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "properties-stack", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "properties-card", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "summary-grid", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: nodes.length }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Nodes" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: edges.length }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Edges" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: uiElements.length }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "UI Layers" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: logs.length }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Logs" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inspector-note", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Viewer Mode" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: viewMode === "builder" ? "Canvas Builder가 활성화되어 있습니다." : viewMode === "viewer" ? "UI Viewer만 집중해서 보고 있습니다." : "Preview와 JSON 상태를 함께 보고 있습니다." })
                ] })
              ] }),
              selectedUiElement && viewMode === "builder" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "property-form", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  "Element Kind",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: selectedUiElement.kind, readOnly: true })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  "Text / Label",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: selectedUiElement.text || "", onChange: (event) => updateUiField("text", event.target.value) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  "Image Src",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: selectedUiElement.src || "", onChange: (event) => updateUiField("src", event.target.value) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  "Binding Ref Key",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: selectedUiElement.bindingKey || "", onChange: (event) => updateUiField("bindingKey", event.target.value), placeholder: "welcomeText, username..." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  "X",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: selectedUiElement.x, onChange: (event) => updateUiField("x", event.target.value) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  "Y",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: selectedUiElement.y, onChange: (event) => updateUiField("y", event.target.value) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  "Width",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: selectedUiElement.width, onChange: (event) => updateUiField("width", event.target.value) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  "Height",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: selectedUiElement.height, onChange: (event) => updateUiField("height", event.target.value) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  "Font Size",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: selectedUiElement.fontSize, onChange: (event) => updateUiField("fontSize", event.target.value) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  "Radius",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: selectedUiElement.radius, onChange: (event) => updateUiField("radius", event.target.value) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  "Text Color",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "color", value: selectedUiElement.color, onChange: (event) => updateUiField("color", event.target.value) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  "Background",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: selectedUiElement.background, onChange: (event) => updateUiField("background", event.target.value) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  "Action Type",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: selectedUiElement.actionType, onChange: (event) => updateUiField("actionType", event.target.value), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "none", children: "none" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "open-url", children: "open-url" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  "Action Value",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: selectedUiElement.actionValue || "", onChange: (event) => updateUiField("actionValue", event.target.value) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "danger-btn", onClick: deleteSelection, children: "Delete UI Element" })
              ] }) : selectedNode ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "property-form", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  "Node Label",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: selectedNode.data.label, onChange: (event) => updateNodeField("label", event.target.value) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  selectedNode.data.nodeType === "condition" ? "Condition Chain (AND/OR)" : selectedNode.data.nodeType === "math" ? "Math Expression" : selectedNode.data.nodeType === "script" ? "JavaScript Code" : "Value / Setting",
                  selectedNode.data.nodeType === "condition" || selectedNode.data.nodeType === "math" || selectedNode.data.nodeType === "script" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "textarea",
                    {
                      value: selectedNode.data.value || "",
                      onChange: (event) => updateNodeField("value", event.target.value),
                      placeholder: selectedNode.data.nodeType === "script" ? "return context.username;" : "{{score}} > 10 AND {{role}} == admin"
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "text",
                      value: selectedNode.data.value || "",
                      onChange: (event) => updateNodeField("value", event.target.value),
                      placeholder: "text, path, url, expression..."
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  "Ref Key",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: selectedNode.data.refKey || "", onChange: (event) => updateNodeField("refKey", event.target.value), placeholder: "username, totalPrice..." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  "Group Label",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: selectedNode.data.groupLabel || "", onChange: (event) => updateNodeField("groupLabel", event.target.value), placeholder: "Flow A, Login, UI..." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  "Node Type",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: selectedNode.data.nodeType || "", onChange: (event) => updateNodeField("nodeType", event.target.value) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  "Numeric Slider",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: "0", max: "100", value: Number(selectedNode.data.sliderValue || 0), onChange: (event) => updateNodeField("sliderValue", event.target.value) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  "Color Picker",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "color", value: selectedNode.data.colorValue || ACCENT, onChange: (event) => updateNodeField("colorValue", event.target.value) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  ["audio-player", "sound-play", "sound-play-wait", "bgm-play"].includes(selectedNode.data.nodeType) ? "Sound Upload" : "File Path",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "file",
                      accept: ["audio-player", "sound-play", "sound-play-wait", "bgm-play"].includes(selectedNode.data.nodeType) ? "audio/*" : void 0,
                      onChange: (event) => {
                        var _a;
                        const file = (_a = event.target.files) == null ? void 0 : _a[0];
                        if (["audio-player", "sound-play", "sound-play-wait", "bgm-play"].includes(selectedNode.data.nodeType)) {
                          updateNodeSoundFile(file);
                          return;
                        }
                        updateNodeField("value", (file == null ? void 0 : file.name) || "");
                      }
                    }
                  ),
                  selectedNode.data.soundName ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "field-hint", children: selectedNode.data.soundName }) : null
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "selected-id", children: [
                  "Selected ID: ",
                  selectedNode.id
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "ghost-btn", onClick: () => createUiElementFromPalette("text"), children: "Create Linked UI Text" })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "placeholder-card", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "placeholder", children: "노드를 더블 클릭하면 고급 Inspector가 열리고, Builder 모드에서는 UI 요소를 선택해 디자인 속성을 수정할 수 있습니다." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "placeholder-actions", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "ghost-btn", onClick: () => createUiElementFromPalette("text"), children: "Add UI Text" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "ghost-btn", onClick: () => createUiElementFromPalette("button"), children: "Add UI Button" })
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "status-bar", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "ENGINE STATUS: ",
            status,
            isDirty ? " | Unsaved changes" : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Nodes ",
            nodes.length,
            " | Edges ",
            edges.length,
            " | UI ",
            uiElements.length,
            " | Mode ",
            viewMode
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SettingsModal,
          {
            open: showSettings,
            uiText: UI_TEXT[draftLanguage] || uiText,
            draftLanguage,
            setDraftLanguage,
            draftThemeKey,
            setDraftThemeKey,
            draftPreviewDevice,
            setDraftPreviewDevice,
            draftTemplateKey,
            setDraftTemplateKey,
            onApply: applySettings,
            onCancel: cancelSettings,
            onClearAutosave: clearLocalAutosave
          }
        ),
        toastMessage ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-toast", children: toastMessage }) : null
      ]
    }
  );
}
function App() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ReactFlowProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(EngineEditor, {}) });
}
const splashImage = "" + new URL("IXO ENGINE START-Bb6lUDMp.png", import.meta.url).href;
function SplashGate() {
  const [phase, setPhase] = reactExports.useState("show");
  reactExports.useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase("fade"), 2e3);
    const doneTimer = setTimeout(() => setPhase("done"), 2700);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []);
  if (phase === "done") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(App, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `splash-screen ${phase === "fade" ? "fade-out" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: splashImage, alt: "IXO Engine Start" }) });
}
createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React$2.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SplashGate, {}) })
);
