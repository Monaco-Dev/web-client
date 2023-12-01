<template>
  <AppGrid @load:center="load">
    <template #center>
      <UserList
        :loading="loading"
        :users="users.data"
      >
        <template #subheader>
          <v-list-subheader>People</v-list-subheader>
        </template>

        <template #seeMore>
          <v-btn
            variant="tonal"
            block
            flat
            size="small"
            @click="$emit('click:seeMore')"
          >
            see more
          </v-btn>
        </template>
      </UserList>

      <PostList
        class="mt-3"
        :posts="posts.data"
        :loading="loading"
      />
    </template>
  </AppGrid>
</template>

<script>
import { computed } from 'vue'
import { useSearchStore } from '@/store/search'
import AuthService from '@/composables/auth'
import Post from '@/api/feed/post'
import User from '@/api/auth/user'
import httpException from '@/composables/http-exception'
import UserList from './UserList.vue'
import PostList from '@/components/post/PostList.vue'
import AppGrid from '@/components/default/desktop/AppGrid.vue'

export default {
  name: 'SearchAll',
  components: {
    UserList,
    PostList,
    AppGrid
  },
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
    const posts = computed(() => searchStore.posts)
    const users = computed(() => searchStore.users)

    return {
      searchStore,
      loading,
      posts,
      users,
      httpException
    }
  },
  methods: {
    onSearchPosts () {
      return Post.search({ search: this.search, page: this.posts.meta.current_page })
        .catch(({ response }) => this.httpException(response))
        .finally(() => this.searchStore.setLoading(false))
    },
    onSearchUsers () {
      return User.search({
        search: this.search,
        page: this.users.meta.current_page,
        limit: 3
      })
        .catch(({ response }) => this.httpException(response))
        .finally(() => this.searchStore.setLoading(false))
    },
    async applySearch () {
      this.searchStore.reset()
      this.searchStore.setSearch(this.search)

      this.searchStore.setLoading(true)

      await this.onSearchPosts().then(({ data }) => {
        const posts = data

        posts.data = [...data.data.map((v) => new Proxy(v, {}))]

        this.searchStore.setPosts(posts)
        this.searchStore.setPostPage(data.meta.current_page + 1)
      })

      await this.onSearchUsers().then(({ data }) => {
        const users = data

        users.data = [...data.data.map((v) => new Proxy(v, {}))]

        this.searchStore.setUsers(users)
        this.searchStore.setUserPage(data.meta.current_page + 1)
      })
    },
    async load ({ done }) {
      if (!AuthService.isAuthenticated()) return done('error')

      await this.onSearchPosts().then(({ data }) => {
        if (!data.data.length) return done('empty')

        const posts = data

        posts.data = [...this.posts.data, ...data.data.map((v) => new Proxy(v, {}))]

        this.searchStore.setPosts(posts)
        this.searchStore.setPostPage(data.meta.current_page + 1)

        return done('ok')
      })
    }
  }
}
</script>
