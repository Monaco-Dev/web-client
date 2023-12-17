<template>
  <AppGrid>
    <template #center>
      <div
        v-if="loading"
        class="mb-3"
      >
        <v-skeleton-loader
          v-for="num in 2"
          :key="num"
          class="my-3"
          type="list-item-avatar-two-line, card"
        />
      </div>

      <v-card
        v-else-if="users.data.length"
        flat
        rounded
      >
        <v-card-text class="pa-0 ma-3">
          <v-list
            nav
            lines="three"
            rounded
            class="mb-3"
          >
            <v-list-subheader>People</v-list-subheader>

            <div
              v-for="(user, i) in users.data"
              :key="user.id"
            >
              <UserItem
                :user="user"
                :class="{'mt-2': i > 0}"
              />

              <v-divider v-if="users.data.length > i + 1" />
            </div>
          </v-list>
        </v-card-text>

        <v-card-actions class="pa-0 ma-3">
          <v-btn
            variant="tonal"
            block
            flat
            @click="$emit('click:seeMore')"
          >
            see more
          </v-btn>
        </v-card-actions>
      </v-card>

      <PostList
        :posts="posts.data"
        :loading="loading"
        @load="load"
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
import UserItem from '@/components/user/UserItem.vue'
import PostList from '@/components/post/PostList.vue'
import AppGrid from '@/components/default/desktop/AppGrid.vue'

export default {
  name: 'SearchAll',
  components: {
    UserItem,
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
      if (!AuthService.isAuthenticated()) return done('empty')

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
