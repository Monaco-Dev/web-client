// Utilities
import { defineStore } from 'pinia'

export const useTabStore = defineStore('tab', {
  state: () => ({
    tab: null
  }),
  actions: {
    setTab (tab) {
      this.tab = tab
    }
  }
})
