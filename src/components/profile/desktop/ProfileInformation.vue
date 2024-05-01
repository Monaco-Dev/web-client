<template>
  <v-card
    flat
    rounded
    class="pa-0"
  >
    <template #prepend>
      <v-avatar
        size="100"
        class="mt-3 ml-3"
        color="grey"
      >
        <v-img
          v-if="profile?.avatar_url"
          :src="profile?.avatar_url"
          cover
          :alt="profile?.full_name"
        />
        <span
          class="text-white"
          v-else
        >
          {{ profile?.first_name?.charAt(0)
          }}{{ profile?.last_name?.charAt(0) }}
        </span>
      </v-avatar>
    </template>

    <template #title>
      <div class="mt-5">
        <span class="text-h4 ml-3 font-weight-bold">{{
          profile?.full_name
        }}</span>
      </div>
    </template>

    <template #subtitle>
      <div class="mt-3">
        <v-chip
          :to="auth ? `/networks/connections` : null"
          class="mx-3"
        >
          {{ profile?.connections_count }} Connections
        </v-chip>

        <v-chip :to="auth ? `/networks/followers` : null">
          {{ profile?.followers_count }} Followers
        </v-chip>

        <v-chip
          v-if="auth"
          to="/networks/following"
          class="ml-3"
        >
          {{ profile?.following_count }} Following
        </v-chip>
      </div>

      <div class="mt-3 ml-3">
        <h3>{{ profile?.license?.license_type }}</h3>
        <p>License no: {{ profile?.license?.license_number }}</p>
      </div>
    </template>

    <template #append>
      <div
        v-if="auth"
        class="mr-3 mt-5"
      >
        <v-btn
          size="small"
          variant="tonal"
          prepend-icon="mdi-pencil"
          to="/settings/profile"
          text="Edit profile"
          class="text-none"
        />

        <v-menu location="bottom">
          <template #activator="{ props }">
            <v-btn
              variant="tonal"
              size="small"
              class="ml-3"
              v-bind="props"
            >
              <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>

          <v-card min-width="200">
            <v-list
              density="compact"
              nav
            >
              <v-list-item
                color="primary"
                link
                nav
                :to="`/profile/${profile?.uuid}/archive`"
                density="compact"
              >
                <template #prepend>
                  <v-icon
                    icon="mdi-archive"
                    start
                    size="small"
                  />
                </template>

                <v-list-item-title> Archive </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </template>

    <v-card-text
      class="mx-3 mt-3"
      v-if="!auth || profile?.is_connection"
    >
      <v-row>
        <v-col cols="6">
          <UserAction
            :user="profile"
            @click:action="update"
          />
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions
      class="pa-0 mt-3"
      v-if="auth || profile?.is_connection"
    >
      <v-tabs
        v-model="tab"
        :mandatory="true"
        color="primary"
      >
        <v-tab
          :to="`/profile/${profile?.uuid}`"
          exact
          rounded="pill"
          class="text-none"
          value="ProfileWall"
        >
          Posts
        </v-tab>

        <v-tab
          :to="`/profile/${profile?.uuid}/contact-me`"
          rounded="pill"
          class="text-none"
          value="ProfileContact"
        >
          Contact Me
        </v-tab>
      </v-tabs>
    </v-card-actions>
  </v-card>
</template>

<script>
  import UserAction from '@/components/user/UserAction.vue'
  import AuthService from '@/composables/auth'
  import { computed } from 'vue'
  import { useProfileStore } from '@/store/profile'

  export default {
    name: 'DesktopProfileInformation',
    components: { UserAction },
    setup() {
      const profileStore = useProfileStore()

      const profile = computed(() => profileStore.profile)

      return {
        profileStore,
        profile,
      }
    },
    data() {
      return {
        tab: null,
      }
    },
    computed: {
      auth() {
        return this.user.uuid === this.profile?.uuid
      },
      user() {
        return AuthService.getUser()
      },
    },
    created() {
      this.$router.beforeEach((to, from, next) => {
        this.tab = null
        next()
      })
    },
    methods: {
      update(item) {
        this.profileStore.setProfile(item)
      },
    },
  }
</script>
