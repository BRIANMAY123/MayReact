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
    //setNum((num) => num + 1)
    //   setTimeout(() => {
    // 	setNum(num+1)
    //   }, 1000);
    //   const arr =
    // 		num % 2 === 0
    // 			? [<li key="1">1</li>, <li key="2">2</li>, <li key="3">3</li>]
    // 			: [<li key="3">3</li>, <li key="2">2</li>, <li key="1">1</li>];
    //       return <ul onClick={() => setNum(num + 1)}>{arr}</ul>;
    return (react_1["default"].createElement("ul", { onClickCapture: function () {
            setNum(function (num) { return num + 1; });
            setNum(function (num) { return num + 1; });
            setNum(function (num) { return num + 1; });
        } }, num));
    // return(<>
    // <div>11</div>
    // <div>22</div>
    // </>)
    // return(
    // 	<div>
    // 		<>
    // 		<div>1</div>
    // 		<div>2</div>
    // 		</>
    // 		{arr}
    // 	</div>
    // )
}
// function Child() {
// 	return <span>big-react</span>;
// }
var root = document.querySelector("#root");
react_dom_1["default"].createRoot(root).render(react_1["default"].createElement(App, null));
