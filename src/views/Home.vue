<template>
  <v-container
    fluid
    class="px-0"
  >
    <AppGrid @load:center="load">
      <template #center>
        <PostForm />
        <PostList
          class="mt-2"
          :posts="posts"
          :loading="loading"
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
  methods: {
    load ({ done }) {
      if (!AuthService.isAuthenticated()) return done('empty')

      if (!this.postStore.posts.length) this.postStore.setLoading(true)

      return Post.search({ page: this.postStore.page })
        .then(({ data }) => {
          if (!data.data.length) return done('empty')

          this.postStore.setPosts([...this.postStore.posts, ...data.data.map((v) => new Proxy(v, {}))])
          this.postStore.setPage(data.meta.current_page + 1)

          return done('ok')
        })
        .catch(({ response }) => this.httpException(response))
        .finally(() => this.postStore.setLoading(false))
    }
  }
}
</script>
