<template>
  <v-card
    flat
    rounded
    :loading="loading"
    :disabled="loading"
  >
    <v-card-text>
      <v-container fluid>
        Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-btn-primary
        type="submit"
        @click="resend"
      >
        Resend verification email
      </v-btn-primary>
    </v-card-actions>

    <v-divider
      class="my-3 mx-10"
      color="grey"
    />

    <v-card-actions class="justify-center">
      <v-btn-primary
        variant="tonal"
        @click="logout"
        color="accent"
      >
        Logout
      </v-btn-primary>
    </v-card-actions>
  </v-card>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { useSnackbarStore } from '@/store/snackbar'
import httpException from '@/composables/http-exception'
import AuthService from '@/composables/auth'
import User from '@/api/auth/user'
import Auth from '@/api/auth/auth'

export default {
  name: 'VerifyEmailForm',
  setup () {
    return {
      v$: useVuelidate(),
      httpException,
      snackbarStore: useSnackbarStore()
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    resend () {
      this.loading = true

      return User.resendVerificationEmail()
        .then(() => {
          this.snackbarStore.open({
            text: 'A new verification link has been sent to the email address you provided during registration.',
            color: 'success'
          })
        })
        .catch(({ response }) => this.httpException(response))
        .finally(() => {
          this.loading = false
        })
    },
    logout () {
      return Auth.logout()
        .then(() => {
          AuthService.flush()
          this.$router.push({ name: 'Login' }).catch(() => {})
        })
        .catch(({ response }) => this.httpException(response))
    }
  }
}
</script>
