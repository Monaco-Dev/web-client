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
      if (vm.$cookies.isKey('token')) {
        await AuthService.setAuth(JSON.parse(atob(vm.$cookies.get('token'))))
        vm.$cookies.remove('token')
        vm.$router.replace({ name: 'Home' })
      }
    })
  }
}
</script>
