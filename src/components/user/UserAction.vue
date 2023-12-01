<template>
  <v-row no-gutters>
    <v-col
      class="pa-1"
      v-if="!user.is_connection && !user.is_incoming_invite && !user.is_outgoing_invite"
    >
      <v-btn
        color="primary"
        variant="tonal"
        density="compact"
        flat
        block
        @click.stop="connect"
      >
        Connect
      </v-btn>
    </v-col>

    <v-col
      class="pa-1"
      v-else-if="user.is_outgoing_invite"
    >
      <v-btn
        color="primary"
        variant="tonal"
        density="compact"
        flat
        block
        disabled
      >
        Pending invite
      </v-btn>
    </v-col>

    <v-col
      class="pa-1"
      v-if="user.is_connection"
    >
      <v-btn
        color="error"
        variant="tonal"
        density="compact"
        flat
        block
        @click.stop="disconnect"
      >
        Disconnect
      </v-btn>
    </v-col>

    <v-col
      class="pa-1"
      v-if="!user.is_following"
    >
      <v-btn
        color="warning"
        variant="tonal"
        density="compact"
        flat
        block
        @click.stop="follow"
      >
        Follow
      </v-btn>
    </v-col>

    <v-col
      class="pa-1"
      v-if="user.is_following"
    >
      <v-btn
        variant="tonal"
        density="compact"
        flat
        block
        @click.stop="unfollow"
      >
        Unfollow
      </v-btn>
    </v-col>

    <v-col
      class="pa-1"
      v-if="user.is_incoming_invite"
    >
      <v-btn
        color="success"
        variant="tonal"
        density="compact"
        flat
        block
        @click.stop="accept"
      >
        Accept
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { useSnackbarStore } from '@/store/snackbar'
import ConnectionInvitation from '@/api/auth/connection-invitation'
import Connection from '@/api/auth/connection'
import Follow from '@/api/auth/follow'
import httpException from '@/composables/http-exception'

export default {
  name: 'UserAction',
  props: {
    user: {
      type: Object,
      default: Object,
      required: true
    }
  },
  setup () {
    return {
      httpException,
      snackbarStore: useSnackbarStore()
    }
  },
  methods: {
    connect () {
      return ConnectionInvitation.send(this.user.id)
        .then(() => this.snackbarStore.open({
          text: 'Your invite has been sent successfully.',
          color: 'success'
        }))
        .catch(({ response }) => this.httpException(response))
    },
    disconnect () {
      return Connection.disconnect(this.user.id)
        .then(() => this.snackbarStore.open({
          text: 'You disconnected a user successfully.',
          color: 'success'
        }))
        .catch(({ response }) => this.httpException(response))
    },
    follow () {
      return Follow.follow(this.user.id)
        .then(() => this.snackbarStore.open({
          text: 'You followed a user successfully.',
          color: 'success'
        }))
        .catch(({ response }) => this.httpException(response))
    },
    unfollow () {
      return Follow.unfollow(this.user.id)
        .then(() => this.snackbarStore.open({
          text: 'You unfollowed a user successfully.',
          color: 'success'
        }))
        .catch(({ response }) => this.httpException(response))
    },
    accept () {
      return Connection.connect(this.user.id)
        .then(() => this.snackbarStore.open({
          text: 'You accepted an invited successfully.',
          color: 'success'
        }))
        .catch(({ response }) => this.httpException(response))
    }
  }
}
</script>
