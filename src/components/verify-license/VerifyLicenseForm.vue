<template>
  <v-form @submit.prevent="submit">
    <v-card
      flat
      rounded
      :loading="loading"
      :disabled="loading"
    >
      <v-card-text class="pa-0 ma-3">
        <v-alert
          v-if="user?.license?.is_license_expired"
          text="Your license is now expired. Please renew and re-submit your license for verification."
          type="error"
          flat
          variant="tonal"
        />

        <br>

        <v-container
          fluid
          v-if="isVerifying"
        >
          Your account is being verified. Please wait approximately 24 hours. We'll notify you when verification is complete.
        </v-container>

        <v-row v-else>
          <v-col
            cols="5"
            align-self="center"
          >
            <v-img
              src="@/assets/verification.avif"
              alt="Realmate"
            />
          </v-col>

          <v-col
            cols="7"
            align-self="center"
          >
            <h2>License verification</h2>

            <br>

            <v-row>
              <v-col cols="12">
                <v-file-input
                  show-size
                  label="Upload photo"
                  flat
                  variant="solo-filled"
                  hide-details="auto"
                  density="comfortable"
                  prepend-inner-icon="mdi-attachment"
                  prepend-icon=""
                  v-model="form.file"
                  accept="image/*"
                  :max-errors="formErrors.file.length"
                  :error-messages="formErrors.file"
                  @blur="v$.form.file.$touch()"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field-primary
                  v-model="form.license_number"
                  label="License Number"
                  :max-errors="formErrors.license_number.length"
                  :error-messages="formErrors.license_number"
                  @blur="v$.form.license_number.$touch()"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field-primary
                  v-model="form.expiration_date"
                  label="Expiration Date"
                  :max-errors="formErrors.expiration_date.length"
                  :error-messages="formErrors.expiration_date"
                  @blur="v$.form.expiration_date.$touch()"
                  type="date"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions v-if="!isVerifying">
        <v-btn-primary
          type="submit"
          class="text-none"
        >
          Verify license
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
          class="text-none"
        >
          Logout
        </v-btn-primary>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { useSnackbarStore } from '@/store/snackbar'
import httpException from '@/composables/http-exception'
import AuthService from '@/composables/auth'
import Auth from '@/api/auth/auth'
import License from '@/api/auth/license'

export default {
  name: 'VerifyLicenseForm',
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
        license_number: null,
        expiration_date: null,
        file: null
      },
      apiErrors: {
        license_number: [],
        expiration_date: [],
        file: []
      }
    }
  },
  computed: {
    formErrors () {
      return {
        license_number: this.v$.form.license_number.$errors.map(v => v.$message).concat(this.apiErrors.license_number).filter(Boolean),
        expiration_date: this.v$.form.expiration_date.$errors.map(v => v.$message).concat(this.apiErrors.expiration_date).filter(Boolean),
        file: this.v$.form.file.$errors.map(v => v.$message).concat(this.apiErrors.file).concat(this.apiErrors.file).filter(Boolean)
      }
    },
    user () {
      return AuthService.getUser()
    },
    isVerifying () {
      if (!this.user?.license || this.user?.license?.is_license_expired) return false

      return !this.user?.is_verified
    }
  },
  watch: {
    'form.license_number' () {
      if (this.form.license_number) this.form.license_number = this.form.license_number.trim()

      delete this.apiErrors.license_number
    },
    'form.expiration_date' () {
      delete this.apiErrors.expiration_date
    },
    'form.file' () {
      delete this.apiErrors.file
    }
  },
  methods: {
    reset () {
      this.v$.$reset()

      this.loading = false
      this.form = {
        license_number: null,
        expiration_date: null,
        file: null
      }
      this.apiErrors = {
        license_number: [],
        expiration_date: [],
        file: []
      }
    },
    logout () {
      return Auth.logout()
        .then(() => {
          AuthService.flush()
          this.$router.push({ name: 'Login' }).catch(() => {})
        })
        .catch(({ response }) => this.httpException(response))
    },
    async submit () {
      const result = await this.v$.$validate()
      if (!result) return

      const form = { ...this.form }
      form.file = this.form.file[0]

      this.loading = true

      return License.store(form)
        .then(() => window.location.reload())
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
        license_number: {
          required: helpers.withMessage('This field cannot be empty', required)
        },
        expiration_date: {
          required: helpers.withMessage('This field cannot be empty', required),
          minValue: helpers.withMessage('Cannot enter a date later than today', helpers.withAsync(async value => {
            return value ? value > new Date().toISOString() : true
          }))
        },
        file: {
          required: helpers.withMessage('This field cannot be empty', required)
        }
      }
    }
  }
}
</script>
