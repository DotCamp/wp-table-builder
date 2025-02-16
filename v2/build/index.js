/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/builder/index.tsx":
/*!******************************************!*\
  !*** ./src/components/builder/index.tsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wptb_external_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wptb/external/store */ "../../packages/external/store/index.ts");
/* harmony import */ var _wptb_external_react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wptb/external/react-redux */ "../../packages/external/react-redux.ts");
/* harmony import */ var _wptb_external_react_dom_client__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wptb/external/react-dom/client */ "../../packages/external/react-dom/client.ts");
/* harmony import */ var _wptb_external_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wptb/external/react */ "../../packages/external/react.ts");
/* harmony import */ var _wptb_external_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wptb/external/components */ "../../packages/external/components.ts");








const BuilderPage = ({
  id,
  onSave,
  onClose
}) => {
  const elRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!elRef.current) {
      return;
    }
    const root = (0,_wptb_external_react_dom_client__WEBPACK_IMPORTED_MODULE_4__.createRoot)(elRef.current);
    root.render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wptb_external_react__WEBPACK_IMPORTED_MODULE_5__.StrictMode, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wptb_external_react_redux__WEBPACK_IMPORTED_MODULE_3__.Provider, {
      store: _wptb_external_store__WEBPACK_IMPORTED_MODULE_2__["default"]
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wptb_external_components__WEBPACK_IMPORTED_MODULE_6__.BuilderApp, {
      id: id,
      onSave: onSave,
      onClose: onClose,
      isLoaded: true
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wptb_external_components__WEBPACK_IMPORTED_MODULE_6__.Notifications, null))));
    return () => {
      root.unmount();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elRef.current, id, onSave, onClose]);
  return (0,react_dom__WEBPACK_IMPORTED_MODULE_1__.createPortal)((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wptb-builder-modal"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wptb-app-root",
    ref: elRef
  })), document.body);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BuilderPage);

/***/ }),

/***/ "./src/components/picker/index.tsx":
/*!*****************************************!*\
  !*** ./src/components/picker/index.tsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _tables__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../tables */ "./src/components/tables/index.tsx");
/* harmony import */ var _wptb_ui_icons_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wptb/ui/icons/actions */ "../../packages/ui/icons/actions.tsx");
/* harmony import */ var _wptb_external_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wptb/external/utils */ "../../packages/external/utils.ts");






const TableCreator = ({
  setTable
}) => {
  const [rows, setRows] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(4);
  const [cols, setCols] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(4);
  const onCreateNew = () => {
    if (cols < 1 || rows < 1) {
      return;
    }
    const id = (0,_wptb_external_utils__WEBPACK_IMPORTED_MODULE_4__.createNewTable)(rows, cols);
    setTable(id, true);
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Flex, {
    gap: "10px",
    justify: "center",
    align: "end"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
    __nextHasNoMarginBottom: true,
    type: "number",
    label: "Column count",
    value: cols,
    onChange: count => setCols(Number(count)),
    min: "1",
    className: "blocks-table__placeholder-input"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
    __nextHasNoMarginBottom: true,
    type: "number",
    label: "Row count",
    value: rows,
    onChange: count => setRows(Number(count)),
    min: "1",
    className: "blocks-table__placeholder-input"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    className: "blocks-table__placeholder-button",
    variant: "primary",
    onClick: onCreateNew,
    type: "button"
  }, "Create"));
};
const PickerPage = ({
  id,
  setTable
}) => {
  const [activeTab, setActiveTab] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("tables");
  const [search, setSearch] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  const onSelect = id => {
    setTable(id.toString());
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wptb-mini-picker"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wptb-mini-picker-top"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, "WP Table Builder"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wptb-mini-picker-search"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    viewBox: "0 0 48 48"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
    fill: "none",
    stroke: "currentColor",
    strokeLinejoin: "round",
    strokeWidth: "4"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    d: "M21 38c9.389 0 17-7.611 17-17S30.389 4 21 4S4 11.611 4 21s7.611 17 17 17Z"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    strokeLinecap: "round",
    d: "M26.657 14.343A7.98 7.98 0 0 0 21 12a7.98 7.98 0 0 0-5.657 2.343m17.879 18.879l8.485 8.485"
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "search",
    placeholder: "Search...",
    value: search,
    onChange: e => setSearch(e.target.value)
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wptb-mini-picker-tabs"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: activeTab === "tables" ? "active" : "",
    onClick: () => setActiveTab("tables")
  }, "Tables"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: activeTab === "create" ? "active" : "",
    onClick: () => setActiveTab("create")
  }, "Create"), id && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    onClick: () => setTable(id)
  }, _wptb_ui_icons_actions__WEBPACK_IMPORTED_MODULE_3__.TimesIcon))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wptb-mini-picker-content"
  }, activeTab === "tables" ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_tables__WEBPACK_IMPORTED_MODULE_2__["default"], {
    onSelect: onSelect,
    search: search
  }) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(TableCreator, {
    setTable: setTable
  })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PickerPage);

/***/ }),

/***/ "./src/components/table/index.tsx":
/*!****************************************!*\
  !*** ./src/components/table/index.tsx ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wptb_ui_icons_loaders__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wptb/ui/icons/loaders */ "../../packages/ui/icons/loaders.tsx");
/* harmony import */ var _wptb_external_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wptb/external/store */ "../../packages/external/store/index.ts");
/* harmony import */ var _wptb_external_store_table__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wptb/external/store/table */ "../../packages/external/store/table.ts");
/* harmony import */ var _wptb_external_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wptb/external/utils */ "../../packages/external/utils.ts");
/* harmony import */ var _wptb_external_react_dom_client__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wptb/external/react-dom/client */ "../../packages/external/react-dom/client.ts");
/* harmony import */ var _wptb_external_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wptb/external/react */ "../../packages/external/react.ts");
/* harmony import */ var _wptb_external_react_redux__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wptb/external/react-redux */ "../../packages/external/react-redux.ts");
/* harmony import */ var _wptb_external_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wptb/external/components */ "../../packages/external/components.ts");










const TablePage = ({
  id,
  shouldLoad,
  setShouldLoad
}) => {
  const elRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!shouldLoad) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const abortCtrl = new AbortController();
    const url = WPTB_CFG.API_BASE + "/v1/table?id=" + id;
    fetch(url, {
      signal: abortCtrl.signal
    }).then(response => response.json()).then(data => {
      const table = (0,_wptb_external_utils__WEBPACK_IMPORTED_MODULE_4__.parseTable)(data.table);
      table.title = data.name;
      table.id = id;
      _wptb_external_store__WEBPACK_IMPORTED_MODULE_2__["default"].dispatch((0,_wptb_external_store_table__WEBPACK_IMPORTED_MODULE_3__.setTable)({
        id,
        table
      }));
      setIsLoading(false);
      setShouldLoad(false);
    }).catch(_ => undefined);
    return () => {
      abortCtrl.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!elRef.current || isLoading) {
      return;
    }
    const root = (0,_wptb_external_react_dom_client__WEBPACK_IMPORTED_MODULE_5__.createRoot)(elRef.current);
    root.render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wptb_external_react__WEBPACK_IMPORTED_MODULE_6__.StrictMode, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wptb_external_react_redux__WEBPACK_IMPORTED_MODULE_7__.Provider, {
      store: _wptb_external_store__WEBPACK_IMPORTED_MODULE_2__["default"]
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wptb_external_components__WEBPACK_IMPORTED_MODULE_8__.Table, {
      id: id
    }))));
    return () => {
      root.unmount();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elRef.current, isLoading, id]);
  return isLoading ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wptb-table-loading-icon"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wptb_ui_icons_loaders__WEBPACK_IMPORTED_MODULE_1__.DownloadingLoopIcon, null)) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wptb-root-app",
    ref: elRef
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TablePage);

/***/ }),

/***/ "./src/components/tables/index.tsx":
/*!*****************************************!*\
  !*** ./src/components/tables/index.tsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wptb_utils_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wptb/utils/react */ "../../packages/utils/react.tsx");
/* harmony import */ var _packages_ui_components_pagination__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../packages/ui/components/pagination */ "../../packages/ui/components/pagination/index.tsx");
/* harmony import */ var _packages_ui_components_table_list__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../packages/ui/components/table-list */ "../../packages/ui/components/table-list/index.tsx");



/**
 * Do not install @wptb/components
 * or change the imports to "@wptb/external/components"
 * They have to be relative path because
 * gutenberg & WPTB uses two different instances of react
 *
 * aliasing is an option but it has only one use case rn
 */


const Tables = ({
  search,
  onSelect
}) => {
  const abortCtrl = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const [page, setPage] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(1);
  const sorting = (0,_wptb_utils_react__WEBPACK_IMPORTED_MODULE_1__.useSorting)("modified", "desc");
  const tOutRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const [searchTxt, setSearch] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(search);
  const [apiData] = (0,_wptb_utils_react__WEBPACK_IMPORTED_MODULE_1__.useTablePage)({
    page,
    search: searchTxt,
    sort: sorting[0],
    abortCtrl: abortCtrl.current
  });
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const newSearch = search?.trim();
    if (!searchTxt) {
      if (!newSearch || newSearch.length < 2) {
        return;
      }
    } else if (newSearch && newSearch.length > 0 && newSearch.length < 2) {
      return;
    }
    if (tOutRef.current) {
      clearTimeout(tOutRef.current);
    }
    if (abortCtrl.current) {
      abortCtrl.current.abort();
    }
    abortCtrl.current = new AbortController();
    tOutRef.current = setTimeout(() => {
      setSearch(newSearch);
      abortCtrl.current = undefined;
      tOutRef.current = undefined;
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "wptb-pagination-info"
  }, "Showing ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("b", null, apiData.page_start), " to ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("b", null, apiData.page_end), " of", " ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("b", null, apiData.total_count), " entries"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_packages_ui_components_table_list__WEBPACK_IMPORTED_MODULE_3__["default"], {
    isLoading: apiData.loading,
    items: apiData.posts,
    onSelect: t => onSelect(t.id),
    sorting: sorting,
    columns: ["id", "title", "modified"]
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_packages_ui_components_pagination__WEBPACK_IMPORTED_MODULE_2__["default"], {
    apiData: apiData,
    setPage: setPage
  }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Tables);

/***/ }),

/***/ "../../packages/external/components.ts":
/*!*********************************************!*\
  !*** ../../packages/external/components.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AlignmentControl: () => (/* binding */ AlignmentControl),
/* harmony export */   BorderControl: () => (/* binding */ BorderControl),
/* harmony export */   BorderRadiusControl: () => (/* binding */ BorderRadiusControl),
/* harmony export */   BuilderApp: () => (/* binding */ BuilderApp),
/* harmony export */   ChoiceGroup: () => (/* binding */ ChoiceGroup),
/* harmony export */   ColorControl: () => (/* binding */ ColorControl),
/* harmony export */   EnhancedControl: () => (/* binding */ EnhancedControl),
/* harmony export */   IconPicker: () => (/* binding */ IconPicker),
/* harmony export */   ImagePicker: () => (/* binding */ ImagePicker),
/* harmony export */   LongTextControl: () => (/* binding */ LongTextControl),
/* harmony export */   Modal: () => (/* binding */ Modal),
/* harmony export */   NetIcon: () => (/* binding */ NetIcon),
/* harmony export */   Notifications: () => (/* binding */ Notifications),
/* harmony export */   PanelBody: () => (/* binding */ PanelBody),
/* harmony export */   RadioGroup: () => (/* binding */ RadioGroup),
/* harmony export */   RangeControl: () => (/* binding */ RangeControl),
/* harmony export */   RichText: () => (/* binding */ RichText),
/* harmony export */   SelectControl: () => (/* binding */ SelectControl),
/* harmony export */   SizeControl: () => (/* binding */ SizeControl),
/* harmony export */   SizeXYControl: () => (/* binding */ SizeXYControl),
/* harmony export */   SpacingControl: () => (/* binding */ SpacingControl),
/* harmony export */   SwitchControl: () => (/* binding */ SwitchControl),
/* harmony export */   Tab: () => (/* binding */ Tab),
/* harmony export */   Table: () => (/* binding */ Table),
/* harmony export */   TextControl: () => (/* binding */ TextControl),
/* harmony export */   ToolbarBtn: () => (/* binding */ ToolbarBtn),
/* harmony export */   UnitControl: () => (/* binding */ UnitControl)
/* harmony export */ });
const {
  AlignmentControl,
  BorderControl,
  BorderRadiusControl,
  ChoiceGroup,
  ColorControl,
  IconPicker,
  ImagePicker,
  LongTextControl,
  Modal,
  NetIcon,
  PanelBody,
  RadioGroup,
  RangeControl,
  SelectControl,
  SizeControl,
  SizeXYControl,
  SpacingControl,
  SwitchControl,
  Tab,
  TextControl,
  UnitControl,
  RichText
} = WPTB.modules.components;
const {
  EnhancedControl,
  Notifications,
  BuilderApp,
  Table,
  ToolbarBtn
} = WPTB.components;

/***/ }),

/***/ "../../packages/external/react-dom/client.ts":
/*!***************************************************!*\
  !*** ../../packages/external/react-dom/client.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createRoot: () => (/* binding */ createRoot)
/* harmony export */ });
const {
  createRoot
} = WPTB.modules.ReactDOMClient;

/***/ }),

/***/ "../../packages/external/react-redux.ts":
/*!**********************************************!*\
  !*** ../../packages/external/react-redux.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Provider: () => (/* binding */ Provider),
/* harmony export */   useDispatch: () => (/* binding */ useDispatch),
/* harmony export */   useSelector: () => (/* binding */ useSelector)
/* harmony export */ });
const {
  useDispatch,
  useSelector,
  Provider
} = WPTB.modules.ReactRedux;

/***/ }),

/***/ "../../packages/external/react.ts":
/*!****************************************!*\
  !*** ../../packages/external/react.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StrictMode: () => (/* binding */ StrictMode),
/* harmony export */   createElement: () => (/* binding */ createElement),
/* harmony export */   useCallback: () => (/* binding */ useCallback),
/* harmony export */   useEffect: () => (/* binding */ useEffect),
/* harmony export */   useLayoutEffect: () => (/* binding */ useLayoutEffect),
/* harmony export */   useMemo: () => (/* binding */ useMemo),
/* harmony export */   useRef: () => (/* binding */ useRef),
/* harmony export */   useState: () => (/* binding */ useState)
/* harmony export */ });
const {
  createElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  StrictMode
} = WPTB.modules.React;

/***/ }),

/***/ "../../packages/external/store/index.ts":
/*!**********************************************!*\
  !*** ../../packages/external/store/index.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const store = WPTB.store.store;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (store);

/***/ }),

/***/ "../../packages/external/store/table.ts":
/*!**********************************************!*\
  !*** ../../packages/external/store/table.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   changeId: () => (/* binding */ changeId),
/* harmony export */   customReducer: () => (/* binding */ customReducer),
/* harmony export */   setTable: () => (/* binding */ setTable),
/* harmony export */   setTableInfo: () => (/* binding */ setTableInfo)
/* harmony export */ });
const {
  setTable,
  changeId,
  setTableInfo,
  customReducer
} = WPTB.store.table;

/***/ }),

/***/ "../../packages/external/utils.ts":
/*!****************************************!*\
  !*** ../../packages/external/utils.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TimeTravel: () => (/* binding */ TimeTravel),
/* harmony export */   cloneBlock: () => (/* binding */ cloneBlock),
/* harmony export */   createNewTable: () => (/* binding */ createNewTable),
/* harmony export */   insertInnerBlock: () => (/* binding */ insertInnerBlock),
/* harmony export */   notify: () => (/* binding */ notify),
/* harmony export */   parseTable: () => (/* binding */ parseTable),
/* harmony export */   removeBlock: () => (/* binding */ removeBlock),
/* harmony export */   updateNotification: () => (/* binding */ updateNotification)
/* harmony export */ });
const {
  notify,
  updateNotification,
  parseTable,
  createNewTable,
  cloneBlock,
  insertInnerBlock,
  removeBlock,
  TimeTravel
} = WPTB.utils;

/***/ }),

/***/ "../../packages/ui/components/pagination/index.tsx":
/*!*********************************************************!*\
  !*** ../../packages/ui/components/pagination/index.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "../../node_modules/.pnpm/classnames@2.5.1/node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);


const Pagination = ({
  apiData,
  setPage
}) => {
  const paginate = page => {
    if (!apiData || page < 1 || page > apiData.total_pages || page === apiData.current_page) {
      return;
    }
    setPage(page);
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wptb-pagination"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "wptb-pagination-group"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()({
      "wptb-pagination-disabled": apiData.current_page === 1
    }),
    onClick: () => paginate(apiData.current_page - 1)
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    d: "m15 6l-6 6l6 6"
  }))), apiData.pages.map(page => page !== 0 ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    key: page,
    type: "button",
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()({
      "wptb-pagination-active": page === apiData.current_page
    }),
    onClick: () => paginate(page)
  }, page) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "wptb-page-divider"
  }, "...")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()({
      "wptb-pagination-disabled": apiData.current_page === apiData.total_pages
    }),
    onClick: () => paginate(apiData.current_page + 1)
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    d: "m9 6l6 6l-6 6"
  })))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Pagination);

/***/ }),

/***/ "../../packages/ui/components/table-list/index.tsx":
/*!*********************************************************!*\
  !*** ../../packages/ui/components/table-list/index.tsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "../../node_modules/.pnpm/classnames@2.5.1/node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);


const columnConfig = {
  id: {
    label: "ID",
    width: "80px"
  },
  title: {
    label: "Title"
  },
  date: {
    label: "Created"
  },
  modified: {
    label: "Last Modified"
  }
};
const TableList = ({
  onSelect,
  sorting: [sort, sortBy],
  isLoading,
  items,
  columns = Object.keys(columnConfig),
  checkbox,
  checked,
  onAllCheck,
  noItemsMessage = "No tables found"
}) => {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("table", {
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()("wptb-v2-table-list", {
      "wptb-table-loading": isLoading
    })
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("colgroup", null, checkbox && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("col", {
    style: {
      width: "40px"
    }
  }), columns.map(column => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("col", {
    key: column,
    style: {
      width: columnConfig[column].width
    }
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("thead", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, checkbox && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "checkbox",
    checked: !!checked,
    onChange: e => onAllCheck?.(e.currentTarget.checked)
  })), columns.map(column => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("th", {
    key: column,
    onClick: () => sortBy(column)
  }, columnConfig[column].label, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()("wptb-table-sort-btn", {
      "wptb-sort-btn-asc": sort.by === column && sort.order === "asc",
      "wptb-sort-btn-desc": sort.by === column && sort.order !== "asc"
    })
  }))))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tbody", null, isLoading ? Array(5).fill(0).map((_, i) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", {
    key: i
  }, checkbox && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null), columns.map(column => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
    key: column
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    "data-column": column
  }))))) : !items.length ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
    colSpan: columns.length + (checkbox ? 1 : 0)
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, noItemsMessage))) : items.map(post => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", {
    onClick: () => onSelect(post),
    key: post.id
  }, checkbox && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "checkbox",
    defaultChecked: checked
  })), columns.map(column => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
    key: column
  }, post[column] || "-"))))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TableList);

/***/ }),

/***/ "../../packages/ui/icons/actions.tsx":
/*!*******************************************!*\
  !*** ../../packages/ui/icons/actions.tsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CopyIcon: () => (/* binding */ CopyIcon),
/* harmony export */   ResetIcon: () => (/* binding */ ResetIcon),
/* harmony export */   RestoreIcon: () => (/* binding */ RestoreIcon),
/* harmony export */   SearchIcon: () => (/* binding */ SearchIcon),
/* harmony export */   SplitIcon: () => (/* binding */ SplitIcon),
/* harmony export */   SwitchIcon: () => (/* binding */ SwitchIcon),
/* harmony export */   TimesIcon: () => (/* binding */ TimesIcon),
/* harmony export */   TrashIcon: () => (/* binding */ TrashIcon),
/* harmony export */   UnSplitIcon: () => (/* binding */ UnSplitIcon)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const TrashIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "1em",
  height: "1em",
  viewBox: "0 0 26 26"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
  fill: "none"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("defs", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("mask", {
  id: "pepiconsPopTrashCircleFilled0"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "#fff",
  d: "M0 0h26v26H0z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
  fill: "#000"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M14.937 7.5h-3.874A2.003 2.003 0 0 1 13 5a2.003 2.003 0 0 1 1.937 2.5"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M7.5 8.5a1 1 0 0 1 0-2h11a1 1 0 1 1 0 2z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fillRule: "evenodd",
  d: "M17.5 21.5a1 1 0 0 0 1-1V10a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1v10.5a1 1 0 0 0 1 1zm-2-10a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zM13 11a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 1 0v-7a.5.5 0 0 0-.5-.5m-3.5.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0z",
  clipRule: "evenodd"
})))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
  cx: "13",
  cy: "13",
  r: "13",
  fill: "currentColor",
  mask: "url(#pepiconsPopTrashCircleFilled0)"
})));
const RestoreIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "currentColor",
  d: "M13 3a9 9 0 0 0-9 9H1l4 3.99L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7s-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.95 8.95 0 0 0 13 21a9 9 0 0 0 0-18m-1 5v5l4.25 2.52l.77-1.28l-3.52-2.09V8z"
}));
const ResetIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "1em",
  height: "1em",
  viewBox: "0 0 20 20"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "currentColor",
  d: "M6.03 2.47a.75.75 0 0 1 0 1.06L4.81 4.75H11A6.25 6.25 0 1 1 4.75 11a.75.75 0 0 1 1.5 0A4.75 4.75 0 1 0 11 6.25H4.81l1.22 1.22a.75.75 0 0 1-1.06 1.06l-2.5-2.5a.75.75 0 0 1 0-1.06l2.5-2.5a.75.75 0 0 1 1.06 0"
}));
const SplitIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "2 2 20 20",
  focusable: "false"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M17.031 4.703 15.576 4l-1.56 3H14v.03l-2.324 4.47H9.5V13h1.396l-1.502 2.889h-.95a3.694 3.694 0 0 1 0-7.389H10V7H8.444a5.194 5.194 0 1 0 0 10.389h.17L7.5 19.53l1.416.719L15.049 8.5h.507a3.694 3.694 0 0 1 0 7.39H14v1.5h1.556a5.194 5.194 0 0 0 .273-10.383l1.202-2.304Z"
}));
const UnSplitIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "2 2 20 20",
  focusable: "false"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M10 17.389H8.444A5.194 5.194 0 1 1 8.444 7H10v1.5H8.444a3.694 3.694 0 0 0 0 7.389H10v1.5ZM14 7h1.556a5.194 5.194 0 0 1 0 10.39H14v-1.5h1.556a3.694 3.694 0 0 0 0-7.39H14V7Zm-4.5 6h5v-1.5h-5V13Z"
}));
const TimesIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: "2",
  d: "M17 7L7 17M7 7l10 10"
}));
const CopyIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  height: "1em",
  width: "1em"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "currentColor",
  d: "M4 5.4C4 4.622 4.622 4 5.4 4h7.2c.778 0 1.4.622 1.4 1.4V6a1 1 0 1 0 2 0v-.6C16 3.518 14.482 2 12.6 2H5.4A3.394 3.394 0 0 0 2 5.4v7.2C2 14.482 3.518 16 5.4 16H6a1 1 0 1 0 0-2h-.6c-.778 0-1.4-.622-1.4-1.4z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "currentColor",
  d: "M9 11.4A2.4 2.4 0 0 1 11.4 9h7.2a2.4 2.4 0 0 1 2.4 2.4v7.2a2.4 2.4 0 0 1-2.4 2.4h-7.2A2.4 2.4 0 0 1 9 18.6z"
}));
const SearchIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "1em",
  height: "1em",
  viewBox: "0 0 48 48"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
  fill: "none",
  stroke: "currentColor",
  strokeLinejoin: "round",
  strokeWidth: "4"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M21 38c9.389 0 17-7.611 17-17S30.389 4 21 4S4 11.611 4 21s7.611 17 17 17Z"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  strokeLinecap: "round",
  d: "M26.657 14.343A7.98 7.98 0 0 0 21 12a7.98 7.98 0 0 0-5.657 2.343m17.879 18.879l8.485 8.485"
})));
const SwitchIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: "2"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "M3 17h2.397a5 5 0 0 0 4.096-2.133l.177-.253m3.66-5.227l.177-.254A5 5 0 0 1 17.603 7H21"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "m18 4l3 3l-3 3M3 7h2.397a5 5 0 0 1 4.096 2.133l4.014 5.734A5 5 0 0 0 17.603 17H21"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  d: "m18 20l3-3l-3-3"
})));

/***/ }),

/***/ "../../packages/ui/icons/loaders.tsx":
/*!*******************************************!*\
  !*** ../../packages/ui/icons/loaders.tsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DownloadingLoopIcon: () => (/* binding */ DownloadingLoopIcon),
/* harmony export */   EllipsisLoadingIcon: () => (/* binding */ EllipsisLoadingIcon),
/* harmony export */   LoadingSpinnerIcon: () => (/* binding */ LoadingSpinnerIcon),
/* harmony export */   UploadingLoopIcon: () => (/* binding */ UploadingLoopIcon)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const DownloadingLoopIcon = props => {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    ...props
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    strokeDasharray: "2 4",
    strokeDashoffset: 6,
    d: "M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("animate", {
    attributeName: "stroke-dashoffset",
    dur: "0.6s",
    repeatCount: "indefinite",
    values: "6;0"
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    strokeDasharray: 32,
    strokeDashoffset: 32,
    d: "M12 21c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("animate", {
    fill: "freeze",
    attributeName: "stroke-dashoffset",
    begin: "0.1s",
    dur: "0.4s",
    values: "32;0"
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    strokeDasharray: 10,
    strokeDashoffset: 10,
    d: "M12 8v7.5"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("animate", {
    fill: "freeze",
    attributeName: "stroke-dashoffset",
    begin: "0.5s",
    dur: "0.2s",
    values: "10;0"
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    strokeDasharray: 6,
    strokeDashoffset: 6,
    d: "M12 15.5l3.5 -3.5M12 15.5l-3.5 -3.5"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("animate", {
    fill: "freeze",
    attributeName: "stroke-dashoffset",
    begin: "0.7s",
    dur: "0.2s",
    values: "6;0"
  }))));
};
const UploadingLoopIcon = props => {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    ...props
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("g", {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    strokeDasharray: "2 4",
    strokeDashoffset: "6",
    d: "M12 21c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("animate", {
    attributeName: "stroke-dashoffset",
    dur: "0.6s",
    repeatCount: "indefinite",
    values: "6;0"
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    strokeDasharray: "32",
    strokeDashoffset: "32",
    d: "M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("animate", {
    fill: "freeze",
    attributeName: "stroke-dashoffset",
    begin: "0.1s",
    dur: "0.4s",
    values: "32;0"
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    strokeDasharray: "10",
    strokeDashoffset: "10",
    d: "M12 16v-7.5"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("animate", {
    fill: "freeze",
    attributeName: "stroke-dashoffset",
    begin: "0.5s",
    dur: "0.2s",
    values: "10;0"
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
    strokeDasharray: "6",
    strokeDashoffset: "6",
    d: "M12 8.5l3.5 3.5M12 8.5l-3.5 3.5"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("animate", {
    fill: "freeze",
    attributeName: "stroke-dashoffset",
    begin: "0.7s",
    dur: "0.2s",
    values: "6;0"
  }))));
};
const EllipsisLoadingIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
  cx: "18",
  cy: "12",
  r: "0",
  fill: "currentColor"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("animate", {
  attributeName: "r",
  begin: ".67",
  calcMode: "spline",
  dur: "1.5s",
  keySplines: "0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8",
  repeatCount: "indefinite",
  values: "0;2;0;0"
})), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
  cx: "12",
  cy: "12",
  r: "0",
  fill: "currentColor"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("animate", {
  attributeName: "r",
  begin: ".33",
  calcMode: "spline",
  dur: "1.5s",
  keySplines: "0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8",
  repeatCount: "indefinite",
  values: "0;2;0;0"
})), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("circle", {
  cx: "6",
  cy: "12",
  r: "0",
  fill: "currentColor"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("animate", {
  attributeName: "r",
  begin: "0",
  calcMode: "spline",
  dur: "1.5s",
  keySplines: "0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8",
  repeatCount: "indefinite",
  values: "0;2;0;0"
})));
const LoadingSpinnerIcon = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "currentColor",
  d: "M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z",
  opacity: "0.5"
}), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
  fill: "currentColor",
  d: "M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("animateTransform", {
  attributeName: "transform",
  dur: "1s",
  from: "0 12 12",
  repeatCount: "indefinite",
  to: "360 12 12",
  type: "rotate"
})));

/***/ }),

/***/ "../../packages/utils/check.ts":
/*!*************************************!*\
  !*** ../../packages/utils/check.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isNumeric: () => (/* binding */ isNumeric)
/* harmony export */ });
const isNumeric = value => {
  return typeof value === "number" || parseInt(value).toString() === value;
};

/***/ }),

/***/ "../../packages/utils/react.tsx":
/*!**************************************!*\
  !*** ../../packages/utils/react.tsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useSorting: () => (/* binding */ useSorting),
/* harmony export */   useTablePage: () => (/* binding */ useTablePage)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui */ "../../packages/utils/ui.ts");


const useSorting = (by, order = "asc") => {
  const [sorting, setSorting] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    by,
    order
  });
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => [sorting, by => {
    let order = "asc";
    if (sorting.by === by) {
      order = sorting.order === "asc" ? "desc" : "asc";
    }
    setSorting({
      by,
      order
    });
  }], [sorting]);
};
const defaultPage = {
  loading: true,
  posts: [],
  current_page: 1,
  page_start: "...",
  page_end: "...",
  total_count: "...",
  pages: [],
  total_pages: 1
};
const useTablePage = ({
  page,
  search,
  status,
  skipTables,
  sort,
  abortCtrl,
  refetchOnSkipChange
}) => {
  const [apiData, setApiData] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(defaultPage);
  const [re, setRe] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const setPageTables = (tables, doSort) => {
    if (doSort) {
      let sortField;
      if (!["id", "title", "date", "modified"].includes(sort.by || "id")) {
        sortField = "id";
      } else {
        sortField = sort.by;
      }
      if (sortField !== "id") {
        if (sort.order === "asc") {
          tables.sort((a, b) => {
            return a[sortField].localeCompare(b[sortField]);
          });
        } else {
          tables.sort((a, b) => {
            return b[sortField].localeCompare(a[sortField]);
          });
        }
      } else {
        if (sort.order === "asc") {
          tables.sort((a, b) => {
            return a[sortField] - b[sortField];
          });
        } else {
          tables.sort((a, b) => {
            return b[sortField] - a[sortField];
          });
        }
      }
    }
    setApiData({
      ...apiData,
      posts: tables
    });
  };
  const refetchForSkipChange = refetchOnSkipChange ? skipTables : "";
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      search: search ? search : "",
      status: status ? status : "",
      except: skipTables ? skipTables : "",
      ...(sort ? {
        sort_by: sort.by,
        sort_order: sort.order
      } : {})
    });
    const url = WPTB_CFG.API_BASE + "/v1/tables?" + params.toString();
    setApiData(apiData => ({
      ...apiData,
      current_page: page,
      loading: true
    }));
    fetch(url, {
      signal: abortCtrl?.signal
    }).then(response => response.json()).then(data => {
      const {
        posts,
        current_page,
        total_pages,
        total_count
      } = data;
      const pageStart = (current_page - 1) * data.per_page + 1;
      const pageEnd = pageStart + posts.length - 1;
      setApiData({
        loading: false,
        posts,
        current_page,
        page_start: pageStart,
        page_end: pageEnd,
        pages: (0,_ui__WEBPACK_IMPORTED_MODULE_1__.getPages)(total_pages, 2),
        total_pages,
        total_count
      });
    }).catch(() => {
      setApiData({
        ...apiData,
        loading: false
      });
      WPTB.utils.notify("Something went wrong! Please reload the page!", "error", 0);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, status, sort.by, sort.order, refetchForSkipChange, re]);
  return [apiData, setPageTables, () => setRe(!re)];
};

/***/ }),

/***/ "../../packages/utils/ui.ts":
/*!**********************************!*\
  !*** ../../packages/utils/ui.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   copyToClipboard: () => (/* binding */ copyToClipboard),
/* harmony export */   getPages: () => (/* binding */ getPages)
/* harmony export */ });
const getPages = (totalPages, perSection = 2) => {
  const pages = [];
  if (totalPages <= perSection * 3 + 2) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
  for (let i = 1; i <= perSection; i++) {
    pages.push(i);
  }
  const lim1 = Math.ceil(totalPages / 2 - perSection / 2);
  if (pages.at(-1) < lim1 - 1) {
    pages.push(0);
  }
  for (let i = 0; i < perSection; i++) {
    pages.push(lim1 + i);
  }
  pages.push(0);
  for (let i = 1; i <= perSection; i++) {
    pages.push(totalPages - perSection + i);
  }
  return pages;
};
const copyToClipboard = text => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
    return;
  }
  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = text;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand("copy");
  document.body.removeChild(tempTextArea);
};

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = window["React"];

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = window["ReactDOM"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["components"];

/***/ }),

/***/ "../../node_modules/.pnpm/classnames@2.5.1/node_modules/classnames/index.js":
/*!**********************************************************************************!*\
  !*** ../../node_modules/.pnpm/classnames@2.5.1/node_modules/classnames/index.js ***!
  \**********************************************************************************/
/***/ ((module, exports) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (arg) {
				classes = appendClass(classes, parseValue(arg));
			}
		}

		return classes;
	}

	function parseValue (arg) {
		if (typeof arg === 'string' || typeof arg === 'number') {
			return arg;
		}

		if (typeof arg !== 'object') {
			return '';
		}

		if (Array.isArray(arg)) {
			return classNames.apply(null, arg);
		}

		if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
			return arg.toString();
		}

		var classes = '';

		for (var key in arg) {
			if (hasOwn.call(arg, key) && arg[key]) {
				classes = appendClass(classes, key);
			}
		}

		return classes;
	}

	function appendClass (value, newClass) {
		if (!newClass) {
			return value;
		}
	
		if (value) {
			return value + ' ' + newClass;
		}
	
		return value + newClass;
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ }),

/***/ "./src/block.json":
/*!************************!*\
  !*** ./src/block.json ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"version":"2.0.0","name":"wptb/table-block","title":"WP Table Builder","category":"design","description":"WP Table Builder - Drag and Drop Responsive Table Builder Plugin for WordPress","keywords":["table","wp-table-builder","wptb","cell","row","column"],"allowedBlocks":[],"attributes":{"id":{"type":["string","number"],"default":""}},"textdomain":"wp-table-builder","editorStyle":["wptb-v2-frontend-style","wptb-v2-editor-style","wptb-v2-gutenberg-style","wptb-v2-pro-style"]}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***********************!*\
  !*** ./src/index.tsx ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./block.json */ "./src/block.json");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_builder__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/builder */ "./src/components/builder/index.tsx");
/* harmony import */ var _components_table__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/table */ "./src/components/table/index.tsx");
/* harmony import */ var _components_picker__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/picker */ "./src/components/picker/index.tsx");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _wptb_utils_check__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wptb/utils/check */ "../../packages/utils/check.ts");
/* harmony import */ var _wptb_external_store__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wptb/external/store */ "../../packages/external/store/index.ts");
/* harmony import */ var _wptb_external_store_table__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @wptb/external/store/table */ "../../packages/external/store/table.ts");












const Edit = ({
  attributes,
  setAttributes
}) => {
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps)({
    className: "wptb-gutenberg"
  });
  const [shouldLoad, setShouldLoad] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)((0,_wptb_utils_check__WEBPACK_IMPORTED_MODULE_8__.isNumeric)(attributes.id));
  const [builder, setBuilder] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [tblId, setTblId] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(attributes.id);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setTblId(attributes.id);
  }, [attributes.id]);
  const setTable = (id, isNew) => {
    if (id === attributes.id) {
      setTblId(id);
      return;
    }
    if (isNew) {
      setBuilder(true);
      setTblId(id);
      setShouldLoad(false);
    } else {
      setShouldLoad(true);
      setAttributes({
        id
      });
    }
  };
  const onSave = ([action, id]) => {
    if (action === "saved") {
      _wptb_external_store__WEBPACK_IMPORTED_MODULE_9__["default"].dispatch((0,_wptb_external_store_table__WEBPACK_IMPORTED_MODULE_10__.changeId)({
        oldId: tblId,
        newId: id.toString()
      }));
      setTblId(id.toString());
      setAttributes({
        id: id.toString()
      });
    }
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...blockProps
  }, tblId ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_table__WEBPACK_IMPORTED_MODULE_5__["default"], {
    id: tblId,
    shouldLoad: shouldLoad,
    setShouldLoad: setShouldLoad
  }) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_picker__WEBPACK_IMPORTED_MODULE_6__["default"], {
    setTable: setTable,
    id: attributes.id
  }), builder && tblId && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_builder__WEBPACK_IMPORTED_MODULE_4__["default"], {
    onClose: () => setBuilder(false),
    onSave: onSave,
    id: tblId
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InspectorControls, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.PanelBody, {
    title: "WP Table Builder",
    initialOpen: true
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.Button, {
    variant: "secondary",
    onClick: () => setTblId(""),
    icon: "remove",
    className: "wptb-show-picker-btn"
  }, "Change Table"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.Button, {
    variant: "primary",
    onClick: () => setBuilder(true),
    icon: "share-alt2",
    className: "wptb-open-editor-btn"
  }, "Open in Editor"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.BlockControls, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.ToolbarButton, {
    icon: "share-alt2",
    label: "Open in Editor",
    onClick: () => setBuilder(true),
    onPointerEnterCapture: null,
    onPointerLeaveCapture: null,
    placeholder: "Open in Editor"
  })));
};
const save = () => {
  return null;
};

// @ts-expect-error typical gutenberg
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_2__.name, {
  title: _block_json__WEBPACK_IMPORTED_MODULE_2__.title,
  category: _block_json__WEBPACK_IMPORTED_MODULE_2__.category,
  attributes: _block_json__WEBPACK_IMPORTED_MODULE_2__.attributes,
  edit: Edit,
  save,
  transforms: {
    from: [{
      type: "shortcode",
      tag: "wptb",
      attributes: {
        id: {
          type: "number",
          shortcode: ({
            named
          }) => {
            return parseInt(named.id, 10);
          }
        }
      },
      priority: 1
    }]
  }
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map