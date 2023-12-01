<template>
  <v-row no-gutters>
    <v-col
      cols="3"
      v-if="$vuetify.display.mdAndUp"
    >
      <v-container
        fluid
        class="py-0"
      >
        <slot name="left" />
      </v-container>
    </v-col>

    <v-col
      cols="12"
      md="6"
    >
      <v-infinite-scroll
        height="100%"
        @load="load"
        empty-text="No more result"
        style="overflow-y: hidden"
        class="px-2"
      >
        <slot name="center" />
      </v-infinite-scroll>
    </v-col>

    <v-col
      cols="3"
      v-if="$vuetify.display.mdAndUp"
    >
      <v-container
        fluid
        class="py-0"
      >
        <slot name="right" />
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
export default {
  methods: {
    load (e) {
      this.$emit('load:center', e)
    }
  }
}
</script>
