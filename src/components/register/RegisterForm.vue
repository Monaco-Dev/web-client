<template>
  <v-form @submit.prevent="submit">
    <v-card
      flat
      rounded
      :loading="loading"
      :disabled="loading"
    >
      <v-card-text class="pa-0 ma-3">
        <v-row>
          <v-col
            md="6"
            cols="12"
          >
            <v-text-field-primary
              v-model="form.first_name"
              placeholder="First Name"
              :max-errors="formErrors.first_name.length"
              :error-messages="formErrors.first_name"
              @blur="v$.form.first_name.$touch()"
            />
          </v-col>

          <v-col
            md="6"
            cols="12"
          >
            <v-text-field-primary
              v-model="form.last_name"
              placeholder="Last Name"
              :max-errors="formErrors.last_name.length"
              :error-messages="formErrors.last_name"
              @blur="v$.form.last_name.$touch()"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field-primary
              v-model="form.phone_number"
              placeholder="Phone Number"
              :max-errors="formErrors.phone_number.length"
              :error-messages="formErrors.phone_number"
              @blur="v$.form.phone_number.$touch()"
            />
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

          <v-col cols="12">
            <v-checkbox-primary
              v-model="form.agreement"
              color="primary"
              :error-messages="formErrors.agreement"
              @blur="v$.form.agreement.$touch()"
              class="text-caption text-decoration-none"
            >
              <template #label>
                <small>
                  I agree to the
                  <a
                    class="text-caption text-decoration-none text-primary"
                    target="_blank"
                    href="https://google.com"
                    @click.stop
                  >
                    Terms
                  </a>
                  and
                  <a
                    class="text-caption text-decoration-none text-primary"
                    target="_blank"
                    href="https://google.com"
                    @click.stop
                  >
                    Privacy Policy
                  </a>
                </small>
              </template>
            </v-checkbox-primary>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="pa-0 ma-3">
        <v-btn-primary
          type="submit"
          class="text-none"
        >
          Register
        </v-btn-primary>
      </v-card-actions>

      <v-row
        wrap
        no-gutters
      >
        <v-col
          cols="5"
          class="text-center"
        >
          <v-divider class="mt-3 ml-10" />
        </v-col>
        <v-col
          cols="2"
          class="text-center text-caption"
        >
          OR
        </v-col>
        <v-col
          cols="5"
          class="text-center"
        >
          <v-divider class="mt-3 mr-10" />
        </v-col>
      </v-row>

      <Socialite />

      <v-divider
        class="mt-8 mx-10"
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
  maxLength,
  minLength,
  numeric,
  email,
  sameAs,
  helpers
} from '@vuelidate/validators'
import AuthService from '@/composables/auth'
import Auth from '@/api/auth/auth'
import httpException from '@/composables/http-exception'
import Socialite from '@/components/login/Socialite.vue'

export default {
  name: 'RegisterForm',
  components: { Socialite },
  setup () {
    return {
      v$: useVuelidate(),
      httpException
    }
  },
  data () {
    return {
      loading: false,
      showPsw: false,
      showPswConf: false,
      form: {
        first_name: null,
        last_name: null,
        phone_number: null,
        email: null,
        password: null,
        password_confirmation: null,
        agreement: false
      },
      apiErrors: {
        first_name: [],
        last_name: [],
        phone_number: [],
        email: [],
        password: [],
        password_confirmation: []
      }
    }
  },
  computed: {
    formErrors () {
      return {
        first_name: this.v$.form.first_name.$errors.map(v => v.$message).concat(this.apiErrors.first_name).filter(Boolean),
        last_name: this.v$.form.last_name.$errors.map(v => v.$message).concat(this.apiErrors.last_name).filter(Boolean),
        phone_number: this.v$.form.phone_number.$errors.map(v => v.$message).concat(this.apiErrors.phone_number).filter(Boolean),
        email: this.v$.form.email.$errors.map(v => v.$message).concat(this.apiErrors.email).filter(Boolean),
        password: this.v$.form.password.$errors.map(v => v.$message).concat(this.apiErrors.password).filter(Boolean),
        password_confirmation: this.v$.form.password_confirmation.$errors.map(v => v.$message).concat(this.apiErrors.password_confirmation).filter(Boolean),
        agreement: this.v$.form.agreement.$errors.map(v => v.$message).filter(Boolean)
      }
    }
  },
  watch: {
    'form.first_name' () {
      if (this.form.first_name) this.form.first_name = this.capitalize('first_name')

      delete this.apiErrors.first_name
    },
    'form.last_name' () {
      if (this.form.last_name) this.form.last_name = this.capitalize('last_name')

      delete this.apiErrors.last_name
    },
    'form.phone_number' () {
      if (this.form.phone_number) this.form.phone_number = this.form.phone_number.trim()

      delete this.apiErrors.phone_number
    },
    'form.email' () {
      if (this.form.email) this.form.email = this.form.email.trim()

      delete this.apiErrors.email
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
    capitalize (field) {
      const arr = this.form[field].split(' ')

      for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
      }

      return arr.join(' ')
    },
    reset () {
      this.v$.$reset()

      this.loading = false
      this.showPsw = false
      this.showPswConf = false
      this.form = {
        first_name: null,
        last_name: null,
        phone_number: null,
        email: null,
        password: null,
        password_confirmation: null,
        agreement: false
      }
      this.apiErrors = {
        first_name: [],
        last_name: [],
        phone_number: [],
        email: [],
        password: [],
        password_confirmation: []
      }
    },
    async submit () {
      const result = await this.v$.$validate()
      if (!result) return

      this.loading = true

      return Auth.register(this.form)
        .then(({ data }) => {
          AuthService.setUser(data)
          AuthService.setAuth(data.token)
          this.reset()
          this.$router.push({ name: 'Home' }).catch(() => {})
        })
        .catch(({ response }) => {
          switch (response.status) {
            case 422:
              this.apiErrors = response.data.errors
              this.form.password = null
              this.form.password_confirmation = null
              this.form.agreement = false
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
        first_name: {
          maxLength: maxLength(50),
          required: helpers.withMessage('This field cannot be empty', required)
        },
        last_name: {
          maxLength: maxLength(50),
          required: helpers.withMessage('This field cannot be empty', required)
        },
        phone_number: {
          numeric,
          maxLength: maxLength(11),
          minLength: minLength(11),
          required: helpers.withMessage('This field cannot be empty', required)
        },
        email: {
          email,
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
        },
        agreement: {
          sameAs: helpers.withMessage(
            () => 'This is required',
            sameAs(true)
          )
        }
      }
    }
  }
}
</script>
