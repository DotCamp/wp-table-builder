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
})({"WPTB_ResponsiveFrontend.js":[function(require,module,exports) {
var global = arguments[3];
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// TODO [erdembircan] This function should be prepared in a way that can be both used in front end and table builder to cut out two headiness in the app. This way, any change/update/improvement that will be done to this script, will be reflected both to builder and frontend

/**
 * Responsive class assignment for frontend operations.
 */
(function assignToGlobal(key, context, factory) {
  // eslint-disable-next-line no-param-reassign
  context[key] = factory(); // eslint-disable-next-line no-restricted-globals
})('WPTB_ResponsiveFrontend', self || global, function () {
  // default options for responsive class
  var responsiveClassDefaultOptions = {
    query: '.wptb-preview-table',
    bindToResize: false
  };
  /**
   * Class for handling operations related to responsive functionalities of tables.
   *
   * @constructor
   * @param {object} options options object
   */

  function ResponsiveFront() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    // merge default options with user sent options
    this.options = _objectSpread({}, responsiveClassDefaultOptions, {}, options);
    this.elements = Array.from(document.querySelectorAll(this.options.query));
    /**
     * Get responsive directives of table element.
     *
     * @private
     * @param {HTMLElement} table element
     * @return {object|null} JSON representation of the directive element, if not available null will be returned
     */

    this.getDirective = function (el) {
      var directiveString = el.dataset.wptbResponsiveDirectives;

      if (!directiveString) {
        return null;
      }

      return JSON.parse(atob(directiveString));
    };
    /**
     * Rebuild table according to its responsive directives.
     *
     * @private
     * @param {HTMLElement} el table element
     */


    this.rebuildTable = function (el) {
      var directive = _this.getDirective(el); // TODO [erdembircan] remove for production


      console.log(directive);
    };
    /**
     * Batch rebuild tables.
     */


    this.rebuildTables = function () {
      _this.elements.map(_this.rebuildTable);
    };

    return {
      rebuildTables: this.rebuildTables
    };
  }

  return ResponsiveFront;
});
},{}]},{},["WPTB_ResponsiveFrontend.js"], null)
//# sourceMappingURL=/WPTB_ResponsiveFrontend.js.map