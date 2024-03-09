<template>
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    max-width="500px"
    :loading="loading"
  >
    <v-form
      @submit.prevent="submit"
      :loading="loading"
    >
      <v-card
        flat
        rounded
        density="compact"
        :loading="loading"
      >
        <template #prepend>
          <v-avatar color="grey">
            <v-img
              v-if="user?.avatar_url"
              :src="user?.avatar_url"
              cover
              :alt="user?.full_name"
            />
            <span
              class="text-white"
              v-else
            >
              {{ user?.first_name?.charAt(0) }}{{ user?.last_name?.charAt(0) }}
            </span>
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
            :disabled="loading"
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
            class="text-none"
            :loading="loading"
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
    },
    loading: {
      type: Boolean,
      default: false,
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
