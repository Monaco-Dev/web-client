<template>
  <v-app>
    <v-toolbar
      flat
      class="bg-transparent"
    >
      <template #append>
        <v-btn
          icon
          @click="darkMode = !darkMode"
        >
          <v-icon>{{
            darkMode ? 'mdi-white-balance-sunny' : 'mdi-weather-night'
          }}</v-icon>
        </v-btn>
      </template>
    </v-toolbar>

    <DefaultView />
    <AlertDialog />
    <ConfirmationDialog />
    <AppSnackbar />
    <v-divider />
    <AppFooter />
  </v-app>
</template>

<script>
  import { useTheme } from 'vuetify'
  import DefaultView from './View.vue'
  import AlertDialog from '@/components/default/AlertDialog.vue'
  import ConfirmationDialog from '@/components/default/ConfirmationDialog.vue'
  import AppSnackbar from '@/components/default/AppSnackbar.vue'
  import AppFooter from '@/components/default/AppFooter.vue'
  import ThemeService from '@/composables/theme'

  export default {
    name: 'AppDefaultLayout',
    components: {
      DefaultView,
      AlertDialog,
      ConfirmationDialog,
      AppSnackbar,
      AppFooter,
    },
    setup() {
      return { theme: useTheme() }
    },
    data() {
      return {
        darkMode: false,
      }
    },
    mounted() {
      this.darkMode = !!this.theme.global.current.value?.dark
    },
    watch: {
      darkMode() {
        this.theme.global.name.value = this.darkMode ? 'dark' : 'light'
        ThemeService.setTheme(this.theme.global.name.value)
      },
    },
  }
</script>
