<template>
  <v-app>
    <AppHeader />

    <v-main>
      <router-view />

      <PostForm
        floating
        ref="form"
      />
    </v-main>

    <AppBottomNavigation @click:form="openForm" />

    <AlertDialog />
    <ConfirmationDialog />
    <AppSnackbar />
    <SearchDialog />
  </v-app>
</template>

<script>
import { ref } from 'vue'
import AppHeader from '@/components/default/mobile/AppHeader.vue'
import AppBottomNavigation from '@/components/default/mobile/AppBottomNavigation.vue'
import SearchDialog from '@/components/search/SearchDialog.vue'
import AlertDialog from '@/components/default/AlertDialog.vue'
import ConfirmationDialog from '@/components/default/ConfirmationDialog.vue'
import AppSnackbar from '@/components/default/AppSnackbar.vue'
import PostForm from '@/components/post/PostForm.vue'

export default {
  components: {
    AppHeader,
    AppBottomNavigation,
    SearchDialog,
    AlertDialog,
    ConfirmationDialog,
    AppSnackbar,
    PostForm
  },
  setup () {
    return {
      form: ref(null)
    }
  },
  methods: {
    openForm () {
      this.$refs.form.dialog = true
    }
  }
}
</script>
