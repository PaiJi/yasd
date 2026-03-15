/// <reference types="vitest/config" />

import { readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
) as { version: string }

const getBasePath = (urlPathPrefix = '') => {
  if (!urlPathPrefix) {
    return '/'
  }

  return urlPathPrefix.endsWith('/') ? urlPathPrefix : `${urlPathPrefix}/`
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const urlPathPrefix =
    process.env.VITE_URL_PATH_PREFIX ?? env.VITE_URL_PATH_PREFIX ?? ''
  const runInSurge =
    (process.env.VITE_RUN_IN_SURGE ?? env.VITE_RUN_IN_SURGE) === 'true'

  return {
    base: getBasePath(urlPathPrefix),
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['babel-plugin-macros', '@emotion/babel-plugin'],
        },
      }),
      ...(mode === 'test'
        ? []
        : [
            VitePWA({
              strategies: 'injectManifest',
              srcDir: 'src',
              filename: 'service-worker.ts',
              injectRegister: false,
              manifest: false,
              injectManifest: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
              },
            }),
          ]),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        'react-virtualized': fileURLToPath(
          new URL(
            './node_modules/react-virtualized/dist/commonjs/index.js',
            import.meta.url,
          ),
        ),
      },
    },
    optimizeDeps: {
      include: ['react-virtualized'],
    },
    define: {
      'import.meta.env.VITE_VERSION': JSON.stringify(pkg.version),
    },
    build: {
      outDir: 'build',
      sourcemap: !runInSurge,
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.ts'],
      include: ['src/**/*.spec.{ts,tsx}'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
      },
    },
  }
})
