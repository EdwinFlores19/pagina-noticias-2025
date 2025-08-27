import js from '@eslint/js' // Importa las configuraciones recomendadas de ESLint para JavaScript.
import globals from 'globals' // Importa las variables globales predefinidas para diferentes entornos.
import reactHooks from 'eslint-plugin-react-hooks' // Importa el plugin de ESLint para reglas específicas de React Hooks.
import reactRefresh from 'eslint-plugin-react-refresh' // Importa el plugin de ESLint para React Refresh (Hot Module Replacement).
import tseslint from 'typescript-eslint' // Importa las utilidades y configuraciones de ESLint para TypeScript.
import { globalIgnores } from 'eslint/config' // Importa la función para definir patrones de ignorado globales.

// Exporta la configuración de ESLint por defecto.
export default tseslint.config([
  // Define patrones globales a ignorar por ESLint.
  globalIgnores(['dist']), // Ignora el directorio 'dist' (comúnmente usado para builds de producción).
  {
    // Aplica esta configuración a archivos con extensiones .ts o .tsx.
    files: ['**/*.{ts,tsx}'],
    // Extiende las configuraciones base de ESLint.
    extends: [
      js.configs.recommended, // Configuración recomendada de ESLint para JavaScript.
      tseslint.configs.recommended, // Configuración recomendada de ESLint para TypeScript.
      reactHooks.configs['recommended-latest'], // Configuración recomendada más reciente para React Hooks.
      reactRefresh.configs.vite, // Configuración para React Refresh, optimizada para Vite.
    ],
    // Opciones de lenguaje para el análisis de código.
    languageOptions: {
      ecmaVersion: 2020, // Establece la versión de ECMAScript a 2020.
      globals: globals.browser, // Define las variables globales disponibles en entornos de navegador.
    },
  },
])