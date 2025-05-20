/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./src/context/SocketContext.tsx":
/*!***************************************!*\
  !*** ./src/context/SocketContext.tsx ***!
  \***************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   SocketProvider: () => (/* binding */ SocketProvider),\n/* harmony export */   useSocket: () => (/* binding */ useSocket)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var socket_io_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! socket.io-client */ \"socket.io-client\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([socket_io_client__WEBPACK_IMPORTED_MODULE_2__]);\nsocket_io_client__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\nconst SocketContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)({\n    socket: null,\n    isConnected: false,\n    dashboardData: null\n});\nconst useSocket = ()=>(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(SocketContext);\nconst SocketProvider = ({ children })=>{\n    const [socket, setSocket] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [isConnected, setIsConnected] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const [dashboardData, setDashboardData] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        // Create socket connection with consistent configuration\n        const socketInstance = (0,socket_io_client__WEBPACK_IMPORTED_MODULE_2__.io)({\n            path: \"/socket.io\",\n            transports: [\n                \"websocket\",\n                \"polling\"\n            ],\n            reconnectionAttempts: 5,\n            reconnectionDelay: 1000,\n            autoConnect: true,\n            forceNew: true,\n            timeout: 20000\n        });\n        // Socket event handlers\n        socketInstance.on(\"connect\", ()=>{\n            console.log(\"Socket connected\");\n            setIsConnected(true);\n            socketInstance.emit(\"getTrafficStats\");\n            socketInstance.emit(\"getSystemStats\");\n            socketInstance.emit(\"getActiveConnections\");\n        });\n        socketInstance.on(\"disconnect\", ()=>{\n            console.log(\"Socket disconnected\");\n            setIsConnected(false);\n        });\n        socketInstance.on(\"dashboardData\", (data)=>{\n            setDashboardData(data);\n        });\n        socketInstance.on(\"connect_error\", (err)=>{\n            console.error(\"Socket connection error:\", err);\n            // Attempt to reconnect with polling if WebSocket fails\n            if (socketInstance.io.opts.transports.includes(\"websocket\")) {\n                console.log(\"Falling back to polling transport\");\n                socketInstance.io.opts.transports = [\n                    \"polling\"\n                ];\n            }\n        });\n        setSocket(socketInstance);\n        // Cleanup on unmount\n        return ()=>{\n            if (socketInstance) {\n                socketInstance.disconnect();\n            }\n        };\n    }, []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(SocketContext.Provider, {\n        value: {\n            socket,\n            isConnected,\n            dashboardData\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"/home/project/src/context/SocketContext.tsx\",\n        lineNumber: 73,\n        columnNumber: 5\n    }, undefined);\n};\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29udGV4dC9Tb2NrZXRDb250ZXh0LnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUE4RTtBQUNoQztBQVE5QyxNQUFNTSw4QkFBZ0JMLG9EQUFhQSxDQUFvQjtJQUNyRE0sUUFBUTtJQUNSQyxhQUFhO0lBQ2JDLGVBQWU7QUFDakI7QUFFTyxNQUFNQyxZQUFZLElBQU1SLGlEQUFVQSxDQUFDSSxlQUFlO0FBRWxELE1BQU1LLGlCQUEwRCxDQUFDLEVBQUVDLFFBQVEsRUFBRTtJQUNsRixNQUFNLENBQUNMLFFBQVFNLFVBQVUsR0FBR1QsK0NBQVFBLENBQWdCO0lBQ3BELE1BQU0sQ0FBQ0ksYUFBYU0sZUFBZSxHQUFHViwrQ0FBUUEsQ0FBQztJQUMvQyxNQUFNLENBQUNLLGVBQWVNLGlCQUFpQixHQUFHWCwrQ0FBUUEsQ0FBQztJQUVuREQsZ0RBQVNBLENBQUM7UUFDUix5REFBeUQ7UUFDekQsTUFBTWEsaUJBQWlCWCxvREFBRUEsQ0FBQztZQUN4QlksTUFBTTtZQUNOQyxZQUFZO2dCQUFDO2dCQUFhO2FBQVU7WUFDcENDLHNCQUFzQjtZQUN0QkMsbUJBQW1CO1lBQ25CQyxhQUFhO1lBQ2JDLFVBQVU7WUFDVkMsU0FBUztRQUNYO1FBRUEsd0JBQXdCO1FBQ3hCUCxlQUFlUSxFQUFFLENBQUMsV0FBVztZQUMzQkMsUUFBUUMsR0FBRyxDQUFDO1lBQ1paLGVBQWU7WUFDZkUsZUFBZVcsSUFBSSxDQUFDO1lBQ3BCWCxlQUFlVyxJQUFJLENBQUM7WUFDcEJYLGVBQWVXLElBQUksQ0FBQztRQUN0QjtRQUVBWCxlQUFlUSxFQUFFLENBQUMsY0FBYztZQUM5QkMsUUFBUUMsR0FBRyxDQUFDO1lBQ1paLGVBQWU7UUFDakI7UUFFQUUsZUFBZVEsRUFBRSxDQUFDLGlCQUFpQixDQUFDSTtZQUNsQ2IsaUJBQWlCYTtRQUNuQjtRQUVBWixlQUFlUSxFQUFFLENBQUMsaUJBQWlCLENBQUNLO1lBQ2xDSixRQUFRSyxLQUFLLENBQUMsNEJBQTRCRDtZQUMxQyx1REFBdUQ7WUFDdkQsSUFBSWIsZUFBZVgsRUFBRSxDQUFDMEIsSUFBSSxDQUFDYixVQUFVLENBQUNjLFFBQVEsQ0FBQyxjQUFjO2dCQUMzRFAsUUFBUUMsR0FBRyxDQUFDO2dCQUNaVixlQUFlWCxFQUFFLENBQUMwQixJQUFJLENBQUNiLFVBQVUsR0FBRztvQkFBQztpQkFBVTtZQUNqRDtRQUNGO1FBRUFMLFVBQVVHO1FBRVYscUJBQXFCO1FBQ3JCLE9BQU87WUFDTCxJQUFJQSxnQkFBZ0I7Z0JBQ2xCQSxlQUFlaUIsVUFBVTtZQUMzQjtRQUNGO0lBQ0YsR0FBRyxFQUFFO0lBRUwscUJBQ0UsOERBQUMzQixjQUFjNEIsUUFBUTtRQUFDQyxPQUFPO1lBQUU1QjtZQUFRQztZQUFhQztRQUFjO2tCQUNqRUc7Ozs7OztBQUdQLEVBQUUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9sNC1kZG9zLW1vbml0b3IvLi9zcmMvY29udGV4dC9Tb2NrZXRDb250ZXh0LnRzeD81NzI1Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBjcmVhdGVDb250ZXh0LCB1c2VDb250ZXh0LCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgaW8sIFNvY2tldCB9IGZyb20gJ3NvY2tldC5pby1jbGllbnQnO1xuXG5pbnRlcmZhY2UgU29ja2V0Q29udGV4dFR5cGUge1xuICBzb2NrZXQ6IFNvY2tldCB8IG51bGw7XG4gIGlzQ29ubmVjdGVkOiBib29sZWFuO1xuICBkYXNoYm9hcmREYXRhOiBhbnk7XG59XG5cbmNvbnN0IFNvY2tldENvbnRleHQgPSBjcmVhdGVDb250ZXh0PFNvY2tldENvbnRleHRUeXBlPih7XG4gIHNvY2tldDogbnVsbCxcbiAgaXNDb25uZWN0ZWQ6IGZhbHNlLFxuICBkYXNoYm9hcmREYXRhOiBudWxsLFxufSk7XG5cbmV4cG9ydCBjb25zdCB1c2VTb2NrZXQgPSAoKSA9PiB1c2VDb250ZXh0KFNvY2tldENvbnRleHQpO1xuXG5leHBvcnQgY29uc3QgU29ja2V0UHJvdmlkZXI6IFJlYWN0LkZDPHsgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZSB9PiA9ICh7IGNoaWxkcmVuIH0pID0+IHtcbiAgY29uc3QgW3NvY2tldCwgc2V0U29ja2V0XSA9IHVzZVN0YXRlPFNvY2tldCB8IG51bGw+KG51bGwpO1xuICBjb25zdCBbaXNDb25uZWN0ZWQsIHNldElzQ29ubmVjdGVkXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2Rhc2hib2FyZERhdGEsIHNldERhc2hib2FyZERhdGFdID0gdXNlU3RhdGUobnVsbCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAvLyBDcmVhdGUgc29ja2V0IGNvbm5lY3Rpb24gd2l0aCBjb25zaXN0ZW50IGNvbmZpZ3VyYXRpb25cbiAgICBjb25zdCBzb2NrZXRJbnN0YW5jZSA9IGlvKHtcbiAgICAgIHBhdGg6ICcvc29ja2V0LmlvJyxcbiAgICAgIHRyYW5zcG9ydHM6IFsnd2Vic29ja2V0JywgJ3BvbGxpbmcnXSxcbiAgICAgIHJlY29ubmVjdGlvbkF0dGVtcHRzOiA1LFxuICAgICAgcmVjb25uZWN0aW9uRGVsYXk6IDEwMDAsXG4gICAgICBhdXRvQ29ubmVjdDogdHJ1ZSxcbiAgICAgIGZvcmNlTmV3OiB0cnVlLFxuICAgICAgdGltZW91dDogMjAwMDBcbiAgICB9KTtcblxuICAgIC8vIFNvY2tldCBldmVudCBoYW5kbGVyc1xuICAgIHNvY2tldEluc3RhbmNlLm9uKCdjb25uZWN0JywgKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1NvY2tldCBjb25uZWN0ZWQnKTtcbiAgICAgIHNldElzQ29ubmVjdGVkKHRydWUpO1xuICAgICAgc29ja2V0SW5zdGFuY2UuZW1pdCgnZ2V0VHJhZmZpY1N0YXRzJyk7XG4gICAgICBzb2NrZXRJbnN0YW5jZS5lbWl0KCdnZXRTeXN0ZW1TdGF0cycpO1xuICAgICAgc29ja2V0SW5zdGFuY2UuZW1pdCgnZ2V0QWN0aXZlQ29ubmVjdGlvbnMnKTtcbiAgICB9KTtcblxuICAgIHNvY2tldEluc3RhbmNlLm9uKCdkaXNjb25uZWN0JywgKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1NvY2tldCBkaXNjb25uZWN0ZWQnKTtcbiAgICAgIHNldElzQ29ubmVjdGVkKGZhbHNlKTtcbiAgICB9KTtcblxuICAgIHNvY2tldEluc3RhbmNlLm9uKCdkYXNoYm9hcmREYXRhJywgKGRhdGEpID0+IHtcbiAgICAgIHNldERhc2hib2FyZERhdGEoZGF0YSk7XG4gICAgfSk7XG5cbiAgICBzb2NrZXRJbnN0YW5jZS5vbignY29ubmVjdF9lcnJvcicsIChlcnIpID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1NvY2tldCBjb25uZWN0aW9uIGVycm9yOicsIGVycik7XG4gICAgICAvLyBBdHRlbXB0IHRvIHJlY29ubmVjdCB3aXRoIHBvbGxpbmcgaWYgV2ViU29ja2V0IGZhaWxzXG4gICAgICBpZiAoc29ja2V0SW5zdGFuY2UuaW8ub3B0cy50cmFuc3BvcnRzLmluY2x1ZGVzKCd3ZWJzb2NrZXQnKSkge1xuICAgICAgICBjb25zb2xlLmxvZygnRmFsbGluZyBiYWNrIHRvIHBvbGxpbmcgdHJhbnNwb3J0Jyk7XG4gICAgICAgIHNvY2tldEluc3RhbmNlLmlvLm9wdHMudHJhbnNwb3J0cyA9IFsncG9sbGluZyddO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgc2V0U29ja2V0KHNvY2tldEluc3RhbmNlKTtcblxuICAgIC8vIENsZWFudXAgb24gdW5tb3VudFxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZiAoc29ja2V0SW5zdGFuY2UpIHtcbiAgICAgICAgc29ja2V0SW5zdGFuY2UuZGlzY29ubmVjdCgpO1xuICAgICAgfVxuICAgIH07XG4gIH0sIFtdKTtcblxuICByZXR1cm4gKFxuICAgIDxTb2NrZXRDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt7IHNvY2tldCwgaXNDb25uZWN0ZWQsIGRhc2hib2FyZERhdGEgfX0+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9Tb2NrZXRDb250ZXh0LlByb3ZpZGVyPlxuICApO1xufTsiXSwibmFtZXMiOlsiUmVhY3QiLCJjcmVhdGVDb250ZXh0IiwidXNlQ29udGV4dCIsInVzZUVmZmVjdCIsInVzZVN0YXRlIiwiaW8iLCJTb2NrZXRDb250ZXh0Iiwic29ja2V0IiwiaXNDb25uZWN0ZWQiLCJkYXNoYm9hcmREYXRhIiwidXNlU29ja2V0IiwiU29ja2V0UHJvdmlkZXIiLCJjaGlsZHJlbiIsInNldFNvY2tldCIsInNldElzQ29ubmVjdGVkIiwic2V0RGFzaGJvYXJkRGF0YSIsInNvY2tldEluc3RhbmNlIiwicGF0aCIsInRyYW5zcG9ydHMiLCJyZWNvbm5lY3Rpb25BdHRlbXB0cyIsInJlY29ubmVjdGlvbkRlbGF5IiwiYXV0b0Nvbm5lY3QiLCJmb3JjZU5ldyIsInRpbWVvdXQiLCJvbiIsImNvbnNvbGUiLCJsb2ciLCJlbWl0IiwiZGF0YSIsImVyciIsImVycm9yIiwib3B0cyIsImluY2x1ZGVzIiwiZGlzY29ubmVjdCIsIlByb3ZpZGVyIiwidmFsdWUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/context/SocketContext.tsx\n");

/***/ }),

/***/ "./src/pages/_app.tsx":
/*!****************************!*\
  !*** ./src/pages/_app.tsx ***!
  \****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _context_SocketContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../context/SocketContext */ \"./src/context/SocketContext.tsx\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../styles/globals.css */ \"./src/styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_3__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_context_SocketContext__WEBPACK_IMPORTED_MODULE_2__]);\n_context_SocketContext__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_context_SocketContext__WEBPACK_IMPORTED_MODULE_2__.SocketProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"/home/project/src/pages/_app.tsx\",\n            lineNumber: 9,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/home/project/src/pages/_app.tsx\",\n        lineNumber: 8,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2FwcC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQTBCO0FBRWdDO0FBQzNCO0FBRWhCLFNBQVNFLElBQUksRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQVk7SUFDNUQscUJBQ0UsOERBQUNILGtFQUFjQTtrQkFDYiw0RUFBQ0U7WUFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7OztBQUc5QiIsInNvdXJjZXMiOlsid2VicGFjazovL2w0LWRkb3MtbW9uaXRvci8uL3NyYy9wYWdlcy9fYXBwLnRzeD9mOWQ2Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgdHlwZSB7IEFwcFByb3BzIH0gZnJvbSAnbmV4dC9hcHAnO1xuaW1wb3J0IHsgU29ja2V0UHJvdmlkZXIgfSBmcm9tICcuLi9jb250ZXh0L1NvY2tldENvbnRleHQnO1xuaW1wb3J0ICcuLi9zdHlsZXMvZ2xvYmFscy5jc3MnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9OiBBcHBQcm9wcykge1xuICByZXR1cm4gKFxuICAgIDxTb2NrZXRQcm92aWRlcj5cbiAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cbiAgICA8L1NvY2tldFByb3ZpZGVyPlxuICApO1xufSJdLCJuYW1lcyI6WyJSZWFjdCIsIlNvY2tldFByb3ZpZGVyIiwiQXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/pages/_app.tsx\n");

/***/ }),

/***/ "./src/styles/globals.css":
/*!********************************!*\
  !*** ./src/styles/globals.css ***!
  \********************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "socket.io-client":
/*!***********************************!*\
  !*** external "socket.io-client" ***!
  \***********************************/
/***/ ((module) => {

"use strict";
module.exports = import("socket.io-client");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./src/pages/_app.tsx"));
module.exports = __webpack_exports__;

})();