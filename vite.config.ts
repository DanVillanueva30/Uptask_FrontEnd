import { defineConfig } from 'vite'
import { fileURLToPath, URL } from "node:url"
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { //Al hacer la importación de componentes con una "@" vite sabe que tiene que ir a la carpeta de src para buscar ese archivo, este alias evita la anidación de carpetas ../../../ etc
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
