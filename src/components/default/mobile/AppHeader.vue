<template>
  <v-app-bar
    elevation="1"
    app
    v-if="auth"
    color="primary"
  >
    <v-app-bar-title>
      <v-card
        href="/"
        width="140"
        height="50"
        flat
        class="bg-transparent"
      >
        <v-img
          src="@/assets/text-logo.png"
          width="140"
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
        :to="`/profile/${user.slug}`"
        class="ml-2"
      >
        <v-avatar>
          <v-img src="https://cdn.vuetifyjs.com/images/lists/1.jpg" />
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
