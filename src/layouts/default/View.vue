<template>
  <v-main class="bg-grey-lighten-4 d-flex align-center justify-center">
    <v-container fluid>
      <div class="mb-5 text-center">
        <v-btn
          height="auto"
          flat
          class="bg-transparent pa-3"
          :ripple="false"
          :hover="false"
          to="/"
        >
          <v-img
            src="@/assets/logo-with-text.png"
            contain
            width="200"
          />
        </v-btn>
      </div>

      <v-row justify="center">
        <v-col md="6">
          <router-view />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
