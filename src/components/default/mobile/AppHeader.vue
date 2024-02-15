<template>
  <v-app-bar
    elevation="1"
    app
    v-if="auth"
  >
    <v-app-bar-title>
      <v-card
        href="/"
        width="150"
        height="50"
        flat
        class="bg-transparent"
      >
        <v-img
          src="@/assets/brand.png"
          width="150"
          height="100"
          contain
        />
      </v-card>
    </v-app-bar-title>

    <template #append>
      <v-btn
        icon
        variant="tonal"
        size="small"
        @click="searchStore.openDialog()"
      >
        <v-icon size="x-large">
          mdi-magnify
        </v-icon>
      </v-btn>

      <v-btn
        icon
        variant="tonal"
        size="small"
        :href="`/profile/${user.slug}`"
        class="ml-2"
      >
        <v-avatar color="grey">
          <v-img
            v-if="user?.avatar_url"
            :src="user?.avatar_url"
            cover
          />
          <span
            class="text-white"
            v-else
          >
            {{ user?.first_name?.charAt(0) }}{{ user?.last_name?.charAt(0) }}
          </span>
        </v-avatar>
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script>
import { useSearchStore } from '@/store/search'
import AuthService from '@/composables/auth'

export default {
  name: 'AppHeader',
  setup () {
    return { searchStore: useSearchStore() }
  },
  computed: {
    auth () {
      return AuthService.isAuthenticated()
    },
    user () {
      return AuthService.getUser()
    }
  }
}
</script>
