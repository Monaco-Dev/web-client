import { defineStore } from 'pinia'
import Post from '@/composables/post'

export const usePostStore = defineStore('post', {
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
     * @param {*} posts
     */
    setPosts (posts = []) {
      this.posts = posts.map((v) => Post.mapPost(v))
    },

    /**
     * Add post value
     *
     * @param {*} post
     */
    addPost (post) {
      this.posts.unshift(post)
      this.posts = this.posts.map((v) => Post.mapPost(v))
    },

    /**
     * Update post value
     *
     * @param {*} post
     */
    updatePost (post) {
      this.posts = this.posts.map((val) => {
        if (val.id === post.id) return Post.mapPost(post)

        return Post.mapPost(val)
      })
    },

    /**
     * delete post value
     *
     * @param {*} id
     */
    deletePost (id) {
      this.posts = this.posts.filter((post) => (post.id !== id)).map((v) => Post.mapPost(v))
    },

    /**
     * Store loading state
     *
     * @param {*} status
     * @param {*} id
     */
    setLoading (status, id = null) {
      if (id) {
        this.posts = this.posts.map((post) => {
          if (post.id === id) post.loading = status

          return post
        })
      } else {
        this.loading = status
      }
    }
  }
})
