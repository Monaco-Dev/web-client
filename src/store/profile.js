import { defineStore } from 'pinia'
import Post from '@/composables/post'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    loading: false,
    profile: {},
    posts: {
      data: [],
      meta: {
        current_page: 1
      }
    }
  }),
  actions: {
    /**
     * Reset profile store
     */
    reset () {
      this.loading = false
      this.profile = {}
      this.posts = {
        data: [],
        meta: {
          current_page: 1
        }
      }
    },

    /**
     * Store profile value
     *
     * @param {*} profile
     */
    setProfile (profile) {
      this.profile = profile
    },

    /**
     * Store page value
     *
     * @param {*} page
     */
    setPostPage (page = 1) {
      this.posts.meta.current_page = page
    },

    /**
     * Store posts value
     *
     * @param {*} posts
     */
    setPosts (posts = {}) {
      this.posts = { ...posts, data: posts.data.map((v) => Post.mapPost(v)) }
    },

    /**
     * Add post value
     *
     * @param {*} post
     */
    addPost (post) {
      this.posts.data.unshift(post)
      this.posts.data = this.posts.data.map((v) => Post.mapPost(v))
    },

    /**
     * Update post value
     *
     * @param {*} post
     */
    updatePost (post) {
      this.posts.data = this.posts.data.map((val) => {
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
      this.posts.data = this.posts.data.filter((post) => (post.id !== id)).map((v) => Post.mapPost(v))
    },

    /**
     * Store loading state
     *
     * @param {*} status
     * @param {*} id
     */
    setLoading (status, id = null) {
      if (id) {
        this.posts.data = this.posts.data.map((post) => {
          if (post.id === id) post.loading = status

          return post
        })
      } else {
        this.loading = status
      }
    }
  }
})
