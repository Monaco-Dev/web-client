<template>
  <DesktopView v-if="$vuetify.display.mdAndUp" />
  <MobileView v-else />
</template>

<script>
import DesktopView from './DesktopView.vue'
import MobileView from './MobileView.vue'
import { useSearchStore } from '@/store/search'
import { useTabStore } from '@/store/tab'

export default {
  name: 'LayoutHome',
  components: {
    DesktopView,
    MobileView
  },
  setup () {
    return {
      searchStore: useSearchStore(),
      tabStore: useTabStore()
    }
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      if (to.hash || to.query.search) {
        vm.searchStore.setSearch((to.hash) ? to.hash : to.query.search)
        vm.searchStore.openDialog()
      }
    })
  },
  created () {
    this.$router.beforeEach((to, from, next) => {
      this.tabStore.setTab(to.name)

      if (to.hash || to.query.search) {
        this.searchStore.setSearch((to.hash) ? to.hash : to.query.search)
        this.searchStore.openDialog()
      }

      next()
    })
  }
}
</script>
