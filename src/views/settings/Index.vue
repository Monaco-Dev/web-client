<template>
  <v-container
    fluid
    class="px-0"
  >
    <Navigation v-if="$vuetify.display.smAndDown" />
  </v-container>
</template>

<script>
import Navigation from '@/components/settings/Navigation.vue'

export default {
  name: 'SettingsIndex',
  components: { Navigation },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      if (vm.$vuetify.display.mdAndUp && to.name === 'Settings') {
        vm.$router.push({ name: 'SettingsProfile' })
      }
    })
  }
}
</script>
