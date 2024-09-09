"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
console.log(react_1["default"]);
console.log(react_dom_1["default"]);
function App() {
    // 	debugger
    var _a = react_2.useState(100), num = _a[0], setNum = _a[1];
    //debugger
    //setNum(()=>101)
    //   setTimeout(() => {
    // 	setNum(num+1)
    //   }, 1000);
    var arr = num % 2 === 0
        ? [react_1["default"].createElement("li", { key: "1" }, "1"), react_1["default"].createElement("li", { key: "2" }, "2"), react_1["default"].createElement("li", { key: "3" }, "3")]
        : [react_1["default"].createElement("li", { key: "3" }, "3"), react_1["default"].createElement("li", { key: "2" }, "2"), react_1["default"].createElement("li", { key: "1" }, "1")];
    //       return <ul onClick={() => setNum(num + 1)}>{arr}</ul>;
    // return (
    // 	<div onClick={()=>setNum(num+1)}>
    // 		{num}
    // 	</div>
    // );
    // return(<>
    // <div>11</div>
    // <div>22</div>
    // </>)
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("div", null, "1"),
            react_1["default"].createElement("div", null, "2")),
        arr));
}
// function Child() {
// 	return <span>big-react</span>;
// }
var root = document.querySelector("#root");
react_dom_1["default"].createRoot(root).render(react_1["default"].createElement(App, null));
