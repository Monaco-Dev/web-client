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
    <PostItem
      v-for="(post) in posts"
      :key="post.id"
      :post="post"
      class="my-3"
    />
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
      default: Boolean,
      required: false
    }
  }
}
</script>
