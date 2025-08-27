import { StrictMode } from 'react' // Importa `StrictMode` de React para habilitar comprobaciones adicionales y advertencias en modo de desarrollo.
import { createRoot } from 'react-dom/client' // Importa `createRoot` de `react-dom/client` para la nueva API de renderizado concurrente de React 18.
import App from './App.tsx' // Importa el componente principal de la aplicación, `App`.
import './index.css' // Importa el archivo CSS global para aplicar estilos a toda la aplicación.

// Configuración de la aplicación: Obtiene el elemento DOM donde se montará la aplicación React.
const rootElement = document.getElementById('root') // Busca el elemento con el ID 'root' en el HTML.

// Verifica si el elemento raíz existe. Si no, lanza un error.
if (!rootElement) {
  throw new Error('Failed to find the root element') // Mensaje de error si el elemento raíz no se encuentra.
}

// Configuración de desarrollo para mejor debugging: Muestra mensajes en la consola solo en modo de desarrollo.
if (import.meta.env.DEV) { // `import.meta.env.DEV` es una variable de entorno de Vite que es `true` en desarrollo.
  console.log('🚀 Noticias Hoy - Desarrollo') // Mensaje de inicio en desarrollo.
  console.log('📰 Sitio de noticias iniciado correctamente') // Mensaje de confirmación de inicio.
}

// Crear y renderizar la aplicación React: Inicializa la raíz de React y renderiza el componente principal.
const root = createRoot(rootElement) // Crea una raíz de React para el elemento DOM encontrado.

root.render( // Renderiza el componente `App` dentro de `StrictMode`.
  <StrictMode> {/* `StrictMode` activa comprobaciones adicionales y advertencias para posibles problemas en la aplicación. */}
    <App /> {/* El componente principal de la aplicación. */}
  </StrictMode>,
)

// Service Worker registration para PWA (opcional): Registra un Service Worker para funcionalidades PWA solo en producción.
if ('serviceWorker' in navigator && import.meta.env.PROD) { // Comprueba si el navegador soporta Service Workers y si la aplicación está en producción.
  window.addEventListener('load', () => { // Espera a que la página se cargue completamente.
    navigator.serviceWorker.register('/sw.js') // Intenta registrar el Service Worker ubicado en `/sw.js`.
      .then((registration) => { // Si el registro es exitoso.
        console.log('SW registered: ', registration) // Muestra un mensaje de éxito en la consola.
      })
      .catch((registrationError) => { // Si el registro falla.
        console.log('SW registration failed: ', registrationError) // Muestra un mensaje de error en la consola.
      })
  })
}

// Configuración de analytics (placeholder): Declara una interfaz global para `window.gtag`.
declare global {
  interface Window {
    gtag?: (...args: any[]) => void // Define `gtag` como una función opcional en el objeto `window`.
  }
}

// Google Analytics placeholder: Envía un evento de configuración a Google Analytics solo en producción.
if (import.meta.env.PROD && window.gtag) { // Comprueba si la aplicación está en producción y si `gtag` está disponible.
  window.gtag('config', 'GA_MEASUREMENT_ID', { // Llama a `gtag` para configurar Google Analytics.
    page_title: 'Noticias Hoy', // Título de la página para Analytics.
    page_location: window.location.href, // URL de la página para Analytics.
  })
}

// Error boundary global para producción: Captura errores no manejados a nivel global.
window.addEventListener('error', (event) => { // Escucha el evento de error global.
  console.error('Error global capturado:', event.error) // Registra el error en la consola.
  // Aquí podrías enviar errores a un servicio de monitoreo (ej. Sentry, Bugsnag) para seguimiento en producción.
})

// Captura promesas rechazadas no manejadas a nivel global.
window.addEventListener('unhandledrejection', (event) => { // Escucha el evento de rechazo de promesa no manejado.
  console.error('Promise rechazada no manejada:', event.reason) // Registra la razón del rechazo en la consola.
  // Aquí podrías enviar errores a un servicio de monitoreo.
})