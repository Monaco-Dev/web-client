<template>
  <v-list-item
    link
    nav
    :title="user.full_name"
    :subtitle="subtitle"
    :href="`/profile/${user.uuid}`"
  >
    <template #prepend>
      <v-avatar color="grey">
        <v-img
          v-if="user?.avatar_url"
          :src="user?.avatar_url"
          cover
          :alt="user?.full_name"
        />
        <span
          class="text-white"
          v-else
        >
          {{ user?.first_name?.charAt(0) }}{{ user?.last_name?.charAt(0) }}
        </span>
      </v-avatar>
    </template>

    <v-list-item-action v-if="!auth">
      <UserAction :user="user" />
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import AuthService from '@/composables/auth'
import UserAction from '@/components/user/UserAction.vue'
import { useSearchStore } from '@/store/search'

export default {
  name: 'UserItem',
  components: { UserAction },
  props: {
    user: {
      type: Object,
      default: Object,
      required: true
    }
  },
  setup () {
    return { searchStore: useSearchStore() }
  },
  computed: {
    subtitle () {
      const a = `${this.user.connections_count} Connections`
      return this.auth ? a : `${a} | ${this.user.mutuals_count} Mutuals`
    },
    auth () {
      return AuthService.getUser().id === this.user.id
    }
  }
}
</script>
