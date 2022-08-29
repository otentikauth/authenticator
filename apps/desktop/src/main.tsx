import React from 'react'
import ReactDOM from 'react-dom/client'
import { ToastMessage } from './components/ToastMessage'
import App from './App'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
    <ToastMessage />
  </React.StrictMode>
)
