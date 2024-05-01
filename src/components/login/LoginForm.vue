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
            <div
              class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-end"
            >
              <a
                class="text-caption text-decoration-none text-primary"
                href="/forgot-password"
              >
                Forgot your password?</a
              >
            </div>

            <v-text-field-primary
              :append-inner-icon="showPsw ? 'mdi-eye-off' : 'mdi-eye'"
              v-model="form.password"
              placeholder="Password"
              :type="showPsw ? 'text' : 'password'"
              :max-errors="formErrors.password.length"
              :error-messages="formErrors.password"
              @blur="v$.form.password.$touch()"
              @click:append-inner="showPsw = !showPsw"
            />
          </v-col>

          <v-col cols="12">
            <v-checkbox-primary
              v-model="form.remember_me"
              label="Remember me"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="pa-0 ma-3">
        <v-btn-primary
          type="submit"
          class="text-none"
        >
          Log in
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
  import { useVuelidate } from '@vuelidate/core'
  import { required, email, helpers } from '@vuelidate/validators'
  import httpException from '@/composables/http-exception'
  import AuthService from '@/composables/auth'
  import Auth from '@/api/auth/auth'
  import Socialite from '@/components/login/Socialite.vue'

  export default {
    name: 'LoginForm',
    components: { Socialite },
    setup() {
      return {
        v$: useVuelidate(),
        httpException,
      }
    },
    data() {
      return {
        loading: false,
        showPsw: false,
        form: {
          email: null,
          password: null,
          remember_me: false,
        },
        apiErrors: {
          email: [],
        },
      }
    },
    computed: {
      formErrors() {
        return {
          email: this.v$.form.email.$errors
            .map((v) => v.$message)
            .concat(this.apiErrors.email)
            .filter(Boolean),
          password: this.v$.form.password.$errors
            .map((v) => v.$message)
            .filter(Boolean),
        }
      },
    },
    watch: {
      'form.email'() {
        if (this.form.email) this.form.email = this.form.email.trim()

        delete this.apiErrors.email
      },
      'form.password'() {
        if (this.form.password) this.form.password = this.form.password.trim()
      },
    },
    methods: {
      reset() {
        this.v$.$reset()

        this.loading = false
        this.showPsw = false
        this.form = {
          email: null,
          password: null,
          remember_me: false,
        }
        this.apiErrors = {
          email: [],
        }
      },
      async submit() {
        const result = await this.v$.$validate()
        if (!result) return

        this.loading = true

        return Auth.login(this.form)
          .then(({ data }) => {
            AuthService.setAuth(data)
            this.$router.push({ name: 'Home' }).catch(() => {})
            this.reset()
          })
          .catch(({ response }) => {
            switch (response.status) {
              case 422:
                this.apiErrors = response.data.errors
                this.form.password = null
                this.form.remember_me = false
                break

              default:
                this.httpException(response)
                break
            }
          })
          .finally(() => {
            this.loading = false
          })
      },
    },
    validations() {
      return {
        form: {
          email: {
            email,
            required: helpers.withMessage(
              'This field cannot be empty',
              required,
            ),
          },
          password: {
            required: helpers.withMessage(
              'This field cannot be empty',
              required,
            ),
          },
        },
      }
    },
  }
</script>
