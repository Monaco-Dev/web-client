<template>
  <v-row justify="center">
    <v-col
      md="5"
      lg="4"
    >
      <LoginForm ref="loginForm" />
    </v-col>
  </v-row>
</template>

<script>
import { ref } from 'vue'
import LoginForm from '@/components/login/LoginForm.vue'
import AuthService from '@/composables/auth'
import httpException from '@/composables/http-exception'

export default {
  name: 'LoginPage',
  components: { LoginForm },
  setup () {
    return { httpException, loginForm: ref(null) }
  },
  beforeRouteEnter (to, from, next) {
    next(async (vm) => {
      if (vm.$cookies.isKey('token')) {
        vm.$refs.loginForm.loading = true
        await AuthService.setAuth(JSON.parse(atob(vm.$cookies.get('token'))))
        vm.$refs.loginForm.loading = false
        vm.$cookies.remove('token')
        vm.$router.replace({ name: 'Home' })
      }
    })
  }
}
</script>
