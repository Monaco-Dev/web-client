<template>
  <v-list-item
    link
    nav
    prepend-avatar="@/assets/default-avatar.png"
    :title="user.full_name"
    :subtitle="`${user.connections_count} Connections | ${user.mutuals_count} Mutuals`"
    :href="`/profile/${user.slug}`"
  >
    <v-list-item-action v-if="!auth">
      <UserAction :user="user" />
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import AuthService from '@/composables/auth'
import UserAction from '@/components/user/UserAction.vue'

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
  computed: {
    auth () {
      return AuthService.getUser().id === this.user.id
    }
  }
}
</script>
