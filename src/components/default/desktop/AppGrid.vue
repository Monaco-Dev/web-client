<template>
  <v-row :no-gutters="$vuetify.display.smAndDown">
    <v-col
      cols="3"
      v-if="$vuetify.display.mdAndUp"
    >
      <slot name="left" />
    </v-col>

    <v-col
      cols="12"
      md="6"
    >
      <slot name="center" />
    </v-col>

    <v-col
      cols="3"
      v-if="$vuetify.display.mdAndUp"
    >
      <slot name="right" />
    </v-col>
  </v-row>
</template>
