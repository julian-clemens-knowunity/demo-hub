// Polyfill: react-native-web's Animated uses global.cancelAnimationFrame which
// doesn't exist in browsers. Map global to window.
if (typeof window !== 'undefined' && typeof window.global === 'undefined') {
  window.global = window;
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
