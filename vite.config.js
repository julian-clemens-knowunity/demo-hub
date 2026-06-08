import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const shimPath = path.resolve(__dirname, './src/react-native-shim.js')

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'react-native-shim',
      resolveId(id) {
        if (id.includes('codegenNativeComponent')) {
          return shimPath
        }
      },
    },
  ],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
  optimizeDeps: {
    exclude: ['react-native-safe-area-context'],
  },
})
