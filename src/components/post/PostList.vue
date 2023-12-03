<template>
  <div v-if="loading">
    <v-skeleton-loader
      v-for="num in 2"
      :key="num"
      class="my-3"
      type="list-item-avatar-two-line, card"
    />
  </div>

  <div v-else>
    <div
      v-for="(post) in posts"
      :key="post.id"
    >
      <PostItem
        :post="post"
        class="my-3"
      />
    </div>
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
    }
  }
}
</script>
