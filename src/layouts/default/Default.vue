<template>
  <v-app>
    <DefaultView />
    <AlertDialog />
    <ConfirmationDialog />
    <AppSnackbar />
    <v-divider />
    <AppFooter />
  </v-app>
</template>

<script setup>
import DefaultView from './View.vue'
import AlertDialog from '@/components/default/AlertDialog.vue'
import ConfirmationDialog from '@/components/default/ConfirmationDialog.vue'
import AppSnackbar from '@/components/default/AppSnackbar.vue'
import AppFooter from '@/components/default/AppFooter.vue'
</script>
