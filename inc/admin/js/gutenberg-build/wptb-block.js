/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./inc/admin/js/core/gutenberg-src/wptb-block.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./inc/admin/js/core/gutenberg-src/wptb-block.js":
/*!*******************************************************!*\
  !*** ./inc/admin/js/core/gutenberg-src/wptb-block.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed (from ./node_modules/thread-loader/dist/cjs.js):\nThread Loader (Worker 0)\n/home/erdem/Projects/PHP/wp-table-builder-pro-dev/wp-table-builder/inc/admin/js/core/gutenberg-src/wptb-block.js: Support for the experimental syntax 'jsx' isn't currently enabled (41:10):\n\n  39 | \t},\n  40 | \tedit: ({ attributes, setAttributes }) => {\n> 41 | \t\treturn <TableBlockApp attributes={attributes} setAttributes={setAttributes} blockData={blockData} />;\n     | \t\t       ^\n  42 | \t},\n  43 | \tsave: ({ attributes }) => {\n  44 | \t\treturn attributes.id >= 0 ? `[wptb id=${attributes.id}]` : '';\n\nAdd @babel/preset-react (https://git.io/JfeDR) to the 'presets' section of your Babel config to enable transformation.\nIf you want to leave it as-is, add @babel/plugin-syntax-jsx (https://git.io/vb4yA) to the 'plugins' section to enable parsing.\n    at PoolWorker.fromErrorObj (/home/erdem/Projects/PHP/wp-table-builder-pro-dev/wp-table-builder/node_modules/thread-loader/dist/WorkerPool.js:262:12)\n    at /home/erdem/Projects/PHP/wp-table-builder-pro-dev/wp-table-builder/node_modules/thread-loader/dist/WorkerPool.js:204:29\n    at Parser._raise (/home/erdem/Projects/PHP/wp-table-builder-pro-dev/wp-table-builder/node_modules/@babel/parser/lib/index.js:807:17)\n    at Parser.raiseWithData (/home/erdem/Projects/PHP/wp-table-builder-pro-dev/wp-table-builder/node_modules/@babel/parser/lib/index.js:800:17)\n    at Parser.expectOnePlugin (/home/erdem/Projects/PHP/wp-table-builder-pro-dev/wp-table-builder/node_modules/@babel/parser/lib/index.js:9946:18)\n    at Parser.parseExprAtom (/home/erdem/Projects/PHP/wp-table-builder-pro-dev/wp-table-builder/node_modules/@babel/parser/lib/index.js:11327:22)\n    at Parser.parseExprSubscripts (/home/erdem/Projects/PHP/wp-table-builder-pro-dev/wp-table-builder/node_modules/@babel/parser/lib/index.js:10904:23)\n    at Parser.parseUpdate (/home/erdem/Projects/PHP/wp-table-builder-pro-dev/wp-table-builder/node_modules/@babel/parser/lib/index.js:10884:21)\n    at Parser.parseMaybeUnary (/home/erdem/Projects/PHP/wp-table-builder-pro-dev/wp-table-builder/node_modules/@babel/parser/lib/index.js:10862:23)\n    at Parser.parseExprOps (/home/erdem/Projects/PHP/wp-table-builder-pro-dev/wp-table-builder/node_modules/@babel/parser/lib/index.js:10719:23)\n    at Parser.parseMaybeConditional (/home/erdem/Projects/PHP/wp-table-builder-pro-dev/wp-table-builder/node_modules/@babel/parser/lib/index.js:10693:23)\n    at Parser.parseMaybeAssign (/home/erdem/Projects/PHP/wp-table-builder-pro-dev/wp-table-builder/node_modules/@babel/parser/lib/index.js:10656:21)");

/***/ })

/******/ });
//# sourceMappingURL=wptb-block.js.map