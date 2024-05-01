<template>
  <v-container
    fluid
    class="px-0"
  >
    <AppGrid>
      <template #center>
        <PostList
          :posts="posts"
          :loading="loading"
          @load="load"
          @click:unpin="unpin"
          @click:archive="archive"
          @click:hide="hide"
          @click:unhide="unhide"
        />
      </template>
    </AppGrid>
  </v-container>
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
    name: 'PinsView',
    components: {
      AppGrid,
      PostList,
    },
    setup() {
      const postStore = usePostStore()

      const posts = computed(() => postStore.posts)
      const loading = computed(() => postStore.loading)

      return {
        httpException,
        postStore,
        posts,
        loading,
      }
    },
    mounted() {
      this.postStore.reset()
      this.init()
    },
    methods: {
      onSearch() {
        return Post.searchPins({ page: this.postStore.page })
          .catch(({ response }) => this.httpException(response))
          .finally(() => this.postStore.setLoading(false))
      },
      async init() {
        if (!AuthService.isAuthenticated() || this.posts.length) return

        this.postStore.setLoading(true)

        await this.onSearch().then(({ data }) => {
          if (!data.data.length) return

          this.postStore.setPosts(data.data.map((v) => new Proxy(v, {})))
          this.postStore.setPage(data.meta.current_page + 1)
        })
      },
      async load({ done }) {
        if (!AuthService.isAuthenticated() || !this.posts.length)
          return done('empty')

        if (!this.postStore.posts.length) this.postStore.setLoading(true)

        await this.onSearch().then(({ data }) => {
          if (!data.data.length) return done('empty')

          this.postStore.addPosts(data.data.map((v) => new Proxy(v, {})))
          this.postStore.setPage(data.meta.current_page + 1)

          return done('ok')
        })
      },

      unpin(data) {
        this.postStore.deletePost(data)
      },
      archive(data) {
        this.postStore.deletePost(data)
      },
      hide(data) {
        this.postStore.deletePost(data)
      },
      unhide(data) {
        this.postStore.updatePost(data)
      },
    },
  }
</script>
