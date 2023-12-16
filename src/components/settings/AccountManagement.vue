<template>
  <div>
    <v-card
      flat
      rounded
    >
      <template #title>
        <span class="text-wrap">
          Deactivating or deleting your Realmate account
        </span>
      </template>

      <template #subtitle>
        <span class="text-wrap">
          If you want to take a break from Realmate, you can temporarily deactivate this account. If you want to permanently delete your account, let us know.
        </span>
      </template>

      <v-card-text>
        <v-list
          lines="two"
          select-strategy="single-leaf"
          v-model:selected="select"
          :mandatory="true"
        >
          <v-list-item value="deactivate">
            <template #prepend="{ isActive }">
              <v-list-item-action start>
                <v-radio :model-value="isActive" />
              </v-list-item-action>
            </template>

            <v-list-item-title>Deactivate account</v-list-item-title>

            <v-list-item-subtitle>
              <strong>Deactivating your account is temporary.</strong> Your Account and profile will be deactivated and your name and posts will be removed from most things you've shared.
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item value="delete">
            <template #prepend="{ isActive }">
              <v-list-item-action start>
                <v-radio :model-value="isActive" />
              </v-list-item-action>
            </template>

            <v-list-item-title>Delete account</v-list-item-title>

            <v-list-item-subtitle>
              <strong>Deleting your account is permanent.</strong> When you delete your Realmate account, you won't be able to retrieve the content or information you've shared on Realmate. Your profile will also be deleted.
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <v-row justify="center">
          <v-col
            cols="12"
            md="3"
          >
            <v-btn-danger
              type="submit"
              :disabled="!select.length"
              @click="$refs.dialog.confirmationDialog=true"
            >
              Continue
            </v-btn-danger>
          </v-col>

          <v-col
            cols="12"
            md="3"
          >
            <v-btn
              block
              variant="tonal"
              @click="select=[]"
              :disabled="!select.length"
            >
              Cancel
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>

    <AccountConfirmationDialog
      :select="select"
      ref="dialog"
      @deactivate="logout"
      @delete="logout"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import AccountConfirmationDialog from '@/components/settings/AccountConfirmationDialog.vue'
import AuthService from '@/composables/auth'

export default {
  components: { AccountConfirmationDialog },
  setup () {
    return { dialog: ref(null) }
  },
  data () {
    return {
      select: []
    }
  },
  methods: {
    logout () {
      AuthService.flush()
      this.$router.push({ name: 'Login' }).catch(() => {})
    }
  }
}
</script>
