<template>
  <v-app>
    <DefaultView />
    <AlertDialog />
    <ConfirmationDialog />
    <v-divider />
    <AppFooter />
  </v-app>
</template>

<script setup>
import DefaultView from './View.vue'
import AlertDialog from '@/components/default/AlertDialog.vue'
import ConfirmationDialog from '@/components/default/ConfirmationDialog.vue'
import AppFooter from '@/components/default/AppFooter.vue'
</script>
