"use strict";
exports.__esModule = true;
exports.resolveDispatcher = void 0;
var currentDispatcher = {
    current: null
};
exports.resolveDispatcher = function () {
    var dispatcher = currentDispatcher.current;
    if (dispatcher === null) {
        throw new Error('hook只能在函数式组件中执行');
    }
    return dispatcher;
};
exports["default"] = currentDispatcher;
