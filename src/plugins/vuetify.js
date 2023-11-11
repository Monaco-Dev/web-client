/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import { VBtn, VCheckbox, VTextField } from 'vuetify/lib/components/index.mjs'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  aliases: {
    VTextFieldPrimary: VTextField,
    VCheckboxPrimary: VCheckbox,
    VBtnSubmit: VBtn,
    VBtnPrimary: VBtn
  },
  defaults: {
    VTextFieldPrimary: {
      flat: true,
      variant: 'solo-filled',
      hideDetails: 'auto',
      density: 'comfortable'
    },
    VCheckboxPrimary: {
      density: 'compact',
      hideDetails: 'auto'
    },
    VBtnSubmit: {
      block: true,
      color: 'success',
      density: 'default',
      variant: 'flat'
    },
    VBtnPrimary: {
      block: true,
      color: 'primary',
      density: 'default',
      variant: 'flat'
    }
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#1867C0',
          secondary: '#5CBBF6'
        }
      }
    }
  }
})
