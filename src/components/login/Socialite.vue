<template>
  <v-row class="text-center">
    <v-col cols="12">
      <SocialBtn
        icon="google"
        text="Continue with Google"
        @click="redirect('google')"
      />
    </v-col>

    <v-col cols="12">
      <SocialBtn
        icon="linkedin"
        text="Continue with LinkedIn"
        @click="redirect('linkedin-openid')"
      />
    </v-col>
  </v-row>
</template>

<script>
import { useTheme } from 'vuetify'
import SocialBtn from '@/components/login/SocialBtn.vue'
import Config from '@/config/app'

export default {
  name: 'AppSocialite',
  setup () {
    return {
      theme: useTheme()
    }
  },
  components: { SocialBtn },
  computed: {
    isDarkMode () {
      return this.theme.global.current.value?.dark
    }
  },
  methods: {
    redirect (driver) {
      window.location.replace(`${Config.services.auth.url}/api/auth/${driver}/redirect`)
    }
  }
}
</script>
