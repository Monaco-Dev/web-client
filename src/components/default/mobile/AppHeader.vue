<template>
  <v-app-bar
    flat
    app
    color="white"
    style="border-bottom: 1px solid lightgray !important"
    v-if="auth"
  >
    <v-app-bar-title>
      <v-btn
        flat
        href="/"
        variant="text"
        size="large"
        class="pa-0"
      >
        <v-img
          src="@/assets/logo-text.png"
          contain
          width="150"
        />
      </v-btn>
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
        class="mx-3"
      >
        <v-badge
          bordered
          content="5"
          color="red"
        >
          <v-icon size="x-large">
            mdi-bell
          </v-icon>
        </v-badge>
      </v-btn>

      <v-btn
        icon
        variant="tonal"
        size="small"
        :to="`/profile/${user.slug}`"
      >
        <v-img
          src="@/assets/default-avatar.png"
          width="40"
          height="40"
        />
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
