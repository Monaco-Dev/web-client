<template>
  <v-app>
    <v-main class="bg-grey-lighten-4 d-flex align-center justify-center">
      <v-container fluid>
        <v-row justify="center">
          <v-col
            cols="1"
            align-self="center"
          >
            <v-img
              src="@/assets/logo-with-text.png"
              contain
              width="100"
            />

            <br>

            <v-progress-linear
              indeterminate
              rounded
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
