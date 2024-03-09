<template>
  <div>
    <v-row no-gutters>
      <v-col
        class="pa-1"
        v-if="!item.is_connection && !item.is_incoming_invite && !item.is_outgoing_invite"
      >
        <v-btn
          color="primary"
          variant="tonal"
          density="compact"
          flat
          block
          @click.prevent="$refs.sendInvitationDialog.dialog=true"
          :loading="item.connect_loading"
          :disabled="item.disabled"
          class="text-none"
        >
          Connect
        </v-btn>
      </v-col>

      <v-col
        class="pa-1"
        v-else-if="item.is_outgoing_invite"
      >
        <v-btn
          color="primary"
          variant="tonal"
          density="compact"
          flat
          block
          disabled
          class="text-none"
        >
          Pending invite
        </v-btn>
      </v-col>

      <v-col
        class="pa-1"
        v-if="item.is_connection"
      >
        <v-btn
          color="error"
          variant="tonal"
          density="compact"
          flat
          block
          @click.prevent="disconnect"
          :loading="item.disconnect_loading"
          :disabled="item.disabled"
          class="text-none"
        >
          Disconnect
        </v-btn>
      </v-col>

      <v-col
        class="pa-1"
        v-if="item.is_incoming_invite"
      >
        <v-btn
          color="success"
          variant="tonal"
          density="compact"
          flat
          block
          @click.prevent="accept"
          :loading="item.accept_loading"
          :disabled="item.disabled"
          class="text-none"
        >
          Accept
        </v-btn>
      </v-col>

      <v-col
        class="pa-1"
        v-if="!item.is_following"
      >
        <v-btn
          color="warning"
          variant="tonal"
          density="compact"
          flat
          block
          @click.prevent="follow"
          :loading="item.follow_loading"
          :disabled="item.disabled"
          class="text-none"
        >
          Follow
        </v-btn>
      </v-col>

      <v-col
        class="pa-1"
        v-if="item.is_following"
      >
        <v-btn
          variant="tonal"
          density="compact"
          flat
          block
          @click.prevent="unfollow"
          :loading="item.unfollow_loading"
          :disabled="item.disabled"
          class="text-none"
        >
          Unfollow
        </v-btn>
      </v-col>
    </v-row>

    <SendInvitationDialog
      ref="sendInvitationDialog"
      @connect="connect"
      :user="user"
      :loading="loading"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import { useSnackbarStore } from '@/store/snackbar'
import { useNetworkStore } from '@/store/network'
import ConnectionInvitation from '@/api/auth/connection-invitation'
import Connection from '@/api/auth/connection'
import Follow from '@/api/auth/follow'
import httpException from '@/composables/http-exception'
import SendInvitationDialog from '@/components/user/SendInvitationDialog.vue'

export default {
  name: 'UserAction',
  components: { SendInvitationDialog },
  props: {
    user: {
      type: Object,
      default: Object,
      required: true
    }
  },
  setup () {
    const networkStore = useNetworkStore()

    return {
      httpException,
      snackbarStore: useSnackbarStore(),
      sendInvitationDialog: ref(null),
      networkStore
    }
  },
  data () {
    return {
      item: {},
      loading: false
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    user () {
      this.init()
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.item = { ...JSON.parse(JSON.stringify(this.user)) }
    },
    setLoading (status, action) {
      this.item[`${action}_loading`] = status
      this.item.disabled = status
      this.loading = status
    },
    connect (form) {
      this.setLoading(true, 'connect')

      return ConnectionInvitation.send(this.item.id, form)
        .then(({ data }) => {
          this.snackbarStore.open({
            text: 'Your invite has been sent successfully.',
            color: 'success'
          })

          this.item = {
            ...this.item,
            ...data
          }

          this.networkStore.updateUser(this.item)
        })
        .catch(({ response }) => this.httpException(response))
        .finally(() => this.setLoading(false, 'connect'))
    },
    disconnect () {
      this.setLoading(true, 'disconnect')

      return Connection.disconnect(this.item.id)
        .then(({ data }) => {
          this.snackbarStore.open({
            text: 'You disconnected a user successfully.',
            color: 'success'
          })

          this.item = {
            ...this.item,
            ...data
          }

          this.networkStore.updateUser(this.item)
        })
        .catch(({ response }) => this.httpException(response))
        .finally(() => this.setLoading(false, 'disconnect'))
    },
    follow () {
      this.setLoading(true, 'follow')

      return Follow.follow(this.item.id)
        .then(({ data }) => {
          this.snackbarStore.open({
            text: 'You followed a user successfully.',
            color: 'success'
          })

          this.item = {
            ...this.item,
            ...data
          }

          this.networkStore.updateUser(this.item)
        })
        .catch(({ response }) => this.httpException(response))
        .finally(() => this.setLoading(false, 'follow'))
    },
    unfollow () {
      this.setLoading(true, 'unfollow')

      return Follow.unfollow(this.item.id)
        .then(({ data }) => {
          this.snackbarStore.open({
            text: 'You unfollowed a user successfully.',
            color: 'success'
          })

          this.item = {
            ...this.item,
            ...data
          }

          this.networkStore.updateUser(this.item)
        })
        .catch(({ response }) => this.httpException(response))
        .finally(() => this.setLoading(false, 'unfollow'))
    },
    accept () {
      this.setLoading(true, 'accept')

      return Connection.connect(this.item.id)
        .then(({ data }) => {
          this.snackbarStore.open({
            text: 'You accepted an invited successfully.',
            color: 'success'
          })

          this.item = {
            ...this.item,
            ...data
          }

          this.networkStore.updateUser(this.item)
        })
        .catch(({ response }) => this.httpException(response))
        .finally(() => this.setLoading(false, 'accept'))
    }
  }
}
</script>
