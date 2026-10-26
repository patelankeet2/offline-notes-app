import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Show the React app inside the #root div in index.html
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register the service worker so the app can work offline.
// Only done in the production build (npm run build + npm run preview),
// because the dev server changes files all the time.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service worker registered with scope:', registration.scope)
      })
      .catch((error) => {
        console.error('Service worker registration failed:', error)
      })
  })
}
