<template>
  <v-card
    flat
    rounded
    title="Incoming Invites"
  >
    <template #prepend>
      <v-btn
        v-if="$vuetify.display.smAndDown"
        icon="mdi-chevron-left"
        variant="text"
        to="/networks"
      />
    </template>

    <v-card-text class="ma-3 pa-0">
      <AppGrid>
        <template #center>
          <UserList
            :users="users.data"
            :loading="loading"
            @load="load"
          />
        </template>
      </AppGrid>
    </v-card-text>
  </v-card>
</template>

<script>
  import AppGrid from '@/components/default/desktop/AppGrid.vue'
  import UserList from '@/components/user/UserList.vue'
  import AuthService from '@/composables/auth'
  import httpException from '@/composables/http-exception'
  import ConnectionInvitation from '@/api/auth/connection-invitation'
  import { computed } from 'vue'
  import { useNetworkStore } from '@/store/network'

  export default {
    name: 'NetworkIncomingInvites',
    components: {
      AppGrid,
      UserList,
    },
    setup() {
      const networkStore = useNetworkStore()

      const loading = computed(() => networkStore.loading)
      const users = computed(() => networkStore.users)

      return {
        networkStore,
        loading,
        users,
        httpException,
      }
    },
    mounted() {
      this.applySearch()
    },
    methods: {
      onSearchUsers() {
        return ConnectionInvitation.searchIncoming({
          search: this.search,
          page: this.users.meta.current_page,
        })
          .catch(({ response }) => this.httpException(response))
          .finally(() => this.networkStore.setLoading(false))
      },
      async applySearch() {
        this.networkStore.reset()
        this.networkStore.setLoading(true)

        await this.onSearchUsers().then(({ data }) => {
          const users = data

          users.data = [...data.data.map((v) => new Proxy(v, {}))]

          this.networkStore.setUsers(users)
          this.networkStore.setUserPage(data.meta.current_page + 1)
        })
      },
      async load({ done }) {
        if (!AuthService.isAuthenticated() || !this.users.data.length)
          return done('empty')

        await this.onSearchUsers().then(({ data }) => {
          if (!data.data.length) return done('empty')

          const users = data

          users.data = [
            ...this.users.data,
            ...data.data.map((v) => new Proxy(v, {})),
          ]

          this.networkStore.setUsers(users)
          this.networkStore.setUserPage(data.meta.current_page + 1)

          return done('ok')
        })
      },
    },
  }
</script>
