import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    // Se siamo in produzione (npm run build), usa il nome della repo, altrimenti usa la root '/' per il locale
    base: command === 'build' ? '/BKCH/' : '/',
  }
})