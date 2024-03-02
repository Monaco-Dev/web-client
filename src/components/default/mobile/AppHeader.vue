<template>
  <v-app-bar
    elevation="1"
    app
    v-if="isAuth"
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
          alt="Realmate"
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
        :href="`/profile/${getUuid()}`"
        class="ml-2"
      >
        <v-avatar color="grey">
          <v-img
            v-if="getAvatar()"
            :src="getAvatar()"
            cover
            :alt="getFullName()"
          />
          <span
            class="text-white"
            v-else
          >
            {{ getInitials() }}
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
  methods: {
    getFullName () {
      return AuthService.getUser()?.full_name
    },
    getAvatar () {
      return AuthService.getUser()?.avatar_url
    },
    getInitials () {
      return AuthService.getUser()?.first_name?.charAt(0) + AuthService.getUser()?.last_name?.charAt(0)
    },
    getUuid () {
      return AuthService.getUser()?.uuid
    },
    isAuth () {
      return AuthService.isAuthenticated()
    }
  }
}
</script>
