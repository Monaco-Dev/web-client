<template>
  <AppGrid>
    <template #center>
      <PostList
        @load="load"
        :posts="posts.data"
        :loading="loading"
        @click:pin="pin"
        @click:unpin="unpin"
        @click:archive="archive"
      />
    </template>
  </AppGrid>
</template>

<script>
import { computed } from 'vue'
import { useSearchStore } from '@/store/search'
import AuthService from '@/composables/auth'
import Post from '@/api/feed/post'
import httpException from '@/composables/http-exception'
import AppGrid from '@/components/default/desktop/AppGrid.vue'
import PostList from '@/components/post/PostList.vue'

export default {
  name: 'SearchPosts',
  components: { AppGrid, PostList },
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

    return {
      searchStore,
      loading,
      posts,
      httpException
    }
  },
  methods: {
    onSearchPosts () {
      return Post.search({ search: this.search, page: this.posts.meta.current_page })
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
    },
    async load ({ done }) {
      if (!AuthService.isAuthenticated() || !this.posts.data.length) return done('empty')

      await this.onSearchPosts().then(({ data }) => {
        if (!data.data.length) return done('empty')

        const posts = data

        posts.data = [...this.posts.data, ...data.data.map((v) => new Proxy(v, {}))]

        this.searchStore.setPosts(posts)
        this.searchStore.setPostPage(data.meta.current_page + 1)

        return done('ok')
      })
    },

    pin (data) {
      this.searchStore.updatePost(data)
    },
    unpin (data) {
      this.searchStore.updatePost(data)
    },
    archive (id) {
      this.searchStore.deletePost(id)
    }
  }
}
</script>
