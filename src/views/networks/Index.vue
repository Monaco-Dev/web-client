<template>
  <v-container
    fluid
    class="px-0"
  >
    <Navigation v-if="$vuetify.display.smAndDown" />
  </v-container>
</template>

<script>
import Navigation from '@/components/networks/Navigation.vue'

export default {
  name: 'NetworkIndex',
  components: { Navigation },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      if (vm.$vuetify.display.mdAndUp && to.name === 'Networks') {
        vm.$router.push({ name: 'NetworksIncomingInvites' })
      }
    })
  }
}
</script>
