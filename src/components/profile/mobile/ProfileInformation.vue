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
  >
    <template #append>
      <v-btn
        v-if="auth"
        size="small"
        variant="tonal"
        icon="mdi-pencil"
        to="/settings/profile"
      />
    </template>

    <v-card-text class="pa-0 ma-3">
      <div class="text-center">
        <v-avatar
          size="100"
          class="mb-3"
        >
          <v-img src="https://cdn.vuetifyjs.com/images/lists/1.jpg" />
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

      <v-divider class="mt-5 mx-5" />

      <v-list v-if="auth || profile.is_connection">
        <v-list-item v-if="profile.email">
          <template #prepend>
            <v-icon
              icon="mdi-email"
              start
              size="small"
            />
          </template>

          <v-list-item-title>
            {{ profile.email }}
          </v-list-item-title>
        </v-list-item>

        <v-list-item v-if="profile.phone_number">
          <template #prepend>
            <v-icon
              icon="mdi-phone"
              start
              size="small"
            />
          </template>

          <v-list-item-title>
            {{ profile.phone_number }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
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
  computed: {
    auth () {
      return AuthService.getUser().slug === this.profile?.slug
    }
  }
}
</script>
