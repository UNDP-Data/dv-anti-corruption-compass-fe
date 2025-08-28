import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from '@nabla/vite-plugin-eslint';
import tailwindcss from '@tailwindcss/vite';
import { AtRule } from 'postcss';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    eslint(),
    tailwindcss(),
    visualizer({ filename: 'stats.html', open: true }),
  ],
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: 'remove-layers', // If you want to remove base layer
          AtRule: {
            layer(rule) {
              if (rule.params !== 'base') {
                rule.each(child => {
                  rule.parent.insertAfter(rule, child);
                });
                rule.remove();
              }
            },
          },
        },
        {
          postcssPlugin: 'wrap-with-undp-container', // If you want to wrap all the class in .undp-container
          Once(root) {
            const skipSelectors = ['html', 'body', ':root', ':host'];
            root.walkRules(rule => {
              if (rule.parent && rule.parent.type === 'atrule') {
                const parent = rule.parent as AtRule;
                if (parent.name === 'keyframes' || parent.name === 'supports') {
                  return;
                }
              }
              rule.selectors = rule.selectors.map(selector => {
                if (selector.startsWith('.undp-container')) return selector;
                if (skipSelectors.some(skip => selector.startsWith(skip)))
                  return selector;
                return `.undp-container ${selector}`;
              });
            });
          },
        },
        {
          postcssPlugin: 'move-media-queries-last', // If you want to reorder media queries to the end
          Once(root) {
            const mediaQueries = [];

            // Collect all media queries
            root.walkAtRules('media', mediaRule => {
              mediaQueries.push(mediaRule.clone());
              mediaRule.remove();
            });

            // Append them at the end
            mediaQueries.forEach(mediaQuery => {
              root.append(mediaQuery);
            });
          },
        },
      ],
    },
  },
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
      treeshake: true,
    },
  },
  server: {
    cors: {
      origin: '*',
      methods: ['GET'],
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
});
