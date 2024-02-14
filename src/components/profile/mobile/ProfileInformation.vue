<template>
  <v-skeleton-loader
    v-if="loading || !Object.keys(profile).length"
    boilerplate
    type="avatar, article"
  />

  <v-card
    v-else
    flat
    rounded
    class="pa-0"
  >
    <v-card-text class="pa-0 ma-5">
      <div class="text-center">
        <v-avatar
          size="100"
          class="mb-3"
        >
          <v-img
            :src="user.avatar_url"
            cover
          />
        </v-avatar>

        <br>

        <span class="text-h4">{{ profile.full_name }}</span>

        <br>

        <div class="justify-center mt-3">
          <v-chip
            :to="auth ? `/networks/connections` : null"
            class="mr-3"
          >
            {{ profile.connections_count }} Connections
          </v-chip>

          <v-chip :to="auth ? `/networks/followers` : null">
            {{ profile.followers_count }} Followers
          </v-chip>

          <v-chip
            v-if="auth"
            to="/networks/following"
            class="ml-3"
          >
            {{ profile.following_count }} Following
          </v-chip>
        </div>

        <div class="mt-3 ml-3">
          <h3>{{ profile.license.license_type }}</h3>
          <p>
            License no: {{ profile.license.license_number }}
          </p>
        </div>
      </div>

      <v-container
        fluid
        v-if="!auth"
      >
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <UserAction :user="profile" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-divider class="mt-5 mx-5" />

    <v-card-actions
      v-if="auth || profile.is_connection"
      class="pa-0 mt-3"
    >
      <v-tabs
        v-model="tab"
        :mandatory="true"
        color="primary"
      >
        <v-tab
          :to="`/profile/${profile.slug}`"
          exact
          rounded="pill"
          class="text-none"
          value="ProfileWall"
        >
          Posts
        </v-tab>

        <v-tab
          :to="`/profile/${profile.slug}/about`"
          rounded="pill"
          class="text-none"
          value="ProfileAbout"
        >
          About
        </v-tab>
      </v-tabs>

      <v-spacer />

      <v-dialog
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <template #activator="{ props }">
          <v-btn
            variant="tonal"
            size="small"
            class="mr-3"
            v-bind="props"
          >
            <v-icon>mdi-dots-horizontal</v-icon>
          </v-btn>
        </template>

        <template #default="{ isActive }">
          <v-card title="Profile">
            <template #prepend>
              <v-btn
                icon
                variant="tonal"
                flat
                size="small"
                class="mr-3"
                @click="isActive.value = false"
              >
                <v-icon icon="mdi-chevron-left" />
              </v-btn>
            </template>

            <v-card-text class="bg-background pa-0 mt-3">
              <v-list
                density="compact"
                nav
                class="bg-background"
              >
                <v-list-item
                  color="primary"
                  link
                  nav
                  to="/settings/profile"
                  density="compact"
                  @click="isActive.value = false"
                >
                  <template #prepend>
                    <v-icon
                      icon="mdi-pencil"
                      start
                      size="small"
                    />
                  </template>

                  <template #append>
                    <v-icon
                      icon="mdi-chevron-right"
                      end
                      size="small"
                    />
                  </template>

                  <v-list-item-title>
                    Edit profile
                  </v-list-item-title>
                </v-list-item>

                <v-list-item
                  color="primary"
                  link
                  nav
                  :to="`/profile/${profile.slug}/archive`"
                  density="compact"
                  @click="isActive.value = false"
                >
                  <template #prepend>
                    <v-icon
                      icon="mdi-archive"
                      start
                      size="small"
                    />
                  </template>

                  <template #append>
                    <v-icon
                      icon="mdi-chevron-right"
                      end
                      size="small"
                    />
                  </template>

                  <v-list-item-title>
                    Archive
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </v-card-actions>
  </v-card>
</template>

<script>
import UserAction from '@/components/user/UserAction.vue'
import AuthService from '@/composables/auth'
import { computed } from 'vue'
import { useProfileStore } from '@/store/profile'

export default {
  name: 'MobileProfileInformation',
  components: { UserAction },
  setup () {
    const profileStore = useProfileStore()

    const profile = computed(() => profileStore.profile)
    const loading = computed(() => profileStore.loading)

    return {
      profileStore,
      profile,
      loading
    }
  },
  data () {
    return {
      tab: null
    }
  },
  computed: {
    auth () {
      return this.user.slug === this.profile?.slug
    },
    user () {
      return AuthService.getUser()
    }
  },
  created () {
    this.$router.beforeEach((to, from, next) => {
      this.tab = null
      next()
    })
  }
}
</script>
