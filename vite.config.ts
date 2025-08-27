import { defineConfig } from 'vite' // Importa la función `defineConfig` de Vite, que ayuda a definir la configuración de Vite con autocompletado y validación de tipos.
import react from '@vitejs/plugin-react' // Importa el plugin de React para Vite, que habilita el soporte para React Fast Refresh y JSX/TSX.

// Documentación de configuración de Vite: https://vitejs.dev/config/
// Exporta la configuración por defecto de Vite.
export default defineConfig({
  // Define los plugins que Vite debe usar.
  plugins: [react()], // Habilita el plugin de React, permitiendo a Vite procesar y optimizar aplicaciones React.
})