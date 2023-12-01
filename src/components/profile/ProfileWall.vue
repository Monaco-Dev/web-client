<template>
  <AppGrid @load:center="load">
    <template #center>
      <PostForm v-if="auth" />
      <PostList
        :class="{'mt-2': auth}"
        :posts="posts.data"
        :loading="loading"
      />
    </template>
  </AppGrid>
</template>

<script>
import { computed } from 'vue'
import { useProfileStore } from '@/store/profile'
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
      profileStore,
      posts,
      profile,
      loading
    }
  },
  computed: {
    auth () {
      return AuthService.getUser().slug === this.profile.slug
    }
  },
  methods: {
    load ({ done }) {
      if (!Object.keys(this.profile).length) return done('error')

      if (!this.posts.data.length) this.profileStore.setLoading(true)

      return Post.searchWall(this.profile.id, { page: this.posts.meta.current_page })
        .then(({ data }) => {
          if (!data.data.length) return done('empty')

          const posts = data

          posts.data = [...this.posts.data, ...data.data.map((v) => new Proxy(v, {}))]

          this.profileStore.setPosts(posts)
          this.profileStore.setPostPage(data.meta.current_page + 1)

          return done('ok')
        })
        .catch(({ response }) => this.httpException(response))
        .finally(() => this.profileStore.setLoading(false))
    }
  }
}
</script>
