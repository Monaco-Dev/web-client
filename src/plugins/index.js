/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '../store'
import router from '../router'
import VueCookies from 'vue-cookies'
import VueGtag from 'vue-gtag'

export function registerPlugins(app) {
  app
    .use(vuetify)
    .use(pinia)
    .use(router)
    .use(VueCookies, { expires: '7d' })
    .use(
      VueGtag,
      {
        appName: 'Realmate',
        pageTrackerScreenviewEnabled: true,
        config: {
          id: import.meta.env.VITE_APP_GTAG_PROPERTY_ID,
        },
      },
      router,
    )
}
