<template>
  <v-list-item
    link
    nav
    :prepend-avatar="avatar(user)"
    :title="user.full_name"
    :subtitle="subtitle"
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
  },
  methods: {
    avatar (user) {
      return user?.avatar ?? 'https://cdn.vuetifyjs.com/images/lists/1.jpg'
    }
  }
}
</script>
