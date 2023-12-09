<template>
  <div>
    <v-container
      fluid
      :class="{'px-0': $vuetify.display.smAndDown}"
    >
      <ProfileInformation />

      <ProfileWall class="mt-3" />
    </v-container>
  </div>
</template>

<script setup>
import ProfileInformation from '@/components/profile/ProfileInformation.vue'
import ProfileWall from '@/components/profile/ProfileWall.vue'
</script>
