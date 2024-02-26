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
          <PostItem
            :post="post"
            @click:pin="pin"
            @click:unpin="unpin"
            @click:archive="archive"
            @click:submit="getPost"
          />

          <v-expansion-panels
            v-if="isAuthenticated && !post.is_shared"
            v-model="panels"
            class="mt-5"
          >
            <v-expansion-panel
              title="Matches"
              elevation="0"
            >
              <v-expansion-panel-text>
                <v-switch
                  v-model="onlyPins"
                  label="Show only pinned"
                  hide-details
                  density="compact"
                  color="primary"
                />

                <PostList
                  :posts="matches"
                  @load="load"
                  border
                  @click:pin="pinMatch"
                  @click:unpin="unpinMatch"
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
import PostService from '@/composables/post'
import { computed } from 'vue'
import { useMatchStore } from '@/store/match'

export default {
  name: 'PostView',
  components: {
    PostItem,
    PostList,
    AppGrid
  },
  setup () {
    const matchStore = useMatchStore()

    const matches = computed(() => matchStore.posts)

    return {
      matchStore,
      matches,
      httpException
    }
  },
  data () {
    return {
      loading: false,
      post: {},
      panels: [0],
      onlyPins: false
    }
  },
  mounted () {
    if (AuthService.isAuthenticated()) this.getPost()
  },
  computed: {
    isAuthenticated () {
      return AuthService.getUser().id === this.post.user_id
    }
  },
  watch: {
    onlyPins () {
      this.getMatches()
    }
  },
  methods: {
    getPost () {
      const uuid = this.$router.currentRoute.value.params.uuid

      this.loading = true

      return Post.show(uuid)
        .then(async ({ data }) => {
          this.post = PostService.mapPost(data)

          if (this.isAuthenticated) await this.getMatches()
        })
        .catch(({ response }) => this.httpException(response))
        .finally(() => {
          this.loading = false
        })
    },
    getMatches () {
      this.matchStore.reset()

      this.loading = true

      return Post.searchMatches(this.post.id,
        {
          page: this.matchStore.page,
          only_pins: this.onlyPins
        })
        .then(({ data }) => {
          if (!data.data.length) return

          this.matchStore.setPosts(data.data.map((v) => new Proxy(v, {})))
          this.matchStore.setPage(data.meta.current_page + 1)
        })
        .catch(({ response }) => this.httpException(response))
        .finally(() => {
          this.loading = false
        })
    },
    load ({ done }) {
      if (!AuthService.isAuthenticated() || !Object.keys(this.post).length) return done('empty')

      return Post.searchMatches(this.post.id, {
        page: this.matchStore.page,
        only_pins: this.onlyPins
      })
        .then(({ data }) => {
          if (!data.data.length) return done('empty')

          this.matchStore.setPosts(data.data.map((v) => new Proxy(v, {})))
          this.matchStore.setPage(data.meta.current_page + 1)

          return done('ok')
        })
        .catch(({ response }) => this.httpException(response))
    },

    pin (data) {
      this.post = PostService.mapPost(data)
    },
    unpin (data) {
      this.post = PostService.mapPost(data)
    },
    archive () {
      this.$router.replace({ name: 'Home' })
    },
    pinMatch (data) {
      this.matchStore.updatePost(data)
    },
    unpinMatch (data) {
      this.matchStore.updatePost(data)

      if (this.onlyPins) this.matchStore.deletePost(data.id)
    }
  }
}
</script>
