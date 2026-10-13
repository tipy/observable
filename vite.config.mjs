import { defineConfig } from 'vite';

// Library build powered by Rolldown (Vite 8's bundler).
// Bundles the JS output with Rolldown. Type declarations are emitted separately by tsc.
export default defineConfig({
  build: {
    target: 'es2020',
    minify: 'oxc',
    sourcemap: true,
    emptyOutDir: false,
    outDir: 'lib',
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rolldownOptions: {
      platform: 'neutral',
    },
  },
});
