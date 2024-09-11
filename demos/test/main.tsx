

import { useState, useEffect,useTransition } from 'react';
import ReactDOM from 'react-dom';


function App() {
	const [num, update] = useState(10);
	const [isPending, startTransition] = useTransition();
	function a(num){
		startTransition(()=>{
			update(num)
		})
	}
	
	return(<div>
		<div onClick={() => a(5)}>
			点击
		</div>
		<div onClick={() => a(10)}>
			点击
		</div>
		 {num===10&&<Child1/>}
		 {num===5&&<Child2/>}
		 </div>
	)
		

}

function Child1() {
	return <li>111</li>;
}
function Child2() {
	return <li>222</li>;
}

const root = ReactDOM.createRoot(document.querySelector('#root'));
//debugger
root.render(<App />);