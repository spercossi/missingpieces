import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries - separate chunk
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // UI libraries - separate chunk  
          ui: ['@material-tailwind/react', 'react-hot-toast', '@headlessui/react', '@heroicons/react'],
          // Redux - separate chunk
          redux: ['@reduxjs/toolkit', 'react-redux', 'redux-thunk'],
          // Utils - separate chunk
          utils: ['axios', 'prop-types']
        }
      }
    },
    // Increase chunk size limit to 1000kb
    chunkSizeWarningLimit: 1000
  }
})
