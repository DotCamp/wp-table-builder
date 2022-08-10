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
})({"../../../../../node_modules/@babel/runtime/helpers/arrayWithHoles.js":[function(require,module,exports) {
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;
},{}],"../../../../../node_modules/@babel/runtime/helpers/iterableToArrayLimit.js":[function(require,module,exports) {
function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;
},{}],"../../../../../node_modules/@babel/runtime/helpers/arrayLikeToArray.js":[function(require,module,exports) {
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray;
},{}],"../../../../../node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js":[function(require,module,exports) {
var arrayLikeToArray = require("./arrayLikeToArray");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray;
},{"./arrayLikeToArray":"../../../../../node_modules/@babel/runtime/helpers/arrayLikeToArray.js"}],"../../../../../node_modules/@babel/runtime/helpers/nonIterableRest.js":[function(require,module,exports) {
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest;
},{}],"../../../../../node_modules/@babel/runtime/helpers/slicedToArray.js":[function(require,module,exports) {
var arrayWithHoles = require("./arrayWithHoles");

var iterableToArrayLimit = require("./iterableToArrayLimit");

var unsupportedIterableToArray = require("./unsupportedIterableToArray");

var nonIterableRest = require("./nonIterableRest");

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;
},{"./arrayWithHoles":"../../../../../node_modules/@babel/runtime/helpers/arrayWithHoles.js","./iterableToArrayLimit":"../../../../../node_modules/@babel/runtime/helpers/iterableToArrayLimit.js","./unsupportedIterableToArray":"../../../../../node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js","./nonIterableRest":"../../../../../node_modules/@babel/runtime/helpers/nonIterableRest.js"}],"../../../../../node_modules/@babel/runtime/helpers/defineProperty.js":[function(require,module,exports) {
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

module.exports = _defineProperty;
},{}],"../../../../../node_modules/@babel/runtime/helpers/typeof.js":[function(require,module,exports) {
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
},{}],"../WPTB_ExtraStyles.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Extra styles module to add custom css rules defined for individual tables.
 */
(function UMD(key, context, factory) {
  if (typeof module !== 'undefined' && (typeof exports === "undefined" ? "undefined" : (0, _typeof2.default)(exports)) === 'object') {
    module.exports = factory();
  } else {
    // eslint-disable-next-line no-param-reassign
    context[key] = factory();
  } // eslint-disable-next-line no-restricted-globals

})('WPTB_ExtraStyles', self || global, function () {
  /**
   * Extra styles frontend manager.
   *
   * This component will be responsible for adding and maintaining extra styles defined for tables.
   *
   * @class
   */
  // eslint-disable-next-line camelcase
  function WPTB_ExtraStyles() {
    var _tableQueries,
        _this = this;

    /**
     * Extra styles operation modes
     *
     * @type {Object}
     */
    this.modes = {
      builder: 'builder',
      frontEnd: 'frontEnd',
      block: 'block'
    };
    /**
     * Base document for DOM operations.
     *
     * @type {Document}
     */

    this.baseDocument = document;
    /**
     * Current mode extra styles are operating on.
     *
     * @type {string}
     */

    this.currentMode = this.modes.builder;
    /**
     * General table styles.
     *
     * @type {string}
     */

    this.generalStyles = '';
    /**
     * HTML queries for table element in different plugin modes
     *
     * @type {Object}
     */

    var tableQueries = (_tableQueries = {}, (0, _defineProperty2.default)(_tableQueries, this.modes.builder, '.wptb-table-setup .wptb-preview-table'), (0, _defineProperty2.default)(_tableQueries, this.modes.block, '.wptb-block-table-setup .wptb-preview-table'), (0, _defineProperty2.default)(_tableQueries, this.modes.frontEnd, '.wptb-table-container .wptb-preview-table'), _tableQueries);
    /**
     * Format styles.
     *
     * @param {string} styles styles
     * @return {string} formatted styles
     */

    var formatStyles = function formatStyles(styles) {
      // remove all newlines, comments and '!important' from style string to make it a one liner
      var cleaned = styles.replaceAll(/(\r?\n)|(\/\*.+?\*\/)|(\s*!important)/g, ''); // add '!important' to all rules to override default style rules

      return cleaned.replaceAll(';', ' !important;');
    };
    /**
     * Reform style rules so they will only affect given table id.
     *
     * @param {number} prefix prefix string that will be added to all rules
     * @param {string} extraStyles extra styles
     * @return {string} new style properties prefixed with table id class
     */


    var prefixStyleRules = function prefixStyleRules(prefix, extraStyles) {
      // reformat styles into a suitable form for our regexp operations
      var formattedStyles = formatStyles(extraStyles);
      var splitStyles = formattedStyles.split('}');
      var prefixedStylesArray = []; // eslint-disable-next-line array-callback-return

      splitStyles.map(function (split) {
        var regExp = new RegExp(/(.+?)\{/g);
        var matches = regExp.exec(split);

        if (matches) {
          prefixedStylesArray.push(split.replace(matches[1], "".concat(prefix, " ").concat(matches[1])));
        }
      });
      return "".concat(prefixedStylesArray.join('}'), "}");
    };
    /**
     * Apply general styles to document.
     *
     * @param {string} generalStyles general style rules
     * @param {Node} baseElement element to use as base
     */


    var applyGeneralStyles = function applyGeneralStyles(generalStyles) {
      var baseElement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var generalStylesheet = document.createElement('style');
      generalStylesheet.type = 'text/css';
      generalStylesheet.id = 'wptb-general-styles';

      if (!baseElement) {
        var head = _this.currentMode === _this.modes.block ? _this.baseDocument : _this.baseDocument.querySelector('head');
        head.appendChild(generalStylesheet);
      } else {
        baseElement.insertAdjacentElement('beforebegin', generalStylesheet);
      }

      var prefixedStyleRules = prefixStyleRules(generalStyles.parentPrefix, generalStyles.styles);
      generalStylesheet.appendChild(document.createTextNode(prefixedStyleRules));
    };
    /**
     * Apply defined extra styles for given table element.
     *
     * @param {Element} tableElement table element
     */


    var applyExtraStyle = function applyExtraStyle(tableElement) {
      var extraStylesRaw = tableElement.dataset.wptbExtraStyles;
      var styleIdPrefix = 'wptb-extra-styles-';

      if (extraStylesRaw) {
        var extraStyles = atob(extraStylesRaw);

        var _tableElement$getAttr = tableElement.getAttribute('class').match(/wptb-element-main-table_setting-(?:startedid-)?(\d+)/),
            _tableElement$getAttr2 = (0, _slicedToArray2.default)(_tableElement$getAttr, 2),
            tableId = _tableElement$getAttr2[1];

        var styleId = styleIdPrefix + tableId;

        var head = _this.baseDocument.querySelector('head'); // since stylesheets are created for frontend only once at startup, checking document head for any created style object will work even with theme disabled tables which at builder, they are not inside a shadow-root


        var styleElement = head === null || head === void 0 ? void 0 : head.querySelector("#".concat(styleId)); // if no style element is found, create one

        if (!styleElement) {
          styleElement = document.createElement('style');
          styleElement.type = 'text/css';
          styleElement.id = styleId;
          var isThemeStylesDisabled = tableElement.dataset.disableThemeStyles; // if theme styles are disabled, it means our table is residing inside a shadow-root, place style element inside shadow-root instead of document head

          if (isThemeStylesDisabled && _this.currentMode === _this.modes.frontEnd || _this.currentMode === _this.modes.block) {
            tableElement.insertAdjacentElement('beforebegin', styleElement);

            if (_this.currentMode === _this.modes.frontEnd && _this.generalStyles) {
              applyGeneralStyles(_this.generalStyles, tableElement);
            }
          } else {
            head.appendChild(styleElement);
          }
        }

        var uniqueClass = ".wptb-element-main-table_setting-".concat(tableId); // reform style rules so they will only affect the table they are assigned to

        var prefixedStyles = prefixStyleRules(uniqueClass, extraStyles); // remove previous styles with updated ones

        styleElement.innerHTML = '';
        styleElement.appendChild(document.createTextNode(prefixedStyles));
      }
    };
    /**
     * Apply extra styles to all available tables on DOM.
     *
     * @param {string} mode operation mode to apply styles
     * @param {string} generalStyles general style rules
     * @param {Object} baseDocument base document for DOM operations
     */


    this.applyStyles = function () {
      var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.modes.frontEnd;
      var generalStyles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var baseDocument = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;
      _this.baseDocument = baseDocument;
      _this.currentMode = mode;
      _this.generalStyles = generalStyles;
      var allTables = Array.from(_this.baseDocument.querySelectorAll(tableQueries[mode]));

      if (allTables) {
        allTables.map(applyExtraStyle);
      } // only apply general styles on client frontend if any general styles are defined


      if ((mode === _this.modes.frontEnd || mode === _this.modes.block) && generalStyles) {
        applyGeneralStyles(generalStyles);
      }
    };
  } // send a singleton instance of manager


  return new WPTB_ExtraStyles();
});
},{"@babel/runtime/helpers/slicedToArray":"../../../../../node_modules/@babel/runtime/helpers/slicedToArray.js","@babel/runtime/helpers/defineProperty":"../../../../../node_modules/@babel/runtime/helpers/defineProperty.js","@babel/runtime/helpers/typeof":"../../../../../node_modules/@babel/runtime/helpers/typeof.js"}],"WPTB_Block_ExtraStyles.js":[function(require,module,exports) {
"use strict";

var _WPTB_ExtraStyles = _interopRequireDefault(require("../WPTB_ExtraStyles"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var shadowDocument = document.querySelector('#wptb-block-preview-base').shadowRoot;

_WPTB_ExtraStyles.default.applyStyles(_WPTB_ExtraStyles.default.modes.block, null, shadowDocument);
},{"../WPTB_ExtraStyles":"../WPTB_ExtraStyles.js"}]},{},["WPTB_Block_ExtraStyles.js"], null)
//# sourceMappingURL=/WPTB_Block_ExtraStyles.js.map