<template>
  <v-btn
    variant="flat"
    border
    density="default"
    class="text-none"
    width="250"
  >
    <v-img
      :src="src"
      alt=""
      class="social-logo"
    />

    <span>{{ text }}</span>
  </v-btn>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: '',
      required: true
    },
    text: {
      type: String,
      default: '',
      required: true
    }
  },
  computed: {
    src () {
      switch (this.icon) {
        case 'google':
          return new URL('@/assets/icon-google.svg', import.meta.url).href

        case 'facebook':
          return new URL('@/assets/icon-facebook.svg', import.meta.url).href

        case 'linkedin':
          return new URL('@/assets/icon-linkedin.svg', import.meta.url).href

        default:
          return null
      }
    }
  }
}
</script>

<style scoped>
.social-logo {
  width: 29px;
  height: 29px;
  top: 3px;
  right: 3px;
}
</style>
