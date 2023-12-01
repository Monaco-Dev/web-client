<template>
  <div>
    <v-navigation-drawer :permanent="$vuetify.display.mdAndUp">
      <Navigation />
    </v-navigation-drawer>

    <v-container fluid>
      <SettingsProfileForm />
    </v-container>
  </div>
</template>

<script setup>
import Navigation from '@/components/settings/Navigation.vue'
import SettingsProfileForm from '@/components/settings/SettingsProfileForm.vue'
</script>
