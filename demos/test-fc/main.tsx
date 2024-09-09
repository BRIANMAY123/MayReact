import React from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom'
console.log(React);
console.log(ReactDOM);

function App() {
// 	debugger
  const [num,setNum]=useState(100);
  //debugger
  //setNum(()=>101)
//   setTimeout(() => {
// 	setNum(num+1)
//   }, 1000);
  const arr =
		num % 2 === 0
			? [<li key="1">1</li>, <li key="2">2</li>, <li key="3">3</li>]
			: [<li key="3">3</li>, <li key="2">2</li>, <li key="1">1</li>];

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
	return(
		<div>
			<>
			<div>1</div>
			<div>2</div>
			</>
			{arr}
		</div>
	)
}

// function Child() {
// 	return <span>big-react</span>;
// }
  

const root =document.querySelector("#root")

ReactDOM.createRoot(root).render(<App/>)

