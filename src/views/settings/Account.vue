<template>
  <div>
    <v-navigation-drawer :permanent="$vuetify.display.mdAndUp">
      <Navigation />
    </v-navigation-drawer>

    <v-container fluid>
      <SettingsAccountForm />
    </v-container>
  </div>
</template>

<script setup>
import Navigation from '@/components/settings/Navigation.vue'
import SettingsAccountForm from '@/components/settings/SettingsAccountForm.vue'
</script>
