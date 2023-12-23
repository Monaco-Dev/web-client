<template>
  <AppGrid>
    <template #center>
      <v-list>
        <v-list-item>
          <template #prepend>
            <v-icon
              icon="mdi-email"
              start
              size="small"
            />
          </template>

          <v-list-item-title>
            {{ profile.email ?? 'None' }}
          </v-list-item-title>
        </v-list-item>

        <v-list-item>
          <template #prepend>
            <v-icon
              icon="mdi-phone"
              start
              size="small"
            />
          </template>

          <v-list-item-title>
            {{ profile.phone_number ?? 'None' }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </AppGrid>
</template>

<script>
import { computed } from 'vue'
import { useProfileStore } from '@/store/profile'
import AppGrid from '@/components/default/desktop/AppGrid.vue'

export default {
  name: 'ProfileArchive',
  components: { AppGrid },
  setup () {
    const profileStore = useProfileStore()

    const profile = computed(() => profileStore.profile)
    const loading = computed(() => profileStore.loading)

    return {
      profileStore,
      profile,
      loading
    }
  }
}
</script>
