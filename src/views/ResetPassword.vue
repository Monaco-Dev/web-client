<template>
  <v-container
    fluid
    class="fill-height"
  >
    <v-row
      justify="center"
      align="center"
    >
      <v-col
        cols="12"
        md="4"
        class="my-5"
      >
        <div class="text-center mb-5">
          <v-img
            :src="require('@/assets/logo-with-text.png')"
            contain
            height="100"
          />
        </div>

        <v-form @submit.prevent="submit">
          <v-card :disabled="loading">
            <v-card-title class="justify-center">
              Reset Password
            </v-card-title>

            <v-card-text class="py-0">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.password"
                      label="New Password"
                      outlined
                      :error-messages="formErrors.password"
                      :type="showPassword ? 'text' : 'password'"
                      dense
                      hide-details="auto"
                      color="black"
                      :append-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                      @blur="$v.form.password.$touch()"
                      @click:append="showPassword = !showPassword"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model="form.password_confirmation"
                      label="Confirm New Password"
                      outlined
                      :error-messages="formErrors.password_confirmation"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      dense
                      hide-details="auto"
                      color="black"
                      :append-icon="showConfirmPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                      @blur="$v.form.password_confirmation.$touch()"
                      @click:append="showConfirmPassword = !showConfirmPassword"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-container class="text-center">
                <v-row
                  no-gutters
                  justify="center"
                  align="center"
                >
                  <v-col
                    cols="12"
                    align-self="center"
                  >
                    <v-btn
                      block
                      rounded
                      type="submit"
                      :loading="loading"
                      class="black primary--text"
                    >
                      Reset Password

                      <v-icon right>
                        mdi-chevron-right
                      </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>

                <v-divider class="my-5" />

                <v-row
                  no-gutters
                  justify="center"
                  align="center"
                >
                  <v-col align-self="center">
                    <v-btn
                      small
                      rounded
                      :to="'/login'"
                    >
                      login now
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import { required, sameAs, minLength, maxLength } from 'vuelidate/lib/validators'

import Auth from '@/api/auth/auth'
import AuthService from '@/composables/auth'
import httpException from '@/mixins/http-exception'

export default {
  mixins: [httpException],
  data () {
    return {
      loading: false,
      form: {
        token: null,
        password: null,
        password_confirmation: null
      },
      showPassword: false,
      showConfirmPassword: false,
      apiErrors: {}
    }
  },
  computed: {
    /**
     * Error messages for form fields.
     */
    formErrors () {
      const errors = {
        password: this.apiErrors.password || [],
        password_confirmation: this.apiErrors.password_confirmation || []
      }

      if (this.$v.form.password.$dirty) {
        this.$v.form.password.required || errors.password.push('The password field is required')
        this.$v.form.password.minLength || errors.password.push('The password must be at least 8 characters')
        this.$v.form.password.maxLength || errors.password.push('The password must not be greater than 16 characters')
      }

      if (this.$v.form.password_confirmation.$dirty) {
        this.$v.form.password_confirmation.required || errors.password_confirmation.push('This field is required')
        this.$v.form.password_confirmation.sameAsPassword || errors.password_confirmation.push('Password does not match')
      }

      return errors
    }
  },
  watch: {
    'form.password' () {
      delete this.apiErrors.password
    },
    'form.password_confirmation' () {
      delete this.apiErrors.password_confirmation
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!to.query.token || !to.query.email) return next(from.path)

      vm.form.token = to.query.token
      vm.form.email = to.query.email

      return next()
    })
  },
  methods: {
    ...mapActions('snackbar', ['showSnackbar']),

    /**
     * Reset form
     */
    reset () {
      this.$v.$reset()

      this.form = {
        token: null,
        email: null,
        password: null,
        password_confirmation: null
      }
      this.apiErrors = {}
      this.loading = false
    },
    /**
     * Submit event trigger
     */
    submit () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.loading = true

        Auth.resetPassword(this.form)
          .then(() => {
            AuthService.flush()
            this.showSnackbar({ message: 'Your password has been changed', top: true, bottom: false })
            this.$router.push({ name: 'Login' }).catch(() => {})
          })
          .catch(({ response }) => {
            this.loading = false

            switch (response.status) {
              case 422:
                this.apiErrors = response.data.errors
                break

              default:
                this.handle(response)
                break
            }
          })
      }
    }
  },
  validations: {
    form: {
      password: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(16)
      },
      password_confirmation: {
        required,
        sameAsPassword: sameAs('password')
      }
    }
  }
}
</script>
