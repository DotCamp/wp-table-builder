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
})({"WPTB_IconManager.js":[function(require,module,exports) {
var global = arguments[3];
/**
 * Assign icon manager to global space.
 *
 * @param {string} key global key
 * @param {Object} context global context
 * @param {Function} factory factory function
 */
(function assignToGlobal(key, context, factory) {
  // eslint-disable-next-line no-param-reassign
  context[key] = factory(); // eslint-disable-next-line no-restricted-globals
})('WPTB_IconManager', self || global, function iconManager() {
  /**
   * Frontend icon manager for WPTB builder.
   *
   * @param {Object} list all icon list
   * @class
   */
  function IconManager(list) {
    if (!list) {
      throw new Error('no icon list is defined for WPTB_IconManager instance');
    }

    var iconList = list;
    /**
     * Cached icons.
     *
     * @type {Object}
     */

    var cachedIcons = {};
    /**
     * Prepare an icon with a wrapper.
     *
     * @param {string} iconSvgString string representation of icon
     * @param {string | null} extraClass name of extra class to apply to icon wrapper
     * @return {HTMLDivElement} created icon wrapper
     */

    var prepareIcon = function prepareIcon(iconSvgString) {
      var extraClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var iconWrapper = document.createElement('div'); // if an extra class is defined, add it to icon wrapper

      if (extraClass) {
        iconWrapper.classList.add(extraClass);
      }

      iconWrapper.innerHTML = iconSvgString;
      return iconWrapper;
    };
    /**
     * Get a cached icon.
     *
     * @param {string} iconName name of the icon
     * @param {string | null} extraClass extra class name to add to icon wrapper
     * @param {string | null} getStringifiedVersion get stringified version of the icon
     * @return {null | Element} Prepared cached icon or null if no cached version is found
     */


    var getCachedIcon = function getCachedIcon(iconName) {
      var extraClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var getStringifiedVersion = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (cachedIcons[iconName]) {
        return getStringifiedVersion ? cachedIcons[iconName] : prepareIcon(cachedIcons[iconName], extraClass);
      }

      return null;
    };
    /**
     * Add an icon to cache.
     *
     * @param {string} iconName name of the icon to be stored
     * @param {string} stringifiedIcon stringified version of the icon
     */


    var addToCache = function addToCache(iconName, stringifiedIcon) {
      cachedIcons[iconName] = stringifiedIcon;
    };
    /**
     * Get a list of all available icons.
     *
     * @return {Object} icon list
     */


    this.getIconList = function () {
      return iconList;
    };
    /**
     * Get an icon.
     *
     * Icons sent with this function are wrapped with a 'div' element.
     *
     * @param {string} iconName name of the icon
     * @param {string} extraClass extra class to add to icon wrapper
     * @param {string} getStringifiedVersion get stringified version of icon
     * @return {Promise<void>} a Promise that will be resolved when icon is fetched from server
     */


    this.getIcon = function (iconName) {
      var extraClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var getStringifiedVersion = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      // eslint-disable-next-line consistent-return
      return new Promise(function (res, rej) {
        // if cached version is found, return that version
        var cachedIcon = getCachedIcon(iconName, extraClass, getStringifiedVersion);

        if (cachedIcon) {
          return res(cachedIcon);
        }

        if (iconList[iconName]) {
          return fetch(iconList[iconName]).then(function (resp) {
            if (resp.ok) {
              return resp.text();
            }

            throw new Error("an error occurred while fetching icon [".concat(iconName, "]"));
          }).then(function (iconString) {
            if (iconString.error) {
              throw new Error("an error occurred while fetching icon [".concat(iconName, "]"));
            } // add icon to cache


            addToCache(iconName, iconString);
            return res(getStringifiedVersion ? iconString : prepareIcon(iconString, extraClass));
          }).catch(function (err) {
            return rej(new Error(err));
          });
        }

        return rej(new Error("no icon found with the given name of [".concat(iconName, "]")));
      });
    };
  } // eslint-disable-next-line no-restricted-globals


  var context = self || global;

  if (context.wptb_admin_object) {
    return new IconManager(wptb_admin_object.iconManager);
  }

  return null;
});
},{}]},{},["WPTB_IconManager.js"], null)
//# sourceMappingURL=/WPTB_IconManager.js.map