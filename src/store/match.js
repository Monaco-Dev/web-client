import { uniqBy } from 'lodash'
import { defineStore } from 'pinia'
import Post from '@/composables/post'

export const useMatchStore = defineStore('match', {
  state: () => ({
    posts: [],
    loading: false,
    page: 1
  }),
  actions: {
    /**
     * Reset post store
     */
    reset () {
      this.posts = []
      this.loading = false
      this.page = 1
    },

    /**
     * Store page value
     *
     * @param {*} page
     */
    setPage (page = 1) {
      this.page = page
    },

    /**
     * Store posts value
     *
     * @param {*} newPosts
     */
    setPosts (newPosts = []) {
      this.posts = uniqBy([...this.posts, ...newPosts.map((v) => Post.mapPost(v))], 'id')
    },

    /**
     * Add post value
     *
     * @param {*} post
     */
    addPost (post) {
      this.posts.unshift(Post.mapPost(post))
      this.posts = uniqBy(this.posts, 'id')
    },

    /**
     * Update post value
     *
     * @param {*} post
     */
    updatePost (post) {
      this.posts = uniqBy(
        this.posts.map((val) => {
          if (val.id === post.id) return Post.mapPost(post)

          return val
        }),
        'id'
      )
    },

    /**
     * delete post value
     *
     * @param {*} id
     */
    deletePost (id) {
      this.posts = uniqBy(this.posts.filter((post) => (post.id !== id)), 'id')
    },

    /**
     * Store loading state
     *
     * @param {*} status
     * @param {*} id
     */
    setLoading (status, id = null) {
      if (id) {
        this.posts = uniqBy(
          this.posts.map((post) => {
            if (post.id === id) post.loading = status

            return post
          }),
          'id'
        )
      } else {
        this.loading = status
      }
    }
  }
})
