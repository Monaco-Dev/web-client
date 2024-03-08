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

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(pinia)
    .use(router)
    .use(VueCookies, { expires: '7d' })
    .use(VueGtag, { config: { id: 'G-BGEKT2QCSW' } }) // process.env.GOOGLE_ANALYTICS_PROPERTY_ID
}
