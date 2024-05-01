import { defineStore } from 'pinia'
import User from '@/api/auth/user'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    loading: false,
    profile: {},
  }),
  actions: {
    /**
     * Reset profile store
     */
    reset() {
      this.loading = false
      this.profile = {}
    },

    /**
     * Store profile value
     *
     * @param {*} profile
     */
    setProfile(profile) {
      this.profile = profile
    },

    /**
     * Store loading state
     *
     * @param {*} status
     * @param {*} id
     */
    setLoading(status, id = null) {
      if (id) {
        this.posts.data = this.posts.data.map((post) => {
          if (post.id === id) post.loading = status

          return post
        })
      } else {
        this.loading = status
      }
    },

    /**
     * Fetch user profile
     *
     * @param * uuid
     */
    getProfile(uuid) {
      this.setLoading(true)

      return User.show(uuid)
        .then(({ data }) => this.setProfile(data))
        .finally(() => this.setLoading(false))
    },
  },
})
