<template>
  <div v-if="loading">
    <div
      v-for="(num, i) in 2"
      :key="i"
    >
      <v-skeleton-loader
        class="my-3"
        type="list-item-avatar-two-line"
      />

      <v-divider v-if="2 > i + 1" />
    </div>
  </div>

  <v-list
    v-else
    nav
    lines="three"
    rounded
  >
    <v-infinite-scroll
      height="100%"
      @load="load"
      empty-text="No more result"
      style="overflow-y: hidden"
    >
      <div
        v-for="(user, i) in users"
        :key="user.id"
      >
        <UserItem
          :user="user"
          :class="{ 'mt-2': i > 0 }"
        />

        <v-divider v-if="users.length > i + 1" />
      </div>
    </v-infinite-scroll>
  </v-list>
</template>

<script>
  import UserItem from '@/components/user/UserItem.vue'

  export default {
    name: 'UserList',
    components: { UserItem },
    props: {
      users: {
        type: Array,
        default: Array,
        required: false,
      },
      loading: {
        type: Boolean,
        default: false,
        required: false,
      },
    },
    methods: {
      load(e) {
        this.$emit('load', e)
      },
    },
  }
</script>
