<template>
  <v-container fluid>
    <AppGrid>
      <template #center>
        <PostForm />

        <PostList
          :posts="posts"
          :loading="loading"
          @load="load"
          @click:pin="pin"
          @click:unpin="unpin"
          @click:archive="archive"
        />
      </template>
    </AppGrid>
  </v-container>
</template>

<script>
import { computed } from 'vue'
import { usePostStore } from '@/store/post'
import AppGrid from '@/components/default/desktop/AppGrid.vue'
import PostForm from '@/components/post/PostForm.vue'
import PostList from '@/components/post/PostList.vue'
import Post from '@/api/feed/post'
import httpException from '@/composables/http-exception'
import AuthService from '@/composables/auth'
import { analytics } from '@/composables/segment.js'

export default {
  name: 'AppHome',
  components: {
    AppGrid,
    PostForm,
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

    analytics.identify(AuthService.getUser().uuid, {
      name: AuthService.getUser().full_name,
      email: AuthService.getUser().email
    })

    analytics.track('Login', {
      uuid: AuthService.getUser().uuid,
      email: AuthService.getUser().email
    })
  },
  methods: {
    onSearch () {
      return Post.search({ page: this.postStore.page })
        .catch(({ response }) => this.httpException(response))
        .finally(() => this.postStore.setLoading(false))
    },
    async init () {
      if (!AuthService.isAuthenticated() || this.posts.length) return

      this.postStore.setLoading(true)

      await this.onSearch().then(({ data }) => {
        if (!data.data.length) return

        this.postStore.setPosts(data.data.map((v) => new Proxy(v, {})))
        this.postStore.setPage(data.meta.current_page + 1)
      })
    },
    async load ({ done }) {
      if (!AuthService.isAuthenticated() || !this.posts.length) return done('empty')

      await this.onSearch()
        .then(({ data }) => {
          if (!data.data.length) return done('empty')

          this.postStore.setPosts(data.data.map((v) => new Proxy(v, {})))
          this.postStore.setPage(data.meta.current_page + 1)

          return done('ok')
        })
    },

    pin (data) {
      this.postStore.updatePost(data)
    },
    unpin (data) {
      this.postStore.updatePost(data)
    },
    archive (data) {
      this.postStore.deletePost(data)
    }
  }
}
</script>
