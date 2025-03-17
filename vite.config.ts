import path from 'path'
import type { PluginOption } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import obfuscatorPlugin from "vite-plugin-javascript-obfuscator";

function setupPlugins(env: ImportMetaEnv): PluginOption[] {
  return [
    vue(),
    env.VITE_GLOB_APP_PWA === 'true' && VitePWA({
      injectRegister: 'auto',
      manifest: {
        name: 'Spark AI',
        short_name: 'Spark AI',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
    obfuscatorPlugin({
      include: [/node_modules\/markdown-it-katex-imyai\/index\.js$/],
      exclude: [],
      apply: "build",
      debugger: true,
      options: {
        "optionsPreset": "low-obfuscation",
        "domainLock": [
          "sparkai.icodeq.com",
          "super.imyai.top",
          ".imyai.top",
          ".vercel.app",
          "127.0.0.1"
        ],
        "domainLockRedirectUrl": "https://super.imyai.top",
        "domainLockEnabled": true,
      },
    }),
  ]
}

export default defineConfig((env) => {
  const viteEnv = loadEnv(env.mode, process.cwd()) as unknown as ImportMetaEnv

  return {
    baseUrl: './',
    minify: true,
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
    define: {
      __VUE_I18N_LEGACY_API__: false,
      __VUE_I18N_FULL_INSTALL__: false,
      __INTLIFY_PROD_DEVTOOLS__: false,
    },
    plugins: setupPlugins(viteEnv),
    server: {
      host: '0.0.0.0',
      port: 1002,
      open: false,
      proxy: {
        '/api': {
          target: viteEnv.VITE_APP_API_BASE_URL,
          // target: 'http://localhost:9520',
          changeOrigin: true, // 开启跨域
          secure: true, // 开启支持https协议
          rewrite: path => path.replace('/api/', '/api/'),
        },
      },
    },
    build: {
      reportCompressedSize: false,
      sourcemap: false,
      commonjsOptions: {
        ignoreTryCatch: false,
      },
    },
  }
})