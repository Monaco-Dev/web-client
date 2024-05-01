<template>
  <AppGrid>
    <template #center>
      <v-list>
        <v-list-subheader> Contact Me </v-list-subheader>

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

        <v-list-subheader v-if="profile?.socials?.length">
          Socials
        </v-list-subheader>

        <v-list-item
          v-for="(social, key) in profile.socials"
          :key="key"
        >
          <v-list-item-title>
            <a
              :href="social.url"
              target="_blank"
            >
              <v-chip>
                <v-icon
                  :icon="`mdi-${social.provider}`"
                  start
                ></v-icon>
                {{ social.url }}
              </v-chip>
            </a>
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
    name: 'ProfileContact',
    components: { AppGrid },
    setup() {
      const profileStore = useProfileStore()

      const profile = computed(() => profileStore.profile)
      const loading = computed(() => profileStore.loading)

      return {
        profileStore,
        profile,
        loading,
      }
    },
  }
</script>
