<template>
  <v-list
    density="compact"
    nav
  >
    <v-list-subheader>Networks</v-list-subheader>

    <v-list-item
      :title="`Incoming invites: ${auth?.incoming_invites_count}`"
      to="/networks/incoming-invites"
      link
      nav
      exact
      value="incoming-invites"
      append-icon="mdi-chevron-right"
    />
    <v-list-item
      :title="`Outgoing invites: ${auth?.outgoing_invites_count}`"
      to="/networks/outgoing-invites"
      link
      nav
      exact
      value="outgoing-invites"
      append-icon="mdi-chevron-right"
    />
    <v-list-item
      :title="`Connections: ${auth?.connections_count}`"
      to="/networks/connections"
      link
      nav
      exact
      value="connections"
      append-icon="mdi-chevron-right"
    />
    <v-list-item
      :title="`Followers: ${auth?.followers_count}`"
      to="/networks/followers"
      link
      nav
      exact
      value="followers"
      append-icon="mdi-chevron-right"
    />
    <v-list-item
      :title="`Following: ${auth?.following_count}`"
      to="/networks/following"
      link
      nav
      exact
      value="following"
      append-icon="mdi-chevron-right"
    />
  </v-list>
</template>

<script>
import AuthService from '@/composables/auth'

export default {
  name: 'NetworkNavigation',
  computed: {
    auth () {
      const user = AuthService.getUser()

      user.incoming_invites_count = this.parse(user.incoming_invites_count)
      user.outgoing_invites_count = this.parse(user.outgoing_invites_count)
      user.connections_count = this.parse(user.connections_count)
      user.followers_count = this.parse(user.followers_count)
      user.following_count = this.parse(user.following_count)

      return user
    }
  },
  methods: {
    parse (value) {
      return parseInt(value).toLocaleString()
    }
  }
}
</script>
