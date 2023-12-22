<template>
  <v-container
    fluid
    :class="{'px-0': $vuetify.display.smAndDown}"
  >
    <DesktopProfileInformation v-if="$vuetify.display.mdAndUp" />
    <MobileProfileInformation v-else />

    <ProfileWall :class="{'mt-4': $vuetify.display.smAndDown, 'mt-1': $vuetify.display.mdAndUp}" />
  </v-container>
</template>

<script>
import ProfileWall from '@/components/profile/ProfileWall.vue'
import DesktopProfileInformation from '@/components/profile/desktop/ProfileInformation.vue'
import MobileProfileInformation from '@/components/profile/mobile/ProfileInformation.vue'
import { computed } from 'vue'
import { useProfileStore } from '@/store/profile'
import httpException from '@/composables/http-exception'

export default {
  name: 'AppProfile',
  components: {
    ProfileWall,
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
    })
  },
  async beforeRouteUpdate (to) {
    await this.fetch(to)
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
