<template>
  <div>
    <v-navigation-drawer :permanent="$vuetify.display.mdAndUp">
      <Navigation />
    </v-navigation-drawer>

    <v-container fluid>
      <v-card
        flat
        rounded
        title="Followers"
      >
        <template #prepend>
          <v-btn
            v-if="$vuetify.display.smAndDown"
            icon="mdi-chevron-left"
            variant="text"
            to="/networks"
          />
        </template>

        <v-card-text>
          <AppGrid @load:center="load">
            <template #center>
              <UserList
                :users="users.data"
                :loading="false"
              />
            </template>
          </AppGrid>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import Navigation from '@/components/networks/Navigation.vue'
import AppGrid from '@/components/default/desktop/AppGrid.vue'
import UserList from '@/components/user/UserList.vue'
import AuthService from '@/composables/auth'
import httpException from '@/composables/http-exception'
import User from '@/api/auth/user'
import { computed } from 'vue'
import { useSearchStore } from '@/store/search'

export default {
  name: 'NetworkFollowers',
  components: {
    Navigation,
    AppGrid,
    UserList
  },
  setup () {
    const searchStore = useSearchStore()

    const loading = computed(() => searchStore.loading)
    const users = computed(() => searchStore.users)

    return {
      searchStore,
      loading,
      users,
      httpException
    }
  },
  mounted () {
    this.applySearch()
  },
  methods: {
    onSearchUsers () {
      return User.search({ search: this.search, page: this.users.meta.current_page })
        .catch(({ response }) => this.httpException(response))
        .finally(() => this.searchStore.setLoading(false))
    },
    async applySearch () {
      this.searchStore.reset()
      this.searchStore.setSearch(this.search)

      this.searchStore.setLoading(true)

      await this.onSearchUsers().then(({ data }) => {
        const users = data

        users.data = [...data.data.map((v) => new Proxy(v, {}))]

        this.searchStore.setUsers(users)
        this.searchStore.setUserPage(data.meta.current_page + 1)
      })
    },
    async load ({ done }) {
      if (!AuthService.isAuthenticated() || !this.users.data.length) return done('empty')

      await this.onSearchUsers().then(({ data }) => {
        if (!data.data.length) return done('empty')

        const users = data

        users.data = [...this.users.data, ...data.data.map((v) => new Proxy(v, {}))]

        this.searchStore.setUsers(users)
        this.searchStore.setUserPage(data.meta.current_page + 1)

        return done('ok')
      })
    }
  }
}
</script>
