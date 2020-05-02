// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../../../../node_modules/vue/dist/vue.esm.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*!
 * Vue.js v2.6.11
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */

/*  */
var emptyObject = Object.freeze({}); // These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.

function isUndef(v) {
  return v === undefined || v === null;
}

function isDef(v) {
  return v !== undefined && v !== null;
}

function isTrue(v) {
  return v === true;
}

function isFalse(v) {
  return v === false;
}
/**
 * Check if value is primitive.
 */


function isPrimitive(value) {
  return typeof value === 'string' || typeof value === 'number' || // $flow-disable-line
  typeof value === 'symbol' || typeof value === 'boolean';
}
/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */


function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}
/**
 * Get the raw type string of a value, e.g., [object Object].
 */


var _toString = Object.prototype.toString;

function toRawType(value) {
  return _toString.call(value).slice(8, -1);
}
/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */


function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function isRegExp(v) {
  return _toString.call(v) === '[object RegExp]';
}
/**
 * Check if val is a valid array index.
 */


function isValidArrayIndex(val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val);
}

function isPromise(val) {
  return isDef(val) && typeof val.then === 'function' && typeof val.catch === 'function';
}
/**
 * Convert a value to a string that is actually rendered.
 */


function toString(val) {
  return val == null ? '' : Array.isArray(val) || isPlainObject(val) && val.toString === _toString ? JSON.stringify(val, null, 2) : String(val);
}
/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */


function toNumber(val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n;
}
/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */


function makeMap(str, expectsLowerCase) {
  var map = Object.create(null);
  var list = str.split(',');

  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }

  return expectsLowerCase ? function (val) {
    return map[val.toLowerCase()];
  } : function (val) {
    return map[val];
  };
}
/**
 * Check if a tag is a built-in tag.
 */


var isBuiltInTag = makeMap('slot,component', true);
/**
 * Check if an attribute is a reserved attribute.
 */

var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');
/**
 * Remove an item from an array.
 */

function remove(arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);

    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}
/**
 * Check whether an object has the property.
 */


var hasOwnProperty = Object.prototype.hasOwnProperty;

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}
/**
 * Create a cached version of a pure function.
 */


function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}
/**
 * Camelize a hyphen-delimited string.
 */


var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {
    return c ? c.toUpperCase() : '';
  });
});
/**
 * Capitalize a string.
 */

var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
/**
 * Hyphenate a camelCase string.
 */

var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase();
});
/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */

function polyfillBind(fn, ctx) {
  function boundFn(a) {
    var l = arguments.length;
    return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
  }

  boundFn._length = fn.length;
  return boundFn;
}

function nativeBind(fn, ctx) {
  return fn.bind(ctx);
}

var bind = Function.prototype.bind ? nativeBind : polyfillBind;
/**
 * Convert an Array-like object to a real Array.
 */

function toArray(list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);

  while (i--) {
    ret[i] = list[i + start];
  }

  return ret;
}
/**
 * Mix properties into target object.
 */


function extend(to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }

  return to;
}
/**
 * Merge an Array of Objects into a single Object.
 */


function toObject(arr) {
  var res = {};

  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }

  return res;
}
/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */


function noop(a, b, c) {}
/**
 * Always return false.
 */


var no = function (a, b, c) {
  return false;
};
/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */


var identity = function (_) {
  return _;
};
/**
 * Generate a string containing static keys from compiler modules.
 */


function genStaticKeys(modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || []);
  }, []).join(',');
}
/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */


function looseEqual(a, b) {
  if (a === b) {
    return true;
  }

  var isObjectA = isObject(a);
  var isObjectB = isObject(b);

  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);

      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i]);
        });
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key]);
        });
      } else {
        /* istanbul ignore next */
        return false;
      }
    } catch (e) {
      /* istanbul ignore next */
      return false;
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b);
  } else {
    return false;
  }
}
/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */


function looseIndexOf(arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) {
      return i;
    }
  }

  return -1;
}
/**
 * Ensure a function is called only once.
 */


function once(fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  };
}

var SSR_ATTR = 'data-server-rendered';
var ASSET_TYPES = ['component', 'directive', 'filter'];
var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed', 'activated', 'deactivated', 'errorCaptured', 'serverPrefetch'];
/*  */

var config = {
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
};
/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */

var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
/**
 * Check if a string starts with $ or _
 */

function isReserved(str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F;
}
/**
 * Define a property.
 */


function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}
/**
 * Parse simple path.
 */


var bailRE = new RegExp("[^" + unicodeRegExp.source + ".$_\\d]");

function parsePath(path) {
  if (bailRE.test(path)) {
    return;
  }

  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) {
        return;
      }

      obj = obj[segments[i]];
    }

    return obj;
  };
}
/*  */
// can we use __proto__?


var hasProto = ('__proto__' in {}); // Browser environment sniffing

var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = UA && UA.indexOf('android') > 0 || weexPlatform === 'android';
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA) || weexPlatform === 'ios';
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/); // Firefox has a "watch" function on Object.prototype...

var nativeWatch = {}.watch;
var supportsPassive = false;

if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', {
      get: function get() {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    }); // https://github.com/facebook/flow/issues/285

    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
} // this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV


var _isServer;

var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }

  return _isServer;
}; // detect devtools


var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
/* istanbul ignore next */

function isNative(Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
}

var hasSymbol = typeof Symbol !== 'undefined' && isNative(Symbol) && typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */
// $flow-disable-line


if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/function () {
    function Set() {
      this.set = Object.create(null);
    }

    Set.prototype.has = function has(key) {
      return this.set[key] === true;
    };

    Set.prototype.add = function add(key) {
      this.set[key] = true;
    };

    Set.prototype.clear = function clear() {
      this.set = Object.create(null);
    };

    return Set;
  }();
}
/*  */


var warn = noop;
var tip = noop;
var generateComponentTrace = noop; // work around flow check

var formatComponentName = noop;

if ("development" !== 'production') {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;

  var classify = function (str) {
    return str.replace(classifyRE, function (c) {
      return c.toUpperCase();
    }).replace(/[-_]/g, '');
  };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && !config.silent) {
      console.error("[Vue warn]: " + msg + trace);
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && !config.silent) {
      console.warn("[Vue tip]: " + msg + (vm ? generateComponentTrace(vm) : ''));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>';
    }

    var options = typeof vm === 'function' && vm.cid != null ? vm.options : vm._isVue ? vm.$options || vm.constructor.options : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;

    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (name ? "<" + classify(name) + ">" : "<Anonymous>") + (file && includeFile !== false ? " at " + file : '');
  };

  var repeat = function (str, n) {
    var res = '';

    while (n) {
      if (n % 2 === 1) {
        res += str;
      }

      if (n > 1) {
        str += str;
      }

      n >>= 1;
    }

    return res;
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;

      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];

          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue;
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }

        tree.push(vm);
        vm = vm.$parent;
      }

      return '\n\nfound in\n\n' + tree.map(function (vm, i) {
        return "" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm) ? formatComponentName(vm[0]) + "... (" + vm[1] + " recursive calls)" : formatComponentName(vm));
      }).join('\n');
    } else {
      return "\n\n(found in " + formatComponentName(vm) + ")";
    }
  };
}
/*  */


var uid = 0;
/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */

var Dep = function Dep() {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub(sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub(sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend() {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify() {
  // stabilize the subscriber list first
  var subs = this.subs.slice();

  if ("development" !== 'production' && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) {
      return a.id - b.id;
    });
  }

  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
}; // The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.


Dep.target = null;
var targetStack = [];

function pushTarget(target) {
  targetStack.push(target);
  Dep.target = target;
}

function popTarget() {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}
/*  */


var VNode = function VNode(tag, data, children, text, elm, context, componentOptions, asyncFactory) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = {
  child: {
    configurable: true
  }
}; // DEPRECATED: alias for componentInstance for backwards compat.

/* istanbul ignore next */

prototypeAccessors.child.get = function () {
  return this.componentInstance;
};

Object.defineProperties(VNode.prototype, prototypeAccessors);

var createEmptyVNode = function (text) {
  if (text === void 0) text = '';
  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node;
};

function createTextVNode(val) {
  return new VNode(undefined, undefined, undefined, String(val));
} // optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.


function cloneVNode(vnode) {
  var cloned = new VNode(vnode.tag, vnode.data, // #7975
  // clone children array to avoid mutating original in case of cloning
  // a child.
  vnode.children && vnode.children.slice(), vnode.text, vnode.elm, vnode.context, vnode.componentOptions, vnode.asyncFactory);
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned;
}
/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */


var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);
var methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
/**
 * Intercept mutating methods and emit events
 */

methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator() {
    var args = [],
        len = arguments.length;

    while (len--) args[len] = arguments[len];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;

    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;

      case 'splice':
        inserted = args.slice(2);
        break;
    }

    if (inserted) {
      ob.observeArray(inserted);
    } // notify change


    ob.dep.notify();
    return result;
  });
});
/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);
/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */

var shouldObserve = true;

function toggleObserving(value) {
  shouldObserve = value;
}
/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */


var Observer = function Observer(value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);

  if (Array.isArray(value)) {
    if (hasProto) {
      protoAugment(value, arrayMethods);
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }

    this.observeArray(value);
  } else {
    this.walk(value);
  }
};
/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */


Observer.prototype.walk = function walk(obj) {
  var keys = Object.keys(obj);

  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};
/**
 * Observe a list of Array items.
 */


Observer.prototype.observeArray = function observeArray(items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
}; // helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */


function protoAugment(target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}
/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */

/* istanbul ignore next */


function copyAugment(target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}
/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */


function observe(value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return;
  }

  var ob;

  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (shouldObserve && !isServerRendering() && (Array.isArray(value) || isPlainObject(value)) && Object.isExtensible(value) && !value._isVue) {
    ob = new Observer(value);
  }

  if (asRootData && ob) {
    ob.vmCount++;
  }

  return ob;
}
/**
 * Define a reactive property on an Object.
 */


function defineReactive$$1(obj, key, val, customSetter, shallow) {
  var dep = new Dep();
  var property = Object.getOwnPropertyDescriptor(obj, key);

  if (property && property.configurable === false) {
    return;
  } // cater for pre-defined getter/setters


  var getter = property && property.get;
  var setter = property && property.set;

  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      var value = getter ? getter.call(obj) : val;

      if (Dep.target) {
        dep.depend();

        if (childOb) {
          childOb.dep.depend();

          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }

      return value;
    },
    set: function reactiveSetter(newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */

      if (newVal === value || newVal !== newVal && value !== value) {
        return;
      }
      /* eslint-enable no-self-compare */


      if ("development" !== 'production' && customSetter) {
        customSetter();
      } // #7981: for accessor properties without setter


      if (getter && !setter) {
        return;
      }

      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }

      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}
/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */


function set(target, key, val) {
  if ("development" !== 'production' && (isUndef(target) || isPrimitive(target))) {
    warn("Cannot set reactive property on undefined, null, or primitive value: " + target);
  }

  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }

  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val;
  }

  var ob = target.__ob__;

  if (target._isVue || ob && ob.vmCount) {
    "development" !== 'production' && warn('Avoid adding reactive properties to a Vue instance or its root $data ' + 'at runtime - declare it upfront in the data option.');
    return val;
  }

  if (!ob) {
    target[key] = val;
    return val;
  }

  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val;
}
/**
 * Delete a property and trigger change if necessary.
 */


function del(target, key) {
  if ("development" !== 'production' && (isUndef(target) || isPrimitive(target))) {
    warn("Cannot delete reactive property on undefined, null, or primitive value: " + target);
  }

  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return;
  }

  var ob = target.__ob__;

  if (target._isVue || ob && ob.vmCount) {
    "development" !== 'production' && warn('Avoid deleting properties on a Vue instance or its root $data ' + '- just set it to null.');
    return;
  }

  if (!hasOwn(target, key)) {
    return;
  }

  delete target[key];

  if (!ob) {
    return;
  }

  ob.dep.notify();
}
/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */


function dependArray(value) {
  for (var e = void 0, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();

    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}
/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */


var strats = config.optionMergeStrategies;
/**
 * Options with restrictions
 */

if ("development" !== 'production') {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn("option \"" + key + "\" can only be used during instance " + 'creation with the `new` keyword.');
    }

    return defaultStrat(parent, child);
  };
}
/**
 * Helper that recursively merges two data objects together.
 */


function mergeData(to, from) {
  if (!from) {
    return to;
  }

  var key, toVal, fromVal;
  var keys = hasSymbol ? Reflect.ownKeys(from) : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i]; // in case the object is already observed...

    if (key === '__ob__') {
      continue;
    }

    toVal = to[key];
    fromVal = from[key];

    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (toVal !== fromVal && isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }

  return to;
}
/**
 * Data
 */


function mergeDataOrFn(parentVal, childVal, vm) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal;
    }

    if (!parentVal) {
      return childVal;
    } // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.


    return function mergedDataFn() {
      return mergeData(typeof childVal === 'function' ? childVal.call(this, this) : childVal, typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal);
    };
  } else {
    return function mergedInstanceDataFn() {
      // instance merge
      var instanceData = typeof childVal === 'function' ? childVal.call(vm, vm) : childVal;
      var defaultData = typeof parentVal === 'function' ? parentVal.call(vm, vm) : parentVal;

      if (instanceData) {
        return mergeData(instanceData, defaultData);
      } else {
        return defaultData;
      }
    };
  }
}

strats.data = function (parentVal, childVal, vm) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      "development" !== 'production' && warn('The "data" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.', vm);
      return parentVal;
    }

    return mergeDataOrFn(parentVal, childVal);
  }

  return mergeDataOrFn(parentVal, childVal, vm);
};
/**
 * Hooks and props are merged as arrays.
 */


function mergeHook(parentVal, childVal) {
  var res = childVal ? parentVal ? parentVal.concat(childVal) : Array.isArray(childVal) ? childVal : [childVal] : parentVal;
  return res ? dedupeHooks(res) : res;
}

function dedupeHooks(hooks) {
  var res = [];

  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }

  return res;
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});
/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */

function mergeAssets(parentVal, childVal, vm, key) {
  var res = Object.create(parentVal || null);

  if (childVal) {
    "development" !== 'production' && assertObjectType(key, childVal, vm);
    return extend(res, childVal);
  } else {
    return res;
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});
/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */

strats.watch = function (parentVal, childVal, vm, key) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) {
    parentVal = undefined;
  }

  if (childVal === nativeWatch) {
    childVal = undefined;
  }
  /* istanbul ignore if */


  if (!childVal) {
    return Object.create(parentVal || null);
  }

  if ("development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }

  if (!parentVal) {
    return childVal;
  }

  var ret = {};
  extend(ret, parentVal);

  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];

    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }

    ret[key$1] = parent ? parent.concat(child) : Array.isArray(child) ? child : [child];
  }

  return ret;
};
/**
 * Other object hashes.
 */


strats.props = strats.methods = strats.inject = strats.computed = function (parentVal, childVal, vm, key) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }

  if (!parentVal) {
    return childVal;
  }

  var ret = Object.create(null);
  extend(ret, parentVal);

  if (childVal) {
    extend(ret, childVal);
  }

  return ret;
};

strats.provide = mergeDataOrFn;
/**
 * Default strategy.
 */

var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined ? parentVal : childVal;
};
/**
 * Validate component names
 */


function checkComponents(options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName(name) {
  if (!new RegExp("^[a-zA-Z][\\-\\.0-9_" + unicodeRegExp.source + "]*$").test(name)) {
    warn('Invalid component name: "' + name + '". Component names ' + 'should conform to valid custom element name in html5 specification.');
  }

  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + name);
  }
}
/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */


function normalizeProps(options, vm) {
  var props = options.props;

  if (!props) {
    return;
  }

  var res = {};
  var i, val, name;

  if (Array.isArray(props)) {
    i = props.length;

    while (i--) {
      val = props[i];

      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = {
          type: null
        };
      } else if ("development" !== 'production') {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val) ? val : {
        type: val
      };
    }
  } else if ("development" !== 'production') {
    warn("Invalid value for option \"props\": expected an Array or an Object, " + "but got " + toRawType(props) + ".", vm);
  }

  options.props = res;
}
/**
 * Normalize all injections into Object-based format
 */


function normalizeInject(options, vm) {
  var inject = options.inject;

  if (!inject) {
    return;
  }

  var normalized = options.inject = {};

  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = {
        from: inject[i]
      };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val) ? extend({
        from: key
      }, val) : {
        from: val
      };
    }
  } else if ("development" !== 'production') {
    warn("Invalid value for option \"inject\": expected an Array or an Object, " + "but got " + toRawType(inject) + ".", vm);
  }
}
/**
 * Normalize raw function directives into object format.
 */


function normalizeDirectives(options) {
  var dirs = options.directives;

  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];

      if (typeof def$$1 === 'function') {
        dirs[key] = {
          bind: def$$1,
          update: def$$1
        };
      }
    }
  }
}

function assertObjectType(name, value, vm) {
  if (!isPlainObject(value)) {
    warn("Invalid value for option \"" + name + "\": expected an Object, " + "but got " + toRawType(value) + ".", vm);
  }
}
/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */


function mergeOptions(parent, child, vm) {
  if ("development" !== 'production') {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child); // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.

  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }

    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;

  for (key in parent) {
    mergeField(key);
  }

  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }

  function mergeField(key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }

  return options;
}
/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */


function resolveAsset(options, type, id, warnMissing) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return;
  }

  var assets = options[type]; // check local registration variations first

  if (hasOwn(assets, id)) {
    return assets[id];
  }

  var camelizedId = camelize(id);

  if (hasOwn(assets, camelizedId)) {
    return assets[camelizedId];
  }

  var PascalCaseId = capitalize(camelizedId);

  if (hasOwn(assets, PascalCaseId)) {
    return assets[PascalCaseId];
  } // fallback to prototype chain


  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];

  if ("development" !== 'production' && warnMissing && !res) {
    warn('Failed to resolve ' + type.slice(0, -1) + ': ' + id, options);
  }

  return res;
}
/*  */


function validateProp(key, propOptions, propsData, vm) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key]; // boolean casting

  var booleanIndex = getTypeIndex(Boolean, prop.type);

  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);

      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  } // check default value


  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key); // since the default value is a fresh copy,
    // make sure to observe it.

    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }

  if ("development" !== 'production' && // skip validation for weex recycle-list child component props
  !false) {
    assertProp(prop, key, value, vm, absent);
  }

  return value;
}
/**
 * Get the default value of a prop.
 */


function getPropDefaultValue(vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined;
  }

  var def = prop.default; // warn against non-factory defaults for Object & Array

  if ("development" !== 'production' && isObject(def)) {
    warn('Invalid default value for prop "' + key + '": ' + 'Props with type Object/Array must use a factory function ' + 'to return the default value.', vm);
  } // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger


  if (vm && vm.$options.propsData && vm.$options.propsData[key] === undefined && vm._props[key] !== undefined) {
    return vm._props[key];
  } // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context


  return typeof def === 'function' && getType(prop.type) !== 'Function' ? def.call(vm) : def;
}
/**
 * Assert whether a prop is valid.
 */


function assertProp(prop, name, value, vm, absent) {
  if (prop.required && absent) {
    warn('Missing required prop: "' + name + '"', vm);
    return;
  }

  if (value == null && !prop.required) {
    return;
  }

  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];

  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }

    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(getInvalidTypeMessage(name, value, expectedTypes), vm);
    return;
  }

  var validator = prop.validator;

  if (validator) {
    if (!validator(value)) {
      warn('Invalid prop: custom validator check failed for prop "' + name + '".', vm);
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType(value, type) {
  var valid;
  var expectedType = getType(type);

  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase(); // for primitive wrapper objects

    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }

  return {
    valid: valid,
    expectedType: expectedType
  };
}
/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */


function getType(fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : '';
}

function isSameType(a, b) {
  return getType(a) === getType(b);
}

function getTypeIndex(type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }

  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i;
    }
  }

  return -1;
}

function getInvalidTypeMessage(name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." + " Expected " + expectedTypes.map(capitalize).join(', ');
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType); // check if we need to specify expected value

  if (expectedTypes.length === 1 && isExplicable(expectedType) && !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }

  message += ", got " + receivedType + " "; // check if we need to specify received value

  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }

  return message;
}

function styleValue(value, type) {
  if (type === 'String') {
    return "\"" + value + "\"";
  } else if (type === 'Number') {
    return "" + Number(value);
  } else {
    return "" + value;
  }
}

function isExplicable(value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) {
    return value.toLowerCase() === elem;
  });
}

function isBoolean() {
  var args = [],
      len = arguments.length;

  while (len--) args[len] = arguments[len];

  return args.some(function (elem) {
    return elem.toLowerCase() === 'boolean';
  });
}
/*  */


function handleError(err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();

  try {
    if (vm) {
      var cur = vm;

      while (cur = cur.$parent) {
        var hooks = cur.$options.errorCaptured;

        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;

              if (capture) {
                return;
              }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }

    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling(handler, context, args, vm, info) {
  var res;

  try {
    res = args ? handler.apply(context, args) : handler.call(context);

    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) {
        return handleError(e, vm, info + " (Promise/async)");
      }); // issue #9511
      // avoid catch triggering multiple times when nested calls

      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }

  return res;
}

function globalHandleError(err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info);
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }

  logError(err, vm, info);
}

function logError(err, vm, info) {
  if ("development" !== 'production') {
    warn("Error in " + info + ": \"" + err.toString() + "\"", vm);
  }
  /* istanbul ignore else */


  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err;
  }
}
/*  */


var isUsingMicroTask = false;
var callbacks = [];
var pending = false;

function flushCallbacks() {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;

  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
} // Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).


var timerFunc; // The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:

/* istanbul ignore next, $flow-disable-line */

if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();

  timerFunc = function () {
    p.then(flushCallbacks); // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.

    if (isIOS) {
      setTimeout(noop);
    }
  };

  isUsingMicroTask = true;
} else if (!isIE && typeof MutationObserver !== 'undefined' && (isNative(MutationObserver) || // PhantomJS and iOS 7.x
MutationObserver.toString() === '[object MutationObserverConstructor]')) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });

  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };

  isUsingMicroTask = true;
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick(cb, ctx) {
  var _resolve;

  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });

  if (!pending) {
    pending = true;
    timerFunc();
  } // $flow-disable-line


  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    });
  }
}
/*  */


var mark;
var measure;

if ("development" !== 'production') {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */

  if (perf && perf.mark && perf.measure && perf.clearMarks && perf.clearMeasures) {
    mark = function (tag) {
      return perf.mark(tag);
    };

    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag); // perf.clearMeasures(name)
    };
  }
}
/* not type checking this file because flow doesn't play well with Proxy */


var initProxy;

if ("development" !== 'production') {
  var allowedGlobals = makeMap('Infinity,undefined,NaN,isFinite,isNaN,' + 'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' + 'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' + 'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn("Property or method \"" + key + "\" is not defined on the instance but " + 'referenced during render. Make sure that this property is reactive, ' + 'either in the data option, or for class-based components, by ' + 'initializing the property. ' + 'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.', target);
  };

  var warnReservedPrefix = function (target, key) {
    warn("Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " + 'properties starting with "$" or "_" are not proxied in the Vue instance to ' + 'prevent conflicts with Vue internals. ' + 'See: https://vuejs.org/v2/api/#data', target);
  };

  var hasProxy = typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set(target, key, value) {
        if (isBuiltInModifier(key)) {
          warn("Avoid overwriting built-in modifier in config.keyCodes: ." + key);
          return false;
        } else {
          target[key] = value;
          return true;
        }
      }
    });
  }

  var hasHandler = {
    has: function has(target, key) {
      var has = (key in target);
      var isAllowed = allowedGlobals(key) || typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data);

      if (!has && !isAllowed) {
        if (key in target.$data) {
          warnReservedPrefix(target, key);
        } else {
          warnNonPresent(target, key);
        }
      }

      return has || !isAllowed;
    }
  };
  var getHandler = {
    get: function get(target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) {
          warnReservedPrefix(target, key);
        } else {
          warnNonPresent(target, key);
        }
      }

      return target[key];
    }
  };

  initProxy = function initProxy(vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped ? getHandler : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}
/*  */


var seenObjects = new _Set();
/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */

function traverse(val) {
  _traverse(val, seenObjects);

  seenObjects.clear();
}

function _traverse(val, seen) {
  var i, keys;
  var isA = Array.isArray(val);

  if (!isA && !isObject(val) || Object.isFrozen(val) || val instanceof VNode) {
    return;
  }

  if (val.__ob__) {
    var depId = val.__ob__.dep.id;

    if (seen.has(depId)) {
      return;
    }

    seen.add(depId);
  }

  if (isA) {
    i = val.length;

    while (i--) {
      _traverse(val[i], seen);
    }
  } else {
    keys = Object.keys(val);
    i = keys.length;

    while (i--) {
      _traverse(val[keys[i]], seen);
    }
  }
}
/*  */


var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first

  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  };
});

function createFnInvoker(fns, vm) {
  function invoker() {
    var arguments$1 = arguments;
    var fns = invoker.fns;

    if (Array.isArray(fns)) {
      var cloned = fns.slice();

      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler");
    }
  }

  invoker.fns = fns;
  return invoker;
}

function updateListeners(on, oldOn, add, remove$$1, createOnceHandler, vm) {
  var name, def$$1, cur, old, event;

  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);

    if (isUndef(cur)) {
      "development" !== 'production' && warn("Invalid handler for event \"" + event.name + "\": got " + String(cur), vm);
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }

      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }

      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }

  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}
/*  */


function mergeVNodeHook(def, hookKey, hook) {
  if (def instanceof VNode) {
    def = def.data.hook || (def.data.hook = {});
  }

  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook() {
    hook.apply(this, arguments); // important: remove merged hook to ensure it's called only once
    // and prevent memory leak

    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}
/*  */


function extractPropsFromVNodeData(data, Ctor, tag) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;

  if (isUndef(propOptions)) {
    return;
  }

  var res = {};
  var attrs = data.attrs;
  var props = data.props;

  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);

      if ("development" !== 'production') {
        var keyInLowerCase = key.toLowerCase();

        if (key !== keyInLowerCase && attrs && hasOwn(attrs, keyInLowerCase)) {
          tip("Prop \"" + keyInLowerCase + "\" is passed to component " + formatComponentName(tag || Ctor) + ", but the declared prop name is" + " \"" + key + "\". " + "Note that HTML attributes are case-insensitive and camelCased " + "props need to use their kebab-case equivalents when using in-DOM " + "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\".");
        }
      }

      checkProp(res, props, key, altKey, true) || checkProp(res, attrs, key, altKey, false);
    }
  }

  return res;
}

function checkProp(res, hash, key, altKey, preserve) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];

      if (!preserve) {
        delete hash[key];
      }

      return true;
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];

      if (!preserve) {
        delete hash[altKey];
      }

      return true;
    }
  }

  return false;
}
/*  */
// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:
// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.


function simpleNormalizeChildren(children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children);
    }
  }

  return children;
} // 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.


function normalizeChildren(children) {
  return isPrimitive(children) ? [createTextVNode(children)] : Array.isArray(children) ? normalizeArrayChildren(children) : undefined;
}

function isTextNode(node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment);
}

function normalizeArrayChildren(children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;

  for (i = 0; i < children.length; i++) {
    c = children[i];

    if (isUndef(c) || typeof c === 'boolean') {
      continue;
    }

    lastIndex = res.length - 1;
    last = res[lastIndex]; //  nested

    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, (nestedIndex || '') + "_" + i); // merge adjacent text nodes

        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + c[0].text);
          c.shift();
        }

        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) && isDef(c.tag) && isUndef(c.key) && isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }

        res.push(c);
      }
    }
  }

  return res;
}
/*  */


function initProvide(vm) {
  var provide = vm.$options.provide;

  if (provide) {
    vm._provided = typeof provide === 'function' ? provide.call(vm) : provide;
  }
}

function initInjections(vm) {
  var result = resolveInject(vm.$options.inject, vm);

  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if ("development" !== 'production') {
        defineReactive$$1(vm, key, result[key], function () {
          warn("Avoid mutating an injected value directly since the changes will be " + "overwritten whenever the provided component re-renders. " + "injection being mutated: \"" + key + "\"", vm);
        });
      } else {
        defineReactive$$1(vm, key, result[key]);
      }
    });
    toggleObserving(true);
  }
}

function resolveInject(inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol ? Reflect.ownKeys(inject) : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]; // #6574 in case the inject object is observed...

      if (key === '__ob__') {
        continue;
      }

      var provideKey = inject[key].from;
      var source = vm;

      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break;
        }

        source = source.$parent;
      }

      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function' ? provideDefault.call(vm) : provideDefault;
        } else if ("development" !== 'production') {
          warn("Injection \"" + key + "\" not found", vm);
        }
      }
    }

    return result;
  }
}
/*  */

/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */


function resolveSlots(children, context) {
  if (!children || !children.length) {
    return {};
  }

  var slots = {};

  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data; // remove slot attribute if the node is resolved as a Vue slot node

    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    } // named slots should only be respected if the vnode was rendered in the
    // same context.


    if ((child.context === context || child.fnContext === context) && data && data.slot != null) {
      var name = data.slot;
      var slot = slots[name] || (slots[name] = []);

      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      (slots.default || (slots.default = [])).push(child);
    }
  } // ignore slots that contains only whitespace


  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }

  return slots;
}

function isWhitespace(node) {
  return node.isComment && !node.asyncFactory || node.text === ' ';
}
/*  */


function normalizeScopedSlots(slots, normalSlots, prevSlots) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;

  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized;
  } else if (isStable && prevSlots && prevSlots !== emptyObject && key === prevSlots.$key && !hasNormalSlots && !prevSlots.$hasNormal) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots;
  } else {
    res = {};

    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  } // expose normal slots on scopedSlots


  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  } // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error


  if (slots && Object.isExtensible(slots)) {
    slots._normalized = res;
  }

  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res;
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res) ? [res] // single vnode
    : normalizeChildren(res);
    return res && (res.length === 0 || res.length === 1 && res[0].isComment // #9658
    ) ? undefined : res;
  }; // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.


  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }

  return normalized;
}

function proxyNormalSlot(slots, key) {
  return function () {
    return slots[key];
  };
}
/*  */

/**
 * Runtime helper for rendering v-for lists.
 */


function renderList(val, render) {
  var ret, i, l, keys, key;

  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);

    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);

    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();

      while (!result.done) {
        ret.push(render(result.value, ret.length));
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);

      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i);
      }
    }
  }

  if (!isDef(ret)) {
    ret = [];
  }

  ret._isVList = true;
  return ret;
}
/*  */

/**
 * Runtime helper for rendering <slot>
 */


function renderSlot(name, fallback, props, bindObject) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;

  if (scopedSlotFn) {
    // scoped slot
    props = props || {};

    if (bindObject) {
      if ("development" !== 'production' && !isObject(bindObject)) {
        warn('slot v-bind without argument expects an Object', this);
      }

      props = extend(extend({}, bindObject), props);
    }

    nodes = scopedSlotFn(props) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;

  if (target) {
    return this.$createElement('template', {
      slot: target
    }, nodes);
  } else {
    return nodes;
  }
}
/*  */

/**
 * Runtime helper for resolving filters
 */


function resolveFilter(id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity;
}
/*  */


function isKeyNotMatch(expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1;
  } else {
    return expect !== actual;
  }
}
/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */


function checkKeyCodes(eventKeyCode, key, builtInKeyCode, eventKeyName, builtInKeyName) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;

  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName);
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode);
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key;
  }
}
/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */


function bindObjectProps(data, tag, value, asProp, isSync) {
  if (value) {
    if (!isObject(value)) {
      "development" !== 'production' && warn('v-bind without argument expects an Object or Array value', this);
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }

      var hash;

      var loop = function (key) {
        if (key === 'class' || key === 'style' || isReservedAttribute(key)) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key) ? data.domProps || (data.domProps = {}) : data.attrs || (data.attrs = {});
        }

        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);

        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});

            on["update:" + key] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop(key);
    }
  }

  return data;
}
/*  */

/**
 * Runtime helper for rendering static trees.
 */


function renderStatic(index, isInFor) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index]; // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.

  if (tree && !isInFor) {
    return tree;
  } // otherwise, render a fresh tree.


  tree = cached[index] = this.$options.staticRenderFns[index].call(this._renderProxy, null, this // for render fns generated for functional component templates
  );
  markStatic(tree, "__static__" + index, false);
  return tree;
}
/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */


function markOnce(tree, index, key) {
  markStatic(tree, "__once__" + index + (key ? "_" + key : ""), true);
  return tree;
}

function markStatic(tree, key, isOnce) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], key + "_" + i, isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode(node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}
/*  */


function bindObjectListeners(data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      "development" !== 'production' && warn('v-on without argument expects an Object value', this);
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};

      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }

  return data;
}
/*  */


function resolveScopedSlots(fns, // see flow/vnode
res, // the following are added in 2.6
hasDynamicKeys, contentHashKey) {
  res = res || {
    $stable: !hasDynamicKeys
  };

  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];

    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }

      res[slot.key] = slot.fn;
    }
  }

  if (contentHashKey) {
    res.$key = contentHashKey;
  }

  return res;
}
/*  */


function bindDynamicKeys(baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];

    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ("development" !== 'production' && key !== '' && key !== null) {
      // null is a special value for explicitly removing a binding
      warn("Invalid value for dynamic directive argument (expected string or null): " + key, this);
    }
  }

  return baseObj;
} // helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.


function prependModifier(value, symbol) {
  return typeof value === 'string' ? symbol + value : value;
}
/*  */


function installRenderHelpers(target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}
/*  */


function FunctionalRenderContext(data, props, children, parent, Ctor) {
  var this$1 = this;
  var options = Ctor.options; // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check

  var contextVm;

  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent); // $flow-disable-line

    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent; // $flow-disable-line

    parent = parent._original;
  }

  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;
  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);

  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(data.scopedSlots, this$1.$slots = resolveSlots(children, parent));
    }

    return this$1.$slots;
  };

  Object.defineProperty(this, 'scopedSlots', {
    enumerable: true,
    get: function get() {
      return normalizeScopedSlots(data.scopedSlots, this.slots());
    }
  }); // support for compiled functional template

  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options; // pre-resolve slots for renderSlot()

    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);

      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }

      return vnode;
    };
  } else {
    this._c = function (a, b, c, d) {
      return createElement(contextVm, a, b, c, d, needNormalization);
    };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent(Ctor, propsData, data, contextVm, children) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;

  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) {
      mergeProps(props, data.attrs);
    }

    if (isDef(data.props)) {
      mergeProps(props, data.props);
    }
  }

  var renderContext = new FunctionalRenderContext(data, props, children, contextVm, Ctor);
  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext);
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);

    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }

    return res;
  }
}

function cloneAndMarkFunctionalResult(vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;

  if ("development" !== 'production') {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }

  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }

  return clone;
}

function mergeProps(to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}
/*  */

/*  */

/*  */

/*  */
// inline hooks to be invoked on component VNodes during patch


var componentVNodeHooks = {
  init: function init(vnode, hydrating) {
    if (vnode.componentInstance && !vnode.componentInstance._isDestroyed && vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow

      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(vnode, activeInstance);
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },
  prepatch: function prepatch(oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(child, options.propsData, // updated props
    options.listeners, // updated listeners
    vnode, // new parent vnode
    options.children // new children
    );
  },
  insert: function insert(vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;

    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }

    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true
        /* direct */
        );
      }
    }
  },
  destroy: function destroy(vnode) {
    var componentInstance = vnode.componentInstance;

    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true
        /* direct */
        );
      }
    }
  }
};
var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent(Ctor, data, context, children, tag) {
  if (isUndef(Ctor)) {
    return;
  }

  var baseCtor = context.$options._base; // plain options object: turn it into a constructor

  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  } // if at this stage it's not a constructor or an async component factory,
  // reject.


  if (typeof Ctor !== 'function') {
    if ("development" !== 'production') {
      warn("Invalid Component definition: " + String(Ctor), context);
    }

    return;
  } // async component


  var asyncFactory;

  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);

    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(asyncFactory, data, context, children, tag);
    }
  }

  data = data || {}; // resolve constructor options in case global mixins are applied after
  // component constructor creation

  resolveConstructorOptions(Ctor); // transform component v-model data into props & events

  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  } // extract props


  var propsData = extractPropsFromVNodeData(data, Ctor, tag); // functional component

  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children);
  } // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners


  var listeners = data.on; // replace with listeners with .native modifier
  // so it gets processed during parent component patch.

  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot
    // work around flow
    var slot = data.slot;
    data = {};

    if (slot) {
      data.slot = slot;
    }
  } // install component management hooks onto the placeholder node


  installComponentHooks(data); // return a placeholder vnode

  var name = Ctor.options.name || tag;
  var vnode = new VNode("vue-component-" + Ctor.cid + (name ? "-" + name : ''), data, undefined, undefined, undefined, context, {
    Ctor: Ctor,
    propsData: propsData,
    listeners: listeners,
    tag: tag,
    children: children
  }, asyncFactory);
  return vnode;
}

function createComponentInstanceForVnode(vnode, // we know it's MountedComponentVNode but flow doesn't
parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  }; // check inline-template render functions

  var inlineTemplate = vnode.data.inlineTemplate;

  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }

  return new vnode.componentOptions.Ctor(options);
}

function installComponentHooks(data) {
  var hooks = data.hook || (data.hook = {});

  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];

    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1(f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };

  merged._merged = true;
  return merged;
} // transform component v-model info (value and callback) into
// prop and event handler respectively.


function transformModel(options, data) {
  var prop = options.model && options.model.prop || 'value';
  var event = options.model && options.model.event || 'input';
  (data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;

  if (isDef(existing)) {
    if (Array.isArray(existing) ? existing.indexOf(callback) === -1 : existing !== callback) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}
/*  */


var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2; // wrapper function for providing a more flexible interface
// without getting yelled at by flow

function createElement(context, tag, data, children, normalizationType, alwaysNormalize) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }

  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }

  return _createElement(context, tag, data, children, normalizationType);
}

function _createElement(context, tag, data, children, normalizationType) {
  if (isDef(data) && isDef(data.__ob__)) {
    "development" !== 'production' && warn("Avoid using observed data object as vnode data: " + JSON.stringify(data) + "\n" + 'Always create fresh vnode data objects in each render!', context);
    return createEmptyVNode();
  } // object syntax in v-bind


  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }

  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode();
  } // warn against non-primitive key


  if ("development" !== 'production' && isDef(data) && isDef(data.key) && !isPrimitive(data.key)) {
    {
      warn('Avoid using non-primitive value as key, ' + 'use string/number value instead.', context);
    }
  } // support single function children as default scoped slot


  if (Array.isArray(children) && typeof children[0] === 'function') {
    data = data || {};
    data.scopedSlots = {
      default: children[0]
    };
    children.length = 0;
  }

  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }

  var vnode, ns;

  if (typeof tag === 'string') {
    var Ctor;
    ns = context.$vnode && context.$vnode.ns || config.getTagNamespace(tag);

    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if ("development" !== 'production' && isDef(data) && isDef(data.nativeOn)) {
        warn("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">.", context);
      }

      vnode = new VNode(config.parsePlatformTagName(tag), data, children, undefined, undefined, context);
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(tag, data, children, undefined, undefined, context);
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }

  if (Array.isArray(vnode)) {
    return vnode;
  } else if (isDef(vnode)) {
    if (isDef(ns)) {
      applyNS(vnode, ns);
    }

    if (isDef(data)) {
      registerDeepBindings(data);
    }

    return vnode;
  } else {
    return createEmptyVNode();
  }
}

function applyNS(vnode, ns, force) {
  vnode.ns = ns;

  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }

  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];

      if (isDef(child.tag) && (isUndef(child.ns) || isTrue(force) && child.tag !== 'svg')) {
        applyNS(child, ns, force);
      }
    }
  }
} // ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes


function registerDeepBindings(data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }

  if (isObject(data.class)) {
    traverse(data.class);
  }
}
/*  */


function initRender(vm) {
  vm._vnode = null; // the root of the child tree

  vm._staticTrees = null; // v-once cached trees

  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree

  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject; // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates

  vm._c = function (a, b, c, d) {
    return createElement(vm, a, b, c, d, false);
  }; // normalization is always applied for the public version, used in
  // user-written render functions.


  vm.$createElement = function (a, b, c, d) {
    return createElement(vm, a, b, c, d, true);
  }; // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated


  var parentData = parentVnode && parentVnode.data;
  /* istanbul ignore else */

  if ("development" !== 'production') {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, null, true);
  }
}

var currentRenderingInstance = null;

function renderMixin(Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this);
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(_parentVnode.data.scopedSlots, vm.$slots, vm.$scopedSlots);
    } // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.


    vm.$vnode = _parentVnode; // render self

    var vnode;

    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render"); // return error render result,
      // or previous vnode to prevent render error causing blank component

      /* istanbul ignore else */

      if ("development" !== 'production' && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    } // if the returned array contains only a single node, allow it


    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    } // return empty vnode in case the render function errored out


    if (!(vnode instanceof VNode)) {
      if ("development" !== 'production' && Array.isArray(vnode)) {
        warn('Multiple root nodes returned from render function. Render function ' + 'should return a single root node.', vm);
      }

      vnode = createEmptyVNode();
    } // set parent


    vnode.parent = _parentVnode;
    return vnode;
  };
}
/*  */


function ensureCtor(comp, base) {
  if (comp.__esModule || hasSymbol && comp[Symbol.toStringTag] === 'Module') {
    comp = comp.default;
  }

  return isObject(comp) ? base.extend(comp) : comp;
}

function createAsyncPlaceholder(factory, data, context, children, tag) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = {
    data: data,
    context: context,
    children: children,
    tag: tag
  };
  return node;
}

function resolveAsyncComponent(factory, baseCtor) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp;
  }

  if (isDef(factory.resolved)) {
    return factory.resolved;
  }

  var owner = currentRenderingInstance;

  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp;
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null;
    owner.$on('hook:destroyed', function () {
      return remove(owners, owner);
    });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        owners[i].$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;

        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }

        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor); // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)

      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });
    var reject = once(function (reason) {
      "development" !== 'production' && warn("Failed to resolve async component: " + String(factory) + (reason ? "\nReason: " + reason : ''));

      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });
    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);

          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;

              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;

            if (isUndef(factory.resolved)) {
              reject("development" !== 'production' ? "timeout (" + res.timeout + "ms)" : null);
            }
          }, res.timeout);
        }
      }
    }

    sync = false; // return in case resolved synchronously

    return factory.loading ? factory.loadingComp : factory.resolved;
  }
}
/*  */


function isAsyncPlaceholder(node) {
  return node.isComment && node.asyncFactory;
}
/*  */


function getFirstComponentChild(children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];

      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c;
      }
    }
  }
}
/*  */

/*  */


function initEvents(vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false; // init parent attached events

  var listeners = vm.$options._parentListeners;

  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add(event, fn) {
  target.$on(event, fn);
}

function remove$1(event, fn) {
  target.$off(event, fn);
}

function createOnceHandler(event, fn) {
  var _target = target;
  return function onceHandler() {
    var res = fn.apply(null, arguments);

    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  };
}

function updateComponentListeners(vm, listeners, oldListeners) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin(Vue) {
  var hookRE = /^hook:/;

  Vue.prototype.$on = function (event, fn) {
    var vm = this;

    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn); // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup

      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }

    return vm;
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;

    function on() {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }

    on.fn = fn;
    vm.$on(event, on);
    return vm;
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this; // all

    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm;
    } // array of events


    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }

      return vm;
    } // specific event


    var cbs = vm._events[event];

    if (!cbs) {
      return vm;
    }

    if (!fn) {
      vm._events[event] = null;
      return vm;
    } // specific handler


    var cb;
    var i = cbs.length;

    while (i--) {
      cb = cbs[i];

      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break;
      }
    }

    return vm;
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;

    if ("development" !== 'production') {
      var lowerCaseEvent = event.toLowerCase();

      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip("Event \"" + lowerCaseEvent + "\" is emitted in component " + formatComponentName(vm) + " but the handler is registered for \"" + event + "\". " + "Note that HTML attributes are case-insensitive and you cannot use " + "v-on to listen to camelCase events when using in-DOM templates. " + "You should probably use \"" + hyphenate(event) + "\" instead of \"" + event + "\".");
      }
    }

    var cbs = vm._events[event];

    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";

      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }

    return vm;
  };
}
/*  */


var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  };
}

function initLifecycle(vm) {
  var options = vm.$options; // locate first non-abstract parent

  var parent = options.parent;

  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }

    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;
  vm.$children = [];
  vm.$refs = {};
  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode; // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.

    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false
      /* removeOnly */
      );
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }

    restoreActiveInstance(); // update __vue__ reference

    if (prevEl) {
      prevEl.__vue__ = null;
    }

    if (vm.$el) {
      vm.$el.__vue__ = vm;
    } // if parent is an HOC, update its $el as well


    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    } // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.

  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;

    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;

    if (vm._isBeingDestroyed) {
      return;
    }

    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true; // remove self from parent

    var parent = vm.$parent;

    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    } // teardown watchers


    if (vm._watcher) {
      vm._watcher.teardown();
    }

    var i = vm._watchers.length;

    while (i--) {
      vm._watchers[i].teardown();
    } // remove reference from data ob
    // frozen object may not have observer.


    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    } // call the last hook...


    vm._isDestroyed = true; // invoke destroy hooks on current rendered tree

    vm.__patch__(vm._vnode, null); // fire destroyed hook


    callHook(vm, 'destroyed'); // turn off all instance listeners.

    vm.$off(); // remove __vue__ reference

    if (vm.$el) {
      vm.$el.__vue__ = null;
    } // release circular reference (#6759)


    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function mountComponent(vm, el, hydrating) {
  vm.$el = el;

  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;

    if ("development" !== 'production') {
      /* istanbul ignore if */
      if (vm.$options.template && vm.$options.template.charAt(0) !== '#' || vm.$options.el || el) {
        warn('You are using the runtime-only build of Vue where the template ' + 'compiler is not available. Either pre-compile the templates into ' + 'render functions, or use the compiler-included build.', vm);
      } else {
        warn('Failed to mount component: template or render function not defined.', vm);
      }
    }
  }

  callHook(vm, 'beforeMount');
  var updateComponent;
  /* istanbul ignore if */

  if ("development" !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;
      mark(startTag);

      var vnode = vm._render();

      mark(endTag);
      measure("vue " + name + " render", startTag, endTag);
      mark(startTag);

      vm._update(vnode, hydrating);

      mark(endTag);
      measure("vue " + name + " patch", startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  } // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined


  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true
  /* isRenderWatcher */
  );
  hydrating = false; // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook

  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }

  return vm;
}

function updateChildComponent(vm, propsData, listeners, parentVnode, renderChildren) {
  if ("development" !== 'production') {
    isUpdatingChildComponent = true;
  } // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.
  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.


  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(newScopedSlots && !newScopedSlots.$stable || oldScopedSlots !== emptyObject && !oldScopedSlots.$stable || newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key); // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.

  var needsForceUpdate = !!(renderChildren || // has new static slots
  vm.$options._renderChildren || // has old static slots
  hasDynamicScopedSlot);
  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) {
    // update child tree's parent
    vm._vnode.parent = parentVnode;
  }

  vm.$options._renderChildren = renderChildren; // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render

  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject; // update props

  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];

    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?

      props[key] = validateProp(key, propOptions, propsData, vm);
    }

    toggleObserving(true); // keep a copy of raw propsData

    vm.$options.propsData = propsData;
  } // update listeners


  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners); // resolve slots + force update if has children

  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if ("development" !== 'production') {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree(vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) {
      return true;
    }
  }

  return false;
}

function activateChildComponent(vm, direct) {
  if (direct) {
    vm._directInactive = false;

    if (isInInactiveTree(vm)) {
      return;
    }
  } else if (vm._directInactive) {
    return;
  }

  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;

    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }

    callHook(vm, 'activated');
  }
}

function deactivateChildComponent(vm, direct) {
  if (direct) {
    vm._directInactive = true;

    if (isInInactiveTree(vm)) {
      return;
    }
  }

  if (!vm._inactive) {
    vm._inactive = true;

    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }

    callHook(vm, 'deactivated');
  }
}

function callHook(vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";

  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }

  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }

  popTarget();
}
/*  */


var MAX_UPDATE_COUNT = 100;
var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;
/**
 * Reset the scheduler's state.
 */

function resetSchedulerState() {
  index = queue.length = activatedChildren.length = 0;
  has = {};

  if ("development" !== 'production') {
    circular = {};
  }

  waiting = flushing = false;
} // Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.


var currentFlushTimestamp = 0; // Async edge case fix requires storing an event listener's attach timestamp.

var getNow = Date.now; // Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)

if (inBrowser && !isIE) {
  var performance = window.performance;

  if (performance && typeof performance.now === 'function' && getNow() > document.createEvent('Event').timeStamp) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () {
      return performance.now();
    };
  }
}
/**
 * Flush both queues and run the watchers.
 */


function flushSchedulerQueue() {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id; // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.

  queue.sort(function (a, b) {
    return a.id - b.id;
  }); // do not cache length because more watchers might be pushed
  // as we run existing watchers

  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];

    if (watcher.before) {
      watcher.before();
    }

    id = watcher.id;
    has[id] = null;
    watcher.run(); // in dev build, check and stop circular updates.

    if ("development" !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;

      if (circular[id] > MAX_UPDATE_COUNT) {
        warn('You may have an infinite update loop ' + (watcher.user ? "in watcher with expression \"" + watcher.expression + "\"" : "in a component render function."), watcher.vm);
        break;
      }
    }
  } // keep copies of post queues before resetting state


  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();
  resetSchedulerState(); // call component updated and activated hooks

  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue); // devtool hook

  /* istanbul ignore if */

  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks(queue) {
  var i = queue.length;

  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;

    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}
/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */


function queueActivatedComponent(vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks(queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true
    /* true */
    );
  }
}
/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */


function queueWatcher(watcher) {
  var id = watcher.id;

  if (has[id] == null) {
    has[id] = true;

    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;

      while (i > index && queue[i].id > watcher.id) {
        i--;
      }

      queue.splice(i + 1, 0, watcher);
    } // queue the flush


    if (!waiting) {
      waiting = true;

      if ("development" !== 'production' && !config.async) {
        flushSchedulerQueue();
        return;
      }

      nextTick(flushSchedulerQueue);
    }
  }
}
/*  */


var uid$2 = 0;
/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */

var Watcher = function Watcher(vm, expOrFn, cb, options, isRenderWatcher) {
  this.vm = vm;

  if (isRenderWatcher) {
    vm._watcher = this;
  }

  vm._watchers.push(this); // options


  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }

  this.cb = cb;
  this.id = ++uid$2; // uid for batching

  this.active = true;
  this.dirty = this.lazy; // for lazy watchers

  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = "development" !== 'production' ? expOrFn.toString() : ''; // parse expression for getter

  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);

    if (!this.getter) {
      this.getter = noop;
      "development" !== 'production' && warn("Failed watching path: \"" + expOrFn + "\" " + 'Watcher only accepts simple dot-delimited paths. ' + 'For full control, use a function instead.', vm);
    }
  }

  this.value = this.lazy ? undefined : this.get();
};
/**
 * Evaluate the getter, and re-collect dependencies.
 */


Watcher.prototype.get = function get() {
  pushTarget(this);
  var value;
  var vm = this.vm;

  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, "getter for watcher \"" + this.expression + "\"");
    } else {
      throw e;
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }

    popTarget();
    this.cleanupDeps();
  }

  return value;
};
/**
 * Add a dependency to this directive.
 */


Watcher.prototype.addDep = function addDep(dep) {
  var id = dep.id;

  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);

    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};
/**
 * Clean up for dependency collection.
 */


Watcher.prototype.cleanupDeps = function cleanupDeps() {
  var i = this.deps.length;

  while (i--) {
    var dep = this.deps[i];

    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }

  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};
/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */


Watcher.prototype.update = function update() {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};
/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */


Watcher.prototype.run = function run() {
  if (this.active) {
    var value = this.get();

    if (value !== this.value || // Deep watchers and watchers on Object/Arrays should fire even
    // when the value is the same, because the value may
    // have mutated.
    isObject(value) || this.deep) {
      // set new value
      var oldValue = this.value;
      this.value = value;

      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, "callback for watcher \"" + this.expression + "\"");
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};
/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */


Watcher.prototype.evaluate = function evaluate() {
  this.value = this.get();
  this.dirty = false;
};
/**
 * Depend on all deps collected by this watcher.
 */


Watcher.prototype.depend = function depend() {
  var i = this.deps.length;

  while (i--) {
    this.deps[i].depend();
  }
};
/**
 * Remove self from all dependencies' subscriber list.
 */


Watcher.prototype.teardown = function teardown() {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }

    var i = this.deps.length;

    while (i--) {
      this.deps[i].removeSub(this);
    }

    this.active = false;
  }
};
/*  */


var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy(target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key];
  };

  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val;
  };

  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState(vm) {
  vm._watchers = [];
  var opts = vm.$options;

  if (opts.props) {
    initProps(vm, opts.props);
  }

  if (opts.methods) {
    initMethods(vm, opts.methods);
  }

  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true
    /* asRootData */
    );
  }

  if (opts.computed) {
    initComputed(vm, opts.computed);
  }

  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps(vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {}; // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.

  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent; // root instance props should be converted

  if (!isRoot) {
    toggleObserving(false);
  }

  var loop = function (key) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */

    if ("development" !== 'production') {
      var hyphenatedKey = hyphenate(key);

      if (isReservedAttribute(hyphenatedKey) || config.isReservedAttr(hyphenatedKey)) {
        warn("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop.", vm);
      }

      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          warn("Avoid mutating a prop directly since the value will be " + "overwritten whenever the parent component re-renders. " + "Instead, use a data or computed property based on the prop's " + "value. Prop being mutated: \"" + key + "\"", vm);
        }
      });
    } else {
      defineReactive$$1(props, key, value);
    } // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.


    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop(key);

  toggleObserving(true);
}

function initData(vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {};

  if (!isPlainObject(data)) {
    data = {};
    "development" !== 'production' && warn('data functions should return an object:\n' + 'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function', vm);
  } // proxy data on instance


  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;

  while (i--) {
    var key = keys[i];

    if ("development" !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn("Method \"" + key + "\" has already been defined as a data property.", vm);
      }
    }

    if (props && hasOwn(props, key)) {
      "development" !== 'production' && warn("The data property \"" + key + "\" is already declared as a prop. " + "Use prop default value instead.", vm);
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  } // observe data


  observe(data, true
  /* asRootData */
  );
}

function getData(data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();

  try {
    return data.call(vm, vm);
  } catch (e) {
    handleError(e, vm, "data()");
    return {};
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = {
  lazy: true
};

function initComputed(vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null); // computed properties are just getters during SSR

  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;

    if ("development" !== 'production' && getter == null) {
      warn("Getter is missing for computed property \"" + key + "\".", vm);
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions);
    } // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.


    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if ("development" !== 'production') {
      if (key in vm.$data) {
        warn("The computed property \"" + key + "\" is already defined in data.", vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn("The computed property \"" + key + "\" is already defined as a prop.", vm);
      }
    }
  }
}

function defineComputed(target, key, userDef) {
  var shouldCache = !isServerRendering();

  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache ? createComputedGetter(key) : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get ? shouldCache && userDef.cache !== false ? createComputedGetter(key) : createGetterInvoker(userDef.get) : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }

  if ("development" !== 'production' && sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn("Computed property \"" + key + "\" was assigned to but it has no setter.", this);
    };
  }

  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter(key) {
  return function computedGetter() {
    var watcher = this._computedWatchers && this._computedWatchers[key];

    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }

      if (Dep.target) {
        watcher.depend();
      }

      return watcher.value;
    }
  };
}

function createGetterInvoker(fn) {
  return function computedGetter() {
    return fn.call(this, this);
  };
}

function initMethods(vm, methods) {
  var props = vm.$options.props;

  for (var key in methods) {
    if ("development" !== 'production') {
      if (typeof methods[key] !== 'function') {
        warn("Method \"" + key + "\" has type \"" + typeof methods[key] + "\" in the component definition. " + "Did you reference the function correctly?", vm);
      }

      if (props && hasOwn(props, key)) {
        warn("Method \"" + key + "\" has already been defined as a prop.", vm);
      }

      if (key in vm && isReserved(key)) {
        warn("Method \"" + key + "\" conflicts with an existing Vue instance method. " + "Avoid defining component methods that start with _ or $.");
      }
    }

    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch(vm, watch) {
  for (var key in watch) {
    var handler = watch[key];

    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher(vm, expOrFn, handler, options) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }

  if (typeof handler === 'string') {
    handler = vm[handler];
  }

  return vm.$watch(expOrFn, handler, options);
}

function stateMixin(Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};

  dataDef.get = function () {
    return this._data;
  };

  var propsDef = {};

  propsDef.get = function () {
    return this._props;
  };

  if ("development" !== 'production') {
    dataDef.set = function () {
      warn('Avoid replacing instance root $data. ' + 'Use nested data properties instead.', this);
    };

    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }

  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);
  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (expOrFn, cb, options) {
    var vm = this;

    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options);
    }

    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);

    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, "callback for immediate watcher \"" + watcher.expression + "\"");
      }
    }

    return function unwatchFn() {
      watcher.teardown();
    };
  };
}
/*  */


var uid$3 = 0;

function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    var vm = this; // a uid

    vm._uid = uid$3++;
    var startTag, endTag;
    /* istanbul ignore if */

    if ("development" !== 'production' && config.performance && mark) {
      startTag = "vue-perf-start:" + vm._uid;
      endTag = "vue-perf-end:" + vm._uid;
      mark(startTag);
    } // a flag to avoid this being observed


    vm._isVue = true; // merge options

    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), options || {}, vm);
    }
    /* istanbul ignore else */


    if ("development" !== 'production') {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    } // expose real self


    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props

    initState(vm);
    initProvide(vm); // resolve provide after data/props

    callHook(vm, 'created');
    /* istanbul ignore if */

    if ("development" !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure("vue " + vm._name + " init", startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent(vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options); // doing this because it's faster than dynamic enumeration.

  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;
  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions(Ctor) {
  var options = Ctor.options;

  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;

    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions; // check if there are any late-modified/attached options (#4976)

      var modifiedOptions = resolveModifiedOptions(Ctor); // update base extend options

      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }

      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);

      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }

  return options;
}

function resolveModifiedOptions(Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;

  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) {
        modified = {};
      }

      modified[key] = latest[key];
    }
  }

  return modified;
}

function Vue(options) {
  if ("development" !== 'production' && !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }

  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);
/*  */

function initUse(Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = this._installedPlugins || (this._installedPlugins = []);

    if (installedPlugins.indexOf(plugin) > -1) {
      return this;
    } // additional parameters


    var args = toArray(arguments, 1);
    args.unshift(this);

    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }

    installedPlugins.push(plugin);
    return this;
  };
}
/*  */


function initMixin$1(Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this;
  };
}
/*  */


function initExtend(Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;
  /**
   * Class inheritance
   */

  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});

    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId];
    }

    var name = extendOptions.name || Super.options.name;

    if ("development" !== 'production' && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent(options) {
      this._init(options);
    };

    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(Super.options, extendOptions);
    Sub['super'] = Super; // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.

    if (Sub.options.props) {
      initProps$1(Sub);
    }

    if (Sub.options.computed) {
      initComputed$1(Sub);
    } // allow further extension/mixin/plugin usage


    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use; // create asset registers, so extended classes
    // can have their private assets too.

    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    }); // enable recursive self-lookup

    if (name) {
      Sub.options.components[name] = Sub;
    } // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.


    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options); // cache constructor

    cachedCtors[SuperId] = Sub;
    return Sub;
  };
}

function initProps$1(Comp) {
  var props = Comp.options.props;

  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1(Comp) {
  var computed = Comp.options.computed;

  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}
/*  */


function initAssetRegisters(Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (id, definition) {
      if (!definition) {
        return this.options[type + 's'][id];
      } else {
        /* istanbul ignore if */
        if ("development" !== 'production' && type === 'component') {
          validateComponentName(id);
        }

        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }

        if (type === 'directive' && typeof definition === 'function') {
          definition = {
            bind: definition,
            update: definition
          };
        }

        this.options[type + 's'][id] = definition;
        return definition;
      }
    };
  });
}
/*  */


function getComponentName(opts) {
  return opts && (opts.Ctor.options.name || opts.tag);
}

function matches(pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1;
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1;
  } else if (isRegExp(pattern)) {
    return pattern.test(name);
  }
  /* istanbul ignore next */


  return false;
}

function pruneCache(keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;

  for (var key in cache) {
    var cachedNode = cache[key];

    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);

      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry(cache, key, keys, current) {
  var cached$$1 = cache[key];

  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }

  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];
var KeepAlive = {
  name: 'keep-alive',
  abstract: true,
  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },
  created: function created() {
    this.cache = Object.create(null);
    this.keys = [];
  },
  destroyed: function destroyed() {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },
  mounted: function mounted() {
    var this$1 = this;
    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) {
        return matches(val, name);
      });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) {
        return !matches(val, name);
      });
    });
  },
  render: function render() {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;

    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;

      if ( // not included
      include && (!name || !matches(include, name)) || // excluded
      exclude && name && matches(exclude, name)) {
        return vnode;
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null // same constructor may get registered as different local components
      // so cid alone is not enough (#3269)
      ? componentOptions.Ctor.cid + (componentOptions.tag ? "::" + componentOptions.tag : '') : vnode.key;

      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance; // make current key freshest

        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key); // prune oldest entry

        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }

    return vnode || slot && slot[0];
  }
};
var builtInComponents = {
  KeepAlive: KeepAlive
};
/*  */

function initGlobalAPI(Vue) {
  // config
  var configDef = {};

  configDef.get = function () {
    return config;
  };

  if ("development" !== 'production') {
    configDef.set = function () {
      warn('Do not replace the Vue.config object, set individual fields instead.');
    };
  }

  Object.defineProperty(Vue, 'config', configDef); // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.

  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };
  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick; // 2.6 explicit observable API

  Vue.observable = function (obj) {
    observe(obj);
    return obj;
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  }); // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.

  Vue.options._base = Vue;
  extend(Vue.options.components, builtInComponents);
  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);
Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});
Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get() {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext;
  }
}); // expose FunctionalRenderContext for ssr runtime helper installation

Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});
Vue.version = '2.6.11';
/*  */
// these are reserved for web because they are directly compiled away
// during template compilation

var isReservedAttr = makeMap('style,class'); // attributes that should be using props for binding

var acceptValue = makeMap('input,textarea,option,select,progress');

var mustUseProp = function (tag, type, attr) {
  return attr === 'value' && acceptValue(tag) && type !== 'button' || attr === 'selected' && tag === 'option' || attr === 'checked' && tag === 'input' || attr === 'muted' && tag === 'video';
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');
var isValidContentEditableValue = makeMap('events,caret,typing,plaintext-only');

var convertEnumeratedValue = function (key, value) {
  return isFalsyAttrValue(value) || value === 'false' ? 'false' // allow arbitrary string value for contenteditable
  : key === 'contenteditable' && isValidContentEditableValue(value) ? value : 'true';
};

var isBooleanAttr = makeMap('allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' + 'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' + 'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' + 'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' + 'required,reversed,scoped,seamless,selected,sortable,translate,' + 'truespeed,typemustmatch,visible');
var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink';
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : '';
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false;
};
/*  */


function genClassForVnode(vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;

  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;

    if (childNode && childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }

  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode && parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }

  return renderClass(data.staticClass, data.class);
}

function mergeClassData(child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class) ? [child.class, parent.class] : parent.class
  };
}

function renderClass(staticClass, dynamicClass) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass));
  }
  /* istanbul ignore next */


  return '';
}

function concat(a, b) {
  return a ? b ? a + ' ' + b : a : b || '';
}

function stringifyClass(value) {
  if (Array.isArray(value)) {
    return stringifyArray(value);
  }

  if (isObject(value)) {
    return stringifyObject(value);
  }

  if (typeof value === 'string') {
    return value;
  }
  /* istanbul ignore next */


  return '';
}

function stringifyArray(value) {
  var res = '';
  var stringified;

  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) {
        res += ' ';
      }

      res += stringified;
    }
  }

  return res;
}

function stringifyObject(value) {
  var res = '';

  for (var key in value) {
    if (value[key]) {
      if (res) {
        res += ' ';
      }

      res += key;
    }
  }

  return res;
}
/*  */


var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};
var isHTMLTag = makeMap('html,body,base,head,link,meta,style,title,' + 'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' + 'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' + 'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' + 's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' + 'embed,object,param,source,canvas,script,noscript,del,ins,' + 'caption,col,colgroup,table,thead,tbody,td,th,tr,' + 'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' + 'output,progress,select,textarea,' + 'details,dialog,menu,menuitem,summary,' + 'content,element,shadow,template,blockquote,iframe,tfoot'); // this map is intentionally selective, only covering SVG elements that may
// contain child elements.

var isSVG = makeMap('svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' + 'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' + 'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view', true);

var isPreTag = function (tag) {
  return tag === 'pre';
};

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag);
};

function getTagNamespace(tag) {
  if (isSVG(tag)) {
    return 'svg';
  } // basic support for MathML
  // note it doesn't support other MathML elements being component roots


  if (tag === 'math') {
    return 'math';
  }
}

var unknownElementCache = Object.create(null);

function isUnknownElement(tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true;
  }

  if (isReservedTag(tag)) {
    return false;
  }

  tag = tag.toLowerCase();
  /* istanbul ignore if */

  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag];
  }

  var el = document.createElement(tag);

  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return unknownElementCache[tag] = el.constructor === window.HTMLUnknownElement || el.constructor === window.HTMLElement;
  } else {
    return unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString());
  }
}

var isTextInputType = makeMap('text,number,password,search,email,tel,url');
/*  */

/**
 * Query an element selector if it's not an element already.
 */

function query(el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);

    if (!selected) {
      "development" !== 'production' && warn('Cannot find element: ' + el);
      return document.createElement('div');
    }

    return selected;
  } else {
    return el;
  }
}
/*  */


function createElement$1(tagName, vnode) {
  var elm = document.createElement(tagName);

  if (tagName !== 'select') {
    return elm;
  } // false or null will remove the attribute but undefined will not


  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }

  return elm;
}

function createElementNS(namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName);
}

function createTextNode(text) {
  return document.createTextNode(text);
}

function createComment(text) {
  return document.createComment(text);
}

function insertBefore(parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild(node, child) {
  node.removeChild(child);
}

function appendChild(node, child) {
  node.appendChild(child);
}

function parentNode(node) {
  return node.parentNode;
}

function nextSibling(node) {
  return node.nextSibling;
}

function tagName(node) {
  return node.tagName;
}

function setTextContent(node, text) {
  node.textContent = text;
}

function setStyleScope(node, scopeId) {
  node.setAttribute(scopeId, '');
}

var nodeOps = /*#__PURE__*/Object.freeze({
  createElement: createElement$1,
  createElementNS: createElementNS,
  createTextNode: createTextNode,
  createComment: createComment,
  insertBefore: insertBefore,
  removeChild: removeChild,
  appendChild: appendChild,
  parentNode: parentNode,
  nextSibling: nextSibling,
  tagName: tagName,
  setTextContent: setTextContent,
  setStyleScope: setStyleScope
});
/*  */

var ref = {
  create: function create(_, vnode) {
    registerRef(vnode);
  },
  update: function update(oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy(vnode) {
    registerRef(vnode, true);
  }
};

function registerRef(vnode, isRemoval) {
  var key = vnode.data.ref;

  if (!isDef(key)) {
    return;
  }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;

  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}
/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */


var emptyNode = new VNode('', {}, []);
var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode(a, b) {
  return a.key === b.key && (a.tag === b.tag && a.isComment === b.isComment && isDef(a.data) === isDef(b.data) && sameInputType(a, b) || isTrue(a.isAsyncPlaceholder) && a.asyncFactory === b.asyncFactory && isUndef(b.asyncFactory.error));
}

function sameInputType(a, b) {
  if (a.tag !== 'input') {
    return true;
  }

  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB);
}

function createKeyToOldIdx(children, beginIdx, endIdx) {
  var i, key;
  var map = {};

  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;

    if (isDef(key)) {
      map[key] = i;
    }
  }

  return map;
}

function createPatchFunction(backend) {
  var i, j;
  var cbs = {};
  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];

    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt(elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm);
  }

  function createRmCb(childElm, listeners) {
    function remove$$1() {
      if (--remove$$1.listeners === 0) {
        removeNode(childElm);
      }
    }

    remove$$1.listeners = listeners;
    return remove$$1;
  }

  function removeNode(el) {
    var parent = nodeOps.parentNode(el); // element may have already been removed due to v-html / v-text

    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  function isUnknownElement$$1(vnode, inVPre) {
    return !inVPre && !vnode.ns && !(config.ignoredElements.length && config.ignoredElements.some(function (ignore) {
      return isRegExp(ignore) ? ignore.test(vnode.tag) : ignore === vnode.tag;
    })) && config.isUnknownElement(vnode.tag);
  }

  var creatingElmInVPre = 0;

  function createElm(vnode, insertedVnodeQueue, parentElm, refElm, nested, ownerArray, index) {
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // This vnode was used in a previous render!
      // now it's used as a new node, overwriting its elm would cause
      // potential patch errors down the road when it's used as an insertion
      // reference node. Instead, we clone the node on-demand before creating
      // associated DOM element for it.
      vnode = ownerArray[index] = cloneVNode(vnode);
    }

    vnode.isRootInsert = !nested; // for transition enter check

    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return;
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;

    if (isDef(tag)) {
      if ("development" !== 'production') {
        if (data && data.pre) {
          creatingElmInVPre++;
        }

        if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
          warn('Unknown custom element: <' + tag + '> - did you ' + 'register the component correctly? For recursive components, ' + 'make sure to provide the "name" option.', vnode.context);
        }
      }

      vnode.elm = vnode.ns ? nodeOps.createElementNS(vnode.ns, tag) : nodeOps.createElement(tag, vnode);
      setScope(vnode);
      /* istanbul ignore if */

      {
        createChildren(vnode, children, insertedVnodeQueue);

        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }

        insert(parentElm, vnode.elm, refElm);
      }

      if ("development" !== 'production' && data && data.pre) {
        creatingElmInVPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;

    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;

      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false
        /* hydrating */
        );
      } // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.


      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        insert(parentElm, vnode.elm, refElm);

        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }

        return true;
      }
    }
  }

  function initComponent(vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }

    vnode.elm = vnode.componentInstance.$el;

    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode); // make sure to invoke the insert hook

      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
    var i; // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.

    var innerNode = vnode;

    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;

      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }

        insertedVnodeQueue.push(innerNode);
        break;
      }
    } // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself


    insert(parentElm, vnode.elm, refElm);
  }

  function insert(parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (nodeOps.parentNode(ref$$1) === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren(vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      if ("development" !== 'production') {
        checkDuplicateKeys(children);
      }

      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
    }
  }

  function isPatchable(vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }

    return isDef(vnode.tag);
  }

  function invokeCreateHooks(vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }

    i = vnode.data.hook; // Reuse variable

    if (isDef(i)) {
      if (isDef(i.create)) {
        i.create(emptyNode, vnode);
      }

      if (isDef(i.insert)) {
        insertedVnodeQueue.push(vnode);
      }
    }
  } // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.


  function setScope(vnode) {
    var i;

    if (isDef(i = vnode.fnScopeId)) {
      nodeOps.setStyleScope(vnode.elm, i);
    } else {
      var ancestor = vnode;

      while (ancestor) {
        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
          nodeOps.setStyleScope(vnode.elm, i);
        }

        ancestor = ancestor.parent;
      }
    } // for slot content they should also get the scopeId from the host instance.


    if (isDef(i = activeInstance) && i !== vnode.context && i !== vnode.fnContext && isDef(i = i.$options._scopeId)) {
      nodeOps.setStyleScope(vnode.elm, i);
    }
  }

  function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
    }
  }

  function invokeDestroyHook(vnode) {
    var i, j;
    var data = vnode.data;

    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) {
        i(vnode);
      }

      for (i = 0; i < cbs.destroy.length; ++i) {
        cbs.destroy[i](vnode);
      }
    }

    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes(vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];

      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else {
          // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook(vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;

      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      } // recursively invoke hooks on child component root node


      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }

      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }

      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm; // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions

    var canMove = !removeOnly;

    if ("development" !== 'production') {
      checkDuplicateKeys(newCh);
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) {
        // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) {
        // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        }

        idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);

        if (isUndef(idxInOld)) {
          // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
        } else {
          vnodeToMove = oldCh[idxInOld];

          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          }
        }

        newStartVnode = newCh[++newStartIdx];
      }
    }

    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function checkDuplicateKeys(children) {
    var seenKeys = {};

    for (var i = 0; i < children.length; i++) {
      var vnode = children[i];
      var key = vnode.key;

      if (isDef(key)) {
        if (seenKeys[key]) {
          warn("Duplicate keys detected: '" + key + "'. This may cause an update error.", vnode.context);
        } else {
          seenKeys[key] = true;
        }
      }
    }
  }

  function findIdxInOld(node, oldCh, start, end) {
    for (var i = start; i < end; i++) {
      var c = oldCh[i];

      if (isDef(c) && sameVnode(node, c)) {
        return i;
      }
    }
  }

  function patchVnode(oldVnode, vnode, insertedVnodeQueue, ownerArray, index, removeOnly) {
    if (oldVnode === vnode) {
      return;
    }

    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // clone reused vnode
      vnode = ownerArray[index] = cloneVNode(vnode);
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }

      return;
    } // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.


    if (isTrue(vnode.isStatic) && isTrue(oldVnode.isStatic) && vnode.key === oldVnode.key && (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))) {
      vnode.componentInstance = oldVnode.componentInstance;
      return;
    }

    var i;
    var data = vnode.data;

    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;

    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) {
        cbs.update[i](oldVnode, vnode);
      }

      if (isDef(i = data.hook) && isDef(i = i.update)) {
        i(oldVnode, vnode);
      }
    }

    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) {
          updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
        }
      } else if (isDef(ch)) {
        if ("development" !== 'production') {
          checkDuplicateKeys(ch);
        }

        if (isDef(oldVnode.text)) {
          nodeOps.setTextContent(elm, '');
        }

        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }

    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) {
        i(oldVnode, vnode);
      }
    }
  }

  function invokeInsertHook(vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var hydrationBailed = false; // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  // Note: style is excluded because it relies on initial clone for future
  // deep updates (#7063).

  var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key'); // Note: this is a browser-only function so we can assume elms are DOM nodes.

  function hydrate(elm, vnode, insertedVnodeQueue, inVPre) {
    var i;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    inVPre = inVPre || data && data.pre;
    vnode.elm = elm;

    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.isAsyncPlaceholder = true;
      return true;
    } // assert node match


    if ("development" !== 'production') {
      if (!assertNodeMatch(elm, vnode, inVPre)) {
        return false;
      }
    }

    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) {
        i(vnode, true
        /* hydrating */
        );
      }

      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true;
      }
    }

    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
            if (i !== elm.innerHTML) {
              /* istanbul ignore if */
              if ("development" !== 'production' && typeof console !== 'undefined' && !hydrationBailed) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('server innerHTML: ', i);
                console.warn('client innerHTML: ', elm.innerHTML);
              }

              return false;
            }
          } else {
            // iterate and compare children lists
            var childrenMatch = true;
            var childNode = elm.firstChild;

            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                childrenMatch = false;
                break;
              }

              childNode = childNode.nextSibling;
            } // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.


            if (!childrenMatch || childNode) {
              /* istanbul ignore if */
              if ("development" !== 'production' && typeof console !== 'undefined' && !hydrationBailed) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
              }

              return false;
            }
          }
        }
      }

      if (isDef(data)) {
        var fullInvoke = false;

        for (var key in data) {
          if (!isRenderedModule(key)) {
            fullInvoke = true;
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break;
          }
        }

        if (!fullInvoke && data['class']) {
          // ensure collecting deps for deep class bindings for future updates
          traverse(data['class']);
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }

    return true;
  }

  function assertNodeMatch(node, vnode, inVPre) {
    if (isDef(vnode.tag)) {
      return vnode.tag.indexOf('vue-component') === 0 || !isUnknownElement$$1(vnode, inVPre) && vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase());
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3);
    }
  }

  return function patch(oldVnode, vnode, hydrating, removeOnly) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) {
        invokeDestroyHook(oldVnode);
      }

      return;
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);

      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }

          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode;
            } else if ("development" !== 'production') {
              warn('The client-side rendered virtual DOM tree is not matching ' + 'server-rendered content. This is likely caused by incorrect ' + 'HTML markup, for example nesting block-level elements inside ' + '<p>, or missing <tbody>. Bailing hydration and performing ' + 'full client-side render.');
            }
          } // either not server-rendered, or hydration failed.
          // create an empty node and replace it


          oldVnode = emptyNodeAt(oldVnode);
        } // replacing existing element


        var oldElm = oldVnode.elm;
        var parentElm = nodeOps.parentNode(oldElm); // create new node

        createElm(vnode, insertedVnodeQueue, // extremely rare edge case: do not insert if old element is in a
        // leaving transition. Only happens when combining transition +
        // keep-alive + HOCs. (#4590)
        oldElm._leaveCb ? null : parentElm, nodeOps.nextSibling(oldElm)); // update parent placeholder node element, recursively

        if (isDef(vnode.parent)) {
          var ancestor = vnode.parent;
          var patchable = isPatchable(vnode);

          while (ancestor) {
            for (var i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor);
            }

            ancestor.elm = vnode.elm;

            if (patchable) {
              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, ancestor);
              } // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.


              var insert = ancestor.data.hook.insert;

              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                  insert.fns[i$2]();
                }
              }
            } else {
              registerRef(ancestor);
            }

            ancestor = ancestor.parent;
          }
        } // destroy old node


        if (isDef(parentElm)) {
          removeVnodes([oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm;
  };
}
/*  */


var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives(vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives(oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update(oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);
  var dirsWithInsert = [];
  var dirsWithPostpatch = [];
  var key, oldDir, dir;

  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];

    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);

      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      dir.oldArg = oldDir.arg;
      callHook$1(dir, 'update', vnode, oldVnode);

      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };

    if (isCreate) {
      mergeVNodeHook(vnode, 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1(dirs, vm) {
  var res = Object.create(null);

  if (!dirs) {
    // $flow-disable-line
    return res;
  }

  var i, dir;

  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];

    if (!dir.modifiers) {
      // $flow-disable-line
      dir.modifiers = emptyModifiers;
    }

    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  } // $flow-disable-line


  return res;
}

function getRawDirName(dir) {
  return dir.rawName || dir.name + "." + Object.keys(dir.modifiers || {}).join('.');
}

function callHook$1(dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];

  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, "directive " + dir.name + " " + hook + " hook");
    }
  }
}

var baseModules = [ref, directives];
/*  */

function updateAttrs(oldVnode, vnode) {
  var opts = vnode.componentOptions;

  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return;
  }

  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return;
  }

  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {}; // clone observed objects, as the user probably wants to mutate it

  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];

    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  } // #4391: in IE9, setting type can reset value for input[type=radio]
  // #6666: IE/Edge forces progress value down to 1 before setting a max

  /* istanbul ignore if */


  if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }

  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr(el, key, value) {
  if (el.tagName.indexOf('-') > -1) {
    baseSetAttr(el, key, value);
  } else if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED' ? 'true' : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, convertEnumeratedValue(key, value));
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    baseSetAttr(el, key, value);
  }
}

function baseSetAttr(el, key, value) {
  if (isFalsyAttrValue(value)) {
    el.removeAttribute(key);
  } else {
    // #7138: IE10 & 11 fires input event when setting placeholder on
    // <textarea>... block the first input event and remove the blocker
    // immediately.

    /* istanbul ignore if */
    if (isIE && !isIE9 && el.tagName === 'TEXTAREA' && key === 'placeholder' && value !== '' && !el.__ieph) {
      var blocker = function (e) {
        e.stopImmediatePropagation();
        el.removeEventListener('input', blocker);
      };

      el.addEventListener('input', blocker); // $flow-disable-line

      el.__ieph = true;
      /* IE placeholder patched */
    }

    el.setAttribute(key, value);
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};
/*  */

function updateClass(oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticClass) && isUndef(data.class) && (isUndef(oldData) || isUndef(oldData.staticClass) && isUndef(oldData.class))) {
    return;
  }

  var cls = genClassForVnode(vnode); // handle transition classes

  var transitionClass = el._transitionClasses;

  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  } // set the class


  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};
/*  */

var validDivisionCharRE = /[\w).+\-_$\]]/;

function parseFilters(exp) {
  var inSingle = false;
  var inDouble = false;
  var inTemplateString = false;
  var inRegex = false;
  var curly = 0;
  var square = 0;
  var paren = 0;
  var lastFilterIndex = 0;
  var c, prev, i, expression, filters;

  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);

    if (inSingle) {
      if (c === 0x27 && prev !== 0x5C) {
        inSingle = false;
      }
    } else if (inDouble) {
      if (c === 0x22 && prev !== 0x5C) {
        inDouble = false;
      }
    } else if (inTemplateString) {
      if (c === 0x60 && prev !== 0x5C) {
        inTemplateString = false;
      }
    } else if (inRegex) {
      if (c === 0x2f && prev !== 0x5C) {
        inRegex = false;
      }
    } else if (c === 0x7C && // pipe
    exp.charCodeAt(i + 1) !== 0x7C && exp.charCodeAt(i - 1) !== 0x7C && !curly && !square && !paren) {
      if (expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22:
          inDouble = true;
          break;
        // "

        case 0x27:
          inSingle = true;
          break;
        // '

        case 0x60:
          inTemplateString = true;
          break;
        // `

        case 0x28:
          paren++;
          break;
        // (

        case 0x29:
          paren--;
          break;
        // )

        case 0x5B:
          square++;
          break;
        // [

        case 0x5D:
          square--;
          break;
        // ]

        case 0x7B:
          curly++;
          break;
        // {

        case 0x7D:
          curly--;
          break;
        // }
      }

      if (c === 0x2f) {
        // /
        var j = i - 1;
        var p = void 0; // find first non-whitespace prev char

        for (; j >= 0; j--) {
          p = exp.charAt(j);

          if (p !== ' ') {
            break;
          }
        }

        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }

  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  function pushFilter() {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression;
}

function wrapFilter(exp, filter) {
  var i = filter.indexOf('(');

  if (i < 0) {
    // _f: resolveFilter
    return "_f(\"" + filter + "\")(" + exp + ")";
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return "_f(\"" + name + "\")(" + exp + (args !== ')' ? ',' + args : args);
  }
}
/*  */

/* eslint-disable no-unused-vars */


function baseWarn(msg, range) {
  console.error("[Vue compiler]: " + msg);
}
/* eslint-enable no-unused-vars */


function pluckModuleFunction(modules, key) {
  return modules ? modules.map(function (m) {
    return m[key];
  }).filter(function (_) {
    return _;
  }) : [];
}

function addProp(el, name, value, range, dynamic) {
  (el.props || (el.props = [])).push(rangeSetItem({
    name: name,
    value: value,
    dynamic: dynamic
  }, range));
  el.plain = false;
}

function addAttr(el, name, value, range, dynamic) {
  var attrs = dynamic ? el.dynamicAttrs || (el.dynamicAttrs = []) : el.attrs || (el.attrs = []);
  attrs.push(rangeSetItem({
    name: name,
    value: value,
    dynamic: dynamic
  }, range));
  el.plain = false;
} // add a raw attr (use this in preTransforms)


function addRawAttr(el, name, value, range) {
  el.attrsMap[name] = value;
  el.attrsList.push(rangeSetItem({
    name: name,
    value: value
  }, range));
}

function addDirective(el, name, rawName, value, arg, isDynamicArg, modifiers, range) {
  (el.directives || (el.directives = [])).push(rangeSetItem({
    name: name,
    rawName: rawName,
    value: value,
    arg: arg,
    isDynamicArg: isDynamicArg,
    modifiers: modifiers
  }, range));
  el.plain = false;
}

function prependModifierMarker(symbol, name, dynamic) {
  return dynamic ? "_p(" + name + ",\"" + symbol + "\")" : symbol + name; // mark the event as captured
}

function addHandler(el, name, value, modifiers, important, warn, range, dynamic) {
  modifiers = modifiers || emptyObject; // warn prevent and passive modifier

  /* istanbul ignore if */

  if ("development" !== 'production' && warn && modifiers.prevent && modifiers.passive) {
    warn('passive and prevent can\'t be used together. ' + 'Passive handler can\'t prevent default event.', range);
  } // normalize click.right and click.middle since they don't actually fire
  // this is technically browser-specific, but at least for now browsers are
  // the only target envs that have right/middle clicks.


  if (modifiers.right) {
    if (dynamic) {
      name = "(" + name + ")==='click'?'contextmenu':(" + name + ")";
    } else if (name === 'click') {
      name = 'contextmenu';
      delete modifiers.right;
    }
  } else if (modifiers.middle) {
    if (dynamic) {
      name = "(" + name + ")==='click'?'mouseup':(" + name + ")";
    } else if (name === 'click') {
      name = 'mouseup';
    }
  } // check capture modifier


  if (modifiers.capture) {
    delete modifiers.capture;
    name = prependModifierMarker('!', name, dynamic);
  }

  if (modifiers.once) {
    delete modifiers.once;
    name = prependModifierMarker('~', name, dynamic);
  }
  /* istanbul ignore if */


  if (modifiers.passive) {
    delete modifiers.passive;
    name = prependModifierMarker('&', name, dynamic);
  }

  var events;

  if (modifiers.native) {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } else {
    events = el.events || (el.events = {});
  }

  var newHandler = rangeSetItem({
    value: value.trim(),
    dynamic: dynamic
  }, range);

  if (modifiers !== emptyObject) {
    newHandler.modifiers = modifiers;
  }

  var handlers = events[name];
  /* istanbul ignore if */

  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } else {
    events[name] = newHandler;
  }

  el.plain = false;
}

function getRawBindingAttr(el, name) {
  return el.rawAttrsMap[':' + name] || el.rawAttrsMap['v-bind:' + name] || el.rawAttrsMap[name];
}

function getBindingAttr(el, name, getStatic) {
  var dynamicValue = getAndRemoveAttr(el, ':' + name) || getAndRemoveAttr(el, 'v-bind:' + name);

  if (dynamicValue != null) {
    return parseFilters(dynamicValue);
  } else if (getStatic !== false) {
    var staticValue = getAndRemoveAttr(el, name);

    if (staticValue != null) {
      return JSON.stringify(staticValue);
    }
  }
} // note: this only removes the attr from the Array (attrsList) so that it
// doesn't get processed by processAttrs.
// By default it does NOT remove it from the map (attrsMap) because the map is
// needed during codegen.


function getAndRemoveAttr(el, name, removeFromMap) {
  var val;

  if ((val = el.attrsMap[name]) != null) {
    var list = el.attrsList;

    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break;
      }
    }
  }

  if (removeFromMap) {
    delete el.attrsMap[name];
  }

  return val;
}

function getAndRemoveAttrByRegex(el, name) {
  var list = el.attrsList;

  for (var i = 0, l = list.length; i < l; i++) {
    var attr = list[i];

    if (name.test(attr.name)) {
      list.splice(i, 1);
      return attr;
    }
  }
}

function rangeSetItem(item, range) {
  if (range) {
    if (range.start != null) {
      item.start = range.start;
    }

    if (range.end != null) {
      item.end = range.end;
    }
  }

  return item;
}
/*  */

/**
 * Cross-platform code generation for component v-model
 */


function genComponentModel(el, value, modifiers) {
  var ref = modifiers || {};
  var number = ref.number;
  var trim = ref.trim;
  var baseValueExpression = '$$v';
  var valueExpression = baseValueExpression;

  if (trim) {
    valueExpression = "(typeof " + baseValueExpression + " === 'string'" + "? " + baseValueExpression + ".trim()" + ": " + baseValueExpression + ")";
  }

  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }

  var assignment = genAssignmentCode(value, valueExpression);
  el.model = {
    value: "(" + value + ")",
    expression: JSON.stringify(value),
    callback: "function (" + baseValueExpression + ") {" + assignment + "}"
  };
}
/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */


function genAssignmentCode(value, assignment) {
  var res = parseModel(value);

  if (res.key === null) {
    return value + "=" + assignment;
  } else {
    return "$set(" + res.exp + ", " + res.key + ", " + assignment + ")";
  }
}
/**
 * Parse a v-model expression into a base path and a final key segment.
 * Handles both dot-path and possible square brackets.
 *
 * Possible cases:
 *
 * - test
 * - test[key]
 * - test[test1[key]]
 * - test["a"][key]
 * - xxx.test[a[a].test1[key]]
 * - test.xxx.a["asa"][test1[key]]
 *
 */


var len, str, chr, index$1, expressionPos, expressionEndPos;

function parseModel(val) {
  // Fix https://github.com/vuejs/vue/pull/7730
  // allow v-model="obj.val " (trailing whitespace)
  val = val.trim();
  len = val.length;

  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    index$1 = val.lastIndexOf('.');

    if (index$1 > -1) {
      return {
        exp: val.slice(0, index$1),
        key: '"' + val.slice(index$1 + 1) + '"'
      };
    } else {
      return {
        exp: val,
        key: null
      };
    }
  }

  str = val;
  index$1 = expressionPos = expressionEndPos = 0;

  while (!eof()) {
    chr = next();
    /* istanbul ignore if */

    if (isStringStart(chr)) {
      parseString(chr);
    } else if (chr === 0x5B) {
      parseBracket(chr);
    }
  }

  return {
    exp: val.slice(0, expressionPos),
    key: val.slice(expressionPos + 1, expressionEndPos)
  };
}

function next() {
  return str.charCodeAt(++index$1);
}

function eof() {
  return index$1 >= len;
}

function isStringStart(chr) {
  return chr === 0x22 || chr === 0x27;
}

function parseBracket(chr) {
  var inBracket = 1;
  expressionPos = index$1;

  while (!eof()) {
    chr = next();

    if (isStringStart(chr)) {
      parseString(chr);
      continue;
    }

    if (chr === 0x5B) {
      inBracket++;
    }

    if (chr === 0x5D) {
      inBracket--;
    }

    if (inBracket === 0) {
      expressionEndPos = index$1;
      break;
    }
  }
}

function parseString(chr) {
  var stringQuote = chr;

  while (!eof()) {
    chr = next();

    if (chr === stringQuote) {
      break;
    }
  }
}
/*  */


var warn$1; // in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.

var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

function model(el, dir, _warn) {
  warn$1 = _warn;
  var value = dir.value;
  var modifiers = dir.modifiers;
  var tag = el.tag;
  var type = el.attrsMap.type;

  if ("development" !== 'production') {
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') {
      warn$1("<" + el.tag + " v-model=\"" + value + "\" type=\"file\">:\n" + "File inputs are read only. Use a v-on:change listener instead.", el.rawAttrsMap['v-model']);
    }
  }

  if (el.component) {
    genComponentModel(el, value, modifiers); // component v-model doesn't need extra runtime

    return false;
  } else if (tag === 'select') {
    genSelect(el, value, modifiers);
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers);
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers);
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers);
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers); // component v-model doesn't need extra runtime

    return false;
  } else if ("development" !== 'production') {
    warn$1("<" + el.tag + " v-model=\"" + value + "\">: " + "v-model is not supported on this element type. " + 'If you are working with contenteditable, it\'s recommended to ' + 'wrap a library dedicated for that purpose inside a custom component.', el.rawAttrsMap['v-model']);
  } // ensure runtime directive metadata


  return true;
}

function genCheckboxModel(el, value, modifiers) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
  var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
  addProp(el, 'checked', "Array.isArray(" + value + ")" + "?_i(" + value + "," + valueBinding + ")>-1" + (trueValueBinding === 'true' ? ":(" + value + ")" : ":_q(" + value + "," + trueValueBinding + ")"));
  addHandler(el, 'change', "var $$a=" + value + "," + '$$el=$event.target,' + "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" + 'if(Array.isArray($$a)){' + "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," + '$$i=_i($$a,$$v);' + "if($$el.checked){$$i<0&&(" + genAssignmentCode(value, '$$a.concat([$$v])') + ")}" + "else{$$i>-1&&(" + genAssignmentCode(value, '$$a.slice(0,$$i).concat($$a.slice($$i+1))') + ")}" + "}else{" + genAssignmentCode(value, '$$c') + "}", null, true);
}

function genRadioModel(el, value, modifiers) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  valueBinding = number ? "_n(" + valueBinding + ")" : valueBinding;
  addProp(el, 'checked', "_q(" + value + "," + valueBinding + ")");
  addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true);
}

function genSelect(el, value, modifiers) {
  var number = modifiers && modifiers.number;
  var selectedVal = "Array.prototype.filter" + ".call($event.target.options,function(o){return o.selected})" + ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" + "return " + (number ? '_n(val)' : 'val') + "})";
  var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
  var code = "var $$selectedVal = " + selectedVal + ";";
  code = code + " " + genAssignmentCode(value, assignment);
  addHandler(el, 'change', code, null, true);
}

function genDefaultModel(el, value, modifiers) {
  var type = el.attrsMap.type; // warn if v-bind:value conflicts with v-model
  // except for inputs with v-bind:type

  if ("development" !== 'production') {
    var value$1 = el.attrsMap['v-bind:value'] || el.attrsMap[':value'];
    var typeBinding = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];

    if (value$1 && !typeBinding) {
      var binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value';
      warn$1(binding + "=\"" + value$1 + "\" conflicts with v-model on the same element " + 'because the latter already expands to a value binding internally', el.rawAttrsMap[binding]);
    }
  }

  var ref = modifiers || {};
  var lazy = ref.lazy;
  var number = ref.number;
  var trim = ref.trim;
  var needCompositionGuard = !lazy && type !== 'range';
  var event = lazy ? 'change' : type === 'range' ? RANGE_TOKEN : 'input';
  var valueExpression = '$event.target.value';

  if (trim) {
    valueExpression = "$event.target.value.trim()";
  }

  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }

  var code = genAssignmentCode(value, valueExpression);

  if (needCompositionGuard) {
    code = "if($event.target.composing)return;" + code;
  }

  addProp(el, 'value', "(" + value + ")");
  addHandler(el, event, code, null, true);

  if (trim || number) {
    addHandler(el, 'blur', '$forceUpdate()');
  }
}
/*  */
// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.


function normalizeEvents(on) {
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    var event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  } // This was originally intended to fix #4521 but no longer necessary
  // after 2.5. Keeping it for backwards compat with generated code from < 2.4

  /* istanbul ignore if */


  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function createOnceHandler$1(event, handler, capture) {
  var _target = target$1; // save current target element in closure

  return function onceHandler() {
    var res = handler.apply(null, arguments);

    if (res !== null) {
      remove$2(event, onceHandler, capture, _target);
    }
  };
} // #9446: Firefox <= 53 (in particular, ESR 52) has incorrect Event.timeStamp
// implementation and does not fire microtasks in between event propagation, so
// safe to exclude.


var useMicrotaskFix = isUsingMicroTask && !(isFF && Number(isFF[1]) <= 53);

function add$1(name, handler, capture, passive) {
  // async edge case #6566: inner click event triggers patch, event handler
  // attached to outer element during patch, and triggered again. This
  // happens because browsers fire microtask ticks between event propagation.
  // the solution is simple: we save the timestamp when a handler is attached,
  // and the handler would only fire if the event passed to it was fired
  // AFTER it was attached.
  if (useMicrotaskFix) {
    var attachedTimestamp = currentFlushTimestamp;
    var original = handler;

    handler = original._wrapper = function (e) {
      if ( // no bubbling, should always fire.
      // this is just a safety net in case event.timeStamp is unreliable in
      // certain weird environments...
      e.target === e.currentTarget || // event is fired after handler attachment
      e.timeStamp >= attachedTimestamp || // bail for environments that have buggy event.timeStamp implementations
      // #9462 iOS 9 bug: event.timeStamp is 0 after history.pushState
      // #9681 QtWebEngine event.timeStamp is negative value
      e.timeStamp <= 0 || // #9448 bail if event is fired in another document in a multi-page
      // electron/nw.js app, since event.timeStamp will be using a different
      // starting reference
      e.target.ownerDocument !== document) {
        return original.apply(this, arguments);
      }
    };
  }

  target$1.addEventListener(name, handler, supportsPassive ? {
    capture: capture,
    passive: passive
  } : capture);
}

function remove$2(name, handler, capture, _target) {
  (_target || target$1).removeEventListener(name, handler._wrapper || handler, capture);
}

function updateDOMListeners(oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return;
  }

  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, createOnceHandler$1, vnode.context);
  target$1 = undefined;
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};
/*  */

var svgContainer;

function updateDOMProps(oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return;
  }

  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {}; // clone observed objects, as the user probably wants to mutate it

  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (!(key in props)) {
      elm[key] = '';
    }
  }

  for (key in props) {
    cur = props[key]; // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)

    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) {
        vnode.children.length = 0;
      }

      if (cur === oldProps[key]) {
        continue;
      } // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property


      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0]);
      }
    }

    if (key === 'value' && elm.tagName !== 'PROGRESS') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur; // avoid resetting cursor position when value is the same

      var strCur = isUndef(cur) ? '' : String(cur);

      if (shouldUpdateValue(elm, strCur)) {
        elm.value = strCur;
      }
    } else if (key === 'innerHTML' && isSVG(elm.tagName) && isUndef(elm.innerHTML)) {
      // IE doesn't support innerHTML for SVG elements
      svgContainer = svgContainer || document.createElement('div');
      svgContainer.innerHTML = "<svg>" + cur + "</svg>";
      var svg = svgContainer.firstChild;

      while (elm.firstChild) {
        elm.removeChild(elm.firstChild);
      }

      while (svg.firstChild) {
        elm.appendChild(svg.firstChild);
      }
    } else if ( // skip the update if old and new VDOM state is the same.
    // `value` is handled separately because the DOM value may be temporarily
    // out of sync with VDOM state due to focus, composition and modifiers.
    // This  #4521 by skipping the unnecesarry `checked` update.
    cur !== oldProps[key]) {
      // some property updates can throw
      // e.g. `value` on <progress> w/ non-finite value
      try {
        elm[key] = cur;
      } catch (e) {}
    }
  }
} // check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue(elm, checkVal) {
  return !elm.composing && (elm.tagName === 'OPTION' || isNotInFocusAndDirty(elm, checkVal) || isDirtyWithModifiers(elm, checkVal));
}

function isNotInFocusAndDirty(elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true; // #6157
  // work around IE bug when accessing document.activeElement in an iframe

  try {
    notInFocus = document.activeElement !== elm;
  } catch (e) {}

  return notInFocus && elm.value !== checkVal;
}

function isDirtyWithModifiers(elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime

  if (isDef(modifiers)) {
    if (modifiers.number) {
      return toNumber(value) !== toNumber(newVal);
    }

    if (modifiers.trim) {
      return value.trim() !== newVal.trim();
    }
  }

  return value !== newVal;
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};
/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res;
}); // merge static and dynamic style data on the same vnode

function normalizeStyleData(data) {
  var style = normalizeStyleBinding(data.style); // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it

  return data.staticStyle ? extend(data.staticStyle, style) : style;
} // normalize possible array / string values into Object


function normalizeStyleBinding(bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle);
  }

  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle);
  }

  return bindingStyle;
}
/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */


function getStyle(vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;

    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;

      if (childNode && childNode.data && (styleData = normalizeStyleData(childNode.data))) {
        extend(res, styleData);
      }
    }
  }

  if (styleData = normalizeStyleData(vnode.data)) {
    extend(res, styleData);
  }

  var parentNode = vnode;

  while (parentNode = parentNode.parent) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }

  return res;
}
/*  */


var cssVarRE = /^--/;
var importantRE = /\s*!important$/;

var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);

    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];
var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);

  if (prop !== 'filter' && prop in emptyStyle) {
    return prop;
  }

  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);

  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;

    if (name in emptyStyle) {
      return name;
    }
  }
});

function updateStyle(oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) && isUndef(oldData.staticStyle) && isUndef(oldData.style)) {
    return;
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {}; // if static style exists, stylebinding already merged into it when doing normalizeStyleData

  var oldStyle = oldStaticStyle || oldStyleBinding;
  var style = normalizeStyleBinding(vnode.data.style) || {}; // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.

  vnode.data.normalizedStyle = isDef(style.__ob__) ? extend({}, style) : style;
  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }

  for (name in newStyle) {
    cur = newStyle[name];

    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};
/*  */

var whitespaceRE = /\s+/;
/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */

function addClass(el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return;
  }
  /* istanbul ignore else */


  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(whitespaceRE).forEach(function (c) {
        return el.classList.add(c);
      });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";

    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}
/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */


function removeClass(el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return;
  }
  /* istanbul ignore else */


  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(whitespaceRE).forEach(function (c) {
        return el.classList.remove(c);
      });
    } else {
      el.classList.remove(cls);
    }

    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';

    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }

    cur = cur.trim();

    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}
/*  */


function resolveTransition(def$$1) {
  if (!def$$1) {
    return;
  }
  /* istanbul ignore else */


  if (typeof def$$1 === 'object') {
    var res = {};

    if (def$$1.css !== false) {
      extend(res, autoCssTransition(def$$1.name || 'v'));
    }

    extend(res, def$$1);
    return res;
  } else if (typeof def$$1 === 'string') {
    return autoCssTransition(def$$1);
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: name + "-enter",
    enterToClass: name + "-enter-to",
    enterActiveClass: name + "-enter-active",
    leaveClass: name + "-leave",
    leaveToClass: name + "-leave-to",
    leaveActiveClass: name + "-leave-active"
  };
});
var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation'; // Transition property/event sniffing

var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';

if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }

  if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
} // binding to window is necessary to make hot reload work in IE in strict mode


var raf = inBrowser ? window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : setTimeout :
/* istanbul ignore next */
function (fn) {
  return fn();
};

function nextFrame(fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass(el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);

  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass(el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }

  removeClass(el, cls);
}

function whenTransitionEnds(el, expectedType, cb) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;

  if (!type) {
    return cb();
  }

  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;

  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };

  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };

  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo(el, expectedType) {
  var styles = window.getComputedStyle(el); // JSDOM may return undefined for transition properties

  var transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', ');
  var transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = (styles[animationProp + 'Delay'] || '').split(', ');
  var animationDurations = (styles[animationProp + 'Duration'] || '').split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);
  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */

  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
    propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
  }

  var hasTransform = type === TRANSITION && transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  };
}

function getTimeout(delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i]);
  }));
} // Old versions of Chromium (below 61.0.3163.100) formats floating pointer numbers
// in a locale-dependent way, using a comma instead of a dot.
// If comma is not replaced with a dot, the input will be rounded down (i.e. acting
// as a floor function) causing unexpected behaviors


function toMs(s) {
  return Number(s.slice(0, -1).replace(',', '.')) * 1000;
}
/*  */


function enter(vnode, toggleDisplay) {
  var el = vnode.elm; // call leave callback now

  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;

    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);

  if (isUndef(data)) {
    return;
  }
  /* istanbul ignore if */


  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return;
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration; // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.

  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;

  while (transitionNode && transitionNode.parent) {
    context = transitionNode.context;
    transitionNode = transitionNode.parent;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return;
  }

  var startClass = isAppear && appearClass ? appearClass : enterClass;
  var activeClass = isAppear && appearActiveClass ? appearActiveClass : enterActiveClass;
  var toClass = isAppear && appearToClass ? appearToClass : enterToClass;
  var beforeEnterHook = isAppear ? beforeAppear || beforeEnter : beforeEnter;
  var enterHook = isAppear ? typeof appear === 'function' ? appear : enter : enter;
  var afterEnterHook = isAppear ? afterAppear || afterEnter : afterEnter;
  var enterCancelledHook = isAppear ? appearCancelled || enterCancelled : enterCancelled;
  var explicitEnterDuration = toNumber(isObject(duration) ? duration.enter : duration);

  if ("development" !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);
  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }

    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }

      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }

    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode, 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];

      if (pendingNode && pendingNode.tag === vnode.tag && pendingNode.elm._leaveCb) {
        pendingNode.elm._leaveCb();
      }

      enterHook && enterHook(el, cb);
    });
  } // start enter transition


  beforeEnterHook && beforeEnterHook(el);

  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      removeTransitionClass(el, startClass);

      if (!cb.cancelled) {
        addTransitionClass(el, toClass);

        if (!userWantsControl) {
          if (isValidDuration(explicitEnterDuration)) {
            setTimeout(cb, explicitEnterDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave(vnode, rm) {
  var el = vnode.elm; // call enter callback now

  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;

    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);

  if (isUndef(data) || el.nodeType !== 1) {
    return rm();
  }
  /* istanbul ignore if */


  if (isDef(el._leaveCb)) {
    return;
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;
  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);
  var explicitLeaveDuration = toNumber(isObject(duration) ? duration.leave : duration);

  if ("development" !== 'production' && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }

    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }

    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }

      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }

    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave() {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return;
    } // record leaving element


    if (!vnode.data.show && el.parentNode) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] = vnode;
    }

    beforeLeave && beforeLeave(el);

    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        removeTransitionClass(el, leaveClass);

        if (!cb.cancelled) {
          addTransitionClass(el, leaveToClass);

          if (!userWantsControl) {
            if (isValidDuration(explicitLeaveDuration)) {
              setTimeout(cb, explicitLeaveDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
        }
      });
    }

    leave && leave(el, cb);

    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
} // only used in dev mode


function checkDuration(val, name, vnode) {
  if (typeof val !== 'number') {
    warn("<transition> explicit " + name + " duration is not a valid number - " + "got " + JSON.stringify(val) + ".", vnode.context);
  } else if (isNaN(val)) {
    warn("<transition> explicit " + name + " duration is NaN - " + 'the duration expression might be incorrect.', vnode.context);
  }
}

function isValidDuration(val) {
  return typeof val === 'number' && !isNaN(val);
}
/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */


function getHookArgumentsLength(fn) {
  if (isUndef(fn)) {
    return false;
  }

  var invokerFns = fn.fns;

  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(Array.isArray(invokerFns) ? invokerFns[0] : invokerFns);
  } else {
    return (fn._length || fn.length) > 1;
  }
}

function _enter(_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1(vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};
var platformModules = [attrs, klass, events, domProps, style, transition];
/*  */
// the directive module should be applied last, after all
// built-in modules have been applied.

var modules = platformModules.concat(baseModules);
var patch = createPatchFunction({
  nodeOps: nodeOps,
  modules: modules
});
/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */

if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;

    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var directive = {
  inserted: function inserted(el, binding, vnode, oldVnode) {
    if (vnode.tag === 'select') {
      // #6903
      if (oldVnode.elm && !oldVnode.elm._vOptions) {
        mergeVNodeHook(vnode, 'postpatch', function () {
          directive.componentUpdated(el, binding, vnode);
        });
      } else {
        setSelected(el, binding, vnode.context);
      }

      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;

      if (!binding.modifiers.lazy) {
        el.addEventListener('compositionstart', onCompositionStart);
        el.addEventListener('compositionend', onCompositionEnd); // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.

        el.addEventListener('change', onCompositionEnd);
        /* istanbul ignore if */

        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },
  componentUpdated: function componentUpdated(el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context); // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.

      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);

      if (curOptions.some(function (o, i) {
        return !looseEqual(o, prevOptions[i]);
      })) {
        // trigger change event if
        // no matching option found for at least one value
        var needReset = el.multiple ? binding.value.some(function (v) {
          return hasNoMatchingOption(v, curOptions);
        }) : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);

        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  }
};

function setSelected(el, binding, vm) {
  actuallySetSelected(el, binding, vm);
  /* istanbul ignore if */

  if (isIE || isEdge) {
    setTimeout(function () {
      actuallySetSelected(el, binding, vm);
    }, 0);
  }
}

function actuallySetSelected(el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;

  if (isMultiple && !Array.isArray(value)) {
    "development" !== 'production' && warn("<select multiple v-model=\"" + binding.expression + "\"> " + "expects an Array value for its binding, but got " + Object.prototype.toString.call(value).slice(8, -1), vm);
    return;
  }

  var selected, option;

  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];

    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;

      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }

        return;
      }
    }
  }

  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption(value, options) {
  return options.every(function (o) {
    return !looseEqual(o, value);
  });
}

function getValue(option) {
  return '_value' in option ? option._value : option.value;
}

function onCompositionStart(e) {
  e.target.composing = true;
}

function onCompositionEnd(e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) {
    return;
  }

  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger(el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}
/*  */
// recursively search for possible transition defined inside the component root


function locateNode(vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition) ? locateNode(vnode.componentInstance._vnode) : vnode;
}

var show = {
  bind: function bind(el, ref, vnode) {
    var value = ref.value;
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay = el.style.display === 'none' ? '' : el.style.display;

    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },
  update: function update(el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;
    /* istanbul ignore if */

    if (!value === !oldValue) {
      return;
    }

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;

    if (transition$$1) {
      vnode.data.show = true;

      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },
  unbind: function unbind(el, binding, vnode, oldVnode, isDestroy) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};
var platformDirectives = {
  model: directive,
  show: show
};
/*  */

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
}; // in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered

function getRealChild(vnode) {
  var compOptions = vnode && vnode.componentOptions;

  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children));
  } else {
    return vnode;
  }
}

function extractTransitionData(comp) {
  var data = {};
  var options = comp.$options; // props

  for (var key in options.propsData) {
    data[key] = comp[key];
  } // events.
  // extract listeners and pass them directly to the transition methods


  var listeners = options._parentListeners;

  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }

  return data;
}

function placeholder(h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    });
  }
}

function hasParentTransition(vnode) {
  while (vnode = vnode.parent) {
    if (vnode.data.transition) {
      return true;
    }
  }
}

function isSameChild(child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag;
}

var isNotTextNode = function (c) {
  return c.tag || isAsyncPlaceholder(c);
};

var isVShowDirective = function (d) {
  return d.name === 'show';
};

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,
  render: function render(h) {
    var this$1 = this;
    var children = this.$slots.default;

    if (!children) {
      return;
    } // filter out text nodes (possible whitespaces)


    children = children.filter(isNotTextNode);
    /* istanbul ignore if */

    if (!children.length) {
      return;
    } // warn multiple elements


    if ("development" !== 'production' && children.length > 1) {
      warn('<transition> can only be used on a single element. Use ' + '<transition-group> for lists.', this.$parent);
    }

    var mode = this.mode; // warn invalid mode

    if ("development" !== 'production' && mode && mode !== 'in-out' && mode !== 'out-in') {
      warn('invalid <transition> mode: ' + mode, this.$parent);
    }

    var rawChild = children[0]; // if this is a component root node and the component's
    // parent container node also has transition, skip.

    if (hasParentTransition(this.$vnode)) {
      return rawChild;
    } // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive


    var child = getRealChild(rawChild);
    /* istanbul ignore if */

    if (!child) {
      return rawChild;
    }

    if (this._leaving) {
      return placeholder(h, rawChild);
    } // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.


    var id = "__transition-" + this._uid + "-";
    child.key = child.key == null ? child.isComment ? id + 'comment' : id + child.tag : isPrimitive(child.key) ? String(child.key).indexOf(id) === 0 ? child.key : id + child.key : child.key;
    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild); // mark v-show
    // so that the transition module can hand over the control to the directive

    if (child.data.directives && child.data.directives.some(isVShowDirective)) {
      child.data.show = true;
    }

    if (oldChild && oldChild.data && !isSameChild(child, oldChild) && !isAsyncPlaceholder(oldChild) && // #6687 component root is a comment node
    !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data); // handle transition mode

      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild);
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild;
        }

        var delayedLeave;

        var performLeave = function () {
          delayedLeave();
        };

        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) {
          delayedLeave = leave;
        });
      }
    }

    return rawChild;
  }
};
/*  */

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);
delete props.mode;
var TransitionGroup = {
  props: props,
  beforeMount: function beforeMount() {
    var this$1 = this;
    var update = this._update;

    this._update = function (vnode, hydrating) {
      var restoreActiveInstance = setActiveInstance(this$1); // force removing pass

      this$1.__patch__(this$1._vnode, this$1.kept, false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
      );

      this$1._vnode = this$1.kept;
      restoreActiveInstance();
      update.call(this$1, vnode, hydrating);
    };
  },
  render: function render(h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];

      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c;
          (c.data || (c.data = {})).transition = transitionData;
        } else if ("development" !== 'production') {
          var opts = c.componentOptions;
          var name = opts ? opts.Ctor.options.name || opts.tag || '' : c.tag;
          warn("<transition-group> children must be keyed: <" + name + ">");
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];

      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();

        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }

      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children);
  },
  updated: function updated() {
    var children = this.prevChildren;
    var moveClass = this.moveClass || (this.name || 'v') + '-move';

    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return;
    } // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.


    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation); // force reflow to put everything in position
    // assign to this to avoid being removed in tree-shaking
    // $flow-disable-line

    this._reflow = document.body.offsetHeight;
    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb(e) {
          if (e && e.target !== el) {
            return;
          }

          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },
  methods: {
    hasMove: function hasMove(el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false;
      }
      /* istanbul ignore if */


      if (this._hasMove) {
        return this._hasMove;
      } // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.


      var clone = el.cloneNode();

      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) {
          removeClass(clone, cls);
        });
      }

      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return this._hasMove = info.hasTransform;
    }
  }
};

function callPendingCbs(c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */


  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition(c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation(c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;

  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};
/*  */
// install platform specific utils

Vue.config.mustUseProp = mustUseProp;
Vue.config.isReservedTag = isReservedTag;
Vue.config.isReservedAttr = isReservedAttr;
Vue.config.getTagNamespace = getTagNamespace;
Vue.config.isUnknownElement = isUnknownElement; // install platform runtime directives & components

extend(Vue.options.directives, platformDirectives);
extend(Vue.options.components, platformComponents); // install platform patch function

Vue.prototype.__patch__ = inBrowser ? patch : noop; // public mount method

Vue.prototype.$mount = function (el, hydrating) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating);
}; // devtools global hook

/* istanbul ignore next */


if (inBrowser) {
  setTimeout(function () {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue);
      } else if ("development" !== 'production' && "development" !== 'test') {
        console[console.info ? 'info' : 'log']('Download the Vue Devtools extension for a better development experience:\n' + 'https://github.com/vuejs/vue-devtools');
      }
    }

    if ("development" !== 'production' && "development" !== 'test' && config.productionTip !== false && typeof console !== 'undefined') {
      console[console.info ? 'info' : 'log']("You are running Vue in development mode.\n" + "Make sure to turn on production mode when deploying for production.\n" + "See more tips at https://vuejs.org/guide/deployment.html");
    }
  }, 0);
}
/*  */


var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;
var buildRegex = cached(function (delimiters) {
  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g');
});

function parseText(text, delimiters) {
  var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;

  if (!tagRE.test(text)) {
    return;
  }

  var tokens = [];
  var rawTokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index, tokenValue;

  while (match = tagRE.exec(text)) {
    index = match.index; // push text token

    if (index > lastIndex) {
      rawTokens.push(tokenValue = text.slice(lastIndex, index));
      tokens.push(JSON.stringify(tokenValue));
    } // tag token


    var exp = parseFilters(match[1].trim());
    tokens.push("_s(" + exp + ")");
    rawTokens.push({
      '@binding': exp
    });
    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) {
    rawTokens.push(tokenValue = text.slice(lastIndex));
    tokens.push(JSON.stringify(tokenValue));
  }

  return {
    expression: tokens.join('+'),
    tokens: rawTokens
  };
}
/*  */


function transformNode(el, options) {
  var warn = options.warn || baseWarn;
  var staticClass = getAndRemoveAttr(el, 'class');

  if ("development" !== 'production' && staticClass) {
    var res = parseText(staticClass, options.delimiters);

    if (res) {
      warn("class=\"" + staticClass + "\": " + 'Interpolation inside attributes has been removed. ' + 'Use v-bind or the colon shorthand instead. For example, ' + 'instead of <div class="{{ val }}">, use <div :class="val">.', el.rawAttrsMap['class']);
    }
  }

  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }

  var classBinding = getBindingAttr(el, 'class', false
  /* getStatic */
  );

  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData(el) {
  var data = '';

  if (el.staticClass) {
    data += "staticClass:" + el.staticClass + ",";
  }

  if (el.classBinding) {
    data += "class:" + el.classBinding + ",";
  }

  return data;
}

var klass$1 = {
  staticKeys: ['staticClass'],
  transformNode: transformNode,
  genData: genData
};
/*  */

function transformNode$1(el, options) {
  var warn = options.warn || baseWarn;
  var staticStyle = getAndRemoveAttr(el, 'style');

  if (staticStyle) {
    /* istanbul ignore if */
    if ("development" !== 'production') {
      var res = parseText(staticStyle, options.delimiters);

      if (res) {
        warn("style=\"" + staticStyle + "\": " + 'Interpolation inside attributes has been removed. ' + 'Use v-bind or the colon shorthand instead. For example, ' + 'instead of <div style="{{ val }}">, use <div :style="val">.', el.rawAttrsMap['style']);
      }
    }

    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  var styleBinding = getBindingAttr(el, 'style', false
  /* getStatic */
  );

  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData$1(el) {
  var data = '';

  if (el.staticStyle) {
    data += "staticStyle:" + el.staticStyle + ",";
  }

  if (el.styleBinding) {
    data += "style:(" + el.styleBinding + "),";
  }

  return data;
}

var style$1 = {
  staticKeys: ['staticStyle'],
  transformNode: transformNode$1,
  genData: genData$1
};
/*  */

var decoder;
var he = {
  decode: function decode(html) {
    decoder = decoder || document.createElement('div');
    decoder.innerHTML = html;
    return decoder.textContent;
  }
};
/*  */

var isUnaryTag = makeMap('area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' + 'link,meta,param,source,track,wbr'); // Elements that you can, intentionally, leave open
// (and which close themselves)

var canBeLeftOpenTag = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'); // HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content

var isNonPhrasingTag = makeMap('address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' + 'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' + 'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' + 'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' + 'title,tr,track');
/**
 * Not type-checking this file because it's mostly vendor code.
 */
// Regular Expressions for parsing tags and attributes

var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
var dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z" + unicodeRegExp.source + "]*";
var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
var startTagOpen = new RegExp("^<" + qnameCapture);
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp("^<\\/" + qnameCapture + "[^>]*>");
var doctype = /^<!DOCTYPE [^>]+>/i; // #7298: escape - to avoid being passed as HTML comment when inlined in page

var comment = /^<!\--/;
var conditionalComment = /^<!\[/; // Special Elements (can contain anything)

var isPlainTextElement = makeMap('script,style,textarea', true);
var reCache = {};
var decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n',
  '&#9;': '\t',
  '&#39;': "'"
};
var encodedAttr = /&(?:lt|gt|quot|amp|#39);/g;
var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#39|#10|#9);/g; // #5992

var isIgnoreNewlineTag = makeMap('pre,textarea', true);

var shouldIgnoreFirstNewline = function (tag, html) {
  return tag && isIgnoreNewlineTag(tag) && html[0] === '\n';
};

function decodeAttr(value, shouldDecodeNewlines) {
  var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, function (match) {
    return decodingMap[match];
  });
}

function parseHTML(html, options) {
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
  var index = 0;
  var last, lastTag;

  while (html) {
    last = html; // Make sure we're not in a plaintext content element like script/style

    if (!lastTag || !isPlainTextElement(lastTag)) {
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {
        // Comment:
        if (comment.test(html)) {
          var commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) {
            if (options.shouldKeepComment) {
              options.comment(html.substring(4, commentEnd), index, index + commentEnd + 3);
            }

            advance(commentEnd + 3);
            continue;
          }
        } // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment


        if (conditionalComment.test(html)) {
          var conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue;
          }
        } // Doctype:


        var doctypeMatch = html.match(doctype);

        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue;
        } // End tag:


        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue;
        } // Start tag:


        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          handleStartTag(startTagMatch);

          if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
            advance(1);
          }

          continue;
        }
      }

      var text = void 0,
          rest = void 0,
          next = void 0;

      if (textEnd >= 0) {
        rest = html.slice(textEnd);

        while (!endTag.test(rest) && !startTagOpen.test(rest) && !comment.test(rest) && !conditionalComment.test(rest)) {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf('<', 1);

          if (next < 0) {
            break;
          }

          textEnd += next;
          rest = html.slice(textEnd);
        }

        text = html.substring(0, textEnd);
      }

      if (textEnd < 0) {
        text = html;
      }

      if (text) {
        advance(text.length);
      }

      if (options.chars && text) {
        options.chars(text, index - text.length, index);
      }
    } else {
      var endTagLength = 0;
      var stackedTag = lastTag.toLowerCase();
      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
      var rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length;

        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text.replace(/<!\--([\s\S]*?)-->/g, '$1') // #7298
          .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
        }

        if (shouldIgnoreFirstNewline(stackedTag, text)) {
          text = text.slice(1);
        }

        if (options.chars) {
          options.chars(text);
        }

        return '';
      });
      index += html.length - rest$1.length;
      html = rest$1;
      parseEndTag(stackedTag, index - endTagLength, index);
    }

    if (html === last) {
      options.chars && options.chars(html);

      if ("development" !== 'production' && !stack.length && options.warn) {
        options.warn("Mal-formatted tag at end of template: \"" + html + "\"", {
          start: index + html.length
        });
      }

      break;
    }
  } // Clean up any remaining tags


  parseEndTag();

  function advance(n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag() {
    var start = html.match(startTagOpen);

    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      var end, attr;

      while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
        attr.start = index;
        advance(attr[0].length);
        attr.end = index;
        match.attrs.push(attr);
      }

      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match;
      }
    }
  }

  function handleStartTag(match) {
    var tagName = match.tagName;
    var unarySlash = match.unarySlash;

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag);
      }

      if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
        parseEndTag(tagName);
      }
    }

    var unary = isUnaryTag$$1(tagName) || !!unarySlash;
    var l = match.attrs.length;
    var attrs = new Array(l);

    for (var i = 0; i < l; i++) {
      var args = match.attrs[i];
      var value = args[3] || args[4] || args[5] || '';
      var shouldDecodeNewlines = tagName === 'a' && args[1] === 'href' ? options.shouldDecodeNewlinesForHref : options.shouldDecodeNewlines;
      attrs[i] = {
        name: args[1],
        value: decodeAttr(value, shouldDecodeNewlines)
      };

      if ("development" !== 'production' && options.outputSourceRange) {
        attrs[i].start = args.start + args[0].match(/^\s*/).length;
        attrs[i].end = args.end;
      }
    }

    if (!unary) {
      stack.push({
        tag: tagName,
        lowerCasedTag: tagName.toLowerCase(),
        attrs: attrs,
        start: match.start,
        end: match.end
      });
      lastTag = tagName;
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag(tagName, start, end) {
    var pos, lowerCasedTagName;

    if (start == null) {
      start = index;
    }

    if (end == null) {
      end = index;
    } // Find the closest opened tag of the same type


    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();

      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break;
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) {
        if ("development" !== 'production' && (i > pos || !tagName) && options.warn) {
          options.warn("tag <" + stack[i].tag + "> has no matching end tag.", {
            start: stack[i].start,
            end: stack[i].end
          });
        }

        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      } // Remove the open elements from the stack


      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end);
      }

      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}
/*  */


var onRE = /^@|^v-on:/;
var dirRE = /^v-|^@|^:|^#/;
var forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
var forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
var stripParensRE = /^\(|\)$/g;
var dynamicArgRE = /^\[.*\]$/;
var argRE = /:(.*)$/;
var bindRE = /^:|^\.|^v-bind:/;
var modifierRE = /\.[^.\]]+(?=[^\]]*$)/g;
var slotRE = /^v-slot(:|$)|^#/;
var lineBreakRE = /[\r\n]/;
var whitespaceRE$1 = /\s+/g;
var invalidAttributeRE = /[\s"'<>\/=]/;
var decodeHTMLCached = cached(he.decode);
var emptySlotScopeToken = "_empty_"; // configurable state

var warn$2;
var delimiters;
var transforms;
var preTransforms;
var postTransforms;
var platformIsPreTag;
var platformMustUseProp;
var platformGetTagNamespace;
var maybeComponent;

function createASTElement(tag, attrs, parent) {
  return {
    type: 1,
    tag: tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    rawAttrsMap: {},
    parent: parent,
    children: []
  };
}
/**
 * Convert HTML string to AST.
 */


function parse(template, options) {
  warn$2 = options.warn || baseWarn;
  platformIsPreTag = options.isPreTag || no;
  platformMustUseProp = options.mustUseProp || no;
  platformGetTagNamespace = options.getTagNamespace || no;
  var isReservedTag = options.isReservedTag || no;

  maybeComponent = function (el) {
    return !!el.component || !isReservedTag(el.tag);
  };

  transforms = pluckModuleFunction(options.modules, 'transformNode');
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');
  delimiters = options.delimiters;
  var stack = [];
  var preserveWhitespace = options.preserveWhitespace !== false;
  var whitespaceOption = options.whitespace;
  var root;
  var currentParent;
  var inVPre = false;
  var inPre = false;
  var warned = false;

  function warnOnce(msg, range) {
    if (!warned) {
      warned = true;
      warn$2(msg, range);
    }
  }

  function closeElement(element) {
    trimEndingWhitespace(element);

    if (!inVPre && !element.processed) {
      element = processElement(element, options);
    } // tree management


    if (!stack.length && element !== root) {
      // allow root elements with v-if, v-else-if and v-else
      if (root.if && (element.elseif || element.else)) {
        if ("development" !== 'production') {
          checkRootConstraints(element);
        }

        addIfCondition(root, {
          exp: element.elseif,
          block: element
        });
      } else if ("development" !== 'production') {
        warnOnce("Component template should contain exactly one root element. " + "If you are using v-if on multiple elements, " + "use v-else-if to chain them instead.", {
          start: element.start
        });
      }
    }

    if (currentParent && !element.forbidden) {
      if (element.elseif || element.else) {
        processIfConditions(element, currentParent);
      } else {
        if (element.slotScope) {
          // scoped slot
          // keep it in the children list so that v-else(-if) conditions can
          // find it as the prev node.
          var name = element.slotTarget || '"default"';
          (currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
        }

        currentParent.children.push(element);
        element.parent = currentParent;
      }
    } // final children cleanup
    // filter out scoped slots


    element.children = element.children.filter(function (c) {
      return !c.slotScope;
    }); // remove trailing whitespace node again

    trimEndingWhitespace(element); // check pre state

    if (element.pre) {
      inVPre = false;
    }

    if (platformIsPreTag(element.tag)) {
      inPre = false;
    } // apply post-transforms


    for (var i = 0; i < postTransforms.length; i++) {
      postTransforms[i](element, options);
    }
  }

  function trimEndingWhitespace(el) {
    // remove trailing whitespace node
    if (!inPre) {
      var lastNode;

      while ((lastNode = el.children[el.children.length - 1]) && lastNode.type === 3 && lastNode.text === ' ') {
        el.children.pop();
      }
    }
  }

  function checkRootConstraints(el) {
    if (el.tag === 'slot' || el.tag === 'template') {
      warnOnce("Cannot use <" + el.tag + "> as component root element because it may " + 'contain multiple nodes.', {
        start: el.start
      });
    }

    if (el.attrsMap.hasOwnProperty('v-for')) {
      warnOnce('Cannot use v-for on stateful component root element because ' + 'it renders multiple elements.', el.rawAttrsMap['v-for']);
    }
  }

  parseHTML(template, {
    warn: warn$2,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
    shouldKeepComment: options.comments,
    outputSourceRange: options.outputSourceRange,
    start: function start(tag, attrs, unary, start$1, end) {
      // check namespace.
      // inherit parent ns if there is one
      var ns = currentParent && currentParent.ns || platformGetTagNamespace(tag); // handle IE svg bug

      /* istanbul ignore if */

      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs);
      }

      var element = createASTElement(tag, attrs, currentParent);

      if (ns) {
        element.ns = ns;
      }

      if ("development" !== 'production') {
        if (options.outputSourceRange) {
          element.start = start$1;
          element.end = end;
          element.rawAttrsMap = element.attrsList.reduce(function (cumulated, attr) {
            cumulated[attr.name] = attr;
            return cumulated;
          }, {});
        }

        attrs.forEach(function (attr) {
          if (invalidAttributeRE.test(attr.name)) {
            warn$2("Invalid dynamic argument expression: attribute names cannot contain " + "spaces, quotes, <, >, / or =.", {
              start: attr.start + attr.name.indexOf("["),
              end: attr.start + attr.name.length
            });
          }
        });
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true;
        "development" !== 'production' && warn$2('Templates should only be responsible for mapping the state to the ' + 'UI. Avoid placing tags with side-effects in your templates, such as ' + "<" + tag + ">" + ', as they will not be parsed.', {
          start: element.start
        });
      } // apply pre-transforms


      for (var i = 0; i < preTransforms.length; i++) {
        element = preTransforms[i](element, options) || element;
      }

      if (!inVPre) {
        processPre(element);

        if (element.pre) {
          inVPre = true;
        }
      }

      if (platformIsPreTag(element.tag)) {
        inPre = true;
      }

      if (inVPre) {
        processRawAttrs(element);
      } else if (!element.processed) {
        // structural directives
        processFor(element);
        processIf(element);
        processOnce(element);
      }

      if (!root) {
        root = element;

        if ("development" !== 'production') {
          checkRootConstraints(root);
        }
      }

      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        closeElement(element);
      }
    },
    end: function end(tag, start, end$1) {
      var element = stack[stack.length - 1]; // pop stack

      stack.length -= 1;
      currentParent = stack[stack.length - 1];

      if ("development" !== 'production' && options.outputSourceRange) {
        element.end = end$1;
      }

      closeElement(element);
    },
    chars: function chars(text, start, end) {
      if (!currentParent) {
        if ("development" !== 'production') {
          if (text === template) {
            warnOnce('Component template requires a root element, rather than just text.', {
              start: start
            });
          } else if (text = text.trim()) {
            warnOnce("text \"" + text + "\" outside root element will be ignored.", {
              start: start
            });
          }
        }

        return;
      } // IE textarea placeholder bug

      /* istanbul ignore if */


      if (isIE && currentParent.tag === 'textarea' && currentParent.attrsMap.placeholder === text) {
        return;
      }

      var children = currentParent.children;

      if (inPre || text.trim()) {
        text = isTextTag(currentParent) ? text : decodeHTMLCached(text);
      } else if (!children.length) {
        // remove the whitespace-only node right after an opening tag
        text = '';
      } else if (whitespaceOption) {
        if (whitespaceOption === 'condense') {
          // in condense mode, remove the whitespace node if it contains
          // line break, otherwise condense to a single space
          text = lineBreakRE.test(text) ? '' : ' ';
        } else {
          text = ' ';
        }
      } else {
        text = preserveWhitespace ? ' ' : '';
      }

      if (text) {
        if (!inPre && whitespaceOption === 'condense') {
          // condense consecutive whitespaces into single space
          text = text.replace(whitespaceRE$1, ' ');
        }

        var res;
        var child;

        if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
          child = {
            type: 2,
            expression: res.expression,
            tokens: res.tokens,
            text: text
          };
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          child = {
            type: 3,
            text: text
          };
        }

        if (child) {
          if ("development" !== 'production' && options.outputSourceRange) {
            child.start = start;
            child.end = end;
          }

          children.push(child);
        }
      }
    },
    comment: function comment(text, start, end) {
      // adding anyting as a sibling to the root node is forbidden
      // comments should still be allowed, but ignored
      if (currentParent) {
        var child = {
          type: 3,
          text: text,
          isComment: true
        };

        if ("development" !== 'production' && options.outputSourceRange) {
          child.start = start;
          child.end = end;
        }

        currentParent.children.push(child);
      }
    }
  });
  return root;
}

function processPre(el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true;
  }
}

function processRawAttrs(el) {
  var list = el.attrsList;
  var len = list.length;

  if (len) {
    var attrs = el.attrs = new Array(len);

    for (var i = 0; i < len; i++) {
      attrs[i] = {
        name: list[i].name,
        value: JSON.stringify(list[i].value)
      };

      if (list[i].start != null) {
        attrs[i].start = list[i].start;
        attrs[i].end = list[i].end;
      }
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}

function processElement(element, options) {
  processKey(element); // determine whether this is a plain element after
  // removing structural attributes

  element.plain = !element.key && !element.scopedSlots && !element.attrsList.length;
  processRef(element);
  processSlotContent(element);
  processSlotOutlet(element);
  processComponent(element);

  for (var i = 0; i < transforms.length; i++) {
    element = transforms[i](element, options) || element;
  }

  processAttrs(element);
  return element;
}

function processKey(el) {
  var exp = getBindingAttr(el, 'key');

  if (exp) {
    if ("development" !== 'production') {
      if (el.tag === 'template') {
        warn$2("<template> cannot be keyed. Place the key on real elements instead.", getRawBindingAttr(el, 'key'));
      }

      if (el.for) {
        var iterator = el.iterator2 || el.iterator1;
        var parent = el.parent;

        if (iterator && iterator === exp && parent && parent.tag === 'transition-group') {
          warn$2("Do not use v-for index as key on <transition-group> children, " + "this is the same as not using keys.", getRawBindingAttr(el, 'key'), true
          /* tip */
          );
        }
      }
    }

    el.key = exp;
  }
}

function processRef(el) {
  var ref = getBindingAttr(el, 'ref');

  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor(el);
  }
}

function processFor(el) {
  var exp;

  if (exp = getAndRemoveAttr(el, 'v-for')) {
    var res = parseFor(exp);

    if (res) {
      extend(el, res);
    } else if ("development" !== 'production') {
      warn$2("Invalid v-for expression: " + exp, el.rawAttrsMap['v-for']);
    }
  }
}

function parseFor(exp) {
  var inMatch = exp.match(forAliasRE);

  if (!inMatch) {
    return;
  }

  var res = {};
  res.for = inMatch[2].trim();
  var alias = inMatch[1].trim().replace(stripParensRE, '');
  var iteratorMatch = alias.match(forIteratorRE);

  if (iteratorMatch) {
    res.alias = alias.replace(forIteratorRE, '').trim();
    res.iterator1 = iteratorMatch[1].trim();

    if (iteratorMatch[2]) {
      res.iterator2 = iteratorMatch[2].trim();
    }
  } else {
    res.alias = alias;
  }

  return res;
}

function processIf(el) {
  var exp = getAndRemoveAttr(el, 'v-if');

  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true;
    }

    var elseif = getAndRemoveAttr(el, 'v-else-if');

    if (elseif) {
      el.elseif = elseif;
    }
  }
}

function processIfConditions(el, parent) {
  var prev = findPrevElement(parent.children);

  if (prev && prev.if) {
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    });
  } else if ("development" !== 'production') {
    warn$2("v-" + (el.elseif ? 'else-if="' + el.elseif + '"' : 'else') + " " + "used on element <" + el.tag + "> without corresponding v-if.", el.rawAttrsMap[el.elseif ? 'v-else-if' : 'v-else']);
  }
}

function findPrevElement(children) {
  var i = children.length;

  while (i--) {
    if (children[i].type === 1) {
      return children[i];
    } else {
      if ("development" !== 'production' && children[i].text !== ' ') {
        warn$2("text \"" + children[i].text.trim() + "\" between v-if and v-else(-if) " + "will be ignored.", children[i]);
      }

      children.pop();
    }
  }
}

function addIfCondition(el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }

  el.ifConditions.push(condition);
}

function processOnce(el) {
  var once$$1 = getAndRemoveAttr(el, 'v-once');

  if (once$$1 != null) {
    el.once = true;
  }
} // handle content being passed to a component as slot,
// e.g. <template slot="xxx">, <div slot-scope="xxx">


function processSlotContent(el) {
  var slotScope;

  if (el.tag === 'template') {
    slotScope = getAndRemoveAttr(el, 'scope');
    /* istanbul ignore if */

    if ("development" !== 'production' && slotScope) {
      warn$2("the \"scope\" attribute for scoped slots have been deprecated and " + "replaced by \"slot-scope\" since 2.5. The new \"slot-scope\" attribute " + "can also be used on plain elements in addition to <template> to " + "denote scoped slots.", el.rawAttrsMap['scope'], true);
    }

    el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope');
  } else if (slotScope = getAndRemoveAttr(el, 'slot-scope')) {
    /* istanbul ignore if */
    if ("development" !== 'production' && el.attrsMap['v-for']) {
      warn$2("Ambiguous combined usage of slot-scope and v-for on <" + el.tag + "> " + "(v-for takes higher priority). Use a wrapper <template> for the " + "scoped slot to make it clearer.", el.rawAttrsMap['slot-scope'], true);
    }

    el.slotScope = slotScope;
  } // slot="xxx"


  var slotTarget = getBindingAttr(el, 'slot');

  if (slotTarget) {
    el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
    el.slotTargetDynamic = !!(el.attrsMap[':slot'] || el.attrsMap['v-bind:slot']); // preserve slot as an attribute for native shadow DOM compat
    // only for non-scoped slots.

    if (el.tag !== 'template' && !el.slotScope) {
      addAttr(el, 'slot', slotTarget, getRawBindingAttr(el, 'slot'));
    }
  } // 2.6 v-slot syntax


  {
    if (el.tag === 'template') {
      // v-slot on <template>
      var slotBinding = getAndRemoveAttrByRegex(el, slotRE);

      if (slotBinding) {
        if ("development" !== 'production') {
          if (el.slotTarget || el.slotScope) {
            warn$2("Unexpected mixed usage of different slot syntaxes.", el);
          }

          if (el.parent && !maybeComponent(el.parent)) {
            warn$2("<template v-slot> can only appear at the root level inside " + "the receiving component", el);
          }
        }

        var ref = getSlotName(slotBinding);
        var name = ref.name;
        var dynamic = ref.dynamic;
        el.slotTarget = name;
        el.slotTargetDynamic = dynamic;
        el.slotScope = slotBinding.value || emptySlotScopeToken; // force it into a scoped slot for perf
      }
    } else {
      // v-slot on component, denotes default slot
      var slotBinding$1 = getAndRemoveAttrByRegex(el, slotRE);

      if (slotBinding$1) {
        if ("development" !== 'production') {
          if (!maybeComponent(el)) {
            warn$2("v-slot can only be used on components or <template>.", slotBinding$1);
          }

          if (el.slotScope || el.slotTarget) {
            warn$2("Unexpected mixed usage of different slot syntaxes.", el);
          }

          if (el.scopedSlots) {
            warn$2("To avoid scope ambiguity, the default slot should also use " + "<template> syntax when there are other named slots.", slotBinding$1);
          }
        } // add the component's children to its default slot


        var slots = el.scopedSlots || (el.scopedSlots = {});
        var ref$1 = getSlotName(slotBinding$1);
        var name$1 = ref$1.name;
        var dynamic$1 = ref$1.dynamic;
        var slotContainer = slots[name$1] = createASTElement('template', [], el);
        slotContainer.slotTarget = name$1;
        slotContainer.slotTargetDynamic = dynamic$1;
        slotContainer.children = el.children.filter(function (c) {
          if (!c.slotScope) {
            c.parent = slotContainer;
            return true;
          }
        });
        slotContainer.slotScope = slotBinding$1.value || emptySlotScopeToken; // remove children as they are returned from scopedSlots now

        el.children = []; // mark el non-plain so data gets generated

        el.plain = false;
      }
    }
  }
}

function getSlotName(binding) {
  var name = binding.name.replace(slotRE, '');

  if (!name) {
    if (binding.name[0] !== '#') {
      name = 'default';
    } else if ("development" !== 'production') {
      warn$2("v-slot shorthand syntax requires a slot name.", binding);
    }
  }

  return dynamicArgRE.test(name) // dynamic [name]
  ? {
    name: name.slice(1, -1),
    dynamic: true
  } // static name
  : {
    name: "\"" + name + "\"",
    dynamic: false
  };
} // handle <slot/> outlets


function processSlotOutlet(el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name');

    if ("development" !== 'production' && el.key) {
      warn$2("`key` does not work on <slot> because slots are abstract outlets " + "and can possibly expand into multiple elements. " + "Use the key on a wrapping element instead.", getRawBindingAttr(el, 'key'));
    }
  }
}

function processComponent(el) {
  var binding;

  if (binding = getBindingAttr(el, 'is')) {
    el.component = binding;
  }

  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true;
  }
}

function processAttrs(el) {
  var list = el.attrsList;
  var i, l, name, rawName, value, modifiers, syncGen, isDynamic;

  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;

    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true; // modifiers

      modifiers = parseModifiers(name.replace(dirRE, '')); // support .foo shorthand syntax for the .prop modifier

      if (modifiers) {
        name = name.replace(modifierRE, '');
      }

      if (bindRE.test(name)) {
        // v-bind
        name = name.replace(bindRE, '');
        value = parseFilters(value);
        isDynamic = dynamicArgRE.test(name);

        if (isDynamic) {
          name = name.slice(1, -1);
        }

        if ("development" !== 'production' && value.trim().length === 0) {
          warn$2("The value for a v-bind expression cannot be empty. Found in \"v-bind:" + name + "\"");
        }

        if (modifiers) {
          if (modifiers.prop && !isDynamic) {
            name = camelize(name);

            if (name === 'innerHtml') {
              name = 'innerHTML';
            }
          }

          if (modifiers.camel && !isDynamic) {
            name = camelize(name);
          }

          if (modifiers.sync) {
            syncGen = genAssignmentCode(value, "$event");

            if (!isDynamic) {
              addHandler(el, "update:" + camelize(name), syncGen, null, false, warn$2, list[i]);

              if (hyphenate(name) !== camelize(name)) {
                addHandler(el, "update:" + hyphenate(name), syncGen, null, false, warn$2, list[i]);
              }
            } else {
              // handler w/ dynamic event name
              addHandler(el, "\"update:\"+(" + name + ")", syncGen, null, false, warn$2, list[i], true // dynamic
              );
            }
          }
        }

        if (modifiers && modifiers.prop || !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)) {
          addProp(el, name, value, list[i], isDynamic);
        } else {
          addAttr(el, name, value, list[i], isDynamic);
        }
      } else if (onRE.test(name)) {
        // v-on
        name = name.replace(onRE, '');
        isDynamic = dynamicArgRE.test(name);

        if (isDynamic) {
          name = name.slice(1, -1);
        }

        addHandler(el, name, value, modifiers, false, warn$2, list[i], isDynamic);
      } else {
        // normal directives
        name = name.replace(dirRE, ''); // parse arg

        var argMatch = name.match(argRE);
        var arg = argMatch && argMatch[1];
        isDynamic = false;

        if (arg) {
          name = name.slice(0, -(arg.length + 1));

          if (dynamicArgRE.test(arg)) {
            arg = arg.slice(1, -1);
            isDynamic = true;
          }
        }

        addDirective(el, name, rawName, value, arg, isDynamic, modifiers, list[i]);

        if ("development" !== 'production' && name === 'model') {
          checkForAliasModel(el, value);
        }
      }
    } else {
      // literal attribute
      if ("development" !== 'production') {
        var res = parseText(value, delimiters);

        if (res) {
          warn$2(name + "=\"" + value + "\": " + 'Interpolation inside attributes has been removed. ' + 'Use v-bind or the colon shorthand instead. For example, ' + 'instead of <div id="{{ val }}">, use <div :id="val">.', list[i]);
        }
      }

      addAttr(el, name, JSON.stringify(value), list[i]); // #6887 firefox doesn't update muted state if set via attribute
      // even immediately after element creation

      if (!el.component && name === 'muted' && platformMustUseProp(el.tag, el.attrsMap.type, name)) {
        addProp(el, name, 'true', list[i]);
      }
    }
  }
}

function checkInFor(el) {
  var parent = el;

  while (parent) {
    if (parent.for !== undefined) {
      return true;
    }

    parent = parent.parent;
  }

  return false;
}

function parseModifiers(name) {
  var match = name.match(modifierRE);

  if (match) {
    var ret = {};
    match.forEach(function (m) {
      ret[m.slice(1)] = true;
    });
    return ret;
  }
}

function makeAttrsMap(attrs) {
  var map = {};

  for (var i = 0, l = attrs.length; i < l; i++) {
    if ("development" !== 'production' && map[attrs[i].name] && !isIE && !isEdge) {
      warn$2('duplicate attribute: ' + attrs[i].name, attrs[i]);
    }

    map[attrs[i].name] = attrs[i].value;
  }

  return map;
} // for script (e.g. type="x/template") or style, do not decode content


function isTextTag(el) {
  return el.tag === 'script' || el.tag === 'style';
}

function isForbiddenTag(el) {
  return el.tag === 'style' || el.tag === 'script' && (!el.attrsMap.type || el.attrsMap.type === 'text/javascript');
}

var ieNSBug = /^xmlns:NS\d+/;
var ieNSPrefix = /^NS\d+:/;
/* istanbul ignore next */

function guardIESVGBug(attrs) {
  var res = [];

  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];

    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '');
      res.push(attr);
    }
  }

  return res;
}

function checkForAliasModel(el, value) {
  var _el = el;

  while (_el) {
    if (_el.for && _el.alias === value) {
      warn$2("<" + el.tag + " v-model=\"" + value + "\">: " + "You are binding v-model directly to a v-for iteration alias. " + "This will not be able to modify the v-for source array because " + "writing to the alias is like modifying a function local variable. " + "Consider using an array of objects and use v-model on an object property instead.", el.rawAttrsMap['v-model']);
    }

    _el = _el.parent;
  }
}
/*  */


function preTransformNode(el, options) {
  if (el.tag === 'input') {
    var map = el.attrsMap;

    if (!map['v-model']) {
      return;
    }

    var typeBinding;

    if (map[':type'] || map['v-bind:type']) {
      typeBinding = getBindingAttr(el, 'type');
    }

    if (!map.type && !typeBinding && map['v-bind']) {
      typeBinding = "(" + map['v-bind'] + ").type";
    }

    if (typeBinding) {
      var ifCondition = getAndRemoveAttr(el, 'v-if', true);
      var ifConditionExtra = ifCondition ? "&&(" + ifCondition + ")" : "";
      var hasElse = getAndRemoveAttr(el, 'v-else', true) != null;
      var elseIfCondition = getAndRemoveAttr(el, 'v-else-if', true); // 1. checkbox

      var branch0 = cloneASTElement(el); // process for on the main node

      processFor(branch0);
      addRawAttr(branch0, 'type', 'checkbox');
      processElement(branch0, options);
      branch0.processed = true; // prevent it from double-processed

      branch0.if = "(" + typeBinding + ")==='checkbox'" + ifConditionExtra;
      addIfCondition(branch0, {
        exp: branch0.if,
        block: branch0
      }); // 2. add radio else-if condition

      var branch1 = cloneASTElement(el);
      getAndRemoveAttr(branch1, 'v-for', true);
      addRawAttr(branch1, 'type', 'radio');
      processElement(branch1, options);
      addIfCondition(branch0, {
        exp: "(" + typeBinding + ")==='radio'" + ifConditionExtra,
        block: branch1
      }); // 3. other

      var branch2 = cloneASTElement(el);
      getAndRemoveAttr(branch2, 'v-for', true);
      addRawAttr(branch2, ':type', typeBinding);
      processElement(branch2, options);
      addIfCondition(branch0, {
        exp: ifCondition,
        block: branch2
      });

      if (hasElse) {
        branch0.else = true;
      } else if (elseIfCondition) {
        branch0.elseif = elseIfCondition;
      }

      return branch0;
    }
  }
}

function cloneASTElement(el) {
  return createASTElement(el.tag, el.attrsList.slice(), el.parent);
}

var model$1 = {
  preTransformNode: preTransformNode
};
var modules$1 = [klass$1, style$1, model$1];
/*  */

function text(el, dir) {
  if (dir.value) {
    addProp(el, 'textContent', "_s(" + dir.value + ")", dir);
  }
}
/*  */


function html(el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', "_s(" + dir.value + ")", dir);
  }
}

var directives$1 = {
  model: model,
  text: text,
  html: html
};
/*  */

var baseOptions = {
  expectHTML: true,
  modules: modules$1,
  directives: directives$1,
  isPreTag: isPreTag,
  isUnaryTag: isUnaryTag,
  mustUseProp: mustUseProp,
  canBeLeftOpenTag: canBeLeftOpenTag,
  isReservedTag: isReservedTag,
  getTagNamespace: getTagNamespace,
  staticKeys: genStaticKeys(modules$1)
};
/*  */

var isStaticKey;
var isPlatformReservedTag;
var genStaticKeysCached = cached(genStaticKeys$1);
/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */

function optimize(root, options) {
  if (!root) {
    return;
  }

  isStaticKey = genStaticKeysCached(options.staticKeys || '');
  isPlatformReservedTag = options.isReservedTag || no; // first pass: mark all non-static nodes.

  markStatic$1(root); // second pass: mark static roots.

  markStaticRoots(root, false);
}

function genStaticKeys$1(keys) {
  return makeMap('type,tag,attrsList,attrsMap,plain,parent,children,attrs,start,end,rawAttrsMap' + (keys ? ',' + keys : ''));
}

function markStatic$1(node) {
  node.static = isStatic(node);

  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (!isPlatformReservedTag(node.tag) && node.tag !== 'slot' && node.attrsMap['inline-template'] == null) {
      return;
    }

    for (var i = 0, l = node.children.length; i < l; i++) {
      var child = node.children[i];
      markStatic$1(child);

      if (!child.static) {
        node.static = false;
      }
    }

    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        var block = node.ifConditions[i$1].block;
        markStatic$1(block);

        if (!block.static) {
          node.static = false;
        }
      }
    }
  }
}

function markStaticRoots(node, isInFor) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor;
    } // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.


    if (node.static && node.children.length && !(node.children.length === 1 && node.children[0].type === 3)) {
      node.staticRoot = true;
      return;
    } else {
      node.staticRoot = false;
    }

    if (node.children) {
      for (var i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }

    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        markStaticRoots(node.ifConditions[i$1].block, isInFor);
      }
    }
  }
}

function isStatic(node) {
  if (node.type === 2) {
    // expression
    return false;
  }

  if (node.type === 3) {
    // text
    return true;
  }

  return !!(node.pre || !node.hasBindings && // no dynamic bindings
  !node.if && !node.for && // not v-if or v-for or v-else
  !isBuiltInTag(node.tag) && // not a built-in
  isPlatformReservedTag(node.tag) && // not a component
  !isDirectChildOfTemplateFor(node) && Object.keys(node).every(isStaticKey));
}

function isDirectChildOfTemplateFor(node) {
  while (node.parent) {
    node = node.parent;

    if (node.tag !== 'template') {
      return false;
    }

    if (node.for) {
      return true;
    }
  }

  return false;
}
/*  */


var fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function(?:\s+[\w$]+)?\s*\(/;
var fnInvokeRE = /\([^)]*?\);*$/;
var simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/; // KeyboardEvent.keyCode aliases

var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
}; // KeyboardEvent.key aliases

var keyNames = {
  // #7880: IE11 and Edge use `Esc` for Escape key name.
  esc: ['Esc', 'Escape'],
  tab: 'Tab',
  enter: 'Enter',
  // #9112: IE11 uses `Spacebar` for Space key name.
  space: [' ', 'Spacebar'],
  // #7806: IE11 uses key names without `Arrow` prefix for arrow keys.
  up: ['Up', 'ArrowUp'],
  left: ['Left', 'ArrowLeft'],
  right: ['Right', 'ArrowRight'],
  down: ['Down', 'ArrowDown'],
  // #9112: IE11 uses `Del` for Delete key name.
  'delete': ['Backspace', 'Delete', 'Del']
}; // #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once

var genGuard = function (condition) {
  return "if(" + condition + ")return null;";
};

var modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard("$event.target !== $event.currentTarget"),
  ctrl: genGuard("!$event.ctrlKey"),
  shift: genGuard("!$event.shiftKey"),
  alt: genGuard("!$event.altKey"),
  meta: genGuard("!$event.metaKey"),
  left: genGuard("'button' in $event && $event.button !== 0"),
  middle: genGuard("'button' in $event && $event.button !== 1"),
  right: genGuard("'button' in $event && $event.button !== 2")
};

function genHandlers(events, isNative) {
  var prefix = isNative ? 'nativeOn:' : 'on:';
  var staticHandlers = "";
  var dynamicHandlers = "";

  for (var name in events) {
    var handlerCode = genHandler(events[name]);

    if (events[name] && events[name].dynamic) {
      dynamicHandlers += name + "," + handlerCode + ",";
    } else {
      staticHandlers += "\"" + name + "\":" + handlerCode + ",";
    }
  }

  staticHandlers = "{" + staticHandlers.slice(0, -1) + "}";

  if (dynamicHandlers) {
    return prefix + "_d(" + staticHandlers + ",[" + dynamicHandlers.slice(0, -1) + "])";
  } else {
    return prefix + staticHandlers;
  }
}

function genHandler(handler) {
  if (!handler) {
    return 'function(){}';
  }

  if (Array.isArray(handler)) {
    return "[" + handler.map(function (handler) {
      return genHandler(handler);
    }).join(',') + "]";
  }

  var isMethodPath = simplePathRE.test(handler.value);
  var isFunctionExpression = fnExpRE.test(handler.value);
  var isFunctionInvocation = simplePathRE.test(handler.value.replace(fnInvokeRE, ''));

  if (!handler.modifiers) {
    if (isMethodPath || isFunctionExpression) {
      return handler.value;
    }

    return "function($event){" + (isFunctionInvocation ? "return " + handler.value : handler.value) + "}"; // inline statement
  } else {
    var code = '';
    var genModifierCode = '';
    var keys = [];

    for (var key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key]; // left/right

        if (keyCodes[key]) {
          keys.push(key);
        }
      } else if (key === 'exact') {
        var modifiers = handler.modifiers;
        genModifierCode += genGuard(['ctrl', 'shift', 'alt', 'meta'].filter(function (keyModifier) {
          return !modifiers[keyModifier];
        }).map(function (keyModifier) {
          return "$event." + keyModifier + "Key";
        }).join('||'));
      } else {
        keys.push(key);
      }
    }

    if (keys.length) {
      code += genKeyFilter(keys);
    } // Make sure modifiers like prevent and stop get executed after key filtering


    if (genModifierCode) {
      code += genModifierCode;
    }

    var handlerCode = isMethodPath ? "return " + handler.value + "($event)" : isFunctionExpression ? "return (" + handler.value + ")($event)" : isFunctionInvocation ? "return " + handler.value : handler.value;
    return "function($event){" + code + handlerCode + "}";
  }
}

function genKeyFilter(keys) {
  return (// make sure the key filters only apply to KeyboardEvents
    // #9441: can't use 'keyCode' in $event because Chrome autofill fires fake
    // key events that do not have keyCode property...
    "if(!$event.type.indexOf('key')&&" + keys.map(genFilterCode).join('&&') + ")return null;"
  );
}

function genFilterCode(key) {
  var keyVal = parseInt(key, 10);

  if (keyVal) {
    return "$event.keyCode!==" + keyVal;
  }

  var keyCode = keyCodes[key];
  var keyName = keyNames[key];
  return "_k($event.keyCode," + JSON.stringify(key) + "," + JSON.stringify(keyCode) + "," + "$event.key," + "" + JSON.stringify(keyName) + ")";
}
/*  */


function on(el, dir) {
  if ("development" !== 'production' && dir.modifiers) {
    warn("v-on without argument does not support modifiers.");
  }

  el.wrapListeners = function (code) {
    return "_g(" + code + "," + dir.value + ")";
  };
}
/*  */


function bind$1(el, dir) {
  el.wrapData = function (code) {
    return "_b(" + code + ",'" + el.tag + "'," + dir.value + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")";
  };
}
/*  */


var baseDirectives = {
  on: on,
  bind: bind$1,
  cloak: noop
};
/*  */

var CodegenState = function CodegenState(options) {
  this.options = options;
  this.warn = options.warn || baseWarn;
  this.transforms = pluckModuleFunction(options.modules, 'transformCode');
  this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
  this.directives = extend(extend({}, baseDirectives), options.directives);
  var isReservedTag = options.isReservedTag || no;

  this.maybeComponent = function (el) {
    return !!el.component || !isReservedTag(el.tag);
  };

  this.onceId = 0;
  this.staticRenderFns = [];
  this.pre = false;
};

function generate(ast, options) {
  var state = new CodegenState(options);
  var code = ast ? genElement(ast, state) : '_c("div")';
  return {
    render: "with(this){return " + code + "}",
    staticRenderFns: state.staticRenderFns
  };
}

function genElement(el, state) {
  if (el.parent) {
    el.pre = el.pre || el.parent.pre;
  }

  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state);
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state);
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state);
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state);
  } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
    return genChildren(el, state) || 'void 0';
  } else if (el.tag === 'slot') {
    return genSlot(el, state);
  } else {
    // component or element
    var code;

    if (el.component) {
      code = genComponent(el.component, el, state);
    } else {
      var data;

      if (!el.plain || el.pre && state.maybeComponent(el)) {
        data = genData$2(el, state);
      }

      var children = el.inlineTemplate ? null : genChildren(el, state, true);
      code = "_c('" + el.tag + "'" + (data ? "," + data : '') + (children ? "," + children : '') + ")";
    } // module transforms


    for (var i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code);
    }

    return code;
  }
} // hoist static sub-trees out


function genStatic(el, state) {
  el.staticProcessed = true; // Some elements (templates) need to behave differently inside of a v-pre
  // node.  All pre nodes are static roots, so we can use this as a location to
  // wrap a state change and reset it upon exiting the pre node.

  var originalPreState = state.pre;

  if (el.pre) {
    state.pre = el.pre;
  }

  state.staticRenderFns.push("with(this){return " + genElement(el, state) + "}");
  state.pre = originalPreState;
  return "_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")";
} // v-once


function genOnce(el, state) {
  el.onceProcessed = true;

  if (el.if && !el.ifProcessed) {
    return genIf(el, state);
  } else if (el.staticInFor) {
    var key = '';
    var parent = el.parent;

    while (parent) {
      if (parent.for) {
        key = parent.key;
        break;
      }

      parent = parent.parent;
    }

    if (!key) {
      "development" !== 'production' && state.warn("v-once can only be used inside v-for that is keyed. ", el.rawAttrsMap['v-once']);
      return genElement(el, state);
    }

    return "_o(" + genElement(el, state) + "," + state.onceId++ + "," + key + ")";
  } else {
    return genStatic(el, state);
  }
}

function genIf(el, state, altGen, altEmpty) {
  el.ifProcessed = true; // avoid recursion

  return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty);
}

function genIfConditions(conditions, state, altGen, altEmpty) {
  if (!conditions.length) {
    return altEmpty || '_e()';
  }

  var condition = conditions.shift();

  if (condition.exp) {
    return "(" + condition.exp + ")?" + genTernaryExp(condition.block) + ":" + genIfConditions(conditions, state, altGen, altEmpty);
  } else {
    return "" + genTernaryExp(condition.block);
  } // v-if with v-once should generate code like (a)?_m(0):_m(1)


  function genTernaryExp(el) {
    return altGen ? altGen(el, state) : el.once ? genOnce(el, state) : genElement(el, state);
  }
}

function genFor(el, state, altGen, altHelper) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? "," + el.iterator1 : '';
  var iterator2 = el.iterator2 ? "," + el.iterator2 : '';

  if ("development" !== 'production' && state.maybeComponent(el) && el.tag !== 'slot' && el.tag !== 'template' && !el.key) {
    state.warn("<" + el.tag + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " + "v-for should have explicit keys. " + "See https://vuejs.org/guide/list.html#key for more info.", el.rawAttrsMap['v-for'], true
    /* tip */
    );
  }

  el.forProcessed = true; // avoid recursion

  return (altHelper || '_l') + "((" + exp + ")," + "function(" + alias + iterator1 + iterator2 + "){" + "return " + (altGen || genElement)(el, state) + '})';
}

function genData$2(el, state) {
  var data = '{'; // directives first.
  // directives may mutate the el's other properties before they are generated.

  var dirs = genDirectives(el, state);

  if (dirs) {
    data += dirs + ',';
  } // key


  if (el.key) {
    data += "key:" + el.key + ",";
  } // ref


  if (el.ref) {
    data += "ref:" + el.ref + ",";
  }

  if (el.refInFor) {
    data += "refInFor:true,";
  } // pre


  if (el.pre) {
    data += "pre:true,";
  } // record original tag name for components using "is" attribute


  if (el.component) {
    data += "tag:\"" + el.tag + "\",";
  } // module data generation functions


  for (var i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el);
  } // attributes


  if (el.attrs) {
    data += "attrs:" + genProps(el.attrs) + ",";
  } // DOM props


  if (el.props) {
    data += "domProps:" + genProps(el.props) + ",";
  } // event handlers


  if (el.events) {
    data += genHandlers(el.events, false) + ",";
  }

  if (el.nativeEvents) {
    data += genHandlers(el.nativeEvents, true) + ",";
  } // slot target
  // only for non-scoped slots


  if (el.slotTarget && !el.slotScope) {
    data += "slot:" + el.slotTarget + ",";
  } // scoped slots


  if (el.scopedSlots) {
    data += genScopedSlots(el, el.scopedSlots, state) + ",";
  } // component v-model


  if (el.model) {
    data += "model:{value:" + el.model.value + ",callback:" + el.model.callback + ",expression:" + el.model.expression + "},";
  } // inline-template


  if (el.inlineTemplate) {
    var inlineTemplate = genInlineTemplate(el, state);

    if (inlineTemplate) {
      data += inlineTemplate + ",";
    }
  }

  data = data.replace(/,$/, '') + '}'; // v-bind dynamic argument wrap
  // v-bind with dynamic arguments must be applied using the same v-bind object
  // merge helper so that class/style/mustUseProp attrs are handled correctly.

  if (el.dynamicAttrs) {
    data = "_b(" + data + ",\"" + el.tag + "\"," + genProps(el.dynamicAttrs) + ")";
  } // v-bind data wrap


  if (el.wrapData) {
    data = el.wrapData(data);
  } // v-on data wrap


  if (el.wrapListeners) {
    data = el.wrapListeners(data);
  }

  return data;
}

function genDirectives(el, state) {
  var dirs = el.directives;

  if (!dirs) {
    return;
  }

  var res = 'directives:[';
  var hasRuntime = false;
  var i, l, dir, needRuntime;

  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    var gen = state.directives[dir.name];

    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, state.warn);
    }

    if (needRuntime) {
      hasRuntime = true;
      res += "{name:\"" + dir.name + "\",rawName:\"" + dir.rawName + "\"" + (dir.value ? ",value:(" + dir.value + "),expression:" + JSON.stringify(dir.value) : '') + (dir.arg ? ",arg:" + (dir.isDynamicArg ? dir.arg : "\"" + dir.arg + "\"") : '') + (dir.modifiers ? ",modifiers:" + JSON.stringify(dir.modifiers) : '') + "},";
    }
  }

  if (hasRuntime) {
    return res.slice(0, -1) + ']';
  }
}

function genInlineTemplate(el, state) {
  var ast = el.children[0];

  if ("development" !== 'production' && (el.children.length !== 1 || ast.type !== 1)) {
    state.warn('Inline-template components must have exactly one child element.', {
      start: el.start
    });
  }

  if (ast && ast.type === 1) {
    var inlineRenderFns = generate(ast, state.options);
    return "inlineTemplate:{render:function(){" + inlineRenderFns.render + "},staticRenderFns:[" + inlineRenderFns.staticRenderFns.map(function (code) {
      return "function(){" + code + "}";
    }).join(',') + "]}";
  }
}

function genScopedSlots(el, slots, state) {
  // by default scoped slots are considered "stable", this allows child
  // components with only scoped slots to skip forced updates from parent.
  // but in some cases we have to bail-out of this optimization
  // for example if the slot contains dynamic names, has v-if or v-for on them...
  var needsForceUpdate = el.for || Object.keys(slots).some(function (key) {
    var slot = slots[key];
    return slot.slotTargetDynamic || slot.if || slot.for || containsSlotChild(slot) // is passing down slot from parent which may be dynamic
    ;
  }); // #9534: if a component with scoped slots is inside a conditional branch,
  // it's possible for the same component to be reused but with different
  // compiled slot content. To avoid that, we generate a unique key based on
  // the generated code of all the slot contents.

  var needsKey = !!el.if; // OR when it is inside another scoped slot or v-for (the reactivity may be
  // disconnected due to the intermediate scope variable)
  // #9438, #9506
  // TODO: this can be further optimized by properly analyzing in-scope bindings
  // and skip force updating ones that do not actually use scope variables.

  if (!needsForceUpdate) {
    var parent = el.parent;

    while (parent) {
      if (parent.slotScope && parent.slotScope !== emptySlotScopeToken || parent.for) {
        needsForceUpdate = true;
        break;
      }

      if (parent.if) {
        needsKey = true;
      }

      parent = parent.parent;
    }
  }

  var generatedSlots = Object.keys(slots).map(function (key) {
    return genScopedSlot(slots[key], state);
  }).join(',');
  return "scopedSlots:_u([" + generatedSlots + "]" + (needsForceUpdate ? ",null,true" : "") + (!needsForceUpdate && needsKey ? ",null,false," + hash(generatedSlots) : "") + ")";
}

function hash(str) {
  var hash = 5381;
  var i = str.length;

  while (i) {
    hash = hash * 33 ^ str.charCodeAt(--i);
  }

  return hash >>> 0;
}

function containsSlotChild(el) {
  if (el.type === 1) {
    if (el.tag === 'slot') {
      return true;
    }

    return el.children.some(containsSlotChild);
  }

  return false;
}

function genScopedSlot(el, state) {
  var isLegacySyntax = el.attrsMap['slot-scope'];

  if (el.if && !el.ifProcessed && !isLegacySyntax) {
    return genIf(el, state, genScopedSlot, "null");
  }

  if (el.for && !el.forProcessed) {
    return genFor(el, state, genScopedSlot);
  }

  var slotScope = el.slotScope === emptySlotScopeToken ? "" : String(el.slotScope);
  var fn = "function(" + slotScope + "){" + "return " + (el.tag === 'template' ? el.if && isLegacySyntax ? "(" + el.if + ")?" + (genChildren(el, state) || 'undefined') + ":undefined" : genChildren(el, state) || 'undefined' : genElement(el, state)) + "}"; // reverse proxy v-slot without scope on this.$slots

  var reverseProxy = slotScope ? "" : ",proxy:true";
  return "{key:" + (el.slotTarget || "\"default\"") + ",fn:" + fn + reverseProxy + "}";
}

function genChildren(el, state, checkSkip, altGenElement, altGenNode) {
  var children = el.children;

  if (children.length) {
    var el$1 = children[0]; // optimize single v-for

    if (children.length === 1 && el$1.for && el$1.tag !== 'template' && el$1.tag !== 'slot') {
      var normalizationType = checkSkip ? state.maybeComponent(el$1) ? ",1" : ",0" : "";
      return "" + (altGenElement || genElement)(el$1, state) + normalizationType;
    }

    var normalizationType$1 = checkSkip ? getNormalizationType(children, state.maybeComponent) : 0;
    var gen = altGenNode || genNode;
    return "[" + children.map(function (c) {
      return gen(c, state);
    }).join(',') + "]" + (normalizationType$1 ? "," + normalizationType$1 : '');
  }
} // determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed


function getNormalizationType(children, maybeComponent) {
  var res = 0;

  for (var i = 0; i < children.length; i++) {
    var el = children[i];

    if (el.type !== 1) {
      continue;
    }

    if (needsNormalization(el) || el.ifConditions && el.ifConditions.some(function (c) {
      return needsNormalization(c.block);
    })) {
      res = 2;
      break;
    }

    if (maybeComponent(el) || el.ifConditions && el.ifConditions.some(function (c) {
      return maybeComponent(c.block);
    })) {
      res = 1;
    }
  }

  return res;
}

function needsNormalization(el) {
  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot';
}

function genNode(node, state) {
  if (node.type === 1) {
    return genElement(node, state);
  } else if (node.type === 3 && node.isComment) {
    return genComment(node);
  } else {
    return genText(node);
  }
}

function genText(text) {
  return "_v(" + (text.type === 2 ? text.expression // no need for () because already wrapped in _s()
  : transformSpecialNewlines(JSON.stringify(text.text))) + ")";
}

function genComment(comment) {
  return "_e(" + JSON.stringify(comment.text) + ")";
}

function genSlot(el, state) {
  var slotName = el.slotName || '"default"';
  var children = genChildren(el, state);
  var res = "_t(" + slotName + (children ? "," + children : '');
  var attrs = el.attrs || el.dynamicAttrs ? genProps((el.attrs || []).concat(el.dynamicAttrs || []).map(function (attr) {
    return {
      // slot props are camelized
      name: camelize(attr.name),
      value: attr.value,
      dynamic: attr.dynamic
    };
  })) : null;
  var bind$$1 = el.attrsMap['v-bind'];

  if ((attrs || bind$$1) && !children) {
    res += ",null";
  }

  if (attrs) {
    res += "," + attrs;
  }

  if (bind$$1) {
    res += (attrs ? '' : ',null') + "," + bind$$1;
  }

  return res + ')';
} // componentName is el.component, take it as argument to shun flow's pessimistic refinement


function genComponent(componentName, el, state) {
  var children = el.inlineTemplate ? null : genChildren(el, state, true);
  return "_c(" + componentName + "," + genData$2(el, state) + (children ? "," + children : '') + ")";
}

function genProps(props) {
  var staticProps = "";
  var dynamicProps = "";

  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    var value = transformSpecialNewlines(prop.value);

    if (prop.dynamic) {
      dynamicProps += prop.name + "," + value + ",";
    } else {
      staticProps += "\"" + prop.name + "\":" + value + ",";
    }
  }

  staticProps = "{" + staticProps.slice(0, -1) + "}";

  if (dynamicProps) {
    return "_d(" + staticProps + ",[" + dynamicProps.slice(0, -1) + "])";
  } else {
    return staticProps;
  }
} // #3895, #4268


function transformSpecialNewlines(text) {
  return text.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}
/*  */
// these keywords should not appear inside expressions, but operators like
// typeof, instanceof and in are allowed


var prohibitedKeywordRE = new RegExp('\\b' + ('do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' + 'super,throw,while,yield,delete,export,import,return,switch,default,' + 'extends,finally,continue,debugger,function,arguments').split(',').join('\\b|\\b') + '\\b'); // these unary operators should not be used as property/method names

var unaryOperatorsRE = new RegExp('\\b' + 'delete,typeof,void'.split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)'); // strip strings in expressions

var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g; // detect problematic expressions in a template

function detectErrors(ast, warn) {
  if (ast) {
    checkNode(ast, warn);
  }
}

function checkNode(node, warn) {
  if (node.type === 1) {
    for (var name in node.attrsMap) {
      if (dirRE.test(name)) {
        var value = node.attrsMap[name];

        if (value) {
          var range = node.rawAttrsMap[name];

          if (name === 'v-for') {
            checkFor(node, "v-for=\"" + value + "\"", warn, range);
          } else if (name === 'v-slot' || name[0] === '#') {
            checkFunctionParameterExpression(value, name + "=\"" + value + "\"", warn, range);
          } else if (onRE.test(name)) {
            checkEvent(value, name + "=\"" + value + "\"", warn, range);
          } else {
            checkExpression(value, name + "=\"" + value + "\"", warn, range);
          }
        }
      }
    }

    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        checkNode(node.children[i], warn);
      }
    }
  } else if (node.type === 2) {
    checkExpression(node.expression, node.text, warn, node);
  }
}

function checkEvent(exp, text, warn, range) {
  var stripped = exp.replace(stripStringRE, '');
  var keywordMatch = stripped.match(unaryOperatorsRE);

  if (keywordMatch && stripped.charAt(keywordMatch.index - 1) !== '$') {
    warn("avoid using JavaScript unary operator as property name: " + "\"" + keywordMatch[0] + "\" in expression " + text.trim(), range);
  }

  checkExpression(exp, text, warn, range);
}

function checkFor(node, text, warn, range) {
  checkExpression(node.for || '', text, warn, range);
  checkIdentifier(node.alias, 'v-for alias', text, warn, range);
  checkIdentifier(node.iterator1, 'v-for iterator', text, warn, range);
  checkIdentifier(node.iterator2, 'v-for iterator', text, warn, range);
}

function checkIdentifier(ident, type, text, warn, range) {
  if (typeof ident === 'string') {
    try {
      new Function("var " + ident + "=_");
    } catch (e) {
      warn("invalid " + type + " \"" + ident + "\" in expression: " + text.trim(), range);
    }
  }
}

function checkExpression(exp, text, warn, range) {
  try {
    new Function("return " + exp);
  } catch (e) {
    var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);

    if (keywordMatch) {
      warn("avoid using JavaScript keyword as property name: " + "\"" + keywordMatch[0] + "\"\n  Raw expression: " + text.trim(), range);
    } else {
      warn("invalid expression: " + e.message + " in\n\n" + "    " + exp + "\n\n" + "  Raw expression: " + text.trim() + "\n", range);
    }
  }
}

function checkFunctionParameterExpression(exp, text, warn, range) {
  try {
    new Function(exp, '');
  } catch (e) {
    warn("invalid function parameter expression: " + e.message + " in\n\n" + "    " + exp + "\n\n" + "  Raw expression: " + text.trim() + "\n", range);
  }
}
/*  */


var range = 2;

function generateCodeFrame(source, start, end) {
  if (start === void 0) start = 0;
  if (end === void 0) end = source.length;
  var lines = source.split(/\r?\n/);
  var count = 0;
  var res = [];

  for (var i = 0; i < lines.length; i++) {
    count += lines[i].length + 1;

    if (count >= start) {
      for (var j = i - range; j <= i + range || end > count; j++) {
        if (j < 0 || j >= lines.length) {
          continue;
        }

        res.push("" + (j + 1) + repeat$1(" ", 3 - String(j + 1).length) + "|  " + lines[j]);
        var lineLength = lines[j].length;

        if (j === i) {
          // push underline
          var pad = start - (count - lineLength) + 1;
          var length = end > count ? lineLength - pad : end - start;
          res.push("   |  " + repeat$1(" ", pad) + repeat$1("^", length));
        } else if (j > i) {
          if (end > count) {
            var length$1 = Math.min(end - count, lineLength);
            res.push("   |  " + repeat$1("^", length$1));
          }

          count += lineLength + 1;
        }
      }

      break;
    }
  }

  return res.join('\n');
}

function repeat$1(str, n) {
  var result = '';

  if (n > 0) {
    while (true) {
      // eslint-disable-line
      if (n & 1) {
        result += str;
      }

      n >>>= 1;

      if (n <= 0) {
        break;
      }

      str += str;
    }
  }

  return result;
}
/*  */


function createFunction(code, errors) {
  try {
    return new Function(code);
  } catch (err) {
    errors.push({
      err: err,
      code: code
    });
    return noop;
  }
}

function createCompileToFunctionFn(compile) {
  var cache = Object.create(null);
  return function compileToFunctions(template, options, vm) {
    options = extend({}, options);
    var warn$$1 = options.warn || warn;
    delete options.warn;
    /* istanbul ignore if */

    if ("development" !== 'production') {
      // detect possible CSP restriction
      try {
        new Function('return 1');
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn$$1('It seems you are using the standalone build of Vue.js in an ' + 'environment with Content Security Policy that prohibits unsafe-eval. ' + 'The template compiler cannot work in this environment. Consider ' + 'relaxing the policy to allow unsafe-eval or pre-compiling your ' + 'templates into render functions.');
        }
      }
    } // check cache


    var key = options.delimiters ? String(options.delimiters) + template : template;

    if (cache[key]) {
      return cache[key];
    } // compile


    var compiled = compile(template, options); // check compilation errors/tips

    if ("development" !== 'production') {
      if (compiled.errors && compiled.errors.length) {
        if (options.outputSourceRange) {
          compiled.errors.forEach(function (e) {
            warn$$1("Error compiling template:\n\n" + e.msg + "\n\n" + generateCodeFrame(template, e.start, e.end), vm);
          });
        } else {
          warn$$1("Error compiling template:\n\n" + template + "\n\n" + compiled.errors.map(function (e) {
            return "- " + e;
          }).join('\n') + '\n', vm);
        }
      }

      if (compiled.tips && compiled.tips.length) {
        if (options.outputSourceRange) {
          compiled.tips.forEach(function (e) {
            return tip(e.msg, vm);
          });
        } else {
          compiled.tips.forEach(function (msg) {
            return tip(msg, vm);
          });
        }
      }
    } // turn code into functions


    var res = {};
    var fnGenErrors = [];
    res.render = createFunction(compiled.render, fnGenErrors);
    res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
      return createFunction(code, fnGenErrors);
    }); // check function generation errors.
    // this should only happen if there is a bug in the compiler itself.
    // mostly for codegen development use

    /* istanbul ignore if */

    if ("development" !== 'production') {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn$$1("Failed to generate render function:\n\n" + fnGenErrors.map(function (ref) {
          var err = ref.err;
          var code = ref.code;
          return err.toString() + " in\n\n" + code + "\n";
        }).join('\n'), vm);
      }
    }

    return cache[key] = res;
  };
}
/*  */


function createCompilerCreator(baseCompile) {
  return function createCompiler(baseOptions) {
    function compile(template, options) {
      var finalOptions = Object.create(baseOptions);
      var errors = [];
      var tips = [];

      var warn = function (msg, range, tip) {
        (tip ? tips : errors).push(msg);
      };

      if (options) {
        if ("development" !== 'production' && options.outputSourceRange) {
          // $flow-disable-line
          var leadingSpaceLength = template.match(/^\s*/)[0].length;

          warn = function (msg, range, tip) {
            var data = {
              msg: msg
            };

            if (range) {
              if (range.start != null) {
                data.start = range.start + leadingSpaceLength;
              }

              if (range.end != null) {
                data.end = range.end + leadingSpaceLength;
              }
            }

            (tip ? tips : errors).push(data);
          };
        } // merge custom modules


        if (options.modules) {
          finalOptions.modules = (baseOptions.modules || []).concat(options.modules);
        } // merge custom directives


        if (options.directives) {
          finalOptions.directives = extend(Object.create(baseOptions.directives || null), options.directives);
        } // copy other options


        for (var key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key];
          }
        }
      }

      finalOptions.warn = warn;
      var compiled = baseCompile(template.trim(), finalOptions);

      if ("development" !== 'production') {
        detectErrors(compiled.ast, warn);
      }

      compiled.errors = errors;
      compiled.tips = tips;
      return compiled;
    }

    return {
      compile: compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    };
  };
}
/*  */
// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.


var createCompiler = createCompilerCreator(function baseCompile(template, options) {
  var ast = parse(template.trim(), options);

  if (options.optimize !== false) {
    optimize(ast, options);
  }

  var code = generate(ast, options);
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  };
});
/*  */

var ref$1 = createCompiler(baseOptions);
var compile = ref$1.compile;
var compileToFunctions = ref$1.compileToFunctions;
/*  */
// check whether current browser encodes a char inside attribute values

var div;

function getShouldDecode(href) {
  div = div || document.createElement('div');
  div.innerHTML = href ? "<a href=\"\n\"/>" : "<div a=\"\n\"/>";
  return div.innerHTML.indexOf('&#10;') > 0;
} // #3663: IE encodes newlines inside attribute values while other browsers don't


var shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false; // #6828: chrome encodes content in a[href]

var shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false;
/*  */

var idToTemplate = cached(function (id) {
  var el = query(id);
  return el && el.innerHTML;
});
var mount = Vue.prototype.$mount;

Vue.prototype.$mount = function (el, hydrating) {
  el = el && query(el);
  /* istanbul ignore if */

  if (el === document.body || el === document.documentElement) {
    "development" !== 'production' && warn("Do not mount Vue to <html> or <body> - mount to normal elements instead.");
    return this;
  }

  var options = this.$options; // resolve template/el and convert to render function

  if (!options.render) {
    var template = options.template;

    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template);
          /* istanbul ignore if */

          if ("development" !== 'production' && !template) {
            warn("Template element not found or is empty: " + options.template, this);
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        if ("development" !== 'production') {
          warn('invalid template option:' + template, this);
        }

        return this;
      }
    } else if (el) {
      template = getOuterHTML(el);
    }

    if (template) {
      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        mark('compile');
      }

      var ref = compileToFunctions(template, {
        outputSourceRange: "development" !== 'production',
        shouldDecodeNewlines: shouldDecodeNewlines,
        shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this);
      var render = ref.render;
      var staticRenderFns = ref.staticRenderFns;
      options.render = render;
      options.staticRenderFns = staticRenderFns;
      /* istanbul ignore if */

      if ("development" !== 'production' && config.performance && mark) {
        mark('compile end');
        measure("vue " + this._name + " compile", 'compile', 'compile end');
      }
    }
  }

  return mount.call(this, el, hydrating);
};
/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */


function getOuterHTML(el) {
  if (el.outerHTML) {
    return el.outerHTML;
  } else {
    var container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML;
  }
}

Vue.compile = compileToFunctions;
var _default = Vue;
exports.default = _default;
},{}],"../../../../../node_modules/portal-vue/dist/portal-vue.common.js":[function(require,module,exports) {

 /*! 
  * portal-vue © Thorsten Lünborg, 2019 
  * 
  * Version: 2.1.7
  * 
  * LICENCE: MIT 
  * 
  * https://github.com/linusborg/portal-vue
  * 
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Vue = _interopDefault(require('vue'));

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var inBrowser = typeof window !== 'undefined';
function freeze(item) {
  if (Array.isArray(item) || _typeof(item) === 'object') {
    return Object.freeze(item);
  }

  return item;
}
function combinePassengers(transports) {
  var slotProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return transports.reduce(function (passengers, transport) {
    var temp = transport.passengers[0];
    var newPassengers = typeof temp === 'function' ? temp(slotProps) : transport.passengers;
    return passengers.concat(newPassengers);
  }, []);
}
function stableSort(array, compareFn) {
  return array.map(function (v, idx) {
    return [idx, v];
  }).sort(function (a, b) {
    return compareFn(a[1], b[1]) || a[0] - b[0];
  }).map(function (c) {
    return c[1];
  });
}
function pick(obj, keys) {
  return keys.reduce(function (acc, key) {
    if (obj.hasOwnProperty(key)) {
      acc[key] = obj[key];
    }

    return acc;
  }, {});
}

var transports = {};
var targets = {};
var sources = {};
var Wormhole = Vue.extend({
  data: function data() {
    return {
      transports: transports,
      targets: targets,
      sources: sources,
      trackInstances: inBrowser
    };
  },
  methods: {
    open: function open(transport) {
      if (!inBrowser) return;
      var to = transport.to,
          from = transport.from,
          passengers = transport.passengers,
          _transport$order = transport.order,
          order = _transport$order === void 0 ? Infinity : _transport$order;
      if (!to || !from || !passengers) return;
      var newTransport = {
        to: to,
        from: from,
        passengers: freeze(passengers),
        order: order
      };
      var keys = Object.keys(this.transports);

      if (keys.indexOf(to) === -1) {
        Vue.set(this.transports, to, []);
      }

      var currentIndex = this.$_getTransportIndex(newTransport); // Copying the array here so that the PortalTarget change event will actually contain two distinct arrays

      var newTransports = this.transports[to].slice(0);

      if (currentIndex === -1) {
        newTransports.push(newTransport);
      } else {
        newTransports[currentIndex] = newTransport;
      }

      this.transports[to] = stableSort(newTransports, function (a, b) {
        return a.order - b.order;
      });
    },
    close: function close(transport) {
      var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var to = transport.to,
          from = transport.from;
      if (!to || !from && force === false) return;

      if (!this.transports[to]) {
        return;
      }

      if (force) {
        this.transports[to] = [];
      } else {
        var index = this.$_getTransportIndex(transport);

        if (index >= 0) {
          // Copying the array here so that the PortalTarget change event will actually contain two distinct arrays
          var newTransports = this.transports[to].slice(0);
          newTransports.splice(index, 1);
          this.transports[to] = newTransports;
        }
      }
    },
    registerTarget: function registerTarget(target, vm, force) {
      if (!inBrowser) return;

      if (this.trackInstances && !force && this.targets[target]) {
        console.warn("[portal-vue]: Target ".concat(target, " already exists"));
      }

      this.$set(this.targets, target, Object.freeze([vm]));
    },
    unregisterTarget: function unregisterTarget(target) {
      this.$delete(this.targets, target);
    },
    registerSource: function registerSource(source, vm, force) {
      if (!inBrowser) return;

      if (this.trackInstances && !force && this.sources[source]) {
        console.warn("[portal-vue]: source ".concat(source, " already exists"));
      }

      this.$set(this.sources, source, Object.freeze([vm]));
    },
    unregisterSource: function unregisterSource(source) {
      this.$delete(this.sources, source);
    },
    hasTarget: function hasTarget(to) {
      return !!(this.targets[to] && this.targets[to][0]);
    },
    hasSource: function hasSource(to) {
      return !!(this.sources[to] && this.sources[to][0]);
    },
    hasContentFor: function hasContentFor(to) {
      return !!this.transports[to] && !!this.transports[to].length;
    },
    // Internal
    $_getTransportIndex: function $_getTransportIndex(_ref) {
      var to = _ref.to,
          from = _ref.from;

      for (var i in this.transports[to]) {
        if (this.transports[to][i].from === from) {
          return +i;
        }
      }

      return -1;
    }
  }
});
var wormhole = new Wormhole(transports);

var _id = 1;
var Portal = Vue.extend({
  name: 'portal',
  props: {
    disabled: {
      type: Boolean
    },
    name: {
      type: String,
      default: function _default() {
        return String(_id++);
      }
    },
    order: {
      type: Number,
      default: 0
    },
    slim: {
      type: Boolean
    },
    slotProps: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    tag: {
      type: String,
      default: 'DIV'
    },
    to: {
      type: String,
      default: function _default() {
        return String(Math.round(Math.random() * 10000000));
      }
    }
  },
  created: function created() {
    var _this = this;

    this.$nextTick(function () {
      wormhole.registerSource(_this.name, _this);
    });
  },
  mounted: function mounted() {
    if (!this.disabled) {
      this.sendUpdate();
    }
  },
  updated: function updated() {
    if (this.disabled) {
      this.clear();
    } else {
      this.sendUpdate();
    }
  },
  beforeDestroy: function beforeDestroy() {
    wormhole.unregisterSource(this.name);
    this.clear();
  },
  watch: {
    to: function to(newValue, oldValue) {
      oldValue && oldValue !== newValue && this.clear(oldValue);
      this.sendUpdate();
    }
  },
  methods: {
    clear: function clear(target) {
      var closer = {
        from: this.name,
        to: target || this.to
      };
      wormhole.close(closer);
    },
    normalizeSlots: function normalizeSlots() {
      return this.$scopedSlots.default ? [this.$scopedSlots.default] : this.$slots.default;
    },
    normalizeOwnChildren: function normalizeOwnChildren(children) {
      return typeof children === 'function' ? children(this.slotProps) : children;
    },
    sendUpdate: function sendUpdate() {
      var slotContent = this.normalizeSlots();

      if (slotContent) {
        var transport = {
          from: this.name,
          to: this.to,
          passengers: _toConsumableArray(slotContent),
          order: this.order
        };
        wormhole.open(transport);
      } else {
        this.clear();
      }
    }
  },
  render: function render(h) {
    var children = this.$slots.default || this.$scopedSlots.default || [];
    var Tag = this.tag;

    if (children && this.disabled) {
      return children.length <= 1 && this.slim ? this.normalizeOwnChildren(children)[0] : h(Tag, [this.normalizeOwnChildren(children)]);
    } else {
      return this.slim ? h() : h(Tag, {
        class: {
          'v-portal': true
        },
        style: {
          display: 'none'
        },
        key: 'v-portal-placeholder'
      });
    }
  }
});

var PortalTarget = Vue.extend({
  name: 'portalTarget',
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      required: true
    },
    slim: {
      type: Boolean,
      default: false
    },
    slotProps: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    tag: {
      type: String,
      default: 'div'
    },
    transition: {
      type: [String, Object, Function]
    }
  },
  data: function data() {
    return {
      transports: wormhole.transports,
      firstRender: true
    };
  },
  created: function created() {
    var _this = this;

    this.$nextTick(function () {
      wormhole.registerTarget(_this.name, _this);
    });
  },
  watch: {
    ownTransports: function ownTransports() {
      this.$emit('change', this.children().length > 0);
    },
    name: function name(newVal, oldVal) {
      /**
       * TODO
       * This should warn as well ...
       */
      wormhole.unregisterTarget(oldVal);
      wormhole.registerTarget(newVal, this);
    }
  },
  mounted: function mounted() {
    var _this2 = this;

    if (this.transition) {
      this.$nextTick(function () {
        // only when we have a transition, because it causes a re-render
        _this2.firstRender = false;
      });
    }
  },
  beforeDestroy: function beforeDestroy() {
    wormhole.unregisterTarget(this.name);
  },
  computed: {
    ownTransports: function ownTransports() {
      var transports = this.transports[this.name] || [];

      if (this.multiple) {
        return transports;
      }

      return transports.length === 0 ? [] : [transports[transports.length - 1]];
    },
    passengers: function passengers() {
      return combinePassengers(this.ownTransports, this.slotProps);
    }
  },
  methods: {
    // can't be a computed prop because it has to "react" to $slot changes.
    children: function children() {
      return this.passengers.length !== 0 ? this.passengers : this.$scopedSlots.default ? this.$scopedSlots.default(this.slotProps) : this.$slots.default || [];
    },
    // can't be a computed prop because it has to "react" to this.children().
    noWrapper: function noWrapper() {
      var noWrapper = this.slim && !this.transition;

      if (noWrapper && this.children().length > 1) {
        console.warn('[portal-vue]: PortalTarget with `slim` option received more than one child element.');
      }

      return noWrapper;
    }
  },
  render: function render(h) {
    var noWrapper = this.noWrapper();
    var children = this.children();
    var Tag = this.transition || this.tag;
    return noWrapper ? children[0] : this.slim && !Tag ? h() : h(Tag, {
      props: {
        // if we have a transition component, pass the tag if it exists
        tag: this.transition && this.tag ? this.tag : undefined
      },
      class: {
        'vue-portal-target': true
      }
    }, children);
  }
});

var _id$1 = 0;
var portalProps = ['disabled', 'name', 'order', 'slim', 'slotProps', 'tag', 'to'];
var targetProps = ['multiple', 'transition'];
var MountingPortal = Vue.extend({
  name: 'MountingPortal',
  inheritAttrs: false,
  props: {
    append: {
      type: [Boolean, String]
    },
    bail: {
      type: Boolean
    },
    mountTo: {
      type: String,
      required: true
    },
    // Portal
    disabled: {
      type: Boolean
    },
    // name for the portal
    name: {
      type: String,
      default: function _default() {
        return 'mounted_' + String(_id$1++);
      }
    },
    order: {
      type: Number,
      default: 0
    },
    slim: {
      type: Boolean
    },
    slotProps: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    tag: {
      type: String,
      default: 'DIV'
    },
    // name for the target
    to: {
      type: String,
      default: function _default() {
        return String(Math.round(Math.random() * 10000000));
      }
    },
    // Target
    multiple: {
      type: Boolean,
      default: false
    },
    targetSlim: {
      type: Boolean
    },
    targetSlotProps: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    targetTag: {
      type: String,
      default: 'div'
    },
    transition: {
      type: [String, Object, Function]
    }
  },
  created: function created() {
    if (typeof document === 'undefined') return;
    var el = document.querySelector(this.mountTo);

    if (!el) {
      console.error("[portal-vue]: Mount Point '".concat(this.mountTo, "' not found in document"));
      return;
    }

    var props = this.$props; // Target already exists

    if (wormhole.targets[props.name]) {
      if (props.bail) {
        console.warn("[portal-vue]: Target ".concat(props.name, " is already mounted.\n        Aborting because 'bail: true' is set"));
      } else {
        this.portalTarget = wormhole.targets[props.name];
      }

      return;
    }

    var append = props.append;

    if (append) {
      var type = typeof append === 'string' ? append : 'DIV';
      var mountEl = document.createElement(type);
      el.appendChild(mountEl);
      el = mountEl;
    } // get props for target from $props
    // we have to rename a few of them


    var _props = pick(this.$props, targetProps);

    _props.slim = this.targetSlim;
    _props.tag = this.targetTag;
    _props.slotProps = this.targetSlotProps;
    _props.name = this.to;
    this.portalTarget = new PortalTarget({
      el: el,
      parent: this.$parent || this,
      propsData: _props
    });
  },
  beforeDestroy: function beforeDestroy() {
    var target = this.portalTarget;

    if (this.append) {
      var el = target.$el;
      el.parentNode.removeChild(el);
    }

    target.$destroy();
  },
  render: function render(h) {
    if (!this.portalTarget) {
      console.warn("[portal-vue] Target wasn't mounted");
      return h();
    } // if there's no "manual" scoped slot, so we create a <Portal> ourselves


    if (!this.$scopedSlots.manual) {
      var props = pick(this.$props, portalProps);
      return h(Portal, {
        props: props,
        attrs: this.$attrs,
        on: this.$listeners,
        scopedSlots: this.$scopedSlots
      }, this.$slots.default);
    } // else, we render the scoped slot


    var content = this.$scopedSlots.manual({
      to: this.to
    }); // if user used <template> for the scoped slot
    // content will be an array

    if (Array.isArray(content)) {
      content = content[0];
    }

    if (!content) return h();
    return content;
  }
});

function install(Vue$$1) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  Vue$$1.component(options.portalName || 'Portal', Portal);
  Vue$$1.component(options.portalTargetName || 'PortalTarget', PortalTarget);
  Vue$$1.component(options.MountingPortalName || 'MountingPortal', MountingPortal);
}

var index = {
  install: install
};

exports.default = index;
exports.Portal = Portal;
exports.PortalTarget = PortalTarget;
exports.MountingPortal = MountingPortal;
exports.Wormhole = wormhole;


},{"vue":"../../../../../node_modules/vue/dist/vue.esm.js"}],"components/MenuHeader.vue":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  props: ['logoSrc', 'logoAlt', 'pluginName']
};
exports.default = _default;
        var $4456da = exports.default || module.exports;
      
      if (typeof $4456da === 'function') {
        $4456da = $4456da.options;
      }
    
        /* template */
        Object.assign($4456da, (function () {
          var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "wptb-settings-header" }, [
    _c("div", { staticClass: "wptb-settings-brand" }, [
      _c("img", { attrs: { src: _vm.logoSrc, alt: _vm.logoAlt } }),
      _vm._v(" "),
      _c("span", { staticClass: "wptb-settings-header-name" }, [
        _vm._v("\n      " + _vm._s(_vm.pluginName) + "\n    ")
      ])
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "wptb-settings-links" }, [_vm._t("default")], 2)
  ])
}
var staticRenderFns = []
render._withStripped = true

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
},{}],"components/SectionItem.vue":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
var _default = {
  props: ['name', 'current'],
  methods: {
    activePosition: function activePosition() {
      if (this.current === undefined || this.current === this.name) {
        this.$emit('activeSectionElement', this.$refs.sectionItem);
      }
    }
  },
  computed: {
    isActive: function isActive() {
      this.activePosition();

      if (this.current !== undefined) {
        return this.current === this.name;
      }

      return true;
    }
  }
};
exports.default = _default;
        var $3ce175 = exports.default || module.exports;
      
      if (typeof $3ce175 === 'function') {
        $3ce175 = $3ce175.options;
      }
    
        /* template */
        Object.assign($3ce175, (function () {
          var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      ref: "sectionItem",
      staticClass: "wptb-settings-section-item",
      class: { disabled: !_vm.isActive },
      on: {
        click: function($event) {
          return _vm.$emit("sectionchange", _vm.name, $event.target)
        }
      }
    },
    [_vm._v("\n  " + _vm._s(_vm.name) + "\n")]
  )
}
var staticRenderFns = []
render._withStripped = true

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
},{}],"components/ActiveSectionIndicator.vue":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
var _default = {
  props: ['activeItem', 'relativeParent'],
  methods: {
    toPx: function toPx(val) {
      return "".concat(val, "px");
    }
  },
  computed: {
    styleCalculations: function styleCalculations() {
      if (this.activeItem) {
        var posData = this.activeItem.getBoundingClientRect();
        var parentPosData = this.relativeParent.getBoundingClientRect();
        var relativeLeft = Math.abs(posData.left - parentPosData.left);
        return {
          width: this.toPx(posData.width),
          height: "2px",
          bottom: 0,
          left: this.toPx(relativeLeft)
        };
      }

      return {};
    }
  }
};
exports.default = _default;
        var $df4243 = exports.default || module.exports;
      
      if (typeof $df4243 === 'function') {
        $df4243 = $df4243.options;
      }
    
        /* template */
        Object.assign($df4243, (function () {
          var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", {
    staticClass: "wptb-menu-active-section-indicator",
    style: _vm.styleCalculations
  })
}
var staticRenderFns = []
render._withStripped = true

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
},{}],"components/Sections.vue":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _SectionItem = _interopRequireDefault(require("./SectionItem"));

var _ActiveSectionIndicator = _interopRequireDefault(require("./ActiveSectionIndicator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  model: {
    prop: 'currentSection',
    event: 'updateSection'
  },
  props: {
    child: {
      type: Boolean,
      default: false
    },
    items: Array,
    currentSection: String
  },
  components: {
    SectionItem: _SectionItem.default,
    ActiveSectionIndicator: _ActiveSectionIndicator.default
  },
  data: function data() {
    return {
      innerCurrentSection: '',
      activeSectionElement: null
    };
  },
  mounted: function mounted() {
    this.innerCurrentSection = this.currentSection || this.items[0];
  },
  watch: {
    innerCurrentSection: function innerCurrentSection(n) {
      this.$emit('updateSection', n);
    }
  },
  methods: {
    handleSectionChange: function handleSectionChange(val) {
      this.innerCurrentSection = val;
    },
    handleActiveSectionElement: function handleActiveSectionElement(el) {
      this.activeSectionElement = el;
    }
  }
};
exports.default = _default;
        var $dd2de5 = exports.default || module.exports;
      
      if (typeof $dd2de5 === 'function') {
        $dd2de5 = $dd2de5.options;
      }
    
        /* template */
        Object.assign($dd2de5, (function () {
          var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c(
        "div",
        {
          ref: "wrapper",
          staticClass: "wptb-settings-sections-wrapper",
          class: { child: _vm.child }
        },
        [
          _vm._l(_vm.items, function(item) {
            return _c("section-item", {
              key: item,
              attrs: { name: item, current: _vm.innerCurrentSection },
              on: {
                sectionchange: _vm.handleSectionChange,
                activeSectionElement: _vm.handleActiveSectionElement
              }
            })
          }),
          _vm._v(" "),
          _c("active-section-indicator", {
            attrs: {
              "relative-parent": _vm.$refs.wrapper,
              "active-item": _vm.activeSectionElement
            }
          })
        ],
        2
      ),
      _vm._v(" "),
      _vm._t("default")
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
},{"./SectionItem":"components/SectionItem.vue","./ActiveSectionIndicator":"components/ActiveSectionIndicator.vue"}],"mixins/withMessage.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var messageData = {
  withMessageData: {
    busy: false,
    show: false,
    message: '',
    type: 'ok',
    intervalId: -1,
    intervalTime: 5000
  }
};

var defaults = _objectSpread({}, messageData.withMessageData);

var withMessage = {
  data: function data() {
    return messageData;
  },
  methods: {
    setMessage: function setMessage(options) {
      var _this = this;

      var mergedOptions = _objectSpread({}, defaults, {}, options);

      this.withMessageData.message = mergedOptions.message;
      this.withMessageData.type = mergedOptions.type;
      this.withMessageData.show = true;
      clearInterval(this.withMessageData.intervalId);
      this.withMessageData.intervalId = setInterval(function () {
        _this.withMessageData.show = false;
      }, mergedOptions.intervalTime);
    },
    setBusy: function setBusy() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.withMessageData.busy = state;
    }
  }
};
var _default = withMessage;
exports.default = _default;
},{}],"components/MessageDisplay.vue":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _withMessage = _interopRequireDefault(require("../mixins/withMessage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
var _default = {
  mixins: [_withMessage.default]
};
exports.default = _default;
        var $e4bb48 = exports.default || module.exports;
      
      if (typeof $e4bb48 === 'function') {
        $e4bb48 = $e4bb48.options;
      }
    
        /* template */
        Object.assign($e4bb48, (function () {
          var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "wptb-settings-messages" },
    [
      _vm.withMessageData.busy
        ? _c("span", {
            staticClass:
              "dashicons dashicons-image-rotate wptb-settings-fetching"
          })
        : _vm._e(),
      _vm._v(" "),
      _c("transition", { attrs: { name: "wptb-fade" } }, [
        _vm.withMessageData.show
          ? _c(
              "span",
              {
                staticClass: "wptb-settings-message",
                class: [_vm.withMessageData.type]
              },
              [_vm._v(_vm._s(_vm.withMessageData.message))]
            )
          : _vm._e()
      ])
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
},{"../mixins/withMessage":"mixins/withMessage.js"}],"components/MenuButton.vue":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
var _default = {
  props: {
    disabled: Boolean,
    type: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: 'normal'
    }
  },
  methods: {
    handleClick: function handleClick() {
      this.$emit('click');
    }
  }
};
exports.default = _default;
        var $233f09 = exports.default || module.exports;
      
      if (typeof $233f09 === 'function') {
        $233f09 = $233f09.options;
      }
    
        /* template */
        Object.assign($233f09, (function () {
          var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "wptb-settings-button",
      class: [{ disabled: _vm.disabled }, _vm.type, _vm.size],
      on: { click: _vm.handleClick }
    },
    [_vm._t("default")],
    2
  )
}
var staticRenderFns = []
render._withStripped = true

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
},{}],"components/MenuFooter.vue":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _MessageDisplay = _interopRequireDefault(require("./MessageDisplay.vue"));

var _MenuButton = _interopRequireDefault(require("./MenuButton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
var _default = {
  props: ['messageType', 'messageShow', 'messageBody', 'messageBusy'],
  components: {
    MessageDisplay: _MessageDisplay.default,
    MenuButton: _MenuButton.default
  }
};
exports.default = _default;
        var $a45baf = exports.default || module.exports;
      
      if (typeof $a45baf === 'function') {
        $a45baf = $a45baf.options;
      }
    
        /* template */
        Object.assign($a45baf, (function () {
          var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "wptb-settings-footer" },
    [
      _c("message-display", {
        attrs: {
          busy: _vm.messageBusy,
          message: _vm.messageBody,
          show: _vm.messageShow,
          type: _vm.messageType
        }
      }),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "wptb-settings-button-container" },
        [
          _c("menu-button", { staticStyle: { visibility: "hidden" } }, [
            _vm._v("dummy")
          ]),
          _vm._v(" "),
          _vm._t("default")
        ],
        2
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
},{"./MessageDisplay.vue":"components/MessageDisplay.vue","./MenuButton":"components/MenuButton.vue"}],"components/MenuContent.vue":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
var _default = {
  props: {
    center: {
      type: Boolean,
      default: false
    }
  }
};
exports.default = _default;
        var $3df909 = exports.default || module.exports;
      
      if (typeof $3df909 === 'function') {
        $3df909 = $3df909.options;
      }
    
        /* template */
        Object.assign($3df909, (function () {
          var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "wptb-settings-controls-wrapper",
      class: [_vm.center ? "center" : "grid"]
    },
    [
      _c(
        "transition",
        { attrs: { name: "wptb-fade", mode: "out-in" } },
        [_vm._t("default")],
        2
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
},{}],"components/DragDrop.vue":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  props: ['texts', 'file', 'allowedFormats'],
  model: {
    prop: 'file',
    event: 'fileChanged'
  },
  data: function data() {
    return {
      dragActive: false,
      currentFile: null
    };
  },
  mounted: function mounted() {
    this.currentFile = this.file;
  },
  watch: {
    currentFile: function currentFile(n) {
      this.$emit('fileChanged', n);
    },
    file: function file(n) {
      this.currentFile = n;
    }
  },
  computed: {
    eventClass: function eventClass() {
      return this.dragActive ? 'dragenter' : '';
    }
  },
  methods: {
    handleDrop: function handleDrop(event) {
      this.dragActive = true;
      var dt = event.dataTransfer;

      if (dt.files[0]) {
        if (this.isTypeAllowed(dt.files[0])) {
          this.currentFile = dt.files[0];
        }
      }

      this.dragActive = false;
    },
    isTypeAllowed: function isTypeAllowed(fileName) {
      var extension = fileName.name.split('.').pop();
      return this.allowedFormats.includes(extension);
    },
    openFileSelect: function openFileSelect() {
      this.$refs.fileSelect.click();
    },
    handleFileSelect: function handleFileSelect(e) {
      if (e.target.files.length > 0 && this.isTypeAllowed(e.target.files[0])) {
        this.currentFile = e.target.files[0];
      }
    },
    clearCurrentFile: function clearCurrentFile() {
      this.currentFile = null;
    }
  }
};
exports.default = _default;
        var $287b39 = exports.default || module.exports;
      
      if (typeof $287b39 === 'function') {
        $287b39 = $287b39.options;
      }
    
        /* template */
        Object.assign($287b39, (function () {
          var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "wptb-menu-file-drop",
      class: _vm.eventClass,
      on: {
        dragenter: function($event) {
          $event.stopPropagation()
          $event.preventDefault()
          _vm.dragActive = true
        },
        dragleave: function($event) {
          $event.stopPropagation()
          $event.preventDefault()
          _vm.dragActive = false
        },
        drop: function($event) {
          $event.stopPropagation()
          $event.preventDefault()
          return _vm.handleDrop($event)
        },
        dragover: function($event) {
          $event.stopPropagation()
          $event.preventDefault()
          _vm.dragActive = true
        }
      }
    },
    [
      _c("transition", { attrs: { name: "wptb-fade", mode: "out-in" } }, [
        _vm.dragActive
          ? _c("div", { key: "fileLogo", staticClass: "file-icon" }, [
              _c("span", {
                staticClass: "dashicons dashicons-media-spreadsheet"
              })
            ])
          : _c(
              "div",
              { key: "controls" },
              [
                _c(
                  "transition",
                  { attrs: { name: "wptb-fade", mode: "out-in" } },
                  [
                    _vm.currentFile === null
                      ? _c(
                          "div",
                          {
                            key: "selection",
                            staticClass:
                              "wptb-flex wptb-flex-col wptb-flex-align-center"
                          },
                          [
                            _c("div", { staticClass: "hint" }, [
                              _vm._v(_vm._s(_vm.texts.hint))
                            ]),
                            _vm._v(" "),
                            _c(
                              "div",
                              {
                                staticClass:
                                  "supported wptb-text-transform-none"
                              },
                              [
                                _vm._v(
                                  "(" +
                                    _vm._s(_vm.allowedFormats.join(", ")) +
                                    ")"
                                )
                              ]
                            ),
                            _vm._v(" "),
                            _c("div", [
                              _c(
                                "a",
                                {
                                  on: {
                                    click: function($event) {
                                      $event.preventDefault()
                                      return _vm.openFileSelect($event)
                                    }
                                  }
                                },
                                [_vm._v(_vm._s(_vm.texts.browse))]
                              ),
                              _vm._v(" "),
                              _c("input", {
                                ref: "fileSelect",
                                staticStyle: { display: "none" },
                                attrs: { type: "file" },
                                on: { change: _vm.handleFileSelect }
                              })
                            ])
                          ]
                        )
                      : _c(
                          "div",
                          {
                            key: "selected",
                            staticClass:
                              "wptb-flex wptb-flex-col wptb-flex-align-center"
                          },
                          [
                            _c("div", { staticClass: "file" }, [
                              _vm._v(_vm._s(_vm.currentFile.name))
                            ]),
                            _vm._v(" "),
                            _c("div", [
                              _c(
                                "a",
                                {
                                  on: {
                                    click: function($event) {
                                      $event.preventDefault()
                                      return _vm.clearCurrentFile($event)
                                    }
                                  }
                                },
                                [_vm._v(_vm._s(_vm.texts.clear))]
                              )
                            ])
                          ]
                        )
                  ]
                )
              ],
              1
            )
      ])
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
},{}],"components/ControlItem.vue":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  props: ['fieldData', 'modelBind'],
  methods: {
    isType: function isType(type) {
      return this.fieldData.type === type;
    }
  }
};
exports.default = _default;
        var $75e9bd = exports.default || module.exports;
      
      if (typeof $75e9bd === 'function') {
        $75e9bd = $75e9bd.options;
      }
    
        /* template */
        Object.assign($75e9bd, (function () {
          var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _vm.isType("multiCheckbox")
      ? _c(
          "div",
          _vm._l(_vm.fieldData.options, function(v, k) {
            return _c("div", { staticClass: "wptb-setting-control-row" }, [
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.modelBind[_vm.fieldData.id],
                    expression: "modelBind[fieldData.id]"
                  }
                ],
                attrs: { id: _vm.fieldData.id, type: "checkbox" },
                domProps: {
                  value: k,
                  checked: Array.isArray(_vm.modelBind[_vm.fieldData.id])
                    ? _vm._i(_vm.modelBind[_vm.fieldData.id], k) > -1
                    : _vm.modelBind[_vm.fieldData.id]
                },
                on: {
                  change: function($event) {
                    var $$a = _vm.modelBind[_vm.fieldData.id],
                      $$el = $event.target,
                      $$c = $$el.checked ? true : false
                    if (Array.isArray($$a)) {
                      var $$v = k,
                        $$i = _vm._i($$a, $$v)
                      if ($$el.checked) {
                        $$i < 0 &&
                          _vm.$set(
                            _vm.modelBind,
                            _vm.fieldData.id,
                            $$a.concat([$$v])
                          )
                      } else {
                        $$i > -1 &&
                          _vm.$set(
                            _vm.modelBind,
                            _vm.fieldData.id,
                            $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                          )
                      }
                    } else {
                      _vm.$set(_vm.modelBind, _vm.fieldData.id, $$c)
                    }
                  }
                }
              }),
              _vm._v(" "),
              _c("label", { attrs: { for: _vm.fieldData.id } }, [
                _vm._v(_vm._s(v))
              ])
            ])
          }),
          0
        )
      : _vm.isType("checkbox")
      ? _c("div", [
          _c("div", { staticClass: "wptb-setting-control-row" }, [
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.modelBind[_vm.fieldData.id],
                  expression: "modelBind[fieldData.id]"
                }
              ],
              attrs: { id: _vm.fieldData.id, type: "checkbox" },
              domProps: {
                checked: Array.isArray(_vm.modelBind[_vm.fieldData.id])
                  ? _vm._i(_vm.modelBind[_vm.fieldData.id], null) > -1
                  : _vm.modelBind[_vm.fieldData.id]
              },
              on: {
                change: function($event) {
                  var $$a = _vm.modelBind[_vm.fieldData.id],
                    $$el = $event.target,
                    $$c = $$el.checked ? true : false
                  if (Array.isArray($$a)) {
                    var $$v = null,
                      $$i = _vm._i($$a, $$v)
                    if ($$el.checked) {
                      $$i < 0 &&
                        _vm.$set(
                          _vm.modelBind,
                          _vm.fieldData.id,
                          $$a.concat([$$v])
                        )
                    } else {
                      $$i > -1 &&
                        _vm.$set(
                          _vm.modelBind,
                          _vm.fieldData.id,
                          $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                        )
                    }
                  } else {
                    _vm.$set(_vm.modelBind, _vm.fieldData.id, $$c)
                  }
                }
              }
            }),
            _vm._v(" "),
            _c("label", { attrs: { for: _vm.fieldData.id } }, [
              _vm._v(_vm._s(_vm.fieldData.label))
            ])
          ])
        ])
      : _vm.isType("dropdown")
      ? _c("div", [
          _c("div", { staticClass: "wptb-setting-control-row" }, [
            _c(
              "select",
              {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.modelBind[_vm.fieldData.id],
                    expression: "modelBind[fieldData.id]"
                  }
                ],
                attrs: { id: _vm.fieldData.id },
                on: {
                  change: function($event) {
                    var $$selectedVal = Array.prototype.filter
                      .call($event.target.options, function(o) {
                        return o.selected
                      })
                      .map(function(o) {
                        var val = "_value" in o ? o._value : o.value
                        return val
                      })
                    _vm.$set(
                      _vm.modelBind,
                      _vm.fieldData.id,
                      $event.target.multiple ? $$selectedVal : $$selectedVal[0]
                    )
                  }
                }
              },
              _vm._l(_vm.fieldData.options, function(o) {
                return _c("option", { domProps: { value: o.value } }, [
                  _vm._v("\n          " + _vm._s(o.label) + "\n        ")
                ])
              }),
              0
            ),
            _vm._v(" "),
            _c("label", { attrs: { for: _vm.fieldData.id } }, [
              _vm._v(_vm._s(_vm.fieldData.label))
            ])
          ])
        ])
      : _vm._e()
  ])
}
var staticRenderFns = []
render._withStripped = true

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
},{}],"functions/importOperations.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * ImportOperations class
 *
 * @param {Object} options options object
 * @returns {{importFromFile: importFromFile}}
 * @constructor
 */
function ImportOperations(options) {
  function importFromFile() {
    if (options.file) {
      var regex = /^([a-zA-Z0-9()\s_\\.\-:])+(.csv)$/;
      var regex2 = /^([a-zA-Z0-9()\s_\\.\-:])+(.xml)$/;
      var regex3 = /^([a-zA-Z0-9()\s_\\.\-:])+(.html)$/;
      var regex4 = /^([a-zA-Z0-9()\s_\\.\-:])+(.zip)$/;
      var is_csv = regex.test(options.file.name.toLowerCase());
      var is_xml = regex2.test(options.file.name.toLowerCase());
      var is_html = regex3.test(options.file.name.toLowerCase());
      var is_zip = regex4.test(options.file.name.toLowerCase());
      var file = options.file;

      if (is_zip) {
        var http = new XMLHttpRequest();
        var url = "".concat(options.ajaxUrl, "?action=zip_unpacker");
        var data = new FormData();
        data.append('file', file, 'csv_zip.zip');
        data.append('security_code', options.nonce);
        http.open('POST', url, true);

        http.onreadystatechange = function (action) {
          if (this.readyState == 4 && this.status == 200) {
            var _data = http.responseText;

            if (JSON.parse(_data)[0] === 'unsuccess') {
              WPTB_Helper.wptbDocumentEventGenerate('table:imported:error', document);
              return;
            }

            if (_data) _data = JSON.parse(_data);

            if (_data && Array.isArray(_data)) {
              if (_data[0] == 'success') {
                if (_data[1] && Array.isArray(_data[1])) {
                  var dataTable = []; // check file extension, if it "csv" add get this tableData

                  for (var i = 0; i < _data[1].length; i++) {
                    if (_data[1][i][0] === 'csv') {
                      dataTable.push(_data[1][i][1]);
                    }
                  }

                  if (dataTable.length > 0) {
                    tablesFromCsvSaveRun(dataTable, 0);
                  }
                }
              }
            }
          }
        };

        http.send(data);
      } else if (is_csv || is_xml || is_html) {
        if (typeof FileReader != 'undefined') {
          var reader = new FileReader();

          var _data2;

          reader.onload = function (e) {
            _data2 = e.target.result;

            if (is_csv) {
              tablesFromCsvSaveRun([_data2], 0);
            }
          };

          reader.readAsText(file);
        } else {
          alert('This browser does not support HTML5.');
        }
      } else {
        alert('Please upload a valid file.');
      }
    }
  }
  /**
   * run all process for importing tables
   */


  function tablesFromCsvSaveRun(tableDataCsv, index) {
    if (tableDataCsv && Array.isArray(tableDataCsv)) {
      var csvDelimiter = options.delimiter;
      if (csvDelimiter == 'tab') csvDelimiter = '\t';

      if (!csvDelimiter) {
        csvDelimiter = searchDelimiter(tableDataCsv[index]);

        if (!csvDelimiter) {
          alert('The delimiter could not be determined');
          return;
        }
      }

      document.addEventListener('table:imported:saved', function tabImSave() {
        // tableImportingProgressBar(index + 1, tableDataCsv.length, 'import');
        if (tableDataCsv.length - index > 1) {
          tablesFromCsvSaveRun(tableDataCsv, index + 1);
        }

        document.removeEventListener('table:imported:saved', tabImSave);
      });
      var tableDataArr = parseCsv(tableDataCsv[index], csvDelimiter);
      var importedTable = createTableFromDataArray(tableDataArr);
      tableImportedSave(importedTable);

      if (index === 0) {// tableImportingProgressBar(0, 1, 'import');
      }
    }
  }
  /**
   * save html table
   */


  function tableImportedSave(table, id) {
    var http = new XMLHttpRequest();
    var url = options.ajaxUrl + "?action=save_table";
    var code;

    if (id) {
      if (table.classList.contains('wptb-element-main-table_setting-startedid-0')) {
        table.classList.remove('wptb-element-main-table_setting-startedid-0');
        table.classList.add("wptb-element-main-table_setting-".concat(id));
      }
    }

    code = WPTB_Stringifier(table);
    code = code.outerHTML;
    var params = {
      content: code,
      security_code: options.nonce
    };

    if (id) {
      params.id = id;
    }

    params = JSON.stringify(params);
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    http.onreadystatechange = function (action) {
      if (this.readyState == 4 && this.status == 200) {
        if (JSON.parse(http.responseText)[0] === 'security_problem') {
          WPTB_Helper.wptbDocumentEventGenerate('table:imported:error', document);
          return;
        }

        var data = JSON.parse(http.responseText);

        if (data[0] == 'saved') {
          tableImportedSave(table, data[1]);
        } else if (data[0] == 'edited') {
          WPTB_Helper.wptbDocumentEventGenerate('table:imported:saved', document);
        }
      }
    };

    http.send(params);
  }
  /**
   * create new table from array data
   */


  function createTableFromDataArray(tableDataArr) {
    if (tableDataArr && Array.isArray(tableDataArr) && tableDataArr.length > 0) {
      var countRows = tableDataArr.length;
      var countColumns = countRows > 0 && tableDataArr[0] && Array.isArray(tableDataArr[0]) ? tableDataArr[0].length : 0; // check if table is empty

      if (countRows === 0 && countColumns === 0) {
        return false;
      }
      /**
       * array for saving unique elements indexes
       */


      var elementsIndexes = {
        imageElemIndex: 1,
        textElemIndex: 1,
        customHtmlElemIndex: 1
      };
      var rowSpan = new Array(countRows);
      rowSpan.fill(1);
      var colSpan = new Array(countColumns);
      colSpan.fill(1);
      var tBody = document.createElement('tbody');
      var lastRowIdx = countRows - 1;
      var lastColumnIdx = countColumns - 1;

      for (var rowIdx = lastRowIdx; rowIdx >= 0; rowIdx--) {
        var tr = document.createElement('tr');
        tr.classList.add('wptb-row');

        for (var colIdx = lastColumnIdx; colIdx >= 0; colIdx--) {
          var cellContent = tableDataArr[rowIdx][colIdx];

          if (cellContent === '#rowspan#') {
            if (rowIdx > 0) {
              if (!rowSpan[colIdx]) rowSpan[colIdx] = 1;
              rowSpan[colIdx]++;
              colSpan[rowIdx] = 1;
              continue;
            }

            cellContent = '';
          } else if (cellContent === '#colspan#') {
            if (colIdx > 0) {
              if (!colSpan[rowIdx]) colSpan[rowIdx] = 1;
              colSpan[rowIdx]++;
              rowSpan[colIdx] = 1;
              continue;
            }

            cellContent = '';
          }

          var td = document.createElement('td');
          td.classList.add('wptb-droppable', 'wptb-cell');
          td.dataset.wptbCssTdAutoWidth = 'true';
          td.style.padding = '15px';
          td.style.width = null;
          td.style.height = null;
          td.style.borderStyle = 'solid';
          td.style.borderWidth = '1px';
          td.innerHTML = cellContent;

          if (colSpan[rowIdx] > 1) {
            td.colSpan = colSpan[rowIdx];
          }

          if (rowSpan[colIdx] > 1) {
            td.rowSpan = rowSpan[colIdx];
          }

          tr.insertBefore(td, tr.firstChild);
          colSpan[rowIdx] = 1;
          rowSpan[colIdx] = 1;
        }

        tBody.insertBefore(tr, tBody.firstChild);
      }

      var table = document.createElement('table');
      table.classList.add('wptb-preview-table', 'wptb-element-main-table_setting-startedid-0');
      /*
       * set including border style for table
       */

      table.style.borderStyle = 'solid';
      table.style.borderWidth = '1px';
      table.appendChild(tBody);
      var tds = table.querySelectorAll('td');

      for (var i = 0; i < tds.length; i++) {
        var tdChildNodes = _toConsumableArray(tds[i].childNodes);

        var childNodesHandleredIndexesArr = tdChildNodesHandler(tdChildNodes, elementsIndexes);
        var wptbElements = void 0;

        if (childNodesHandleredIndexesArr && Array.isArray(childNodesHandleredIndexesArr)) {
          wptbElements = childNodesHandleredIndexesArr[0];
          elementsIndexes = childNodesHandleredIndexesArr[1];
        }

        tds[i].innerHTML = '';

        if (wptbElements && Array.isArray(wptbElements)) {
          for (var j = 0; j < wptbElements.length; j++) {
            tds[i].appendChild(wptbElements[j]);
          }
        }
      }

      WPTB_Helper.recalculateIndexes(table);
      addAttributesForTable(table);
      return table;
    }

    return false;
  }
  /**
   * add adaptive table data attribute to set table responsive or not
   * add wptb-table-preview-head class to set top row as header if it chosen
   * and also other data attributes
   */


  function addAttributesForTable(table) {
    if (options.tableResponsive) {
      table.dataset.wptbAdaptiveTable = '1';
    } else {
      table.dataset.wptbAdaptiveTable = '0';
    }

    if (options.topRowAsHeader) {
      table.classList.add('wptb-table-preview-head');
    }

    table.dataset.wptbFixedWidthSize = '0';
    table.dataset.wptbCellsWidthAutoCount = table.maxCols;
    var td = table.querySelector('td');
    var tdPadding = td && td.style.paddingTop ? td.style.paddingTop : 15;
    table.dataset.wptbTableTdsSumMaxWidth = String(parseInt(table.maxCols) * (100 + 1 + parseInt(tdPadding) * 2) + 1);
  }
  /**
   * function for parse CSV to array
   */


  function parseCsv(str, separator) {
    var arr = [];
    var quote = false;

    for (var row = 0, col = 0, c = 0; c < str.length; c++) {
      var cc = str[c],
          nc = str[c + 1];
      arr[row] = arr[row] || [];
      arr[row][col] = arr[row][col] || '';

      if (cc == '"' && quote && nc == '"') {
        arr[row][col] += cc;
        ++c;
        continue;
      }

      if (cc == '"') {
        quote = !quote;
        continue;
      }

      if (cc == separator && !quote) {
        ++col;
        continue;
      }

      if (cc == '\n' && !quote) {
        ++row;
        col = 0;
        continue;
      }

      arr[row][col] += cc;
    }

    return arr;
  }
  /**
   * Detect the CSV delimiter, by analyzing some rows to determine the most probable delimiter character.
   * return string Most probable delimiter character.
   */


  function searchDelimiter(data) {
    var delimiterCollection = {};
    var quote = false;
    var currentLine = 0;
    var nonDelimiterChars = 'a-zA-Z0-9\n\r'; // Walk through each character in the CSV string (up to $this->delimiter_search_max_lines) and search potential delimiter characters.

    var dataLength = data.length;

    for (var i = 0; i < dataLength; i++) {
      var previousChar = i - 1 >= 0 ? data[i - 1] : '';
      var currentChar = data[i];
      var nextChar = i + 1 < dataLength ? data[i + 1] : '';

      if (currentChar === '"') {
        // Open and closing quotes.
        if (!quote || nextChar !== '"') {
          quote = !quote; // Flip bool.
        } else if (quote) {
          i++; // Skip next character.
        }
      } else if (('\n' === currentChar && '\r' !== previousChar || '\r' === currentChar) && !quote) {
        // Reached end of a line.
        currentLine++;

        if (currentLine >= 15) {
          break;
        }
      } else if (!quote) {
        // At this point, currentChar seems to be used as a delimiter, as it is not quote.
        // Count currentChar if it is not in the $this->nonDelimiterChars list
        if (';,\t'.indexOf(currentChar) !== -1) {
          if (typeof delimiterCollection[currentChar] == 'undefined') {
            delimiterCollection[currentChar] = {};
          }

          if (typeof delimiterCollection[currentChar][currentLine] == 'undefined') {
            delimiterCollection[currentChar][currentLine] = 0; // Initialize empty
          }

          delimiterCollection[currentChar][currentLine]++;
        }
      }
    }

    var potentialDelimiters = '';

    for (var delimiter in delimiterCollection) {
      var lineDelimiterCollection = delimiterCollection[delimiter];
      var lineDelimiterCollectionLength = 0;

      for (var lineDelimiter in lineDelimiterCollection) {
        lineDelimiterCollectionLength++;
      }

      if (lineDelimiterCollectionLength !== currentLine) {
        continue;
      }

      var startCount = false;
      var delimiterIndic = void 0;

      for (var _lineDelimiter in lineDelimiterCollection) {
        if (!startCount) {
          startCount = lineDelimiterCollection[_lineDelimiter];
        } else if (lineDelimiterCollection[_lineDelimiter] === startCount && (delimiterIndic || typeof delimiterIndic == 'undefined')) {
          delimiterIndic = true;
        } else {
          delimiterIndic = false;
        }
      }

      if (currentLine > 1 && !delimiterIndic) {
        continue;
      }

      if (!potentialDelimiters) {
        potentialDelimiters = delimiter;
      } else {
        potentialDelimiters = false;
        break;
      }
    }

    return potentialDelimiters;
  }

  function wptb_xmlElementChildrenEach(Parent, startIter) {
    if (startIter) {
      this.mainString = [];
    }

    if (Parent.nodeType == 1) {
      if (Parent.children.length > 0) {
        for (var i = 0; i < Parent.children.length; i++) {
          var child = Parent.children[i];
          wptb_xmlElementChildrenEach(child);
        }
      } else if (Parent.childNodes.length > 0) {
        for (var _i = 0; _i < Parent.childNodes.length; _i++) {
          var _child = Parent.childNodes[_i];
          wptb_xmlElementChildrenEach(_child);
        }
      } else {
        this.mainString.push('');
      }
    } else if ((Parent.nodeType == 3 || Parent.nodeType == 4) && Parent.data.trim() != '\n' && Parent.data.trim() != '\n' && Parent.data.trim() != '\r' && Parent.data.trim != '\n\r' && Parent.previousSibling === null && Parent.nextSibling === null) {
      this.mainString.push(Parent.data);
    }

    return this.mainString;
  }
  /**
   * function for parse Xml file
   */


  function wptb_xmlImportFileParse(data) {
    var xmlDoc = $.parseXML(data);
    var xml = $(xmlDoc);
    var rows = [];
    var rows_header = [];

    if (xml.length > 0) {
      var documentElement = xml[0].children;

      if (documentElement.length > 0) {
        var couponElements = documentElement[0].children;

        for (var i = 0; i < couponElements.length; i++) {
          if (i == 0) {
            rows_header[i] = wptb_xmlElementChildrenEach(couponElements[i], true);
          } else {
            rows[i] = wptb_xmlElementChildrenEach(couponElements[i], true);
          }
        }
      }
    }

    rows = rows_header.concat(rows);
    return rows;
  }
  /**
   * import table from other plugins
   */


  function importFromPlugin(event) {
    if (event) {
      if (event === 'table-press') {
        tablePressImportStageOne();
      }
    }
  }
  /**
   * gets array with shortcodes and run
   * function
   */


  function tablePressImportStageOne() {
    var http = new XMLHttpRequest();
    var url = "".concat(options.ajaxUrl, "?action=import_tables");
    var params = {
      import_plugin_name: 'table-press',
      security_code: options.security_code
    };
    params = JSON.stringify(params);
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    http.onreadystatechange = function (action) {
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(http.responseText);

        if (data && Array.isArray(data)) {
          if (data[0] == 'success') {
            if (data[1] && Array.isArray(data[1])) {
              var importIframeSection = document.getElementById('wptb-importIframeSection');

              if (importIframeSection) {
                var iframe = document.createElement('iframe'); // iframe.width = '1000';
                // iframe.height = '1000';

                importIframeSection.innerHTML = '';
                importIframeSection.appendChild(iframe);
                window.wptbImportCommonCountTables = data[1].length;

                if (window.wptbImportConvertationShortcodes) {
                  delete window.wptbImportConvertationShortcodes;
                } //  tableImportingProgressBar(0, window.wptbImportCommonCountTables, 'import');


                tablePressImportStageTwo(iframe, data[1]);
              }
            }
          } else if (data[1]) {
            WPTB_Helper.wptbDocumentEventGenerate('table:imported:error', document, data[1]);
          }
        }
      }
    };

    http.send(params);
  }

  function tablePressImportStageTwo(iframe, dataTables) {
    if (dataTables && Array.isArray(dataTables) && dataTables.length > 0) {
      var dataTable = dataTables.shift();

      if (dataTable && Array.isArray(dataTable) && dataTable.length > 0) {
        var shortcode = dataTable[0];

        if (!window.wptbImportConvertationShortcodes) {
          window.wptbImportConvertationShortcodes = [];
        }

        var thisIterConvertShortcodes = [];
        thisIterConvertShortcodes.push(shortcode);
        window.wptbImportConvertationShortcodes.push(thisIterConvertShortcodes);
        var tableContent = dataTable[1];
        var url = options.import_iframe_url + '&_wpnonce=' + options.security_code + '&shortcode=' + shortcode;
        iframe.src = url;
        iframe.onload = tablePressImportStageThree.bind(this, iframe, tableContent, dataTables);
      }
    }
  }

  function tablePressImportStageThree(iframe, tableContent, dataTables) {
    var iframeContent = iframe.contentDocument || iframe.contentWindow.document;
    var selectTableLength = iframeContent.querySelector('.dataTables_length select');

    if (selectTableLength) {
      var selectTableLengthOptions = _toConsumableArray(selectTableLength.options);

      if (Array.isArray(selectTableLengthOptions)) {
        var optionMaxValue = selectTableLengthOptions.reduce(function (previousValue, currentValue) {
          var prevVal = previousValue ? Number(previousValue.value) : '';
          var curVal = currentValue ? Number(currentValue.value) : '';

          if (prevVal < curVal) {
            previousValue = currentValue;
          }

          return previousValue;
        });

        if (optionMaxValue) {
          selectTableLength.value = optionMaxValue.value;
          WPTB_Helper.wptbDocumentEventGenerate('change', selectTableLength);
        }
      }
    }

    var tableDOMElem = iframeContent.querySelector('table.tablepress');
    tableDomImportingHandler(tableDOMElem, tableContent, iframe, dataTables);
  }

  function tablePressImportStageFour(tableDOMElem, iframe, dataTables, id) {
    var http = new XMLHttpRequest();
    var url = options.ajaxUrl + "?action=save_table";
    var title;
    var code;
    var iframeContent = iframe.contentDocument || iframe.contentWindow.document;
    var titleElem = iframeContent.querySelector('.tablepress-table-name');

    if (titleElem) {
      title = titleElem.innerText;
    } else {
      title = '';
    }

    if (id) {
      if (tableDOMElem.classList.contains('wptb-element-main-table_setting-startedid-0')) {
        tableDOMElem.classList.remove('wptb-element-main-table_setting-startedid-0');
        tableDOMElem.classList.add("wptb-element-main-table_setting-".concat(id));
      }
    }

    code = WPTB_Stringifier(tableDOMElem);
    code = code.outerHTML;
    var params = {
      title: title,
      content: code,
      security_code: options.security_code
    };

    if (id) {
      params.id = id;
    }

    params = JSON.stringify(params);
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    http.onreadystatechange = function (action) {
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(http.responseText);

        if (data[0] == 'saved') {
          tablePressImportStageFour(tableDOMElem, iframe, dataTables, data[1]);
        } else if (data[0] == 'edited') {
          if (data[1] && window.wptbImportConvertationShortcodes && Array.isArray(window.wptbImportConvertationShortcodes) && window.wptbImportConvertationShortcodes.length > 0) {
            window.wptbImportConvertationShortcodes[window.wptbImportConvertationShortcodes.length - 1].push('[wptb id=' + data[1] + ']');
          }

          if (window.wptbImportCommonCountTables) {
            var commonCount = window.wptbImportCommonCountTables;
            var importingCount = window.wptbImportCommonCountTables - dataTables.length;
            var percent = tableImportingProgressBar(importingCount, commonCount, 'import');

            if (percent == 100) {
              var importProgressBarContainer = document.querySelector('.wptb-importPBarContainer');

              if (importProgressBarContainer) {
                importProgressBarContainer.addEventListener('wptb-import:progressBar:full:import', function () {
                  importedTablesInfoSettingBox();
                }, false);
              }
            }
          } else {
            tableImportingProgressBar(100, 100, 'import');
          }

          tablePressImportStageTwo(iframe, dataTables);
        }
      }
    };

    http.send(params);
  }
  /**
   * function for working progress bar
   *
   * return percent
   */


  function tableImportingProgressBar(count, commonCount, eventPostfix) {
    var importProgressBarContainer = document.querySelector('.wptb-importPBarContainer');
    var percentElement = document.querySelector('#wptb-pBarPercent');
    var percentElementSpan = document.querySelector('#wptb-pBarPercent span');

    if (importProgressBarContainer && percentElement && percentElementSpan) {
      if ((count || count === 0) && commonCount) {
        count = Number(count);
        commonCount = Number(commonCount);

        if (commonCount > 0) {
          importProgressBarContainer.classList.add('wptb-importPBarContainerActive');
          var nameProcessingElem = importProgressBarContainer.querySelector('.wptb-nameProcessInBarProgress');

          if (nameProcessingElem) {
            var nameProcessing = '';
            var button;

            if (eventPostfix == 'import') {
              button = document.querySelector('.wptb-importFromPlugin');
            } else if (eventPostfix == 'replace') {
              button = document.querySelector('.wptb-importTableReplaceShortcodes');
            }

            if (button) {
              nameProcessing = button.dataset.name;
              if (nameProcessing) nameProcessingElem.innerHTML = nameProcessing;
            }

            if (!nameProcessing) nameProcessingElem.innerHTML = '';
          } // Calculate percent


          var percent = (count / commonCount * 100).toFixed(2);
          if (percent > 100) percent = 100;
          percentElementSpan.innerHTML = "".concat(percent, "%");

          if (percent < 3) {
            percentElement.style.width = '3%';
          } else {
            percentElement.style.width = "".concat(percent, "%");
          }

          if (percent == 100) {
            setTimeout(function () {
              importProgressBarContainer.classList.remove('wptb-importPBarContainerActive');
              eventPostfix = eventPostfix ? ":".concat(eventPostfix) : '';
              WPTB_Helper.wptbDocumentEventGenerate('wptb-import:progressBar:full' + eventPostfix, importProgressBarContainer);
            }, 2000);
          }

          return percent;
        }
      }
    }
  }
  /**
   * function out table with imported shortcodes
   * and out button for replace shortcodes in posts
   */


  function importedTablesInfoSettingBox() {
    WPTB_Helper.wptbDocumentEventGenerate('table:imported:saved', document);
    WPTB_Helper.wptbDocumentEventGenerate('table:imported:list', document, _defineProperty({}, options.type, window.wptbImportConvertationShortcodes)); // @deprecated
    // let importedTablesSetting = document.querySelector('.wptb-importedTablesSetting');
    // if (importedTablesSetting) {
    //     importedTablesSetting.style.display = 'block';
    //     let importedTablesCount = '';
    //     if (window.wptbImportConvertationShortcodes && Array.isArray(window.wptbImportConvertationShortcodes)) {
    //         importedTablesCount = window.wptbImportConvertationShortcodes.length;
    //     }
    //     let importedTablesCountElem = document.querySelector('.wptb-importedTablesCount span');
    //     if (importedTablesCountElem && importedTablesCount) importedTablesCountElem.innerHTML = importedTablesCount;
    //
    //     let importedTablesShortcodesList = document.querySelector('.wptb-importedTablesShortcodesList');
    //     if (importedTablesShortcodesList && importedTablesCount > 0) {
    //         let table = importedTablesShortcodesList.querySelector('table');
    //         let tbody = table.querySelector('tbody');
    //         tbody.innerHTML = '';
    //         for (let i = 0; i < importedTablesCount; i++) {
    //             let thisIterConvertShortcodes = window.wptbImportConvertationShortcodes[i];
    //             if (thisIterConvertShortcodes && Array.isArray(thisIterConvertShortcodes)) {
    //                 let tr = document.createElement('tr');
    //                 tr.innerHTML = '<td><input type="checkbox" name="shortcodesReplace[' + i + ']"></td>' +
    //                     '<td>' + thisIterConvertShortcodes[0] + '</td>' +
    //                     '<td>' + thisIterConvertShortcodes[1] + '</td>';
    //
    //                 tbody.appendChild(tr);
    //             }
    //         }
    //
    //         let thead = table.querySelector('thead');
    //         let th = thead.querySelector('th');
    //         if (th) {
    //             let thInput = th.firstChild;
    //             thInput.checked = false;
    //             let trs = tbody.children;
    //             if (trs.length > 0) {
    //                 thInput.onchange = function () {
    //                     for (let i = 0; i < trs.length; i++) {
    //                         let tdFirst = trs[i].firstChild;
    //                         if (tdFirst) {
    //                             let tdInput = tdFirst.firstChild;
    //                             if (tdInput) {
    //                                 if (this.checked) {
    //                                     tdInput.checked = true;
    //                                 } else {
    //                                     tdInput.checked = false;
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 }
    //             } else {
    //                 thInput.onchange = '';
    //             }
    //         }
    //
    //         importedTablesShortcodesList.style.display = 'block';
    //
    //         let importTableReplaceShortcodesButton = document.querySelectorAll('.wptb-importTableReplaceShortcodes');
    //         if (importTableReplaceShortcodesButton.length > 0) {
    //             for (let i = 0; i < importTableReplaceShortcodesButton.length; i++) {
    //                 importTableReplaceShortcodesButton[i].style.display = 'block';
    //
    //                 importTableReplaceShortcodesButton[i].onclick = importedTablesReplaceShortcodes.bind(this, tbody);
    //             }
    //         }
    //     }
    // }
  }
  /**
   * function for replace imported shortcodes in posts
   * considering choosing imported shortcodes
   */


  function importedTablesReplaceShortcodes(tbody) {
    if (tbody && tbody.children && tbody.children.length > 0) {
      var rows = tbody.children;
      var replacingShortcodes = [];

      for (var i = 0; i < rows.length; i++) {
        var tr = rows[i];
        var tds = tr.children;

        if (tds.length > 0 && tds[0] && tds[1] && tds[2]) {
          var inputCheckbox = tds[0].querySelector('input');

          if (inputCheckbox && inputCheckbox.checked && tds[1].innerHTML && tds[2].innerHTML) {
            replacingShortcodes.push({
              search: tds[1].innerHTML,
              replace: tds[2].innerHTML
            });
          }
        }
      }

      if (replacingShortcodes.length > 0) {
        replaceShortcodesAjax(replacingShortcodes, true);
      }
    }
  }

  function replaceShortcodesAjax(replacingShortcodes, firstRun) {
    if (replacingShortcodes && Array.isArray(replacingShortcodes) && replacingShortcodes.length > 0) {
      if (firstRun) {
        window.wptbImportShortcodesNecessaryReplace = replacingShortcodes.length;
        window.wptbImportShortcodesReplacedCount = 0;
        tableImportingProgressBar(0, window.wptbImportShortcodesNecessaryReplace, 'replace');
      }

      var http = new XMLHttpRequest();
      var url = "".concat(options.ajaxUrl, "?action=shortcodes_replace");
      var replacingShortcodesOne = replacingShortcodes.shift();
      var params = {
        replacing_shortcodes: replacingShortcodesOne,
        security_code: options.security_code
      };
      params = JSON.stringify(params);
      http.open('POST', url, true);
      http.setRequestHeader('Content-type', 'application/json; charset=utf-8');

      http.onreadystatechange = function (action) {
        if (this.readyState == 4 && this.status == 200) {
          var data = JSON.parse(http.responseText);
          var commonCount = window.wptbImportShortcodesNecessaryReplace;
          var replacedCount = window.wptbImportShortcodesNecessaryReplace - replacingShortcodes.length;
          var percent = 0;

          if (data && Array.isArray(data) && data[0] == 'success') {
            percent = tableImportingProgressBar(replacedCount, commonCount, 'replace');

            if (window.wptbImportShortcodesReplacedCount) {
              window.wptbImportShortcodesReplacedCount += data[1];
            } else {
              window.wptbImportShortcodesReplacedCount = data[1];
            }
          } else {
            percent = tableImportingProgressBar(commonCount, commonCount, 'replace');
          }

          if (percent == 100) {
            WPTB_Helper.wptbDocumentEventGenerate('table:shortcode:replace', document, window.wptbImportShortcodesReplacedCount);
            var importProgressBarContainer = document.querySelector('.wptb-importPBarContainer');

            if (importProgressBarContainer) {
              importProgressBarContainer.addEventListener('wptb-import:progressBar:full:replace', function () {
                var importedTablesShortcodesReplaced = document.querySelector('.wptb-importedTablesShortcodesReplaced');

                if (importedTablesShortcodesReplaced) {
                  importedTablesShortcodesReplaced.style.display = 'block';
                  var importedShortcodesReplaceCount = document.querySelector('.wptb-importedShortcodesReplaceCount span');

                  if (importedShortcodesReplaceCount) {
                    if (window.wptbImportShortcodesReplacedCount) {
                      importedShortcodesReplaceCount.innerHTML = window.wptbImportShortcodesReplacedCount;
                    } else {
                      importedShortcodesReplaceCount.innerHTML = '0';
                    }
                  }
                }
              }, false);
            }
          } else {
            replaceShortcodesAjax(replacingShortcodes);
          }
        }
      };

      http.send(params);
    }
  }
  /**
   * function for change "TablePress" table
   * for importing it to WPTB
   */


  function tableDomImportingHandler(tableDomElem, tableContent, iframe, dataTables) {
    if (tableDomElem) {
      /*
       * set including border style for table
       */
      tableDomElem.style.borderStyle = 'solid';
      tableDomElem.style.borderWidth = '1px'; // WPTB_Helper.checkSetGetStyleSizeValue( tableDomElem, 'border-width', 'border-top-width', 'px' );

      WPTB_Helper.checkSetGetStyleColorValue(tableDomElem, 'border-color', 'border-top-color', true);
      /*
       * checking float table and set necessary attributes if it is
       */

      var tableFloat = WPTB_Helper.checkSetGetStyleValue(tableDomElem, 'float', 'float');

      if (tableFloat && tableFloat != 'none') {
        tableDomElem.dataset.wptbTableAlignment = tableFloat;
      }
      /*
       * remove 'caption' tag from table
       */


      var caption = tableDomElem.querySelector('caption');

      if (caption) {
        tableDomElem.removeChild(caption);
      }
      /*
       * remove class attribute from 'tbody' tag
       */


      var tBody = tableDomElem.querySelector('tbody');

      if (tBody) {
        tBody.removeAttribute('class');
      }

      var tHead = tableDomElem.querySelector('thead');

      if (tHead) {
        var tHeadInnerHtml = tHead.innerHTML;

        if (tHeadInnerHtml) {
          tHeadInnerHtml = WPTB_Helper.replaceAll(tHeadInnerHtml, '<th', '<td');
          tHeadInnerHtml = WPTB_Helper.replaceAll(tHeadInnerHtml, 'th>', 'td>');

          if (tBody) {
            var tBodyInnerHtml = tBody.innerHTML;
            tBodyInnerHtml = tHeadInnerHtml + tBodyInnerHtml;
            tBody.innerHTML = tBodyInnerHtml;
          }
        }

        tableDomElem.removeChild(tHead);
      }

      var tFoot = tableDomElem.querySelector('tfoot');

      if (tFoot) {
        var tFootInnerHtml = tFoot.innerHTML;

        if (tFootInnerHtml) {
          if (tBody) {
            var _tBodyInnerHtml = tBody.innerHTML;
            _tBodyInnerHtml += tFootInnerHtml;
            tBody.innerHTML = _tBodyInnerHtml;
          }
        }

        tableDomElem.removeChild(tFoot);
      }
      /**
       * Using recalculateIndexes function to
       * add X and Y indexes for each cell and
       * add table columns and maxColumns properties
       * for tableDomElem object that it'll be necessary
       */


      WPTB_Helper.recalculateIndexes(tableDomElem);
      var trs = tableDomElem.querySelectorAll('tr');

      if (trs.length > 0) {
        var elementsIndexes = {
          imageElemIndex: 1,
          textElemIndex: 1,
          customHtmlElemIndex: 1
        };

        for (var i = 0; i < trs.length; i++) {
          /**
           * necessary removes and addings of attributes for td
           */
          trs[i].removeAttribute('class');
          trs[i].removeAttribute('role');
          trs[i].classList.add('wptb-row');
          /**
           * checking value of tr backgroundColor
           * if it is empty trsBackgroundColorIndic is true
           */

          var trsBackgroundColorIndic = true;
          var tdsBackgroundColor = WPTB_Helper.checkSetGetStyleColorValue(trs[i], 'background-color', 'background-color');

          if (tdsBackgroundColor) {
            if (!WPTB_Helper.isHex(tdsBackgroundColor)) {
              tdsBackgroundColor = WPTB_Helper.rgbToHex(tdsBackgroundColor);
            }

            trs[i].style.tdsBackgroundColor = tdsBackgroundColor;
            trsBackgroundColorIndic = false;
          } // let tablecontentForRow;
          // if( tableContent && Array.isArray( tableContent ) ) {
          //     tablecontentForRow = tableContent[i];
          // }


          var tds = _toConsumableArray(trs[i].children);

          var tdsBackgrounds = void 0;
          var trInnerHtml = '';

          for (var j = 0; j < tds.length; j++) {
            /**
             * checking all backgroundColors styles of cells and saving its in tdsBackgrounds variable
             * if backgroundColors of cells are different setting tdsBackgrounds is empty
             */
            if (trsBackgroundColorIndic) {
              if (j > 0 && tdsBackgrounds != WPTB_Helper.checkSetGetStyleColorValue(trChildNodes[i], 'background-color', 'background-color')) {
                tdsBackgrounds = '';
                trsBackgroundColorIndic = false;
              } else {
                tdsBackgrounds = WPTB_Helper.checkSetGetStyleColorValue(trChildNodes[i], 'background-color', 'background-color');
              }
            }
            /**
             * checkin of border width and border color of cell
             * and also checking of dimension, if dimension isn't "px"
             * setting these values null
             */
            // WPTB_Helper.checkSetGetStyleSizeValue( tds[j], 'width', 'width', 'px' );
            // WPTB_Helper.checkSetGetStyleSizeValue( tds[j], 'height', 'height', 'px' );


            tds[j].style.width = null;
            tds[j].style.height = null;
            tds[j].style.borderStyle = 'solid';
            tds[j].style.borderWidth = '1px'; // let borderWidth1 = WPTB_Helper.checkSetGetStyleColorValue( tds[j], 'border-width', 'border-top-width' );
            // let borderWidth2 = WPTB_Helper.checkSetGetStyleColorValue( tds[j], 'border-width', 'border-left-width' );
            // let borderWidth3 = WPTB_Helper.checkSetGetStyleColorValue( tds[j], 'border-width', 'border-right-width' );
            // let borderWidth4 = WPTB_Helper.checkSetGetStyleColorValue( tds[j], 'border-width', 'border-bottom-width' );
            //
            // let borderWidth = WPTB_Helper.getValueMaxCountSameElementsInArray( [borderWidth1, borderWidth2, borderWidth3, borderWidth4] );
            //
            // if( borderWidth && WPTB_Helper.checkingDimensionValue( borderWidth, 'px' ) ) {
            //     tds[j].style.borderWidth = borderWidth;
            // } else {
            //     tds[j].style.borderWidth = '';
            // }

            var borderColor1 = WPTB_Helper.checkSetGetStyleColorValue(tds[j], 'border-color', 'border-top-color');
            var borderColor2 = WPTB_Helper.checkSetGetStyleColorValue(tds[j], 'border-color', 'border-left-color');
            var borderColor3 = WPTB_Helper.checkSetGetStyleColorValue(tds[j], 'border-color', 'border-right-color');
            var borderColor4 = WPTB_Helper.checkSetGetStyleColorValue(tds[j], 'border-color', 'border-bottom-color');
            var borderColor = WPTB_Helper.getValueMaxCountSameElementsInArray([borderColor1, borderColor2, borderColor3, borderColor4]);

            if (borderColor) {
              if (!WPTB_Helper.isHex(borderColor)) {
                borderColor = WPTB_Helper.rgbToHex(borderColor);
              }

              tds[j].style.borderColor = borderColor;
            }

            WPTB_Helper.checkSetGetStyleSizeValue(tds[j], 'padding', 'padding-top', 'px');
            tds[j].dataset.wptbCssTdAutoWidth = 'true';
            /**
             * necessary removes and addings of attributes for td
             */

            tds[j].removeAttribute('class');
            tds[j].removeAttribute('role');
            tds[j].classList.add('wptb-droppable', 'wptb-cell');
            var tdXIndex = tds[j].dataset.xIndex;
            var tdYIndex = tds[j].dataset.yIndex;

            if (tdXIndex && tdYIndex && Array.isArray(tableContent) && tableContent[tdYIndex] && Array.isArray(tableContent[tdYIndex]) && tableContent[tdYIndex][tdXIndex]) {
              tds[j].innerHTML = tableContent[tdYIndex][tdXIndex];

              var tdChildNodes = _toConsumableArray(tds[j].childNodes);

              var childNodesHandleredIndexesArr = tdChildNodesHandler(tdChildNodes, elementsIndexes);
              var wptbElements = void 0;

              if (childNodesHandleredIndexesArr && Array.isArray(childNodesHandleredIndexesArr)) {
                wptbElements = childNodesHandleredIndexesArr[0];
                elementsIndexes = childNodesHandleredIndexesArr[1];
              }

              tds[j].innerHTML = '';

              for (var k = 0; k < wptbElements.length; k++) {
                tds[j].appendChild(wptbElements[k]);
              }
            }

            trInnerHtml += tds[j].outerHTML;
          }

          trs[i].innerHTML = trInnerHtml;
          trs[i].style.backgroundColor = WPTB_Helper.rgbToHex(tdsBackgrounds);
        }
      }

      tableDomElem.removeAttribute('class');
      tableDomElem.removeAttribute('role');
      tableDomElem.removeAttribute('id');
      tableDomElem.removeAttribute('aria-describedby');
      tableDomElem.classList.add('wptb-preview-table', 'wptb-element-main-table_setting-startedid-0');
      addAttributesForTable(tableDomElem);
      tablePressImportStageFour(tableDomElem, iframe, dataTables);
    }
  }

  function tdChildNodesHandler(tdChildNodes, elementsIndexes) {
    var wptbElements = [];

    for (var k = 0; k < tdChildNodes.length; k++) {
      if (tdChildNodes[k].nodeType != 1 && tdChildNodes[k].nodeType != 3) {
        continue;
      }

      var element = document.createElement('div');

      if (tdChildNodes[k].nodeType == 1) {
        if (tdChildNodes[k].nodeName.toLowerCase() === 'img') {
          tdChildNodes[k].style.width = '100%';
          tdChildNodes[k].removeAttribute('class');
          element.classList.add('wptb-image-container', 'wptb-ph-element', 'wptb-element-image-' + elementsIndexes.imageElemIndex);
          element.innerHTML = "".concat('<div class="wptb-image-wrapper">' + '<a style="display: block;" target="_blank" rel="nofollow">').concat(tdChildNodes[k].outerHTML, "</a>") + "</div>";
          var img = element.querySelector('img');
          if (img) img.style.width = '100%';
          elementsIndexes.imageElemIndex++;
        } else if (tdChildNodes[k].nodeName.toLowerCase() === 'wptb_shortcode_container_element') {
          element.classList.add('wptb-shortcode-container', 'wptb-ph-element', 'wptb-element-shortcode-' + elementsIndexes.customHtmlElemIndex);
          element.innerHTML = '<wptb_shortcode_container_element><div>' + tdChildNodes[k].innerHTML + '</div></wptb_shortcode_container_element>';
          elementsIndexes.customHtmlElemIndex++;
        } else {
          element.classList.add('wptb-html-container', 'wptb-ph-element', 'wptb-element-custom_html-' + elementsIndexes.customHtmlElemIndex);
          element.innerHTML = '<div class="wptb-custom-html-wrapper" data-wptb-new-element="1">' + tdChildNodes[k].outerHTML + '</div>';
          elementsIndexes.customHtmlElemIndex++;
        }
      } else if (tdChildNodes[k].nodeType == 3) {
        element.classList.add('wptb-text-container', 'wptb-ph-element', 'wptb-element-text-' + elementsIndexes.textElemIndex);
        element.innerHTML = "<div><p>".concat(tdChildNodes[k].nodeValue, "</p></div>"); // tds[j].insertBefore( element, tdChildNodes[k] );
        // tds[j].removeChild( tdChildNodes[k] );

        var textP = element.querySelector('p');

        if (textP) {
          var textPFontSize = WPTB_Helper.checkSetGetStyleSizeValue(textP, 'font-size', 'font-size');

          if (textPFontSize) {
            if (WPTB_Helper.checkingDimensionValue(textPFontSize, 'px')) {
              textP.style.fontSize = null;
              element.style.fontSize = textPFontSize;
            }
          }

          var textPColor = WPTB_Helper.checkSetGetStyleColorValue(textP, 'color', 'color');

          if (textPColor) {
            if (WPTB_Helper.isHex(textPColor)) {
              textP.style.color = null;
              element.style.color = textPColor;
            } else if (WPTB_Helper.rgbToHex(textPColor)) {
              textP.style.color = null;
              textPColor = WPTB_Helper.rgbToHex(textPColor);
              element.style.color = textPColor;
            }
          }
        }

        elementsIndexes.textElemIndex++;
      }

      wptbElements.push(element);
    }

    return [wptbElements, elementsIndexes];
  } // creates hidden iframe
  // uploading there content by shortcode
  // and return DOM Html of this content
  // @deprecated


  function getContentShortcodes(shortcode) {// if (shortcode) {
    //   let importIframeSection = document.getElementById('wptb-importIframeSection');
    //   if (importIframeSection) {
    //     let iframe = importIframeSection.querySelector('iframe');
    //     iframe.style.width = '100%';
    //     iframe.style.height = '800px';
    //     let url = wptb_admin_import_js_object
    //       ? `${wptb_admin_import_js_object.import_iframe_url
    //                 }&_wpnonce=${  wptb_admin_import_js_object.security_code  }&shortcode=${  shortcode}` : '';
    //       : '';
    //     iframe.src = url;
    //     importIframeSection.appendChild(iframe);
    //
    //     return iframe.querySelector('table .tablepress');
    //   }
    // }
  }

  return {
    importFromFile: importFromFile,
    importFromPlugin: importFromPlugin,
    replaceShortcodesAjax: replaceShortcodesAjax
  };
}
/**
 * @module ImportOperations module
 */


var _default = ImportOperations;
exports.default = _default;
},{}],"containers/CSVImportMenu.vue":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _DragDrop = _interopRequireDefault(require("../components/DragDrop.vue"));

var _ControlItem = _interopRequireDefault(require("../components/ControlItem.vue"));

var _MenuButton = _interopRequireDefault(require("../components/MenuButton.vue"));

var _importOperations = _interopRequireDefault(require("../functions/importOperations.js"));

var _withMessage = _interopRequireDefault(require("../mixins/withMessage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  props: ['options'],
  mixins: [_withMessage.default],
  components: {
    DragDrop: _DragDrop.default,
    ControlItem: _ControlItem.default,
    MenuButton: _MenuButton.default
  },
  data: function data() {
    return {
      settings: {
        responsiveTables: false,
        topRowAsHeader: false,
        csvDelimiter: ','
      },
      fieldsData: [],
      currentFile: null,
      fetching: false
    };
  },
  mounted: function mounted() {
    var _this = this;

    document.addEventListener('table:imported:saved', function () {
      _this.currentFile = null;

      _this.setMessage({
        type: 'ok',
        message: _this.strings.tableImported
      });

      _this.setBusy(false);
    });
    document.addEventListener('table:imported:error', function () {
      _this.currentFile = null;

      _this.setMessage({
        type: 'error',
        message: _this.strings.errorOccured
      });

      _this.setBusy(false);
    });
    this.fieldsData.push({
      type: 'dropdown',
      id: 'csvDelimiter',
      modelBind: this.settings,
      label: this.strings.csvDelimiter,
      options: [{
        value: ',',
        label: ', (comma)'
      }, {
        value: ';',
        label: '; (semicolon)'
      }, {
        value: 'tab',
        label: '\\t (tabular)'
      }]
    }, {
      type: 'checkbox',
      id: 'responsiveTables',
      modelBind: this.settings,
      label: this.strings.tableResponsive
    }, {
      type: 'checkbox',
      id: 'topRowAsHeader',
      modelBind: this.settings,
      label: this.strings.topRowHeader
    });
  },
  computed: {
    isImportDisabled: function isImportDisabled() {
      if (this.currentFile === null) {
        return true;
      }

      return this.fetching;
    }
  },
  methods: {
    importFromFile: function importFromFile() {
      if (this.currentFile !== null) {
        var options = {
          file: this.currentFile,
          ajaxUrl: this.options.ajaxUrl,
          nonce: this.options.security_code,
          delimiter: this.settings.csvDelimiter,
          tableResponsive: this.settings.responsiveTables,
          topRowAsHeader: this.settings.topRowAsHeader
        };
        var operations = (0, _importOperations.default)(options);
        this.setBusy();
        operations.importFromFile();
      }
    }
  }
};
exports.default = _default;
        var $eda786 = exports.default || module.exports;
      
      if (typeof $eda786 === 'function') {
        $eda786 = $eda786.options;
      }
    
        /* template */
        Object.assign($eda786, (function () {
          var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("drag-drop", {
        attrs: {
          texts: {
            hint: _vm.strings.fileDropHint,
            browse: _vm.strings.browse,
            clear: _vm.strings.clear
          },
          "allowed-formats": ["csv", "zip"]
        },
        model: {
          value: _vm.currentFile,
          callback: function($$v) {
            _vm.currentFile = $$v
          },
          expression: "currentFile"
        }
      }),
      _vm._v(" "),
      _c(
        "div",
        _vm._l(_vm.fieldsData, function(field) {
          return _c("control-item", {
            key: field.id,
            attrs: { "field-data": field, "model-bind": field.modelBind }
          })
        }),
        1
      ),
      _vm._v(" "),
      _c(
        "portal",
        { attrs: { to: "footerButtons" } },
        [
          _c(
            "menu-button",
            {
              attrs: { disabled: _vm.isImportDisabled },
              on: { click: _vm.importFromFile }
            },
            [_vm._v(_vm._s(_vm.strings.importSection) + " ")]
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
},{"../components/DragDrop.vue":"components/DragDrop.vue","../components/ControlItem.vue":"components/ControlItem.vue","../components/MenuButton.vue":"components/MenuButton.vue","../functions/importOperations.js":"functions/importOperations.js","../mixins/withMessage":"mixins/withMessage.js"}],"../../../../../node_modules/vue-fragment/dist/vue-fragment.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Plugin = exports.SSR = exports.Fragment = exports.default = void 0;

function _defineProperty(e, n, t) {
  return n in e ? Object.defineProperty(e, n, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[n] = t, e;
}

function _objectSpread(e) {
  for (var n = 1; n < arguments.length; n++) {
    var t = null != arguments[n] ? arguments[n] : {},
        r = Object.keys(t);
    "function" == typeof Object.getOwnPropertySymbols && (r = r.concat(Object.getOwnPropertySymbols(t).filter(function (e) {
      return Object.getOwnPropertyDescriptor(t, e).enumerable;
    }))), r.forEach(function (n) {
      _defineProperty(e, n, t[n]);
    });
  }

  return e;
}

var freeze = function (e, n, t) {
  Object.defineProperty(e, n, {
    configurable: !0,
    get: function () {
      return t;
    },
    set: function (e) {
      console.warn("tried to set frozen property ".concat(n, " with ").concat(e));
    }
  });
},
    unfreeze = function (e, n) {
  var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
  Object.defineProperty(e, n, {
    configurable: !0,
    writable: !0,
    value: t
  });
},
    component = {
  abstract: !0,
  name: "Fragment",
  props: {
    name: {
      type: String,
      default: function () {
        return Math.floor(Date.now() * Math.random()).toString(16);
      }
    }
  },
  mounted: function () {
    var e = this.$el,
        n = e.parentNode,
        t = document.createComment("fragment#".concat(this.name, "#head")),
        r = document.createComment("fragment#".concat(this.name, "#tail"));
    n.insertBefore(t, e), n.insertBefore(r, e), e.appendChild = function (t) {
      n.insertBefore(t, r), freeze(t, "parentNode", e);
    }, e.insertBefore = function (t, r) {
      n.insertBefore(t, r), freeze(t, "parentNode", e);
    }, e.removeChild = function (e) {
      n.removeChild(e), unfreeze(e, "parentNode");
    }, Array.from(e.childNodes).forEach(function (n) {
      return e.appendChild(n);
    }), n.removeChild(e), freeze(e, "parentNode", n), freeze(e, "nextSibling", r.nextSibling);
    var o = n.insertBefore;

    n.insertBefore = function (r, i) {
      o.call(n, r, i !== e ? i : t);
    };

    var i = n.removeChild;

    n.removeChild = function (a) {
      if (a === e) {
        for (; t.nextSibling !== r;) e.removeChild(t.nextSibling);

        n.removeChild(t), n.removeChild(r), unfreeze(e, "parentNode"), n.insertBefore = o, n.removeChild = i;
      } else i.call(n, a);
    };
  },
  render: function (e) {
    var n = this,
        t = this.$slots.default;
    return t && t.length && t.forEach(function (e) {
      return e.data = _objectSpread({}, e.data, {
        attrs: _objectSpread({
          fragment: n.name
        }, (e.data || {}).attrs)
      });
    }), e("div", {
      attrs: {
        fragment: this.name
      }
    }, t);
  }
};

function ssr(e, n) {
  "production" !== "development" && console.warn("v-fragment SSR is not implemented yet.");
}

var Fragment = component,
    SSR = ssr,
    Plugin = {
  install: function (e) {
    e.component("fragment", component);
  }
},
    index = {
  Fragment: component,
  Plugin: Plugin,
  SSR: ssr
};
exports.Plugin = Plugin;
exports.SSR = SSR;
exports.Fragment = Fragment;
var _default = index;
exports.default = _default;
},{}],"../../../../../node_modules/memize/index.js":[function(require,module,exports) {
/**
 * Memize options object.
 *
 * @typedef MemizeOptions
 *
 * @property {number} [maxSize] Maximum size of the cache.
 */

/**
 * Internal cache entry.
 *
 * @typedef MemizeCacheNode
 *
 * @property {?MemizeCacheNode|undefined} [prev] Previous node.
 * @property {?MemizeCacheNode|undefined} [next] Next node.
 * @property {Array<*>}                   args   Function arguments for cache
 *                                               entry.
 * @property {*}                          val    Function result.
 */

/**
 * Properties of the enhanced function for controlling cache.
 *
 * @typedef MemizeMemoizedFunction
 *
 * @property {()=>void} clear Clear the cache.
 */

/**
 * Accepts a function to be memoized, and returns a new memoized function, with
 * optional options.
 *
 * @template {Function} F
 *
 * @param {F}             fn        Function to memoize.
 * @param {MemizeOptions} [options] Options object.
 *
 * @return {F & MemizeMemoizedFunction} Memoized function.
 */
function memize(fn, options) {
  var size = 0;
  /** @type {?MemizeCacheNode|undefined} */

  var head;
  /** @type {?MemizeCacheNode|undefined} */

  var tail;
  options = options || {};

  function memoized()
  /* ...args */
  {
    var node = head,
        len = arguments.length,
        args,
        i;

    searchCache: while (node) {
      // Perform a shallow equality test to confirm that whether the node
      // under test is a candidate for the arguments passed. Two arrays
      // are shallowly equal if their length matches and each entry is
      // strictly equal between the two sets. Avoid abstracting to a
      // function which could incur an arguments leaking deoptimization.
      // Check whether node arguments match arguments length
      if (node.args.length !== arguments.length) {
        node = node.next;
        continue;
      } // Check whether node arguments match arguments values


      for (i = 0; i < len; i++) {
        if (node.args[i] !== arguments[i]) {
          node = node.next;
          continue searchCache;
        }
      } // At this point we can assume we've found a match
      // Surface matched node to head if not already


      if (node !== head) {
        // As tail, shift to previous. Must only shift if not also
        // head, since if both head and tail, there is no previous.
        if (node === tail) {
          tail = node.prev;
        } // Adjust siblings to point to each other. If node was tail,
        // this also handles new tail's empty `next` assignment.

        /** @type {MemizeCacheNode} */


        node.prev.next = node.next;

        if (node.next) {
          node.next.prev = node.prev;
        }

        node.next = head;
        node.prev = null;
        /** @type {MemizeCacheNode} */

        head.prev = node;
        head = node;
      } // Return immediately


      return node.val;
    } // No cached value found. Continue to insertion phase:
    // Create a copy of arguments (avoid leaking deoptimization)


    args = new Array(len);

    for (i = 0; i < len; i++) {
      args[i] = arguments[i];
    }

    node = {
      args: args,
      // Generate the result from original function
      val: fn.apply(null, args)
    }; // Don't need to check whether node is already head, since it would
    // have been returned above already if it was
    // Shift existing head down list

    if (head) {
      head.prev = node;
      node.next = head;
    } else {
      // If no head, follows that there's no tail (at initial or reset)
      tail = node;
    } // Trim tail if we're reached max size and are pending cache insertion


    if (size ===
    /** @type {MemizeOptions} */
    options.maxSize) {
      tail =
      /** @type {MemizeCacheNode} */
      tail.prev;
      /** @type {MemizeCacheNode} */

      tail.next = null;
    } else {
      size++;
    }

    head = node;
    return node.val;
  }

  memoized.clear = function () {
    head = null;
    tail = null;
    size = 0;
  };

  if ("development" === 'test') {
    // Cache is not exposed in the public API, but used in tests to ensure
    // expected list progression
    memoized.getCache = function () {
      return [head, tail, size];
    };
  } // Ignore reason: There's not a clear solution to create an intersection of
  // the function with additional properties, where the goal is to retain the
  // function signature of the incoming argument and add control properties
  // on the return value.
  // @ts-ignore


  return memoized;
}

module.exports = memize;
},{}],"../../../../../node_modules/sprintf-js/src/sprintf.js":[function(require,module,exports) {
var define;
/* global window, exports, define */

!function() {
    'use strict'

    var re = {
        not_string: /[^s]/,
        not_bool: /[^t]/,
        not_type: /[^T]/,
        not_primitive: /[^v]/,
        number: /[diefg]/,
        numeric_arg: /[bcdiefguxX]/,
        json: /[j]/,
        not_json: /[^j]/,
        text: /^[^\x25]+/,
        modulo: /^\x25{2}/,
        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
        key: /^([a-z_][a-z_\d]*)/i,
        key_access: /^\.([a-z_][a-z_\d]*)/i,
        index_access: /^\[(\d+)\]/,
        sign: /^[+-]/
    }

    function sprintf(key) {
        // `arguments` is not an array, but should be fine for this call
        return sprintf_format(sprintf_parse(key), arguments)
    }

    function vsprintf(fmt, argv) {
        return sprintf.apply(null, [fmt].concat(argv || []))
    }

    function sprintf_format(parse_tree, argv) {
        var cursor = 1, tree_length = parse_tree.length, arg, output = '', i, k, ph, pad, pad_character, pad_length, is_positive, sign
        for (i = 0; i < tree_length; i++) {
            if (typeof parse_tree[i] === 'string') {
                output += parse_tree[i]
            }
            else if (typeof parse_tree[i] === 'object') {
                ph = parse_tree[i] // convenience purposes only
                if (ph.keys) { // keyword argument
                    arg = argv[cursor]
                    for (k = 0; k < ph.keys.length; k++) {
                        if (arg == undefined) {
                            throw new Error(sprintf('[sprintf] Cannot access property "%s" of undefined value "%s"', ph.keys[k], ph.keys[k-1]))
                        }
                        arg = arg[ph.keys[k]]
                    }
                }
                else if (ph.param_no) { // positional argument (explicit)
                    arg = argv[ph.param_no]
                }
                else { // positional argument (implicit)
                    arg = argv[cursor++]
                }

                if (re.not_type.test(ph.type) && re.not_primitive.test(ph.type) && arg instanceof Function) {
                    arg = arg()
                }

                if (re.numeric_arg.test(ph.type) && (typeof arg !== 'number' && isNaN(arg))) {
                    throw new TypeError(sprintf('[sprintf] expecting number but found %T', arg))
                }

                if (re.number.test(ph.type)) {
                    is_positive = arg >= 0
                }

                switch (ph.type) {
                    case 'b':
                        arg = parseInt(arg, 10).toString(2)
                        break
                    case 'c':
                        arg = String.fromCharCode(parseInt(arg, 10))
                        break
                    case 'd':
                    case 'i':
                        arg = parseInt(arg, 10)
                        break
                    case 'j':
                        arg = JSON.stringify(arg, null, ph.width ? parseInt(ph.width) : 0)
                        break
                    case 'e':
                        arg = ph.precision ? parseFloat(arg).toExponential(ph.precision) : parseFloat(arg).toExponential()
                        break
                    case 'f':
                        arg = ph.precision ? parseFloat(arg).toFixed(ph.precision) : parseFloat(arg)
                        break
                    case 'g':
                        arg = ph.precision ? String(Number(arg.toPrecision(ph.precision))) : parseFloat(arg)
                        break
                    case 'o':
                        arg = (parseInt(arg, 10) >>> 0).toString(8)
                        break
                    case 's':
                        arg = String(arg)
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg)
                        break
                    case 't':
                        arg = String(!!arg)
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg)
                        break
                    case 'T':
                        arg = Object.prototype.toString.call(arg).slice(8, -1).toLowerCase()
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg)
                        break
                    case 'u':
                        arg = parseInt(arg, 10) >>> 0
                        break
                    case 'v':
                        arg = arg.valueOf()
                        arg = (ph.precision ? arg.substring(0, ph.precision) : arg)
                        break
                    case 'x':
                        arg = (parseInt(arg, 10) >>> 0).toString(16)
                        break
                    case 'X':
                        arg = (parseInt(arg, 10) >>> 0).toString(16).toUpperCase()
                        break
                }
                if (re.json.test(ph.type)) {
                    output += arg
                }
                else {
                    if (re.number.test(ph.type) && (!is_positive || ph.sign)) {
                        sign = is_positive ? '+' : '-'
                        arg = arg.toString().replace(re.sign, '')
                    }
                    else {
                        sign = ''
                    }
                    pad_character = ph.pad_char ? ph.pad_char === '0' ? '0' : ph.pad_char.charAt(1) : ' '
                    pad_length = ph.width - (sign + arg).length
                    pad = ph.width ? (pad_length > 0 ? pad_character.repeat(pad_length) : '') : ''
                    output += ph.align ? sign + arg + pad : (pad_character === '0' ? sign + pad + arg : pad + sign + arg)
                }
            }
        }
        return output
    }

    var sprintf_cache = Object.create(null)

    function sprintf_parse(fmt) {
        if (sprintf_cache[fmt]) {
            return sprintf_cache[fmt]
        }

        var _fmt = fmt, match, parse_tree = [], arg_names = 0
        while (_fmt) {
            if ((match = re.text.exec(_fmt)) !== null) {
                parse_tree.push(match[0])
            }
            else if ((match = re.modulo.exec(_fmt)) !== null) {
                parse_tree.push('%')
            }
            else if ((match = re.placeholder.exec(_fmt)) !== null) {
                if (match[2]) {
                    arg_names |= 1
                    var field_list = [], replacement_field = match[2], field_match = []
                    if ((field_match = re.key.exec(replacement_field)) !== null) {
                        field_list.push(field_match[1])
                        while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                            if ((field_match = re.key_access.exec(replacement_field)) !== null) {
                                field_list.push(field_match[1])
                            }
                            else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
                                field_list.push(field_match[1])
                            }
                            else {
                                throw new SyntaxError('[sprintf] failed to parse named argument key')
                            }
                        }
                    }
                    else {
                        throw new SyntaxError('[sprintf] failed to parse named argument key')
                    }
                    match[2] = field_list
                }
                else {
                    arg_names |= 2
                }
                if (arg_names === 3) {
                    throw new Error('[sprintf] mixing positional and named placeholders is not (yet) supported')
                }

                parse_tree.push(
                    {
                        placeholder: match[0],
                        param_no:    match[1],
                        keys:        match[2],
                        sign:        match[3],
                        pad_char:    match[4],
                        align:       match[5],
                        width:       match[6],
                        precision:   match[7],
                        type:        match[8]
                    }
                )
            }
            else {
                throw new SyntaxError('[sprintf] unexpected placeholder')
            }
            _fmt = _fmt.substring(match[0].length)
        }
        return sprintf_cache[fmt] = parse_tree
    }

    /**
     * export to either browser or node.js
     */
    /* eslint-disable quote-props */
    if (typeof exports !== 'undefined') {
        exports['sprintf'] = sprintf
        exports['vsprintf'] = vsprintf
    }
    if (typeof window !== 'undefined') {
        window['sprintf'] = sprintf
        window['vsprintf'] = vsprintf

        if (typeof define === 'function' && define['amd']) {
            define(function() {
                return {
                    'sprintf': sprintf,
                    'vsprintf': vsprintf
                }
            })
        }
    }
    /* eslint-enable quote-props */
}(); // eslint-disable-line

},{}],"../../../../../node_modules/@wordpress/i18n/build-module/sprintf.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sprintf = sprintf;

var _memize = _interopRequireDefault(require("memize"));

var _sprintfJs = _interopRequireDefault(require("sprintf-js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * External dependencies
 */

/**
 * Log to console, once per message; or more precisely, per referentially equal
 * argument set. Because Jed throws errors, we log these to the console instead
 * to avoid crashing the application.
 *
 * @param {...*} args Arguments to pass to `console.error`
 */
var logErrorOnce = (0, _memize.default)(console.error); // eslint-disable-line no-console

/**
 * Returns a formatted string. If an error occurs in applying the format, the
 * original format string is returned.
 *
 * @param {string}    format The format of the string to generate.
 * @param {...string} args   Arguments to apply to the format.
 *
 * @see http://www.diveintojavascript.com/projects/javascript-sprintf
 *
 * @return {string} The formatted string.
 */

function sprintf(format) {
  try {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return _sprintfJs.default.sprintf.apply(_sprintfJs.default, [format].concat(args));
  } catch (error) {
    logErrorOnce('sprintf error: \n\n' + error.toString());
    return format;
  }
}
},{"memize":"../../../../../node_modules/memize/index.js","sprintf-js":"../../../../../node_modules/sprintf-js/src/sprintf.js"}],"../../../../../node_modules/@babel/runtime/helpers/esm/defineProperty.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _defineProperty;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
},{}],"../../../../../node_modules/@tannin/postfix/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = postfix;
var PRECEDENCE, OPENERS, TERMINATORS, PATTERN;
/**
 * Operator precedence mapping.
 *
 * @type {Object}
 */

PRECEDENCE = {
  '(': 9,
  '!': 8,
  '*': 7,
  '/': 7,
  '%': 7,
  '+': 6,
  '-': 6,
  '<': 5,
  '<=': 5,
  '>': 5,
  '>=': 5,
  '==': 4,
  '!=': 4,
  '&&': 3,
  '||': 2,
  '?': 1,
  '?:': 1
};
/**
 * Characters which signal pair opening, to be terminated by terminators.
 *
 * @type {string[]}
 */

OPENERS = ['(', '?'];
/**
 * Characters which signal pair termination, the value an array with the
 * opener as its first member. The second member is an optional operator
 * replacement to push to the stack.
 *
 * @type {string[]}
 */

TERMINATORS = {
  ')': ['('],
  ':': ['?', '?:']
};
/**
 * Pattern matching operators and openers.
 *
 * @type {RegExp}
 */

PATTERN = /<=|>=|==|!=|&&|\|\||\?:|\(|!|\*|\/|%|\+|-|<|>|\?|\)|:/;
/**
 * Given a C expression, returns the equivalent postfix (Reverse Polish)
 * notation terms as an array.
 *
 * If a postfix string is desired, simply `.join( ' ' )` the result.
 *
 * @example
 *
 * ```js
 * import postfix from '@tannin/postfix';
 *
 * postfix( 'n > 1' );
 * // ⇒ [ 'n', '1', '>' ]
 * ```
 *
 * @param {string} expression C expression.
 *
 * @return {string[]} Postfix terms.
 */

function postfix(expression) {
  var terms = [],
      stack = [],
      match,
      operator,
      term,
      element;

  while (match = expression.match(PATTERN)) {
    operator = match[0]; // Term is the string preceding the operator match. It may contain
    // whitespace, and may be empty (if operator is at beginning).

    term = expression.substr(0, match.index).trim();

    if (term) {
      terms.push(term);
    }

    while (element = stack.pop()) {
      if (TERMINATORS[operator]) {
        if (TERMINATORS[operator][0] === element) {
          // Substitution works here under assumption that because
          // the assigned operator will no longer be a terminator, it
          // will be pushed to the stack during the condition below.
          operator = TERMINATORS[operator][1] || operator;
          break;
        }
      } else if (OPENERS.indexOf(element) >= 0 || PRECEDENCE[element] < PRECEDENCE[operator]) {
        // Push to stack if either an opener or when pop reveals an
        // element of lower precedence.
        stack.push(element);
        break;
      } // For each popped from stack, push to terms.


      terms.push(element);
    }

    if (!TERMINATORS[operator]) {
      stack.push(operator);
    } // Slice matched fragment from expression to continue match.


    expression = expression.substr(match.index + operator.length);
  } // Push remainder of operand, if exists, to terms.


  expression = expression.trim();

  if (expression) {
    terms.push(expression);
  } // Pop remaining items from stack into terms.


  return terms.concat(stack.reverse());
}
},{}],"../../../../../node_modules/@tannin/evaluate/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = evaluate;

/**
 * Operator callback functions.
 *
 * @type {Object}
 */
var OPERATORS = {
  '!': function (a) {
    return !a;
  },
  '*': function (a, b) {
    return a * b;
  },
  '/': function (a, b) {
    return a / b;
  },
  '%': function (a, b) {
    return a % b;
  },
  '+': function (a, b) {
    return a + b;
  },
  '-': function (a, b) {
    return a - b;
  },
  '<': function (a, b) {
    return a < b;
  },
  '<=': function (a, b) {
    return a <= b;
  },
  '>': function (a, b) {
    return a > b;
  },
  '>=': function (a, b) {
    return a >= b;
  },
  '==': function (a, b) {
    return a === b;
  },
  '!=': function (a, b) {
    return a !== b;
  },
  '&&': function (a, b) {
    return a && b;
  },
  '||': function (a, b) {
    return a || b;
  },
  '?:': function (a, b, c) {
    if (a) {
      throw b;
    }

    return c;
  }
};
/**
 * Given an array of postfix terms and operand variables, returns the result of
 * the postfix evaluation.
 *
 * @example
 *
 * ```js
 * import evaluate from '@tannin/evaluate';
 *
 * // 3 + 4 * 5 / 6 ⇒ '3 4 5 * 6 / +'
 * const terms = [ '3', '4', '5', '*', '6', '/', '+' ];
 *
 * evaluate( terms, {} );
 * // ⇒ 6.333333333333334
 * ```
 *
 * @param {string[]} postfix   Postfix terms.
 * @param {Object}   variables Operand variables.
 *
 * @return {*} Result of evaluation.
 */

function evaluate(postfix, variables) {
  var stack = [],
      i,
      j,
      args,
      getOperatorResult,
      term,
      value;

  for (i = 0; i < postfix.length; i++) {
    term = postfix[i];
    getOperatorResult = OPERATORS[term];

    if (getOperatorResult) {
      // Pop from stack by number of function arguments.
      j = getOperatorResult.length;
      args = Array(j);

      while (j--) {
        args[j] = stack.pop();
      }

      try {
        value = getOperatorResult.apply(null, args);
      } catch (earlyReturn) {
        return earlyReturn;
      }
    } else if (variables.hasOwnProperty(term)) {
      value = variables[term];
    } else {
      value = +term;
    }

    stack.push(value);
  }

  return stack[0];
}
},{}],"../../../../../node_modules/@tannin/compile/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = compile;

var _postfix = _interopRequireDefault(require("@tannin/postfix"));

var _evaluate = _interopRequireDefault(require("@tannin/evaluate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Given a C expression, returns a function which can be called to evaluate its
 * result.
 *
 * @example
 *
 * ```js
 * import compile from '@tannin/compile';
 *
 * const evaluate = compile( 'n > 1' );
 *
 * evaluate( { n: 2 } );
 * // ⇒ true
 * ```
 *
 * @param {string} expression C expression.
 *
 * @return {(variables?:{[variable:string]:*})=>*} Compiled evaluator.
 */
function compile(expression) {
  var terms = (0, _postfix.default)(expression);
  return function (variables) {
    return (0, _evaluate.default)(terms, variables);
  };
}
},{"@tannin/postfix":"../../../../../node_modules/@tannin/postfix/index.js","@tannin/evaluate":"../../../../../node_modules/@tannin/evaluate/index.js"}],"../../../../../node_modules/@tannin/plural-forms/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pluralForms;

var _compile = _interopRequireDefault(require("@tannin/compile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Given a C expression, returns a function which, when called with a value,
 * evaluates the result with the value assumed to be the "n" variable of the
 * expression. The result will be coerced to its numeric equivalent.
 *
 * @param {string} expression C expression.
 *
 * @return {Function} Evaluator function.
 */
function pluralForms(expression) {
  var evaluate = (0, _compile.default)(expression);
  return function (n) {
    return +evaluate({
      n: n
    });
  };
}
},{"@tannin/compile":"../../../../../node_modules/@tannin/compile/index.js"}],"../../../../../node_modules/tannin/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Tannin;

var _pluralForms = _interopRequireDefault(require("@tannin/plural-forms"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Tannin constructor options.
 *
 * @typedef {Object} TanninOptions
 *
 * @property {string}   [contextDelimiter] Joiner in string lookup with context.
 * @property {Function} [onMissingKey]     Callback to invoke when key missing.
 */

/**
 * Domain metadata.
 *
 * @typedef {Object} TanninDomainMetadata
 *
 * @property {string}            [domain]       Domain name.
 * @property {string}            [lang]         Language code.
 * @property {(string|Function)} [plural_forms] Plural forms expression or
 *                                              function evaluator.
 */

/**
 * Domain translation pair respectively representing the singular and plural
 * translation.
 *
 * @typedef {[string,string]} TanninTranslation
 */

/**
 * Locale data domain. The key is used as reference for lookup, the value an
 * array of two string entries respectively representing the singular and plural
 * translation.
 *
 * @typedef {{[key:string]:TanninDomainMetadata|TanninTranslation,'':TanninDomainMetadata|TanninTranslation}} TanninLocaleDomain
 */

/**
 * Jed-formatted locale data.
 *
 * @see http://messageformat.github.io/Jed/
 *
 * @typedef {{[domain:string]:TanninLocaleDomain}} TanninLocaleData
 */

/**
 * Default Tannin constructor options.
 *
 * @type {TanninOptions}
 */
var DEFAULT_OPTIONS = {
  contextDelimiter: '\u0004',
  onMissingKey: null
};
/**
 * Given a specific locale data's config `plural_forms` value, returns the
 * expression.
 *
 * @example
 *
 * ```
 * getPluralExpression( 'nplurals=2; plural=(n != 1);' ) === '(n != 1)'
 * ```
 *
 * @param {string} pf Locale data plural forms.
 *
 * @return {string} Plural forms expression.
 */

function getPluralExpression(pf) {
  var parts, i, part;
  parts = pf.split(';');

  for (i = 0; i < parts.length; i++) {
    part = parts[i].trim();

    if (part.indexOf('plural=') === 0) {
      return part.substr(7);
    }
  }
}
/**
 * Tannin constructor.
 *
 * @class
 *
 * @param {TanninLocaleData} data      Jed-formatted locale data.
 * @param {TanninOptions}    [options] Tannin options.
 */


function Tannin(data, options) {
  var key;
  /**
   * Jed-formatted locale data.
   *
   * @name Tannin#data
   * @type {TanninLocaleData}
   */

  this.data = data;
  /**
   * Plural forms function cache, keyed by plural forms string.
   *
   * @name Tannin#pluralForms
   * @type {Object<string,Function>}
   */

  this.pluralForms = {};
  /**
   * Effective options for instance, including defaults.
   *
   * @name Tannin#options
   * @type {TanninOptions}
   */

  this.options = {};

  for (key in DEFAULT_OPTIONS) {
    this.options[key] = options !== undefined && key in options ? options[key] : DEFAULT_OPTIONS[key];
  }
}
/**
 * Returns the plural form index for the given domain and value.
 *
 * @param {string} domain Domain on which to calculate plural form.
 * @param {number} n      Value for which plural form is to be calculated.
 *
 * @return {number} Plural form index.
 */


Tannin.prototype.getPluralForm = function (domain, n) {
  var getPluralForm = this.pluralForms[domain],
      config,
      plural,
      pf;

  if (!getPluralForm) {
    config = this.data[domain][''];
    pf = config['Plural-Forms'] || config['plural-forms'] || // Ignore reason: As known, there's no way to document the empty
    // string property on a key to guarantee this as metadata.
    // @ts-ignore
    config.plural_forms;

    if (typeof pf !== 'function') {
      plural = getPluralExpression(config['Plural-Forms'] || config['plural-forms'] || // Ignore reason: As known, there's no way to document the empty
      // string property on a key to guarantee this as metadata.
      // @ts-ignore
      config.plural_forms);
      pf = (0, _pluralForms.default)(plural);
    }

    getPluralForm = this.pluralForms[domain] = pf;
  }

  return getPluralForm(n);
};
/**
 * Translate a string.
 *
 * @param {string}      domain   Translation domain.
 * @param {string|void} context  Context distinguishing terms of the same name.
 * @param {string}      singular Primary key for translation lookup.
 * @param {string=}     plural   Fallback value used for non-zero plural
 *                               form index.
 * @param {number=}     n        Value to use in calculating plural form.
 *
 * @return {string} Translated string.
 */


Tannin.prototype.dcnpgettext = function (domain, context, singular, plural, n) {
  var index, key, entry;

  if (n === undefined) {
    // Default to singular.
    index = 0;
  } else {
    // Find index by evaluating plural form for value.
    index = this.getPluralForm(domain, n);
  }

  key = singular; // If provided, context is prepended to key with delimiter.

  if (context) {
    key = context + this.options.contextDelimiter + singular;
  }

  entry = this.data[domain][key]; // Verify not only that entry exists, but that the intended index is within
  // range and non-empty.

  if (entry && entry[index]) {
    return entry[index];
  }

  if (this.options.onMissingKey) {
    this.options.onMissingKey(singular, domain);
  } // If entry not found, fall back to singular vs. plural with zero index
  // representing the singular value.


  return index === 0 ? singular : plural;
};
},{"@tannin/plural-forms":"../../../../../node_modules/@tannin/plural-forms/index.js"}],"../../../../../node_modules/@wordpress/i18n/build-module/create-i18n.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createI18n = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/esm/defineProperty"));

var _tannin = _interopRequireDefault(require("tannin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        (0, _defineProperty2.default)(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}
/**
 * External dependencies
 */


/**
 * @typedef {Record<string,any>} LocaleData
 */

/**
 * Default locale data to use for Tannin domain when not otherwise provided.
 * Assumes an English plural forms expression.
 *
 * @type {LocaleData}
 */
var DEFAULT_LOCALE_DATA = {
  '': {
    /** @param {number} n */
    plural_forms: function plural_forms(n) {
      return n === 1 ? 0 : 1;
    }
  }
};
/**
 * An i18n instance
 *
 * @typedef {Object} I18n
 * @property {Function} setLocaleData Merges locale data into the Tannin instance by domain. Accepts data in a
 *                                    Jed-formatted JSON object shape.
 * @property {Function} __            Retrieve the translation of text.
 * @property {Function} _x            Retrieve translated string with gettext context.
 * @property {Function} _n            Translates and retrieves the singular or plural form based on the supplied
 *                                    number.
 * @property {Function} _nx           Translates and retrieves the singular or plural form based on the supplied
 *                                    number, with gettext context.
 * @property {Function} isRTL         Check if current locale is RTL.
 */

/**
 * Create an i18n instance
 *
 * @param {LocaleData} [initialData]    Locale data configuration.
 * @param {string}     [initialDomain]  Domain for which configuration applies.
 * @return {I18n}                       I18n instance
 */

var createI18n = function createI18n(initialData, initialDomain) {
  /**
   * The underlying instance of Tannin to which exported functions interface.
   *
   * @type {Tannin}
   */
  var tannin = new _tannin.default({});
  /**
   * Merges locale data into the Tannin instance by domain. Accepts data in a
   * Jed-formatted JSON object shape.
   *
   * @see http://messageformat.github.io/Jed/
   *
   * @param {LocaleData} [data]   Locale data configuration.
   * @param {string}     [domain] Domain for which configuration applies.
   */

  var setLocaleData = function setLocaleData(data) {
    var domain = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';
    tannin.data[domain] = _objectSpread({}, DEFAULT_LOCALE_DATA, {}, tannin.data[domain], {}, data); // Populate default domain configuration (supported locale date which omits
    // a plural forms expression).

    tannin.data[domain][''] = _objectSpread({}, DEFAULT_LOCALE_DATA[''], {}, tannin.data[domain]['']);
  };
  /**
   * Wrapper for Tannin's `dcnpgettext`. Populates default locale data if not
   * otherwise previously assigned.
   *
   * @param {string|undefined} domain   Domain to retrieve the translated text.
   * @param {string|undefined} context  Context information for the translators.
   * @param {string}           single   Text to translate if non-plural. Used as
   *                                    fallback return value on a caught error.
   * @param {string}           [plural] The text to be used if the number is
   *                                    plural.
   * @param {number}           [number] The number to compare against to use
   *                                    either the singular or plural form.
   *
   * @return {string} The translated string.
   */


  var dcnpgettext = function dcnpgettext() {
    var domain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';
    var context = arguments.length > 1 ? arguments[1] : undefined;
    var single = arguments.length > 2 ? arguments[2] : undefined;
    var plural = arguments.length > 3 ? arguments[3] : undefined;
    var number = arguments.length > 4 ? arguments[4] : undefined;

    if (!tannin.data[domain]) {
      setLocaleData(undefined, domain);
    }

    return tannin.dcnpgettext(domain, context, single, plural, number);
  };
  /**
   * Retrieve the translation of text.
   *
   * @see https://developer.wordpress.org/reference/functions/__/
   *
   * @param {string} text     Text to translate.
   * @param {string} [domain] Domain to retrieve the translated text.
   *
   * @return {string} Translated text.
   */


  var __ = function __(text, domain) {
    return dcnpgettext(domain, undefined, text);
  };
  /**
   * Retrieve translated string with gettext context.
   *
   * @see https://developer.wordpress.org/reference/functions/_x/
   *
   * @param {string} text     Text to translate.
   * @param {string} context  Context information for the translators.
   * @param {string} [domain] Domain to retrieve the translated text.
   *
   * @return {string} Translated context string without pipe.
   */


  var _x = function _x(text, context, domain) {
    return dcnpgettext(domain, context, text);
  };
  /**
   * Translates and retrieves the singular or plural form based on the supplied
   * number.
   *
   * @see https://developer.wordpress.org/reference/functions/_n/
   *
   * @param {string} single   The text to be used if the number is singular.
   * @param {string} plural   The text to be used if the number is plural.
   * @param {number} number   The number to compare against to use either the
   *                          singular or plural form.
   * @param {string} [domain] Domain to retrieve the translated text.
   *
   * @return {string} The translated singular or plural form.
   */


  var _n = function _n(single, plural, number, domain) {
    return dcnpgettext(domain, undefined, single, plural, number);
  };
  /**
   * Translates and retrieves the singular or plural form based on the supplied
   * number, with gettext context.
   *
   * @see https://developer.wordpress.org/reference/functions/_nx/
   *
   * @param {string} single   The text to be used if the number is singular.
   * @param {string} plural   The text to be used if the number is plural.
   * @param {number} number   The number to compare against to use either the
   *                          singular or plural form.
   * @param {string} context  Context information for the translators.
   * @param {string} [domain] Domain to retrieve the translated text.
   *
   * @return {string} The translated singular or plural form.
   */


  var _nx = function _nx(single, plural, number, context, domain) {
    return dcnpgettext(domain, context, single, plural, number);
  };
  /**
   * Check if current locale is RTL.
   *
   * **RTL (Right To Left)** is a locale property indicating that text is written from right to left.
   * For example, the `he` locale (for Hebrew) specifies right-to-left. Arabic (ar) is another common
   * language written RTL. The opposite of RTL, LTR (Left To Right) is used in other languages,
   * including English (`en`, `en-US`, `en-GB`, etc.), Spanish (`es`), and French (`fr`).
   *
   * @return {boolean} Whether locale is RTL.
   */


  var isRTL = function isRTL() {
    return 'rtl' === _x('ltr', 'text direction');
  };

  if (initialData) {
    setLocaleData(initialData, initialDomain);
  }

  return {
    setLocaleData: setLocaleData,
    __: __,
    _x: _x,
    _n: _n,
    _nx: _nx,
    isRTL: isRTL
  };
};

exports.createI18n = createI18n;
},{"@babel/runtime/helpers/esm/defineProperty":"../../../../../node_modules/@babel/runtime/helpers/esm/defineProperty.js","tannin":"../../../../../node_modules/tannin/index.js"}],"../../../../../node_modules/@wordpress/i18n/build-module/default-i18n.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isRTL = exports._nx = exports._n = exports._x = exports.__ = exports.setLocaleData = void 0;

var _createI18n = require("./create-i18n");

/**
 * Internal dependencies
 */
var i18n = (0, _createI18n.createI18n)();
/*
 * Comments in this file are duplicated from ./i18n due to
 * https://github.com/WordPress/gutenberg/pull/20318#issuecomment-590837722
 */

/**
 * @typedef {import('./create-i18n').LocaleData} LocaleData
 */

/**
 * Merges locale data into the Tannin instance by domain. Accepts data in a
 * Jed-formatted JSON object shape.
 *
 * @see http://messageformat.github.io/Jed/
 *
 * @param {LocaleData} [data]   Locale data configuration.
 * @param {string}     [domain] Domain for which configuration applies.
 */

var setLocaleData = i18n.setLocaleData.bind(i18n);
/**
 * Retrieve the translation of text.
 *
 * @see https://developer.wordpress.org/reference/functions/__/
 *
 * @param {string} text     Text to translate.
 * @param {string} [domain] Domain to retrieve the translated text.
 *
 * @return {string} Translated text.
 */

exports.setLocaleData = setLocaleData;

var __ = i18n.__.bind(i18n);
/**
 * Retrieve translated string with gettext context.
 *
 * @see https://developer.wordpress.org/reference/functions/_x/
 *
 * @param {string} text     Text to translate.
 * @param {string} context  Context information for the translators.
 * @param {string} [domain] Domain to retrieve the translated text.
 *
 * @return {string} Translated context string without pipe.
 */


exports.__ = __;

var _x = i18n._x.bind(i18n);
/**
 * Translates and retrieves the singular or plural form based on the supplied
 * number.
 *
 * @see https://developer.wordpress.org/reference/functions/_n/
 *
 * @param {string} single   The text to be used if the number is singular.
 * @param {string} plural   The text to be used if the number is plural.
 * @param {number} number   The number to compare against to use either the
 *                          singular or plural form.
 * @param {string} [domain] Domain to retrieve the translated text.
 *
 * @return {string} The translated singular or plural form.
 */


exports._x = _x;

var _n = i18n._n.bind(i18n);
/**
 * Translates and retrieves the singular or plural form based on the supplied
 * number, with gettext context.
 *
 * @see https://developer.wordpress.org/reference/functions/_nx/
 *
 * @param {string} single   The text to be used if the number is singular.
 * @param {string} plural   The text to be used if the number is plural.
 * @param {number} number   The number to compare against to use either the
 *                          singular or plural form.
 * @param {string} context  Context information for the translators.
 * @param {string} [domain] Domain to retrieve the translated text.
 *
 * @return {string} The translated singular or plural form.
 */


exports._n = _n;

var _nx = i18n._nx.bind(i18n);
/**
 * Check if current locale is RTL.
 *
 * **RTL (Right To Left)** is a locale property indicating that text is written from right to left.
 * For example, the `he` locale (for Hebrew) specifies right-to-left. Arabic (ar) is another common
 * language written RTL. The opposite of RTL, LTR (Left To Right) is used in other languages,
 * including English (`en`, `en-US`, `en-GB`, etc.), Spanish (`es`), and French (`fr`).
 *
 * @return {boolean} Whether locale is RTL.
 */


exports._nx = _nx;
var isRTL = i18n.isRTL.bind(i18n);
exports.isRTL = isRTL;
},{"./create-i18n":"../../../../../node_modules/@wordpress/i18n/build-module/create-i18n.js"}],"../../../../../node_modules/@wordpress/i18n/build-module/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  sprintf: true,
  setLocaleData: true,
  __: true,
  _x: true,
  _n: true,
  _nx: true,
  isRTL: true
};
Object.defineProperty(exports, "sprintf", {
  enumerable: true,
  get: function () {
    return _sprintf.sprintf;
  }
});
Object.defineProperty(exports, "setLocaleData", {
  enumerable: true,
  get: function () {
    return _defaultI18n.setLocaleData;
  }
});
Object.defineProperty(exports, "__", {
  enumerable: true,
  get: function () {
    return _defaultI18n.__;
  }
});
Object.defineProperty(exports, "_x", {
  enumerable: true,
  get: function () {
    return _defaultI18n._x;
  }
});
Object.defineProperty(exports, "_n", {
  enumerable: true,
  get: function () {
    return _defaultI18n._n;
  }
});
Object.defineProperty(exports, "_nx", {
  enumerable: true,
  get: function () {
    return _defaultI18n._nx;
  }
});
Object.defineProperty(exports, "isRTL", {
  enumerable: true,
  get: function () {
    return _defaultI18n.isRTL;
  }
});

var _sprintf = require("./sprintf");

var _createI18n = require("./create-i18n");

Object.keys(_createI18n).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _createI18n[key];
    }
  });
});

var _defaultI18n = require("./default-i18n");
},{"./sprintf":"../../../../../node_modules/@wordpress/i18n/build-module/sprintf.js","./create-i18n":"../../../../../node_modules/@wordpress/i18n/build-module/create-i18n.js","./default-i18n":"../../../../../node_modules/@wordpress/i18n/build-module/default-i18n.js"}],"containers/PluginsImportMenu.vue":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vueFragment = require("vue-fragment");

var _i18n = require("@wordpress/i18n");

var _MenuButton = _interopRequireDefault(require("../components/MenuButton.vue"));

var _importOperations = _interopRequireDefault(require("../functions/importOperations.js"));

var _withMessage = _interopRequireDefault(require("../mixins/withMessage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = {
  props: ['options'],
  mixins: [_withMessage.default],
  components: {
    MenuButton: _MenuButton.default,
    Fragment: _vueFragment.Fragment
  },
  data: function data() {
    return {
      supportedPlugins: {
        'table-press': 'TablePress'
      },
      importedTables: {},
      selectedReplaceRows: []
    };
  },
  watch: {
    fetching: function fetching(n) {
      this.$emit('fetching', n);
    }
  },
  mounted: function mounted() {
    var _this = this;

    // general listener for successful operations
    document.addEventListener('table:imported:saved', function (_ref) {
      var detail = _ref.detail;

      _this.setMessage({
        type: 'ok',
        message: _this.isDocumentEventPoorlyImplemented(detail) ? _this.strings.operationSuccess : detail
      });

      _this.setBusy(false);
    }); // general listener for errors

    document.addEventListener('table:imported:error', function (_ref2) {
      var detail = _ref2.detail;

      _this.setMessage({
        type: 'error',
        message: _this.isDocumentEventPoorlyImplemented(detail) ? _this.strings.errorOccured : detail
      });

      _this.setBusy(false);
    }); // listener for import end

    document.addEventListener('table:imported:list', function (_ref3) {
      var detail = _ref3.detail;

      _this.setBusy(false);

      _this.importedTables = detail;
    }); // listener for shortcode replace

    document.addEventListener('table:shortcode:replace', function (_ref4) {
      var detail = _ref4.detail;

      _this.setMessage({
        type: 'ok',
        message: "".concat(_this.strings.replacedShortcodes, ": ").concat(detail === true ? 0 : detail)
      });

      _this.setBusy(false);
    });
  },
  methods: {
    isDocumentEventPoorlyImplemented: function isDocumentEventPoorlyImplemented(val) {
      return typeof val === 'boolean';
    },
    handleImportFromPlugin: function handleImportFromPlugin(type) {
      var importOperations = (0, _importOperations.default)(_objectSpread({}, this.options, {
        type: type
      }));
      this.setBusy();
      importOperations.importFromPlugin(type);
    },
    selectAllCheckbox: function selectAllCheckbox(type) {
      if (this.selectedReplaceRows === this.importedTables[type]) {
        this.selectedReplaceRows = [];
      } else {
        this.selectedReplaceRows = this.importedTables[type];
      }
    },
    replaceShortcodes: function replaceShortcodes() {
      if (this.selectedReplaceRows.length === 0) {
        return;
      }

      var replaceArray = this.selectedReplaceRows.map(function (row) {
        return {
          search: row[0],
          replace: row[1]
        };
      });
      var importOperation = (0, _importOperations.default)(this.options);
      this.setBusy();
      importOperation.replaceShortcodesAjax(replaceArray, true);
    },
    importButtonText: function importButtonText(plugin) {
      return (0, _i18n.sprintf)((0, _i18n._x)('import from %s', '%s is a format variable for a name of WordPress plugin', this.options.textDomain), plugin);
    },
    importedTablesCountInfo: function importedTablesCountInfo(key) {
      return (0, _i18n.sprintf)((0, _i18n._nx)('%u table imported', '%u tables imported', 'number of tables imported', this.options.textDomain), this.importedTables[key].length);
    },
    // eslint-disable-next-line no-underscore-dangle
    __: function __(value) {
      var domain = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.options.textDomain;
      return (0, _i18n.__)(value, domain);
    }
  },
  computed: {
    showImportedTables: function showImportedTables() {
      var _this2 = this;

      var keys = Object.keys(this.importedTables).map(function (k) {
        if (Object.prototype.hasOwnProperty.call(_this2.importedTables, k)) {
          return k;
        }

        return null;
      });
      return Array.isArray(keys) ? keys.length > 0 : false;
    }
  }
};
exports.default = _default;
        var $e4982f = exports.default || module.exports;
      
      if (typeof $e4982f === 'function') {
        $e4982f = $e4982f.options;
      }
    
        /* template */
        Object.assign($e4982f, (function () {
          var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _vm._l(_vm.supportedPlugins, function(value, key) {
        return _c(
          "menu-button",
          {
            key: key,
            staticClass: "wptb-text-transform-cap",
            attrs: { disabled: _vm.withMessageData.busy },
            on: {
              click: function($event) {
                return _vm.handleImportFromPlugin(key)
              }
            }
          },
          [_vm._v("\n    " + _vm._s(_vm.importButtonText(value)) + "\n  ")]
        )
      }),
      _vm._v(" "),
      _c("div", {
        staticStyle: { display: "none" },
        attrs: { id: "wptb-importIframeSection" }
      }),
      _vm._v(" "),
      _c("transition", { attrs: { name: "wptb-fade", mode: "out-in" } }, [
        _vm.showImportedTables
          ? _c(
              "div",
              { staticClass: "wptb-flex wptb-flex-align-center wptb-flex-col" },
              [
                _c(
                  "div",
                  { staticClass: "wptb-import-tables-wrapper" },
                  _vm._l(_vm.importedTables, function(value, key) {
                    return _c(
                      "div",
                      { key: key, staticClass: "wptb-import-tables-list" },
                      [
                        _c(
                          "div",
                          { staticClass: "wptb-import-table-count-info" },
                          [_vm._v(_vm._s(_vm.importedTablesCountInfo(key)))]
                        ),
                        _vm._v(" "),
                        _c("table", { staticClass: "wptb-import-table" }, [
                          _c("thead", [
                            _c("tr", [
                              _c("th", [
                                _c("input", {
                                  attrs: { type: "checkbox" },
                                  on: {
                                    click: function($event) {
                                      return _vm.selectAllCheckbox(key)
                                    }
                                  }
                                })
                              ]),
                              _vm._v(" "),
                              _c(
                                "th",
                                { staticClass: "wptb-text-transform-cap" },
                                [
                                  _vm._v(
                                    "\n                  " +
                                      _vm._s(_vm.supportedPlugins[key]) +
                                      "\n                "
                                  )
                                ]
                              ),
                              _vm._v(" "),
                              _c(
                                "th",
                                { staticClass: "wptb-text-transform-cap" },
                                [
                                  _vm._v(
                                    "\n                  wp table builder\n                "
                                  )
                                ]
                              )
                            ])
                          ]),
                          _vm._v(" "),
                          _c(
                            "tbody",
                            _vm._l(value, function(row) {
                              return _c("fragment", { key: row[0] }, [
                                _c("tr", [
                                  _c("td", [
                                    _c("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value: _vm.selectedReplaceRows,
                                          expression: "selectedReplaceRows"
                                        }
                                      ],
                                      attrs: { type: "checkbox" },
                                      domProps: {
                                        value: row,
                                        checked: Array.isArray(
                                          _vm.selectedReplaceRows
                                        )
                                          ? _vm._i(
                                              _vm.selectedReplaceRows,
                                              row
                                            ) > -1
                                          : _vm.selectedReplaceRows
                                      },
                                      on: {
                                        change: function($event) {
                                          var $$a = _vm.selectedReplaceRows,
                                            $$el = $event.target,
                                            $$c = $$el.checked ? true : false
                                          if (Array.isArray($$a)) {
                                            var $$v = row,
                                              $$i = _vm._i($$a, $$v)
                                            if ($$el.checked) {
                                              $$i < 0 &&
                                                (_vm.selectedReplaceRows = $$a.concat(
                                                  [$$v]
                                                ))
                                            } else {
                                              $$i > -1 &&
                                                (_vm.selectedReplaceRows = $$a
                                                  .slice(0, $$i)
                                                  .concat($$a.slice($$i + 1)))
                                            }
                                          } else {
                                            _vm.selectedReplaceRows = $$c
                                          }
                                        }
                                      }
                                    })
                                  ]),
                                  _vm._v(" "),
                                  _c("td", [
                                    _vm._v(
                                      "\n                    " +
                                        _vm._s(row[0]) +
                                        "\n                  "
                                    )
                                  ]),
                                  _vm._v(" "),
                                  _c("td", [
                                    _vm._v(
                                      "\n                    " +
                                        _vm._s(row[1]) +
                                        "\n                  "
                                    )
                                  ])
                                ])
                              ])
                            }),
                            1
                          )
                        ])
                      ]
                    )
                  }),
                  0
                ),
                _vm._v(" "),
                _c(
                  "menu-button",
                  {
                    staticClass: "wptb-text-transform-cap",
                    attrs: {
                      disabled: _vm.selectedReplaceRows.length === 0,
                      size: "small"
                    },
                    on: { click: _vm.replaceShortcodes }
                  },
                  [
                    _vm._v(
                      "\n        " +
                        _vm._s(
                          _vm.__("replace short codes", _vm.options.textDomain)
                        ) +
                        "\n      "
                    )
                  ]
                )
              ],
              1
            )
          : _vm._e()
      ]),
      _vm._v(" "),
      _vm._m(0)
    ],
    2
  )
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "div",
      {
        staticClass: "wptb-importPBarContainer",
        staticStyle: { visibility: "hidden" }
      },
      [
        _c("div", { staticClass: "wptb-importPBarProgress" }, [
          _c("div", { staticClass: "wptb-nameProcessInBarProgress" }),
          _vm._v(" "),
          _c("div", { attrs: { id: "wptb-pBarPercent" } }, [
            _c("span", [_vm._v("0%")])
          ])
        ])
      ]
    )
  }
]
render._withStripped = true

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
},{"vue-fragment":"../../../../../node_modules/vue-fragment/dist/vue-fragment.esm.js","@wordpress/i18n":"../../../../../node_modules/@wordpress/i18n/build-module/index.js","../components/MenuButton.vue":"components/MenuButton.vue","../functions/importOperations.js":"functions/importOperations.js","../mixins/withMessage":"mixins/withMessage.js"}],"containers/ImportApp.vue":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Sections = _interopRequireDefault(require("../components/Sections.vue"));

var _SectionItem = _interopRequireDefault(require("../components/SectionItem.vue"));

var _MenuContent = _interopRequireDefault(require("../components/MenuContent.vue"));

var _CSVImportMenu = _interopRequireDefault(require("./CSVImportMenu.vue"));

var _PluginsImportMenu = _interopRequireDefault(require("./PluginsImportMenu.vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
var _default = {
  props: ['options'],
  components: {
    Sections: _Sections.default,
    SectionItem: _SectionItem.default,
    MenuContent: _MenuContent.default
  },
  data: function data() {
    return {
      currentSection: 'csv'
    };
  },
  methods: {
    setSection: function setSection(name) {
      if (this.currentSection === name) {
        return;
      }

      this.currentSection = name;
    }
  },
  computed: {
    currentTemplate: function currentTemplate() {
      return this.currentSection === 'csv' ? _CSVImportMenu.default : _PluginsImportMenu.default;
    }
  }
};
exports.default = _default;
        var $01888b = exports.default || module.exports;
      
      if (typeof $01888b === 'function') {
        $01888b = $01888b.options;
      }
    
        /* template */
        Object.assign($01888b, (function () {
          var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c(
        "portal",
        { attrs: { to: "childSections" } },
        [
          _c("sections", {
            attrs: { child: true, items: ["csv", _vm.strings.plugins] },
            model: {
              value: _vm.currentSection,
              callback: function($$v) {
                _vm.currentSection = $$v
              },
              expression: "currentSection"
            }
          })
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "menu-content",
        { attrs: { center: true } },
        [
          _c(_vm.currentTemplate, {
            tag: "component",
            staticClass: "wptb-flex wptb-flex-col wptb-flex-align-center",
            attrs: { options: _vm.options }
          })
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
},{"../components/Sections.vue":"components/Sections.vue","../components/SectionItem.vue":"components/SectionItem.vue","../components/MenuContent.vue":"components/MenuContent.vue","./CSVImportMenu.vue":"containers/CSVImportMenu.vue","./PluginsImportMenu.vue":"containers/PluginsImportMenu.vue"}],"containers/ExportApp.vue":[function(require,module,exports) {

        var $973f2f = exports.default || module.exports;
      
      if (typeof $973f2f === 'function') {
        $973f2f = $973f2f.options;
      }
    
        /* template */
        Object.assign($973f2f, (function () {
          var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm._m(0)
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", [_c("i", [_vm._v("export app")])])
  }
]
render._withStripped = true

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
},{}],"containers/ImportExportApp.vue":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _MenuHeader = _interopRequireDefault(require("../components/MenuHeader"));

var _Sections = _interopRequireDefault(require("../components/Sections"));

var _SectionItem = _interopRequireDefault(require("../components/SectionItem"));

var _MenuFooter = _interopRequireDefault(require("../components/MenuFooter"));

var _withMessage = _interopRequireDefault(require("../mixins/withMessage"));

var _ImportApp = _interopRequireDefault(require("./ImportApp"));

var _ExportApp = _interopRequireDefault(require("./ExportApp"));

var _MenuContent = _interopRequireDefault(require("../components/MenuContent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var _default = {
  props: ['pluginInfo', 'options'],
  mixins: [_withMessage.default],
  components: {
    ExportApp: _ExportApp.default,
    MenuContent: _MenuContent.default,
    ImportApp: _ImportApp.default,
    MenuHeader: _MenuHeader.default,
    SectionItem: _SectionItem.default,
    Sections: _Sections.default,
    MenuFooter: _MenuFooter.default
  },
  data: function data() {
    return {
      currentSection: 'Import'
    };
  },
  computed: {
    currentTemplate: function currentTemplate() {
      return "".concat(this.currentSection, "App");
    }
  }
};
exports.default = _default;
        var $7a762a = exports.default || module.exports;
      
      if (typeof $7a762a === 'function') {
        $7a762a = $7a762a.options;
      }
    
        /* template */
        Object.assign($7a762a, (function () {
          var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "wptb-settings-wrapper" },
    [
      _c(
        "menu-header",
        {
          attrs: {
            "logo-src": _vm.pluginInfo.logo,
            "logo-alt": _vm.strings.logoAlt,
            "plugin-name": _vm.pluginInfo.pluginName
          }
        },
        [
          _c("a", { attrs: { href: _vm.pluginInfo.pluginHomepage } }, [
            _vm._v(_vm._s(_vm.strings.homepage))
          ])
        ]
      ),
      _vm._v(" "),
      _c(
        "sections",
        {
          attrs: {
            items: [_vm.strings.importSection, _vm.strings.exportSection]
          },
          model: {
            value: _vm.currentSection,
            callback: function($$v) {
              _vm.currentSection = $$v
            },
            expression: "currentSection"
          }
        },
        [_c("portal-target", { attrs: { name: "childSections" } })],
        1
      ),
      _vm._v(" "),
      _c(
        "menu-content",
        { attrs: { center: true } },
        [
          _c(_vm.currentTemplate, {
            tag: "component",
            attrs: { options: _vm.options }
          })
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "menu-footer",
        [_c("portal-target", { attrs: { name: "footerButtons" } })],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: null,
            functional: undefined
          };
        })());
      
},{"../components/MenuHeader":"components/MenuHeader.vue","../components/Sections":"components/Sections.vue","../components/SectionItem":"components/SectionItem.vue","../components/MenuFooter":"components/MenuFooter.vue","../mixins/withMessage":"mixins/withMessage.js","./ImportApp":"containers/ImportApp.vue","./ExportApp":"containers/ExportApp.vue","../components/MenuContent":"components/MenuContent.vue"}],"plugins/strings.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * plugin install method
 *
 * plugin for adding strings data field to all components to use
 *
 * @param {object} Vue Vue object
 * @param {object} options options to be used at plugin
 * @returns {{strings: boolean}}
 */
function install(Vue, options) {
  Vue.mixin({
    data: function data() {
      return {
        strings: options.strings
      };
    }
  });
}
/**
 * @module strings plugin
 */


var _default = {
  install: install
};
exports.default = _default;
},{}],"WPTB_Import_Menu.js":[function(require,module,exports) {
"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _portalVue = _interopRequireDefault(require("portal-vue"));

var _ImportExportApp = _interopRequireDefault(require("./containers/ImportExportApp"));

var _strings = _interopRequireDefault(require("./plugins/strings"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var importData = _objectSpread({}, wptbImportMenuData); // remove global data


wptbImportMenuData = undefined;
_vue.default.config.productionTip = false;

_vue.default.use(_strings.default, {
  strings: importData.strings
});

_vue.default.use(_portalVue.default);

new _vue.default({
  components: {
    ImportExportApp: _ImportExportApp.default
  },
  data: {
    pluginInfo: importData.pluginInfo,
    options: importData.options
  }
}).$mount('#wptb-import-menu');
},{"vue":"../../../../../node_modules/vue/dist/vue.esm.js","portal-vue":"../../../../../node_modules/portal-vue/dist/portal-vue.common.js","./containers/ImportExportApp":"containers/ImportExportApp.vue","./plugins/strings":"plugins/strings.js"}]},{},["WPTB_Import_Menu.js"], null)
//# sourceMappingURL=/WPTB_Import_Menu.js.map