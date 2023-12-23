<template>
  <AppGrid>
    <template #center>
      <PostForm v-if="auth" />

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
    PostList
  },
  setup () {
    const profileStore = useProfileStore()

    const posts = computed(() => profileStore.posts)
    const profile = computed(() => profileStore.profile)
    const loading = computed(() => profileStore.loading)

    return {
      httpException,
      postStore: usePostStore(),
      profileStore,
      posts,
      profile,
      loading
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    auth () {
      return AuthService.getUser().slug === this.profile?.slug
    }
  },
  watch: {
    profile () {
      this.init()
    }
  },
  methods: {
    onSearch () {
      return Post.searchWall(this.profile.id, { page: this.posts.meta.current_page })
        .catch(({ response }) => this.httpException(response))
        .finally(() => {
          this.postStore.setLoading(false)
          this.profileStore.setLoading(false)
        })
    },
    async init () {
      if (
        !AuthService.isAuthenticated() ||
        !Object.keys(this.profile).length ||
        this.posts.data.length
      ) return

      this.postStore.setLoading(true)
      this.profileStore.setLoading(true)

      await this.onSearch().then(({ data }) => {
        if (!data.data.length) return

        const posts = data

        posts.data = data.data.map((v) => new Proxy(v, {}))

        this.profileStore.setPosts(posts)
        this.profileStore.setPostPage(data.meta.current_page + 1)
      })
    },
    async load ({ done }) {
      if (!AuthService.isAuthenticated() || !Object.keys(this.profile).length) return done('empty')

      await this.onSearch().then(({ data }) => {
        if (!data.data.length) return done('empty')

        const posts = data

        posts.data = [...this.posts.data, ...data.data.map((v) => new Proxy(v, {}))]

        this.profileStore.setPosts(posts)
        this.profileStore.setPostPage(data.meta.current_page + 1)

        return done('ok')
      })
    }
  }
}
</script>
