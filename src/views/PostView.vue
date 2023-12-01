<template>
  <v-container
    fluid
    class="px-0"
  >
    <AppGrid @load:center="load">
      <template #center>
        <v-skeleton-loader
          v-if="loading || !Object.keys(post).length"
          type="list-item-avatar-two-line, card"
        />

        <PostItem
          v-else
          :post="post"
        />
      </template>
    </AppGrid>
  </v-container>
</template>

<script>
import AppGrid from '@/components/default/desktop/AppGrid.vue'
import PostItem from '@/components/post/PostItem.vue'
import Post from '@/api/feed/post'
import httpException from '@/composables/http-exception'
import { usePostStore } from '@/store/post'

export default {
  name: 'PostList',
  components: { PostItem, AppGrid },
  setup () {
    return { httpException, postStore: usePostStore() }
  },
  data () {
    return {
      loading: false,
      post: {}
    }
  },
  methods: {
    load ({ done }) {
      if (Object.keys(this.post).length) return done('error')

      const uuid = this.$router.currentRoute.value.params.uuid

      this.loading = true

      return Post.show(uuid)
        .then(({ data }) => {
          this.post = this.postStore.mapPost(data)
          return done('ok')
        })
        .catch(({ response }) => this.httpException(response))
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
