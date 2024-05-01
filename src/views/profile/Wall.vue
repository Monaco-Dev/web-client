<template>
  <AppGrid>
    <template #center>
      <PostForm v-if="auth" />

      <PostList
        :posts="posts"
        :loading="loading"
        @load="load"
        @click:pin="pin"
        @click:unpin="unpin"
        @click:archive="archive"
        @click:hide="hide"
        @click:unhide="unhide"
      />
    </template>
  </AppGrid>
</template>

<script>
  import { computed } from 'vue'
  import { useProfileStore } from '@/store/profile'
  import { usePostStore } from '@/store/post'
  import AppGrid from '@/components/default/desktop/AppGrid.vue'
  import PostForm from '@/components/post/PostForm.vue'
  import PostList from '@/components/post/PostList.vue'
  import Post from '@/api/feed/post'
  import httpException from '@/composables/http-exception'
  import AuthService from '@/composables/auth'

  export default {
    name: 'ProfileWall',
    components: {
      AppGrid,
      PostForm,
      PostList,
    },
    setup() {
      const profileStore = useProfileStore()
      const postStore = usePostStore()

      const posts = computed(() => postStore.posts)
      const profile = computed(() => profileStore.profile)
      const loading = computed(() => profileStore.loading)

      return {
        httpException,
        postStore,
        profileStore,
        posts,
        profile,
        loading,
      }
    },
    beforeRouteEnter(to, from, next) {
      next(async (vm) => {
        if (vm.profile.id) await vm.init()
      })
    },
    async beforeRouteUpdate(to, from) {
      if (this.profile.id) await this.init()
    },
    computed: {
      auth() {
        return AuthService.getUser()?.uuid === this.profile?.uuid
      },
    },
    methods: {
      onSearch() {
        return Post.searchWall(this.profile.id, { page: this.postStore.page })
          .catch(({ response }) => this.httpException(response))
          .finally(() => this.postStore.setLoading(false))
      },
      async init() {
        this.postStore.reset()

        if (
          !AuthService.isAuthenticated() ||
          !Object.keys(this.profile).length
        ) {
          return
        }

        this.postStore.setLoading(true)

        await this.onSearch().then(({ data }) => {
          if (!data.data.length) return

          const posts = data.data.map((v) => new Proxy(v, {}))

          this.postStore.setPosts(posts)
          this.postStore.setPage(data.meta.current_page + 1)
        })
      },
      async load({ done }) {
        if (!AuthService.isAuthenticated() || !this.postStore.posts.length) {
          return done('empty')
        }

        await this.onSearch().then(({ data }) => {
          if (!data.data.length) return done('empty')

          this.postStore.addPosts(data.data.map((v) => new Proxy(v, {})))
          this.postStore.setPage(data.meta.current_page + 1)

          return done('ok')
        })
      },

      pin(data) {
        this.postStore.updatePost(data)
      },
      unpin(data) {
        this.postStore.updatePost(data)
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
