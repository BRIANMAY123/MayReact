import React from 'react';
import { useState,useEffect } from 'react';
import ReactDOM from 'react-dom'
console.log(React);
console.log(ReactDOM);

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


	const [num, updateNum] = useState(0);
	useEffect(() => {
		console.log('App mount');
	}, []);

	useEffect(() => {
		console.log('num change create', num);
		return () => {
			console.log('num change destroy', num);
		};
	}, [num]);

	return (
		<div onClick={() => updateNum(num + 1)}>
			{num === 0 ? <Child /> : 'noop'}
		</div>
	);
}

// function Child() {
// 	return <span>big-react</span>;
// }
function Child() {
	useEffect(() => {
		console.log('Child mount');
		return () => console.log('Child unmount');
	}, []);

	return 'i am child';
}
  

const root =document.querySelector("#root")

ReactDOM.createRoot(root).render(<App/>)

