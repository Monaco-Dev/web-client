import { defineStore } from 'pinia'

/**
 * =======================================
 * Network Store
 * =======================================
 *
 * Handles the dialogs of the application.
 *
 * =======================================
 */

export const useNetworkStore = defineStore('network', {
  state: () => ({
    loading: false,
    users: {
      data: [],
      meta: {
        current_page: 1
      }
    }
  }),
  actions: {
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
    setUserPage (page = 1) {
      this.users.meta.current_page = page
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
     * Reset all forms
     */
    reset () {
      this.loading = false
      this.users = {
        data: [],
        meta: {
          current_page: 1
        }
      }
    }
  }
})
