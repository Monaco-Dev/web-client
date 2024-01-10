<template>
  <AppGrid>
    <template #center>
      <PostList
        :posts="posts"
        :loading="loading"
        @load="load"
      />
    </template>
  </AppGrid>
</template>

<script>
import { computed } from 'vue'
import { usePostStore } from '@/store/post'
import AppGrid from '@/components/default/desktop/AppGrid.vue'
import PostList from '@/components/post/PostList.vue'
import Post from '@/api/feed/post'
import httpException from '@/composables/http-exception'
import AuthService from '@/composables/auth'

export default {
  name: 'ProfileArchive',
  components: {
    AppGrid,
    PostList
  },
  setup () {
    const postStore = usePostStore()

    const posts = computed(() => postStore.posts)
    const loading = computed(() => postStore.loading)

    return {
      httpException,
      postStore,
      posts,
      loading
    }
  },
  mounted () {
    this.postStore.reset()
    this.init()
  },
  methods: {
    onSearch () {
      return Post.searchArchives({ page: this.postStore.page })
        .catch(({ response }) => this.httpException(response))
        .finally(() => this.postStore.setLoading(false))
    },
    async init () {
      if (!AuthService.isAuthenticated() || this.posts.length) return

      this.postStore.setLoading(true)

      await this.onSearch().then(({ data }) => {
        if (!data.data.length) return

        this.postStore.setPosts([...this.postStore.posts, ...data.data.map((v) => new Proxy(v, {}))])
        this.postStore.setPage(data.meta.current_page + 1)
      })
    },
    async load ({ done }) {
      if (!AuthService.isAuthenticated() || !this.posts.length) return done('empty')

      if (!this.postStore.posts.length) this.postStore.setLoading(true)

      await this.onSearch()
        .then(({ data }) => {
          if (!data.data.length) return done('empty')

          this.postStore.setPosts([...this.postStore.posts, ...data.data.map((v) => new Proxy(v, {}))])
          this.postStore.setPage(data.meta.current_page + 1)

          return done('ok')
        })
    }
  }
}
</script>
