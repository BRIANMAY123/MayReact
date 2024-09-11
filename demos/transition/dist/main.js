"use strict";
exports.__esModule = true;
var react_dom_1 = require("react-dom");
var react_1 = require("react");
var TabButton_1 = require("./TabButton");
var AboutTab_1 = require("./AboutTab");
var PostsTab_1 = require("./PostsTab");
var ContactTab_1 = require("./ContactTab");
require("./style.css");
function App() {
    var _a = react_1.useTransition(), isPending = _a[0], startTransition = _a[1];
    var _b = react_1.useState('about'), tab = _b[0], setTab = _b[1];
    function selectTab(nextTab) {
        startTransition(function () {
            setTab(nextTab);
        });
    }
    return (React.createElement("div", null,
        React.createElement(TabButton_1["default"], { isActive: tab === 'about', onClick: function () { return selectTab('about'); } }, "\u9996\u9875"),
        React.createElement(TabButton_1["default"], { isActive: tab === 'posts', onClick: function () { selectTab('posts'); } }, "\u535A\u5BA2 (render\u6162)"),
        React.createElement(TabButton_1["default"], { isActive: tab === 'contact', onClick: function () { return setTab('contact'); } }, "\u8054\u7CFB\u6211"),
        React.createElement("hr", null),
        tab === 'about' && React.createElement(AboutTab_1["default"], null),
        tab === 'posts' && React.createElement(PostsTab_1["default"], null),
        tab === 'contact' && React.createElement(ContactTab_1["default"], null)));
}
var root = react_dom_1["default"].createRoot(document.querySelector('#root'));
root.render(React.createElement(App, null));
