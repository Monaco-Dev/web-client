<template>
  <v-form @submit.prevent="submit">
    <v-card
      flat
      rounded
      title="Update profile information"
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
        <v-row>
          <v-col
            cols="12"
            md="4"
            align-self="center"
            class="text-center"
          >
            <v-btn
              icon
              border
              size="x-large"
              width="150"
              height="150"
              @click="$refs.uploader.click()"
            >
              <v-avatar
                color="grey"
                size="150"
                data-content="edit"
                class="image"
              >
                <v-img
                  v-if="source"
                  :src="source"
                  cover
                />
                <span
                  class="text-white"
                  v-else
                >
                  {{ initials }}
                </span>
              </v-avatar>
            </v-btn>

            <v-file-input
              ref="uploader"
              accept="image/*"
              class="d-none"
              v-model="form.avatar"
              @change="upload"
            />

            <p
              class="text-error caption"
              v-if="formErrors?.avatar?.length"
            >
              {{ formErrors?.avatar?.[0] }}
            </p>
          </v-col>

          <v-col align-self="center">
            <v-row>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field-primary
                  label="First Name"
                  v-model="form.first_name"
                  :max-errors="formErrors.first_name.length"
                  :error-messages="formErrors.first_name"
                  @blur="v$.form.first_name.$touch()"
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
              >
                <v-text-field-primary
                  v-model="form.last_name"
                  label="Last Name"
                  :max-errors="formErrors.last_name.length"
                  :error-messages="formErrors.last_name"
                  @blur="v$.form.last_name.$touch()"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field-primary
                  v-model="form.phone_number"
                  label="Phone Number"
                  :max-errors="formErrors.phone_number.length"
                  :error-messages="formErrors.phone_number"
                  @blur="v$.form.phone_number.$touch()"
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
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import {
  required,
  maxLength,
  minLength,
  numeric,
  helpers
} from '@vuelidate/validators'
import { useSnackbarStore } from '@/store/snackbar'
import AuthService from '@/composables/auth'
import httpException from '@/composables/http-exception'
import User from '@/api/auth/user'

export default {
  name: 'SettingProfile',
  setup () {
    return {
      v$: useVuelidate(),
      httpException,
      snackbarStore: useSnackbarStore()
    }
  },
  data () {
    return {
      form: {
        first_name: null,
        last_name: null,
        phone_number: null,
        avatar: null
      },
      apiErrors: {
        first_name: [],
        last_name: [],
        phone_number: [],
        avatar: []
      },
      source: null,
      loading: false
    }
  },
  mounted () {
    if (AuthService.isAuthenticated()) this.reset()
  },
  computed: {
    formErrors () {
      return {
        first_name: this.v$.form.first_name.$errors.map(v => v.$message).concat(this.apiErrors.first_name).filter(Boolean),
        last_name: this.v$.form.last_name.$errors.map(v => v.$message).concat(this.apiErrors.last_name).filter(Boolean),
        phone_number: this.v$.form.phone_number.$errors.map(v => v.$message).concat(this.apiErrors.phone_number).filter(Boolean),
        avatar: this.apiErrors.avatar
      }
    },
    initials () {
      return this.form.first_name?.charAt(0) + this.form.last_name?.charAt(0)
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
    'form.avatar' () {
      this.apiErrors.avatar = []
    }
  },
  methods: {
    upload () {
      if (this.form.avatar?.[0]) {
        this.source = window.URL.createObjectURL(this.form.avatar[0])
      }
    },
    capitalize (field) {
      const arr = this.form[field].split(' ')

      for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
      }

      return arr.join(' ')
    },
    reset () {
      this.v$.$reset()

      const user = AuthService.getUser()

      this.form.first_name = user.first_name
      this.form.last_name = user.last_name
      this.form.phone_number = user.phone_number
      this.form.avatar = null
      this.source = user.avatar_url
      this.loading = false

      this.apiErrors = {
        first_name: [],
        last_name: [],
        phone_number: [],
        avatar: []
      }
    },
    async submit () {
      const result = await this.v$.$validate()
      if (!result) return

      const form = { ...this.form }
      form.avatar = this.form.avatar?.[0]

      this.loading = true

      return User.update(AuthService.getUser().id, form)
        .then(({ data }) => {
          this.snackbarStore.open({
            text: 'Your profile information has been updated successfully.',
            color: 'success'
          })
          AuthService.setUser(data)
          this.reset()
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
        }
      }
    }
  }
}
</script>

<style scoped>
.image {
    position:relative;
    width:200px;
    height:200px;
}
.image img {
    width:100%;
    vertical-align:top;
}
.image:after, .image:before {
    position:absolute;
    opacity:0;
    transition: all 0.5s;
    -webkit-transition: all 0.5s;
}
.image:after {
    content:'\A';
    width:100%; height:100%;
    top:0; left:0;
    background:rgba(0,0,0,0.6);
}
.image:before {
    content: attr(data-content);
    width:100%;
    color:#fff;
    z-index:1;
    bottom:0;
    padding:4px 10px;
    text-align:center;
    background: linear-gradient(to bottom, rgba(255,0,0,0), rgba(0,0,0,0));
    box-sizing:border-box;
    -moz-box-sizing:border-box;
}
.image:hover:after, .image:hover:before {
    opacity:1;
}
</style>
