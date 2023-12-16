<template>
  <v-container
    fluid
    class="px-0"
  >
    <AppGrid>
      <template #center>
        <v-skeleton-loader
          v-if="loading || !Object.keys(post).length"
          type="list-item-avatar-two-line, card"
        />

        <div v-else>
          <PostItem :post="post" />

          <v-expansion-panels
            v-model="panels"
            class="mt-5"
          >
            <v-expansion-panel
              title="Matches"
              elevation="0"
            >
              <v-expansion-panel-text>
                <PostList
                  :posts="matches.data"
                  @load="load"
                  border
                />
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </template>
    </AppGrid>
  </v-container>
</template>

<script>
import AppGrid from '@/components/default/desktop/AppGrid.vue'
import PostItem from '@/components/post/PostItem.vue'
import PostList from '@/components/post/PostList.vue'
import Post from '@/api/feed/post'
import httpException from '@/composables/http-exception'
import AuthService from '@/composables/auth'
import { usePostStore } from '@/store/post'

export default {
  name: 'PostView',
  components: {
    PostItem,
    PostList,
    AppGrid
  },
  setup () {
    return {
      httpException,
      postStore: usePostStore()
    }
  },
  data () {
    return {
      loading: false,
      post: {},
      panels: [0],
      matches: {
        data: [],
        meta: {
          current_page: 1
        }
      }
    }
  },
  async mounted () {
    await this.getPost()
    await this.getMatches()
  },
  methods: {
    getPost () {
      const uuid = this.$router.currentRoute.value.params.uuid

      this.loading = true

      return Post.show(uuid)
        .then(({ data }) => {
          this.post = this.postStore.mapPost(data)
        })
        .catch(({ response }) => this.httpException(response))
        .finally(() => {
          this.loading = false
        })
    },
    getMatches () {
      this.loading = true

      return Post.searchMatches(this.post.id, { page: this.matches.meta.current_page })
        .then(({ data }) => {
          const posts = data

          posts.data = posts.data.map((v) => this.postStore.mapPost(v))
          posts.meta.current_page = posts.meta.current_page + 1

          this.matches = posts
        })
        .catch(({ response }) => this.httpException(response))
        .finally(() => {
          this.loading = false
        })
    },
    load ({ done }) {
      if (!AuthService.isAuthenticated() || !Object.keys(this.post).length) return done('empty')

      return Post.searchMatches(this.post.id, { page: this.matches.meta.current_page })
        .then(({ data }) => {
          if (!data.data.length) return done('empty')

          const posts = data

          posts.meta.current_page = posts.meta.current_page + 1

          this.matches = {
            ...posts,
            data: [...this.matches.data, ...posts.data.map((v) => this.postStore.mapPost(v))]
          }

          return done('ok')
        })
        .catch(({ response }) => this.httpException(response))
    }
  }
}
</script>
