<template>
  <v-row justify="center">
    <v-col
      md="5"
      lg="4"
    >
      <LoginForm />
    </v-col>
  </v-row>
</template>

<script>
import { computed } from 'vue'
import { useAppStore } from '@/store/app'
import LoginForm from '@/components/login/LoginForm.vue'
import AuthService from '@/composables/auth'
import httpException from '@/composables/http-exception'

export default {
  name: 'LoginPage',
  components: { LoginForm },
  setup () {
    const appStore = useAppStore()
    const loading = computed(() => appStore.loading)

    return { appStore, loading, httpException }
  },
  beforeRouteEnter (to, from, next) {
    next(async (vm) => {
      if (Object.keys(to.query).includes('id') && Object.keys(to.query).includes('driver')) {
        vm.appStore.setLoading(true)

        await AuthService.socialite(to.query.id, to.query.driver)
          .then(({ data }) => {
            AuthService.setAuth(data)
            vm.$router.replace('/')
          })
          .catch(({ response }) => vm.httpException(response))
          .finally(() => vm.appStore.setLoading(false))
      }
    })
  }
}
</script>
