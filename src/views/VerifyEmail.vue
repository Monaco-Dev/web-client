<template>
  <v-app>
    <v-main>
      <ProgressCircular v-if="verifying" />

      <v-container
        v-else
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

            <v-card :disabled="loading">
              <v-card-title class="justify-center">
                Verify Email
              </v-card-title>

              <v-card-text class="pb-0">
                <v-container class="pb-0">
                  <p>
                    Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.
                  </p>

                  <p
                    v-if="sent"
                    class="success--text"
                  >
                    A new verification link has been sent to the email address you provided during registration.
                  </p>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-container class="text-center pt-0">
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
                        :loading="loading"
                        class="black primary--text"
                        @click="resend"
                      >
                        Resend verification email

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
                        @click="logout"
                      >
                        Logout
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Auth from '@/api/auth/auth'
import User from '@/api/auth/user'
import AuthService from '@/composables/auth'
import httpException from '@/mixins/http-exception'
import ProgressCircular from '@/components/App/ProgressCircular'

export default {
  components: { ProgressCircular },
  mixins: [httpException],
  data () {
    return {
      loading: false,
      sent: false,
      verifying: false
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.verify(to.query.path, to.query.expires, to.query.signature)

      return next()
    })
  },
  beforeRouteUpdate (to, from, next) {
    this.verify(to.query.path, to.query.expires, to.query.signature)

    return next()
  },
  methods: {
    resend () {
      this.loading = true

      User.resendVerificationEmail()
        .then(() => {
          this.sent = true
        })
        .catch(({ response }) => this.handle(response))
        .finally(() => {
          this.loading = false
        })
    },

    logout () {
      Auth.logout()
        .then(() => {
          AuthService.flush()
          this.$router.push({ name: 'Login' }).catch(() => {})
        })
        .catch(({ response }) => this.handle(response))
    },

    verify (path, expires, signature) {
      if (!path || !expires || !signature) return

      this.verifying = true

      User.verifyEmail(path, { expires, signature })
        .then(() => {
          this.verifying = false
          this.$router.push({ name: 'Home' }).catch(() => {})
        })
        .catch(({ response }) => this.handle(response))
        .finally(() => {
          this.verifying = false
        })
    }
  }
}
</script>
