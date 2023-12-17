<template>
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    max-width="500px"
  >
    <v-form @submit.prevent="submit">
      <v-card
        flat
        rounded
        density="compact"
      >
        <template #prepend>
          <v-avatar>
            <v-img src="https://cdn.vuetifyjs.com/images/lists/1.jpg" />
          </v-avatar>
        </template>

        <template #title>
          <span class="text-body-1">{{ user.full_name }}</span>
        </template>

        <template #append>
          <v-btn
            icon="mdi-close"
            flat
            variant="tonal"
            size="x-small"
            @click="reset"
          />
        </template>

        <v-card-text class="pa-0">
          <v-textarea
            v-model="form.message"
            class="mx-2"
            autofocus
            auto-grow
            hide-details="auto"
            flat
            placeholder="Send invitation message (optional)"
            rows="5"
            variant="solo"
          />
        </v-card-text>

        <v-card-actions class="pa-0 my-2 mx-3">
          <v-btn-primary
            type="submit"
            variant="tonal"
          >
            Send invite
          </v-btn-primary>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
export default {
  name: 'SendInvitationDialog',
  props: {
    user: {
      type: Object,
      default: Object,
      required: true
    }
  },
  data () {
    return {
      dialog: false,
      form: {
        message: null
      }
    }
  },
  watch: {
    'form.message' () {
      delete this.apiErrors.message
    }
  },
  methods: {
    submit () {
      this.$emit('connect', this.form)
      this.reset()
    },
    reset () {
      this.dialog = false
      this.form = {
        message: null
      }
    }
  }
}
</script>
