<template>
  <AppGrid @load:center="load">
    <template #center>
      <UserList
        :users="users.data"
        :loading="loading"
      />
    </template>
  </AppGrid>
</template>

<script>
import { computed } from 'vue'
import { useSearchStore } from '@/store/search'
import UserList from './UserList.vue'
import AppGrid from '@/components/default/desktop/AppGrid.vue'
import AuthService from '@/composables/auth'
import httpException from '@/composables/http-exception'
import User from '@/api/auth/user'

export default {
  name: 'SearchUsers',
  components: { UserList, AppGrid },
  props: {
    search: {
      type: [String, null],
      default: String,
      required: true
    }
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
      if (!AuthService.isAuthenticated() || !this.users.data.length) return done('error')

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
