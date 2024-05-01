<template>
  <div>
    <v-form @submit.prevent="submit">
      <v-card
        flat
        rounded
        title="Update account"
      >
        <template #prepend>
          <v-btn
            v-if="$vuetify.display.smAndDown"
            icon="mdi-chevron-left"
            variant="text"
            to="/settings"
          />
        </template>

        <v-card-text class="ma-3 pa-0">
          <v-row justify="center">
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field-primary
                v-model="form.email"
                label="Email Address"
                type="email"
                :max-errors="formErrors.email.length"
                :error-messages="formErrors.email"
                @blur="v$.form.email.$touch()"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="ma-3 pa-0">
          <v-row justify="center">
            <v-col
              cols="12"
              md="3"
            >
              <v-btn-primary
                type="submit"
                class="text-none"
              >
                Save changes
              </v-btn-primary>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-form>

    <AccountConfirmationDialog
      :select="['update']"
      ref="dialog"
      @update="update"
    />
  </div>
</template>

<script>
  import { ref } from 'vue'
  import { useVuelidate } from '@vuelidate/core'
  import { required, email, helpers } from '@vuelidate/validators'
  import { useSnackbarStore } from '@/store/snackbar'
  import AuthService from '@/composables/auth'
  import AccountConfirmationDialog from '@/components/settings/AccountConfirmationDialog.vue'

  export default {
    name: 'UpdateAccount',
    components: { AccountConfirmationDialog },
    setup() {
      return {
        v$: useVuelidate(),
        snackbarStore: useSnackbarStore(),
        dialog: ref(null),
      }
    },
    data() {
      return {
        form: {
          email: null,
        },
      }
    },
    mounted() {
      if (AuthService.isAuthenticated()) this.reset()
    },
    computed: {
      formErrors() {
        return {
          email: this.v$.form.email.$errors
            .map((v) => v.$message)
            .filter(Boolean),
        }
      },
    },
    methods: {
      reset() {
        this.v$.$reset()

        this.form = {
          email: AuthService.getUser().email,
        }
      },
      async submit() {
        await this.v$.form.email.$touch()

        if (this.formErrors.email.length) return

        this.$refs.dialog.confirmationDialog = true
        this.$refs.dialog.form.email = this.form.email
      },
      async update(data) {
        AuthService.setAuth(data.token)
        delete data.token
        AuthService.setUser(data)

        this.reset()

        if (!data.is_verified) {
          setTimeout(() => {
            this.$router.push({ name: 'VerifyEmail' }).catch(() => {})
          }, 2000)
        }
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
        },
      }
    },
  }
</script>
