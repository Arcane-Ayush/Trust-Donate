import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared'),
      '@tychilabs/ugf-testnet-js': path.resolve(__dirname, 'node_modules/@tychilabs/ugf-testnet-js'),
      'ethers': path.resolve(__dirname, 'node_modules/ethers'),
      'js-sha256': path.resolve(__dirname, 'node_modules/js-sha256'),
    },
  },
  server: {
    fs: {
      allow: [
        '.',
        '../shared',
        '../node_modules'
      ],
    },
  },
})
