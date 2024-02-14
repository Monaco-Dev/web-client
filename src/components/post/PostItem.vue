<template>
  <v-card
    flat
    rounded
    :loading="item.loading"
    :disabled="item.loading"
    @click.stop="viewPost(item.uuid)"
    :ripple="false"
    density="compact"
    :border="border"
  >
    <template #prepend>
      <v-avatar @click.stop="viewUser(item.user.slug)">
        <v-img
          :src="item.user.avatar_url"
          cover
        />
      </v-avatar>
    </template>

    <template #title>
      <span
        class="text-body-1"
        @click.stop="viewUser(item.user.slug)"
      >
        {{ item.user.full_name }}
      </span>
    </template>

    <template #subtitle>
      <span
        class="text-caption"
        @click.stop="viewUser(item.user.slug)"
      >
        {{ item.timestamp }} {{ item.is_edited ? '&bull; Edited' : null }}
      </span>
    </template>

    <template #append>
      <v-badge
        v-if="item.pinned_at"
        color="secondary"
        icon="mdi-pin"
      >
        <PostActions
          :post="item"
          @loading="setLoading"
          @click:edit="postForm.onEdit()"
          @click:pin="$emit('click:pin', $event)"
          @click:unpin="$emit('click:unpin', $event)"
          @click:archive="$emit('click:archive', $event)"
        />
      </v-badge>

      <PostActions
        v-else
        :post="item"
        @loading="setLoading"
        @click:edit="postForm.onEdit()"
        @click:pin="$emit('click:pin', $event)"
        @click:unpin="$emit('click:unpin', $event)"
        @click:archive="$emit('click:archive', $event)"
      />
    </template>

    <v-card-text @click.stop>
      <div v-if="item.is_shared">
        <v-card
          flat
          rounded
          border
          density="compact"
          @click.stop="viewPost(item.content.uuid)"
          :ripple="false"
        >
          <template #prepend>
            <v-avatar @click.stop="viewUser(item.content.user.slug)">
              <v-img
                :src="item.content.user.avatar_url"
                cover
              />
            </v-avatar>
          </template>

          <template #title>
            <span
              class="text-body-1"
              @click.stop="viewUser(item.content.user.slug)"
            >
              {{ item.content.user.full_name }}
            </span>
          </template>

          <template #subtitle>
            <span
              class="text-caption"
              @click.stop="viewUser(post.content.user.slug)"
            >
              {{ post.content.timestamp }} {{ item.content.is_edited ? '&bull; Edited' : null }}
            </span>
          </template>

          <v-card-text
            @click.stop
            style="cursor: auto"
          >
            <v-chip
              density="compact"
              class="mb-3"
              variant="outlined"
              color="primary"
            >
              {{ item.content.content.type }}
              <v-tooltip
                activator="parent"
                location="top"
              >
                {{ Constants.post.types[item.content.content.type] }}
              </v-tooltip>
            </v-chip>

            <p
              v-if="!item.content.content.hasSummary"
              class="ma-0"
              v-html="item.content.content.body"
            />
            <p
              v-else-if="item.content.content.hasSummary && item.content.content.expanded"
              class="ma-0"
              v-html="item.content.content.body"
            />
            <p
              v-else
              class="ma-0"
              v-html="item.content.content.summary"
            />

            <div
              class="text-center"
              v-if="item.content.content.hasSummary"
            >
              <v-btn
                size="small"
                flat
                variant="tonal"
                class="text-none"
                @click.stop="item.content.content.expanded = !item.content.content.expanded"
              >
                See {{ item.content.content.expanded ? 'less' : 'more' }}
                <v-icon end>
                  {{ item.content.content.expanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                </v-icon>
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </div>

      <div
        v-else
        style="cursor: auto"
      >
        <v-chip
          density="compact"
          class="mb-3"
          variant="outlined"
          color="primary"
        >
          {{ item.content.type }}
          <v-tooltip
            activator="parent"
            location="top"
          >
            {{ Constants.post.types[item.content.type] }}
          </v-tooltip>
        </v-chip>

        <p
          v-if="!item.content.hasSummary"
          class="ma-0"
          v-html="item.content.body"
        />
        <p
          v-else-if="item.content.hasSummary && item.content.expanded"
          class="ma-0"
          v-html="item.content.body"
        />
        <p
          v-else
          class="ma-0"
          v-html="item.content.summary"
        />

        <div
          class="text-center"
          v-if="item.content.hasSummary"
        >
          <v-btn
            size="small"
            flat
            variant="tonal"
            class="text-none"
            @click.stop="item.content.expanded = !item.content.expanded"
          >
            See {{ item.content.expanded ? 'less' : 'more' }}
            <v-icon end>
              {{ item.content.expanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
            </v-icon>
          </v-btn>
        </div>
      </div>
    </v-card-text>

    <v-divider
      class="mx-5"
      v-if="!item.deleted_at"
    />

    <v-card-actions
      class="mx-3"
      v-if="!item.deleted_at"
    >
      <v-btn
        size="small"
        flat
        @click.stop="share"
        class="text-none"
      >
        <v-icon start>
          mdi-share
        </v-icon>
        Share
      </v-btn>

      <v-spacer />

      <v-btn
        v-if="isAuthenticated && !item.is_shared"
        size="small"
        flat
        variant="tonal"
        color="primary"
        class="text-none"
      >
        {{ item.matches_count }} Matches
      </v-btn>
    </v-card-actions>

    <PostForm
      is-edit
      :post="item"
      ref="postForm"
      @click:submit="$emit('click:submit', $event)"
    />
  </v-card>
</template>

<script>
import { useSnackbarStore } from '@/store/snackbar'
import { usePostStore } from '@/store/post'
import { useSearchStore } from '@/store/search'
import { ref } from 'vue'
import AuthService from '@/composables/auth'
import httpException from '@/composables/http-exception'
import PostActions from '@/components/post/PostActions.vue'
import PostForm from '@/components/post/PostForm.vue'
import Post from '@/api/feed/post'
import Constants from '@/config/constants'

export default {
  name: 'PostItem',
  props: {
    post: {
      type: Object,
      default: Object,
      required: true
    },
    border: {
      type: Boolean,
      default: false,
      required: false
    },
    isArchived: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  setup () {
    const postForm = ref(null)

    return {
      httpException,
      snackbarStore: useSnackbarStore(),
      postStore: usePostStore(),
      postForm,
      searchStore: useSearchStore(),
      Constants
    }
  },
  components: { PostActions, PostForm },
  data () {
    return {
      item: {}
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    isAuthenticated () {
      return AuthService.getUser().id === this.post.user_id
    }
  },
  watch: {
    'postStore.posts' () {
      this.init()
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.item = { ...JSON.parse(JSON.stringify(this.post)) }
    },
    setLoading (status) {
      this.item.loading = status
    },
    share () {
      this.setLoading(true)

      return Post.share(this.post.id)
        .then(({ data }) => {
          this.postStore.addPost(data)

          this.snackbarStore.open({
            text: 'You have shared a post successfully.',
            color: 'success'
          })
        })
        .catch(({ response }) => this.httpException(response))
        .finally(() => this.setLoading(false))
    },
    viewPost (uuid) {
      if (this.isArchived) return

      this.searchStore.closeDialog()
      this.searchStore.reset()
      this.$router.push(`/posts/${uuid}`)
    },
    viewUser (slug) {
      this.searchStore.closeDialog()
      this.searchStore.reset()
      this.$router.push(`/profile/${slug}`)
    }
  }
}
</script>
