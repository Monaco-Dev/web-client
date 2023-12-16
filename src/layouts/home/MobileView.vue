<template>
  <v-app>
    <AppHeader />

    <v-main>
      <router-view />
    </v-main>

    <AppBottomNavigation />

    <AlertDialog />
    <ConfirmationDialog />
    <AppSnackbar />
    <SearchDialog />
  </v-app>
</template>

<script setup>
import AppHeader from '@/components/default/mobile/AppHeader.vue'
import AppBottomNavigation from '@/components/default/mobile/AppBottomNavigation.vue'
import SearchDialog from '@/components/search/SearchDialog.vue'
import AlertDialog from '@/components/default/AlertDialog.vue'
import ConfirmationDialog from '@/components/default/ConfirmationDialog.vue'
import AppSnackbar from '@/components/default/AppSnackbar.vue'
</script>
