<template>
  <v-card
    min-width="300"
    class="mx-auto"
    flat
    rounded
  >
    <v-list nav>
      <v-list-item
        nav
        link
        :to="`/profile/${user.slug}`"
        prepend-avatar="@/assets/default-avatar.png"
        :title="user.full_name"
        subtitle="See profile"
      />
    </v-list>

    <v-divider class="mx-4" />

    <v-list
      density="compact"
      nav
    >
      <v-list-item
        color="primary"
        link
        nav
        to="/settings"
        density="compact"
      >
        <template #prepend>
          <v-icon
            icon="mdi-tools"
            start
            size="small"
          />
        </template>

        <template #append>
          <v-icon
            icon="mdi-chevron-right"
            end
            size="small"
          />
        </template>

        <v-list-item-title>
          Settings
        </v-list-item-title>
      </v-list-item>

      <v-list-item
        color="primary"
        link
        density="compact"
        @click="logout"
      >
        <template #prepend>
          <v-icon
            icon="mdi-logout"
            start
            size="small"
          />
        </template>

        <v-list-item-title>
          Logout
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import Auth from '@/api/auth/auth'
import AuthService from '@/composables/auth'
import httpException from '@/composables/http-exception'

export default {
  name: 'AppMenu',
  setup () {
    return { httpException }
  },
  computed: {
    user () {
      return AuthService.getUser()
    }
  },
  methods: {
    /**
     * Perform logout and flush storage
     */
    logout () {
      return Auth.logout()
        .then(() => {
          AuthService.flush()
          this.$router.push({ name: 'Login' }).catch(() => {})
        })
        .catch(({ response }) => this.httpException(response))
    }
  }
}
</script>
