import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const safeAreaShim = path.resolve(__dirname, './src/safe-area-shim.jsx')
const rnShim = path.resolve(__dirname, './src/react-native-shim.js')

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'react-native-shims',
      enforce: 'pre',
      resolveId(id) {
        if (id === 'react-native-safe-area-context') {
          return safeAreaShim
        }
        if (id === 'react-native') {
          return rnShim
        }
        if (id.includes('codegenNativeComponent')) {
          return rnShim
        }
      },
    },
  ],
})
