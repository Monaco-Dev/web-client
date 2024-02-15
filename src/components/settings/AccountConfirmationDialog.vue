<template>
  <v-dialog
    v-model="confirmationDialog"
    persistent
    max-width="400"
  >
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
              <p>For your security, please re-enter your password to continue</p>
            </v-col>

            <v-col cols="12">
              <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-end">
                <a
                  class="text-caption text-decoration-none text-primary"
                  href="/forgot-password"
                >
                  Forgot password?</a>
              </div>

              <v-text-field-primary
                placeholder="Password"
                :type="showPsw ? 'text' : 'password'"
                :append-inner-icon="showPsw ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPsw = !showPsw"
                :max-errors="formErrors.password.length"
                :error-messages="formErrors.password"
                @blur="v$.form.password.$touch()"
                v-model="form.password"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-row
            justify="center"
            no-gutters
          >
            <v-col
              cols="12"
              md="6"
              class="text-center pa-2"
            >
              <v-btn-primary
                type="submit"
                :block="false"
                width="150"
                class="text-none"
              >
                Continue
              </v-btn-primary>
            </v-col>

            <v-col
              cols="12"
              md="6"
              class="text-center pa-2"
            >
              <v-btn
                width="150"
                @click="reset"
                variant="tonal"
                class="text-none"
              >
                Cancel
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { useSnackbarStore } from '@/store/snackbar'
import User from '@/api/auth/user'
import httpException from '@/composables/http-exception'
import AuthService from '@/composables/auth'

export default {
  name: 'AccountConfirmationDialog',
  props: {
    select: {
      type: Array,
      default: Array,
      required: true
    }
  },
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
      confirmationDialog: false,
      form: {
        password: null
      },
      apiErrors: {
        password: []
      }
    }
  },
  computed: {
    formErrors () {
      return {
        password: this.v$.form.password.$errors.map(v => v.$message).concat(this.apiErrors.password).filter(Boolean)
      }
    }
  },
  watch: {
    'form.password' () {
      if (this.form.password) this.form.password = this.form.password.trim()

      delete this.apiErrors.password
    }
  },
  methods: {
    reset () {
      this.v$.$reset()

      this.loading = false
      this.showPsw = false
      this.confirmationDialog = false
      this.form = {
        password: null
      }
      this.apiErrors = {
        password: []
      }
    },
    async submit () {
      const result = await this.v$.$validate()
      if (!result) return

      this.loading = true

      let action

      switch (this.select[0]) {
        case 'deactivate':
          action = User.deactivate(this.form)
          break

        case 'delete':
          action = User.destroy(this.form)
          break

        case 'update':
          action = User.update(AuthService.getUser().id, this.form)
          break
      }

      return action
        .then(({ data }) => {
          this.reset()
          this.snackbarStore.open({
            text: `Your account has been ${this.select[0]}d successfully.`,
            color: 'success'
          })

          this.$emit(this.select[0], data)
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
          required: helpers.withMessage('This field cannot be empty', required)
        }
      }
    }
  }
}
</script>
