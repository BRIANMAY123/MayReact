"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
console.log(react_1["default"]);
console.log(react_dom_1["default"]);
function App() {
    // 	debugger
    //   const [num,setNum]=useState(100);
    //   //debugger
    //   //setNum((num) => num + 1)
    // //   setTimeout(() => {
    // // 	setNum(num+1)
    // //   }, 1000);
    // //   const arr =
    // // 		num % 2 === 0
    // // 			? [<li key="1">1</li>, <li key="2">2</li>, <li key="3">3</li>]
    // // 			: [<li key="3">3</li>, <li key="2">2</li>, <li key="1">1</li>];
    // //       return <ul onClick={() => setNum(num + 1)}>{arr}</ul>;
    // return (
    // 	<ul
    // 		onClickCapture={() => {
    // 			setNum((num) => num + 1);
    // 			setNum((num) => num + 1);
    // 			setNum((num) => num + 1);
    // 		}}
    // 	>
    // 		{num}
    // 	</ul>
    // );
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
    var _a = react_2.useState(0), num = _a[0], updateNum = _a[1];
    react_2.useEffect(function () {
        console.log('App mount');
    }, []);
    react_2.useEffect(function () {
        console.log('num change create', num);
        return function () {
            console.log('num change destroy', num);
        };
    }, [num]);
    return (react_1["default"].createElement("div", { onClick: function () { return updateNum(num + 1); } }, num === 0 ? react_1["default"].createElement(Child, null) : 'noop'));
}
// function Child() {
// 	return <span>big-react</span>;
// }
function Child() {
    react_2.useEffect(function () {
        console.log('Child mount');
        return function () { return console.log('Child unmount'); };
    }, []);
    return 'i am child';
}
var root = document.querySelector("#root");
react_dom_1["default"].createRoot(root).render(react_1["default"].createElement(App, null));
