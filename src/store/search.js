import { defineStore } from 'pinia'
import { uniqBy } from 'lodash'
import Post from '@/composables/post'

/**
 * =======================================
 * Search Store
 * =======================================
 *
 * Handles the dialogs of the application.
 *
 * =======================================
 */

export const useSearchStore = defineStore('search', {
  state: () => ({
    dialog: false,
    search: null,
    loading: false,
    posts: {
      data: [],
      meta: {
        current_page: 1
      }
    },
    users: {
      data: [],
      meta: {
        current_page: 1
      }
    }
  }),
  actions: {
    /**
     * Shows the search dialog.
     *
     */
    openDialog () {
      this.dialog = true
    },

    /**
     * Close the dialog in view.
     *
     */
    closeDialog () {
      this.dialog = false
      this.search = null
      this.reset()
    },

    /**
     * Store search value
     *
     * @param {*} search
     */
    setSearch (search) {
      this.search = search
    },

    /**
     * Store loading state
     *
     * @param {*} status
     */
    setLoading (status) {
      this.loading = status
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
     * Store page value
     *
     * @param {*} page
     */
    setUserPage (page = 1) {
      this.users.meta.current_page = page
    },

    /**
     * Store posts value
     *
     * @param {*} posts
     */
    setPosts (posts = {}) {
      this.posts = { ...posts, data: uniqBy([...this.posts.data, ...posts.data.map((v) => Post.mapPost(v))], 'id') }
    },

    /**
     * Store users value
     *
     * @param {*} users
     */
    setUsers (users = {}) {
      this.users = users
    },

    /**
     * Update post value
     *
     * @param {*} post
     */
    updatePost (post) {
      this.posts.data = uniqBy(
        this.posts.data.map((val) => {
          if (val.id === post.id) return Post.mapPost(post)

          return val
        }),
        'id'
      )
    },

    /**
     * Update user value
     *
     * @param {*} user
     */
    updateUser (user) {
      this.users.data = uniqBy(
        this.users.data.map((val) => {
          if (val.id === user.id) return user

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
      this.posts.data = uniqBy(this.posts.data.filter((post) => (post.id !== id)), 'id')
    },

    /**
     * Reset all forms
     */
    reset () {
      this.search = null
      this.loading = false
      this.posts = {
        data: [],
        meta: {
          current_page: 1
        }
      }
      this.users = {
        data: [],
        meta: {
          current_page: 1
        }
      }
    }
  }
})
