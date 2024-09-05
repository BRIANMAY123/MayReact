import React from 'react';
import ReactDOM from 'react-dom'
console.log(React);
console.log(ReactDOM);
const jsx=(
  <div>
  <span>123</span>
  </div>
)
  

const root =document.querySelector("#root")

ReactDOM.createRoot(root).render(jsx)
