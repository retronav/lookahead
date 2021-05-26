import visualize from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

const shouldAnalyze = process.env.ANALYZE;

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
    target: 'es2017',
    rollupOptions: {
      plugins: [
        shouldAnalyze
          ? visualize({
              open: true,
              gzipSize: true,
              brotliSize: true,
              filename: './build/.dev/stats.html',
            })
          : {},
      ],
      output: {
        manualChunks: {
          firestore: ['@firebase/firestore'],
          firebaseAuth: ['@firebase/auth'],
        },
      },
    },
  },
  resolve: {
    mainFields: ['esm2017'],
  },
});
