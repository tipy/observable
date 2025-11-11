const esbuild = require('esbuild');

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    outdir: 'lib',
    bundle: true,
    sourcemap: 'external', // External sourcemap - not included in bundle size
    minify: true,
    format: 'esm',
    target: ['es2020'], // Modern but widely supported
    platform: 'neutral', // Works in both browser and Node.js
    treeShaking: true, // Enable tree-shaking
    // Remove ignoreAnnotations to allow PURE annotations for better tree-shaking
    legalComments: 'none', // Remove comments to reduce size
    keepNames: false, // Allows more aggressive minification
    // Exclude test files from bundle
    external: [], // Add any peer dependencies here if needed
    metafile: true, // Generate bundle analysis file
  })
  .then((result) => {
    // Optional: Print bundle size info
    if (result.metafile) {
      const text = esbuild.analyzeMetafileSync(result.metafile, {
        verbose: false,
      });
      console.log(text);
    }
  })
  .catch(() => process.exit(1));
