import { defineStore } from 'pinia'
import { DateTime } from 'luxon'
import KFormatter from '@/composables/k-formatter'

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
      this.posts = posts.map((v) => this.mapPost(v))
    },

    /**
     * Add post value
     *
     * @param {*} post
     */
    addPost (post) {
      this.posts.unshift(post)
      this.posts = this.posts.map((v) => this.mapPost(v))
    },

    /**
     * Update post value
     *
     * @param {*} post
     */
    updatePost (post) {
      this.posts = this.posts.map((val) => {
        if (val.id === post.id) return this.mapPost(post)

        return this.mapPost(val)
      })
    },

    /**
     * delete post value
     *
     * @param {*} id
     */
    deletePost (id) {
      this.posts = this.posts.filter((post) => (post.id !== id)).map((v) => this.mapPost(v))
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
