"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_dom_1 = require("react-dom");
function App() {
    var _a = react_1.useState(10), num = _a[0], update = _a[1];
    var _b = react_1.useTransition(), isPending = _b[0], startTransition = _b[1];
    function a(num) {
        startTransition(function () {
            update(num);
        });
    }
    return (React.createElement("div", null,
        React.createElement("div", { onClick: function () { return a(5); } }, "\u70B9\u51FB"),
        React.createElement("div", { onClick: function () { return a(10); } }, "\u70B9\u51FB"),
        num === 10 && React.createElement(Child1, null),
        num === 5 && React.createElement(Child2, null)));
}
function Child1() {
    return React.createElement("li", null, "111");
}
function Child2() {
    return React.createElement("li", null, "222");
}
var root = react_dom_1["default"].createRoot(document.querySelector('#root'));
//debugger
root.render(React.createElement(App, null));
