<template>
  <DesktopView v-if="$vuetify.display.mdAndUp" />
  <MobileView v-else />
</template>

<script setup>
import DesktopView from './DesktopView.vue'
import MobileView from './MobileView.vue'
</script>
