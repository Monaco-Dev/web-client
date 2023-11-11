<template>
  <v-dialog
    v-model="confirmationDialog"
    persistent
    max-width="500"
    scrollable
  >
    <v-card>
      <v-card-item>
        <v-card-title class="justify-center pt-10">
          {{ title }}
        </v-card-title>
      </v-card-item>

      <v-card-text class="text-center">
        <p
          v-for="(text, index) in content"
          :key="index"
        >
          {{ text }}
        </p>
      </v-card-text>

      <v-card-actions>
        <v-container fluid>
          <v-row>
            <v-col
              cols="6"
              class="text-center"
            >
              <v-btn
                rounded
                block
                @click="closeAndAgree()"
              >
                {{ actionLabel }}
              </v-btn>
            </v-col>

            <v-col
              cols="6"
              class="text-center"
            >
              <v-btn
                rounded
                block
                @click="closeAndDisagree()"
              >
                {{ cancelLabel }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { computed } from 'vue'
import { useDialogStore } from '@/store/dialog'

export default {
  name: 'ConfirmationDialog',
  setup () {
    const dialogStore = useDialogStore()

    const confirmationDialog = computed(() => dialogStore.confirmationDialog)
    const title = computed(() => dialogStore.title)
    const body = computed(() => dialogStore.body)
    const action = computed(() => dialogStore.action)
    const actionLabel = computed(() => dialogStore.actionLabel)
    const cancel = computed(() => dialogStore.cancel)
    const cancelLabel = computed(() => dialogStore.cancelLabel)
    const color = computed(() => dialogStore.color)

    return {
      dialogStore,
      confirmationDialog,
      title,
      body,
      action,
      actionLabel,
      cancel,
      cancelLabel,
      color
    }
  },
  computed: {
    content () {
      return this.body.split('\n')
    }
  },
  methods: {
    /**
     * Hides the dialog and executes the action callback function.
     *
     */
    closeAndAgree () {
      this.dialogStore.closeDialog('confirmationDialog')

      if (this.dialogStore.action) this.dialogStore.action()
    },

    /**
     * Hides the dialog and executes the cancel callback function.
     *
     */
    closeAndDisagree () {
      this.dialogStore.closeDialog('confirmationDialog')

      if (this.dialogStore.cancel) this.dialogStore.cancel()
    }
  }
}
</script>
