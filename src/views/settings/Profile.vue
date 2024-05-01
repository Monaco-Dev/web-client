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
        <v-row
          align="center"
          justify="center"
        >
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
                  :alt="getFullName()"
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

          <v-col
            align-self="center"
            cols="12"
            md="7"
          >
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

          <v-col
            cols="12"
            md="9"
            align-self="center"
          >
            <br />

            <h3>Social accounts:</h3>

            <br />

            <v-row
              align="center"
              justify="center"
            >
              <v-col
                cols="12"
                align-self="center"
                v-for="(social, key) in form.socials"
                :key="key"
              >
                <v-row no-gutters>
                  <v-col
                    cols="3"
                    class="mr-6"
                  >
                    <v-select
                      flat
                      variant="solo-filled"
                      density="comfortable"
                      :items="providers"
                      hide-details="auto"
                      item-value="value"
                      item-title="value"
                      v-model="social.provider"
                      placeholder="..."
                      :prepend-icon="!key ? 'mdi-plus' : 'mdi-blank'"
                      @click:prepend="!key ? addSocial() : null"
                      menu-icon=""
                    >
                      <template #item="{ props, item }">
                        <v-list-item
                          v-bind="props"
                          class="text-center"
                          title=""
                        >
                          <v-icon>{{ item.raw.icon }}</v-icon>
                        </v-list-item>
                      </template>

                      <template #selection="{ item }">
                        <v-icon>{{ item.raw.icon }}</v-icon>
                      </template>
                    </v-select>
                  </v-col>

                  <v-col cols="8">
                    <v-text-field-primary
                      placeholder="Link here"
                      v-model="social.url"
                      :append-icon="
                        form.socials.length === 1 &&
                        !social.url &&
                        !social.provider
                          ? ''
                          : 'mdi-delete'
                      "
                      @click:append="removeSocial(key)"
                      :max-errors="
                        formErrors.socials[key]?.url?.length ||
                        formErrors.socials[key]?.provider?.length
                      "
                      :error-messages="
                        formErrors.socials[key]?.url.concat(
                          formErrors.socials[key]?.provider,
                        )
                      "
                    />
                  </v-col>
                </v-row>
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
    requiredIf,
    maxLength,
    minLength,
    numeric,
    url,
    helpers,
  } from '@vuelidate/validators'
  import { useSnackbarStore } from '@/store/snackbar'
  import AuthService from '@/composables/auth'
  import httpException from '@/composables/http-exception'
  import User from '@/api/auth/user'

  export default {
    name: 'SettingProfile',
    setup() {
      return {
        v$: useVuelidate(),
        httpException,
        snackbarStore: useSnackbarStore(),
      }
    },
    data() {
      return {
        form: {
          first_name: null,
          last_name: null,
          phone_number: null,
          avatar: null,
          socials: [
            {
              provider: null,
              url: null,
            },
          ],
        },
        apiErrors: {
          first_name: [],
          last_name: [],
          phone_number: [],
          avatar: [],
          socials: [],
        },
        source: null,
        loading: false,
        providers: [
          {
            value: 'facebook',
            icon: 'mdi-facebook',
          },
        ],
      }
    },
    mounted() {
      if (AuthService.isAuthenticated()) this.reset()
    },
    computed: {
      formErrors() {
        const socials = []

        if (this.v$.form.socials.$anyDirty) {
          this.form.socials.forEach((element, key) => {
            const provider = this.v$.form.socials.$each.$response.$errors[
              key
            ].provider.map((v) => v.$message)
            const url = this.v$.form.socials.$each.$response.$errors[
              key
            ].url.map((v) => v.$message)

            if (provider.length || url.length) {
              socials.push({
                provider,
                url,
              })
            }
          })
        }

        return {
          first_name: this.v$.form.first_name.$errors
            .map((v) => v.$message)
            .concat(this.apiErrors.first_name)
            .filter(Boolean),
          last_name: this.v$.form.last_name.$errors
            .map((v) => v.$message)
            .concat(this.apiErrors.last_name)
            .filter(Boolean),
          phone_number: this.v$.form.phone_number.$errors
            .map((v) => v.$message)
            .concat(this.apiErrors.phone_number)
            .filter(Boolean),
          avatar: this.apiErrors.avatar,
          socials: socials.concat(this.apiErrors.socials).filter(Boolean),
        }
      },
      initials() {
        return this.form.first_name?.charAt(0) + this.form.last_name?.charAt(0)
      },
    },
    watch: {
      'form.first_name'() {
        if (this.form.first_name)
          this.form.first_name = this.capitalize('first_name')

        delete this.apiErrors.first_name
      },
      'form.last_name'() {
        if (this.form.last_name)
          this.form.last_name = this.capitalize('last_name')

        delete this.apiErrors.last_name
      },
      'form.phone_number'() {
        if (this.form.phone_number)
          this.form.phone_number = this.form.phone_number.trim()

        delete this.apiErrors.phone_number
      },
      'form.avatar'() {
        this.apiErrors.avatar = []
      },
    },
    methods: {
      addSocial() {
        this.form.socials.push({ provider: null, url: null })
      },
      removeSocial(key) {
        this.form.socials.splice(key, 1)
        if (!this.form.socials.length) this.addSocial()
      },
      getFullName() {
        return AuthService.getUser()?.full_name
      },
      upload() {
        if (this.form.avatar?.[0]) {
          this.source = window.URL.createObjectURL(this.form.avatar[0])
        }
      },
      capitalize(field) {
        const arr = this.form[field].split(' ')

        for (let i = 0; i < arr.length; i++) {
          arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
        }

        return arr.join(' ')
      },
      reset() {
        this.v$.$reset()

        const user = AuthService.getUser()

        this.form.first_name = user.first_name
        this.form.last_name = user.last_name
        this.form.phone_number = user.phone_number
        this.form.avatar = null

        if (user.socials.length) {
          this.form.socials = user.socials
        }

        this.source = user.avatar_url
        this.loading = false

        this.apiErrors = {
          first_name: [],
          last_name: [],
          phone_number: [],
          avatar: [],
          socials: [],
        }
      },
      async submit() {
        const result = await this.v$.$validate()

        if (!result) return

        const form = { ...this.form }
        form.avatar = this.form.avatar?.[0]

        this.loading = true

        return User.update(AuthService.getUser().id, form)
          .then(({ data }) => {
            this.snackbarStore.open({
              text: 'Your profile information has been updated successfully.',
              color: 'success',
            })
            AuthService.setUser(data)
            this.reset()
          })
          .catch(({ response }) => {
            switch (response.status) {
              case 422: {
                const errors = { ...response.data.errors }

                errors.socials = []

                for (
                  let index = 0;
                  index < Object.keys(response.data.errors).length;
                  index++
                ) {
                  const element = Object.keys(response.data.errors)[index]
                  const el = element.split('.')
                  if (el.length) {
                    const v = errors[element].map((d) =>
                      d.replace(element, 'field'),
                    )
                    errors.socials.push({ url: v })
                  }
                }

                this.apiErrors = errors

                break
              }

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
          first_name: {
            maxLength: maxLength(50),
            required: helpers.withMessage(
              'This field cannot be empty',
              required,
            ),
          },
          last_name: {
            maxLength: maxLength(50),
            required: helpers.withMessage(
              'This field cannot be empty',
              required,
            ),
          },
          phone_number: {
            numeric,
            maxLength: maxLength(11),
            minLength: minLength(11),
            required: helpers.withMessage(
              'This field cannot be empty',
              required,
            ),
          },
          socials: {
            $each: helpers.forEach({
              provider: {
                required: helpers.withMessage(
                  'Select social account',
                  requiredIf(function (form, a) {
                    return !!a.url
                  }),
                ),
              },
              url: {
                url,
                required: requiredIf(function (form, a) {
                  return !!a.provider
                }),
              },
            }),
          },
        },
      }
    },
  }
</script>

<style scoped>
  .image {
    position: relative;
    width: 200px;
    height: 200px;
  }
  .image img {
    width: 100%;
    vertical-align: top;
  }
  .image:after,
  .image:before {
    position: absolute;
    opacity: 0;
    transition: all 0.5s;
    -webkit-transition: all 0.5s;
  }
  .image:after {
    content: '\A';
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  .image:before {
    content: attr(data-content);
    width: 100%;
    color: #fff;
    z-index: 1;
    bottom: 0;
    padding: 4px 10px;
    text-align: center;
    background: linear-gradient(
      to bottom,
      rgba(255, 0, 0, 0),
      rgba(0, 0, 0, 0)
    );
    box-sizing: border-box;
    -moz-box-sizing: border-box;
  }
  .image:hover:after,
  .image:hover:before {
    opacity: 1;
  }
</style>
