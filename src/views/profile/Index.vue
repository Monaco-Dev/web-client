<template>
  <v-container
    fluid
    :class="{ 'px-0': $vuetify.display.smAndDown }"
  >
    <v-skeleton-loader
      v-if="loading"
      boilerplate
      type="avatar, article"
    />
    <template v-else>
      <DesktopProfileInformation v-if="$vuetify.display.mdAndUp" />
      <MobileProfileInformation v-else />
    </template>

    <router-view
      :class="{
        'mt-4': $vuetify.display.smAndDown,
        'mt-1': $vuetify.display.mdAndUp,
      }"
      v-if="!loading"
    />
  </v-container>
</template>

<script>
  import DesktopProfileInformation from '@/components/profile/desktop/ProfileInformation.vue'
  import MobileProfileInformation from '@/components/profile/mobile/ProfileInformation.vue'
  import { computed } from 'vue'
  import { useProfileStore } from '@/store/profile'
  import { usePostStore } from '@/store/post'
  import httpException from '@/composables/http-exception'
  import AuthService from '@/composables/auth'

  export default {
    name: 'ProfileIndex',
    components: {
      DesktopProfileInformation,
      MobileProfileInformation,
    },
    setup() {
      const profileStore = useProfileStore()
      const postStore = usePostStore()

      const profile = computed(() => profileStore.profile)
      const loading = computed(() => profileStore.loading)

      return {
        profileStore,
        postStore,
        profile,
        loading,
        httpException,
      }
    },
    beforeRouteEnter(to, from, next) {
      next(async (vm) => {
        await vm.fetch(to)

        if (
          to.name === 'ProfileContact' &&
          !vm.auth &&
          !vm.profile.is_connection
        ) {
          vm.$router.replace({ name: 'PageNotFound' })
        }
      })
    },
    async beforeRouteUpdate(to, from) {
      if (to.params.uuid !== from.params.uuid) await this.fetch(to)

      if (
        to.name === 'ProfileContact' &&
        !this.auth &&
        !this.profile.is_connection
      ) {
        this.$router.replace({ name: 'PageNotFound' })
      }
    },
    computed: {
      auth() {
        return AuthService.getUser().uuid === this.profile?.uuid
      },
    },
    methods: {
      fetch(to) {
        this.postStore.reset()
        this.profileStore.reset()

        const uuid = to.params.uuid

        if (!uuid) this.$router.replace({ name: 'PageNotFound' })

        this.profileStore.setLoading(true)

        return this.profileStore
          .getProfile(uuid)
          .catch(({ response }) => {
            if (response.status === 404) {
              this.$router.replace({ name: 'PageNotFound' })
            } else {
              this.httpException(response)
            }
          })
          .finally(() => this.profileStore.setLoading(false))
      },
    },
  }
</script>
