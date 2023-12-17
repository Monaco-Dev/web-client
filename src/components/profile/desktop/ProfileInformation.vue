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
    class="pa-3"
  >
    <template #prepend>
      <v-avatar size="100">
        <v-img src="https://cdn.vuetifyjs.com/images/lists/1.jpg" />
      </v-avatar>
    </template>

    <template #title>
      <span class="text-h4 ml-3">{{ profile.full_name }}</span>
    </template>

    <template #subtitle>
      <v-chip-group class="ml-3">
        <v-chip>
          {{ profile.connections_count }} Connections
        </v-chip>

        <v-chip>
          {{ profile.followers_count }} Followers
        </v-chip>

        <v-chip v-if="auth">
          {{ profile.following_count }} Following
        </v-chip>
      </v-chip-group>
    </template>

    <template #append>
      <v-btn
        v-if="auth"
        size="small"
        variant="tonal"
        icon="mdi-pencil"
        to="/settings/profile"
      />
    </template>

    <v-card-text>
      <v-container
        fluid
        v-if="!auth"
      >
        <v-row>
          <v-col cols="6">
            <UserAction :user="profile" />
          </v-col>
        </v-row>
      </v-container>

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

export default {
  name: 'DesktopProfileInformation',
  components: { UserAction },
  props: {
    profile: {
      type: Object,
      default: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false,
      required: true
    },
    auth: {
      type: Boolean,
      default: false,
      required: true
    }
  }
}
</script>
