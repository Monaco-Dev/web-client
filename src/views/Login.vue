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
import { useAppStore } from '@/store/app'
import LoginForm from '@/components/login/LoginForm.vue'
import AuthService from '@/composables/auth'
import httpException from '@/composables/http-exception'

export default {
  name: 'LoginPage',
  components: { LoginForm },
  setup () {
    const appStore = useAppStore()

    return { appStore, httpException }
  },
  beforeRouteEnter (to, from, next) {
    next(async (vm) => {
      if (vm.$cookies.isKey('token')) {
        vm.appStore.setLoading(true)
        await AuthService.setAuth(JSON.parse(atob(vm.$cookies.get('token'))))
        vm.appStore.setLoading(false)
        vm.$cookies.remove('token')
        vm.$router.replace({ name: 'Home' })
      }
    })
  }
}
</script>
