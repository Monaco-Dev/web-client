<template>
  <div v-if="loading">
    <v-skeleton-loader
      v-for="num in 2"
      :key="num"
      class="mt-3"
      type="list-item-avatar-two-line, card"
    />
  </div>

  <div v-else>
    <v-infinite-scroll
      height="100%"
      @load="load"
      empty-text="No more result"
      style="overflow-y: hidden"
    >
      <div
        v-for="(post, i) in posts"
        :key="post.id"
      >
        <div :class="{'mt-2': i > 0}">
          <PostItem
            :post="post"
            :border="border"
            :is-archived="isArchived"
            @click:pin="$emit('click:pin', $event)"
            @click:unpin="$emit('click:unpin', $event)"
            @click:archive="$emit('click:archive', $event)"
          />
        </div>
      </div>
    </v-infinite-scroll>
  </div>
</template>

<script>
import PostItem from './PostItem.vue'

export default {
  name: 'PostList',
  components: { PostItem },
  props: {
    posts: {
      type: Array,
      default: Array,
      required: false
    },
    loading: {
      type: Boolean,
      default: false,
      required: false
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
  methods: {
    load (e) {
      this.$emit('load', e)
    }
  }
}
</script>
