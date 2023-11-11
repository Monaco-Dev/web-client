<template>
  <v-app>
    <mobile-view v-if="this.$vuetify.display.mobile" />
    <desktop-view v-else />
  </v-app>
</template>

<script setup>
import DesktopView from './DesktopView.vue'
import MobileView from './MobileView.vue'
</script>
