<template>
  <v-main class="d-flex align-center justify-center">
    <v-container fluid>
      <div class="mb-3 text-center">
        <v-btn
          flat
          class="bg-transparent"
          :ripple="false"
          :hover="false"
          to="/"
          height="auto"
        >
          <v-img
            src="@/assets/text-logo.png"
            contain
            width="250"
          />
        </v-btn>
      </div>

      <router-view />
    </v-container>
  </v-main>
</template>
