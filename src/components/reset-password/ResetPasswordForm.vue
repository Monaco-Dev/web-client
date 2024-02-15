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
            <v-text-field-primary
              :append-inner-icon="showPsw ? 'mdi-eye-off' : 'mdi-eye'"
              v-model="form.password"
              placeholder="Password"
              :type="showPsw ? 'text' : 'password'"
              :max-errors="formErrors.password.length"
              :error-messages="formErrors.password"
              @blur="v$.form.password.$touch()"
              @click:append-inner="showPsw = !showPsw"
              messages="Min. 8 and max. 16 characters with at least one capital letter, one small letter, a number, and a special character"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field-primary
              :append-inner-icon="showPswConf ? 'mdi-eye-off' : 'mdi-eye'"
              v-model="form.password_confirmation"
              placeholder="Confirm Password"
              :type="showPswConf ? 'text' : 'password'"
              :max-errors="formErrors.password_confirmation.length"
              :error-messages="formErrors.password_confirmation"
              @blur="v$.form.password_confirmation.$touch()"
              @click:append-inner="showPswConf = !showPswConf"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-btn-primary
          type="submit"
          class="text-none"
        >
          Reset Password
        </v-btn-primary>
      </v-card-actions>

      <v-divider
        class="mt-3 mx-10"
        color="grey"
      />

      <v-card-actions class="justify-center">
        <small class="text-caption text-decoration-none">
          Already have account?
          <a
            href="/login"
            class="text-caption text-decoration-none text-primary"
          >
            Log in
          </a>
        </small>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import {
  required,
  sameAs,
  minLength,
  maxLength,
  helpers
} from '@vuelidate/validators'
import { useSnackbarStore } from '@/store/snackbar'
import httpException from '@/composables/http-exception'
import Auth from '@/api/auth/auth'

export default {
  name: 'ResetPasswordForm',
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
      showPsw: false,
      showPswConf: false,
      form: {
        token: null,
        email: null,
        password: null,
        password_confirmation: null
      },
      apiErrors: {
        password: [],
        password_confirmation: []
      }
    }
  },
  computed: {
    formErrors () {
      return {
        password: this.v$.form.password.$errors.map(v => v.$message).concat(this.apiErrors.password).filter(Boolean),
        password_confirmation: this.v$.form.password_confirmation.$errors.map(v => v.$message).concat(this.apiErrors.password_confirmation).filter(Boolean)
      }
    }
  },
  watch: {
    'form.password' () {
      if (this.form.password) this.form.password = this.form.password.trim()

      delete this.apiErrors.password
    },
    'form.password_confirmation' () {
      if (this.form.password_confirmation) this.form.password_confirmation = this.form.password_confirmation.trim()

      delete this.apiErrors.password_confirmation
    }
  },
  methods: {
    reset () {
      this.v$.$reset()

      this.loading = false
      this.showPsw = false
      this.showPswConf = false
      this.form = {
        token: null,
        email: null,
        password: null,
        password_confirmation: null
      }
      this.apiErrors = {
        password: [],
        password_confirmation: []
      }
    },
    async submit () {
      const result = await this.v$.$validate()
      if (!result) return

      this.loading = true

      const { email, token } = this.$router.currentRoute.value.query
      this.form.email = email
      this.form.token = token

      return Auth.resetPassword(this.form)
        .then(() => {
          this.reset()
          this.$router.push({ name: 'Login' }).catch(() => {})
          this.snackbarStore.open({
            text: 'Your password has been changed successfully.',
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
        password: {
          minLength: minLength(8),
          maxLength: maxLength(16),
          required: helpers.withMessage('This field cannot be empty', required)
        },
        password_confirmation: {
          sameAsPassword: sameAs(this.form.password),
          required: helpers.withMessage('This field cannot be empty', required)
        }
      }
    }
  }
}
</script>
