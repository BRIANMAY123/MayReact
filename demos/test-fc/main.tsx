import React from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom'
console.log(React);
console.log(ReactDOM);
debugger
function App() {
  const [num]=useState(100)
  
	return (
		<div>
			{num}
		</div>
	);
}

// function Child() {
// 	return <span>big-react</span>;
// }
  

const root =document.querySelector("#root")

ReactDOM.createRoot(root).render(<App/>)
