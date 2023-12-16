<template>
  <v-footer>
    <v-row
      justify="center"
      no-gutters
    >
      <v-btn
        v-for="link in links"
        :key="link"
        variant="plain"
        class="mx-2"
        rounded="xl"
        density="comfortable"
        flat
        size="small"
      >
        {{ link }}
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
        'About Us',
        'Contact Us'
      ]
    }
  }
}
</script>
