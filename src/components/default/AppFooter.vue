<template>
  <v-footer>
    <v-row
      justify="center"
      no-gutters
    >
      <v-btn
        v-for="(link, key) in links"
        :key="key"
        variant="plain"
        class="mx-2 text-none"
        rounded="xl"
        density="comfortable"
        flat
        size="small"
        :href="link.url"
      >
        {{ link.text }}
      </v-btn>
      <v-col
        class="text-center mt-4"
        cols="12"
      >
        {{ new Date().getFullYear() }} — Realmate
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  name: 'AppFooter',
  data () {
    return {
      links: [
        {
          text: 'About Us',
          url: 'https://realmate.ph/about-us'
        },
        {
          text: 'Contact Us',
          url: 'https://www.facebook.com/realmateph'
        }
      ]
    }
  }
}
</script>
