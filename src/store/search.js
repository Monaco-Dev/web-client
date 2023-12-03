/**
 * =======================================
 * Search Store
 * =======================================
 *
 * Handles the dialogs of the application.
 *
 * =======================================
 */

import { defineStore } from 'pinia'
import { DateTime } from 'luxon'
import KFormatter from '@/composables/k-formatter'

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
      this.posts = { ...posts, data: posts.data.map((v) => this.mapPost(v)) }
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
      this.posts.data = this.posts.data.map((val) => {
        if (val.id === post.id) return this.mapPost(post)

        return this.mapPost(val)
      })
    },

    /**
     * Update user value
     *
     * @param {*} user
     */
    updateUser (user) {
      this.users.data = this.users.data.map((val) => {
        if (val.id === user.id) return user

        return val
      })
    },

    /**
     * delete post value
     *
     * @param {*} id
     */
    deletePost (id) {
      this.posts.data = this.posts.data.filter((post) => (post.id !== id)).map((v) => this.mapPost(v))
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
    },

    /**
     * Prepare post item
     *
     * @param {*} post
     * @return {*}
     */
    mapPost (post) {
      post.timestamp = DateTime.fromISO(post.created_at).toRelative()
      post.matches_count = KFormatter(post.matches_count ?? 0)
      post.loading = false

      if (post.is_shared) {
        post.content.content.hasSummary = false
        post.content.timestamp = DateTime.fromISO(post.content.created_at).toRelative()

        const summary = post.content.content.body.slice(0, 500)

        if (summary.length === 500) {
          post.content.content.hasSummary = true
          post.content.content.summary = summary + '...'
          post.content.content.summary = post.content.content.summary.replace(/\n/g, '<br/>')
          post.content.content.expanded = false

          const summaryTags = post.content.content.summary.match(/#\w+/g) ?? []
          summaryTags.forEach(tag => {
            post.content.content.summary = post.content.content.summary.replace(tag, `<a href="#">${tag}</a>`)
          })
        }

        post.content.content.original_body = post.content.content.body
        post.content.content.body = post.content.content.body.replace(/\n/g, '<br/>')

        const bodyTags = post.content.content.body.match(/#\w+/g) ?? []

        bodyTags.forEach(tag => {
          post.content.content.body = post.content.content.body.replace(tag, `<a href="#">${tag}</a>`)
        })
      } else {
        post.content.hasSummary = false

        const summary = post.content.body.slice(0, 500)

        if (summary.length === 500) {
          post.content.hasSummary = true
          post.content.summary = summary + '...'
          post.content.summary = post.content.summary.replace(/\n/g, '<br/>')
          post.content.expanded = false

          const summaryTags = post.content.summary.match(/#\w+/g) ?? []
          summaryTags.forEach(tag => {
            post.content.summary = post.content.summary.replace(tag, `<a href="#">${tag}</a>`)
          })
        }

        post.content.original_body = post.content.body
        post.content.body = post.content.body.replace(/\n/g, '<br/>')

        const bodyTags = post.content.body.match(/#\w+/g) ?? []

        bodyTags.forEach(tag => {
          post.content.body = post.content.body.replace(tag, `<a href="#">${tag}</a>`)
        })
      }

      return post
    }
  }
})
