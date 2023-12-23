<template>
  <v-container
    fluid
    :class="{'px-0': $vuetify.display.smAndDown}"
  >
    <DesktopProfileInformation v-if="$vuetify.display.mdAndUp" />
    <MobileProfileInformation v-else />

    <router-view :class="{'mt-4': $vuetify.display.smAndDown, 'mt-1': $vuetify.display.mdAndUp}" />
  </v-container>
</template>

<script>
import DesktopProfileInformation from '@/components/profile/desktop/ProfileInformation.vue'
import MobileProfileInformation from '@/components/profile/mobile/ProfileInformation.vue'
import { computed } from 'vue'
import { useProfileStore } from '@/store/profile'
import httpException from '@/composables/http-exception'
import AuthService from '@/composables/auth'

export default {
  name: 'ProfileIndex',
  components: {
    DesktopProfileInformation,
    MobileProfileInformation
  },
  setup () {
    const profileStore = useProfileStore()

    const profile = computed(() => profileStore.profile)
    const loading = computed(() => profileStore.loading)

    return {
      profileStore,
      profile,
      loading,
      httpException
    }
  },
  beforeRouteEnter (to, from, next) {
    next(async (vm) => {
      await vm.fetch(to)

      if (to.name === 'ProfileAbout' && !vm.auth && !vm.profile.is_connection) {
        vm.$router.replace({ name: 'PageNotFound' })
      }
    })
  },
  async beforeRouteUpdate (to, from) {
    if (to.params.slug !== from.params.slug) await this.fetch(to)

    if (to.name === 'ProfileAbout' && !this.auth && !this.profile.is_connection) {
      this.$router.replace({ name: 'PageNotFound' })
    }
  },
  computed: {
    auth () {
      return AuthService.getUser().slug === this.profile?.slug
    }
  },
  methods: {
    fetch (to) {
      this.profileStore.reset()

      const slug = to.params.slug

      if (!slug) this.$router.replace({ name: 'PageNotFound' })

      return this.profileStore.getProfile(slug)
        .catch(({ response }) => {
          if (response.status === 404) {
            this.$router.replace({ name: 'PageNotFound' })
          } else {
            this.httpException(response)
          }
        })
    }
  }
}
</script>
