<template>
  <v-container fluid>
    <div v-if="$vuetify.display.smAndDown">
      <Navigation v-if="$router.currentRoute.value.name === 'Networks'" />

      <router-view v-else />
    </div>

    <v-row v-else>
      <v-col cols="3">
        <Navigation />
      </v-col>

      <v-col cols="9">
        <router-view />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import Navigation from '@/components/networks/Navigation.vue'

  export default {
    name: 'NetworkIndex',
    components: { Navigation },
    beforeRouteEnter(to, from, next) {
      next((vm) => {
        if (vm.$vuetify.display.mdAndUp && to.name === 'Networks') {
          vm.$router.push({ name: 'NetworksIncomingInvites' })
        }
      })
    },
  }
</script>
