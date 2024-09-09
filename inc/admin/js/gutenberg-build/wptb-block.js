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

/***/ "./inc/admin/js/core/WPTB_ExtraStyles.js":
/*!***********************************************!*\
  !*** ./inc/admin/js/core/WPTB_ExtraStyles.js ***!
  \***********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global, module) {/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/typeof.js");
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_2__);



/**
 * Extra styles module to add custom css rules defined for individual tables.
 */
(function UMD(key, context, factory) {
  if ( true && (typeof exports === "undefined" ? "undefined" : _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_2___default()(exports)) === "object") {
    module.exports = factory();
  } else {
    // eslint-disable-next-line no-param-reassign
    context[key] = factory();
  }
  // eslint-disable-next-line no-restricted-globals
})("WPTB_ExtraStyles", self || global, function () {
  /**
   * Extra styles frontend manager.
   *
   * This component will be responsible for adding and maintaining extra styles defined for tables.
   *
   * @class
   */
  // eslint-disable-next-line camelcase
  function WPTB_ExtraStyles() {
    var _this = this;
    /**
     * Extra styles operation modes
     *
     * @type {Object}
     */
    this.modes = {
      builder: "builder",
      frontEnd: "frontEnd",
      block: "block"
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
    this.generalStyles = "";

    /**
     * HTML queries for table element in different plugin modes
     *
     * @type {Object}
     */
    var tableQueries = _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()({}, this.modes.builder, ".wptb-table-setup .wptb-preview-table"), this.modes.block, ".wptb-block-table-setup .wptb-preview-table"), this.modes.frontEnd, ".wptb-table-container .wptb-preview-table");

    /**
     * Format styles.
     *
     * @param {string} styles styles
     * @return {string} formatted styles
     */
    var formatStyles = function formatStyles(styles) {
      // remove all newlines, comments and '!important' from style string to make it a one liner
      var cleaned = styles.replaceAll(/(\r?\n)|(\/\*.+?\*\/)|(\s*!important)/g, "");

      // add '!important' to all rules to override default style rules
      return cleaned.replaceAll(";", " !important;");
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
      var splitStyles = formattedStyles.split("}");
      var prefixedStylesArray = [];

      // eslint-disable-next-line array-callback-return
      splitStyles.map(function (split) {
        var regExp = new RegExp(/(.+?)\{/g);
        var matches = regExp.exec(split);
        if (matches) {
          if (prefix === matches[1].trim()) {
            prefixedStylesArray.push(split);
          } else {
            prefixedStylesArray.push(split.replace(matches[1], "".concat(prefix, " ").concat(matches[1])));
          }
        }
      });
      return "".concat(prefixedStylesArray.join("}"), "}");
    };

    /**
     * Apply general styles to document.
     *
     * @param {string} generalStyles general style rules
     * @param {Node} baseElement element to use as base
     */
    var applyGeneralStyles = function applyGeneralStyles(generalStyles) {
      var baseElement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var generalStylesheet = document.createElement("style");
      generalStylesheet.type = "text/css";
      generalStylesheet.id = "wptb-general-styles";
      if (!baseElement) {
        var head = _this.currentMode === _this.modes.block ? _this.baseDocument : _this.baseDocument.querySelector("head");
        head.appendChild(generalStylesheet);
      } else {
        baseElement.insertAdjacentElement("beforebegin", generalStylesheet);
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
      var styleIdPrefix = "wptb-extra-styles-";
      if (extraStylesRaw) {
        var extraStyles = atob(extraStylesRaw);
        var _tableElement$getAttr = tableElement.getAttribute("class").match(/wptb-element-main-table_setting-(?:startedid-)?(\d+)/),
          _tableElement$getAttr2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_tableElement$getAttr, 2),
          tableId = _tableElement$getAttr2[1];
        var styleId = styleIdPrefix + tableId;
        var head = _this.baseDocument.querySelector("head");

        // since stylesheets are created for frontend only once at startup, checking document head for any created style object will work even with theme disabled tables which at builder, they are not inside a shadow-root
        var styleElement = head === null || head === void 0 ? void 0 : head.querySelector("#".concat(styleId));

        // if no style element is found, create one
        if (!styleElement) {
          styleElement = document.createElement("style");
          styleElement.type = "text/css";
          styleElement.id = styleId;
          var isThemeStylesDisabled = tableElement.dataset.disableThemeStyles;

          // if theme styles are disabled, it means our table is residing inside a shadow-root, place style element inside shadow-root instead of document head
          if (isThemeStylesDisabled && _this.currentMode === _this.modes.frontEnd || _this.currentMode === _this.modes.block) {
            tableElement.insertAdjacentElement("beforebegin", styleElement);
            if (_this.currentMode === _this.modes.frontEnd && _this.generalStyles) {
              applyGeneralStyles(_this.generalStyles, tableElement);
            }
          } else {
            head.appendChild(styleElement);
          }
        }
        var uniqueClass = ".wptb-element-main-table_setting-".concat(tableId);
        // reform style rules so they will only affect the table they are assigned to
        var prefixedStyles = prefixStyleRules(uniqueClass, extraStyles);

        // remove previous styles with updated ones
        styleElement.innerHTML = "";
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
      }

      // only apply general styles on client frontend if any general styles are defined
      if ((mode === _this.modes.frontEnd || mode === _this.modes.block) && generalStyles) {
        applyGeneralStyles(generalStyles);
      }
    };
  }

  // send a singleton instance of manager
  return new WPTB_ExtraStyles();
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../node_modules/webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js"), __webpack_require__(/*! ./../../../../node_modules/webpack/buildin/harmony-module.js */ "./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "./inc/admin/js/core/gutenberg-src/components/BlockButton.js":
/*!*******************************************************************!*\
  !*** ./inc/admin/js/core/gutenberg-src/components/BlockButton.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return BlockButton; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

function BlockButton(_ref) {
  var type = _ref.type,
    onClick = _ref.onClick,
    children = _ref.children,
    disabled = _ref.disabled;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    onClick: onClick,
    className: "wptb-block-button wptb-unselectable ".concat(type || 'primary', " ").concat(disabled ? 'wptb-block-button-disabled' : '')
  }, children);
}

/***/ }),

/***/ "./inc/admin/js/core/gutenberg-src/components/Builder.js":
/*!***************************************************************!*\
  !*** ./inc/admin/js/core/gutenberg-src/components/Builder.js ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Builder; });
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _BusyOverlay__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./BusyOverlay */ "./inc/admin/js/core/gutenberg-src/components/BusyOverlay.js");




function Builder(_ref) {
  var builderUrl = _ref.builderUrl,
    show = _ref.show,
    builderVisibility = _ref.builderVisibility,
    updateSelection = _ref.updateSelection;
  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(builderUrl),
    _useState2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useState, 2),
    gutenbergUrl = _useState2[0],
    setUrl = _useState2[1];
  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(false),
    _useState4 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_useState3, 2),
    frameLoaded = _useState4[0],
    setFrameLoaded = _useState4[1];
  var ref = Object(react__WEBPACK_IMPORTED_MODULE_1__["useRef"])(null);
  function prepareUrl(val) {
    if (val) {
      var parsedUrl = new URL(val);
      parsedUrl.searchParams.append('gutenberg', true);
      setUrl(parsedUrl.toString());
    }
  }
  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(function () {
    prepareUrl(builderUrl);
    if (show) {
      var togglePreferenceValue = Object(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__["select"])('core/edit-post').isFeatureActive('fullscreenMode');
      if (!togglePreferenceValue) {
        Object(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__["dispatch"])('core/edit-post').toggleFeature('fullscreenMode');
      }
      setFrameLoaded(false);
      ref.current.addEventListener('load', function () {
        setFrameLoaded(true);
        var refDocument = ref.current.contentDocument || ref.current.contentWindow.document;
        refDocument.addEventListener('gutenbergClose', function (_ref2) {
          var detail = _ref2.detail;
          if (detail !== true) {
            if (updateSelection && typeof updateSelection === 'function') {
              updateSelection(detail);
            }
          }
          builderVisibility(false);
        });
      });
    }
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: "wptb-block-builder-wrapper ".concat(show ? '' : 'hide')
  }, show ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1__["Fragment"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    style: {
      display: frameLoaded ? 'none' : 'flex'
    },
    className: 'wptb-block-builder-load-indicator'
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_BusyOverlay__WEBPACK_IMPORTED_MODULE_3__["default"], {
    show: true
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("iframe", {
    ref: ref,
    className: 'wptb-block-builder',
    src: gutenbergUrl
  })) : '');
}

/***/ }),

/***/ "./inc/admin/js/core/gutenberg-src/components/BusyOverlay.js":
/*!*******************************************************************!*\
  !*** ./inc/admin/js/core/gutenberg-src/components/BusyOverlay.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return BusyOverlay; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _WptbOverlay__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WptbOverlay */ "./inc/admin/js/core/gutenberg-src/components/WptbOverlay.js");


function BusyOverlay(_ref) {
  var show = _ref.show;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_WptbOverlay__WEBPACK_IMPORTED_MODULE_1__["default"], {
    show: show
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: 'wptb-busy-overlay dashicons dashicons-update-alt'
  }));
}

/***/ }),

/***/ "./inc/admin/js/core/gutenberg-src/components/PortalTarget.js":
/*!********************************************************************!*\
  !*** ./inc/admin/js/core/gutenberg-src/components/PortalTarget.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return PortalTarget; });
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_0__);

function PortalTarget(_ref) {
  var targetEl = _ref.targetEl,
    children = _ref.children,
    id = _ref.id;
  targetEl.setAttribute('id', id);
  return /*#__PURE__*/Object(react_dom__WEBPACK_IMPORTED_MODULE_0__["createPortal"])(children, targetEl);
}

/***/ }),

/***/ "./inc/admin/js/core/gutenberg-src/components/SelectedTableView.js":
/*!*************************************************************************!*\
  !*** ./inc/admin/js/core/gutenberg-src/components/SelectedTableView.js ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return SelectedTableView; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _TablePreview__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TablePreview */ "./inc/admin/js/core/gutenberg-src/components/TablePreview.js");
/* harmony import */ var _BlockButton__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./BlockButton */ "./inc/admin/js/core/gutenberg-src/components/BlockButton.js");





function SelectedTableView(_ref) {
  var selectedTable = _ref.selectedTable,
    footerRightPortal = _ref.footerRightPortal,
    changeToSelect = _ref.changeToSelect;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: 'wptb-table-selected-view wptb-basic-appear-anim'
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_TablePreview__WEBPACK_IMPORTED_MODULE_3__["default"], {
    scale: true,
    content: selectedTable ? selectedTable.content : null
  }), footerRightPortal !== null ? /*#__PURE__*/react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.createPortal( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_BlockButton__WEBPACK_IMPORTED_MODULE_4__["default"], {
    onClick: changeToSelect
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('change', 'wp-table-builder')), footerRightPortal.current) : '');
}

/***/ }),

/***/ "./inc/admin/js/core/gutenberg-src/components/TableBlock.js":
/*!******************************************************************!*\
  !*** ./inc/admin/js/core/gutenberg-src/components/TableBlock.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _TableSelect__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./TableSelect */ "./inc/admin/js/core/gutenberg-src/components/TableSelect.js");
/* harmony import */ var _SelectedTableView__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./SelectedTableView */ "./inc/admin/js/core/gutenberg-src/components/SelectedTableView.js");
/* harmony import */ var _TablePreview__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./TablePreview */ "./inc/admin/js/core/gutenberg-src/components/TablePreview.js");
/* harmony import */ var _Builder__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Builder */ "./inc/admin/js/core/gutenberg-src/components/Builder.js");
/* harmony import */ var _functions_withContext__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../functions/withContext */ "./inc/admin/js/core/gutenberg-src/functions/withContext.js");
/* harmony import */ var _BusyOverlay__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./BusyOverlay */ "./inc/admin/js/core/gutenberg-src/components/BusyOverlay.js");
/* harmony import */ var _TableInspectorControls__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./TableInspectorControls */ "./inc/admin/js/core/gutenberg-src/components/TableInspectorControls.js");
/* harmony import */ var _PortalTarget__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./PortalTarget */ "./inc/admin/js/core/gutenberg-src/components/PortalTarget.js");





function _callSuper(t, o, e) { return o = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(o), _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_2___default()(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_3___default()(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }











/**
 * TableBlock component.
 *
 * This component handle UI part of the gutenberg block.
 */
var TableBlock = /*#__PURE__*/function (_React$Component) {
  function TableBlock(props) {
    var _this;
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, TableBlock);
    _this = _callSuper(this, TableBlock, [props]);
    _this.state = {
      selectedId: Number.parseInt(_this.props.attributes.id, 10),
      savedId: Number.parseInt(_this.props.attributes.id, 10),
      searchTerm: "",
      footerRightPortal: null,
      fullPreview: false,
      showBuilder: false,
      builderUrl: props.builderUrl
    };
    _this.state.selectScreen = _this.state.savedId === -1;
    _this.state.expanded = _this.state.savedId === -1;
    _this.toggleBlock = _this.toggleBlock.bind(_this);
    _this.slideMain = _this.slideMain.bind(_this);
    _this.rowSelected = _this.rowSelected.bind(_this);
    _this.selectedTable = _this.selectedTable.bind(_this);
    _this.updateSearch = _this.updateSearch.bind(_this);
    _this.filteredTables = _this.filteredTables.bind(_this);
    _this.saveTable = _this.saveTable.bind(_this);
    _this.changeToSelect = _this.changeToSelect.bind(_this);
    _this.setSelectScreen = _this.setSelectScreen.bind(_this);
    _this.openNewTableBuilder = _this.openNewTableBuilder.bind(_this);
    _this.openTableEditBuilder = _this.openTableEditBuilder.bind(_this);
    _this.setBuilderVisibility = _this.setBuilderVisibility.bind(_this);
    _this.updateSelection = _this.updateSelection.bind(_this);
    _this.mainRef = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createRef();
    _this.footerRightPortal = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createRef();
    _this.portalTargetEditor = document.body.appendChild(document.createElement("div"));
    return _this;
  }

  /**
   * Component mounted lifecycle hook.
   */
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4___default()(TableBlock, _React$Component);
  return _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(TableBlock, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.slideMain();
      this.setState({
        footerRightPortal: this.footerRightPortal
      });

      // decide whether to show full table preview or not
      this.setState({
        fullPreview: this.state.savedId > 0
      });
    }

    // Update selection depending on builder sent id.
  }, {
    key: "updateSelection",
    value: function updateSelection(id) {
      var _this2 = this;
      return this.props.getTables().then(function () {
        _this2.setState({
          selectedId: Number.parseInt(id, 10)
        });
        _this2.saveTable();
      });
    }

    /**
     * Toggle visibility status of block main area.
     *
     * @param {Event} e html event
     */
  }, {
    key: "toggleBlock",
    value: function toggleBlock(e) {
      e.preventDefault();
      this.setState(function (state) {
        return {
          expanded: !state.expanded
        };
      });
    }

    /**
     * Slide up/down main area of toggle depending on block toggle status.
     */
  }, {
    key: "slideMain",
    value: function slideMain() {
      var direction = this.state.expanded ? "slideDown" : "slideUp";
      jQuery(this.mainRef.current)[direction]();
    }

    /**
     * Filter tables according to search term.
     *
     * @return {Array} filtered tables
     */
  }, {
    key: "filteredTables",
    value: function filteredTables() {
      var _this3 = this;
      if (this.state.searchTerm === "") {
        return this.props.tables;
      }
      return this.props.tables.filter(function (t) {
        var regexp = new RegExp("(".concat(_this3.state.searchTerm, ")"), "gi");
        return regexp.test(t.title) || regexp.test("".concat(t.id));
      });
    }

    /**
     * Component updated lifecycle hook.
     *
     * @param {Object} _ previous props
     * @param {Object} prevState previous state
     */
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(_, prevState) {
      this.slideMain();
      this.props.setAttributes({
        id: this.state.savedId
      });

      // enable full preview if saved table is changed
      if (prevState.savedId !== this.state.savedId) {
        this.setState({
          fullPreview: true
        });
      }
    }

    /**
     * Row selected callback function.
     *
     * @param {number} id selected table id
     * @return {function(*): void} click callback function
     */
  }, {
    key: "rowSelected",
    value: function rowSelected(id) {
      var _this4 = this;
      return function (e) {
        e.preventDefault();
        _this4.setState({
          selectedId: id
        });
      };
    }

    /**
     * Get selected table.
     *
     * @return {Object} selected table object
     */
  }, {
    key: "selectedTable",
    value: function selectedTable() {
      var _this5 = this;
      return this.props.tables.filter(function (t) {
        return _this5.state.selectedId === t.id;
      })[0];
    }

    /**
     * Get saved table for the block.
     *
     * @return {Object|undefined} saved table
     */
  }, {
    key: "savedTable",
    value: function savedTable() {
      var _this6 = this;
      return this.props.tables.filter(function (t) {
        return _this6.state.savedId === t.id;
      })[0];
    }

    /**
     * Set selected table as saved table to bind to block and its shortcode.
     */
  }, {
    key: "saveTable",
    value: function saveTable() {
      this.props.setSavedTable(this.state.selectedId);
      this.setState({
        savedId: this.state.selectedId,
        selectScreen: false
      });
    }

    /**
     * Update search term.
     *
     * @param {Event} e element event
     */
  }, {
    key: "updateSearch",
    value: function updateSearch(e) {
      this.setState({
        searchTerm: e
      });
    }

    /**
     * Change current screen to table select.
     */
  }, {
    key: "changeToSelect",
    value: function changeToSelect() {
      this.setState({
        selectScreen: true
      });
    }

    /**
     * Change visibility of select screen.
     *
     * @param {boolean} val status
     */
  }, {
    key: "setSelectScreen",
    value: function setSelectScreen(val) {
      this.setState({
        selectScreen: val
      });
    }

    /**
     * Set visibility of builder page.
     *
     * @param {boolean} val show/hide
     */
  }, {
    key: "setBuilderVisibility",
    value: function setBuilderVisibility(val) {
      this.setState({
        showBuilder: val
      });
    }

    /**
     * Open builder page for new table.
     */
  }, {
    key: "openNewTableBuilder",
    value: function openNewTableBuilder() {
      this.setState({
        builderUrl: this.props.blockData.builderUrl,
        showBuilder: true
      });
    }

    /**
     * Open builder page for table edit.
     */
  }, {
    key: "openTableEditBuilder",
    value: function openTableEditBuilder() {
      if (this.state.savedId > 0) {
        var url = new URL(this.props.blockData.builderUrl);
        url.searchParams.append("table", this.state.selectScreen ? this.state.selectedId : this.state.savedId);
        this.setState({
          builderUrl: url.toString(),
          showBuilder: true
        });
      }
    }

    /**
     * Render component to DOM.
     *
     * @return {JSX.Element} rendered component
     */
  }, {
    key: "render",
    value: function render() {
      var _this7 = this;
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_5__["Fragment"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_TableInspectorControls__WEBPACK_IMPORTED_MODULE_13__["default"], {
        header: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__["__"])("Info", "wp-table-builder"),
        table: this.state.selectScreen ? this.selectedTable() : this.props.savedTable
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
        style: {
          display: this.state.fullPreview ? "none" : "grid"
        },
        className: "wptb-block-wrapper wptb-basic-appear-anim"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_BusyOverlay__WEBPACK_IMPORTED_MODULE_12__["default"], {
        show: this.props.isFetching()
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
        className: "wptb-block-header"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
        className: "wptb-plugin-left-toolbox"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
        className: "wptb-plugin-brand"
      }, "WP Table Builder"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
        className: "wptb-plugin-selected-header-info"
      }, this.props.savedTable ? this.props.savedTable.title : Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__["__"])("No table selected", "wp-table-builder"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
        className: "wptb-header-toolbox"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
        className: "wptb-block-tool dashicons dashicons-insert",
        title: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__["__"])("new table", "wp-table-builder"),
        onClick: this.openNewTableBuilder
      }), this.filteredTables().length > 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
        className: "wptb-block-tool dashicons dashicons-edit-large",
        title: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__["__"])("edit table", "wp-table-builder"),
        onClick: this.openTableEditBuilder,
        "data-disabled": !(Number.parseInt(this.state.savedId, 10) > 0)
      }) : "", this.state.savedId >= 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_5__["Fragment"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
        className: "wptb-block-tool dashicons dashicons-fullscreen-alt",
        onClick: function onClick() {
          return _this7.setState({
            fullPreview: true
          });
        },
        title: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__["__"])("maximize preview", "wp-table-builder")
      })) : "", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
        className: "wptb-block-toggle dashicons wptb-block-tool",
        "aria-expanded": this.state.expanded,
        onClick: this.toggleBlock
      }))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
        ref: this.mainRef
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
        className: "wptb-block-main"
      }, this.state.selectScreen ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_TableSelect__WEBPACK_IMPORTED_MODULE_7__["default"], {
        searchTerm: this.state.searchTerm,
        updateSearch: this.updateSearch,
        selectedId: this.state.selectedId,
        rowSelected: this.rowSelected,
        filteredTables: this.filteredTables,
        selectedTable: this.selectedTable(),
        saveTable: this.saveTable,
        footerRightPortal: this.state.footerRightPortal,
        savedId: this.state.savedId,
        setSelectScreen: this.setSelectScreen
      }) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_SelectedTableView__WEBPACK_IMPORTED_MODULE_8__["default"], {
        footerRightPortal: this.state.footerRightPortal,
        selectedTable: this.props.savedTable,
        changeToSelect: this.changeToSelect
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
        className: "wptb-block-footer"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
        className: "wptb-block-footer-left"
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
        ref: this.footerRightPortal,
        className: "wptb-block-footer-right"
      })))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
        style: {
          display: this.state.fullPreview ? "flex" : "none"
        },
        className: "wptb-block-full-preview wptb-basic-appear-anim"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement("div", {
        className: "dashicons dashicons-fullscreen-exit-alt wptb-block-minimize-button wptb-block-tool wptb-block-shadow",
        onClick: function onClick() {
          return _this7.setState({
            fullPreview: false
          });
        },
        title: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__["__"])("minimize preview", "wp-table-builder")
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_TablePreview__WEBPACK_IMPORTED_MODULE_9__["default"], {
        content: this.props.savedTable ? this.props.savedTable.content : null
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_PortalTarget__WEBPACK_IMPORTED_MODULE_14__["default"], {
        id: "wptbEditorPortal",
        targetEl: this.portalTargetEditor
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default.a.createElement(_Builder__WEBPACK_IMPORTED_MODULE_10__["default"], {
        builderVisibility: this.setBuilderVisibility,
        show: this.state.showBuilder,
        builderUrl: this.state.builderUrl,
        updateSelection: this.updateSelection
      })));
    }
  }]);
}(react__WEBPACK_IMPORTED_MODULE_5___default.a.Component);
/* @module TableBlock module */
/* harmony default export */ __webpack_exports__["default"] = (Object(_functions_withContext__WEBPACK_IMPORTED_MODULE_11__["withContext"])(TableBlock));

/***/ }),

/***/ "./inc/admin/js/core/gutenberg-src/components/TableBlockInfoItem.js":
/*!**************************************************************************!*\
  !*** ./inc/admin/js/core/gutenberg-src/components/TableBlockInfoItem.js ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return TableBlockInfoItem; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);


function TableBlockInfoItem(_ref) {
  var label = _ref.label,
    value = _ref.value;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__["PanelRow"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: 'wptb-block-info-label'
  }, label), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: 'wptb-block-info-value'
  }, value));
}

/***/ }),

/***/ "./inc/admin/js/core/gutenberg-src/components/TableInspectorControls.js":
/*!******************************************************************************!*\
  !*** ./inc/admin/js/core/gutenberg-src/components/TableInspectorControls.js ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return TableBlockInspector; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _TableBlockInfoItem__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./TableBlockInfoItem */ "./inc/admin/js/core/gutenberg-src/components/TableBlockInfoItem.js");





function TableBlockInspector(_ref) {
  var header = _ref.header,
    table = _ref.table;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__["InspectorControls"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["Panel"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["PanelBody"], {
    title: header,
    initialOpen: true
  }, table ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_TableBlockInfoItem__WEBPACK_IMPORTED_MODULE_4__["default"], {
    label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('ID', 'wp-table-builder'),
    value: table.id
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_TableBlockInfoItem__WEBPACK_IMPORTED_MODULE_4__["default"], {
    label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('title', 'wp-table-builder'),
    value: table.title
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_TableBlockInfoItem__WEBPACK_IMPORTED_MODULE_4__["default"], {
    label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('shortcode', 'wp-table-builder'),
    value: "[wptb id=".concat(table.id, "]")
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_TableBlockInfoItem__WEBPACK_IMPORTED_MODULE_4__["default"], {
    label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["_x"])('tags', 'modified date', 'wp-table-builder'),
    value: table.wptb_table_tags.length > 0 ? table.wptb_table_tags.map(function (t) {
      return t.name;
    }).join(',') : Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('No Tags', 'wp-table-builder')
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_TableBlockInfoItem__WEBPACK_IMPORTED_MODULE_4__["default"], {
    label: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["_x"])('Modified at', 'modified date', 'wp-table-builder'),
    value: new Intl.DateTimeFormat('default').format(new Date(table.modified))
  })) : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__["PanelRow"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", null, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__["__"])('no table selected', 'wp-table-builder'))))));
}

/***/ }),

/***/ "./inc/admin/js/core/gutenberg-src/components/TableList.js":
/*!*****************************************************************!*\
  !*** ./inc/admin/js/core/gutenberg-src/components/TableList.js ***!
  \*****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return TableList; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _WptbOverlay__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./WptbOverlay */ "./inc/admin/js/core/gutenberg-src/components/WptbOverlay.js");



function TableList(_ref) {
  var tables = _ref.tables,
    rowSelected = _ref.rowSelected,
    selectedId = _ref.selectedId,
    searchTerm = _ref.searchTerm,
    activeId = _ref.activeId;
  var indicateFoundTerm = function indicateFoundTerm(value) {
    var parsedVal = "".concat(value);
    var regexp = new RegExp("(".concat(searchTerm, ")"), 'ig');
    return parsedVal.replace(regexp, '<span class="wptb-block-search-indicator">$&</span>');
  };
  var isActive = function isActive(tableId) {
    return Number.parseInt(activeId, 10) === Number.parseInt(tableId, 10);
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: 'wptb-table-list'
  }, tables.map(function (table) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      onClick: rowSelected(table.id),
      className: "wptb-table-list-row wptb-basic-appear-anim ".concat(selectedId === table.id ? 'selected' : ''),
      key: table.id,
      "data-is-active": isActive(table.id)
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: 'wptb-table-list-title',
      dangerouslySetInnerHTML: {
        __html: indicateFoundTerm(table.title)
      }
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: 'wptb-table-list-id',
      dangerouslySetInnerHTML: {
        __html: indicateFoundTerm(table.id)
      }
    }));
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_WptbOverlay__WEBPACK_IMPORTED_MODULE_2__["default"], {
    show: tables.length <= 0
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__["__"])('no tables found', 'wp-table-builder')));
}

/***/ }),

/***/ "./inc/admin/js/core/gutenberg-src/components/TablePreview.js":
/*!********************************************************************!*\
  !*** ./inc/admin/js/core/gutenberg-src/components/TablePreview.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _functions_withContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../functions/withContext */ "./inc/admin/js/core/gutenberg-src/functions/withContext.js");
/* harmony import */ var _WPTB_ExtraStyles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../WPTB_ExtraStyles */ "./inc/admin/js/core/WPTB_ExtraStyles.js");


// eslint-disable-next-line no-unused-vars

function TablePreview(_ref) {
  var content = _ref.content,
    scale = _ref.scale,
    _ref$blockData = _ref.blockData,
    tableCssUrl = _ref$blockData.tableCssUrl,
    generalStyles = _ref$blockData.generalStyles;
  var ref = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createRef();
  var previewPadding = 40;
  function prepareStylesheet(handler, url, root) {
    var styleSheet = document.createElement('link');
    styleSheet.setAttribute('rel', 'stylesheet');
    styleSheet.setAttribute('href', url);
    styleSheet.setAttribute('media', 'all');
    styleSheet.setAttribute('id', handler);
    root.appendChild(styleSheet);
  }
  function prepareScript(handler, url, root) {
    var script = document.createElement('script');
    script.setAttribute('src', url);
    root.appendChild(script);
  }
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    if (content !== null && tableCssUrl !== undefined) {
      var elem = document.createElement('div');
      elem.setAttribute('id', 'wptb-block-preview-base');
      elem.attachShadow({
        mode: 'open'
      });
      var shadowRoot = elem.shadowRoot;

      // prepare styles
      // eslint-disable-next-line array-callback-return
      Object.keys(tableCssUrl).map(function (handler) {
        if (Object.prototype.hasOwnProperty.call(tableCssUrl, handler)) {
          prepareStylesheet(handler, tableCssUrl[handler], shadowRoot);
        }
      });

      // add table content to shadowroot
      var range = document.createRange();
      range.setStart(document, 0);
      var contentElement = range.createContextualFragment("<div class=\"wptb-block-table-setup\">".concat(content, "</div>"));
      shadowRoot.appendChild(contentElement.children[0]);
      window.WPTB_ExtraStyles.applyStyles(window.WPTB_ExtraStyles.modes.block, generalStyles, shadowRoot);
      var previewWrapper = ref.current;
      var previewTable = shadowRoot.querySelector('table');
      var maxWidth = previewTable.dataset.wptbTableContainerMaxWidth;
      var sumMaxWidth = previewTable.dataset.wptbTableContainerMaxWidth;
      var tableWidth = '700px';
      if (sumMaxWidth) {
        tableWidth = 'auto';
        previewTable.style.minWidth = "".concat(maxWidth ? Math.max(maxWidth, sumMaxWidth) : sumMaxWidth, "px");
      } else if (maxWidth) {
        tableWidth = "".concat(maxWidth, "px");
      }
      previewTable.style.width = tableWidth;

      // clear content of preview wrapper
      previewWrapper.innerHTML = '';
      previewWrapper.appendChild(elem);
      if (scale) {
        var _previewWrapper$getBo = previewWrapper.getBoundingClientRect(),
          wrapperWidth = _previewWrapper$getBo.width,
          wrapperHeight = _previewWrapper$getBo.height;
        var _previewTable$getBoun = previewTable.getBoundingClientRect(),
          previewWidth = _previewTable$getBoun.width,
          previewHeight = _previewTable$getBoun.height;
        var widthScale = wrapperWidth / (previewWidth + previewPadding);
        var heightScale = wrapperHeight / (previewHeight + previewPadding);
        var scaleVal = Math.min(widthScale, heightScale);
        previewTable.style.transform = "scale(".concat(scaleVal, ")");

        // fix for chrome browsers where table previews are distorted for tables with separated columns and row
        if (window.navigator.vendor.includes('Google')) {
          if (previewTable.style.borderCollapse === 'separate') {
            var borderHorizontalSpacing = parseInt(previewTable.dataset.borderSpacingColumns, 10);
            var cellCount = parseInt(previewTable.dataset.wptbCellsWidthAutoCount, 10);
            previewTable.style.marginLeft = "-".concat((cellCount + 1) * borderHorizontalSpacing * -1, "px");
          }
        }
      }
    }
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    ref: ref,
    className: 'wptb-table-preview wptb-unselectable'
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
    className: "dashicons dashicons-grid-view no-table-selected-preview"
  }));
}
/* harmony default export */ __webpack_exports__["default"] = (Object(_functions_withContext__WEBPACK_IMPORTED_MODULE_1__["withContext"])(TablePreview));

/***/ }),

/***/ "./inc/admin/js/core/gutenberg-src/components/TableSearch.js":
/*!*******************************************************************!*\
  !*** ./inc/admin/js/core/gutenberg-src/components/TableSearch.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return TableSearch; });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);



/**
 * Table search component.
 *
 * @param {string} searchTerm current search term
 * @param {Function} updateSearch function to update search term state on calling component
 * @return {JSX.Element} table search component
 * @class
 */
function TableSearch(_ref) {
  var searchTerm = _ref.searchTerm,
    updateSearch = _ref.updateSearch;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: 'wptb-table-search'
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("input", {
    value: searchTerm,
    onChange: function onChange(e) {
      return updateSearch(e.target.value);
    },
    type: "text",
    placeholder: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__["__"])('search for tables', 'wp-table-builder')
  }), searchTerm !== '' ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("div", {
    className: 'wptb-search-clear',
    onClick: function onClick() {
      return updateSearch('');
    }
  }, "X") : '');
}

/***/ }),

/***/ "./inc/admin/js/core/gutenberg-src/components/TableSelect.js":
/*!*******************************************************************!*\
  !*** ./inc/admin/js/core/gutenberg-src/components/TableSelect.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return TableSelect; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _TableSearch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TableSearch */ "./inc/admin/js/core/gutenberg-src/components/TableSearch.js");
/* harmony import */ var _TableList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./TableList */ "./inc/admin/js/core/gutenberg-src/components/TableList.js");
/* harmony import */ var _TablePreview__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./TablePreview */ "./inc/admin/js/core/gutenberg-src/components/TablePreview.js");
/* harmony import */ var _BlockButton__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./BlockButton */ "./inc/admin/js/core/gutenberg-src/components/BlockButton.js");







function TableSelect(_ref) {
  var searchTerm = _ref.searchTerm,
    updateSearch = _ref.updateSearch,
    selectedId = _ref.selectedId,
    rowSelected = _ref.rowSelected,
    filteredTables = _ref.filteredTables,
    selectedTable = _ref.selectedTable,
    saveTable = _ref.saveTable,
    footerRightPortal = _ref.footerRightPortal,
    savedId = _ref.savedId,
    setSelectScreen = _ref.setSelectScreen;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: 'wptb-table-select'
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: 'wptb-table-list-wrapper'
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_TableSearch__WEBPACK_IMPORTED_MODULE_3__["default"], {
    searchTerm: searchTerm,
    updateSearch: updateSearch
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_TableList__WEBPACK_IMPORTED_MODULE_4__["default"], {
    searchTerm: searchTerm,
    selectedId: selectedId,
    rowSelected: rowSelected,
    tables: filteredTables(),
    activeId: savedId
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_TablePreview__WEBPACK_IMPORTED_MODULE_5__["default"], {
    scale: true,
    content: selectedTable ? selectedTable.content : null
  }), footerRightPortal !== null ? /*#__PURE__*/react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.createPortal( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, savedId >= 0 ? /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_BlockButton__WEBPACK_IMPORTED_MODULE_6__["default"], {
    onClick: function onClick() {
      return setSelectScreen(false);
    },
    type: 'negative'
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('cancel', 'wp-table-builder')) : '', /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_BlockButton__WEBPACK_IMPORTED_MODULE_6__["default"], {
    disabled: !selectedTable || savedId === selectedId,
    onClick: saveTable
  }, Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('select', 'wp-table-builder'))), footerRightPortal.current) : '');
}

/***/ }),

/***/ "./inc/admin/js/core/gutenberg-src/components/WptbOverlay.js":
/*!*******************************************************************!*\
  !*** ./inc/admin/js/core/gutenberg-src/components/WptbOverlay.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return WptbOverlay; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

function WptbOverlay(_ref) {
  var show = _ref.show,
    children = _ref.children;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
    className: 'wptb-block-overlay wptb-basic-appear-anim',
    style: {
      display: show ? 'flex' : 'none'
    }
  }, children);
}

/***/ }),

/***/ "./inc/admin/js/core/gutenberg-src/containers/TableBlockApp.js":
/*!*********************************************************************!*\
  !*** ./inc/admin/js/core/gutenberg-src/containers/TableBlockApp.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return TableBlockApp; });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/slicedToArray.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/createClass.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/inherits.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _functions_withContext__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../functions/withContext */ "./inc/admin/js/core/gutenberg-src/functions/withContext.js");
/* harmony import */ var _components_TableBlock__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../components/TableBlock */ "./inc/admin/js/core/gutenberg-src/components/TableBlock.js");







function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _callSuper(t, o, e) { return o = _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5___default()(o), _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4___default()(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5___default()(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }





var TableBlockApp = /*#__PURE__*/function (_React$Component) {
  function TableBlockApp(props) {
    var _this;
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_2___default()(this, TableBlockApp);
    _this = _callSuper(this, TableBlockApp, [props]);
    var attributes = props.attributes,
      setAttributes = props.setAttributes,
      blockData = props.blockData;
    _this.setSavedTable = _this.setSavedTable.bind(_this);
    _this.state = {
      tables: [],
      attributes: attributes,
      setAttributes: setAttributes,
      savedTable: null,
      setSavedTable: _this.setSavedTable,
      blockData: blockData,
      fetching: false,
      isFetching: function isFetching() {
        return _this.state.fetching;
      },
      setFetch: function setFetch(status) {
        _this.setState({
          fetching: status
        });
      },
      getTables: function getTables() {
        _this.state.setFetch(true);
        return _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_8___default()({
          path: "/wp/v2/wptb-tables?status=draft&per_page=-1"
        }).then(function (tables) {
          _this.setState({
            tables: tables.filter(function (t) {
              // filter out prebuilt tables from list
              // eslint-disable-next-line no-underscore-dangle
              var _t$meta$_wptb_prebuil = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1___default()(t.meta._wptb_prebuilt_, 1),
                prebuiltStatus = _t$meta$_wptb_prebuil[0];
              return !prebuiltStatus;
            }).map(function (t) {
              return _objectSpread(_objectSpread({}, t), {
                id: t.id,
                // eslint-disable-next-line no-underscore-dangle
                content: t.meta._wptb_content_,
                title: t.title.rendered === "" || t.title.rendered === "Untitled" ? "".concat(Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_9__["__"])("Table", "wp-table-builder"), " #").concat(t.id) : t.title.rendered
              });
            })
          });
          _this.state.setFetch(false);
        });
      }
    };
    return _this;
  }
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_6___default()(TableBlockApp, _React$Component);
  return _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_3___default()(TableBlockApp, [{
    key: "setSavedTable",
    value: function setSavedTable(id) {
      this.setState({
        savedTable: this.state.tables.filter(function (t) {
          return t.id === id;
        })[0]
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;
      this.state.getTables().then(function () {
        _this2.setSavedTable(_this2.state.attributes.id);
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_functions_withContext__WEBPACK_IMPORTED_MODULE_10__["TableContext"].Provider, {
        value: this.state
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_7___default.a.createElement(_components_TableBlock__WEBPACK_IMPORTED_MODULE_11__["default"], null));
    }
  }]);
}(react__WEBPACK_IMPORTED_MODULE_7___default.a.Component);


/***/ }),

/***/ "./inc/admin/js/core/gutenberg-src/functions/withContext.js":
/*!******************************************************************!*\
  !*** ./inc/admin/js/core/gutenberg-src/functions/withContext.js ***!
  \******************************************************************/
/*! exports provided: TableContext, withContext */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TableContext", function() { return TableContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withContext", function() { return withContext; });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/extends.js");
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);



/**
 * React context for table data.
 *
 * @type {Object}
 */
var TableContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createContext({
  attributes: {},
  setAttributes: function setAttributes() {},
  savedTable: null,
  setSavedTable: function setSavedTable() {},
  blockData: {}
});

/**
 * HOC for table context.
 *
 * @param {Function} Component react component to be wrapped
 * @return {function(*): *} with context function
 */
function withContext(Component) {
  return function WithTableContextComponent(props) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(TableContext.Consumer, null, function (context) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(Component, _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0___default()({}, context, props));
    });
  };
}

/***/ }),

/***/ "./inc/admin/js/core/gutenberg-src/style/block-style.sass":
/*!****************************************************************!*\
  !*** ./inc/admin/js/core/gutenberg-src/style/block-style.sass ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./inc/admin/js/core/gutenberg-src/wptb-block.js":
/*!*******************************************************!*\
  !*** ./inc/admin/js/core/gutenberg-src/wptb-block.js ***!
  \*******************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _containers_TableBlockApp__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./containers/TableBlockApp */ "./inc/admin/js/core/gutenberg-src/containers/TableBlockApp.js");
/* harmony import */ var _style_block_style_sass__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./style/block-style.sass */ "./inc/admin/js/core/gutenberg-src/style/block-style.sass");
/* harmony import */ var _style_block_style_sass__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_style_block_style_sass__WEBPACK_IMPORTED_MODULE_5__);

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }




// eslint-disable-next-line no-unused-vars

var blockData = _objectSpread({}, wptbBlockData);
wptbBlockData = undefined;
Object(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__["registerBlockType"])(blockData.blockName, {
  title: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('WP Table Builder', 'wp-table-builder'),
  description: Object(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__["__"])('WP Table Builder editor block', 'wp-table-builder'),
  category: 'widgets',
  icon: 'editor-table',
  attributes: {
    id: {
      type: 'number',
      "default": '-1'
    }
  },
  transforms: {
    from: [{
      type: 'shortcode',
      tag: 'wptb',
      attributes: {
        id: {
          type: 'number',
          shortcode: function shortcode(_ref) {
            var named = _ref.named;
            return Number.parseInt(named.id, 10);
          }
        }
      },
      priority: 1
    }]
  },
  edit: function edit(_ref2) {
    var attributes = _ref2.attributes,
      setAttributes = _ref2.setAttributes;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_3___default.a.createElement(_containers_TableBlockApp__WEBPACK_IMPORTED_MODULE_4__["default"], {
      attributes: attributes,
      setAttributes: setAttributes,
      blockData: blockData
    });
  },
  save: function save(_ref3) {
    var attributes = _ref3.attributes;
    return attributes.id >= 0 ? "[wptb id=".concat(attributes.id, "]") : '';
  }
});

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/arrayLikeToArray.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayLikeToArray.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/arrayWithHoles.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayWithHoles.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
module.exports = _arrayWithHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/assertThisInitialized.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
module.exports = _assertThisInitialized, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/classCallCheck.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/classCallCheck.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/createClass.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/createClass.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toPropertyKey = __webpack_require__(/*! ./toPropertyKey.js */ "./node_modules/@babel/runtime/helpers/toPropertyKey.js");
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
module.exports = _createClass, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/defineProperty.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/defineProperty.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toPropertyKey = __webpack_require__(/*! ./toPropertyKey.js */ "./node_modules/@babel/runtime/helpers/toPropertyKey.js");
function _defineProperty(obj, key, value) {
  key = toPropertyKey(key);
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
module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/extends.js":
/*!********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/extends.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _extends() {
  module.exports = _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _extends.apply(this, arguments);
}
module.exports = _extends, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/getPrototypeOf.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/getPrototypeOf.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _getPrototypeOf(o);
}
module.exports = _getPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/inherits.js":
/*!*********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/inherits.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var setPrototypeOf = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/setPrototypeOf.js");
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}
module.exports = _inherits, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _iterableToArrayLimit(arr, i) {
  var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
  if (null != _i) {
    var _s,
      _e,
      _x,
      _r,
      _arr = [],
      _n = !0,
      _d = !1;
    try {
      if (_x = (_i = _i.call(arr)).next, 0 === i) {
        if (Object(_i) !== _i) return;
        _n = !1;
      } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
    } catch (err) {
      _d = !0, _e = err;
    } finally {
      try {
        if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return;
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
}
module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/nonIterableRest.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/nonIterableRest.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableRest, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/typeof.js")["default"];
var assertThisInitialized = __webpack_require__(/*! ./assertThisInitialized.js */ "./node_modules/@babel/runtime/helpers/assertThisInitialized.js");
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return assertThisInitialized(self);
}
module.exports = _possibleConstructorReturn, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/setPrototypeOf.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/setPrototypeOf.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _setPrototypeOf(o, p);
}
module.exports = _setPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/slicedToArray.js":
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/slicedToArray.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithHoles = __webpack_require__(/*! ./arrayWithHoles.js */ "./node_modules/@babel/runtime/helpers/arrayWithHoles.js");
var iterableToArrayLimit = __webpack_require__(/*! ./iterableToArrayLimit.js */ "./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js");
var unsupportedIterableToArray = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js");
var nonIterableRest = __webpack_require__(/*! ./nonIterableRest.js */ "./node_modules/@babel/runtime/helpers/nonIterableRest.js");
function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}
module.exports = _slicedToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/toPrimitive.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toPrimitive.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/typeof.js")["default"];
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
module.exports = _toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/toPropertyKey.js":
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toPropertyKey.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/typeof.js")["default"];
var toPrimitive = __webpack_require__(/*! ./toPrimitive.js */ "./node_modules/@babel/runtime/helpers/toPrimitive.js");
function _toPropertyKey(arg) {
  var key = toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
module.exports = _toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/typeof.js":
/*!*******************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/typeof.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(obj) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(obj);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeToArray = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/arrayLikeToArray.js");
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}
module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./node_modules/webpack/buildin/harmony-module.js":
/*!*******************************************!*\
  !*** (webpack)/buildin/harmony-module.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(originalModule) {
	if (!originalModule.webpackPolyfill) {
		var module = Object.create(originalModule);
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		Object.defineProperty(module, "exports", {
			enumerable: true
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ "@wordpress/api-fetch":
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = window["wp"]["apiFetch"]; }());

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = window["wp"]["blockEditor"]; }());

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = window["wp"]["blocks"]; }());

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = window["wp"]["components"]; }());

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = window["wp"]["data"]; }());

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = window["wp"]["i18n"]; }());

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = window["React"]; }());

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() { module.exports = window["ReactDOM"]; }());

/***/ })

/******/ });
//# sourceMappingURL=wptb-block.js.map