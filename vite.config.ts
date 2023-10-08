import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as path from "path";

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: './build'
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "../../theme.config": path.resolve(
        __dirname,
        "./src/semantic-ui/theme.config"
      ),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        math: "always",
      },
    },
  },
  assetsInclude: ['**/*.md']
})
