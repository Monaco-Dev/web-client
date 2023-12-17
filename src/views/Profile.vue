<template>
  <div>
    <v-container
      fluid
      :class="{'px-0': $vuetify.display.smAndDown}"
    >
      <DesktopProfileInformation
        v-if="$vuetify.display.mdAndUp"
        :profile="profile"
        :loading="loading"
        :auth="auth"
      />
      <MobileProfileInformation
        v-else
        :profile="profile"
        :loading="loading"
        :auth="auth"
      />

      <ProfileWall :class="{'mt-4': $vuetify.display.smAndDown, 'mt-1': $vuetify.display.mdAndUp}" />
    </v-container>
  </div>
</template>

<script setup>
import ProfileWall from '@/components/profile/ProfileWall.vue'
import DesktopProfileInformation from '@/components/profile/desktop/ProfileInformation.vue'
import MobileProfileInformation from '@/components/profile/mobile/ProfileInformation.vue'
import { computed } from 'vue'
import { useProfileStore } from '@/store/profile'
import AuthService from '@/composables/auth'

const profileStore = useProfileStore()

const profile = computed(() => profileStore.profile)
const loading = computed(() => profileStore.loading)

const auth = (AuthService.getUser().slug === profile.value.slug)
</script>
