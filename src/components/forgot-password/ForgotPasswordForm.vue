<template>
  <v-form @submit.prevent="submit">
    <v-card
      flat
      rounded
      :loading="loading"
      :disabled="loading"
    >
      <v-card-text>
        <v-row>
          <v-col cols="12">
            Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.
          </v-col>

          <v-col cols="12">
            <v-text-field-primary
              v-model="form.email"
              placeholder="Email Address"
              type="email"
              :max-errors="formErrors.email.length"
              :error-messages="formErrors.email"
              @blur="v$.form.email.$touch()"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-btn-primary
          type="submit"
          class="text-none"
        >
          Email password reset link
        </v-btn-primary>
      </v-card-actions>

      <v-divider
        class="mt-3 mx-10"
        color="grey"
      />

      <v-card-actions
        class="justify-center"
        v-if="!isAuthenticated"
      >
        <small class="text-caption text-decoration-none">
          Don't have account yet?
          <a
            href="/register"
            class="text-caption text-decoration-none text-primary"
          >
            Register
          </a>
        </small>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { useSnackbarStore } from '@/store/snackbar'
import { useVuelidate } from '@vuelidate/core'
import { required, email, helpers } from '@vuelidate/validators'
import httpException from '@/composables/http-exception'
import AuthService from '@/composables/auth'
import Auth from '@/api/auth/auth'

export default {
  name: 'ForgotPasswordForm',
  setup () {
    return {
      v$: useVuelidate(),
      httpException,
      snackbarStore: useSnackbarStore()
    }
  },
  data () {
    return {
      loading: false,
      form: {
        email: null
      },
      apiErrors: {
        email: []
      }
    }
  },
  computed: {
    isAuthenticated () {
      return AuthService.isAuthenticated()
    },
    formErrors () {
      return {
        email: this.v$.form.email.$errors.map(v => v.$message).concat(this.apiErrors.email).filter(Boolean)
      }
    }
  },
  watch: {
    'form.email' () {
      if (this.form.email) this.form.email = this.form.email.trim()

      delete this.apiErrors.email
    }
  },
  methods: {
    reset () {
      this.v$.$reset()

      this.loading = false
      this.form = {
        email: null
      }
      this.apiErrors = {
        email: []
      }
    },
    async submit () {
      const result = await this.v$.$validate()
      if (!result) return

      this.loading = true

      return Auth.forgotPassword(this.form)
        .then(() => {
          this.reset()
          this.snackbarStore.open({
            text: 'We have emailed your password reset link.',
            color: 'success'
          })
        })
        .catch(({ response }) => {
          switch (response.status) {
            case 422:
              this.apiErrors = response.data.errors
              break

            default:
              this.httpException(response)
              break
          }
        })
        .finally(() => { this.loading = false })
    }
  },
  validations () {
    return {
      form: {
        email: {
          email,
          required: helpers.withMessage('This field cannot be empty', required)
        }
      }
    }
  }
}
</script>
