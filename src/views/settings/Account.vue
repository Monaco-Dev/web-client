<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card
          flat
          rounded
        >
          <v-row>
            <v-col cols="12">
              <UpdateAccount />
            </v-col>

            <v-divider class="mx-10" />

            <v-col cols="12">
              <UpdatePassword />
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12">
        <AccountManagement />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
  import UpdateAccount from '@/components/settings/UpdateAccount.vue'
  import UpdatePassword from '@/components/settings/UpdatePassword.vue'
  import AccountManagement from '@/components/settings/AccountManagement.vue'
</script>
