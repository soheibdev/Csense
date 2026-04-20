import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // ── Root is now frontend/ so index.html lives here ───────────────────────
  root: path.resolve(__dirname),   // frontend/ is the Vite root
  plugins: [react()],

  resolve: {
    alias: {
      // Short-hand for the src directory
      '@':               path.resolve(__dirname, 'src'),

      // Feature folders
      '@assets':         path.resolve(__dirname, 'src/assets'),
      '@styles':         path.resolve(__dirname, 'src/styles'),
      '@components':     path.resolve(__dirname, 'src/components'),
      '@pages':          path.resolve(__dirname, 'src/pages'),
      '@modules':        path.resolve(__dirname, 'src/modules'),
      '@hooks':          path.resolve(__dirname, 'src/hooks'),
      '@services':       path.resolve(__dirname, 'src/services'),
      '@store':          path.resolve(__dirname, 'src/store'),
      '@routes':         path.resolve(__dirname, 'src/routes'),
      '@utils':          path.resolve(__dirname, 'src/utils'),

      // Component sub-folders (optional convenience aliases)
      '@ui':             path.resolve(__dirname, 'src/components/ui'),
      '@quiz':           path.resolve(__dirname, 'src/components/quiz'),
      '@gamification':   path.resolve(__dirname, 'src/components/gamification'),
    },
  },

  server: {
    port: 5173,
    strictPort: true, // fail if port is taken — Electron relies on this
  },

  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
});
