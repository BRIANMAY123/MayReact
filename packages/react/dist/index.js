"use strict";
exports.__esModule = true;
exports.isValidElement = exports.createElement = exports.version = exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = exports.useTransition = exports.useEffect = exports.useState = void 0;
var currentBatchConfig_1 = require("./src/currentBatchConfig");
var currentDispatcher_1 = require("./src/currentDispatcher");
var jsx_1 = require("./src/jsx");
exports["default"] = {
    version: '0.0.0',
    createElement: jsx_1.jsxDEV
};
exports.useState = function (initialState) {
    var dispatcher = currentDispatcher_1.resolveDispatcher();
    return dispatcher.useState(initialState);
};
exports.useEffect = function (create, deps) {
    var dispatcher = currentDispatcher_1.resolveDispatcher();
    return dispatcher.useEffect(create, deps);
};
exports.useTransition = function () {
    var dispatcher = currentDispatcher_1.resolveDispatcher();
    return dispatcher.useTransition();
};
// 内部数据共享层
exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
    currentDispatcher: currentDispatcher_1["default"],
    CurrentBatchConfig: currentBatchConfig_1["default"]
};
exports.version = '0.0.0';
// TODO 根据环境区分使用jsx/jsxDEV
exports.createElement = jsx_1.jsx;
exports.isValidElement = jsx_1.isValidElement;
