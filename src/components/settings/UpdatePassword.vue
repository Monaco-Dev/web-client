<template>
  <v-form @submit.prevent="submit">
    <v-card
      flat
      rounded
      title="Update password"
    >
      <template #prepend>
        <div />
      </template>

      <v-card-text class="ma-3 pa-0">
        <v-row justify="center">
          <v-col
            cols="12"
            md="6"
          >
            <v-row>
              <v-col cols="12">
                <v-text-field-primary
                  label="Current Password"
                  :type="showCurrentPsw ? 'text' : 'password'"
                  v-model="form.current_password"
                  :append-inner-icon="showCurrentPsw ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showCurrentPsw = !showCurrentPsw"
                  :max-errors="formErrors.current_password.length"
                  :error-messages="formErrors.current_password"
                  @blur="v$.form.current_password.$touch()"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field-primary
                  label="New Password"
                  :type="showPsw ? 'text' : 'password'"
                  v-model="form.password"
                  :append-inner-icon="showPsw ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPsw = !showPsw"
                  messages="Min. 8 and max. 16 characters with at least one capital letter, one small letter, a number, and a special character"
                  :max-errors="formErrors.password.length"
                  :error-messages="formErrors.password"
                  @blur="v$.form.password.$touch()"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field-primary
                  label="Confirm New Password"
                  :type="showPswConf ? 'text' : 'password'"
                  v-model="form.password_confirmation"
                  :append-inner-icon="showPswConf ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPswConf = !showPswConf"
                  :max-errors="formErrors.password_confirmation.length"
                  :error-messages="formErrors.password_confirmation"
                  @blur="v$.form.password_confirmation.$touch()"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="ma-3 pa-0">
        <v-row justify="center">
          <v-col
            cols="12"
            md="3"
          >
            <v-btn-primary type="submit">
              save changes
            </v-btn-primary>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import {
  required,
  maxLength,
  minLength,
  sameAs,
  helpers
} from '@vuelidate/validators'
import { useSnackbarStore } from '@/store/snackbar'
import httpException from '@/composables/http-exception'
import User from '@/api/auth/user'
import AuthService from '@/composables/auth'

export default {
  name: 'UpdatePassword',
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
      showCurrentPsw: false,
      showPsw: false,
      showPswConf: false,
      form: {
        email: null,
        current_password: null,
        password: null,
        password_confirmation: null
      },
      apiErrors: {
        current_password: [],
        password: [],
        password_confirmation: []
      }
    }
  },
  mounted () {
    if (AuthService.isAuthenticated()) this.reset()
  },
  computed: {
    formErrors () {
      return {
        current_password: this.v$.form.current_password.$errors.map(v => v.$message).concat(this.apiErrors.current_password).filter(Boolean),
        password: this.v$.form.password.$errors.map(v => v.$message).concat(this.apiErrors.password).filter(Boolean),
        password_confirmation: this.v$.form.password_confirmation.$errors.map(v => v.$message).concat(this.apiErrors.password_confirmation).filter(Boolean)
      }
    }
  },
  watch: {
    'form.current_password' () {
      if (this.form.current_password) this.form.current_password = this.form.current_password.trim()

      delete this.apiErrors.password
    },
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
      this.showCurrentPsw = false
      this.showPsw = false
      this.showPswConf = false
      this.form = {
        email: AuthService.getUser().email,
        current_password: null,
        password: null,
        password_confirmation: null
      }
      this.apiErrors = {
        current_password: [],
        password: [],
        password_confirmation: []
      }
    },
    async submit () {
      const result = await this.v$.$validate()
      if (!result) return

      this.loading = true

      return User.updatePassword(this.form)
        .then(({ data }) => {
          AuthService.setUser(data)
          this.reset()
          this.snackbarStore.open({
            text: 'Your password has been updated successfully.',
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
        current_password: {
          minLength: minLength(8),
          maxLength: maxLength(16),
          required: helpers.withMessage('This field cannot be empty', required)
        },
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
