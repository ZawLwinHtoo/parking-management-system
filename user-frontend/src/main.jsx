import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// import './i  ndex.css'// optional, if you have global styles
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
