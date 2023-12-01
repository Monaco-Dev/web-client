<template>
  <AppProgress v-if="loading" />
  <router-view v-else />
</template>

<script>
import { computed } from 'vue'
import { useAppStore } from '@/store/app'
import AppProgress from '@/components/default/AppProgress.vue'

export default {
  components: { AppProgress },
  setup () {
    const appStore = useAppStore()
    const loading = computed(() => appStore.loading)
    return { appStore, loading }
  },
  mounted () {
    // [App.vue specific] When App.vue is finish loading finish the progress bar
    this.appStore.setLoading(false)
  },
  created () {
    // [App.vue specific] When App.vue is first loading start the progress bar
    this.appStore.setLoading(true)
    // hook the progress bar to start before we move router-view
    this.$router.beforeEach((to, from, next) => {
      // start the progress bar
      this.appStore.setLoading(true)
      // continue to next page
      next()
    })
    // hook the progress bar to finish after we've finished moving router-view
    this.$router.afterEach(() => this.appStore.setLoading(false))
  }
}
</script>

<style>
html {
  overflow-y: auto;
}
</style>
