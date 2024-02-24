<template>
  <v-snackbar
    v-model="bool"
    :timeout="timeout"
    :color="color"
  >
    {{ text }}

    <template #actions>
      <v-btn
        @click="snackbarStore.close()"
        icon="mdi-close"
      />
    </template>
  </v-snackbar>
</template>

<script>
import { computed } from 'vue'
import { useSnackbarStore } from '@/store/snackbar'

export default {
  name: 'AppSnackbar',
  setup () {
    const snackbarStore = useSnackbarStore()

    const snackbar = computed(() => snackbarStore.snackbar)
    const text = computed(() => snackbarStore.text)
    const timeout = computed(() => snackbarStore.timeout)
    const color = computed(() => snackbarStore.color)

    return {
      snackbarStore,
      snackbar,
      text,
      timeout,
      color
    }
  },
  data () {
    return {
      bool: this.snackbar
    }
  },
  watch: {
    snackbar () {
      this.bool = this.snackbar
    },
    bool () {
      this.snackbarStore.snackbar = this.bool
    }
  }
}
</script>
