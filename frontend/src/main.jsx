import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#24243e',
            color: '#fff',
            border: '1px solid rgba(212,168,67,0.3)',
          },
        }}
      />
      <App />
    </BrowserRouter>
  </StrictMode>,
)
