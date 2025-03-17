import { createApp } from 'vue'
import '@/styles/lib/viewer.css'
import VueViewer from 'v-viewer'
import { MotionPlugin } from '@vueuse/motion'
import App from './App.vue'
import { setupI18n } from './locales'
import { setupAssets, setupScrollbarStyle } from './plugins'
import { setupStore } from './store'
import { setupRouter } from './router'
import { vLoading } from '@/loading/index'
import '@/styles/index.less'
import "vant/lib/index.css";

const params = new URLSearchParams(window.location.search)
if (import.meta.env.MODE !== 'development' && Number(params.get('sparkai')) !== 9)
  (window as any)?.ConsoleBan?.init({ redirect: 'about:blank' })

async function bootstrap() {
  const app = createApp(App)
  app.use(VueViewer)
  app.use(MotionPlugin)
  setupAssets()
  setupScrollbarStyle()
  setupStore(app)
  setupI18n(app)
  await setupRouter(app)
  app.mount('#app')
  app.directive('loading', vLoading)
}

bootstrap()
