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
      <v-avatar
        color="grey"
        @click.stop="viewUser(item.user.uuid)"
      >
        <v-img
          v-if="item?.user?.avatar_url"
          :src="item?.user?.avatar_url"
          cover
          :alt="item?.user?.full_name"
        />
        <span
          class="text-white"
          v-else
        >
          {{ item?.user?.first_name?.charAt(0) }}{{ item?.user?.last_name?.charAt(0) }}
        </span>
      </v-avatar>
    </template>

    <template #title>
      <span
        class="text-body-1"
        @click.stop="viewUser(item.user.uuid)"
      >
        {{ item?.user?.full_name }}
      </span>
    </template>

    <template #subtitle>
      <span
        class="text-caption"
        @click.stop="viewUser(item?.user?.uuid)"
      >
        {{ item?.timestamp }} {{ item?.is_edited ? '&bull; Edited' : null }}
      </span>
    </template>

    <template #append>
      <v-badge
        v-if="item?.pinned_at"
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
          @click:restore="$emit('click:restore', $event)"
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
        @click:restore="$emit('click:restore', $event)"
      />
    </template>

    <v-card-text @click.stop>
      <div v-if="item?.is_shared">
        <v-card
          flat
          rounded
          border
          density="compact"
          @click.stop="viewPost(item?.shared_post?.uuid)"
          :ripple="false"
        >
          <template #prepend>
            <v-avatar
              color="grey"
              @click.stop="viewUser(item?.shared_post?.user.uuid)"
            >
              <v-img
                v-if="item?.shared_post?.user?.avatar_url"
                :src="item?.shared_post?.user?.avatar_url"
                cover
                :alt="item?.shared_post?.user?.full_name"
              />
              <span
                class="text-white"
                v-else
              >
                {{ item?.shared_post?.user?.first_name?.charAt(0) }}{{ item?.shared_post?.user?.last_name?.charAt(0) }}
              </span>
            </v-avatar>
          </template>

          <template #title>
            <span
              class="text-body-1"
              @click.stop="viewUser(item?.shared_post?.user?.uuid)"
            >
              {{ item?.shared_post?.user?.full_name }}
            </span>
          </template>

          <template #subtitle>
            <span
              class="text-caption"
              @click.stop="viewUser(item?.shared_post?.user?.uuid)"
            >
              {{ item?.shared_post?.timestamp }} {{ item?.shared_post?.is_edited ? '&bull; Edited' : null }}
            </span>
          </template>

          <v-card-text
            @click.stop
            style="cursor: auto"
          >
            <PostContent
              :tags="item?.tags"
              :content="item?.shared_post.content"
              @click:seeMore="item.shared_post.content.expanded = !item.shared_post.content.expanded"
            />
          </v-card-text>
        </v-card>
      </div>

      <div
        v-else
        style="cursor: auto"
      >
        <PostContent
          :content="item?.content"
          :tags="item?.tags"
          @click:seeMore="item.content.expanded = !item.content.expanded"
        />
      </div>
    </v-card-text>

    <v-divider
      class="mx-5"
      v-if="!item?.deleted_at"
    />

    <v-card-actions
      class="mx-3"
      v-if="!item?.deleted_at"
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
        {{ (!item?.is_shared) ? item?.shares_count : null }} Shares
      </v-btn>

      <v-spacer />

      <v-btn
        v-if="isAuthenticated && !item?.is_shared"
        size="small"
        flat
        color="primary"
        class="text-none"
      >
        {{ item?.matches_count }} Matches
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
import PostActions from '@/components/post/PostActions.vue'
import AuthService from '@/composables/auth'
import httpException from '@/composables/http-exception'
import Post from '@/api/feed/post'
import PostForm from '@/components/post/PostForm.vue'
import PostContent from '@/components/post/PostContent.vue'

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
      searchStore: useSearchStore()
    }
  },
  components: { PostActions, PostForm, PostContent },
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
    post () {
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
          this.snackbarStore.open({
            text: 'You have shared a post successfully.',
            color: 'success'
          })

          this.postStore.addPost(data)
          this.postStore.updatePost(data.shared_post)
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
    viewUser (uuid) {
      this.searchStore.closeDialog()
      this.searchStore.reset()
      this.$router.push(`/profile/${uuid}`)
    }
  }
}
</script>
