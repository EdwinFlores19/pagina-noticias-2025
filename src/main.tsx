import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Configuración de la aplicación
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Failed to find the root element')
}

// Configuración de desarrollo para mejor debugging
if (import.meta.env.DEV) {
  console.log('🚀 Noticias Hoy - Desarrollo')
  console.log('📰 Sitio de noticias iniciado correctamente')
}

// Crear y renderizar la aplicación React
const root = createRoot(rootElement)

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Service Worker registration para PWA (opcional)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}

// Configuración de analytics (placeholder)
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

// Google Analytics placeholder
if (import.meta.env.PROD && window.gtag) {
  window.gtag('config', 'GA_MEASUREMENT_ID', {
    page_title: 'Noticias Hoy',
    page_location: window.location.href,
  })
}

// Error boundary global para producción
window.addEventListener('error', (event) => {
  console.error('Error global capturado:', event.error)
  // Aquí podrías enviar errores a un servicio de monitoreo
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rechazada no manejada:', event.reason)
  // Aquí podrías enviar errores a un servicio de monitoreo
})