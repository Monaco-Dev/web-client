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
        :to="`/profile/${user?.slug}`"
        :title="user?.full_name"
        subtitle="See profile"
      >
        <template #prepend>
          <v-avatar color="grey">
            <v-img
              v-if="user?.avatar_url"
              :src="user?.avatar_url"
              cover
              :alt="user?.full_name"
            />
            <span
              class="text-white"
              v-else
            >
              {{ user?.first_name?.charAt(0) }}{{ user?.last_name?.charAt(0) }}
            </span>
          </v-avatar>
        </template>
      </v-list-item>
    </v-list>

    <v-divider class="mx-4" />

    <v-list density="compact">
      <v-list-item>
        <template #prepend>
          <v-icon
            icon="mdi-weather-night"
            start
            size="small"
          />
        </template>

        <template #append>
          <v-switch
            v-model="darkMode"
            hide-details
            density="compact"
            color="primary"
          />
        </template>

        <v-list-item-title>
          Dark mode
        </v-list-item-title>
      </v-list-item>
    </v-list>

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
import { useTheme } from 'vuetify'
import { useAppStore } from '@/store/app'
import Auth from '@/api/auth/auth'
import AuthService from '@/composables/auth'
import ThemeService from '@/composables/theme'
import httpException from '@/composables/http-exception'

export default {
  name: 'AppMenu',
  setup () {
    return { httpException, theme: useTheme(), appStore: useAppStore() }
  },
  data () {
    return {
      darkMode: false
    }
  },
  mounted () {
    this.darkMode = !!this.theme.global.current.value?.dark
  },
  computed: {
    user () {
      return AuthService.getUser()
    }
  },
  watch: {
    darkMode () {
      this.theme.global.name.value = this.darkMode ? 'dark' : 'light'
      ThemeService.setTheme(this.theme.global.name.value)
    }
  },
  methods: {
    /**
     * Perform logout and flush storage
     */
    logout () {
      this.appStore.setLoading(true)

      return Auth.logout()
        .then(() => {
          AuthService.flush()
          this.$router.push({ name: 'Login' }).catch(() => {})
        })
        .catch(({ response }) => this.httpException(response))
        .finally(() => this.appStore.setLoading(false))
    }
  }
}
</script>
