<template>
  <v-app-bar
    flat
    app
    location="bottom"
    scroll-behavior="hide"
  >
    <v-tabs v-model="tab" align-tabs="center" fixed-tabs grow hide-slider :mandatory="true" :stacked="true" color="primary">
      <v-tab value="Home" exact fixed to="/" variant="plain" class="text-none" :ripple="false">
        <v-icon size="small">mdi-home</v-icon>
        <small>Home</small>
      </v-tab>

      <v-tab value="Networks" fixed to="/networks" variant="plain" class="text-none" :ripple="false">
        <v-icon size="small">mdi-account-group</v-icon>
        <small>Networks</small>
      </v-tab>

      <v-tab value="Pins" fixed to="/pins" variant="plain" class="text-none" :ripple="false">
        <v-icon size="small">mdi-pin</v-icon>
        <small>Pins</small>
      </v-tab>

      <v-tab value="Menu" fixed to="/menu" variant="plain" class="text-none" :ripple="false">
        <v-icon size="small">mdi-menu</v-icon>
        <small>Menu</small>
      </v-tab>
    </v-tabs>
  </v-app-bar>
</template>

<script>
export default {
  data(){
    return {
      tab: null
    }
  }
}
</script>